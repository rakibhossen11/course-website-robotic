'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import Link from 'next/link';
import {
    HomeIcon,
    VideoCameraIcon,
    UserGroupIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    ArrowLeftOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';

export default function AdminLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, loading, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    // Navigation items
    const navigation = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
        { name: 'Video Management', href: '/admin/videos', icon: VideoCameraIcon },
        { name: 'Enrollments', href: '/admin/enrollments', icon: UserGroupIcon },
        { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
        { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
    ];

    useEffect(() => {
        const checkAdmin = async () => {
            if (!loading) {
                if (!user) {
                    // Redirect to login with redirect URL
                    router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
                    return;
                }
                
                if (user.role !== 'admin') {
                    // Not an admin, redirect to home
                    router.push('/');
                    return;
                }
                
                setIsAdmin(true);
                setIsChecking(false);
            }
        };

        checkAdmin();
    }, [user, loading, router, pathname]);

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (loading || isChecking) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading admin panel...</p>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <ShieldCheckIcon className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
                    <p className="text-gray-600 mb-4">Admin privileges required</p>
                    <div className="space-x-3">
                        <button
                            onClick={() => router.push('/')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Go Home
                        </button>
                        <button
                            onClick={() => router.push('/login')}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar */}
            <div className={`lg:hidden fixed inset-0 z-50 ${sidebarOpen ? 'flex' : 'hidden'}`}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                <div className="relative flex w-full max-w-xs flex-1">
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-white"
                        >
                            <span className="sr-only">Close sidebar</span>
                            <XMarkIcon className="h-6 w-6 text-white" />
                        </button>
                    </div>
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                        <div className="flex h-16 shrink-0 items-center">
                            <div className="flex items-center gap-2">
                                <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
                                <span className="text-xl font-bold text-gray-900">Admin</span>
                            </div>
                        </div>
                        <nav className="flex flex-1 flex-col">
                            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                <li>
                                    <ul role="list" className="-mx-2 space-y-1">
                                        {navigation.map((item) => {
                                            const isActive = pathname === item.href;
                                            return (
                                                <li key={item.name}>
                                                    <Link
                                                        href={item.href}
                                                        className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                                                            isActive
                                                                ? 'bg-blue-50 text-blue-600'
                                                                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                                                        }`}
                                                        onClick={() => setSidebarOpen(false)}
                                                    >
                                                        <item.icon className={`h-6 w-6 shrink-0 ${
                                                            isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                                                        }`} />
                                                        {item.name}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </li>
                                <li className="mt-auto">
                                    <div className="flex items-center gap-x-4 px-2 py-3 text-sm font-semibold leading-6 text-gray-900">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                            <span className="text-blue-600 font-bold">
                                                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'A'}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{user?.name || 'Admin'}</p>
                                            <p className="text-xs text-gray-500">{user?.email}</p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="text-gray-400 hover:text-gray-500"
                                            title="Logout"
                                        >
                                            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center">
                        <div className="flex items-center gap-2">
                            <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
                            <span className="text-xl font-bold text-gray-900">Admin Panel</span>
                        </div>
                    </div>
                    <nav className="flex flex-1 flex-col">
                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                            <li>
                                <ul role="list" className="-mx-2 space-y-1">
                                    {navigation.map((item) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <li key={item.name}>
                                                <Link
                                                    href={item.href}
                                                    className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                                                        isActive
                                                            ? 'bg-blue-50 text-blue-600'
                                                            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                                                    }`}
                                                >
                                                    <item.icon className={`h-6 w-6 shrink-0 ${
                                                        isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                                                    }`} />
                                                    {item.name}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </li>
                            <li className="mt-auto">
                                <div className="flex items-center gap-x-4 px-2 py-3 text-sm font-semibold leading-6 text-gray-900">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                        <span className="text-blue-600 font-bold">
                                            {user?.name?.charAt(0) || user?.email?.charAt(0) || 'A'}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{user?.name || 'Admin'}</p>
                                        <p className="text-xs text-gray-500">{user?.email}</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="text-gray-400 hover:text-gray-500"
                                        title="Logout"
                                    >
                                        <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-72">
                {/* Top bar for mobile */}
                <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <Bars3Icon className="h-6 w-6" />
                    </button>
                    <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                        <div className="flex flex-1 items-center">
                            <h1 className="text-lg font-semibold text-gray-900">
                                {navigation.find(item => pathname === item.href)?.name || 'Admin Dashboard'}
                            </h1>
                        </div>
                        <div className="flex items-center gap-x-4 lg:gap-x-6">
                            <button
                                onClick={handleLogout}
                                className="text-gray-400 hover:text-gray-500"
                                title="Logout"
                            >
                                <ArrowLeftOnRectangleIcon className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main content area */}
                <main className="py-10">
                    <div className="px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}