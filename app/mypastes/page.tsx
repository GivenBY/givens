"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Eye,
  EyeOff,
  Calendar,
  Clock,
  Search,
  Plus,
  ExternalLink,
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Paste } from "@/lib/types";

export default function MyPastesPage() {
  const [pastes, setPastes] = useState<Paste[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const session = await authClient.getSession();
      if (!session) {
        router.push('/auth');
        return;
      }
      loadPastes();
    };
    checkAuth();
  }, [router]);

  const loadPastes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/pastes');

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth');
          return;
        }
        throw new Error('Failed to load pastes');
      }

      const data = await response.json();
      setPastes(data.pastes || []);
    } catch (error) {
      console.error('Error loading pastes:', error);
      toast.error('Failed to load your pastes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (pasteId: string) => {
    if (!confirm('Are you sure you want to delete this paste?')) {
      return;
    }

    try {
      const response = await fetch(`/api/user/pastes/${pasteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete paste');
      }

      setPastes(prev => prev.filter(paste => paste.id !== pasteId));
      toast.success('Paste deleted successfully');
    } catch (error) {
      console.error('Error deleting paste:', error);
      toast.error('Failed to delete paste');
    }
  };

  const filteredPastes = pastes.filter(paste =>
    paste.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paste.language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-muted-foreground">Loading your pastes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl p-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Pastes</h1>
          <p className="text-muted-foreground">Manage your saved code snippets</p>
        </div>
        <Button onClick={() => router.push('/')} className="sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          New Paste
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search pastes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{pastes.length}</div>
            <div className="text-sm text-muted-foreground">Total Pastes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {pastes.filter(p => p.isPublic).length}
            </div>
            <div className="text-sm text-muted-foreground">Public Pastes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {pastes.reduce((sum, p) => sum + p.viewCount, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Views</div>
          </CardContent>
        </Card>
      </div>

      {filteredPastes.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground">
              {searchTerm ? 'No pastes found matching your search.' : 'No pastes yet. Create your first paste!'}
            </div>
            {!searchTerm && (
              <Button className="mt-4" onClick={() => router.push('/')}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Paste
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredPastes.map((paste) => (
            <Card key={paste.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <CardTitle className="text-lg">
                      {paste.title || 'Untitled Paste'}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="capitalize">
                        {paste.language}
                      </Badge>
                      <Badge variant={paste.isPublic ? "default" : "outline"}>
                        {paste.isPublic ? (
                          <>
                            <Eye className="w-3 h-3 mr-1" />
                            Public
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 mr-1" />
                            Private
                          </>
                        )}
                      </Badge>
                      {paste.expiresAt && (
                        <Badge variant="outline">
                          <Clock className="w-3 h-3 mr-1" />
                          Expires
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/paste/${paste.shortUrl}`)}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(paste.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(paste.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{paste.viewCount} views</span>
                  </div>
                  {paste.expiresAt && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Expires: {formatDate(paste.expiresAt)}</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <pre className="text-xs text-muted-foreground line-clamp-3 overflow-hidden">
                    {paste.content.slice(0, 200)}
                    {paste.content.length > 200 && '...'}
                  </pre>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}