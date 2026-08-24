//this page shows a shared brain (read-only) when someone visits /share/:shareLink
import {useEffect, useState} from "react"
import {useParams} from "react-router-dom"
import {Card} from "../components/card"
import axios from "axios"
import {BACKEND_URL} from "../config"

interface SharedContent {
    _id: string;
    title: string;
    link: string;
    type: "youtube" | "twitter" | "document" | "link";
}

export function SharedBrain(){
    const {shareLink} = useParams();
    const [contents, setContents] = useState<SharedContent[]>([]);
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchSharedBrain(){
            try{
                const response = await axios.get(`${BACKEND_URL}/api/v1/brain/${shareLink}`);
                setUsername(response.data.username);
                setContents(response.data.content);
            } catch(e){
                console.error("Error fetching shared brain:", e);
                setError("This shared brain link is invalid or has been removed.");
            } finally {
                setLoading(false);
            }
        }
        fetchSharedBrain();
    }, [shareLink])

    if(loading){
        return <div className="h-screen w-screen bg-gray-50 flex justify-center items-center">
            <div className="animate-spin h-8 w-8 border-2 border-purple-600 border-t-transparent rounded-full"></div>
        </div>
    }

    if(error){
        return <div className="h-screen w-screen bg-gray-50 flex justify-center items-center">
            <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-8 max-w-md text-center animate-slide-up">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Link Not Found</h2>
                <p className="text-gray-500 text-sm">{error}</p>
            </div>
        </div>
    }

    return <div className="min-h-screen bg-gray-50 p-8">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">
                    {username.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{username}'s Brain</h1>
                    <p className="text-gray-500 text-sm">{contents.length} items shared</p>
                </div>
            </div>
        </div>

        {/* Content grid - read-only, no delete buttons */}
        <div className="max-w-6xl mx-auto flex gap-4 flex-wrap">
            {contents.map(({_id, type, link, title}) => <Card 
                key={_id}
                type={type} 
                link={link}
                title={title}
            />)}
        </div>
    </div>
}
