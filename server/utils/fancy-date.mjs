export function stringToDate(estString) {
    return new Date(estString.split(' ')[0]);
}

export function utcMsToEstDate(utcMs) {
    const estOffset = -5;
    const msInAHour = 3600000;
    const estDate = new Date(utcMs + (msInAHour * estOffset));
    return new Date(estDate.getUTCFullYear(), estDate.getUTCMonth(), estDate.getUTCDate());
}