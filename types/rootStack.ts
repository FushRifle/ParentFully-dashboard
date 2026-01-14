import { Goal, CoreValue, Task, Rule, Routine } from "./api";
import { Expense, Payment, PaymentRequest } from "./expense";
import { IMessage } from 'react-native-gifted-chat';


interface ExtendedIMessage extends IMessage {
     video?: string;
     audio?: string;
     replyTo?: number | null;
     repliedMessage?: { content?: string; sender_name?: string };
     read?: boolean;
     delivered?: boolean;
     pending?: boolean;
}

export type RootStackParamList = {
     MainTabs: undefined;
     AddChild: undefined;
     Settings: undefined;
     Support: undefined;
     Community: undefined;
     ComingSoon: undefined;
     Milestones: undefined;
     Resources: undefined;
     Notifications: undefined;
     Document: undefined;
     ReferUser: undefined;

     Journal: undefined;
     JournalDetails: { entryId: string };

     RecycleBin: undefined;

     Messaging: undefined;
     Message: {
          currentUser: {
               id: string | number;
               name?: string;
          };
          initialMessages?: ExtendedIMessage[];
     };

     Contacts: undefined;
     Tools: undefined;
     MilestoneDetail: {
          milestoneId: string;
          onDelete: () => void;
     };
     Rewards: undefined;
     ParentingPlan: undefined;
     GoalScreen: {
          goals: Goal[];
          category: string;
          onStatusUpdate?: (updatedGoals: Goal[]) => void;
     };
     CategoryDetails: { categoryId: string };
     Calendar: undefined;
     AddCalendarEvent: undefined;
     Certificate: {
          childId?: number;
          childName: string;
          skill: string;
          reward: string;
          date: string;
     };

     //Goal Screens
     CorePlan: undefined;
     PlanDetail: {
          coreValue: CoreValue;
          goals: Goal[];
          ageGroup: string;
          ageDescription: string;
     };
     AddGoal: {
          categoryId: number;
          initialGoal?: Goal | null;
          onSave?: (goal: Goal) => void;
     };
     AddCategory: undefined;
     GoalDetails: {
          goal: Goal | null;
          refresh?: boolean;
          onUpdate?: (updatedGoal: Goal) => void;
     };
     UpdateGoal: {
          goal: Goal | null;
          childId?: number;
          refresh?: boolean;
          onUpdate?: (updatedGoal: Goal) => void;
     };
     AssignGoal: {
          goal: Goal | null;
     };
     Archive: {
          childId?: number;
     }
     Reminder: {
          goal?: Goal | null;
          childIds?: number[];
          reminderId?: number;
          onSave?: (updatedGoal?: Goal) => void;
     }

     //Goal Screens
     GoalDetail: undefined;
     GoalSummary: undefined;

     //Routine
     Routine: undefined;
     AddRoutine: undefined;
     WelcomeRoutine: undefined;
     ActiveRoutine: { childId: string };
     RoutineReminder: {
          routine?: Routine | null;
          reminderId?: number;
          onSave?: (updatedRoutine?: Routine) => void;
     };
     CustomTask: {
          task?: Task;
          onSave?: (task: Task, isEditing: boolean) => void;
          routineId?: string;
          isPredefined?: boolean;
     };
     RoutineDetails: {
          routineId: string;
          isPredefined?: boolean;
     };
     UpdateRoutine: {
          routineId: string;
          childId: number;
          isPredefined?: boolean;
     }
     CustomChildTask: {
          childId: number,
          childTaskId?: number;
          taskId?: number;
          onSave?: (task: Task, isEditing: boolean) => void;
          routineId?: string;
     };

     //Discipline
     WelcomeDiscipline: undefined;
     ActiveDiscipline: undefined;
     Discipline: undefined;
     AddDiscipline: undefined;
     UpdatePlan: {
          planId: number;
          planName: string;
          rules: Rule[];
          childId: number;
     };
     DisciplineDetails: {
          id: string;
          name: string;
          description: string;
          rules?: Rule[];
          icon?: string;
     };

     //Family Connect
     WelcomeFamily: undefined;
     AddFamily: undefined;
     FamilyDetails: { id: string };
     FamilyInvite: { contact_id: number };

     //Print
     Print: {
          plan?: string;
          childName?: string;
          printAll?: boolean;
          allPlans?: string;
     };
     PrintRoutine: {
          plan?: string;
          childName?: string;
          printAll?: boolean;
          allPlans?: string;
     };

     //Budgeting
     AddExpense: undefined;
     Expense: undefined;
     ExpenseRecords: undefined;
     ExpenseApproval: undefined;
     ExpenseDetail: {
          expense: Expense; // Use the actual Expense type
          title?: string;
          amount?: number;
          currency?: string;
          childName?: string;
          date?: string;
          category?: string;
          categoryColor?: string;
          status?: "Pending Approval" | "Confirmed" | "Rejected";
          statusBg?: string;
          splitInfo?: string;
          reimbursedBy?: string;
     };
     ExpenseDetails: {
          expenseId: number;
          expense?: Expense;
     };

     AddPayment: {
          expense: AddPaymentExpenseData;
     };

     ConfirmPayment: {
          expense: Expense;
          payment: Payment;
     };

     PaymentDetail: {
          payment: Payment;
          title?: string;
          amount?: number;
          currency?: string;
          date?: string;
          status?: "Pending" | "Confirmed" | "Rejected";
          receiptUrl?: string;
     };

     // Request screens
     RequestPayment: undefined;
     PayRequest: undefined;
     PaymentRequestApproval: {
          request: PaymentRequest;
     };

     ConfirmRequest: {
          request: PaymentRequest;
          title?: string;
          description?: string;
          amount?: number;
          currency?: string;
          requestedFromId?: number;
          requestedFromName?: string;
          dueDate?: string;
          fileName?: string;
          requestId?: number;
          status?: 'pending_approval' | 'confirmed' | 'rejected' | 'paid';
     };

     RequestDetail: {
          request: PaymentRequest;
          title?: string;
          amount?: number;
          currency?: string;
          date?: string;
          dueDate?: string;
          status?: "Pending Approval" | "Confirmed" | "Rejected" | "Paid";
          requesterName?: string;
          payerName?: string;
     };


     Tasks: undefined;
     ChildProfile: { child: any };
     Documents: {
          chatId: string;
          conversationId: string;
     };

     //Settings stuff
     UserProfile: undefined;
     ChildEdit: { child: any };
     UserEdit: undefined;
     NotisSettings: undefined;

     Premium: undefined;
     ActivePlans: undefined;
     SelectPlan: { planType: 'monthly' | 'yearly' };
     Subscribe: { planType: 'monthly' | 'yearly' };

     GiftRefer: undefined;
     ForgotPassword: undefined;
     TermsPrivacy: { page: 'terms' | 'privacy' };
};

export type AddPaymentExpenseData = {
     // Core expense data
     id: number;
     description: string;
     amount: number;
     date: string;

     // Reimburser details
     reimburser_id: number | null;
     reimburser_name: string;
     reimburser_percentage: string;

     // Payment details
     payment_description: string;
     receipt_url: string | null;

     // Child/context info
     child_id: number;
     child_name: string;
     category: string | null;
     category_icon: string | null;

     // Status info
     status: 'pending' | 'confirmed' | 'rejected';
     created_at?: string;

     // For display in AddPayment screen
     payer: {
          id: number | null;
          name: string;
     }
};