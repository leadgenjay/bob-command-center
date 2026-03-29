'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { IdeasVault } from '@/components/IdeasVault';
import { AddIdeaSheet } from '@/components/AddIdeaSheet';
import { initializeSampleData } from '@/lib/store';
import { Lightbulb, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

function IdeasPageContent() {
  const [showAddSheet, setShowAddSheet] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    initializeSampleData();
  }, []);

  // Handle ?add=true query param
  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      setShowAddSheet(true);
      router.replace('/ideas', { scroll: false });
    }
  }, [searchParams, router]);

  const [refreshKey, setRefreshKey] = useState(0);

  const handleIdeaAdded = useCallback(() => {
    setRefreshKey(k => k + 1);
  }, []);

  return (
    <div className="space-y-5 md:space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <Lightbulb className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Ideas</h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Capture and develop your thoughts
            </p>
          </div>
        </div>
        
        {/* Add button */}
        <button
          onClick={() => setShowAddSheet(true)}
          className={cn(
            'h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white',
            'flex items-center justify-center shadow-lg',
            'hover:shadow-xl active:scale-95 transition-all'
          )}
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* Full width ideas vault */}
      <div className="max-w-2xl">
        <IdeasVault key={refreshKey} />
      </div>

      {/* Add Idea Sheet */}
      <AddIdeaSheet 
        isOpen={showAddSheet} 
        onClose={() => setShowAddSheet(false)}
        onIdeaAdded={handleIdeaAdded}
      />
    </div>
  );
}

export default function IdeasPage() {
  return (
    <Suspense fallback={
      <div className="space-y-5 md:space-y-6 animate-slide-up">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <Lightbulb className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Ideas</h1>
            <p className="text-xs md:text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <IdeasPageContent />
    </Suspense>
  );
}
