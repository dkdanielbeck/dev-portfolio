import { useState, useEffect } from 'react';
import type { Tool } from '../types';
import { supabase } from '../lib/supabase';

// Helper to convert snake_case DB format to our frontend Tool interface
function mapToolFromDB(row: any): Tool {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    url: row.url,
    imageUrl: row.image_url,
    addedBy: row.added_by
  };
}

export function useTools() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initial fetch
  useEffect(() => {
    async function fetchTools() {
      setIsLoading(true);
      // Return safely and provide empty state if env variables aren't injected yet
      if (!import.meta.env.VITE_SUPABASE_URL) {
        console.warn("Supabase URL missing; running in local-only fallback mode without syncing.");
        setIsLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tools from Supabase:', error);
      } else if (data) {
        setTools(data.map(mapToolFromDB));
      }
      setIsLoading(false);
    }
    fetchTools();
  }, []);

  const addTool = async (tool: Omit<Tool, 'id'>) => {
    // Generate a temporary ID for an immediate optimistic UI update
    const tempId = crypto.randomUUID();
    const newTool: Tool = { ...tool, id: tempId };
    
    setTools((prev) => [newTool, ...prev]);

    // Sync to Supabase in the background
    if (import.meta.env.VITE_SUPABASE_URL) {
      const { data, error } = await supabase
        .from('tools')
        .insert([{
          name: tool.name,
          description: tool.description,
          url: tool.url,
          image_url: tool.imageUrl || null,
          added_by: tool.addedBy || null
        }])
        .select()
        .single();
        
       if (error) {
         console.error('Failed to add tool to database:', error);
         // Optionally remove the optimistic item from state on failure
       } else if (data) {
         // Replace the temporary UUID with the generated UUID from PostgreSQL
         setTools((prev) => prev.map(t => t.id === tempId ? mapToolFromDB(data) : t));
       }
    }
  };

  const removeTool = async (id: string) => {
    // Optimistic UI Removal
    const previousTools = [...tools];
    setTools((prev) => prev.filter((t) => t.id !== id));

    if (import.meta.env.VITE_SUPABASE_URL) {
      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error('Failed to delete tool from database:', error);
        setTools(previousTools); // Revert the UI since delete failed
      }
    }
  };

  const updateTool = async (id: string, updatedTool: Omit<Tool, 'id'>) => {
    // Optimistic UI Update
    const previousTools = [...tools];
    setTools((prev) => prev.map(t => t.id === id ? { ...updatedTool, id } : t));

    if (import.meta.env.VITE_SUPABASE_URL) {
      const { error } = await supabase
        .from('tools')
        .update({
          name: updatedTool.name,
          description: updatedTool.description,
          url: updatedTool.url,
          image_url: updatedTool.imageUrl || null,
          added_by: updatedTool.addedBy || null
        })
        .eq('id', id);
        
      if (error) {
        console.error('Failed to update tool in database:', error);
        setTools(previousTools); // Revert the UI since update failed
      }
    }
  };

  return { tools, addTool, removeTool, updateTool, isLoading };
}
