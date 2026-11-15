import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const PLANS = [
     {
          name: 'Free',
          price: '0',
          features: ['Basic Analytics', '5 Projects', 'Community Support'],
          highlight: false,
     },
     {
          name: 'Pro',
          price: '19',
          features: ['Advanced Stats', 'Unlimited Projects', 'Priority Support'],
          highlight: true,
     },
     {
          name: 'Enterprise',
          price: '99',
          features: ['Custom Branding', 'Dedicated Manager', 'API Access'],
          highlight: false,
     },
];

const ChangePlan = () => {
     const router = useRouter();

     const userId = useMemo(() => {
          if (!router.isReady) return null;
          return router.query.id as string;
     }, [router.isReady, router.query.id]);

     return (
          <div className="p-10 sm:p-20">
               <Button variant="ghost" onClick={() => router.back()}>
                    Back to User
               </Button>

               <div className="mt-4">
                    <h2 className="text-2xl font-semibold">Subscription Plans</h2>
                    <p className="mb-12 mt-2 text-muted-foreground">
                         Updating plan for User ID:{' '}
                         <Badge variant="secondary">#{userId ?? '—'}</Badge>
                    </p>
               </div>

               <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {PLANS.map((plan) => (
                         <Card
                              key={plan.name}
                              className={`p-4 ${plan.highlight ? 'border-2 border-blue-600' : ''}`}
                         >
                              <CardHeader>
                                   <div className="flex flex-col">
                                        <h3 className="text-xl font-semibold">{plan.name}</h3>
                                        <p className="text-lg font-semibold text-primary">
                                             ${plan.price}
                                             <span className="text-xs font-normal text-muted-foreground">/mo</span>
                                        </p>
                                   </div>
                              </CardHeader>

                              <Separator />

                              <CardContent className="py-8">
                                   {plan.features.map((feat) => (
                                        <p key={feat} className="mb-3 text-sm">
                                             • {feat}
                                        </p>
                                   ))}
                              </CardContent>

                              <CardFooter>
                                   <Button
                                        variant={plan.highlight ? 'default' : 'secondary'}
                                        className="w-full"
                                        onClick={() => {
                                             alert(`Plan changed to ${plan.name}`);
                                             router.push('/accounts');
                                        }}
                                   >
                                        Select {plan.name}
                                   </Button>
                              </CardFooter>
                         </Card>
                    ))}
               </div>
          </div>
     );
};

export default ChangePlan;