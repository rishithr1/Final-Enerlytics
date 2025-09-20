import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PaybackChartProps {
  initialInvestment: number;
  monthlySavings: number;
  paybackPeriod: number;
  projectLifetime?: number;
}

const PaybackChart: React.FC<PaybackChartProps> = ({
  initialInvestment,
  monthlySavings,
  paybackPeriod,
  projectLifetime = 10,
}) => {
  // Use projectLifetime if provided, otherwise fall back to paybackPeriod + 2
  const chartDurationYears = projectLifetime || Math.ceil(paybackPeriod) + 2;
  const totalMonths = Math.max(1, chartDurationYears * 12);
  const MAX_POINTS = 240; // cap to ~20 years of monthly points
  const step = Math.max(1, Math.ceil(totalMonths / MAX_POINTS));

  const months = React.useMemo(() => {
    const arr: number[] = [];
    for (let m = 1; m <= totalMonths; m += step) arr.push(m);
    return arr;
  }, [totalMonths, step]);

  const cumulativeSavings = React.useMemo(() => months.map(month => monthlySavings * month), [months, monthlySavings]);
  const netValue = React.useMemo(() => cumulativeSavings.map(savings => savings - initialInvestment), [cumulativeSavings, initialInvestment]);

  const chartData = React.useMemo(() => ({
    labels: months.map(month => `${Math.floor((month - 1) / 12)}Y ${(month - 1) % 12}M`),
    datasets: [
      {
        label: 'Cumulative Savings (₹)',
        data: cumulativeSavings,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.1,
        fill: false,
      },
      {
        label: 'Initial Investment (₹)',
        data: months.map(() => initialInvestment),
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderDash: [5, 5],
        tension: 0,
        fill: false,
      },
      {
        label: 'Net Value (₹)',
        data: netValue,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
        fill: 'origin',
      },
    ],
  }), [months, cumulativeSavings, netValue, initialInvestment]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Payback Analysis - Break-even at ${paybackPeriod.toFixed(1)} years (${chartDurationYears}-year project)`,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ₹${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time Period',
        },
        ticks: {
          maxTicksLimit: 12,
        }
      },
      y: {
        title: {
          display: true,
          text: 'Amount (₹)',
        },
        ticks: {
          callback: function(value: any) {
            return '₹' + value.toLocaleString();
          }
        }
      }
    },
    interaction: {
      intersect: false,
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="h-96">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PaybackChart;