import React from 'react';
import { Box } from '../styles/box';
import Chart, { Props } from 'react-apexcharts';

const state: Props['series'] = [
   {
      name: 'Active Families',
      data: [310, 400, 280, 510, 420, 1090, 1000],
   },
   {
      name: 'Premium Subs',
      data: [110, 320, 450, 320, 340, 520, 410],
   },
];

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
      enabled: false, // Hides the data labels as requested
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
   // ParentFully Brand Colors: Soft Blue and Parenting Green
   colors: ['#3f3bef', '#17C964'],
   stroke: {
      curve: 'smooth',
      width: 4, // Thicker lines look more modern/premium
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
      theme: 'light', // Light theme fits the "soft" branding better
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
      strokeDashArray: 0, // Solid lines for a cleaner grid
      position: 'back',
      xaxis: {
         lines: {
            show: false // Remove vertical lines for a more "airy" look
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
   return (
      <Box
         css={{
            width: '100%',
            backgroundColor: 'transparent',
            borderRadius: '$xl',
         }}
      >
         <div id="chart">
            <Chart options={options} series={state} type="area" height={425} />
         </div>
      </Box>
   );
};