import {
  Layers,
  Code2,
  Cpu,
  Globe,
  Wrench,
  Zap,
  Users,
  Gamepad2,
  Brain,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Award,
  Linkedin,
  Github,
  Twitter,
  Download,
  Play,
  Star,
  GitFork,
  ChevronLeft,
  ChevronRight,
  X,
  Mail,
  Copy,
  Check,
  ArrowRight,
  Calendar,
  MapPin,
  type LucideIcon,
} from 'lucide-react';

const iconComponents: Record<string, LucideIcon> = {
  Layers,
  Code2,
  Cpu,
  Globe,
  Wrench,
  Zap,
  Users,
  Gamepad2,
  Brain,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Award,
  Linkedin,
  Github,
  Twitter,
  Download,
  Play,
  Star,
  GitFork,
  ChevronLeft,
  ChevronRight,
  X,
  Mail,
  Copy,
  Check,
  ArrowRight,
  Calendar,
  MapPin,
};

interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 20, className }: IconProps) {
  const Component = iconComponents[name];
  
  if (!Component) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }
  
  return <Component size={size} className={className} />;
}

export function getIconComponent(name: string): LucideIcon | undefined {
  return iconComponents[name];
}

export default Icon;