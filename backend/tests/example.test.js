import { describe, it, expect } from "vitest";

function add(a, b) { return a + b; }

describe("add", () => {
  it("adds numbers", () => {
    expect(add(2, 3)).toBe(5);
  });
});

// import request from "supertest";
// import app from "../src/app.js";

// it("GET /users returns list", async () => {
//   await request(app)
//     .get("/users")
//     .expect(200)
//     .expect("Content-Type", /json/);
// });