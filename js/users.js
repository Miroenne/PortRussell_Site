import { config } from "../src/config.js";

/**
 * User object returned by the API.
 *
 * @typedef {Object} UserDto
 * @property {string} userName - Full user name.
 * @property {string} email - User unique email.
 */

/**
 * User payload used in create and update requests.
 *
 * @typedef {Object} UserPayload
 * @property {string|FormDataEntryValue|null} userName - User display name.
 * @property {string|FormDataEntryValue|null} email - User email.
 * @property {string|FormDataEntryValue|null} [password] - Raw password (optional on update).
 */

/**
 * Fetch all users and render one card per user.
 *
 * @returns {Promise<void>}
 */
export async function extractAndDisplayUsers() {
    const usersUrl = config("/users");

    const usersResponse = await fetch(usersUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    });

    const users = await usersResponse.json();

    const usersCardsContainer = document.querySelector("#usersCardsContainer");
    users.forEach((user) => {
        const name = user.userName.replaceAll(" ", "");
        const usersCardId = `${name}Card`;
        const usersUpdateModalId = `${name}UpdateModal`;

        console.log(usersCardId);
        console.log(usersUpdateModalId);

        usersCardsContainer.innerHTML += `                        
                <div class="card shadow-lg min-h-200 mx-auto border-2 mt-5 w-45" id=${usersCardId}>            
                    <div class="card-body text-center">
                        <!-- Standard grid layout for common resource properties -->
                        <div class="row">
                            <div class="col-6">                        
                                <img src="../assets/img/user.png" class='cardIcon mb-2' alt="user_icon"/>
                                <p class="card-title" id="name">${user.userName}</p>
                            </div>                    
                            <div class="col-6">
                                <img src="../assets/img/email.png" class='cardIcon mb-2' alt="email_icon"/>
                                <p class="card-title" id="userEmail">${user.email}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Modal integration for the Update/Delete action -->
                    <div class='card-footer'>
                       <div>
                            <!-- Action buttons to trigger the Modal or the Delete process -->
                            <div class="text-center row justify-content-evenly">
                                <button type="button" class="btn btn-success w-auto col-6 " data-bs-toggle="modal" data-bs-target="#${usersUpdateModalId}">
                                Modifier
                                </button>
                                <button class="btn btn-danger w-auto d-inline col-6 delete-button" data-user-email="${user.email}" type="button">
                                    Supprimer
                                </button>                
                            </div>

                            <!-- Bootstrap Modal Structure -->
                            <div class="fade modal " id="${usersUpdateModalId}" name='myModal' tabIndex="-1" aria-labelledby="${usersUpdateModalId}Label" aria-hidden="true">                    
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h1 class="modal-title fs-5" id="${usersUpdateModalId}Label">Ajouter un utilisateur</h1>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body">
                                            <!--Dynamic form generation based on the fields array prop -->
                                            <form class="update-user-form" data-original-email="${user.email}">     
                                                <div class='container'>                     
                                                    <div class='mb-3 text-start' >
                                                        <label class='form-label' for="userName"></label>
                                                        <input type="text" class="form-control js-user-name" id="userName" name="userName" value="${user.userName}"></input>
                                                    </div>
                                                    <div class='mb-3 text-start' >
                                                        <label class='form-label' for="email"></label>
                                                        <input type="email" class="form-control js-user-email" id="email" name="email" value="${user.email}"></input>
                                                    </div>
                                                    <div class='mb-3 text-start' >
                                                        <label class='form-label' for="password"></label>
                                                        <input type="password" class="form-control" id="password" name="password"></input>
                                                    </div>                                                                               
                                                </div>
                                                <div class="text-center pt-3">
                                                    <input type="submit" class="btn btn-primary me-5" value="Valider"></input>  
                                                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Fermer</button> 
                                                </div>                                                         
                                            </form>
                                        </div>               
                                    </div>            
                                </div>
                            </div>
                        </div>   
                    </div>
                </div>          
        `;
    });
}

if (window.location.href.includes("users")) {
    extractAndDisplayUsers();
}

/** @type {string|FormDataEntryValue|null} */
var userName = "";
/** @type {string|FormDataEntryValue|null} */
var email = "";
/** @type {string|FormDataEntryValue|null} */
var password = "";

/**
 * Handle the "add user" form submission and send a create request.
 *
 * @param {SubmitEvent} event - Submit event emitted by the add user form.
 * @returns {Promise<void>}
 */
export async function handleSubmit(event) {
    const addForm = event.target.closest("#addUserForm");

    if (!addForm) return;

    event.preventDefault();

    console.log("handleSubmit");

    const addFormData = new FormData(addForm);
    userName = addFormData.get("userName");
    email = addFormData.get("email");
    password = addFormData.get("password");

    const addPreload = { userName, email, password };

    if (password.length < 8) {
        alert("Le mot de passe doit contenir au moins 8 caractères");
        return;
    }

    const addUrl = config("/users/");

    try {
        await fetch(addUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(addPreload),
        });
        window.location.href = "./subpages/confirmAddUser.html";
    } catch (error) {
        console.log(error);
    }
}

const addUserForm = document.querySelector("#addUserForm");

if (addUserForm) {
    addUserForm.addEventListener("submit", handleSubmit);
}

const usersCardContainer = document.querySelector("#usersCardsContainer");

if (usersCardContainer) {
    usersCardContainer.addEventListener("submit", handleUpdateSubmit);
}

/**
 * Handle user updates submitted from modal forms.
 *
 * @param {SubmitEvent} event - Submit event emitted by an update user form.
 * @returns {Promise<void>}
 */
export async function handleUpdateSubmit(event) {
    const updateForm = event.target.closest(".update-user-form");

    if (!updateForm) return;
    event.preventDefault();

    console.log("handleUpdateSubmit");

    const updateFormData = new FormData(updateForm);
    const originalEmail = updateForm.dataset.originalEmail;
    userName = updateFormData.get("userName") || "";
    email = (updateFormData.get("email") || originalEmail).trim().toLowerCase();
    password = updateFormData.get("password") || "";

    if (password && password.length < 8) {
        alert("Le mot de passe doit contenir au moins 8 caractères");
        return;
    }

    const preload = { userName, email };
    if (password) preload.password = password;

    const updateUrl = config("/users/" + encodeURIComponent(originalEmail));
    try {
        const response = await fetch(updateUrl, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(preload),
        });
    } catch (error) {
        alert(error.message);
    }

    window.location.href = "./subpages/confirmUpdateUser.html";
}

/**
 * Handle user deletion with additional permission checks against session data.
 *
 * @param {MouseEvent} event - Click event delegated from the users container.
 * @returns {Promise<void>}
 */
async function handleDelete(event) {
    const deleteBtn = event.target.closest(".delete-button");
    const userEmail = deleteBtn.dataset.userEmail;
    console.log("userEmail: " + userEmail);

    const connectedUser = sessionStorage.getItem("user");
    const sessionUser = JSON.parse(connectedUser);

    const deleteUrl = config("/users/" + encodeURIComponent(userEmail));

    console.log("sessionUser.email: " + sessionUser.email);
    console.log(
        "includes portrussell: " + sessionUser.email.includes("portrussell"),
    );

    if (
        window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")
    ) {
        if (userEmail.includes("portrussell")) {
            return alert("Vous ne pouvez pas supprimer cet utilisateur");
        }
        if (userEmail !== sessionUser.email) {
            console.log(userEmail);
            console.log(sessionUser.email);
            if (sessionUser.email.includes("portrussell") === false) {
                return alert("Vous ne pouvez pas supprimer cet utilisateur");
            }
        }
        try {
            const response = await fetch(deleteUrl, {
                method: "DELETE",
                credentials: "include",
            });
            if (response.ok) {
                const connectedUser = sessionStorage.getItem("user");
                const sessionUser = JSON.parse(connectedUser);
                if (sessionUser.email === userEmail) {
                    sessionStorage.removeItem("user");
                    window.location.href =
                        "./subpages/confirmDeleteConnectedUser.html";
                } else {
                    window.location.href = "./subpages/confirmDeleteUser.html";
                }
            }
        } catch (error) {
            alert(error.message);
        }
    }
}

if (usersCardContainer) {
    usersCardContainer.addEventListener("click", handleDelete);
}
