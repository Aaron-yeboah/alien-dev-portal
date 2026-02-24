import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import alienImg from "@/assets/alien.jpeg";
import GlassNavButton from "@/components/GlassNavButton";
import BinaryRain from "@/components/BinaryRain";
import PageTransition from "@/components/PageTransition";

const navItems = [
  { to: "/about", label: "ABOUT DEV" },
  { to: "/projects", label: "PROJECTS" },
  { to: "/contact", label: "CONTACT" },
];

const Index = () => {
  const [orbIntensity, setOrbIntensity] = useState(false);

  return (
    <PageTransition>
      <BinaryRain />
      <div className="relative z-10 flex min-h-screen flex-col">
        <div className="flex flex-1 items-center justify-center px-6 py-12 md:py-0">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-8 sm:gap-12 lg:gap-16 max-w-6xl w-full justify-center">
            {/* Nav Buttons and Title Container */}
            <div className="flex flex-col gap-4 items-center lg:items-end text-center lg:text-right">
              <motion.h1
                className="font-display text-4xl md:text-5xl lg:text-6xl neon-text mb-2 tracking-widest"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                ALIEN DEV
              </motion.h1>
              <div className="flex flex-col gap-2 md:gap-3 items-center lg:items-end w-full">
                <motion.p
                  className="text-primary/70 text-[10px] md:text-xs mb-2 max-w-xs leading-relaxed font-mono tracking-[0.3em] uppercase lg:text-right"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  &gt; TRANSMISSION INCOMING..._
                </motion.p>
                <div className="flex flex-col gap-3 md:gap-4 w-full max-w-[200px] sm:max-w-[280px] md:max-w-none items-center lg:items-end">
                  {navItems.map((item, i) => (
                    <GlassNavButton
                      key={item.to}
                      {...item}
                      index={i}
                      onHover={setOrbIntensity}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Alien Image */}
            <motion.div
              className="relative flex-shrink-0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                <img
                  src={alienImg}
                  alt="Alien Grey holding a glowing orb"
                  className="w-56 sm:w-72 md:w-80 lg:w-[480px] rounded-lg relative z-10 drop-shadow-[0_0_20px_rgba(var(--primary),0.2)]"
                />
                {/* Ambient green glow behind alien */}
                <div className="absolute inset-0 -z-10 blur-3xl opacity-30 bg-primary rounded-full scale-75" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 py-4 text-center border-t border-border/30">
          <p className="text-muted-foreground text-xs font-mono tracking-wider">
            © {new Date().getFullYear()}{" "}
            <Link to="/admin" className="hover:neon-text transition-all duration-300 cursor-pointer">
              ALIEN DEV
            </Link>{" "}
            — All rights reserved.
          </p>
        </footer>
      </div>
    </PageTransition>
  );
};

export default Index;
