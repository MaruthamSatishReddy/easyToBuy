import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8081/api', // Default to Product Service for products
});

export const orderApi = axios.create({
    baseURL: 'http://localhost:8082/api',
});

export const inventoryApi = axios.create({
    baseURL: 'http://localhost:8083/api',
});

export default api;
