import axios from 'axios';
import authToken from './authToken';

const axiosRESTInstance = axios.create({
    baseURL: process.env.ENDPOINT + '/api',
});

axiosRESTInstance.interceptors.request.use(req => {
    const token = authToken.get();
    req.headers.authorization = `Bearer ${token?.token}`;
});

export default axiosRESTInstance;