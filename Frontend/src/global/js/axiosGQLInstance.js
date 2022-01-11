import axios from "axios";
import authToken from "./authToken";

const axiosGQLInstance = axios.create({
    baseURL: process.env.ENDPOINT + '/grapthql',
});

axiosGQLInstance.interceptors.request.use(req => {
    const token = authToken.get();
    req.headers.authorization = `Bearer ${token?.token}`;
});

export default axiosGQLInstance;