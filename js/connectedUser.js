/**
 * @file Resolve the connected user from the session and display profile data.
 */

import { config } from "../../src/config.js";

/**
 * User shape persisted in session storage.
 *
 * @typedef {Object} SessionUser
 * @property {string} userName - Display name shown in the UI.
 * @property {string} userEmail - Unique user email.
 */

/**
 * User payload returned by the profile endpoint.
 *
 * @typedef {Object} UserProfileResponse
 * @property {string} userName - User display name.
 * @property {string} email - User email address.
 */

/**
 * Fetch the currently connected user and display their profile data.
 *
 * @returns {Promise<void>} Resolves after profile data has been rendered.
 */
async function connectedUser() {
    const connectedUser = sessionStorage.getItem("user");
    const name = document.getElementById("connectedUserName");
    const email = document.getElementById("connectedUserEmail");

    /** @type {SessionUser} */
    const sessionUser = JSON.parse(connectedUser);

    const url = config("/users/" + sessionUser.userEmail);
    var response;

    /** @type {UserProfileResponse} */
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
