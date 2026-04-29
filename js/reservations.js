import { config } from "../src/config.js";

export async function extractAndDisplayReservations() {
    const catwaysUrl = config("/catways");

    const catwaysResponse = await fetch(catwaysUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    });

    const catways = await catwaysResponse.json();
    console.log(catways);
    if (catways) {
        try {
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
                    const startDate = new Date(
                        reservation.startDate,
                    ).toLocaleDateString("fr-FR");
                    const endDate = new Date(
                        reservation.endDate,
                    ).toLocaleDateString("fr-FR");

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
                                        <button class="btn btn-danger w-auto d-inline col-6 delete-button" data-catway-id="${number}" type="button">
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
                                                    <form class="update-reservation-form" data-catway-number="${number}">     
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
                                                                <input type="text" class="form-control" id="startDate" name="startDate" value="${startDate}"></input>
                                                            </div> <div class='mb-3 text-start' >
                                                                <label class='form-label' for="endDate"></label>
                                                                <input type="text" class="form-control" id="endDate" name="endDate" value="${endDate}"></input>
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
        } catch (error) {
            console.log(error);
        }
    }
}

if (window.location.href.includes("reservations")) {
    extractAndDisplayReservations();
}

export async function handleSubmit(event) {
    console.log("handleSubmit");

    const addForm = event.target.closest("#addReservationForm");

    if (!addForm) return;

    event.preventDefault();

    const addFormData = new FormData(addForm);
    const catwayNumber = addFormData.get("catwayNumber");
    const clientName = addFormData.get("clientName");
    const boatName = addFormData.get("boatName");
    const startDate = new Date(addFormData.get("startDate"));
    const endDate = new Date(addFormData.get("endDate"));

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
        })
            .then(async (response) => {
                if (!response.ok) {
                    const data = await response.json();
                    return Promise.reject(data);
                }
                return data;
            })
            .then((data) => {
                console.log(data);
            });
        window.location.href = "./subpages/confirmAddReservation.html";
    } catch (error) {
        alert(jsonData.errorMessage);
    }
}

const addReservationForm = document.querySelector("#addReservationForm");

if (addReservationForm) {
    addReservationForm.addEventListener("submit", handleSubmit);
}
