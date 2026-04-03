import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCorePlanHandlers } from '@/hooks/goals/useCorePlan';
import { goalCategoryApi } from '@/services/goalService';
import { Card, Grid, Text, Loading, Button, Modal, Input, Textarea } from '@nextui-org/react';

const GoalsPage: NextPage = () => {
     const router = useRouter();
     const {
          coreValues,
          goals,
          loading,
          error,
          activeTab,
          ageGroups,
          fetchCoreValues,
          handleTabChange,
          handleCardClick,
     } = useCorePlanHandlers('3-5');

     const [addModalOpen, setAddModalOpen] = useState(false);
     const [formName, setFormName] = useState('');
     const [formDescription, setFormDescription] = useState('');
     const [formIcon, setFormIcon] = useState('');
     const [formColor, setFormColor] = useState('');
     const [formAgeGroup, setFormAgeGroup] = useState('3-5');
     const [submitting, setSubmitting] = useState(false);

     useEffect(() => {
          fetchCoreValues();
     }, [fetchCoreValues]);

     const onCardClick = (coreValue: any) => {
          router.push(`/goals/${coreValue.id}`);
     };

     const handleAddCategory = async () => {
          if (!formName.trim()) return;
          setSubmitting(true);
          try {
               await goalCategoryApi.create({
                    name: formName.trim(),
                    description: formDescription.trim() || undefined,
                    icon: formIcon.trim() || undefined,
                    color: formColor.trim() || undefined,
                    age_group: formAgeGroup,
               } as any);
               setAddModalOpen(false);
               setFormName('');
               setFormDescription('');
               setFormIcon('');
               setFormColor('');
               setFormAgeGroup('3-5');
               fetchCoreValues();
          } catch (err) {
               console.error('Failed to create category:', err);
          } finally {
               setSubmitting(false);
          }
     };

     const handleDeleteCategory = async (id: number) => {
          if (!window.confirm('Are you sure you want to delete this category?')) return;
          try {
               await goalCategoryApi.delete(id);
               fetchCoreValues();
          } catch (err) {
               console.error('Failed to delete category:', err);
          }
     };

     return (
          <div>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <Text h3 css={{ m: 0 }}>Goals</Text>
                    <Button auto shadow color="primary" onPress={() => setAddModalOpen(true)}>
                         + Add Category
                    </Button>
               </div>

               {/* Age Group Tabs */}
               <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    {ageGroups.map((group) => (
                         <Button
                              key={group}
                              auto
                              flat={activeTab !== group}
                              color={activeTab === group ? "primary" : "default"}
                              onPress={() => handleTabChange(group)}
                              size="sm"
                         >
                              {group}
                         </Button>
                    ))}
               </div>

               {/* Error Display */}
               {error && (
                    <Text color="error" css={{ marginBottom: '1rem' }}>
                         Error: {error}
                    </Text>
               )}

               {/* Core Values Grid */}
               <Grid.Container gap={2}>
                    {loading && coreValues.length === 0 ? (
                         <Grid xs={12} css={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                              <Loading size="xl" />
                         </Grid>
                    ) : coreValues.length === 0 ? (
                         <Grid xs={12} css={{ textAlign: 'center', padding: '2rem' }}>
                              <Text>No core values found for this age group</Text>
                         </Grid>
                    ) : (
                         coreValues.map((cv) => (
                              <Grid key={cv.id} xs={12} sm={6} md={4}>
                                   <div style={{ position: 'relative', width: '100%' }}>
                                        <Button
                                             auto
                                             size="xs"
                                             color="error"
                                             flat
                                             css={{
                                                  position: 'absolute',
                                                  top: 8,
                                                  right: 8,
                                                  zIndex: 10,
                                                  minWidth: 'auto',
                                                  px: '$4',
                                             }}
                                             onPress={() => handleDeleteCategory(cv.id)}
                                        >
                                             ✕
                                        </Button>
                                        <Card
                                             isPressable
                                             onClick={() => onCardClick(cv)}
                                             css={{
                                                  backgroundColor: cv.color,
                                                  color: cv.iconColor || '$white',
                                                  padding: '$6',
                                                  borderRadius: '$xl',
                                                  minHeight: '200px',
                                                  transition: 'transform 0.2s',
                                                  '&:hover': {
                                                       transform: 'scale(1.02)',
                                                       boxShadow: '$lg',
                                                  },
                                             }}
                                        >
                                             <Card.Body css={{
                                                  textAlign: 'center',
                                                  display: 'flex',
                                                  flexDirection: 'column',
                                                  gap: '$4',
                                                  justifyContent: 'center',
                                                  alignItems: 'center'
                                             }}>
                                                  <Text css={{
                                                       color: '$black',
                                                       fontWeight: '$bold'
                                                  }} h4>
                                                       {cv.title || cv.name}
                                                  </Text>
                                                  <Text css={{ color: '$black' }}>
                                                       {cv.description}
                                                  </Text>
                                             </Card.Body>
                                        </Card>
                                   </div>
                              </Grid>
                         ))
                    )}
               </Grid.Container>

               {/* Loading indicator for goals fetch */}
               {loading && goals.length > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                         <Loading size="md" />
                    </div>
               )}

               {/* Add Category Modal */}
               <Modal
                    open={addModalOpen}
                    onClose={() => setAddModalOpen(false)}
                    closeButton
                    aria-labelledby="add-category-modal"
               >
                    <Modal.Header>
                         <Text h4 id="add-category-modal">Add Category</Text>
                    </Modal.Header>
                    <Modal.Body>
                         <Input
                              fullWidth
                              bordered
                              label="Name"
                              placeholder="Category name"
                              value={formName}
                              onChange={(e) => setFormName(e.target.value)}
                              required
                         />
                         <Textarea
                              fullWidth
                              bordered
                              label="Description"
                              placeholder="Category description"
                              value={formDescription}
                              onChange={(e) => setFormDescription(e.target.value)}
                         />
                         <Input
                              fullWidth
                              bordered
                              label="Icon"
                              placeholder="Icon name (optional)"
                              value={formIcon}
                              onChange={(e) => setFormIcon(e.target.value)}
                         />
                         <Input
                              fullWidth
                              bordered
                              label="Color"
                              placeholder="#ffffff"
                              value={formColor}
                              onChange={(e) => setFormColor(e.target.value)}
                         />
                         <div>
                              <Text size="$xs" css={{ mb: '$2', ml: '$2' }}>Age Group</Text>
                              <select
                                   value={formAgeGroup}
                                   onChange={(e) => setFormAgeGroup(e.target.value)}
                                   style={{
                                        width: '100%',
                                        height: '40px',
                                        border: '2px solid #e0e0e0',
                                        borderRadius: '12px',
                                        padding: '0 12px',
                                        fontFamily: 'inherit',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        outline: 'none',
                                   }}
                              >
                                   <option value="3-5">3-5</option>
                                   <option value="6-9">6-9</option>
                                   <option value="9-12">9-12</option>
                                   <option value="13+">13+</option>
                              </select>
                         </div>
                    </Modal.Body>
                    <Modal.Footer>
                         <Button auto flat color="error" onPress={() => setAddModalOpen(false)}>
                              Cancel
                         </Button>
                         <Button auto shadow color="primary" onPress={handleAddCategory} disabled={submitting || !formName.trim()}>
                              {submitting ? <Loading size="xs" /> : 'Create'}
                         </Button>
                    </Modal.Footer>
               </Modal>
          </div>
     );
};

export default GoalsPage;
