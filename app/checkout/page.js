'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import { 
  CheckCircleIcon, 
  ShieldCheckIcon, 
  CreditCardIcon, 
  BanknotesIcon,
  BuildingLibraryIcon,
  DevicePhoneMobileIcon,
  LockClosedIcon,
  ArrowLeftIcon,
  XMarkIcon,
  SparklesIcon,
  StarIcon,
  ChartBarIcon,
  BoltIcon,
  GlobeAltIcon,
  UsersIcon,
  BookOpenIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';

export default function PremiumCheckoutPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Pricing plans
  const plans = {
    monthly: {
      name: 'Monthly Plan',
      price: 49.99,
      period: 'month',
      savings: 0,
      popular: false
    },
    yearly: {
      name: 'Yearly Plan',
      price: 499.99,
      period: 'year',
      savings: 99.89, // Save 2 months
      popular: true
    },
    lifetime: {
      name: 'Lifetime Access',
      price: 1999.99,
      period: 'lifetime',
      savings: 5999.81, // Assuming 5 years of yearly plan
      popular: false
    }
  };

  // Premium features list
  const premiumFeatures = [
    {
      icon: <SparklesIcon className="h-6 w-6 text-purple-500" />,
      title: 'Unlimited Courses',
      description: 'Access to all premium courses'
    },
    {
      icon: <ChartBarIcon className="h-6 w-6 text-blue-500" />,
      title: 'Advanced Analytics',
      description: 'Track your progress in detail'
    },
    {
      icon: <BoltIcon className="h-6 w-6 text-yellow-500" />,
      title: 'Priority Support',
      description: '24/7 dedicated support team'
    },
    {
      icon: <GlobeAltIcon className="h-6 w-6 text-green-500" />,
      title: 'Global Community',
      description: 'Access to exclusive forums'
    },
    {
      icon: <UsersIcon className="h-6 w-6 text-pink-500" />,
      title: 'Live Classes',
      description: 'Weekly interactive sessions'
    },
    {
      icon: <BookOpenIcon className="h-6 w-6 text-indigo-500" />,
      title: 'Certificates',
      description: 'Verified completion certificates'
    },
    {
      icon: <ClockIcon className="h-6 w-6 text-orange-500" />,
      title: 'Offline Access',
      description: 'Download and learn offline'
    },
    {
      icon: <StarIcon className="h-6 w-6 text-red-500" />,
      title: 'Exclusive Content',
      description: 'Content not available to free users'
    }
  ];

  // Payment methods
  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: <CreditCardIcon className="h-5 w-5" /> },
    { id: 'paypal', name: 'PayPal', icon: <BuildingLibraryIcon className="h-5 w-5" /> },
    { id: 'bkash', name: 'bKash', icon: <DevicePhoneMobileIcon className="h-5 w-5" /> },
    { id: 'nagad', name: 'Nagad', icon: <BanknotesIcon className="h-5 w-5" /> }
  ];

  // Calculate total
  const calculateTotal = () => {
    let total = plans[selectedPlan].price;
    if (couponApplied) {
      total -= discountAmount;
    }
    return Math.max(total, 0);
  };

  // Apply coupon
  const applyCoupon = () => {
    const validCoupons = {
      'WELCOME20': 0.2, // 20% off
      'PREMIUM50': 0.5, // 50% off for first 100 users
      'LEARN30': 0.3, // 30% off
      'STUDENT25': 0.25 // 25% student discount
    };

    if (validCoupons[couponCode.toUpperCase()]) {
      const discountRate = validCoupons[couponCode.toUpperCase()];
      const discount = plans[selectedPlan].price * discountRate;
      setDiscountAmount(discount);
      setCouponApplied(true);
      alert(`Coupon applied! You saved $${discount.toFixed(2)}`);
    } else {
      alert('Invalid coupon code');
    }
  };

  // Handle payment
  const handlePayment = async () => {
    if (!agreementAccepted) {
      alert('Please accept the terms and conditions');
      return;
    }

    if (!user) {
      alert('Please login to continue');
      router.push('/login?redirect=/checkout');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would:
      // 1. Create order in your database
      // 2. Process payment with payment gateway
      // 3. Update user's subscription status
      
      alert('Payment successful! Welcome to Premium!');
      router.push('/dashboard');
    } catch (error) {
      alert('Payment failed. Please try again.');
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/checkout');
    } else if (!loading) {
      setIsLoading(false);
    }
  }, [user, loading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/pricing" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Pricing
          </Link>
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4">
              <SparklesIcon className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Upgrade to <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Premium</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Unlock unlimited access to all courses and premium features
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Features & Plan Selection */}
          <div className="lg:col-span-2 space-y-8">
            {/* Plan Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Plan</h2>
              
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {Object.entries(plans).map(([key, plan]) => (
                  <div
                    key={key}
                    className={`relative rounded-xl border-2 p-6 cursor-pointer transition-all duration-200 ${
                      selectedPlan === key 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                    onClick={() => setSelectedPlan(key)}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                          MOST POPULAR
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center">
                      <h3 className="font-bold text-gray-900 mb-2">{plan.name}</h3>
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-gray-900">
                          ${plan.price}
                        </span>
                        {plan.period !== 'lifetime' && (
                          <span className="text-gray-500">/{plan.period}</span>
                        )}
                      </div>
                      
                      {plan.savings > 0 && (
                        <div className="text-sm text-green-600 mb-4">
                          Save ${plan.savings.toFixed(2)}
                        </div>
                      )}
                      
                      <div className={`text-sm px-3 py-1 rounded-full ${
                        selectedPlan === key 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {selectedPlan === key ? 'Selected' : 'Select Plan'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Premium Features Grid */}
              <h3 className="text-xl font-bold text-gray-900 mb-4">Premium Features</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {premiumFeatures.map((feature, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="mb-2">{feature.icon}</div>
                    <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === method.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <div className={`mb-2 ${
                      paymentMethod === method.id ? 'text-purple-600' : 'text-gray-400'
                    }`}>
                      {method.icon}
                    </div>
                    <span className="text-sm font-medium">{method.name}</span>
                  </button>
                ))}
              </div>

              {/* Payment Form based on selected method */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVC
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Other payment methods instructions */}
              {paymentMethod === 'paypal' && (
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-4">
                    You will be redirected to PayPal to complete your payment
                  </p>
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
                    Continue with PayPal
                  </button>
                </div>
              )}

              {['bkash', 'nagad'].includes(paymentMethod) && (
                <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">
                    To pay via {paymentMethod === 'bkash' ? 'bKash' : 'Nagad'}:
                  </p>
                  <ol className="list-decimal pl-5 text-gray-600 space-y-2">
                    <li>Dial *247# for bKash or *167# for Nagad</li>
                    <li>Select "Send Money"</li>
                    <li>Enter our Merchant Number: <strong>017XXXXXXXX</strong></li>
                    <li>Enter amount: <strong>${calculateTotal().toFixed(2)}</strong></li>
                    <li>Enter reference: <strong>PREMIUM{Date.now().toString().slice(-6)}</strong></li>
                  </ol>
                  <input
                    type="text"
                    placeholder="Enter transaction ID"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Plan Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Plan</span>
                  <span className="font-semibold">{plans[selectedPlan].name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Billing Cycle</span>
                  <span className="font-semibold">
                    {selectedPlan === 'lifetime' ? 'One-time' : `Per ${plans[selectedPlan].period}`}
                  </span>
                </div>
                
                {/* Coupon Section */}
                <div className="pt-4 border-t">
                  {!showCouponInput ? (
                    <button
                      onClick={() => setShowCouponInput(true)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      + Add coupon code
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter coupon code"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        <button
                          onClick={applyCoupon}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                        >
                          Apply
                        </button>
                        <button
                          onClick={() => {
                            setShowCouponInput(false);
                            setCouponCode('');
                            setCouponApplied(false);
                          }}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="pt-4 border-t space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">${plans[selectedPlan].price.toFixed(2)}</span>
                  </div>
                  
                  {couponApplied && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold">$0.00</span>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <div className="text-right">
                      <div className="text-2xl text-purple-600">
                        ${calculateTotal().toFixed(2)}
                      </div>
                      {selectedPlan === 'yearly' && (
                        <div className="text-sm text-gray-500 font-normal">
                          ${(calculateTotal() / 12).toFixed(2)}/month
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Security & Agreement */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <ShieldCheckIcon className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      Your payment is secured with 256-bit SSL encryption. We never store your card details.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <LockClosedIcon className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      30-day money-back guarantee. Cancel anytime for a full refund.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="agreement"
                    checked={agreementAccepted}
                    onChange={(e) => setAgreementAccepted(e.target.checked)}
                    className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="agreement" className="ml-2 text-sm text-gray-600">
                    I agree to the{' '}
                    <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing || !agreementAccepted}
                className={`w-full py-4 px-6 rounded-xl font-bold text-white text-lg transition-all duration-200 ${
                  isProcessing || !agreementAccepted
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </span>
                ) : (
                  `Pay $${calculateTotal().toFixed(2)} Now`
                )}
              </button>

              {/* Payment Icons */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-center text-sm text-gray-500 mb-3">We Accept</p>
                <div className="flex justify-center space-x-4">
                  <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-700">VISA</span>
                  </div>
                  <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-700">MC</span>
                  </div>
                  <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-700">AMEX</span>
                  </div>
                  <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-700">PP</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Guarantee Badge */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
              <div className="flex items-center mb-3">
                <CheckCircleIcon className="h-6 w-6 text-green-600 mr-2" />
                <h3 className="font-bold text-gray-900">30-Day Money-Back Guarantee</h3>
              </div>
              <p className="text-sm text-gray-600">
                If you're not satisfied with Premium, contact us within 30 days for a full refund. No questions asked.
              </p>
            </div>

            {/* Support */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold text-gray-900 mb-2">Need Help?</h4>
              <p className="text-sm text-gray-600 mb-4">
                Our support team is here to help you with any questions.
              </p>
              <div className="space-y-2">
                <a href="mailto:support@learningbd.com" className="text-blue-600 hover:text-blue-700 text-sm block">
                  📧 support@learningbd.com
                </a>
                <a href="tel:+8801700000000" className="text-blue-600 hover:text-blue-700 text-sm block">
                  📞 +880 1700-000000
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Join 10,000+ Premium Learners
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Johnson",
                role: "Software Engineer",
                text: "Premium transformed my career. The live classes and certificates helped me land my dream job.",
                rating: 5
              },
              {
                name: "Mohammed Rahman",
                role: "Student",
                text: "Best investment I've made in my education. The quality of courses is exceptional.",
                rating: 5
              },
              {
                name: "Priya Sharma",
                role: "Data Scientist",
                text: "Offline access and advanced analytics features are game-changers for busy professionals.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 mr-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I cancel my subscription anytime?",
                a: "Yes, you can cancel anytime from your account settings. If you cancel within 30 days, you'll get a full refund."
              },
              {
                q: "Do you offer student discounts?",
                a: "Yes! Use code STUDENT25 for 25% off. Verify your student status during checkout."
              },
              {
                q: "Can I switch between monthly and yearly plans?",
                a: "Yes, you can upgrade or downgrade your plan at any time from your account settings."
              },
              {
                q: "Is there a free trial?",
                a: "We offer a 7-day free trial for new users. No credit card required to start the trial."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow">
                <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}