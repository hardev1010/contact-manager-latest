import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({user}) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <header className="w-full sticky top-0 flex justify-between items-center bg-blue-600 p-4 text-white">
                <div className="text-lg font-semibold ">
                    {`WELCOME, ${user} `|| 'User'}
                </div>
               
            <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 rounded-md hover:bg-red-600 transition-colors"
            >
                Logout
            </button>
        </header>
    );
};

export default Header;
