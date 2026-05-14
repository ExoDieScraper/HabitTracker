import { useEffect, useState } from "react";
import { getHabits } from "./api/habitsApi";

type Habit = {
  id: number;
  name: string;
  description?: string;
  streak: number;
  createdAt: string;
};

const BASE_URL = "http://localhost:5016";

function App() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    loadHabits();
  }, []);

  async function loadHabits() {
    const res = await fetch(`${BASE_URL}/api/habits`);
    const data = await res.json();
    setHabits(data);
  }

  async function addHabit() {
    if (!name.trim()) return;

    await fetch(`${BASE_URL}/api/habits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description: "",
        streak: 0,
      }),
    });

    setName("");
    loadHabits();
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Habit Tracker</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New habit..."
        />
        <button onClick={addHabit}>Add</button>
      </div>

      <button onClick={loadHabits}>Refresh</button>

      <ul>
		{habits.map((habit) => (
			<li key={habit.id}>
			  <b>{habit.name}</b>

			  <button
				onClick={async () => {
				  await fetch(`http://localhost:5016/api/habits/${habit.id}`, {
					method: "DELETE",
				  });
				  loadHabits();
				}}
				style={{ marginLeft: "10px" }}
			  >
				Delete
			  </button>
			</li>
		  ))}
      </ul>
    </div>
  );
}

export default App;