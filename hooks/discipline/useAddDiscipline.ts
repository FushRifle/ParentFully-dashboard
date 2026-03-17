import { useState, useCallback } from "react";
import { Alert } from "react-native";
import { createPlan, createRule, assignPlanToChild } from "@/services/disciplineService";
import { ChildData, DisciplinePlan, Rule } from '@/types/api';
import { getChildren } from "@/services/childService";

interface RuleFormData {
     name: string;
     consiquences: string;
     notes: string;
}

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

export const useRuleManagement = () => {
     const [rules, setRules] = useState<RuleFormData[]>([
          { name: "", consiquences: "", notes: "" },
     ]);

     const handleUpdateRule = useCallback((
          index: number,
          field: keyof RuleFormData,
          value: string
     ) => {
          setRules(prev => {
               const updated = [...prev];
               updated[index] = {
                    ...updated[index],
                    [field]: value
               };
               return updated;
          });
     }, []);

     const addRule = useCallback(() => {
          setRules(prev => [...prev, { name: "", consiquences: "", notes: "" }]);
     }, []);

     const removeRule = useCallback((index: number) => {
          if (rules.length > 1) {
               setRules(prev => prev.filter((_, i) => i !== index));
          }
     }, [rules.length]);

     const validateRules = useCallback((): boolean => {
          const hasValidRules = rules.some(rule => rule.name.trim() !== "");
          if (!hasValidRules) {
               Alert.alert("Error", "Please add at least one rule with a name");
               return false;
          }
          return true;
     }, [rules]);

     const resetRules = useCallback(() => {
          setRules([{ name: "", consiquences: "", notes: "" }]);
     }, []);

     return {
          rules,
          setRules,
          handleUpdateRule,
          addRule,
          removeRule,
          validateRules,
          resetRules
     };
};

export const usePlanCreation = () => {
     const [planName, setPlanName] = useState("");
     const [description, setDescription] = useState("");
     const [createdPlanId, setCreatedPlanId] = useState<number | null>(null);
     const [savingPlan, setSavingPlan] = useState(false);

     const createDisciplinePlan = async (rules: RuleFormData[]): Promise<number | null> => {
          if (!planName.trim()) {
               Alert.alert("Error", "Please enter a plan name");
               return null;
          }

          const hasValidRules = rules.some(rule => rule.name.trim() !== "");
          if (!hasValidRules) {
               Alert.alert("Error", "Please add at least one rule with a name");
               return null;
          }

          try {
               setSavingPlan(true);
               const planData: Partial<DisciplinePlan> = {
                    name: planName.trim(),
                    description: description.trim() || undefined,
                    notes: undefined,
                    type: 'custom'
               };
               const newPlan = await createPlan(planData);
               const rulePromises = rules
                    .filter(rule => rule.name.trim() !== "")
                    .map(rule =>
                         createRule({
                              plan_id: newPlan.id,
                              name: rule.name.trim(),
                              consiquences: rule.consiquences?.trim() || "",
                              notes: rule.notes?.trim() || "",
                         })
                    );

               if (rulePromises.length === 0) {
                    throw new Error("No valid rules to save");
               }

               await Promise.all(rulePromises);
               return newPlan.id;
          } catch (error) {
               console.error("Error creating discipline plan:", error);
               Alert.alert(
                    "Error",
                    error instanceof Error ? error.message : "Failed to create discipline plan"
               );
               return null;
          } finally {
               setSavingPlan(false);
          }
     };

     const resetPlan = useCallback(() => {
          setPlanName("");
          setDescription("");
          setCreatedPlanId(null);
     }, []);

     return {
          planName,
          setPlanName,
          description,
          setDescription,
          createdPlanId,
          setCreatedPlanId,
          savingPlan,
          createDisciplinePlan,
          resetPlan
     };
};