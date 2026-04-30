/**
 * @file Catway page behaviors: list, create, update, and delete operations.
 */

import { config } from "../src/config.js";

/**
 * Catway data returned by the API.
 *
 * @typedef {Object} CatwayDto
 * @property {string|number} catwayNumber - Catway identifier.
 * @property {string} catwayType - Catway type label.
 * @property {string} catwayState - Current catway status.
 */

/**
 * Catway payload used by create/update requests.
 *
 * @typedef {Object} CatwayPayload
 * @property {string|FormDataEntryValue|null} [catwayNumber] - Catway number.
 * @property {string|FormDataEntryValue|null} [catwayType] - Catway type.
 * @property {string|FormDataEntryValue|null} catwayState - Catway status.
 */

/**
 * Fetch every catway and render cards in ascending catway number order.
 *
 * @returns {Promise<void>} Resolves after all catway cards have been rendered.
 */
export async function extractAndDisplayCatways() {
    const catwaysUrl = config("/catways");
    var catwaysResponse;
    try {
        catwaysResponse = await fetch(catwaysUrl, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
    } catch (error) {
        console.log(error);
    }

    const catways = await catwaysResponse.json();

    const sortedCatways = catways.sort((a, b) => {
        if (a.catwayNumber < b.catwayNumber) {
            return -1;
        }
        if (a.catwayNumber > b.catwayNumber) {
            return 1;
        }
        return 0;
    });

    const catwaysCardsContainer = document.querySelector(
        "#catwaysCardsContainer",
    );
    sortedCatways.forEach((catway) => {
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

// Load catways only on the dedicated page to keep this module reusable.
if (window.location.href.includes("catways")) {
    extractAndDisplayCatways();
}

/** @type {string} */
var catwayState = "";
/** @type {string|number|FormDataEntryValue|null} */
var catwayNumber = "";

/**
 * Handle the "add catway" form and send a create request.
 *
 * @param {SubmitEvent} event - Submit event emitted by the add catway form.
 * @returns {Promise<void>} Resolves when the create flow completes.
 */
export async function handleSubmit(event) {
    const addForm = event.target.closest("#addCatwayForm");

    if (!addForm) return;

    event.preventDefault();

    const addFormData = new FormData(addForm);
    catwayNumber = addFormData.get("catwayNumber");
    const catwayType = addFormData.get("catwayType");
    catwayState = addFormData.get("catwayState");

    try {
        const checkUrl = config("/catways/" + catwayNumber);
        const checkResponse = await fetch(checkUrl, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        const data = await checkResponse.json();
        console.log(data);
        if (data) {
            alert("Ce catway existe déjà");
            return;
        }
    } catch (error) {
        console.log(error);
    }

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
        console.log(error);
    }
}

const addCatwayForm = document.querySelector("#addCatwayForm");

if (addCatwayForm) {
    // Static modal form listener for catway creation.
    addCatwayForm.addEventListener("submit", handleSubmit);
}

/**
 * Handle inline catway updates from modal forms.
 *
 * @param {SubmitEvent} event - Submit event from an update catway form.
 * @returns {Promise<void>} Resolves when the update flow completes.
 */
export async function handleUpdateSubmit(event) {
    const updateForm = event.target.closest(".update-catway-form");

    if (!updateForm) return;
    event.preventDefault();

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
        console.log(error);
    }

    window.location.href = "./subpages/confirmUpdateCatway.html";
}

const catwaysCardsContainer = document.querySelector("#catwaysCardsContainer");

if (catwaysCardsContainer) {
    // Event delegation handles submit events from dynamically generated update forms.
    catwaysCardsContainer.addEventListener("submit", handleUpdateSubmit);
}

/**
 * Handle catway deletion when the user clicks a delete action.
 *
 * @param {MouseEvent} event - Click event delegated from the cards container.
 * @returns {Promise<void>} Resolves when the delete flow completes.
 */
async function handleDelete(event) {
    const deleteBtn = event.target.closest(".delete-button");
    catwayNumber = deleteBtn.dataset.catwayId;

    const deleteUrl = config("/catways/" + catwayNumber);

    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce catway ?")) {
        try {
            const response = await fetch(deleteUrl, {
                method: "DELETE",
                credentials: "include",
            });

            window.location.href = "./subpages/confirmDeleteCatway.html";
        } catch (error) {
            console.log(error);
        }
    }
}

if (catwaysCardsContainer) {
    // Event delegation handles delete clicks from dynamic cards.
    catwaysCardsContainer.addEventListener("click", handleDelete);
}
