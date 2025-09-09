"use client";

import { useState, useEffect } from 'react';
import { Paste } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Eye, Calendar, User, Clock } from 'lucide-react';
import { toast } from 'sonner';
import Prism from 'prismjs';
import loadLanguages from 'prismjs/components/index.js';
import 'prismjs/themes/prism-tomorrow.css';


export function PasteViewer({ paste }: { paste: Paste }) {
  const [highlightedCode, setHighlightedCode] = useState(paste.content);

  useEffect(() => {
    const loadAndHighlight = async () => {
      try {
        await loadLanguages([paste.language]);
        const highlighted = Prism.highlight(
          paste.content,
          Prism.languages[paste.language] || Prism.languages.javascript,
          paste.language
        );
        setHighlightedCode(highlighted);
      } catch (error) {
        console.error('Failed to highlight code:', error);
        setHighlightedCode(paste.content);
      }
    };

    loadAndHighlight();
  }, [paste.content, paste.language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(paste.content);
      toast.success('Code copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('URL copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const timeUntilExpiry = paste.expiresAt ? paste.expiresAt.getTime() - Date.now() : null;
  const isExpiringSoon = timeUntilExpiry && timeUntilExpiry < 24 * 60 * 60 * 1000;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{paste.title || 'Untitled Paste'}</CardTitle>
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
                      <User className="w-3 h-3 mr-1" />
                      Private
                    </>
                  )}
                </Badge>
                {paste.expiresAt && (
                  <Badge variant={isExpiringSoon ? "destructive" : "outline"}>
                    <Clock className="w-3 h-3 mr-1" />
                    {isExpiringSoon ? 'Expires Soon' : 'Temporary'}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                Share
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>Created: {formatDate(paste.createdAt)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4" />
          <span>{paste.viewCount} views</span>
        </div>
        {paste.expiresAt && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>
              Expires: {formatDate(paste.expiresAt)}
              {isExpiringSoon && (
                <span className="text-red-500 ml-1">
                  ({Math.ceil(timeUntilExpiry / (60 * 60 * 1000))}h left)
                </span>
              )}
            </span>
          </div>
        )}
      </div>

      <Card className='py-0'>
        <CardContent className="p-0">
          <div
            className="relative overflow-auto"
            style={{
              backgroundColor: '#1E1E1E',
              borderRadius: '0.5rem',
            }}
          >
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-4 top-4 z-10 text-gray-400 hover:text-white"
              onClick={handleCopy}
            >
              <Copy className="w-4 h-4" />
            </Button>

            <pre
              className="p-6 text-sm overflow-auto"
              style={{
                fontFamily: 'var(--font-geist-mono), "Courier New", Courier, monospace',
                lineHeight: '1.5',
                margin: 0,
                background: 'transparent',
                color: '#d4d4d4',
              }}
            >
              <code
                dangerouslySetInnerHTML={{ __html: highlightedCode }}
                className={`language-${paste.language}`}
              />
            </pre>
          </div>
        </CardContent>
      </Card>

      {paste.expiresAt && (
        <div className="text-center text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">
          <p>
            This paste is temporary and will be automatically deleted on{' '}
            <strong>{formatDate(paste.expiresAt)}</strong>.
            {!paste.userId && (
              <span className="block mt-1">
                Sign in to save your pastes permanently.
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
