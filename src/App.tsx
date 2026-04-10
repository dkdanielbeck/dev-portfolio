import { useState } from 'react';
import { useTools } from './hooks/useTools';
import { ToolCard } from './components/ToolCard';
import { Modal } from './components/Modal';
import { AddToolForm } from './components/AddToolForm';

function App() {
  const { tools, addTool, removeTool, updateTool, isLoading } = useTools();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingToolId, setEditingToolId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setEditingToolId(null), 200);
  };

  const editingTool = editingToolId ? tools.find(t => t.id === editingToolId) : null;

  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))]">
      <header className="glass-header sticky top-0 z-40 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white m-0">IBM FutureNow Center</h1>
              <p className="text-xs text-primary font-medium uppercase tracking-wider">Developer tool arsenal</p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="group relative inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white transition-all bg-primary border border-transparent rounded-full hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:rotate-90 duration-300">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Tool
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 mb-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Your Tool Arsenal</h2>
            <p className="mt-4 text-lg text-gray-400">
              A collection of developer tools and utilities created by you and your colleagues. Add your own by clicking the 'Add tool' button.
            </p>
          </div>
          
          {tools.length > 0 && (
            <div className="relative w-full lg:w-80">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-10 py-3 border border-border rounded-xl leading-5 bg-card/50 text-gray-200 placeholder-gray-500 focus:outline-none focus:bg-card focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all sm:text-sm"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-card/10 rounded-2xl border border-transparent">
            <svg className="animate-spin h-10 w-10 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-400 font-medium">Fetching tools...</p>
          </div>
        ) : tools.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl bg-card/50">
            <h3 className="mt-2 text-lg font-semibold text-white">No tools added</h3>
            <p className="mt-1 text-sm text-gray-400">Get started by creating a new tool.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-6 inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              Add Tool
            </button>
          </div>
        ) : filteredTools.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-border rounded-2xl bg-card/50">
            <div className="mx-auto h-12 w-12 text-gray-600 mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">No matching tools</h3>
            <p className="mt-2 text-sm text-gray-400">We couldn't find anything matching "{searchQuery}".</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-6 text-primary hover:text-primary-hover text-sm font-medium transition-colors"
            >
              Clear search query
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onRemove={removeTool}
                onEdit={(id) => {
                  setEditingToolId(id);
                  setIsModalOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingToolId ? "Edit Tool" : "Add New Tool"}
      >
        {isModalOpen && (
          <AddToolForm
            initialTool={editingTool}
            onSubmit={(tool) => {
              if (editingToolId) {
                updateTool(editingToolId, tool);
              } else {
                addTool(tool);
              }
              handleCloseModal();
            }}
            onCancel={handleCloseModal}
          />
        )}
      </Modal>
    </div>
  );
}

export default App;
