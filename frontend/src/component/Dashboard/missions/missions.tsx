import React from "react";
import MissionCard from "./missionCard";
import type { Mission } from "../../../types";

export default function Missions() {
    const [missions, setMissions] = React.useState<Array<Mission>>([]);
    React.useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND}/api/missions/my/missions`, {
            headers: {
                'accept': 'application/json',
                'authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(async (response) => {
                const data = await response.json();
                if (response.ok) {
                    setMissions(data);
                } else {
                    throw new Error(data.message || response.statusText);
                }
            })
            .catch((error) => {
                console.error("Error fetching missions:", error);
            });
    }, []);
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">My Missions</h1>
                <p className="text-gray-500">Manage your created missions</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {
                    missions.map((mission: Mission) => (
                        <MissionCard key={mission.id} mission={mission} />
                    ))
                }
            </div>
            {missions.length === 0 && (
                <div className="text-center py-16 bg-white/50 rounded-2xl border border-gray-100">
                    <div className="text-6xl mb-4">📋</div>
                    <p className="text-gray-500 text-lg">You haven't created any missions yet</p>
                </div>
            )}
        </div>
    );
}