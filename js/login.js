// Bootstrap the login flow as soon as the module is loaded.
const form = document.getElementById("login-form");
form.addEventListener("submit", handleLogin);
import { config } from "../src/config.js";

/**
 * Handle the login form submission and authenticate the user.
 *
 * @param {SubmitEvent} e - Native submit event from the login form.
 * @returns {Promise<void>}
 */
async function handleLogin(e) {
    // URL is resolved at submit time to support local and deployed environments.
    const url = config("/users/login");
    // Prevent the default browser form submission behavior (page reload)
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email");
    const password = formData.get("password");

    // Communication with the authentication endpoint
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // 'include' ensures that HTTP-only cookies (like JWT) are handled correctly
            credentials: "include",
            body: JSON.stringify({ email, password }),
        })
            .then(async (response) => {
                var data;
                if (!response.ok) {
                    data = await response.json();
                    return Promise.reject(data);
                }
                return data;
            })
            .then((data) => {
                console.log(data);
            });
    } catch (error) {
        // Error payloads are expected to expose `errorMessage`.
        alert(jsonData.errorMessage);
    }

    const data = await response.json();

    // If the server validates credentials (status 200)
    if (response.status === 200) {
        /**
         * Session Persistence:
         * Stores non-sensitive user data (e.g., username, email) in sessionStorage
         * to maintain context throughout the session.
         */
        sessionStorage.setItem("user", JSON.stringify(data));

        // Redirect user to the dashboard
        window.location.href = "./pages/home.html";
    } else {
        // Basic UI feedback for failed authentication
        alert("Identifiant ou mot de passe incorrect");
    }
}
