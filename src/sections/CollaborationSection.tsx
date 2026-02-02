import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSections, isCTAArray } from '@/hooks/useData';
import { Icon } from '@/components/Icon';

gsap.registerPlugin(ScrollTrigger);

const CollaborationSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const [copied, setCopied] = useState(false);
  
  const { data: sections } = useSections();
  const data = sections?.collaboration;

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

      scrollTl.fromTo(
        headlineRef.current,
        { y: '10vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0.05
      );

      scrollTl.fromTo(
        bodyRef.current,
        { y: '10vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0.1
      );

      scrollTl.fromTo(
        ctaRef.current,
        { y: '6vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0.18
      );

      scrollTl.fromTo(
        bgRef.current,
        { scale: 1.06, opacity: 1 },
        { scale: 1.14, opacity: 0.35, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        headlineRef.current,
        { y: 0, opacity: 1 },
        { y: '-6vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        bodyRef.current,
        { y: 0, opacity: 1 },
        { y: '-6vh', opacity: 0, ease: 'power2.in' },
        0.72
      );

      scrollTl.fromTo(
        ctaRef.current,
        { y: 0, opacity: 1 },
        { y: '4vh', opacity: 0, ease: 'power2.in' },
        0.76
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const copyEmail = () => {
    if (email) {
      navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!data) return null;

  const email = sections?.contact?.email;
  const ctas = data.ctas && !isCTAArray(data.ctas) ? data.ctas : null;

  return (
    <section ref={sectionRef} className="section-pinned bg-bg-primary">
      <img
        ref={bgRef}
        src={data.backgroundImage}
        alt="Collaboration"
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

        {ctas && (
          <div ref={ctaRef} className="mt-auto mb-[12vh] flex items-center gap-4">
            <a
              href={`mailto:${email}`}
              className="btn-primary flex items-center gap-2"
            >
              {ctas.primary?.label}
              <Icon name="ArrowRight" size={18} />
            </a>
            <button
              onClick={copyEmail}
              className="btn-secondary flex items-center gap-2"
            >
              <Icon name={copied ? 'Check' : 'Copy'} size={18} />
              {copied ? 'Copied!' : ctas.secondary?.label}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CollaborationSection;