import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();
    const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        fetch(import.meta.env.VITE_BACKEND + "/api/users", {
            method: "POST",
            headers:{
                'accept': 'application/json'
            },
            body: formData
        }).then(async (response) => {
            const data = await response.json();
            if (response.ok) {
                navigate('/login');
                return ;
            }else {
                throw new Error(data.message || response.statusText);
            }
        }).catch((error) => {
            console.error("Error during registration:", error);
        });
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-orange-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-orange-600 bg-clip-text text-transparent mb-2">Create Account</h1>
                    <p className="text-gray-500">Join us and start your journey</p>
                </div>
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-green-400 via-blue-400 to-orange-400"></div>
                    <form onSubmit={submitHandler} className="p-8 space-y-5">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                required 
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                                placeholder="Enter your name"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input 
                                type="text" 
                                id="email" 
                                name="email" 
                                required 
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                required 
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                                placeholder="Create a password"
                            />
                        </div>
                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                            <input 
                                type="password" 
                                id="password_confirmation" 
                                name="password_confirmation" 
                                required 
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                                placeholder="Confirm your password"
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            Create Account
                        </button>
                        <p className="text-center text-gray-500 text-sm">
                            Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">Sign In</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}