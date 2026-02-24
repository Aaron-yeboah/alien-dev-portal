import { motion } from "framer-motion";
import { Shield, Cpu, Globe, Zap, FileText } from "lucide-react";
import alienImg from "@/assets/alien-new.png";
import BinaryRain from "@/components/BinaryRain";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";
import TopNav from "@/components/TopNav";

const stats = [
  { icon: Shield, label: "SECURITY CLEARANCE", value: "OMEGA-7" },
  { icon: Cpu, label: "NEURAL CORES", value: "∞" },
  { icon: Globe, label: "SYSTEMS INFILTRATED", value: "42+" },
  { icon: Zap, label: "UPTIME", value: "99.97%" },
];

const About = () => (
  <PageTransition>
    <BinaryRain />
    <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-20 lg:py-16">
      <BackButton />
      <TopNav />
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12 max-w-5xl w-full">
        {/* New Alien Image on Top for Mobile, Right for LG */}
        <motion.div
          className="flex-shrink-0 relative lg:order-2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src={alienImg}
            alt="Alien Scanning"
            className="w-56 sm:w-64 md:w-80 lg:w-[400px] rounded-2xl opacity-100 mix-blend-lighten drop-shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all hover:drop-shadow-[0_0_25px_rgba(var(--primary),0.5)]"
          />
          <div className="absolute inset-0 -z-10 blur-3xl opacity-30 bg-primary rounded-full scale-75" />

          {/* Decorative frame elements for 'sleekness' */}
          <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-primary/40" />
          <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-primary/40" />
        </motion.div>

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
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-panel neon-border mt-6 px-6 py-3 flex items-center justify-center gap-3 cursor-pointer group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <FileText className="w-5 h-5 text-primary group-hover:neon-text transition-all" />
              <span className="font-display text-sm tracking-[0.2em] text-foreground group-hover:neon-text transition-all">
                VIEW CV
              </span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  </PageTransition>
);

export default About;
