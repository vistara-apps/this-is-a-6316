import React from 'react';
import { TrendingUp, Tag, Heart, Calendar, BarChart3, PieChart, Lock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell } from 'recharts';

export const PatternDashboard = ({ dreamEntries, onCheckAccess, user }) => {
  // Check access for premium features
  const hasAccess = onCheckAccess('patterns');
  
  if (!hasAccess) {
    return (
      <div className="space-y-6">
        <div className="text-center sm:text-left">
          <h1 className="text-display sm:text-4xl text-text-primary mb-2">
            Dream Patterns
          </h1>
          <p className="text-body text-text-secondary">
            Discover recurring themes and insights in your dreams
          </p>
        </div>
        
        <div className="card text-center py-12">
          <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-heading text-text-primary mb-2">
            Premium Feature
          </h3>
          <p className="text-body text-text-secondary mb-6">
            Upgrade to Pro or Premium to unlock detailed pattern analysis and insights
          </p>
          <button className="btn-primary">
            Upgrade Now
          </button>
        </div>
      </div>
    );
  }

  // Analyze patterns from dream entries
  const analyzePatterns = () => {
    const tagFrequency = {};
    const emotionFrequency = {};
    const monthlyData = {};
    
    dreamEntries.forEach(entry => {
      // Count tags
      if (entry.tags) {
        entry.tags.forEach(tag => {
          tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
        });
      }
      
      // Count emotions
      if (entry.emotions) {
        entry.emotions.forEach(emotion => {
          emotionFrequency[emotion] = (emotionFrequency[emotion] || 0) + 1;
        });
      }
      
      // Count by month
      const month = new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });
    
    return {
      topTags: Object.entries(tagFrequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([tag, count]) => ({ name: tag, value: count })),
      topEmotions: Object.entries(emotionFrequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([emotion, count]) => ({ name: emotion, value: count })),
      monthlyTrends: Object.entries(monthlyData)
        .map(([month, count]) => ({ month, dreams: count }))
        .sort((a, b) => new Date(a.month) - new Date(b.month))
    };
  };

  const patterns = analyzePatterns();
  const colors = ['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-display sm:text-4xl text-text-primary mb-2">
          Dream Patterns
        </h1>
        <p className="text-body text-text-secondary">
          Discover recurring themes and insights in your dreams
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-text-secondary">Total Dreams</p>
              <p className="text-heading text-text-primary">{dreamEntries.length}</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-text-secondary">Unique Tags</p>
              <p className="text-heading text-text-primary">{patterns.topTags.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Tag className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-text-secondary">Emotions Tracked</p>
              <p className="text-heading text-text-primary">{patterns.topEmotions.length}</p>
            </div>
            <div className="bg-pink-100 p-3 rounded-lg">
              <Heart className="h-6 w-6 text-pink-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-heading text-text-primary">Dream Frequency</h2>
          </div>
          
          {patterns.monthlyTrends.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={patterns.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="dreams" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-text-secondary">
              <p>No data available yet</p>
            </div>
          )}
        </div>

        {/* Top Emotions */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <Heart className="h-5 w-5 text-primary" />
            <h2 className="text-heading text-text-primary">Common Emotions</h2>
          </div>
          
          {patterns.topEmotions.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={patterns.topEmotions}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {patterns.topEmotions.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-text-secondary">
              <p>No emotions tracked yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Tags */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <Tag className="h-5 w-5 text-primary" />
            <h2 className="text-heading text-text-primary">Most Common Themes</h2>
          </div>
          
          {patterns.topTags.length > 0 ? (
            <div className="space-y-3">
              {patterns.topTags.map((tag, index) => (
                <div key={tag.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <span className="text-body text-text-primary capitalize">{tag.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-gray-200 rounded-full h-2 w-20">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${(tag.value / Math.max(...patterns.topTags.map(t => t.value))) * 100}%`,
                          backgroundColor: colors[index % colors.length]
                        }}
                      />
                    </div>
                    <span className="text-caption text-text-secondary w-8 text-right">{tag.value}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-text-secondary">
              <p>No tags found yet</p>
            </div>
          )}
        </div>

        {/* Insights Summary */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2 className="text-heading text-text-primary">Key Insights</h2>
          </div>
          
          <div className="space-y-4">
            {dreamEntries.length > 0 ? (
              <>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-1">Dream Frequency</h3>
                  <p className="text-sm text-blue-700">
                    You average {(dreamEntries.length / Math.max(1, new Set(dreamEntries.map(e => e.dreamDate)).size)).toFixed(1)} dreams per recorded day
                  </p>
                </div>
                
                {patterns.topEmotions.length > 0 && (
                  <div className="p-4 bg-pink-50 rounded-lg">
                    <h3 className="font-medium text-pink-900 mb-1">Emotional Patterns</h3>
                    <p className="text-sm text-pink-700">
                      Your most common dream emotion is "{patterns.topEmotions[0].name}" appearing in {((patterns.topEmotions[0].value / dreamEntries.length) * 100).toFixed(0)}% of your dreams
                    </p>
                  </div>
                )}
                
                {patterns.topTags.length > 0 && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-medium text-green-900 mb-1">Recurring Themes</h3>
                    <p className="text-sm text-green-700">
                      "{patterns.topTags[0].name}" is your most frequent dream theme, appearing {patterns.topTags[0].value} times
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-text-secondary">
                <p>Start logging dreams to see personalized insights</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};