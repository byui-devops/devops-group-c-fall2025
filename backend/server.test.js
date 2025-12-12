const request = require("supertest");

// Mock dependencies before requiring server
jest.mock("@supabase/supabase-js");
jest.mock("./routes/auth");
jest.mock("./routes/boards");
jest.mock("./routes/lists");
jest.mock("./routes/cards");
jest.mock("./routes/activity");

const { createClient } = require("@supabase/supabase-js");
const express = require("express");

describe("Server", () => {
  let app;

  beforeAll(() => {
    // Mock Supabase client
    const mockSupabase = { mock: "supabase" };
    createClient.mockReturnValue(mockSupabase);

    // Mock all route modules to return express routers
    require("./routes/auth").mockReturnValue(express.Router());
    require("./routes/boards").mockReturnValue(express.Router());
    require("./routes/lists").mockReturnValue(express.Router());
    require("./routes/cards").mockReturnValue(express.Router());
    require("./routes/activity").mockReturnValue(express.Router());

    // Now require the server
    app = require("./server.js");
  });

  it("should export an Express app", () => {
    expect(app).toBeDefined();
    expect(typeof app).toBe("function");
  });

  it("should respond with 404 for unknown routes", async () => {
    const response = await request(app).get("/unknown-route");
    expect(response.status).toBe(404);
  });
});
