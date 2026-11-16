import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function FilterSelect({ value, onChange, children }: {
   value: string;
   onChange: (event: { target: { value: string } }) => void;
   children: React.ReactNode;
}) {
   const options = React.Children.toArray(children).filter(React.isValidElement) as React.ReactElement<{ value: string; children: React.ReactNode }>[];
   return (
      <Select value={value} onValueChange={(next) => { if (next !== null) onChange({ target: { value: next } }); }}>
         <SelectTrigger className="h-[38px] w-full min-w-0 rounded-[9px] text-xs normal-case tracking-normal">
            <SelectValue>{options.find((option) => option.props.value === value)?.props.children}</SelectValue>
         </SelectTrigger>
         <SelectContent align="start" alignItemWithTrigger={false}>
            {options.map((option) => <SelectItem key={option.props.value} value={option.props.value}>{option.props.children}</SelectItem>)}
         </SelectContent>
      </Select>
   );
}
