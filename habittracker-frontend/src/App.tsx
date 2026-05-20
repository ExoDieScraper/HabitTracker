import { useEffect, useState } from "react";
import { getHabits } from "./api/habitsApi";
import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,} from "recharts";
import HabitCard from "./components/habits/HabitCard";

type Habit = {
  id: number;
  name: string;
  description?: string;
  streak: number;
  category: string;
  completions: string[];
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
  const [token, setToken] = useState<string | null>(null);
  const [loginUsername , setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const totalDays = 30;

  const today = new Date().toISOString().split("T")[0];

  const completedToday = habits.filter((h) =>
    (h.completions ?? []).some((c) =>
      c.startsWith(today)
    )
  ).length;

  const bestStreak =
    habits.length > 0
      ? Math.max(...habits.map((h) => h.streak))
      : 0;

  const chartData = habits.map((habit) => ({
    name: habit.name,
    streak: habit.streak,
  }))
  const last7Days = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);

    return date.toISOString().split("T")[0];
  }).reverse();

  const heatmapData = last7Days.map(day => {
    const completed = habits.some(habit =>
      habit.completions?.some(completion =>
        completion.startsWith(day)
      )
    );

    return {
      day,
      completed
    };
  });

  const getCompletedCount = (habit: Habit) => {
    return habit.completions?.length ?? 0;
  };

  const getCompletionRate = (habit: Habit) => {
    const daysSinceCreation = Math.max(
      1,
      Math.floor(
        (new Date().getTime() - new Date(habit.completions?.[0] ?? Date.now()).getTime()) /
        (1000 * 60 * 60 * 24)
      )
    );

    return Math.min(100, Math.round((getCompletedCount(habit) / daysSinceCreation) * 100));
  };

  const getLongestStreak = (habit: Habit) => {
    if (!habit.completions?.length) return 0;

    const dates = habit.completions
      .map((c) => new Date(c).toDateString())
      .sort((a,b) => new Date(a).getTime() - new Date(b).getTime());

    let longest = 1;
    let current = 1;

    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1]);
      const curr = new Date(dates[i]);

      const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

      if (diff === 1 ) {
        current++;
        longest = Math.max(longest, current);
      } else {
        current = 1;
      }
    }

    return longest;
  };

  const bestCategory = (() => {
    const map: Record<string, number> = {};

    habits.forEach((h) => {
      map[h.category] = (map[h.category] || 0) + getCompletedCount(h);
    });

    return Object.entries(map).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A";
  })();

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
    const savedToken = localStorage.getItem("token");

    if (savedToken)
    {
      setToken(savedToken);
      loadHabits(savedToken);
    } else {
      loadHabits(null);
    }
  }, []);

  async function loadHabits(jwt: string | null) {
  try {
    const res = await fetch(`${BASE_URL}/api/habits`, {
      headers: jwt
        ? { Authorization: `Bearer ${jwt}` }
        : {},
    });

    if (!res.ok) {
      console.warn("Failed to load habits:", await res.text());
      setHabits([]);
      return;
    }

    const data = await res.json();
    setHabits(data);
  } catch (err) {
    console.error("loadHabits crashed:", err);
    setHabits([]);
  }
}

  async function login() {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: loginUsername,
        passwordHash: loginPassword,
      }),
    });

    if (!res.ok) {
      alert("Login failed");
      return;
    }
    const jwt = await res.text();

    setToken(jwt);
    localStorage.setItem("token", jwt);

    loadHabits(jwt);
  }

  async function register() {
    try {
      setAuthError("");
      setAuthLoading(true);

      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: loginUsername,
          passwordHash: loginPassword,
        }),
      });

      setAuthLoading(false);

      if (!res.ok) {
        const error = await res.text();
        setAuthError(error);
        return;
      }

      await login();
    } catch (err) {
      setAuthError("Registering failed.");
    } finally {
      setAuthLoading(false);
    }
  }

  async function addHabit() {
    if (!name.trim()) return;

    const res = await fetch(`${BASE_URL}/api/habits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        category,
      }),
    });

    if (!res.ok) {
      console.error(await res.text());
      return;
    }

    setName("");
    loadHabits(token);
  }

  async function logout() {
    setToken(null);
    localStorage.removeItem("token");
    setHabits([]);
  }

  if (!token) {
   return (
     <div style={{ padding: "40px", background: "#121212", color: "white", minHeight: "100vh" }}>
       <h1>🔥 Habit Tracker</h1>

       <h2>{isRegistering ? "Register": "Login"}</h2>

       <input
         placeholder="username"
         value={loginUsername}
         onChange={(e) => setLoginUsername(e.target.value)}
         style={{ marginRight: "10px", padding: "8px" }}
       />

       <input
         placeholder="password"
         type="password"
         value={loginPassword}
         onChange={(e) => setLoginPassword(e.target.value)}
         style={{ marginRight: "10px", padding: "8px" }}
       />

       <button
         onClick={isRegistering ? register : login}
         disabled={authLoading}
       >
         {authLoading
           ? "Loading..."
           : isRegistering
           ? "Register"
           : "Login"
         }
       </button>

       <div style={{ marginTop: "10px" }}>
         <button
           onClick={() => {
             setIsRegistering(!isRegistering);
             setAuthError("");
           }}
         >
           {isRegistering
             ? "Already have an account? Login"
             : "Need an account? Register now"
           }
         </button>
       </div>
       {authError && (
         <p style={{ color: "tomato", marginTop: "10px"}}>
           {authError}
         </p>
       )}
     </div>
   );
 }

 return (
   <div style={{ minHeight: "100vh", background: "#121212", color: "white", padding: "40px" }}>

     <h1>🔥 Habit Tracker</h1>

     <button onClick={logout} style={{ marginBottom: "20px" }}>
       Logout
     </button>


     <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
       <div>Total: {totalHabits}</div>
       <div>Completed Today: {completedToday}</div>
       <div>Best Streak: 🔥 {bestStreak}</div>
       <div>Best Category: 📊 {bestCategory}</div>
     </div>

     <div style={{ marginBottom: "30px" }}>
       <div style={{ display:"flex", marginBottom: "12px"}}>Last 7 Days</div>

       <div
          style={{
            display: "flex",
            gap: "8px",
          }}
        >
          {heatmapData.map((d) => {
            const label = new Date(d.day).toLocaleDateString("en-US", {
              weekday: "short",
            });

            return (
              <div
                key={d.day}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span style={{ fontSize: "12px", color: "#aaa" }}>
                  {label}
                </span>

                <div
                  title={d.day}
                  style={{
                    width: 28,
                    height: 28,
                    backgroundColor: d.completed ? "#22c55e" : "#333",
                    borderRadius: "6px",
                    border: "1px solid #444",
                  }}
                />
              </div>
            );
          })}
        </div>
     </div>


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


     <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
       <input
         placeholder="Search..."
         value={search}
         onChange={(e) => setSearch(e.target.value)}
       />

       <select
         value={filterCategory}
         onChange={(e) => setFilterCategory(e.target.value)}
       >
         <option value="All">All</option>
         <option value="General">General</option>
         <option value="Fitness">Fitness</option>
         <option value="Study">Study</option>
         <option value="Health">Health</option>
         <option value="Productivity">Productivity</option>
       </select>

       <select
         value={sortOrder}
         onChange={(e) => setSortOrder(e.target.value)}
       >
         <option value="desc">Highest Streak</option>
         <option value="asc">Lowest Streak</option>
       </select>
     </div>


     <div style={{ display: "grid", gap: "20px", maxWidth: "500px" }}>
       {filteredHabits.map((habit) => (
         <HabitCard
           key={habit.id}
           habit={habit}
           onComplete={async (id) => {
             await fetch(`${BASE_URL}/api/habits/${id}/complete`, {
               method: "PUT",
               headers: { Authorization: `Bearer ${token}` },
             });

             loadHabits(token);
           }}
           onDelete={async (id) => {
             await fetch(`${BASE_URL}/api/habits/${id}`, {
               method: "DELETE",
               headers: { Authorization: `Bearer ${token}` },
             });

             loadHabits(token);
           }}
           getCompletedCount={getCompletedCount}
           getCompletionRate={getCompletionRate}
           getLongestStreak={getLongestStreak}
         />
       ))}
     </div>
   </div>
 );
}



export default App;
