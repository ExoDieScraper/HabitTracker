type Props = {
  totalHabits: number;
  completedToday: number;
  bestStreak: number;
  bestCategory: string;
};

export default function DashboardStats(props: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

      <StatCard label="Total" value={props.totalHabits} />
      <StatCard label="Completed Today" value={props.completedToday} />
      <StatCard label="Best Streak 🔥" value={props.bestStreak} />
      <StatCard label="Best Category 📊" value={props.bestCategory} />

    </div>
  );
}

function StatCard({ label, value }: { label: string; value: any }) {
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 hover:bg-zinc-750 transition">
      <p className="text-xs text-zinc-400">{label}</p>
      <p className="text-lg font-semibold mt-1">{value}</p>
    </div>
  );
}
