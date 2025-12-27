# -*- coding: utf-8 -*-

from odoo import models, fields, api


class MaintenanceTeam(models.Model):
    """Maintenance Team Model - Organizes technicians into specialized teams"""
    _name = 'maintenance.team'
    _description = 'Maintenance Team'
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _order = 'name'

    name = fields.Char(
        string='Team Name',
        required=True,
        tracking=True,
        help='Name of the maintenance team (e.g., Mechanics, Electricians, IT Support)'
    )
    
    active = fields.Boolean(
        string='Active',
        default=True,
        help='If unchecked, it will allow you to hide the team without removing it.'
    )
    
    color = fields.Integer(
        string='Color Index',
        help='Color index for kanban view'
    )
    
    company_id = fields.Many2one(
        'res.company',
        string='Company',
        required=True,
        default=lambda self: self.env.company,
        help='Company this team belongs to'
    )
    
    member_ids = fields.Many2many(
        'res.users',
        'maintenance_team_users_rel',
        'team_id',
        'user_id',
        string='Team Members',
        domain=[('share', '=', False)],
        help='Technicians belonging to this team'
    )
    
    team_leader_id = fields.Many2one(
        'res.users',
        string='Team Leader',
        domain=[('share', '=', False)],
        tracking=True,
        help='Leader or manager of this maintenance team'
    )
    
    description = fields.Text(
        string='Description',
        help='Description of the team and its responsibilities'
    )
    
    # Statistics
    equipment_count = fields.Integer(
        string='Equipment Count',
        compute='_compute_equipment_count',
        help='Number of equipment assigned to this team'
    )
    
    request_count = fields.Integer(
        string='Request Count',
        compute='_compute_request_count',
        help='Number of maintenance requests for this team'
    )
    
    open_request_count = fields.Integer(
        string='Open Requests',
        compute='_compute_request_count',
        help='Number of open maintenance requests'
    )

    @api.depends('name')
    def _compute_equipment_count(self):
        """Compute the number of equipment assigned to this team"""
        Equipment = self.env['maintenance.equipment']
        for team in self:
            team.equipment_count = Equipment.search_count([
                ('maintenance_team_id', '=', team.id)
            ])

    @api.depends('name')
    def _compute_request_count(self):
        """Compute the number of maintenance requests for this team"""
        Request = self.env['maintenance.request']
        for team in self:
            team.request_count = Request.search_count([
                ('maintenance_team_id', '=', team.id)
            ])
            team.open_request_count = Request.search_count([
                ('maintenance_team_id', '=', team.id),
                ('stage_id.done', '=', False)
            ])

    def action_view_equipment(self):
        """Open equipment list view for this team"""
        self.ensure_one()
        return {
            'name': f'Equipment - {self.name}',
            'type': 'ir.actions.act_window',
            'res_model': 'maintenance.equipment',
            'view_mode': 'tree,form',
            'domain': [('maintenance_team_id', '=', self.id)],
            'context': {'default_maintenance_team_id': self.id},
        }

    def action_view_requests(self):
        """Open maintenance requests list view for this team"""
        self.ensure_one()
        return {
            'name': f'Maintenance Requests - {self.name}',
            'type': 'ir.actions.act_window',
            'res_model': 'maintenance.request',
            'view_mode': 'kanban,tree,form,calendar,pivot,graph',
            'domain': [('maintenance_team_id', '=', self.id)],
            'context': {'default_maintenance_team_id': self.id},
        }

