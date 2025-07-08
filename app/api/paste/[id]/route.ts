import dbConnect from "@/lib/db/mongoose";
import { Paste } from "@/models/Paste";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/paste/[id] - Get a specific paste by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { id } = await params;
    const user = await currentUser();
    const userId = user?.id;

    const paste = await Paste.findById(id).lean();

    if (!paste) {
      return NextResponse.json(
        {
          success: false,
          error: "Paste not found",
        },
        { status: 404 }
      );
    }

    // Check if user has permission to view this paste
    if (!paste.isPublic && paste.authorId !== userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Access denied",
        },
        { status: 403 }
      );
    }

    // Increment view count
    await Paste.findByIdAndUpdate(id, { $inc: { views: 1 } });

    return NextResponse.json({
      success: true,
      data: { ...paste, views: paste.views + 1 },
    });
  } catch (error) {
    console.error(`GET /api/paste/${params.id} error:`, error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch paste",
      },
      { status: 500 }
    );
  }
}

// PUT /api/paste/[id] - Update a specific paste
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { id } = await params;
    const user = await currentUser();
    const userId = user?.id;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required",
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, content, language, isPublic } = body;

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        {
          success: false,
          error: "Title and content are required",
        },
        { status: 400 }
      );
    }

    const paste = await Paste.findById(id);

    if (!paste) {
      return NextResponse.json(
        {
          success: false,
          error: "Paste not found",
        },
        { status: 404 }
      );
    }

    // Check if user has permission to update this paste
    if (paste.authorId !== userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Access denied",
        },
        { status: 403 }
      );
    }

    // Update the paste
    paste.title = title;
    paste.content = content;
    paste.language = language || paste.language;
    paste.isPublic = isPublic ?? paste.isPublic;
    paste.updatedAt = new Date();

    await paste.save();

    return NextResponse.json({
      success: true,
      data: paste,
      message: "Paste updated successfully",
    });
  } catch (error) {
    console.error(`PUT /api/paste/${params.id} error:`, error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update paste",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/paste/[id] - Delete a paste
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { id } = params;
    const user = await currentUser();
    const userId = user?.id;

    const paste = await Paste.findById(id);

    if (!paste) {
      return NextResponse.json(
        {
          success: false,
          error: "Paste not found",
        },
        { status: 404 }
      );
    }

    // Check if user has permission to delete this paste
    if (paste.authorId !== userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Access denied",
        },
        { status: 403 }
      );
    }

    await Paste.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Paste deleted successfully",
    });
  } catch (error) {
    console.error(`DELETE /api/paste/${params.id} error:`, error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete paste",
      },
      { status: 500 }
    );
  }
}
