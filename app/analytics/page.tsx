"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockAnalytics } from "@/lib/mockData";
import { Calendar, Code, Eye, TrendingUp } from "lucide-react";
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
  const { totalPastes, totalViews, popularLanguages, viewsOverTime } =
    mockAnalytics;

  const statsCards = [
    {
      title: "Total Pastes",
      value: totalPastes,
      icon: Code,
      change: "+12%",
      changeType: "increase",
    },
    {
      title: "Total Views",
      value: totalViews.toLocaleString(),
      icon: Eye,
      change: "+8%",
      changeType: "increase",
    },
    {
      title: "Avg Views/Paste",
      value: Math.round(totalViews / totalPastes),
      icon: TrendingUp,
      change: "+5%",
      changeType: "increase",
    },
    {
      title: "This Month",
      value: "24",
      icon: Calendar,
      change: "+18%",
      changeType: "increase",
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
                  <Badge variant="secondary" className="text-xs">
                    {stat.change}
                  </Badge>
                  <span>from last month</span>
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
                <LineChart data={viewsOverTime}>
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
                    data={popularLanguages}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ language, count }) => `${language}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {popularLanguages.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
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
              <BarChart data={popularLanguages}>
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
              <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Code className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New paste created</p>
                  <p className="text-xs text-muted-foreground">
                    "React Component with Hooks" - 2 hours ago
                  </p>
                </div>
                <Badge variant="secondary">+15 views</Badge>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                <div className="bg-secondary/10 p-2 rounded-full">
                  <Eye className="h-4 w-4 text-secondary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Paste viewed</p>
                  <p className="text-xs text-muted-foreground">
                    "Python Data Analysis" - 4 hours ago
                  </p>
                </div>
                <Badge variant="outline">+8 views</Badge>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                <div className="bg-accent/10 p-2 rounded-full">
                  <TrendingUp className="h-4 w-4 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Trending paste</p>
                  <p className="text-xs text-muted-foreground">
                    "Go HTTP Server" is trending - 6 hours ago
                  </p>
                </div>
                <Badge variant="default">Hot</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
