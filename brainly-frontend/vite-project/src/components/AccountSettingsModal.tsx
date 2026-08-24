import {CrossIcon} from "../icons/CrossIcon"
import {Button} from "../components/button"
import {useState} from "react"
import axios from "axios"
import {BACKEND_URL} from "../config"
import {useNavigate} from "react-router-dom"
import {createPortal} from "react-dom"

interface AccountSettingsModalProps {
    open: boolean;
    onClose: () => void;
}

export function AccountSettingsModal({open, onClose}: AccountSettingsModalProps){
   const navigate = useNavigate();
   const [activeTab, setActiveTab] = useState<"password" | "danger">("password");
   const [loading, setLoading] = useState(false); 

   // Password fields
   const [currentPassword, setCurrentPassword] = useState("");
   const [newPassword, setNewPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");

   async function handleChangePassword(){
         if(!currentPassword || !newPassword || !confirmPassword) {
             alert("Please fill in all fields.");
             return;
         }
         if (newPassword !== confirmPassword) {
             alert("New passwords do not match.");
             return;
         }

         setLoading(true);
        try {
             const res = await axios.put(`${BACKEND_URL}/api/v1/user/password`, {
                currentPassword,
                newPassword
             }, {
                headers: {
                   "Authorization": localStorage.getItem("token")
                }
             });
             
             alert(res.data.message);
             // Log out the user after password change for security
             localStorage.removeItem("token");
             localStorage.removeItem("username");
             navigate("/signin");
         } catch (error: unknown) {
             console.error("Error changing password", error);
             const err = error as { response?: { data?: { message?: string } } };
             alert(err.response?.data?.message || "Failed to change password.");
         } finally {
             setLoading(false);
         }
   }

   async function handleDeleteAccount() {
       const confirmDelete = window.confirm("Are you absolutely sure? This will delete all your notes, links, and account permanently.");
       if (!confirmDelete) return;

       setLoading(true);
       try {
             await axios.delete(`${BACKEND_URL}/api/v1/user`, {
                headers: {
                   "Authorization": localStorage.getItem("token")
                }
             });
             
             alert("Account successfully deleted.");
             localStorage.removeItem("token");
             localStorage.removeItem("username");
             navigate("/signin");
         } catch (error: unknown) {
             console.error("Error deleting account", error);
             const err = error as { response?: { data?: { message?: string } } };
             alert(err.response?.data?.message || "Failed to delete account.");
         } finally {
             setLoading(false);
         }
   }

     if(!open) return null;

     return createPortal(
          <div>
             <div className="fixed inset-0 bg-slate-500/50 z-40" onClick={onClose}></div>
             
             {/* Push it slightly to the right of the drawer (left-80 is 320px) */}
             <div className="fixed inset-0 z-50 flex items-center justify-start p-4 pl-[340px]">
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg animate-in fade-in zoom-in duration-200">
                      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                         <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
                         <div onClick={onClose} className="cursor-pointer p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                              <CrossIcon/>
                         </div>   
                      </div>
                      
                      <div className="flex border-b border-gray-100 px-6 pt-2 gap-4">
                          <button 
                            className={`pb-2 text-sm font-medium transition-colors border-b-2 ${activeTab === "password" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                            onClick={() => setActiveTab("password")}
                          >
                              Change Password
                          </button>
                          <button 
                            className={`pb-2 text-sm font-medium transition-colors border-b-2 ${activeTab === "danger" ? "border-red-600 text-red-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                            onClick={() => setActiveTab("danger")}
                          >
                              Danger Zone
                          </button>
                      </div>

                      <div className="px-6 py-6">
                         {activeTab === "password" && (
                            <div className="space-y-4">
                               <div className="flex flex-col gap-1.5">
                                   <label className="text-sm font-medium text-gray-700 pl-1">Current Password</label>
                                   <input 
                                     type="password" 
                                     value={currentPassword}
                                     onChange={(e) => setCurrentPassword(e.target.value)}
                                     placeholder="••••••••"
                                     className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all bg-gray-50/50" 
                                   />
                               </div>
                               <div className="flex flex-col gap-1.5">
                                   <label className="text-sm font-medium text-gray-700 pl-1">New Password</label>
                                   <input 
                                     type="password" 
                                     value={newPassword}
                                     onChange={(e) => setNewPassword(e.target.value)}
                                     placeholder="••••••••"
                                     className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all bg-gray-50/50" 
                                   />
                               </div>
                               <div className="flex flex-col gap-1.5">
                                   <label className="text-sm font-medium text-gray-700 pl-1">Confirm New Password</label>
                                   <input 
                                     type="password" 
                                     value={confirmPassword}
                                     onChange={(e) => setConfirmPassword(e.target.value)}
                                     placeholder="••••••••"
                                     className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all bg-gray-50/50" 
                                   />
                               </div>
                            </div>
                         )}

                         {activeTab === "danger" && (
                             <div className="space-y-4">
                                 <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                                     <h3 className="text-red-800 font-semibold mb-1">Delete Account</h3>
                                     <p className="text-sm text-red-600 mb-4">
                                         Once you delete your account, there is no going back. All your notes, links, and documents will be permanently deleted. Please be certain.
                                     </p>
                                     <button 
                                        onClick={handleDeleteAccount}
                                        disabled={loading}
                                        className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                                     >
                                         {loading ? "Deleting..." : "Yes, delete my account"}
                                     </button>
                                 </div>
                             </div>
                         )}
                      </div>
                      
                      {activeTab === "password" && (
                          <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end gap-2">
                               <Button onClick={onClose} variant="ghost" text="Cancel" size="md" />
                               <Button onClick={handleChangePassword} variant="primary" text="Update Password" size="md" loading={loading} />
                          </div>
                      )}
                      {activeTab === "danger" && (
                          <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end gap-2">
                               <Button onClick={onClose} variant="ghost" text="Close" size="md" />
                          </div>
                      )}
                     
               </div>  
            </div>
                     
          </div>,
          document.body
     );
}

