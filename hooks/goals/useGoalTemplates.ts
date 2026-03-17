import { useState, useCallback, useEffect } from 'react'
import { goalApi } from '@/services/goalService'
import type { CoreValue, Goal } from '@/types/api'

export const usePlanDetailsHandlers = (coreValue: CoreValue, ageGroup: string, userId?: number) => {
    const [goals, setGoals] = useState<{ userGoals: Goal[]; predefinedGoals: Goal[] }>({
        userGoals: [],
        predefinedGoals: [],
    })
    const [loading, setLoading] = useState(true)

    const fetchGoals = useCallback(async () => {
        if (!coreValue?.id || !ageGroup) {
            console.warn('fetchGoals: Missing coreValue.id or ageGroup')
            return
        }

        setLoading(true)
        try {
            const allGoals = await goalApi.getAll(Number(coreValue.id))
            const goalsArray = Array.isArray(allGoals) ? allGoals : []

            const userGoals = goalsArray.filter(goal => goal.user_id !== null && goal.user_id !== undefined)
            const predefinedGoals = goalsArray.filter(goal =>
                (goal.is_default === true || goal.user_id === null || goal.user_id === undefined) &&
                !goal.user_id
            )

            setGoals({
                userGoals,
                predefinedGoals,
            })
        } catch (error) {
            console.error('fetchGoals: failed', error)
            setGoals({ userGoals: [], predefinedGoals: [] })
        } finally {
            setLoading(false)
        }
    }, [coreValue?.id, ageGroup, userId])

    useEffect(() => {
        fetchGoals()
    }, [fetchGoals])

    return { goals, loading, fetchGoals }
}