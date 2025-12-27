# -*- coding: utf-8 -*-
{
    'name': 'GearGuard - Maintenance Tracker',
    'version': '1.0.0',
    'category': 'Maintenance',
    'summary': 'The Ultimate Maintenance Management System',
    'description': """
GearGuard: The Ultimate Maintenance Tracker
============================================

A comprehensive maintenance management system that allows companies to track their 
assets (machines, vehicles, computers) and manage maintenance requests for those assets.

Key Features:
-------------
* Equipment Management - Track all company assets with ownership and technical details
* Maintenance Teams - Organize technicians into specialized teams
* Maintenance Requests - Handle corrective (breakdown) and preventive (routine) maintenance
* Kanban Board - Visual workflow management with drag & drop
* Calendar View - Schedule and track preventive maintenance
* Smart Reports - Pivot and graph views for analytics

Core Philosophy:
----------------
Seamlessly connect Equipment (what is broken), Teams (who fix it), 
and Requests (the work to be done).
    """,
    'author': 'GearGuard Team',
    'website': 'https://www.gearguard.com',
    'license': 'LGPL-3',
    'depends': ['base', 'hr', 'mail'],
    'data': [
        # Security
        'security/gearguard_security.xml',
        'security/ir.model.access.csv',
        # Data
        'data/maintenance_stage_data.xml',
        # Views
        'views/maintenance_team_views.xml',
        'views/maintenance_equipment_views.xml',
        'views/maintenance_request_views.xml',
        'views/maintenance_report_views.xml',
        # Menus
        'views/maintenance_menus.xml',
    ],
    'demo': [],
    'installable': True,
    'application': True,
    'auto_install': False,
    'images': ['static/description/icon.svg'],
}

