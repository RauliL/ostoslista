import { PublicUser } from "express-varasto-jwt-auth";

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: PublicUser;
};

export type Entry = {
  text: string;
  done: boolean;
  url?: string | null;
};

export type SavedEntry = Entry & { id: string };

export type EntryType = "todo" | "done";
