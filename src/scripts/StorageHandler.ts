/**
 * @returns The raw value of the key, without any safety
 */
export function get(key: string){ return localStorage.getItem(key); }

/**
 * A safe get method
 * @param key The key
 * @param orelse What should be returned otherwise
 * @returns The value of key, or the value orelse
 */
export function getOrElse<T>(key: string, orelse: T){
    return empty(key) ? orelse : JSON.parse(get(key)!) as T;
}

/**
 * A safe get method that also sets the provided value
 * @param key The key
 * @param orelse What should be returned otherwise, and set
 * @returns The value of key, or the value orelse
 */
export function getSetOrElse<T>(key: string, orelse: T){
    if (empty(key)) { set(key, orelse); return orelse;}
    return JSON.parse(get(key)!) as T;
}

/**
 * @returns Wheter or not the key is empty
 */
export function empty(key: string) : Boolean{ return get(key) == null; }


/**
 * Sets a value
 * @param key The key
 * @parma value The value
 */
export function set<T>(key: string, value: T){
    localStorage.setItem(key, JSON.stringify(value));
}

export function remove(key: string){
    localStorage.removeItem(key);
}