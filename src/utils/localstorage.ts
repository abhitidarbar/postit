/**
 * Saves the data to local storage
 * @param key the key associated with the data
 * @param data the data to be saved
 */
const saveToLocalStorage = (key: string, data: string) => {
  if (typeof window !== "undefined" && window.localStorage) {
    localStorage.setItem(key, data);
  }
};

/**
 * Fetches the data from local storage
 * @param key the key associated with the data
 */
const getFromLocalStorage = (key: string): string => {
  // Fetch it from local storage and parse
  if (typeof window !== "undefined" && window.localStorage) {
    return localStorage.getItem(key) ?? "";
  }
  return "";
};

export { saveToLocalStorage, getFromLocalStorage };
