/**
 * Parses inputs
 * @param input The raw input string
 * @returns Either a string or an integer
 */
export function parseInput (input: string){
    return isNaN(parseInt(input)) ? input : parseInt(input);
}

/**
 * Checks if an input is valid according to some predicate
 * @param value The raw value checked
 * @param condition The function that checks the values validity
 * @returns Whether the condition is true
 */
export function isValid (value: any, condition: (value: any) => boolean) {
    return condition(parseInput(value));
}