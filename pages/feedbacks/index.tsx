import React, { useEffect, useCallback, useMemo } from 'react';
import { NextPage } from 'next';
import { useFeedbacks } from '@/hooks/feedback/useFetchFeedbacks';
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
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/router';
import debounce from 'lodash/debounce';
import { SearchCheckIcon, SearchIcon } from 'lucide-react';

const FeedbackPage: NextPage = () => {
     const router = useRouter();

     const {
          feedbacks,
          loading,
          filter,
          setFilter,
          search,
          setSearch,
          currentPage,
          setCurrentPage,
          totalPages,
          isAdmin,
          updateFeedbackStatus,
          refetch
     } = useFeedbacks();

     const debouncedSetSearch = useMemo(
          () => debounce((value: string) => {
               setSearch(value);
               setCurrentPage(1);
          }, 500),
          [setSearch, setCurrentPage]
     );

     const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          debouncedSetSearch(e.target.value);
     };

     useEffect(() => {
          return () => {
               debouncedSetSearch.cancel();
          };
     }, [debouncedSetSearch]);

     useEffect(() => {
          refetch();
     }, [filter, search, currentPage]);

     const getTypeColor = useCallback((type: string) => {
          const colors = {
               bug: 'error',
               idea: 'warning',
               feedback: 'primary',
               feature: 'success'
          };
          return colors[type as keyof typeof colors] || 'default';
     }, []);

     const getStatusBadge = useCallback((status?: string) => {
          const colors = {
               pending: 'warning',
               reviewed: 'primary',
               implemented: 'success',
               rejected: 'error'
          };
          return colors[status as keyof typeof colors] || 'default';
     }, []);

     const handleCardClick = useCallback((feedbackId: number) => {
          router.push(`/feedbacks/${feedbackId}`);
     }, [router]);

     const handleAttachmentClick = useCallback((e: React.MouseEvent, url: string) => {
          e.stopPropagation();
          window.open(url, '_blank');
     }, []);

     const handleStatusChange = useCallback((
          e: React.ChangeEvent<HTMLSelectElement>,
          feedbackId: number
     ) => {
          e.stopPropagation();
          updateFeedbackStatus(feedbackId, e.target.value);
     }, [updateFeedbackStatus]);

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
                                   onChange={(e) => {
                                        setFilter(e.target.value);
                                        setCurrentPage(1);
                                   }}
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
                              defaultValue={search}
                              onChange={handleSearchChange as any}
                              placeholder="Search feedbacks..."
                              css={{ flex: 1 }}
                              contentLeft={<span><SearchIcon /></span>}
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
                                   <Card
                                        css={{ p: '$6', width: '100%', cursor: 'pointer' }}
                                        isPressable
                                        onClick={() => handleCardClick(feedback.id)}
                                   >
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

                                        <Text css={{
                                             mt: '$4',
                                             whiteSpace: 'pre-wrap',
                                             maxHeight: '100px',
                                             overflow: 'hidden',
                                             textOverflow: 'ellipsis'
                                        }}>
                                             {feedback.message.length > 200
                                                  ? `${feedback.message.substring(0, 200)}...`
                                                  : feedback.message}
                                        </Text>

                                        {feedback.attachments && feedback.attachments.length > 0 && (
                                             <Row css={{ mt: '$4', gap: '$2' }} wrap="wrap">
                                                  {feedback.attachments.map((url, idx) => (
                                                       <Badge
                                                            key={idx}
                                                            variant="flat"
                                                            color="primary"
                                                            onClick={(e) => handleAttachmentClick(e, url)}
                                                            css={{ cursor: 'pointer' }}
                                                       >
                                                            📎 Attachment {idx + 1}
                                                       </Badge>
                                                  ))}
                                             </Row>
                                        )}

                                        {isAdmin && (
                                             <Row css={{ mt: '$4', gap: '$2' }} justify="flex-end">
                                                  <div style={{ position: 'relative', width: '150px' }} onClick={(e) => e.stopPropagation()}>
                                                       <select
                                                            value={feedback.status || 'pending'}
                                                            onChange={(e) => handleStatusChange(e, feedback.id)}
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
                              page={currentPage}
                              onChange={(page) => setCurrentPage(page)}
                         />
                    </Row>
               )}
          </Container>
     );
};

export default FeedbackPage;