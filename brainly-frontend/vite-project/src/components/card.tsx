import { useState } from "react";
import { NoteViewerModal } from "./NoteViewerModal";
import ReactMarkdown from 'react-markdown';
import { useDraggable } from '@dnd-kit/core';

interface CardProps{
    type: "youtube" | "twitter" | "document" | "link" | "note";
    link: string;
    title: string;
    tags?: string[];
    isPinned?: boolean;
    isTrashed?: boolean;
    onDelete?: () => void;
    onEdit?: () => void;
    onTogglePin?: () => void;
    onRestore?: () => void;
    onPermanentDelete?: () => void;
    previewDescription?: string;
    content?: string;
    summary?: string;
    extractedText?: string;
    layout?: "grid" | "list";
    _id?: string;
    previewImage?: string;
}

export function Card({_id, type,link,title,tags, isPinned, isTrashed, previewImage, previewDescription, content, summary, layout = "grid", onDelete, onEdit, onTogglePin, onRestore, onPermanentDelete}:CardProps){
    const [isNoteOpen, setIsNoteOpen] = useState(false);
    const {attributes, listeners, setNodeRef, isDragging} = useDraggable({
        id: _id || title,
        disabled: isTrashed, // disable drag for trashed items
    });

    const style = {
        opacity: isDragging ? 0.3 : 1,
    };

    if (layout === "list") {
        return (
            <div 
                ref={setNodeRef}
                style={style}
                className={`flex w-full p-4 bg-white dark:bg-gray-900 rounded-lg border transition-all items-center gap-4 ${isPinned && !isTrashed ? 'border-yellow-400 shadow-sm order-first ring-1 ring-yellow-400' : 'border-gray-200 dark:border-gray-800 hover:shadow-sm'} ${isTrashed ? 'opacity-80' : ''} ${isDragging ? 'shadow-xl scale-[1.02]' : ''}`}
            >
                {/* Drag Handle */}
                <div {...listeners} {...attributes} style={{ touchAction: 'none' }} className="cursor-grab hover:text-indigo-500 text-gray-300 dark:text-gray-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" /></svg>
                </div>
                {/* Icon Badge */}
                <span className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-xl text-lg font-bold bg-accent-500/10 text-accent-600 border border-transparent">
                    {type === "youtube" && <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>}
                    {type === "twitter" && <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>}
                    {type === "document" && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>}
                    {type === "link" && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>}
                    {type === "note" && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>}
                </span>
                
                {/* Title & Link */}
                <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{title}</h3>
                        {isPinned && !isTrashed && <span className="text-yellow-500"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg></span>}
                    </div>
                    {link && <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{link}</p>}
                </div>

                {/* Tags */}
                <div className="flex gap-1.5 flex-wrap flex-1 max-w-xs">
                    {tags && tags.slice(0, 3).map(tag => (
                        <span key={tag} className="bg-purple-100 text-purple-600 text-xs px-2 py-0.5 rounded-full font-medium">#{tag}</span>
                    ))}
                    {tags && tags.length > 3 && <span className="text-xs text-gray-500">+{tags.length - 3}</span>}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                    {!isTrashed ? (
                        <>
                            {onTogglePin && <button onClick={onTogglePin} className={`p-1.5 rounded-lg transition-all duration-200 cursor-pointer ${isPinned ? 'text-yellow-500 hover:text-yellow-600 bg-yellow-50 hover:bg-yellow-100' : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'}`} title={isPinned ? "Unpin" : "Pin"}><svg xmlns="http://www.w3.org/2000/svg" fill={isPinned ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.536a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg></button>}
                            <a href={link} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-gray-400 hover:text-accent-500 hover:bg-accent-50 transition-all duration-200" title="Open link"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg></a>
                            {onEdit && <button onClick={onEdit} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200 cursor-pointer" title="Edit"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg></button>}
                            {onDelete && <button onClick={onDelete} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 cursor-pointer" title="Delete"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg></button>}
                        </>
                    ) : (
                        <>
                            {onRestore && <button onClick={onRestore} className="p-1.5 rounded-lg text-green-600 hover:bg-green-50" title="Restore"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg></button>}
                            {onPermanentDelete && <button onClick={onPermanentDelete} className="p-1.5 rounded-lg text-red-600 hover:bg-red-50" title="Delete Permanently"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg></button>}
                        </>
                    )}
                </div>
                
                <NoteViewerModal 
                    open={isNoteOpen} 
                    onClose={() => setIsNoteOpen(false)} 
                    title={title} 
                    content={content || summary || ""} 
                />
            </div>
        );
    }

    return <div ref={setNodeRef} style={style} className={`flex flex-col ${isPinned && !isTrashed ? 'order-first' : ''} ${isTrashed ? 'opacity-80' : ''} ${isDragging ? 'opacity-30' : ''}`}>
        <div className={`p-4 bg-white dark:bg-gray-900 rounded-md border min-w-[300px] max-w-[340px] relative transition-shadow ${isPinned && !isTrashed ? 'border-yellow-400 shadow-md shadow-yellow-100 dark:shadow-none ring-1 ring-yellow-400' : 'border-gray-200 dark:border-gray-800 hover:shadow-sm'}`}>
            {/* Drag Handle */}
            <div {...listeners} {...attributes} style={{ touchAction: 'none' }} className="absolute top-1.5 left-1/2 -translate-x-1/2 cursor-grab hover:text-indigo-500 text-gray-300 dark:text-gray-600 transition-colors z-20 bg-white/80 dark:bg-gray-900/80 rounded-sm px-2 py-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" /></svg>
            </div>

            {isPinned && !isTrashed && (
                <div className="absolute -top-3 -right-3 bg-yellow-400 text-white p-1.5 rounded-full shadow-sm z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                </div>
            )}
            <div className="flex justify-between mb-4">
                 <div className="flex items-center text-md gap-3 min-w-0 flex-1">
                    {/* refined badge using accent color */}
                    <span className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold bg-accent-500/10 text-accent-600 border border-transparent">
                        {type === "youtube" && (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                        )}
                        {type === "twitter" && (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        )}
                        {type === "document" && (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                        )}
                        {type === "link" && (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>
                        )}
                        {type === "note" && (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                        )}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">{title}</h3>
                 </div>
                 <div className="flex items-center gap-1 ml-2 text-gray-500">
                    {!isTrashed ? (
                        <>
                            {/* Pin button */}
                            {onTogglePin && <button onClick={onTogglePin} className={`p-1.5 rounded-lg transition-all duration-200 cursor-pointer ${isPinned ? 'text-yellow-500 hover:text-yellow-600 bg-yellow-50 hover:bg-yellow-100' : 'text-gray-500 hover:text-yellow-500 hover:bg-yellow-50'}`} title={isPinned ? "Unpin" : "Pin"}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill={isPinned ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.536a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                </svg>
                            </button>}
                            <a href={link} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-text-muted hover:text-accent-400 hover:bg-accent-600/10 transition-all duration-200" title="Open link">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                            </a>
                            {/* edit button */}
                            {onEdit && <button onClick={onEdit} className="p-1.5 rounded-lg text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200 cursor-pointer" title="Edit">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                            </button>}
                            {/* delete button */}
                            {onDelete && <button onClick={onDelete} className="p-1.5 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all duration-200 cursor-pointer" title="Delete">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                            </button>}
                        </>
                    ) : (
                        <>
                            {/* Restore button */}
                            {onRestore && <button onClick={onRestore} className="p-1.5 rounded-lg text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 transition-all duration-200 cursor-pointer" title="Restore">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg>
                            </button>}
                            {/* Permanent Delete button */}
                            {onPermanentDelete && <button onClick={onPermanentDelete} className="p-1.5 rounded-lg text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-200 cursor-pointer" title="Delete Permanently">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                            </button>}
                        </>
                    )}
                 </div>
            </div>
        <div className="pt-4">
           {type === "youtube" && (
  <iframe 
    className="w-full aspect-video" 
    src={
      link.includes("youtu.be") 
        ? link.replace("youtu.be/", "www.youtube.com/embed/") 
        : link.includes("shorts")
        ? link.replace("shorts/", "embed/")
        : link.replace("watch", "embed").replace("?v=", "/")
    } 
    title={title || "YouTube video player"} 
    frameBorder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
    referrerPolicy="strict-origin-when-cross-origin" 
    allowFullScreen
  ></iframe>
)}

           {type === "twitter" &&
           <div className="p-3">
           <blockquote className="twitter-tweet" data-theme="light">
            <a href={link.replace("x.com","twitter.com")}></a></blockquote>
           </div> }
           {type === "document" && (
             <div className="mt-2 h-[240px] border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900 flex items-center justify-center relative group">
                 {/* This iframe will automatically render PDFs in the browser */}
                 <iframe 
                    src={link} 
                    className="w-full h-full"
                    title={title || "Document"}
                 ></iframe>
                 
                 {/* A fallback/overlay to allow clicking to open in full screen */}
                 <a href={link} target="_blank" rel="noopener noreferrer" className="absolute top-2 right-2 p-2 bg-white/90 dark:bg-gray-900/90 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity text-gray-700 dark:text-gray-300 hover:text-accent-600 dark:hover:text-accent-500" title="Open full screen">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                 </a>
             </div>
           )}
           {type === "link" && (
             <div className="flex flex-col rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900 shadow-sm hover:shadow transition-shadow">
                {previewImage && (
                   <div className="w-full h-32 overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <img src={previewImage} alt={title || "Link preview"} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                   </div>
                )}
                <div className="p-4 flex flex-col gap-2">
                   {previewDescription && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{previewDescription}</p>
                   )}
                   <p className="text-xs text-gray-400 dark:text-gray-500 break-all line-clamp-1">{link}</p>
                   <a href={link} target="_blank" rel="noopener noreferrer" className="text-accent-600 dark:text-accent-500 text-sm font-medium hover:underline inline-flex items-center gap-1 mt-1">
                       Visit Resource
                       <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                   </a>
                </div>
             </div>
           )}
           {type === "note" && (
             <div className="flex flex-col rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900 shadow-sm hover:shadow transition-shadow p-4 gap-3">
                <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 prose dark:prose-invert max-w-none">
                    <ReactMarkdown>{content || "*No content*"}</ReactMarkdown>
                </div>
                <button onClick={() => setIsNoteOpen(true)} className="text-accent-600 dark:text-accent-500 text-sm font-medium hover:underline inline-flex items-center gap-1 self-start">
                    Read Note
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg>
                </button>
             </div>
           )}
           {type !== "note" && (content || summary) && (
             <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 prose dark:prose-invert max-w-none mb-2">
                    <ReactMarkdown>{content || summary || ""}</ReactMarkdown>
                </div>
                <button onClick={() => setIsNoteOpen(true)} className="text-accent-600 dark:text-accent-500 text-xs font-medium hover:underline inline-flex items-center gap-1 self-start">
                    Read Full Note
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg>
                </button>
             </div>
           )}
        </div>
            <div className="flex gap-2 flex-wrap mb-4">
                {tags && tags.length > 0 ? (
                    tags.map(tag => (
                        <span key={tag} className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full font-medium">#{tag}</span>
                    ))
                ) : (
                    <span className="text-xs text-gray-400 italic">No tags</span>
                )}
            </div>
            <div className="text-xs text-gray-500 mt-4">
                Added on 08/03/2024
            </div>
        
        </div>
        
        <NoteViewerModal 
            open={isNoteOpen} 
            onClose={() => setIsNoteOpen(false)} 
            title={title} 
            content={content || summary || ""} 
        />
    </div>
}