// app/(protected)/admin/courses/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import Link from 'next/link';
import {
    PlusIcon,
    TrashIcon,
    PencilIcon,
    FolderIcon,
    DocumentPlusIcon,
    ArrowPathIcon,
    ExclamationTriangleIcon,
    AcademicCapIcon,
    VideoCameraIcon,
    ClockIcon,
    UsersIcon,
    CurrencyDollarIcon,
    ArrowRightIcon,
    EyeIcon
} from '@heroicons/react/24/outline';

export default function AdminCoursesPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Check if user is admin
    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) {
            router.push('/login');
        }
    }, [user, loading, router]);

    // Fetch courses on component mount
    useEffect(() => {
        if (user?.role === 'admin') {
            fetchCourses();
        }
    }, [user]);

    const fetchCourses = async () => {
        try {
            setLoadingCourses(true);
            setError('');
            
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/courses', {
                headers: token ? {
                    'Authorization': `Bearer ${token}`
                } : {}
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            
            if (data.success) {
                setCourses(data.courses || []);
            } else {
                throw new Error(data.message || 'Failed to fetch courses');
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
            setError(error.message);
            // Load sample data if API fails
            loadSampleData();
        } finally {
            setLoadingCourses(false);
        }
    };

    const loadSampleData = () => {
        const sampleCourses = [
            {
                id: 'course-1',
                title: 'Web Development Bootcamp',
                description: 'Complete web development course from zero to hero',
                price: 297,
                students: 150,
                duration: '45h 30m',
                instructor: 'John Doe',
                level: 'beginner',
                category: 'web-development',
                featured: true,
                status: 'published',
                modules: [
                    {
                        id: 'module-1-1',
                        title: 'HTML & CSS Basics',
                        videos: [
                            { id: 'qz0aGYrrlhU', title: 'HTML Introduction', duration: '25:30', free: true },
                            { id: '1PnVor36_40', title: 'CSS Styling', duration: '30:15', free: true },
                        ]
                    },
                    {
                        id: 'module-1-2',
                        title: 'JavaScript Fundamentals',
                        videos: [
                            { id: 'PkZNo7MFNFg', title: 'JS Basics', duration: '35:45', free: false },
                            { id: 'W6NZfCO5SIk', title: 'DOM Manipulation', duration: '40:15', free: false },
                        ]
                    }
                ]
            },
            {
                id: 'course-2',
                title: 'React Masterclass',
                description: 'Advanced React patterns and best practices',
                price: 197,
                students: 85,
                duration: '32h 15m',
                instructor: 'Jane Smith',
                level: 'intermediate',
                category: 'web-development',
                featured: true,
                status: 'published',
                modules: [
                    {
                        id: 'module-2-1',
                        title: 'React Hooks',
                        videos: [
                            { id: 'w7ejDZ8SWv8', title: 'useState & useEffect', duration: '45:20', free: true },
                        ]
                    }
                ]
            }
        ];
        setCourses(sampleCourses);
    };

    const deleteCourse = async (courseId) => {
        if (!confirm('Are you sure you want to delete this course and all its modules/videos?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/admin/courses/${courseId}`, {
                method: 'DELETE',
                headers: token ? {
                    'Authorization': `Bearer ${token}`
                } : {}
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                setSuccess('Course deleted successfully!');
                setCourses(prev => prev.filter(course => course.id !== courseId));
            } else {
                throw new Error(data.message || 'Failed to delete course');
            }
        } catch (error) {
            console.error('Error deleting course:', error);
            setError(error.message);
            // For demo purposes, delete locally
            setCourses(prev => prev.filter(course => course.id !== courseId));
            setSuccess('Course deleted (demo mode)');
        }
    };

    const calculateTotalVideos = (course) => {
        return course.modules?.reduce((total, module) => total + (module.videos?.length || 0), 0) || 0;
    };

    const calculateTotalDuration = (course) => {
        let totalSeconds = 0;
        course.modules?.forEach(module => {
            module.videos?.forEach(video => {
                const [minutes, seconds] = video.duration.split(':').map(Number);
                totalSeconds += (minutes * 60) + (seconds || 0);
            });
        });
        
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    };

    const getStatusBadge = (status) => {
        const badges = {
            draft: {
                color: 'bg-gray-100 text-gray-800',
                text: 'Draft'
            },
            published: {
                color: 'bg-green-100 text-green-800',
                text: 'Published'
            },
            archived: {
                color: 'bg-red-100 text-red-800',
                text: 'Archived'
            }
        };

        const badge = badges[status] || badges.draft;

        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                {badge.text}
            </span>
        );
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
                            <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
                            <p className="text-gray-600 mt-2">Manage all courses, modules, and videos</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {error && (
                                <div className="text-red-600 text-sm bg-red-50 px-3 py-1 rounded">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="text-green-600 text-sm bg-green-50 px-3 py-1 rounded">
                                    {success}
                                </div>
                            )}
                            <button
                                onClick={fetchCourses}
                                disabled={loadingCourses}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                <ArrowPathIcon className={`h-5 w-5 ${loadingCourses ? 'animate-spin' : ''}`} />
                                {loadingCourses ? 'Refreshing...' : 'Refresh'}
                            </button>
                            <Link
                                href="/courses/create"
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <PlusIcon className="h-5 w-5" />
                                Create New Course
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Courses List */}
                {loadingCourses ? (
                    <div className="bg-white rounded-xl shadow p-12 text-center">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading courses...</p>
                    </div>
                ) : courses.length === 0 ? (
                    <div className="bg-white rounded-xl shadow p-12 text-center">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <ExclamationTriangleIcon className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                        <p className="text-gray-600 mb-4">Create your first course to start organizing content</p>
                        <Link
                            href="/courses/create"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <PlusIcon className="h-5 w-5" />
                            Create First Course
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <div key={course.id} className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <AcademicCapIcon className="h-6 w-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">{course.title}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {getStatusBadge(course.status)}
                                                    {course.featured && (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                            Featured
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Link
                                                href={`/courses/${course.id}`}
                                                className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                                                title="View Course"
                                            >
                                                <EyeIcon className="h-5 w-5" />
                                            </Link>
                                            <Link
                                                href={`/admin/courses/${course.id}/edit`}
                                                className="text-yellow-600 hover:text-yellow-900 p-1 hover:bg-yellow-50 rounded"
                                                title="Edit Course"
                                            >
                                                <PencilIcon className="h-5 w-5" />
                                            </Link>
                                            <button
                                                onClick={() => deleteCourse(course.id)}
                                                className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                                                title="Delete Course"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <p className="text-gray-600 mb-6 line-clamp-2">
                                        {course.description || 'No description'}
                                    </p>
                                    
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="text-center">
                                            <div className="flex items-center justify-center gap-2 text-gray-500 mb-1">
                                                <VideoCameraIcon className="h-4 w-4" />
                                                <span className="text-sm">Videos</span>
                                            </div>
                                            <div className="text-xl font-bold text-gray-900">
                                                {calculateTotalVideos(course)}
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="flex items-center justify-center gap-2 text-gray-500 mb-1">
                                                <ClockIcon className="h-4 w-4" />
                                                <span className="text-sm">Duration</span>
                                            </div>
                                            <div className="text-xl font-bold text-gray-900">
                                                {calculateTotalDuration(course)}
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="flex items-center justify-center gap-2 text-gray-500 mb-1">
                                                <UsersIcon className="h-4 w-4" />
                                                <span className="text-sm">Students</span>
                                            </div>
                                            <div className="text-xl font-bold text-gray-900">
                                                {course.students || 0}
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="flex items-center justify-center gap-2 text-gray-500 mb-1">
                                                <CurrencyDollarIcon className="h-4 w-4" />
                                                <span className="text-sm">Price</span>
                                            </div>
                                            <div className="text-xl font-bold text-gray-900">
                                                ${course.price || 0}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mb-6">
                                        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                            <FolderIcon className="h-5 w-5 text-gray-400" />
                                            Modules ({course.modules?.length || 0})
                                        </h4>
                                        <div className="space-y-2">
                                            {course.modules?.slice(0, 3).map((module) => (
                                                <div key={module.id} className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-700 truncate">{module.title}</span>
                                                    <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded text-xs">
                                                        {module.videos?.length || 0} videos
                                                    </span>
                                                </div>
                                            ))}
                                            {course.modules?.length > 3 && (
                                                <div className="text-sm text-gray-500">
                                                    +{course.modules.length - 3} more modules
                                                </div>
                                            )}
                                            {(!course.modules || course.modules.length === 0) && (
                                                <div className="text-sm text-gray-500 italic">No modules yet</div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-3">
                                        <Link
                                            href={`/courses/${course.id}/modules`}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <DocumentPlusIcon className="h-5 w-5" />
                                            Manage Content
                                        </Link>
                                        <Link
                                            href={`/courses/${course.id}`}
                                            target="_blank"
                                            className="flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                            title="Preview Course"
                                        >
                                            <ArrowRightIcon className="h-5 w-5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}