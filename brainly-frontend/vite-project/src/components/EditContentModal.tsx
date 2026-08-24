import {CrossIcon} from "../icons/CrossIcon"
import {Button} from "../components/button"
import {useEffect, useState} from "react"
import axios from "axios"
import {BACKEND_URL} from "../config"
import { useTheme } from "../hooks/useTheme";
import MDEditor from '@uiw/react-md-editor';

enum ContentType {
   Youtube = "youtube",
   Twitter = "twitter",
   Document = "document",
   Link = "link",
   Note = "note"
}

interface EditContentModalProps {
    open: boolean;
    onClose: () => void;
    onContentEdited: () => void;
    initialData: {
       _id: string;
       title: string;
       link: string;
       type: string;
       content?: string;
    } | null;
}

export function EditContentModal({open, onClose, onContentEdited, initialData}: EditContentModalProps){
   const { theme } = useTheme();
   const [title, setTitle] = useState("");
   const [link, setLink] = useState("");
   const [content, setContent] = useState<string | undefined>("");
   const [type, setType] = useState<ContentType>(ContentType.Youtube);
   const [loading, setLoading] = useState(false); 

   /* eslint-disable */
   useEffect(() => {
       if (initialData) {
           setTitle(initialData.title || "");
           setLink(initialData.link || "");
           setContent(initialData.content || "");
           // @ts-expect-error
           setType(initialData.type || ContentType.Youtube);
       }
   }, [initialData]);
   /* eslint-enable */

   async function editContent(){
         if(!title) return; 
         if (type !== ContentType.Document && type !== ContentType.Note && !link) return;
         if (type === ContentType.Note && (!content || content.trim() === "")) return;

         setLoading(true);
        try {
             await axios.put(`${BACKEND_URL}/api/v1/content`, {
                contentId: initialData?._id,
                link,
                title,
                type,
                content: content || undefined
             }, {
                headers: {
                   "Authorization": localStorage.getItem("token")
                }
             });
             
             if (onContentEdited) {
                 onContentEdited();
             }

             onClose();
         } catch (error) {
             console.error("Error editing content", error);
         } finally {
             setLoading(false);
         }
   }

     if(!open || !initialData) return null;

     return<div>
            <div className="fixed inset-0 bg-slate-500/50 dark:bg-slate-900/80 z-40" onClick={onClose}></div>
            
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
               <div className={`w-full ${type === ContentType.Note ? 'max-w-4xl' : 'max-w-lg'} bg-white dark:bg-gray-900 rounded-xl shadow-lg animate-in fade-in zoom-in duration-200 border border-transparent dark:border-gray-800 transition-all`}>
                      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                         <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Content</h2>
                         <div onClick={onClose} className="cursor-pointer p-1 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                              <CrossIcon/>
                         </div>   
                      </div>
                      
                      <div className="px-6 py-4 space-y-4">
                         <div className="flex flex-col gap-1.5">
                             <label className="text-sm font-medium text-gray-700 dark:text-gray-300 pl-1">Title</label>
                             <input 
                               type="text" 
                               value={title}
                               onChange={(e) => setTitle(e.target.value)}
                               placeholder="Enter a title..."
                               className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-gray-300" 
                             />
                         </div>

                         {type !== ContentType.Document && type !== ContentType.Note && (
                             <div className="flex flex-col gap-1.5">
                                 <label className="text-sm font-medium text-gray-700 dark:text-gray-300 pl-1">Link</label>
                                 <input 
                                   type="text" 
                                   value={link}
                                   onChange={(e) => setLink(e.target.value)}
                                   placeholder="Paste your link here..."
                                   className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-gray-300" 
                                 />
                             </div>
                         )}
                         <div className="flex flex-col gap-1.5" data-color-mode={theme}>
                             <label className="text-sm font-medium text-gray-700 dark:text-gray-300 pl-1">{type === ContentType.Note ? "Note Content" : "Notes / Description"}</label>
                             <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                 <MDEditor
                                     value={content}
                                     onChange={setContent}
                                     height={type === ContentType.Note ? 300 : 150}
                                     preview="live"
                                     className="w-full"
                                 />
                             </div>
                         </div>
                         {type === ContentType.Document && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic pl-1">Document file URL is read-only. Delete and re-upload to change the file.</p>
                         )}
                      
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 pl-1">Content Type</label>
                            <div className="grid grid-cols-3 gap-2">
                                <button type="button" onClick={() => setType(ContentType.Youtube)}
                                    className={`py-2 px-4 rounded-md text-sm font-medium transition-colors border
                                        ${type === ContentType.Youtube 
                                            ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800" 
                                            : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"}`}>
                                    Youtube
                                </button>
                                <button type="button" onClick={() => setType(ContentType.Twitter)}
                                    className={`py-2 px-4 rounded-md text-sm font-medium transition-colors border
                                        ${type === ContentType.Twitter 
                                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800" 
                                            : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"}`}>
                                    Twitter
                                </button>
                                <button type="button" onClick={() => setType(ContentType.Document)}
                                    className={`py-2 px-4 rounded-md text-sm font-medium transition-colors border
                                        ${type === ContentType.Document 
                                            ? "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800" 
                                            : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"}`}>
                                    Document
                                </button>
                                <button type="button" onClick={() => setType(ContentType.Link)}
                                    className={`py-2 px-4 rounded-md text-sm font-medium transition-colors border
                                        ${type === ContentType.Link 
                                            ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800" 
                                            : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"}`}>
                                    Link
                                </button>
                                <button type="button" onClick={() => setType(ContentType.Note)}
                                    className={`py-2 px-4 rounded-md text-sm font-medium transition-colors border
                                        ${type === ContentType.Note 
                                            ? "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800" 
                                            : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"}`}>
                                    Note
                                </button>
                             </div>
                         </div>
                      </div>
                      
                      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl flex justify-end gap-2 border-t border-gray-100 dark:border-gray-800">
                           <Button onClick={onClose} variant="ghost" text="Cancel" size="md" />
                           <Button onClick={editContent} variant="primary" text="Save Changes" size="md" loading={loading} />
                      </div>
                     
               </div>  
            </div>
                     
          </div>
}

