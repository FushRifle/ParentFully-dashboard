import React from 'react';
import { Box } from '../styles/box';
import Chart, { Props } from 'react-apexcharts';
import { useUserStats } from '@/hooks/user/useUserStats';

const options: Props['options'] = {
   chart: {
      type: 'area',
      animations: {
         enabled: true,
         easing: 'easeinout',
         speed: 1000,
         animateGradually: {
            enabled: true,
            delay: 150
         },
         dynamicAnimation: {
            enabled: true,
            speed: 350
         }
      },
      toolbar: {
         show: false,
      },
      fontFamily: 'Inter, sans-serif',
      foreColor: 'var(--nextui-colors-accents7)',
      sparkline: {
         enabled: false,
      },
   },
   dataLabels: {
      enabled: false,
   },
   fill: {
      type: 'gradient',
      gradient: {
         shadeIntensity: 1,
         inverseColors: false,
         opacityFrom: 0.45,
         opacityTo: 0.05,
         stops: [20, 100],
      },
   },
   colors: ['#3f3bef', '#17C964', '#F5A524'],
   stroke: {
      curve: 'smooth',
      width: 4,
      lineCap: 'round'
   },
   markers: {
      size: 0,
      hover: {
         size: 6,
         sizeOffset: 3
      }
   },
   xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      labels: {
         style: {
            colors: 'var(--nextui-colors-accents8)',
            fontSize: '12px',
         },
      },
      axisBorder: {
         show: false,
      },
      axisTicks: {
         show: false,
      },
   },
   yaxis: {
      labels: {
         style: {
            colors: 'var(--nextui-colors-accents8)',
            fontSize: '12px',
         },
      },
   },
   tooltip: {
      enabled: true,
      x: {
         show: false,
      },
      theme: 'light',
      style: {
         fontSize: '12px',
         fontFamily: 'Inter, sans-serif',
      },
      y: {
         formatter: (val) => `${val} users`
      },
      marker: {
         show: true,
      },
   },
   grid: {
      show: true,
      borderColor: 'var(--nextui-colors-border)',
      strokeDashArray: 0,
      position: 'back',
      xaxis: {
         lines: {
            show: false
         }
      },
   },
   legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontWeight: 600,
      fontSize: '14px',
      markers: {
         radius: 12,
      },
      itemMargin: {
         horizontal: 10,
      }
   },
};

export const Steam = () => {
   const { totalUsers, premiumUsers, newUsers, loading } = useUserStats();

   const weeklyActiveData = [310, 400, 280, 510, 420, 1090, totalUsers || 1000];
   const weeklyPremiumData = [110, 320, 450, 320, 340, 520, premiumUsers.length || 410];
   const weeklyNewUsersData = [45, 78, 62, 91, 84, 120, newUsers.length || 95];

   const series: Props['series'] = [
      {
         name: 'Active Families',
         data: weeklyActiveData,
      },
      {
         name: 'Premium Subs',
         data: weeklyPremiumData,
      },
      {
         name: 'New Users',
         data: weeklyNewUsersData,
      },
   ];

   if (loading) {
      return (
         <Box
            css={{
               width: '100%',
               height: 425,
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               backgroundColor: 'transparent',
               borderRadius: '$xl',
            }}
         >
            Loading statistics...
         </Box>
      );
   }

   return (
      <Box
         css={{
            width: '100%',
            backgroundColor: 'transparent',
            borderRadius: '$xl',
         }}
      >
         <div id="chart">
            <Chart options={options} series={series} type="area" height={425} />
         </div>
      </Box>
   );
};