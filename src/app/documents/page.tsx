'use client';

import { useState, useEffect } from 'react';
import { FileText, Search, Copy, Download, Check, Eye, Clock, RefreshCw } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

const categories = ['All', 'Scripts', 'Research', 'Notes', 'Other'];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/documents');
      const data = await res.json();
      setDocuments(data);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || doc.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopy = async (content: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (doc: Document) => {
    const blob = new Blob([doc.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title.toLowerCase().replace(/\s+/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // View modal
  if (selectedDoc) {
    return (
      <div className="space-y-6 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <button
            onClick={() => setSelectedDoc(null)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Documents
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => handleCopy(selectedDoc.content)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all active:scale-95"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy All'}
            </button>
            <button
              onClick={() => handleDownload(selectedDoc)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 transition-all active:scale-95"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
          </div>
        </div>

        {/* Document Info */}
        <div>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
            {selectedDoc.category}
          </span>
          <h1 className="text-2xl font-bold mt-2">{selectedDoc.title}</h1>
          <p className="text-muted-foreground mt-1">{selectedDoc.description}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Last updated: {new Date(selectedDoc.updatedAt).toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="bg-card border border-border rounded-2xl p-6 overflow-x-auto">
          <pre className="whitespace-pre-wrap text-sm font-mono">{selectedDoc.content}</pre>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-muted-foreground mt-1">Shared files from Bob</p>
        </div>
        <button
          onClick={fetchDocuments}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 transition-all active:scale-95 self-start"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search documents..."
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

      {/* Document List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            <RefreshCw className="h-8 w-8 mx-auto mb-4 animate-spin opacity-50" />
            <p>Loading documents...</p>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No documents yet</p>
            <p className="text-sm mt-2">Documents shared by Bob will appear here</p>
          </div>
        ) : (
          filteredDocs.map(doc => (
            <div
              key={doc.id}
              className="bg-card border border-border rounded-2xl p-4 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {doc.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg">{doc.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{doc.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(doc.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setSelectedDoc(doc)}
                    className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-all active:scale-95"
                    title="View"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleCopy(doc.content)}
                    className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-all active:scale-95"
                    title="Copy"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDownload(doc)}
                    className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-all active:scale-95"
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
