'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import styles from './about.module.css'
import { skillsData, keySkillsData } from './skills-data'
import { experienceData } from './experience-data'
import AnimatedSection from '@/components/AnimatedSection'
import { usePageAnnouncements } from '@/hooks/usePageAnnouncements'

export default function About() {
  // Add page announcements for screen reader
  usePageAnnouncements({
    pageTitle: 'About Page',
    pageDescription: 'Information about Reggie Pangilinan, including skills, experience, and background in engineering leadership and full stack development'
  });
  useEffect(() => {
    // Force visibility on ultra-small screens
    const forceVisibilityOnSmallScreens = () => {
      if (window.innerWidth <= 375) {
        const experienceElements = document.querySelectorAll('[class*="experienceWrapper"], [class*="experienceSection"], [class*="experienceList"], [class*="experienceItem"]')
        experienceElements.forEach(element => {
          const htmlElement = element as HTMLElement
          htmlElement.style.opacity = '1'
          htmlElement.style.transform = 'none'
          htmlElement.style.visibility = 'visible'
          htmlElement.style.display = 'block'
        })
      }
    }
    
    forceVisibilityOnSmallScreens()
    window.addEventListener('resize', forceVisibilityOnSmallScreens)
    
    // Also force after a short delay to ensure DOM is ready
    setTimeout(forceVisibilityOnSmallScreens, 100)
    
    return () => window.removeEventListener('resize', forceVisibilityOnSmallScreens)
  }, [])
  return (
    <div className={styles.about}>
      <div className="container">
        <AnimatedSection delay={0}>
          <h1 className={styles.title}>About Me</h1>
        </AnimatedSection>
        
        <div className={styles.content}>
          <AnimatedSection delay={200}>
            <p className={styles.intro}>
              A seasoned engineering leader delivering performant, scalable, and user-centric digital platforms across enterprise environments. Drives architecture design and modernisation for high-traffic web ecosystems with a strong focus on SEO, accessibility, and modular design. Collaborates cross-functionally with business, product, and design teams to ensure alignment between technology execution and strategic goals. Trusted for mentoring engineering teams and uplifting code quality across diverse tech stacks.
            </p>
          </AnimatedSection>
          
          <AnimatedSection delay={400}>
            <div className={styles.keySkillsSection} id="skills">
              <h2 className={styles.sectionTitle}>
                <span className={styles.emoji}>🎯</span>
                <span className={styles.titleText}>Key Skills</span>
              </h2>
              <div className={styles.keySkillsGrid}>
                {keySkillsData.map((skill, index) => (
                  <div key={index} className={styles.keySkillCard}>
                    <h3 className={styles.keySkillTitle}>{skill.title}</h3>
                    <p className={styles.keySkillDescription}>{skill.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={600}>
            <div className={styles.skillsSection}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.emoji}>⚡️</span>
                <span className={styles.titleText}>Tech Stack</span>
              </h2>
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
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <div className={styles.experienceWrapper} id="experience">
              <div className={styles.experienceSection}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.emoji}>📋</span>
                  <span className={styles.titleText}>Recent Experience</span>
                </h2>
                <div className={styles.experienceList}>
                  {experienceData.map((exp, index) => (
                    <div key={index} className={styles.experienceItem}>
                      <div className={styles.experienceHeader}>
                        <div className={styles.experienceMainInfo}>
                          {exp.companyLogo && (
                            <div className={styles.companyLogo}>
                              <Image
                                src={exp.companyLogo}
                                alt={`${exp.company} logo`}
                                width={48}
                                height={48}
                                className={styles.companyLogoImage}
                                unoptimized
                              />
                            </div>
                          )}
                          <div className={styles.experienceInfo}>
                            <h3 className={styles.experienceTitle}>{exp.title}</h3>
                            <h4 className={styles.experienceCompany}>{exp.company}</h4>
                          </div>
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
                <div className={styles.downloadSection}>
                  <a 
                    href="/CV - REGGIE PANGILINAN 2025.pdf" 
                    className={styles.downloadLink}
                    download="Reggie_Pangilinan_Resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download Full Resume
                    <svg className={styles.downloadIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}
