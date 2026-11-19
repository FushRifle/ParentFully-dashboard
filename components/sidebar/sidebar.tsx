import React from 'react';
import { useRouter } from 'next/router';
import {
   BadgeHelp,
   BarChart3,
   CircleDollarSign,
   ClipboardList,
   Gift,
   Handshake,
   Home,
   House,
   MessageSquareText,
   Settings,
   ShieldCheck,
   Target,
   UserCircle,
   UsersRound,
   CalendarCheck,
   Menu,
   Headphones,
} from 'lucide-react';
import { ParentfullyIcon } from '@/components/icons/parentfully-icon';
import { SidebarItem } from '@/components/sidebar/sidebar-item';
import { SidebarMenu } from '@/components/sidebar/sidebar-menu';
import { Sidebar } from '@/components/sidebar/sidebar.styles';
import { useSidebarContext } from '@/components/layout/layout-context';

const navSections = [
   {
      title: 'Dashboard',
      items: [{ title: 'Overview', href: '/overview', icon: Home }],
   },
   {
      title: 'Users',
      items: [
         { title: 'Admin Users', href: '/admin-users', icon: ShieldCheck },
         { title: 'Families', href: '/families', icon: House },
      ],
   },
   {
      title: 'App Library',
      items: [
         { title: 'Goal Categories', href: '/goal-categories', icon: Target },
         { title: 'Routines & Tasks', href: '/routines', icon: CalendarCheck },
         { title: 'Discipline Plans', href: '/discipline-plans', icon: ClipboardList },
      ],
   },
   {
      title: 'Revenue & Growth',
      items: [
         { title: 'Subscriptions', href: '/subscriptions', icon: CircleDollarSign },
         // { title: 'Rewards', href: '/rewards', icon: Gift },
         { title: 'Referrals', href: '/referrals', icon: UsersRound },
         { title: 'Affiliates', href: '/affiliates', icon: Handshake },
      ],
   },
   {
      title: 'Insights',
      items: [
         { title: 'Analytics', href: '/platformanalytics', icon: BarChart3 },
         { title: 'Feedbacks', href: '/feedback', icon: MessageSquareText },
         { title: 'Support', href: '/support', icon: Headphones },
         { title: 'FAQs', href: '/faqs', icon: BadgeHelp },
      ],
   },
   {
      title: 'Account',
      items: [
         { title: 'Settings', href: '/settings', icon: Settings },
         { title: 'Profile', href: '/profile', icon: UserCircle },
      ],
   },
] as const;

export const SidebarWrapper = () => {
   const router = useRouter();
   const { collapsed, mobileOpen, setCollapsed } = useSidebarContext();

   const isActive = (href: string) => {
      if (href === '/overview') return ['/', '/dashboard', '/overview'].includes(router.pathname);
      return router.pathname === href || router.pathname.startsWith(`${href}/`);
   };

   const isSectionActive = (section: (typeof navSections)[number]) =>
      section.items.some((item) => isActive(item.href));

   return (
      <aside
         className="relative z-[202] h-full shrink-0 bg-background md:border-r before:pointer-events-none before:absolute before:-right-px before:top-0 before:hidden before:h-[110px] before:w-px before:bg-orange-500/70 md:before:block"
      >
         <style>{`
        .sidebar-body::-webkit-scrollbar { width: 4px; }
        .sidebar-body::-webkit-scrollbar-track { background: transparent; }
        .sidebar-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .sidebar-body::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>

         {mobileOpen && <Sidebar.Overlay onClick={setCollapsed} />}

         {!mobileOpen && (
            <button
               type="button"
               aria-label="Open sidebar"
               onClick={setCollapsed}
               className="sidebar-mobile-trigger fixed left-3.5 top-4 z-[203] flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[rgba(12,12,16,0.86)] text-white backdrop-blur-xl"
            >
               <Menu size={20} />
            </button>
         )}

         <div
            className={`z-[202] flex h-full flex-col bg-background transition-[width,transform] duration-100 ease-out ${mobileOpen ? 'fixed inset-y-0 left-0 w-60 translate-x-0 border-r shadow-md' : 'hidden md:relative md:flex md:translate-x-0'
               } ${collapsed ? 'md:w-[4.75rem]' : 'md:w-[212px]'}`}
         >
            {/* Header */}
            <Sidebar.Header className={`border-b px-3 ${collapsed ? 'py-3.5' : 'py-3.5 pl-[18px]'}`}>
               <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
                  {!collapsed && (
                     <>
                        <span className="shrink-0">
                           <ParentfullyIcon />
                        </span>
                        <span className="flex flex-col leading-tight">
                           <strong className="text-sm font-semibold">ParentFully</strong>
                        </span>
                     </>
                  )}

                  <button
                     type="button"
                     aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                     title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                     onClick={setCollapsed}
                     className={`flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground ${collapsed ? 'mx-auto' : 'ml-auto'}`}
                  >
                     <Menu size={18} />
                  </button>
               </div>

            </Sidebar.Header>

            <div className="flex h-[calc(100%-73px)] min-h-0 flex-col justify-between">
               <Sidebar.Body className="sidebar-body flex-1 overflow-y-auto px-3 py-5">
                  {navSections.map((section) =>
                     section.title === 'Dashboard' ? (
                        <div key={section.title} className="mb-3">
                           {section.items.map((item) => {
                              const Icon = item.icon;
                              return (
                                 <SidebarItem
                                    key={item.href}
                                    title={item.title}
                                    icon={<Icon size={16} strokeWidth={2} />}
                                    href={item.href}
                                    isActive={isActive(item.href)}
                                 />
                              );
                           })}
                        </div>
                     ) : (
                        <SidebarMenu
                           key={section.title}
                           title={section.title}
                           defaultOpen={isSectionActive(section)}
                           compact={collapsed}
                        >
                           {section.items.map((item) => {
                              const Icon = item.icon;
                              return (
                                 <SidebarItem
                                    key={item.href}
                                    title={item.title}
                                    icon={<Icon size={16} strokeWidth={2} />}
                                    href={item.href}
                                    isActive={isActive(item.href)}
                                 />
                              );
                           })}
                        </SidebarMenu>
                     ),
                  )}
               </Sidebar.Body>
            </div>
         </div>
      </aside>
   );
};
