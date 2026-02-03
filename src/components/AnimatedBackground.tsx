import { useEffect, useRef } from 'react';

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Configuration
    const config = {
      particleCount: width < 768 ? 25 : 50,
      connectionDistance: 150,
      mouseDistance: 200,
      particleSpeed: 0.3,
      gridSize: 60,
    };

    // Particles
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      pulse: number;
      pulseSpeed: number;
    }

    const particles: Particle[] = [];
    for (let i = 0; i < config.particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * config.particleSpeed,
        vy: (Math.random() - 0.5) * config.particleSpeed,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      });
    }

    // Grid points for technical effect
    const gridPoints: { x: number; y: number; baseOpacity: number }[] = [];
    for (let x = 0; x < width; x += config.gridSize) {
      for (let y = 0; y < height; y += config.gridSize) {
        gridPoints.push({
          x,
          y,
          baseOpacity: Math.random() * 0.1 + 0.02,
        });
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    // Animation
    let animationId: number;

    const animate = () => {
      frameRef.current++;
      
      // Render every frame for smooth animation
      ctx.clearRect(0, 0, width, height);

      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, 'rgba(15, 23, 42, 0.3)');   // slate-900
      gradient.addColorStop(0.5, 'rgba(30, 27, 75, 0.2)'); // indigo-950
      gradient.addColorStop(1, 'rgba(15, 23, 42, 0.3)');   // slate-900
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw tech grid (render every 2nd frame for performance)
      if (frameRef.current % 2 === 0) {
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.05)'; // indigo-500 very low opacity
        ctx.lineWidth = 1;

        // Vertical lines
        for (let x = 0; x < width; x += config.gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y < height; y += config.gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }

      // Draw grid points with pulse effect
      gridPoints.forEach((point) => {
        const dx = mouseRef.current.x - point.x;
        const dy = mouseRef.current.y - point.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        let opacity = point.baseOpacity;
        if (dist < config.mouseDistance) {
          opacity = point.baseOpacity + (1 - dist / config.mouseDistance) * 0.3;
        }

        ctx.beginPath();
        ctx.arc(point.x, point.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${opacity})`;
        ctx.fill();
      });

      // Update and draw particles
      particles.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.pulse += particle.pulseSpeed;

        // Wrap around screen
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;

        // Pulsing size
        const pulseSize = particle.size + Math.sin(particle.pulse) * 0.5;

        // Draw particle with glow
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, pulseSize * 3
        );
        gradient.addColorStop(0, `rgba(99, 102, 241, ${particle.opacity})`);
        gradient.addColorStop(0.5, `rgba(139, 92, 246, ${particle.opacity * 0.3})`);
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, pulseSize * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(165, 180, 252, ${particle.opacity + 0.2})`;
        ctx.fill();

        // Draw connections (only check every 3rd particle for performance)
        if (i % 3 === 0) {
          particles.slice(i + 1).forEach((other) => {
            const dx = particle.x - other.x;
            const dy = particle.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < config.connectionDistance) {
              const opacity = (1 - dist / config.connectionDistance) * 0.3;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(other.x, other.y);
              ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          });
        }

        // Mouse interaction
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < config.mouseDistance) {
          const opacity = (1 - dist / config.mouseDistance) * 0.5;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
          ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // Draw floating geometric shapes (hexagons)
      const time = frameRef.current * 0.005;
      for (let i = 0; i < 5; i++) {
        const x = (width * 0.1 + i * width * 0.2 + time * 20) % (width + 200) - 100;
        const y = height * 0.2 + Math.sin(time + i) * 50;
        const size = 20 + Math.sin(time * 0.5 + i) * 5;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(time * 0.2 + i);
        
        ctx.beginPath();
        for (let j = 0; j < 6; j++) {
          const angle = (j * Math.PI) / 3;
          const hx = Math.cos(angle) * size;
          const hy = Math.sin(angle) * size;
          if (j === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 + Math.sin(time + i) * 0.05})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default AnimatedBackground;
