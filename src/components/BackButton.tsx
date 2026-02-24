import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const BackButton = () => (
  <motion.div
    className="fixed top-6 left-6 z-50"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.3 }}
  >
    <Link to="/" className="glass-panel inline-flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground hover:text-primary transition-colors font-mono">
      <ArrowLeft className="w-3 h-3" />
      HOME
    </Link>
  </motion.div>
);

export default BackButton;
