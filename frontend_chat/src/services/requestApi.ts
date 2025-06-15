import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestHeaders,
} from "axios";
import * as rax from "retry-axios";
import keyManager from "./key-manager";
import { v4 as uuidV4 } from "uuid";
import Cookie from "js-cookie";

const unAuthenticatedAdminEndpoints = {
  "/auth/signin": "POST",
};

export interface Config {
  baseUrl: string;
  maxRetries: number;
  apiKey?: string;
  publishableApiKey?: string;
}
export interface RequestOptions {
  timeout?: number;
  numberOfRetries?: number;
}
export type RequestMethod = "DELETE" | "POST" | "GET" | "PATCH" | "PUT";

const defaultConfig = {
  maxRetries: 0,
  baseUrl:
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_PUBLIC_BACKEND_URL
      : "/api/v1",
};

class ClientApi {
  private axiosClient: AxiosInstance;
  private config: Config;

  constructor(config: Config) {
    /** @private @constant {AxiosInstance} */
    this.axiosClient = this.createClient({ ...defaultConfig, ...config });

    /** @private @constant {Config} */
    this.config = { ...defaultConfig, ...config };
  }

  shouldRetryCondition(
    err: AxiosError,
    numRetries: number,
    maxRetries: number
  ): boolean {
    // Obviously, if we have reached max. retries we stop
    if (numRetries >= maxRetries) {
      return false;
    }

    // If no response, we assume a connection error and retry
    if (!err.response) {
      return true;
    }

    // Retry on conflicts
    if (err.response.status === 409) {
      return true;
    }

    // All 5xx errors are retried
    // OBS: We are currently not retrying 500 requests, since our core needs proper error handling.
    //      At the moment, 500 will be returned on all errors, that are not of type MedusaError.
    if (err.response.status > 500 && err.response.status <= 599) {
      return true;
    }

    return false;
  }

  // Stolen from https://github.com/stripe/stripe-node/blob/fd0a597064289b8c82f374f4747d634050739043/lib/utils.js#L282
  normalizeHeaders(
    obj: object
  ): Record<string, string | number | boolean | null | undefined> {
    if (!(obj && typeof obj === "object")) {
      return obj;
    }

    return Object.keys(obj).reduce((result, header) => {
      // @ts-expect-error: obj may not have the expected structure, but we handle it safely
      result[this.normalizeHeader(header)] = obj[header];
      return result;
    }, {});
  }

  // Stolen from https://github.com/marten-de-vries/header-case-normalizer/blob/master/index.js#L36-L41
  normalizeHeader(header: string): string {
    return header
      .split("-")
      .map(
        (text) => text.charAt(0).toUpperCase() + text.substr(1).toLowerCase()
      )
      .join("-");
  }

  requiresAuthentication(path: string, method: string): boolean {
    // @ts-expect-error: unAuthenticatedAdminEndpoints may not be defined in the current context
    return unAuthenticatedAdminEndpoints?.[path] !== method;
  }

  setHeaders(
    userHeaders: RequestOptions,
    method: RequestMethod,
    path: string,
    customHeaders: Record<string, any> = {}
  ): AxiosRequestHeaders {
    let defaultHeaders: Record<string, any> = {
      // Accept: "application/json",
      "Content-Type": "application/json",
    };

    const accessToken = Cookie.get("accessToken");
    if (accessToken && this.requiresAuthentication(path, method)) {
      defaultHeaders = {
        ...defaultHeaders,
        Authorization: `Bearer ${accessToken}`,
      };
    }

    const publishableApiKey =
      this.config.publishableApiKey || keyManager.getPublishableApiKey();

    if (publishableApiKey) {
      defaultHeaders["x-publishable-api-key"] = publishableApiKey;
    }

    // only add idempotency key, if we want to retry
    if (this.config.maxRetries > 0 && method === "POST") {
      defaultHeaders["Idempotency-Key"] = uuidV4();
    }

    // @ts-expect-error: userHeaders may not match the expected object structure
    return Object.assign(
      {},
      defaultHeaders,
      this.normalizeHeaders(userHeaders),
      customHeaders
    );
  }

  createClient(config: Config): AxiosInstance {
    const client = axios.create({
      baseURL: config.baseUrl,
    });
    rax.attach(client);
    client.defaults.raxConfig = {
      instance: client,
      retry: config.maxRetries,
      backoffType: "exponential",
      shouldRetry: (err: AxiosError): boolean => {
        const cfg = rax.getConfig(err);
        if (cfg) {
          return this.shouldRetryCondition(
            err,
            cfg.currentRetryAttempt ?? 1,
            cfg.retry ?? 3
          );
        } else {
          return false;
        }
      },
    };

    return client;
  }

  async request(
    method: RequestMethod,
    path: string,
    payload: Record<string, any> = {},
    options: RequestOptions = {},
    customHeaders: Record<string, any> = {}
  ): Promise<any> {
    const reqOpts: {
      method: RequestMethod;
      withCredentials: boolean;
      url: string;
      json: boolean;
      headers: AxiosRequestHeaders;
      data?: any;
      params?: Record<string, any>;
    } = {
      method,
      withCredentials: false,
      url: path,
      json: true,
      headers: this.setHeaders(options, method, path, customHeaders),
    };

    if (["POST", "DELETE", "PATCH", "PUT"].includes(method)) {
      reqOpts["data"] = payload;
    } else if (method === "GET") {
      reqOpts["params"] = payload;
    }
    // e.g. data = { cart: { ... } }, response = { status, headers, ... }
    const { data, ...response } = await this.axiosClient(reqOpts);

    // e.g. would return an object like of this shape { cart, response }
    return { ...data, response };
  }
}

export default ClientApi;
