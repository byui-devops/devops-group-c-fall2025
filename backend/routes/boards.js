const express = require("express");

module.exports = (supabase) => {
  const router = express.Router();

  // Get all boards for a user
  router.get("/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
      const { data, error } = await supabase
        .from("boards")
        .select("*")
        .eq("owner_id", userId)
        .order("created_at", { ascending: true }); // optional, if you have created_at column

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.json(data); // return array of all boards
    } catch (err) {
      res.status(500).json({ error: "Server error fetching boards" });
    }
  });

  // Create a new board
  router.post("/", async (req, res) => {
    const { owner_id, title } = req.body;

    if (!owner_id || !title) {
      return res.status(400).json({ error: "owner_id and title are required" });
    }

    try {
      const { data, error } = await supabase
        .from("boards")
        .insert([{ owner_id, title }])
        .select();

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.json(data[0]); // return the newly created board
    } catch (err) {
      res.status(500).json({ error: "Server error creating board" });
    }
  });

  return router;
};
