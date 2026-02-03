import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Github, Play, Star, GitFork } from 'lucide-react';
import data from '../data/portfolio.json';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: string;
  name: string;
  category: string;
  image: string;
  tags: string[];
  filterTags: string[];
  shortDescription: string;
  description: string;
  links: Array<{ text: string; url: string; type: string }>;
  features?: string[];
  videos?: string[];
  subProjects?: Array<{ title: string; tags: string[]; description: string }>;
  stats?: { stars?: number; forks?: number };
}

const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState('All');

  const filters = ['All', 'Unity', 'VR', 'Mobile', 'AI', 'Web', 'Open Source'];

  const filteredProjects = filter === 'All'
    ? data.projects
    : data.projects.filter((p) => p.filterTags.includes(filter));

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section label
      gsap.fromTo(
        '.projects-label',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );

      // Headline
      gsap.fromTo(
        '.projects-headline',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
          delay: 0.1,
        }
      );

      // Description
      gsap.fromTo(
        '.projects-description',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
          delay: 0.3,
        }
      );

      // Filter buttons
      gsap.fromTo(
        '.filter-btn',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '.filter-container',
            start: 'top 80%',
          },
        }
      );

      // Project cards
      gsap.fromTo(
        '.project-card',
        { opacity: 0, y: 50, rotateY: -15 },
        {
          opacity: 1,
          y: 0,
          rotateY: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '.projects-grid',
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const getProjectImage = (project: Project) => {
    if (project.image.startsWith('http')) {
      return project.image;
    }
    // Fallback images for projects without proper images
    const fallbacks: Record<string, string> = {
      '3ashara-talwa': 'https://images.unsplash.com/photo-1611996908543-160275cc2f11?w=800&q=80',
      'estimation-kings': 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=800&q=80',
      'rhythm-attack': 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=80',
      'zinad-games': 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
      'unity-scroll': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
      'cityville': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
    };
    return fallbacks[project.id] || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80';
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-black"
    >
      <div className="w-full px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="projects-label text-sm text-red-600 tracking-[0.2em] uppercase mb-4">
            My Work
          </p>
          <h2
            className="projects-headline text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: "'Big Shoulders Display', sans-serif" }}
          >
            Featured <span className="text-red-600">Projects</span>
          </h2>
          <p className="projects-description text-white/60 max-w-2xl mx-auto">
            A selection of games and interactive experiences I&apos;ve crafted throughout my career
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="filter-container flex flex-wrap justify-center gap-2 mb-12">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`filter-btn px-4 py-2 text-sm font-medium rounded-full transition-all ${
                filter === f
                  ? 'bg-red-600 text-white'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="project-card group cursor-pointer"
              onClick={() => setSelectedProject(project as Project)}
              style={{ perspective: '1000px' }}
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden rounded-t-xl">
                <img
                  src={getProjectImage(project as Project)}
                  alt={project.name}
                  className="project-image w-full h-full object-cover"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                
                {/* Stats badge */}
                {(project as Project).stats?.stars && (
                  <div className="absolute top-3 right-3 flex items-center gap-3">
                    <span className="flex items-center gap-1 px-2 py-1 bg-black/60 rounded-full text-xs text-yellow-400">
                      <Star size={12} fill="currentColor" />
                      {(project as Project).stats?.stars}
                    </span>
                    {(project as Project).stats?.forks && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-black/60 rounded-full text-xs text-white/70">
                        <GitFork size={12} />
                        {(project as Project).stats?.forks}
                      </span>
                    )}
                  </div>
                )}

                {/* Category badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-red-600/80 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-600 transition-colors">
                  {project.name}
                </h3>
                <p className="text-white/60 text-sm line-clamp-2 mb-4">
                  {project.shortDescription}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-white/5 rounded text-xs text-white/50"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="px-2 py-1 bg-white/5 rounded text-xs text-white/50">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Detail Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-zinc-900 border-white/10 text-white">
          {selectedProject && (
            <>
              {/* Header Image */}
              <div className="relative aspect-video -mx-6 -mt-6 mb-6 overflow-hidden">
                <img
                  src={getProjectImage(selectedProject)}
                  alt={selectedProject.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
              </div>

              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-red-600/20 border border-red-600/30 rounded-full text-xs font-medium text-red-400">
                    {selectedProject.category}
                  </span>
                  {selectedProject.stats?.stars && (
                    <span className="flex items-center gap-1 text-xs text-yellow-400">
                      <Star size={14} fill="currentColor" />
                      {selectedProject.stats.stars} stars
                    </span>
                  )}
                </div>
                <DialogTitle
                  className="text-3xl font-bold text-white"
                  style={{ fontFamily: "'Big Shoulders Display', sans-serif" }}
                >
                  {selectedProject.name}
                </DialogTitle>
                <DialogDescription className="text-white/60">
                  {selectedProject.description}
                </DialogDescription>
              </DialogHeader>

              {/* Features */}
              {selectedProject.features && (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-3">
                    Key Features
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedProject.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-white/70"
                      >
                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sub-projects */}
              {selectedProject.subProjects && (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-3">
                    Included Games
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedProject.subProjects.map((sub, index) => (
                      <div
                        key={index}
                        className="p-3 bg-white/5 rounded-lg border border-white/5"
                      >
                        <h5 className="font-medium text-white mb-1">{sub.title}</h5>
                        <p className="text-xs text-white/50">{sub.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Videos */}
              {selectedProject.videos && selectedProject.videos.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-3">
                    Videos
                  </h4>
                  <div className="grid gap-4">
                    {selectedProject.videos.map((video, index) => (
                      <div key={index} className="aspect-video rounded-lg overflow-hidden">
                        <iframe
                          src={video}
                          title={`Video ${index + 1}`}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-3">
                  Technologies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-white/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              {selectedProject.links.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {selectedProject.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${
                        link.type === 'github'
                          ? 'bg-white/10 text-white hover:bg-white/20'
                          : link.type === 'store'
                          ? 'bg-green-600/20 text-green-400 border border-green-600/30 hover:bg-green-600/30'
                          : 'bg-red-600 text-white hover:bg-red-700'
                      }`}
                    >
                      {link.type === 'github' && <Github size={18} />}
                      {link.type === 'store' && <Play size={18} />}
                      {link.type !== 'github' && link.type !== 'store' && <ExternalLink size={18} />}
                      {link.text}
                    </a>
                  ))}
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Projects;
