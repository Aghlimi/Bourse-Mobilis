import React from 'react';
import MissionCard from './missionCard';

const ListItem = ({ missions }: { missions: any }) => {
    return (
        <>
        {
            missions.map((mission: any) => (
                <MissionCard key={mission.id} mission={mission} />
            ))
        }
        </>
    );
}

export default function PendedMissions() {
    const [missions, setMissions] = React.useState<Array<any>>([]);
    React.useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND}/api/operator/pended`, {
            headers: {
                'accept': 'application/json',
                'authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(async (response) => {
                const data = await response.json();
                console.log(data);
                setMissions(data);
            });
    }, []);
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Pending Missions</h1>
                <p className="text-gray-500">Review and approve pending mission requests</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ListItem missions={missions} />
            </div>
            {missions.length === 0 && (
                <div className="text-center py-16 bg-white/50 rounded-2xl border border-gray-100">
                    <div className="text-6xl mb-4">✅</div>
                    <p className="text-gray-500 text-lg">No pending missions to review</p>
                </div>
            )}
        </div>
    );
}