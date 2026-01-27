'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Circle, Clock, Users, Target, AlertCircle, GitBranch } from 'lucide-react';
import { sopDatabase } from './sop-data';

export default function SOPDetailPage() {
  const params = useParams();
  const sopId = params.id as string;
  const sop = sopDatabase[sopId];

  if (!sop) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">SOP not found</p>
        <Link href="/sops" className="text-primary mt-4 inline-block">
          Back to SOPs
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 max-w-3xl mx-auto">
      {/* Back Link */}
      <Link 
        href="/sops" 
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to SOPs
      </Link>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
            {sop.category}
          </span>
          <span className="text-xs text-muted-foreground">v{sop.version}</span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {sop.lastUpdated}
          </span>
        </div>
        <h1 className="text-2xl font-bold">{sop.title}</h1>
        <p className="text-muted-foreground mt-2">{sop.description}</p>
      </div>

      {/* Purpose */}
      <section className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Target className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-lg">Purpose</h2>
        </div>
        <p className="text-muted-foreground">{sop.purpose}</p>
      </section>

      {/* Scope */}
      <section className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-lg">Scope</h2>
        </div>
        <p className="text-muted-foreground">{sop.scope}</p>
      </section>

      {/* Prerequisites */}
      <section className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <h2 className="font-semibold text-lg">Prerequisites</h2>
        </div>
        <ul className="space-y-2">
          {sop.prerequisites.map((prereq, i) => (
            <li key={i} className="flex items-start gap-2 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              {prereq}
            </li>
          ))}
        </ul>
      </section>

      {/* Flowchart */}
      {sop.flowchart && (
        <section className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <GitBranch className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-lg">Process Flow</h2>
          </div>
          <pre className="text-sm text-muted-foreground overflow-x-auto font-mono bg-muted/50 rounded-xl p-4 whitespace-pre">
            {sop.flowchart.trim()}
          </pre>
        </section>
      )}

      {/* Steps */}
      <section>
        <h2 className="font-semibold text-lg mb-4">Procedure</h2>
        <div className="space-y-4">
          {sop.steps.map((step, index) => (
            <div key={index} className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                  
                  {/* Checklist */}
                  <div className="mt-3 space-y-2">
                    {step.checklist.map((item, i) => (
                      <label key={i} className="flex items-start gap-2 text-sm cursor-pointer group">
                        <Circle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0 group-hover:text-primary transition-colors" />
                        <span className="text-muted-foreground group-hover:text-foreground transition-colors">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Expected Outcomes */}
      <section className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          <h2 className="font-semibold text-lg">Expected Outcomes</h2>
        </div>
        <ul className="space-y-2">
          {sop.expectedOutcomes.map((outcome, i) => (
            <li key={i} className="flex items-start gap-2 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              {outcome}
            </li>
          ))}
        </ul>
      </section>

      {/* Troubleshooting */}
      <section>
        <h2 className="font-semibold text-lg mb-4">Troubleshooting</h2>
        <div className="space-y-3">
          {sop.troubleshooting.map((item, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-4">
              <p className="font-medium text-sm">{item.issue}</p>
              <p className="text-sm text-muted-foreground mt-1">{item.solution}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
