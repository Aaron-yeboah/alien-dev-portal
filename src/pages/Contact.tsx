import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import alienImg from "@/assets/alien.jpeg";
import BinaryRain from "@/components/BinaryRain";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";

const Contact = () => {
  const [lines, setLines] = useState<string[]>([
    "> SECURE CHANNEL ESTABLISHED",
    "> ALIEN IS MONITORING THIS TRANSMISSION...",
    "> ENTER YOUR MESSAGE BELOW:",
  ]);
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLines((prev) => [
      ...prev,
      `> USER: ${input}`,
      "> TRANSMISSION RECEIVED. PROCESSING...",
      "> ALIEN WILL RESPOND VIA SUBSPACE FREQUENCY.",
    ]);
    setInput("");
  };

  return (
    <PageTransition>
      <BinaryRain />
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-16">
        <BackButton />
        <div className="flex flex-col lg:flex-row items-center gap-12 max-w-5xl w-full">
          {/* Terminal */}
          <motion.div
            className="flex-1 w-full"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass-panel neon-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-accent/60" />
                <div className="w-3 h-3 rounded-full bg-primary/60" />
                <span className="ml-3 text-xs text-muted-foreground font-mono">
                  xeno-terminal v3.7.1
                </span>
              </div>
              <div className="h-px bg-primary/20 mb-4" />

              <div className="h-48 overflow-y-auto mb-4 space-y-1 scanline p-2">
                {lines.map((line, i) => (
                  <motion.p
                    key={i}
                    className="text-xs text-primary/80 font-mono"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {line}
                  </motion.p>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent border border-primary/20 text-foreground text-sm px-4 py-2 font-mono focus:outline-none focus:border-primary/60 placeholder:text-muted-foreground/50"
                />
                <motion.button
                  type="submit"
                  className="glass-panel px-4 py-2 text-primary hover:neon-text transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </form>

              <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span>&gt; EMAIL: alien@devterminal.io</span>
                <span>&gt; GITHUB: /alien-dev</span>
                <span>&gt; SIGNAL: CLASSIFIED</span>
              </div>
            </div>
          </motion.div>

          {/* Alien watching */}
          <motion.div
            className="flex-shrink-0 hidden lg:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative">
              <img
                src={alienImg}
                alt="Alien monitoring transmission"
                className="w-64 rounded-lg opacity-80"
              />
              <div className="absolute inset-0 -z-10 blur-3xl opacity-20 bg-primary rounded-full" />
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Contact;
