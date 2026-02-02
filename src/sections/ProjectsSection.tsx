import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useProjects, useSections, type Project } from '@/hooks/useData';
import { Icon } from '@/components/Icon';
import ProjectDetailPopup from '@/components/ProjectDetailPopup';

gsap.registerPlugin(ScrollTrigger);

type Category = 'all' | 'games' | 'tools' | 'ai' | 'multiplayer';

const ProjectsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<Category>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  const { data: projectsData } = useProjects();
  const { data: sections } = useSections();
  
  const data = sections?.projects;
  const projects = projectsData?.projects || [];
  const categories = projectsData?.categories || [];

  const filteredProjects =
    activeFilter === 'all'
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  const totalStars = projects.reduce((acc, p) => acc + (p.stars || 0), 0);
  const totalForks = projects.reduce((acc, p) => acc + (p.forks || 0), 0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      if (statsRef.current) {
        const statItems = statsRef.current.querySelectorAll('.stat-box');
        gsap.fromTo(
          statItems,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.5,
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('.project-card');
        cards.forEach((card, i) => {
          gsap.fromTo(
            card,
            { y: 40, opacity: 0, scale: 0.98 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.5,
              delay: i * 0.06,
              scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [filteredProjects]);

  const openProject = (project: Project) => {
    setSelectedProject(project);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  if (!data) return null;

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="bg-bg-secondary py-[8vh] px-[6vw]"
    >
      <div ref={headerRef} className="mb-8">
        <h2 className="font-display font-bold text-[clamp(34px,3.6vw,52px)] text-text-primary">
          {data.title}
        </h2>
        <p className="mt-3 text-text-secondary max-w-2xl">
          {data.description}
        </p>
      </div>

      <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="stat-box bg-bg-primary rounded-xl p-4 border border-white/5">
          <div className="text-2xl font-display font-bold text-accent-violet">47</div>
          <div className="text-sm text-text-secondary">Public Repos</div>
        </div>
        <div className="stat-box bg-bg-primary rounded-xl p-4 border border-white/5">
          <div className="text-2xl font-display font-bold text-accent-violet">{totalStars}+</div>
          <div className="text-sm text-text-secondary">GitHub Stars</div>
        </div>
        <div className="stat-box bg-bg-primary rounded-xl p-4 border border-white/5">
          <div className="text-2xl font-display font-bold text-accent-violet">{totalForks}+</div>
          <div className="text-sm text-text-secondary">Forks</div>
        </div>
        <div className="stat-box bg-bg-primary rounded-xl p-4 border border-white/5">
          <div className="text-2xl font-display font-bold text-accent-violet">10+</div>
          <div className="text-sm text-text-secondary">Years Active</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveFilter(cat.id as Category)}
            className={`filter-chip flex items-center gap-2 ${activeFilter === cat.id ? 'active' : ''}`}
          >
            <Icon name={cat.icon} size={16} />
            {cat.label}
          </button>
        ))}
      </div>

      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[clamp(14px,1.6vw,22px)]"
      >
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => openProject(project)}
            className="project-card group relative bg-bg-primary rounded-2xl overflow-hidden shadow-card cursor-pointer"
          >
            <div className="aspect-[4/3] overflow-hidden relative">
              <img
                src={project.image}
                alt={project.title}
                className="project-thumb w-full h-full object-cover transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {project.youtubeVideo && (
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-600/90 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
            </div>

            <div className="p-4 flex flex-col flex-grow">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-display font-semibold text-base text-text-primary group-hover:text-accent-violet transition-colors line-clamp-1">
                  {project.title}
                </h3>
                <Icon name="ExternalLink" size={16} className="text-text-secondary flex-shrink-0 mt-0.5" />
              </div>

              <p className="text-sm text-text-secondary line-clamp-2 mb-3 flex-grow">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {project.tech.slice(0, 3).map((tech, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-xs font-mono bg-white/5 text-text-secondary/80 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                {project.stars !== undefined && (
                  <div className="flex items-center gap-1 text-xs text-text-secondary">
                    <Icon name="Star" size={12} className="text-accent-violet" />
                    {project.stars}
                  </div>
                )}
                {project.forks !== undefined && (
                  <div className="flex items-center gap-1 text-xs text-text-secondary">
                    <Icon name="GitFork" size={12} className="text-accent-violet" />
                    {project.forks}
                  </div>
                )}
                <span className="ml-auto text-xs font-mono uppercase tracking-wider text-text-secondary/50">
                  {project.category}
                </span>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-violet transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <a
          href={data.viewAllLink?.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-accent-violet font-medium hover:underline"
        >
          {data.viewAllLink?.label}
          <Icon name="ExternalLink" size={16} />
        </a>
      </div>

      <ProjectDetailPopup
        project={selectedProject}
        isOpen={isPopupOpen}
        onClose={closePopup}
      />
    </section>
  );
};

export default ProjectsSection;