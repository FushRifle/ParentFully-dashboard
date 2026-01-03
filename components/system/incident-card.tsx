import React from 'react';
import { Card, Text, Badge } from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { Box } from '../styles/box';
import { Incident } from './data';
import { AlertCircle, Clock, CheckCircle, Search, Eye } from 'lucide-react';

interface IncidentCardProps {
     incident: Incident;
     compact?: boolean;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({ incident, compact = false }) => {
     const getStatusConfig = () => {
          switch (incident.status) {
               case 'resolved':
                    return { icon: <CheckCircle size={14} />, color: 'success' as const, text: 'Resolved' };
               case 'investigating':
                    return { icon: <Search size={14} />, color: 'error' as const, text: 'Investigating' };
               case 'identified':
                    return { icon: <AlertCircle size={14} />, color: 'warning' as const, text: 'Identified' };
               case 'monitoring':
                    return { icon: <Eye size={14} />, color: 'primary' as const, text: 'Monitoring' };
               default:
                    return { icon: <Clock size={14} />, color: 'default' as const, text: 'Unknown' };
          }
     };

     const getSeverityColor = () => {
          switch (incident.severity) {
               case 'critical': return 'error';
               case 'major': return 'warning';
               case 'minor': return 'primary';
               case 'maintenance': return 'secondary';
               default: return 'default';
          }
     };

     const statusConfig = getStatusConfig();

     return (
          <Card
               css={{
                    p: compact ? '$4' : '$6',
                    height: '100%'
               }}
               variant="flat"
          >
               <Card.Body>
                    <Flex direction="column" css={{ gap: compact ? '$2' : '$4' }}>
                         <Flex justify="between" align="start">
                              <Text b size={compact ? '$sm' : '$md'}>
                                   {incident.title}
                              </Text>
                              <Badge
                                   size="sm"
                                   variant="flat"
                                   color={getSeverityColor()}
                              >
                                   {incident.severity}
                              </Badge>
                         </Flex>

                         <Flex direction="column" css={{ gap: compact ? '$1' : '$2' }}>
                              <Flex align="center" css={{ gap: '$2' }}>
                                   {statusConfig.icon}
                                   <Text size="$sm" css={{ fontWeight: 500 }}>
                                        {statusConfig.text}
                                   </Text>
                              </Flex>

                              <Flex justify="between">
                                   <Text size="$xs" color="$accents7">Started</Text>
                                   <Text size="$sm">{incident.startTime}</Text>
                              </Flex>

                              {incident.endTime && (
                                   <Flex justify="between">
                                        <Text size="$xs" color="$accents7">Resolved</Text>
                                        <Text size="$sm">{incident.endTime}</Text>
                                   </Flex>
                              )}
                         </Flex>

                         {!compact && incident.affectedServices.length > 0 && (
                              <Box>
                                   <Text size="$xs" color="$accents7" css={{ mb: '$1' }}>
                                        Affected Services
                                   </Text>
                                   <Flex wrap="wrap" css={{ gap: '$1' }}>
                                        {incident.affectedServices.map((service, index) => (
                                             <Badge key={index} size="xs" variant="flat" color="default">
                                                  {service}
                                             </Badge>
                                        ))}
                                   </Flex>
                              </Box>
                         )}

                         {!compact && incident.description && (
                              <Text size="$sm" color="$accents7" css={{ mt: '$2' }}>
                                   {incident.description}
                              </Text>
                         )}
                    </Flex>
               </Card.Body>
          </Card>
     );
};