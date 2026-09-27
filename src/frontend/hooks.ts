import { partition } from "lodash-es";
import { useMemo } from "react";
import useSWR from "swr";

import { getAllEntries } from "./api";
import { SavedEntry } from "./types";

const EMPTY_ENTRIES: SavedEntry[] = [];

export const useAllEntries = (): {
  todoEntries: SavedEntry[];
  doneEntries: SavedEntry[];
  error: Error | undefined;
  isLoading: boolean;
} => {
  const { data, error, isLoading } = useSWR("entries", getAllEntries);
  const [doneEntries, todoEntries] = useMemo(
    () =>
      data != null ? partition(data, "done") : [EMPTY_ENTRIES, EMPTY_ENTRIES],
    [data],
  );

  return { todoEntries, doneEntries, error, isLoading };
};

export const useEntry = (
  id?: string,
): { entry: SavedEntry | undefined; isLoading: boolean } => {
  const { todoEntries, doneEntries, isLoading } = useAllEntries();

  return {
    entry:
      todoEntries.find((e) => e.id === id) ??
      doneEntries.find((e) => e.id === id),
    isLoading,
  };
};
