const form = document.getElementById("login-form");
form.addEventListener("submit", handleLogin);
import { config } from "../src/config.js";
const url = config("/users/login");

/**
 * Handle Login logic
 * Triggered on form submission. Performs an asynchronous POST request to the server.
 */
async function handleLogin(e) {
    // Prevent the default browser form submission behavior (page reload)
    e.preventDefault();
    console.log("Entrée dans la fonction handleLogin");
    const formData = new FormData(e.currentTarget);
    console.log(formData);
    const email = formData.get("email");
    const password = formData.get("password");

    console.log("Email:", email);
    console.log("Password:", password);
    console.log(url);

    // Communication with the authentication endpoint
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 'include' ensures that HTTP-only cookies (like JWT) are handled correctly
        credentials: "include",
        body: JSON.stringify({ email, password }),
    });

    console.log(response);

    const data = await response.json();
    console.log(data);

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
