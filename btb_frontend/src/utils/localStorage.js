export const setItemInLocalStorage = (itemKey, itemValue) => {
    localStorage.setItem(itemKey, itemValue)
}
export const getItemFromLocalStorage = (itemKey) => {
    // console.group(localStorage.getItem(itemKey))
    return localStorage.getItem(itemKey)
}
export const removeItemFromLocalStorage = (itemKey) => {
    localStorage.removeItem(itemKey)
}