export const formatDateToHourMinutes = (date) => {
    if (!(date instanceof Date)) {
        throw new Error("Invalid input: expected a Date object");
    }

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`; // hh:mm
};
