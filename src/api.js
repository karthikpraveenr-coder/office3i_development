// src/api.js
import axios from 'axios';
import Swal from 'sweetalert2';

const api = axios.create({
    baseURL: 'https://office3i.com/user/api/public/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

let isRefreshing = false; // Flag to prevent multiple alerts

// Function to handle session expiration
const handleSessionExpiration = () => {
    if (!isRefreshing) {
        isRefreshing = true;
        Swal.fire({
            title: 'Session Expired',
            text: 'Your session has expired. Please log in again.',
            icon: 'warning',
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.isConfirmed) {
                // Redirect to login page after user confirmation
                window.location.href = '/user/login';
            }
            isRefreshing = false;
        });
    }
};

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            handleSessionExpiration();
        }
        return Promise.reject(error);
    }
);

export default api;
