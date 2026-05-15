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
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#121212",
        color: "white",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <h1 style={{ marginBottom: "30px" }}>🔥 Habit Tracker</h1>

      <div style={{ marginBottom: "30px" }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New habit..."
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            marginRight: "10px",
            width: "250px",
          }}
        />

        <button
          onClick={addHabit}
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Add Habit
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gap: "20px",
          maxWidth: "500px",
        }}
      >
        {habits.map((habit) => (
          <div
            key={habit.id}
            style={{
              backgroundColor: "#1e1e1e",
              padding: "20px",
              borderRadius: "12px",
            }}
          >
            <h2>{habit.name}</h2>

            <p>🔥 Streak: {habit.streak}</p>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={async () => {
                  await fetch(
                    `http://localhost:5016/api/habits/${habit.id}/complete`,
                    {
                      method: "PUT",
                    }
                  );

                  loadHabits();
                }}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Complete
              </button>

              <button
                onClick={async () => {
                  await fetch(
                    `http://localhost:5016/api/habits/${habit.id}`,
                    {
                      method: "DELETE",
                    }
                  );

                  loadHabits();
                }}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
