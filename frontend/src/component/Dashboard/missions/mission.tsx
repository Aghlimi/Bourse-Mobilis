import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from '../../../context';
import type { Mission } from "../../../types";
import Proposals from "./Proposals";
import Messages from "./Messages";


export default function MissionDetail() {
    const navigate = useNavigate();
    const [mission, setMission] = React.useState<Mission | null | undefined>(null);
    const proposalForm = React.useRef<HTMLDivElement>(null);
    const proposalInput = React.useRef<HTMLInputElement>(null);
    const { id } = useParams();
    const context = React.useContext(AppContext);
    const me = context?.me;
    const ref = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    React.useEffect(() => {
        if (!id) {
            navigate('/dashboard');
        }
    }, [id, navigate]);

    const publishHandler = () => {
        fetch(`${import.meta.env.VITE_BACKEND}/api/missions/${id}/publish`, {
            method: "PATCH",
            headers: {
                'accept': 'application/json',
                'authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(async (response) => {
                const data = await response.json();
                if (response.ok) {
                    setMission(data);
                } else {
                    throw new Error(data.message || response.statusText);
                }
            })
            .catch((error) => {
                console.error("Error during mission publication:", error);
            });
    }

    const closeHandler = () => {
        fetch(`${import.meta.env.VITE_BACKEND}/api/missions/${id}/close`, {
            method: "PATCH",
            headers: {
                'accept': 'application/json',
                'authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(async (response) => {
                const data = await response.json();
                if (response.ok) {
                    setMission(data);
                } else {
                    throw new Error(data.message || response.statusText);
                }
            })
            .catch((error) => {
                console.error("Error during mission closure:", error);
            });
    }

    React.useEffect(() => {
        if (!id) return;
        fetch(`${import.meta.env.VITE_BACKEND}/api/missions/${id}`, {
            headers: {
                'accept': 'application/json',
                'authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(async (response) => {
                if (!response.ok) {
                    setMission(undefined);
                }
                const data = await response.json();
                setMission(data);
            });
    }, [id]);

    const handleAcceptMission = (reason: undefined | string = undefined) => {
        if (!id) return;
        fetch(`${import.meta.env.VITE_BACKEND}/api/missions/${id}/accept`, {
            method: "PATCH",
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ reason: reason || null })
        })
            .then(async (response) => {
                const data = await response.json();
                if (response.ok) {
                    setMission(data);
                } else {
                    throw new Error(data.message || response.statusText);
                }
            })
            .catch((error) => {
                console.error("Error during mission acceptance:", error);
            });
    }
    const submitProposal = () => {
        // Implementation for submitting a proposal
        // /missions/{missionId}/proposals
        fetch(`${import.meta.env.VITE_BACKEND}/api/missions/${id}/proposals`, {
            method: "POST",
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                proposed_price: proposalInput.current?.value
            })
        })
            .then(async (response) => {
                const data = await response.json();
                if (response.ok) {

                } else {
                    throw new Error(data.message || response.statusText);
                }
            })
            .catch((error) => {
                console.error("Error submitting proposal:", error);
            });
    }
    const statusColors: Record<string, string> = {
        'DRAFT': 'bg-gray-100 text-gray-600',
        'PENDING': 'bg-orange-50 text-orange-600',
        'PUBLISHED': 'bg-blue-50 text-blue-600',
        'IN_PROGRESS': 'bg-purple-50 text-purple-600',
        'COMPLETED': 'bg-green-50 text-green-600',
        'REJECTED': 'bg-red-50 text-red-600',
        'CLOSED': 'bg-gray-100 text-gray-600'
    };

    if (!id) {
        return <div className="text-center py-16">No mission id provided</div>;
    }

    return (
        <div>
            {mission ? (
                <div className="space-y-6">
                    {/* Mission Header */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-orange-400 via-blue-400 to-purple-400"></div>
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{mission.title}</h1>
                                    <p className="text-gray-500 flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                                            {mission.created_by.name?.charAt(0).toUpperCase()}
                                        </span>
                                        Created by {mission.created_by.name}
                                    </p>
                                </div>
                                <span className={`px-4 py-2 rounded-full font-medium ${statusColors[mission.status] || 'bg-gray-100 text-gray-600'}`}>
                                    {mission.status}
                                </span>
                            </div>
                            
                            {mission.description && (
                                <div className="mb-6 bg-gray-50 rounded-xl p-4">
                                    <p className="text-gray-700">{mission.description}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-orange-50 rounded-xl p-4">
                                    <p className="text-orange-600 text-sm font-medium mb-1">📍 From</p>
                                    <p className="text-gray-800 font-semibold">{mission.from}</p>
                                </div>
                                <div className="bg-blue-50 rounded-xl p-4">
                                    <p className="text-blue-600 text-sm font-medium mb-1">🎯 To</p>
                                    <p className="text-gray-800 font-semibold">{mission.to}</p>
                                </div>
                                <div className="bg-green-50 rounded-xl p-4">
                                    <p className="text-green-600 text-sm font-medium mb-1">📅 When</p>
                                    <p className="text-gray-800 font-semibold">{new Date(mission.when).toLocaleString()}</p>
                                </div>
                                <div className="bg-purple-50 rounded-xl p-4">
                                    <p className="text-purple-600 text-sm font-medium mb-1">🚗 Distance</p>
                                    <p className="text-gray-800 font-semibold">{mission.distance} km</p>
                                </div>
                            </div>

                            {mission.status === 'REJECTED' && mission.rejection_reason && (
                                <div className="mt-4 bg-red-50 rounded-xl p-4 border border-red-100">
                                    <p className="text-red-600 font-medium mb-1">⚠️ Rejection Reason</p>
                                    <p className="text-red-700">{mission.rejection_reason}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                        {me?.role === 'operator' && mission?.status === 'PENDING' && (
                            <>
                                <button 
                                    onClick={() => { handleAcceptMission() }}
                                    className="px-6 py-3 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-all font-medium flex items-center gap-2"
                                >
                                    ✓ Accept Mission
                                </button>
                                <button 
                                    onClick={() => {
                                        if (ref.current) {
                                            ref.current.style.display = 'block';
                                        }
                                    }}
                                    className="px-6 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all font-medium flex items-center gap-2"
                                >
                                    ✕ Reject Mission
                                </button>
                                <div ref={ref} style={{ display: 'none' }} className="w-full mt-4 bg-white rounded-xl shadow-md border border-gray-100 p-6">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Rejection Reason</h4>
                                    <input 
                                        type="text" 
                                        name="rejectionReason" 
                                        placeholder="Enter reason for rejection..." 
                                        ref={inputRef}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none mb-4"
                                    />
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => { handleAcceptMission(inputRef.current?.value) }}
                                            className="px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all font-medium"
                                        >
                                            Submit Rejection
                                        </button>
                                        <button 
                                            onClick={() => {
                                                if (ref.current)
                                                    ref.current.style.display = 'none';
                                            }}
                                            className="px-6 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all font-medium"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {me?.id !== mission?.created_by.id && mission?.status === 'PUBLISHED' && (
                            <>
                                <button 
                                    onClick={() => {
                                        proposalForm.current!.style.display = 'block';
                                    }}
                                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 transition-all font-medium shadow-lg hover:shadow-xl"
                                >
                                    💼 Create Proposal
                                </button>
                                <div ref={proposalForm} style={{ display: 'none' }} className="w-full mt-4 bg-white rounded-xl shadow-md border border-gray-100 p-6">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Submit Your Proposal</h4>
                                    <input 
                                        type="text" 
                                        placeholder="Enter your proposed price..." 
                                        ref={proposalInput}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none mb-4"
                                    />
                                    <button 
                                        onClick={submitProposal}
                                        className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 transition-all font-medium"
                                    >
                                        Submit Proposal
                                    </button>
                                </div>
                            </>
                        )}

                        {mission?.status === 'DRAFT' && (
                            <button 
                                onClick={publishHandler}
                                className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-green-500 text-white hover:from-blue-600 hover:to-green-600 transition-all font-medium shadow-lg hover:shadow-xl"
                            >
                                🚀 Publish Mission
                            </button>
                        )}

                        {mission?.status === 'PUBLISHED' && (me?.role === 'operator' || mission.created_by.id === me?.id) && (
                            <button 
                                onClick={closeHandler}
                                className="px-6 py-3 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all font-medium"
                            >
                                🔒 Close Mission
                            </button>
                        )}
                    </div>

                    <Proposals missionId={Number(id)} creater={mission?.created_by.id} />
                    <Messages missionId={Number(id)} />
                </div>
            ) : (
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading mission...</p>
                    </div>
                </div>
            )}
        </div>
    );
}