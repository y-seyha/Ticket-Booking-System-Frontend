import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

export type RetryConfig = {
  _retry?: boolean;
};

export type AppAxiosRequestConfig = InternalAxiosRequestConfig & RetryConfig;

type QueueItem = {
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
};

let apiClient: AxiosInstance | null = null;
let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown): void => {
  failedQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else {
      p.resolve(undefined);
    }
  });

  failedQueue = [];
};

export function getApiClient(): AxiosInstance {
  if (apiClient) return apiClient;

  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 10_000,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  apiClient = client;

  apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    return config;
  });

  apiClient.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      const axiosError = error as AxiosError;
      const originalRequest = axiosError.config as AppAxiosRequestConfig;

      // No response (network error, timeout, etc.)
      if (!axiosError.response) {
        return Promise.reject(error);
      }

      const status = axiosError.response.status;

      // Only handle 401
      if (status !== 401) {
        return Promise.reject(error);
      }

      // Prevent infinite refresh loop
      if (originalRequest.url?.includes("/auth/refresh")) {
        return Promise.reject(error);
      }

      if (originalRequest.url?.includes("/auth/2fa/verify")) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise<unknown>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => apiClient!(originalRequest));
      }

      isRefreshing = true;
      try {
        await client.post("/auth/refresh");

        isRefreshing = false;
        processQueue(null);

        // retry original request
        return client(originalRequest);
      } catch (refreshError: unknown) {
        isRefreshing = false;
        processQueue(refreshError);

        return Promise.reject(refreshError);
      }
    },
  );

  return apiClient;
}
