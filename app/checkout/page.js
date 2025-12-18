'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import {
    CheckCircleIcon,
    ShieldCheckIcon,
    CreditCardIcon,
    BanknotesIcon,
    DevicePhoneMobileIcon,
    LockClosedIcon,
    ArrowLeftIcon,
    XMarkIcon,
    SparklesIcon,
    BookOpenIcon,
    ClockIcon,
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
    const [paymentProof, setPaymentProof] = useState(null);
    const [showPaymentGuidelines, setShowPaymentGuidelines] = useState(false);

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
            alert(`Coupon applied! You saved $${discount.toFixed(2)}`);
        } else {
            alert('Invalid coupon code');
        }
    };

    // Handle file upload for payment proof
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type and size
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
            const maxSize = 5 * 1024 * 1024; // 5MB
            
            if (!validTypes.includes(file.type)) {
                alert('Please upload only JPG, PNG, or PDF files');
                return;
            }
            
            if (file.size > maxSize) {
                alert('File size should be less than 5MB');
                return;
            }
            
            setPaymentProof(file);
        }
    };

    // Submit enrollment request
    const submitEnrollmentRequest = async () => {
        if (!agreementAccepted) {
            alert('Please accept the terms and conditions');
            return;
        }

        if (!user) {
            alert('Please login to continue');
            router.push('/login?redirect=/checkout');
            return;
        }

        // Validate required fields based on payment method
        if (paymentMethod === 'bkash' || paymentMethod === 'nagad') {
            if (!transactionId.trim()) {
                alert('Please enter your transaction ID');
                return;
            }
            if (!phoneNumber.trim()) {
                alert('Please enter your mobile number');
                return;
            }
        }

        if (!paymentProof) {
            alert('Please upload payment proof (screenshot)');
            return;
        }

        setIsProcessing(true);

        try {
            const course = courses[selectedCourse];
            const enrollmentData = {
                userId: user.id,
                userEmail: user.email,
                userName: user.name,
                courseId: selectedCourse,
                courseName: course.name,
                coursePrice: course.price,
                finalAmount: calculateTotal(),
                paymentMethod: paymentMethod,
                transactionId: transactionId,
                phoneNumber: phoneNumber,
                couponCode: couponApplied ? couponCode : null,
                discountAmount: discountAmount,
                status: 'pending', // pending, approved, rejected
                enrolledAt: new Date().toISOString(),
                paymentProof: paymentProof.name
            };

            // Upload payment proof file
            const formData = new FormData();
            formData.append('paymentProof', paymentProof);
            formData.append('enrollmentData', JSON.stringify(enrollmentData));

            // Simulate API call to submit enrollment
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // In real implementation:
            // const response = await fetch('/api/enrollments/submit', {
            //     method: 'POST',
            //     body: formData
            // });
            // const result = await response.json();

            // Save to localStorage for demo
            const pendingEnrollments = JSON.parse(localStorage.getItem('pendingEnrollments') || '[]');
            pendingEnrollments.push({
                ...enrollmentData,
                id: `ENR${Date.now()}${Math.random().toString(36).substr(2, 9)}`
            });
            localStorage.setItem('pendingEnrollments', JSON.stringify(pendingEnrollments));

            // Send confirmation email to user
            await sendUserEmail('pending', enrollmentData);
            
            // Send notification email to admin
            await sendAdminNotification(enrollmentData);

            // Redirect to pending status page
            router.push(`/enrollment-status?status=pending&enrollmentId=${enrollmentData.id}`);

        } catch (error) {
            console.error('Enrollment error:', error);
            alert('Enrollment submission failed. Please try again.');
            setIsProcessing(false);
        }
    };

    // Send email to user
    const sendUserEmail = async (status, enrollmentData) => {
        // In real implementation, call your email API
        const emailData = {
            to: enrollmentData.userEmail,
            subject: status === 'pending' 
                ? `Course Enrollment Submitted - ${enrollmentData.courseName}`
                : `Course Enrollment ${status} - ${enrollmentData.courseName}`,
            template: status === 'pending' ? 'enrollment-pending' : `enrollment-${status}`,
            data: enrollmentData
        };

        console.log('Sending email to user:', emailData);
        // await fetch('/api/send-email', {
        //     method: 'POST',
        //     body: JSON.stringify(emailData)
        // });
    };

    // Send notification to admin
    const sendAdminNotification = async (enrollmentData) => {
        const adminNotification = {
            to: 'admin@learningbd.com',
            subject: `New Enrollment Request - ${enrollmentData.courseName}`,
            template: 'admin-enrollment-notification',
            data: enrollmentData
        };

        console.log('Sending notification to admin:', adminNotification);
        // await fetch('/api/send-email', {
        //     method: 'POST',
        //     body: JSON.stringify(adminNotification)
        // });
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
    const selectedPaymentMethod = paymentMethods.find(m => m.id === paymentMethod);

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
                                        <li>Save transaction ID screenshot</li>
                                        <li>You will receive access after admin verification (usually within 24 hours)</li>
                                        <li>Keep your transaction ID for any queries</li>
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
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            placeholder="01XXXXXXXXX"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Transaction ID *
                                        </label>
                                        <input
                                            type="text"
                                            value={transactionId}
                                            onChange={(e) => setTransactionId(e.target.value)}
                                            placeholder="Enter transaction ID"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Payment Proof (Screenshot) *
                                    </label>
                                    <div className="mt-1 flex items-center">
                                        <label className="cursor-pointer flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <p className="mb-2 text-sm text-gray-500">
                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    PNG, JPG, PDF up to 5MB
                                                </p>
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*,.pdf"
                                                onChange={handleFileUpload}
                                            />
                                        </label>
                                    </div>
                                    {paymentProof && (
                                        <div className="mt-2 flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                                            <div className="flex items-center">
                                                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                                                <span className="text-sm text-gray-700">{paymentProof.name}</span>
                                            </div>
                                            <button
                                                onClick={() => setPaymentProof(null)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <XMarkIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Merchant Information */}
                                <div className="p-4 bg-gray-50 rounded-lg">
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
                                                COURSE-{selectedCourse.toUpperCase()}-{user.id.slice(-6)}
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
                                    <li>• Course access granted after admin approval (within 24 hours)</li>
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
                                        onChange={(e) => setAgreementAccepted(e.target.checked)}
                                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="agreement" className="ml-2 text-sm text-gray-600">
                                        I agree to the{' '}
                                        <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                                            Terms of Service
                                        </Link>{' '}
                                        and understand that my enrollment needs admin verification before I can access the course content.
                                    </label>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={submitEnrollmentRequest}
                                disabled={isProcessing || !agreementAccepted || !transactionId || !paymentProof || !phoneNumber}
                                className={`w-full py-4 px-6 rounded-xl font-bold text-white text-lg transition-all duration-200 ${isProcessing || !agreementAccepted || !transactionId || !paymentProof || !phoneNumber
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