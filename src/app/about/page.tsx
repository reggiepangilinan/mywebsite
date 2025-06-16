import styles from './about.module.css'

const skillsData = {
  Frontend: [
    'React & Next.js',
    'TypeScript',
    'CSS & Sass',
    'HTML5',
    'JavaScript',
    'Tailwind CSS'
  ],
  Backend: [
    'Node.js',
    'Python',
    'PostgreSQL',
    'MongoDB',
    'Express.js',
    'REST APIs'
  ],
  Tools: [
    'Git & GitHub',
    'VS Code',
    'Docker',
    'AWS',
    'Figma',
    'Webpack'
  ]
}

export default function About() {
  return (
    <div className={styles.about}>
      <div className="container">
        <h1 className={styles.title}>About Me</h1>
        
        <div className={styles.content}>
          <p className={styles.intro}>
            A seasoned engineering leader delivering performant, scalable, and user-centric digital platforms across enterprise environments. Drives architecture design and modernisation for high-traffic web ecosystems with a strong focus on SEO, accessibility, and modular design. Collaborates cross-functionally with business, product, and design teams to ensure alignment between technology execution and strategic goals. Trusted for mentoring engineering teams and uplifting code quality across diverse tech stacks.
          </p>
          
          <div className={styles.skillsSection}>
            <h2 className={styles.sectionTitle}>⚡️ Skills</h2>
            <div className={styles.skillsGrid}>
              {Object.entries(skillsData).map(([category, skills]) => (
                <div key={category} className={styles.skillCategory}>
                  <h3 className={styles.categoryTitle}>{category}</h3>
                  <ul className={styles.skillList}>
                    {skills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.experienceSection}>
            <h2 className={styles.sectionTitle}>📋 Experience</h2>
            <p className={styles.experienceText}>
              Add your professional experience here...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
