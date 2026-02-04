'use client';

import { useState, useEffect } from 'react';
import { Idea, IdeaCategory, IDEA_CATEGORY_CONFIG, PRIORITY_CONFIG, IdeaStatus } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Lightbulb, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

const categories: (IdeaCategory | 'all')[] = ['all', 'content', 'apps', 'business', 'social'];

export function IdeasVault() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [activeCategory, setActiveCategory] = useState<IdeaCategory | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchIdeas = async () => {
    try {
      const res = await fetch('/api/ideas');
      const data = await res.json();
      setIdeas(data);
    } catch (error) {
      console.error('Failed to fetch ideas:', error);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  const refreshIdeas = () => {
    fetchIdeas();
  };

  const filteredIdeas = activeCategory === 'all'
    ? ideas
    : ideas.filter(idea => idea.category === activeCategory);

  const handleDeleteIdea = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await fetch(`/api/ideas?id=${id}`, { method: 'DELETE' });
      refreshIdeas();
    } catch (error) {
      console.error('Failed to delete idea:', error);
    }
  };

  const handleStatusChange = async (id: string, status: IdeaStatus) => {
    try {
      await fetch('/api/ideas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      refreshIdeas();
    } catch (error) {
      console.error('Failed to update idea:', error);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <Card className="frosted-glass border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
            <Lightbulb className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">Ideas Vault</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {ideas.length} ideas captured
            </p>
          </div>
        </div>
        
        {/* Horizontally scrollable filter chips */}
        <div className="scroll-snap-x gap-2 -mx-6 px-6 mt-4 pb-1">
          {categories.map(cat => {
            const isActive = activeCategory === cat;
            const config = cat === 'all' ? null : IDEA_CATEGORY_CONFIG[cat];
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'filter-chip snap-center-child',
                  isActive && 'filter-chip-active'
                )}
              >
                {config ? `${config.emoji} ${config.label}` : 'All'}
              </button>
            );
          })}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-hide pb-5">
        {filteredIdeas.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <Lightbulb className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium">No ideas yet</p>
            <p className="text-xs mt-1">Tap + to capture your thoughts</p>
          </div>
        ) : (
          filteredIdeas.map((idea, index) => {
            const catConfig = IDEA_CATEGORY_CONFIG[idea.category];
            const priority = PRIORITY_CONFIG[idea.priority];
            const isExpanded = expandedId === idea.id;
            
            return (
              <div
                key={idea.id}
                className={cn(
                  'rounded-xl bg-muted/40 overflow-hidden',
                  'transition-all duration-200 animate-scale-in',
                  isExpanded && 'ring-1 ring-primary/20'
                )}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {/* Card header - always visible */}
                <button
                  onClick={() => toggleExpand(idea.id)}
                  className={cn(
                    'w-full flex items-center gap-3 p-4 text-left',
                    'transition-colors active:bg-muted/60 touch-target'
                  )}
                >
                  <span className="text-xl shrink-0">{catConfig.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{idea.title}</h4>
                    {!isExpanded && idea.description && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {idea.description}
                      </p>
                    )}
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                </button>
                
                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3 animate-slide-up">
                    {idea.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {idea.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className={cn('text-xs', priority.color)}>
                        {priority.icon} {priority.label}
                      </Badge>
                      
                      <Select
                        value={idea.status}
                        onValueChange={(v) => handleStatusChange(idea.id, v as IdeaStatus)}
                      >
                        <SelectTrigger className="h-7 w-auto text-xs border-0 bg-muted/50 gap-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="captured">💡 Captured</SelectItem>
                          <SelectItem value="developing">🔨 Developing</SelectItem>
                          <SelectItem value="ready">✅ Ready</SelectItem>
                          <SelectItem value="archived">📦 Archived</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {idea.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <button
                      onClick={(e) => handleDeleteIdea(e, idea.id)}
                      className={cn(
                        'flex items-center gap-1.5 text-xs text-destructive/70',
                        'hover:text-destructive transition-colors mt-2'
                      )}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete idea
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
