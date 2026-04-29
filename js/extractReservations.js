import { config } from "../src/config.js";
import { createReservationTable } from "../components/reservationsTable.js";

/** @type {string|null} */
var url = null;

/**
 * Fetch all reservations from every catway and append rows to the reservations table.
 *
 * @returns {Promise<void>}
 */
async function extractReservations() {
    // Future-proof flag intended for UI hooks after first successful load.
    /** @type {boolean} */
    var hasFetched = false;
    url = config("/catways/");
    /** @type {Array<{catwayNumber: string|number}>|null} */
    var catways = null;
    /** @type {Array<{catwayNumber: string|number, clientName: string, boatName: string, startDate: string, endDate: string}>|null} */
    var reservations = null;
    try {
        const resCatways = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        })
            .then(async (response) => {
                var data;
                if (!response.ok) {
                    data = await response.json();
                    return Promise.reject(data);
                }
                return data;
            })
            .then((data) => {
                console.log(data);
            });
    } catch (error) {
        alert(jsonData.errorMessage);
    }

    if (catways) {
        try {
            catways.forEach(async (catway) => {
                url = config(
                    "/catways/" + catway.catwayNumber + "/reservations",
                );

                const resReservations = await fetch(url, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                })
                    .then(async (response) => {
                        var data;
                        if (!response.ok) {
                            data = await response.json();
                            return Promise.reject(data);
                        }
                        return data;
                    })
                    .then((data) => {
                        console.log(data);
                    });

                reservations = await resReservations.json();

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
            alert(jsonData.errorMessage);
        }
    }
}

// Bootstrap table population when the dashboard script is loaded.
extractReservations();
