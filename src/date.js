/**
 * Render the current date in French locale into the page header.
 *
 * @returns {void}
 */
function date() {
    const date = new Date();
    const p = document.getElementById("date");

    const localDate = date.toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    p.innerHTML = localDate;
}

date();
