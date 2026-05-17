import { useEffect, useState } from "react";
import { getHabits } from "./api/habitsApi";
import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,} from "recharts";

type Habit = {
  id: number;
  name: string;
  description?: string;
  streak: number;
  createdAt: string;
  category: string;
  completedToday: boolean;
};

const BASE_URL = "http://localhost:5016";

function App() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("General");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc");
  const totalHabits = habits.length;

  const completedToday = habits.filter(
    (h) => h.completedToday
  ).length;

  const bestStreak =
    habits.length > 0
      ? Math.max(...habits.map((h) => h.streak))
      : 0;

  const chartData = habits.map((habit) => ({
    name: habit.name,
    streak: habit.streak,
  }))

  const filteredHabits = habits
    .filter((habit) =>
      habit.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((habit) =>
      filterCategory === "All"
        ? true
        : habit.category === filterCategory
    )
    .sort((a, b) =>
      sortOrder === "desc"
        ? b.streak - a.streak
        : a.streak - b.streak
    );

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
        category,
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
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            backgroundColor: "#1e1e1e",
            padding: "20px",
            borderRadius: "12px",
            minWidth: "180px",
          }}
        >
          <h3>Total Habits</h3>
          <p style={{ fontSize: "24px" }}>{totalHabits}</p>
        </div>

        <div
          style={{
            backgroundColor: "#1e1e1e",
            padding: "20px",
            borderRadius: "12px",
            minWidth: "180px",
          }}
        >
          <h3>Completed Today</h3>
          <p style={{ fontSize: "24px" }}>{completedToday}</p>
        </div>

        <div
          style={{
            backgroundColor: "#1e1e1e",
            padding: "20px",
            borderRadius: "12px",
            minWidth: "180px",
          }}
        >
          <h3>Best Streak</h3>
          <p style={{ fontSize: "24px" }}>🔥 {bestStreak}</p>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#1e1e1e",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "30px",
          width: "100%",
          maxWidth: "800px",
          height: "350px",
        }}
      >
        <h2>📊 Habit Streak Analytics</h2>

        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#ffffff" />
            <YAxis stroke="#ffffff" />
            <Tooltip />

            <Bar dataKey="streak" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

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
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            marginRight: "10px",
          }}
        >
          <option value="General">General</option>
          <option value="Fitness">Fitness</option>
          <option value="Study">Study</option>
          <option value="Health">Health</option>
          <option value="Productivity">Productivity</option>
        </select>

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
          display: "flex",
          gap: "10px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <input
          placeholder="Search habits..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "none",
          }}
        />

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          <option value="All">All Categories</option>
          <option value="General">General</option>
          <option value="Fitness">Fitness</option>
          <option value="Study">Study</option>
          <option value="Health">Health</option>
          <option value="Productivity">Productivity</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          <option value="desc">Highest Streak</option>
          <option value="asc">Lowest Streak</option>
        </select>
      </div>

      <div
        style={{
          display: "grid",
          gap: "20px",
          maxWidth: "500px",
        }}
      >
        {filteredHabits.map((habit) => (
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
            <p>📂 Category: {habit.category}</p>

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
