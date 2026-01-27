'use client';

import { useEffect } from 'react';
import { PreferencesEditor } from '@/components/PreferencesEditor';
import { initializeSampleData } from '@/lib/store';
import { Settings2 } from 'lucide-react';

export default function PreferencesPage() {
  useEffect(() => {
    initializeSampleData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
          <Settings2 className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Preferences</h1>
          <p className="text-sm text-muted-foreground">
            Configure rules and settings stored as JSON
          </p>
        </div>
      </div>

      <div className="max-w-3xl">
        <PreferencesEditor />
      </div>
    </div>
  );
}
