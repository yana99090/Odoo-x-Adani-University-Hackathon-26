# -*- coding: utf-8 -*-

from odoo import models, fields, api
from odoo.exceptions import UserError


class MaintenanceRequest(models.Model):
    """Maintenance Request Model - Handles the lifecycle of repair jobs"""
    _name = 'maintenance.request'
    _description = 'Maintenance Request'
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _order = 'priority desc, schedule_date asc, id desc'

    name = fields.Char(
        string='Subject',
        required=True,
        tracking=True,
        help='What is wrong? (e.g., "Leaking Oil", "Screen Not Working")'
    )
    
    active = fields.Boolean(
        string='Active',
        default=True
    )
    
    # Request Type
    request_type = fields.Selection([
        ('corrective', 'Corrective (Breakdown)'),
        ('preventive', 'Preventive (Routine Checkup)')
    ], string='Maintenance Type', default='corrective', required=True, tracking=True,
        help='Corrective: Unplanned repair for breakdown. Preventive: Planned routine maintenance.')
    
    # Priority
    priority = fields.Selection([
        ('0', 'Low'),
        ('1', 'Medium'),
        ('2', 'High'),
        ('3', 'Urgent')
    ], string='Priority', default='1', tracking=True, help='Priority level of this request')
    
    color = fields.Integer(
        string='Color Index'
    )
    
    # Equipment Information
    equipment_id = fields.Many2one(
        'maintenance.equipment',
        string='Equipment',
        required=True,
        tracking=True,
        help='Which equipment/machine is affected?'
    )
    
    category_id = fields.Many2one(
        'maintenance.equipment.category',
        string='Equipment Category',
        related='equipment_id.category_id',
        store=True,
        readonly=True,
        help='Category of the affected equipment'
    )
    
    equipment_serial = fields.Char(
        related='equipment_id.serial_no',
        string='Serial Number',
        readonly=True
    )
    
    # Team Assignment
    maintenance_team_id = fields.Many2one(
        'maintenance.team',
        string='Maintenance Team',
        tracking=True,
        help='Team responsible for this maintenance request'
    )
    
    technician_id = fields.Many2one(
        'res.users',
        string='Assigned Technician',
        tracking=True,
        domain="[('id', 'in', team_member_ids)]",
        help='Technician assigned to handle this request'
    )
    
    team_member_ids = fields.Many2many(
        related='maintenance_team_id.member_ids',
        string='Team Members'
    )
    
    # Requestor Information
    user_id = fields.Many2one(
        'res.users',
        string='Created By',
        default=lambda self: self.env.user,
        readonly=True
    )
    
    company_id = fields.Many2one(
        'res.company',
        string='Company',
        required=True,
        default=lambda self: self.env.company
    )
    
    # Stage / Status
    stage_id = fields.Many2one(
        'maintenance.stage',
        string='Stage',
        tracking=True,
        default=lambda self: self._get_default_stage(),
        group_expand='_read_group_stage_ids',
        help='Current stage of the maintenance request'
    )
    
    kanban_state = fields.Selection([
        ('normal', 'In Progress'),
        ('done', 'Ready'),
        ('blocked', 'Blocked')
    ], string='Kanban State', default='normal', tracking=True)
    
    # Dates and Duration
    request_date = fields.Date(
        string='Request Date',
        default=fields.Date.today,
        required=True,
        help='Date when the request was created'
    )
    
    schedule_date = fields.Datetime(
        string='Scheduled Date',
        tracking=True,
        help='When should the maintenance work happen?'
    )

    close_date = fields.Datetime(
        string='Close Date',
        readonly=True,
        help='Date when the request was completed'
    )

    duration = fields.Float(
        string='Duration (Hours)',
        tracking=True,
        help='How long did the repair/maintenance take?'
    )

    # Overdue Calculation
    is_overdue = fields.Boolean(
        string='Is Overdue',
        compute='_compute_is_overdue',
        store=True,
        help='Indicates if the scheduled maintenance date has passed'
    )

    # Description
    description = fields.Html(
        string='Description',
        help='Detailed description of the issue or maintenance work'
    )

    # Archive / Done status
    archive = fields.Boolean(
        default=False,
        help='Set archive to true to hide the maintenance request.'
    )

    @api.model
    def _get_default_stage(self):
        """Get the default stage (New)"""
        return self.env['maintenance.stage'].search([
            ('sequence', '=', 1)
        ], limit=1) or self.env['maintenance.stage'].search([], limit=1)

    @api.model
    def _read_group_stage_ids(self, stages, domain, order):
        """Read all stages for kanban view - ensures empty stages are shown"""
        return self.env['maintenance.stage'].search([], order=order)

    @api.depends('schedule_date', 'stage_id', 'stage_id.done')
    def _compute_is_overdue(self):
        """Compute if the request is overdue"""
        now = fields.Datetime.now()
        for request in self:
            if request.stage_id.done:
                request.is_overdue = False
            elif request.schedule_date:
                request.is_overdue = request.schedule_date < now
            else:
                request.is_overdue = False

    @api.onchange('equipment_id')
    def _onchange_equipment_id(self):
        """Auto-fill logic: When equipment is selected, fetch team and category"""
        if self.equipment_id:
            self.maintenance_team_id = self.equipment_id.maintenance_team_id
            self.technician_id = self.equipment_id.technician_user_id

    @api.model_create_multi
    def create(self, vals_list):
        """Override create to apply auto-fill logic"""
        for vals in vals_list:
            if vals.get('equipment_id') and not vals.get('maintenance_team_id'):
                equipment = self.env['maintenance.equipment'].browse(vals['equipment_id'])
                vals['maintenance_team_id'] = equipment.maintenance_team_id.id
                if not vals.get('technician_id'):
                    vals['technician_id'] = equipment.technician_user_id.id
        return super().create(vals_list)

    def write(self, vals):
        """Override write to handle stage transitions"""
        # Check if moving to scrap stage
        if vals.get('stage_id'):
            new_stage = self.env['maintenance.stage'].browse(vals['stage_id'])
            if new_stage.is_scrap:
                for request in self:
                    if request.equipment_id:
                        request.equipment_id.action_set_scrap()

            # Set close_date when moving to done stage
            if new_stage.done:
                vals['close_date'] = fields.Datetime.now()

        return super().write(vals)

    def action_assign_to_me(self):
        """Assign the request to the current user"""
        self.ensure_one()
        if self.env.user not in self.maintenance_team_id.member_ids:
            raise UserError("You are not a member of the assigned maintenance team.")
        self.technician_id = self.env.user

    def action_start(self):
        """Move request to In Progress stage"""
        in_progress_stage = self.env['maintenance.stage'].search([
            ('sequence', '=', 2)
        ], limit=1)
        if in_progress_stage:
            self.stage_id = in_progress_stage

    def action_done(self):
        """Move request to Repaired/Done stage"""
        repaired_stage = self.env['maintenance.stage'].search([
            ('done', '=', True),
            ('is_scrap', '=', False)
        ], limit=1)
        if repaired_stage:
            self.stage_id = repaired_stage

    def action_scrap(self):
        """Move request to Scrap stage"""
        scrap_stage = self.env['maintenance.stage'].search([
            ('is_scrap', '=', True)
        ], limit=1)
        if scrap_stage:
            self.stage_id = scrap_stage

