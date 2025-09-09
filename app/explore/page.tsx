'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Calendar, Code, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface PublicPaste {
  id: string;
  shortUrl: string;
  title: string;
  language: string;
  viewCount: number;
  createdAt: string;
  userId?: string;
  content: string;
}

export default function ExplorePage() {
  const [pastes, setPastes] = useState<PublicPaste[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const languages = [
    'javascript', 'typescript', 'python', 'java', 'cpp', 'c',
    'csharp', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin',
    'html', 'css', 'scss', 'json', 'xml', 'yaml', 'markdown',
    'bash', 'sql', 'r', 'matlab', 'perl', 'lua', 'dart'
  ];

  useEffect(() => {
    fetchPublicPastes();
  }, [sortBy]);

  const fetchPublicPastes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/explore?sort=${sortBy}`);
      if (!response.ok) {
        throw new Error('Failed to fetch public pastes');
      }
      const data = await response.json();
      setPastes(data.pastes || []);
    } catch (error) {
      console.error('Error fetching public pastes:', error);
      toast.error('Failed to load public pastes');
    } finally {
      setLoading(false);
    }
  };

  const filteredPastes = pastes.filter(paste => {
    const matchesSearch = paste.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paste.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLanguage = selectedLanguage === 'all' || paste.language === selectedLanguage;
    return matchesSearch && matchesLanguage;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCodePreview = (code: string) => {
    const lines = code.split('\n');
    const previewLines = lines.slice(0, 3);
    return previewLines.join('\n') + (lines.length > 3 ? '\n...' : '');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore Public Pastes</h1>
        <p className="text-muted-foreground">
          Discover code snippets and projects shared by the community
        </p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search pastes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Languages</SelectItem>
            {languages.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="popular">Most Viewed</SelectItem>
            <SelectItem value="title">Title A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredPastes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Code className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No public pastes found</h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedLanguage !== 'all'
                ? 'Try adjusting your search filters'
                : 'Be the first to share a public paste!'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPastes.map((paste) => (
            <Card key={paste.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg line-clamp-2">
                    {paste.title || 'Untitled Paste'}
                  </CardTitle>
                  <Badge variant="secondary" className="capitalize shrink-0">
                    {paste.language}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="bg-muted rounded-md p-3 font-mono text-sm overflow-hidden">
                  <pre className="whitespace-pre-wrap text-xs line-clamp-4">
                    {getCodePreview(paste.content)}
                  </pre>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{paste.viewCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(paste.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <Button asChild className="w-full">
                  <Link href={`/paste/${paste.shortUrl}`}>
                    View Paste
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredPastes.length > 0 && (
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Showing {filteredPastes.length} of {pastes.length} public pastes
        </div>
      )}
    </div>
  );
}
