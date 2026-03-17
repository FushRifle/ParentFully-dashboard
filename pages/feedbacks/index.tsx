import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { supabase } from '@/supabase/client';
import {
     Container,
     Card,
     Text,
     Loading,
     Grid,
     Row,
     Col,
     Badge,
     Input,
     Pagination,
     Avatar
} from '@nextui-org/react';
import { useProfileData } from '@/hooks/auth/useProfileData';
import { formatDistanceToNow } from 'date-fns';

type Feedback = {
     id: number;
     type: 'bug' | 'idea' | 'feedback' | 'feature';
     message: string;
     name: string;
     email: string;
     attachments: string[];
     created_at: string;
     status?: 'pending' | 'reviewed' | 'implemented' | 'rejected';
};

const FeedbackPage: NextPage = () => {
     const { user } = useProfileData();
     const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
     const [loading, setLoading] = useState(true);
     const [filter, setFilter] = useState<string>('all');
     const [search, setSearch] = useState('');
     const [currentPage, setCurrentPage] = useState(1);
     const [totalPages, setTotalPages] = useState(1);
     const [isAdmin, setIsAdmin] = useState(false);
     const itemsPerPage = 10;

     // Check if user is admin
     useEffect(() => {
          const checkAdminStatus = async () => {
               if (!user?.user?.id) return;

               try {
                    const { data, error } = await supabase
                         .from('profiles')
                         .select('role')
                         .eq('id', user.user.id)
                         .single();

                    if (error) throw error;
                    setIsAdmin(data?.role === 'admin');
               } catch (error) {
                    console.error('Error checking admin status:', error);
               }
          };

          checkAdminStatus();
     }, [user]);

     const fetchFeedbacks = async () => {
          setLoading(true);
          try {
               let query = supabase
                    .from('feedbacks')
                    .select('*', { count: 'exact' })
                    .order('created_at', { ascending: false })
                    .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

               // Apply type filter
               if (filter !== 'all') {
                    query = query.eq('type', filter);
               }

               // Apply search if provided
               if (search) {
                    query = query.or(`message.ilike.%${search}%,name.ilike.%${search}%,email.ilike.%${search}%`);
               }

               const { data, error, count } = await query;

               if (error) throw error;

               setFeedbacks(data || []);
               setTotalPages(Math.ceil((count || 0) / itemsPerPage));
          } catch (error) {
               console.error('Error fetching feedbacks:', error);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchFeedbacks();
     }, [filter, currentPage, search]);

     const getTypeColor = (type: string) => {
          const colors = {
               bug: 'error',
               idea: 'warning',
               feedback: 'primary',
               feature: 'success'
          };
          return colors[type as keyof typeof colors] || 'default';
     };

     const getStatusBadge = (status?: string) => {
          const colors = {
               pending: 'warning',
               reviewed: 'primary',
               implemented: 'success',
               rejected: 'error'
          };
          return colors[status as keyof typeof colors] || 'default';
     };

     const updateFeedbackStatus = async (feedbackId: number, newStatus: string) => {
          try {
               const { error } = await supabase
                    .from('feedbacks')
                    .update({ status: newStatus })
                    .eq('id', feedbackId);

               if (error) throw error;

               // Update local state
               setFeedbacks(prev =>
                    prev.map(f =>
                         f.id === feedbackId ? { ...f, status: newStatus as any } : f
                    )
               );
          } catch (error) {
               console.error('Error updating feedback status:', error);
          }
     };

     if (loading && feedbacks.length === 0) {
          return (
               <Container css={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <Loading size="xl" />
               </Container>
          );
     }

     return (
          <Container lg css={{ py: '$15' }}>
               {/* Header */}
               <Row justify="space-between" align="center" css={{ mb: '$10' }}>
                    <Col>
                         <Text h1 size={36} css={{ m: 0 }}>
                              Feedback Board
                         </Text>
                         <Text color="$gray600" css={{ mt: '$2' }}>
                              View and manage user feedback, ideas, and bug reports
                         </Text>
                    </Col>
               </Row>

               {/* Filters */}
               <Card css={{ p: '$6', mb: '$8' }}>
                    <Row wrap="wrap" align="center" css={{ gap: '$4' }}>
                         <div style={{ position: 'relative', width: '200px' }}>
                              <select
                                   value={filter}
                                   onChange={(e) => setFilter(e.target.value)}
                                   style={{
                                        width: '100%',
                                        height: '40px',
                                        padding: '0 28px 0 12px',
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0',
                                        backgroundColor: 'white',
                                        fontSize: '14px',
                                        fontFamily: 'inherit',
                                        fontWeight: '400',
                                        color: '#1a1a1a',
                                        cursor: 'pointer',
                                        outline: 'none',
                                        appearance: 'none',
                                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 8px center',
                                        backgroundSize: '16px'
                                   }}
                                   onFocus={(e) => {
                                        e.target.style.borderColor = '#0072f5';
                                        e.target.style.boxShadow = '0 0 0 2px rgba(0,114,245,0.2)';
                                   }}
                                   onBlur={(e) => {
                                        e.target.style.borderColor = '#e2e8f0';
                                        e.target.style.boxShadow = 'none';
                                   }}
                              >
                                   <option value="all">All Types</option>
                                   <option value="bug">Bugs</option>
                                   <option value="idea">Ideas</option>
                                   <option value="feedback">Feedback</option>
                                   <option value="feature">Features</option>
                              </select>
                         </div>

                         <Input
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              placeholder="Search feedback..."
                              css={{ flex: 1 }}
                              contentLeft={<span>🔍</span>}
                         />
                    </Row>
               </Card>

               {/* Feedback List */}
               <Grid.Container gap={2}>
                    {feedbacks.length === 0 ? (
                         <Grid xs={12}>
                              <Card css={{ p: '$20', textAlign: 'center' }}>
                                   <Text h3 color="$gray500">No feedback found</Text>
                                   <Text color="$gray400">Be the first to share your thoughts!</Text>
                              </Card>
                         </Grid>
                    ) : (
                         feedbacks.map((feedback) => (
                              <Grid xs={12} key={feedback.id}>
                                   <Card css={{ p: '$6', width: '100%' }}>
                                        <Row justify="space-between" align="center">
                                             <Row align="center" css={{ gap: '$4' }}>
                                                  <Avatar
                                                       text={feedback.name.charAt(0)}
                                                       size="md"
                                                       color={getTypeColor(feedback.type) as any}
                                                  />
                                                  <Col>
                                                       <Row align="center" css={{ gap: '$2' }}>
                                                            <Text b>{feedback.name}</Text>
                                                            <Badge color={getTypeColor(feedback.type) as any} size="xs">
                                                                 {feedback.type}
                                                            </Badge>
                                                            {isAdmin && feedback.status && (
                                                                 <Badge color={getStatusBadge(feedback.status) as any} size="xs">
                                                                      {feedback.status}
                                                                 </Badge>
                                                            )}
                                                       </Row>
                                                       <Text size="$sm" color="$gray500">
                                                            {feedback.email} • {formatDistanceToNow(new Date(feedback.created_at), { addSuffix: true })}
                                                       </Text>
                                                  </Col>
                                             </Row>
                                        </Row>

                                        <Text css={{ mt: '$4', whiteSpace: 'pre-wrap' }}>{feedback.message}</Text>

                                        {feedback.attachments && feedback.attachments.length > 0 && (
                                             <Row css={{ mt: '$4', gap: '$2' }} wrap="wrap">
                                                  {feedback.attachments.map((url, idx) => (
                                                       <a
                                                            key={idx}
                                                            href={url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{ textDecoration: 'none' }}
                                                       >
                                                            <Badge variant="flat" color="primary">
                                                                 📎 Attachment {idx + 1}
                                                            </Badge>
                                                       </a>
                                                  ))}
                                             </Row>
                                        )}

                                        {isAdmin && (
                                             <Row css={{ mt: '$4', gap: '$2' }} justify="flex-end">
                                                  <div style={{ position: 'relative', width: '150px' }}>
                                                       <select
                                                            value={feedback.status || 'pending'}
                                                            onChange={(e) => updateFeedbackStatus(feedback.id, e.target.value)}
                                                            style={{
                                                                 width: '100%',
                                                                 height: '36px',
                                                                 padding: '0 24px 0 10px',
                                                                 borderRadius: '8px',
                                                                 border: '1px solid #e2e8f0',
                                                                 backgroundColor: 'white',
                                                                 fontSize: '13px',
                                                                 fontFamily: 'inherit',
                                                                 cursor: 'pointer',
                                                                 outline: 'none',
                                                                 appearance: 'none',
                                                                 backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                                                                 backgroundRepeat: 'no-repeat',
                                                                 backgroundPosition: 'right 6px center',
                                                                 backgroundSize: '14px'
                                                            }}
                                                       >
                                                            <option value="pending">Pending</option>
                                                            <option value="reviewed">Reviewed</option>
                                                            <option value="implemented">Implemented</option>
                                                            <option value="rejected">Rejected</option>
                                                       </select>
                                                  </div>
                                             </Row>
                                        )}
                                   </Card>
                              </Grid>
                         ))
                    )}
               </Grid.Container>

               {/* Pagination */}
               {totalPages > 1 && (
                    <Row justify="center" css={{ mt: '$8' }}>
                         <Pagination
                              total={totalPages}
                              initialPage={1}
                              onChange={(page) => setCurrentPage(page)}
                         />
                    </Row>
               )}
          </Container>
     );
};

export default FeedbackPage;