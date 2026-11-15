import React, { useState } from 'react';
import { AcmeIcon } from '@/components/icons/acme-icon';
import { AcmeLogo } from '@/components/icons/acmelogo';
import { ParentfullyIcon } from '@/components/icons/parentfully-icon';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Company {
   name: string;
   location: string;
   logo: React.ReactNode;
}

export const CompaniesDropdown = () => {
   const [company, setCompany] = useState<Company>({
      name: 'ParentFully',
      location: 'Pilandres Solutions Inc.',
      logo: <ParentfullyIcon />,
   });

   return (
      <DropdownMenu>
         <DropdownMenuTrigger className="cursor-pointer rounded-md px-2 py-1 transition-colors hover:bg-muted">
            <div className="flex items-center gap-4">
               {company.logo}
               <div className="text-left">
                  <h3 className="m-0 text-lg font-medium leading-tight text-foreground">{company.name}</h3>
                  <span className="text-xs font-medium text-muted-foreground">{company.location}</span>
               </div>
            </div>
         </DropdownMenuTrigger>

         <DropdownMenuContent align="end" className="w-[340px] border-2">
            <DropdownMenuLabel>Companies</DropdownMenuLabel>
            <DropdownMenuItem
               onClick={() =>
                  setCompany({ name: 'Memora', location: 'San Francisco, CA', logo: <AcmeIcon /> })
               }
               className="flex items-center gap-4 py-2"
            >
               <AcmeIcon />
               <div className="flex flex-col">
                  <span className="font-semibold">Memora</span>
                  <span className="text-xs text-muted-foreground">San Francisco, CA</span>
               </div>
            </DropdownMenuItem>
            <DropdownMenuItem
               onClick={() =>
                  setCompany({ name: 'Whispr', location: 'Austin, Tx', logo: <AcmeLogo /> })
               }
               className="flex items-center gap-4 py-2"
            >
               <AcmeLogo />
               <div className="flex flex-col">
                  <span className="font-semibold">Whispr</span>
                  <span className="text-xs text-muted-foreground">Austin, Tx</span>
               </div>
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
};