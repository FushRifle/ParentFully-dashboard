import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import type { GoalPayload } from '@/types/api';
import { useGoalDetails } from '@/hooks/goals/useGoalsDetails';
import {
     Container,
     Card,
     Text,
     Loading,
     Button,
     Grid,
     Input,
     Textarea,
     Row,
     Col,
     Spacer,
     Badge
} from '@nextui-org/react';

interface SmartFieldProps {
     label: string;
     value?: string | null;
     isEditing: boolean;
     onChange: (value: string) => void;
     placeholder?: string;
}

interface SectionHeaderProps {
     children: React.ReactNode;
     icon?: React.ReactNode;
     css?: React.CSSProperties;
}

const SmartField: React.FC<SmartFieldProps> = ({
     label,
     value,
     isEditing,
     onChange,
     placeholder
}) => (
     <Grid xs={12} sm={6}>
          <Card
               variant="flat"
               css={{
                    p: '$6',
                    h: '100%',
                    bg: '$accents0',
                    transition: 'transform 0.2s ease',
                    '&:hover': { transform: isEditing ? 'none' : 'translateY(-2px)' }
               }}
          >
               <Text
                    h5
                    size={12}
                    transform="uppercase"
                    css={{ color: '$primary', mb: '$2', ls: '1px', fontWeight: '$bold' }}
               >
                    {label}
               </Text>

               {isEditing ? (
                    <Textarea
                         fullWidth
                         bordered
                         color="primary"
                         size="sm"
                         placeholder={placeholder || `Describe how this is ${label.toLowerCase()}...`}
                         value={value || ''}
                         onChange={(e) => onChange(e.target.value)}
                         rows={3}
                         css={{ mt: '$2' }}
                    />
               ) : (
                    <Text
                         color={value ? "$accents9" : "$accents5"}
                         css={{ lineHeight: '$base' }}
                    >
                         {value || 'Not specified'}
                    </Text>
               )}
          </Card>
     </Grid>
);

const SectionHeader: React.FC<SectionHeaderProps> = ({ children, icon, css = {} }) => (
     <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px',
          marginTop: '16px',
          ...css
     }}>
          {icon && <span style={{ fontSize: '1.5rem' }}>{icon}</span>}
          <Text
               h3
               css={{
                    m: 0,
                    fontWeight: '$semibold',
                    letterSpacing: '-0.02em'
               }}
          >
               {children}
          </Text>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #eaeaea, transparent)', marginLeft: '8px' }} />
     </div>
);

const GoalDetailsPage: NextPage = () => {
     const router = useRouter();
     const { id } = router.query;

     const {
          fetchedGoal: goal,
          isEditing,
          setIsEditing,
          apiLoading,
          profileLoading,
          frequencyCount,
          setFrequencyCount,
          frequencyDuration,
          setFrequencyDuration,
          frequencyUnit,
          setFrequencyUnit,
          reward,
          updateRewardField,
          handleSave,
          handleCancelEdit,
          goBack,
     } = useGoalDetails({
          goalId: id ? parseInt(id as string) : undefined
     });

     const [editedGoal, setEditedGoal] = useState<Partial<GoalPayload>>({});

     useEffect(() => {
          if (goal) {
               setEditedGoal({
                    title: goal.title,
                    description: goal.description,
                    smart_specific: goal.smart_specific,
                    smart_measurable: goal.smart_measurable,
                    smart_achievable: goal.smart_achievable,
                    smart_relevant: goal.smart_relevant,
                    status: goal.status,
                    target_date: goal.target_date,
               });
          }
     }, [goal]);

     const handleInputChange = (field: keyof GoalPayload, value: any) => {
          setEditedGoal(prev => ({ ...prev, [field]: value }));
     };

     const loading = apiLoading || profileLoading;

     if (loading) {
          return (
               <Container css={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '60vh'
               }}>
                    <Loading size="xl" />
               </Container>
          );
     }

     if (!goal) {
          return (
               <Container css={{ textAlign: 'center', py: '$20' }}>
                    <Text h3 color="error">Goal not found</Text>
                    <Button auto ghost onClick={goBack} css={{ mt: '$4' }}>
                         Go Back
                    </Button>
               </Container>
          );
     }

     const statusColors: Record<string, 'warning' | 'success' | 'error'> = {
          'Working on': 'warning',
          'Mastered': 'success',
          'Expired': 'error'
     };

     return (
          <Container md css={{ py: '$15' }}>
               {/* 1. TOP NAVIGATION & ACTIONS */}
               <Row justify="space-between" align="center" wrap="wrap" css={{ mb: '$10', gap: '$8' }}>
                    <Col>
                         <Row align="center" css={{ gap: '$4' }}>
                              <Button auto light color="primary" onClick={goBack}>
                                   ← Back
                              </Button>
                         </Row>
                         <Spacer y={0.5} />
                         {isEditing ? (
                              <Input
                                   fullWidth
                                   size="xl"
                                   aria-label="Goal Title"
                                   value={editedGoal.title || ''}
                                   onChange={(e) => handleInputChange('title', e.target.value)}
                                   css={{
                                        '& .nextui-input': {
                                             fontSize: '2rem',
                                             fontWeight: '$bold'
                                        }
                                   }}
                              />
                         ) : (
                              <>
                                   <Row>
                                        <Text h1 css={{ m: 0 }}>{goal.title}</Text>

                                        <Badge variant="flat" color={statusColors[goal.status] || 'primary'} size="lg">
                                             {goal.status || 'Draft'}
                                        </Badge>
                                   </Row>
                              </>

                         )}
                    </Col>

                    <Col css={{ width: 'auto' }}>
                         <Row css={{ gap: '$4' }}>
                              {isEditing ? (
                                   <>
                                        <Button shadow color="primary" onClick={handleSave}>Save Changes</Button>

                                        <Button shadow color="error" onClick={handleCancelEdit}>Cancel</Button>
                                   </>
                              ) : (
                                   <Button shadow onClick={() => setIsEditing(true)}>
                                        Edit Goal</Button>
                              )}
                         </Row>
                    </Col>
               </Row>

               <Grid.Container gap={2}>
                    {/* 2. MAIN CONTENT COLUMN */}
                    <Grid xs={12} md={8}>
                         <Col>
                              {/* Description Section */}
                              <Card css={{ p: '$8', mb: '$10' }}>
                                   <SectionHeader>Description</SectionHeader>
                                   {isEditing ? (
                                        <Textarea
                                             fullWidth
                                             bordered
                                             color="primary"
                                             label="Context & Description"
                                             value={editedGoal.description || ''}
                                             onChange={(e) => handleInputChange('description', e.target.value)}
                                             rows={4}
                                        />
                                   ) : (
                                        <Text size="$lg" color="$accents9">{goal.description || "No description provided."}</Text>
                                   )}
                              </Card>

                              {/* SMART Framework */}
                              <SectionHeader>SMART Strategy</SectionHeader>
                              <Grid.Container gap={2}>
                                   <SmartField
                                        label="Specific"
                                        value={isEditing ? editedGoal.smart_specific : goal.smart_specific}
                                        isEditing={isEditing}
                                        onChange={(val) => handleInputChange('smart_specific', val)}
                                   />
                                   <SmartField
                                        label="Measurable"
                                        value={isEditing ? editedGoal.smart_measurable : goal.smart_measurable}
                                        isEditing={isEditing}
                                        onChange={(val) => handleInputChange('smart_measurable', val)}
                                   />
                                   <SmartField
                                        label="Achievable"
                                        value={isEditing ? editedGoal.smart_achievable : goal.smart_achievable}
                                        isEditing={isEditing}
                                        onChange={(val) => handleInputChange('smart_achievable', val)}
                                   />
                                   <SmartField
                                        label="Relevant"
                                        value={isEditing ? editedGoal.smart_relevant : goal.smart_relevant}
                                        isEditing={isEditing}
                                        onChange={(val) => handleInputChange('smart_relevant', val)}
                                   />
                              </Grid.Container>
                         </Col>
                    </Grid>

                    {/* 3. SIDEBAR COLUMN (Time & Reward) */}
                    <Grid xs={12} md={4}>
                         <Col>
                              {/* Schedule Card */}
                              <Card css={{ p: '$8', mb: '$8', bg: '$blue50' }}>
                                   <Text h4 css={{ mb: '$6' }}>Time Frame</Text>

                                   {isEditing ? (
                                        <Col css={{ gap: '$4', display: 'flex', flexDirection: 'column' }}>
                                             <Input
                                                  type="number"
                                                  label="Frequency (Times)"
                                                  fullWidth
                                                  value={frequencyCount.toString()}
                                                  onChange={(e) => setFrequencyCount(parseInt(e.target.value) || 0)}
                                             />
                                             <Row css={{ gap: '$4' }}>
                                                  <Input
                                                       type="number"
                                                       label="Every"
                                                       css={{ flex: 1 }}
                                                       value={frequencyDuration.toString()}
                                                       onChange={(e) => setFrequencyDuration(parseInt(e.target.value) || 1)}
                                                  />
                                                  <Col css={{ flex: 1.5 }}>
                                                       <Text size="$xs" css={{ mb: '$2', ml: '$2' }}>Unit</Text>
                                                       <select
                                                            className="custom-select"
                                                            value={frequencyUnit}
                                                            onChange={(e) => setFrequencyUnit(e.target.value as 'daily' | 'weekly' | 'monthly' | 'yearly')}
                                                            style={{
                                                                 width: '100%',
                                                                 height: '40px',
                                                                 background: 'primary',
                                                                 border: 'none',
                                                                 borderRadius: '12px',
                                                                 padding: '0 12px',
                                                                 fontFamily: 'inherit',
                                                                 fontSize: '14px',
                                                                 cursor: 'pointer',
                                                                 outline: 'none'
                                                            }}
                                                       >
                                                            <option value="daily">Day(s)</option>
                                                            <option value="weekly">Week(s)</option>
                                                            <option value="monthly">Month(s)</option>
                                                            <option value="yearly">Year(s)</option>
                                                       </select>
                                                  </Col>
                                             </Row>
                                        </Col>
                                   ) : (
                                        <div style={{ padding: '12px', borderRadius: '12px', border: '2px dashed #0072f522' }}>
                                             <Text b size="$md" color="$primary">
                                                  {goal.time_bound_count} times per {goal.time_bound_value} {goal.time_bound_period}
                                             </Text>
                                        </div>
                                   )}

                                   {goal.target_date && (
                                        <Row align="center" css={{ mt: '$8', p: '$4', bg: '$background', borderRadius: '$md' }}>
                                             <Text small b color="$accents7">
                                                  Target: {new Date(goal.target_date).toLocaleDateString()}</Text>
                                        </Row>
                                   )}
                              </Card>

                              {/* Reward Card */}
                              <Card css={{ p: '$8', borderColor: '$warningLight', borderWidth: '1px' }} variant="bordered">
                                   <Text h4 color="$warning" css={{ mb: '$4' }}>The Reward</Text>
                                   {isEditing ? (
                                        <>
                                             <Input
                                                  bordered
                                                  fullWidth
                                                  label="What is the prize?"
                                                  value={reward.name}
                                                  onChange={(e) => updateRewardField('name', e.target.value)}
                                                  css={{ mb: '$4' }}
                                             />
                                             <Textarea
                                                  bordered
                                                  fullWidth
                                                  label="Incentive Notes"
                                                  value={reward.notes}
                                                  onChange={(e) => updateRewardField('notes', e.target.value)}
                                             />
                                        </>
                                   ) : (
                                        <Col>
                                             <Text b size="$xl" css={{ display: 'block' }}>{reward.name || 'No reward set'}</Text>
                                             <Text color="$accents7">{reward.notes}</Text>
                                        </Col>
                                   )}
                              </Card>
                         </Col>
                    </Grid>
               </Grid.Container>
          </Container>
     );
};

export default GoalDetailsPage;