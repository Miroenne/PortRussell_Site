import { config } from "../../src/config.js";

/**
 * Fetch the currently connected user and display their profile data.
 *
 * @returns {Promise<void>}
 */
async function connectedUser() {
    const connectedUser = sessionStorage.getItem("user");
    const name = document.getElementById("connectedUserName");
    const email = document.getElementById("connectedUserEmail");

    const sessionUser = JSON.parse(connectedUser);

    const url = config("/users/" + sessionUser.userEmail);
    var response;

    var data;
    try {
        response = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            // 'include' ensures that HTTP-only cookies (like JWT) are handled correctly
            credentials: "include",
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

    const userName = await data.userName;
    const userEmail = await data.email;
    const user = { userName, userEmail };

    if (user) {
        name.innerHTML = user.userName;
        email.innerHTML = user.userEmail;
    }
}

// Bootstrap connected user rendering when the home page loads.
connectedUser();
