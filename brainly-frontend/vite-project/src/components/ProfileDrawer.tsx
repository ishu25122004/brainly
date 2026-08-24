import { CrossIcon } from "../icons/CrossIcon";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { AccountSettingsModal } from "./AccountSettingsModal";

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileDrawer({ isOpen, onClose }: ProfileDrawerProps) {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "User";
  const initial = username.charAt(0).toUpperCase();
  const [profilePicUrl, setProfilePicUrl] = useState(localStorage.getItem("profilePicUrl") || "");
  const [isExporting, setIsExporting] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [uploadingPic, setUploadingPic] = useState(false);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("profilePicUrl");
    navigate("/signin");
  }

  async function handleProfilePicUpload(event: React.ChangeEvent<HTMLInputElement>) {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploadingPic(true);
      try {
          const formData = new FormData();
          formData.append("file", file);
          
          const response = await axios.post(`${BACKEND_URL}/api/v1/user/profile-pic`, formData, {
              headers: {
                  Authorization: localStorage.getItem("token")
              }
          });

          const newPicUrl = response.data.profilePicUrl;
          setProfilePicUrl(newPicUrl);
          localStorage.setItem("profilePicUrl", newPicUrl);
          
          // Dispatch a custom event so other components (like Sidebar) know it updated
          window.dispatchEvent(new Event("profilePicUpdated"));
      } catch (error) {
          console.error("Error uploading profile picture:", error);
          alert("Failed to upload profile picture.");
      } finally {
          setUploadingPic(false);
      }
  }

  async function handleExport() {
    try {
      setIsExporting(true);
      const response = await axios.get(`${BACKEND_URL}/api/v1/content`, {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      
      const contents = response.data.content;
      
      const cleanData = contents.map((item: Record<string, unknown>) => ({
        title: item.title,
        link: item.link,
        type: item.type,
        tags: item.tags,
      }));

      const dataStr = JSON.stringify(cleanData, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `brain-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Failed to export notes.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 left-0 h-screen w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col border-r border-transparent dark:border-gray-800 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <CrossIcon />
          </button>
        </div>

        {/* User Info */}
        <div className="px-6 py-8 flex flex-col items-center border-b border-gray-100 dark:border-gray-800">
          <div className="relative group mb-4">
              <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-3xl font-bold shadow-sm overflow-hidden">
                {uploadingPic ? (
                    <div className="h-8 w-8 rounded-full border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent animate-spin"></div>
                ) : profilePicUrl ? (
                    <img src={profilePicUrl} alt={username} className="w-full h-full object-cover" />
                ) : (
                    initial
                )}
              </div>
              <label className="absolute inset-0 bg-black/40 dark:bg-black/60 text-white rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Edit
                  <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleProfilePicUpload}
                      disabled={uploadingPic}
                  />
              </label>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{username}</h3>
        </div>

        {/* Menu Options */}
        <div className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-4">
            <li>
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Account Settings
              </button>
            </li>
            <li>
              <button 
                onClick={handleExport}
                disabled={isExporting}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isExporting ? (
                  <div className="h-5 w-5 rounded-full border-2 border-gray-400 dark:border-gray-500 border-t-transparent animate-spin"></div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                )}
                {isExporting ? 'Exporting...' : 'Export Notes'}
              </button>
            </li>
          </ul>
        </div>

        {/* Footer with Logout */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div >

      {/* Account Settings Modal rendered on top of the drawer if needed */}
      <AccountSettingsModal 
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}
