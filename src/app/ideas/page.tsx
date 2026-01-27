'use client';

import { useEffect } from 'react';
import { IdeasVault } from '@/components/IdeasVault';
import { initializeSampleData } from '@/lib/store';
import { Lightbulb } from 'lucide-react';

export default function IdeasPage() {
  useEffect(() => {
    initializeSampleData();
  }, []);

  return (
    <div className="space-y-5 md:space-y-6 animate-slide-up">
      {/* Header */}
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

      {/* Full width ideas vault */}
      <div className="max-w-2xl">
        <IdeasVault />
      </div>
    </div>
  );
}
