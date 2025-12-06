import React, { useState } from "react";
import Auth from "./components/Auth";
import Boards from "./components/Boards";
import "./App.css";

export default function App() {
  const [userId, setUserId] = useState(null);

  const handleLogout = () => {
    setUserId(null);
  };

  return (
    <div className="App">
      {!userId ? (
        <Auth onLogin={setUserId} />
      ) : (
        <>
          <header className="app-header">
            <h1>Track Board</h1>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Sign Out
            </button>
          </header>
          <div className="app-content">
            <Boards userId={userId} />
          </div>
        </>
      )}
    </div>
  );
}
