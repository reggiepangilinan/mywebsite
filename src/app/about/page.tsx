import styles from './about.module.css'

export default function About() {
  return (
    <div className={styles.about}>
      <div className="container">
        <h1 className={styles.title}>About Me</h1>
        
        <div className={styles.content}>
          <p className={styles.intro}>
            I'm a passionate developer with experience in building modern web applications.
            I love creating digital experiences that make a difference.
          </p>
          
          <div className={styles.skillsSection}>
            <h2 className={styles.sectionTitle}>Skills</h2>
            <div className={styles.skillsGrid}>
              <div className={styles.skillCategory}>
                <h3 className={styles.categoryTitle}>Frontend</h3>
                <ul className={styles.skillList}>
                  <li>React & Next.js</li>
                  <li>TypeScript</li>
                  <li>CSS & Sass</li>
                  <li>HTML5</li>
                </ul>
              </div>
              <div className={styles.skillCategory}>
                <h3 className={styles.categoryTitle}>Backend</h3>
                <ul className={styles.skillList}>
                  <li>Node.js</li>
                  <li>Python</li>
                  <li>PostgreSQL</li>
                  <li>MongoDB</li>
                </ul>
              </div>
            </div>
          </div>

          <div className={styles.experienceSection}>
            <h2 className={styles.sectionTitle}>Experience</h2>
            <p className={styles.experienceText}>
              Add your professional experience here...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
