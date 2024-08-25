export function warn(valid: boolean, event : Event & {currentTarget : HTMLInputElement}){
    event.currentTarget.style.color = valid ? "var(--text-color-negative)" : "red";
}

export function parseInput (input: string){
    return isNaN(parseInt(input)) ? input : parseInt(input);
}

export function isValid (value: any, condition: (value: any) => boolean) {
    return condition(parseInput(value));
}

export function handleInput(event : Event & {currentTarget : HTMLInputElement}, condition: (value: any) => boolean){
    warn(isValid(event.currentTarget.value, condition), event);
}