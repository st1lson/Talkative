import axios from 'axios';
import authToken from './authToken';

const axiosGQLInstance = axios.create({
    baseURL: 'https://localhost:5001/grapthql',
});

axiosGQLInstance.interceptors.request.use(req => {
    const token = authToken.get();
    req.headers.authorization = `Bearer ${token?.token}`;

    return req;
});

export default axiosGQLInstance;
