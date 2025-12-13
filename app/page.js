import Link from 'next/link';
import Image from 'next/image';
import YouTubePlayer from '@/components/YouTubePlayer';

export default function HomePage() {
  const testimonials = [
    {
      id: 1,
      name: "Kamrul Islam",
      role: "Freelancer",
      review: "IMPRESSIVE! প্রথম দিকে একটু এভারেজ লাগছিলো। তবে শেষ করার পর নিজের ভেতর একটা দারুণ রকম পারিবর্তন লক্ষ্য করা যাচ্ছে।",
      rating: 5
    },
    {
      id: 2,
      name: "Najia Ahmed",
      role: "Entrepreneur, Premium Buy",
      review: "Helpful Instructor অসাধারণ একটা কোর্স। থিম ইন্সটল থেকে শুরু করে, ই-কমার্স অপশন, পেমেন্ট গেটওয়ে সহ আলহামদুলিল্লাহ ওয়েবসাইটের সব কাজ নিজেই করেছি।",
      rating: 5
    },
    {
      id: 3,
      name: "Mehedi Hasan Shohag",
      role: "STUDENT",
      review: "Excellent Course ধন্যবাদ সাব্বির ভাইয়া আপনি যে ভাবে ডিজিটাল মার্কেটিং এর হাতেখড়ি কোর্স করিয়েছেন আমার মনে হবে না যে অন্য কেউ এভাবে শিখাবে।",
      rating: 5
    }
  ];

  const stats = [
    { number: "50,000+", label: "আস্থা রাখছেন লার্নার" },
    { number: "4,500+", label: "পজিটিভ রিভিউ" },
    { number: "100+", label: "কোর্স সার্টিফিকেট" },
    { number: "24/7", label: "লাইভ সাপোর্ট" }
  ];

  const featuredCourses = [
    {
      id: 1,
      title: "Web Development Full Course",
      description: "Learn full stack web development from scratch",
      category: "Development",
      duration: "45 hours",
      students: 12000,
      price: 2999,
      discountedPrice: 1999,
      instructor: "Sabbir Ahmed"
    },
    {
      id: 2,
      title: "Digital Marketing Pro",
      description: "Master digital marketing strategies",
      category: "Marketing",
      duration: "30 hours",
      students: 8500,
      price: 2499,
      discountedPrice: 1799,
      instructor: "Rahim Khan"
    },
    {
      id: 3,
      title: "Graphics Design Mastery",
      description: "Professional graphics design course",
      category: "Design",
      duration: "40 hours",
      students: 6500,
      price: 2799,
      discountedPrice: 1899,
      instructor: "Fatema Begum"
    },
    {
      id: 4,
      title: "Mobile App Development",
      description: "Build iOS & Android apps",
      category: "Development",
      duration: "50 hours",
      students: 9200,
      price: 3499,
      discountedPrice: 2499,
      instructor: "Arif Hossain"
    }
  ];

  return (
    <div className="font-sans">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            লার্নিং বাংলাদেশ এর সফলতা
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            তোমাদের সাফল্যই আমাদের অনুপ্রেরণা
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              href="/courses"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition duration-300 shadow-lg"
            >
              সকল কোর্স দেখুন
            </Link>
            <Link
              href="/register"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition duration-300"
            >
              ফ্রি রেজিস্টার করুন
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-6">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-700 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            আমাদের বিশেষ সুবিধা
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center">
              <div className="text-blue-500 text-5xl mb-6">📜</div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">কোর্স সার্টিফিকেট ও ব্যাজ</h3>
              <p className="text-gray-600">প্রতিটি কোর্স কমপ্লিট করার পর পাবেন অফিসিয়াল সার্টিফিকেট ও ডিজিটাল ব্যাজ</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center">
              <div className="text-blue-500 text-5xl mb-6">🎥</div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">লাইভ ক্লাস ও সাপোর্ট</h3>
              <p className="text-gray-600">সাপ্তাহিক লাইভ ক্লাস, Q&A সেশন এবং ২৪/৭ সাপোর্ট সিস্টেম</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center">
              <div className="text-blue-500 text-5xl mb-6">📱</div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">মোবাইল অ্যাপ এক্সেস</h3>
              <p className="text-gray-600">যেকোনো ডিভাইস থেকে অ্যাক্সেস করুন, শিখুন নিজের পছন্দের সময়ে</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              ৪৫০০+ পজিটিভ রিভিউ
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              আমাদের শিক্ষা কার্যক্রমে অংশ নিয়ে শত শত শিক্ষার্থী তাদের লক্ষ্য অর্জনে এগিয়ে যাচ্ছে।
              আসুন শুনি, তাদের বাস্তব অভিজ্ঞতা ও সাফল্যের গল্প।
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-lg text-gray-800">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-700 italic">"{testimonial.review}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                জনপ্রিয় কোর্সসমূহ
              </h2>
              <p className="text-gray-600">সবচেয়ে বেশি বিক্রিত এবং রেটেড কোর্সগুলো</p>
            </div>
            <Link
              href="/courses"
              className="text-blue-600 font-semibold hover:text-blue-800"
            >
              সবগুলো দেখুন →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                  <div className="absolute top-4 left-4">
                    <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                      {course.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 text-white">
                    <span className="bg-black bg-opacity-50 px-3 py-1 rounded-lg">
                      ⏱️ {course.duration}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-3 text-gray-800">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                  
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-800">{course.instructor}</p>
                      <p className="text-xs text-gray-500">ইনস্ট্রাক্টর</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-lg font-bold text-blue-600">৳{course.discountedPrice}</span>
                      <span className="ml-2 text-sm text-gray-500 line-through">৳{course.price}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      👨‍🎓 {course.students.toLocaleString()}
                    </div>
                  </div>
                  
                  <Link
                    href={`/courses/${course.id}`}
                    className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
                  >
                    এনরোল করুন
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <YouTubePlayer />

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            আজই শুরু করুন আপনার লার্নিং জার্নি
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            ১০০+ প্রফেশনাল কোর্স, এক্সপার্ট ইনস্ট্রাক্টর এবং প্র্যাকটিকাল প্রজেক্ট
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              href="/courses"
              className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition duration-300"
            >
              কোর্স ব্রাউজ করুন
            </Link>
            <Link
              href="/free-trial"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-600 transition duration-300"
            >
              ৭ দিন ফ্রি ট্রায়াল
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              নিউজলেটার সাবস্ক্রাইব করুন
            </h2>
            <p className="text-gray-600 mb-8">
              নতুন কোর্স, অফার এবং শিক্ষামূলক কনটেন্ট সরাসরি ইমেইলে পেতে সাবস্ক্রাইব করুন
            </p>
            <form className="flex flex-col md:flex-row gap-4">
              <input
                type="email"
                placeholder="আপনার ইমেইল ঠিকানা"
                className="flex-grow px-6 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
              >
                সাবস্ক্রাইব করুন
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}