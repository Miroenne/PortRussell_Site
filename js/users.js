import { config } from "../src/config.js";

export async function extractAndDisplayUsers() {
    const url = config("/users");

    const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    });

    const users = await response.json();

    const container = document.querySelector("#usersCardsContainer");
    users.forEach((user) => {
        const name = user.userName.replaceAll(" ", "");
        const cardId = `${name}Card`;
        const updateModalId = `${name}UpdateModal`;

        console.log(cardId);
        console.log(updateModalId);

        container.innerHTML += `                        
                <div class="card shadow-lg min-h-200 mx-auto border-2 mt-5 w-45" id=${cardId}>            
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
                                <button type="button" class="btn btn-success w-auto col-6 " data-bs-toggle="modal" data-bs-target="#${updateModalId}">
                                Modifier
                                </button>
                                <button class="btn btn-danger w-auto d-inline col-6 " onClick={handleDelete}>
                                    Supprimer
                                </button>                
                            </div>

                            <!-- Bootstrap Modal Structure -->
                            <div class="fade modal " id="${updateModalId}" name='myModal' tabIndex="-1" aria-labelledby="${updateModalId}Label" aria-hidden="true">                    
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h1 class="modal-title fs-5" id="${updateModalId}Label">Ajouter un utilisateur</h1>
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

extractAndDisplayUsers();

var userName = "";
var email = "";
var password = "";

export async function handleSubmit(event) {
    const addForm = event.target.closest("#addUserForm");

    if (!addForm) return;

    event.preventDefault();

    console.log("handleSubmit");

    const addFormData = new FormData(addForm);
    userName = formData.get("userName");
    email = formData.get("email");
    password = formData.get("password");

    const addPreload = { userName, email, password };

    if (addPassword.length < 8) {
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
        window.location.href = "./confirmAddUser.html";
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

    const response = await fetch(updateUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(preload),
    });

    // window.location.href = "./confirmUpdateUser.html";
}
