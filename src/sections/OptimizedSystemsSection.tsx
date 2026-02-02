import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSections } from '@/hooks/useData';

gsap.registerPlugin(ScrollTrigger);

const OptimizedSystemsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  
  const { data: sections } = useSections();
  const data = sections?.optimizedSystems;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        },
      });

      scrollTl.fromTo(
        bgRef.current,
        { scale: 1.18, opacity: 0.6 },
        { scale: 1.06, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        headlineRef.current,
        { x: '-14vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'power2.out' },
        0.05
      );

      scrollTl.fromTo(
        bodyRef.current,
        { y: '6vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0.12
      );

      if (statsRef.current) {
        const stats = statsRef.current.querySelectorAll('.stat-item');
        const lines = statsRef.current.querySelectorAll('.stat-line');

        scrollTl.fromTo(
          stats,
          { y: '8vh', opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.1, ease: 'power2.out' },
          0.18
        );

        scrollTl.fromTo(
          lines,
          { scaleX: 0 },
          { scaleX: 1, stagger: 0.1, ease: 'power2.out' },
          0.18
        );
      }

      scrollTl.fromTo(
        bgRef.current,
        { scale: 1.06, opacity: 1 },
        { scale: 1.14, opacity: 0.35, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        headlineRef.current,
        { x: 0, opacity: 1 },
        { x: '-10vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        bodyRef.current,
        { y: 0, opacity: 1 },
        { y: '4vh', opacity: 0, ease: 'power2.in' },
        0.72
      );

      if (statsRef.current) {
        const stats = statsRef.current.querySelectorAll('.stat-item');
        scrollTl.fromTo(
          stats,
          { y: 0, opacity: 1 },
          { y: '4vh', opacity: 0, stagger: 0.05, ease: 'power2.in' },
          0.76
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  if (!data) return null;

  return (
    <section ref={sectionRef} className="section-pinned bg-bg-primary">
      <img
        ref={bgRef}
        src={data.backgroundImage}
        alt="Optimized Systems"
        className="pinned-bg"
      />

      <div className="absolute inset-0 vignette pointer-events-none" />

      <div className="absolute inset-0 flex flex-col justify-start p-[6vw] pt-[18vh]">
        <h2
          ref={headlineRef}
          className="font-display font-bold text-[clamp(34px,3.6vw,52px)] text-text-primary leading-[1.05] tracking-[-0.02em] text-shadow"
        >
          {data.headline}
        </h2>

        <p
          ref={bodyRef}
          className="mt-8 text-lg text-text-secondary leading-relaxed max-w-[40vw]"
        >
          {data.description}
        </p>

        <div ref={statsRef} className="mt-auto mb-[12vh] flex gap-12">
          {data.stats?.map((stat, i) => (
            <div key={i} className="stat-item">
              <div className="stat-line w-10 h-0.5 bg-accent-violet mb-4 origin-left" />
              <div className="font-display font-bold text-3xl text-text-primary">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-text-secondary">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OptimizedSystemsSection;