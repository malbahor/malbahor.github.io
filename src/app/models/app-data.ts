export interface NavItem {
  label: string;
  href: string;
}

export interface Stat {
  label: string;
  value: string;
}

export interface Skill {
  name: string;
  level: string;
  icon: string;
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  isCurrent?: boolean;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  demoUrl: string;
  githubUrl: string;
  featured?: boolean;
}

export interface SocialLink {
  name: string;
  url: string;
  handle: string;
  icon: string;
}

export interface NavbarData {
  brandTagline: string;
  cta: string;
  toggleAria: string;
  closeAria: string;
  navItems: NavItem[];
}

export interface HeroData {
  statusPrefix: string;
  statusCompany: string;
  titleLine1: string;
  titleHighlight: string;
  titleLine2: string;
  description: string;
  ctaProjects: string;
  ctaContact: string;
  techLabel: string;
  techBadges: string[];
  resumeCta: string;
  usRemoteBadge: string;
  resumeModal: {
    title: string;
    subtitle: string;
    enOption: string;
    esOption: string;
    closeAria: string;
  };
  stats: Stat[];
}

export interface AboutData {
  eyebrow: string;
  title: string;
  subtitle: string;
  greeting: string;
  paragraph1: string;
  tags: string[];
  skillCategories: SkillCategory[];
}

export interface ExperienceData {
  eyebrow: string;
  title: string;
  subtitle: string;
  currentBadge: string;
  experiences: ExperienceItem[];
}

export interface ProjectsData {
  eyebrow: string;
  title: string;
  subtitle: string;
  featuredLabel: string;
  projectTypeLabel: string;
  projects: Project[];
}

export interface ContactData {
  eyebrow: string;
  title: string;
  subtitle: string;
  infoTitle: string;
  infoIntro: string;
  location: string;
  formTitle: string;
  successMsg: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  subjectLabel: string;
  subjectPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  submitLabel: string;
  socialLinks: SocialLink[];
}

export interface ProfileData {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  summary: string;
}

export interface EducationData {
  title: string;
  certifications: { name: string; url?: string }[];
  degrees: { name: string; institution: string; period: string }[];
  languages: { name: string; level: string }[];
}

export interface AppData {
  profile: ProfileData;
  education: EducationData;
  navbar: NavbarData;
  hero: HeroData;
  about: AboutData;
  experience: ExperienceData;
  projects: ProjectsData;
  contact: ContactData;
}