import type { ReactElement } from "react";

export function SideBarItem({ 
    text, 
    icon, 
    active, 
    onClick, 
    isCollapsed = false 
}: {
    text: string;
    icon: ReactElement;
    active?: boolean;
    onClick?: () => void;
    isCollapsed?: boolean;
}) {
    return (
        <div 
            onClick={onClick} 
            className={`
                group relative flex items-center py-2.5 cursor-pointer rounded-xl transition-all duration-300
                ${isCollapsed ? 'justify-center w-12 mx-auto' : 'px-4 w-full'}
                ${active 
                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm" 
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-white"
                }
            `}
            title={isCollapsed ? text : ""}
        >
            {/* Active Indicator Pill */}
            {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-indigo-600 dark:bg-indigo-500 rounded-r-full shadow-[0_0_8px_rgba(79,70,229,0.5)]"></div>
            )}
            
            <div className={`
                flex items-center justify-center transition-transform duration-300
                ${active ? 'scale-110' : 'group-hover:scale-110'}
                ${isCollapsed ? '' : 'mr-3'}
            `}>
                {icon}
            </div>
            
            {!isCollapsed && (
                <div className="text-sm tracking-wide whitespace-nowrap overflow-hidden transition-all duration-300">
                    {text}
                </div>
            )}
            
            {/* Hover Glow Effect */}
            {!active && (
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-gray-200/20 dark:via-gray-700/20 to-transparent blur-sm -z-10"></div>
            )}
        </div>
    );
}