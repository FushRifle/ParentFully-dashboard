import { api } from '@/lib/api';


export type UserPointsBalance = {
     balance: number;   // total points
     value: number;     // equivalent currency value in local currency
};


// Dummy in-memory store
let userPoints = 250; // starting points
const POINT_VALUE = 35; // NGN per point

export const fetchUserPoints = async (): Promise<UserPointsBalance> => {
     // simulate API call
     await new Promise(resolve => setTimeout(resolve, 300));

     return {
          balance: userPoints,
          value: userPoints * POINT_VALUE,
     };
};

export const applyPointsToPayment = async (amount: number): Promise<{ remainingAmount: number; pointsUsed: number }> => {
     await new Promise(resolve => setTimeout(resolve, 300));

     const maxPointsValue = userPoints * POINT_VALUE;
     let pointsUsed = 0;
     let remainingAmount = amount;

     if (maxPointsValue >= amount) {
          pointsUsed = Math.ceil(amount / POINT_VALUE);
          userPoints -= pointsUsed;
          remainingAmount = 0;
     } else {
          pointsUsed = userPoints;
          remainingAmount = amount - maxPointsValue;
          userPoints = 0;
     }

     return { remainingAmount, pointsUsed };
};

export const earnPoints = async (points: number): Promise<UserPointsBalance> => {
     await new Promise(resolve => setTimeout(resolve, 200));
     userPoints += points;

     return {
          balance: userPoints,
          value: userPoints * POINT_VALUE,
     };
};
