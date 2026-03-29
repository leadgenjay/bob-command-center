'use client';

import { useState, useEffect } from 'react';
import { Users, Plus, Search, X, Star, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Contact {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  role: string | null;
  relationship_type: string | null;
  how_we_met: string | null;
  context: string | null;
  tags: string[] | null;
  notes: string | null;
  is_vip: boolean;
  is_active: boolean;
  last_contacted_at: string | null;
  created_at: string;
}

const RELATIONSHIP_TYPES = [
  'employee', 'friend', 'colleague', 'vendor', 'client', 'family', 'investor', 'mentor',
];

const SUGGESTED_TAGS = [
  'leadgenjay', 'nextwave', 'personal', 'n8n-insiders', 'vip', 'inner-circle',
  'local', 'remote', 'active', 'dormant',
];

const EMPTY_FORM = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  company: '',
  role: '',
  relationship_type: '',
  how_we_met: '',
  context: '',
  tags: [] as string[],
  notes: '',
  is_vip: false,
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRelationship, setSelectedRelationship] = useState<string | null>(null);

  // Sheet state
  const [showSheet, setShowSheet] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Detail modal
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Delete dialog
  const [deleteContactId, setDeleteContactId] = useState<string | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  // Escape key closes sheet and detail modal
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (showSheet) closeSheet();
        else if (selectedContact) setSelectedContact(null);
      }
    }
    if (showSheet || selectedContact) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [showSheet, selectedContact]);

  async function fetchContacts() {
    setLoading(true);
    try {
      const res = await fetch('/api/contacts');
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
      }
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    } finally {
      setLoading(false);
    }
  }

  function openAddSheet() {
    setEditingContact(null);
    setFormData({ ...EMPTY_FORM });
    setShowSheet(true);
  }

  function openEditSheet(contact: Contact) {
    setEditingContact(contact);
    setFormData({
      first_name: contact.first_name,
      last_name: contact.last_name || '',
      email: contact.email || '',
      phone: contact.phone || '',
      company: contact.company || '',
      role: contact.role || '',
      relationship_type: contact.relationship_type || '',
      how_we_met: contact.how_we_met || '',
      context: contact.context || '',
      tags: contact.tags || [],
      notes: contact.notes || '',
      is_vip: contact.is_vip,
    });
    setSelectedContact(null);
    setShowSheet(true);
  }

  function closeSheet() {
    setShowSheet(false);
    setEditingContact(null);
    setFormData({ ...EMPTY_FORM });
  }

  function toggleTag(tag: string) {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.first_name.trim()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim() || null,
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        company: formData.company.trim() || null,
        role: formData.role.trim() || null,
        relationship_type: formData.relationship_type || null,
        how_we_met: formData.how_we_met.trim() || null,
        context: formData.context.trim() || null,
        notes: formData.notes.trim() || null,
        tags: formData.tags.length > 0 ? formData.tags : null,
      };

      if (editingContact) {
        const res = await fetch('/api/contacts', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingContact.id, ...payload }),
        });
        if (res.ok) {
          const updated: Contact = await res.json();
          setContacts(prev => prev.map(c => c.id === updated.id ? updated : c));
          closeSheet();
        }
      } else {
        const res = await fetch('/api/contacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const created: Contact = await res.json();
          setContacts(prev => [created, ...prev]);
          closeSheet();
        }
      }
    } catch (error) {
      console.error('Failed to save contact:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function executeDelete() {
    if (!deleteContactId) return;
    try {
      const res = await fetch(`/api/contacts?id=${deleteContactId}`, { method: 'DELETE' });
      if (res.ok) {
        setContacts(prev => prev.filter(c => c.id !== deleteContactId));
        setSelectedContact(null);
      }
    } catch (error) {
      console.error('Failed to delete contact:', error);
    } finally {
      setDeleteContactId(null);
    }
  }

  // Filtering
  const filteredContacts = contacts.filter(c => {
    if (selectedRelationship && c.relationship_type !== selectedRelationship) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.first_name?.toLowerCase().includes(q) ||
        c.last_name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.company?.toLowerCase().includes(q) ||
        c.notes?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const relationshipFilters: (string | null)[] = [null, ...RELATIONSHIP_TYPES];

  return (
    <div className="space-y-5 md:space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Contacts</h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              {contacts.length} contact{contacts.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <button
          onClick={openAddSheet}
          className={cn(
            'h-10 w-10 rounded-xl bg-primary text-white',
            'flex items-center justify-center shadow-lg',
            'hover:shadow-xl active:scale-95 transition-all'
          )}
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className={cn(
            'w-full pl-9 pr-4 py-2.5 rounded-xl bg-muted/50 border border-border',
            'focus:outline-none focus:ring-2 focus:ring-primary/50',
            'placeholder:text-muted-foreground/50 text-sm'
          )}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Relationship Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
        {relationshipFilters.map(rel => {
          const count = rel === null
            ? contacts.length
            : contacts.filter(c => c.relationship_type === rel).length;
          return (
            <button
              key={rel ?? 'all'}
              onClick={() => setSelectedRelationship(rel)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap',
                'transition-all duration-200 active:scale-95',
                selectedRelationship === rel
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              )}
            >
              <span>{rel === null ? 'All' : rel.charAt(0).toUpperCase() + rel.slice(1)}</span>
              <span className={cn(
                'px-1.5 py-0.5 rounded-md text-xs',
                selectedRelationship === rel ? 'bg-white/20' : 'bg-muted'
              )}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Contact List */}
      <div className="space-y-3">
        {loading ? (
          <div className="frosted-glass rounded-2xl p-8 text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="frosted-glass rounded-2xl p-8 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">
              {contacts.length === 0 ? 'No contacts yet. Add your first contact!' : 'No contacts match your filters.'}
            </p>
            {contacts.length === 0 && (
              <button
                onClick={openAddSheet}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium"
              >
                Add your first contact
              </button>
            )}
          </div>
        ) : (
          filteredContacts.map(contact => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className="frosted-glass rounded-2xl p-4 md:p-5 cursor-pointer hover:shadow-md transition-all active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-base truncate">
                      {contact.first_name} {contact.last_name}
                    </h3>
                    {contact.is_vip && (
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                    )}
                  </div>
                  {contact.company && (
                    <p className="text-sm text-muted-foreground truncate">
                      {contact.role ? `${contact.role} at ` : ''}{contact.company}
                    </p>
                  )}
                  <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                    {contact.email && <span className="truncate">{contact.email}</span>}
                    {contact.phone && <span className="truncate">{contact.phone}</span>}
                  </div>
                </div>
                {contact.relationship_type && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full capitalize flex-shrink-0">
                    {contact.relationship_type}
                  </span>
                )}
              </div>
              {contact.tags && contact.tags.length > 0 && (
                <div className="flex gap-1.5 mt-3 flex-wrap">
                  {contact.tags.map(tag => (
                    <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Contact Detail Modal */}
      {selectedContact && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-50 animate-fade-in"
            onClick={() => setSelectedContact(null)}
          />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-lg mx-auto animate-slide-up">
            <div className="frosted-glass rounded-2xl p-5 shadow-2xl max-h-[85vh] overflow-y-auto">
              {/* Detail header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold truncate">
                      {selectedContact.first_name} {selectedContact.last_name}
                    </h2>
                    {selectedContact.is_vip && (
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                    )}
                  </div>
                  {selectedContact.company && (
                    <p className="text-sm text-muted-foreground">
                      {selectedContact.role ? `${selectedContact.role} at ` : ''}{selectedContact.company}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="h-8 w-8 rounded-xl bg-muted flex items-center justify-center ml-2 flex-shrink-0 active:scale-95 transition-transform"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Detail fields */}
              <div className="space-y-3 text-sm">
                {selectedContact.email && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-24 flex-shrink-0">Email</span>
                    <a href={`mailto:${selectedContact.email}`} className="text-primary truncate">
                      {selectedContact.email}
                    </a>
                  </div>
                )}
                {selectedContact.phone && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-24 flex-shrink-0">Phone</span>
                    <a href={`tel:${selectedContact.phone}`} className="text-primary">
                      {selectedContact.phone}
                    </a>
                  </div>
                )}
                {selectedContact.relationship_type && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-24 flex-shrink-0">Relationship</span>
                    <span className="capitalize bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                      {selectedContact.relationship_type}
                    </span>
                  </div>
                )}
                {selectedContact.how_we_met && (
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground w-24 flex-shrink-0">How we met</span>
                    <span>{selectedContact.how_we_met}</span>
                  </div>
                )}
                {selectedContact.context && (
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground w-24 flex-shrink-0">Context</span>
                    <span className="text-foreground/80">{selectedContact.context}</span>
                  </div>
                )}
                {selectedContact.notes && (
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground w-24 flex-shrink-0">Notes</span>
                    <span className="text-foreground/80 whitespace-pre-wrap">{selectedContact.notes}</span>
                  </div>
                )}
                {selectedContact.tags && selectedContact.tags.length > 0 && (
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground w-24 flex-shrink-0">Tags</span>
                    <div className="flex gap-1.5 flex-wrap">
                      {selectedContact.tags.map(tag => (
                        <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Detail actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => openEditSheet(selectedContact)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-muted text-foreground text-sm font-medium active:scale-95 transition-all"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => { setDeleteContactId(selectedContact.id); }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-destructive/10 text-destructive text-sm font-medium active:scale-95 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add / Edit Bottom Sheet */}
      {showSheet && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
            onClick={closeSheet}
          />
          <div className={cn(
            'fixed inset-x-0 bottom-0 z-50 max-h-[92vh]',
            'bg-background rounded-t-3xl shadow-2xl',
            'animate-slide-up-sheet'
          )}>
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Sheet header */}
            <div className="flex items-center justify-between px-6 pb-4">
              <h2 className="text-xl font-bold">
                {editingContact ? 'Edit Contact' : 'New Contact'}
              </h2>
              <button
                onClick={closeSheet}
                className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center active:scale-95 transition-transform"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="px-6 pb-8 space-y-4 overflow-y-auto max-h-[calc(92vh-100px)]"
            >
              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={e => setFormData(p => ({ ...p, first_name: e.target.value }))}
                    placeholder="First"
                    className={cn(
                      'w-full px-3 py-2 rounded-xl bg-muted/50 border border-border',
                      'focus:outline-none focus:ring-2 focus:ring-primary/50',
                      'placeholder:text-muted-foreground/50 text-sm'
                    )}
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={e => setFormData(p => ({ ...p, last_name: e.target.value }))}
                    placeholder="Last"
                    className={cn(
                      'w-full px-3 py-2 rounded-xl bg-muted/50 border border-border',
                      'focus:outline-none focus:ring-2 focus:ring-primary/50',
                      'placeholder:text-muted-foreground/50 text-sm'
                    )}
                  />
                </div>
              </div>

              {/* Email / Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    placeholder="email@example.com"
                    className={cn(
                      'w-full px-3 py-2 rounded-xl bg-muted/50 border border-border',
                      'focus:outline-none focus:ring-2 focus:ring-primary/50',
                      'placeholder:text-muted-foreground/50 text-sm'
                    )}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+1 555 000 0000"
                    className={cn(
                      'w-full px-3 py-2 rounded-xl bg-muted/50 border border-border',
                      'focus:outline-none focus:ring-2 focus:ring-primary/50',
                      'placeholder:text-muted-foreground/50 text-sm'
                    )}
                  />
                </div>
              </div>

              {/* Company / Role */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                    Company
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={e => setFormData(p => ({ ...p, company: e.target.value }))}
                    placeholder="Acme Inc."
                    className={cn(
                      'w-full px-3 py-2 rounded-xl bg-muted/50 border border-border',
                      'focus:outline-none focus:ring-2 focus:ring-primary/50',
                      'placeholder:text-muted-foreground/50 text-sm'
                    )}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                    Role
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={e => setFormData(p => ({ ...p, role: e.target.value }))}
                    placeholder="CEO, Engineer..."
                    className={cn(
                      'w-full px-3 py-2 rounded-xl bg-muted/50 border border-border',
                      'focus:outline-none focus:ring-2 focus:ring-primary/50',
                      'placeholder:text-muted-foreground/50 text-sm'
                    )}
                  />
                </div>
              </div>

              {/* Relationship Type */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                  Relationship Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {RELATIONSHIP_TYPES.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData(p => ({
                        ...p,
                        relationship_type: p.relationship_type === type ? '' : type,
                      }))}
                      className={cn(
                        'px-3 py-1.5 rounded-xl text-sm font-medium capitalize transition-all active:scale-95',
                        formData.relationship_type === type
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-muted/50 text-muted-foreground hover:bg-muted border border-border'
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* How we met */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                  How We Met
                </label>
                <input
                  type="text"
                  value={formData.how_we_met}
                  onChange={e => setFormData(p => ({ ...p, how_we_met: e.target.value }))}
                  placeholder="Conference, referral, online..."
                  className={cn(
                    'w-full px-3 py-2 rounded-xl bg-muted/50 border border-border',
                    'focus:outline-none focus:ring-2 focus:ring-primary/50',
                    'placeholder:text-muted-foreground/50 text-sm'
                  )}
                />
              </div>

              {/* Tags */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_TAGS.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        'px-3 py-1.5 rounded-xl text-sm font-medium transition-all active:scale-95',
                        formData.tags.includes(tag)
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-muted/50 text-muted-foreground hover:bg-muted border border-border'
                      )}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                  placeholder="Any additional context..."
                  rows={3}
                  className={cn(
                    'w-full px-3 py-2 rounded-xl bg-muted/50 border border-border resize-none',
                    'focus:outline-none focus:ring-2 focus:ring-primary/50',
                    'placeholder:text-muted-foreground/50 text-sm'
                  )}
                />
              </div>

              {/* VIP toggle */}
              <button
                type="button"
                onClick={() => setFormData(p => ({ ...p, is_vip: !p.is_vip }))}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 w-full',
                  formData.is_vip
                    ? 'bg-yellow-500/20 text-yellow-600 border border-yellow-500/30'
                    : 'bg-muted/50 text-muted-foreground border border-border hover:bg-muted'
                )}
              >
                <Star className={cn('h-4 w-4', formData.is_vip && 'fill-yellow-500 text-yellow-500')} />
                {formData.is_vip ? 'VIP Contact' : 'Mark as VIP'}
              </button>

              {/* Submit */}
              <button
                type="submit"
                disabled={!formData.first_name.trim() || isSubmitting}
                className={cn(
                  'w-full py-4 rounded-2xl font-semibold text-white',
                  'bg-gradient-to-r from-primary to-purple-600',
                  'shadow-lg hover:shadow-xl transition-all',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'active:scale-[0.98] flex items-center justify-center gap-2'
                )}
              >
                <Plus className="h-5 w-5" />
                {isSubmitting
                  ? (editingContact ? 'Saving...' : 'Adding...')
                  : (editingContact ? 'Save Changes' : 'Add Contact')}
              </button>
            </form>
          </div>
        </>
      )}

      {/* Delete Confirmation */}
      <AlertDialog
        open={deleteContactId !== null}
        onOpenChange={open => { if (!open) setDeleteContactId(null); }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contact</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this contact.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteContactId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={executeDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
