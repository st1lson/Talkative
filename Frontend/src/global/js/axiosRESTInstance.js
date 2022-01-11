import axios from 'axios';
import authToken from './authToken';

const axiosRESTInstance = axios.create({
    baseURL: 'https://localhost:5001/api',
});

axiosRESTInstance.interceptors.request.use(req => {
    const token = authToken.get();
    req.headers.authorization = `Bearer ${token?.token}`;

    return req;
});

export default axiosRESTInstance;
