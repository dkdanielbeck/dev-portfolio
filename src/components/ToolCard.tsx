import { useState, useEffect } from 'react';
import type { Tool } from '../types';

interface ToolCardProps {
  tool: Tool;
  onRemove?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function ToolCard({ tool, onRemove, onEdit }: ToolCardProps) {
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    if (!tool.url) {
      setIconUrl(null);
      return;
    }

    let isMounted = true;

    // We query the microlink JSON API asynchronously to strictly check if a real logo exists.
    // If it doesn't, we receive null and naturally cascade to our beautiful CSS UI Chip!
    fetch(`https://api.microlink.io/?url=${encodeURIComponent(tool.url)}`)
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        if (data.status === 'success' && data.data?.logo?.url) {
          setIconUrl(data.data.logo.url);
        } else {
          setIconUrl(null);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setIconUrl(null);
      });

    return () => {
      isMounted = false;
    };
  }, [tool.url]);

  const openUrl = () => {
    if (!isConfirmingDelete) {
      window.open(tool.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConfirmingDelete(true);
  };

  const confirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(tool.id);
    }
  };

  const cancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConfirmingDelete(false);
  };

  return (
    <div 
      onClick={openUrl}
      className={`group relative flex flex-col bg-card border rounded-2xl overflow-hidden transition-all duration-300 shadow-lg ${
        isConfirmingDelete 
          ? 'border-red-500/50 shadow-red-500/10' 
          : 'border-border hover:border-primary-hover hover:shadow-primary/10 hover:-translate-y-1 cursor-pointer'
      }`}
    >
      {/* Delete Confirmation Overlay */}
      {isConfirmingDelete && (
        <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-foreground mb-1">Delete Project?</h4>
          <p className="text-sm text-gray-400 mb-6">This action cannot be undone.</p>
          <div className="flex gap-3 w-full">
            <button 
              onClick={cancelDelete}
              className="flex-1 px-4 py-2 rounded-xl bg-card border border-border text-foreground hover:bg-border/50 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button 
              onClick={confirmDelete}
              className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors text-sm font-medium shadow-lg shadow-red-500/20"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all focus-within:opacity-100 z-10">
        {onEdit && !isConfirmingDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(tool.id);
            }}
            className="p-2 rounded-full bg-background/80 hover:bg-primary/90 text-gray-400 hover:text-white transition-all backdrop-blur-sm shadow-sm"
            title="Edit tool"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
          </button>
        )}

        {onRemove && !isConfirmingDelete && (
          <button
            onClick={handleRemoveClick}
            className="p-2 rounded-full bg-background/80 hover:bg-red-500/90 text-gray-400 hover:text-white transition-all backdrop-blur-sm shadow-sm"
            title="Remove tool"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
          </button>
        )}
      </div>
      <div className="aspect-[16/9] w-full overflow-hidden bg-background relative border-b border-border">
        {tool.imageUrl ? (
          <img 
            src={tool.imageUrl} 
            alt={tool.name}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-border text-4xl font-light">
            {tool.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
      
      <div className="p-5 flex flex-col flex-grow relative">
        <div className="flex items-center gap-3 mb-2">
          {iconUrl ? (
            <div className="w-6 h-6 rounded flex-shrink-0 bg-white/10 flex items-center justify-center overflow-hidden">
              <img 
                src={iconUrl} 
                alt="" 
                className="w-full h-full object-contain" 
                loading="lazy"
                onError={() => {
                  setIconUrl(null);
                }}
              />
            </div>
          ) : (
            <div className="w-6 h-6 rounded flex-shrink-0 bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20">
              <span className="text-[10px] font-bold text-primary uppercase">{tool.name.charAt(0)}</span>
            </div>
          )}
          <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors truncate">
            {tool.name}
          </h3>
        </div>
        <div className="relative group/tooltip flex-grow mt-1">
          <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed pr-6 cursor-help">
            {tool.description}
          </p>
          
          {/* Tooltip Indicator */}
          {tool.description.length > 85 && (
            <div className="absolute top-0 right-0 text-gray-500 opacity-40 group-hover/tooltip:opacity-100 group-hover/tooltip:text-primary transition-all duration-200 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
            </div>
          )}

          {/* Custom Styled Tooltip */}
          {tool.description.length > 85 && (
            <div className="absolute left-0 bottom-full mb-2 w-full opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 z-50 pointer-events-none translate-y-2 group-hover/tooltip:translate-y-0">
              <div className="bg-card/95 backdrop-blur-md border border-border shadow-xl rounded-xl p-4 text-sm text-foreground relative shadow-primary/5">
                <p className="leading-relaxed max-h-[150px] overflow-y-auto">{tool.description}</p>
                <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-card border-b border-r border-border transform rotate-45"></div>
              </div>
            </div>
          )}
        </div>

        {tool.addedBy && (
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span className="truncate">Added by {tool.addedBy}</span>
          </div>
        )}
      </div>
    </div>
  );
}
