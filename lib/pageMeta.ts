export const pageMeta = {
   '/overview': { title: 'Overview', subtitle: 'Platform health at a glance' },
   '/admin-users': { title: 'Admin Users', subtitle: 'Manage internal dashboard access' },
   '/customers': { title: 'Customers', subtitle: 'Manage app users, families & children' },
   '/families': { title: 'Families', subtitle: 'Manage family owners, members & children' },
   '/goal-categories': { title: 'Goal Categories', subtitle: 'Manage system goal categories' },
   '/routines': { title: 'Routines & Tasks', subtitle: 'All routines and their tasks' },
   '/discipline-plans': { title: 'Discipline Plans', subtitle: 'System discipline plan templates' },
   '/subscriptions': { title: 'Subscriptions', subtitle: 'Manage billing plans and manual overrides' },
   '/rewards': { title: 'Rewards', subtitle: 'User reward history and claims' },
   '/referrals': { title: 'Referrals', subtitle: 'Parent Points reward claims and fulfilment' },
   '/affiliates': { title: 'Affiliates', subtitle: 'Applications, partners, commissions and payouts' },
   '/feedback': { title: 'Feedback', subtitle: 'User feedback submissions' },
   '/analytics': { title: 'Analytics', subtitle: 'App usage insights' },
   '/faqs': { title: 'FAQs', subtitle: 'Manage frequently asked questions' },
   '/settings': { title: 'Settings', subtitle: 'Platform configuration' },
   '/profile': { title: 'Profile', subtitle: 'Your admin account' },
} as const;

export type PagePath = keyof typeof pageMeta;

const legacyRouteMap: Record<string, PagePath> = {
   '/': '/overview',
   '/dashboard': '/overview',
   '/accounts': '/customers',
   '/teams': '/admin-users',
   '/goals': '/goal-categories',
   '/disciplinex': '/discipline-plans',
   '/payments': '/subscriptions',
   '/feedbacks': '/feedback',
};

export const getPageMeta = (pathname: string) => {
   const normalizedPath = `/${pathname.split('/').filter(Boolean)[0] ?? ''}`;
   const resolvedPath = legacyRouteMap[normalizedPath] ?? normalizedPath;

   return pageMeta[resolvedPath as PagePath] ?? pageMeta['/overview'];
};
