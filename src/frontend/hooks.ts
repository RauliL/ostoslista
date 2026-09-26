import { partition } from "lodash";
import { useEffect, useState } from "react";
import useSWR from "swr";

import { getAllEntries } from "./api";
import { SavedEntry } from "./types";

export const useAllEntries = (): {
  todoEntries: SavedEntry[];
  doneEntries: SavedEntry[];
  error: Error | undefined;
} => {
  const { data, error } = useSWR("entries", getAllEntries);
  const [todoEntries, setTodoEntries] = useState<SavedEntry[]>([]);
  const [doneEntries, setDoneEntries] = useState<SavedEntry[]>([]);

  useEffect(() => {
    if (data != null) {
      const [doneEntries, todoEntries] = partition(data, "done");

      setTodoEntries(todoEntries);
      setDoneEntries(doneEntries);
    }
  }, [data]);

  return { todoEntries, doneEntries, error };
};
