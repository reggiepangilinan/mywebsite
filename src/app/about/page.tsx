import AboutContent from './AboutContent'

export default function About() {
  // Read environment variable at build time for static generation
  const isOpenToWork = process.env.OPEN_TO_WORK_MODE === 'true'

  return <AboutContent isOpenToWork={isOpenToWork} />
}
