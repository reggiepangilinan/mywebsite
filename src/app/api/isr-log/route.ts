import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { message, data } = await request.json()
    
    // Use console.error to ensure it shows up in Netlify Functions logs
    console.error(`[ISR-API] ${message}`, data ? JSON.stringify(data) : '')
    
    return NextResponse.json({ success: true, timestamp: new Date().toISOString() })
  } catch (error) {
    console.error('[ISR-API] Error logging:', error)
    return NextResponse.json({ error: 'Failed to log' }, { status: 500 })
  }
}

export async function GET() {
  console.error('[ISR-API] Health check called at', new Date().toISOString())
  return NextResponse.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'ISR logging API is working' 
  })
}
