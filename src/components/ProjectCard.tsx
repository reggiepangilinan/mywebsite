import Image from 'next/image'
import Link from 'next/link'
import styles from './ProjectCard.module.css'

interface Project {
  id: number
  title: string
  description: string
  technologies: string[]
  image: string
  github: string
  demo: string
}

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={project.image}
          alt={project.title}
          width={400}
          height={200}
          className={styles.image}
        />
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.description}>{project.description}</p>
        
        <div className={styles.technologies}>
          {project.technologies.map((tech) => (
            <span key={tech} className={styles.tech}>
              {tech}
            </span>
          ))}
        </div>
        
        <div className={styles.links}>
          <Link href={project.github} className={styles.link} target="_blank">
            GitHub
          </Link>
          <Link href={project.demo} className={styles.link} target="_blank">
            Live Demo
          </Link>
        </div>
      </div>
    </div>
  )
}
