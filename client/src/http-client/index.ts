import axios from 'axios'
import {SERVER_ADDRESS} from "./constants";

const httpClient = axios.create({baseURL: SERVER_ADDRESS})

httpClient.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        return Promise.reject(error)
    },
)

export default httpClient
