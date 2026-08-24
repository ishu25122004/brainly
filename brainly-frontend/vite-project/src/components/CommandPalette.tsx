import { Command } from 'cmdk';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CommandPaletteProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    contents: any[];
}

export function CommandPalette({ open, setOpen, contents }: CommandPaletteProps) {
    const navigate = useNavigate();

    // Toggle the menu when ⌘K is pressed
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen(true);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, [setOpen]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] sm:pt-[20vh] px-4 backdrop-blur-sm bg-slate-900/40" onClick={() => setOpen(false)}>
            <div 
                className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <Command className="w-full flex flex-col bg-transparent" label="Global Command Menu">
                    <div className="flex items-center px-4 py-3 border-b border-gray-100 dark:border-gray-800" cmdk-input-wrapper="">
                        <svg className="w-5 h-5 text-gray-400 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <Command.Input 
                            autoFocus
                            placeholder="Type a command or search your brain..." 
                            className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder:text-gray-400 text-lg w-full"
                        />
                        <button onClick={() => setOpen(false)} className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md ml-3 border border-gray-200 dark:border-gray-700">ESC</button>
                    </div>

                    <Command.List className="max-h-[300px] overflow-y-auto p-2 custom-scrollbar">
                        <Command.Empty className="py-6 text-center text-sm text-gray-500">
                            No results found.
                        </Command.Empty>

                        <Command.Group heading="Content" className="px-2 text-xs font-semibold text-gray-500 py-2">
                            {contents.map((item) => (
                                <Command.Item 
                                    key={item._id}
                                    onSelect={() => {
                                        if (item.link) window.open(item.link, "_blank");
                                        setOpen(false);
                                    }}
                                    className="flex items-center gap-3 px-3 py-3 text-sm text-gray-700 dark:text-gray-300 rounded-xl aria-selected:bg-indigo-50 dark:aria-selected:bg-indigo-500/20 aria-selected:text-indigo-600 dark:aria-selected:text-indigo-400 cursor-pointer transition-colors"
                                >
                                    <div className="w-6 h-6 shrink-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md text-gray-500">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                                    </div>
                                    <div className="flex-1 truncate font-medium">
                                        {item.title || item.link}
                                    </div>
                                    <div className="shrink-0 text-xs text-gray-400 capitalize">
                                        {item.type}
                                    </div>
                                </Command.Item>
                            ))}
                        </Command.Group>
                    </Command.List>
                </Command>
            </div>
        </div>
    );
}
