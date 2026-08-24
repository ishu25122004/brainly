import { useDroppable } from '@dnd-kit/core';
import { SideBarItem } from './sidebar-item';

export function SidebarTagItem({ tag, active, onClick, isCollapsed }: { tag: string, active?: boolean, onClick?: () => void, isCollapsed?: boolean }) {
    const { isOver, setNodeRef } = useDroppable({
        id: tag,
    });

    const style = {
        transform: isOver ? 'scale(1.05)' : undefined,
        boxShadow: isOver ? '0 0 10px rgba(99, 102, 241, 0.5)' : undefined,
    };

    return (
        <div ref={setNodeRef} style={style} className={`transition-all duration-200 rounded-xl ${isOver ? 'ring-2 ring-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20' : ''}`}>
            <SideBarItem 
                text={`#${tag}`} 
                icon={
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                } 
                active={active} 
                onClick={onClick} 
                isCollapsed={isCollapsed} 
            />
        </div>
    );
}
