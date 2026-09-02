export type Localized = { es: string; en: string };

export interface CvContact {
  email: string;
  phone: string;
  linkedin: string;
  location: Localized;
}

export interface CvRole {
  title: Localized;
  company: string;
  period: Localized;
  location: Localized;
  description: Localized;
  achievements: Localized[];
  technologies: string[];
}

export interface CvProject {
  name: Localized;
  company: string;
  description: Localized;
  technologies: string[];
}

export interface CvEducation {
  degree: Localized;
  institution: string;
  period: string;
}

export interface CvCertification {
  name: Localized;
  url: string;
}

export interface CvData {
  aliases: { es: string[]; en: string[] };
  name: string;
  title: Localized;
  contact: CvContact;
  summary: Localized;
  stack: string[];
  highlights: Localized[];
  experience: CvRole[];
  projects: CvProject[];
  education: CvEducation[];
  certifications: CvCertification[];
  languages: { name: string; level: Localized }[];
}

export const MANUEL_CV_DATA: CvData = {
  aliases: {
    es: ['Manuel', 'Manuel Alba', 'Manuel Alba Hornillo', 'Manolo', 'Manu', 'él'],
    en: ['Manuel', 'Manuel Alba', 'Manuel Alba Hornillo', 'Manolo', 'Manu', 'he']
  },
  name: 'Manuel Alba Hornillo',
  title: { es: 'Ingeniero Frontend Senior', en: 'Senior Frontend Engineer' },
  contact: {
    email: 'mahx007@gmail.com',
    phone: '+34 662 919 002',
    linkedin: 'https://linkedin.com/in/manuel-alba-hornillo',
    location: { es: 'Sevilla, España', en: 'Seville, Spain' }
  },
  summary: {
    es: 'Ingeniero Frontend Senior con más de 5 años de experiencia construyendo aplicaciones web críticas para sectores altamente regulados como banca y seguros. Especializado en arquitecturas modulares escalables con Angular, TypeScript, RxJS y Signals.',
    en: 'Senior Frontend Engineer with 5+ years of experience building critical web applications for highly regulated industries like banking and insurance. Specialized in scalable modular architectures with Angular, TypeScript, RxJS and Signals.'
  },
  stack: ['Angular 19+', 'TypeScript', 'RxJS', 'Signals', 'Jest', 'Tailwind CSS', 'SCSS', 'Storybook', 'Ionic', 'MongoDB', 'REST APIs', 'CI/CD', 'Jenkins', 'Node.js'],
  highlights: [
    {
      es: 'Lideró refactorizaciones completas de proyectos legacy desarrollados sin estándares, transformándolos en aplicaciones funcionales, mantenibles y escalables',
      en: 'Led complete refactorizations of legacy projects previously developed without standards, transforming them into functional, maintainable and scalable applications'
    },
    {
      es: 'Migró suites de tests críticos de Jasmine/Karma a Jest, alcanzando más del 95% de cobertura de código',
      en: 'Migrated critical test suites from Jasmine/Karma to Jest, achieving over 95% code coverage'
    },
    {
      es: 'Diseñó e implementó arquitecturas de módulos escalables para aplicaciones financieras respaldadas por MongoDB',
      en: 'Designed and implemented scalable module architectures for financial applications backed by MongoDB'
    },
    {
      es: 'Integró herramientas de desarrollo basadas en IA para impulsar la productividad del equipo y la calidad del código',
      en: 'Integrated AI-driven development tools to boost team productivity and code quality'
    },
    {
      es: 'Construyó un Design System centralizado con Storybook aplicado a productos web y móviles responsive',
      en: 'Built a centralized Design System with Storybook applied to responsive web and mobile products'
    },
    {
      es: 'Optimizó el rendimiento de aplicaciones empresariales que sirven a miles de usuarios diarios',
      en: 'Optimized performance of enterprise applications serving thousands of daily users'
    }
  ],
  experience: [
    {
      title: { es: 'Ingeniero Frontend Senior', en: 'Senior Frontend Engineer' },
      company: 'NTT DATA',
      period: { es: '2022 - Presente', en: '2022 - Present' },
      location: { es: 'Sevilla, España', en: 'Seville, Spain' },
      description: {
        es: 'Lidera la arquitectura frontend de aplicaciones empresariales en los sectores bancario y asegurador. Enfocado en diseño de módulos escalables, integración de APIs REST complejas y pipelines de CI/CD.',
        en: 'Leading frontend architecture for enterprise applications in the banking and insurance sectors. Focused on scalable module design, complex REST API integration, and CI/CD pipelines.'
      },
      achievements: [
        {
          es: 'Refactorizó aplicaciones Angular legacy, mejorando la mantenibilidad y reduciendo la deuda técnica en un 40%',
          en: 'Refactored legacy Angular applications, improving maintainability and reducing technical debt by 40%'
        },
        {
          es: 'Implementó una estrategia completa de tests unitarios con Jest, logrando más del 95% de cobertura',
          en: 'Implemented comprehensive unit testing strategy with Jest, achieving 95%+ code coverage'
        },
        {
          es: 'Diseñó arquitecturas de módulos escalables para aplicaciones financieras respaldadas por MongoDB',
          en: 'Designed scalable module architectures for financial applications backed by MongoDB'
        },
        {
          es: 'Lideró la migración de Jasmine/Karma a Jest en suites de tests críticos',
          en: 'Led migration from Jasmine/Karma to Jest for critical test suites'
        }
      ],
      technologies: ['Angular', 'TypeScript', 'RxJS', 'Jest', 'REST APIs', 'MongoDB', 'Jenkins']
    },
    {
      title: { es: 'Desarrollador Frontend', en: 'Frontend Developer' },
      company: 'Deloitte',
      period: { es: '2020 - 2022', en: '2020 - 2022' },
      location: { es: 'Sevilla, España', en: 'Seville, Spain' },
      description: {
        es: 'Desarrolló y optimizó interfaces web responsive para los sectores de Administración Pública y Transporte. Construyó un Design System centralizado con Storybook.',
        en: 'Developed and optimized responsive web interfaces for Public Administration and Transport sectors. Built a centralized Design System with Storybook.'
      },
      achievements: [
        {
          es: 'Creó una biblioteca centralizada de componentes UI reutilizables documentada con Storybook',
          en: 'Created a centralized library of reusable UI components documented with Storybook'
        },
        {
          es: 'Desarrolló productos web y móviles responsive con Angular e Ionic',
          en: 'Developed responsive web and mobile products with Angular and Ionic'
        },
        {
          es: 'Optimizó el rendimiento de aplicaciones empresariales para clientes del sector público',
          en: 'Optimized performance of enterprise applications for Public Sector clients'
        },
        {
          es: 'Proporcionó soporte full-stack con Java, MySQL y APIs REST',
          en: 'Provided full-stack support with Java, MySQL and REST APIs'
        }
      ],
      technologies: ['Angular', 'Ionic', 'Storybook', 'SCSS', 'Tailwind CSS', 'Java', 'MySQL', 'REST APIs']
    }
  ],
  projects: [
    {
      name: { es: 'Plataforma Empresarial Bancaria', en: 'Enterprise Banking Platform' },
      company: 'NTT DATA',
      description: {
        es: 'Aplicación financiera escalable con integración compleja de APIs REST respaldada por MongoDB, con CI/CD mediante Jenkins y testing unitario completo con Jest.',
        en: 'Scalable financial application with complex REST API integration backed by MongoDB, featuring CI/CD with Jenkins and comprehensive unit testing with Jest.'
      },
      technologies: ['Angular', 'TypeScript', 'RxJS', 'Jenkins', 'Jest', 'MongoDB']
    },
    {
      name: { es: 'Design System y Biblioteca UI con Storybook', en: 'Design System & Storybook UI Library' },
      company: 'Deloitte',
      description: {
        es: 'Biblioteca centralizada de componentes UI reutilizables documentada con Storybook, aplicada a productos web y móviles responsive.',
        en: 'Centralized library of reusable UI components documented with Storybook, applied to responsive web and mobile products.'
      },
      technologies: ['Angular', 'Ionic', 'Storybook', 'SCSS', 'Tailwind CSS']
    },
    {
      name: { es: 'Soluciones Web para Sector Público y Transporte', en: 'Public Sector & Transport Web Solutions' },
      company: 'Deloitte',
      description: {
        es: 'Desarrollo, optimización y refactorización de interfaces web responsive para Administración Pública y Transporte.',
        en: 'Development, optimization and refactoring of responsive web interfaces for Public Administration and Transport sectors.'
      },
      technologies: ['Angular', 'REST APIs', 'Java', 'MySQL']
    }
  ],
  education: [
    {
      degree: { es: 'Técnico Superior en Desarrollo de Aplicaciones Web (DAW)', en: 'Higher Degree in Web Application Development (DAW)' },
      institution: 'ADA ITS Sevilla',
      period: '2018 - 2020'
    }
  ],
  certifications: [
    {
      name: { es: 'Certificación Oficial de Angular (Nivel 2)', en: 'Official Angular Certification (Level 2)' },
      url: 'https://interstate21.com/certificate/?code=5E09LYX'
    }
  ],
  languages: [
    { name: 'Español', level: { es: 'Nativo', en: 'Native' } },
    { name: 'Inglés', level: { es: 'B2 - Dominio profesional', en: 'B2 - Professional proficiency' } }
  ]
};