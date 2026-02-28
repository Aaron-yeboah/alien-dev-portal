import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Mail, Github, MessageSquare, MapPin, Clock, Wifi, Twitter, Linkedin, Terminal, Link as LinkIcon } from "lucide-react";
import alienImg from "@/assets/contact-alien.png";
import BinaryRain from "@/components/BinaryRain";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";
import TopNav from "@/components/TopNav";
import { persistence, Handles } from "@/utils/persistence";
import { useNeuralIntensity } from "@/hooks/useNeuralIntensity";

const Contact = () => {
  const [handles, setHandles] = useState<Handles | null>(null);
  const neuralIntensity = useNeuralIntensity(15);

  useEffect(() => {
    const fetchHandles = async () => {
      const data = await persistence.getHandles();
      setHandles(data);
    };
    fetchHandles();
  }, []);

  const contactChannels = handles ? [
    { icon: Mail, label: "EMAIL", value: handles.email, href: `mailto:${handles.email}` },
    { icon: Github, label: "GITHUB", value: handles.github, href: `https://${handles.github}` },
    { icon: Twitter, label: "X_CORP", value: handles.twitter, href: `https://${handles.twitter}` },
    { icon: Linkedin, label: "LINKEDIN", value: handles.linkedin, href: `https://${handles.linkedin}` },
    { icon: MessageSquare, label: "DISCORD", value: handles.discord, href: "#" },
    // Dynamic Custom Signals
    ...Object.entries(handles.custom_signals || {}).map(([label, value]) => ({
      icon: LinkIcon,
      label,
      value: value as string,
      href: (value as string).startsWith('http') || (value as string).startsWith('www') ? ((value as string).startsWith('http') ? (value as string) : `https://${value}`) : "#"
    })),
  ] : [];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [lines, setLines] = useState<string[]>([
    "> SECURE CHANNEL ESTABLISHED",
    "> ALIEN IS MONITORING THIS TRANSMISSION...",
    "> ENCRYPTION: AES-256 QUANTUM LAYER ACTIVE",
    "> ALL MESSAGES ARE LOGGED IN SUBSPACE DATABASE",
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;

    await persistence.addMessage({
      sender_name: formData.name,
      sender_email: formData.email,
      subject: formData.subject || "GENERAL_INQUIRY",
      content: formData.message
    });

    setLines((prev) => [
      ...prev,
      `> SIGNAL_ORIGIN: ${formData.name}`,
      `> SYSTEM_STATUS: UPLOADING_TO_SUBSPACE...`,
      "> TRANSMISSION RECEIVED. PROCESSING...",
      "> ALIEN WILL RESPOND VIA SUBSPACE FREQUENCY.",
    ]);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <PageTransition>
      <BinaryRain intensity={neuralIntensity} />
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 py-20 lg:py-16">
        <BackButton />
        <TopNav />
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 max-w-6xl w-full">
          {/* Alien monitoring */}
          <motion.div
            className="flex-shrink-0 lg:order-2 lg:w-1/3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative group mx-auto max-w-[240px] md:max-w-xs lg:max-w-none">
              <img
                src={alienImg}
                alt="Alien monitoring transmission"
                className="w-full rounded-2xl opacity-90 mix-blend-lighten drop-shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all duration-700 group-hover:drop-shadow-[0_0_30px_rgba(var(--primary),0.6)] group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 -z-10 blur-3xl opacity-20 bg-primary rounded-full scale-75 animate-pulse" />

              {/* Neural Metadata Overlay */}
              {handles && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="absolute -bottom-6 -right-6 lg:-right-10 glass-panel p-4 border border-primary/30 backdrop-blur-md hidden md:block"
                >
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 font-mono text-[8px] tracking-widest text-primary/40 uppercase">
                    <div>Neural Core: <span className="text-primary">{handles.neuralCores}</span></div>
                    <div>Uptime: <span className="text-primary">{handles.uptime}</span></div>
                    <div>Freq: <span className="text-primary">{handles.frequency}</span></div>
                    <div>Protocol: <span className="text-primary">{handles.protocol}</span></div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Terminal & Grid */}
          <motion.div
            className="flex-1 w-full lg:order-1 lg:w-2/3 space-y-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="glass-panel neon-border p-5 md:p-8 overflow-hidden relative group">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-primary" />
                  <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-[0.3em]">
                    xeno-comm-hub v4.0.0 — secure channel
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive/60" />
                  <div className="w-1.5 h-1.5 rounded-full bg-accent/60" />
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                </div>
              </div>

              <div className="h-28 overflow-y-auto mb-8 space-y-1 scanline p-4 bg-black/40 border border-primary/10 font-mono">
                {lines.map((line, i) => (
                  <motion.p
                    key={i}
                    className="text-[10px] text-primary/70 leading-relaxed"
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    {line}
                  </motion.p>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[8px] text-primary/40 font-mono uppercase tracking-[0.3em] pl-1">Origin_Identity</label>
                    <input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      autoComplete="off"
                      placeholder="Your name or alias..."
                      className="w-full bg-black/40 border border-primary/10 text-foreground text-xs px-4 py-3 font-mono focus:outline-none focus:border-primary/60 placeholder:text-muted-foreground/30 transition-all hover:bg-primary/5"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[8px] text-primary/40 font-mono uppercase tracking-[0.3em] pl-1">Return_Frequency</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      autoComplete="off"
                      placeholder="your@email.com"
                      className="w-full bg-black/40 border border-primary/10 text-foreground text-xs px-4 py-3 font-mono focus:outline-none focus:border-primary/60 placeholder:text-muted-foreground/30 transition-all hover:bg-primary/5"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[8px] text-primary/40 font-mono uppercase tracking-[0.3em] pl-1">Transmission_Subject</label>
                  <input
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    autoComplete="off"
                    placeholder="What is this about? e.g. Job Opportunity, Collaboration..."
                    className="w-full bg-black/40 border border-primary/10 text-foreground text-xs px-4 py-3 font-mono focus:outline-none focus:border-primary/60 placeholder:text-muted-foreground/30 transition-all hover:bg-primary/5"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[8px] text-primary/40 font-mono uppercase tracking-[0.3em] pl-1">Signal_Payload</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    placeholder="Type your message here..."
                    className="w-full bg-black/40 border border-primary/10 text-foreground text-xs px-4 py-4 font-mono focus:outline-none focus:border-primary/60 placeholder:text-muted-foreground/30 transition-all hover:bg-primary/5 resize-none"
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  className="w-full glass-panel border border-primary/30 py-4 flex items-center justify-center gap-3 text-primary hover:neon-text hover:bg-primary/10 transition-all tracking-[0.4em] font-display text-[10px]"
                  whileHover={{ y: -2 }}
                >
                  <Send className="w-4 h-4" />
                  INITIATE_BROADCAST_SEQUENCE
                </motion.button>
              </form>
            </div>

            {/* Premium Handles Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {contactChannels.map((channel, i) => (
                <motion.a
                  key={channel.label}
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-panel p-4 text-center group border-primary/10 hover:border-primary/40 transition-all hover:bg-primary/5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <channel.icon className="w-4 h-4 text-primary/40 mx-auto mb-3 group-hover:text-primary group-hover:scale-110 transition-all" />
                  <div className="text-[8px] text-primary/30 font-mono mb-1 tracking-widest uppercase">{channel.label}</div>
                  <div className="text-[9px] text-foreground/70 font-mono truncate px-1">{channel.value}</div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Contact;
