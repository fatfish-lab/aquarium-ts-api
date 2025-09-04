import type { Bot, User } from "./types/item.ts";
type params = {
  // deno-lint-ignore no-explicit-any
  [x: string]: any;
};
type body = params | BodyInit;
/**
 * Aquarium API class to regroup all API low level functions and authentication token
 */
export class Aquarium {
  /** API version */
  apiVersion: string;
  /** API origin URL */
  apiUrl: string;
  /** API base URL including the API version */
  url: URL;
  /** API token used to authenticate requests */
  token: string | undefined;
  /** API Aquarium domain */
  domain?: string | undefined;
  /**
   * @param {string} url - Your Aquarium Studio url instance with protocol (ex: `https://`) and port if needed
   * @param {string} [token] - Your personal access token or a saved token
   * @param {string} [domain] - Specify the domain used for unauthenticated requests. Mainly for Aquarium Fatfish Lab dev or local Aquarium server without DNS.
   */
  constructor(url: string, token?: string | null, domain?: string | null) {
    this.apiUrl = url;
    this.apiVersion = "v1";
    this.url = new URL(`/${this.apiVersion}/`, this.apiUrl);

    if (domain) this.domain = domain;
    if (token) this.token = token;
  }

  /**
   * Low level function to send request to Aquarium server using Fetch
   * @param {string} method - Method used for the request
   * @param {string} url - Base URL for the API endpoint (ex: `users/me`)
   * @param {params} [params] - URL search parameters
   * @param {body} [body] - URL body object
   * @returns Aquarium response
   */
  aquarium<T>(
    method: string,
    url: string,
    params?: params | undefined,
    body?: body | undefined,
  ): Promise<T> {
    const resource = new URL(this.url + url);

    if (params != null) {
      Object.keys(params).forEach((name) => {
        resource.searchParams.append(name, params[name]);
      });
    }

    const headers = new Headers();
    if (this.token) headers.append("authorization", this.token);
    if (this.domain) headers.append("aquarium-domain", this.domain);

    const request: RequestInit = {
      method,
      headers,
      credentials: "include",
    };

    if (body == null) {
      headers.append("Content-Type", "application/json; charset=UTF-8");
    } else {
      if (!(body instanceof FormData)) {
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
            body = await response.text();
            reject(new Error(body));
            // body = await response.json()
            // reject(new Error(body.error))
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
  post<T>(url: string, body?: body, params?: params): Promise<T> {
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
   * @param {body} [body] - URL body object
   * @param {params} [params] - URL search parameters
   * @returns Aquarium response
   */
  patch<T>(url: string, body?: body, params?: params): Promise<T> {
    return this.aquarium<T>("PATCH", url, params, body);
  }

  /**
   * Send a PUT request to Aquarium server
   * @param {string} url - Base URL for the API endpoint (ex: `users/me`)
   * @param {body} [body] - URL body object
   * @param {params} [params] - URL search parameters
   * @returns Aquarium response
   */
  put<T>(url: string, body?: body, params?: params): Promise<T> {
    return this.aquarium<T>("PUT", url, params, body);
  }

  /**
   * Send a DELETE request to Aquarium server
   * @param {string} url - Base URL for the API endpoint (ex: `users/me`)
   * @param {body} [body] - URL body object
   * @param {params} [params] - URL search parameters
   * @returns Aquarium response
   */
  delete<T>(url: string, body?: body, params?: params): Promise<T> {
    return this.aquarium<T>("DELETE", url, params, body);
  }
}
