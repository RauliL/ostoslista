import axios from "axios";
import { PublicUser } from "express-varasto-jwt-auth";

import "./authToken";
import { LoginRequest, LoginResponse } from "./types";

export const login = (credentials: LoginRequest): Promise<LoginResponse> =>
  axios
    .post<LoginResponse>("/api/auth/login", credentials)
    .then((response) => response.data);

export const getCurrentUser = (): Promise<{ user: PublicUser }> =>
  axios
    .get<{ user: PublicUser }>("/api/auth/me")
    .then((response) => response.data);

export const createUser = (request: {
  username: string;
  password: string;
  isAdmin?: boolean;
}): Promise<{ user: PublicUser }> =>
  axios
    .post<{ user: PublicUser }>("/api/users", request)
    .then((response) => response.data);

export const listUsers = (): Promise<{ users: PublicUser[] }> =>
  axios
    .get<{ users: PublicUser[] }>("/api/users")
    .then((response) => response.data);

export const deleteUser = (username: string): Promise<void> =>
  axios
    .delete(`/api/users/${encodeURIComponent(username)}`)
    .then(() => undefined);
