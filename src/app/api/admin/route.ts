import { NextResponse } from 'next/server';
import { prismadb } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, description, country, role, assignedBy } = body; // Include `assignedBy`
    console.log("this is the body",body);
    // Validate required fields
    if (!id || !description || !country || !role || !assignedBy) {
      return NextResponse.json(
        { error: 'User ID, description, country, role, and admin ID are required' },
        { status: 400 }
      );
    }

    // Create the new task
    const newTask = await prismadb.work.create({
      data: {
        userId: id,
        work: description,
        country,
        role,
        assignedBy, // Store the admin ID
      },
    });

    return NextResponse.json(
      { newTask, message: 'Task created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create the task' },
      { status: 500 }
    );
  }
}
