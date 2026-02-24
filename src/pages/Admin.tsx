import { motion } from "framer-motion";
import { BarChart3, Users, Eye, FolderOpen, Terminal, Activity } from "lucide-react";
import BinaryRain from "@/components/BinaryRain";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";

const metrics = [
  { icon: Eye, label: "TOTAL VIEWS", value: "12,847", change: "+14%" },
  { icon: Users, label: "VISITORS", value: "3,291", change: "+8%" },
  { icon: FolderOpen, label: "PROJECTS", value: "6", change: "+1" },
  { icon: Activity, label: "UPTIME", value: "99.97%", change: "STABLE" },
];

const recentActivity = [
  { time: "2m ago", event: "New visitor from SECTOR-9" },
  { time: "15m ago", event: "Project 'Neural Grid' viewed 3x" },
  { time: "1h ago", event: "Contact transmission received" },
  { time: "3h ago", event: "System health check — ALL CLEAR" },
  { time: "6h ago", event: "CV downloaded by unknown entity" },
];

const Admin = () => (
  <PageTransition>
    <BinaryRain />
    <div className="relative z-10 min-h-screen px-6 py-16">
      <BackButton />

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Terminal className="w-6 h-6 text-primary" />
            <h1 className="font-display text-xl md:text-2xl neon-text tracking-widest">
              ADMIN DASHBOARD
            </h1>
          </div>
          <p className="text-muted-foreground text-sm font-mono">
            &gt; SYSTEM STATUS: OPERATIONAL — CLEARANCE LEVEL: OMEGA
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              className="glass-panel neon-border p-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <metric.icon className="w-5 h-5 text-primary mb-3" />
              <div className="text-xs text-muted-foreground mb-1">{metric.label}</div>
              <div className="font-display text-lg neon-text">{metric.value}</div>
              <div className="text-xs text-primary/60 mt-1">{metric.change}</div>
            </motion.div>
          ))}
        </div>

        {/* Activity Log */}
        <motion.div
          className="glass-panel neon-border p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h2 className="font-display text-sm tracking-widest neon-text">RECENT ACTIVITY</h2>
          </div>
          <div className="h-px bg-primary/20 mb-4" />
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-4 text-sm font-mono"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.08 }}
              >
                <span className="text-primary/50 text-xs w-16 flex-shrink-0">{item.time}</span>
                <span className="text-muted-foreground">&gt; {item.event}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </PageTransition>
);

export default Admin;
