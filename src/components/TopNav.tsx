import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
    { to: "/about", label: "ABOUT" },
    { to: "/projects", label: "PROJECTS" },
    { to: "/contact", label: "CONTACT" },
];

const TopNav = () => {
    const location = useLocation();

    return (
        <motion.div
            className="fixed top-6 right-6 z-50 flex gap-2 sm:gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
        >
            {navItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                    <Link
                        key={item.to}
                        to={item.to}
                        className={`glass-panel inline-flex items-center px-4 py-2 text-xs font-mono transition-all duration-300 ${isActive
                                ? "text-primary border-primary/40 bg-primary/10"
                                : "text-muted-foreground hover:text-primary hover:border-primary/20"
                            }`}
                    >
                        {item.label}
                    </Link>
                );
            })}
        </motion.div>
    );
};

export default TopNav;
