import { NextResponse } from 'next/server';

import { prismadb } from "@/lib/db";
import { auth } from '@/auth'

/**
 * GET /api/data - Fetch data filtered by the user's selected country.
 */
export async function GET(request: Request) {
  // const { searchParams } = new URL(request.url);
  // const country = searchParams.get('country'); // Get the country from query params
  const session = await auth()
  const country  = session?.user?.country;
    
  if (!session || !session.user?.name) {
    return NextResponse.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    )
  }


  if (!country) {
    return NextResponse.json(
      { error: 'Country query parameter is required' },
      { status: 400 }
    );
  }

  if(session.user.role == "ADMIN"){
    try {
      const data = await prismadb.work.findMany({
        where: { country },
        include: {
          user: { // Include the related user data
            select: {
              name: true, // Only include the name of the user
            },
          },
        },
      });
      return NextResponse.json(data, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to fetch data' },
        { status: 500 }
      );
    }
  }

  try {
    const data = await prismadb.work.findMany({
      where: { country,userId:session.user.id },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/data - Create new data tagged with the user’s selected country.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, description, country,role } = body; // Ensure these fields exist in the request body

    if (!id || !description || !country || !role) {
      return NextResponse.json(
        { error: 'Name, description, and country are required' },
        { status: 400 }
      );
    }

    const newData = await prismadb.work.create({
      data: { userId:id,work:description, country,role },
    });

    return NextResponse.json({newData,message:"data created successfully"}, { status: 201, });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create new data' },
      { status: 500 }
    );
  }
}
