'use client';

import { useEffect } from 'react';
import { DecisionLog } from '@/components/DecisionLog';
import { initializeSampleData } from '@/lib/store';
import { Scale } from 'lucide-react';

export default function DecisionsPage() {
  useEffect(() => {
    initializeSampleData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
          <Scale className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Decision Log</h1>
          <p className="text-sm text-muted-foreground">
            Document important decisions with context and outcomes
          </p>
        </div>
      </div>

      <div className="max-w-3xl">
        <DecisionLog />
      </div>
    </div>
  );
}
