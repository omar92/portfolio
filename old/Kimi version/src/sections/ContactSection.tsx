import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSections, isCTAArray } from '@/hooks/useData';
import { Icon } from '@/components/Icon';

gsap.registerPlugin(ScrollTrigger);

const ContactSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  
  const { data: sections } = useSections();
  const data = sections?.contact;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: 24, opacity: 0 },
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

      gsap.fromTo(
        bodyRef.current,
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          delay: 0.1,
          scrollTrigger: {
            trigger: bodyRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        buttonsRef.current,
        { scale: 0.98, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          delay: 0.2,
          scrollTrigger: {
            trigger: buttonsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        footerRef.current,
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          delay: 0.3,
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const copyEmail = () => {
    if (data?.email) {
      navigator.clipboard.writeText(data.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!data) return null;

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="bg-bg-primary py-[10vh] px-[6vw]"
    >
      <div className="max-w-2xl mx-auto text-center">
        <h2
          ref={titleRef}
          className="font-display font-bold text-[clamp(34px,3.6vw,52px)] text-text-primary"
        >
          {data.title}
        </h2>

        <div ref={bodyRef} className="mt-6">
          <p className="text-lg text-text-secondary">
            {data.description}
          </p>

          <a
            href={`mailto:${data.email}`}
            className="inline-block mt-4 text-xl text-accent-violet font-medium hover:underline"
          >
            {data.email}
          </a>
        </div>

        {data.ctas && !isCTAArray(data.ctas) && (
          <div
            ref={buttonsRef}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href={`mailto:${data.email}`}
              className="btn-primary flex items-center gap-2"
            >
              <Icon name="Mail" size={18} />
              {data.ctas.primary?.label}
              <Icon name="ArrowRight" size={18} />
            </a>
            <button
              onClick={copyEmail}
              className="btn-secondary flex items-center gap-2"
            >
              <Icon name={copied ? 'Check' : 'Copy'} size={18} />
              {copied ? 'Copied!' : data.ctas.secondary?.label}
            </button>
          </div>
        )}

        <div className="mt-12 flex items-center justify-center gap-6">
          {data.socials?.map((social) => (
            <a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon text-text-secondary hover:text-accent-violet"
            >
              <Icon name={social.platform} size={24} />
            </a>
          ))}
        </div>
      </div>

      <div
        ref={footerRef}
        className="mt-20 pt-8 border-t border-white/5 text-center"
      >
        <p className="text-sm text-text-secondary/60">
          {data.footer}
        </p>
      </div>
    </section>
  );
};

export default ContactSection;