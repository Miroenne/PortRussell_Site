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

    var data;
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // 'include' ensures that HTTP-only cookies (like JWT) are handled correctly
            credentials: "include",
            body: JSON.stringify({ email, password }),
        }).then(async (response) => {
            data = await response.json();
            if (!response.ok) {
                throw data;
            }
            return data;
        });
    } catch (error) {
        alert(error.errorMessage);
        return;
    }

    const userName = data.userName;
    const userEmail = data.email;
    const user = { userName, userEmail };

    // If the server validates credentials (status 200)
    if (user) {
        /**
         * Session Persistence:
         * Stores non-sensitive user data (e.g., username, email) in sessionStorage
         * to maintain context throughout the session.
         */
        sessionStorage.setItem("user", JSON.stringify(user));

        // Redirect user to the dashboard
        window.location.href = "./pages/home.html";
    } else {
        // Basic UI feedback for failed authentication
        // alert("Identifiant ou mot de passe incorrect");
    }
}
