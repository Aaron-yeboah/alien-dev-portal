import { useState } from "react";
import { motion } from "framer-motion";
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
        <div className="flex flex-1 items-center justify-center px-6">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-16 max-w-6xl w-full justify-end">
            {/* Nav Buttons - left of alien */}
            <div className="flex flex-col gap-5 items-end text-right">
              <motion.h1
                className="font-display text-2xl md:text-3xl neon-text mb-4 tracking-widest"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                ALIEN DEV
              </motion.h1>
              <motion.p
                className="text-muted-foreground text-sm mb-6 max-w-xs leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                &gt; TRANSMISSION INCOMING..._
              </motion.p>
              {navItems.map((item, i) => (
                <GlassNavButton
                  key={item.to}
                  {...item}
                  index={i}
                  onHover={setOrbIntensity}
                />
              ))}
            </div>

            {/* Alien Image with Orb Glow */}
            <motion.div
              className="relative flex-shrink-0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <img
                src={alienImg}
                alt="Alien Grey holding a glowing orb"
                className="w-72 sm:w-80 md:w-96 lg:w-[480px] rounded-lg relative z-10"
              />
              {/* Orb glow overlay */}
              <motion.div
                className="absolute bottom-[22%] left-[18%] w-28 h-28 md:w-36 md:h-36 rounded-full z-20 pointer-events-none"
                animate={{
                  boxShadow: orbIntensity
                    ? [
                        "0 0 30px 15px rgba(57,255,20,0.5), 0 0 80px 40px rgba(57,255,20,0.25)",
                        "0 0 50px 25px rgba(57,255,20,0.7), 0 0 120px 60px rgba(57,255,20,0.35)",
                        "0 0 30px 15px rgba(57,255,20,0.5), 0 0 80px 40px rgba(57,255,20,0.25)",
                      ]
                    : [
                        "0 0 15px 8px rgba(57,255,20,0.2), 0 0 40px 20px rgba(57,255,20,0.1)",
                        "0 0 25px 12px rgba(57,255,20,0.3), 0 0 60px 30px rgba(57,255,20,0.15)",
                        "0 0 15px 8px rgba(57,255,20,0.2), 0 0 40px 20px rgba(57,255,20,0.1)",
                      ],
                }}
                transition={{
                  duration: orbIntensity ? 0.6 : 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              {/* Ambient green glow behind alien */}
              <div className="absolute inset-0 -z-10 blur-3xl opacity-30 bg-primary rounded-full scale-75" />
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 py-4 text-center border-t border-border/30">
          <p className="text-muted-foreground text-xs font-mono tracking-wider">
            © {new Date().getFullYear()} ALIEN DEV — All rights reserved.
          </p>
        </footer>
      </div>
    </PageTransition>
  );
};

export default Index;
