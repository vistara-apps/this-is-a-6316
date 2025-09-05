import React from 'react';
import { Moon, Shield, Brain, TrendingUp } from 'lucide-react';

export const LoginScreen = ({ onLogin }) => {
  const handleDemoLogin = () => {
    const demoUser = {
      userId: 'demo-user-123',
      email: 'demo@dreamweaver.com',
      subscriptionTier: 'free',
      createdAt: new Date().toISOString()
    };
    onLogin(demoUser);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="bg-primary rounded-xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Moon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-display text-text-primary mb-2">Dream Weaver</h1>
          <p className="text-body text-text-secondary">
            Unlock the secrets of your subconscious, securely and privately.
          </p>
        </div>

        <div className="card mb-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Brain className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium text-text-primary">AI Dream Interpretation</h3>
                <p className="text-sm text-text-secondary">Get instant, personalized insights into your dreams</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium text-text-primary">Private & Secure</h3>
                <p className="text-sm text-text-secondary">End-to-end encrypted dream journal</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <TrendingUp className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium text-text-primary">Pattern Tracking</h3>
                <p className="text-sm text-text-secondary">Discover recurring themes in your subconscious</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleDemoLogin}
            className="w-full btn-primary"
          >
            Continue with Demo
          </button>
          <button className="w-full btn-outline">
            Sign in with Google
          </button>
          <button className="w-full btn-outline">
            Connect Wallet
          </button>
        </div>

        <p className="text-center text-sm text-text-secondary mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};