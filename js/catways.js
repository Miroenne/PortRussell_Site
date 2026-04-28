import { config } from "../src/config.js";

export async function extractAndDisplayCatways() {
    const catwaysUrl = config("/catways");

    const catwaysResponse = await fetch(catwaysUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    });

    const catways = await catwaysResponse.json();

    const catwaysCardsContainer = document.querySelector(
        "#catwaysCardsContainer",
    );
    catways.forEach((catway) => {
        const number = catway.catwayNumber;
        const type = catway.catwayType;
        const state = catway.catwayState;
        const catwayCardId = `${number}Card`;
        const catwayUpdateModalId = `${number}UpdateModal`;

        catwaysCardsContainer.innerHTML += `                        
                <div class="card shadow-lg min-h-200 mx-auto border-2 mt-5 w-45" id=${catwayCardId}>            
                    <div class="card-body text-center">
                        <!-- Standard grid layout for common resource properties -->
                        <div class="row">
                            <div class="col-6">                        
                                <img src="../assets/img/catway.png" class='cardIcon mb-2' alt="catway_icon"/>
                                <p class="card-title" id="catwayNumber">${number}</p>
                            </div>                    
                            <div class="col-6">
                                <img src="../assets/img/type.png" class='cardIcon mb-2' alt="type_icon"/>
                                <p class="card-title" id="catwaytype">${type}</p>
                            </div>
                            <div class="col-6 mx-auto">
                                <img src="../assets/img/state.png" class='cardIcon mb-2' alt="state_icon"/>
                                <p class="card-title" id="catwayState">${state}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Modal integration for the Update/Delete action -->
                    <div class='card-footer'>
                       <div>
                            <!-- Action buttons to trigger the Modal or the Delete process -->
                            <div class="text-center row justify-content-evenly">
                                <button type="button" class="btn btn-success w-auto col-6 " data-bs-toggle="modal" data-bs-target="#${catwayUpdateModalId}">
                                Modifier
                                </button>
                                <button class="btn btn-danger w-auto d-inline col-6 delete-button" data-catway-id="${number}" type="button">
                                    Supprimer
                                </button>                
                            </div>

                            <!-- Bootstrap Modal Structure -->
                            <div class="fade modal " id="${catwayUpdateModalId}" name='myModal' tabIndex="-1" aria-labelledby="${catwayUpdateModalId}Label" aria-hidden="true">                    
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h1 class="modal-title fs-5" id="${catwayUpdateModalId}Label">Ajouter un utilisateur</h1>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body">
                                            <!--Dynamic form generation based on the fields array prop -->
                                            <form class="update-catway-form" data-catway-number="${number}">     
                                                <div class='container'>                     
                                                    <div class='mb-3 text-start' >
                                                        <label class='form-label' for="catwayNumber"></label>
                                                        <input type="text" class="form-control js-catway-number" id="catwayNumber" name="catwayNumber" value="${number}" disabled></input>
                                                    </div>
                                                    <div class='mb-3 text-start' >
                                                        <label class='form-label' for="catwayType"></label>
                                                        <input type="text" class="form-control js-catway-type" id="catwayType" name="catwayType" value="${type}" disabled></input>
                                                    </div>
                                                    <div class='mb-3 text-start' >
                                                        <label class='form-label' for="catwayState"></label>
                                                        <input type="text" class="form-control" id="catwayState" name="catwayState" value="${state}"></input>
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

if (window.location.href.includes("catways")) {
    extractAndDisplayCatways();
}

var catwayState = "";
var catwayNumber = "";

export async function handleSubmit(event) {
    const addForm = event.target.closest("#addCatwayForm");

    if (!addForm) return;

    event.preventDefault();

    const addFormData = new FormData(addForm);
    catwayNumber = addFormData.get("catwayNumber");
    const catwayType = addFormData.get("catwayType");
    catwayState = addFormData.get("catwayState");

    const addPreload = { catwayNumber, catwayType, catwayState };

    const addUrl = config("/catways/");

    try {
        await fetch(addUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(addPreload),
        });
        window.location.href = "./subpages/confirmAddCatway.html";
    } catch (error) {
        alert(error.message);
    }
}

const addCatwayForm = document.querySelector("#addCatwayForm");

if (addCatwayForm) {
    addCatwayForm.addEventListener("submit", handleSubmit);
}

export async function handleUpdateSubmit(event) {
    const updateForm = event.target.closest(".update-catway-form");

    if (!updateForm) return;
    event.preventDefault();

    console.log("handleUpdateSubmit");

    const updateFormData = new FormData(updateForm);
    catwayNumber = updateForm.dataset.catwayNumber;

    catwayState = updateFormData.get("catwayState") || "";

    const preload = { catwayState };

    const updateUrl = config("/catways/" + catwayNumber);
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

    window.location.href = "./subpages/confirmUpdateCatway.html";
}

const catwaysCardsContainer = document.querySelector("#catwaysCardsContainer");

if (catwaysCardsContainer) {
    catwaysCardsContainer.addEventListener("submit", handleUpdateSubmit);
}

async function handleDelete(event) {
    const deleteBtn = event.target.closest(".delete-button");
    catwayNumber = deleteBtn.dataset.catwayId;
    console.log(catwayNumber);

    const deleteUrl = config("/catways/" + catwayNumber);

    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce catway ?")) {
        try {
            const response = await fetch(deleteUrl, {
                method: "DELETE",
                credentials: "include",
            });

            window.location.href = "./subpages/confirmDeleteCatway.html";
        } catch (error) {
            alert(error.message);
        }
    }
}

if (catwaysCardsContainer) {
    catwaysCardsContainer.addEventListener("click", handleDelete);
}
