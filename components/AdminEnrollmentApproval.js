'use client';

import { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function AdminEnrollmentApproval() {
    const [pendingEnrollments, setPendingEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch pending enrollments from API
        fetchPendingEnrollments();
    }, []);

    const fetchPendingEnrollments = async () => {
        try {
            // In real app: const response = await fetch('/api/admin/enrollments/pending');
            // For demo, use localStorage
            const enrollments = JSON.parse(localStorage.getItem('pendingEnrollments') || '[]');
            setPendingEnrollments(enrollments.filter(e => e.status === 'pending'));
        } catch (error) {
            console.error('Error fetching enrollments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApproval = async (enrollmentId, approved) => {
        try {
            // Update enrollment status
            const updatedEnrollments = pendingEnrollments.map(enrollment => {
                if (enrollment.id === enrollmentId) {
                    const newStatus = approved ? 'approved' : 'rejected';
                    return { ...enrollment, status: newStatus, reviewedAt: new Date().toISOString() };
                }
                return enrollment;
            });
            
            // Save to localStorage (in real app, save to database)
            localStorage.setItem('pendingEnrollments', JSON.stringify(updatedEnrollments));
            
            // Send email to user
            const enrollment = pendingEnrollments.find(e => e.id === enrollmentId);
            await sendStatusEmail(enrollment, approved ? 'approved' : 'rejected');
            
            // If approved, grant course access (in real app, update user permissions in database)
            if (approved) {
                await grantCourseAccess(enrollment.userId, enrollment.courseId);
            }
            
            // Refresh list
            fetchPendingEnrollments();
            
            alert(`Enrollment ${approved ? 'approved' : 'rejected'} and email sent to user.`);
        } catch (error) {
            console.error('Error updating enrollment:', error);
            alert('Error processing request');
        }
    };

    const sendStatusEmail = async (enrollment, status) => {
        const emailData = {
            to: enrollment.userEmail,
            subject: `Enrollment ${status === 'approved' ? 'Approved' : 'Rejected'} - ${enrollment.courseName}`,
            template: `enrollment-${status}`,
            data: {
                ...enrollment,
                status: status,
                courseLink: status === 'approved' ? '/dashboard/courses' : null
            }
        };
        
        // Call email API
        await fetch('/api/send-email', {
            method: 'POST',
            body: JSON.stringify(emailData)
        });
    };

    const grantCourseAccess = async (userId, courseId) => {
        // Grant course access in database
        await fetch('/api/users/grant-course-access', {
            method: 'POST',
            body: JSON.stringify({ userId, courseId })
        });
    };

    if (loading) {
        return <div>Loading pending enrollments...</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                    Pending Enrollments ({pendingEnrollments.length})
                </h3>
                
                {pendingEnrollments.length === 0 ? (
                    <p className="text-gray-500">No pending enrollments</p>
                ) : (
                    <div className="space-y-4">
                        {pendingEnrollments.map((enrollment) => (
                            <div key={enrollment.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="font-medium text-gray-900">{enrollment.userName}</h4>
                                        <p className="text-sm text-gray-600">{enrollment.userEmail}</p>
                                        <p className="text-sm text-gray-600">Course: {enrollment.courseName}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900">${enrollment.finalAmount}</p>
                                        <p className="text-sm text-gray-600">{enrollment.paymentMethod}</p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                                    <div>
                                        <span className="text-gray-600">Transaction ID:</span>
                                        <p className="font-mono">{enrollment.transactionId}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Phone:</span>
                                        <p>{enrollment.phoneNumber}</p>
                                    </div>
                                </div>
                                
                                <div className="flex justify-end space-x-2">
                                    <button
                                        onClick={() => handleApproval(enrollment.id, false)}
                                        className="inline-flex items-center px-3 py-2 border border-red-300 text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        <XCircleIcon className="h-4 w-4 mr-1" />
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleApproval(enrollment.id, true)}
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                                        Approve
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}