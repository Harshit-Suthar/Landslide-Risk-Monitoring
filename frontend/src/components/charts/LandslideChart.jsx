import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function LandslideChart() {
  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Historical Incidents (2025)',
        data: [4, 9, 28, 42, 36, 18],
        backgroundColor: 'rgba(203, 213, 225, 0.7)',
        borderRadius: 6,
      },
      {
        label: 'Current Season (2026)',
        data: [6, 12, 34, 49, 44, 26],
        backgroundColor: 'rgba(249, 115, 22, 0.85)',
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          font: { size: 11 },
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#64748b', font: { size: 11 } },
        grid: { color: '#f1f5f9' },
      },
      x: {
        ticks: { color: '#475569', font: { size: 11 } },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs h-full flex flex-col">
      <div className="mb-4">
        <h4 className="font-bold text-slate-900 text-base">Seasonal Incident Frequency</h4>
        <p className="text-xs text-slate-500 mt-0.5">Pre-monsoon and monsoon landslide records comparison</p>
      </div>
      <div className="flex-1 min-h-[260px] relative">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
