// Function to set data in local storage with expiration time
export const setLocalStorageWithExpiration = (key: string, value: string, expirationDays: number) => {
    const expirationMs = expirationDays * 24 * 60 * 60 * 1000; // Convert days to milliseconds
    const expirationTime = new Date().getTime() + expirationMs;
    
    const data = {
        value: value,
        expirationTime: expirationTime
    };

    localStorage.setItem(key, JSON.stringify(data));
}

// Function to get data from local storage
export const expireLocalStorageSession = (key: string) => {
    const item = localStorage.getItem(key);

    if (!item) {
        return null;
    }

    const data = JSON.parse(item);

    // Check if data is expired
    if (data.expirationTime && new Date().getTime() > data.expirationTime) {
        localStorage.removeItem(key);
        return null; // Data is expired
    }

    return data.value;
}