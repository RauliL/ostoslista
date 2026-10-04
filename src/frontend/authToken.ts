import axios from "axios";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const TOKEN_STORAGE_KEY: Readonly<string> = "ostoslista.authToken";

export const getStoredToken = (): string | null =>
  localStorage.getItem(TOKEN_STORAGE_KEY);

export const setStoredToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
};

axios.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response) {
      const message =
        typeof error.response.data?.error === "string"
          ? error.response.data.error
          : error.message;

      return Promise.reject(new ApiError(error.response.status, message));
    }

    return Promise.reject(error);
  },
);
