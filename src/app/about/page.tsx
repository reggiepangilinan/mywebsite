import styles from './about.module.css'
import { skillsData, keySkillsData } from './skills-data'
import { experienceData } from './experience-data'

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
            <h2 className={styles.sectionTitle}>⚡️ Tech Stack</h2>
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

          <div className={styles.keySkillsSection}>
            <h2 className={styles.sectionTitle}>🎯 Key Skills</h2>
            <ul className={styles.keySkillsList}>
              {keySkillsData.map((skill, index) => (
                <li key={index} className={styles.keySkillItem}>
                  <strong>{skill.title}</strong> - {skill.description}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.experienceSection}>
            <h2 className={styles.sectionTitle}>📋 Experience</h2>
            <div className={styles.experienceList}>
              {experienceData.map((exp, index) => (
                <div key={index} className={styles.experienceItem}>
                  <div className={styles.experienceHeader}>
                    <div className={styles.experienceInfo}>
                      <h3 className={styles.experienceTitle}>{exp.title}</h3>
                      <h4 className={styles.experienceCompany}>{exp.company}</h4>
                    </div>
                    <div className={styles.experienceMeta}>
                      <span className={styles.experiencePeriod}>{exp.period}</span>
                      <span className={styles.experienceLocation}>{exp.location}</span>
                    </div>
                  </div>
                  <p className={styles.experienceDescription}>{exp.description}</p>
                  <ul className={styles.achievementsList}>
                    {exp.achievements.map((achievement, idx) => (
                      <li key={idx} className={styles.achievementItem}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
