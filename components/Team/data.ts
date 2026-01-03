export type Role = 'admin' | 'editor' | 'viewer' | 'support' | 'billing';
export type Status = 'active' | 'inactive' | 'pending';

export interface TeamMember {
     id: string;
     name: string;
     email: string;
     avatar: string;
     role: Role;
     status: Status;
     joinDate: string;
     lastActive: string;
     permissions: string[];
     department?: string;
     phone?: string;
}

export interface Permission {
     id: string;
     name: string;
     description: string;
     category: 'team' | 'billing' | 'content' | 'analytics' | 'settings';
     enabled: boolean;
}

export interface RolePreset {
     id: Role;
     name: string;
     description: string;
     permissions: string[];
     memberCount: number;
     color: string;
}

export interface Invitation {
     id: string;
     email: string;
     role: Role;
     status: 'pending' | 'accepted' | 'expired';
     sentDate: string;
     expiresIn: string;
     invitedBy: string;
}

// Mock Data
export const teamMembers: TeamMember[] = [
     {
          id: '1',
          name: 'Alex Johnson',
          email: 'alex.johnson@company.com',
          avatar: 'https://i.pravatar.cc/150?u=alex',
          role: 'admin',
          status: 'active',
          joinDate: '2023-01-15',
          lastActive: '2 hours ago',
          permissions: ['full_access', 'team_management', 'billing'],
          department: 'Engineering',
          phone: '+1 (555) 123-4567'
     },
     {
          id: '2',
          name: 'Sarah Miller',
          email: 'sarah.m@company.com',
          avatar: 'https://i.pravatar.cc/150?u=sarah',
          role: 'editor',
          status: 'active',
          joinDate: '2023-03-22',
          lastActive: '1 day ago',
          permissions: ['content_edit', 'analytics_view'],
          department: 'Marketing',
          phone: '+1 (555) 234-5678'
     },
     {
          id: '3',
          name: 'Michael Chen',
          email: 'michael.c@company.com',
          avatar: 'https://i.pravatar.cc/150?u=michael',
          role: 'viewer',
          status: 'active',
          joinDate: '2023-05-10',
          lastActive: '3 days ago',
          permissions: ['analytics_view'],
          department: 'Sales',
          phone: '+1 (555) 345-6789'
     },
     {
          id: '4',
          name: 'Emily Wilson',
          email: 'emily.w@company.com',
          avatar: 'https://i.pravatar.cc/150?u=emily',
          role: 'support',
          status: 'inactive',
          joinDate: '2023-02-28',
          lastActive: '2 weeks ago',
          permissions: ['ticket_management', 'user_support'],
          department: 'Customer Support'
     },
     {
          id: '5',
          name: 'David Brown',
          email: 'david.b@company.com',
          avatar: 'https://i.pravatar.cc/150?u=david',
          role: 'billing',
          status: 'pending',
          joinDate: '2023-06-05',
          lastActive: 'Just now',
          permissions: ['billing_management'],
          department: 'Finance'
     },
     {
          id: '6',
          name: 'Jessica Taylor',
          email: 'jessica.t@company.com',
          avatar: 'https://i.pravatar.cc/150?u=jessica',
          role: 'editor',
          status: 'active',
          joinDate: '2023-04-18',
          lastActive: '5 hours ago',
          permissions: ['content_edit', 'media_upload'],
          department: 'Content'
     },
     {
          id: '7',
          name: 'Robert Garcia',
          email: 'robert.g@company.com',
          avatar: 'https://i.pravatar.cc/150?u=robert',
          role: 'admin',
          status: 'active',
          joinDate: '2022-11-30',
          lastActive: '1 hour ago',
          permissions: ['full_access', 'system_settings'],
          department: 'IT',
          phone: '+1 (555) 456-7890'
     },
     {
          id: '8',
          name: 'Lisa Anderson',
          email: 'lisa.a@company.com',
          avatar: 'https://i.pravatar.cc/150?u=lisa',
          role: 'viewer',
          status: 'inactive',
          joinDate: '2023-03-05',
          lastActive: '1 month ago',
          permissions: ['dashboard_view'],
          department: 'HR'
     }
];

export const rolePresets: RolePreset[] = [
     {
          id: 'admin',
          name: 'Administrator',
          description: 'Full access to all features and settings',
          permissions: ['full_access', 'team_management', 'billing', 'system_settings'],
          memberCount: 2,
          color: '#3f3bef'
     },
     {
          id: 'editor',
          name: 'Editor',
          description: 'Can create and edit content, but cannot manage team members',
          permissions: ['content_edit', 'media_upload', 'analytics_view'],
          memberCount: 2,
          color: '#10b981'
     },
     {
          id: 'viewer',
          name: 'Viewer',
          description: 'Can view content and analytics, but cannot make changes',
          permissions: ['dashboard_view', 'analytics_view'],
          memberCount: 2,
          color: '#f59e0b'
     },
     {
          id: 'support',
          name: 'Support Agent',
          description: 'Can manage support tickets and user inquiries',
          permissions: ['ticket_management', 'user_support'],
          memberCount: 1,
          color: '#8b5cf6'
     },
     {
          id: 'billing',
          name: 'Billing Manager',
          description: 'Can manage billing and subscription settings',
          permissions: ['billing_management', 'invoice_view'],
          memberCount: 1,
          color: '#ef4444'
     }
];

export const permissions: Permission[] = [
     // Team Management
     {
          id: 'full_access',
          name: 'Full Access',
          description: 'Complete control over all features and settings',
          category: 'team',
          enabled: true
     },
     {
          id: 'team_management',
          name: 'Team Management',
          description: 'Invite, remove, and manage team members',
          category: 'team',
          enabled: true
     },
     {
          id: 'role_management',
          name: 'Role Management',
          description: 'Create and modify roles and permissions',
          category: 'team',
          enabled: true
     },

     // Content
     {
          id: 'content_edit',
          name: 'Content Editing',
          description: 'Create, edit, and delete content',
          category: 'content',
          enabled: true
     },
     {
          id: 'media_upload',
          name: 'Media Upload',
          description: 'Upload and manage media files',
          category: 'content',
          enabled: true
     },
     {
          id: 'content_publish',
          name: 'Content Publishing',
          description: 'Publish and schedule content',
          category: 'content',
          enabled: false
     },

     // Analytics
     {
          id: 'analytics_view',
          name: 'View Analytics',
          description: 'View analytics and reports',
          category: 'analytics',
          enabled: true
     },
     {
          id: 'analytics_export',
          name: 'Export Analytics',
          description: 'Export analytics data',
          category: 'analytics',
          enabled: false
     },

     // Billing
     {
          id: 'billing_management',
          name: 'Billing Management',
          description: 'Manage billing and subscription',
          category: 'billing',
          enabled: true
     },
     {
          id: 'invoice_view',
          name: 'View Invoices',
          description: 'View and download invoices',
          category: 'billing',
          enabled: true
     },
     {
          id: 'payment_methods',
          name: 'Manage Payment Methods',
          description: 'Add or remove payment methods',
          category: 'billing',
          enabled: false
     },

     // Settings
     {
          id: 'system_settings',
          name: 'System Settings',
          description: 'Modify system settings and configurations',
          category: 'settings',
          enabled: true
     },
     {
          id: 'api_access',
          name: 'API Access',
          description: 'Access and manage API keys',
          category: 'settings',
          enabled: false
     },

     // Support
     {
          id: 'ticket_management',
          name: 'Ticket Management',
          description: 'Manage support tickets',
          category: 'team',
          enabled: true
     },
     {
          id: 'user_support',
          name: 'User Support',
          description: 'Access user support features',
          category: 'team',
          enabled: true
     }
];

export const invitations: Invitation[] = [
     {
          id: 'inv1',
          email: 'new.member@company.com',
          role: 'editor',
          status: 'pending',
          sentDate: '2023-10-01',
          expiresIn: '7 days',
          invitedBy: 'Alex Johnson'
     },
     {
          id: 'inv2',
          email: 'contractor@agency.com',
          role: 'viewer',
          status: 'pending',
          sentDate: '2023-09-28',
          expiresIn: '3 days',
          invitedBy: 'Sarah Miller'
     }
];