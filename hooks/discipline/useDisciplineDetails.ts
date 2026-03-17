import { useCallback, useState, useMemo } from "react";
import { Dimensions, PixelRatio, Alert } from "react-native";
import {
     getPlans, getRules,
     updateRule, deleteRule, updatePlan
} from "@/services/disciplineService";
import { getChildren } from "@/services/childService";
import { Rule, ChildData } from '@/types/api';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

export const useScalingUtils = () => {
     return useMemo(() => ({
          scale: (size: number) => (SCREEN_WIDTH / BASE_WIDTH) * size,
          verticalScale: (size: number) => (SCREEN_HEIGHT / BASE_HEIGHT) * size,
          moderateScale: (size: number, factor = 0.5) => size + ((SCREEN_WIDTH / BASE_WIDTH) * size - size) * factor,
          scaleFont: (size: number) => Math.round(PixelRatio.roundToNearestPixel((SCREEN_WIDTH / BASE_WIDTH) * size))
     }), []);
};

export const usePlanData = (planId: number, initialName: string, initialDescription: string) => {
     const [planName, setPlanName] = useState(initialName);
     const [planDescription, setPlanDescription] = useState(initialDescription || "");
     const [rules, setRules] = useState<Rule[]>([]);
     const [originalRules, setOriginalRules] = useState<Rule[]>([]);
     const [loading, setLoading] = useState(true);

     const fetchPlanDetails = useCallback(async () => {
          if (!planId) return;

          try {
               setLoading(true);
               const [plans, planRules] = await Promise.all([
                    getPlans(),
                    getRules(planId)
               ]);

               const currentPlan = plans.find(plan => plan.id === planId);
               if (currentPlan) {
                    setPlanName(currentPlan.name);
                    setPlanDescription(currentPlan.description || "");
               }

               setRules(planRules);
               setOriginalRules(planRules);
          } catch (error) {
               console.error("Error fetching plan details:", error);
               Alert.alert("Error", "Failed to load plan details");
          } finally {
               setLoading(false);
          }
     }, [planId]);

     const resetPlanData = useCallback(() => {
          setPlanName(initialName);
          setPlanDescription(initialDescription || "");
          setRules(originalRules);
     }, [initialName, initialDescription, originalRules]);

     return {
          planName,
          setPlanName,
          planDescription,
          setPlanDescription,
          rules,
          setRules,
          originalRules,
          loading,
          setLoading,
          fetchPlanDetails,
          resetPlanData
     };
};

export const useChildrenData = (userId?: number) => {
     const [children, setChildren] = useState<ChildData[]>([]);
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState<string | null>(null);

     const fetchChildren = useCallback(async () => {
          try {
               setLoading(true);
               setError(null);
               const childrenData = await getChildren();
               setChildren(childrenData as ChildData[]);
          } catch (err: any) {
               console.error("Error fetching children:", err?.message ?? err);
               setError("Failed to load children");
          } finally {
               setLoading(false);
          }
     }, [userId]);

     return {
          children,
          loading,
          error,
          fetchChildren
     };
};

export const useRuleManagement = (planId: number, rules: Rule[], setRules: React.Dispatch<React.SetStateAction<Rule[]>>) => {
     const handleAddRule = useCallback(() => {
          const newRule: Rule = {
               id: Date.now(),
               plan_id: planId,
               name: "",
               consiquences: "",
               notes: "",
               length: 0
          };
          setRules(prev => [...prev, newRule]);
     }, [planId, setRules]);

     const handleRemoveRule = useCallback(async (index: number) => {
          if (rules.length <= 1) {
               Alert.alert("Error", "At least one rule is required");
               return;
          }

          const ruleToRemove = rules[index];
          if (ruleToRemove.id > 0 && ruleToRemove.id < 1000000000) {
               Alert.alert(
                    "Delete Rule",
                    "Are you sure you want to delete this rule?",
                    [
                         { text: "Cancel", style: "cancel" },
                         {
                              text: "Delete",
                              style: "destructive",
                              onPress: async () => {
                                   try {
                                        await deleteRule(ruleToRemove.id);
                                        setRules(prev => prev.filter((_, i) => i !== index));
                                   } catch (error) {
                                        console.error("Error deleting rule:", error);
                                        Alert.alert("Error", "Failed to delete rule");
                                   }
                              }
                         }
                    ]
               );
          } else {
               setRules(prev => prev.filter((_, i) => i !== index));
          }
     }, [rules, setRules]);

     const handleUpdateRule = useCallback((
          index: number,
          field: keyof Rule,
          value: string
     ) => {
          setRules(prev =>
               prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
          );
     }, [setRules]);

     return {
          handleAddRule,
          handleRemoveRule,
          handleUpdateRule
     };
};