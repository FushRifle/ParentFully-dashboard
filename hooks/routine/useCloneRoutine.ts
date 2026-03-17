import { useEffect } from "react";
import { supabase } from "@/supabase/client";

export const useClonePredefinedRoutines = (userId?: string) => {
     useEffect(() => {
          if (!userId) return;

          const cloneRoutines = async () => {
               try {
                    // Fetch all predefined routines
                    const { data: templates, error: templateError } = await supabase
                         .from("routine_templates")
                         .select("*")
                         .eq("is_preloaded", true);

                    if (templateError) throw templateError;
                    if (!templates?.length) return;

                    for (const template of templates) {
                         // Insert cloned routine for the user
                         const { data: clonedRoutine, error: insertRoutineError } = await supabase
                              .from("user_routines")
                              .insert({
                                   user_id: userId,
                                   name: template.name,
                                   description: template.description,
                                   icon: template.icon,
                                   age_range: template.age_range,
                                   notes: template.notes,
                                   categories: template.categories,
                                   created_at: new Date().toISOString(),
                              })
                              .select()
                              .single();

                         if (insertRoutineError || !clonedRoutine) throw insertRoutineError;

                         // Fetch tasks for the template
                         const { data: tasks, error: taskError } = await supabase
                              .from("routine_template_tasks")
                              .select("*")
                              .eq("routine_id", template.id);

                         if (taskError) throw taskError;

                         if (tasks?.length) {
                              // Clone tasks for the new user routine
                              const clonedTasks = tasks.map((t) => ({
                                   user_routine_id: clonedRoutine.id,
                                   user_id: userId,
                                   title: t.title,
                                   description: t.description,
                                   time_slot: t.time_slot,
                                   priority: t.priority,
                                   duration_minutes: t.duration_minutes,
                                   icon: t.icon,
                                   category: t.category,
                                   order_index: t.order_index,
                                   created_at: new Date().toISOString(),
                              }));

                              const { error: insertTasksError } = await supabase
                                   .from("user_routine_tasks")
                                   .insert(clonedTasks);

                              if (insertTasksError) throw insertTasksError;
                         }
                    }

                    console.log("✅ Predefined routines cloned for user:", userId);
               } catch (err) {
                    console.error("❌ Failed to clone predefined routines:", err);
               }
          };

          cloneRoutines();
     }, [userId]);
};
