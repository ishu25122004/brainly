import axios from "axios"
import { useEffect, useState } from "react"
import { BACKEND_URL } from "../config"

//added - type definition for content items
interface ContentItem {
    _id: string;
    title: string;
    link: string;
    type: "youtube" | "twitter" | "document" | "link" | "note";
    userId: { _id: string; username: string } | string;
    tags: string[];
    isPinned?: boolean;
    isTrashed?: boolean;
    previewImage?: string;
    previewDescription?: string;
    content?: string;
    summary?: string;
    extractedText?: string;
}

export function useContent() {
    const [contents, setContents] = useState<ContentItem[]>([]);

    // 1. Move the fetch logic into its own function
    const refresh = () => {
        axios.get(`${BACKEND_URL}/api/v1/content`, {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        }).then((response) => {
            setContents(response.data.content);
        })
    }

    // added - delete content function that calls DELETE /api/v1/content
    const deleteContent = async (contentId: string) => {
        try {
            await axios.delete(`${BACKEND_URL}/api/v1/content`, {
                data: { contentId },
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            });
            // Optimistic update to soft-delete
            setContents((prev) => prev.map((item) => 
                item._id === contentId ? { ...item, isTrashed: true } : item
            ));
        } catch (error) {
            console.error("Error moving content to trash:", error);
        }
    }

    const restoreContent = async (contentId: string) => {
        try {
            await axios.post(`${BACKEND_URL}/api/v1/content/restore`, { contentId }, {
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            });
            // Optimistic update
            setContents((prev) => prev.map((item) => 
                item._id === contentId ? { ...item, isTrashed: false } : item
            ));
        } catch (error) {
            console.error("Error restoring content:", error);
        }
    }

    const permanentDeleteContent = async (contentId: string) => {
        try {
            await axios.delete(`${BACKEND_URL}/api/v1/content/permanent`, {
                data: { contentId },
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            });
            // Optimistic removal
            setContents((prev) => prev.filter((item) => item._id !== contentId));
        } catch (error) {
            console.error("Error permanently deleting content:", error);
        }
    }

    const togglePin = async (contentId: string, currentPinStatus: boolean) => {
        try {
            const newPinStatus = !currentPinStatus;
            
            // Optimistic update
            setContents((prev) => prev.map((item) => 
                item._id === contentId ? { ...item, isPinned: newPinStatus } : item
            ));

            await axios.put(`${BACKEND_URL}/api/v1/content`, {
                contentId,
                isPinned: newPinStatus
            }, {
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            });
        } catch (error) {
            console.error("Error toggling pin:", error);
            // Revert on error
            refresh();
        }
    }

    const appendTag = async (contentId: string, newTag: string) => {
        try {
            // Optimistic update
            let currentTags: string[] = [];
            setContents((prev) => prev.map((item) => {
                if (item._id === contentId) {
                    currentTags = Array.from(new Set([...(item.tags || []), newTag]));
                    return { ...item, tags: currentTags };
                }
                return item;
            }));

            // Only make API call if we found tags
            if (currentTags.length > 0) {
                await axios.put(`${BACKEND_URL}/api/v1/content`, {
                    contentId,
                    tags: currentTags
                }, {
                    headers: {
                        "Authorization": localStorage.getItem("token")
                    }
                });
            }
        } catch (error) {
            console.error("Error appending tag:", error);
            refresh(); // Revert on error
        }
    }

    // 2. Call refresh when the component first loads
    useEffect(() => {
        refresh();
    }, [])

    // 3. Return BOTH the contents and the refresh function (and deleteContent)
    return { contents, refresh, deleteContent, restoreContent, permanentDeleteContent, togglePin, appendTag }; 
}