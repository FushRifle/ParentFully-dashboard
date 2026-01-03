import { Card, Text, Spacer } from '@nextui-org/react';
import { Flex } from '../styles/flex';

export const Toast = ({ message, visible }) => {
     if (!visible) return null;
     return (
          <Card
         css= {{
          position: 'fixed',
               top: '20px',
                    right: '20px',
                         zIndex: 10000,
                              width: '300px',
                                   bg: '$green600',
                                        boxShadow: '$lg',
         }
}
      >
     <Card.Body css={ { py: '$4' } }>
          <Flex align={ 'center' }>
               <Spacer x={ 0.5 } />
                    < Text css = {{ color: 'white' }} weight = { 'medium'} >
                         { message }
                         < /Text>
                         < /Flex>
                         < /Card.Body>
                         < /Card>
   );
};