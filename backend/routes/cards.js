const express = require("express");

module.exports = (supabase) => {
  const router = express.Router();

  // Get cards for a list
  router.get("/:listId", async (req, res) => {
    const { listId } = req.params;
    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .eq("list_id", listId)
      .order("position", { ascending: true });

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  });

  // Create a new card
  router.post("/", async (req, res) => {
    const { list_id, title, description, position } = req.body;
    const { data, error } = await supabase
      .from("cards")
      .insert([{ list_id, title, description, position }])
      .select();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data[0]);
  });

  // Update a card (title/description/position)
  router.put("/:cardId", async (req, res) => {
    const { cardId } = req.params;
    const updates = req.body; // { title, description, position }

    const { data, error } = await supabase
      .from("cards")
      .update(updates)
      .eq("id", cardId)
      .select();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data[0]);
  });

  return router;
};
