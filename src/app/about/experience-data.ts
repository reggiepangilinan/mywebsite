export interface Experience {
  title: string
  company: string
  period: string
  location: string
  description: string
  achievements: string[]
}

export const experienceData: Experience[] = [
  {
    title: 'Senior Full Stack Developer',
    company: 'Tech Innovation Corp',
    period: '2022 - Present',
    location: 'Remote',
    description: 'Lead development of scalable web applications using React, Next.js, and Node.js. Architect cloud infrastructure and mentor junior developers.',
    achievements: [
      'Improved application performance by 40% through code optimization',
      'Led migration to microservices architecture',
      'Mentored 5+ junior developers'
    ]
  },
  {
    title: 'Frontend Developer',
    company: 'Digital Solutions Ltd',
    period: '2020 - 2022',
    location: 'San Francisco, CA',
    description: 'Developed responsive web applications and collaborated with design teams to create intuitive user experiences.',
    achievements: [
      'Built 10+ responsive web applications',
      'Reduced bundle size by 30% through optimization',
      'Implemented accessibility standards (WCAG 2.1)'
    ]
  },
  {
    title: 'Junior Developer',
    company: 'StartupXYZ',
    period: '2019 - 2020',
    location: 'New York, NY',
    description: 'Contributed to full-stack development projects and gained experience in modern web technologies.',
    achievements: [
      'Developed key features for MVP launch',
      'Participated in agile development process',
      'Learned React, Node.js, and database management'
    ]
  }
]
