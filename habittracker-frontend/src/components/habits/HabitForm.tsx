type Props = {
  name: string;
  category: string;
  setName: (value: string) => void;
  setCategory: (value: string) => void;
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
    <div style={{ marginBottom: "30px" }}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New habit..."
        style={{ padding: "10px", marginRight: "10px" }}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ padding: "10px", marginRight: "10px" }}
      >
        <option value="General">General</option>
        <option value="Fitness">Fitness</option>
        <option value="Study">Study</option>
        <option value="Health">Health</option>
        <option value="Productivity">Productivity</option>
      </select>

      <button onClick={addHabit}>Add Habit</button>
    </div>
  );
}
