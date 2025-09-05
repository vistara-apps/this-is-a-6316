import React, { useState } from 'react';
import { Calendar, Brain, Tag, Heart, ChevronDown, ChevronUp, Sparkles, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { InterpretationCard } from './InterpretationCard';

export const DreamEntryCard = ({ entry, onCheckAccess }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showInterpretation, setShowInterpretation] = useState(false);

  const handleGetInterpretation = () => {
    if (onCheckAccess('interpretation')) {
      setShowInterpretation(true);
    }
  };

  return (
    <div className="card hover:shadow-lg transition-all duration-250">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-caption text-text-secondary">
              {format(new Date(entry.dreamDate), 'EEEE, MMMM d, yyyy')}
            </p>
            <p className="text-xs text-text-secondary">
              Logged {format(new Date(entry.createdAt), 'MMM d, h:mm a')}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-text-secondary" />
          ) : (
            <ChevronDown className="h-5 w-5 text-text-secondary" />
          )}
        </button>
      </div>

      {/* Dream Text */}
      <div className="mb-4">
        <p className={`text-body text-text-primary ${!isExpanded ? 'line-clamp-3' : ''}`}>
          {entry.dreamText}
        </p>
        {!isExpanded && entry.dreamText.length > 150 && (
          <button
            onClick={() => setIsExpanded(true)}
            className="text-primary text-sm mt-1 hover:text-primary/80"
          >
            Read more...
          </button>
        )}
      </div>

      {/* Tags and Emotions */}
      {(entry.tags?.length > 0 || entry.emotions?.length > 0) && (
        <div className="mb-4 space-y-2">
          {entry.tags?.length > 0 && (
            <div className="flex items-center flex-wrap gap-1">
              <Tag className="h-4 w-4 text-text-secondary mr-1" />
              {entry.tags.map((tag, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {entry.emotions?.length > 0 && (
            <div className="flex items-center flex-wrap gap-1">
              <Heart className="h-4 w-4 text-text-secondary mr-1" />
              {entry.emotions.map((emotion, index) => (
                <span key={index} className="bg-pink-100 text-pink-800 px-2 py-1 rounded-md text-xs">
                  {emotion}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          {entry.interpretation ? (
            <span className="flex items-center text-primary text-sm">
              <Sparkles className="h-4 w-4 mr-1" />
              Interpreted
            </span>
          ) : (
            <button
              onClick={handleGetInterpretation}
              className="btn-primary text-sm flex items-center"
            >
              <Brain className="h-4 w-4 mr-1" />
              Get Interpretation
            </button>
          )}
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-text-secondary">
          <span>{entry.dreamText.split(' ').length} words</span>
        </div>
      </div>

      {/* Interpretation */}
      {(entry.interpretation || showInterpretation) && isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <InterpretationCard
            dreamText={entry.dreamText}
            interpretation={entry.interpretation}
            onCheckAccess={onCheckAccess}
          />
        </div>
      )}
    </div>
  );
};