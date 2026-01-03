import React from 'react';
import { Card, Text, Checkbox } from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { Box } from '../styles/box';
import { expertiseCategories } from './data';

interface ExpertiseFilterProps {
     selectedExpertise: string[];
     onChange: (expertise: string[]) => void;
}

export const ExpertiseFilter: React.FC<ExpertiseFilterProps> = ({
     selectedExpertise,
     onChange
}) => {
     const handleToggle = (expertiseId: string) => {
          const newSelection = selectedExpertise.includes(expertiseId)
               ? selectedExpertise.filter(id => id !== expertiseId)
               : [...selectedExpertise, expertiseId];
          onChange(newSelection);
     };

     return (
          <Card css={{ p: '$6' }} variant="flat">
               <Card.Body>
                    <Flex direction="column" css={{ gap: '$6' }}>
                         <Text h4>Areas of Expertise</Text>

                         <Flex direction="column" css={{ gap: '$3' }}>
                              {expertiseCategories.map((category) => (
                                   <Checkbox
                                        key={category.id}
                                        isSelected={selectedExpertise.includes(category.id)}
                                        onChange={() => handleToggle(category.id)}
                                        size="sm"
                                        css={{ alignItems: 'center', py: '$1' }}
                                   >
                                        <Flex align="center" css={{ gap: '$3' }}>
                                             <Text size="$sm">{category.name}</Text>
                                        </Flex>
                                   </Checkbox>
                              ))}
                         </Flex>
                    </Flex>
               </Card.Body>
          </Card>
     );
};