import {
  PublicUser,
  addUser,
  hasUsers,
  isValidUsername,
} from "express-varasto-jwt-auth";

import { storage } from "./storage.js";

export type InitializeOptions = {
  username: string;
  password: string;
};

export type InitializeResult = {
  user: PublicUser;
};

export class InitializeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InitializeError";
  }
}

export function validateInitializeInput(
  options: InitializeOptions,
): InitializeOptions {
  const username = options.username.trim();
  const password = options.password;

  if (!isValidUsername(username)) {
    throw new InitializeError(
      "Username must be a valid slug (lowercase letters, numbers, and hyphens).",
    );
  }

  if (password.length < 8) {
    throw new InitializeError("Password must be at least 8 characters.");
  }

  return { username, password };
}

export async function initializeApplication(
  options: InitializeOptions,
): Promise<InitializeResult> {
  if (await hasUsers(storage)) {
    throw new InitializeError(
      "Ostoslista is already initialized. Users already exist.",
    );
  }

  const validated = validateInitializeInput(options);
  const user = await addUser(
    storage,
    validated.username,
    validated.password,
    true,
  );

  return { user };
}
