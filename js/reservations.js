import { config } from "../src/config.js";

export async function extractAndDisplayReservations() {
    const catwaysUrl = config("/catways");

    const catwaysResponse = await fetch(catwaysUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    });

    const catways = await catwaysResponse.json();

    catways.catways.forEach((catway) => {

        const reservationsUrl = config("/catways" + catway.catwayNumber + "/reservations");

        const reservationsResponse = await fetch(reservationsUrl);

        const reservations = await reservationsResponse.json();

        const reservationsCardsContainer = document.querySelector(
            "#catwaysCardsContainer",
        );
        reservations.forEach((reservation) => {
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
                            <div class="row">
                                <div class="col-6 mx-auto">
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
                                                <h1 class="modal-title fs-5" id="${reservationsUpdateModalId}Label">Ajouter un utilisateur</h1>
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
    })
}

if (window.location.href.includes("reservations")) {
    extractAndDisplayReservations();
}
