import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface GlassNavButtonProps {
  to: string;
  label: string;
  index: number;
  onHover: (hovering: boolean) => void;
}

const GlassNavButton = ({ to, label, index, onHover }: GlassNavButtonProps) => (
  <motion.div
    initial={{ opacity: 0, x: 60 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.8 + index * 0.15, duration: 0.5 }}
  >
    <Link to={to}>
      <motion.div
        className="glass-panel scanline px-6 sm:px-10 py-4 sm:py-5 cursor-pointer relative overflow-hidden group w-44 sm:w-56"
        whileHover={{ scale: 1.05, x: -8 }}
        whileTap={{ scale: 0.97 }}
        onHoverStart={() => onHover(true)}
        onHoverEnd={() => onHover(false)}
      >
        <span className="font-display text-sm tracking-[0.3em] text-foreground group-hover:neon-text transition-all duration-300">
          {label}
        </span>
        <motion.div
          className="absolute inset-0 bg-primary/5"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      </motion.div>
    </Link>
  </motion.div>
);

export default GlassNavButton;
