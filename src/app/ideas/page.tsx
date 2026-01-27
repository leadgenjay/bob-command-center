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
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
          <Lightbulb className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Ideas Vault</h1>
          <p className="text-sm text-muted-foreground">
            Capture, organize, and develop your ideas
          </p>
        </div>
      </div>

      <div className="max-w-4xl">
        <IdeasVault />
      </div>
    </div>
  );
}
