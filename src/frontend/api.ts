import axios from "axios";
import { mutate } from "swr";

import { Entry, SavedEntry } from "./types";

export const getAllEntries = (): Promise<SavedEntry[]> =>
  axios
    .get<Record<string, Entry>>("/api")
    .then((response) =>
      Object.entries(response.data).map(([id, entry]) => ({ ...entry, id })),
    );

export const createEntry = (
  text: string,
  url?: string | null,
): Promise<string> =>
  axios
    .post<{ key: string }>("/api", { text, done: false, url })
    .then(async (response) => {
      await mutate("entries");

      return response.data.key;
    });

export const patchEntry = (id: string, entry: Entry): Promise<Entry> =>
  axios.patch<Entry>(`/api/${id}`, entry).then(async (response) => {
    await mutate("entries");

    return response.data;
  });

export const deleteEntry = (id: string): Promise<Entry> =>
  axios.delete<Entry>(`/api/${id}`).then(async (response) => {
    await mutate("entries");

    return response.data;
  });
