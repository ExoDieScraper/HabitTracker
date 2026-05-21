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
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-zinc-700">

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white">
          {habit.name}
        </h2>

        <span className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-300">
          {habit.category}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4 text-xs">
        <span className="px-2 py-1 rounded-md bg-zinc-800 text-zinc-300">
          🔥 {habit.streak} streak
        </span>

        <span className="px-2 py-1 rounded-md bg-zinc-800 text-zinc-300">
          📈 {getCompletedCount(habit)} completions
        </span>

        <span className="px-2 py-1 rounded-md bg-zinc-800 text-zinc-300">
          📊 {getCompletionRate(habit)}%
        </span>

        <span className="px-2 py-1 rounded-md bg-zinc-800 text-zinc-300">
          🏆 best {getLongestStreak(habit)}
        </span>
      </div>


      <div className="flex justify-between gap-3">
        <button
          onClick={() => onComplete(habit.id)}
          className="flex-1 bg-green-600 hover:bg-green-500 text-white text-sm py-2 rounded-lg transition hover:scale-[1.02]"
        >
          Complete
        </button>

        <button
          onClick={() => onDelete(habit.id)}
          className="flex-1 bg-red-600 hover:bg-red-500 text-white text-sm py-2 rounded-lg transition hover:scale-[1.02]"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
