import React, { useState } from "react";
import Auth from "./components/Auth";
import Boards from "./components/Boards";

export default function App() {
  const [userId, setUserId] = useState(null);

  return (
    <div className="App">
      <h1>Track Board</h1>
      {!userId ? <Auth onLogin={setUserId} /> : <Boards userId={userId} />}
    </div>
  );
}
