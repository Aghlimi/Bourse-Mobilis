import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./Home";
import CreateMission from "./missions/create";
import Missions from "./missions/missions";
import PendedMissions from "./missions/pended";
import MissionDetail from "./missions/mission";
import { AppContext } from "../../context";


export default function Dashboard() {
    const context = React.useContext(AppContext);
    const me = context?.me;
    const setMe = context?.setMe;
    const navigate = useNavigate();

    React.useEffect(() => {
        if (me === undefined) {
            navigate('/login');
        }
    }, [me, navigate]);

    React.useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND}/api/users`, {
            headers: {
                'accept': 'application/json',
                'authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(async (response) => {
                if (!response.ok && response.status === 401)
                    setMe?.(undefined);
                const data = await response.json();
                setMe?.(data);
            });
    }, [setMe]);

    const changePage = (page: '/' | '/missions/create' | '/missions' | '/missions_pended') => {
        navigate(`/dashboard${page}`);
    }

    const LogoutHandler = async () => {
        await fetch(`${import.meta.env.VITE_BACKEND}/api/logout`, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        localStorage.removeItem('token');
        navigate('/login');
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-green-50">
            <nav className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-purple-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">Dashboard</h1>
                        <div className="flex items-center gap-2">
                            <button onClick={() => changePage('/')} className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200 font-medium">Home</button>
                            <button onClick={() => changePage('/missions/create')} className="px-4 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-all duration-200 font-medium">Create Mission</button>
                            <button onClick={() => changePage('/missions')} className="px-4 py-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-all duration-200 font-medium">Missions</button>
                            {me?.role === 'operator' && (
                                <button onClick={() => changePage('/missions_pended')} className="px-4 py-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition-all duration-200 font-medium">Pending</button>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                    {me?.name?.charAt(0).toUpperCase() || 'G'}
                                </div>
                                <div className="text-sm">
                                    <p className="font-medium text-gray-700">{me?.name || 'Guest'}</p>
                                    <p className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full inline-block">{me?.role || 'mover'}</p>
                                </div>
                            </div>
                            <button onClick={LogoutHandler} className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 font-medium">Logout</button>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/missions/create" element={<CreateMission />} />
                    <Route path="/missions" element={<Missions />} />
                    <Route path="/missions/:id" element={<MissionDetail />} />
                    {me?.role === 'operator' &&
                        (<Route path="/missions_pended" element={<PendedMissions />} />)}
                </Routes>
            </main>
        </div>
    );

}