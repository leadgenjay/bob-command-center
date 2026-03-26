'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Plus, ExternalLink, Search, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Resource {
  id: string;
  title: string;
  url: string;
  category: string;
  description?: string;
  created_at: string;
}

const categories = [
  'Automation & AI',
  'Knowledge Management',
  'Video Production',
  'Marketing',
  'Design',
  'Development',
  'Business',
  'Other',
];

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newResource, setNewResource] = useState({
    title: '',
    url: '',
    category: '',
    description: '',
  });

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    filterResources();
  }, [resources, searchQuery, selectedCategory]);

  const fetchResources = async () => {
    try {
      const res = await fetch('/api/resources');
      if (res.ok) {
        const data = await res.json();
        setResources(data);
      }
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = resources;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((r) => r.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.description?.toLowerCase().includes(query) ||
          r.url.toLowerCase().includes(query)
      );
    }

    setFilteredResources(filtered);
  };

  const handleAddResource = async () => {
    if (!newResource.title || !newResource.url || !newResource.category) {
      return;
    }

    try {
      const res = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newResource),
      });

      if (res.ok) {
        await fetchResources();
        setNewResource({ title: '', url: '', category: '', description: '' });
        setIsAddOpen(false);
      }
    } catch (error) {
      console.error('Failed to add resource:', error);
    }
  };

  const groupedResources = filteredResources.reduce((acc, resource) => {
    const category = resource.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(resource);
    return acc;
  }, {} as Record<string, Resource[]>);

  return (
    <div className="space-y-5 md:space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Resources</h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Useful tools, links, and references
            </p>
          </div>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Resource</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={newResource.title}
                  onChange={(e) =>
                    setNewResource({ ...newResource, title: e.target.value })
                  }
                  placeholder="Resource name"
                />
              </div>
              <div className="space-y-2">
                <Label>URL *</Label>
                <Input
                  value={newResource.url}
                  onChange={(e) =>
                    setNewResource({ ...newResource, url: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={newResource.category}
                  onValueChange={(value) =>
                    setNewResource({ ...newResource, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={newResource.description}
                  onChange={(e) =>
                    setNewResource({
                      ...newResource,
                      description: e.target.value,
                    })
                  }
                  placeholder="Brief description of this resource..."
                  rows={3}
                />
              </div>
              <Button onClick={handleAddResource} className="w-full">
                Add Resource
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Resources Grid */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading resources...
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No resources found. Add your first resource to get started.
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedResources).map(([category, items]) => (
            <div key={category} className="space-y-3">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <h2 className="font-semibold text-lg">{category}</h2>
                <span className="text-sm text-muted-foreground">
                  ({items.length})
                </span>
              </div>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {items.map((resource) => (
                  <Card key={resource.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium leading-tight">
                          {resource.title}
                        </h3>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                      {resource.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {resource.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground truncate">
                        {resource.url}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
