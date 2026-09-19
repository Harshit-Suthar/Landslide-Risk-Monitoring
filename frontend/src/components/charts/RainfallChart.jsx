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
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { CloudRain } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function RainfallChart() {
  const labels = ['Mon (Sep 13)', 'Tue (Sep 14)', 'Wed (Sep 15)', 'Thu (Sep 16)', 'Fri (Sep 17)', 'Sat (Sep 18)', 'Sun (Sep 19)'];
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Daily Rainfall (mm)',
        data: [28.4, 45.2, 82.6, 124.0, 95.8, 148.5, 112.2],
        borderColor: '#0284c7', // sky-600
        backgroundColor: 'rgba(2, 132, 199, 0.15)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#0284c7',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Warning Threshold (75mm)',
        data: [75, 75, 75, 75, 75, 75, 75],
        borderColor: '#ef4444', // red-500
        borderWidth: 1.5,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
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
          color: '#475569',
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y} mm`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Rainfall (mm)',
          color: '#64748b',
          font: { size: 11 },
        },
        ticks: {
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
          font: { size: 11 },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-sky-600" />
            7-Day Precipitation Trend (Regional Avg)
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Placeholder telemetry until automated IMD Doppler radar API integration
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
          IMD Station Mesh
        </span>
      </div>
      <div className="flex-1 min-h-[260px] relative">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
