import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ChevronDown, Github, Linkedin, Twitter } from 'lucide-react';
import data from '../data/portfolio.json';

const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
  }>>([]);

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const particleCount = window.innerWidth < 768 ? 30 : 60;
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3 - 0.1,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
    }));

    let animationId: number;
    let frameCount = 0;

    const animate = () => {
      frameCount++;
      // Render every 2nd frame for performance (30fps)
      if (frameCount % 2 === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particlesRef.current.forEach((particle) => {
          particle.x += particle.vx;
          particle.y += particle.vy;

          // Wrap around screen
          if (particle.x < 0) particle.x = canvas.width;
          if (particle.x > canvas.width) particle.x = 0;
          if (particle.y < 0) particle.y = canvas.height;
          if (particle.y > canvas.height) particle.y = 0;

          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
          ctx.fill();
        });
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 });

      // Background Ken Burns effect
      tl.fromTo(
        '.hero-bg',
        { scale: 1.1, x: '-2%' },
        { scale: 1, x: '0%', duration: 8, ease: 'power2.out' },
        0
      );

      // Greeting typewriter effect
      tl.fromTo(
        '.hero-greeting',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' },
        0.5
      );

      // Headline reveal with 3D effect
      tl.fromTo(
        '.hero-headline',
        { opacity: 0, rotateX: -45, y: 50, transformOrigin: 'center bottom' },
        { opacity: 1, rotateX: 0, y: 0, duration: 1, ease: 'expo.out' },
        0.8
      );

      // Subtitle
      tl.fromTo(
        '.hero-subtitle',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' },
        1.4
      );

      // Tagline
      tl.fromTo(
        '.hero-tagline',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' },
        1.6
      );

      // CTA buttons
      tl.fromTo(
        '.hero-cta-primary',
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.5)' },
        1.8
      );

      tl.fromTo(
        '.hero-cta-secondary',
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.5)' },
        1.95
      );

      // Social links
      tl.fromTo(
        '.hero-social',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'expo.out' },
        2.1
      );

      // Scroll indicator
      tl.fromTo(
        '.scroll-indicator',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' },
        2.5
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="particle-canvas"
      />

      {/* Background Image with Ken Burns */}
      <div className="hero-bg absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${data.personal.avatar}')`,
            filter: 'blur(0px)',
          }}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-6 lg:px-12 pt-20">
        <div className="max-w-4xl">
          {/* Greeting */}
          <p className="hero-greeting text-lg md:text-xl text-white/80 mb-4 tracking-wide">
            Hi, I&apos;m
          </p>

          {/* Headline */}
          <h1
            className="hero-headline text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white mb-6 leading-none"
            style={{ fontFamily: "'Big Shoulders Display', sans-serif" }}
          >
            Omar<span className="text-red-600">.</span>
          </h1>

          {/* Subtitle */}
          <p
            className="hero-subtitle text-2xl sm:text-3xl md:text-4xl font-semibold text-white/90 mb-4"
            style={{ fontFamily: "'Big Shoulders Display', sans-serif" }}
          >
            {data.personal.title}
          </p>

          {/* Tagline */}
          <p className="hero-tagline text-base md:text-lg text-white/60 max-w-xl mb-8 leading-relaxed">
            {data.personal.tagline}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-12">
            <button
              onClick={() => scrollToSection('#projects')}
              className="hero-cta-primary px-8 py-4 bg-red-600 text-white font-medium rounded-full hover:bg-red-700 transition-all hover:scale-105 btn-shine"
            >
              View My Work
            </button>
            <button
              onClick={() => scrollToSection('#contact')}
              className="hero-cta-secondary px-8 py-4 border border-white/30 text-white font-medium rounded-full hover:bg-white/10 transition-all hover:scale-105"
            >
              Get In Touch
            </button>
          </div>

          {/* Social Links */}
          <div className="flex gap-4">
            <a
              href={data.personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-social p-3 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-red-600/20 hover:border-red-600/50 transition-all"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href={data.personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-social p-3 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-red-600/20 hover:border-red-600/50 transition-all"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a
              href={data.personal.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-social p-3 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-red-600/20 hover:border-red-600/50 transition-all"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="text-xs text-white/50 tracking-widest uppercase">Scroll</span>
        <ChevronDown className="bounce text-white/50" size={24} />
      </div>
    </section>
  );
};

export default Hero;
