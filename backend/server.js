require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Supabase client
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Routes
const authRoutes = require("./routes/auth")(supabase);
const boardsRoutes = require("./routes/boards")(supabase);
const listsRoutes = require("./routes/lists")(supabase);
const cardsRoutes = require("./routes/cards")(supabase);

app.use("/auth", authRoutes);
app.use("/boards", boardsRoutes);
app.use("/lists", listsRoutes);
app.use("/cards", cardsRoutes);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
