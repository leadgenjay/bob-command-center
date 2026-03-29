'use client';

import { useEffect, useState, useCallback } from 'react';
import { Command, COMMAND_CATEGORY_CONFIG, CommandCategory } from '@/lib/types';
import { Terminal, Plus, Copy, Check, Pencil, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CommandsPage() {
  const [commands, setCommands] = useState<Command[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCommand, setEditingCommand] = useState<Command | null>(null);
  const [filter, setFilter] = useState<CommandCategory | 'all'>('all');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    syntax: '',
    example: '',
    category: 'general' as CommandCategory,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCommands();
  }, []);

  const loadCommands = async () => {
    try {
      const res = await fetch('/api/commands');
      if (res.ok) {
        const data = await res.json();
        // Map API field 'command' -> 'syntax', supply defaults for missing fields
        const mapped = data.map((row: Record<string, unknown>) => ({
          ...row,
          syntax: row.command ?? '',
          example: row.example ?? null,
          enabled: row.enabled ?? true,
        }));
        setCommands(mapped);
      }
    } catch (error) {
      console.error('Failed to fetch commands:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingCommand) {
        await fetch('/api/commands', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingCommand.id,
            name: formData.name,
            description: formData.description,
            command: formData.syntax,
            category: formData.category,
          }),
        });
      } else {
        await fetch('/api/commands', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            command: formData.syntax,
            category: formData.category,
          }),
        });
      }

      await loadCommands();
      resetForm();
    } catch (error) {
      console.error('Failed to save command:', error);
    }
  };

  const handleEdit = (command: Command) => {
    setEditingCommand(command);
    setFormData({
      name: command.name,
      description: command.description,
      syntax: command.syntax,
      example: command.example || '',
      category: command.category,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/commands?id=${id}`, { method: 'DELETE' });
      await loadCommands();
    } catch (error) {
      console.error('Failed to delete command:', error);
    }
  };

  const resetForm = () => {
    setShowAddForm(false);
    setEditingCommand(null);
    setFormData({
      name: '',
      description: '',
      syntax: '',
      example: '',
      category: 'general',
    });
  };

  const filteredCommands = filter === 'all' 
    ? commands 
    : commands.filter(c => c.category === filter);

  const categories: (CommandCategory | 'all')[] = ['all', ...Object.keys(COMMAND_CATEGORY_CONFIG) as CommandCategory[]];

  return (
    <div className="space-y-5 md:space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
            <Terminal className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Commands</h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              {commands.length} command{commands.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setShowAddForm(true)}
          className={cn(
            'h-10 w-10 rounded-xl bg-primary text-white',
            'flex items-center justify-center shadow-lg',
            'hover:shadow-xl active:scale-95 transition-all'
          )}
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
        {categories.map((cat) => {
          const isAll = cat === 'all';
          const config = isAll ? null : COMMAND_CATEGORY_CONFIG[cat as CommandCategory];
          const count = isAll 
            ? commands.length 
            : commands.filter(c => c.category === cat).length;
          
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap',
                'transition-all duration-200 active:scale-95',
                filter === cat
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              )}
            >
              {isAll ? '⚡' : config?.emoji}
              <span>{isAll ? 'All' : config?.label}</span>
              <span className={cn(
                'px-1.5 py-0.5 rounded-md text-xs',
                filter === cat ? 'bg-white/20' : 'bg-muted'
              )}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Commands List */}
      <div className="space-y-3">
        {filteredCommands.length === 0 ? (
          <div className="frosted-glass rounded-2xl p-8 text-center">
            <Terminal className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No commands yet</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium"
            >
              Add your first command
            </button>
          </div>
        ) : (
          filteredCommands.map((command) => {
            const config = COMMAND_CATEGORY_CONFIG[command.category];
            return (
              <div
                key={command.id}
                className="frosted-glass rounded-2xl p-4 md:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={cn(
                      'h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0',
                      config.color.replace('bg-', 'bg-') + '/20'
                    )}>
                      <span className="text-lg">{config.emoji}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg">/{command.name}</h3>
                        <span className={cn(
                          'px-2 py-0.5 rounded-md text-xs font-medium',
                          config.color.replace('bg-', 'bg-') + '/20',
                          'text-' + config.color.replace('bg-', '') + '-600'
                        )}>
                          {config.label}
                        </span>
                        {!command.enabled && (
                          <span className="px-2 py-0.5 rounded-md text-xs bg-red-500/20 text-red-600">
                            Disabled
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {command.description}
                      </p>
                      
                      {/* Syntax */}
                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground mb-1">Syntax:</p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 bg-muted/50 px-3 py-2 rounded-lg text-sm font-mono truncate">
                            {command.syntax}
                          </code>
                          <button
                            onClick={() => handleCopy(command.syntax, command.id + '-syntax')}
                            className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            {copiedId === command.id + '-syntax' ? (
                              <Check className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <Copy className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      {/* Example */}
                      {command.example && (
                        <div className="mt-3">
                          <p className="text-xs text-muted-foreground mb-1">Example:</p>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 bg-muted/50 px-3 py-2 rounded-lg text-sm font-mono text-emerald-600 dark:text-emerald-400 truncate">
                              {command.example}
                            </code>
                            <button
                              onClick={() => handleCopy(command.example!, command.id + '-example')}
                              className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
                            >
                              {copiedId === command.id + '-example' ? (
                                <Check className="h-4 w-4 text-emerald-500" />
                              ) : (
                                <Copy className="h-4 w-4 text-muted-foreground" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(command)}
                      className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
                    >
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => handleDelete(command.id)}
                      className="h-8 w-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-50 animate-fade-in"
            onClick={resetForm}
          />
          <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up-sheet md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg">
            <div className="bottom-sheet rounded-t-3xl md:rounded-2xl max-h-[85vh] overflow-auto">
              {/* Handle (mobile) */}
              <div className="flex justify-center pt-3 pb-2 md:hidden">
                <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
              </div>
              
              {/* Header */}
              <div className="flex items-center justify-between px-5 pb-4 border-b border-border/50">
                <h2 className="text-lg font-semibold">
                  {editingCommand ? 'Edit Command' : 'Add Command'}
                </h2>
                <button
                  onClick={resetForm}
                  className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              {/* Form */}
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Command Name</label>
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-muted-foreground">/</span>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value.toLowerCase().replace(/\s/g, '') })}
                      placeholder="kb"
                      className="flex-1 px-3 py-2 rounded-xl bg-muted/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="What does this command do?"
                    className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Syntax</label>
                  <input
                    type="text"
                    value={formData.syntax}
                    onChange={(e) => setFormData({ ...formData, syntax: e.target.value })}
                    placeholder="/kb [Department] Title | Description"
                    className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Example (optional)</label>
                  <input
                    type="text"
                    value={formData.example}
                    onChange={(e) => setFormData({ ...formData, example: e.target.value })}
                    placeholder="/kb [Sales] New Rule | Description here"
                    className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(COMMAND_CATEGORY_CONFIG).map(([key, config]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: key as CommandCategory })}
                        className={cn(
                          'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium',
                          'transition-all duration-200 active:scale-95',
                          formData.category === key
                            ? 'bg-primary text-white'
                            : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                        )}
                      >
                        {config.emoji} {config.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-3 rounded-xl bg-muted text-foreground font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 rounded-xl bg-primary text-white font-medium"
                  >
                    {editingCommand ? 'Save Changes' : 'Add Command'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
