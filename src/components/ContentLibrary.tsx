'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, ExternalLink, Copy, ChevronDown, ChevronUp, Folder } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ContentItem {
  id: string;
  title: string;
  folder: string;
  drive_url: string;
  headline: string;
  transcript: string;
  content_type: string;
  created_at: string;
}

export function ContentLibrary() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  useEffect(() => {
    filterContent();
  }, [searchQuery, content, selectedFolder]);

  async function fetchContent() {
    setLoading(true);
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching content:', error);
    } else {
      setContent(data || []);
    }
    setLoading(false);
  }

  function filterContent() {
    let filtered = content;
    
    if (selectedFolder) {
      filtered = filtered.filter(item => item.folder === selectedFolder);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title?.toLowerCase().includes(query) ||
        item.headline?.toLowerCase().includes(query) ||
        item.transcript?.toLowerCase().includes(query) ||
        item.folder?.toLowerCase().includes(query)
      );
    }
    
    setFilteredContent(filtered);
  }

  const folders = [...new Set(content.map(item => item.folder).filter(Boolean))];

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  function highlightMatch(text: string, query: string) {
    if (!query.trim() || !text) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-800">{part}</mark> : part
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transcripts, headlines, titles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Folder Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedFolder === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedFolder(null)}
        >
          All ({content.length})
        </Button>
        {folders.map(folder => (
          <Button
            key={folder}
            variant={selectedFolder === folder ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFolder(folder === selectedFolder ? null : folder)}
          >
            <Folder className="h-3 w-3 mr-1" />
            {folder} ({content.filter(c => c.folder === folder).length})
          </Button>
        ))}
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        {filteredContent.length} result{filteredContent.length !== 1 ? 's' : ''}
        {searchQuery && ` for "${searchQuery}"`}
      </p>

      {/* Content Cards */}
      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading...</div>
      ) : filteredContent.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No content found. Try a different search term.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredContent.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardHeader className="pb-2 cursor-pointer" onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base font-medium">
                      {highlightMatch(item.title, searchQuery)}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {item.content_type}
                      </Badge>
                      {item.folder && (
                        <Badge variant="outline" className="text-xs">
                          {item.folder}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.drive_url && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(item.drive_url, '_blank');
                        }}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                    {expandedId === item.id ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>
              
              {expandedId === item.id && (
                <CardContent className="pt-0 space-y-4">
                  {/* Headline */}
                  {item.headline && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-muted-foreground uppercase">Headline</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs"
                          onClick={() => copyToClipboard(item.headline)}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <p className="text-sm font-medium text-primary">
                        {highlightMatch(item.headline, searchQuery)}
                      </p>
                    </div>
                  )}
                  
                  {/* Transcript */}
                  {item.transcript && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-muted-foreground uppercase">Transcript</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs"
                          onClick={() => copyToClipboard(item.transcript)}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed max-h-48 overflow-y-auto">
                        {highlightMatch(item.transcript, searchQuery)}
                      </p>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
