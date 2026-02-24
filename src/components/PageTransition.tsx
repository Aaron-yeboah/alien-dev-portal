import { motion } from "framer-motion";
import { ReactNode } from "react";

const PageTransition = ({ children }: { children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, filter: "brightness(0)" }}
    animate={{ opacity: 1, filter: "brightness(1)" }}
    exit={{ opacity: 0, filter: "brightness(0)" }}
    transition={{ duration: 0.5, ease: "easeInOut" }}
    className="min-h-screen"
  >
    {children}
  </motion.div>
);

export default PageTransition;
