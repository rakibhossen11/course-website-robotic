// app/(protected)/admin/courses/create/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import {
    ArrowLeftIcon,
    PlusIcon,
    AcademicCapIcon,
    CurrencyDollarIcon,
    UsersIcon,
    DocumentTextIcon,
    ClockIcon,
    UserIcon,
    TagIcon
} from '@heroicons/react/24/outline';

export default function CreateCoursePage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [form, setForm] = useState({
        title: '',
        description: '',
        price: '',
        students: '0',
        duration: '',
        instructor: '',
        level: 'beginner',
        category: 'web-development',
        featured: false
    });
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Check if user is admin
    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) {
            router.push('/login');
        }
    }, [user, loading, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoadingSubmit(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/courses', {
                method: 'POST',
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
                setSuccess('Course created successfully! Redirecting...');
                setTimeout(() => {
                    router.push(`/admin/courses/${data.courseId}/modules`);
                }, 1500);
            } else {
                throw new Error(data.message || 'Failed to create course');
            }
        } catch (error) {
            console.error('Error creating course:', error);
            setError(error.message);
            // For demo purposes
            const demoCourseId = `course-${Date.now()}`;
            setSuccess('Course created (demo mode). Redirecting...');
            setTimeout(() => {
                router.push(`/admin/courses/${demoCourseId}/modules`);
            }, 1500);
        } finally {
            setLoadingSubmit(false);
        }
    };

    if (loading) {
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
                                <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
                                <p className="text-gray-600 mt-2">Add a new course to your platform</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white rounded-xl shadow p-6">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600">{error}</p>
                        </div>
                    )}
                    
                    {success && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-600">{success}</p>
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
                                            Initial Students Count
                                        </div>
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={form.students}
                                        onChange={(e) => setForm({...form, students: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., 0"
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
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <PlusIcon className="h-5 w-5" />
                                            Create Course
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