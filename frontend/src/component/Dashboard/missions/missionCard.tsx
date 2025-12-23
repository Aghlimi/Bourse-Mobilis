import { useNavigate } from "react-router-dom";
import type { Mission } from "../../../types";

const statusColors: Record<string, string> = {
    'DRAFT': 'bg-gray-100 text-gray-600',
    'PENDING': 'bg-orange-50 text-orange-600',
    'PUBLISHED': 'bg-blue-50 text-blue-600',
    'IN_PROGRESS': 'bg-purple-50 text-purple-600',
    'COMPLETED': 'bg-green-50 text-green-600',
    'REJECTED': 'bg-red-50 text-red-600',
    'CLOSED': 'bg-gray-100 text-gray-600'
};

export default function MissionCard({ mission }: { mission: Mission }) {
    const navigate = useNavigate();
    const open = () => {
        navigate(`/dashboard/missions/${mission.id}`);
    };
    
    return (
        <div 
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden group hover:-translate-y-1" 
            onClick={open}
        >
            <div className="h-2 bg-gradient-to-r from-orange-400 via-blue-400 to-purple-400"></div>
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-purple-600 transition-colors">{mission.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[mission.status] || 'bg-gray-100 text-gray-600'}`}>
                        {mission.status}
                    </span>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-600">
                        <span className="text-orange-500">📅</span>
                        <span className="text-sm">{new Date(mission.when).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <span className="text-blue-500">📍</span>
                        <span className="text-sm">{mission.distance} km</span>
                    </div>
                    {mission.from && mission.to && (
                        <div className="flex items-center gap-2 text-gray-600">
                            <span className="text-green-500">🚗</span>
                            <span className="text-sm">{mission.from} → {mission.to}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}