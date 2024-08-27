export type storageType = "local" | "session"

/**
 * @param key The key queried
 * @param type The storage type queried
 * @returns The raw value of the key, without any safety
 */
export function get(key: string, type: storageType = "local") : any { 
    switch (type) {
        case "local":
            return localStorage.getItem(key); 
        case "session":
            return sessionStorage.getItem(key); 
        default:
            return undefined;
    }   
}

/**
 * A safe get method
 * @param key The key
 * @param orelse What should be returned otherwise
 * @param type The storage type queried
 * @returns The value of key, or the value orelse
 */
export function getOrElse<T>(key: string, orelse: T, type: storageType = "local"){
    empty(key, type) ? orelse : JSON.parse(get(key, type)!) as T;
}

/**
 * A safe get method that also sets the provided value
 * @param key The key
 * @param orelse What should be returned otherwise, and set
 * @param type The storage type queried
 * @returns The value of key, or the value orelse
 */
export function getSetOrElse<T>(key: string, orelse: T, type: storageType = "local"){
    if (empty(key, type)) { set(key, orelse, type); return orelse;}
    return JSON.parse(get(key, type)!) as T;
}

/**
 * @param key The key queried
 * @param type The storage type queried
 * @returns Wheter or not the key is empty
 */
export function empty(key: string, type: storageType = "local") : Boolean{ return get(key,type) == null; }

/**
 * Sets a value
 * @param key The key
 * @param value The value
 * @param type The storage type queried
 */
export function set<T>(key: string, value: T, type: storageType = "local"){
    switch (type) {
        case "local":
            localStorage.setItem(key, JSON.stringify(value));
            const keyInitialized = key.charAt(0).toUpperCase() + key.slice(1);
            document.dispatchEvent(new Event("storageChange" + keyInitialized)); // Fires an event with the name storageChangeKey
            localStorage.setItem("refresh" + keyInitialized, "true"); // Also set a localStorage entry
            break;
        case "session":
            sessionStorage.setItem(key, JSON.stringify(value));
            break;
        default:
            break;
    }   
    
}

/**
 * Removes a key
 * @param key The key
 * @param type The storage type queried
 */
export function remove(key: string, type: storageType = "local"){
    switch (type) {
        case "local":
            localStorage.removeItem(key);
            break;
        case "session":
            sessionStorage.removeItem(key);
            break;
        default:
            break;
    } 
}