import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Users, Eye, FolderOpen, Terminal, Activity, RefreshCw, Trash2 } from "lucide-react";
import BinaryRain from "@/components/BinaryRain";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";

const initialMetrics = [
  { icon: Eye, label: "TOTAL VIEWS", value: 12847, change: "+14%" },
  { icon: Users, label: "VISITORS", value: 3291, change: "+8%" },
  { icon: FolderOpen, label: "PROJECTS", value: 6, change: "+1" },
  { icon: Activity, label: "UPTIME", value: "99.97%", change: "STABLE" },
];

const initialActivity = [
  { time: "2m ago", event: "New visitor from SECTOR-9" },
  { time: "15m ago", event: "Project 'Neural Grid' viewed 3x" },
  { time: "1h ago", event: "Contact transmission received" },
  { time: "3h ago", event: "System health check — ALL CLEAR" },
  { time: "6h ago", event: "CV downloaded by unknown entity" },
];

const Admin = () => {
  const [metrics, setMetrics] = useState(initialMetrics);
  const [activity, setActivity] = useState(initialActivity);
  const [isRebooting, setIsRebooting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(m => {
        if (m.label === "VISITORS") return { ...m, value: (m.value as number) + Math.floor(Math.random() * 2) };
        if (m.label === "TOTAL VIEWS") return { ...m, value: (m.value as number) + Math.floor(Math.random() * 5) };
        return m;
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleReboot = () => {
    setIsRebooting(true);
    setTimeout(() => setIsRebooting(false), 2000);
    const newEvent = { time: "Just now", event: "UNAUTHORIZED SYSTEM REBOOT INITIATED" };
    setActivity(prev => [newEvent, ...prev.slice(0, 4)]);
  };

  const clearLogs = () => {
    setActivity([{ time: "Just now", event: "ACTIVITY LOGS PURGED BY ADMIN" }]);
  };

  return (
    <PageTransition>
      <BinaryRain />
      <div className="relative z-10 min-h-screen px-4 sm:px-6 py-16 md:py-24">
        <BackButton />

        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-3 mb-2 justify-center sm:justify-start">
                <Terminal className="w-6 h-6 text-primary" />
                <h1 className="font-display text-xl md:text-2xl neon-text tracking-widest">
                  ADMIN DASHBOARD
                </h1>
              </div>
              <p className="text-muted-foreground text-xs sm:text-sm font-mono text-center sm:text-left">
                &gt; SYSTEM STATUS: {isRebooting ? "REBOOTING..." : "OPERATIONAL"} — CLEARANCE: OMEGA
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={handleReboot}
                disabled={isRebooting}
                className="glass-panel p-2 px-4 flex items-center gap-2 text-[10px] font-mono hover:neon-text transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isRebooting ? "animate-spin" : ""}`} />
                REBOOT
              </button>
              <button
                onClick={clearLogs}
                className="glass-panel p-2 px-4 flex items-center gap-2 text-[10px] font-mono hover:text-destructive transition-all"
              >
                <Trash2 className="w-3 h-3" />
                PURGE
              </button>
            </div>
          </motion.div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {metrics.map((metric, i) => (
              <motion.div
                key={metric.label}
                className="glass-panel neon-border p-5 group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <metric.icon className="w-5 h-5 text-primary mb-3 group-hover:neon-text transition-all" />
                <div className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">{metric.label}</div>
                <div className="font-display text-lg neon-text">
                  {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                </div>
                <div className="text-[10px] text-primary/60 mt-1">{metric.change}</div>
              </motion.div>
            ))}
          </div>

          {/* Activity Log */}
          <motion.div
            className="glass-panel neon-border p-5 sm:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h2 className="font-display text-sm tracking-widest neon-text">RECENT ACTIVITY</h2>
            </div>
            <div className="h-px bg-primary/20 mb-4" />
            <div className="space-y-3 min-h-[150px]">
              <AnimatePresence initial={false}>
                {activity.map((item, i) => (
                  <motion.div
                    key={item.event + i}
                    className="flex items-start gap-4 text-xs sm:text-sm font-mono"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-primary/50 text-[10px] w-16 flex-shrink-0 uppercase">{item.time}</span>
                    <span className="text-muted-foreground break-words">&gt; {item.event}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Admin;
