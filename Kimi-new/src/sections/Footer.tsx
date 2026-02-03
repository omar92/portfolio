import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, Linkedin, Twitter, Heart } from 'lucide-react';
import data from '../data/portfolio.json';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Brand background
      gsap.fromTo(
        '.footer-brand-bg',
        { opacity: 0, scale: 0.9 },
        {
          opacity: 0.03,
          scale: 1,
          duration: 1,
          ease: 'smooth',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
          },
        }
      );

      // Links
      gsap.fromTo(
        '.footer-link',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
          },
          delay: 0.2,
        }
      );

      // Social icons
      gsap.fromTo(
        '.footer-social',
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          stagger: 0.05,
          ease: 'elastic.out(1, 0.5)',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
          },
          delay: 0.6,
        }
      );

      // Copyright
      gsap.fromTo(
        '.footer-copyright',
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5,
          ease: 'smooth',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
          },
          delay: 0.8,
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#projects', label: 'Projects' },
    { href: '#experience', label: 'Experience' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <footer
      ref={footerRef}
      className="relative py-16 bg-black border-t border-white/5 overflow-hidden"
    >
      {/* Large brand name background */}
      <div
        className="footer-brand-bg absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{ fontFamily: "'Big Shoulders Display', sans-serif" }}
      >
        <span className="text-[20vw] font-black text-white whitespace-nowrap">
          OmarSleam
        </span>
      </div>

      <div className="relative z-10 w-full px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Top Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            {/* Brand */}
            <div className="text-center md:text-left">
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('#home');
                }}
                className="text-3xl font-bold"
                style={{ fontFamily: "'Big Shoulders Display', sans-serif" }}
              >
                <span className="text-white">Omar</span>
                <span className="text-red-600">Sleam</span>
              </a>
              <p className="text-white/50 text-sm mt-1">{data.personal.title}</p>
            </div>

            {/* Navigation */}
            <nav className="flex flex-wrap justify-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.href);
                  }}
                  className="footer-link text-sm text-white/60 hover:text-white transition-colors link-underline"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href={data.personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social p-2.5 bg-white/5 rounded-lg text-white/60 hover:text-white hover:bg-red-600/20 transition-all"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href={data.personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social p-2.5 bg-white/5 rounded-lg text-white/60 hover:text-white hover:bg-red-600/20 transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href={data.personal.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social p-2.5 bg-white/5 rounded-lg text-white/60 hover:text-white hover:bg-red-600/20 transition-all"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-white/10 mb-8" />

          {/* Bottom Section */}
          <div className="footer-copyright flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/40">
            <p className="flex items-center gap-1">
              &copy; {new Date().getFullYear()} Omar Sleam. Made with
              <Heart size={14} className="text-red-600 fill-red-600" />
            </p>
            <p>All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
