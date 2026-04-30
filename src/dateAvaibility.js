export function checkAvaibility(
    startDate,
    endDate,
    existingStartDate,
    existingEndDate,
) {
    if (
        startDate < existingStartDate &&
        endDate > existingStartDate &&
        endDate < existingEndDate
    ) {
        return false;
    }

    if (
        startDate > existingStartDate &&
        startDate < existingEndDate &&
        endDate > existingEndDate
    ) {
        return false;
    }

    if (
        startDate > existingStartDate &&
        startDate < existingEndDate &&
        endDate > existingStartDate &&
        endDate < existingEndDate
    ) {
        return false;
    }

    if (startDate < existingStartDate && endDate > existingEndDate) {
        return false;
    }
}
