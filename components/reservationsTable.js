/**
 * @file Build HTML table rows for reservation summaries.
 */

/**
 * Build the HTML row for one reservation entry in the summary table.
 *
 * @param {string|number} catwayNumber - Catway identifier.
 * @param {string} clientName - Customer full name.
 * @param {string} boatName - Boat display name.
 * @param {string|Date} startDate - Reservation start date.
 * @param {string|Date} endDate - Reservation end date.
 * @returns {string} HTML string representing one `<tr>` reservation row.
 */
export function createReservationTable(
    catwayNumber,
    clientName,
    boatName,
    startDate,
    endDate,
) {
    const start = new Date(startDate).toLocaleDateString("fr-FR");
    const end = new Date(endDate).toLocaleDateString("fr-FR");

    return `<tr>
        <td>${catwayNumber}</td>
        <td>${clientName}</td>
        <td>${boatName}</td>
        <td>${start}</td>
        <td>${end}</td>
    </tr>`;
}
