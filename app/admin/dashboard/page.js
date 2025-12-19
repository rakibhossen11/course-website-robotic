'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import Link from 'next/link';
import {
    UserGroupIcon,
    CurrencyDollarIcon,
    VideoCameraIcon,
    ChartBarIcon,
    ArrowTrendingUpIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalEnrollments: 0,
        totalRevenue: 0,
        totalVideos: 0,
        pendingEnrollments: 0,
        activeUsers: 0
    });
    const [loading, setLoading] = useState(true);
    const [recentEnrollments, setRecentEnrollments] = useState([]);

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setStats({
                totalUsers: 1245,
                totalEnrollments: 567,
                totalRevenue: 125600,
                totalVideos: 48,
                pendingEnrollments: 23,
                activeUsers: 789
            });
            
            setRecentEnrollments([
                { id: 1, userName: 'John Doe', courseName: 'AI Web Development', amount: 297, status: 'pending', date: '2024-01-15' },
                { id: 2, userName: 'Jane Smith', courseName: 'AI Web Development', amount: 297, status: 'approved', date: '2024-01-14' },
                { id: 3, userName: 'Bob Johnson', courseName: 'AI Web Development', amount: 297, status: 'pending', date: '2024-01-14' },
                { id: 4, userName: 'Alice Brown', courseName: 'AI Web Development', amount: 297, status: 'approved', date: '2024-01-13' },
                { id: 5, userName: 'Charlie Wilson', courseName: 'AI Web Development', amount: 267, status: 'approved', date: '2024-01-13' },
            ]);
            
            setLoading(false);
        }, 1000);
    }, []);

    const statCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers.toLocaleString(),
            icon: UserGroupIcon,
            color: 'bg-blue-500',
            trend: '+12.5%',
            link: '#'
        },
        {
            title: 'Total Enrollments',
            value: stats.totalEnrollments.toLocaleString(),
            icon: ArrowTrendingUpIcon,
            color: 'bg-green-500',
            trend: '+24.3%',
            link: '/admin/enrollments'
        },
        {
            title: 'Total Revenue',
            value: `$${stats.totalRevenue.toLocaleString()}`,
            icon: CurrencyDollarIcon,
            color: 'bg-purple-500',
            trend: '+18.7%',
            link: '#'
        },
        {
            title: 'Total Videos',
            value: stats.totalVideos,
            icon: VideoCameraIcon,
            color: 'bg-red-500',
            trend: '+8',
            link: '/admin/videos'
        },
        {
            title: 'Pending Approvals',
            value: stats.pendingEnrollments,
            icon: ClockIcon,
            color: 'bg-yellow-500',
            trend: 'Requires attention',
            link: '/admin/enrollments?filter=pending'
        },
        {
            title: 'Active Users',
            value: stats.activeUsers.toLocaleString(),
            icon: ChartBarIcon,
            color: 'bg-teal-500',
            trend: '+15.2%',
            link: '#'
        }
    ];

    const getStatusBadge = (status) => {
        switch(status) {
            case 'approved':
                return (
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        Approved
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        Pending
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                        {status}
                    </span>
                );
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Welcome header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-2 text-gray-600">
                    Welcome back, <span className="font-semibold text-blue-600">{user?.name || 'Admin'}</span>!
                    Here's what's happening with your platform today.
                </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {statCards.map((card, index) => (
                    <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className={`flex-shrink-0 ${card.color} rounded-md p-3`}>
                                    <card.icon className="h-6 w-6 text-white" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            {card.title}
                                        </dt>
                                        <dd className="text-2xl font-semibold text-gray-900">
                                            {card.value}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">{card.trend}</span>
                                    {card.link && (
                                        <Link
                                            href={card.link}
                                            className="text-sm font-medium text-blue-600 hover:text-blue-500"
                                        >
                                            View details
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent enrollments */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Enrollments</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Latest course enrollments requiring your attention
                            </p>
                        </div>
                        <Link
                            href="/admin/enrollments"
                            className="text-sm font-medium text-blue-600 hover:text-blue-500"
                        >
                            View all →
                        </Link>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                    User
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Course
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Amount
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Status
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Date
                                </th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {recentEnrollments.map((enrollment) => (
                                <tr key={enrollment.id}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                        <div className="font-medium text-gray-900">{enrollment.userName}</div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {enrollment.courseName}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        ${enrollment.amount}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                                        {getStatusBadge(enrollment.status)}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {enrollment.date}
                                    </td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        <Link
                                            href={`/admin/enrollments/${enrollment.id}`}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            Review<span className="sr-only">, {enrollment.userName}</span>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-white">Video Management</h3>
                            <p className="mt-2 text-blue-100">
                                Add, edit, or remove course videos and organize them into modules.
                            </p>
                        </div>
                        <VideoCameraIcon className="h-12 w-12 text-white opacity-80" />
                    </div>
                    <div className="mt-6">
                        <Link
                            href="/admin/videos"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                        >
                            Manage Videos
                        </Link>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-white">Enrollment Review</h3>
                            <p className="mt-2 text-green-100">
                                Review and approve pending course enrollments from students.
                            </p>
                        </div>
                        <UserGroupIcon className="h-12 w-12 text-white opacity-80" />
                    </div>
                    <div className="mt-6">
                        <Link
                            href="/admin/enrollments"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-600 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                        >
                            Review Enrollments
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}