'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText, Search, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { sopList } from './[id]/sop-data';

const categories = ['All', 'Operations', 'Client Work', 'Marketing', 'Technical'];

export default function SOPsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredSOPs = sopList.filter(sop => {
    const matchesSearch = sop.title.toLowerCase().includes(search.toLowerCase()) ||
      sop.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || sop.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Standard Operating Procedures</h1>
          <p className="text-muted-foreground mt-1">Team playbooks and processes</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search SOPs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === category
                ? 'bg-primary text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* SOP List */}
      <div className="space-y-3">
        {filteredSOPs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No SOPs found</p>
          </div>
        ) : (
          filteredSOPs.map(sop => (
            <Link
              key={sop.id}
              href={`/sops/${sop.id}`}
              className="block bg-card border border-border rounded-2xl p-4 hover:shadow-lg transition-all active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {sop.category}
                    </span>
                    <span className="text-xs text-muted-foreground">v{sop.version}</span>
                  </div>
                  <h3 className="font-semibold text-lg">{sop.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{sop.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {sop.steps} steps
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Updated {sop.lastUpdated}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
