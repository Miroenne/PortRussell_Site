export function createReservationTable(
    catwayNumber,
    clientName,
    boatName,
    startDate,
    endDate,
) {
    console.log(catwayNumber);
    console.log(clientName);
    console.log(boatName);
    console.log(startDate);
    console.log(endDate);

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
