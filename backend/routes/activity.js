const express = require("express");

module.exports = (supabase) => {
  const router = express.Router();

  // Get activity for a board
  router.get("/:boardId", async (req, res) => {
    const { boardId } = req.params;
    const { data, error } = await supabase
      .from("activity")
      .select("*")
      .eq("board_id", boardId)
      .order("created_at", { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  });

  // Log a new activity
  router.post("/", async (req, res) => {
    const { user_id, board_id, action } = req.body;
    const { data, error } = await supabase
      .from("activity")
      .insert([{ user_id, board_id, action }])
      .select();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data[0]);
  });

  return router;
};
