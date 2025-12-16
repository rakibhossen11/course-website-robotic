'use client';

import { useState, useEffect } from 'react';

export default function BannerSection() {
  const [enrolledStudents, setEnrolledStudents] = useState(1845);
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 15,
    minutes: 45,
    seconds: 30
  });

  useEffect(() => {
    // 模拟实时更新注册人数
    const interval = setInterval(() => {
      setEnrolledStudents(prev => prev + Math.floor(Math.random() * 3));
    }, 30000);

    // 倒计时
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const { days, hours, minutes, seconds } = prev;
        
        if (seconds > 0) return { ...prev, seconds: seconds - 1 };
        else if (minutes > 0) return { ...prev, minutes: minutes - 1, seconds: 59 };
        else if (hours > 0) return { ...prev, hours: hours - 1, minutes: 59, seconds: 59 };
        else if (days > 0) return { days: days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, []);

  return (
    <section className="relative bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white">
      {/* 装饰元素 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* 左侧内容 */}
          <div>
            {/* 标签 */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold">এখনই এনরোল করুন</span>
              <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded-full font-bold">
                HOT
              </span>
            </div>

            {/* 主标题 */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="block text-blue-300">Advanced</span>
              <span className="block bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Robotics & AI Course
              </span>
              <span className="block text-xl md:text-2xl mt-4 text-gray-200">
                শূন্য থেকে মাস্টার করুন রোবোটিক্স ও AI
              </span>
            </h1>

            {/* 描述 */}
            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
              ৬ মাসের কম্প্রিহেন্সিভ বুটক্যাম্প। শিখুন রিয়েল-ওয়ার্ল্ড প্রজেক্টের মাধ্যমে।
              পেয়ে যান রোবোটিক্স কিট, সার্টিফিকেট ও ১০০% জব প্লেসমেন্ট সাপোর্ট।
            </p>

            {/* 关键信息 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm">
                <div className="text-2xl font-bold text-cyan-300">৬ মাস</div>
                <div className="text-sm text-gray-300">কোর্স ডিউরেশন</div>
              </div>
              <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm">
                <div className="text-2xl font-bold text-purple-300">১০+</div>
                <div className="text-sm text-gray-300">প্র্যাকটিকাল প্রজেক্ট</div>
              </div>
              <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm">
                <div className="text-2xl font-bold text-green-300">২৪/৭</div>
                <div className="text-sm text-gray-300">সাপোর্ট</div>
              </div>
              <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm">
                <div className="text-2xl font-bold text-yellow-300">৯৪%</div>
                <div className="text-sm text-gray-300">সাকসেস রেট</div>
              </div>
            </div>

            {/* 注册按钮 */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group relative bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                  এখনই এনরোল করুন
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
              
              <button className="group bg-transparent border-2 border-white/30 hover:border-white/50 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 backdrop-blur-sm hover:bg-white/10">
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  ক্লাস ডেমো দেখুন
                </span>
              </button>
            </div>
          </div>

          {/* 右侧卡片 */}
          <div className="relative">
            <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
              {/* 倒计时 */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-6 bg-red-500 rounded-full"></div>
                  <h3 className="text-xl font-bold text-white">অফার শেষ হতে বাকি</h3>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {Object.entries(timeLeft).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="bg-gray-800/50 rounded-lg py-3">
                        <div className="text-3xl font-bold text-white mb-1">
                          {value.toString().padStart(2, '0')}
                        </div>
                        <div className="text-sm text-gray-400 capitalize">
                          {key === 'days' ? 'দিন' : 
                           key === 'hours' ? 'ঘণ্টা' : 
                           key === 'minutes' ? 'মিনিট' : 'সেকেন্ড'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 价格信息 */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-white">৳ ১২,৯৯৯</span>
                  <span className="text-lg text-gray-400 line-through">৳ ২৪,৯৯৯</span>
                  <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                    ৪৮% ছাড়
                  </span>
                </div>
                <p className="text-gray-400 text-sm">মাসিক ৳ ২,১৬৬ করে (৬ মাস)</p>
              </div>

              {/* 学生人数 */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex -space-x-2">
                    {[1,2,3,4,5].map((i) => (
                      <div key={i} className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full border-2 border-gray-900"></div>
                    ))}
                  </div>
                  <div>
                    <div className="text-white font-semibold">
                      {enrolledStudents.toLocaleString()}+ শিক্ষার্থী এনরোল করেছে
                    </div>
                    <div className="text-gray-400 text-sm">শেষ ২৪ ঘন্টায় ১২৪ জন</div>
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (enrolledStudents / 2000) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* 特色列表 */}
              <div className="space-y-3">
                {[
                  'রোবোটিক্স স্টার্টার কিট ফ্রি',
                  'লাইফটাইম এক্সেস',
                  'সার্টিফিকেট অব কমপ্লিশন',
                  'জব প্লেসমেন্ট গ্যারান্টি',
                  '২৪/৭ মেন্টর সাপোর্ট'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              {/* 支付选项 */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <p className="text-gray-400 text-sm mb-3">সাপোর্টেড পেমেন্ট মেথড</p>
                <div className="flex gap-2">
                  {['bKash', 'Nagad', 'Rocket', 'Visa', 'MasterCard'].map((method) => (
                    <div key={method} className="bg-gray-800/50 px-3 py-1.5 rounded-lg text-sm">
                      {method}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 装饰性浮动元素 */}
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold px-4 py-2 rounded-lg rotate-3 shadow-lg animate-bounce">
              সবচেয়ে জনপ্রিয়! 🚀
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}