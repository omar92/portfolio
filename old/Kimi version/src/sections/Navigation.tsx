import { useEffect, useState } from 'react';
import { useSections } from '@/hooks/useData';
import { Icon } from '@/components/Icon';

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const { data: sections } = useSections();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const nav = sections?.navigation;
  if (!nav) return null;

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled 
          ? 'bg-bg-primary/80 backdrop-blur-md border-b border-white/5' 
          : 'bg-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-[6vw] py-4">
        {/* Logo */}
        <div className="font-display font-bold text-lg tracking-tight text-text-primary">
          {nav.logo}
        </div>

        {/* Nav Links - Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {nav.links?.map((link) => (
            <button 
              key={link.target}
              onClick={() => scrollToSection(link.target)}
              className="text-sm text-text-primary/80 hover:text-text-primary transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-4">
          {nav.socials?.map((social) => (
            <a 
              key={social.platform}
              href={social.url}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-text-primary/60 hover:text-accent-violet transition-colors"
            >
              <Icon name={social.platform} size={18} />
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;