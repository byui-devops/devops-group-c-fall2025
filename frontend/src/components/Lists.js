import React, { useState, useEffect } from "react";
import { getLists, createList } from "../api/api";
import Cards from "./Cards";

export default function Lists({ boardId }) {
  const [lists, setLists] = useState([]);
  const [newList, setNewList] = useState("");

  useEffect(() => {
    fetchLists();
  }, [boardId]);

  const fetchLists = async () => {
    const res = await getLists(boardId);
    setLists(res.data);
  };

  const handleCreateList = async () => {
    if (!newList) return;
    await createList(boardId, newList, lists.length);
    setNewList("");
    fetchLists();
  };

  return (
    <div style={{ paddingLeft: "20px" }}>
      <input
        type="text"
        placeholder="New List Title"
        value={newList}
        onChange={(e) => setNewList(e.target.value)}
      />
      <button onClick={handleCreateList}>Create List</button>

      {lists.map((list) => (
        <div key={list.id} style={{ marginTop: "10px" }}>
          <h4>{list.title}</h4>
          <Cards listId={list.id} />
        </div>
      ))}
    </div>
  );
}
