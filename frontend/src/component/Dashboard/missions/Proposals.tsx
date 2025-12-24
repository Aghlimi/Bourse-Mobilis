import React from "react";
import { AppContext } from "../../../context";

export default function Proposals({ missionId, creater }: { missionId?: number, creater?: number }) {
    const [proposals, setProposals] = React.useState<Array<any>>([]);
    const context = React.useContext(AppContext);
    const me = context?.me;
    React.useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND}/api/missions/${missionId}/proposals/`, {
            headers: {
                'accept': 'application/json',
                'authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(async (response) => {
                const data = await response.json();
                if (response.ok) {
                    setProposals(data);
                }
            });
    }, []);
    const acceptProposal = (proposalId: number) => {
        fetch(`${import.meta.env.VITE_BACKEND}/api/proposals/${proposalId}/accept`, {
            method: "PATCH",
            headers: {
                'accept': 'application/json',
                'authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(async (response) => {
                const data = await response.json();
                if (response.ok)
                    setProposals((prev) => prev.map(p => p.id === proposalId ? data : p));
                else
                    throw new Error(data.message || response.statusText);
            })
            .catch((error) => {
                console.error("Error accepting proposal:", error);
            });
    }

    const rejectProposal = (proposalId: number) => {
        fetch(`${import.meta.env.VITE_BACKEND}/api/proposals/${proposalId}/reject`, {
            method: "PATCH",
            headers: {
                'accept': 'application/json',
                'authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(async (response) => {
                const data = await response.json();
                if (response.ok)
                    setProposals((prev) => prev.map(p => p.id === proposalId ? data : p));
                else
                    throw new Error(data.message || response.statusText);
            })
            .catch((error) => {
                console.error("Error rejecting proposal:", error);
            });
    }
    console.log(proposals);
    if (!proposals) { return null; }
    return (
        <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-purple-500">💼</span> Proposals
            </h2>
            {proposals.length === 0 ? (
                <div className="bg-purple-50 rounded-xl p-6 text-center">
                    <p className="text-purple-600">No proposals yet</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {proposals.map((proposal: any, index: number) => (
                        <div key={index} className="bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-shadow">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    {proposal.message && (
                                        <p className="text-gray-700 mb-2">{proposal.message}</p>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
                                            💰 {proposal.proposed_price}
                                        </span>
                                        {proposal.status && (
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                proposal.status === 'accepted' ? 'bg-green-50 text-green-600' :
                                                proposal.status === 'rejected' ? 'bg-red-50 text-red-600' :
                                                'bg-orange-50 text-orange-600'
                                            }`}>
                                                {proposal.status}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {creater === me?.id && (
                                    <div className="flex gap-2 ml-4">
                                        <button 
                                            onClick={() => acceptProposal(proposal.id)}
                                            className="px-4 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors font-medium text-sm"
                                        >
                                            ✓ Accept
                                        </button>
                                        <button 
                                            onClick={() => rejectProposal(proposal.id)}
                                            className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-medium text-sm"
                                        >
                                            ✕ Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}