import { useState } from 'react';
import type { Tool } from '../types';

interface AddToolFormProps {
  onSubmit: (tool: Omit<Tool, 'id'>) => void;
  onCancel: () => void;
  initialTool?: Tool | null;
}

export function AddToolForm({ onSubmit, onCancel, initialTool }: AddToolFormProps) {
  const [name, setName] = useState(initialTool?.name || '');
  const [description, setDescription] = useState(initialTool?.description || '');
  const [url, setUrl] = useState(initialTool?.url || '');
  const [addedBy, setAddedBy] = useState(initialTool?.addedBy || '');
  const [imageUrl, setImageUrl] = useState(initialTool?.imageUrl || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let finalImageUrl = imageUrl.trim();

    if (imageFile) {
      finalImageUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(imageFile);
      });
    } else if (!finalImageUrl && url.trim()) {
      // Automatically generate screenshot if image URL is blank
      finalImageUrl = `https://api.microlink.io/?url=${encodeURIComponent(url.trim())}&screenshot=true&meta=false&embed=screenshot.url`;
    }

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      url: url.trim(),
      imageUrl: finalImageUrl,
      ...(addedBy.trim() ? { addedBy: addedBy.trim() } : {}),
    });

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-medium text-foreground/90">Tool Name</label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-foreground/50"
          placeholder="e.g. Regex Tester"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="description" className="text-sm font-medium text-foreground/90">Description</label>
        <textarea
          id="description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-foreground/50 resize-none"
          placeholder="Briefly describe what this tool does..."
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="url" className="text-sm font-medium text-foreground/90">Project URL</label>
        <input
          id="url"
          type="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-foreground/50"
          placeholder="https://..."
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="addedBy" className="text-sm font-medium text-foreground/90">
          Added By <span className="text-gray-500 font-normal">(Optional)</span>
        </label>
        <input
          id="addedBy"
          type="text"
          value={addedBy}
          onChange={(e) => setAddedBy(e.target.value)}
          className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-foreground/50"
          placeholder="Your Name"
        />
      </div>

      <div className="space-y-3 pt-2">
        <div>
          <label className="text-sm font-medium text-foreground/90">
            Image <span className="text-gray-500 font-normal">(Optional)</span>
          </label>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            Provide an image URL, upload a file, or leave both blank and we will <b>automatically capture a screenshot of the site/tool for you.</b>
          </p>
        </div>

        <div className="space-y-3 bg-card-hover/30 p-4 rounded-xl border border-border/50 hidden">
          {/* Fallback container to maintain spacing */}
        </div>

        <div className="space-y-3 p-4 rounded-xl border border-border bg-background/50">
          <input
            id="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              if (e.target.value) setImageFile(null);
            }}
            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-foreground/50"
            placeholder="Image URL"
            disabled={!!imageFile}
            title={imageFile ? "Clear the file selection below to use a URL" : ""}
          />

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-[1px] w-8 bg-border"></div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">OR</span>
              <div className="h-[1px] w-8 bg-border"></div>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImageFile(file);
                  setImageUrl('');
                } else {
                  setImageFile(null);
                }
              }}
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-medium file:bg-primary/20 file:text-primary hover:file:bg-primary/30 file:rounded-lg cursor-pointer transition-all focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-background/80 rounded-lg transition-colors border border-transparent hover:border-border disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-hover focus:ring-4 focus:ring-primary/20 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            initialTool ? 'Save Changes' : 'Add Tool'
          )}
        </button>
      </div>
    </form>
  );
}
