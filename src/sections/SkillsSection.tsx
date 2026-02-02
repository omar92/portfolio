import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSkills, useSections } from '@/hooks/useData';
import { Icon } from '@/components/Icon';

gsap.registerPlugin(ScrollTrigger);

const SkillsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const groupsRef = useRef<HTMLDivElement>(null);
  const highlightsRef = useRef<HTMLDivElement>(null);
  const narrativeRef = useRef<HTMLDivElement>(null);
  
  const { data: skillsData } = useSkills();
  const { data: sections } = useSections();
  
  const data = sections?.skills;
  const skillGroups = skillsData?.skillGroups || [];
  const highlights = skillsData?.highlights || [];

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

      if (groupsRef.current) {
        const groups = groupsRef.current.querySelectorAll('.skill-group');
        groups.forEach((group, i) => {
          const items = group.querySelectorAll('.skill-item');
          const bar = group.querySelectorAll('.skill-bar');

          gsap.fromTo(
            group,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              delay: i * 0.08,
              scrollTrigger: {
                trigger: group,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            }
          );

          gsap.fromTo(
            items,
            { y: 10, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.04,
              duration: 0.4,
              delay: i * 0.08 + 0.15,
              scrollTrigger: {
                trigger: group,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            }
          );

          gsap.fromTo(
            bar,
            { scaleX: 0 },
            {
              scaleX: 1,
              stagger: 0.04,
              duration: 0.5,
              delay: i * 0.08 + 0.2,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: group,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        });
      }

      if (highlightsRef.current) {
        const items = highlightsRef.current.querySelectorAll('.highlight-item');
        gsap.fromTo(
          items,
          { y: 15, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.4,
            scrollTrigger: {
              trigger: highlightsRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      gsap.fromTo(
        narrativeRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          scrollTrigger: {
            trigger: narrativeRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  if (!data) return null;

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="bg-bg-primary py-[8vh] px-[6vw]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h2
            ref={titleRef}
            className="font-display font-bold text-[clamp(34px,3.6vw,52px)] text-text-primary mb-10"
          >
            {data.title}
          </h2>

          <div ref={groupsRef} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {skillGroups.map((group, i) => (
              <div key={i} className="skill-group bg-bg-secondary rounded-xl p-5 border border-white/5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-accent-violet">
                    <Icon name={group.icon} size={20} />
                  </span>
                  <h3 className="font-display font-semibold text-text-primary">
                    {group.title}
                  </h3>
                </div>

                <div className="space-y-3">
                  {group.skills.map((skill, j) => (
                    <div key={j} className="skill-item">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-text-secondary">
                          {skill.name}
                        </span>
                        <span className="text-xs text-text-secondary/60 font-mono">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="skill-bar h-full bg-gradient-to-r from-accent-violet to-accent-violet/70 rounded-full origin-left"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div ref={highlightsRef}>
            <h3 className="font-display font-semibold text-text-primary mb-4">
              Professional Highlights
            </h3>
            <div className="space-y-3">
              {highlights.map((item, i) => (
                <div
                  key={i}
                  className="highlight-item flex items-start gap-3 bg-bg-secondary rounded-lg p-4 border border-white/5"
                >
                  <div className="w-8 h-8 rounded-lg bg-accent-violet/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-accent-violet">
                      <Icon name={item.icon} size={18} />
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-text-primary text-sm">
                      {item.label}
                    </div>
                    <div className="text-xs text-text-secondary/70">
                      {item.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div ref={narrativeRef} className="bg-bg-secondary rounded-xl p-6 border border-white/5">
            <p className="text-base text-text-secondary leading-relaxed">
              {data.narrative}
            </p>

            <div className="mt-6 pt-6 border-t border-white/5">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-2xl font-display font-bold text-accent-violet">10+</div>
                  <div className="text-xs text-text-secondary">Years Experience</div>
                </div>
                <div>
                  <div className="text-2xl font-display font-bold text-accent-violet">47</div>
                  <div className="text-xs text-text-secondary">Public Repos</div>
                </div>
              </div>

              <a
                href="https://github.com/omar92"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-accent-violet font-medium hover:underline text-sm"
              >
                View GitHub Profile
                <Icon name="ArrowRight" size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;