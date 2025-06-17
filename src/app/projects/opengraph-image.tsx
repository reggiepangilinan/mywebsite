import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Projects Portfolio - Reggie Pangilinan'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          backgroundImage: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            color: 'white',
            padding: '80px',
          }}
        >
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              marginBottom: '24px',
              lineHeight: 1.1,
            }}
          >
            My Projects
          </h1>
          <p
            style={{
              fontSize: '32px',
              marginBottom: '32px',
              opacity: 0.9,
              lineHeight: 1.2,
            }}
          >
            Portfolio & Case Studies
          </p>
          <p
            style={{
              fontSize: '22px',
              opacity: 0.8,
              maxWidth: '900px',
              lineHeight: 1.4,
              textAlign: 'center',
            }}
          >
            Explore my portfolio of web applications and software projects built with React, Next.js, TypeScript, and modern web technologies.
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '40px',
              fontSize: '20px',
              opacity: 0.7,
            }}
          >
            reggiepangilinan.com/projects
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
