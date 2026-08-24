import { CrossIcon } from "../icons/CrossIcon";
import MDEditor from '@uiw/react-md-editor';
import { useTheme } from "../hooks/useTheme";

interface NoteViewerModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    content: string;
}

export function NoteViewerModal({ open, onClose, title, content }: NoteViewerModalProps) {
    const { theme } = useTheme();
    
    if (!open) return null;

    return (
        <div>
            <div className="fixed inset-0 bg-slate-500/50 dark:bg-slate-900/80 z-40" onClick={onClose}></div>
            
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 lg:p-12">
                <div className="w-full max-w-4xl h-full max-h-full flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-2xl animate-in fade-in zoom-in duration-200 border border-transparent dark:border-gray-800">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">{title}</h2>
                        <div onClick={onClose} className="cursor-pointer p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <CrossIcon />
                        </div>   
                    </div>
                    
                    {/* Body - Scrollable */}
                    <div className="flex-1 overflow-y-auto px-6 py-6" data-color-mode={theme}>
                        <MDEditor.Markdown source={content} className="p-4 rounded-lg !bg-transparent" />
                    </div>
                </div>
            </div>
        </div>
    );
}
