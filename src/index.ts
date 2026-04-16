import type { Bot, User } from "./types/item.ts";

type params = {
  // deno-lint-ignore no-explicit-any
  [x: string]: any;
};
type Body = params | BodyInit;
export type UploadProgress = {
  loaded: number;
  total: number;
  percent: number;
  lengthComputable: boolean;
};
/**
 * Aquarium API class to regroup all API low level functions and authentication token
 */
export class Aquarium {
  /** API base URL including the API version */
  url: URL;
  /** API token used to authenticate requests */
  token: string | undefined;

  private _apiUrl: string;
  private _apiVersion: string;
  private _domain?: string | undefined;

  /**
   * @param {string} url - Your Aquarium Studio url instance with protocol (ex: `https://`) and port if needed
   * @param {string} [token] - Your personal access token or a saved token
   * @param {string} [domain] - Specify the domain used for unauthenticated requests. Mainly for Aquarium Fatfish Lab dev or local Aquarium server without DNS.
   */
  constructor(url: string, token?: string | null, domain?: string | null) {
    this._apiUrl = url;
    this._apiVersion = "v1";
    this.url = new URL(`/${this._apiVersion}/`, this._apiUrl);

    if (domain) this._domain = domain;
    if (token) this.token = token;
  }

  /**
   * API origin URL
   */
  get apiUrl(): string {
    return this._apiUrl;
  }

  set apiUrl(value: string) {
    this._apiUrl = value;
    this.url = new URL(`/${this._apiVersion}/`, this._apiUrl);
  }

  /**
   * API version
   */
  get apiVersion(): string {
    return this._apiVersion;
  }

  set apiVersion(value: string) {
    this._apiVersion = value;
    this.url = new URL(`/${this._apiVersion}/`, this._apiUrl);
  }

  /**
   * API Aquarium domain
   */
  get domain(): string | undefined {
    return this._domain;
  }

  set domain(value: string | undefined) {
    this._domain = value;
  }

  /**
   * Low level function to send request to Aquarium server using Fetch
   * @param {string} method - Method used for the request
   * @param {string} url - Base URL for the API endpoint (ex: `users/me`)
   * @param {params} [params] - URL search parameters
   * @param {Body} [body] - URL body object
   * @returns Aquarium response
   */
  aquarium<T>(
    method: string,
    url: string,
    params?: params | undefined,
    body?: Body | undefined,
  ): Promise<T> {
    const resource = new URL(this.url + url);

    if (params != null) {
      Object.keys(params).forEach((name) => {
        resource.searchParams.append(name, params[name]);
      });
    }

    const headers = new Headers();
    if (this.token) headers.append("authorization", this.token);
    if (this.domain) headers.append("x-aquarium-domain", this.domain);

    const request: RequestInit = {
      method,
      headers,
      credentials: "include",
    };

    if (body == null) {
      headers.append("Content-Type", "application/json; charset=UTF-8");
    } else {
      if (
        typeof body === "object" &&
        Object.values(body).some((value) => value instanceof File)
      ) {
        const formData = new FormData();
        Object.keys(body).forEach((key) => {
          // deno-lint-ignore no-explicit-any
          const value = (body as any)[key];
          if (value !== undefined && value !== null) {
            if (value instanceof File) {
              formData.append(key, value);
            } else {
              formData.append(key, JSON.stringify(value));
            }
          }
        });
        request.body = formData;
      } else if (!(body instanceof FormData)) {
        headers.append("Content-Type", "application/json; charset=UTF-8");
        request.body = JSON.stringify(body);
      } else request.body = body;
    }

    return new Promise((resolve, reject) => {
      fetch(resource.toString(), request).then(async (response) => {
        if (response.ok) {
          const body = await response.json();
          resolve(body);
        } else {
          let body;

          try {
            body = await response.json();
            if (body.error) {
              reject({ message: body.error, status: response.status });
              return;
            }
          } catch {
            // Continue with text body
          }

          try {
            body = await response.text();
            reject(new Error(body));
          } catch {
            reject(new Error("Error during fetch"));
          }
        }
      }).catch((e) => {
        reject(e);
      });
    });
  }

  /**
   * Signin to Aquarium and store the token in the class instance
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns
   */
  async signin(email: string, password: string): Promise<{ user: User }> {
    const me = await this.post<{ user: User; token?: string }>("signin", {
      email,
      password,
    });
    if (me.token) {
      this.token = me.token;
      delete me.token;
    }
    return me;
  }

  /**
   * Signin a bot to Aquarium and store the token in the class instance
   * @param {string} _key - Bot's _key
   * @param {string} secret - Bot's secret
   * @returns
   */
  async signinBot(_key: string, secret: string): Promise<{ bot: Bot }> {
    const bot = await this.post<{ bot: Bot; token?: string }>(
      `bots/${_key}/signin`,
      { secret },
    );
    if (bot.token) {
      this.token = bot.token;
      delete bot.token;
    }
    return bot;
  }

  /**
   * Get connected user information
   * @returns Aquarium connected user
   */
  me(): Promise<{ user: User }> {
    return this.get<{ user: User }>("users/me");
  }

  /**
   * Send a POST request to Aquarium server
   * @param {string} url - Base URL for the API endpoint (ex: `users/me`)
   * @param {body} [body] - URL body object
   * @param {params} [params] - URL search parameters
   * @returns Aquarium response
   */
  post<T>(url: string, body?: Body, params?: params): Promise<T> {
    return this.aquarium<T>("POST", url, params, body);
  }

  /**
   * Send a GET request to Aquarium server
   * @param {string} url - Base URL for the API endpoint (ex: `users/me`)
   * @param {params} [params] - URL search parameters
   * @returns Aquarium response
   */
  get<T>(url: string, params?: params): Promise<T> {
    return this.aquarium<T>("GET", url, params);
  }

  /**
   * Send a PATCH request to Aquarium server
   * @param {string} url - Base URL for the API endpoint (ex: `users/me`)
   * @param {Body} [body] - URL body object
   * @param {params} [params] - URL search parameters
   * @returns Aquarium response
   */
  patch<T>(url: string, body?: Body, params?: params): Promise<T> {
    return this.aquarium<T>("PATCH", url, params, body);
  }

  /**
   * Send a PUT request to Aquarium server
   * @param {string} url - Base URL for the API endpoint (ex: `users/me`)
   * @param {Body} [body] - URL body object
   * @param {params} [params] - URL search parameters
   * @returns Aquarium response
   */
  put<T>(url: string, body?: Body, params?: params): Promise<T> {
    return this.aquarium<T>("PUT", url, params, body);
  }

  /**
   * Send a DELETE request to Aquarium server
   * @param {string} url - Base URL for the API endpoint (ex: `users/me`)
   * @param {Body} [body] - URL body object
   * @param {params} [params] - URL search parameters
   * @returns Aquarium response
   */
  delete<T>(url: string, body?: Body, params?: params): Promise<T> {
    return this.aquarium<T>("DELETE", url, params, body);
  }

  /**
   * Upload files using XMLHttpRequest to expose upload progress events.
   * @param {string} url - Base URL for the API endpoint (ex: `files/upload`)
   * @param {params | FormData} body - Upload payload
   * @param {(progress: UploadProgress) => void} [onProgress] - Upload progress callback
   * @param {params} [params] - URL search parameters
   * @param {AbortSignal} [signal] - Optional abort signal to cancel upload
   * @returns Aquarium response
   */
  upload<T>(
    url: string,
    body: params | FormData,
    onProgress?: (progress: UploadProgress) => void,
    params?: params,
    signal?: AbortSignal,
  ): Promise<T> {
    const resource = new URL(this.url + url);

    if (params != null) {
      Object.keys(params).forEach((name) => {
        resource.searchParams.append(name, params[name]);
      });
    }

    let requestBody: FormData;
    if (body instanceof FormData) {
      requestBody = body;
    } else {
      requestBody = new FormData();
      Object.keys(body).forEach((key) => {
        const value = body[key];
        if (value !== undefined && value !== null) {
          if (value instanceof File) {
            requestBody.append(key, value);
          } else {
            requestBody.append(key, JSON.stringify(value));
          }
        }
      });
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", resource.toString());
      xhr.withCredentials = true;

      if (this.token) xhr.setRequestHeader("authorization", this.token);
      if (this.domain) xhr.setRequestHeader("x-aquarium-domain", this.domain);

      if (onProgress) {
        xhr.upload.onprogress = (event) => {
          const percent = event.lengthComputable && event.total > 0
            ? (event.loaded / event.total) * 100
            : 0;
          onProgress({
            loaded: event.loaded,
            total: event.total,
            percent,
            lengthComputable: event.lengthComputable,
          });
        };
      }

      const abortHandler = () => {
        xhr.abort();
      };

      if (signal) {
        if (signal.aborted) {
          reject(new DOMException("Upload aborted", "AbortError"));
          return;
        }
        signal.addEventListener("abort", abortHandler, { once: true });
      }

      const cleanup = () => {
        if (signal) {
          signal.removeEventListener("abort", abortHandler);
        }
      };

      xhr.onload = () => {
        cleanup();
        const responseType = xhr.getResponseHeader("content-type");
        const isJson = responseType?.includes("application/json");

        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            if (isJson) {
              resolve(JSON.parse(xhr.responseText));
            } else {
              // deno-lint-ignore no-explicit-any
              resolve(xhr.responseText as any);
            }
          } catch {
            reject(new Error("Error during upload response parsing"));
          }
          return;
        }

        try {
          if (isJson) {
            const parsed = JSON.parse(xhr.responseText);
            if (parsed.error) {
              reject(new Error(parsed.error));
              return;
            }
          }
          reject(new Error(xhr.responseText || "Error during upload"));
        } catch {
          reject(new Error("Error during upload"));
        }
      };

      xhr.onerror = () => {
        cleanup();
        reject(new Error("Network error during upload"));
      };

      xhr.onabort = () => {
        cleanup();
        reject(new DOMException("Upload aborted", "AbortError"));
      };

      xhr.send(requestBody);
    });
  }
}
