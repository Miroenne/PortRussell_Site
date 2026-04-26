async function connectedUser() {
    const connectedUser = sessionStorage.getItem("user");
    const name = document.getElementById("connectedUserName");
    const email = document.getElementById("connectedUserEmail");

    const sessionUser = JSON.parse(connectedUser);

    // const url = config("/users/" + sessionUser.email);
    // console.log(url);

    const response = await fetch(
        "http://localhost:3000/users/" + sessionUser.email,
        {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            // 'include' ensures that HTTP-only cookies (like JWT) are handled correctly
            credentials: "include",
        },
    );

    const user = await response.json();

    if (user) {
        name.innerHTML = user.userName;
        email.innerHTML = user.email;
    }
}

connectedUser();
