import { NextResponse } from 'next/server'

export async function GET() {
  const timestamp = new Date().toISOString()
  
  return NextResponse.json({
    timestamp,
    isr: {
      enabled: process.env.ENABLE_ISR_LOGS === 'true',
      nodeEnv: process.env.NODE_ENV,
      hasContentful: !!(process.env.CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_ACCESS_TOKEN)
    },
    cache: {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    }
  }, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  })
}
