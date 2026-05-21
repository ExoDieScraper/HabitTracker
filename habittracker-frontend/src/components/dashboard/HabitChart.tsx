import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,} from "recharts";

type Props = {
  chartData: {
    name: string;
    streak: number;
  }[];
};

export default function HabitChart({ chartData }: Props) {
  return (
    <div style={{ height: "300px", marginBottom: "30px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="name" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip />
          <Bar dataKey="streak" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
