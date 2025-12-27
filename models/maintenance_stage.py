# -*- coding: utf-8 -*-

from odoo import models, fields


class MaintenanceStage(models.Model):
    """Maintenance Stage Model - Defines workflow stages for maintenance requests"""
    _name = 'maintenance.stage'
    _description = 'Maintenance Stage'
    _order = 'sequence, id'

    name = fields.Char(
        string='Stage Name',
        required=True,
        translate=True,
        help='Name of the stage (e.g., New, In Progress, Repaired, Scrap)'
    )
    
    sequence = fields.Integer(
        string='Sequence',
        default=10,
        help='Used to order the stages in kanban view'
    )
    
    fold = fields.Boolean(
        string='Folded in Kanban',
        default=False,
        help='If checked, this stage will be folded in the kanban view'
    )
    
    done = fields.Boolean(
        string='Request Done',
        default=False,
        help='If checked, requests in this stage are considered completed'
    )
    
    is_scrap = fields.Boolean(
        string='Scrap Stage',
        default=False,
        help='If checked, moving a request to this stage will mark the equipment as scrapped'
    )
    
    description = fields.Text(
        string='Description',
        help='Description of what this stage represents'
    )

