import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Cpu, Globe, Zap, FileText } from "lucide-react";
import mood1 from "@/assets/alien-mood-1.png";
import mood2 from "@/assets/alien-mood-2.png";
import mood3 from "@/assets/alien-mood-3.png";
import mood4 from "@/assets/alien-mood-4.png";
import BinaryRain from "@/components/BinaryRain";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";
import TopNav from "@/components/TopNav";
import { persistence, Handles } from "@/utils/persistence";

const alienMoods = [mood1, mood2, mood3, mood4];

const teleportVariants = {
  initial: {
    opacity: 0,
    scale: 0.8,
    skewX: -15,
    filter: "brightness(3) contrast(2) hue-rotate(120deg) blur(10px)"
  },
  animate: {
    opacity: 1,
    scale: 1,
    skewX: 0,
    filter: "brightness(1) contrast(1) hue-rotate(0deg) blur(0px)",
    transition: {
      type: "spring" as const,
      stiffness: 450,
      damping: 30,
      duration: 0.5
    }
  },
  exit: {
    opacity: [1, 0.5, 1, 0],
    scale: [1, 1.1, 0.9, 1.2],
    skewX: [0, 20, -20, 40],
    filter: [
      "brightness(1) contrast(1) hue-rotate(0deg)",
      "brightness(4) contrast(3) hue-rotate(180deg)",
      "brightness(10) contrast(5) hue-rotate(360deg) blur(20px)"
    ],
    clipPath: [
      "inset(0 0 0 0)",
      "inset(10% 0 60% 0)",
      "inset(60% 0 10% 0)",
      "inset(100% 0 0 0)"
    ],
    transition: {
      duration: 0.5,
      times: [0, 0.2, 0.4, 1]
    }
  }
};

const About = () => {
  const [handles, setHandles] = useState<Handles | null>(null);
  const [moodIndex, setMoodIndex] = useState(0);

  useEffect(() => {
    const fetchHandles = async () => {
      const data = await persistence.getHandles();
      setHandles(data);
    };
    fetchHandles();

    const interval = setInterval(() => {
      setMoodIndex((prev) => (prev + 1) % alienMoods.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { icon: Shield, label: "SECURITY CLEARANCE", value: handles?.clearance || "OMEGA-7" },
    { icon: Cpu, label: "NEURAL CORES", value: handles?.neuralCores || "∞" },
    { icon: Globe, label: "SYSTEMS INFILTRATED", value: "42+" },
    { icon: Zap, label: "UPTIME", value: handles?.uptime || "99.97%" },
  ];

  return (
    <PageTransition>
      <BinaryRain />
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-20 lg:py-16">
        <BackButton />
        <TopNav />
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12 max-w-5xl w-full">
          {/* Mood Slider with Glitch Transition */}
          <div className="flex-shrink-0 relative lg:order-2 w-56 sm:w-64 md:w-80 lg:w-[400px] aspect-[1/1.5] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={moodIndex}
                variants={teleportVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="absolute inset-0 flex items-center justify-center -z-20"
              >
                <img
                  src={alienMoods[moodIndex]}
                  alt={`Alien Mood ${moodIndex + 1}`}
                  className="w-full rounded-2xl opacity-100 mix-blend-lighten drop-shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all hover:drop-shadow-[0_0_25px_rgba(var(--primary),0.5)]"
                />
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 -z-10 blur-3xl opacity-30 bg-primary rounded-full scale-75" />

            {/* Decorative frame elements */}
            <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-primary/40" />
            <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-primary/40" />
          </div>

          {/* Bio Dossier */}
          <motion.div
            className="flex-1 lg:order-1 w-full"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="glass-panel scanline p-6 md:p-8 neon-border">
              <h1 className="font-display text-xl md:text-2xl neon-text mb-2 tracking-widest text-center lg:text-left">
              // BIO-SCAN RESULTS
              </h1>
              <div className="h-px bg-primary/30 mb-6" />
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-mono">
                &gt; DESIGNATION: Full-Stack Developer<br />
                &gt; ORIGIN: Planet Earth (allegedly)<br />
                &gt; SPECIALIZATION: Web technologies, UI/UX infiltration, system architecture<br />
                &gt; STATUS: Currently transmitting from an undisclosed server room<br /><br />
                <span className="text-foreground/80">
                  A digital entity fluent in React, TypeScript, Node.js, and the dark arts of CSS.
                  Known for constructing elegant interfaces and robust backend systems
                  that operate beyond conventional human parameters.
                </span>
              </p>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    className="glass-panel p-3 sm:p-4 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary mx-auto mb-2" />
                    <div className="text-[10px] sm:text-xs text-muted-foreground mb-1 uppercase tracking-tighter sm:tracking-normal">{stat.label}</div>
                    <div className="font-display text-xs sm:text-sm neon-text">{stat.value}</div>
                  </motion.div>
                ))}
              </div>

              <motion.a
                href={handles?.cv_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={`glass-panel neon-border mt-6 px-6 py-3 flex items-center justify-center gap-3 cursor-pointer group ${!handles?.cv_url ? 'opacity-50 pointer-events-none' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <FileText className="w-5 h-5 text-primary group-hover:neon-text transition-all" />
                <span className="font-display text-sm tracking-[0.2em] text-foreground group-hover:neon-text transition-all">
                  {handles?.cv_url ? 'VIEW CV' : 'CV_NOT_FOUND'}
                </span>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default About;
