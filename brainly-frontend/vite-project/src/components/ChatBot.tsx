import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import ReactMarkdown from 'react-markdown';
import { ExpandIcon } from "../icons/ExpandIcon";

export function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [messages, setMessages] = useState<{role: 'user' | 'bot', content: string}[]>([
        { role: 'bot', content: "Hi! I'm your Brainly AI assistant. Ask me anything about the notes and links you've saved!" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        try {
            const res = await axios.post(`${BACKEND_URL}/api/v1/chat`, {
                question: userMsg
            }, {
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            });

            setMessages(prev => [...prev, { role: 'bot', content: res.data.answer }]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: 'bot', content: "Sorry, I ran into an error connecting to your brain." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`fixed z-50 ${isMaximized && isOpen ? 'inset-4 md:inset-10' : 'bottom-6 right-6'}`}>
            {/* Chat Bubble Button */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200 transition-all ${isMaximized ? 'w-full h-full' : 'w-80 md:w-96 h-[500px]'}`}>
                    {/* Header */}
                    <div className="bg-indigo-600 text-white p-4 flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <h3 className="font-bold text-lg">Brainly AI</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setIsMaximized(!isMaximized)} className="text-indigo-200 hover:text-white transition-colors" title={isMaximized ? "Restore down" : "Maximize"}>
                                <ExpandIcon />
                            </button>
                            <button onClick={() => {setIsOpen(false); setIsMaximized(false);}} className="text-indigo-200 hover:text-white transition-colors" title="Close">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-950 flex flex-col gap-4">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                                    msg.role === 'user' 
                                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none shadow-sm prose dark:prose-invert prose-sm'
                                }`}>
                                    {msg.role === 'user' ? (
                                        msg.content
                                    ) : (
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    )}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex gap-1">
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                        <form 
                            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                            className="flex items-center gap-2"
                        >
                            <input 
                                type="text" 
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Ask your Second Brain..."
                                className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-none rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                disabled={loading}
                            />
                            <button 
                                type="submit"
                                disabled={loading || !input.trim()}
                                className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 -ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
