'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  FaClock, 
  FaUser, 
  FaStar, 
  FaCheckCircle, 
  FaArrowRight,
  FaBookOpen,
  FaVideo,
  FaTrophy,
  FaCertificate,
  FaChartLine,
  FaCalendarAlt,
  FaTag,
  FaFilter,
  FaTimes,
//   FaSparkles,
  FaShieldAlt,
  FaGraduationCap,
  FaDollarSign,
  FaPhoneAlt,
  FaUsers,
  FaBriefcase
} from 'react-icons/fa';
import { 
  MdOutlineTrendingUp,
  MdOutlineBook
} from 'react-icons/md';

export default function PreEnrollmentSection() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]); 

   
    

  const categories = [
    { id: 'All', name: 'All Courses', count: 12 },
    { id: 'web', name: 'Web Development', count: 5 },
    { id: 'mobile', name: 'Mobile App', count: 3 },
    { id: 'design', name: 'UI/UX Design', count: 2 },
    { id: 'marketing', name: 'Digital Marketing', count: 2 },
  ];

  const levels = [
    { id: 'All', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' },
  ];

  const courses = [
    {
      id: 1,
      title: 'Complete Android Development Bootcamp',
      description: 'Master Android app development with Kotlin, Jetpack Compose, and modern architecture patterns. Build real-world applications.',
      category: 'mobile',
      level: 'beginner',
      duration: '12 Weeks',
      students: '2,345',
      rating: 4.8,
      reviews: 345,
      price: 3999,
      originalPrice: 6999,
      discount: '43%',
      instructor: 'Jubayer Ahmed',
      instructorRole: 'Senior Android Developer',
      image: '/courses/android.jpg',
      features: [
        'Lifetime Access',
        'Certificate of Completion',
        '30+ Projects',
        'Community Support',
        'Job Placement Assistance'
      ],
      upcomingBatch: 'January 15, 2024',
      spotsLeft: 24,
      isFeatured: true,
      isBestSeller: true
    },
    {
      id: 2,
      title: 'Full Stack Web Development Masterclass',
      description: 'Become a full-stack developer with React, Node.js, MongoDB, and modern DevOps practices.',
      category: 'web',
      level: 'intermediate',
      duration: '16 Weeks',
      students: '3,890',
      rating: 4.9,
      reviews: 512,
      price: 4999,
      originalPrice: 7999,
      discount: '38%',
      instructor: 'Sarah Johnson',
      instructorRole: 'Lead Full Stack Developer',
      image: '/courses/web.jpg',
      features: [
        'Live Sessions',
        'Project Portfolio',
        'Mentorship',
        'Code Reviews',
        'Interview Prep'
      ],
      upcomingBatch: 'January 20, 2024',
      spotsLeft: 15,
      isFeatured: true,
      isBestSeller: true
    },
    {
      id: 3,
      title: 'UI/UX Design Fundamentals',
      description: 'Learn user-centered design principles, prototyping, and design systems for modern applications.',
      category: 'design',
      level: 'beginner',
      duration: '8 Weeks',
      students: '1,567',
      rating: 4.7,
      reviews: 234,
      price: 2999,
      originalPrice: 4999,
      discount: '40%',
      instructor: 'Michael Chen',
      instructorRole: 'Product Designer at Google',
      image: '/courses/design.jpg',
      features: [
        'Figma Mastery',
        'Design System',
        'Portfolio Review',
        '1-on-1 Feedback',
        'Industry Projects'
      ],
      upcomingBatch: 'January 18, 2024',
      spotsLeft: 32,
      isFeatured: false,
      isBestSeller: true
    },
    {
      id: 4,
      title: 'Digital Marketing Pro',
      description: 'Master SEO, social media marketing, content strategy, and analytics for business growth.',
      category: 'marketing',
      level: 'intermediate',
      duration: '10 Weeks',
      students: '2,890',
      rating: 4.6,
      reviews: 412,
      price: 3499,
      originalPrice: 5999,
      discount: '42%',
      instructor: 'Emma Watson',
      instructorRole: 'Digital Marketing Expert',
      image: '/courses/marketing.jpg',
      features: [
        'Google Analytics',
        'Facebook Ads',
        'SEO Tools',
        'Case Studies',
        'Strategy Templates'
      ],
      upcomingBatch: 'January 22, 2024',
      spotsLeft: 18,
      isFeatured: true,
      isBestSeller: false
    },
    {
      id: 5,
      title: 'iOS Development with SwiftUI',
      description: 'Build modern iOS applications using SwiftUI, Combine, and Apple\'s latest frameworks.',
      category: 'mobile',
      level: 'intermediate',
      duration: '14 Weeks',
      students: '1,890',
      rating: 4.8,
      reviews: 267,
      price: 4499,
      originalPrice: 7499,
      discount: '40%',
      instructor: 'David Lee',
      instructorRole: 'iOS Developer at Apple',
      image: '/courses/ios.jpg',
      features: [
        'SwiftUI Mastery',
        'App Store Submission',
        'ARKit Integration',
        'Code Optimization',
        'App Monetization'
      ],
      upcomingBatch: 'January 25, 2024',
      spotsLeft: 22,
      isFeatured: false,
      isBestSeller: true
    },
    {
      id: 6,
      title: 'Data Science Fundamentals',
      description: 'Learn Python for data analysis, machine learning basics, and data visualization techniques.',
      category: 'data',
      level: 'advanced',
      duration: '20 Weeks',
      students: '3,456',
      rating: 4.9,
      reviews: 589,
      price: 5999,
      originalPrice: 9999,
      discount: '40%',
      instructor: 'Dr. Robert Kim',
      instructorRole: 'Data Scientist',
      image: '/courses/data.jpg',
      features: [
        'Python Programming',
        'Machine Learning',
        'Data Visualization',
        'Real Datasets',
        'Career Guidance'
      ],
      upcomingBatch: 'January 30, 2024',
      spotsLeft: 12,
      isFeatured: true,
      isBestSeller: true
    }
  ];

  const handleEnroll = (courseId) => {
    if (!enrolledCourses.includes(courseId)) {
      setEnrolledCourses([...enrolledCourses, courseId]);
      // Show success message
      const course = courses.find(c => c.id === courseId);
      alert(`Successfully enrolled in "${course.title}"!`);
    }
  };

  const filteredCourses = courses.filter(course => {
    const categoryMatch = selectedCategory === 'All' || course.category === selectedCategory;
    const levelMatch = selectedLevel === 'All' || course.level === selectedLevel;
    return categoryMatch && levelMatch;
  });

  const getLevelColor = (level) => {
    switch(level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 via-white to-purple-50 py-16 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <FaGraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Start Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Learning Journey
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of students who transformed their careers with our industry-leading courses
          </p>
        </div>

        {/* Stats Banner */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">10,000+</div>
                <div className="text-sm text-gray-600">Happy Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">98%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">200+</div>
                <div className="text-sm text-gray-600">Industry Partners</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-600">Support Available</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Browse Courses
              </h2>
              <p className="text-gray-600">
                Filter by category and difficulty level
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              {/* Category Filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2.5 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.count})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                  <FaTag className="h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Level Filter */}
              <div className="relative">
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2.5 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {levels.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                  <MdOutlineTrendingUp className="h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <FaFilter className="w-5 h-5" />
                Filters
              </button>
            </div>
          </div>

          {/* Mobile Filters Panel */}
          {showFilters && (
            <div className="md:hidden mt-4 p-4 bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <FaTimes className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          selectedCategory === cat.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                  <div className="flex flex-wrap gap-2">
                    {levels.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setSelectedLevel(level.id)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          selectedLevel === level.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {level.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                course.isFeatured ? 'border-blue-500' : 'border-transparent'
              }`}
            >
              {/* Course Header */}
              <div className="relative">
                {/* Course Image */}
                <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(course.level)}`}>
                      {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                    </span>
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {course.isFeatured && (
                      <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                        {/* <FaSparkles className="w-3 h-3" /> */}
                        Featured
                      </span>
                    )}
                    {course.isBestSeller && (
                      <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                        <FaTrophy className="w-3 h-3" />
                        Bestseller
                      </span>
                    )}
                  </div>

                  {/* Discount Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-lg">
                      {course.discount} OFF
                    </span>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6">
                  {/* Title and Instructor */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>By</span>
                      <span className="font-semibold text-gray-900">{course.instructor}</span>
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                        {course.instructorRole}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {course.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-600">
                        <FaClock className="w-4 h-4" />
                        <span className="text-sm font-semibold">{course.duration}</span>
                      </div>
                      <div className="text-xs text-gray-500">Duration</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-600">
                        <FaUser className="w-4 h-4" />
                        <span className="text-sm font-semibold">{course.students}</span>
                      </div>
                      <div className="text-xs text-gray-500">Students</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-600">
                        <FaStar className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-semibold">{course.rating}</span>
                        <span className="text-xs text-gray-500">({course.reviews})</span>
                      </div>
                      <div className="text-xs text-gray-500">Rating</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Course Includes:</h4>
                    <div className="space-y-2">
                      {course.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <FaCheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upcoming Batch */}
                  <div className="mb-6 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-semibold text-gray-900">Next Batch:</span>
                        <span className="text-sm text-gray-700">{course.upcomingBatch}</span>
                      </div>
                      <div className="text-sm text-red-600 font-semibold">
                        {course.spotsLeft} spots left
                      </div>
                    </div>
                  </div>

                  {/* Price and Enroll Button */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-900">
                          ৳{course.price}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ৳{course.originalPrice}
                        </span>
                        <span className="text-sm font-semibold text-red-600">
                          Save ৳{course.originalPrice - course.price}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">One-time payment</div>
                    </div>
                    <button
                      onClick={() => handleEnroll(course.id)}
                      disabled={enrolledCourses.includes(course.id)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                        enrolledCourses.includes(course.id)
                          ? 'bg-green-100 text-green-700 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-lg'
                      }`}
                    >
                      {enrolledCourses.includes(course.id) ? (
                        <>
                          <FaCheckCircle className="w-5 h-5" />
                          Enrolled
                        </>
                      ) : (
                        <>
                          <FaBookOpen className="w-5 h-5" />
                          Enroll Now
                          <FaArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow border border-gray-200">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <FaBookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters to find what you're looking for.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedLevel('All');
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Why Choose Us Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Why Choose <span className="text-blue-600">LearningBD</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: FaCertificate,
                title: 'Industry-Recognized Certificates',
                description: 'Get certificates that are valued by employers worldwide'
              },
              {
                icon: FaVideo,
                title: 'Project-Based Learning',
                description: 'Learn by building real projects for your portfolio'
              },
              {
                icon: FaShieldAlt,
                title: 'Job Placement Assistance',
                description: 'Get help with job applications and interviews'
              },
              {
                icon: FaDollarSign,
                title: 'Money-Back Guarantee',
                description: '30-day refund policy if not satisfied'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-3">
                Still have questions about enrollment?
              </h2>
              <p className="text-blue-100">
                Our student advisors are here to help you choose the right course
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
              >
                <FaPhoneAlt className="w-5 h-5" />
                Talk to Advisor
              </Link>
              <Link
                href="/faq"
                className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                View FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}