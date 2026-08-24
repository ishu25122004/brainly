import {Input} from "../components/Input"
import {Button} from "../components/button"
import {useRef, useState} from "react"
import axios from "axios"
import {BACKEND_URL} from "../config"
import {useNavigate, Link} from "react-router-dom"

export function Signup(){
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    async function signup(){
        const username = usernameRef.current?.value?.trim();
        const password = passwordRef.current?.value?.trim();

        if (!username || !password) {
            setError("Please fill in both fields");
            return;
        }

        try {
            setLoading(true);
            setError("");
            await axios.post(BACKEND_URL + "/api/v1/signup",{
                username,
                password
            })
            navigate("/signin")
        } catch(err){
            console.error("Error during signup:", err);
            setError("Signup failed. Username might already exist.");
        } finally {
            setLoading(false);
        }
    }

    return <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
         <div className="bg-white rounded-xl min-w-48 p-8 border">
             <div className="mb-4 text-center">
                 <h1 className="text-xl font-bold text-black">Signup</h1>
             </div>
             
             {error && <div className="mb-6 text-sm text-danger-500 bg-danger-500/10 border border-danger-500/20 p-3 rounded-lg text-center font-medium">{error}</div>}
             
             <div className="space-y-5">
                 <Input ref={usernameRef} placeholder="john_doe" label="Username"/>
                 <Input ref={passwordRef} placeholder="••••••••" type="password" label="Password"/>
             </div>

             <div className="pt-4 flex justify-center">
                <Button onClick={signup} loading={loading} variant="primary" text="Signup" size="md" fullWidth={true}/>
             </div>

             <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                 Already have an account? <Link to="/signin" className="text-purple-600 hover:underline">Sign in</Link>
             </div>
         </div>
    </div>
}