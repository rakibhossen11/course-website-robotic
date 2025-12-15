'use client';

import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';

// export default async function DashboardPage() {
//   return(
//     <>
//     <h1>DashboardPage</h1>
//     </>
//   );
// }

export default function DashboardPage() {
  const { user } = useAuth();
  console.log(user);

  // Mock enrolled courses
  const enrolledCourses = [
    { id: 1, title: 'Web Development Bootcamp', progress: 65 },
    { id: 2, title: 'JavaScript Mastery', progress: 30 },
    { id: 3, title: 'React for Beginners', progress: 100 },
  ];

  const stats = [
    { label: 'Enrolled Courses', value: enrolledCourses.length },
    { label: 'Hours Watched', value: '24' },
    { label: 'Completion Rate', value: '65%' },
    { label: 'Certificates', value: '2' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.displayName || 'Student'}!</h1>
        <p className="text-blue-100">Continue your learning journey</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
            <div className="text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Enrolled Courses */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Courses</h2>
          <Link href="/courses" className="text-blue-600 hover:text-blue-800">
            Browse more courses →
          </Link>
        </div>

        <div className="space-y-4">
          {enrolledCourses.map((course) => (
            <div key={course.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="font-bold text-lg text-gray-800">{course.title}</h3>
                  <div className="mt-2 w-64">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  {course.progress === 100 ? (
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                      View Certificate
                    </button>
                  ) : (
                    <Link
                      href={`/courses/${course.id}/learn`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      {course.progress === 0 ? 'Start Learning' : 'Continue'}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-4">
              ✓
            </div>
            <div>
              <p className="font-medium">Completed "HTML Fundamentals"</p>
              <p className="text-sm text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4">
              ▶
            </div>
            <div>
              <p className="font-medium">Started "CSS Flexbox" lesson</p>
              <p className="text-sm text-gray-500">Yesterday</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}