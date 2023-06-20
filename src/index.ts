

type params = {
    // deno-lint-ignore no-explicit-any
    [x: string]: any
}
type body = params | BodyInit
/**
 * Aquarium API class to regroup all API low level functions and authentication token
 */
class Aquarium {
    apiVersion: string
    apiUrl: string
    url: URL
    token: string | undefined
    domain: string | undefined
    /**
     * @constructs
     * @param {string} url - Your Aquarium Studio url instance with protocol (ex: `https://`) and port if needed
     * @param {string} [token] - Your personal access token or a saved token
     * @param {string} [domain] - Specify the domain used for unauthenticated requests. Mainly for Aquarium Fatfish Lab dev or local Aquarium server without DNS.
     */
    constructor(url: string, token?: string | null, domain?: string | null) {
        this.apiUrl = url
        this.apiVersion = 'v1'
        this.url = new URL(`/${this.apiVersion}/`, this.apiUrl)

        if (domain) this.domain = domain
        if (token) this.token = token
    }

    /**
     * Low level function to send request to Aquarium server using Fetch
     * @param {string} method - Method used for the request
     * @param {string} url - Base URL for the API endpoint (ex: `users/me`)
     * @param {params} [params] - URL search parameters
     * @param {body} [body] - URL body object
     * @returns Aquarium response
     */
    aquarium(method: string, url: string, params?: params | undefined, body?: body | undefined) {
        const resource = new URL(this.url + url)

        if (params != null) {
            Object.keys(params).forEach(name => {
                resource.searchParams.append(name, params[name])
            })
        }

        const headers = new Headers()
        if (this.token) headers.append('authorization', this.token)
        if (this.domain) headers.append('aquarium-domain', this.domain)

        const request: RequestInit = {
            method,
            headers
        }

        if (body == null) {
            headers.append("Content-Type", "application/json; charset=UTF-8")
        } else {
            if (!(body instanceof FormData)) {
                headers.append("Content-Type", "application/json; charset=UTF-8")
                request.body = JSON.stringify(body)
            } else request.body = body
        }

        return new Promise((resolve, reject) => {
            fetch(resource.toString(), request).then(async response => {
                if (response.status < 300) {
                    const body = await response.json()
                    resolve(body)
                } else {
                    const body = await response.text()
                    reject(body)
                }
            }).catch(e => {
                console.log('Error')
                reject(e)
            })
        })
    }

    /**
     * Signin to Aquarium and store the token in the class instance
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns
     */
    async signin(email: string, password: string) {
        // deno-lint-ignore no-explicit-any
        const me = await this.post('signin', undefined, {email, password}) as Record<string, any>
        if (me.token) {
            this.token = me.token
            delete me.token
        }
        return me
    }

    /**
     * Get connected user information
     * @returns Aquarium connected user
     */
    me() {
        return this.get('users/me')
    }

    /**
     * Send a POST request to Aquarium server
     * @param {string} url - Base URL for the API endpoint (ex: `users/me`)
     * @param {params} [params] - URL search parameters
     * @param {body} [body] - URL body object
     * @returns Aquarium response
     */
    post(url: string, params?: params, body?: body) {
        return this.aquarium('POST', url, params, body)
    }

    /**
     * Send a GET request to Aquarium server
     * @param {string} url - Base URL for the API endpoint (ex: `users/me`)
     * @param {params} [params] - URL search parameters
     * @returns Aquarium response
     */
    get(url: string, params?: params) {
        return this.aquarium('GET', url, params)
    }

    /**
     * Send a PATCH request to Aquarium server
     * @param {string} url - Base URL for the API endpoint (ex: `users/me`)
     * @param {params} [params] - URL search parameters
     * @param {body} [body] - URL body object
     * @returns Aquarium response
     */
    patch(url: string, params?: params, body?: body) {
        return this.aquarium('PATCH', url, params, body)
    }

    /**
     * Send a PUT request to Aquarium server
     * @param {string} url - Base URL for the API endpoint (ex: `users/me`)
     * @param {params} [params] - URL search parameters
     * @param {body} [body] - URL body object
     * @returns Aquarium response
     */
    put(url: string, params?: params, body?: body) {
        return this.aquarium('PUT', url, params, body)
    }

    /**
     * Send a DELETE request to Aquarium server
     * @param {string} url - Base URL for the API endpoint (ex: `users/me`)
     * @param {params} [params] - URL search parameters
     * @param {body} [body] - URL body object
     * @returns Aquarium response
     */
    delete(url: string, params?: params, body?: body) {
        return this.aquarium('DELETE', url, params, body)
    }
}

export default Aquarium

