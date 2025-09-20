import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Appliance } from '../../types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface EnergyDistributionChartProps {
  dailyAppliances: Appliance[];
  occasionalAppliances: Appliance[];
}

const EnergyDistributionChart: React.FC<EnergyDistributionChartProps> = ({
  dailyAppliances,
  occasionalAppliances,
}) => {
  const allAppliances = [
    ...dailyAppliances.map(a => ({ ...a, type: 'daily' })),
    ...occasionalAppliances.map(a => ({ ...a, type: 'occasional' })),
  ];

  const applianceData = allAppliances.map(appliance => ({
    name: appliance.name || 'Unnamed',
    energy: appliance.type === 'daily' 
      ? appliance.rating * appliance.quantity * appliance.hours * 30
      : appliance.rating * appliance.quantity * appliance.hours,
    type: appliance.type,
  })).filter(item => item.energy > 0);

  if (applianceData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Energy Distribution</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          Add appliances to see energy distribution
        </div>
      </div>
    );
  }

  const colors = [
    '#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316',
    '#06B6D4', '#84CC16', '#F43F5E', '#6366F1', '#14B8A6', '#F59E0B'
  ];

  const chartData = {
    labels: applianceData.map(item => item.name),
    datasets: [
      {
        data: applianceData.map(item => item.energy),
        backgroundColor: colors.slice(0, applianceData.length),
        borderColor: colors.slice(0, applianceData.length).map(color => color + '80'),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          maxWidth: 150,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: 'Monthly Energy Consumption by Appliance',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value.toLocaleString()} Wh (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="h-96">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

export default EnergyDistributionChart;