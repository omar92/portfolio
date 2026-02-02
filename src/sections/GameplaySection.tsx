import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSections, isCTAArray } from '@/hooks/useData';
import { Icon } from '@/components/Icon';

gsap.registerPlugin(ScrollTrigger);

const GameplaySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  
  const { data: sections } = useSections();
  const data = sections?.gameplayEngineer;

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
        { scale: 1.18, x: '-10vw', opacity: 0.6 },
        { scale: 1.06, x: 0, opacity: 1, ease: 'none' },
        0
      );

      if (headlineRef.current) {
        const chars = headlineRef.current.querySelectorAll('.char');
        scrollTl.fromTo(
          chars,
          { x: '-12vw', opacity: 0, rotate: -2 },
          { x: 0, opacity: 1, rotate: 0, stagger: 0.01, ease: 'power2.out' },
          0.05
        );
      }

      if (badgesRef.current) {
        const badges = badgesRef.current.querySelectorAll('.badge');
        scrollTl.fromTo(
          badges,
          { y: '6vh', opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, stagger: 0.06, ease: 'power2.out' },
          0.12
        );
      }

      scrollTl.fromTo(
        bodyRef.current,
        { y: '8vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0.18
      );

      scrollTl.fromTo(
        ctaRef.current,
        { y: '8vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0.22
      );

      scrollTl.fromTo(
        bgRef.current,
        { scale: 1.06, x: 0, opacity: 1 },
        { scale: 1.14, x: '6vw', opacity: 0.35, ease: 'power2.in' },
        0.7
      );

      if (headlineRef.current) {
        const chars = headlineRef.current.querySelectorAll('.char');
        scrollTl.fromTo(
          chars,
          { x: 0, opacity: 1 },
          { x: '-18vw', opacity: 0, stagger: 0.005, ease: 'power2.in' },
          0.7
        );
      }

      if (badgesRef.current) {
        const badges = badgesRef.current.querySelectorAll('.badge');
        scrollTl.fromTo(
          badges,
          { y: 0, opacity: 1 },
          { y: '-4vh', opacity: 0, stagger: 0.03, ease: 'power2.in' },
          0.72
        );
      }

      scrollTl.fromTo(
        bodyRef.current,
        { y: 0, opacity: 1 },
        { y: '6vh', opacity: 0, ease: 'power2.in' },
        0.74
      );

      scrollTl.fromTo(
        ctaRef.current,
        { y: 0, opacity: 1 },
        { y: '6vh', opacity: 0, ease: 'power2.in' },
        0.76
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  if (!data) return null;

  const headlineText = data.headline || '';

  return (
    <section ref={sectionRef} className="section-pinned bg-bg-primary">
      <img
        ref={bgRef}
        src={data.backgroundImage}
        alt="Gameplay engineering"
        className="pinned-bg"
      />

      <div className="absolute inset-0 vignette pointer-events-none" />

      <div className="absolute inset-0 flex flex-col justify-start p-[6vw] pt-[18vh]">
        <h2
          ref={headlineRef}
          className="font-display font-bold text-[clamp(34px,3.6vw,52px)] text-text-primary leading-[1.05] tracking-[-0.02em] text-shadow max-w-[46vw]"
        >
          {headlineText.split('').map((char, i) => (
            <span key={i} className="char inline-block" style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}>
              {char}
            </span>
          ))}
        </h2>

        <div ref={badgesRef} className="flex flex-wrap gap-3 mt-10">
          {data.badges?.map((badge) => (
            <span key={badge} className="badge pill">
              {badge}
            </span>
          ))}
        </div>

        <p
          ref={bodyRef}
          className="mt-8 text-lg text-text-secondary leading-relaxed max-w-[38vw]"
        >
          {data.description}
        </p>

        {data.ctas && !isCTAArray(data.ctas) && (
          <a
            ref={ctaRef}
            href="#projects"
            className="mt-auto mb-[12vh] inline-flex items-center gap-2 text-accent-violet font-medium hover:underline"
          >
            {data.ctas.primary?.label}
            <Icon name="ArrowRight" size={18} />
          </a>
        )}
      </div>
    </section>
  );
};

export default GameplaySection;