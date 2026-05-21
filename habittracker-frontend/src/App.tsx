import { useEffect, useState } from "react";
import { getHabits } from "./api/habitsApi";
import HabitCard from "./components/habits/HabitCard";
import Heatmap from "./components/dashboard/Heatmap";
import DashboardStats from "./components/dashboard/DashboardStats";
import HabitChart from "./components/dashboard/HabitChart";
import HabitForm from "./components/habits/HabitForm";
import type { Habit } from "./types/habit";
import toast, { Toaster } from "react-hot-toast";

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
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);

      return date.toISOString().split("T")[0];
    });

    const uniqueDays = new Set(
      (habit.completions ?? []).map((c) =>
        new Date(c).toISOString().split("T")[0]
      )
    );

    const completedInWindow = last7Days.filter((day) =>
      uniqueDays.has(day)
    ).length;

    return Math.round((completedInWindow / 7)* 100);
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

    toast.success("Welcome Back!");
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
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white px-4 page-fade">

        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-lg space-y-6">

          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">
              🔥 Habit Tracker
            </h1>

            <p className="text-sm text-zinc-400">
              {isRegistering ? "Create your account" : "Welcome back"}
            </p>
          </div>

          <div className="space-y-3">
            <input
              className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-green-500"
              placeholder="Username"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
            />

            <input
              className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-green-500"
              placeholder="Password"
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
          </div>

          {authError && (
            <p className="text-sm text-red-400">
              {authError}
            </p>
          )}

          <button
            onClick={isRegistering ? register : login}
            disabled={authLoading}
            className="w-full py-2 rounded-lg bg-green-600 hover:bg-green-500 transition text-white font-medium"
          >
            {authLoading
              ? "Loading..."
              : isRegistering
              ? "Register"
              : "Login"
            }
          </button>

          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setAuthError("");
            }}
            className="w-full text-sm text-zinc-400 hover:text-white transition"
          >
            {isRegistering
              ? "Already have an account? Login"
              : "Need an account? Register"
            }
          </button>

        </div>
      </div>
    );
  }

 return (
    <div className="min-h-screen bg-zinc-950 text-white page-fade">

      <Toaster position="top-right" />

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">

        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            🔥 Habit Tracker
          </h1>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition text-sm"
          >
            Logout
          </button>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <DashboardStats
            totalHabits={totalHabits}
            completedToday={completedToday}
            bestStreak={bestStreak}
            bestCategory={bestCategory}
          />
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <Heatmap heatmapData={heatmapData} />
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <HabitChart chartData={chartData} />
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <HabitForm
            name={name}
            category={category}
            setName={setName}
            setCategory={setCategory}
            addHabit={addHabit}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-3 bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <input
            className="flex-1 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700"
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
            className="px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">Highest Streak</option>
            <option value="asc">Lowest Streak</option>
          </select>
        </div>

        <div className="grid gap-4 max-w-lg mx-auto w-full">
          {filteredHabits.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center shadow-sm">

              <div className="text-4xl mb-3">🌱</div>

              <h2 className="text-lg font-semibold text-white mb-2">
                No habits yet
              </h2>

              <p className="text-sm text-zinc-400 mb-6">
                Start building consistency — add your first habit to begin tracking your progress.
              </p>

              <button
                onClick={() => {
                  const input = document.querySelector("input") as HTMLInputElement;
                  input?.focus();
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm rounded-lg transition"
              >
                Create your first habit
              </button>

            </div>
          ) : (
            <div className="grid gap-4 max-w-[500px]">
              {filteredHabits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onComplete={async (id) => {
                    await fetch(`${BASE_URL}/api/habits/${id}/complete`, {
                      method: "PUT",
                      headers: { Authorization: `Bearer ${token}` },
                    });

                    toast.success("Habit completed 🔥");
                    loadHabits(token);
                  }}
                  onDelete={async (id) => {
                    await fetch(`${BASE_URL}/api/habits/${id}`, {
                      method: "DELETE",
                      headers: { Authorization: `Bearer ${token}` },
                    });

                    toast.success("Habit deleted");
                    loadHabits(token);
                  }}
                  getCompletedCount={getCompletedCount}
                  getCompletionRate={getCompletionRate}
                  getLongestStreak={getLongestStreak}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}



export default App;
