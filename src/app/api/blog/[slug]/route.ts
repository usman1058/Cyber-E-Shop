import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const post = await db.blogPost.findUnique({
      where: { slug },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    // Fetch related posts (same category, excluding current post)
    const relatedPosts = post.category
      ? await db.blogPost.findMany({
          where: {
            category: post.category,
            id: { not: post.id },
            published: true,
          },
          take: 3,
          orderBy: { publishedAt: 'desc' },
        })
      : []

    return NextResponse.json({
      post: {
        ...post,
        tags: post.tags ? JSON.parse(post.tags) : [],
      },
      relatedPosts: relatedPosts.map(p => ({
        ...p,
        tags: p.tags ? JSON.parse(p.tags) : [],
      })),
    })
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}
