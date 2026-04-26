function redirect() {
    const user = sessionStorage.getItem("user");

    if (!user) {
        window.location.href = "../index.html";
    }
}

redirect();
