import React from 'react';
import { Moon, Home, BookOpen, TrendingUp, Plus, User, Settings } from 'lucide-react';

export const AppLayout = ({ children, user, currentView, onViewChange }) => {
  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'journal', label: 'Journal', icon: BookOpen },
    { id: 'patterns', label: 'Patterns', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-surface shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-primary rounded-lg p-2">
                <Moon className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-heading text-text-primary">Dream Weaver</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-1">
                <span className="text-caption text-text-secondary">
                  {user?.subscriptionTier === 'free' ? 'Free Plan' : 
                   user?.subscriptionTier === 'pro' ? 'Pro Plan' : 'Premium Plan'}
                </span>
                {user?.subscriptionTier === 'free' && (
                  <span className="bg-accent/10 text-accent px-2 py-1 rounded-md text-xs font-medium">
                    Upgrade
                  </span>
                )}
              </div>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <User className="h-5 w-5 text-text-secondary" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Mobile Navigation */}
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-200 z-10">
          <div className="flex justify-around items-center py-2">
            {navigation.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onViewChange(id)}
                className={`flex flex-col items-center px-3 py-2 rounded-lg transition-colors ${
                  currentView === id
                    ? 'text-primary bg-primary/10'
                    : 'text-text-secondary hover:text-text-primary hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-1">{label}</span>
              </button>
            ))}
            <button
              onClick={() => onViewChange('new-entry')}
              className="flex flex-col items-center px-3 py-2 rounded-lg bg-primary text-white"
            >
              <Plus className="h-5 w-5" />
              <span className="text-xs mt-1">New</span>
            </button>
          </div>
        </nav>

        {/* Desktop Sidebar */}
        <aside className="hidden sm:flex w-64 bg-surface border-r border-gray-200 flex-col">
          <nav className="flex-1 p-6">
            <div className="space-y-2">
              {navigation.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => onViewChange(id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    currentView === id
                      ? 'text-primary bg-primary/10'
                      : 'text-text-secondary hover:text-text-primary hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {label}
                </button>
              ))}
            </div>
            
            <div className="mt-8">
              <button
                onClick={() => onViewChange('new-entry')}
                className="w-full btn-primary flex items-center justify-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Dream
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 pb-20 sm:pb-6">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};