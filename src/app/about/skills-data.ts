export const skillsData = {
  'Web Frontend': [
    'React & Next.js',
    'Angular',
    'HTML5, CSS, JavaScript and TypeScript',
    'CMS (Contentful, AEM)',
    'SEO (Search Engine Optimisation)',
    'Responsive Design and Accessibility (WCAG 2.1)',
    'Micro Frontends',
  ],
  'Backend + Cloud': [
    'C#, ASP.NET, .NET, .NET Core',
    'Azure',
    'Relational Database - MSSQL, PostgreSQL',
    'NoSQL, MongoDB',
    'Microservices Architecture',
    'API Design and Development (REST, GraphQL)',
    'Serverless Computing',
  ],
  Tools: [
    'Unit Testing and Test Automation',
    'Git, GitHub, GitLab',
    'GitHub Copilot',
    'AI-Driven Development',
    'CI/CD (GitHub Actions, Azure DevOps)', 
    'Docker, Kubernetes',
    'Visual Studio, Visual Studio Code',
    'Agile Methodologies (Scrum, Kanban)',
  ]           
}

export interface KeySkill {
  title: string
  description: string
}

export const keySkillsData: KeySkill[] = [
  {
    title: 'Fullstack Development Expertise',
    description: 'Proven ability to build scalable web applications using React for front-end, .NET for back-end, with SQL and NoSQL databases.'
  },
 {
    title: 'API Engineering',
    description: 'Designs and integrates RESTful and GraphQL APIs that are performant, secure, and consistent data between services.'
  },
  {
    title: 'Cloud and DevOps Proficiency',
    description: 'Skilled in deploying and managing cloud-native solutions using Azure, with experience in GitHub Copilot and CI/CD practices.'
  },
  {
    title: 'Performance and SEO Optimisation',
    description: 'Deep understanding of performance tuning and SEO best practices to ensure responsive, discoverable web applications.'
  },
  {
    title: 'Software Architecture and Design',
    description: 'Capable of designing and implementing robust microservices and micro frontend architectures that support modular, scalable solutions.'
  },
  {
    title: 'Cross-Functional Leadership',
    description: 'Effectively collaborates with stakeholders while leading technical teams to translate business needs into actionable engineering plans.'
  },
  {
    title: 'Agile Software Delivery',
    description: 'Experienced in Agile methodologies, working within Scrum teams to iterate quickly, manage sprints, and deliver on tight deadlines.'
  },

  {
    title: 'Lifelong Learning and Team Culture',
    description: 'Actively embraces new technologies and methodologies, contributing to a collaborative and innovation-driven team environment.'
  }
]
