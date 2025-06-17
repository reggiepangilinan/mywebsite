import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Reggie Pangilinan - Engineering Leader & Full Stack Developer'
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
              fontSize: '72px',
              fontWeight: 'bold',
              marginBottom: '24px',
              lineHeight: 1.1,
            }}
          >
            Reggie Pangilinan
          </h1>
          <p
            style={{
              fontSize: '36px',
              marginBottom: '32px',
              opacity: 0.9,
              lineHeight: 1.2,
            }}
          >
            Engineering Leadership & Full Stack Development
          </p>
          <p
            style={{
              fontSize: '24px',
              opacity: 0.8,
              maxWidth: '800px',
              lineHeight: 1.4,
            }}
          >
            Building scalable solutions for the web with React, Next.js, TypeScript & Azure
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
            reggiepangilinan.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
