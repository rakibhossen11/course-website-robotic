'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import {
    CheckCircleIcon,
    ShieldCheckIcon,
    BanknotesIcon,
    DevicePhoneMobileIcon,
    LockClosedIcon,
    ArrowLeftIcon,
    XMarkIcon,
    BookOpenIcon,
    EnvelopeIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function CourseCheckoutPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [selectedCourse, setSelectedCourse] = useState('ai-web-dev');
    const [paymentMethod, setPaymentMethod] = useState('bkash');
    const [isProcessing, setIsProcessing] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [couponApplied, setCouponApplied] = useState(false);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [showCouponInput, setShowCouponInput] = useState(false);
    const [agreementAccepted, setAgreementAccepted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [transactionId, setTransactionId] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [showPaymentGuidelines, setShowPaymentGuidelines] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    // Course details
    const courses = {
        'ai-web-dev': {
            id: 'ai-web-dev',
            name: 'AI Powered Web Development & Software Architecture',
            description: 'Master modern web development with AI tools and scalable architecture',
            originalPrice: 397,
            price: 297,
            savings: 100,
            features: [
                "Lifetime access to all course videos",
                "Downloadable resources & templates",
                "Community access",
                "Weekly Q&A recordings",
                "Certificate of completion",
                "AI tools & prompts library",
                "Real-world project building",
                "Career guidance sessions"
            ],
            bonuses: [
                "Free access to our JavaScript Mastery course",
                "One-on-one career consultation (30 mins)",
                "Resume review service"
            ],
            bestValue: true,
            guarantee: "30-day money-back guarantee"
        }
    };

    // Payment methods
    const paymentMethods = [
        { 
            id: 'bkash', 
            name: 'bKash', 
            icon: <DevicePhoneMobileIcon className="h-5 w-5" />,
            instruction: "Send money to our bKash merchant number"
        },
        { 
            id: 'nagad', 
            name: 'Nagad', 
            icon: <BanknotesIcon className="h-5 w-5" />,
            instruction: "Send money to our Nagad merchant number"
        }
    ];

    // Calculate total
    const calculateTotal = () => {
        const course = courses[selectedCourse];
        let total = course.price;
        if (couponApplied) {
            total -= discountAmount;
        }
        return Math.max(total, 0);
    };

    // Apply coupon
    const applyCoupon = () => {
        const validCoupons = {
            'EARLYBIRD20': 0.2,
            'STUDENT30': 0.3,
            'WELCOME15': 0.15,
            'SPECIAL25': 0.25
        };

        const course = courses[selectedCourse];
        
        if (validCoupons[couponCode.toUpperCase()]) {
            const discountRate = validCoupons[couponCode.toUpperCase()];
            const discount = course.price * discountRate;
            setDiscountAmount(discount);
            setCouponApplied(true);
            setFormErrors(prev => ({ ...prev, coupon: null }));
            alert(`Coupon applied! You saved $${discount.toFixed(2)}`);
        } else {
            alert('Invalid coupon code');
            setFormErrors(prev => ({ ...prev, coupon: 'Invalid coupon code' }));
        }
    };

    // Validate form
    const validateForm = () => {
        const errors = {};
        
        if (!transactionId.trim()) {
            errors.transactionId = 'Transaction ID is required';
        }
        
        if (!phoneNumber.trim()) {
            errors.phoneNumber = 'Mobile number is required';
        } else if (!/^01[3-9]\d{8}$/.test(phoneNumber)) {
            errors.phoneNumber = 'Please enter a valid Bangladeshi mobile number';
        }
        
        if (!agreementAccepted) {
            errors.agreement = 'You must accept the terms and conditions';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Submit enrollment request
    const submitEnrollmentRequest = async () => {
        if (!user) {
            alert('Please login to continue');
            router.push('/login?redirect=/checkout');
            return;
        }

        const course = courses[selectedCourse];
        if (!course) {
            alert('Course not found');
            return;
        }

        // Validate form
        if (!validateForm()) {
            return;
        }

        setIsProcessing(true);

        try {
            const enrollmentData = {
                userId: user.id,
                userEmail: user.email,
                userName: user.name || user.email.split('@')[0],
                courseId: selectedCourse,
                courseName: course.name,
                coursePrice: course.price,
                finalAmount: calculateTotal(),
                paymentMethod: paymentMethod,
                transactionId: transactionId.trim(),
                phoneNumber: phoneNumber.trim(),
                couponCode: couponApplied ? couponCode.toUpperCase() : null,
                discountAmount: discountAmount,
                status: 'pending',
                enrolledAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            };

            console.log('Submitting enrollment:', enrollmentData);

            // Submit enrollment to API
            const response = await fetch('/api/enrollments/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(enrollmentData)
            });

            const result = await response.json();

            if (result.success) {
                // Redirect to status page
                router.push(`/enrollment-status?status=pending&enrollmentId=${result.enrollmentId}`);
            } else {
                throw new Error(result.message || 'Submission failed');
            }

        } catch (error) {
            console.error('Enrollment error:', error);
            alert(`Enrollment submission failed: ${error.message}. Please try again.`);
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

    const selectedCourseData = courses[selectedCourse];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/courses"
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                        Back to Courses
                    </Link>

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full mb-4">
                            <BookOpenIcon className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Enroll in <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">{selectedCourseData.name}</span>
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Complete your payment to get access to the course
                        </p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Course Selection & Payment */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Course Selection */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Details</h2>

                            <div className="space-y-6">
                                <div className="relative rounded-xl border-2 border-blue-600 bg-blue-50 shadow-md p-6">
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                                        <span className="bg-gradient-to-r from-blue-600 to-teal-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
                                            SELECTED COURSE
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg mb-2">{selectedCourseData.name}</h3>
                                            <p className="text-gray-600 mb-4">{selectedCourseData.description}</p>
                                            
                                            <div className="flex items-center gap-4 mb-4">
                                                <div>
                                                    <span className="text-3xl font-bold text-gray-900">
                                                        ${selectedCourseData.price}
                                                    </span>
                                                    {selectedCourseData.originalPrice && (
                                                        <div className="text-sm text-gray-500">
                                                            <span className="line-through">${selectedCourseData.originalPrice}</span>
                                                            <span className="ml-2 text-green-600 font-semibold">
                                                                Save ${selectedCourseData.savings}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method Selection */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
                                <button
                                    onClick={() => setShowPaymentGuidelines(!showPaymentGuidelines)}
                                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                                >
                                    <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                                    Payment Guidelines
                                </button>
                            </div>

                            {showPaymentGuidelines && (
                                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <h3 className="font-bold text-yellow-800 mb-2">Payment Instructions:</h3>
                                    <ul className="list-disc pl-5 text-yellow-700 text-sm space-y-1">
                                        <li>Send exact amount: <strong>${calculateTotal().toFixed(2)}</strong></li>
                                        <li>Use correct merchant number for your selected payment method</li>
                                        <li>Save transaction ID for reference</li>
                                        <li>You will receive access after admin verification (usually within 24 hours)</li>
                                        <li>Keep your transaction ID safe for any queries</li>
                                    </ul>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                {paymentMethods.map((method) => (
                                    <button
                                        key={method.id}
                                        className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${paymentMethod === method.id
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-blue-300'
                                            }`}
                                        onClick={() => setPaymentMethod(method.id)}
                                    >
                                        <div className={`mb-2 ${paymentMethod === method.id ? 'text-blue-600' : 'text-gray-400'
                                            }`}>
                                            {method.icon}
                                        </div>
                                        <span className="text-sm font-medium">{method.name}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Payment Details Form */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Mobile Number *
                                        </label>
                                        <input
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(e) => {
                                                setPhoneNumber(e.target.value);
                                                setFormErrors(prev => ({ ...prev, phoneNumber: null }));
                                            }}
                                            placeholder="01XXXXXXXXX"
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                formErrors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        />
                                        {formErrors.phoneNumber && (
                                            <p className="mt-1 text-sm text-red-600">{formErrors.phoneNumber}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Transaction ID *
                                        </label>
                                        <input
                                            type="text"
                                            value={transactionId}
                                            onChange={(e) => {
                                                setTransactionId(e.target.value);
                                                setFormErrors(prev => ({ ...prev, transactionId: null }));
                                            }}
                                            placeholder="Enter transaction ID"
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                formErrors.transactionId ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        />
                                        {formErrors.transactionId && (
                                            <p className="mt-1 text-sm text-red-600">{formErrors.transactionId}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Merchant Information */}
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <h3 className="font-bold text-gray-900 mb-2">Send Money To:</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Merchant Number:</span>
                                            <span className="font-semibold text-blue-600">017XXXXXXXX</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Amount:</span>
                                            <span className="font-semibold text-green-600">${calculateTotal().toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Reference:</span>
                                            <span className="font-semibold text-purple-600">
                                                {selectedCourse.toUpperCase()}-{user.id?.slice(-6) || 'USER'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="space-y-6">
                        {/* Order Summary */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                {/* Course Info */}
                                <div className="pb-4 border-b">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-gray-600">Course</span>
                                            <h3 className="font-semibold text-gray-900 text-sm mt-1">
                                                {selectedCourseData.name}
                                            </h3>
                                        </div>
                                        <span className="font-semibold">${selectedCourseData.price.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Coupon Section */}
                                <div className="pt-2">
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
                                                        setDiscountAmount(0);
                                                    }}
                                                    className="text-gray-500 hover:text-gray-700"
                                                >
                                                    <XMarkIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                            {formErrors.coupon && (
                                                <p className="text-sm text-red-600">{formErrors.coupon}</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Price Breakdown */}
                                <div className="pt-4 border-t space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Course Price</span>
                                        <span className="font-semibold">${selectedCourseData.price.toFixed(2)}</span>
                                    </div>

                                    {couponApplied && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Discount</span>
                                            <span>-${discountAmount.toFixed(2)}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Total */}
                                <div className="pt-4 border-t">
                                    <div className="flex justify-between items-center text-lg font-bold">
                                        <span>Total Amount</span>
                                        <div className="text-right">
                                            <div className="text-2xl text-blue-600">
                                                ${calculateTotal().toFixed(2)}
                                            </div>
                                            <div className="text-sm text-gray-500 font-normal">
                                                One-time payment
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Important Notes */}
                            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <h4 className="font-bold text-blue-900 mb-2 flex items-center">
                                    <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                                    Important Note
                                </h4>
                                <ul className="text-sm text-blue-700 space-y-1">
                                    <li>• Your enrollment will be <strong>pending</strong> until admin verification</li>
                                    <li>• You'll receive email confirmation immediately</li>
                                    <li>• Course access granted after admin approval (usually within 24 hours)</li>
                                    <li>• Keep your transaction ID safe for reference</li>
                                </ul>
                            </div>

                            {/* Agreement */}
                            <div className="space-y-4 mb-6">
                                <div className="flex items-start">
                                    <input
                                        type="checkbox"
                                        id="agreement"
                                        checked={agreementAccepted}
                                        onChange={(e) => {
                                            setAgreementAccepted(e.target.checked);
                                            setFormErrors(prev => ({ ...prev, agreement: null }));
                                        }}
                                        className={`mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
                                            formErrors.agreement ? 'border-red-300' : ''
                                        }`}
                                    />
                                    <label htmlFor="agreement" className="ml-2 text-sm text-gray-600">
                                        I agree to the{' '}
                                        <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                                            Terms of Service
                                        </Link>{' '}
                                        and understand that my enrollment needs admin verification before I can access the course content.
                                    </label>
                                </div>
                                {formErrors.agreement && (
                                    <p className="text-sm text-red-600">{formErrors.agreement}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={submitEnrollmentRequest}
                                disabled={isProcessing || !agreementAccepted || !transactionId || !phoneNumber}
                                className={`w-full py-4 px-6 rounded-xl font-bold text-white text-lg transition-all duration-200 ${isProcessing || !agreementAccepted || !transactionId || !phoneNumber
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 shadow-lg hover:shadow-xl'
                                    }`}
                            >
                                {isProcessing ? (
                                    <span className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Submitting Enrollment...
                                    </span>
                                ) : (
                                    'Submit Enrollment Request'
                                )}
                            </button>

                            <div className="mt-4 text-center">
                                <div className="flex items-center justify-center text-sm text-gray-500">
                                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                                    You'll receive email confirmation immediately
                                </div>
                            </div>
                        </div>

                        {/* Process Timeline */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="font-bold text-gray-900 mb-4">Enrollment Process</h3>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                        <span className="text-blue-600 font-bold">1</span>
                                    </div>
                                    <div className="ml-3">
                                        <p className="font-medium text-gray-900">Submit Payment Details</p>
                                        <p className="text-sm text-gray-600">Fill form with transaction details</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                                        <span className="text-yellow-600 font-bold">2</span>
                                    </div>
                                    <div className="ml-3">
                                        <p className="font-medium text-gray-900">Admin Verification</p>
                                        <p className="text-sm text-gray-600">We verify your payment (24 hours)</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                        <span className="text-green-600 font-bold">3</span>
                                    </div>
                                    <div className="ml-3">
                                        <p className="font-medium text-gray-900">Get Course Access</p>
                                        <p className="text-sm text-gray-600">Access all videos after approval</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Support */}
                        <div className="bg-gray-50 rounded-2xl p-6">
                            <h4 className="font-bold text-gray-900 mb-2">Need Help?</h4>
                            <p className="text-sm text-gray-600 mb-4">
                                Contact us for any payment or enrollment issues.
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-center text-blue-600 hover:text-blue-700 text-sm">
                                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                                    support@learningbd.com
                                </div>
                                <div className="flex items-center text-blue-600 hover:text-blue-700 text-sm">
                                    <DevicePhoneMobileIcon className="h-4 w-4 mr-2" />
                                    +880 1700-000000
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}