import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Breadcrumbs, Crumb, CrumbLink } from '@/components/breadcrumb/breadcrumb.styled';
import { DotsIcon } from '@/components/icons/accounts/dots-icon';
import { ExportIcon } from '@/components/icons/accounts/export-icon';
import { InfoIcon } from '@/components/icons/accounts/info-icon';
import { TrashIcon } from '@/components/icons/accounts/trash-icon';
import { HouseIcon } from '@/components/icons/breadcrumb/house-icon';
import { UsersIcon } from '@/components/icons/breadcrumb/users-icon';
import { SettingsIcon } from '@/components/icons/sidebar/settings-icon';
import { TableWrapper } from '@/components/table/table';
import { AddUser } from '@/components/accounts/add-user';
import { Share2Icon } from 'lucide-react';

export const Accounts = () => {
   return (
      <div className="mt-5 flex flex-col justify-center px-6 sm:mt-10 sm:px-16">
         <Breadcrumbs>
            <Crumb>
               <HouseIcon />
               <Link href="/">
                  <CrumbLink href="#">Home</CrumbLink>
               </Link>
               <span>/</span>
            </Crumb>
            <Crumb>
               <UsersIcon />
               <CrumbLink href="#">Users</CrumbLink>
               <span>/</span>
            </Crumb>
            <Crumb>
               <CrumbLink href="#">List</CrumbLink>
            </Crumb>
         </Breadcrumbs>

         <h3 className="text-2xl font-semibold">All Accounts</h3>

         <div className="flex flex-wrap items-center justify-between gap-8">
            <div className="flex flex-wrap items-center gap-6 sm:flex-nowrap">
               <Input
                  className="w-full max-w-[410px]"
                  placeholder="Search users"
               />
               <SettingsIcon />
               <TrashIcon />
               <InfoIcon />
               <DotsIcon />
            </div>
            <div className="flex flex-wrap flex-row gap-6">
               <AddUser />
               <Button>
                  Export to CSV
                  <Share2Icon className="ml-2" />
               </Button>
            </div>
         </div>

         <TableWrapper />
      </div>
   );
};