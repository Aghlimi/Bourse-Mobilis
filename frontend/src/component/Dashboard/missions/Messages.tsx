import React from "react";
export default function Messages({missionId}: {missionId?: number}) {
    const [messages, setMessages] = React.useState<Array<any>>([]);
    const inputRef = React.useRef<HTMLInputElement>(null);
    React.useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND}/api/missions/${missionId}/messages`, {
            headers: {
                'accept': 'application/json',
                'authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(async (response) => {
                const data = await response.json();
                setMessages(data);
            });
    }, []);
    const send = () => {
        fetch(`${import.meta.env.VITE_BACKEND}/api/missions/${missionId}/messages`, {
            method: "POST",
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                content: inputRef.current?.value
            })
        })
            .then(async (response) => {
                const data = await response.json();
                if (response.ok) {
                    setMessages((prevMessages) => [...prevMessages, data]);
                } else {
                    throw new Error(data.message || response.statusText);
                }
            })
            .catch((error) => {
                console.error("Error sending message:", error);
            });
            inputRef.current!.value = '';
    }
    return (
        <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-blue-500">💬</span> Messages
            </h2>
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="max-h-80 overflow-y-auto p-4 space-y-3">
                    {messages.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-400">No messages yet. Start the conversation!</p>
                        </div>
                    ) : (
                        messages.map((message: any, index) => (
                            <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                                <p className="text-sm font-medium text-purple-600 mb-1">{message.name}</p>
                                <p className="text-gray-700">{message.content}</p>
                            </div>
                        ))
                    )}
                </div>
                <div className="border-t border-gray-100 p-4 bg-gray-50">
                    <div className="flex gap-3">
                        <input 
                            type="text" 
                            ref={inputRef} 
                            placeholder="Type your message..."
                            className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                        />
                        <button 
                            onClick={send}
                            className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:from-blue-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}