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

export interface CvHobby {
  name: string;
  description: Localized;
}

export interface CvMobility {
  available: boolean;
  preference: Localized;
  statement: Localized;
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
  birthDate: string;
  personality: Localized;
  hobbies: CvHobby[];
  methodology: Localized;
  salary: Localized;
  availability: Localized;
  goals: Localized;
  mobility: CvMobility;
  languages: { name: string; level: Localized }[];
}

export function getYearsOfExperience(): number {
  const startDate = new Date(2020, 8, 1);
  const now = new Date();
  const diffMs = now.getTime() - startDate.getTime();
  const ageDate = new Date(diffMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export function replaceYearsPlaceholder(text: string): string {
  return text.replace('{years}', String(getYearsOfExperience()));
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
  get summary(): Localized {
    const years = getYearsOfExperience();
    return {
      es: `Ingeniero Frontend Senior con más de ${years} años de experiencia construyendo aplicaciones web críticas para sectores altamente regulados como banca y seguros. Especializado en arquitecturas modulares escalables con Angular, TypeScript, RxJS y Signals.`,
      en: `Senior Frontend Engineer with ${years}+ years of experience building critical web applications for highly regulated industries like banking and insurance. Specialized in scalable modular architectures with Angular, TypeScript, RxJS and Signals.`
    };
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
      period: { es: '07/2024 - Presente', en: 'Jul 2024 - Present' },
      location: { es: 'Sevilla, España', en: 'Seville, Spain' },
      description: {
        es: 'Lidera la arquitectura frontend con Angular 18 en aplicaciones financieras enterprise, definiendo patrones de diseño y buenas prácticas y actuando como guía técnica del equipo frontend.',
        en: 'Leads the frontend architecture with Angular 18 on enterprise financial applications, defining design patterns and best practices and acting as technical reference for the frontend team.'
      },
      achievements: [
        {
          es: 'Liderazgo técnico de la arquitectura frontend con Angular 18 en aplicaciones financieras enterprise',
          en: 'Technical leadership of the frontend architecture with Angular 18 on enterprise financial applications'
        },
        {
          es: 'Definición de patrones de diseño, buenas prácticas y guía técnica para el equipo frontend',
          en: 'Definition of design patterns, best practices and technical guidance for the frontend team'
        },
        {
          es: 'Coordinación de requerimientos funcionales y técnicos con equipos backend y cliente',
          en: 'Coordination of functional and technical requirements with backend teams and the client'
        },
        {
          es: 'Automatización de despliegues y pipelines de CI/CD con Jenkins',
          en: 'Automation of deployments and CI/CD pipelines with Jenkins'
        },
        {
          es: 'Cobertura de tests unitarios con Jest y validación e integración de APIs REST complejas con Postman y MongoDB',
          en: 'Unit test coverage with Jest and validation and integration of complex REST APIs with Postman and MongoDB'
        }
      ],
      technologies: ['Angular', 'TypeScript', 'RxJS', 'Jest', 'REST APIs', 'Postman', 'MongoDB', 'Jenkins']
    },
    {
      title: { es: 'Desarrollador Frontend', en: 'Frontend Developer' },
      company: 'Deloitte',
      period: { es: '09/2020 - 06/2024', en: 'Sep 2020 - Jun 2024' },
      location: { es: 'Sevilla, España', en: 'Seville, Spain' },
      description: {
        es: 'Desarrolló y optimizó interfaces web responsive con Angular e Ionic para los sectores de Administración Pública, Financiero y Transporte, y diseñó una librería centralizada de componentes UI reutilizables documentada con Storybook.',
        en: 'Developed and optimized responsive web interfaces with Angular and Ionic for Public Administration, Finance and Transport sectors, and designed a centralized UI component library documented with Storybook.'
      },
      achievements: [
        {
          es: 'Desarrollo y optimización de interfaces web responsive con Angular e Ionic para Administración Pública, Sector Financiero y Transporte',
          en: 'Development and optimization of responsive web interfaces with Angular and Ionic for Public Administration, Finance and Transport'
        },
        {
          es: 'Diseño, desarrollo y mantenimiento de una librería centralizada de componentes UI reutilizables documentada con Storybook',
          en: 'Design, development and maintenance of a centralized library of reusable UI components documented with Storybook'
        },
        {
          es: 'Participación activa en entornos ágiles (Scrum) traduciendo diseños UI a código funcional',
          en: 'Active participation in agile environments (Scrum) translating UI designs into functional code'
        },
        {
          es: 'Soporte full-stack con Java y MySQL para desarrollo de funcionalidades backend en equipos de mejoras',
          en: 'Full-stack support with Java and MySQL for backend feature development on improvement teams'
        }
      ],
      technologies: ['Angular', 'Ionic', 'Storybook', 'SCSS', 'Scrum', 'Java', 'MySQL', 'REST APIs']
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
  birthDate: '1999-04-23',
  personality: {
    es: 'Persona activa y resolutiva, apasionada por la tecnología y en permanente búsqueda de superación. Es deportista (practica boxeo y tenis de forma habitual), metódico en el trabajo y orientado a asumir retos y responsabilidades crecientes.',
    en: 'An active, problem-solving person passionate about technology and always pursuing self-improvement. He is a dedicated athlete (regularly trains boxing and tennis), methodical at work and driven to take on growing challenges and responsibilities.'
  },
  hobbies: [
    {
      name: 'Boxeo',
      description: {
        es: 'Entrena boxeo habitualmente como disciplina de foco, resiliencia y constancia.',
        en: 'He trains boxing regularly as a discipline of focus, resilience and consistency.'
      }
    },
    {
      name: 'Tenis',
      description: {
        es: 'Practica tenis, combinando intensidad y constancia en la cancha.',
        en: 'He plays tennis, combining intensity and consistency on the court.'
      }
    },
    {
      name: 'Deporte y vida activa',
      description: {
        es: 'Mantiene una rutina deportiva activa para cuidar el cuerpo y la mente.',
        en: 'He keeps an active sports routine to stay sharp in both body and mind.'
      }
    }
  ],
  methodology: {
    es: 'Trabaja de forma ágil e iterativa, con entrega incremental de valor. Prioriza la calidad del código, la cobertura de tests (con Jest) y las buenas prácticas, manteniendo comunicación continua con el equipo y revisiones de código periódicas.',
    en: 'He works in an agile, iterative way with incremental value delivery. He prioritizes code quality, test coverage (with Jest) and best practices, keeping continuous team communication and regular code reviews.'
  },
  salary: {
    es: 'Sus pretensiones salariales son flexibles y acordes al mercado. Valora más los proyectos técnicamente retadores, un buen ambiente de equipo y las oportunidades de crecimiento a largo plazo.',
    en: 'His salary expectations are flexible and market-aligned. He values technically challenging projects, a strong team culture and long-term growth opportunities even more.'
  },
  availability: {
    es: 'Está totalmente disponible para nuevas oportunidades laborales. Su incorporación puede ser inmediata o según lo que se acuerde con la empresa.',
    en: 'He is fully open to new job opportunities. He can onboard immediately or as agreed with the company.'
  },
  goals: {
    es: 'Su objetivo a medio plazo es seguir evolucionando como ingeniero, asumir liderazgo técnico y consolidar su carrera en equipos de producto internacionales.',
    en: 'His medium-term goal is to keep evolving as an engineer, take on technical leadership and build his career on international product teams.'
  },
  mobility: {
    available: true,
    preference: { es: 'Estados Unidos', en: 'the United States' },
    statement: {
      es: 'Tiene total disponibilidad para proyectos internacionales y para reubicarse. Su preferencia clara es trabajar y establecerse en Estados Unidos.',
      en: 'He is fully available for international projects and relocation. His clear preference is to work and settle in the United States.'
    }
  },
  languages: [
    { name: 'Español', level: { es: 'Nativo', en: 'Native' } },
    { name: 'Inglés', level: { es: 'B2 - Dominio profesional', en: 'B2 - Professional proficiency' } }
  ]
};