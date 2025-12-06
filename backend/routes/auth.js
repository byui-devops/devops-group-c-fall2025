const express = require("express");

module.exports = (supabase) => {
  const router = express.Router();

  // Sign up (optional, for testing)
  router.post("/signup", async (req, res) => {
    const { email, password } = req.body;
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,  // Changed from True to true
      });
      if (error) return res.status(400).json({ error: error.message });
      res.json(data.user);
    } catch (err) {
      res.status(500).json({ error: "Server error signing up" });
    }
  });

  // Login
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return res.status(400).json({ error: error.message });
      res.json(data.user); // return user object with id
    } catch (err) {
      res.status(500).json({ error: "Server error logging in" });
    }
  });

  return router;
};