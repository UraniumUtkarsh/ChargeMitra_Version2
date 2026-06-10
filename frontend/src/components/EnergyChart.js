import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function EnergyChart() {

  // 🔹 Dummy data (can later connect to backend)
  const data = [
    { day: "Mon", energy: 20 },
    { day: "Tue", energy: 35 },
    { day: "Wed", energy: 25 },
    { day: "Thu", energy: 50 },
    { day: "Fri", energy: 40 },
    { day: "Sat", energy: 60 },
    { day: "Sun", energy: 45 },
  ];

  return (
    <div className="bg-slate-800 p-5 rounded-xl">

      <h2 className="text-lg mb-4">⚡ Energy Distribution (7 Days)</h2>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="energy"
            stroke="#22c55e"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}