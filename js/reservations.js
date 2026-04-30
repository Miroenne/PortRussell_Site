import { config } from "../src/config.js";
import { checkAvaibility } from "../src/dateAvaibility.js";

/**
 * Lightweight catway shape returned by the API when listing catways.
 *
 * @typedef {Object} CatwaySummary
 * @property {string|number} catwayNumber - Unique catway identifier.
 */

/**
 * Reservation object returned by the API.
 *
 * @typedef {Object} ReservationDto
 * @property {string} _id - Reservation unique identifier.
 * @property {string|number} catwayNumber - Linked catway number.
 * @property {string} clientName - Customer full name.
 * @property {string} boatName - Boat display name.
 * @property {string} startDate - Reservation start date as ISO string.
 * @property {string} endDate - Reservation end date as ISO string.
 */

/**
 * Reservation payload sent when creating or updating a reservation.
 *
 * @typedef {Object} ReservationPayload
 * @property {string|FormDataEntryValue|null} catwayNumber - Catway identifier.
 * @property {string|FormDataEntryValue|null} clientName - Customer full name.
 * @property {string|FormDataEntryValue|null} boatName - Boat display name.
 * @property {Date|string} startDate - Reservation start date.
 * @property {Date|string} endDate - Reservation end date.
 */

/**
 * Fetch all catways and render every linked reservation card into the page.
 *
 * @returns {Promise<void>}
 */
export async function extractAndDisplayReservations() {
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

    if (catways) {
        catways.forEach(async (catway) => {
            const reservationsUrl = config(
                "/catways/" + catway.catwayNumber + "/reservations",
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                },
            );

            const reservationsResponse = await fetch(reservationsUrl);

            const reservations = await reservationsResponse.json();

            const reservationsCardsContainer = document.querySelector(
                "#reservationsCardsContainer",
            );
            reservations.forEach((reservation) => {
                const reservationCardId = `${reservation._id}Card`;
                const reservationUpdateModalId = `${reservation._id}UpdateModal`;
                const number = reservation.catwayNumber;
                const clientName = reservation.clientName;
                const boatName = reservation.boatName;
                const startDate = new Date(reservation.startDate)
                    .toISOString()
                    .split("T")[0];
                const endDate = new Date(reservation.endDate)
                    .toISOString()
                    .split("T")[0];

                reservationsCardsContainer.innerHTML += `                        
                        <div class="card shadow-lg min-h-200 mx-auto border-2 mt-5 w-45" id=${reservationCardId}>            
                            <div class="card-body text-center">
                                <!-- Standard grid layout for common resource properties -->
                                <div class="row">
                                    <div class="col-6">                        
                                        <img src="../assets/img/catway.png" class='cardIcon mb-2' alt="catway_icon"/>
                                        <p class="card-title" id="reservationCatwayNumber">${number}</p>
                                    </div>                    
                                    <div class="col-6">
                                        <img src="../assets/img/user.png" class='cardIcon mb-2' alt="user_icon"/>
                                        <p class="card-title" id="reservationClientName">${clientName}</p>
                                    </div>
                                    <div class="col-6 mx-auto">
                                        <img src="../assets/img/boat.png" class='cardIcon mb-2' alt="boat_icon"/>
                                        <p class="card-title" id="reservationBoatName">${boatName}</p>
                                    </div>                                
                                </div>
                                <div class="row boder border-top-3 mt-2 pt-2">
                                    <div class="col-9 mx-auto">
                                        <img src="../assets/img/calendrier.png" class='cardIcon mb-2' alt="calendar_icon"/>                                    
                                    </div><div class="col-6 mx-auto">                                    
                                        <p class="card-title" id="reservationStartDate">${startDate}</p>
                                    </div><div class="col-6 mx-auto">                                    
                                        <p class="card-title" id="reservationEndDate">${endDate}</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Modal integration for the Update/Delete action -->
                            <div class='card-footer'>
                            <div>
                                    <!-- Action buttons to trigger the Modal or the Delete process -->
                                    <div class="text-center row justify-content-evenly">
                                        <button type="button" class="btn btn-success w-auto col-6 " data-bs-toggle="modal" data-bs-target="#${reservationUpdateModalId}">
                                        Modifier
                                        </button>
                                        <button class="btn btn-danger w-auto d-inline col-6 delete-button" data-catway-id="${number}" data-id-reservation="${reservation._id}" type="button">
                                            Supprimer
                                        </button>                
                                    </div>

                                    <!-- Bootstrap Modal Structure -->
                                    <div class="fade modal " id="${reservationUpdateModalId}" name='myModal' tabIndex="-1" aria-labelledby="${reservationUpdateModalId}Label" aria-hidden="true">                    
                                        <div class="modal-dialog">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h1 class="modal-title fs-5" id="${reservationUpdateModalId}Label">Ajouter un utilisateur</h1>
                                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div class="modal-body">
                                                    <!--Dynamic form generation based on the fields array prop -->
                                                    <form class="update-reservation-form" data-catway-number="${number}" data-id-reservation="${reservation._id}">     
                                                        <div class='container'>                                                                                
                                                            <div class='mb-3 text-start' >
                                                                <label class='form-label' for="catwayNumber"></label>
                                                                <input type="text" class="form-control js-catway-number" id="catwayNumber" name="catwayNumber" value="${number}" ></input>
                                                            </div>
                                                            <div class='mb-3 text-start' >
                                                                <label class='form-label' for="clientName"></label>
                                                                <input type="text" class="form-control js-client-name" id="clientName" name="clientName" value="${clientName}" ></input>
                                                            </div>
                                                            <div class='mb-3 text-start' >
                                                                <label class='form-label' for="boatName"></label>
                                                                <input type="text" class="form-control" id="boatName" name="boatName" value="${boatName}"></input>
                                                            </div>   
                                                            <div class='mb-3 text-start' >
                                                                <label class='form-label' for="startDate"></label>
                                                                <input type="date" class="form-control" id="startDate" name="startDate" value="${startDate}"></input>
                                                            </div> <div class='mb-3 text-start' >
                                                                <label class='form-label' for="endDate"></label>
                                                                <input type="date" class="form-control" id="endDate" name="endDate" value="${endDate}"></input>
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
        });
    }
}

// Load reservations only on the dedicated page to keep this module reusable.
if (window.location.href.includes("reservations")) {
    extractAndDisplayReservations();
}

/**
 * Handle the "add reservation" form submission and send a create request.
 *
 * @param {SubmitEvent} event - Native submit event coming from the add form.
 * @returns {Promise<void>}
 */
export async function handleSubmit(event) {
    const addForm = event.target.closest("#addReservationForm");

    if (!addForm) return;

    event.preventDefault();

    const addFormData = new FormData(addForm);
    const catwayNumber = addFormData.get("catwayNumber");
    const clientName = addFormData.get("clientName");
    const boatName = addFormData.get("boatName");
    const startDate = new Date(addFormData.get("startDate"));
    const endDate = new Date(addFormData.get("endDate"));

    try {
        const checkUrl = config("/catways/" + catwayNumber + "/reservations");
        const checkResponse = await fetch(checkUrl, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        const data = await checkResponse.json();
        var availableDates;

        if (data) {
            data.forEach((reservation) => {
                const reservationStartDate = new Date(reservation.startDate);
                const reservationEndDate = new Date(reservation.endDate);

                const avaibility = checkAvaibility(
                    startDate,
                    endDate,
                    reservationStartDate,
                    reservationEndDate,
                );

                if (avaibility === false) {
                    alert(
                        "Dates invalides, ce catway est déjà réservé du: " +
                            reservationStartDate.toISOString().split("T")[0] +
                            " au " +
                            reservationEndDate.toISOString().split("T")[0],
                    );
                    return (availableDates = false);
                }
            });
        }

        if (availableDates === false) {
            return;
        }

        if (startDate > endDate) {
            alert(
                "Dates invalides: La date de début doit être antérieure à la date de fin",
            );
            return;
        }

        const addPreload = {
            catwayNumber,
            clientName,
            boatName,
            startDate,
            endDate,
        };

        const addUrl = config("/catways/" + catwayNumber + "/reservations");

        try {
            const reservationsResponse = await fetch(addUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(addPreload),
            });

            window.location.href = "./subpages/confirmAddReservation.html";
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        console.log(error);
    }
}

const addReservationForm = document.querySelector("#addReservationForm");

if (addReservationForm) {
    // Static modal form listener for reservation creation.
    addReservationForm.addEventListener("submit", handleSubmit);
}

/**
 * Handle an inline reservation update form submission inside a card modal.
 *
 * @param {SubmitEvent} event - Native submit event emitted by update forms.
 * @returns {Promise<void>}
 */
export async function handleUpdateSubmit(event) {
    const updateForm = event.target.closest(".update-reservation-form");

    if (!updateForm) return;
    event.preventDefault();

    const idReservation = updateForm.dataset.idReservation;
    const reservedCatwayNumber = updateForm.dataset.catwayNumber;
    const updateFormData = new FormData(updateForm);
    const catwayNumber = updateFormData.get("catwayNumber") || "";
    const clientName = updateFormData.get("clientName") || "";
    const boatName = updateFormData.get("boatName") || "";
    const startDate = new Date(updateFormData.get("startDate")) || "";
    const endDate = new Date(updateFormData.get("endDate")) || "";

    try {
        const checkUrl = config("/catways/" + catwayNumber + "/reservations");
        const checkResponse = await fetch(checkUrl, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        const data = await checkResponse.json();
        var availableDates;

        if (data) {
            data.forEach((reservation) => {
                const reservationStartDate = new Date(reservation.startDate);
                const reservationEndDate = new Date(reservation.endDate);

                var avaibility = checkAvaibility(
                    startDate,
                    endDate,
                    reservationStartDate,
                    reservationEndDate,
                );

                if (avaibility === false) {
                    alert(
                        "Ce catway est déjà réservé pour du: " +
                            reservationStartDate.toISOString().split("T")[0] +
                            " au " +
                            reservationEndDate.toISOString().split("T")[0],
                    );
                    return (availableDates = false);
                }
            });
        }
    } catch (error) {
        console.log(error);
    }

    if (availableDates === false) {
        return;
    }

    if (startDate > endDate) {
        alert(
            "Dates invalides: La date de début doit être antérieure à la date de fin",
        );
        return;
    }

    const preload = {
        catwayNumber,
        clientName,
        boatName,
        startDate,
        endDate,
    };

    var updateUrl = "";

    if (reservedCatwayNumber !== catwayNumber) {
        updateUrl = config(
            "/catways/" +
                reservedCatwayNumber +
                "/reservations/" +
                idReservation,
        );
    } else {
        updateUrl = config(
            "/catways/" + catwayNumber + "/reservations/" + idReservation,
        );
    }

    try {
        const response = await fetch(updateUrl, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(preload),
        });

        // window.location.href = "./subpages/confirmUpdateReservation.html";
    } catch (error) {
        console.log(error);
    }
}

const reservationsCardsContainer = document.querySelector(
    "#reservationsCardsContainer",
);

if (reservationsCardsContainer) {
    // Event delegation handles submit events from dynamically generated update forms.
    reservationsCardsContainer.addEventListener("submit", handleUpdateSubmit);
}

/**
 * Handle reservation deletion from a card action button.
 *
 * @param {MouseEvent} event - Click event captured on the reservation container.
 * @returns {Promise<void>}
 */
async function handleDelete(event) {
    const deleteBtn = event.target.closest(".delete-button");
    const catwayNumber = deleteBtn.dataset.catwayId;
    const idReservation = deleteBtn.dataset.idReservation;

    const deleteUrl = config(
        "/catways/" + catwayNumber + "/reservations/" + idReservation,
    );

    if (
        window.confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")
    ) {
        try {
            const response = await fetch(deleteUrl, {
                method: "DELETE",
                credentials: "include",
            });

            window.location.href = "./subpages/confirmDeleteReservation.html";
        } catch (error) {
            console.log(error);
        }
    }
}

if (reservationsCardsContainer) {
    // Event delegation handles delete clicks from dynamic cards.
    reservationsCardsContainer.addEventListener("click", handleDelete);
}
