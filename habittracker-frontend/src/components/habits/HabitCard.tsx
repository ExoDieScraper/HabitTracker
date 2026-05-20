import type { Habit } from "../../types/habit";

type Props = {
  habit: Habit;
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
  getCompletedCount: (habit: Habit) => number;
  getCompletionRate: (habit: Habit) => number;
  getLongestStreak: (habit: Habit) => number;
};

export default function HabitCard({
  habit,
  onComplete,
  onDelete,
  getCompletedCount,
  getCompletionRate,
  getLongestStreak,
}: Props) {
  return (
    <div style={{
      backgroundColor: "#1e1e1e",
      padding: "20px",
      borderRadius: "12px",
    }}>
      <h2>{habit.name}</h2>
      <p>🔥 Streak: {habit.streak}</p>
      <p>📂 Category: {habit.category}</p>

      <p>📈 Total completions: {getCompletedCount(habit)}</p>
      <p>📊 Completion rate: {getCompletionRate(habit)}%</p>
      <p>🏆 Longest streak: {getLongestStreak(habit)}</p>

      <button onClick={() => onComplete(habit.id)}>
        Complete
      </button>

      <button onClick={() => onDelete(habit.id)}>
        Delete
      </button>
    </div>
  );
}
