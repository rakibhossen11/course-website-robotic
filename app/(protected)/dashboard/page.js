'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import { 
  AcademicCapIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  ArrowRightIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function UserDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  // console.log(enrollments);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEnrolled: 0,
    totalPending: 0,
    totalRejected: 0,
  });

  useEffect(() => {
    if (user?.uid) {
      fetchUserEnrollments();
    }
  }, [user]);

  const fetchUserEnrollments = async () => {
    try {
      setLoading(true);
      const token = await user.getIdToken?.();
      
      const response = await fetch(`/api/users/${user.uid}/enrollments`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      
      const data = await response.json();
      
      if (data.success) {
        setEnrollments(data.enrollments || []);
        
        // Calculate stats
        const stats = {
          totalEnrolled: data.enrollments?.filter(e => e.status === 'approved').length || 0,
          totalPending: data.enrollments?.filter(e => e.status === 'pending').length || 0,
          totalRejected: data.enrollments?.filter(e => e.status === 'rejected').length || 0,
        };
        setStats(stats);
      }
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      approved: {
        icon: <CheckCircleIcon className="h-5 w-5" />,
        color: 'bg-green-100 text-green-800 border-green-200',
        text: 'Enrolled'
      },
      pending: {
        icon: <ClockIcon className="h-5 w-5" />,
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        text: 'Pending'
      },
      rejected: {
        icon: <XCircleIcon className="h-5 w-5" />,
        color: 'bg-red-100 text-red-800 border-red-200',
        text: 'Rejected'
      }
    };

    const badge = badges[status] || badges.pending;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${badge.color}`}>
        {badge.icon}
        {badge.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.displayName}!
        </h1>
        <p className="text-gray-600 mt-2">
          Track your course progress and manage your enrollments
        </p>
      </div>

      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Enrolled Courses</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalEnrolled}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending Requests</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalPending}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Rejected Requests</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalRejected}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircleIcon className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Enrolled Courses */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
                <Link
                  href="/courses"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <PlusCircleIcon className="h-5 w-5" />
                  Browse Courses
                </Link>
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading your courses...</p>
                </div>
              ) : enrollments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <AcademicCapIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
                  <p className="text-gray-600 mb-6">
                    You haven't enrolled in any courses yet.
                  </p>
                  <Link
                    href="/courses"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Browse Available Courses
                    <ArrowRightIcon className="h-5 w-5" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Approved Courses */}
                  {enrollments.filter(e => e.status === 'approved').length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Enrollments</h3>
                      <div className="space-y-4">
                        {enrollments
                          .filter(e => e.status === 'approved')
                          .map((enrollment) => (
                            <div
                              key={enrollment?._id}
                              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium text-gray-900">{enrollment.courseName}</h4>
                                  <p className="text-sm text-gray-600 mt-1">
                                    Enrolled on: {formatDate(enrollment.enrolledAt)}
                                  </p>
                                  {enrollment.transactionId && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      Transaction: {enrollment.transactionId}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center gap-3">
                                  {getStatusBadge(enrollment.status)}
                                  <Link
                                    href={`/courses/${enrollment.courseId}/learn`}
                                    className="text-blue-600 hover:text-blue-700"
                                  >
                                    View Course
                                  </Link>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Pending Enrollments */}
                  {enrollments.filter(e => e.status === 'pending').length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Approvals</h3>
                      <div className="space-y-4">
                        {enrollments
                          .filter(e => e.status === 'pending')
                          .map((enrollment) => (
                            <div
                              key={enrollment.enrollmentId}
                              className="border border-yellow-200 rounded-lg p-4 bg-yellow-50"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium text-gray-900">{enrollment.courseName}</h4>
                                  <p className="text-sm text-gray-600 mt-1">
                                    Requested on: {formatDate(enrollment.enrolledAt)}
                                  </p>
                                  <p className="text-sm text-yellow-600 mt-2">
                                    <ClockIcon className="h-4 w-4 inline mr-1" />
                                    Waiting for admin approval
                                  </p>
                                </div>
                                {getStatusBadge(enrollment.status)}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Rejected Enrollments */}
                  {enrollments.filter(e => e.status === 'rejected').length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Rejected Requests</h3>
                      <div className="space-y-4">
                        {enrollments
                          .filter(e => e.status === 'rejected')
                          .map((enrollment) => (
                            <div
                              key={enrollment.enrollmentId}
                              className="border border-red-200 rounded-lg p-4 bg-red-50"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium text-gray-900">{enrollment.courseName}</h4>
                                  <p className="text-sm text-gray-600 mt-1">
                                    Requested on: {formatDate(enrollment.enrolledAt)}
                                  </p>
                                  {enrollment.adminNotes && (
                                    <div className="mt-2">
                                      <p className="text-sm font-medium text-red-700">Reason:</p>
                                      <p className="text-sm text-red-600">{enrollment.adminNotes}</p>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-3">
                                  {getStatusBadge(enrollment.status)}
                                  <button
                                    onClick={() => {
                                      // Option to re-apply or contact support
                                      alert('Please contact support or try enrolling again.');
                                    }}
                                    className="text-blue-600 hover:text-blue-700 text-sm"
                                  >
                                    Contact Support
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Summary */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <img
                    src={user?.photoURL || '/default-avatar.png'}
                    alt={user?.displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user?.displayName}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-500">Account Type</p>
                <p className="font-medium">
                  <span className={`px-2 py-1 rounded text-xs ${
                    user?.role === 'admin' ? 'bg-red-100 text-red-800' :
                    user?.role === 'teacher' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {user?.role?.toUpperCase() || 'STUDENT'}
                  </span>
                </p>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <Link
                  href="/dashboard/profile"
                  className="block w-full text-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/courses"
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <AcademicCapIcon className="h-5 w-5 text-blue-600" />
                <span>Browse Courses</span>
              </Link>
              <Link
                href="/dashboard/enrollments"
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
                <span>View All Enrollments</span>
              </Link>
              {stats.totalRejected > 0 && (
                <button
                  onClick={() => alert('Contact support at support@example.com')}
                  className="flex items-center gap-3 p-3 border border-red-200 rounded-lg hover:bg-red-50 w-full text-left"
                >
                  <XCircleIcon className="h-5 w-5 text-red-600" />
                  <span>Help with Rejected Courses</span>
                </button>
              )}
            </div>
          </div>

          {/* Course Progress (if applicable) */}
          {stats.totalEnrolled > 0 && (
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress</h3>
              <div className="space-y-4">
                {enrollments
                  .filter(e => e.status === 'approved')
                  .slice(0, 2)
                  .map((enrollment) => (
                    <div key={enrollment?._id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{enrollment.courseName}</span>
                        <span>0%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                    </div>
                  ))}
                <Link
                  href="/dashboard/progress"
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  View detailed progress →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// 'use client';

// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { useAuth } from '@/components/AuthContext';
// import ProtectedRoute from '@/components/ProtectedRoute';
// import { useRouter } from 'next/navigation';

// export default function DashboardPage() {
//   const { user } = useAuth();
//   const router = useRouter();
//   console.log(user);

//   // useEffect(() => {
//   //     if (!user) {
//   //       router.replace('/login');
//   //     }
//   //   }, [user]);

//   // Mock enrolled courses
//   const enrolledCourses = [
//     { id: 1, title: 'Web Development Bootcamp', progress: 65 },
//     { id: 2, title: 'JavaScript Mastery', progress: 30 },
//     { id: 3, title: 'React for Beginners', progress: 100 },
//   ];

//   const stats = [
//     { label: 'Enrolled Courses', value: enrolledCourses.length },
//     { label: 'Hours Watched', value: '24' },
//     { label: 'Completion Rate', value: '65%' },
//     { label: 'Certificates', value: '2' },
//   ];

//   return (
//     <ProtectedRoute>
//     <div className="space-y-8">
//       {/* Welcome Header */}
//       <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6">
//         <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.displayName || 'Student'}!</h1>
//         <p className="text-blue-100">Continue your learning journey</p>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         {stats.map((stat, index) => (
//           <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
//             <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
//             <div className="text-gray-600">{stat.label}</div>
//           </div>
//         ))}
//       </div>

//       {/* Enrolled Courses */}
//       <div className="bg-white rounded-xl shadow-sm p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold text-gray-800">Your Courses</h2>
//           <Link href="/courses" className="text-blue-600 hover:text-blue-800">
//             Browse more courses →
//           </Link>
//         </div>

//         <div className="space-y-4">
//           {enrolledCourses.map((course) => (
//             <div key={course.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
//               <div className="flex flex-col md:flex-row md:items-center justify-between">
//                 <div className="mb-4 md:mb-0">
//                   <h3 className="font-bold text-lg text-gray-800">{course.title}</h3>
//                   <div className="mt-2 w-64">
//                     <div className="flex justify-between text-sm mb-1">
//                       <span className="text-gray-600">Progress</span>
//                       <span className="font-semibold">{course.progress}%</span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div 
//                         className="bg-blue-600 h-2 rounded-full"
//                         style={{ width: `${course.progress}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex space-x-3">
//                   {course.progress === 100 ? (
//                     <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
//                       View Certificate
//                     </button>
//                   ) : (
//                     <Link
//                       href={`/courses/${course.id}/learn`}
//                       className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//                     >
//                       {course.progress === 0 ? 'Start Learning' : 'Continue'}
//                     </Link>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Recent Activity */}
//       <div className="bg-white rounded-xl shadow-sm p-6">
//         <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h2>
//         <div className="space-y-4">
//           <div className="flex items-center">
//             <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-4">
//               ✓
//             </div>
//             <div>
//               <p className="font-medium">Completed "HTML Fundamentals"</p>
//               <p className="text-sm text-gray-500">2 hours ago</p>
//             </div>
//           </div>
//           <div className="flex items-center">
//             <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4">
//               ▶
//             </div>
//             <div>
//               <p className="font-medium">Started "CSS Flexbox" lesson</p>
//               <p className="text-sm text-gray-500">Yesterday</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//     </ProtectedRoute>
//   );
// }