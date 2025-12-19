'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import {
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    EyeIcon,
    EnvelopeIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    ArrowPathIcon,
    ExclamationTriangleIcon,
    UserIcon,
    AcademicCapIcon,
    CurrencyDollarIcon,
    PhoneIcon
} from '@heroicons/react/24/outline';

export default function AdminEnrollmentsPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [enrollments, setEnrollments] = useState([]);
    const [filteredEnrollments, setFilteredEnrollments] = useState([]);
    const [loadingEnrollments, setLoadingEnrollments] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
    const [search, setSearch] = useState('');
    const [selectedEnrollment, setSelectedEnrollment] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0
    });
    const [processingAction, setProcessingAction] = useState(null);
    const [error, setError] = useState('');

    // Check if user is admin
    // useEffect(() => {
    //     if (!loading && (!user || user.role !== 'admin')) {
    //         router.push('/login');
    //     }
    // }, [user, loading, router]);

    // Fetch enrollments on component mount
    // useEffect(() => {
    //     if (user?.role === 'admin') {
    //         fetchEnrollments();
    //     }
    // }, [user]);

    // Filter enrollments when enrollments, filter, or search changes
    useEffect(() => {
        let result = enrollments;

        // Apply status filter
        if (filter !== 'all') {
            result = result.filter(enrollment => enrollment.status === filter);
        }

        // Apply search filter
        if (search) {
            const searchLower = search.toLowerCase();
            result = result.filter(enrollment =>
                enrollment.userName?.toLowerCase().includes(searchLower) ||
                enrollment.userEmail?.toLowerCase().includes(searchLower) ||
                enrollment.transactionId?.toLowerCase().includes(searchLower) ||
                enrollment.courseName?.toLowerCase().includes(searchLower) ||
                enrollment.phoneNumber?.includes(search)
            );
        }

        setFilteredEnrollments(result);
    }, [enrollments, filter, search]);

    const fetchEnrollments = async () => {
        try {
            setLoadingEnrollments(true);
            setError('');
            
            const response = await fetch('/api/admin/enrollments', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                }
            });
            
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch enrollments');
            }

            if (data.success) {
                setEnrollments(data.enrollments || []);

                // Calculate stats
                const stats = {
                    total: data.enrollments?.length || 0,
                    pending: data.enrollments?.filter(e => e.status === 'pending').length || 0,
                    approved: data.enrollments?.filter(e => e.status === 'approved').length || 0,
                    rejected: data.enrollments?.filter(e => e.status === 'rejected').length || 0
                };
                setStats(stats);
            } else {
                throw new Error(data.message || 'Failed to fetch enrollments');
            }
        } catch (error) {
            console.error('Error fetching enrollments:', error);
            setError(error.message);
            // Show empty state
            setEnrollments([]);
            setStats({ total: 0, pending: 0, approved: 0, rejected: 0 });
        } finally {
            setLoadingEnrollments(false);
        }
    };

    const handleViewDetails = (enrollment) => {
        setSelectedEnrollment(enrollment);
        setShowDetailsModal(true);
    };

    const handleAction = async (enrollmentId, action, notes = '') => {
        if (processingAction === enrollmentId) return;
        
        if (action === 'reject' && (!notes || notes.trim() === '')) {
            alert('Please provide a reason for rejection.');
            return;
        }

        setProcessingAction(enrollmentId);
        setError('');

        try {
            const response = await fetch(`/api/admin/enrollments/${enrollmentId}/process`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify({
                    action: action,
                    adminNotes: notes.trim()
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Failed to ${action} enrollment`);
            }

            if (data.success) {
                // Update the enrollment in the state
                setEnrollments(prev => prev.map(enrollment => {
                    if (enrollment._id === enrollmentId) {
                        return {
                            ...enrollment,
                            status: action === 'approve' ? 'approved' : 'rejected',
                            adminNotes: notes || null,
                            reviewedAt: new Date().toISOString(),
                            reviewedBy: user?.id || user?.email
                        };
                    }
                    return enrollment;
                }));

                // Update stats
                setStats(prev => {
                    const newStats = { ...prev };
                    if (action === 'approve') {
                        newStats.approved += 1;
                        newStats.pending -= 1;
                    } else {
                        newStats.rejected += 1;
                        newStats.pending -= 1;
                    }
                    return newStats;
                });

                setShowDetailsModal(false);
                
                // Show success message
                alert(`Enrollment ${action === 'approve' ? 'approved' : 'rejected'} successfully. ${data.emailSent ? 'Email sent to user.' : ''}`);
                
            } else {
                throw new Error(data.message || `Failed to ${action} enrollment`);
            }
        } catch (error) {
            console.error('Error processing enrollment:', error);
            setError(error.message);
            alert(`Error: ${error.message}`);
        } finally {
            setProcessingAction(null);
        }
    };

    const handleApprove = (enrollmentId) => {
        const notes = prompt('Enter approval notes (optional):', 'Payment verified successfully. Enrollment approved.');
        if (notes !== null) {
            handleAction(enrollmentId, 'approve', notes);
        }
    };

    const handleReject = (enrollmentId) => {
        const notes = prompt('Enter rejection reason (required):', 'Payment verification failed');
        if (notes && notes.trim()) {
            handleAction(enrollmentId, 'reject', notes.trim());
        } else if (notes !== null) {
            alert('Please provide a reason for rejection.');
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: {
                icon: <ClockIcon className="h-4 w-4" />,
                color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                text: 'Pending'
            },
            approved: {
                icon: <CheckCircleIcon className="h-4 w-4" />,
                color: 'bg-green-100 text-green-800 border-green-200',
                text: 'Approved'
            },
            rejected: {
                icon: <XCircleIcon className="h-4 w-4" />,
                color: 'bg-red-100 text-red-800 border-red-200',
                text: 'Rejected'
            }
        };

        const badge = badges[status] || badges.pending;

        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${badge.color}`}>
                {badge.icon}
                {badge.text}
            </span>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading admin panel...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Enrollment Management</h1>
                            <p className="text-gray-600 mt-2">Review and verify course enrollments</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {error && (
                                <div className="text-red-600 text-sm bg-red-50 px-3 py-1 rounded">
                                    {error}
                                </div>
                            )}
                            <button
                                onClick={fetchEnrollments}
                                disabled={loadingEnrollments}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                <ArrowPathIcon className={`h-5 w-5 ${loadingEnrollments ? 'animate-spin' : ''}`} />
                                {loadingEnrollments ? 'Refreshing...' : 'Refresh'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Enrollments</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <AcademicCapIcon className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Pending Review</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pending}</p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <ClockIcon className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Approved</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.approved}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <CheckCircleIcon className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Rejected</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.rejected}</p>
                            </div>
                            <div className="p-3 bg-red-100 rounded-lg">
                                <XCircleIcon className="h-6 w-6 text-red-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <FunnelIcon className="h-5 w-5 text-gray-400" />
                                <span className="text-gray-700 font-medium">Filter:</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    All ({stats.total})
                                </button>
                                <button
                                    onClick={() => setFilter('pending')}
                                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filter === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    <ClockIcon className="h-4 w-4" />
                                    Pending ({stats.pending})
                                </button>
                                <button
                                    onClick={() => setFilter('approved')}
                                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filter === 'approved' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    <CheckCircleIcon className="h-4 w-4" />
                                    Approved ({stats.approved})
                                </button>
                                <button
                                    onClick={() => setFilter('rejected')}
                                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filter === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    <XCircleIcon className="h-4 w-4" />
                                    Rejected ({stats.rejected})
                                </button>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name, email, transaction ID..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-80"
                            />
                        </div>
                    </div>
                </div>

                {/* Enrollments Table */}
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    {loadingEnrollments ? (
                        <div className="p-12 text-center">
                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading enrollments...</p>
                        </div>
                    ) : filteredEnrollments.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <ExclamationTriangleIcon className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No enrollments found</h3>
                            <p className="text-gray-600">
                                {filter === 'all' ? 'No enrollments yet.' : `No ${filter} enrollments.`}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Student
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Course
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Transaction
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredEnrollments.map((enrollment) => (
                                        <tr key={enrollment._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <UserIcon className="h-6 w-6 text-blue-600" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {enrollment.userName || 'N/A'}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {enrollment.userEmail || 'N/A'}
                                                        </div>
                                                        <div className="text-xs text-gray-400 flex items-center gap-1">
                                                            <PhoneIcon className="h-3 w-3" />
                                                            {enrollment.phoneNumber || 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {enrollment.courseName || 'N/A'}
                                                </div>
                                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                                    <CurrencyDollarIcon className="h-4 w-4" />
                                                    ${enrollment.finalAmount || enrollment.coursePrice || 0}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-mono bg-gray-50 p-2 rounded">
                                                    {enrollment.transactionId || 'N/A'}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {(enrollment.paymentMethod || 'N/A').toUpperCase()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(enrollment.status || 'pending')}
                                                {enrollment.reviewedBy && (
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        By: {enrollment.reviewedBy}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(enrollment.enrolledAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleViewDetails(enrollment)}
                                                        className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg"
                                                        title="View Details"
                                                    >
                                                        <EyeIcon className="h-5 w-5" />
                                                    </button>

                                                    {(enrollment.status === 'pending' || !enrollment.status) && (
                                                        <>
                                                            <button
                                                                onClick={() => handleApprove(enrollment._id)}
                                                                disabled={processingAction === enrollment._id}
                                                                className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg disabled:opacity-50"
                                                                title="Approve Enrollment"
                                                            >
                                                                <CheckCircleIcon className="h-5 w-5" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(enrollment._id)}
                                                                disabled={processingAction === enrollment._id}
                                                                className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg disabled:opacity-50"
                                                                title="Reject Enrollment"
                                                            >
                                                                <XCircleIcon className="h-5 w-5" />
                                                            </button>
                                                        </>
                                                    )}

                                                    {enrollment.adminNotes && (
                                                        <span className="text-gray-400 p-2" title={`Admin notes: ${enrollment.adminNotes}`}>
                                                            <EnvelopeIcon className="h-5 w-5" />
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Enrollment Details Modal */}
            {showDetailsModal && selectedEnrollment && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div
                        className="fixed inset-0 bg-gray-500 bg-opacity-25 backdrop-blur-sm transition-opacity"
                        onClick={() => setShowDetailsModal(false)}
                    />
                    
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">Enrollment Details</h2>
                                    <button
                                        onClick={() => setShowDetailsModal(false)}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Student Info */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <p className="text-sm text-gray-500">Name</p>
                                                <p className="font-medium">{selectedEnrollment.userName || 'N/A'}</p>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <p className="text-sm text-gray-500">Email</p>
                                                <p className="font-medium">{selectedEnrollment.userEmail || 'N/A'}</p>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <p className="text-sm text-gray-500">Phone</p>
                                                <p className="font-medium">{selectedEnrollment.phoneNumber || 'N/A'}</p>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <p className="text-sm text-gray-500">Student ID</p>
                                                <p className="font-mono text-sm">{selectedEnrollment.userId || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Course Info */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Information</h3>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-500">Course Name</p>
                                            <p className="font-medium text-lg">{selectedEnrollment.courseName || 'N/A'}</p>
                                            <div className="grid grid-cols-2 gap-4 mt-3">
                                                <div>
                                                    <p className="text-sm text-gray-500">Course Price</p>
                                                    <p className="font-medium">${selectedEnrollment.coursePrice || 0}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Final Amount</p>
                                                    <p className="font-medium">${selectedEnrollment.finalAmount || selectedEnrollment.coursePrice || 0}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Info */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <p className="text-sm text-gray-500">Transaction ID</p>
                                                <p className="font-mono font-medium">{selectedEnrollment.transactionId || 'N/A'}</p>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <p className="text-sm text-gray-500">Payment Method</p>
                                                <p className="font-medium">{(selectedEnrollment.paymentMethod || 'N/A').toUpperCase()}</p>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <p className="text-sm text-gray-500">Enrollment ID</p>
                                                <p className="font-mono text-sm">{selectedEnrollment._id}</p>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <p className="text-sm text-gray-500">Enrollment Date</p>
                                                <p className="font-medium">{formatDate(selectedEnrollment.enrolledAt)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
                                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                {getStatusBadge(selectedEnrollment.status || 'pending')}
                                                {selectedEnrollment.reviewedAt && (
                                                    <div className="text-sm text-gray-600">
                                                        Reviewed: {formatDate(selectedEnrollment.reviewedAt)}
                                                    </div>
                                                )}
                                            </div>
                                            {(selectedEnrollment.status === 'pending' || !selectedEnrollment.status) && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setShowDetailsModal(false);
                                                            handleApprove(selectedEnrollment._id);
                                                        }}
                                                        disabled={processingAction === selectedEnrollment._id}
                                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                                                    >
                                                        {processingAction === selectedEnrollment._id ? 'Processing...' : 'Approve'}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setShowDetailsModal(false);
                                                            handleReject(selectedEnrollment._id);
                                                        }}
                                                        disabled={processingAction === selectedEnrollment._id}
                                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                                                    >
                                                        {processingAction === selectedEnrollment._id ? 'Processing...' : 'Reject'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Admin Notes (if any) */}
                                    {selectedEnrollment.adminNotes && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Notes</h3>
                                            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                                                <p className="text-gray-700">{selectedEnrollment.adminNotes}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 flex justify-end gap-3">
                                    <button
                                        onClick={() => setShowDetailsModal(false)}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}