export function config(page) {
    const domain = "https://portrussell-api.onrender.com/";
    const local = "http://localhost:5500/";
    const url = window.location.href;
    console.log(url);

    if (url.includes(local)) {
        const configUrl = {
            apiUrl: "http://localhost:3000" + page,
            timeout: 5000,
        };
        console.log(configUrl.apiUrl);
        return configUrl.apiUrl;
    } else if (url.includes(domain)) {
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
