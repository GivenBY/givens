"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalytics } from "@/hooks";
import { useAuth } from "@clerk/nextjs";
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  Code,
  Eye,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7c7c", "#8dd1e1"];

export default function AnalyticsPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const { analytics, loading, error, refetch } = useAnalytics();

  // Redirect unauthenticated users to homepage
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading while auth is being checked
  if (!isLoaded) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Don't render anything if not signed in (will redirect)
  if (!isSignedIn) {
    return null;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-red-500">Error: {error}</p>
            <Button onClick={refetch} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading || !analytics) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">
              Track your paste performance and engagement
            </p>
          </div>

          {/* Loading skeletons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const formatGrowthChange = (growth: number, hasData: boolean) => {
    if (!hasData) return "New!";
    if (growth === 0) return "0%";
    return `${growth >= 0 ? "+" : ""}${growth}%`;
  };

  const getChangeType = (growth: number, hasData: boolean) => {
    if (!hasData) return "new";
    return growth >= 0 ? "increase" : "decrease";
  };

  const statsCards = [
    {
      title: "Total Pastes",
      value: analytics.totalPastes,
      icon: Code,
      change: formatGrowthChange(
        analytics.growth.pastes,
        analytics.totalPastes > 0
      ),
      changeType: getChangeType(
        analytics.growth.pastes,
        analytics.totalPastes > 0
      ),
      period: "from last month",
    },
    {
      title: "Total Views",
      value: analytics.totalViews.toLocaleString(),
      icon: Eye,
      change: formatGrowthChange(
        analytics.growth.views,
        analytics.totalViews > 0
      ),
      changeType: getChangeType(
        analytics.growth.views,
        analytics.totalViews > 0
      ),
      period: "from last month",
    },
    {
      title: "Avg Views/Paste",
      value: analytics.avgViewsPerPaste,
      icon: TrendingUp,
      change: formatGrowthChange(
        analytics.growth.avgViews,
        analytics.totalPastes > 0
      ),
      changeType: getChangeType(
        analytics.growth.avgViews,
        analytics.totalPastes > 0
      ),
      period: "from last month",
    },
    {
      title: "This Week",
      value: analytics.thisWeekPastes,
      icon: Calendar,
      change: formatGrowthChange(
        analytics.growth.weekly.pastes,
        analytics.thisWeekPastes > 0
      ),
      changeType: getChangeType(
        analytics.growth.weekly.pastes,
        analytics.thisWeekPastes > 0
      ),
      period: "from last week",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Track your paste performance and engagement
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Badge
                    variant={
                      stat.changeType === "new"
                        ? "outline"
                        : stat.changeType === "increase"
                        ? "default"
                        : "destructive"
                    }
                    className={`text-xs flex items-center gap-1 ${
                      stat.changeType === "new"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-300"
                        : stat.changeType === "increase"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {stat.changeType === "new" ? (
                      <span className="text-blue-600">✨</span>
                    ) : stat.changeType === "increase" ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )}
                    {stat.change}
                  </Badge>
                  <span>{stat.period}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Views Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Views Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.viewsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Popular Languages */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.popularLanguages}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ language, count }: any) =>
                      `${language}: ${count}`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analytics.popularLanguages.map(
                      (entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Language Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Language Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.popularLanguages}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="language" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.recentPastes.length > 0 ? (
                analytics.recentPastes.map((paste: any) => (
                  <div
                    key={paste._id}
                    className="flex items-center space-x-4 p-4 bg-muted rounded-lg"
                  >
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Code className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Paste: {paste.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {paste.language} •{" "}
                        {new Date(paste.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={paste.isPublic ? "default" : "secondary"}>
                      {paste.views || 0} views
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No recent activity</p>
                  <Button
                    onClick={() => (window.location.href = "/")}
                    className="mt-4"
                  >
                    Create Your First Paste
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
