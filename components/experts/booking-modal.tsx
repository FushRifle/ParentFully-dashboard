import React, { useState } from 'react';
import { Modal, Text, Button, Input, Card, Divider } from '@nextui-org/react';


import { Select } from '../styles/select';
import { Flex } from '../styles/flex';
import { Box } from '../styles/box';
import { Expert, ConsultationType, AvailabilitySlot } from './data';
import { Calendar as CalendarIcon, Clock, Video, Phone, MapPin } from 'lucide-react';

interface BookingModalProps {
     open: boolean;
     onClose: () => void;
     expert: Expert;
     consultationTypes: ConsultationType[];
     onBookConsultation?: (expertId: string, data: BookingData) => void;
}

interface BookingData {
     consultationType: string;
     date: string;
     time: string;
     duration: number;
     price: number;
     meetingType: 'video' | 'phone' | 'in-person';
     notes?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
     open,
     onClose,
     expert,
     consultationTypes,
     onBookConsultation
}) => {
     const [step, setStep] = useState(1);
     const [bookingData, setBookingData] = useState<BookingData>({
          consultationType: consultationTypes[0]?.id || '',
          date: '',
          time: '',
          duration: consultationTypes[0]?.duration || 60,
          price: consultationTypes[0]?.price || 150,
          meetingType: 'video',
          notes: ''
     });

     const handleNext = () => {
          if (step < 3) {
               setStep(step + 1);
          } else {
               handleSubmit();
          }
     };

     const handleBack = () => {
          if (step > 1) {
               setStep(step - 1);
          }
     };

     const handleSubmit = () => {
          onBookConsultation?.(expert.id, bookingData);
          onClose();
     };

     const updateBookingData = (updates: Partial<BookingData>) => {
          setBookingData(prev => ({ ...prev, ...updates }));
     };

     const selectedConsultation = consultationTypes.find(ct => ct.id === bookingData.consultationType);

     return (
          <Modal
               open={open}
               onClose={onClose}
               closeButton
               width="600px"
               aria-labelledby="booking-modal"
          >
               <Modal.Header>
                    <Flex direction="column">
                         <Text h3>Book Consultation with {expert.name}</Text>
                         <Text size="$sm" color="$accents7">
                              Step {step} of 3
                         </Text>
                    </Flex>
               </Modal.Header>

               <Modal.Body>
                    {/* Step 1: Consultation Type */}
                    {step === 1 && (
                         <Flex direction="column" css={{ gap: '$6' }}>
                              <Text h4>Select Consultation Type</Text>

                              <Flex direction="column" css={{ gap: '$3' }}>
                                   {consultationTypes.map((type) => (
                                        <Card
                                             key={type.id}
                                             isPressable
                                             isHoverable
                                             variant={bookingData.consultationType === type.id ? 'flat' : 'shadow'}
                                             css={{
                                                  p: '$4',
                                                  border: bookingData.consultationType === type.id ? '2px solid $primary' : '1px solid $border'
                                             }}
                                             onPress={() => updateBookingData({
                                                  consultationType: type.id,
                                                  duration: type.duration,
                                                  price: type.price
                                             })}
                                        >
                                             <Flex justify="between" align="center">
                                                  <Box>
                                                       <Text b>{type.name}</Text>
                                                       <Text size="$sm" color="$accents7">{type.description}</Text>
                                                  </Box>
                                                  <Box css={{ textAlign: 'right' }}>
                                                       <Text b size="$lg" css={{ color: '$primary' }}>
                                                            ${type.price}
                                                       </Text>
                                                       <Flex align="center" css={{ gap: '$1', justifyContent: 'flex-end' }}>
                                                            <Clock size={14} color="$accents7" />
                                                            <Text size="$sm" color="$accents7">{type.duration} min</Text>
                                                       </Flex>
                                                  </Box>
                                             </Flex>
                                        </Card>
                                   ))}
                              </Flex>
                         </Flex>
                    )}

                    {/* Step 2: Schedule & Meeting Type */}
                    {step === 2 && (
                         <Flex direction="column" css={{ gap: '$6' }}>
                              <Text h4>Select Date & Time</Text>

                              <Box>
                                   <Text size="$sm" color="$accents7" css={{ mb: '$2' }}>
                                        Preferred Date
                                   </Text>
                                   <Input
                                        fullWidth
                                        type="date"
                                        value={bookingData.date}
                                        onChange={(e) => updateBookingData({ date: e.target.value })}
                                        contentLeft={<CalendarIcon size={16} />}
                                   />
                              </Box>

                              <Box>
                                   <Text size="$sm" color="$accents7" css={{ mb: '$2' }}>
                                        Preferred Time
                                   </Text>

                                   <Select
                                        fullWidth
                                        value={bookingData.time}
                                        options={[
                                             { label: "09:00 AM", value: "09:00" },
                                             { label: "09:30 AM", value: "09:30" },
                                             { label: "10:00 AM", value: "10:00" },
                                             { label: "10:30 AM", value: "10:30" },
                                             { label: "11:00 AM", value: "11:00" },
                                             { label: "11:30 AM", value: "11:30" },
                                             { label: "12:00 PM", value: "12:00" },
                                             { label: "12:30 PM", value: "12:30" },
                                             { label: "01:00 PM", value: "13:00" },
                                             { label: "01:30 PM", value: "13:30" },
                                             { label: "02:00 PM", value: "14:00" },
                                             { label: "02:30 PM", value: "14:30" },
                                             { label: "03:00 PM", value: "15:00" },
                                             { label: "03:30 PM", value: "15:30" },
                                             { label: "04:00 PM", value: "16:00" },
                                             { label: "04:30 PM", value: "16:30" },
                                             { label: "05:00 PM", value: "17:00" }
                                        ]}
                                        onChange={(value) => updateBookingData({ time: value })}
                                        placeholder="Select time"
                                   />
                              </Box>

                              <Box>
                                   <Text size="$sm" color="$accents7" css={{ mb: '$2' }}>
                                        Meeting Type
                                   </Text>
                                   <Flex css={{ gap: '$3' }}>
                                        <Card
                                             isPressable
                                             isHoverable
                                             variant={bookingData.meetingType === 'video' ? 'flat' : 'shadow'}
                                             css={{
                                                  p: '$4',
                                                  flex: 1,
                                                  border: bookingData.meetingType === 'video' ? '2px solid $primary' : '1px solid $border'
                                             }}
                                             onPress={() => updateBookingData({ meetingType: 'video' })}
                                        >
                                             <Flex direction="column" align="center" css={{ gap: '$2' }}>
                                                  <Video size={24} color="#3f3bef" />
                                                  <Text b>Video Call</Text>
                                                  <Text size="$xs" color="$accents7" css={{ textAlign: 'center' }}>
                                                       Secure video conference
                                                  </Text>
                                             </Flex>
                                        </Card>

                                        <Card
                                             isPressable
                                             isHoverable
                                             variant={bookingData.meetingType === 'phone' ? 'flat' : 'shadow'}
                                             css={{
                                                  p: '$4',
                                                  flex: 1,
                                                  border: bookingData.meetingType === 'phone' ? '2px solid $primary' : '1px solid $border'
                                             }}
                                             onPress={() => updateBookingData({ meetingType: 'phone' })}
                                        >
                                             <Flex direction="column" align="center" css={{ gap: '$2' }}>
                                                  <Phone size={24} color="#10b981" />
                                                  <Text b>Phone Call</Text>
                                                  <Text size="$xs" color="$accents7" css={{ textAlign: 'center' }}>
                                                       Audio consultation
                                                  </Text>
                                             </Flex>
                                        </Card>

                                        {expert.location && (
                                             <Card
                                                  isPressable
                                                  isHoverable
                                                  variant={bookingData.meetingType === 'in-person' ? 'flat' : 'shadow'}
                                                  css={{
                                                       p: '$4',
                                                       flex: 1,
                                                       border: bookingData.meetingType === 'in-person' ? '2px solid $primary' : '1px solid $border'
                                                  }}
                                                  onPress={() => updateBookingData({ meetingType: 'in-person' })}
                                             >
                                                  <Flex direction="column" align="center" css={{ gap: '$2' }}>
                                                       <MapPin size={24} color="#ef4444" />
                                                       <Text b>In Person</Text>
                                                       <Text size="$xs" color="$accents7" css={{ textAlign: 'center' }}>
                                                            {expert.location}
                                                       </Text>
                                                  </Flex>
                                             </Card>
                                        )}
                                   </Flex>
                              </Box>
                         </Flex>
                    )}

                    {/* Step 3: Review & Confirm */}
                    {step === 3 && (
                         <Flex direction="column" css={{ gap: '$6' }}>
                              <Text h4>Review Your Booking</Text>

                              <Card css={{ p: '$6' }} variant="flat">
                                   <Flex direction="column" css={{ gap: '$4' }}>
                                        <Flex justify="between">
                                             <Text color="$accents7">Expert</Text>
                                             <Text b>{expert.name}</Text>
                                        </Flex>

                                        <Flex justify="between">
                                             <Text color="$accents7">Session Type</Text>
                                             <Text b>{selectedConsultation?.name}</Text>
                                        </Flex>

                                        <Flex justify="between">
                                             <Text color="$accents7">Duration</Text>
                                             <Text>{selectedConsultation?.duration} minutes</Text>
                                        </Flex>

                                        <Flex justify="between">
                                             <Text color="$accents7">Date & Time</Text>
                                             <Text>{bookingData.date} at {bookingData.time}</Text>
                                        </Flex>

                                        <Flex justify="between">
                                             <Text color="$accents7">Meeting Type</Text>
                                             <Text>
                                                  {bookingData.meetingType === 'video' && 'Video Call'}
                                                  {bookingData.meetingType === 'phone' && 'Phone Call'}
                                                  {bookingData.meetingType === 'in-person' && 'In Person'}
                                             </Text>
                                        </Flex>

                                        <Divider />

                                        <Flex justify="between">
                                             <Text color="$accents7">Total Amount</Text>
                                             <Text b size="$xl" css={{ color: '$primary' }}>
                                                  ${selectedConsultation?.price}
                                             </Text>
                                        </Flex>
                                   </Flex>
                              </Card>

                              <Box>
                                   <Text size="$sm" color="$accents7" css={{ mb: '$2' }}>
                                        Additional Notes (Optional)
                                   </Text>
                                   <Input
                                        fullWidth
                                        placeholder="Any specific concerns or topics you'd like to discuss..."
                                        value={bookingData.notes}
                                        onChange={(e) => updateBookingData({ notes: e.target.value })}
                                        css={{
                                             '& .nextui-input-wrapper': {
                                                  minHeight: '80px',
                                                  alignItems: 'flex-start'
                                             }
                                        }}
                                   />
                              </Box>
                         </Flex>
                    )}
               </Modal.Body>

               <Modal.Footer>
                    <Flex justify="between" css={{ width: '100%' }}>
                         <Button
                              auto
                              light
                              onPress={step === 1 ? onClose : handleBack}
                         >
                              {step === 1 ? 'Cancel' : 'Back'}
                         </Button>

                         <Button
                              auto
                              css={{ bg: '#3f3bef' }}
                              onPress={handleNext}
                              disabled={step === 1 && !bookingData.consultationType}
                         >
                              {step === 3 ? 'Confirm Booking' : 'Continue'}
                         </Button>
                    </Flex>
               </Modal.Footer>
          </Modal>
     );
};