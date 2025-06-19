import { NextRequest, NextResponse } from 'next/server'
import { deleteAllBlogPosts } from '@/lib/contentful'

export async function POST(request: NextRequest) {
  try {
    const { spaceId, managementToken } = await request.json()

    if (!spaceId || !managementToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required parameters: spaceId and managementToken',
        },
        { status: 400 }
      )
    }

    const result = await deleteAllBlogPosts(spaceId, managementToken)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in delete-all-posts API:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
