import React from 'react';
import { ArrowRight, Check, Sparkles, Infinity, Star } from 'lucide-react';
import { createCheckoutSession } from '../lib/stripe';
import { useAuthStore } from '../store/authStore';
import SignInSection from './SignInSection';

interface LandingPageProps {
  onToolSelect: (tab: string) => void;
  onSignInClick: () => void;
}

export default function LandingPage({ onToolSelect, onSignInClick }: LandingPageProps) {
  const { user } = useAuthStore();
  const [loading, setLoading] = React.useState<string | null>(null);

  const handleSubscribe = async (planId: string, priceId: string) => {
    if (!user) {
      onSignInClick();
      return;
    }

    try {
      setLoading(planId);
      await createCheckoutSession(priceId, user.id);
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to start subscription process. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const features = [
    {
      title: 'Keyword Analysis',
      description: 'Analyze keyword density, prominence, and distribution across your content.',
      action: () => onToolSelect('keywords')
    },
    {
      title: 'Page Analysis',
      description: 'Get detailed insights into your page structure, meta tags, and SEO elements.',
      action: () => onToolSelect('pages')
    },
    {
      title: 'Topical Authority',
      description: 'Generate comprehensive topic maps to build content authority.',
      action: () => onToolSelect('topical')
    }
  ];

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '10',
      priceId: 'price_basic_id',
      description: 'Perfect for bloggers and small websites',
      features: [
        'Basic keyword analysis',
        'Limited page analysis',
        'Basic topical mapping',
        '100 pages per month',
        'Email support'
      ]
    },
    {
      id: 'plus',
      name: 'Plus',
      price: '15',
      priceId: 'price_plus_id',
      description: 'Ideal for growing businesses',
      features: [
        'Advanced keyword analysis',
        'Full page analysis',
        'Basic topical mapping',
        '500 pages per month',
        'Email support'
      ],
      popular: true
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '20',
      priceId: 'price_pro_id',
      description: 'For large websites and agencies',
      features: [
        'Enterprise-grade analysis',
        'Unlimited page analysis',
        'Basic topical mapping',
        'Unlimited pages',
        'Email support'
      ]
    }
  ];

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          Optimize Your Content
          <span className="text-indigo-600"> Like a Pro</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Comprehensive SEO analysis tools to help you create better content, rank higher, and build topical authority.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            {user ? (
              <button
                onClick={() => onToolSelect('keywords')}
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={onSignInClick}
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
              >
                Sign In to Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
          Powerful SEO Tools
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="px-6 py-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {feature.description}
                </p>
                <button
                  onClick={user ? feature.action : onSignInClick}
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  {user ? 'Try Now' : 'Sign In to Try'}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sign In Section (shown when not logged in) */}
      {!user && <SignInSection onSignInClick={onSignInClick} />}

      {/* Special Lifetime Offer */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50 to-white"></div>
        <div className="relative max-w-2xl mx-auto text-center px-4">
          <div className="inline-flex items-center justify-center p-2 bg-amber-100 rounded-full text-amber-700 text-sm font-medium mb-4">
            <Star className="w-4 h-4 mr-1" />
            Limited Time Offer
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
            Lifetime Access
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Get unlimited access to all features forever with a one-time payment
          </p>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-indigo-500">
            <div className="p-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Infinity className="w-6 h-6 text-indigo-600" />
                <h3 className="text-2xl font-bold text-gray-900">Lifetime Plan</h3>
              </div>
              <div className="flex items-baseline justify-center mb-6">
                <span className="text-5xl font-extrabold text-gray-900">$49</span>
                <span className="text-xl text-gray-500 ml-1">.99</span>
              </div>
              <p className="text-gray-600 mb-8">One-time payment, lifetime access</p>
              <ul className="space-y-4 mb-8 text-left">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mr-2" />
                  <span className="text-gray-600">Unlimited keyword analysis</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mr-2" />
                  <span className="text-gray-600">Unlimited page analysis</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mr-2" />
                  <span className="text-gray-600">Advanced topical mapping</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mr-2" />
                  <span className="text-gray-600">Priority email support</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mr-2" />
                  <span className="text-gray-600">All future updates included</span>
                </li>
              </ul>
              <button
                onClick={() => handleSubscribe('lifetime', 'price_lifetime_id')}
                disabled={loading === 'lifetime'}
                className="w-full inline-flex items-center justify-center px-6 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50"
              >
                {loading === 'lifetime' ? (
                  <>Processing...</>
                ) : (
                  <>
                    Get Lifetime Access
                    <Sparkles className="ml-2 w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Plans Section */}
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
          Monthly Plans
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl shadow-md bg-white overflow-hidden ${
                plan.popular ? 'ring-2 ring-indigo-600' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-indigo-600 text-white px-3 py-1 text-sm font-medium">
                  Popular
                </div>
              )}
              <div className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-extrabold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="ml-2 text-gray-500">/month</span>
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mr-2" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSubscribe(plan.id, plan.priceId)}
                  disabled={loading === plan.id}
                  className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50"
                >
                  {loading === plan.id ? (
                    <>Processing...</>
                  ) : (
                    <>
                      Get Started
                      <Sparkles className="ml-2 w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}