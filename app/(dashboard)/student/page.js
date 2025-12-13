import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Link from 'next/link';

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  // Mock enrolled courses
  const enrolledCourses = [
    {
      id: 1,
      title: "React Masterclass",
      description: "Learn React from scratch to advanced level",
      instructor: "John Doe",
      progress: 65,
    },
    {
      id: 2,
      title: "JavaScript Fundamentals",
      description: "Master the basics of JavaScript programming",
      instructor: "Jane Smith",
      progress: 30,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome back, {session.user?.name}!</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Enrolled Courses */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6">My Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Instructor: {course.instructor}
                  </span>
                  <Link
                    href={`/courses/${course.id}/learn`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                  >
                    Continue Learning
                  </Link>
                </div>
              </div>
            ))}
            
            {enrolledCourses.length === 0 && (
              <div className="col-span-2 text-center py-12">
                <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
                <Link
                  href="/courses"
                  className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
                >
                  Browse Courses
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="font-bold text-lg mb-4">Learning Statistics</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600">Courses Enrolled</p>
                <p className="text-2xl font-bold">{enrolledCourses.length}</p>
              </div>
              <div>
                <p className="text-gray-600">Hours Watched</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <div>
                <p className="text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold">75%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold text-lg mb-4">Continue Learning</h3>
            {enrolledCourses.slice(0, 3).map((course) => (
              <div key={course.id} className="mb-4 pb-4 border-b last:border-0">
                <h4 className="font-medium mb-1">{course.title}</h4>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}