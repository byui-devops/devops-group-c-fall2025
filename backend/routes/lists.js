const express = require("express");

module.exports = (supabase) => {
  const router = express.Router();

  // Get lists for a board
  router.get("/:boardId", async (req, res) => {
    const { boardId } = req.params;
    const { data, error } = await supabase
      .from("lists")
      .select("*")
      .eq("board_id", boardId)
      .order("position", { ascending: true });

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  });

  // Create a new list
  router.post("/", async (req, res) => {
    const { board_id, title, position } = req.body;
    const { data, error } = await supabase
      .from("lists")
      .insert([{ board_id, title, position }])
      .select();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data[0]);
  });

  return router;
};
