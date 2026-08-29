import { SideBarItem } from "./sidebar-item";
import { TwitterIcon } from "../icons/TwitterIcon";
import { Logo } from "../icons/Logo";
import { YouTubeIcon } from "../icons/YouTubeIcon";
import { useState, useEffect } from "react";
import { ProfileDrawer } from "./ProfileDrawer";
import { SidebarTagItem } from "./SidebarTagItem";
import { useTheme } from "../hooks/useTheme";

interface SidebarProps {
    activeFilter?: string;
    onFilterChange?: (filter: string) => void;
    selectedTag?: string | null;
    onTagSelect?: (tag: string | null) => void;
    availableTypes?: string[];
    availableTags?: string[];
    isCollapsed?: boolean;
    onCollapseChange?: (collapsed: boolean) => void;
    isOpenMobile?: boolean;
    onCloseMobile?: () => void;
}

export function Sidebar({ activeFilter = "all", onFilterChange, selectedTag = null, onTagSelect, availableTypes = [], availableTags = [], isCollapsed = false, onCollapseChange, isOpenMobile = false, onCloseMobile }: SidebarProps) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [tagsExpanded, setTagsExpanded] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const username = localStorage.getItem("username") || "User";
    const initial = username.charAt(0).toUpperCase();
    const [profilePicUrl, setProfilePicUrl] = useState(localStorage.getItem("profilePicUrl") || "");

    useEffect(() => {
        const handleProfilePicUpdate = () => {
            setProfilePicUrl(localStorage.getItem("profilePicUrl") || "");
        };

        window.addEventListener("profilePicUpdated", handleProfilePicUpdate);
        return () => window.removeEventListener("profilePicUpdated", handleProfilePicUpdate);
    }, []);

    const getIconForType = (type: string) => {
        switch (type.toLowerCase()) {
            case 'twitter': return <TwitterIcon />;
            case 'youtube': return <YouTubeIcon />;
            case 'document': return (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
            );
            case 'link': return (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                </svg>
            );
            default: return (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
            );
        }
    };

    return (
        <>
        {/* Mobile Overlay */}
        {isOpenMobile && (
            <div 
                className="fixed inset-0 bg-black/20 dark:bg-black/40 z-10 md:hidden backdrop-blur-sm transition-opacity"
                onClick={onCloseMobile}
            />
        )}
        <div className={`h-screen bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-r border-slate-200 dark:border-gray-800 fixed left-0 top-0 flex flex-col z-20 transition-all duration-300 ease-in-out ${isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} ${isCollapsed ? 'md:w-20 w-72' : 'w-72'}`}>
            <div className={`flex items-center pt-8 pb-6 ${isCollapsed ? 'md:px-4 md:justify-center px-6' : 'px-6'}`}>
                <div className="text-indigo-600 dark:text-indigo-500 flex items-center gap-2 overflow-hidden whitespace-nowrap">
                    <div className="shrink-0">
                        <Logo className="w-8 h-8 hover:scale-110 transition-transform duration-300 cursor-pointer" />
                    </div>
                    {!isCollapsed && <span className="text-2xl font-bold text-gray-900 dark:text-white transition-opacity duration-300">Brainly</span>}
                </div>
                
                {/* Minimalist Dark Mode Toggle */}
                {!isCollapsed && (
                    <button
                        onClick={toggleTheme}
                        className="ml-auto p-2 rounded-full bg-gray-100 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-300 hover:scale-110 active:scale-95"
                        title="Toggle Dark Mode"
                    >
                        <div className="relative w-5 h-5">
                            {/* Sun Icon */}
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                className={`absolute inset-0 transition-all duration-500 ease-in-out transform ${theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                            </svg>
                            
                            {/* Moon Icon */}
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                className={`absolute inset-0 transition-all duration-500 ease-in-out transform ${theme === 'dark' ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                            </svg>
                        </div>
                    </button>
                )}
            </div>

            <div className={`flex-1 overflow-y-auto overflow-x-hidden ${isCollapsed ? 'px-2' : 'px-4'} space-y-1 custom-scrollbar`}>
                <SideBarItem 
                    text="All Notes" 
                    icon={
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                    } 
                    active={activeFilter === "all"} 
                    onClick={() => onFilterChange?.("all")} 
                    isCollapsed={isCollapsed} 
                />
                
                <div className="pt-4 pb-1">
                    {!isCollapsed && <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider pl-4 mb-2">Content Types</p>}
                    {isCollapsed && <div className="h-px w-8 bg-gray-200 dark:bg-gray-800 mx-auto my-3"></div>}
                    
                    {availableTypes.length > 0 ? availableTypes.map(type => (
                        <SideBarItem 
                            key={type}
                            text={type.charAt(0).toUpperCase() + type.slice(1)} 
                            icon={getIconForType(type)} 
                            active={activeFilter === type} 
                            onClick={() => onFilterChange?.(type)} 
                            isCollapsed={isCollapsed} 
                        />
                    )) : (
                        !isCollapsed && <p className="text-sm text-gray-400 dark:text-gray-600 pl-4 italic">No types yet</p>
                    )}
                </div>

                {/* Dynamic Tags Section */}
                <div className="pt-2 pb-1">
                    <div 
                        className={`flex items-center justify-between cursor-pointer group ${isCollapsed ? 'justify-center' : 'pl-4 pr-2'} mb-2`}
                        onClick={() => {
                            if (!isCollapsed) setTagsExpanded(!tagsExpanded);
                            onFilterChange?.("tags");
                            onTagSelect?.(null);
                        }}
                    >
                        {!isCollapsed && <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider group-hover:text-indigo-500 transition-colors">Tags</p>}
                        {isCollapsed && <div className="h-px w-8 bg-gray-200 dark:bg-gray-800 mx-auto my-3"></div>}
                        
                        {!isCollapsed && (
                            <svg 
                                className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${tagsExpanded ? 'rotate-180' : ''}`} 
                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        )}
                    </div>
                    
                    {/* Always show Tags filter item if collapsed, otherwise show based on expanded state */}
                    <div className={`overflow-hidden transition-all duration-300 ${isCollapsed || tagsExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                        {(!isCollapsed && availableTags.length === 0) ? (
                            <p className="text-sm text-gray-400 dark:text-gray-600 pl-4 italic">No tags yet</p>
                        ) : (
                            <div className="flex flex-col gap-0.5">
                                {availableTags.map(tag => (
                                    <SidebarTagItem 
                                        key={tag}
                                        tag={tag}
                                        active={activeFilter === "tags" && selectedTag === tag} 
                                        onClick={() => {
                                            onFilterChange?.("tags");
                                            onTagSelect?.(tag);
                                        }} 
                                        isCollapsed={isCollapsed} 
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-2 pb-2">
                    {!isCollapsed && <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider pl-4 mb-2">System</p>}
                    {isCollapsed && <div className="h-px w-8 bg-gray-200 dark:bg-gray-800 mx-auto my-3"></div>}
                    <SideBarItem 
                        text="Trash" 
                        icon={
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                        } 
                        active={activeFilter === "trash"} 
                        onClick={() => onFilterChange?.("trash")} 
                        isCollapsed={isCollapsed} 
                    />
                </div>
            </div>

            {/* Collapse Toggle Button */}
            <div className="hidden md:block absolute -right-3 top-24 z-30">
                <button 
                    onClick={() => onCollapseChange?.(!isCollapsed)}
                    className="w-6 h-6 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none"
                >
                    <svg 
                        className={`w-3 h-3 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} 
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
            </div>

            {/* User Profile Trigger */}
            <div className="p-4 border-t border-slate-200/50 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-900/50">
                <div 
                    onClick={() => setIsProfileOpen(true)}
                    className={`flex items-center gap-3 p-2 rounded-xl hover:bg-gray-200/50 dark:hover:bg-gray-800 cursor-pointer transition-all duration-200 group ${isCollapsed ? 'justify-center' : ''}`}
                    title={isCollapsed ? username : ""}
                >
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shrink-0 overflow-hidden shadow-sm group-hover:scale-110 transition-transform duration-300">
                        {profilePicUrl ? (
                            <img src={profilePicUrl} alt={username} className="w-full h-full object-cover" />
                        ) : (
                            initial
                        )}
                    </div>
                    {!isCollapsed && (
                        <>
                            <div className="flex-1 min-w-0 transition-opacity duration-300">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{username}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Settings</p>
                            </div>
                            <div className="text-gray-400 dark:text-gray-500 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-2 group-hover:translate-x-0 transform">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <ProfileDrawer isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        </div>
        </>
    );
}