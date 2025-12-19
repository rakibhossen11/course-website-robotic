// app/(protected)/admin/courses/[id]/modules/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import Link from 'next/link';
import {
    PlusIcon,
    TrashIcon,
    PencilIcon,
    FolderIcon,
    DocumentPlusIcon,
    ArrowPathIcon,
    ArrowLeftIcon,
    VideoCameraIcon,
    ClockIcon,
    LockClosedIcon,
    LockOpenIcon,
    AcademicCapIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function CourseModulesPage() {
    const router = useRouter();
    const params = useParams();
    const { user, loading } = useAuth();
    const courseId = params.id;
    
    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form states
    const [showModuleForm, setShowModuleForm] = useState(false);
    const [showVideoForm, setShowVideoForm] = useState(false);
    const [editingModuleId, setEditingModuleId] = useState(null);
    const [editingVideoId, setEditingVideoId] = useState(null);
    const [selectedModuleId, setSelectedModuleId] = useState('');
    
    // Module form
    const [moduleForm, setModuleForm] = useState({
        title: '',
        description: ''
    });
    
    // Video form
    const [videoForm, setVideoForm] = useState({
        videoId: '',
        title: '',
        duration: '',
        free: false,
        moduleId: ''
    });

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
                setCourse(data.course);
                setModules(data.course?.modules || []);
            } else {
                throw new Error(data.message || 'Failed to fetch course data');
            }
        } catch (error) {
            console.error('Error fetching course data:', error);
            setError(error.message);
            // Load sample data if API fails
            loadSampleData();
        } finally {
            setLoadingData(false);
        }
    };

    const loadSampleData = () => {
        const sampleCourse = {
            id: courseId,
            title: 'Web Development Bootcamp',
            description: 'Complete web development course from zero to hero',
            modules: [
                {
                    id: 'module-1',
                    title: 'HTML & CSS Basics',
                    description: 'Learn the fundamentals of web development',
                    videos: [
                        { id: 'qz0aGYrrlhU', title: 'HTML Introduction', duration: '25:30', free: true },
                        { id: '1PnVor36_40', title: 'CSS Styling', duration: '30:15', free: true },
                    ]
                },
                {
                    id: 'module-2',
                    title: 'JavaScript Fundamentals',
                    description: 'Master JavaScript programming',
                    videos: [
                        { id: 'PkZNo7MFNFg', title: 'JS Basics', duration: '35:45', free: false },
                        { id: 'W6NZfCO5SIk', title: 'DOM Manipulation', duration: '40:15', free: false },
                    ]
                }
            ]
        };
        setCourse(sampleCourse);
        setModules(sampleCourse.modules || []);
    };

    const handleModuleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const url = editingModuleId 
                ? `/api/admin/courses/${courseId}/modules/${editingModuleId}`
                : `/api/admin/courses/${courseId}/modules`;
            
            const method = editingModuleId ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: JSON.stringify(moduleForm)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            
            if (data.success) {
                setSuccess(editingModuleId ? 'Module updated successfully!' : 'Module created successfully!');
                
                if (editingModuleId) {
                    setModules(prev => prev.map(module => 
                        module.id === editingModuleId 
                            ? { ...module, ...moduleForm }
                            : module
                    ));
                } else {
                    setModules(prev => [...prev, {
                        id: data.moduleId,
                        ...moduleForm,
                        videos: []
                    }]);
                }
                
                resetModuleForm();
                fetchCourseData(); // Refresh data
            } else {
                throw new Error(data.message || 'Failed to save module');
            }
        } catch (error) {
            console.error('Error saving module:', error);
            setError(error.message);
            // For demo purposes, update locally
            if (editingModuleId) {
                setModules(prev => prev.map(module => 
                    module.id === editingModuleId 
                        ? { ...module, ...moduleForm }
                        : module
                ));
                setSuccess('Module updated (demo mode)');
            } else {
                const newModule = {
                    id: `module-${Date.now()}`,
                    ...moduleForm,
                    videos: []
                };
                setModules(prev => [...prev, newModule]);
                setSuccess('Module created (demo mode)');
            }
            resetModuleForm();
        }
    };

    const handleVideoSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!videoForm.moduleId) {
            setError('Please select a module first');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const url = editingVideoId 
                ? `/api/admin/courses/${courseId}/modules/${videoForm.moduleId}/videos/${editingVideoId}`
                : `/api/admin/courses/${courseId}/modules/${videoForm.moduleId}/videos`;
            
            const method = editingVideoId ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: JSON.stringify({
                    videoId: videoForm.videoId,
                    title: videoForm.title,
                    duration: videoForm.duration,
                    free: videoForm.free
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            
            if (data.success) {
                setSuccess(editingVideoId ? 'Video updated successfully!' : 'Video added successfully!');
                
                const updatedModules = modules.map(module => {
                    if (module.id === videoForm.moduleId) {
                        const videos = [...module.videos];
                        if (editingVideoId) {
                            const index = videos.findIndex(v => v.id === editingVideoId);
                            if (index !== -1) {
                                videos[index] = {
                                    id: videoForm.videoId,
                                    title: videoForm.title,
                                    duration: videoForm.duration,
                                    free: videoForm.free
                                };
                            }
                        } else {
                            videos.push({
                                id: videoForm.videoId,
                                title: videoForm.title,
                                duration: videoForm.duration,
                                free: videoForm.free
                            });
                        }
                        return { ...module, videos };
                    }
                    return module;
                });
                
                setModules(updatedModules);
                resetVideoForm();
                fetchCourseData(); // Refresh data
            } else {
                throw new Error(data.message || 'Failed to save video');
            }
        } catch (error) {
            console.error('Error saving video:', error);
            setError(error.message);
            // For demo purposes, update locally
            const updatedModules = modules.map(module => {
                if (module.id === videoForm.moduleId) {
                    const videos = [...module.videos];
                    if (editingVideoId) {
                        const index = videos.findIndex(v => v.id === editingVideoId);
                        if (index !== -1) {
                            videos[index] = {
                                id: videoForm.videoId,
                                title: videoForm.title,
                                duration: videoForm.duration,
                                free: videoForm.free
                            };
                        }
                    } else {
                        videos.push({
                            id: videoForm.videoId,
                            title: videoForm.title,
                            duration: videoForm.duration,
                            free: videoForm.free
                        });
                    }
                    return { ...module, videos };
                }
                return module;
            });
            
            setModules(updatedModules);
            setSuccess(editingVideoId ? 'Video updated (demo mode)' : 'Video added (demo mode)');
            resetVideoForm();
        }
    };

    const resetModuleForm = () => {
        setModuleForm({ title: '', description: '' });
        setEditingModuleId(null);
        setShowModuleForm(false);
    };

    const resetVideoForm = () => {
        setVideoForm({
            videoId: '',
            title: '',
            duration: '',
            free: false,
            moduleId: selectedModuleId || ''
        });
        setEditingVideoId(null);
        setShowVideoForm(false);
    };

    const editModule = (module) => {
        setModuleForm({
            title: module.title,
            description: module.description || ''
        });
        setEditingModuleId(module.id);
        setShowModuleForm(true);
    };

    const editVideo = (video, moduleId) => {
        setVideoForm({
            videoId: video.id,
            title: video.title,
            duration: video.duration,
            free: video.free,
            moduleId: moduleId
        });
        setEditingVideoId(video.id);
        setSelectedModuleId(moduleId);
        setShowVideoForm(true);
    };

    const deleteModule = async (moduleId) => {
        if (!confirm('Are you sure you want to delete this module and all its videos?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/admin/courses/${courseId}/modules/${moduleId}`, {
                method: 'DELETE',
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
                setSuccess('Module deleted successfully!');
                setModules(prev => prev.filter(module => module.id !== moduleId));
                fetchCourseData(); // Refresh data
            } else {
                throw new Error(data.message || 'Failed to delete module');
            }
        } catch (error) {
            console.error('Error deleting module:', error);
            setError(error.message);
            // For demo purposes, delete locally
            setModules(prev => prev.filter(module => module.id !== moduleId));
            setSuccess('Module deleted (demo mode)');
        }
    };

    const deleteVideo = async (videoId, moduleId) => {
        if (!confirm('Are you sure you want to delete this video?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/admin/courses/${courseId}/modules/${moduleId}/videos/${videoId}`, {
                method: 'DELETE',
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
                setSuccess('Video deleted successfully!');
                const updatedModules = modules.map(module => {
                    if (module.id === moduleId) {
                        return {
                            ...module,
                            videos: module.videos.filter(video => video.id !== videoId)
                        };
                    }
                    return module;
                });
                setModules(updatedModules);
                fetchCourseData(); // Refresh data
            } else {
                throw new Error(data.message || 'Failed to delete video');
            }
        } catch (error) {
            console.error('Error deleting video:', error);
            setError(error.message);
            // For demo purposes, delete locally
            const updatedModules = modules.map(module => {
                if (module.id === moduleId) {
                    return {
                        ...module,
                        videos: module.videos.filter(video => video.id !== videoId)
                    };
                }
                return module;
            });
            setModules(updatedModules);
            setSuccess('Video deleted (demo mode)');
        }
    };

    const formatDuration = (duration) => {
        if (!duration) return '00:00';
        return duration.replace(/^(\d+):(\d+)$/, (match, mins, secs) => {
            return `${mins.padStart(2, '0')}:${secs.padStart(2, '0')}`;
        });
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
                                <h1 className="text-3xl font-bold text-gray-900">{course?.title || 'Course Modules'}</h1>
                                <p className="text-gray-600 mt-2">Manage modules and videos for this course</p>
                            </div>
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
                                onClick={fetchCourseData}
                                disabled={loadingData}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                <ArrowPathIcon className={`h-5 w-5 ${loadingData ? 'animate-spin' : ''}`} />
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Course Info Banner */}
                {course && (
                    <div className="bg-white rounded-xl shadow p-6 mb-6">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <AcademicCapIcon className="h-8 w-8 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{course.title}</h2>
                                    <p className="text-gray-600 mt-1">{course.description}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="text-sm text-gray-500">Price: ${course.price}</span>
                                        <span className="text-sm text-gray-500">Students: {course.students}</span>
                                        <span className="text-sm text-gray-500">Level: {course.level}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-500">Total Modules</div>
                                <div className="text-2xl font-bold text-gray-900">{modules.length}</div>
                                <div className="text-sm text-gray-500 mt-1">
                                    {modules.reduce((total, module) => total + (module.videos?.length || 0), 0)} videos
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => {
                                resetModuleForm();
                                setShowModuleForm(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <FolderIcon className="h-5 w-5" />
                            Add New Module
                        </button>
                        <button
                            onClick={() => {
                                if (modules.length === 0) {
                                    alert('Please create a module first!');
                                    return;
                                }
                                resetVideoForm();
                                setShowVideoForm(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <DocumentPlusIcon className="h-5 w-5" />
                            Add New Video
                        </button>
                    </div>
                </div>

                {/* Module Form Modal */}
                {showModuleForm && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-25 backdrop-blur-sm transition-opacity" onClick={resetModuleForm} />
                        
                        <div className="flex min-h-full items-center justify-center p-4">
                            <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                        {editingModuleId ? 'Edit Module' : 'Add New Module'}
                                    </h2>
                                    
                                    <form onSubmit={handleModuleSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Module Title *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={moduleForm.title}
                                                onChange={(e) => setModuleForm({...moduleForm, title: e.target.value})}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="e.g., JavaScript Programming"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Description
                                            </label>
                                            <textarea
                                                value={moduleForm.description}
                                                onChange={(e) => setModuleForm({...moduleForm, description: e.target.value})}
                                                rows="3"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Describe what this module covers..."
                                            />
                                        </div>
                                        
                                        <div className="flex justify-end gap-3 pt-4">
                                            <button
                                                type="button"
                                                onClick={resetModuleForm}
                                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                {editingModuleId ? 'Update Module' : 'Add Module'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Video Form Modal */}
                {showVideoForm && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-25 backdrop-blur-sm transition-opacity" onClick={resetVideoForm} />
                        
                        <div className="flex min-h-full items-center justify-center p-4">
                            <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                        {editingVideoId ? 'Edit Video' : 'Add New Video'}
                                    </h2>
                                    
                                    <form onSubmit={handleVideoSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Select Module *
                                            </label>
                                            <select
                                                required
                                                value={videoForm.moduleId}
                                                onChange={(e) => setVideoForm({...videoForm, moduleId: e.target.value})}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="">Choose a module</option>
                                                {modules.map(module => (
                                                    <option key={module.id} value={module.id}>
                                                        {module.title}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Video ID *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={videoForm.videoId}
                                                onChange={(e) => setVideoForm({...videoForm, videoId: e.target.value})}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="e.g., PkZNo7MFNFg"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                YouTube video ID (from URL: youtube.com/watch?v=<strong>VIDEO_ID</strong>)
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Video Title *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={videoForm.title}
                                                onChange={(e) => setVideoForm({...videoForm, title: e.target.value})}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="e.g., JavaScript Fundamentals"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Duration *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={videoForm.duration}
                                                onChange={(e) => setVideoForm({...videoForm, duration: e.target.value})}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="e.g., 35:45"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Format: MM:SS (minutes:seconds)</p>
                                        </div>
                                        
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="freeVideo"
                                                checked={videoForm.free}
                                                onChange={(e) => setVideoForm({...videoForm, free: e.target.checked})}
                                                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                            />
                                            <label htmlFor="freeVideo" className="ml-2 text-sm text-gray-700">
                                                Free Preview Video
                                            </label>
                                        </div>
                                        
                                        <div className="flex justify-end gap-3 pt-4">
                                            <button
                                                type="button"
                                                onClick={resetVideoForm}
                                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                {editingVideoId ? 'Update Video' : 'Add Video'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modules List */}
                <div className="space-y-6">
                    {modules.length === 0 ? (
                        <div className="bg-white rounded-xl shadow p-12 text-center">
                            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <FolderIcon className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No modules yet</h3>
                            <p className="text-gray-600 mb-4">Add your first module to start organizing videos</p>
                            <button
                                onClick={() => {
                                    resetModuleForm();
                                    setShowModuleForm(true);
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <PlusIcon className="h-5 w-5 inline mr-2" />
                                Create First Module
                            </button>
                        </div>
                    ) : modules.map((module) => (
                        <div key={module.id} className="bg-white rounded-xl shadow overflow-hidden">
                            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <FolderIcon className="h-6 w-6 text-blue-600" />
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">{module.title}</h3>
                                        {module.description && (
                                            <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                                        )}
                                    </div>
                                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                        {module.videos?.length || 0} {module.videos?.length === 1 ? 'video' : 'videos'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedModuleId(module.id);
                                            resetVideoForm();
                                            setVideoForm(prev => ({...prev, moduleId: module.id}));
                                            setShowVideoForm(true);
                                        }}
                                        className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Add Video to Module"
                                    >
                                        <PlusIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => editModule(module)}
                                        className="text-yellow-600 hover:text-yellow-900 p-2 hover:bg-yellow-50 rounded-lg transition-colors"
                                        title="Edit Module"
                                    >
                                        <PencilIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => deleteModule(module.id)}
                                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete Module"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                {(!module.videos || module.videos.length === 0) ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <VideoCameraIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                        <p>No videos in this module yet</p>
                                        <button
                                            onClick={() => {
                                                setSelectedModuleId(module.id);
                                                resetVideoForm();
                                                setVideoForm(prev => ({...prev, moduleId: module.id}));
                                                setShowVideoForm(true);
                                            }}
                                            className="mt-4 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Add First Video
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {module.videos.map((video) => (
                                            <div key={video.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <VideoCameraIcon className="h-5 w-5 text-gray-400" />
                                                        <h4 className="font-medium text-gray-900">{video.title}</h4>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => editVideo(video, module.id)}
                                                            className="text-yellow-600 hover:text-yellow-800 p-1"
                                                            title="Edit Video"
                                                        >
                                                            <PencilIcon className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteVideo(video.id, module.id)}
                                                            className="text-red-600 hover:text-red-800 p-1"
                                                            title="Delete Video"
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <div className="text-sm">
                                                        <span className="text-gray-500">Video ID:</span>
                                                        <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                                                            {video.id}
                                                        </code>
                                                    </div>
                                                    
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <ClockIcon className="h-4 w-4 mr-1" />
                                                        Duration: {formatDuration(video.duration)}
                                                    </div>
                                                    
                                                    <div className="flex items-center text-sm">
                                                        {video.free ? (
                                                            <>
                                                                <LockOpenIcon className="h-4 w-4 text-green-600 mr-1" />
                                                                <span className="text-green-600 font-medium">Free Preview</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <LockClosedIcon className="h-4 w-4 text-gray-400 mr-1" />
                                                                <span className="text-gray-500">Premium Content</span>
                                                            </>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="pt-2">
                                                        <a
                                                            href={`https://youtube.com/watch?v=${video.id}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                                        >
                                                            View on YouTube →
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}