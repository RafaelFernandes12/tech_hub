export function capitalizeFirstLetter(val: string) {
    return String(val).charAt(0).toUpperCase() + String(val.toLowerCase()).slice(1);
}