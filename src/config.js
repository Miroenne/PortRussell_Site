/**
 * Resolve the API base URL according to the current frontend origin.
 *
 * @param {string} page - API path to append (for example "/users").
 * @returns {string|null} Complete API URL or `null` when origin is unsupported.
 * @remarks The function is meant to centralize origin-based API URL selection.
 */
export function config(page) {
    // Frontend origin in production (used to detect deployed mode).
    const domain = "https://portrussell-site.onrender.com";
    // Frontend origin in local development.
    const local = "http://localhost:5500";
    const url = window.location.href;

    if (url.includes(local)) {
        const configUrl = {
            apiUrl: "http://localhost:3000" + page,
            timeout: 5000,
        };

        return configUrl.apiUrl;
    } else if (url.includes(domain)) {
        const configUrl = {
            apiUrl: "https://portrussell-api.onrender.com" + page,
            timeout: 5000,
        };

        return configUrl.apiUrl;
    } else {
        return null;
    }
}
