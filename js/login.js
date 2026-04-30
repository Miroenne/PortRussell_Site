/**
 * @file Handle login form submission and authenticated session bootstrap.
 */

import { config } from "../src/config.js";

/**
 * Login request payload sent to the authentication endpoint.
 *
 * @typedef {Object} LoginPayload
 * @property {FormDataEntryValue|null} email - Raw email value from the login form.
 * @property {FormDataEntryValue|null} password - Raw password value from the login form.
 */

/**
 * User payload returned by a successful login request.
 *
 * @typedef {Object} AuthenticatedUser
 * @property {string} userName - Display name used in the UI.
 * @property {string} email - User email identifier.
 */

/**
 * Handle the login form submission and authenticate the user.
 *
 * @param {SubmitEvent} e - Native submit event from the login form.
 * @returns {Promise<void>} Resolves after authentication flow completes.
 */
async function handleLogin(e) {
    // URL is resolved at submit time to support local and deployed environments.
    const url = config("/users/login");
    // Prevent the default browser form submission behavior (page reload)
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email");
    const password = formData.get("password");
    /** @type {LoginPayload} */
    const payload = { email, password };

    /** @type {AuthenticatedUser} */
    var data;
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // 'include' ensures that HTTP-only cookies (like JWT) are handled correctly
            credentials: "include",
            body: JSON.stringify(payload),
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
        // Persist non-sensitive user data to keep UI context during this browser session.
        sessionStorage.setItem("user", JSON.stringify(user));

        // Redirect user to the dashboard
        window.location.href = "./pages/home.html";
    } else {
        // Basic UI feedback for failed authentication
        // alert("Identifiant ou mot de passe incorrect");
    }
}

const form = document.getElementById("login-form");
// Bootstrap the login flow as soon as the login module is loaded.
form.addEventListener("submit", handleLogin);
