import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

let stripePromise = null;

if (stripePublishableKey) {
  stripePromise = loadStripe(stripePublishableKey);
} else {
  console.warn('Stripe publishable key not found. Payment functionality will be limited.');
}

/**
 * Subscription tier configurations
 */
export const SUBSCRIPTION_TIERS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      'Up to 5 dream entries per month',
      'Basic AI interpretation',
      'Simple dream journal',
      'Basic privacy protection'
    ],
    limits: {
      dreamEntries: 5,
      interpretations: 5,
      patterns: false,
      advanced: false
    }
  },
  pro: {
    name: 'Pro',
    price: 5,
    priceId: 'price_pro_monthly', // Replace with actual Stripe price ID
    features: [
      'Unlimited dream entries',
      'Advanced AI interpretation',
      'Pattern tracking & insights',
      'End-to-end encryption',
      'Data export',
      'Priority support'
    ],
    limits: {
      dreamEntries: Infinity,
      interpretations: Infinity,
      patterns: true,
      advanced: false
    }
  },
  premium: {
    name: 'Premium',
    price: 15,
    priceId: 'price_premium_monthly', // Replace with actual Stripe price ID
    features: [
      'Everything in Pro',
      'Advanced AI insights & coaching',
      'Personalized dream analysis',
      'Dream pattern predictions',
      'Custom interpretation models',
      'Priority AI processing',
      'Advanced data analytics'
    ],
    limits: {
      dreamEntries: Infinity,
      interpretations: Infinity,
      patterns: true,
      advanced: true
    }
  }
};

/**
 * Creates a Stripe checkout session for subscription
 * @param {string} priceId - Stripe price ID
 * @param {string} userId - User ID for metadata
 * @returns {Promise<void>} - Redirects to Stripe checkout
 */
export const createCheckoutSession = async (priceId, userId) => {
  if (!stripePromise) {
    throw new Error('Stripe is not configured. Please check your environment variables.');
  }

  try {
    const stripe = await stripePromise;
    
    // In a real application, this would call your backend API
    // For now, we'll simulate the checkout process
    const checkoutSession = await simulateCheckoutSession(priceId, userId);
    
    const result = await stripe.redirectToCheckout({
      sessionId: checkoutSession.id,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }
  } catch (error) {
    console.error('Checkout error:', error);
    throw error;
  }
};

/**
 * Creates a Stripe customer portal session
 * @param {string} customerId - Stripe customer ID
 * @returns {Promise<string>} - Portal URL
 */
export const createPortalSession = async (customerId) => {
  if (!stripePromise) {
    throw new Error('Stripe is not configured. Please check your environment variables.');
  }

  try {
    // In a real application, this would call your backend API
    const response = await fetch('/api/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_id: customerId,
        return_url: window.location.origin,
      }),
    });

    const session = await response.json();
    return session.url;
  } catch (error) {
    console.error('Portal session error:', error);
    throw error;
  }
};

/**
 * Validates subscription status
 * @param {string} subscriptionId - Stripe subscription ID
 * @returns {Promise<Object>} - Subscription status
 */
export const validateSubscription = async (subscriptionId) => {
  try {
    // In a real application, this would call your backend API
    const response = await fetch(`/api/subscription/${subscriptionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const subscription = await response.json();
    return {
      active: subscription.status === 'active',
      tier: subscription.metadata?.tier || 'free',
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    };
  } catch (error) {
    console.error('Subscription validation error:', error);
    return {
      active: false,
      tier: 'free',
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false
    };
  }
};

/**
 * Simulates checkout session creation (for development)
 * In production, this would be handled by your backend
 */
const simulateCheckoutSession = async (priceId, userId) => {
  // This is a mock implementation
  // In production, your backend would create the actual Stripe session
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `cs_mock_${Date.now()}`,
        url: `https://checkout.stripe.com/pay/cs_mock_${Date.now()}`
      });
    }, 1000);
  });
};

/**
 * Gets subscription tier information
 * @param {string} tier - Subscription tier name
 * @returns {Object} - Tier information
 */
export const getSubscriptionTier = (tier) => {
  return SUBSCRIPTION_TIERS[tier] || SUBSCRIPTION_TIERS.free;
};

/**
 * Checks if user has access to a feature
 * @param {string} userTier - User's subscription tier
 * @param {string} feature - Feature to check
 * @returns {boolean} - Whether user has access
 */
export const hasFeatureAccess = (userTier, feature) => {
  const tier = getSubscriptionTier(userTier);
  
  switch (feature) {
    case 'unlimited':
      return tier.limits.dreamEntries === Infinity;
    case 'patterns':
      return tier.limits.patterns;
    case 'advanced':
      return tier.limits.advanced;
    case 'interpretation':
      return tier.limits.interpretations > 0;
    default:
      return true;
  }
};

/**
 * Gets usage limits for a subscription tier
 * @param {string} tier - Subscription tier name
 * @returns {Object} - Usage limits
 */
export const getUsageLimits = (tier) => {
  const tierInfo = getSubscriptionTier(tier);
  return tierInfo.limits;
};

/**
 * Formats price for display
 * @param {number} price - Price in dollars
 * @returns {string} - Formatted price
 */
export const formatPrice = (price) => {
  if (price === 0) return 'Free';
  return `$${price}/month`;
};
