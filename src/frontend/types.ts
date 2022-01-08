export type Entry = {
  text: string;
  done: boolean;
};

export type SavedEntry = Entry & { id: string };

export type EntryType = 'todo' | 'done';
