import React, { useState } from 'react';
import { Calendar, Save, X, Tag, Heart, Brain, Sparkles } from 'lucide-react';

export const NewDreamEntry = ({ onSave, onCancel, onCheckAccess }) => {
  const [dreamEntry, setDreamEntry] = useState({
    dreamDate: new Date().toISOString().split('T')[0],
    dreamText: '',
    tags: [],
    emotions: [],
    interpretation: ''
  });
  
  const [currentTag, setCurrentTag] = useState('');
  const [currentEmotion, setCurrentEmotion] = useState('');
  const [isGeneratingInterpretation, setIsGeneratingInterpretation] = useState(false);

  const commonEmotions = [
    'joy', 'fear', 'anxiety', 'peace', 'confusion', 'excitement', 
    'sadness', 'anger', 'wonder', 'nostalgia', 'hope', 'relief'
  ];

  const addTag = () => {
    if (currentTag.trim() && !dreamEntry.tags.includes(currentTag.trim())) {
      setDreamEntry(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setDreamEntry(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addEmotion = (emotion) => {
    if (!dreamEntry.emotions.includes(emotion)) {
      setDreamEntry(prev => ({
        ...prev,
        emotions: [...prev.emotions, emotion]
      }));
    }
  };

  const removeEmotion = (emotionToRemove) => {
    setDreamEntry(prev => ({
      ...prev,
      emotions: prev.emotions.filter(emotion => emotion !== emotionToRemove)
    }));
  };

  const generateInterpretation = async () => {
    if (!onCheckAccess('interpretation') || !dreamEntry.dreamText.trim()) return;
    
    setIsGeneratingInterpretation(true);
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const interpretation = `This dream appears to reflect themes of exploration and personal growth. The symbols and narrative suggest your subconscious is processing recent experiences and emotions. Consider how the dream's elements might relate to your current life circumstances and aspirations.`;
      
      setDreamEntry(prev => ({ ...prev, interpretation }));
    } catch (error) {
      console.error('Error generating interpretation:', error);
    } finally {
      setIsGeneratingInterpretation(false);
    }
  };

  const handleSave = () => {
    if (!dreamEntry.dreamText.trim()) return;
    
    onSave(dreamEntry);
    // Reset form and navigate back
    setDreamEntry({
      dreamDate: new Date().toISOString().split('T')[0],
      dreamText: '',
      tags: [],
      emotions: [],
      interpretation: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display sm:text-4xl text-text-primary mb-2">
            New Dream Entry
          </h1>
          <p className="text-body text-text-secondary">
            Capture the details of your dream experience
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-6 w-6 text-text-secondary" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Date */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="text-heading text-text-primary">Dream Date</h2>
            </div>
            <input
              type="date"
              value={dreamEntry.dreamDate}
              onChange={(e) => setDreamEntry(prev => ({ ...prev, dreamDate: e.target.value }))}
              className="input"
            />
          </div>

          {/* Dream Description */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <Brain className="h-5 w-5 text-primary" />
              <h2 className="text-heading text-text-primary">Dream Description</h2>
            </div>
            <textarea
              placeholder="Describe your dream in as much detail as you can remember. Include people, places, emotions, colors, sounds, and any significant events or symbols..."
              value={dreamEntry.dreamText}
              onChange={(e) => setDreamEntry(prev => ({ ...prev, dreamText: e.target.value }))}
              className="textarea"
              rows={8}
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-caption text-text-secondary">
                {dreamEntry.dreamText.split(' ').filter(word => word.length > 0).length} words
              </p>
              <button
                onClick={generateInterpretation}
                disabled={!dreamEntry.dreamText.trim() || isGeneratingInterpretation}
                className="btn-outline text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingInterpretation ? (
                  <>Generating...</>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-1" />
                    Get AI Interpretation
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Interpretation */}
          {dreamEntry.interpretation && (
            <div className="card bg-gradient-to-r from-primary/5 to-accent/5">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-primary p-2 rounded-lg">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-heading text-text-primary">AI Interpretation</h2>
              </div>
              <p className="text-body text-text-primary whitespace-pre-line">
                {dreamEntry.interpretation}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tags */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <Tag className="h-5 w-5 text-primary" />
              <h2 className="text-heading text-text-primary">Tags</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Add a tag"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  className="input flex-1"
                />
                <button
                  onClick={addTag}
                  className="btn-primary px-3"
                >
                  Add
                </button>
              </div>
              
              {dreamEntry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {dreamEntry.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs flex items-center"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-blue-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Emotions */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <Heart className="h-5 w-5 text-primary" />
              <h2 className="text-heading text-text-primary">Emotions</h2>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-1">
                {commonEmotions.map((emotion) => (
                  <button
                    key={emotion}
                    onClick={() => addEmotion(emotion)}
                    disabled={dreamEntry.emotions.includes(emotion)}
                    className={`text-xs px-2 py-1 rounded-md transition-colors ${
                      dreamEntry.emotions.includes(emotion)
                        ? 'bg-pink-200 text-pink-800 cursor-not-allowed'
                        : 'bg-gray-100 text-text-secondary hover:bg-pink-100 hover:text-pink-800'
                    }`}
                  >
                    {emotion}
                  </button>
                ))}
              </div>
              
              {dreamEntry.emotions.length > 0 && (
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-caption text-text-secondary mb-2">Selected emotions:</p>
                  <div className="flex flex-wrap gap-1">
                    {dreamEntry.emotions.map((emotion, index) => (
                      <span
                        key={index}
                        className="bg-pink-100 text-pink-800 px-2 py-1 rounded-md text-xs flex items-center"
                      >
                        {emotion}
                        <button
                          onClick={() => removeEmotion(emotion)}
                          className="ml-1 hover:text-pink-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Save Actions */}
          <div className="card">
            <div className="space-y-3">
              <button
                onClick={handleSave}
                disabled={!dreamEntry.dreamText.trim()}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Dream Entry
              </button>
              <button
                onClick={onCancel}
                className="w-full btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};