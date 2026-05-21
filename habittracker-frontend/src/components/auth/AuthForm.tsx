import { useState } from "react";

type Props = {
  onLogin: (username: string, password: string) => Promise<void>;
  onRegister: (username: string, password: string) => Promise<void>;
  loading: boolean;
  error: string;
};

export default function AuthForm({
  onLogin,
  onRegister,
  loading,
  error,
}: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  async function handleSubmit() {
    if (isRegistering) {
      await onRegister(username, password);
    } else {
     await onLogin(username, password);
    }
  }
  return (
     <div style={{ padding: "40px", background: "#121212", color: "white", minHeight: "100vh" }}>
       <h1>🔥 Habit Tracker</h1>

       <h2>{isRegistering ? "Register" : "Login"}</h2>

       <input
         placeholder="username"
         value={username}
         onChange={(e) => setUsername(e.target.value)}
         style={{ marginRight: "10px", padding: "8px" }}
       />

       <input
         placeholder="password"
         type="password"
         value={password}
         onChange={(e) => setPassword(e.target.value)}
         style={{ marginRight: "10px", padding: "8px" }}
       />

       <button onClick={handleSubmit} disabled={loading}>
         {loading ? "Loading..." : isRegistering ? "Register" : "Login"}
       </button>

       <div style={{ marginTop: "10px" }}>
         <button
           onClick={() => setIsRegistering(!isRegistering)}
         >
           {isRegistering
             ? "Already have an account? Login"
             : "Need an account? Register now"}
         </button>
       </div>

       {error && (
         <p style={{ color: "tomato", marginTop: "10px" }}>
           {error}
         </p>
       )}
     </div>
   );
  }
