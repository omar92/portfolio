import { useState, useEffect } from 'react';

// Generic data fetcher hook
export function useData<T>(url: string): { data: T | null; loading: boolean; error: Error | null } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }
        const json = await response.json();
        setData(json);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

// Profile data hook
export interface Profile {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  tagline: string;
  bio: string;
  social: {
    github: string;
    linkedin: string;
    twitter: string;
    youtube: string;
  };
  availability: {
    status: string;
    location: string;
  };
  stats: {
    yearsExperience: number;
    publicRepos: number;
    githubStars: number;
    totalForks: number;
  };
}

export function useProfile() {
  return useData<Profile>('/data/profile.json');
}

// Projects data hook
export interface Project {
  id: number;
  title: string;
  category: 'games' | 'tools' | 'ai' | 'multiplayer';
  description: string;
  longDescription?: string;
  image: string;
  gallery?: string[];
  stars?: number;
  forks?: number;
  link: string;
  tech: string[];
  youtubeVideo?: string;
  features?: string[];
  status?: string;
}

export interface ProjectsData {
  categories: {
    id: string;
    label: string;
    icon: string;
  }[];
  projects: Project[];
}

export function useProjects() {
  return useData<ProjectsData>('/data/projects.json');
}

// Experience data hook
export interface Experience {
  type: 'work' | 'education' | 'achievement';
  title: string;
  organization: string;
  organizationUrl?: string;
  location: string;
  period: string;
  description: string;
  featuredProject?: {
    name: string;
    androidLink?: string;
    iosLink?: string;
  };
  graduationProject?: {
    name: string;
    videoUrl?: string;
  };
  honors?: string[];
}

export interface ExperienceData {
  experiences: Experience[];
  certificates: string[];
  honors: string[];
  languages: { name: string; level: string }[];
}

export function useExperience() {
  return useData<ExperienceData>('/data/experience.json');
}

// Skills data hook
export interface SkillGroup {
  icon: string;
  title: string;
  skills: { name: string; level: number }[];
}

export interface Highlight {
  icon: string;
  label: string;
  description: string;
}

export interface SkillsData {
  skillGroups: SkillGroup[];
  highlights: Highlight[];
  summary: string;
  stats: {
    yearsExperience: number;
    publicRepos: number;
  };
}

export function useSkills() {
  return useData<SkillsData>('/data/skills.json');
}

// Sections data hook
export interface SectionCTA {
  label: string;
  action?: string;
  link?: string;
  url?: string;
  email?: string;
  icon?: string;
  variant?: 'primary' | 'secondary';
}

export interface SectionCTAs {
  primary?: SectionCTA;
  secondary?: SectionCTA;
}

export interface SectionData {
  title?: string;
  headline?: string;
  description?: string;
  subheadline?: string;
  badges?: string[];
  features?: string[];
  stats?: { value: string; label: string }[];
  ctas?: SectionCTA[] | SectionCTAs;
  backgroundImage?: string;
  role?: string;
  meta?: {
    location: string;
    availability: string;
  };
  viewAllLink?: {
    label: string;
    url: string;
  };
  narrative?: string;
  email?: string;
  socials?: { platform: string; url: string }[];
  footer?: string;
  links?: { label: string; target: string }[];
  logo?: string;
}

// Type guard for CTAs
export function isCTAArray(ctas: SectionCTA[] | SectionCTAs): ctas is SectionCTA[] {
  return Array.isArray(ctas);
}

export interface SectionsData {
  hero: SectionData;
  gameplayEngineer: SectionData;
  aiTools: SectionData;
  optimizedSystems: SectionData;
  collaboration: SectionData;
  projects: SectionData;
  skills: SectionData;
  experience: SectionData;
  contact: SectionData;
  navigation: SectionData;
}

export function useSections() {
  return useData<SectionsData>('/data/sections.json');
}

// Icon mapping helper
export const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {};

export function registerIcon(name: string, component: React.ComponentType<{ size?: number }>) {
  iconMap[name] = component;
}

export function getIcon(name: string): React.ComponentType<{ size?: number }> | undefined {
  return iconMap[name];
}