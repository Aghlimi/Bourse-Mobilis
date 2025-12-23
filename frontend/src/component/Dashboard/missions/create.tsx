import React from "react";

export default function CreateMission() {
    const SubmitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
        fetch(import.meta.env.VITE_BACKEND + "/api/missions", {
            method: "POST",
            headers: {
                'authorization': `Bearer ${localStorage.getItem('token')}`,
                'accept': 'application/json'
            },
            body: formData
        }).then(async (response) => {
            const data = await response.json();
            if (response.ok) {
                alert("Mission created successfully!");
                return ;
            }else {
                throw new Error(data.message || response.statusText);
            }
        }).catch((error) => {
            console.error("Error during mission creation:", error);
        });
    }
    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Mission</h1>
                <p className="text-gray-500">Fill in the details to create a new mission</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400"></div>
                <form onSubmit={SubmitHandler} className="p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mission Name</label>
                        <input 
                            type="text" 
                            name="title" 
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                            placeholder="Enter mission name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea 
                            name="description" 
                            rows={4}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none resize-none"
                            placeholder="Describe the mission details"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                            <input 
                                type="text" 
                                name="from" 
                                placeholder="Start city" 
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                            <input 
                                type="text" 
                                name="to" 
                                placeholder="Destination city" 
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">When</label>
                            <input 
                                type="datetime-local" 
                                name="when" 
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Distance (km)</label>
                            <input 
                                type="number" 
                                name="distance" 
                                placeholder="Distance in km" 
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                            />
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        Create Mission
                    </button>
                </form>
            </div>
        </div>
    );
}