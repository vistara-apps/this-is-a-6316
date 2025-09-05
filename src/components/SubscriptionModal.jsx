import React from 'react';
import { X, Check, Star, Zap, Shield, TrendingUp, Download, Headphones } from 'lucide-react';

export const SubscriptionModal = ({ onClose, onUpgrade }) => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      current: true,
      features: [
        'Up to 5 dream entries per month',
        'Basic AI interpretations',
        'Simple dream logging',
        'Basic search functionality'
      ],
      limitations: [
        'Limited dream entries',
        'No pattern analysis',
        'No data export'
      ]
    },
    {
      name: 'Pro',
      price: '$5',
      period: 'month',
      popular: true,
      features: [
        'Unlimited dream entries',
        'Advanced AI interpretations',
        'Pattern tracking & analysis',
        'Encrypted cloud storage',
        'Advanced search & filtering',
        'Monthly insight reports'
      ]
    },
    {
      name: 'Premium',
      price: '$15',
      period: 'month',
      features: [
        'Everything in Pro',
        'Personalized dream coaching',
        'Advanced analytics dashboard',
        'Data export (PDF, CSV)',
        'Priority customer support',
        'Early access to new features',
        'Custom interpretation models'
      ]
    }
  ];

  const handleUpgrade = (planName) => {
    // In a real app, this would integrate with Stripe
    onUpgrade(planName.toLowerCase());
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-xl shadow-modal max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-heading text-text-primary">Choose Your Plan</h2>
            <p className="text-body text-text-secondary">Unlock the full potential of your dream analysis</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-text-secondary" />
          </button>
        </div>

        {/* Plans Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative border rounded-xl p-6 ${
                  plan.popular
                    ? 'border-primary bg-primary/5'
                    : plan.current
                    ? 'border-gray-300 bg-gray-50'
                    : 'border-gray-200 bg-surface'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      Most Popular
                    </span>
                  </div>
                )}

                {plan.current && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Current Plan
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-heading text-text-primary mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-text-primary">{plan.price}</span>
                    {plan.price !== '$0' && (
                      <span className="text-text-secondary">/{plan.period}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-text-primary">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.limitations && plan.limitations.map((limitation, index) => (
                    <div key={index} className="flex items-start space-x-3 opacity-60">
                      <X className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-text-secondary line-through">{limitation}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleUpgrade(plan.name)}
                  disabled={plan.current}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    plan.current
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : plan.popular
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'bg-gray-100 text-text-primary hover:bg-gray-200'
                  }`}
                >
                  {plan.current ? 'Current Plan' : `Upgrade to ${plan.name}`}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Features Comparison */}
        <div className="border-t border-gray-200 p-6">
          <h3 className="text-heading text-text-primary mb-4">Feature Comparison</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start space-x-3">
              <Zap className="h-6 w-6 text-yellow-500 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-text-primary">Unlimited Dreams</h4>
                <p className="text-sm text-text-secondary">No limits on dream entries</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <TrendingUp className="h-6 w-6 text-blue-500 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-text-primary">Pattern Analysis</h4>
                <p className="text-sm text-text-secondary">Advanced insights & trends</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Shield className="h-6 w-6 text-green-500 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-text-primary">Secure Storage</h4>
                <p className="text-sm text-text-secondary">End-to-end encryption</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Download className="h-6 w-6 text-purple-500 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-text-primary">Data Export</h4>
                <p className="text-sm text-text-secondary">PDF & CSV downloads</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="text-center">
            <p className="text-sm text-text-secondary mb-2">
              ✨ 30-day money-back guarantee • Cancel anytime • Secure payment with Stripe
            </p>
            <p className="text-xs text-text-secondary">
              All subscriptions include end-to-end encryption and full data ownership
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};