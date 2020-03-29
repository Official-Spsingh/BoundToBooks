import Axios from 'axios'
import { baseUrl } from '@utils/baseUrl'
import { getItemFromLocalStorage } from '@utils/localStorage'

export const makeRequest = {
    get: (url) => {
        return new Promise((resolve, reject) => {
            Axios.get(`${baseUrl}${url}`)
                .then(response => {
                    resolve(response)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },
    post: (url, data) => {
        return new Promise((resolve, reject) => {
            Axios.post(`${baseUrl}${url}`, data)
                .then(response => {
                    resolve(response)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },
    getAuth: (url) => {
        return new Promise((resolve, reject) => {
            Axios({
                method: 'get',
                url: `${baseUrl}${url}`,
                headers: {
                    'authorization': `Bearer ${getItemFromLocalStorage('accessToken')}`,
                }
            })
                .then(response => {
                    resolve(response)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },
    postAuth: (url, data) => {
        return new Promise((resolve, reject) => {
            Axios({
                method: 'post',
                url: `${baseUrl}${url}`,
                headers: {
                    'authorization': `Bearer ${getItemFromLocalStorage('accessToken')}`,
                },
                data: data
            })
                .then(response => {
                    resolve(response)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }
}