import { removeItemFromLocalStorage, getItemFromLocalStorage } from '@utils/localStorage'
import { makeRequest } from '@utils/makeRequest'
export const userIsAuthenticated = () => {
    const accessToken = getItemFromLocalStorage('accessToken')
    if (accessToken && accessToken.length > 40) {
        return true
    }
    return false
}

export const logout = () => {
    return new Promise((resolve, reject) => {
        makeRequest.postAuth('logout')
            .then(response => {
                if (response.data.status.code == 200) {
                    removeItemFromLocalStorage('accessToken')
                    removeItemFromLocalStorage('refreshToken')
                    resolve('succesfully logged out')
                }
                else {
                    resolve(response)
                }
            })
            .catch(error => {
                reject(error)
            })

    })
}