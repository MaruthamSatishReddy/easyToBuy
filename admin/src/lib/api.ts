import axios from 'axios';

// Auth Service Client (Port 8085)
export const authApi = axios.create({
    baseURL: 'http://localhost:8085/api/auth',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Product Service Client (Port 8081)
export const productApi = axios.create({
    baseURL: 'http://localhost:8081/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Order Service Client (Port 8082)
export const orderApi = axios.create({
    baseURL: 'http://localhost:8082/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to include JWT token
const addAuthInterceptor = (apiClient: any) => {
    apiClient.interceptors.request.use(
        (config: any) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error: any) => Promise.reject(error)
    );
};

// Add response interceptor for error handling
const addErrorInterceptor = (apiClient: any) => {
    apiClient.interceptors.response.use(
        (response: any) => response,
        (error: any) => {
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }
    );
};

// Apply interceptors to all API clients
[productApi, orderApi].forEach(api => {
    addAuthInterceptor(api);
    addErrorInterceptor(api);
});

// Auth-related interfaces
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    fullName: string;
    role?: string;
}

export interface AuthResponse {
    token: string;
    type: string;
    id: string;
    email: string;
    fullName: string;
    role: string;
}

export interface UserResponse {
    id: string;
    email: string;
    fullName: string;
    role: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    brand: string;
    category: string;
    skuCode: string;
    images?: string[];
    sizes?: string[];
}

export interface Order {
    id: string;
    orderNumber: string;
    skuCode: string;
    price: number;
    quantity: number;
    email: string;
}
