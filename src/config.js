/**
 * Resolve the API base URL according to the current frontend origin.
 *
 * @param {string} page - API path to append (for example "/users").
 * @returns {string|null} Complete API URL or `null` when origin is unsupported.
 */
export function config(page) {
    const domain = "https://portrussell-site.onrender.com/";
    const local = "http://localhost:5500/";
    const url = window.location.href;
    console.log("dans la fonction config, url : " + url);
    if (url.includes(local)) {
        const configUrl = {
            apiUrl: "http://localhost:3000" + page,
            timeout: 5000,
        };
        console.log(configUrl.apiUrl);
        return configUrl.apiUrl;
    } else if (url.includes(domain)) {
        console.log("url contient domain");
        const configUrl = {
            apiUrl: "https://portrussell-api.onrender.com" + page,
            timeout: 5000,
        };
        console.log(configUrl.apiUrl);
        return configUrl.apiUrl;
    } else {
        return null;
    }
}
