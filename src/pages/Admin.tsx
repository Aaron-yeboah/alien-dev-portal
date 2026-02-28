import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3, FolderOpen, Terminal, Activity,
  RefreshCw, Trash2, Plus, Inbox, Radio, Settings, ChevronRight, X,
  Save, Edit2, Undo2, Check, Upload, FileText, AlertTriangle, LogOut, Eye
} from "lucide-react";
import BinaryRain from "@/components/BinaryRain";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";
import { persistence, Project, Handles, Message } from "@/utils/persistence";

const Admin = () => {
  const [activeTab, setActiveTab] = useState<"system" | "inventory" | "signals" | "config" | "transmissions">("system");
  const [systemIntensity, setSystemIntensity] = useState(50);
  const [isRebooting, setIsRebooting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [showSessionWarning, setShowSessionWarning] = useState(false);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(60);

  const SESSION_DURATION = 10 * 60 * 1000; // 10 minutes
  const WARNING_TIME = 9 * 60 * 1000; // 9 minutes

  const [projects, setProjects] = useState<Project[]>([]);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState<Project>({
    id: "",
    title: "",
    desc: "",
    tags: [],
    github_url: "",
    live_url: ""
  });

  const [handles, setHandles] = useState<Handles | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [viewerCount, setViewerCount] = useState(0);
  const [activity, setActivity] = useState([
    { time: "2m ago", event: "New visitor from SECTOR-9" },
    { time: "15m ago", event: "System health check — ALL CLEAR" },
  ]);

  const [isUploadingCV, setIsUploadingCV] = useState(false);
  const [cvUrl, setCvUrl] = useState<string | null>(null);

  // Check session persistence on mount
  useEffect(() => {
    const isAuth = sessionStorage.getItem("admin_authenticated");
    const startTime = sessionStorage.getItem("admin_session_start");

    if (isAuth === "true" && startTime) {
      const elapsed = Date.now() - parseInt(startTime);
      if (elapsed < SESSION_DURATION) {
        setIsAuthenticated(true);
      } else {
        sessionStorage.removeItem("admin_authenticated");
        sessionStorage.removeItem("admin_session_start");
      }
    }

    // Auto-logout on unmount (navigation away)
    return () => {
      // Small delay to check if we're actually navigating or just reloading
      setTimeout(() => {
        if (window.location.pathname !== "/admin") {
          sessionStorage.removeItem("admin_authenticated");
          sessionStorage.removeItem("admin_session_start");
        }
      }, 100);
    };
  }, []);

  // Session Monitor Effect
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      const startTime = sessionStorage.getItem("admin_session_start");
      if (!startTime) return;

      const elapsed = Date.now() - parseInt(startTime);

      // Warning at 9 minutes
      if (elapsed >= WARNING_TIME && elapsed < SESSION_DURATION) {
        setShowSessionWarning(true);
        setSessionTimeLeft(Math.ceil((SESSION_DURATION - elapsed) / 1000));
      } else if (elapsed >= SESSION_DURATION) {
        handleLogout();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Load persistence data
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadData = async () => {
      const [projData, handleData, msgData, viewData, cvData] = await Promise.all([
        persistence.getProjects(),
        persistence.getHandles(),
        persistence.getMessages(),
        persistence.getViewerCount(),
        persistence.getCVUrl()
      ]);
      setProjects(projData);
      setHandles(handleData);
      setMessages(msgData);
      setViewerCount(viewData);
      setCvUrl(cvData || null);
    };

    loadData();

    // Subscribe to real-time messages
    const msgSub = persistence.subscribeToMessages((payload) => {
      if (payload.new) {
        setMessages(prev => [payload.new as Message, ...prev]);
        addLogEvent(`NEW SIGNAL: ${payload.new.sender_name || 'Unknown'}`);
      }
    });

    // Subscribe to real-time stats
    const statsSub = persistence.subscribeToStats((payload) => {
      if (payload.new && payload.new.viewer_count !== undefined) {
        setViewerCount(payload.new.viewer_count);
      }
    });

    return () => {
      msgSub.unsubscribe();
      statsSub.unsubscribe();
    };
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const correctKey = await persistence.getAdminKey();
    if (password === correctKey) {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_authenticated", "true");
      sessionStorage.setItem("admin_session_start", Date.now().toString());
      setLoginError(false);
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 2000);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowSessionWarning(false);
    sessionStorage.removeItem("admin_authenticated");
    sessionStorage.removeItem("admin_session_start");
    addLogEvent("SESSION TERMINATED");
  };

  const extendSession = () => {
    sessionStorage.setItem("admin_session_start", Date.now().toString());
    setShowSessionWarning(false);
    addLogEvent("SESSION EXTENDED");
  };

  // Sync with persistence
  const handleUpdateProject = async (project: Project) => {
    setProjects(projects.map(p => p.id === project.id ? project : p));
    await persistence.updateProject(project);
    setEditingProjectId(null);
    addLogEvent(`SPECIMEN UPDATED: ${project.title}`);
  };

  const handleCreateProject = async () => {
    const projectToCreate = {
      ...newProject,
      id: Math.random().toString(36).substring(2, 9),
      title: newProject.title || "NEW SPECIMEN"
    };
    await persistence.createProject(projectToCreate);
    setProjects(prev => [projectToCreate, ...prev]);
    setIsAddingProject(false);
    setNewProject({ id: "", title: "", desc: "", tags: [], github_url: "", live_url: "" });
    addLogEvent(`NEW SPECIMEN CATALOGUED: ${projectToCreate.title}`);
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this specimen from the archive?")) return;
    const project = projects.find(p => p.id === id);
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    await persistence.deleteProject(id);
    addLogEvent(`SPECIMEN REMOVED: ${project?.title || id}`);
  };

  const updateHandle = async (key: keyof Handles, value: string) => {
    if (!handles) return;
    const updated = { ...handles, [key]: value };
    setHandles(updated);
    await persistence.saveHandles(updated);
  };

  const updateCustomSignal = async (label: string, value: string) => {
    if (!handles) return;
    const custom = { ...(handles.custom_signals || {}), [label]: value };
    const updated = { ...handles, custom_signals: custom };
    setHandles(updated);
    await persistence.saveHandles(updated);
  };

  const addCustomSignal = async (label: string, value: string) => {
    if (!handles) return;
    if (!label.trim()) return;
    const custom = { ...(handles.custom_signals || {}), [label.toUpperCase()]: value };
    const updated = { ...handles, custom_signals: custom };
    setHandles(updated);
    await persistence.saveHandles(updated);
    addLogEvent(`NEW SIGNAL PROTOCOL: ${label.toUpperCase()}`);
  };

  const removeCustomSignal = async (label: string) => {
    if (!handles || !handles.custom_signals) return;
    const custom = { ...handles.custom_signals };
    delete custom[label];
    const updated = { ...handles, custom_signals: custom };
    setHandles(updated);
    await persistence.saveHandles(updated);
    addLogEvent(`SIGNAL DECOMMISSIONED: ${label}`);
  };

  const addLogEvent = (event: string) => {
    setActivity(prev => [{ time: "Just now", event }, ...prev.slice(0, 4)]);
  };

  const handleReboot = () => {
    setIsRebooting(true);
    setTimeout(() => setIsRebooting(false), 2000);
    addLogEvent("SYSTEM REBOOT INITIATED");
  };

  const clearMessages = async () => {
    if (!confirm("Clear all incoming signals?")) return;
    await persistence.clearMessages();
    setMessages([]);
    addLogEvent("INBOX PURGED");
  };

  const deleteMessage = async (id: string) => {
    await persistence.deleteMessage(id);
    setMessages(prev => prev.filter(m => m.id !== id));
    addLogEvent("SIGNAL REMOVED");
  };

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCV(true);
    try {
      await persistence.uploadCV(file);
      const url = await persistence.getCVUrl();
      setCvUrl(url || null);
      addLogEvent(`CV UPLOADED: ${file.name}`);
      alert("Specimen resume updated successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to upload CV. Check permissions.");
    } finally {
      setIsUploadingCV(false);
    }
  };

  const getSystemStatus = () => {
    if (systemIntensity > 85) return { label: "CRITICAL OVERLOAD", color: "text-destructive" };
    if (systemIntensity > 65) return { label: "OVERCLOCKED", color: "text-accent" };
    return { label: "STABLE", color: "text-primary" };
  };

  const status = getSystemStatus();

  if (!isAuthenticated) {
    return (
      <PageTransition>
        <BinaryRain intensity={20} />
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <BackButton />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center max-w-md w-full"
          >
            {/* Alien Image with Glow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="relative mb-[-2rem] z-10"
            >
              <div
                className="absolute inset-0 rounded-full blur-3xl opacity-30"
                style={{
                  background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
                  transform: "scale(0.7) translateY(10%)",
                }}
              />
              <motion.img
                src="/admin-alien.png"
                alt="Admin Alien"
                className="w-56 h-56 md:w-64 md:h-64 object-contain relative z-10 drop-shadow-[0_0_30px_rgba(74,222,128,0.3)]"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            {/* Auth Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="glass-panel p-8 w-full neon-border relative overflow-hidden"
            >
              {/* Subtle scanline effect */}
              <div className="absolute inset-0 scanline pointer-events-none opacity-30" />

              <div className="relative z-10">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Terminal className="w-5 h-5 text-primary" />
                  <h1 className="font-display text-lg neon-text tracking-[0.3em] uppercase">Admin Auth</h1>
                  <Terminal className="w-5 h-5 text-primary" />
                </div>
                <p className="text-[9px] font-mono text-primary/40 text-center mb-6 tracking-widest uppercase">
                  Secure clearance required to proceed
                </p>

                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-primary/60 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      Access Key
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full bg-black/50 border ${loginError ? 'border-destructive animate-pulse' : 'border-primary/20'} p-3.5 text-sm text-foreground focus:border-primary focus:bg-primary/5 outline-none transition-all font-mono rounded-sm`}
                      placeholder="Enter clearance code..."
                    />
                  </div>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full glass-panel p-4 text-[10px] font-mono text-primary hover:neon-text transition-all bg-primary/5 border-primary/30 hover:border-primary/60 hover:bg-primary/10 flex items-center justify-center gap-2 tracking-widest"
                  >
                    VERIFY CLEARANCE <ChevronRight className="w-3 h-3" />
                  </motion.button>
                  <AnimatePresence>
                    {loginError && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-[9px] text-destructive font-mono text-center animate-pulse tracking-wider"
                      >
                        &gt; ACCESS DENIED: INVALID CLEARANCE CODE
                      </motion.p>
                    )}
                  </AnimatePresence>
                </form>

                <div className="mt-6 flex items-center justify-center gap-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/20" />
                  <span className="text-[8px] font-mono text-primary/30 tracking-[0.4em] uppercase">Encrypted</span>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/20" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <BinaryRain intensity={systemIntensity} />
      <div className="relative z-10 min-h-screen px-4 py-16 md:py-24 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        <BackButton />

        {/* Main Control Area */}
        <div className="flex-1 min-w-0">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <Terminal className="w-6 h-6 text-primary" />
              <h1 className="font-display text-xl md:text-2xl neon-text tracking-widest uppercase">
                Mission Control
              </h1>
              <div className="ml-auto flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded glass-panel border border-primary/30 bg-primary/5">
                  <Eye className="w-4 h-4 text-primary animate-pulse" />
                  <span className="font-display text-lg neon-text">{viewerCount}</span>
                  <span className="text-[8px] font-mono text-primary/50 uppercase tracking-widest">Observers</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-[9px] font-mono text-destructive/60 hover:text-destructive border border-destructive/20 hover:border-destructive/40 hover:bg-destructive/5 transition-all"
                >
                  <LogOut className="w-3 h-3" /> DISCONNECT
                </button>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex gap-2 mt-6 border-b border-primary/20 pb-px overflow-x-auto no-scrollbar">
              {[
                { id: "system", icon: Settings, label: "SYSTEMS" },
                { id: "inventory", icon: FolderOpen, label: "INVENTORY" },
                { id: "signals", icon: Radio, label: "SIGNALS" },
                { id: "transmissions", icon: Inbox, label: "TRANSMISSIONS" },
                { id: "config", icon: Settings, label: "CONFIG" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 font-mono text-[10px] tracking-widest transition-all relative whitespace-nowrap ${activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-primary/70"
                    }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary neon-shadow" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {activeTab === "system" && (
              <motion.div
                key="system"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Core Control */}
                <div className="glass-panel neon-border p-6 scanline relative overflow-hidden">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-primary" />
                      <h2 className="font-display text-[10px] tracking-[0.3em] neon-text uppercase">Neural Core</h2>
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1 rounded bg-primary/10 border border-primary/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      <span className="text-[9px] font-mono text-primary uppercase tracking-widest">{viewerCount} OBSERVERS</span>
                    </div>
                  </div>
                  <div className="space-y-6 text-center">
                    <div>
                      <div className={`text-[10px] font-mono mb-2 transition-colors duration-500 uppercase ${status.color}`}>
                        &gt; {status.label}
                      </div>
                      <div className="font-display text-5xl neon-text mb-1">{systemIntensity}%</div>
                      <div className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest">Neural Load Factor</div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={systemIntensity}
                      onChange={(e) => setSystemIntensity(parseInt(e.target.value))}
                      className="w-full h-1 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <button
                      onClick={handleReboot}
                      disabled={isRebooting}
                      className="w-full glass-panel p-3 flex items-center justify-center gap-2 text-[10px] font-mono hover:neon-text transition-all disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3 h-3 ${isRebooting ? "animate-spin" : ""}`} />
                      INITIATE REBOOT
                    </button>
                  </div>
                </div>

                {/* Activity Feed */}
                <div className="glass-panel neon-border p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    <h2 className="font-display text-[10px] tracking-[0.3em] neon-text uppercase">Recent Archive Logs</h2>
                  </div>
                  <div className="space-y-3 font-mono h-48 overflow-y-auto no-scrollbar">
                    {activity.map((log, i) => (
                      <div key={i} className="flex gap-4 text-[10px]">
                        <span className="text-primary/40 uppercase w-16 shrink-0">{log.time}</span>
                        <span className="text-muted-foreground">&gt; {log.event}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "inventory" && (
              <motion.div
                key="inventory"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                {/* Header Actions */}
                <div className="flex justify-between items-center bg-primary/5 p-4 border border-primary/20 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Archive Index: {projects.length} Entries</span>
                    <div className="h-4 w-px bg-primary/20" />
                    <Activity className="w-3.5 h-3.5 text-primary/40 animate-pulse" />
                  </div>
                  {!isAddingProject && (
                    <button
                      onClick={() => setIsAddingProject(true)}
                      className="flex items-center gap-2 px-4 py-2 text-[10px] font-mono text-primary bg-primary/10 border border-primary/30 hover:bg-primary/20 hover:neon-text transition-all group"
                    >
                      <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
                      INITIATE_NEW_ENTRY
                    </button>
                  )}
                </div>

                {/* Add New Entry Form */}
                <AnimatePresence>
                  {isAddingProject && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="glass-panel p-6 border-2 border-primary/30 bg-primary/5 space-y-6 mb-8 relative">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-display text-xs neon-text uppercase tracking-[0.2em] flex items-center gap-2">
                            <Terminal className="w-4 h-4" /> New Specimen Protocol
                          </h3>
                          <button onClick={() => setIsAddingProject(false)} className="text-muted-foreground hover:text-destructive transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] text-primary/60 font-mono uppercase tracking-widest pl-1">Specimen Name</label>
                              <input
                                value={newProject.title}
                                onChange={(e) => setNewProject({ ...newProject, title: e.target.value.toUpperCase() })}
                                className="bg-black/40 border border-primary/20 p-3 font-display text-sm text-primary outline-none focus:border-primary transition-all"
                                placeholder="E.G. PROJECT_VOID"
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] text-primary/60 font-mono uppercase tracking-widest pl-1">Tools / Technologies</label>
                              <input
                                value={newProject.tags.join("; ")}
                                onChange={(e) => setNewProject({ ...newProject, tags: e.target.value.split(";").map(t => t.trim()).filter(t => t) })}
                                className="bg-black/40 border border-primary/20 p-3 font-mono text-[10px] text-primary outline-none focus:border-primary transition-all"
                                placeholder="React; TypeScript; Tailwind; Framer-Motion"
                              />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] text-primary/60 font-mono uppercase tracking-widest pl-1">GitHub Vector (Source)</label>
                              <input
                                value={newProject.github_url || ""}
                                onChange={(e) => setNewProject({ ...newProject, github_url: e.target.value })}
                                className="bg-black/40 border border-primary/20 p-3 font-mono text-[10px] text-foreground/80 outline-none focus:border-primary transition-all"
                                placeholder="https://github.com/..."
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] text-primary/60 font-mono uppercase tracking-widest pl-1">Live Matrix (Deployment)</label>
                              <input
                                value={newProject.live_url || ""}
                                onChange={(e) => setNewProject({ ...newProject, live_url: e.target.value })}
                                className="bg-black/40 border border-primary/20 p-3 font-mono text-[10px] text-foreground/80 outline-none focus:border-primary transition-all"
                                placeholder="https://..."
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] text-primary/60 font-mono uppercase tracking-widest pl-1">Analysis Description</label>
                          <textarea
                            value={newProject.desc}
                            onChange={(e) => setNewProject({ ...newProject, desc: e.target.value })}
                            className="bg-black/40 border border-primary/20 p-4 font-mono text-[11px] text-muted-foreground h-32 outline-none focus:border-primary transition-all resize-none"
                            placeholder="Provide detailed specimen analysis..."
                          />
                        </div>

                        <div className="flex gap-4 pt-2">
                          <button
                            onClick={handleCreateProject}
                            className="flex-1 bg-primary/20 border border-primary/50 p-4 font-display text-[11px] text-primary hover:bg-primary/30 hover:neon-text transition-all tracking-[0.3em] flex items-center justify-center gap-2"
                          >
                            <Save className="w-4 h-4" /> PROCEED_WITH_CATALOGING
                          </button>
                          <button
                            onClick={() => setIsAddingProject(false)}
                            className="px-8 border border-white/10 font-display text-[11px] text-muted-foreground hover:bg-white/5 transition-all tracking-[0.3em]"
                          >
                            ABORT
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Projects List */}
                <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 no-scrollbar pb-10">
                  {projects.map((project) => {
                    const isEditing = editingProjectId === project.id;
                    return (
                      <motion.div
                        key={project.id}
                        layout
                        className={`glass-panel border ${isEditing ? 'border-primary/50 bg-primary/5' : 'border-primary/10'} p-6 relative group transition-all duration-500`}
                      >
                        <AnimatePresence mode="wait">
                          {isEditing ? (
                            <motion.div
                              key="edit"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="space-y-6"
                            >
                              <div className="flex items-center justify-between mb-4 border-b border-primary/20 pb-4">
                                <h4 className="text-[10px] font-mono text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                  <Edit2 className="w-3.5 h-3.5" /> Editing Specimen: {project.id}
                                </h4>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleUpdateProject(project)}
                                    className="p-2 text-primary hover:neon-text transition-all flex items-center gap-2 border border-primary/30 bg-primary/10 px-4 rounded"
                                  >
                                    <Check className="w-4 h-4" /> <span className="text-[9px] font-mono">SAVE_CHANGES</span>
                                  </button>
                                  <button
                                    onClick={() => setEditingProjectId(null)}
                                    className="p-2 text-muted-foreground hover:text-foreground transition-all flex items-center gap-2 border border-white/10 px-4 rounded"
                                  >
                                    <Undo2 className="w-4 h-4" /> <span className="text-[9px] font-mono">CANCEL</span>
                                  </button>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div className="flex flex-col gap-1.5">
                                    <label className="text-[8px] text-primary/40 font-mono uppercase tracking-widest pl-1">Specimen Name</label>
                                    <input
                                      value={project.title}
                                      onChange={(e) => {
                                        const updated = projects.map(p => p.id === project.id ? { ...p, title: e.target.value.toUpperCase() } : p);
                                        setProjects(updated);
                                      }}
                                      className="bg-black/60 border border-primary/20 p-2.5 font-display text-xs text-primary outline-none focus:border-primary transition-all"
                                    />
                                  </div>
                                  <div className="flex flex-col gap-1.5">
                                    <label className="text-[8px] text-primary/40 font-mono uppercase tracking-widest pl-1">Tools / Technologies</label>
                                    <input
                                      value={project.tags.join("; ")}
                                      onChange={(e) => {
                                        const updated = projects.map(p => p.id === project.id ? { ...p, tags: e.target.value.split(";").map(t => t.trim()).filter(t => t) } : p);
                                        setProjects(updated);
                                      }}
                                      className="bg-black/60 border border-primary/20 p-2.5 font-mono text-[9px] text-primary outline-none focus:border-primary transition-all"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <div className="flex flex-col gap-1.5">
                                    <label className="text-[8px] text-primary/40 font-mono uppercase tracking-widest pl-1">GitHub Vector</label>
                                    <input
                                      value={project.github_url || ""}
                                      onChange={(e) => {
                                        const updated = projects.map(p => p.id === project.id ? { ...p, github_url: e.target.value } : p);
                                        setProjects(updated);
                                      }}
                                      className="bg-black/60 border border-primary/20 p-2.5 font-mono text-[9px] text-foreground outline-none focus:border-primary transition-all"
                                    />
                                  </div>
                                  <div className="flex flex-col gap-1.5">
                                    <label className="text-[8px] text-primary/40 font-mono uppercase tracking-widest pl-1">Live Matrix</label>
                                    <input
                                      value={project.live_url || ""}
                                      onChange={(e) => {
                                        const updated = projects.map(p => p.id === project.id ? { ...p, live_url: e.target.value } : p);
                                        setProjects(updated);
                                      }}
                                      className="bg-black/60 border border-primary/20 p-2.5 font-mono text-[9px] text-foreground outline-none focus:border-primary transition-all"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col gap-1.5">
                                <label className="text-[8px] text-primary/40 font-mono uppercase tracking-widest pl-1">Analysis Description</label>
                                <textarea
                                  value={project.desc}
                                  onChange={(e) => {
                                    const updated = projects.map(p => p.id === project.id ? { ...p, desc: e.target.value } : p);
                                    setProjects(updated);
                                  }}
                                  className="bg-black/60 border border-primary/20 p-3 font-mono text-[10px] text-muted-foreground h-24 outline-none focus:border-primary transition-all resize-none"
                                />
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="view"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex flex-col md:flex-row gap-6 items-start"
                            >
                              <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-3">
                                  <h3 className="font-display text-sm text-primary tracking-wider">{project.title}</h3>
                                  <div className="flex gap-2">
                                    {project.tags.slice(0, 3).map(tag => (
                                      <span key={tag} className="text-[8px] font-mono px-1.5 py-0.5 border border-primary/20 text-primary/60 bg-primary/5 uppercase">
                                        {tag}
                                      </span>
                                    ))}
                                    {project.tags.length > 3 && <span className="text-[8px] font-mono text-primary/40">+{project.tags.length - 3} MORE</span>}
                                  </div>
                                </div>
                                <p className="text-[10px] font-mono text-muted-foreground line-clamp-2 max-w-2xl italic">
                                  "{project.desc}"
                                </p>
                                <div className="flex gap-4 items-center">
                                  {project.github_url && <span className="text-[8px] font-mono text-primary/30 uppercase tracking-widest flex items-center gap-1"><Check className="w-2.5 h-2.5" /> Source_Linked</span>}
                                  {project.live_url && <span className="text-[8px] font-mono text-primary/30 uppercase tracking-widest flex items-center gap-1"><Check className="w-2.5 h-2.5" /> Deploy_Linked</span>}
                                </div>
                              </div>

                              <div className="flex md:flex-col gap-2 shrink-0 self-center">
                                <button
                                  onClick={() => setEditingProjectId(project.id)}
                                  className="p-2.5 text-primary/40 hover:text-primary hover:bg-primary/5 border border-primary/5 hover:border-primary/30 transition-all rounded group"
                                  title="Edit Specimen"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteProject(project.id)}
                                  className="p-2.5 text-destructive/40 hover:text-destructive hover:bg-destructive/5 border border-destructive/5 hover:border-destructive/30 transition-all rounded group"
                                  title="Purge Specimen"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeTab === "signals" && (
              <motion.div
                key="signals"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="glass-panel neon-border p-8"
              >
                <div className="flex items-center gap-2 mb-8">
                  <Radio className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-[10px] tracking-[0.3em] neon-text uppercase">Signal Broadcast Config</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 font-mono mb-12">
                  {handles && Object.entries(handles).map(([key, value]) => {
                    if (key === 'id' || key === 'custom_signals') return null;
                    return (
                      <div key={key} className="space-y-2 group">
                        <label className="text-[9px] text-primary/40 uppercase tracking-widest group-focus-within:text-primary transition-colors">
                          {key.replace(/([A-Z])/g, '_$1').replace(/^_+/, '').toUpperCase()}
                        </label>
                        <input
                          value={value || ""}
                          onChange={(e) => updateHandle(key as keyof Handles, e.target.value)}
                          className="w-full bg-black/40 border border-primary/10 p-3 text-xs text-foreground focus:border-primary focus:bg-primary/5 outline-none transition-all font-mono"
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="pt-8 border-t border-primary/10 space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Plus className="w-4 h-4 text-primary" />
                      <h3 className="font-display text-[10px] tracking-[0.2em] text-primary/60 uppercase">Add New Signal Protocol</h3>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4">
                    <input
                      id="new-signal-label"
                      placeholder="SIGNAL_LABEL..."
                      className="flex-1 bg-black/40 border border-primary/20 p-3 font-mono text-xs text-primary outline-none focus:border-primary transition-all uppercase"
                    />
                    <input
                      id="new-signal-value"
                      placeholder="SIGNAL_VALUE..."
                      className="flex-[2] bg-black/40 border border-primary/20 p-3 font-mono text-xs text-foreground outline-none focus:border-primary transition-all"
                    />
                    <button
                      onClick={() => {
                        const labelElem = document.getElementById("new-signal-label") as HTMLInputElement;
                        const valueElem = document.getElementById("new-signal-value") as HTMLInputElement;
                        if (labelElem.value && valueElem.value) {
                          addCustomSignal(labelElem.value, valueElem.value);
                          labelElem.value = "";
                          valueElem.value = "";
                        }
                      }}
                      className="px-8 border border-primary/40 text-[9px] font-mono text-primary hover:bg-primary/10 transition-all flex items-center justify-center gap-2"
                    >
                      <Save className="w-3 h-3" /> COMMENCE
                    </button>
                  </div>

                  {/* Custom Signals List */}
                  {handles?.custom_signals && Object.keys(handles.custom_signals).length > 0 && (
                    <div className="space-y-4 pt-4">
                      <h4 className="text-[8px] font-mono text-primary/30 uppercase tracking-[0.3em]">Active Custom Frequencies</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        {Object.entries(handles.custom_signals).map(([label, value]) => (
                          <div key={label} className="space-y-2 group relative">
                            <div className="flex justify-between items-center">
                              <label className="text-[9px] text-primary/40 uppercase tracking-widest">{label}</label>
                              <button
                                onClick={() => removeCustomSignal(label)}
                                className="text-destructive/40 hover:text-destructive transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                            <input
                              value={value}
                              onChange={(e) => updateCustomSignal(label, e.target.value)}
                              className="w-full bg-black/40 border border-primary/10 p-3 text-xs text-foreground focus:border-primary focus:bg-primary/5 outline-none transition-all font-mono"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "transmissions" && (
              <motion.div
                key="transmissions"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center bg-primary/5 p-4 border border-primary/20 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Incoming Signals: {messages.length}</span>
                    <div className="h-4 w-px bg-primary/20" />
                    <Activity className="w-3.5 h-3.5 text-primary/40 animate-pulse" />
                  </div>
                  <button
                    onClick={clearMessages}
                    className="flex items-center gap-2 px-4 py-2 text-[10px] font-mono text-primary bg-primary/10 border border-primary/30 hover:bg-primary/20 hover:neon-text transition-all group"
                  >
                    <X className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
                    PURGE_ALL_SIGNALS
                  </button>
                </div>

                <div className="max-h-[700px] overflow-y-auto pr-2 no-scrollbar pb-10">
                  <div className="grid grid-cols-1 gap-4">
                    <AnimatePresence initial={false}>
                      {messages.length === 0 ? (
                        <motion.div
                          key="no-messages"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="glass-panel p-20 text-center border-dashed border-primary/20"
                        >
                          <Radio className="w-12 h-12 text-primary/10 mx-auto mb-4 animate-pulse" />
                          <p className="font-mono text-[10px] text-primary/40 uppercase tracking-widest italic">
                            &gt; Silence in the void. No incoming transmissions detected.
                          </p>
                        </motion.div>
                      ) : (
                        messages.map((msg) => (
                          <motion.div
                            key={msg.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass-panel neon-border p-6 group hover:bg-primary/5 transition-all relative overflow-hidden"
                          >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="flex flex-col md:flex-row gap-6">
                              <div className="shrink-0 space-y-2 lg:w-48">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                  <span className="font-display text-[10px] text-primary tracking-widest uppercase truncate">{msg.sender_name}</span>
                                </div>
                                <p className="font-mono text-[9px] text-muted-foreground ml-4 italic truncate">{msg.sender_email}</p>
                                <div className="flex items-center gap-2 ml-4">
                                  <Terminal className="w-3 h-3 text-primary/30" />
                                  <span className="font-mono text-[8px] text-primary/40 uppercase">TIMESTAMP: {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'UNKNOWN'}</span>
                                </div>
                              </div>

                              <div className="flex-1 space-y-4">
                                <div className="pb-2 border-b border-primary/10">
                                  <span className="font-mono text-[9px] text-primary/40 uppercase tracking-[0.2em] block mb-1">Subject_Line_Transmission:</span>
                                  <span className="font-mono text-[11px] text-foreground/90 font-bold">{msg.subject}</span>
                                </div>
                                <div className="relative">
                                  <span className="absolute -left-3 top-0 text-primary/20 font-mono text-xl">"</span>
                                  <p className="font-mono text-[11px] text-muted-foreground leading-relaxed italic pl-2">
                                    {msg.content}
                                  </p>
                                  <span className="absolute -right-3 bottom-0 text-primary/20 font-mono text-xl">"</span>
                                </div>
                              </div>

                              <div className="shrink-0 flex md:flex-col gap-2 justify-end">
                                <button
                                  onClick={() => deleteMessage(msg.id)}
                                  className="p-3 text-destructive/40 hover:text-destructive hover:bg-destructive/5 border border-destructive/5 hover:border-destructive/30 transition-all rounded group"
                                  title="De-materialize Signal"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                                <a
                                  href={`mailto:${msg.sender_email}?subject=RE: ${msg.subject}`}
                                  className="p-3 text-primary/40 hover:text-primary hover:bg-primary/5 border border-primary/5 hover:border-primary/30 transition-all rounded group"
                                  title="Respond via Subspace"
                                >
                                  <Radio className="w-4 h-4" />
                                </a>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
            {activeTab === "config" && (
              <motion.div
                key="config"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="glass-panel neon-border p-8 space-y-8"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-[10px] tracking-[0.3em] neon-text uppercase">Security Core Configuration</h2>
                </div>

                <div className="max-w-md space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] text-primary/60 font-mono uppercase tracking-[0.2em]">Update Clearance Access Key</label>
                    <div className="flex gap-4">
                      <input
                        type="text"
                        placeholder="ENTER NEW KEY..."
                        id="new-admin-key"
                        className="flex-1 bg-black/40 border border-primary/20 p-3 text-xs text-foreground focus:border-primary outline-none transition-all font-mono"
                      />
                      <button
                        onClick={async () => {
                          const input = document.getElementById('new-admin-key') as HTMLInputElement;
                          if (input.value.trim()) {
                            await persistence.updateAdminKey(input.value.trim());
                            addLogEvent("ACCESS KEY ROTATED");
                            alert("Clearance code updated successfully.");
                            input.value = "";
                          }
                        }}
                        className="px-6 border border-primary/40 text-[9px] font-mono text-primary hover:bg-primary/10 transition-all flex items-center gap-2"
                      >
                        <Save className="w-3 h-3" /> COMMIT
                      </button>
                    </div>
                    <p className="text-[8px] text-muted-foreground font-mono italic">
                      &gt; Warning: Rotation of the access key will take effect on the next login attempt.
                    </p>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-primary/10">
                    <label className="text-[10px] text-primary/60 font-mono uppercase tracking-[0.2em]">Specimen Resume (CV)</label>
                    <div className="flex flex-col gap-4">
                      {cvUrl && (
                        <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded">
                          <FileText className="w-4 h-4 text-primary" />
                          <span className="text-[9px] font-mono text-muted-foreground truncate flex-1">{cvUrl}</span>
                          <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:neon-text transition-all font-mono text-[9px] uppercase">View</a>
                        </div>
                      )}
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleCVUpload}
                          id="cv-upload"
                          className="hidden"
                          disabled={isUploadingCV}
                        />
                        <label
                          htmlFor="cv-upload"
                          className={`w-full glass-panel p-4 flex items-center justify-center gap-3 text-[10px] font-mono transition-all cursor-pointer border-dashed border-2 hover:border-primary/50 group ${isUploadingCV ? 'opacity-50 pointer-events-none' : 'hover:bg-primary/5'}`}
                        >
                          {isUploadingCV ? (
                            <RefreshCw className="w-4 h-4 animate-spin text-primary" />
                          ) : (
                            <Upload className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                          )}
                          {isUploadingCV ? "UPLOADING_SPECIMEN..." : "UPLOAD_NEW_RESUME_BLOB"}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-primary/10">
                  <h3 className="text-[9px] font-display text-primary/40 uppercase tracking-widest mb-4">System Identity Integration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-primary/5 border border-primary/10 rounded">
                      <div className="text-[10px] text-primary mb-1 uppercase font-mono">Real-time Sync</div>
                      <div className="text-[9px] text-muted-foreground font-mono">Connected to Supabase Subspace Layer</div>
                    </div>
                    <div className="p-4 bg-primary/5 border border-primary/10 rounded">
                      <div className="text-[10px] text-primary mb-1 uppercase font-mono">Encryption Status</div>
                      <div className="text-[9px] text-muted-foreground font-mono">Quantum-Resistant AES-256 (Projected)</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Message Inbox Side Pane */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="glass-panel neon-border p-6 sticky top-24 max-h-[calc(100vh-12rem)] flex flex-col bg-black/60 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Inbox className="w-4 h-4 text-primary" />
                <h2 className="font-display text-[10px] tracking-[0.3em] neon-text uppercase">Signals</h2>
              </div>
              <button
                onClick={clearMessages}
                className="text-[9px] font-mono text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
              >
                <X className="w-3 h-3" /> PURGE
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 no-scrollbar">
              <AnimatePresence initial={false}>
                {messages.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground font-mono text-[9px] italic opacity-40">
                    &gt; NO INCOMING SIGNALS
                  </div>
                ) : (
                  messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-5 border border-primary/10 bg-primary/5 hover:bg-primary/10 hover:border-primary/20 transition-all group relative cursor-pointer"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMessage(msg.id);
                        }}
                        className="absolute top-2 right-2 text-primary/20 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{msg.sender_name}</span>
                          <span className="text-[8px] text-muted-foreground font-mono">{msg.sender_email}</span>
                        </div>
                        <span className="text-[8px] text-primary/30 mt-1">
                          {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : msg.time}
                        </span>
                      </div>
                      <div className="mb-2">
                        <span className="text-[8px] text-primary/40 font-mono uppercase tracking-[0.2em]">Subject: {msg.subject}</span>
                      </div>
                      <p className="text-[10px] font-mono text-foreground/80 leading-relaxed bg-black/40 p-3 border border-primary/5 italic mt-3 group-hover:border-primary/10 transition-colors">
                        "{msg.content}"
                      </p>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            <div className="mt-8 pt-4 border-t border-primary/10 text-[8px] font-mono text-center text-primary/20 tracking-[0.3em] uppercase">
              Subspace Monitoring Connected
            </div>
          </div>
        </div>
      </div>

      {/* Session Warning Modal */}
      <AnimatePresence>
        {showSessionWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel neon-border p-8 max-w-md w-full mx-4 text-center space-y-6"
            >
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full border-2 border-accent/50 bg-accent/10 flex items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-accent animate-pulse" />
                </div>
              </div>
              <h2 className="font-display text-lg neon-text tracking-[0.3em] uppercase">Session Expiring</h2>
              <p className="text-muted-foreground font-mono text-xs leading-relaxed">
                &gt; Your clearance window is closing in <span className="text-accent font-bold text-sm">{sessionTimeLeft}s</span>.<br />
                &gt; Extend your session or be disconnected from Mission Control.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={extendSession}
                  className="flex-1 glass-panel p-4 text-[10px] font-mono text-primary hover:neon-text transition-all bg-primary/10 border-primary/30 flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> STAY_CONNECTED
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 glass-panel p-4 text-[10px] font-mono text-destructive hover:text-destructive transition-all bg-destructive/5 border-destructive/20 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" /> DISCONNECT
                </button>
              </div>
              <div className="h-1 bg-primary/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-accent"
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: sessionTimeLeft, ease: "linear" }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default Admin;
