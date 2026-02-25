import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import BinaryRain from "@/components/BinaryRain";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";
import TopNav from "@/components/TopNav";
import { persistence, Project } from "@/utils/persistence";

const Projects = () => {
  const [projectList, setProjectList] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await persistence.getProjects();
      setProjectList(data);
    };
    fetchProjects();
  }, []);

  return (
    <PageTransition>
      <BinaryRain />
      <div className="relative z-10 min-h-screen px-4 sm:px-6 py-20 lg:py-16">
        <BackButton />
        <TopNav />
        <div className="max-w-5xl mx-auto">
          <motion.h1
            className="font-display text-xl md:text-2xl lg:text-3xl neon-text mb-2 tracking-widest text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            // SPECIMEN ARCHIVE
          </motion.h1>
          <motion.p
            className="text-muted-foreground text-xs sm:text-sm text-center mb-10 md:mb-12 font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            &gt; Catalogued experiments and deployed constructs_
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {projectList.map((project, i) => (
              <motion.div
                key={project.id}
                className="glass-panel scanline p-5 sm:p-6 neon-border group cursor-pointer flex flex-col"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="h-0.5 sm:h-1 w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent mb-4" />
                <h3 className="font-display text-xs sm:text-sm neon-text mb-3 tracking-wider">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-[10px] sm:text-xs leading-relaxed mb-4 flex-1">
                  {project.desc}
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 sm:py-1 border border-primary/20 text-primary/70 font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4 text-muted-foreground group-hover:text-primary transition-colors">
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                      <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4 hover:text-primary transition-colors cursor-pointer" />
                    </a>
                  )}
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 hover:text-primary transition-colors cursor-pointer" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Projects;
