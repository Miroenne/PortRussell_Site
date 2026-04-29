import { config } from "../src/config.js";
import { createReservationTable } from "../components/reservationsTable.js";

var url = null;

async function extractReservations() {
    var hasFetched = false;
    url = config("/catways/");
    var catways = null;
    var reservations = null;
    try {
        const resCatways = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        catways = await resCatways.json();
    } catch (error) {
        console.log(error);
    }

    if (catways) {
        try {
            catways.forEach(async (catway) => {
                url = config(
                    "/catways/" + catway.catwayNumber + "/reservations",
                );
                console.log(url);
                const resReservations = await fetch(url, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                });
                reservations = await resReservations.json();
                console.log(reservations);
                hasFetched = true;

                const container = document.querySelector("#reservationsBody");
                reservations.forEach((reservation) => {
                    container.innerHTML += createReservationTable(
                        reservation.catwayNumber,
                        reservation.clientName,
                        reservation.boatName,
                        reservation.startDate,
                        reservation.endDate,
                    );
                });
            });
        } catch (error) {
            console.log(error);
        }
    }
}

extractReservations();
