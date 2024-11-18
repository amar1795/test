import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prismadb } from "@/lib/db";


export async function POST(request: Request) {
  try {
    // Get authenticated session
    const session = await auth()
    
    if (!session || !session.user?.name) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Parse the request body
    const body = await request.json()
    const { country } = body

    if (!country || typeof country !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Invalid country data' },
        { status: 400 }
      )
    }

    // Update user's country using their name as identifier
    const updatedUser = await prismadb.user.update({
      where: {
        name: session.user.name
      },
      data: {
        country,
      },
      select: {
        id: true,
        name: true,
        country: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Country updated successfully',
      user: updatedUser
    })

  } catch (error) {
    console.error('Error updating country:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update country' },
      { status: 500 }
    )
  }
}