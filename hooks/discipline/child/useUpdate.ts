import { useCallback, useState, useMemo } from "react";
import { Alert } from "react-native";
import { useChildPlanDetails, type Rule } from './useChildDiscipline';
import { createCustomizedChildRule } from '@/services/Child-Specific/disciplineService';

export const usePlanRules = (planId: number, initialPlanName: string) => {
     const {
          plan,
          loading,
          saving,
          handleUpdatePlan,
          handleUpdateRule,
          handleDeleteRule,
          refetch
     } = useChildPlanDetails(planId);

     const [isEditing, setIsEditing] = useState(false);
     const [editingRules, setEditingRules] = useState<{ [key: number]: Partial<Rule> }>({});
     const [editingPlanName, setEditingPlanName] = useState<string>('');
     const [editingPlanDescription, setEditingPlanDescription] = useState<string>('');
     const [newRules, setNewRules] = useState<Rule[]>([]);
     const [rulesToDelete, setRulesToDelete] = useState<number[]>([]);
     const [successModalVisible, setSuccessModalVisible] = useState(false);

     const rules = plan?.rules || [];
     const planName = plan?.name || initialPlanName;
     const planDescription = plan?.description || '';
     const currentPlanName = editingPlanName || planName;
     const currentPlanDescription = editingPlanDescription || planDescription;

     const allRules = useMemo(() => {
          return [...rules, ...newRules];
     }, [rules, newRules]);

     const hasValidRules = useMemo(() =>
          allRules.some(rule => {
               if (rulesToDelete.includes(rule.id)) return false;
               const editingRule = editingRules[rule.id];
               const currentName = editingRule?.name !== undefined ? editingRule.name : rule.name;
               return currentName.trim() !== "";
          }),
          [allRules, editingRules, rulesToDelete]
     );

     const hasChanges = useMemo(() =>
          Object.keys(editingRules).length > 0 ||
          editingPlanName !== '' ||
          editingPlanDescription !== '' ||
          newRules.length > 0 ||
          rulesToDelete.length > 0,
          [editingRules, editingPlanName, editingPlanDescription, newRules, rulesToDelete]
     );

     const sortedRules = useMemo(() => {
          const filteredRules = allRules.filter(rule => !rulesToDelete.includes(rule.id));
          return [...filteredRules].sort((a, b) => a.name.localeCompare(b.name));
     }, [allRules, rulesToDelete]);

     const handleAddRule = useCallback(() => {
          const newRule: Rule = {
               id: Date.now(),
               plan_id: planId,
               name: '',
               consiquences: '',
               notes: '',
               length: 1
          };
          setNewRules(prev => [...prev, newRule]);
     }, [planId]);

     const handleUpdateRuleField = useCallback((ruleId: number, field: keyof Rule, value: string | number) => {
          setEditingRules(prev => ({
               ...prev,
               [ruleId]: {
                    ...prev[ruleId],
                    [field]: value
               }
          }));
     }, []);

     const handleCancelRule = useCallback((ruleId: number) => {
          const isNewRule = newRules.some(rule => rule.id === ruleId);
          if (isNewRule) {
               setNewRules(prev => prev.filter(rule => rule.id !== ruleId));
          } else {
               setEditingRules(prev => {
                    const newState = { ...prev };
                    delete newState[ruleId];
                    return newState;
               });
          }
     }, [newRules]);

     const handleDeleteRuleClick = useCallback((ruleId: number) => {
          const isNewRule = newRules.some(rule => rule.id === ruleId);
          if (isNewRule) {
               setNewRules(prev => prev.filter(rule => rule.id !== ruleId));
               return;
          }

          Alert.alert(
               'Delete Rule',
               'Are you sure you want to delete this rule?',
               [
                    { text: 'Cancel', style: 'cancel' },
                    {
                         text: 'Delete',
                         style: 'destructive',
                         onPress: () => {
                              setRulesToDelete(prev => [...prev, ruleId]);
                         }
                    }
               ]
          );
     }, [newRules]);

     const handleSaveAllChanges = useCallback(async () => {
          if (!isEditing) {
               setIsEditing(true);
               setEditingPlanName(planName);
               setEditingPlanDescription(planDescription);
               return;
          }

          if (!currentPlanName.trim()) {
               Alert.alert('Error', 'Plan name is required');
               return;
          }

          if (!hasValidRules) {
               Alert.alert('Error', 'Please add at least one rule with a name');
               return;
          }

          try {
               if (
                    (editingPlanName !== '' && editingPlanName !== planName) ||
                    (editingPlanDescription !== '' && editingPlanDescription !== planDescription)
               ) {
                    await handleUpdatePlan({
                         name: editingPlanName.trim(),
                         description: editingPlanDescription.trim()
                    });
               }

               for (const ruleId of rulesToDelete) {
                    await handleDeleteRule(ruleId);
               }

               const existingRuleUpdates = Object.entries(editingRules)
                    .filter(([ruleId]) => {
                         const id = Number(ruleId);
                         return !newRules.some(rule => rule.id === id) && !rulesToDelete.includes(id);
                    })
                    .map(([ruleId, ruleChanges]) =>
                         handleUpdateRule(Number(ruleId), ruleChanges)
                    );

               await Promise.all(existingRuleUpdates);

               for (const newRule of newRules) {
                    const ruleChanges = editingRules[newRule.id] || {};
                    const ruleData = {
                         name: (ruleChanges.name || newRule.name)?.trim() || '',
                         consiquences: (ruleChanges.consiquences || newRule.consiquences)?.trim() || '',
                         notes: (ruleChanges.notes || newRule.notes)?.trim() || '',
                         length: ruleChanges.length || newRule.length || 1
                    };

                    if (ruleData.name) {
                         await createCustomizedChildRule(planId, ruleData);
                    }
               }

               await refetch();

               setEditingPlanName('');
               setEditingPlanDescription('');
               setEditingRules({});
               setNewRules([]);
               setRulesToDelete([]);
               setIsEditing(false);
               setSuccessModalVisible(true);
          } catch (error: any) {
               console.error('Failed to save changes:', error);
               Alert.alert('Error', 'Failed to save some changes. Please try again.');
          }
     }, [
          isEditing,
          editingRules,
          editingPlanName,
          editingPlanDescription,
          planName,
          planDescription,
          currentPlanName,
          currentPlanDescription,
          hasValidRules,
          handleUpdatePlan,
          handleUpdateRule,
          handleDeleteRule,
          refetch,
          newRules,
          rulesToDelete,
          planId
     ]);

     const handleCancelEdit = useCallback(() => {
          if (hasChanges) {
               Alert.alert(
                    'Discard Changes?',
                    'You have unsaved changes. Are you sure you want to discard them?',
                    [
                         { text: 'Keep Editing', style: 'cancel' },
                         {
                              text: 'Discard',
                              style: 'destructive',
                              onPress: () => {
                                   setEditingRules({});
                                   setEditingPlanName('');
                                   setEditingPlanDescription('');
                                   setNewRules([]);
                                   setRulesToDelete([]);
                                   setIsEditing(false);
                              }
                         }
                    ]
               );
          } else {
               setIsEditing(false);
               setEditingPlanName('');
               setEditingPlanDescription('');
          }
     }, [hasChanges]);

     const handlePlanNameChange = useCallback((value: string) => {
          setEditingPlanName(value);
     }, []);

     const handlePlanDescriptionChange = useCallback((value: string) => {
          setEditingPlanDescription(value);
     }, []);

     const handleCloseSuccessModal = useCallback((navigation: any) => {
          setSuccessModalVisible(false);
          navigation.goBack();
     }, []);

     return {
          plan,
          loading,
          saving,
          isEditing,
          setIsEditing,
          editingRules,
          currentPlanName,
          currentPlanDescription,
          sortedRules,
          hasChanges,
          hasValidRules,
          successModalVisible,
          newRules,

          handleAddRule,
          handleUpdateRuleField,
          handleCancelRule,
          handleDeleteRuleClick,
          handleSaveAllChanges,
          handleCancelEdit,
          handlePlanNameChange,
          handlePlanDescriptionChange,
          handleCloseSuccessModal,
          refetch
     };
};
