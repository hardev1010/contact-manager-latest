// this is not used anywhere in project it is for reference only

import axios from 'axios';

const loginUser = async (email, password) => {
    const { data } = await axios.post('/api/users/login', { email, password });
    localStorage.setItem('token', data.token);
};

const registerUser = async (name, email, password) => {
    const { data } = await axios.post('/api/users/register', { name, email, password });
    localStorage.setItem('token', data.token);
};
const config = {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
};

const fetchContacts = async () => {
    const { data } = await axios.get('/api/contacts', config);
    console.log(data);
};



export {loginUser, registerUser, fetchContacts}