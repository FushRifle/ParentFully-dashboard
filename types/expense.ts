export interface ApiResponse<T> {
     success: boolean;
     data: T;
     message: string;
}

export interface PaginationMeta {
     current_page: number;
     last_page: number;
     per_page: number;
     total: number;
}

export interface PeriodFilter {
     period?: 'last_month' | 'last_3_months' | 'last_6_months' | 'last_year';
}

// Budget Overview types
export interface PendingActions {
     count: number;
     expenses: number;
     payments: number;
     requests: number;
}

export interface ApprovedActions {
     count: number;
     expenses: number;
     payments: number;
     requests: number;
}

export interface ContributionBreakdown {
     you: number;
     co_parent: number;
}

export interface ExpenseByCategory {
     cat_id: number;
     cat_name: string;
     cat_icon: string;
     total: string;
     percentage: number;
}

export interface PendingItem {
     id: number;
     type: 'expense' | 'payment' | 'request';
     description: string;
     amount: string;
     created_at: string;
}

export interface BudgetOverview {
     period: string;
     recent_expenses: Expense[];
     recent_payments: Payment[];
     recent_requests: PaymentRequest[];
     pending_actions: PendingActions;
     approved_actions: ApprovedActions;
     total_expenses: string;
     total_payments: string;
     contribution_breakdown: ContributionBreakdown;
     expenses_by_category: ExpenseByCategory[];
     pending_items: PendingItem[];
}

export interface BudgetOverviewResponse extends ApiResponse<BudgetOverview> { }

// Expense types
export interface ChildAssignment {
     child_id: number;
     share_percentage: number;
}

export interface CostShareAssignment {
     contact_id: number;
     share_percentage: number;
}

export interface ExpenseChild {
     id: number;
     expense_id: number;
     child_id: number;
     child_name: string;
     share_percentage: string;
}

export interface CostShare {
     id: number;
     expense_id: number;
     contact_id: number;
     contact_name: string;
     contact_photo?: | {
          uri: string;
          type: string;
          fileName?: string | undefined;
     } | undefined;
     share_percentage: string;
}

export interface Child {
     id: number;
     name: string;
}

export interface Expense {
     user_id: number;
     id: number;
     child_id: number;
     description: string;
     amount: string;
     currency: string;
     date: string;
     receipt: string | null;
     cat_icon: string | null;
     cat_name: string | null;
     percentage: string | null;
     reimbursement: boolean;
     reimburser: number | null;
     status: 'pending' | 'approved' | 'rejected';
     reimbursed_at: string | null;
     reimbursed_by: string | null;
     reimbursement_amount: string | null;
     added_by: number;
     children: ExpenseChild[];
     cost_shares: CostShare[];
     child: Child;
     created_at?: string;
     updated_at?: string;
     updated_by?: number;
}

export interface ExpensesResponse extends ApiResponse<Expense[]> {
     meta: PaginationMeta;
}

export interface ExpenseResponse extends ApiResponse<Expense> { }

export interface CreateExpenseData {
     child_id: number;
     description: string;
     amount: number;
     currency: string;
     date: string;
     receipt?: File;
     cat_icon?: string;
     cat_name?: string;
     percentage?: string;
     reimbursement?: boolean;
     reimburser?: number;
     status: 'pending' | 'approved' | 'rejected';
}

export interface UpdateExpenseData {
     child_id?: number;
     description?: string;
     amount?: number;
     date?: string;
     receipt?: File;
     cat_icon?: string;
     cat_name?: string;
     percentage?: string;
     reimbursement?: boolean;
     reimburser?: number;
     status?: 'pending' | 'approved' | 'rejected';
}

export interface AssignChildrenData {
     children: ChildAssignment[];
}

export interface AssignCostSharesData {
     cost_shares: CostShareAssignment[];
}

export interface MarkAsReimbursedData {
     reimbursement_amount?: number;
}

// Payment types
export interface Payment {
     id: number;
     parent_id: number;
     expense_id: number | null;
     description: string;
     amount: string;
     currency?: string;
     date: string;
     receipt: string | null;
     status: 'pending' | 'approved' | 'rejected';
     receipt_confirmed: boolean;
     receipt_confirmed_at: string | null;
     receipt_confirmed_by: number | null;
     added_by: number;
     created_at?: string;
     updated_at?: string;
     updated_by?: number;
}

export interface PaymentsResponse extends ApiResponse<Payment[]> {
     meta: PaginationMeta;
}

export interface PaymentResponse extends ApiResponse<Payment> { }

export interface CreatePaymentData {
     parent_id: number;
     expense_id: number;
     description: string;
     amount: number;
     date: string;
     receipt?: File;
     status: 'pending' | 'approved' | 'rejected';
}

export interface UpdatePaymentData {
     parent_id?: number;
     description?: string;
     amount?: number;
     date?: string;
     receipt?: File;
     status?: 'pending' | 'approved' | 'rejected';
}

// Payment Request types
export interface User {
     id: number;
     name: string;
     email?: string;
}

export interface PaymentRequest {
     id: number;
     requester_id: number;
     requested_from_id: number;
     parent_id: number;
     payer_id: number;
     description: string;
     purpose: string | null;
     amount: string;
     currency?: string;
     date: string;
     due_date: string | null;
     receipt: string | null;
     status: 'pending_approval' | 'approved' | 'rejected' | 'paid';
     added_by: number;
     requester: User;
     payer: User;
     created_at?: string;
     updated_at?: string;
     updated_by?: number;
     approved_at?: string;
     approved_by?: number;
     rejected_at?: string;
     rejected_by?: number;
     paid_at?: string;
     paid_by?: number;
}

export interface PaymentRequestsResponse extends ApiResponse<PaymentRequest[]> {
     meta: PaginationMeta;
}

export interface PaymentRequestResponse extends ApiResponse<PaymentRequest> { }

export interface CreatePaymentRequestData {
     file: any;
     added_by: number | null;
     id: number;
     payer_id: number;
     parent_id: number;
     description: string;
     purpose?: string;
     amount: number;
     currency?: string;
     due_date?: string;
     receipt?: File;
     requested_from_id: number;
     requester_id: number;
     status?: 'pending_approval' | 'approved' | 'rejected' | 'paid';
}

export interface UpdatePaymentRequestData {
     payer_id?: number;
     description?: string;
     purpose?: string;
     amount?: number;
     due_date?: string;
     receipt?: File;
}

// Notification types
export interface NotificationData {
     expense_id?: number;
     amount?: string;
     [key: string]: any;
}

export interface Notification {
     id: number;
     user_id: number;
     type: string;
     title: string;
     message: string;
     data: NotificationData;
     read_at: string | null;
     created_at: string;
}

export interface NotificationsResponse extends ApiResponse<Notification[]> {
     meta: PaginationMeta & { unread_count: number };
}

export interface NotificationResponse extends ApiResponse<Notification> { }

export interface UnreadNotificationsResponse {
     success: boolean;
     data: Omit<Notification, 'user_id' | 'data' | 'read_at'>[];
     count: number;
     message: string;
}

export interface MarkAllAsReadResponse {
     success: boolean;
     count: number;
     message: string;
}

export interface DeleteAllResponse {
     success: boolean;
     count: number;
     message: string;
}

// Query parameter types
export interface ExpenseQueryParams {
     per_page?: number;
     page?: number;
     child_id?: number;
     description?: string;
     cat_name?: string;
     status?: 'pending' | 'approved' | 'rejected';
     reimbursement?: boolean;
}

export interface PaymentQueryParams {
     per_page?: number;
     page?: number;
     status?: 'pending' | 'approved' | 'rejected';
}

export interface PaymentRequestQueryParams {
     per_page?: number;
     page?: number;
     status?: 'pending_approval' | 'approved' | 'rejected' | 'paid';
}

export interface NotificationQueryParams {
     per_page?: number;
     page?: number;
     type?: string;
}

export interface ExportQueryParams {
     format: 'pdf' | 'csv';
     period?: PeriodFilter['period'];
}