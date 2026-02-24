import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import BinaryRain from "@/components/BinaryRain";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";

const projects = [
  {
    title: "NEURAL NEXUS",
    desc: "AI-powered dashboard for monitoring interstellar data streams in real-time.",
    tags: ["React", "Python", "TensorFlow"],
  },
  {
    title: "VOID COMMERCE",
    desc: "E-commerce platform optimized for zero-gravity transactions.",
    tags: ["Next.js", "Stripe", "PostgreSQL"],
  },
  {
    title: "SPECTRAL CMS",
    desc: "Headless content system with multi-dimensional content delivery.",
    tags: ["TypeScript", "GraphQL", "Redis"],
  },
  {
    title: "DARK SIGNAL",
    desc: "Encrypted communication protocol for deep-space messaging.",
    tags: ["Node.js", "WebSocket", "Rust"],
  },
  {
    title: "XENO ANALYTICS",
    desc: "Behavioral tracking engine for studying unidentified digital entities.",
    tags: ["React", "D3.js", "MongoDB"],
  },
  {
    title: "PHASE SHIFT",
    desc: "Real-time collaborative editor with quantum-state synchronization.",
    tags: ["Svelte", "CRDT", "WebRTC"],
  },
];

const Projects = () => (
  <PageTransition>
    <BinaryRain />
    <div className="relative z-10 min-h-screen px-6 py-16">
      <BackButton />
      <div className="max-w-5xl mx-auto">
        <motion.h1
          className="font-display text-xl md:text-2xl neon-text mb-2 tracking-widest text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          // SPECIMEN ARCHIVE
        </motion.h1>
        <motion.p
          className="text-muted-foreground text-sm text-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          &gt; Catalogued experiments and deployed constructs_
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              className="glass-panel scanline p-6 neon-border group cursor-pointer flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent mb-4" />
              <h3 className="font-display text-sm neon-text mb-3 tracking-wider">
                {project.title}
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed mb-4 flex-1">
                {project.desc}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-1 border border-primary/20 text-primary/70 font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-4 text-muted-foreground">
                <Github className="w-4 h-4 hover:text-primary transition-colors cursor-pointer" />
                <ExternalLink className="w-4 h-4 hover:text-primary transition-colors cursor-pointer" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </PageTransition>
);

export default Projects;
