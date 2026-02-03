import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useExperience, useSections, isCTAArray } from '@/hooks/useData';
import { Icon } from '@/components/Icon';

gsap.registerPlugin(ScrollTrigger);

const ExperienceSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  const { data: experienceData } = useExperience();
  const { data: sections } = useSections();
  
  const data = sections?.experience;
  const experiences = experienceData?.experiences || [];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      const line = timelineRef.current?.querySelector('.timeline-line');
      if (line) {
        gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: timelineRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      if (timelineRef.current) {
        const items = timelineRef.current.querySelectorAll('.experience-item');
        items.forEach((item, i) => {
          gsap.fromTo(
            item,
            { x: '-6vw', opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.5,
              delay: i * 0.12,
              scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        });
      }

      gsap.fromTo(
        ctaRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'work':
        return 'Briefcase';
      case 'education':
        return 'GraduationCap';
      case 'achievement':
        return 'Award';
      default:
        return 'Briefcase';
    }
  };

  if (!data) return null;

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="bg-bg-secondary py-[8vh] px-[6vw]"
    >
      <h2
        ref={titleRef}
        className="font-display font-bold text-[clamp(34px,3.6vw,52px)] text-text-primary mb-12"
      >
        {data.title}
      </h2>

      <div ref={timelineRef} className="relative max-w-3xl">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white/10">
          <div className="timeline-line absolute inset-0 bg-accent-violet origin-top" />
        </div>

        <div className="space-y-8 pl-8">
          {experiences.map((exp, i) => (
            <div key={i} className="experience-item relative">
              <div className="absolute -left-[39px] top-1 w-4 h-4 rounded-full bg-bg-secondary border-2 border-accent-violet flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-violet" />
              </div>

              <div className="bg-bg-primary rounded-xl p-5 border border-white/5 hover:border-accent-violet/30 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name={getIcon(exp.type)} size={16} className="text-accent-violet" />
                  <span className="text-xs font-mono uppercase tracking-wider text-accent-violet">
                    {exp.type}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <h3 className="font-display font-semibold text-lg text-text-primary">
                    {exp.title}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-sm font-mono text-text-secondary">
                    <Icon name="Calendar" size={14} />
                    {exp.period}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
                  <span className="font-medium text-text-primary/80">{exp.organization}</span>
                  <span className="text-white/20">•</span>
                  <span className="inline-flex items-center gap-1">
                    <Icon name="MapPin" size={14} />
                    {exp.location}
                  </span>
                </div>

                {exp.description && (
                  <p className="text-sm text-text-secondary/80 leading-relaxed">
                    {exp.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div ref={ctaRef} className="mt-12 flex flex-wrap gap-4">
        {data.ctas && isCTAArray(data.ctas) && data.ctas.map((cta, i) => (
          <a
            key={i}
            href={cta.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 ${cta.variant === 'primary' ? 'btn-primary' : 'btn-secondary'}`}
          >
            {cta.icon && <Icon name={cta.icon} size={18} />}
            {cta.label}
          </a>
        ))}
      </div>
    </section>
  );
};

export default ExperienceSection;