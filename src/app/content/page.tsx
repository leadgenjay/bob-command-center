'use client';

import { ContentLibrary } from '@/components/ContentLibrary';
import { Video } from 'lucide-react';

export default function ContentPage() {
  return (
    <div className="space-y-5 md:space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
          <Video className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Content Library</h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Search ads, transcripts, and creative assets
          </p>
        </div>
      </div>

      {/* Content Library */}
      <ContentLibrary />
    </div>
  );
}
