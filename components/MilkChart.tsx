
import React from 'react';

interface ChartData {
  name: string;
  total: number;
}

interface MilkChartProps {
  data: ChartData[];
}

const MilkChart: React.FC<MilkChartProps> = ({ data }) => {
  // Access Recharts from the window object inside the component render function.
  // This ensures the script has loaded before we try to use it.
  const Recharts = (window as any).Recharts;

  // If Recharts is not yet available, show a loading message.
  if (!Recharts) {
    return <div className="flex items-center justify-center h-full text-slate-400">Loading chart...</div>;
  }
  
  const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;

  const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-slate-700 border border-slate-600 rounded shadow-lg">
          <p className="label font-bold text-white">{`${label}`}</p>
          <p className="intro text-cyan-400">{`Total Susu : ${payload[0].value.toFixed(1)} Liter`}</p>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return <div className="flex items-center justify-center h-full text-slate-400">Data tidak cukup untuk menampilkan grafik.</div>;
  }
    
  return (
    <div style={{ width: '100%', height: 300 }}>
       <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} />
          <YAxis tick={{ fill: '#94a3b8' }} />
          <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(71, 85, 105, 0.5)'}}/>
          <Legend wrapperStyle={{ color: '#cbd5e1' }} />
          <Bar dataKey="total" name="Total Susu (Liter)" fill="#22d3ee" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MilkChart;
