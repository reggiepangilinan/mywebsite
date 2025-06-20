import { NextResponse } from 'next/server'
import { getBlogPost, type BlogPostFields } from '@/lib/contentful'

export async function GET() {
  try {
    const post = await getBlogPost('this-is-my-first-post')

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const fields = post.fields as BlogPostFields
    const featuredImage = fields.featuredImage

    const imageData = {
      hasImage: !!featuredImage,
      file: featuredImage?.fields?.file || null,
      url: featuredImage?.fields?.file?.url || null,
      fullUrl: (() => {
        const url = featuredImage?.fields?.file?.url
        if (typeof url === 'string' && url.startsWith('//')) {
          return `https:${url}`
        }
        return url || null
      })(),
      dimensions:
        (featuredImage?.fields?.file as { details?: { image?: unknown } })
          ?.details?.image || null,
      title: featuredImage?.fields?.title || null,
      description: featuredImage?.fields?.description || null,
    }

    return NextResponse.json({
      slug: 'this-is-my-first-post',
      title: fields.title,
      imageData,
    })
  } catch (error) {
    console.error('Test image API error:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}
