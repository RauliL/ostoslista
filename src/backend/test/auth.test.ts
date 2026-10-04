import { afterEach, describe, expect, it } from "vitest";

import {
  login,
  request,
  seedAdmin,
  seedRegularUser,
  setupBackendTest,
  withAuth,
} from "./helpers.js";

describe("authentication", () => {
  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  it("rejects unauthenticated access to entries", async () => {
    const { app } = await setupBackendTest();

    const response = await request(app).get("/api");

    expect(response.status).toBe(401);
  });

  it("allows login and authenticated access to entries", async () => {
    const { app, addUser } = await setupBackendTest();
    await seedAdmin(addUser);

    const token = await login(app, "admin", "password123");
    const response = await withAuth(app, token).get("/api");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({});
  });

  it("returns the current user from /api/auth/me", async () => {
    const { app, addUser } = await setupBackendTest();
    await seedAdmin(addUser);

    const token = await login(app, "admin", "password123");
    const response = await withAuth(app, token).get("/api/auth/me");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      user: { username: "admin", isAdmin: true },
    });
  });

  it("allows admins to create users", async () => {
    const { app, addUser } = await setupBackendTest();
    await seedAdmin(addUser);

    const token = await login(app, "admin", "password123");
    const response = await withAuth(app, token)
      .post("/api/users")
      .send({ username: "bob", password: "password123", isAdmin: false });

    expect(response.status).toBe(201);
    expect(response.body.user).toEqual({
      username: "bob",
      isAdmin: false,
    });
  });

  it("forbids non-admins from managing users", async () => {
    const { app, addUser } = await setupBackendTest();
    await seedAdmin(addUser);
    await seedRegularUser(addUser);

    const token = await login(app, "alice", "password123");
    const response = await withAuth(app, token).get("/api/users");

    expect(response.status).toBe(403);
  });
});
