import { NextResponse } from 'next/server';

import { prismadb } from "@/lib/db";
import { auth } from '@/auth'

//updation
export async function PUT(request: Request, { params }) {
    const { id } = params;
  
    // Authenticate and get the country of the user
    const session = await auth();
  
    if (!session || !session.user?.name) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
  
    if (!id) {
      return NextResponse.json(
        { error: 'ID parameter is required to update' },
        { status: 400 }
      );
    }
  
    // Get data from the body of the request
    const body = await request.json();
    const { description } = body;
  
    if (!description) {
      return NextResponse.json(
        { error: 'Description is required to update' },
        { status: 400 }
      );
    }
  
    try {
      // Check if the work exists and is associated with the correct user and country
      const existingWork = await prismadb.work.findUnique({
        where: { id },
        include: { user: true },  // To ensure it is related to the current user
      });
  
      if (!existingWork) {
        return NextResponse.json(
          { error: 'Work not found' },
          { status: 404 }
        );
      }
  
      if (existingWork.userId !== session.user.id && session.user.role !== 'ADMIN' ) {
        return NextResponse.json(
          { error: 'Work does not belong to the current user ' },
          { status: 403 }
        );
      }
  
      // Update the work description
      const updatedWork = await prismadb.work.update({
        where: { id },
        data: { work: description },
      });
  
      return NextResponse.json(updatedWork, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: 'Failed to update data' },
        { status: 500 }
      );
    }
  }



// Deletion
export async function DELETE(request: Request, { params }) {
    const { id } = params;
  
    // Authenticate the user
    const session = await auth();
  
    if (!session || !session.user?.name) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

   
  
    if (!id) {
      return NextResponse.json(
        { error: 'ID parameter is required to delete' },
        { status: 400 }
      );
    }
  
    try {
      // Check if the work exists and is associated with the correct user and country
      const existingWork = await prismadb.work.findUnique({
        where: { id },
        include: { user: true },  // To ensure it is related to the current user
      });
  
      if (!existingWork) {
        return NextResponse.json(
          { error: 'Work not found' },
          { status: 404 }
        );
      }
  
      // user cannot delete the work of admin
      if(existingWork.role == "ADMIN" ){

        return NextResponse.json(
          { error: 'Only admin can delete the work' },
          { status: 403 }
        );
      }

      if (existingWork.userId !== session.user.id && session.user.role !== 'ADMIN' ) {
        return NextResponse.json(
          { error: 'Work does not belong to the current user or country' },
          { status: 403 }
        );
      }

      
  
      // Delete the work entry
      await prismadb.work.delete({
        where: { id },
      });
  
      return NextResponse.json(
        { message: 'Work deleted successfully' },
        { status: 200 }
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: 'Failed to delete data' },
        { status: 500 }
      );
    }
  }
