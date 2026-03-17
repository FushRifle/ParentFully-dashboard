import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { supabase } from '@/supabase/client';
import { formatDistanceToNow, format } from 'date-fns';
import {
     Container,
     Card,
     Text,
     Loading,
     Grid,
     Row,
     Col,
     Badge,
     Button,
     Spacer,
     Avatar,
} from '@nextui-org/react';
import ChatAvatarWrapper from '@/components/Avatar/ChatAvatarWrapper';

type FeedbackDetail = {
     id: number;
     type: 'bug' | 'idea' | 'feedback' | 'feature';
     message: string;
     name: string;
     email: string;
     attachments: string[];
     created_at: string;
     status?: 'pending' | 'reviewed' | 'implemented' | 'rejected';
};

const modalStyles = {
     overlay: {
          position: 'fixed' as const,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
     },
     content: {
          backgroundColor: 'white',
          borderRadius: '16px',
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative' as const
     },
     closeButton: {
          position: 'absolute' as const,
          top: '5px',
          right: '5px',
          background: 'red',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          fontSize: '20px',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          zIndex: 1,
          color: 'white',
          transition: 'all 0.2s ease',
          outline: 'none',
          ':hover': {
               background: '#ff6666',
               transform: 'scale(1.1)'
          }
     }
};

const FeedbackDetailPage: NextPage = () => {
     const router = useRouter();
     const { id } = router.query;
     const [feedback, setFeedback] = useState<FeedbackDetail | null>(null);
     const [loading, setLoading] = useState(true);
     const [selectedAttachment, setSelectedAttachment] = useState<string | null>(null);

     useEffect(() => {
          if (id) {
               fetchFeedbackDetail();
          }
     }, [id]);

     const fetchFeedbackDetail = async () => {
          setLoading(true);
          try {
               const { data, error } = await supabase
                    .from('feedbacks')
                    .select('*')
                    .eq('id', id)
                    .single();

               if (error) throw error;
               setFeedback(data);
          } catch (error) {
               console.error('Error fetching feedback detail:', error);
          } finally {
               setLoading(false);
          }
     };

     const getTypeColor = (type: string) => {
          const colors = {
               bug: 'error',
               idea: 'warning',
               feedback: 'primary',
               feature: 'success'
          };
          return colors[type as keyof typeof colors] || 'default';
     };

     if (loading) {
          return (
               <Container css={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <Loading size="xl" />
               </Container>
          );
     }

     if (!feedback) {
          return (
               <Container css={{ textAlign: 'center', py: '$20' }}>
                    <Text h3 color="error">Feedback not found</Text>
                    <Button auto ghost onClick={() => router.push('/feedback')} css={{ mt: '$4' }}>
                         Go Back
                    </Button>
               </Container>
          );
     }

     return (
          <Container lg css={{ py: '$15' }}>
               {/* Header with back button */}
               <Row align="center" css={{ mb: '$8' }}>
                    <Button auto light color="primary" onClick={() => router.back()}>
                         ← Back
                    </Button>
               </Row>

               <Grid.Container gap={2}>
                    {/* Main Content */}
                    <Grid xs={12} md={8}>
                         <Card css={{ p: '$8' }}>
                              {/* User Info */}
                              <Row align="center" css={{ gap: '$4', mb: '$6' }}>
                                   <ChatAvatarWrapper
                                        contactName={feedback.name}
                                        size={70}
                                        variant='secondary'
                                        borderWidth={2}
                                        borderColor='#F5A623'
                                   />
                                   <Col>
                                        <Row align="center" css={{ gap: '$2', mb: '$2' }}>
                                             <Text h3 css={{ m: 0 }}>{feedback.name}</Text>
                                             <Badge color={getTypeColor(feedback.type) as any}>
                                                  {feedback.type}
                                             </Badge>
                                             {feedback.status && (
                                                  <Badge color="default" variant="flat">
                                                       {feedback.status}
                                                  </Badge>
                                             )}
                                        </Row>
                                        <Text color="$gray600">
                                             {feedback.email} • Submitted {format(new Date(feedback.created_at), 'PPP')}
                                             ({formatDistanceToNow(new Date(feedback.created_at), { addSuffix: true })})
                                        </Text>
                                   </Col>
                              </Row>

                              {/* Message */}
                              <Card variant="flat" css={{ p: '$6', bg: '$accents0' }}>
                                   <Text css={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                                        {feedback.message}
                                   </Text>
                              </Card>
                         </Card>
                    </Grid>

                    {/* Sidebar - Attachments */}
                    <Grid xs={12} md={4}>
                         <Card css={{ p: '$8' }}>
                              <Text h4 css={{ mb: '$6' }}>Attachments</Text>

                              {feedback.attachments && feedback.attachments.length > 0 ? (
                                   <Col css={{ gap: '$4', display: 'flex', flexDirection: 'column' }}>
                                        {feedback.attachments.map((url, idx) => {
                                             const isImage = url.match(/\.(jpeg|jpg|gif|png|webp)$/i) || url.includes('image');

                                             return (
                                                  <Card
                                                       key={idx}
                                                       isPressable
                                                       onClick={() => setSelectedAttachment(url)}
                                                       css={{
                                                            p: '$4',
                                                            transition: 'all 0.2s ease',
                                                            '&:hover': {
                                                                 bg: '$accents0',
                                                                 transform: 'scale(1.02)'
                                                            }
                                                       }}
                                                  >
                                                       <Row align="center" css={{ gap: '$2' }}>
                                                            <div style={{
                                                                 width: '40px',
                                                                 height: '40px',
                                                                 borderRadius: '8px',
                                                                 background: isImage ? '#f0f0f0' : '#e6f7ff',
                                                                 display: 'flex',
                                                                 alignItems: 'center',
                                                                 justifyContent: 'center',
                                                                 fontSize: '1.5rem'
                                                            }}>
                                                                 {isImage ? '🖼️' : '📎'}
                                                            </div>
                                                            <Col>
                                                                 <Text b>Attachment {idx + 1}</Text>
                                                                 <Row align="center" css={{ gap: '$2' }}>
                                                                      <Text size="$xs" color="$gray500">
                                                                           {isImage ? 'Click to preview' : 'Click to download'}
                                                                      </Text>
                                                                      {isImage && (
                                                                           <Badge size="xs" color="primary" variant="flat">
                                                                                Preview
                                                                           </Badge>
                                                                      )}
                                                                 </Row>
                                                            </Col>
                                                       </Row>
                                                  </Card>
                                             );
                                        })}
                                   </Col>
                              ) : (
                                   <Card variant="flat" css={{ p: '$8', textAlign: 'center' }}>
                                        <Text color="$gray500">No attachments</Text>
                                   </Card>
                              )}

                              {/* Metadata */}
                              <Spacer y={2} />
                              <Card variant="flat" css={{ p: '$4', bg: '$accents0' }}>
                                   <Text small color="$gray600">Feedback ID: #{feedback.id}</Text>
                                   <Text small color="$gray600">Created: {format(new Date(feedback.created_at), 'PPpp')}</Text>
                              </Card>
                         </Card>

                         {/* Attachment Modal */}
                         {selectedAttachment && (
                              <div style={modalStyles.overlay} onClick={() => setSelectedAttachment(null)}>
                                   <div style={modalStyles.content} onClick={(e) => e.stopPropagation()}>
                                        <button
                                             style={modalStyles.closeButton}
                                             onMouseEnter={(e) => {
                                                  e.currentTarget.style.background = '#ff6666';
                                                  e.currentTarget.style.transform = 'scale(1.1)';
                                             }}
                                             onMouseLeave={(e) => {
                                                  e.currentTarget.style.background = '#ff4444';
                                                  e.currentTarget.style.transform = 'scale(1)';
                                             }}
                                             onClick={() => setSelectedAttachment(null)}
                                        >
                                             X
                                        </button>

                                        {selectedAttachment.match(/\.(jpeg|jpg|gif|png|webp)$/i)
                                             || selectedAttachment.includes('image') ?
                                             (
                                                  <img
                                                       src={selectedAttachment}
                                                       alt="Attachment preview"
                                                       style={{
                                                            maxWidth: '100%',
                                                            maxHeight: '80vh',
                                                            display: 'block'
                                                       }}
                                                  />
                                             ) : (
                                                  <Card css={{ p: '$20', textAlign: 'center', minWidth: '400px' }}>
                                                       <span style={{ fontSize: '48px', display: 'block', marginBottom: '20px' }}>📄</span>
                                                       <Text h4>File Attachment</Text>
                                                       <Text color="$gray600" css={{ mb: '$6' }}>
                                                            This file cannot be previewed
                                                       </Text>
                                                       <Button
                                                            color="primary"
                                                            onClick={() => window.open(selectedAttachment, '_blank')}
                                                       >
                                                            Download / Open in new tab
                                                       </Button>
                                                  </Card>
                                             )}
                                   </div>
                              </div>
                         )}
                    </Grid>
               </Grid.Container>
          </Container>
     );
};

export default FeedbackDetailPage;