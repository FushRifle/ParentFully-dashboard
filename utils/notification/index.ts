type BaseNotificationPayload = {
     createNotification: (payload: any) => Promise<any>
}

type GoalNotificationInput = {
     goalId: number
     categoryId?: number
     goalText?: string
     childIds: number[]
     getChildName: (id: number) => string
     actorName?: string
}

type ExpenseNotificationInput = {
     expenseId: number
     amount: number
     category: string
     childIds: number[]
     reimburserName?: string | null
     getChildName: (id: number) => string
     actorName?: string
}

type GoalAssignedNotificationInput = {
     goalId: number
     childIds: number[]
     getChildName: (id: number) => string
     createNotification: (payload: any) => Promise<any>
     actorName?: string
}

export const notifyGoalAssignedToChildren = async ({
     goalId,
     childIds,
     getChildName,
     createNotification,
     actorName = 'You',
}: GoalAssignedNotificationInput) => {
     const childNames = childIds.map(getChildName).join(' & ')

     const messageParts = [
          actorName,
          'assigned a goal',
          childNames ? `to ${childNames}.` : null,
     ].filter(Boolean)

     const message = messageParts.join(' ')

     return createNotification({
          type: 'goal_assigned',
          title: 'Goal Assigned',
          message,
          notifiable_type: 'App\\Models\\Goal',
          notifiable_id: goalId,
          data: {
               goal_id: goalId,
               child_ids: childIds,
          },
     })
}

export const notifyGoalCreated = async (
     input: GoalNotificationInput & BaseNotificationPayload
) => {
     const {
          goalId,
          categoryId,
          goalText,
          childIds,
          getChildName,
          createNotification,
          actorName = 'You',
     } = input

     const childNames = childIds.map(getChildName).join(' & ')

     const messageParts = [
          actorName,
          'created a new goal',
          childNames ? `for ${childNames}.` : null,
          goalText ? `"${goalText}"` : null,
     ].filter(Boolean)

     const message = messageParts.join(' ')

     return createNotification({
          type: 'goal_created',
          title: 'New Goal Created',
          message,
          notifiable_type: 'App\\Models\\Goal',
          notifiable_id: goalId,
          data: {
               goal_id: goalId,
               category_id: categoryId,
               child_ids: childIds,
          },
     })
}

export const notifyExpenseCreated = async (
     input: ExpenseNotificationInput & BaseNotificationPayload
) => {
     const {
          expenseId,
          amount,
          category,
          childIds,
          reimburserName,
          getChildName,
          createNotification,
          actorName = 'You',
     } = input

     const childNames = childIds.map(getChildName).join(' & ')

     const messageParts = [
          actorName,
          'added an expense',
          childNames ? `for ${childNames}.` : null,
          reimburserName ? `And the expense will be reimbursed by ${reimburserName}.` : null,
     ].filter(Boolean)

     const message = messageParts.join(' ')

     return createNotification({
          type: 'expense_created',
          title: 'New Expense Added',
          message,
          notifiable_type: 'App\\Models\\Expense',
          notifiable_id: expenseId,
          data: {
               expense_id: expenseId,
               amount,
               category,
               child_ids: childIds,
          },
     })
}
