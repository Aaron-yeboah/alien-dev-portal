import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

import { useEffect } from "react";
import { persistence } from "./utils/persistence";
import { toast } from "./hooks/use-toast";

const AnimatedRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    // Only increment once per session to avoid spamming the database
    const hasVisited = sessionStorage.getItem("alien_visited");
    if (!hasVisited) {
      persistence.incrementViewerCount();
      sessionStorage.setItem("alien_visited", "true");
    }

    // Subscribe to new incoming signals so notifications pop up globally
    const msgSub = persistence.subscribeToMessages((payload) => {
      if (payload.new) {
        toast({
          title: `INCOMING SIGNAL: ${payload.new.sender_name}`,
          description: payload.new.subject || "No subject provided.",
          variant: "default",
          className: "bg-black/90 border border-primary text-primary font-mono",
        });
      }
    });

    return () => {
      msgSub.unsubscribe();
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
