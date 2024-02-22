import { number } from "zod";

export function trimDecimals(amount: string | number) {

    if (typeof amount == 'number') {
        return 0
    }
    // Find the index of the dot
    let dotIndex = amount.indexOf('.');

    // Check if the dot is present and there are more than two digits after it
    if (dotIndex !== -1 && dotIndex + 3 < amount.length) {
        // Use slice to keep only two digits after the dot
        let truncatedString = amount.slice(0, dotIndex + 3);
        return truncatedString;
    }

    // If no dot or less than two digits after dot, return the original string
    return amount;
}