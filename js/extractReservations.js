/**
 * @file Fetch reservations from all catways and render dashboard table rows.
 */

import { config } from "../src/config.js";
import { createReservationTable } from "../components/reservationsTable.js";

/**
 * Minimal catway payload used to build reservations endpoints.
 *
 * @typedef {Object} CatwaySummary
 * @property {string|number} catwayNumber - Unique catway number.
 */

/**
 * Reservation payload consumed by the reservations table renderer.
 *
 * @typedef {Object} ReservationSummary
 * @property {string|number} catwayNumber - Catway number linked to the reservation.
 * @property {string} clientName - Customer full name.
 * @property {string} boatName - Boat display name.
 * @property {string} startDate - Reservation start date (ISO string).
 * @property {string} endDate - Reservation end date (ISO string).
 */

/** @type {string|null} API endpoint used by the current fetch step. */
var url = null;

/**
 * Fetch all reservations from every catway and append rows to the reservations table.
 *
 * @returns {Promise<void>} Resolves when reservation fetches have been scheduled.
 */
async function extractReservations() {
    /** @type {boolean} */
    var hasFetched = false;
    url = config("/catways/");
    /** @type {Array<CatwaySummary>|null} */
    var catways = null;
    /** @type {Array<ReservationSummary>|null} */
    var reservations = null;
    var data;
    if (hasFetched === false) {
        var resCatways;
        try {
            resCatways = await fetch(url, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
        } catch (error) {
            console.log(error);
        }

        catways = await resCatways.json();

        if (catways) {
            try {
                // Fetch each catway reservation list, then append rendered rows.
                catways.forEach(async (catway) => {
                    url = config(
                        "/catways/" + catway.catwayNumber + "/reservations",
                    );

                    const resReservations = await fetch(url, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                    });

                    reservations = await resReservations.json();

                    hasFetched = true;

                    const container =
                        document.querySelector("#reservationsBody");
                    // Render one table row per reservation.
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
}

// Bootstrap table population when the dashboard script is loaded.
extractReservations();
