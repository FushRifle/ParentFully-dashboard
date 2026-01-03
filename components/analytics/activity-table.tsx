import React from 'react';
import { Table, Text, Badge, Card } from '@nextui-org/react';

import { Box } from '../styles/box';
import { Flex } from '../styles/flex';
import { TopContent } from './data';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ActivityTableProps {
     data: TopContent[];
     title?: string;
     limit?: number;
}

export const ActivityTable: React.FC<ActivityTableProps> = ({
     data,
     title,
     limit = 5
}) => {
     const displayedData = data.slice(0, limit);

     const getChangeIcon = (change: number) => {
          if (change > 0) return <TrendingUp size={14} color="#10b981" />;
          if (change < 0) return <TrendingDown size={14} color="#ef4444" />;
          return <Minus size={14} color="#6b7280" />;
     };

     const getChangeColor = (change: number) => {
          if (change > 0) return 'success';
          if (change < 0) return 'error';
          return 'default';
     };

     return (
          <Card css={{ p: '$6' }} variant="flat">
               {title && (
                    <Card.Header>
                         <Text h4>{title}</Text>
                    </Card.Header>
               )}

               <Card.Body>
                    <Table
                         aria-label="Top content table"
                         css={{
                              height: "auto",
                              minWidth: "100%",
                         }}
                    >
                         <Table.Header>
                              <Table.Column>CONTENT</Table.Column>
                              <Table.Column>VIEWS</Table.Column>
                              <Table.Column>ENGAGEMENT</Table.Column>
                              <Table.Column>CHANGE</Table.Column>
                         </Table.Header>
                         <Table.Body>
                              {displayedData.map((item) => (
                                   <Table.Row key={item.id}>
                                        <Table.Cell>
                                             <Text b size="$sm">
                                                  {item.title}
                                             </Text>
                                        </Table.Cell>
                                        <Table.Cell>
                                             <Text size="$sm">{item.views.toLocaleString()}</Text>
                                        </Table.Cell>
                                        <Table.Cell>
                                             <Flex align="center" css={{ gap: '$2' }}>
                                                  <Box
                                                       css={{
                                                            width: '60px',
                                                            height: '4px',
                                                            bg: '$accents2',
                                                            borderRadius: '$pill',
                                                            overflow: 'hidden'
                                                       }}
                                                  >
                                                       <Box
                                                            css={{
                                                                 width: `${item.engagement}%`,
                                                                 height: '100%',
                                                                 bg: item.engagement > 70 ? '$success' :
                                                                      item.engagement > 50 ? '$warning' : '$error',
                                                                 borderRadius: '$pill'
                                                            }}
                                                       />
                                                  </Box>
                                                  <Text size="$xs" color="$accents7">
                                                       {item.engagement}%
                                                  </Text>
                                             </Flex>
                                        </Table.Cell>
                                        <Table.Cell>
                                             <Badge
                                                  size="sm"
                                                  variant="flat"
                                                  color={getChangeColor(item.change)}
                                                  css={{ gap: '$1' }}
                                             >
                                                  {getChangeIcon(item.change)}
                                                  <Text size="$xs">
                                                       {item.change > 0 ? '+' : ''}{item.change}%
                                                  </Text>
                                             </Badge>
                                        </Table.Cell>
                                   </Table.Row>
                              ))}
                         </Table.Body>
                    </Table>
               </Card.Body>
          </Card>
     );
};