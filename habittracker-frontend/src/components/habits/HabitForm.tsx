type Props = {
  name: string;
  category: string;
  setName: (v: string) => void;
  setCategory: (v: string) => void;
  addHabit: () => void;
};

export default function HabitForm({
  name,
  category,
  setName,
  setCategory,
  addHabit,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-3 items-stretch">

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New habit..."
        className="flex-1 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700"
      >
        <option value="General">General</option>
        <option value="Fitness">Fitness</option>
        <option value="Study">Study</option>
        <option value="Health">Health</option>
        <option value="Productivity">Productivity</option>
      </select>

      <button
        onClick={addHabit}
        className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 transition font-medium"
      >
        Add Habit
      </button>

    </div>
  );
}
