import { ReactNode } from "react";

export interface Reward {
    claimed: any;
    image: ReactNode;
    name: ReactNode;
    pointsRequired: number;
    id: string;
    user_id: string;
    title: string;
    description: string;
    icon: string;
    created_at: string;
    milestone_id?: string;
    project_id?: string;
    seen: boolean;
    points_value: number;
}

export interface ChildPoints {
    currentPoints: number;
    totalPointsEarned: number;
    stickers: string[];
}


// types/goalApi.ts
export type ChildGoal = {
    id: number;
    goal_id: number;
    child_id: number;
    current_progress: number;
    start_date: string;
    target_end_date: string;
    actual_end_date: string | null;
    status: 'working_on' | 'mastered' | 'behind' | 'try_again' | 'expired';
    days_remaining: number;
    certificate_generated: boolean;
    certificate_url: string | null;
    assigned_by: number;
    updated_by: number | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;

    // Assignment overrides (these override the template goal fields)
    title?: string;
    description?: string | null;
    smart_specific?: string;
    smart_measurable?: string;
    smart_achievable?: string;
    smart_relevant?: string;
    time_bound_count?: number;
    time_bound_period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    time_bound_value?: number;
    total_target?: number;
    reward_name?: string | null;
    notes?: string | null;
    is_active?: boolean;

    // Nested goal template
    goal: {
        id: number;
        goal_template_id: number | null;
        goal_category_id: number;
        user_id: number;
        title: string;
        description: string | null;
        is_custom: boolean;
        smart_specific: string;
        smart_measurable: string;
        smart_achievable: string;
        smart_relevant: string;
        time_bound_count: number;
        time_bound_period: string;
        time_bound_value: number;
        total_target: number;
        reward_name: string | null;
        notes: string | null;
        save_to_coreplan: boolean;
        status: string;
        added_by: number | null;
        updated_by: number | null;
        created_at: string;
        updated_at: string;
        deleted_at: string | null;
        category: GoalCategory;
        template: any | null;
    };

    // Additional nested data
    progress_logs: any[];
    reminders: any[];
    certificate: any | null;

    // Optional fields for API response structure
    count?: number;
    length?: number;
};

// Supporting types
export type GoalCategory = {
    id: number;
    name: string;
    description: string;
    icon: string;
    color: string;
    age_group: string;
    order: number;
    is_active: boolean;
    added_by: number;
    updated_by: number | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
};

export type ChildGoalsResponse = {
    child: {
        id: number;
        name: string;
        dob: string;
        gender: string;
        photo: string | null;
        child_interest: string[];
        notes: string | null;
        added_by: number;
        updated_by: number;
        created_at: string;
        updated_at: string;
        deleted_at: string | null;
    };
    goals: ChildGoal[];
    grouped: {
        working_on: ChildGoal[];
        behind: ChildGoal[];
        mastered: ChildGoal[];
        try_again: ChildGoal[];
    };
    stats: {
        total: number;
        working_on: number;
        behind: number;
        mastered: number;
        try_again: number;
    };
};

// Helper type to get assignment-overridden values
export type ChildGoalWithOverrides = ChildGoal & {
    // These fields will use assignment values if available, otherwise fallback to goal template
    resolvedTitle: string;
    resolvedDescription: string | null;
    resolvedSmartSpecific: string;
    resolvedSmartMeasurable: string;
    resolvedSmartAchievable: string;
    resolvedSmartRelevant: string;
    resolvedTimeBoundCount: number;
    resolvedTimeBoundPeriod: string;
    resolvedTimeBoundValue: number;
    resolvedTotalTarget: number;
    resolvedRewardName: string | null;
    resolvedNotes: string | null;
};

// Utility function to get resolved values from a ChildGoal
export const getResolvedChildGoal = (childGoal: ChildGoal): ChildGoalWithOverrides => {
    return {
        ...childGoal,
        resolvedTitle: childGoal.title || childGoal.goal.title,
        resolvedDescription: childGoal.description || childGoal.goal.description,
        resolvedSmartSpecific: childGoal.smart_specific || childGoal.goal.smart_specific,
        resolvedSmartMeasurable: childGoal.smart_measurable || childGoal.goal.smart_measurable,
        resolvedSmartAchievable: childGoal.smart_achievable || childGoal.goal.smart_achievable,
        resolvedSmartRelevant: childGoal.smart_relevant || childGoal.goal.smart_relevant,
        resolvedTimeBoundCount: childGoal.time_bound_count || childGoal.goal.time_bound_count,
        resolvedTimeBoundPeriod: childGoal.time_bound_period || childGoal.goal.time_bound_period,
        resolvedTimeBoundValue: childGoal.time_bound_value || childGoal.goal.time_bound_value,
        resolvedTotalTarget: childGoal.total_target || childGoal.goal.total_target,
        resolvedRewardName: childGoal.reward_name || childGoal.goal.reward_name,
        resolvedNotes: childGoal.notes || childGoal.goal.notes,
    };
};