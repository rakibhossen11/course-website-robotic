'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import YouTubePlayer from '@/components/YouTubePlayer';
import Link from 'next/link';
import { getSession } from 'next-auth/react';

// Course video data (replace with database fetch)
const courseContent = {
  id: 'web-development',
  title: 'Complete Web Development Course',
  modules: [
    {
      id: 'module-1',
      title: 'HTML Fundamentals',
      videos: [
        { id: 'dQw4w9WgXcQ', title: 'HTML Introduction', duration: '15:30', free: true },
        { id: '9bZkp7q19f0', title: 'HTML Tags & Elements', duration: '22:15', free: true },
        { id: 'CduA0TULnow', title: 'Forms & Inputs', duration: '18:45', free: false },
      ]
    },
    {
      id: 'module-2',
      title: 'CSS Styling',
      videos: [
        { id: 'OXGznpKZ_sA', title: 'CSS Basics', duration: '25:10', free: true },
        { id: 'G3e-cpL7ofc', title: 'Flexbox Layout', duration: '30:20', free: false },
        { id: 'H4MkGzoACpQ', title: 'CSS Grid', duration: '28:35', free: false },
      ]
    },
    {
      id: 'module-3',
      title: 'JavaScript Programming',
      videos: [
        { id: 'PkZNo7MFNFg', title: 'JS Fundamentals', duration: '35:45', free: true },
        { id: 'W6NZfCO5SIk', title: 'DOM Manipulation', duration: '40:15', free: false },
        { id: 'Mus_vwhTCq0', title: 'Async JavaScript', duration: '32:50', free: false },
      ]
    }
  ]
};

export default function CourseLearnPage() {
  const params = useParams();
  const router = useRouter();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [userHasAccess, setUserHasAccess] = useState(true);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [currentModule, setCurrentModule] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check if user is enrolled in course
    // checkUserAccess();
    
    // Set first video as default
    if (courseContent.modules[0]?.videos[0]) {
      setSelectedVideo({
        ...courseContent.modules[0].videos[0],
        moduleTitle: courseContent.modules[0].title
      });
    }
  }, []);

  useEffect(() => {
    // Calculate progress
    const totalVideos = courseContent.modules.reduce((total, module) => total + module.videos.length, 0);
    const completedCount = completedVideos.length;
    const progressPercentage = (completedCount / totalVideos) * 100;
    setProgress(Math.round(progressPercentage));
  }, [completedVideos]);

  const checkUserAccess = async () => {
    // In a real app, check from database if user purchased this course
    const session = await getSession();
    if (!session) {
      router.push('/login');
      return;
    }
    // Mock access check - replace with actual database query
    setUserHasAccess(true);
  };

  const handleVideoSelect = (video, moduleTitle) => {
    if (!video.free && !userHasAccess) {
      alert('Please purchase the course to access this video');
      return;
    }
    setSelectedVideo({ ...video, moduleTitle });
    
    // Mark as completed after watching (simulate)
    if (!completedVideos.includes(video.id)) {
      setCompletedVideos([...completedVideos, video.id]);
    }
  };

  const handleNextVideo = () => {
    const allVideos = courseContent.modules.flatMap(module => 
      module.videos.map(video => ({ ...video, moduleTitle: module.title }))
    );
    
    const currentIndex = allVideos.findIndex(v => v.id === selectedVideo.id);
    if (currentIndex < allVideos.length - 1) {
      const nextVideo = allVideos[currentIndex + 1];
      if (!nextVideo.free && !userHasAccess) {
        alert('Please purchase the course to access the next video');
        return;
      }
      setSelectedVideo(nextVideo);
    }
  };

  const handlePreviousVideo = () => {
    const allVideos = courseContent.modules.flatMap(module => 
      module.videos.map(video => ({ ...video, moduleTitle: module.title }))
    );
    
    const currentIndex = allVideos.findIndex(v => v.id === selectedVideo.id);
    if (currentIndex > 0) {
      const prevVideo = allVideos[currentIndex - 1];
      setSelectedVideo(prevVideo);
    }
  };

  if (!userHasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Course Access Required</h2>
          <p className="text-gray-600 mb-6">Please purchase this course to access the videos.</p>
          <Link
            href={`/courses/${params.id}`}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Go to Course Page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{courseContent.title}</h1>
              <p className="text-gray-600">Learn and build real projects</p>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4 md:mt-0 w-full md:w-64">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-blue-700">Course Progress</span>
                <span className="text-sm font-medium text-blue-700">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Video Player */}
          <div className="lg:w-2/3">
            {selectedVideo ? (
              <div className="space-y-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    {selectedVideo.moduleTitle}: {selectedVideo.title}
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Duration: {selectedVideo.duration}</span>
                    {!selectedVideo.free && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        Premium
                      </span>
                    )}
                  </div>
                </div>
                
                <YouTubePlayer 
                  videoId={selectedVideo.id}
                  title={selectedVideo.title}
                  description="Learn web development with practical examples"
                  showControls={true}
                />
                
                {/* Video Navigation */}
                <div className="flex justify-between">
                  <button
                    onClick={handlePreviousVideo}
                    className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
                    </svg>
                    <span>Previous Video</span>
                  </button>
                  
                  <button
                    onClick={handleNextVideo}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <span>Next Video</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-600">Select a video to start learning</p>
              </div>
            )}
          </div>

          {/* Course Content Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 bg-blue-600 text-white">
                <h3 className="text-xl font-bold">Course Content</h3>
                <p className="text-blue-100 text-sm mt-1">
                  {courseContent.modules.length} modules • {courseContent.modules.reduce((total, module) => total + module.videos.length, 0)} videos
                </p>
              </div>
              
              <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                {courseContent.modules.map((module, moduleIndex) => (
                  <div key={module.id} className="border-b">
                    <button
                      onClick={() => setCurrentModule(currentModule === moduleIndex ? -1 : moduleIndex)}
                      className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors flex justify-between items-center"
                    >
                      <div>
                        <h4 className="font-semibold text-gray-800">{module.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {module.videos.length} videos
                        </p>
                      </div>
                      <svg 
                        className={`w-5 h-5 text-gray-500 transform transition-transform ${
                          currentModule === moduleIndex ? 'rotate-180' : ''
                        }`}
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                      </svg>
                    </button>
                    
                    {currentModule === moduleIndex && (
                      <div className="px-6 pb-4">
                        <div className="space-y-2">
                          {module.videos.map((video, videoIndex) => (
                            <button
                              key={video.id}
                              onClick={() => handleVideoSelect(video, module.title)}
                              className={`w-full text-left p-3 rounded-lg transition-all flex items-center justify-between ${
                                selectedVideo?.id === video.id
                                  ? 'bg-blue-50 border border-blue-200'
                                  : 'hover:bg-gray-50'
                              } ${
                                !video.free && !userHasAccess ? 'opacity-60 cursor-not-allowed' : ''
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  completedVideos.includes(video.id)
                                    ? 'bg-green-100 text-green-600'
                                    : selectedVideo?.id === video.id
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {completedVideos.includes(video.id) ? '✓' : videoIndex + 1}
                                </div>
                                <div>
                                  <p className={`font-medium ${
                                    selectedVideo?.id === video.id ? 'text-blue-600' : 'text-gray-800'
                                  }`}>
                                    {video.title}
                                  </p>
                                  <div className="flex items-center space-x-3 mt-1">
                                    <span className="text-xs text-gray-500">{video.duration}</span>
                                    {!video.free && (
                                      <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded">
                                        Premium
                                      </span>
                                    )}
                                    {video.free && (
                                      <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded">
                                        Free
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              {selectedVideo?.id === video.id && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Course Actions */}
              <div className="p-6 border-t">
                <div className="space-y-3">
                  <button className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
                    Complete Course
                  </button>
                  <button className="w-full py-3 bg-gray-100 text-gray-800 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                    Download Materials
                  </button>
                  <Link
                    href={`/courses/${params.id}/discussion`}
                    className="block w-full py-3 bg-blue-50 text-blue-600 rounded-lg font-semibold text-center hover:bg-blue-100 transition-colors"
                  >
                    Go to Discussion Forum
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}