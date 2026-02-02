import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSections } from '@/hooks/useData';
import { Icon } from '@/components/Icon';

gsap.registerPlugin(ScrollTrigger);

const AIToolsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  
  const { data: sections } = useSections();
  const data = sections?.aiTools;

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
        { scale: 1.18, x: '10vw', opacity: 0.6 },
        { scale: 1.06, x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        headlineRef.current,
        { y: '10vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0.05
      );

      scrollTl.fromTo(
        subheadlineRef.current,
        { y: '6vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0.12
      );

      scrollTl.fromTo(
        bodyRef.current,
        { y: '6vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0.18
      );

      if (featuresRef.current) {
        const items = featuresRef.current.querySelectorAll('.feature-item');
        scrollTl.fromTo(
          items,
          { x: '-6vw', opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.06, ease: 'power2.out' },
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
        { y: 0, opacity: 1 },
        { y: '-8vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        subheadlineRef.current,
        { y: 0, opacity: 1 },
        { y: '4vh', opacity: 0, ease: 'power2.in' },
        0.72
      );

      scrollTl.fromTo(
        bodyRef.current,
        { y: 0, opacity: 1 },
        { y: '4vh', opacity: 0, ease: 'power2.in' },
        0.74
      );

      if (featuresRef.current) {
        const items = featuresRef.current.querySelectorAll('.feature-item');
        scrollTl.fromTo(
          items,
          { x: 0, opacity: 1 },
          { x: '-4vw', opacity: 0, stagger: 0.03, ease: 'power2.in' },
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
        alt="AI and Tools"
        className="pinned-bg"
      />

      <div className="absolute inset-0 vignette pointer-events-none" />

      <div className="absolute inset-0 flex flex-col justify-start p-[6vw] pt-[18vh]">
        <h2
          ref={headlineRef}
          className="font-display font-bold text-[clamp(34px,3.6vw,52px)] text-text-primary leading-[1.05] tracking-[-0.02em] text-shadow max-w-[44vw]"
        >
          {data.headline}
        </h2>

        <p
          ref={subheadlineRef}
          className="mt-6 text-xl text-accent-violet font-medium"
        >
          {data.subheadline}
        </p>

        <p
          ref={bodyRef}
          className="mt-4 text-lg text-text-secondary leading-relaxed max-w-[40vw]"
        >
          {data.description}
        </p>

        <div ref={featuresRef} className="mt-auto mb-[12vh] grid grid-cols-2 gap-x-8 gap-y-4 max-w-[40vw]">
          {data.features?.map((feature, i) => (
            <div key={i} className="feature-item flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-accent-violet/20 flex items-center justify-center">
                <Icon name="Check" size={12} className="text-accent-violet" />
              </div>
              <span className="text-sm text-text-secondary">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIToolsSection;