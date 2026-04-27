import { config } from "../src/config.js";
import { extractAndDisplayUsers } from "../js/users.js";

async function logout() {
    const url = config("/users/logout");
    console.log(url);

    try {
        await fetch(url, {
            method: "GET",
            // 'include' ensures that HTTP-only cookies (like JWT) are handled correctly
            credentials: "include",
        });
    } catch (error) {
        console.log(error);
    }

    sessionStorage.removeItem("user");

    window.location.href = "../index.html";
}

function activeClassChanger(activeElement, nonActiveElement) {
    if (activeElement) {
        activeElement.classList.add("active");
        activeElement.classList.add("fw-bold");
        activeElement.ariaCurrent = "page";
    }
    if (nonActiveElement) {
        nonActiveElement.classList.remove("active");
        nonActiveElement.classList.remove("fw-bold");
        nonActiveElement.ariaCurrent = "";
    }
    window.activeClassChanger = activeClassChanger;
}

export function createNavBar() {
    const navBarDiv = document.querySelector("#navBar");
    const navBar = document.createElement("nav");
    navBar.classList.add("navbar");
    navBar.classList.add("navbar-expand-lg");

    navBar.innerHTML = `
      <div class="container-fluid ">
        <a class="navbar-brand fs-4 fw-bold" href="../pages/home.html">Port Russell</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse justify-content-end navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
            <li class="nav-item">
            <a class="nav-link" aria-current="page" id="home" href="../pages/home.html">Home</a>
            </li>
            <li class="nav-item">
            <a class="nav-link" id="reservations" href="../pages/reservations.html">Réservations</a>
            </li>
            <li class="nav-item">
            <a class="nav-link" id="catways" href="../pages/catways.html">Catways</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="users" href="../pages/users.html">Utilisateurs</a
            </li>
            <li class="nav-item">
                <button type="button" class="nav-link" id="logoutBtn">Déconnexion</button>
            </li>
        </ul>
        </div>
    </div>
`;

    const home = navBar.querySelector("#home");
    const reservations = navBar.querySelector("#reservations");
    const catways = navBar.querySelector("#catways");
    const users = navBar.querySelector("#users");

    const logoutBtn = navBar.querySelector("#logoutBtn");
    logoutBtn.addEventListener("click", async () => {
        await logout();
    });

    const url = window.location.href;

    if (url.includes("home")) {
        activeClassChanger(home, reservations);
        activeClassChanger(home, catways);
        activeClassChanger(home, users);
    } else if (url.includes("reservations")) {
        activeClassChanger(reservations, home);
        activeClassChanger(reservations, catways);
        activeClassChanger(reservations, users);
    } else if (url.includes("catways")) {
        activeClassChanger(catways, home);
        activeClassChanger(catways, reservations);
        activeClassChanger(catways, users);
    } else if (url.includes("users")) {
        activeClassChanger(users, home);
        activeClassChanger(users, reservations);
        activeClassChanger(users, catways);
    }

    navBarDiv.appendChild(navBar);
}

createNavBar();
