import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
    const navigate = useNavigate();


    const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        fetch(import.meta.env.VITE_BACKEND + "/api/login", {
            method: "POST",
            body: formData
        }).then(async (response) => {
            const data = await response.json();
            return data;
        }).then(function(data) {

            console.log(data);
            if(data.access_token){
                localStorage.setItem("token", data.access_token);
                navigate("/dashboard");
            }
            console.log(data);
        }).catch((error) => {
            console.error("Error during login:", error);
        });
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Welcome Back</h1>
                    <p className="text-gray-500">Sign in to your account</p>
                </div>
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-orange-400 via-blue-400 to-purple-400"></div>
                    <form onSubmit={submitHandler} className="p-8 space-y-6">
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
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                placeholder="Enter your password"
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            Sign In
                        </button>
                        <p className="text-center text-gray-500 text-sm">
                            Don't have an account? <a href="/register" className="text-purple-600 hover:text-purple-700 font-medium">Register</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}