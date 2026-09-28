import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { mutate } from "swr";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createEntry, deleteEntry, getAllEntries, patchEntry } from "./api";
import { Entry, SavedEntry } from "./types";

vi.mock("swr", () => ({
  mutate: vi.fn(() => Promise.resolve()),
}));

const mockMutate = vi.mocked(mutate);

describe("api", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
    mockMutate.mockClear();
  });

  afterEach(() => {
    mock.restore();
  });

  describe("getAllEntries()", () => {
    it("should fetch all entries and attach their ids", async () => {
      mock.onGet("/api").reply(200, {
        "entry-1": { text: "Milk", done: false, url: "https://example.com" },
        "entry-2": { text: "Bread", done: true },
      });

      await expect(getAllEntries()).resolves.toEqual([
        {
          id: "entry-1",
          text: "Milk",
          done: false,
          url: "https://example.com",
        },
        {
          id: "entry-2",
          text: "Bread",
          done: true,
        },
      ] satisfies SavedEntry[]);
    });

    it("should return an empty array when the API returns no entries", async () => {
      mock.onGet("/api").reply(200, {});

      await expect(getAllEntries()).resolves.toEqual([]);
    });

    it("should reject when the API request fails", async () => {
      mock.onGet("/api").reply(500);

      await expect(getAllEntries()).rejects.toThrow();
    });
  });

  describe("createEntry()", () => {
    it("should create an entry and return its key", async () => {
      mock.onPost("/api").reply(201, { key: "new-entry-id" });

      await expect(
        createEntry("Milk", "https://example.com/milk"),
      ).resolves.toBe("new-entry-id");

      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toEqual({
        text: "Milk",
        done: false,
        url: "https://example.com/milk",
      });
      expect(mockMutate).toHaveBeenCalledWith("entries");
    });

    it("should create an entry without a URL", async () => {
      mock.onPost("/api").reply(201, { key: "new-entry-id" });

      await expect(createEntry("Milk")).resolves.toBe("new-entry-id");

      expect(JSON.parse(mock.history.post[0].data)).toEqual({
        text: "Milk",
        done: false,
      });
      expect(mockMutate).toHaveBeenCalledWith("entries");
    });

    it("should reject when the API request fails", async () => {
      mock.onPost("/api").reply(500);

      await expect(createEntry("Milk")).rejects.toThrow();
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  describe("patchEntry()", () => {
    const entry: Entry = {
      text: "Updated milk",
      done: true,
      url: "https://example.com/milk",
    };

    it("should patch an entry and return the response body", async () => {
      mock.onPatch("/api/entry-1").reply(200, entry);

      await expect(patchEntry("entry-1", entry)).resolves.toEqual(entry);

      expect(mock.history.patch).toHaveLength(1);
      expect(JSON.parse(mock.history.patch[0].data)).toEqual(entry);
      expect(mockMutate).toHaveBeenCalledWith("entries");
    });

    it("should reject when the API request fails", async () => {
      mock.onPatch("/api/entry-1").reply(500);

      await expect(patchEntry("entry-1", entry)).rejects.toThrow();
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  describe("deleteEntry()", () => {
    const entry: Entry = {
      text: "Milk",
      done: false,
    };

    it("should delete an entry and return the response body", async () => {
      mock.onDelete("/api/entry-1").reply(200, entry);

      await expect(deleteEntry("entry-1")).resolves.toEqual(entry);

      expect(mock.history.delete).toHaveLength(1);
      expect(mock.history.delete[0].url).toBe("/api/entry-1");
      expect(mockMutate).toHaveBeenCalledWith("entries");
    });

    it("should reject when the API request fails", async () => {
      mock.onDelete("/api/entry-1").reply(500);

      await expect(deleteEntry("entry-1")).rejects.toThrow();
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });
});
