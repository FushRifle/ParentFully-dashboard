import React from 'react';
import { Box } from '../styles/box';
import Chart, { Props } from 'react-apexcharts';

const state: Props['series'] = [
   {
      name: 'Active Users',
      data: [310, 400, 280, 510, 420, 1090, 1000],
   },
   {
      name: 'Premium Users',
      data: [110, 320, 450, 320, 340, 520, 410],
   },
];

const options: Props['options'] = {
   chart: {
      type: 'area',
      animations: {
         easing: 'easeinout',
         speed: 800,
      },
      toolbar: {
         show: false,
      },
      fontFamily: 'Inter, sans-serif',
      foreColor: 'var(--nextui-colors-accents9)',
      sparkline: {
         enabled: false,
      },
   },
   fill: {
      type: 'gradient',
      gradient: {
         shadeIntensity: 1,
         opacityFrom: 0.7,
         opacityTo: 0.2,
         stops: [0, 90, 100],
      },
   },
   // Matching your Blue and Green card colors
   colors: ['#0072F5', '#17C964'],
   stroke: {
      curve: 'smooth',
      width: 3,
   },
   markers: {
      size: 0,
   },
   xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      labels: {
         style: {
            colors: 'var(--nextui-colors-accents8)',
            fontFamily: 'Inter, sans-serif',
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
            fontFamily: 'Inter, sans-serif',
         },
      },
   },
   tooltip: {
      enabled: true,
      theme: 'dark', // Fits the "Admin" vibe better
   },
   grid: {
      show: true,
      borderColor: 'var(--nextui-colors-border)',
      strokeDashArray: 5, // Dashed lines look cleaner
      position: 'back',
   },
   legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontWeight: 500,
   },
};

export const Steam = () => {
   return (
      <Box
         css={{
            width: '100%',
            backgroundColor: 'var(--nextui-colors-background)',
            borderRadius: '$xl',
            padding: '$4',
         }}
      >
         <div id="chart">
            <Chart options={options} series={state} type="area" height={425} />
         </div>
      </Box>
   );
};