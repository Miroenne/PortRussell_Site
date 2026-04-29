/**
 * Redirect visitors to the login page if no session user is stored.
 *
 * @returns {void}
 */
function redirect() {
    const user = sessionStorage.getItem("user");

    if (!user) {
        window.location.href = "../index.html";
    }
}

redirect();
