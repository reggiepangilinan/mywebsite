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
    title: 'Engineering Chapter Lead',
    company: 'Woolworths Group',
    period: 'Nov 2023 - Present',
    location: 'Sydney, Australia',
    description: 'Oversaw the product details web squad comprising engineers, business representatives, and designers to manage and enhance the Woolworths Supermarket website. Architected and executed upgrades for the main product details page and ratings and review sections, improving SEO and overall user experience.',
    achievements: [
      'Planned and delivered a redesign for the product tile component using React, aligning with modern performance and accessibility standards.',
      'Delivered measurable improvements to page speed and Lighthouse performance through architectural enhancements and micro frontend deployment.',
    ]
  },
  {
    title: 'Technical Lead',
    company: 'WooliesX',
    period: 'Nov 2022 - Nov 2023',
    location: 'Sydney, Australia',
    description: 'Led a multidisciplinary squad to manage supermarket website features such as product tiles, tagging systems, and promotion services. Designed technical solutions and directed the execution of the product tile uplift in Angular.',
    achievements: [
      'Updated the tagging service to enhance the reliability and performance of promotional content delivery',
      'Strengthened collaboration with design and analytics teams to align engineering delivery with business objectives.',
    ]
  },
  {
    title: 'Senior Software Engineer',
    company: 'WooliesX',
    period: 'Sep 2021 - Nov 2022',
    location: 'Sydney, Australia',
    description: 'A senior member of the squad responsible for the Woolworths Supermarket website, focusing on product details and promotions. Developed and maintained features to enhance user experience and site performance.',
    achievements: [
      'Implemented complex pricing mechanics and promotional configurations across the website, including Member Price and Buy More Save More functionalities.',
      'Maintained and supported the tagging service for pre-purchase promotions.',
      'Ensured accurate and dynamic promotional displays across diverse user journeys.',
      'Contributed to service modularisation and improved code maintainability across components',
    ]
  },
  {
    title: 'Senior Software Engineer',
    company: 'Zip Co',
    period: 'Oct 2020 - Sept 2021',
    location: 'Sydney, Australia',
    description: 'A senior member of the acquisition engineering team who looks after the customer acquisition experience journey for the ZipAU website. Main highlights are managing microservices to do credit check, identity validation and fraud detection.',
    achievements: [
      'Implemented new ZipAU branding for the acquisition pages.',
    ]
  },
  {
    title: '.Net Developer',
    company: 'InfoTrack',
    period: 'Jan 2019 - Oct 2020',
    location: 'Sydney, Australia',
    description: 'A senior member of the PlanIT engineering team who looks after the website to manage off the plan properties. Main highlights will be managing microservices to generate bulk property contracts for different projects.',
    achievements: [
      'Implemented a new design system for the then emerging react internal component library',
    ]
  }
]
