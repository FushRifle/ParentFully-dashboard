import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TopContent } from './data';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { TableExport } from '@/components/shared/table-export';

interface ActivityTableProps {
     data: TopContent[];
     title?: string;
     limit?: number;
}

export const ActivityTable: React.FC<ActivityTableProps> = ({ data, title, limit = 5 }) => {
     const displayedData = data.slice(0, limit);

     const getChangeIcon = (change: number) => {
          if (change > 0) return <TrendingUp size={14} color="#10b981" />;
          if (change < 0) return <TrendingDown size={14} color="#ef4444" />;
          return <Minus size={14} color="#6b7280" />;
     };

     const getChangeVariant = (change: number): 'default' | 'secondary' | 'destructive' | 'outline' => {
          if (change > 0) return 'default';
          if (change < 0) return 'destructive';
          return 'secondary';
     };

     return (
          <Card className="p-6">
               {title && (
                    <CardHeader className="flex flex-row items-center justify-between p-0 pb-4">
                         <h4 className="text-lg font-semibold">{title}</h4>
                         <TableExport
                              rows={displayedData}
                              filename={title || 'activity'}
                              title={title || 'Activity report'}
                              columns={[
                                   { key: 'title', label: 'Content' },
                                   { key: 'views', label: 'Views' },
                                   { key: 'engagement', label: 'Engagement' },
                                   { key: 'change', label: 'Change' },
                              ]}
                         />
                    </CardHeader>
               )}
               <CardContent className="p-0">
                    <Table>
                         <TableHeader>
                              <TableRow>
                                   <TableHead>CONTENT</TableHead>
                                   <TableHead>VIEWS</TableHead>
                                   <TableHead>ENGAGEMENT</TableHead>
                                   <TableHead>CHANGE</TableHead>
                              </TableRow>
                         </TableHeader>
                         <TableBody>
                              {displayedData.map((item) => (
                                   <TableRow key={item.id}>
                                        <TableCell className="font-semibold text-sm">{item.title}</TableCell>
                                        <TableCell className="text-sm">{item.views.toLocaleString()}</TableCell>
                                        <TableCell>
                                             <div className="flex items-center gap-2">
                                                  <div className="h-1 w-[60px] overflow-hidden rounded-full bg-muted">
                                                       <div
                                                            className="h-full rounded-full"
                                                            style={{
                                                                 width: `${item.engagement}%`,
                                                                 backgroundColor:
                                                                      item.engagement > 70
                                                                           ? '#10b981'
                                                                           : item.engagement > 50
                                                                                ? '#f59e0b'
                                                                                : '#ef4444',
                                                            }}
                                                       />
                                                  </div>
                                                  <span className="text-xs text-muted-foreground">{item.engagement}%</span>
                                             </div>
                                        </TableCell>
                                        <TableCell>
                                             <Badge variant={getChangeVariant(item.change)} className="gap-1">
                                                  {getChangeIcon(item.change)}
                                                  <span className="text-xs">
                                                       {item.change > 0 ? '+' : ''}
                                                       {item.change}%
                                                  </span>
                                             </Badge>
                                        </TableCell>
                                   </TableRow>
                              ))}
                         </TableBody>
                    </Table>
               </CardContent>
          </Card>
     );
};