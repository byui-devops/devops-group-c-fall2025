import React, { useState } from "react";
import { login, signup } from "../api/api";
import "./Auth.css";

export default function Auth({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      let res;
      if (mode === "login") {
        res = await login(email, password);
      } else {
        res = await signup(email, password);
      }
      onLogin(res.data.id); // pass userId to parent
    } catch (err) {
      setError(err.response?.data?.error || "Authentication failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{mode === "login" ? "Welcome Back" : "Create Account"}</h2>
        <p className="auth-subtitle">
          {mode === "login" 
            ? "Sign in to access your boards" 
            : "Sign up to get started"}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-button">
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}

        <div className="auth-divider">
          <span>or</span>
        </div>

        <div className="auth-toggle">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button 
            className="auth-toggle-button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
          >
            {mode === "login" ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
