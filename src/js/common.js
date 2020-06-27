const setLocal = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

const getLocal = (key, defaultValue) => {
    const value = localStorage.getItem(key);
    if (!value) {
        return defaultValue;
    }
    return JSON.parse(value);
};

export {
    setLocal,
    getLocal,
}