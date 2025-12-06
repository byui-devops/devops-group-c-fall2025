import React, { useState, useEffect } from "react";
import { getBoards, createBoard } from "../api/api";
import Lists from "./Lists";

export default function Boards({ userId }) {
  const [boards, setBoards] = useState([]);
  const [newBoard, setNewBoard] = useState("");

  useEffect(() => {
    if (userId) fetchBoards();
  }, [userId]);

  const fetchBoards = async () => {
    try {
      const res = await getBoards(userId);
      setBoards(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateBoard = async () => {
    if (!newBoard) return;
    await createBoard(userId, newBoard);
    setNewBoard("");
    fetchBoards();
  };

  return (
    <div>
      <h2>Boards</h2>
      <input
        type="text"
        placeholder="New Board Title"
        value={newBoard}
        onChange={(e) => setNewBoard(e.target.value)}
      />
      <button onClick={handleCreateBoard}>Create Board</button>

      {boards.map((board) => (
        <div key={board.id} style={{ marginTop: "20px" }}>
          <h3>{board.title}</h3>
          <Lists boardId={board.id} />
        </div>
      ))}
    </div>
  );
}
