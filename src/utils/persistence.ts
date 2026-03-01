import { supabase } from "@/lib/supabase";

export interface Project {
    id: string;
    title: string;
    desc: string;
    tags: string[];
    github_url?: string;
    live_url?: string;
}

export interface Handles {
    email: string;
    github: string;
    discord: string;
    twitter: string;
    linkedin: string;
    location: string;
    clearance: string;
    neuralCores: string;
    uptime: string;
    frequency: string;
    protocol: string;
    encryption: string;
    cv_url?: string;
    custom_signals?: Record<string, string>;
}

export interface Message {
    id: string;
    time?: string;
    created_at?: string;
    sender_name: string;
    sender_email: string;
    subject: string;
    content: string;
}

export const persistence = {
    getProjects: async (): Promise<Project[]> => {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching projects:", error);
            return [];
        }
        return data || [];
    },
    saveProjects: async (projects: Project[]) => {
        const { error } = await supabase
            .from('projects')
            .upsert(projects);

        if (error) console.error("Error saving projects:", error);
    },
    updateProject: async (project: Project) => {
        const { error } = await supabase
            .from('projects')
            .update(project)
            .eq('id', project.id);
        if (error) console.error("Error updating project:", error);
    },
    createProject: async (project: Project) => {
        const { error } = await supabase
            .from('projects')
            .insert([project]);
        if (error) console.error("Error creating project:", error);
    },
    deleteProject: async (id: string) => {
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);
        if (error) console.error("Error deleting project:", error);
    },

    getHandles: async (): Promise<Handles | null> => {
        const { data, error } = await supabase
            .from('handles')
            .select('*')
            .single();

        if (error) {
            console.error("Error fetching handles:", error);
            return null;
        }
        return data;
    },
    saveHandles: async (handles: Handles) => {
        const { error } = await supabase
            .from('handles')
            .upsert({
                ...handles,
                id: 1,
                custom_signals: handles.custom_signals || {}
            });

        if (error) console.error("Error saving handles:", error);
    },

    getMessages: async (): Promise<Message[]> => {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching messages:", error);
            return [];
        }
        return data || [];
    },
    addMessage: async (message: Omit<Message, "id" | "time" | "created_at">) => {
        const { error } = await supabase
            .from('messages')
            .insert([{
                sender_name: message.sender_name,
                sender_email: message.sender_email,
                subject: message.subject,
                content: message.content,
                created_at: new Date().toISOString()
            }]);

        if (error) console.error("Error adding message:", error);
    },
    deleteMessage: async (id: string) => {
        const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', id);
        if (error) console.error("Error deleting message:", error);
    },
    clearMessages: async () => {
        const { error } = await supabase
            .from('messages')
            .delete()
            .neq('id', '0'); // Change to string '0' to be safe or use a real condition
        if (error) console.error("Error clearing messages:", error);
    },

    subscribeToMessages: (callback: (payload: any) => void) => {
        return supabase
            .channel('public:messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, callback)
            .subscribe();
    },

    getViewerCount: async (): Promise<number> => {
        const { data, error } = await supabase
            .from('site_stats')
            .select('viewer_count')
            .eq('id', 'global')
            .single();

        if (error) {
            console.error("Error fetching viewer count:", error);
            return 0;
        }
        return data?.viewer_count || 0;
    },
    incrementViewerCount: async () => {
        // We use a simple RPC call if we had one, or a direct increment if we can
        // For now, let's fetch and update (simplest anon-level way without RPC)
        const current = await persistence.getViewerCount();
        const { error } = await supabase
            .from('site_stats')
            .update({ viewer_count: current + 1 })
            .eq('id', 'global');

        if (error) console.error("Error incrementing viewer count:", error);
    },
    getAdminKey: async (): Promise<string> => {
        const { data, error } = await supabase
            .from('site_stats')
            .select('admin_key')
            .eq('id', 'global')
            .single();

        if (error) {
            console.error("Error fetching admin key:", error);
            return "alien-admin"; // Fallback to default
        }
        return data?.admin_key || "alien-admin";
    },
    updateAdminKey: async (newKey: string) => {
        const { error } = await supabase
            .from('site_stats')
            .update({ admin_key: newKey })
            .eq('id', 'global');
        if (error) console.error("Error updating admin key:", error);
    },
    subscribeToStats: (callback: (payload: any) => void) => {
        return supabase
            .channel('public:site_stats')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'site_stats' }, callback)
            .subscribe();
    },

    uploadCV: async (file: File) => {
        const fileExt = file.name.split('.').pop();
        const timestamp = new Date().getTime();
        const fileName = `specimen_resume_${timestamp}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload to 'resumes' bucket
        const { error: uploadError } = await supabase.storage
            .from('resumes')
            .upload(filePath, file, {
                upsert: true
            });

        if (uploadError) {
            console.error("Error uploading CV:", uploadError);
            throw uploadError;
        }

        // Get public URL and save it to handles table
        const { data: urlData } = supabase.storage
            .from('resumes')
            .getPublicUrl(filePath);

        const publicUrl = urlData?.publicUrl;
        if (!publicUrl) throw new Error("Failed to generate public URL for uploaded CV.");

        const currentHandles = await persistence.getHandles();
        const handlesToSave = currentHandles
            ? { ...currentHandles, cv_url: publicUrl }
            : {
                email: "", github: "", discord: "", twitter: "", linkedin: "",
                location: "", clearance: "LEVEL-1", neuralCores: "1-NODE",
                uptime: "100%", frequency: "1GHz", protocol: "X-0",
                encryption: "NONE", cv_url: publicUrl
            } as Handles;

        await persistence.saveHandles(handlesToSave);

        return publicUrl;
    },

    getCVUrl: async () => {
        const handles = await persistence.getHandles();
        return handles?.cv_url || null;
    },

    deleteCV: async () => {
        const currentHandles = await persistence.getHandles();
        if (!currentHandles?.cv_url) return;

        // Try deleting the actual file from the bucket (extract filename from URL)
        try {
            const urlParts = currentHandles.cv_url.split('/');
            const fileName = urlParts[urlParts.length - 1];
            if (fileName) {
                await supabase.storage.from('resumes').remove([fileName]);
            }
        } catch (e) {
            console.error("Failed to delete file from storage:", e);
        }

        // Just clear the DB URL
        const updatedHandles = { ...currentHandles, cv_url: null };
        await persistence.saveHandles(updatedHandles);
    }
};
