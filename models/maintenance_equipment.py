# -*- coding: utf-8 -*-

from odoo import models, fields, api
from dateutil.relativedelta import relativedelta


class MaintenanceEquipmentCategory(models.Model):
    """Equipment Category Model - Categorize equipment types"""
    _name = 'maintenance.equipment.category'
    _description = 'Equipment Category'
    _order = 'name'

    name = fields.Char(
        string='Category Name',
        required=True,
        help='Name of the equipment category (e.g., Machines, Vehicles, Computers)'
    )
    
    color = fields.Integer(
        string='Color Index'
    )
    
    note = fields.Text(
        string='Notes',
        help='Additional notes about this category'
    )
    
    equipment_count = fields.Integer(
        string='Equipment Count',
        compute='_compute_equipment_count'
    )

    @api.depends('name')
    def _compute_equipment_count(self):
        """Compute number of equipment in this category"""
        Equipment = self.env['maintenance.equipment']
        for category in self:
            category.equipment_count = Equipment.search_count([
                ('category_id', '=', category.id)
            ])


class MaintenanceEquipment(models.Model):
    """Equipment Model - Central database for all company assets"""
    _name = 'maintenance.equipment'
    _description = 'Maintenance Equipment'
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _order = 'name'

    name = fields.Char(
        string='Equipment Name',
        required=True,
        tracking=True,
        help='Name of the equipment'
    )
    
    active = fields.Boolean(
        string='Active',
        default=True,
        help='If unchecked, it will allow you to hide the equipment without removing it.'
    )
    
    serial_no = fields.Char(
        string='Serial Number',
        copy=False,
        tracking=True,
        help='Unique serial number of the equipment'
    )
    
    model = fields.Char(
        string='Model',
        help='Model name/number of the equipment'
    )
    
    category_id = fields.Many2one(
        'maintenance.equipment.category',
        string='Equipment Category',
        tracking=True,
        help='Category of this equipment (e.g., Machines, Vehicles, Computers)'
    )
    
    color = fields.Integer(
        string='Color Index'
    )
    
    # Ownership
    company_id = fields.Many2one(
        'res.company',
        string='Company',
        required=True,
        default=lambda self: self.env.company
    )
    
    department_id = fields.Many2one(
        'hr.department',
        string='Department',
        tracking=True,
        help='Department that owns this equipment'
    )
    
    employee_id = fields.Many2one(
        'hr.employee',
        string='Assigned Employee',
        tracking=True,
        help='Employee responsible for or using this equipment'
    )
    
    owner_user_id = fields.Many2one(
        'res.users',
        string='Owner',
        tracking=True,
        help='User who owns this equipment'
    )
    
    # Purchase & Warranty
    purchase_date = fields.Date(
        string='Purchase Date',
        help='Date when the equipment was purchased'
    )
    
    purchase_value = fields.Float(
        string='Purchase Value',
        help='Purchase price of the equipment'
    )
    
    warranty_date = fields.Date(
        string='Warranty Expiration Date',
        help='Date when the warranty expires'
    )
    
    warranty_period = fields.Integer(
        string='Warranty Period (Months)',
        help='Warranty period in months'
    )

    is_warranty_valid = fields.Boolean(
        string='Warranty Valid',
        compute='_compute_warranty_valid',
        store=True,
        help='Indicates if equipment is still under warranty'
    )

    # Location
    location = fields.Char(
        string='Location',
        tracking=True,
        help='Physical location of the equipment'
    )

    # Maintenance Assignment
    maintenance_team_id = fields.Many2one(
        'maintenance.team',
        string='Maintenance Team',
        tracking=True,
        help='Team responsible for maintaining this equipment'
    )

    technician_user_id = fields.Many2one(
        'res.users',
        string='Technician',
        tracking=True,
        domain="[('id', 'in', team_member_ids)]",
        help='Default technician assigned to this equipment'
    )

    team_member_ids = fields.Many2many(
        related='maintenance_team_id.member_ids',
        string='Team Members',
        help='Members of the assigned maintenance team'
    )

    # Technical Details
    note = fields.Html(
        string='Notes',
        help='Additional notes and technical details'
    )

    image = fields.Binary(
        string='Image',
        attachment=True
    )

    # Status
    is_scrap = fields.Boolean(
        string='Scrapped',
        default=False,
        tracking=True,
        help='If checked, indicates this equipment has been scrapped and is no longer usable'
    )

    scrap_date = fields.Date(
        string='Scrap Date',
        help='Date when the equipment was scrapped'
    )

    # Maintenance Statistics
    maintenance_count = fields.Integer(
        string='Maintenance Count',
        compute='_compute_maintenance_count',
        help='Total number of maintenance requests for this equipment'
    )

    maintenance_open_count = fields.Integer(
        string='Open Maintenance',
        compute='_compute_maintenance_count',
        help='Number of open maintenance requests'
    )

    next_maintenance_date = fields.Date(
        string='Next Maintenance',
        compute='_compute_next_maintenance',
        help='Date of the next scheduled maintenance'
    )

    @api.depends('warranty_date')
    def _compute_warranty_valid(self):
        """Check if warranty is still valid"""
        today = fields.Date.today()
        for equipment in self:
            if equipment.warranty_date:
                equipment.is_warranty_valid = equipment.warranty_date >= today
            else:
                equipment.is_warranty_valid = False

    @api.onchange('purchase_date', 'warranty_period')
    def _onchange_warranty_period(self):
        """Calculate warranty date from purchase date and warranty period"""
        if self.purchase_date and self.warranty_period:
            self.warranty_date = self.purchase_date + relativedelta(months=self.warranty_period)

    def _compute_maintenance_count(self):
        """Compute maintenance request counts"""
        Request = self.env['maintenance.request']
        for equipment in self:
            equipment.maintenance_count = Request.search_count([
                ('equipment_id', '=', equipment.id)
            ])
            equipment.maintenance_open_count = Request.search_count([
                ('equipment_id', '=', equipment.id),
                ('stage_id.done', '=', False)
            ])

    def _compute_next_maintenance(self):
        """Compute the next scheduled maintenance date"""
        Request = self.env['maintenance.request']
        today = fields.Date.today()
        for equipment in self:
            next_request = Request.search([
                ('equipment_id', '=', equipment.id),
                ('schedule_date', '>=', today),
                ('stage_id.done', '=', False)
            ], order='schedule_date asc', limit=1)
            equipment.next_maintenance_date = next_request.schedule_date if next_request else False

    def action_view_maintenance_requests(self):
        """Open maintenance requests for this equipment - Smart Button"""
        self.ensure_one()
        return {
            'name': f'Maintenance - {self.name}',
            'type': 'ir.actions.act_window',
            'res_model': 'maintenance.request',
            'view_mode': 'kanban,tree,form,calendar',
            'domain': [('equipment_id', '=', self.id)],
            'context': {
                'default_equipment_id': self.id,
                'default_maintenance_team_id': self.maintenance_team_id.id,
                'default_technician_id': self.technician_user_id.id,
            },
        }

    def action_set_scrap(self):
        """Mark equipment as scrapped"""
        self.ensure_one()
        self.write({
            'is_scrap': True,
            'scrap_date': fields.Date.today(),
            'active': False,
        })
        # Log a note
        self.message_post(
            body=f"Equipment '{self.name}' has been marked as scrapped and is no longer usable.",
            subject="Equipment Scrapped"
        )

