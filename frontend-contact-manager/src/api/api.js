import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api/v1',
});

// Set the token in request headers
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export const registerUser = (userData) => API.post('/users/register', userData);
export const loginUser = (userData) => API.post('/users/login', userData);
export const forgotUserPassword = (userData) => API.post('/users/forgot-password', userData);
export const fetchContacts = () => API.get('/contacts');
export const createContact = (contactData) => API.post('/contacts', contactData);
export const updateContact = (id, updatedContact) => API.post(`/contacts/${id}`, updatedContact);
export const deleteContact = (id) => API.delete(`/contacts/${id}`);