import type { Tool } from '../types';

interface ToolCardProps {
  tool: Tool;
  onRemove?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function ToolCard({ tool, onRemove, onEdit }: ToolCardProps) {
  const openUrl = () => {
    window.open(tool.url, '_blank', 'noopener,noreferrer');
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(tool.id);
    }
  };

  const getDomain = () => {
    try {
      return new URL(tool.url).hostname;
    } catch {
      return '';
    }
  };
  const domain = getDomain();

  return (
    <div 
      onClick={openUrl}
      className="group relative flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:border-primary-hover transition-all duration-300 cursor-pointer shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
    >
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all focus-within:opacity-100 z-10">
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(tool.id);
            }}
            className="p-2 rounded-full bg-background/80 hover:bg-primary/90 text-gray-400 hover:text-white transition-all backdrop-blur-sm"
            title="Edit tool"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
          </button>
        )}

        {onRemove && (
          <button
            onClick={handleRemove}
            className="p-2 rounded-full bg-background/80 hover:bg-red-500/90 text-gray-400 hover:text-white transition-all backdrop-blur-sm"
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
          {domain && (
            <img 
              src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`} 
              alt="" 
              className="w-6 h-6 rounded flex-shrink-0 bg-white/10" 
              loading="lazy"
            />
          )}
          <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors truncate">
            {tool.name}
          </h3>
        </div>
        <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed flex-grow">
          {tool.description}
        </p>

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
