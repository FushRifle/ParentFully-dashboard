import { useState, useEffect } from 'react';
import { supabase } from '@/supabase/client';
import { useRouter } from 'next/router';
import { useProfileData } from '../auth/useProfileData';

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

type UseFeedbacksReturn = {
     feedbacks: Feedback[];
     loading: boolean;
     filter: string;
     setFilter: (filter: string) => void;
     search: string;
     setSearch: (search: string) => void;
     currentPage: number;
     setCurrentPage: (page: number) => void;
     totalPages: number;
     isAdmin: boolean;
     updateFeedbackStatus: (feedbackId: number, newStatus: string) => Promise<void>;
     refetch: () => Promise<void>;
};

export const useFeedbacks = (): UseFeedbacksReturn => {
     const router = useRouter();
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

     // Fetch feedbacks when dependencies change
     useEffect(() => {
          fetchFeedbacks();
     }, [filter, search, currentPage]);

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

     return {
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
          refetch: fetchFeedbacks
     };
};