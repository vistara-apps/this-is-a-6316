import React, { useState, useEffect } from 'react';
import { AppLayout } from './components/AppLayout';
import { LoginScreen } from './components/LoginScreen';
import { Dashboard } from './components/Dashboard';
import { DreamJournal } from './components/DreamJournal';
import { NewDreamEntry } from './components/NewDreamEntry';
import { PatternDashboard } from './components/PatternDashboard';
import { SubscriptionModal } from './components/SubscriptionModal';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [dreamEntries, setDreamEntries] = useState([]);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  // Initialize with demo user for this prototype
  useEffect(() => {
    const demoUser = {
      userId: 'demo-user-123',
      email: 'demo@dreamweaver.com',
      subscriptionTier: 'free',
      createdAt: new Date().toISOString()
    };
    setUser(demoUser);
    
    // Load demo dream entries
    const savedEntries = localStorage.getItem('dreamEntries');
    if (savedEntries) {
      setDreamEntries(JSON.parse(savedEntries));
    } else {
      // Initialize with demo data
      const demoEntries = [
        {
          dreamEntryId: '1',
          dreamDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          dreamText: 'I was flying over a vast ocean, feeling completely free and weightless.',
          interpretation: 'Flying dreams often represent a desire for freedom and escape from life\'s constraints. The ocean symbolizes the unconscious mind and emotional depth.',
          tags: ['flying', 'ocean', 'freedom'],
          emotions: ['joy', 'peace', 'liberation'],
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      setDreamEntries(demoEntries);
      localStorage.setItem('dreamEntries', JSON.stringify(demoEntries));
    }
  }, []);

  const addDreamEntry = (entry) => {
    const newEntry = {
      ...entry,
      dreamEntryId: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    const updatedEntries = [newEntry, ...dreamEntries];
    setDreamEntries(updatedEntries);
    localStorage.setItem('dreamEntries', JSON.stringify(updatedEntries));
  };

  const checkSubscriptionAccess = (feature) => {
    if (user?.subscriptionTier === 'free') {
      if (feature === 'unlimited' && dreamEntries.length >= 5) {
        setShowSubscriptionModal(true);
        return false;
      }
      if (feature === 'patterns' || feature === 'advanced') {
        setShowSubscriptionModal(true);
        return false;
      }
    }
    return true;
  };

  if (!user) {
    return <LoginScreen onLogin={setUser} />;
  }

  return (
    <AppLayout 
      user={user} 
      currentView={currentView} 
      onViewChange={setCurrentView}
    >
      {currentView === 'dashboard' && (
        <Dashboard 
          dreamEntries={dreamEntries}
          user={user}
          onViewChange={setCurrentView}
          onCheckAccess={checkSubscriptionAccess}
        />
      )}
      {currentView === 'journal' && (
        <DreamJournal 
          dreamEntries={dreamEntries}
          onCheckAccess={checkSubscriptionAccess}
        />
      )}
      {currentView === 'new-entry' && (
        <NewDreamEntry 
          onSave={addDreamEntry}
          onCancel={() => setCurrentView('journal')}
          onCheckAccess={checkSubscriptionAccess}
        />
      )}
      {currentView === 'patterns' && (
        <PatternDashboard 
          dreamEntries={dreamEntries}
          onCheckAccess={checkSubscriptionAccess}
        />
      )}
      
      {showSubscriptionModal && (
        <SubscriptionModal 
          currentUser={user}
          onClose={() => setShowSubscriptionModal(false)}
          onUpgrade={(tier) => {
            setUser({ ...user, subscriptionTier: tier });
            setShowSubscriptionModal(false);
          }}
        />
      )}
    </AppLayout>
  );
}

export default App;
