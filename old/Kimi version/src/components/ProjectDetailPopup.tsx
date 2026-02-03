import { useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Icon } from '@/components/Icon';
import useEmblaCarousel from 'embla-carousel-react';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  longDescription?: string;
  image: string;
  gallery?: string[];
  stars?: number;
  forks?: number;
  link: string;
  tech: string[];
  youtubeVideo?: string;
  features?: string[];
  status?: string;
}

interface ProjectDetailPopupProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDetailPopup = ({ project, isOpen, onClose }: ProjectDetailPopupProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi && isOpen) {
      emblaApi.scrollTo(0);
    }
  }, [emblaApi, isOpen, project]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!project) return null;

  const galleryImages = project.gallery || [project.image];
  const hasVideo = !!project.youtubeVideo;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-y-auto bg-bg-primary border border-white/10 p-0 gap-0">
        <DialogTitle className="sr-only">{project.title}</DialogTitle>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-all"
        >
          <Icon name="X" size={20} />
        </button>

        <div className="relative">
          {hasVideo ? (
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${project.youtubeVideo}?rel=0`}
                title={`${project.title} video`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="relative">
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                  {galleryImages.map((img, i) => (
                    <div key={i} className="flex-[0_0_100%] min-w-0">
                      <div className="aspect-video relative">
                        <img
                          src={img}
                          alt={`${project.title} screenshot ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={scrollPrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-all"
                  >
                    <Icon name="ChevronLeft" size={24} />
                  </button>
                  <button
                    onClick={scrollNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-all"
                  >
                    <Icon name="ChevronRight" size={24} />
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {galleryImages.map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full bg-white/50"
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {hasVideo && galleryImages.length > 1 && (
            <div className="absolute bottom-4 right-4">
              <button
                onClick={() => window.open(`https://youtube.com/watch?v=${project.youtubeVideo}`, '_blank')}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium transition-colors"
              >
                <Icon name="Play" size={16} />
                Watch on YouTube
              </button>
            </div>
          )}
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 text-xs font-mono uppercase tracking-wider bg-accent-violet/20 text-accent-violet rounded-full">
                  {project.category}
                </span>
                {project.status && (
                  <span className="px-3 py-1 text-xs font-mono uppercase tracking-wider bg-green-500/20 text-green-400 rounded-full">
                    {project.status}
                  </span>
                )}
              </div>
              <h2 className="font-display font-bold text-2xl md:text-3xl text-text-primary">
                {project.title}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              {project.stars !== undefined && (
                <div className="flex items-center gap-1.5 text-text-secondary">
                  <Icon name="Star" size={18} className="text-accent-violet" />
                  <span className="font-medium">{project.stars}</span>
                  <span className="text-sm">stars</span>
                </div>
              )}
              {project.forks !== undefined && (
                <div className="flex items-center gap-1.5 text-text-secondary">
                  <Icon name="GitFork" size={18} className="text-accent-violet" />
                  <span className="font-medium">{project.forks}</span>
                  <span className="text-sm">forks</span>
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-text-secondary leading-relaxed">
              {project.longDescription || project.description}
            </p>
          </div>

          {project.features && project.features.length > 0 && (
            <div className="mb-6">
              <h3 className="font-display font-semibold text-text-primary mb-3">
                Key Features
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {project.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-text-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-violet mt-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mb-8">
            <h3 className="font-display font-semibold text-text-primary mb-3">
              Technologies Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 text-sm font-mono bg-white/5 text-text-secondary rounded-lg border border-white/10"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent-violet hover:bg-accent-violet/90 text-white font-medium rounded-xl transition-colors"
            >
              <Icon name="Github" size={18} />
              View on GitHub
              <Icon name="ExternalLink" size={16} />
            </a>
            {hasVideo && (
              <a
                href={`https://youtube.com/watch?v=${project.youtubeVideo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors"
              >
                <Icon name="Play" size={18} />
                Watch Demo
              </a>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailPopup;