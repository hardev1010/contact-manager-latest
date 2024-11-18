import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotUserPassword } from '../api/api'; // Add an API call for sending the password reset email

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const {data} = await forgotUserPassword({email}); // Calls API to send reset email
            setMessage('Password reset instructions have been sent to your email.');
        } catch (error) {
            console.error('Error sending password reset email:', error);
            setError('Failed to send password reset email. Please try again.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Forgot Password</h2>
            <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors"
                >
                    Send Reset Link
                </button>
            </form>
            {message && <p className="mt-4 text-green-500">{message}</p>}
            {error && <p className="mt-4 text-red-500">{error}</p>}
            <button
                onClick={() => navigate('/login')}
                className="mt-4 text-blue-500 hover:underline"
            >
                Back to Login
            </button>
        </div>
    );
};

export default ForgotPassword;
