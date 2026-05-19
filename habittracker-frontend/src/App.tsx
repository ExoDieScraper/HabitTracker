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
  const [token, setToken] = useState<string | null>(null);
  const [loginUsername , setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

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
    const res = await fetch(`${BASE_URL}/api/habits`, {
      headers: jwt
        ? {
            Authorization: `Bearer ${jwt}`,
          }
        : {},
    });
    const data = await res.json();
    setHabits(data);
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
        description: "",
        streak: 0,
        category,
      }),
    });

    const newHabit = await res.json();

    setHabits((prev) => [...prev, newHabit]);

    setName("");
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

           <button
             onClick={async () => {
               await fetch(`${BASE_URL}/api/habits/${habit.id}/complete`, {
                 method: "PUT",
                 headers: { Authorization: `Bearer ${token}` },
               });

               loadHabits(token);
             }}
           >
             Complete
           </button>

           <button
             onClick={async () => {
               await fetch(`${BASE_URL}/api/habits/${habit.id}`, {
                 method: "DELETE",
                 headers: { Authorization: `Bearer ${token}` },
               });

               loadHabits(token);
             }}
           >
             Delete
           </button>
         </div>
       ))}
     </div>
   </div>
 );
}



export default App;
