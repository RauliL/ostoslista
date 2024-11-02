export type Entry = {
  text: string;
  done: boolean;
  url?: string | null;
};

export type SavedEntry = Entry & { id: string };

export type EntryType = 'todo' | 'done';
