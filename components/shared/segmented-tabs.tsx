import React from 'react';

export type SegmentedTabsOption<T extends string> = {
     value: T;
     label: React.ReactNode;
};

export type SegmentedTabsProps<T extends string> = {
     tabs: ReadonlyArray<SegmentedTabsOption<T>> | ReadonlyArray<T>;
     value: T;
     onChange: (value: T) => void;
     ariaLabel?: string;
     className?: string;
};

const normalizeOption = <T extends string>(
     option: SegmentedTabsOption<T> | T,
): SegmentedTabsOption<T> =>
     typeof option === 'string' ? { value: option, label: option } : option;

export const SegmentedTabs = <T extends string>({
     tabs,
     value,
     onChange,
     ariaLabel,
     className = '',
}: SegmentedTabsProps<T>) => {
     const options = tabs.map(normalizeOption);
     return (
          <div
               className={`segmented-tabs ${className}`.trim()}
               role="tablist"
               aria-label={ariaLabel}
          >
               {options.map((option) => {
                    const active = option.value === value;
                    return (
                         <button
                              key={option.value}
                              type="button"
                              role="tab"
                              aria-selected={active}
                              className={`segmented-tabs-item${active ? ' active' : ''}`}
                              onClick={() => onChange(option.value as any)}
                         >
                              {option.label}
                         </button>
                    );
               })}
          </div>
     );
};