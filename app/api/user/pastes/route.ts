import dbConnect from "@/lib/db/mongoose";
import { Paste } from "@/models/Paste";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/user/pastes - Get current user's pastes
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required",
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const pastes = await Paste.find({ authorId: user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Paste.countDocuments({ authorId: user.id });

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
    console.error("GET /api/user/pastes error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch user pastes",
      },
      { status: 500 }
    );
  }
}
