import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, AlertTriangle } from "lucide-react";
import alien404 from "@/assets/404-alien.png";
import BinaryRain from "@/components/BinaryRain";
import PageTransition from "@/components/PageTransition";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <PageTransition>
      <BinaryRain />
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-8 md:gap-16">
          {/* Alien 404 Illustration */}
          <motion.div
            className="flex-1 relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative group">
              <img
                src={alien404}
                alt="404 Alien"
                className="w-full max-w-[400px] mx-auto drop-shadow-[0_0_30px_rgba(var(--primary),0.3)] transition-all duration-500 group-hover:drop-shadow-[0_0_50px_rgba(var(--primary),0.5)]"
              />
              <div className="absolute inset-0 -z-10 blur-[100px] opacity-20 bg-primary rounded-full scale-110" />
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            className="flex-1 text-center md:text-left space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-destructive/30 bg-destructive/5 text-destructive text-[10px] font-mono tracking-widest uppercase mb-2">
              <AlertTriangle className="w-3 h-3" />
              Signal Lost
            </div>

            <h1 className="font-display text-5xl md:text-7xl neon-text mb-2 tracking-tighter">
              404
            </h1>

            <p className="text-muted-foreground text-sm md:text-base font-mono leading-relaxed max-w-md mx-auto md:mx-0">
              &gt; ERROR: SUBSPACE_COORDINATES_INVALID<br />
              &gt; REASON: Requested node does not exist in current reality.<br />
              &gt; LOCATION: {location.pathname}
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/"
                className="inline-flex items-center gap-3 glass-panel neon-border px-8 py-4 font-display text-sm tracking-[0.2em] text-foreground hover:neon-text transition-all group"
              >
                <Home className="w-4 h-4 text-primary group-hover:neon-text transition-all" />
                RE-ESTABLISH CONNECTION
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default NotFound;
