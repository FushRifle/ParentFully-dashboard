import React from 'react';
import { Card, Text, Badge } from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { Box } from '../styles/box';
import { ServiceStatus } from './data';
import { StatusBadge } from './status-badge';

interface ServiceStatusCardProps {
     service: ServiceStatus;
     compact?: boolean;
}

export const ServiceStatusCard: React.FC<ServiceStatusCardProps> = ({
     service,
     compact = false
}) => {
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
                              <Flex direction="column" css={{ gap: compact ? '$1' : '$2' }}>
                                   <Text b size={compact ? '$sm' : '$md'}>
                                        {service.name}
                                   </Text>
                                   <StatusBadge status={service.status} size={compact ? 'sm' : 'md'} />
                              </Flex>

                              {!compact && service.lastIncident && (
                                   <Badge size="sm" variant="flat" color="warning">
                                        Last: {service.lastIncident}
                                   </Badge>
                              )}
                         </Flex>

                         <Flex direction="column" css={{ gap: compact ? '$1' : '$2' }}>
                              <Flex justify="between">
                                   <Text size="$xs" color="$accents7">Uptime</Text>
                                   <Text size="$sm" css={{ fontWeight: 500 }}>
                                        {service.uptime}
                                   </Text>
                              </Flex>

                              <Flex justify="between">
                                   <Text size="$xs" color="$accents7">Response Time</Text>
                                   <Text size="$sm" css={{ fontWeight: 500 }}>
                                        {service.responseTime}ms
                                   </Text>
                              </Flex>
                         </Flex>

                         {!compact && service.dependencies && service.dependencies.length > 0 && (
                              <Box css={{ pt: '$2', borderTop: '1px solid $border' }}>
                                   <Text size="$xs" color="$accents7" css={{ mb: '$1' }}>
                                        Dependencies
                                   </Text>
                                   <Flex wrap="wrap" css={{ gap: '$1' }}>
                                        {service.dependencies.map((dep, index) => (
                                             <Badge key={index} size="xs" variant="flat" color="default">
                                                  {dep}
                                             </Badge>
                                        ))}
                                   </Flex>
                              </Box>
                         )}
                    </Flex>
               </Card.Body>
          </Card>
     );
};