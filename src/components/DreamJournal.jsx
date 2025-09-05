import React, { useState } from 'react';
import { Search, Filter, Calendar, BookOpen, Brain } from 'lucide-react';
import { format } from 'date-fns';
import { DreamEntryCard } from './DreamEntryCard';

export const DreamJournal = ({ dreamEntries, onCheckAccess }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const filteredEntries = dreamEntries
    .filter(entry => {
      const matchesSearch = entry.dreamText.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (entry.tags && entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
      
      const matchesFilter = selectedFilter === 'all' ||
                           (selectedFilter === 'interpreted' && entry.interpretation) ||
                           (selectedFilter === 'uninterpreted' && !entry.interpretation);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-display sm:text-4xl text-text-primary mb-2">
          Dream Journal
        </h1>
        <p className="text-body text-text-secondary">
          Your personal collection of dream experiences and insights
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-secondary" />
            <input
              type="text"
              placeholder="Search dreams, tags, emotions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="input w-auto"
            >
              <option value="all">All Dreams</option>
              <option value="interpreted">Interpreted</option>
              <option value="uninterpreted">Uninterpreted</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input w-auto"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="card text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-heading text-text-primary mb-2">
              {searchTerm || selectedFilter !== 'all' ? 'No dreams found' : 'No dreams yet'}
            </h3>
            <p className="text-body text-text-secondary mb-6">
              {searchTerm || selectedFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Start building your dream journal by logging your first dream'
              }
            </p>
            {!searchTerm && selectedFilter === 'all' && (
              <button className="btn-primary">
                Log Your First Dream
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-caption text-text-secondary">
                {filteredEntries.length} dream{filteredEntries.length !== 1 ? 's' : ''} found
              </p>
            </div>
            
            <div className="grid gap-4">
              {filteredEntries.map((entry) => (
                <DreamEntryCard
                  key={entry.dreamEntryId}
                  entry={entry}
                  onCheckAccess={onCheckAccess}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};