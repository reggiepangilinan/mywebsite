'use client'

import styles from './projects.module.css'
import ProjectCard from '@/components/ProjectCard'
import AnimatedSection from '@/components/AnimatedSection'

export default function Projects() {
  const projects = [
    {
      id: 1,
      title: "E-commerce Platform",
      description: "A full-stack e-commerce solution built with Next.js and Stripe",
      technologies: ["Next.js", "TypeScript", "Stripe", "CSS Modules"],
      image: "/next.svg",
      github: "https://github.com/yourusername/project1",
      demo: "https://project1-demo.com"
    },
    {
      id: 2,
      title: "Task Management App",
      description: "A collaborative task management application with real-time updates",
      technologies: ["React", "Node.js", "Socket.io", "MongoDB"],
      image: "/vercel.svg",
      github: "https://github.com/yourusername/project2",
      demo: "https://project2-demo.com"
    }
  ]

  return (
    <div className={styles.projects}>
      <div className="container">
        <AnimatedSection delay={0}>
          <h1 className={styles.title}>My Projects</h1>
        </AnimatedSection>
        
        <AnimatedSection delay={200}>
          <div className={styles.projectsGrid}>
            {projects.map((project, index) => (
              <AnimatedSection key={project.id} delay={400 + (index * 200)}>
                <ProjectCard project={project} />
              </AnimatedSection>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
