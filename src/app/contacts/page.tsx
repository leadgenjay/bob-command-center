'use client';

import { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabase';

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
  'employee', 'friend', 'colleague', 'vendor', 'client', 'family', 'investor', 'mentor'
];

const SUGGESTED_TAGS = [
  'leadgenjay', 'nextwave', 'personal', 'n8n-insiders', 'vip', 'inner-circle', 
  'local', 'remote', 'active', 'dormant'
];

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedRelationship, setSelectedRelationship] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);

  // Form state
  const [formData, setFormData] = useState({
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
    is_vip: false
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [contacts, searchQuery, selectedTag, selectedRelationship]);

  async function fetchContacts() {
    setLoading(true);
    const { data, error } = await getSupabase()
      .from('contacts')
      .select('*')
      .order('first_name', { ascending: true });
    
    if (error) {
      console.error('Error fetching contacts:', error);
    } else {
      setContacts(data || []);
      // Extract all unique tags
      const tags = new Set<string>();
      data?.forEach(c => c.tags?.forEach((t: string) => tags.add(t)));
      setAllTags(Array.from(tags).sort());
    }
    setLoading(false);
  }

  function filterContacts() {
    let filtered = [...contacts];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.first_name?.toLowerCase().includes(query) ||
        c.last_name?.toLowerCase().includes(query) ||
        c.email?.toLowerCase().includes(query) ||
        c.company?.toLowerCase().includes(query) ||
        c.notes?.toLowerCase().includes(query)
      );
    }
    
    if (selectedTag) {
      filtered = filtered.filter(c => c.tags?.includes(selectedTag));
    }
    
    if (selectedRelationship) {
      filtered = filtered.filter(c => c.relationship_type === selectedRelationship);
    }
    
    setFilteredContacts(filtered);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    const { error } = await getSupabase()
      .from('contacts')
      .insert([formData]);
    
    if (error) {
      console.error('Error adding contact:', error);
      alert('Error adding contact');
    } else {
      setShowAddForm(false);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        company: '',
        role: '',
        relationship_type: '',
        how_we_met: '',
        context: '',
        tags: [],
        notes: '',
        is_vip: false
      });
      fetchContacts();
    }
  }

  async function deleteContact(id: string) {
    if (!confirm('Delete this contact?')) return;
    
    const { error } = await getSupabase()
      .from('contacts')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setSelectedContact(null);
      fetchContacts();
    }
  }

  function toggleTag(tag: string) {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Contacts</h1>
            <p className="text-gray-400">{contacts.length} contacts</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <span>+</span> Add Contact
          </button>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <div className="w-64 flex-shrink-0">
            {/* Search */}
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 mb-4"
            />

            {/* Relationship Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">RELATIONSHIP</h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedRelationship(null)}
                  className={`w-full text-left px-3 py-1.5 rounded ${!selectedRelationship ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
                >
                  All
                </button>
                {RELATIONSHIP_TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedRelationship(type)}
                    className={`w-full text-left px-3 py-1.5 rounded capitalize ${selectedRelationship === type ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags Filter */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-2">TAGS</h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`w-full text-left px-3 py-1.5 rounded ${!selectedTag ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
                >
                  All Tags
                </button>
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`w-full text-left px-3 py-1.5 rounded ${selectedTag === tag ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contact List */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-12 text-gray-400">Loading...</div>
            ) : filteredContacts.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                {contacts.length === 0 ? 'No contacts yet. Add your first contact!' : 'No contacts match your filters.'}
              </div>
            ) : (
              <div className="grid gap-3">
                {filteredContacts.map(contact => (
                  <div
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-750 border border-gray-700 hover:border-gray-600"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">
                            {contact.first_name} {contact.last_name}
                          </h3>
                          {contact.is_vip && (
                            <span className="text-yellow-500">⭐</span>
                          )}
                        </div>
                        {contact.company && (
                          <p className="text-gray-400">{contact.role ? `${contact.role} at ` : ''}{contact.company}</p>
                        )}
                        <div className="flex gap-4 mt-1 text-sm text-gray-500">
                          {contact.email && <span>{contact.email}</span>}
                          {contact.phone && <span>{contact.phone}</span>}
                        </div>
                      </div>
                      <div className="text-right">
                        {contact.relationship_type && (
                          <span className="text-xs bg-gray-700 px-2 py-1 rounded capitalize">
                            {contact.relationship_type}
                          </span>
                        )}
                      </div>
                    </div>
                    {contact.tags && contact.tags.length > 0 && (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {contact.tags.map(tag => (
                          <span key={tag} className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Contact Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Add Contact</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.first_name}
                      onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Company</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Role</label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Relationship Type</label>
                  <select
                    value={formData.relationship_type}
                    onChange={(e) => setFormData({...formData, relationship_type: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                  >
                    <option value="">Select...</option>
                    {RELATIONSHIP_TYPES.map(type => (
                      <option key={type} value={type} className="capitalize">{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">How We Met</label>
                  <input
                    type="text"
                    value={formData.how_we_met}
                    onChange={(e) => setFormData({...formData, how_we_met: e.target.value})}
                    placeholder="Conference, referral, online..."
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_TAGS.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1 rounded text-sm ${
                          formData.tags.includes(tag) 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={3}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_vip"
                    checked={formData.is_vip}
                    onChange={(e) => setFormData({...formData, is_vip: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <label htmlFor="is_vip">⭐ VIP Contact</label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded"
                  >
                    Add Contact
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Contact Detail Modal */}
        {selectedContact && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    {selectedContact.first_name} {selectedContact.last_name}
                    {selectedContact.is_vip && <span className="text-yellow-500">⭐</span>}
                  </h2>
                  {selectedContact.company && (
                    <p className="text-gray-400">
                      {selectedContact.role ? `${selectedContact.role} at ` : ''}{selectedContact.company}
                    </p>
                  )}
                </div>
                <button onClick={() => setSelectedContact(null)} className="text-gray-400 hover:text-white text-2xl">
                  ×
                </button>
              </div>

              <div className="space-y-3 text-sm">
                {selectedContact.email && (
                  <div>
                    <span className="text-gray-400">Email:</span>{' '}
                    <a href={`mailto:${selectedContact.email}`} className="text-blue-400">{selectedContact.email}</a>
                  </div>
                )}
                {selectedContact.phone && (
                  <div>
                    <span className="text-gray-400">Phone:</span>{' '}
                    <a href={`tel:${selectedContact.phone}`} className="text-blue-400">{selectedContact.phone}</a>
                  </div>
                )}
                {selectedContact.relationship_type && (
                  <div>
                    <span className="text-gray-400">Relationship:</span>{' '}
                    <span className="capitalize">{selectedContact.relationship_type}</span>
                  </div>
                )}
                {selectedContact.how_we_met && (
                  <div>
                    <span className="text-gray-400">How we met:</span> {selectedContact.how_we_met}
                  </div>
                )}
                {selectedContact.notes && (
                  <div>
                    <span className="text-gray-400">Notes:</span>
                    <p className="mt-1 text-gray-300">{selectedContact.notes}</p>
                  </div>
                )}
                {selectedContact.tags && selectedContact.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap pt-2">
                    {selectedContact.tags.map(tag => (
                      <span key={tag} className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => deleteContact(selectedContact.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded"
                >
                  Delete
                </button>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
