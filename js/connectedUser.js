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

    const url = config("/users/" + sessionUser.email);
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            // 'include' ensures that HTTP-only cookies (like JWT) are handled correctly
            credentials: "include",
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
        alert(jsonData.errorMessage);
    }

    const user = await response.json();

    if (user) {
        name.innerHTML = user.userName;
        email.innerHTML = user.email;
    }
}

// Bootstrap connected user rendering when the home page loads.
connectedUser();
