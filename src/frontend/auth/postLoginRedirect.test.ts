import { afterEach, describe, expect, it } from "vitest";

import {
  clearPostLoginRedirect,
  resolvePostLoginRedirect,
  savePostLoginRedirect,
} from "./postLoginRedirect";

describe("postLoginRedirect", () => {
  afterEach(() => {
    clearPostLoginRedirect();
  });

  it("stores and resolves a valid redirect path", () => {
    savePostLoginRedirect("/done");

    expect(resolvePostLoginRedirect()).toBe("/done");
    expect(resolvePostLoginRedirect("/todo")).toBe("/todo");
  });

  it("ignores invalid redirect paths", () => {
    savePostLoginRedirect("//evil.example");
    savePostLoginRedirect("/login");
    savePostLoginRedirect("todo");

    expect(resolvePostLoginRedirect()).toBe("/todo");
  });

  it("prefers an explicit fallback when nothing is stored", () => {
    expect(resolvePostLoginRedirect("/add")).toBe("/add");
  });
});
