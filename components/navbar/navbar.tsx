import React, { useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { MessageSquare, HelpCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { NotificationsDropdown } from '@/components/navbar/notifications-dropdown';
import { UserDropdown } from '@/components/navbar/user-dropdown';
import { DarkModeSwitch } from '@/components/navbar/darkmodeswitch';
import { getPageMeta } from '@/lib/pageMeta';
import { usePageSearch } from '@/lib/context/searchContext';

interface Props {
   children: React.ReactNode;
}

export const NavbarWrapper = ({ children }: Props) => {
   const router = useRouter();
   const { search, setSearch } = usePageSearch();
   const meta = getPageMeta(router.pathname);

   useEffect(() => {
      const focusQuickSearch = (event: KeyboardEvent) => {
         if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
            event.preventDefault();
            document.querySelector<HTMLInputElement>('[aria-label="Search current page"]')?.focus();
         }
      };
      window.addEventListener('keydown', focusQuickSearch);
      return () => window.removeEventListener('keydown', focusQuickSearch);
   }, []);

   return (
      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
         <nav className="relative z-40 flex h-[70px] shrink-0 items-center gap-5 border-b border-border/70 bg-background/85 px-4 backdrop-blur-xl sm:gap-8 sm:px-6">
            {/* Left: Title */}
            <div className="flex min-w-0 shrink-0 items-center gap-4 sm:min-w-[220px]">
               <div>
                  <h4 className="m-0 text-base font-semibold leading-tight text-foreground">{meta.title}</h4>
                  <p className="hidden text-xs text-muted-foreground sm:block">{meta.subtitle}</p>
               </div>
            </div>

            {/* Search */}
            <div className="hidden flex-1 sm:block">
               <div className="relative w-full max-w-[420px]">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                     placeholder={`Search ${meta.title.toLowerCase()}... (Cmd + K)`}
                     aria-label="Search current page"
                     value={search}
                     onChange={(event) => setSearch(event.target.value)}
                     className="h-10 w-full rounded-full border bg-muted/50 pl-10 pr-4"
                  />
               </div>
            </div>

            {/* Right actions */}
            <div className="ml-auto flex shrink-0 items-center gap-4 pl-1 sm:gap-7 sm:pl-4">
               <DarkModeSwitch />

               <NextLink
                  href="/feedback"
                  className="hidden items-center gap-3 opacity-80 transition-opacity hover:opacity-100 md:flex"
               >
                  <MessageSquare size={16} className="text-foreground" />
                  <span className="text-xs font-semibold text-foreground">Feedback</span>
               </NextLink>

               <NotificationsDropdown />

               <NextLink
                  href="#"
                  className="hidden cursor-pointer items-center opacity-80 transition-opacity hover:opacity-100 md:flex"
               >
                  <HelpCircle size={18} className="text-foreground" />
               </NextLink>

               <UserDropdown />
            </div>
         </nav>

         <main className="admin-canvas min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
            {children}
         </main>
      </div>
   );
};
