'use client';

import { useSearchParams } from 'next/navigation';
import { CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function EnrollmentStatusPage() {
    const searchParams = useSearchParams();
    const status = searchParams.get('status');
    const enrollmentId = searchParams.get('enrollmentId');

    const getStatusInfo = (status) => {
        switch (status) {
            case 'pending':
                return {
                    icon: <ClockIcon className="h-12 w-12 text-yellow-500" />,
                    title: "Enrollment Pending",
                    message: "Your enrollment request has been submitted and is waiting for admin approval.",
                    instructions: [
                        "We've sent a confirmation email to your registered email address",
                        "Admin will verify your payment within 24 hours",
                        "You'll receive another email once your enrollment is approved",
                        "Check your email regularly for updates"
                    ],
                    color: "bg-yellow-50 border-yellow-200 text-yellow-800"
                };
            case 'approved':
                return {
                    icon: <CheckCircleIcon className="h-12 w-12 text-green-500" />,
                    title: "Enrollment Approved!",
                    message: "Congratulations! Your enrollment has been approved and you now have full access to the course.",
                    instructions: [
                        "You can now access all course videos and materials",
                        "Check your email for login credentials and course access link",
                        "Visit your dashboard to start learning",
                        "Join our community for discussions and support"
                    ],
                    color: "bg-green-50 border-green-200 text-green-800"
                };
            case 'rejected':
                return {
                    icon: <XCircleIcon className="h-12 w-12 text-red-500" />,
                    title: "Enrollment Rejected",
                    message: "We couldn't verify your payment. Please check your payment details and try again.",
                    instructions: [
                        "Please verify your transaction ID and payment details",
                        "Contact support if you believe this is a mistake",
                        "You can submit a new enrollment request",
                        "Make sure to upload clear payment proof"
                    ],
                    color: "bg-red-50 border-red-200 text-red-800"
                };
            default:
                return {
                    icon: <ClockIcon className="h-12 w-12 text-gray-500" />,
                    title: "Checking Status",
                    message: "We're checking your enrollment status...",
                    instructions: [],
                    color: "bg-gray-50 border-gray-200 text-gray-800"
                };
        }
    };

    const statusInfo = getStatusInfo(status);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className={`rounded-2xl border-2 p-8 ${statusInfo.color}`}>
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-white mb-6">
                            {statusInfo.icon}
                        </div>
                        
                        <h2 className="text-3xl font-bold mb-4">{statusInfo.title}</h2>
                        <p className="text-lg mb-6">{statusInfo.message}</p>
                        
                        {enrollmentId && (
                            <div className="mb-6 p-3 bg-white rounded-lg">
                                <span className="text-sm text-gray-600">Enrollment ID:</span>
                                <p className="font-mono font-bold text-gray-900">{enrollmentId}</p>
                            </div>
                        )}
                        
                        {statusInfo.instructions.length > 0 && (
                            <div className="text-left mb-8">
                                <h3 className="font-bold mb-3">Next Steps:</h3>
                                <ul className="space-y-2">
                                    {statusInfo.instructions.map((instruction, index) => (
                                        <li key={index} className="flex items-start">
                                            <span className="inline-block w-2 h-2 bg-current rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                            <span>{instruction}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        <div className="space-y-4">
                            <Link
                                href="/dashboard"
                                className="w-full inline-flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Go to Dashboard
                            </Link>
                            
                            {status === 'pending' && (
                                <Link
                                    href="/course-Details"
                                    className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Browse More Courses
                                </Link>
                            )}
                            
                            {status === 'rejected' && (
                                <Link
                                    href="/checkout"
                                    className="w-full inline-flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Try Again
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Need help? Contact us at{' '}
                        <a href="mailto:support@learningbd.com" className="text-blue-600 hover:text-blue-500">
                            support@learningbd.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}