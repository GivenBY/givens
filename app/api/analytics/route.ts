import dbConnect from "@/lib/db/mongoose";
import { Paste } from "@/models/Paste";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// GET /api/analytics - Get analytics for the current user
export async function GET() {
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

    const userId = user.id;

    // Get user's pastes
    const userPastes = await Paste.find({ authorId: userId }).lean();

    // Calculate analytics
    const totalPastes = userPastes.length;
    const totalViews = userPastes.reduce(
      (sum, paste) => sum + (paste.views || 0),
      0
    );
    const avgViewsPerPaste =
      totalPastes > 0 ? Math.round(totalViews / totalPastes) : 0;

    // Calculate popular languages
    const languageCounts: Record<string, number> = {};
    userPastes.forEach((paste) => {
      const lang = paste.language || "unknown";
      languageCounts[lang] = (languageCounts[lang] || 0) + 1;
    });

    const popularLanguages = Object.entries(languageCounts)
      .map(([language, count]) => ({ language, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Calculate views over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentPastes = userPastes.filter(
      (paste) => new Date(paste.createdAt) >= thirtyDaysAgo
    );

    // Group by date
    const viewsByDate: Record<string, number> = {};
    recentPastes.forEach((paste) => {
      const date = new Date(paste.createdAt).toISOString().split("T")[0];
      viewsByDate[date] = (viewsByDate[date] || 0) + (paste.views || 0);
    });

    const viewsOverTime = Object.entries(viewsByDate)
      .map(([date, views]) => ({ date, views }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Calculate this month's stats
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const thisMonthPastes = userPastes.filter(
      (paste) => new Date(paste.createdAt) >= thisMonth
    );

    const thisMonthViews = thisMonthPastes.reduce(
      (sum, paste) => sum + (paste.views || 0),
      0
    );

    // Calculate previous month for comparison
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    lastMonth.setDate(1);
    const lastMonthEnd = new Date(thisMonth);
    lastMonthEnd.setDate(0);

    const lastMonthPastes = userPastes.filter((paste) => {
      const pasteDate = new Date(paste.createdAt);
      return pasteDate >= lastMonth && pasteDate <= lastMonthEnd;
    });

    const lastMonthViews = lastMonthPastes.reduce(
      (sum, paste) => sum + (paste.views || 0),
      0
    );

    // Calculate this week's stats
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay()); // Start of this week (Sunday)
    const thisWeekPastes = userPastes.filter(
      (paste) => new Date(paste.createdAt) >= thisWeek
    );

    // Calculate last week for comparison
    const lastWeek = new Date(thisWeek);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastWeekEnd = new Date(thisWeek);
    lastWeekEnd.setDate(lastWeekEnd.getDate() - 1);

    const lastWeekPastes = userPastes.filter((paste) => {
      const pasteDate = new Date(paste.createdAt);
      return pasteDate >= lastWeek && pasteDate <= lastWeekEnd;
    });

    const thisWeekViews = thisWeekPastes.reduce(
      (sum, paste) => sum + (paste.views || 0),
      0
    );
    const lastWeekViews = lastWeekPastes.reduce(
      (sum, paste) => sum + (paste.views || 0),
      0
    );

    // Calculate growth percentages
    const pastesGrowth =
      lastMonthPastes.length > 0
        ? Math.round(
            ((thisMonthPastes.length - lastMonthPastes.length) /
              lastMonthPastes.length) *
              100
          )
        : thisMonthPastes.length > 0
        ? 100
        : 0;

    const viewsGrowth =
      lastMonthViews > 0
        ? Math.round(((thisMonthViews - lastMonthViews) / lastMonthViews) * 100)
        : thisMonthViews > 0
        ? 100
        : 0;

    const avgViewsGrowth =
      lastMonthPastes.length > 0 && thisMonthPastes.length > 0
        ? Math.round(
            ((thisMonthViews / thisMonthPastes.length -
              lastMonthViews / lastMonthPastes.length) /
              (lastMonthViews / lastMonthPastes.length)) *
              100
          )
        : 0;

    // Weekly growth
    const weeklyPastesGrowth =
      lastWeekPastes.length > 0
        ? Math.round(
            ((thisWeekPastes.length - lastWeekPastes.length) /
              lastWeekPastes.length) *
              100
          )
        : thisWeekPastes.length > 0
        ? 100
        : 0;

    const weeklyViewsGrowth =
      lastWeekViews > 0
        ? Math.round(((thisWeekViews - lastWeekViews) / lastWeekViews) * 100)
        : thisWeekViews > 0
        ? 100
        : 0;

    const analytics = {
      totalPastes,
      totalViews,
      avgViewsPerPaste,
      thisMonthPastes: thisMonthPastes.length,
      thisMonthViews,
      thisWeekPastes: thisWeekPastes.length,
      thisWeekViews,
      popularLanguages,
      viewsOverTime,
      growth: {
        pastes: pastesGrowth,
        views: viewsGrowth,
        avgViews: avgViewsGrowth,
        weekly: {
          pastes: weeklyPastesGrowth,
          views: weeklyViewsGrowth,
        },
      },
      recentPastes: userPastes
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5)
        .map((paste) => ({
          _id: paste._id,
          title: paste.title,
          language: paste.language,
          views: paste.views,
          createdAt: paste.createdAt,
          isPublic: paste.isPublic,
        })),
    };

    return NextResponse.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error("GET /api/analytics error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch analytics",
      },
      { status: 500 }
    );
  }
}
