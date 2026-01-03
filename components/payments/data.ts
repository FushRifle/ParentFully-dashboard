export const columns = [
     { name: 'USER', uid: 'user' },
     { name: 'AMOUNT', uid: 'amount' },
     { name: 'STATUS', uid: 'status' },
     { name: 'CREDITS', uid: 'credits' },
     { name: 'DATE', uid: 'date' },
];

export const payments = [
     {
          id: 1,
          name: 'Sarah Jenkins',
          email: 'sarah.j@example.com',
          avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
          amount: '$49.00',
          status: 'paid',
          credits: '120 pts',
          date: 'Jan 12, 2026',
     },
     {
          id: 2,
          name: 'Michael Chen',
          email: 'm.chen@example.com',
          avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
          amount: '$12.50',
          status: 'failed',
          credits: '0 pts',
          date: 'Jan 10, 2026',
     },
     {
          id: 3,
          name: 'Emma Wilson',
          email: 'emma.w@parent.com',
          avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
          amount: '$99.00',
          status: 'outstanding',
          credits: '450 pts',
          date: 'Jan 08, 2026',
     },
];