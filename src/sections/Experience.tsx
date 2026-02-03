import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, GraduationCap, Calendar, MapPin } from 'lucide-react';
import data from '../data/portfolio.json';

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section label
      gsap.fromTo(
        '.experience-label',
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
        }
      );

      // Headline
      gsap.fromTo(
        '.experience-headline',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
          delay: 0.1,
        }
      );

      // Timeline line draw
      gsap.fromTo(
        '.timeline-line',
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.5,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 80%',
          },
        }
      );

      // Experience items
      gsap.utils.toArray<HTMLElement>('.experience-item').forEach((item, index) => {
        const isLeft = index % 2 === 0;

        gsap.fromTo(
          item,
          {
            opacity: 0,
            x: isLeft ? -100 : 100,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
            },
          }
        );

        // Dot animation
        gsap.fromTo(
          item.querySelector('.timeline-dot'),
          { scale: 0 },
          {
            scale: 1,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
            },
            delay: 0.2,
          }
        );
      });

      // Education items
      gsap.utils.toArray<HTMLElement>('.education-item').forEach((item, index) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 90%',
            },
            delay: index * 0.1,
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-black"
    >
      <div className="w-full px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="experience-label text-sm text-red-600 tracking-[0.2em] uppercase mb-4">
            Experience
          </p>
          <h2
            className="experience-headline text-4xl sm:text-5xl lg:text-6xl font-bold text-white"
            style={{ fontFamily: "'Big Shoulders Display', sans-serif" }}
          >
            My <span className="text-red-600">Journey</span>
          </h2>
        </div>

        {/* Work Experience Timeline */}
        <div ref={timelineRef} className="relative max-w-5xl mx-auto mb-20">
          {/* Timeline Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-white/10 -translate-x-1/2">
            <div className="timeline-line absolute inset-0 bg-gradient-to-b from-red-600 via-red-600 to-red-600/30 origin-top" />
          </div>

          {/* Experience Items */}
          <div className="space-y-12">
            {data.experience.map((exp, index) => (
              <div
                key={exp.id}
                className={`experience-item relative grid md:grid-cols-2 gap-8 ${
                  index % 2 === 0 ? '' : 'md:text-right'
                }`}
              >
                {/* Timeline Dot */}
                <div className="timeline-dot absolute left-4 md:left-1/2 top-0 -translate-x-1/2 w-4 h-4 bg-red-600 rounded-full border-4 border-black pulse-glow z-10" />

                {/* Content */}
                <div
                  className={`pl-12 md:pl-0 ${
                    index % 2 === 0 ? 'md:pr-12' : 'md:col-start-2 md:pl-12'
                  }`}
                >
                  <div
                    className={`p-6 bg-zinc-900/50 border border-white/5 rounded-2xl hover:border-red-600/30 transition-all card-lift ${
                      index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'
                    }`}
                  >
                    {/* Header */}
                    <div className={`flex items-start gap-4 mb-4 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                      <div className="p-3 bg-red-600/10 rounded-xl">
                        <Briefcase size={24} className="text-red-600" />
                      </div>
                      <div className={index % 2 === 0 ? '' : 'md:text-right'}>
                        <h3 className="text-xl font-bold text-white mb-1">
                          {exp.position}
                        </h3>
                        <a
                          href={exp.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-500 hover:text-red-400 transition-colors"
                        >
                          {exp.company}
                        </a>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className={`flex flex-wrap gap-4 mb-4 text-sm text-white/50 ${index % 2 === 0 ? '' : 'md:justify-end'}`}>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>

                    {/* Description */}
                    <ul className={`space-y-2 mb-4 ${index % 2 === 0 ? '' : 'md:text-right'}`}>
                      {exp.description.map((desc, i) => (
                        <li key={i} className="text-white/70 text-sm leading-relaxed">
                          {desc}
                        </li>
                      ))}
                    </ul>

                    {/* Skills */}
                    <div className={`flex flex-wrap gap-2 ${index % 2 === 0 ? '' : 'md:justify-end'}`}>
                      {exp.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-white/5 rounded text-xs text-white/60"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Empty column for alternating layout */}
                {index % 2 === 0 ? (
                  <div className="hidden md:block" />
                ) : null}
              </div>
            ))}
          </div>
        </div>

        {/* Education Section */}
        <div className="max-w-4xl mx-auto">
          <h3
            className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center"
            style={{ fontFamily: "'Big Shoulders Display', sans-serif" }}
          >
            Education
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {data.education.map((edu) => (
              <div
                key={edu.id}
                className="education-item p-6 bg-zinc-900/50 border border-white/5 rounded-2xl hover:border-red-600/30 transition-all card-lift"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-red-600/10 rounded-xl">
                    <GraduationCap size={24} className="text-red-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">
                      {edu.school}
                    </h4>
                    <p className="text-red-500 text-sm">
                      {edu.degree} in {edu.field}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-3 text-sm text-white/50">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {edu.startYear} - {edu.endYear}
                  </span>
                  {edu.grade && (
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {edu.grade}
                    </span>
                  )}
                </div>

                {edu.project && (
                  <p className="text-white/60 text-sm">
                    <span className="text-white/40">Project:</span>{' '}
                    <span className="text-red-400">{edu.project}</span>
                  </p>
                )}

                {edu.details && (
                  <p className="text-white/50 text-sm mt-2">{edu.details}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
