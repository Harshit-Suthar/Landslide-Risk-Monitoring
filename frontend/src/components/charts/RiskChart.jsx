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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function RiskChart({ locations = [] }) {
  // Aggregate counts per risk level
  const counts = {
    Low: 0,
    Medium: 0,
    High: 0,
    Critical: 0,
  };

  locations.forEach((loc) => {
    const level = loc.risk_level;
    if (counts[level] !== undefined) {
      counts[level]++;
    }
  });

  const data = {
    labels: ['Low Risk', 'Medium Risk', 'High Risk', 'Critical Risk'],
    datasets: [
      {
        label: 'Monitored Locations',
        data: [counts.Low, counts.Medium, counts.High, counts.Critical],
        backgroundColor: [
          'rgba(16, 185, 129, 0.85)', // emerald-500
          'rgba(245, 158, 11, 0.85)', // amber-500
          'rgba(249, 115, 22, 0.85)', // orange-500
          'rgba(239, 68, 68, 0.85)',  // red-500
        ],
        borderColor: [
          '#10b981',
          '#f59e0b',
          '#f97316',
          '#ef4444',
        ],
        borderWidth: 1.5,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: '#64748b',
          font: { size: 11 },
        },
        grid: {
          color: '#f1f5f9',
        },
      },
      x: {
        ticks: {
          color: '#475569',
          font: { size: 11, weight: '500' },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs h-full flex flex-col">
      <div className="mb-4">
        <h4 className="font-bold text-slate-900 text-base">Locations per Risk Level</h4>
        <p className="text-xs text-slate-500 mt-0.5">Real-time aggregate from active monitoring points</p>
      </div>
      <div className="flex-1 min-h-[260px] relative">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
