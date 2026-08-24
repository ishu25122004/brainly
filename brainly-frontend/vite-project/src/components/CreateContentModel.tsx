//in this we have ton do a ui chalange in which when the component popup , so it popup on above of all existing ui and all become black or something else
import {Input} from "./Input"
import {CrossIcon} from "../icons/CrossIcon"
import {Button} from "../components/button"
import {useRef} from "react"
import {useState} from "react"
import axios from "axios"
import {BACKEND_URL} from "../config"
import MDEditor from '@uiw/react-md-editor';
import { useTheme } from "../hooks/useTheme";

enum ContentType{
   Youtube = "youtube",
   Twitter = "twitter",
   Document = "document",
   Link = "link",
   Note = "note"
}

interface CreateContentModelProps {
    open: boolean;
    onClose: () => void;
    onContentAdded: () => void;
}

//controlled component
export function CreateContentModel({open,onClose,onContentAdded}: CreateContentModelProps){
   const { theme } = useTheme();
   const titleRef = useRef<HTMLInputElement>(null);
   const linkRef = useRef<HTMLInputElement>(null);
   const [type,setType] = useState(ContentType.Youtube);
   const [loading, setLoading] = useState(false); //added for loading state
   const [file, setFile] = useState<File | null>(null);
   const [content, setContent] = useState<string | undefined>("");

   async function addContent(){
         const title = titleRef.current?.value;
         let link = linkRef.current?.value || "";

         if(!title) return; //added basic validation
         if (type !== ContentType.Document && type !== ContentType.Note && !link) return;
         if (type === ContentType.Document && !file) return;
         if (type === ContentType.Note && (!content || content.trim() === "")) return;

         setLoading(true); //added
        try {
             if (type === ContentType.Document && file) {
                 const formData = new FormData();
                 formData.append("file", file);
                 const uploadRes = await axios.post(`${BACKEND_URL}/api/v1/upload`, formData, {
                     headers: {
                         "Authorization": localStorage.getItem("token")
                     }
                 });
                 link = uploadRes.data.link;
             }

             // 1. Send data to backend
             await axios.post(`${BACKEND_URL}/api/v1/content`, {
                link,
                title,
                type,
                content: content || undefined
             }, {
                headers: {
                   "Authorization": localStorage.getItem("token")
                }
             });
             
             // 2. Clear the inputs so they are empty next time you open the popup
             if (titleRef.current) titleRef.current.value = "";
             if (linkRef.current) linkRef.current.value = "";
             setType(ContentType.Youtube);
             setFile(null);
             setContent("");

             // 3. Trigger the refresh function to update the dashboard instantly
             if (onContentAdded) {
                 onContentAdded();
             }

             // 4. Close the popup
             onClose();

         } catch (error) {
             console.error("Error adding content", error);
         } finally {
             setLoading(false); //added
         }
   }

     if(!open) return null; //added - cleaner than wrapping in conditional

     return<div>
            {/* backdrop */}
            <div className="fixed inset-0 bg-slate-500/50 dark:bg-slate-900/80 z-40" onClick={onClose}></div>
            
            {/*this can run the model on the top*/}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
               <div className={`w-full ${type === ContentType.Note ? 'max-w-4xl' : 'max-w-lg'} bg-white dark:bg-gray-900 rounded-xl shadow-lg animate-in fade-in zoom-in duration-200 border border-transparent dark:border-gray-800 transition-all`}>
                      {/* Modal Header */}
                      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                         <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Content</h2>
                         <div onClick={onClose} className="cursor-pointer p-1 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                              <CrossIcon/>
                         </div>   
                      </div>
                      
                      {/* Modal Body */}
                      <div className="px-6 py-4 space-y-4">
                         <Input ref={titleRef} placeholder={"Enter a title..."} label="Title"/>
                         {type === ContentType.Document && (
                             <div className="flex flex-col gap-1.5">
                                 <label className="text-sm font-medium text-gray-700 dark:text-gray-300 pl-1">Document File</label>
                                 <input 
                                     type="file" 
                                     accept=".pdf,.doc,.docx"
                                     onChange={(e) => setFile(e.target.files?.[0] || null)}
                                     className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent-50 dark:file:bg-accent-900/30 file:text-accent-700 dark:file:text-accent-400 hover:file:bg-accent-100 dark:hover:file:bg-accent-900/50" 
                                 />
                             </div>
                         )}
                         {type !== ContentType.Document && type !== ContentType.Note && (
                             <Input ref={linkRef} placeholder={"Paste your link here..."} label="Link"/>
                         )}
                         <div className="flex flex-col gap-1.5" data-color-mode={theme}>
                             <label className="text-sm font-medium text-gray-700 dark:text-gray-300 pl-1">{type === ContentType.Note ? "Note Content" : "Notes (Optional)"}</label>
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
                      
                      {/* Modal Footer */}
                      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl flex justify-end gap-2 border-t border-gray-100 dark:border-gray-800">
                           <Button onClick={onClose} variant="ghost" text="Cancel" size="md" />
                           <Button onClick={addContent} variant="primary" text="Add Content" size="md" loading={loading} />
                      </div>
                     
               </div>  
            </div>
                     
          </div>
}

