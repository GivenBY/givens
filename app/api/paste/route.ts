import dbConnect from "@/lib/db/mongoose";
import { Paste } from "@/models/Paste";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/paste - Get all pastes (public ones or user's private ones)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const user = await currentUser();
    const userId = user?.id;

    // query - if user is signed in, show their private pastes + public ones
    // If not signed in, only show public pastes
    const query = userId
      ? { $or: [{ isPublic: true }, { authorId: userId }] }
      : { isPublic: true };

    const pastes = await Paste.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Paste.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: pastes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/paste error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch pastes",
      },
      { status: 500 }
    );
  }
}

// POST /api/paste - Create a new paste
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const user = await currentUser();
    const userId = user?.id;
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

    // Create paste data
    const pasteData: any = {
      title,
      content,
      language: language || "javascript",
      isPublic: isPublic ?? true,
      views: 0,
      createdAt: new Date(),
    };

    // Add author info if user is signed in
    if (userId && user) {
      pasteData.authorId = userId;
      pasteData.authorName = user.firstName
        ? `${user.firstName} ${user.lastName || ""}`.trim()
        : user.username || "Anonymous";
      pasteData.authorAvatar = user.imageUrl;
    } else {
      // For anonymous users, generate a unique edit ID
      pasteData.anonEditId = crypto.randomUUID();
    }

    const paste = await Paste.create(pasteData);

    return NextResponse.json({
      success: true,
      data: paste,
      message: "Paste created successfully",
    });
  } catch (error) {
    console.error("POST /api/paste error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create paste",
      },
      { status: 500 }
    );
  }
}
