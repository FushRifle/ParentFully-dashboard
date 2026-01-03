export interface Ticket {
     id: number;
     user: string;
     issue: string;
     status: 'urgent' | 'open' | 'closed' | 'pending';
     time: string;
     avatar?: string;
     tags?: string[];
     priority?: 'high' | 'medium' | 'low';
}

export interface ChatMessage {
     id: number;
     message: string;
     sender: 'user' | 'support';
     time: string;
     isRead?: boolean;
}

export interface User {
     name: string;
     avatar: string;
     status: 'online' | 'away' | 'offline';
     membership: 'premium' | 'basic' | 'enterprise';
     email: string;
}

// Mock data
export const tickets: Ticket[] = [
     {
          id: 1,
          user: 'Jane Doe',
          issue: 'Payment Failed',
          status: 'urgent',
          time: '2m ago',
          avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
          tags: ['Payment', 'Billing'],
          priority: 'high'
     },
     {
          id: 2,
          user: 'Mark Smith',
          issue: 'App Crashing on iOS',
          status: 'open',
          time: '1h ago',
          avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
          tags: ['iOS', 'Bug'],
          priority: 'medium'
     },
     {
          id: 3,
          user: 'Sarah Lee',
          issue: 'Credit Adjustment',
          status: 'closed',
          time: 'Yesterday',
          avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
          tags: ['Account'],
          priority: 'low'
     },
     {
          id: 4,
          user: 'Alex Johnson',
          issue: 'Feature Request - Dark Mode',
          status: 'open',
          time: '3h ago',
          avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704g',
          tags: ['Feature', 'UI/UX'],
          priority: 'medium'
     },
];

export const chatMessages: ChatMessage[] = [
     {
          id: 1,
          message: "Hi Support! I tried to upgrade to the Premium Family plan but my payment was declined twice. Can you help?",
          sender: 'user',
          time: '10:05 AM',
          isRead: true
     },
     {
          id: 2,
          message: "Hello Jane! I'm sorry to hear that. I can see the failed attempts in our system. Let me check the balance adjustment for you.",
          sender: 'support',
          time: '10:07 AM',
          isRead: true
     },
     {
          id: 3,
          message: "I've checked with our payment processor. It appears there was a temporary hold due to suspicious activity. Can you try again now?",
          sender: 'support',
          time: '10:15 AM',
          isRead: true
     },
     {
          id: 4,
          message: "Thanks! I'll try again right away.",
          sender: 'user',
          time: '10:20 AM',
          isRead: false
     }
];

export const currentUser: User = {
     name: 'Jane Doe',
     avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
     status: 'online',
     membership: 'premium',
     email: 'jane.doe@example.com'
};

export const supportAgent = {
     name: 'Alex Support',
     avatar: 'https://i.pravatar.cc/150?u=support',
     role: 'Senior Support Specialist'
};