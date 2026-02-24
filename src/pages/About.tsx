import { motion } from "framer-motion";
import { Shield, Cpu, Globe, Zap } from "lucide-react";
import alienImg from "@/assets/alien.jpeg";
import BinaryRain from "@/components/BinaryRain";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";

const stats = [
  { icon: Shield, label: "SECURITY CLEARANCE", value: "OMEGA-7" },
  { icon: Cpu, label: "NEURAL CORES", value: "∞" },
  { icon: Globe, label: "SYSTEMS INFILTRATED", value: "42+" },
  { icon: Zap, label: "UPTIME", value: "99.97%" },
];

const About = () => (
  <PageTransition>
    <BinaryRain />
    <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-16">
      <BackButton />
      <div className="flex flex-col lg:flex-row items-center gap-12 max-w-5xl w-full">
        {/* Alien on left */}
        <motion.div
          className="flex-shrink-0"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src={alienImg}
            alt="Alien scanning"
            className="w-56 md:w-72 lg:w-80 rounded-lg opacity-90"
          />
          <div className="absolute inset-0 -z-10 blur-3xl opacity-20 bg-primary rounded-full scale-50" />
        </motion.div>

        {/* Bio Dossier */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="glass-panel scanline p-8 neon-border">
            <h1 className="font-display text-xl md:text-2xl neon-text mb-2 tracking-widest">
              // BIO-SCAN RESULTS
            </h1>
            <div className="h-px bg-primary/30 mb-6" />
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              &gt; DESIGNATION: Full-Stack Developer<br />
              &gt; ORIGIN: Planet Earth (allegedly)<br />
              &gt; SPECIALIZATION: Web technologies, UI/UX infiltration, system architecture<br />
              &gt; STATUS: Currently transmitting from an undisclosed server room<br /><br />
              A digital entity fluent in React, TypeScript, Node.js, and the dark arts of CSS.
              Known for constructing elegant interfaces and robust backend systems
              that operate beyond conventional human parameters.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="glass-panel p-4 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                  <div className="text-xs text-muted-foreground mb-1">{stat.label}</div>
                  <div className="font-display text-sm neon-text">{stat.value}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </PageTransition>
);

export default About;
