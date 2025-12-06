import React, { useState } from "react";
import { login, signup } from "../api/api";

export default function Auth({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      let res;
      if (mode === "login") {
        res = await login(email, password);
      } else {
        res = await signup(email, password);
      }
      onLogin(res.data.id); // pass userId to parent
    } catch (err) {
      setError(err.response?.data?.error || "Auth failed");
    }
  };

  return (
    <div>
      <h2>{mode === "login" ? "Login" : "Create Account"}</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSubmit}>
        {mode === "login" ? "Login" : "Sign Up"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={() => setMode(mode === "login" ? "signup" : "login")}>
        {mode === "login" ? "Create Account" : "Back to Login"}
      </button>
    </div>
  );
}
