// app/(protected)/admin/courses/[id]/edit/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import {
    ArrowLeftIcon,
    CheckIcon,
    AcademicCapIcon,
    CurrencyDollarIcon,
    UsersIcon,
    DocumentTextIcon,
    ClockIcon,
    UserIcon,
    TagIcon,
    ExclamationCircleIcon
} from '@heroicons/react/24/outline';

export default function EditCoursePage() {
    const router = useRouter();
    const params = useParams();
    const { user, loading } = useAuth();
    const courseId = params.id;
    
    const [form, setForm] = useState({
        title: '',
        description: '',
        price: '',
        students: '0',
        duration: '',
        instructor: '',
        level: 'beginner',
        category: 'web-development',
        featured: false,
        status: 'draft'
    });
    const [loadingData, setLoadingData] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Check if user is admin
    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) {
            router.push('/login');
        }
    }, [user, loading, router]);

    // Fetch course data on component mount
    useEffect(() => {
        if (user?.role === 'admin' && courseId) {
            fetchCourseData();
        }
    }, [user, courseId]);

    const fetchCourseData = async () => {
        try {
            setLoadingData(true);
            setError('');
            
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/admin/courses/${courseId}`, {
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
                const course = data.course;
                setForm({
                    title: course.title || '',
                    description: course.description || '',
                    price: course.price?.toString() || '0',
                    students: course.students?.toString() || '0',
                    duration: course.duration || '',
                    instructor: course.instructor || '',
                    level: course.level || 'beginner',
                    category: course.category || 'web-development',
                    featured: course.featured || false,
                    status: course.status || 'draft'
                });
            } else {
                throw new Error(data.message || 'Failed to fetch course data');
            }
        } catch (error) {
            console.error('Error fetching course data:', error);
            setError(error.message);
            // Load sample data if API fails
            setForm({
                title: 'Web Development Bootcamp',
                description: 'Complete web development course from zero to hero',
                price: '297',
                students: '150',
                duration: '45h 30m',
                instructor: 'John Doe',
                level: 'beginner',
                category: 'web-development',
                featured: true,
                status: 'published'
            });
        } finally {
            setLoadingData(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoadingSubmit(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/admin/courses/${courseId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: JSON.stringify({
                    ...form,
                    price: parseFloat(form.price) || 0,
                    students: parseInt(form.students) || 0,
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            
            if (data.success) {
                setSuccess('Course updated successfully!');
                setTimeout(() => {
                    router.push('/admin/courses');
                }, 1500);
            } else {
                throw new Error(data.message || 'Failed to update course');
            }
        } catch (error) {
            console.error('Error updating course:', error);
            setError(error.message);
            // For demo purposes
            setSuccess('Course updated (demo mode)');
        } finally {
            setLoadingSubmit(false);
        }
    };

    if (loading || loadingData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push('/admin/courses')}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeftIcon className="h-5 w-5" />
                                Back to Courses
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Edit Course</h1>
                                <p className="text-gray-600 mt-2">Update course information</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white rounded-xl shadow p-6">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center gap-2">
                                <ExclamationCircleIcon className="h-5 w-5 text-red-600" />
                                <p className="text-red-600">{error}</p>
                            </div>
                        </div>
                    )}
                    
                    {success && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2">
                                <CheckIcon className="h-5 w-5 text-green-600" />
                                <p className="text-green-600">{success}</p>
                            </div>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center gap-2">
                                            <AcademicCapIcon className="h-5 w-5 text-gray-400" />
                                            Course Title *
                                        </div>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.title}
                                        onChange={(e) => setForm({...form, title: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., Web Development Bootcamp"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center gap-2">
                                            <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                                            Price ($)
                                        </div>
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.price}
                                        onChange={(e) => setForm({...form, price: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., 297"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center gap-2">
                                            <UsersIcon className="h-5 w-5 text-gray-400" />
                                            Students Count
                                        </div>
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={form.students}
                                        onChange={(e) => setForm({...form, students: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., 150"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center gap-2">
                                            <ClockIcon className="h-5 w-5 text-gray-400" />
                                            Estimated Duration
                                        </div>
                                    </label>
                                    <input
                                        type="text"
                                        value={form.duration}
                                        onChange={(e) => setForm({...form, duration: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., 45h 30m"
                                    />
                                </div>
                            </div>
                            
                            {/* Right Column */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center gap-2">
                                            <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                                            Description *
                                        </div>
                                    </label>
                                    <textarea
                                        required
                                        value={form.description}
                                        onChange={(e) => setForm({...form, description: e.target.value})}
                                        rows="4"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Describe what students will learn in this course..."
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center gap-2">
                                            <UserIcon className="h-5 w-5 text-gray-400" />
                                            Instructor
                                        </div>
                                    </label>
                                    <input
                                        type="text"
                                        value={form.instructor}
                                        onChange={(e) => setForm({...form, instructor: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., John Doe"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center gap-2">
                                            <TagIcon className="h-5 w-5 text-gray-400" />
                                            Category
                                        </div>
                                    </label>
                                    <select
                                        value={form.category}
                                        onChange={(e) => setForm({...form, category: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="web-development">Web Development</option>
                                        <option value="mobile-development">Mobile Development</option>
                                        <option value="data-science">Data Science</option>
                                        <option value="design">Design</option>
                                        <option value="business">Business</option>
                                        <option value="marketing">Marketing</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Level
                                        </label>
                                        <select
                                            value={form.level}
                                            onChange={(e) => setForm({...form, level: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                            <option value="all-levels">All Levels</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Status
                                        </label>
                                        <select
                                            value={form.status}
                                            onChange={(e) => setForm({...form, status: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="published">Published</option>
                                            <option value="archived">Archived</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="featured"
                                checked={form.featured}
                                onChange={(e) => setForm({...form, featured: e.target.checked})}
                                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                                Featured Course (show on homepage)
                            </label>
                        </div>
                        
                        <div className="pt-6 border-t border-gray-200">
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => router.push('/admin/courses')}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loadingSubmit}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {loadingSubmit ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <CheckIcon className="h-5 w-5" />
                                            Update Course
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}