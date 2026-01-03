import React from 'react';
import { Card, Button, Text } from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { Box } from '../styles/box';
import { Search, Filter } from 'lucide-react';
import { Input } from '@nextui-org/react';

interface FilterBarProps {
     searchQuery: string;
     setSearchQuery: (q: string) => void;
     typeFilter: string;
     setTypeFilter: (val: string) => void;
     categoryFilter: string;
     setCategoryFilter: (val: string) => void;
}

export const typeOptions = [
     { label: 'All Types', value: 'all' },
     { label: 'Articles', value: 'article' },
     { label: 'News', value: 'news' },
     { label: 'Discussions', value: 'discussion' },
];

export const categoryOptions = [
     { label: 'All Categories', value: 'all' },
     { label: 'Technical', value: 'technical' },
     { label: 'Updates', value: 'updates' },
     { label: 'Events', value: 'events' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
     searchQuery,
     setSearchQuery,
     typeFilter,
     setTypeFilter,
     categoryFilter,
     setCategoryFilter,
}) => {
     return (
          <Card css={{ p: '$6', mb: '$8' }} variant="flat">
               <Flex css={{ gap: '$6', flexWrap: 'wrap' }}>
                    {/* Search */}
                    <Input
                         placeholder="Search..."
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         contentLeft={<Search size={16} />}
                         css={{ flex: 1, minWidth: 200 }}
                    />

                    {/* Type Filters */}
                    <Flex css={{ gap: '$2', flexWrap: 'wrap' }}>
                         {typeOptions.map((opt) => (
                              <Button
                                   key={opt.value}
                                   auto
                                   size="sm"
                                   color={typeFilter === opt.value ? 'primary' : 'default'}
                                   css={{
                                        borderRadius: '$pill',
                                        bg: typeFilter === opt.value ? '$primary' : '$accents0',
                                        color: typeFilter === opt.value ? '$white' : '$text',
                                   }}
                                   onPress={() => setTypeFilter(opt.value)}
                              >
                                   {opt.label}
                              </Button>
                         ))}
                    </Flex>

                    {/* Category Filters */}
                    <Flex css={{ gap: '$2', flexWrap: 'wrap' }}>
                         {categoryOptions.map((opt) => (
                              <Button
                                   key={opt.value}
                                   auto
                                   size="sm"
                                   color={categoryFilter === opt.value ? 'primary' : 'default'}
                                   css={{
                                        borderRadius: '$pill',
                                        bg: categoryFilter === opt.value ? '$primary' : '$accents0',
                                        color: categoryFilter === opt.value ? '$white' : '$text',
                                   }}
                                   onPress={() => setCategoryFilter(opt.value)}
                              >
                                   {opt.label}
                              </Button>
                         ))}
                    </Flex>

                    {/* More Filters Button */}
                    <Button auto light icon={<Filter size={16} />}>
                         More Filters
                    </Button>

               </Flex>
          </Card>
     )
};
