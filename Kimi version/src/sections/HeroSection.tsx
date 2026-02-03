import { useEffect, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSections, isCTAArray } from '@/hooks/useData';
import { Icon } from '@/components/Icon';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  
  const { data: sections } = useSections();
  const hero = sections?.hero;

  // Auto-play entrance animation on load
  useEffect(() => {
    if (!hero) return;
    
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      tl.fromTo(
        bgRef.current,
        { opacity: 0, scale: 1.12 },
        { opacity: 1, scale: 1.06, duration: 1.2 },
        0
      );

      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll('.word');
        tl.fromTo(
          words,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.028 },
          0.2
        );
      }

      tl.fromTo(
        pillRef.current,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        0.5
      );

      tl.fromTo(
        ctaRef.current,
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        0.65
      );

      tl.fromTo(
        metaRef.current,
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        0.75
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [hero]);

  // Scroll-driven exit animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            gsap.set([headlineRef.current, pillRef.current, ctaRef.current, metaRef.current], {
              opacity: 1,
              x: 0,
              y: 0,
            });
            gsap.set(bgRef.current, { scale: 1.06, x: 0 });
          }
        },
      });

      scrollTl.fromTo(
        headlineRef.current,
        { x: 0, opacity: 1 },
        { x: '-28vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        pillRef.current,
        { y: 0, opacity: 1 },
        { y: '10vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        ctaRef.current,
        { y: 0, opacity: 1 },
        { y: '10vh', opacity: 0, ease: 'power2.in' },
        0.72
      );

      scrollTl.fromTo(
        metaRef.current,
        { y: 0, opacity: 1 },
        { y: '10vh', opacity: 0, ease: 'power2.in' },
        0.74
      );

      scrollTl.fromTo(
        bgRef.current,
        { scale: 1.06, x: 0 },
        { scale: 1.18, x: '-6vw', ease: 'none' },
        0.7
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!hero) return null;

  const headlineWords = hero.headline?.split(' ') || [];

  return (
    <section ref={sectionRef} className="section-pinned bg-bg-primary">
      <img
        ref={bgRef}
        src={hero.backgroundImage}
        alt="Hero background"
        className="pinned-bg"
        style={{ opacity: 0 }}
      />

      <div className="absolute inset-0 vignette pointer-events-none" />

      <div className="absolute inset-0 flex flex-col justify-between p-[6vw] pt-[10vh] pb-[10vh]">
        <div className="max-w-[44vw]">
          <h1
            ref={headlineRef}
            className="font-display font-bold text-[clamp(44px,5vw,76px)] text-text-primary leading-[0.95] tracking-[-0.02em] text-shadow"
          >
            {headlineWords.map((word, i) => (
              <span key={i} className="word inline-block mr-[0.3em]">
                {word}
              </span>
            ))}
          </h1>

          <div ref={pillRef} className="mt-8">
            <span className="pill">{hero.role}</span>
          </div>
        </div>

        <div ref={ctaRef} className="flex items-center gap-4">
          {hero.ctas && !isCTAArray(hero.ctas) && (
            <>
              <button onClick={scrollToProjects} className="btn-primary flex items-center gap-2">
                {hero.ctas.primary?.label}
                <Icon name="ArrowRight" size={18} />
              </button>
              <a
                href={hero.ctas.secondary?.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex items-center gap-2"
              >
                <Icon name="Download" size={18} />
                {hero.ctas.secondary?.label}
              </a>
            </>
          )}
        </div>

        <div ref={metaRef} className="absolute right-[6vw] bottom-[10vh] text-right">
          <p className="text-sm text-text-secondary font-mono uppercase tracking-[0.14em]">
            {hero.meta?.location}
          </p>
          <p className="text-sm text-text-secondary font-mono uppercase tracking-[0.14em] mt-1">
            {hero.meta?.availability}
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;