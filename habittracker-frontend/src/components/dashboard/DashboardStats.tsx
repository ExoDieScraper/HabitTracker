type Props = {
  totalHabits: number;
  completedToday: number;
  bestStreak: number;
  bestCategory: string;
};

export default function DashboardStats(props: Props) {
  return (
    <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
      <div>Total: {props.totalHabits}</div>
      <div>Completed Today: {props.completedToday}</div>
      <div>Best Streak: 🔥 {props.bestStreak}</div>
      <div>Best Category: 📊 {props.bestCategory}</div>
    </div>
  );
}
