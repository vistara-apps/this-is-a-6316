import React from 'react';
import { Calendar, Brain, TrendingUp, BookOpen, Zap, Lock } from 'lucide-react';
import { format, subDays } from 'date-fns';

export const Dashboard = ({ dreamEntries, user, onViewChange, onCheckAccess }) => {
  const recentEntries = dreamEntries.slice(0, 3);
  const totalDreams = dreamEntries.length;
  const thisWeekDreams = dreamEntries.filter(entry => 
    new Date(entry.createdAt) > subDays(new Date(), 7)
  ).length;

  const stats = [
    {
      label: 'Total Dreams',
      value: totalDreams,
      icon: BookOpen,
      color: 'text-primary'
    },
    {
      label: 'This Week',
      value: thisWeekDreams,
      icon: Calendar,
      color: 'text-accent'
    },
    {
      label: 'Interpretations',
      value: dreamEntries.filter(e => e.interpretation).length,
      icon: Brain,
      color: 'text-purple-500'
    }
  ];

  const handleNewDream = () => {
    if (onCheckAccess('unlimited')) {
      onViewChange('new-entry');
    }
  };

  const handleViewPatterns = () => {
    if (onCheckAccess('patterns')) {
      onViewChange('patterns');
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center sm:text-left">
        <h1 className="text-display sm:text-4xl text-text-primary mb-2">
          Welcome back
        </h1>
        <p className="text-body text-text-secondary">
          Ready to explore your subconscious mind?
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption text-text-secondary">{stat.label}</p>
                <p className="text-heading text-text-primary">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={handleNewDream}
          className="card hover:shadow-lg transition-all duration-250 text-left group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-heading text-text-primary mb-2">Log New Dream</h3>
              <p className="text-body text-text-secondary">
                Capture your latest dream experience
              </p>
              {user?.subscriptionTier === 'free' && totalDreams >= 5 && (
                <div className="flex items-center mt-2 text-accent">
                  <Lock className="h-4 w-4 mr-1" />
                  <span className="text-sm">Upgrade to continue</span>
                </div>
              )}
            </div>
            <div className="bg-primary/10 p-4 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
              <Brain className="h-8 w-8 text-primary group-hover:text-white" />
            </div>
          </div>
        </button>

        <button
          onClick={handleViewPatterns}
          className="card hover:shadow-lg transition-all duration-250 text-left group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-heading text-text-primary mb-2">View Patterns</h3>
              <p className="text-body text-text-secondary">
                Discover recurring themes and symbols
              </p>
              {user?.subscriptionTier === 'free' && (
                <div className="flex items-center mt-2 text-accent">
                  <Lock className="h-4 w-4 mr-1" />
                  <span className="text-sm">Pro feature</span>
                </div>
              )}
            </div>
            <div className="bg-accent/10 p-4 rounded-lg group-hover:bg-accent group-hover:text-white transition-colors">
              <TrendingUp className="h-8 w-8 text-accent group-hover:text-white" />
            </div>
          </div>
        </button>
      </div>

      {/* Recent Dreams */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-heading text-text-primary">Recent Dreams</h2>
          <button
            onClick={() => onViewChange('journal')}
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            View All
          </button>
        </div>

        {recentEntries.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-text-secondary">No dreams recorded yet</p>
            <button
              onClick={handleNewDream}
              className="mt-4 btn-primary"
            >
              Log Your First Dream
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {recentEntries.map((entry) => (
              <div key={entry.dreamEntryId} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-caption text-text-secondary">
                    {format(new Date(entry.dreamDate), 'MMM d, yyyy')}
                  </p>
                  {entry.interpretation && (
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs">
                      Interpreted
                    </span>
                  )}
                </div>
                <p className="text-body text-text-primary line-clamp-2">
                  {entry.dreamText}
                </p>
                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {entry.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="bg-gray-100 text-text-secondary px-2 py-1 rounded-md text-xs">
                        {tag}
                      </span>
                    ))}
                    {entry.tags.length > 3 && (
                      <span className="text-text-secondary text-xs">
                        +{entry.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Subscription CTA for Free Users */}
      {user?.subscriptionTier === 'free' && (
        <div className="card bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-heading text-text-primary mb-2">Unlock Advanced Features</h3>
              <p className="text-body text-text-secondary mb-4">
                Get unlimited dream entries, pattern analysis, and advanced AI insights
              </p>
              <div className="flex items-center space-x-4 text-sm text-text-secondary">
                <div className="flex items-center">
                  <Zap className="h-4 w-4 mr-1 text-primary" />
                  Unlimited dreams
                </div>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1 text-primary" />
                  Pattern analysis
                </div>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-1 text-primary" />
                  Advanced insights
                </div>
              </div>
            </div>
            <button className="btn-primary flex-shrink-0 ml-4">
              Upgrade Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};