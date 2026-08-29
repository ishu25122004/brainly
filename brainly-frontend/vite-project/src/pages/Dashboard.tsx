import { Button } from '../components/button'
import { Card } from '../components/card'
import { CreateContentModel } from '../components/CreateContentModel'
import { EditContentModal } from '../components/EditContentModal'
import { PlusIcon } from '../icons/plusicon'
import { ShareIcon } from '../icons/shareicon'
import { useState } from "react"
import { Sidebar } from '../components/sidebar'
import { useContent } from "../hooks/useContent"
import { ShareModal } from '../components/ShareModal'
import { CommandPalette } from '../components/CommandPalette'
import { ChatBot } from '../components/ChatBot'
import { DndContext, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'

export function Dashboard() {
  const [modelOpen, setModelOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [layoutView, setLayoutView] = useState<"grid" | "list">("grid");
  const [cmdOpen, setCmdOpen] = useState(false);
  
  const { contents, refresh, deleteContent, togglePin, restoreContent, permanentDeleteContent, appendTag } = useContent();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragId(null);
    const { active, over } = event;
    if (over && over.id && active.id) {
      appendTag(active.id as string, over.id as string);
    }
  };

  const allTags = Array.from(new Set(contents.flatMap(item => item.tags || []))).sort();
  const availableTypes = Array.from(new Set(contents.filter(item => !item.isTrashed).map(item => item.type))).sort();

  const filteredContents = contents.filter(item => {
    // 0. Trash filter logic
    if (activeFilter === "trash") {
      // If we are in the trash view, ONLY show trashed items
      if (!item.isTrashed) return false;
    } else {
      // If we are NOT in the trash view, HIDE trashed items
      if (item.isTrashed) return false;
    }

    // 1. Type Filter (unless it's "all", "tags", or "trash")
    if (activeFilter !== "all" && activeFilter !== "tags" && activeFilter !== "trash") {
      if (item.type !== activeFilter) return false;
    }
    
    // 2. Tags Filter (if activeFilter is "tags" and a specific tag is selected)
    if (activeFilter === "tags" && selectedTag) {
       if (!item.tags || !item.tags.includes(selectedTag)) return false;
    }

    // 3. Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchLink = item.link?.toLowerCase().includes(q);
      const matchTags = item.tags?.some((t: string) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchLink && !matchTags) return false;
    }

    return true;
  });

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex w-full">
        <Sidebar 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter}
          selectedTag={selectedTag}
          onTagSelect={setSelectedTag}
          availableTypes={availableTypes}
          availableTags={allTags}
          isCollapsed={isSidebarCollapsed}
          onCollapseChange={setIsSidebarCollapsed}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content Wrapper - Everything else must stay INSIDE this div */}
        <div className={`flex-1 min-h-screen bg-gray-50 dark:bg-gray-950 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-72'} ml-0`}>

          <CreateContentModel
            open={modelOpen}
            onClose={() => setModelOpen(false)}
            onContentAdded={refresh}
          />

          <ShareModal
            open={shareModalOpen}
            onClose={() => setShareModalOpen(false)}
          />

          <EditContentModal
            open={editModalOpen}
            onClose={() => {
              setEditModalOpen(false);
              setEditingContent(null);
            }}
            onContentEdited={refresh}
            initialData={editingContent}
          />
          
          <CommandPalette open={cmdOpen} setOpen={setCmdOpen} contents={contents} />

          {/* Header section */}
          <div className="sticky top-0 bg-gray-50 dark:bg-gray-950 z-10 px-4 md:px-10 pt-4 md:pt-10 pb-4 flex justify-between items-center mb-4 border-b border-gray-100/0 transition-colors">
            <div className="flex items-center gap-3">
              <button 
                className="md:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white mb-0 md:mb-1">
                {activeFilter === 'tags' ? 'Browse by Tags' : 
                 activeFilter === 'all' ? 'All Notes' : 
                 activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}
              </h1>
            </div>
            <div className="flex gap-3 items-center">
              
              {/* Search Bar */}
              <div className="relative hidden sm:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <button
                  onClick={() => setCmdOpen(true)}
                  className="pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm transition-all w-48 lg:w-64 shadow-sm text-gray-500 dark:text-gray-400 text-left hover:bg-gray-50 dark:hover:bg-gray-800 flex justify-between items-center"
                >
                  Search...
                  <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">⌘K</kbd>
                </button>
              </div>

              {/* Layout Toggles */}
              <div className="hidden md:flex bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-1 shadow-sm">
                 <button 
                    onClick={() => setLayoutView("grid")}
                    className={`p-1.5 rounded-md transition-colors ${layoutView === "grid" ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400" : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                    title="Grid View"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                 </button>
                 <button 
                    onClick={() => setLayoutView("list")}
                    className={`p-1.5 rounded-md transition-colors ${layoutView === "list" ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400" : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                    title="List View"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
                 </button>
              </div>

              <Button onClick={() => setShareModalOpen(true)} startIcon={<ShareIcon size={"md"} />} size="md" variant="secondary" text="Share Brain" />
              <Button onClick={() => setModelOpen(true)} startIcon={<PlusIcon size={"md"} />} size="md" variant="primary" text="Add Content" />
            </div>
          </div>
          
          {/* Tags View Filter Pills */}
          {activeFilter === "tags" && allTags.length > 0 && (
             <div className="px-4 md:px-10 pb-6 flex gap-2 flex-wrap">
                <button 
                  onClick={() => setSelectedTag(null)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border shadow-sm ${!selectedTag ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-200 dark:shadow-none' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  All Tags
                </button>
                {allTags.map(tag => (
                  <button 
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border shadow-sm ${selectedTag === tag ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-200 dark:shadow-none' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  >
                    #{tag}
                  </button>
                ))}
             </div>
          )}

          {/* Card Grid Section - Moved INSIDE the main wrapper */}
          <div className="px-4 md:px-10 pb-10">

            {/* Empty state */}
            {filteredContents.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <p className="text-gray-400 dark:text-gray-500 text-sm">
                  {searchQuery 
                    ? "No content matches your search query." 
                    : (activeFilter === "tags" && selectedTag) 
                      ? "No content matches this tag." 
                      : "No content yet. Click \"Add Content\" to get started!"}
                </p>
              </div>
            )}

            {/* Cards */}
            <div className={`flex gap-6 ${layoutView === 'grid' ? 'flex-wrap' : 'flex-col max-w-5xl'}`}>
              {filteredContents
                .sort((a, b) => {
                  // Sort pinned items first
                  if (a.isPinned && !b.isPinned) return -1;
                  if (!a.isPinned && b.isPinned) return 1;
                  return 0; // Maintain existing order for same pin status
                })
                .map(({ _id, type, link, title, tags, isPinned, isTrashed, previewImage, previewDescription, content, summary, extractedText }) => (
                <Card
                  key={_id}
                  _id={_id}
                  type={type}
                  link={link}
                  title={title}
                  tags={tags}
                  isPinned={isPinned}
                  isTrashed={isTrashed}
                  previewImage={previewImage}
                  previewDescription={previewDescription}
                  content={content}
                  summary={summary}
                  extractedText={extractedText}
                  layout={layoutView}
                  onTogglePin={() => togglePin(_id, !!isPinned)}
                  onDelete={() => deleteContent(_id)}
                  onRestore={() => restoreContent(_id)}
                  onPermanentDelete={() => permanentDeleteContent(_id)}
                  onEdit={() => {
                     setEditingContent({ _id, type, link, title, content });
                     setEditModalOpen(true);
                  }}
                />
              ))}
            </div>

          </div>
        </div>
      </div>
      
      <ChatBot />

      <DragOverlay dropAnimation={null}>
        {activeDragId ? (() => {
          const cardData = contents.find(c => c._id === activeDragId);
          if (!cardData) return null;
          return <Card
              {...cardData}
              layout={layoutView}
            />;
        })() : null}
      </DragOverlay>
    </DndContext>
  );
}