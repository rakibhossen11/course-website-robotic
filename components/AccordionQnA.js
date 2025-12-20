'use client';

import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiMessageSquare, FiHelpCircle, FiBookOpen, FiCheckCircle, FiStar } from 'react-icons/fi';

export default function EnhancedAccordionQnA({ 
  items = accordionFAQ,
  title = "শিক্ষার্থীদের সব কনফিউশনের সলিউশন!",
  subtitle = "প্রতিটি প্রশ্নের উত্তর রয়েছে আপনার সুবিধার জন্য"
}) {
  const [openIndex, setOpenIndex] = useState(0); // Single open system

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Color palette for different items
  const colorSchemes = [
    { bg: 'bg-gradient-to-r from-blue-50 to-indigo-50', border: 'border-blue-200', icon: 'text-blue-600', badge: 'bg-blue-100 text-blue-800' },
    { bg: 'bg-gradient-to-r from-green-50 to-emerald-50', border: 'border-green-200', icon: 'text-green-600', badge: 'bg-green-100 text-green-800' },
    { bg: 'bg-gradient-to-r from-purple-50 to-violet-50', border: 'border-purple-200', icon: 'text-purple-600', badge: 'bg-purple-100 text-purple-800' },
    { bg: 'bg-gradient-to-r from-amber-50 to-orange-50', border: 'border-amber-200', icon: 'text-amber-600', badge: 'bg-amber-100 text-amber-800' },
    { bg: 'bg-gradient-to-r from-pink-50 to-rose-50', border: 'border-pink-200', icon: 'text-pink-600', badge: 'bg-pink-100 text-pink-800' },
    { bg: 'bg-gradient-to-r from-cyan-50 to-teal-50', border: 'border-cyan-200', icon: 'text-cyan-600', badge: 'bg-cyan-100 text-cyan-800' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header with gradient background */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
          <FiHelpCircle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        
        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <FiCheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{items.length}+</p>
              <p className="text-sm text-gray-500">প্রশ্নের সমাধান</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <FiMessageSquare className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">২৪/৭</p>
              <p className="text-sm text-gray-500">সাপোর্ট</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <FiStar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">১০০%</p>
              <p className="text-sm text-gray-500">সন্তুষ্টি</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Items Container with Background */}
      <div className="relative">
        {/* Decorative Background Elements */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-100 rounded-full opacity-20 blur-3xl"></div>
        
        {/* FAQ Items */}
        <div className="relative space-y-4">
          {items.map((item, index) => {
            const colors = colorSchemes[index % colorSchemes.length];
            const isOpen = openIndex === index;
            
            return (
              <div
                key={index}
                className={`rounded-2xl overflow-hidden transition-all duration-300 transform ${
                  isOpen 
                    ? `${colors.bg} ${colors.border} border-2 shadow-xl scale-[1.02]` 
                    : 'bg-white border border-gray-200 shadow-md hover:shadow-lg'
                }`}
              >
                {/* Question Header */}
                <button
                  onClick={() => toggleItem(index)}
                  className={`w-full px-6 py-5 text-left flex justify-between items-center transition-all duration-300 ${
                    isOpen ? 'rounded-t-2xl' : 'rounded-2xl'
                  }`}
                >
                  <div className="flex items-start gap-4 flex-1">
                    {/* Number Badge */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      isOpen ? 'bg-white shadow-sm' : 'bg-white shadow'
                    }`}>
                      <span className={`font-bold text-lg ${isOpen ? colors.icon : 'text-gray-600'}`}>
                        {index + 1}
                      </span>
                    </div>
                    
                    {/* Question Text */}
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className={`text-lg font-semibold ${
                          isOpen ? 'text-gray-900' : 'text-gray-800'
                        }`}>
                          {item.question}
                        </h3>
                        {item.category && (
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${colors.badge}`}>
                            {item.category}
                          </span>
                        )}
                      </div>
                      
                      {/* Progress Indicator */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full transition-all duration-500 ${
                              isOpen ? 'w-full bg-gradient-to-r from-blue-500 to-indigo-500' : 'w-0'
                            }`}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Arrow Icon */}
                  <div className={`ml-4 transition-all duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}>
                    {isOpen ? (
                      <FiChevronUp className={`w-6 h-6 ${colors.icon}`} />
                    ) : (
                      <FiChevronDown className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Answer Content */}
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    isOpen 
                      ? 'max-h-[800px] opacity-100' 
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-6 pt-2">
                    <div className="pl-14">
                      {/* Answer with Beautiful Typography */}
                      <div className="relative">
                        {/* Decorative Line */}
                        <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-300 to-indigo-300 rounded-full"></div>
                        
                        <div className="space-y-4">
                          <p className="text-gray-700 leading-relaxed text-lg">
                            {item.answer}
                          </p>
                          
                          {/* Steps if available */}
                          {item.steps && item.steps.length > 0 && (
                            <div className="mt-6">
                              <div className="flex items-center gap-2 mb-4">
                                <FiBookOpen className="w-5 h-5 text-blue-600" />
                                <h4 className="font-semibold text-gray-900">ধাপগুলো অনুসরণ করুন:</h4>
                              </div>
                              <ol className="space-y-3 ml-6">
                                {item.steps.map((step, idx) => (
                                  <li key={idx} className="flex items-start gap-3">
                                    <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${colors.badge}`}>
                                      {idx + 1}
                                    </span>
                                    <p className="text-gray-700 pt-0.5">{step}</p>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          )}
                          
                          {/* Note Section */}
                          {item.note && (
                            <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl">
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                                  <span className="text-amber-600 font-bold">!</span>
                                </div>
                                <div>
                                  <p className="font-semibold text-amber-900 mb-1">গুরুত্বপূর্ণ নোট:</p>
                                  <p className="text-amber-800">{item.note}</p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Additional Info */}
                          {item.additionalInfo && (
                            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-blue-600 font-bold">💡</span>
                                </div>
                                <div>
                                  <p className="font-semibold text-blue-900 mb-1">অতিরিক্ত তথ্য:</p>
                                  <p className="text-blue-800">{item.additionalInfo}</p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Tags if available */}
                          {item.tags && item.tags.length > 0 && (
                            <div className="mt-6 pt-4 border-t border-gray-100">
                              <p className="text-sm font-medium text-gray-700 mb-2">রিলেটেড টপিকস:</p>
                              <div className="flex flex-wrap gap-2">
                                {item.tags.map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm hover:border-blue-300 hover:text-blue-700 transition-colors"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-12 text-center">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            আরো প্রশ্ন আছে?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            আমরা সবসময় আপনার পাশে আছি। যেকোনো প্রশ্নের জন্য আমাদের সাথে যোগাযোগ করুন
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/contact"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
            >
              যোগাযোগ করুন
            </a>
            <a
              href="/courses"
              className="px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
            >
              কোর্স দেখুন
            </a>
          </div>
        </div>
        
        {/* Floating Help */}
        <div className="fixed bottom-6 right-6 z-10">
          <button className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110">
            <FiMessageSquare className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

const accordionFAQ = [
  {
    question: "আগে থেকে কিছু জানা থাকতে হবে?",
    answer: "না। একদম শূন্য থেকে শুরু করে ধাপে ধাপে শেখানো হয়। আপনি সাইন্স, আর্টস, কমার্স নাকি মাদ্রাসা ব্যাকগ্রাউন্ড এর কিছুই ম্যাটার করে না। লেগে থাকার ইচ্ছাটা থাকতে হবে প্রবল!",
    category: "শুরু করার আগে",
    note: "কোনো প্রকার কোডিং বা প্রোগ্রামিং এক্সপেরিয়েন্সের প্রয়োজন নেই।",
    tags: ["শূন্য থেকে", "সকল ব্যাকগ্রাউন্ড", "মৌলিক জ্ঞান"]
  },
  {
    question: "ক্লাস কবে শুরু হবে? লাইভ নাকি রেকর্ডেড?",
    answer: "এই কোর্সটি পুরোপুরি Pre-Recorded। ভর্তি হওয়ার পর আপনি সঙ্গে সঙ্গেই শুরু করতে পারবেন। একবার ভর্তি হলে লাইফটাইম এক্সেস পাবেন। আপনি যে কোনো সময় যে কোনো ডিভাইস থেকে ভিডিও দেখতে পারবেন এবং প্র্যাকটিস করতে পারবেন।",
    category: "কোর্স ফরমেট",
    steps: [
      "কোর্সে ভর্তি হোন",
      "লগইন করে কন্টেন্ট এক্সেস করুন",
      "আপনার সুবিধামত সময়ে শিখুন",
      "লাইফটাইম এক্সেস উপভোগ করুন"
    ],
    tags: ["রেকর্ডেড", "লাইফটাইম", "সুবিধাজনক সময়"]
  },
  {
    question: "ইংরেজি কতটুকু জানা দরকার?",
    answer: "খুব বেশি ইংরেজি জানার প্রয়োজন নেই। আমাদের সব লেকচার বাংলায় রেকর্ড করা। শুধুমাত্র প্রোগ্রামিং এর কিছু বেসিক টার্ম এর সাথে পরিচিতি থাকলে ভালো। আমরা প্রতিটি টার্ম বাংলায় বুঝিয়ে শেখাই।",
    category: "প্রয়োজনীয় যোগ্যতা",
    additionalInfo: "কোর্স চলাকালীন আমরা একটি প্রোগ্রামিং ডিকশনারিও শেয়ার করবো যা আপনাকে সাহায্য করবে।",
    tags: ["বাংলা মিডিয়াম", "ইংরেজি টার্ম", "বাংলায় ব্যাখ্যা"]
  },
  {
    question: "সমস্যার সমাধান কোথায় পাবো?",
    answer: "Learn Android with Jubayer ফেসবুক গ্রুপে Student ID সহ পোস্ট করুন। কোর্স Enroll করার পরে আপনাকে একটা Student আইডি দেওয়া হবে। সাইটে লগিন করে MY PROFILE এ গেলে আইডি দেখতে পাবেন। আমি এবং আমার Assistant Trainers সবাই মিলে ২৪/৭ সাপোর্ট করছি।",
    category: "সাপোর্ট সিস্টেম",
    steps: [
      "কোর্সে ভর্তি হোন",
      "Student ID পান",
      "ফেসবুক গ্রুপে জয়েন করুন",
      "Student ID দিয়ে সমস্যা পোস্ট করুন",
      "২৪ ঘন্টার মধ্যে সমাধান পান"
    ],
    note: "এই সাপোর্ট পেতে অবশ্যই আপনাকে আমাদের কোর্সের Student হতে হবে।",
    tags: ["ফেসবুক গ্রুপ", "২৪/৭ সাপোর্ট", "Student ID"]
  },
  {
    question: "কোর্স করে আয় করা যাবে?",
    answer: "অবশ্যই! ক্যারিয়ার গড়ার জন্যই তো এতো আয়োজন। আমাদের অনেক Students ইতোমধ্যেই কাজ শিখে মাসে 1,000-5,000$ ইনকাম করছে। আপনিও পারবেন ইনশাআল্লাহ। তবে মন দিয়ে আগে কাজটা শিখতে হবে।",
    category: "ক্যারিয়ার গাইডেন্স",
    steps: [
      "কোর্স সম্পন্ন করুন",
      "প্র্যাকটিস প্রোজেক্ট তৈরি করুন",
      "পোর্টফোলিও ডেভেলপ করুন",
      "ফ্রিল্যান্সিং মার্কেটপ্লেসে প্রোফাইল তৈরি করুন",
      "ক্লায়েন্ট খুঁজুন এবং ইনকাম শুরু করুন"
    ],
    additionalInfo: "আমরা ইনকামের বিভিন্ন উপায় শিখাই এবং ক্যারিয়ার গাইডেন্স দিয়ে থাকি।",
    tags: ["ফ্রিল্যান্সিং", "রিমোট জব", "প্রোজেক্ট ইনকাম"]
  },
  {
    question: "কোর্সে কী কী শেখানো হয়?",
    answer: "ডিজাইন, Backend, সার্ভার, API, ইনকাম পদ্ধতি — সবকিছু এক কোর্সেই। আপনাকে একজন Full Stack Developer হিসাবে তৈরি করা হবে যাতে আপনি ফ্রিল্যান্সিং, উদ্যোক্তা কিংবা নিজের তৈরি অ্যাপ প্রকাশের মাধ্যমে আয়ের রাস্তা বের করতে পারেন।",
    category: "কোর্স কারিকুলাম",
    steps: [
      "মৌলিক প্রোগ্রামিং কনসেপ্ট",
      "UI/UX ডিজাইন বেসিক",
      "Backend Development",
      "API ইন্টিগ্রেশন",
      "ডাটাবেজ ম্যানেজমেন্ট",
      "ডেপ্লয়মেন্ট এবং হোস্টিং",
      "ফ্রিল্যান্সিং এবং ইনকাম"
    ],
    note: "প্রতিটি টপিক হাতে কলমে প্র্যাকটিস করানো হয় রিয়েল প্রোজেক্টের মাধ্যমে।",
    tags: ["ফুল স্ট্যাক", "প্রোজেক্ট বেজড", "ইন্ডাস্ট্রি রেডি"]
  },
  {
    question: "কতদিনে কোর্স শেষ করা যাবে?",
    answer: "কোর্স সম্পূর্ণ করতে সাধারনত ৩-৬ মাস সময় লাগে, তবে এটি সম্পূর্ণ নির্ভর করে আপনার লেগে থাকার উপরে। আপনি যদি দিনে ২-৩ ঘন্টা সময় দেন, তাহলে ৩ মাসের মধ্যে কোর্স সম্পন্ন করতে পারবেন।",
    category: "সময়কাল",
    additionalInfo: "কোর্স লাইফটাইম এক্সেসের হওয়ায় আপনি যেকোনো সময় শিখতে পারবেন। কোনো ধরনের সময়সীমা নেই।",
    tags: ["ফ্লেক্সিবল", "স্ব-গতিশীল", "লাইফটাইম"]
  },
  {
    question: "এনরোল করার প্রক্রিয়া কী?",
    answer: "এনরোল করার প্রক্রিয়া খুবই সহজ। নিচের ধাপগুলো অনুসরণ করুন:",
    category: "এনরোলমেন্ট",
    steps: [
      "আমাদের ওয়েবসাইটে যান",
      "পছন্দের কোর্স সিলেক্ট করুন",
      "পেমেন্ট সম্পন্ন করুন",
      "অটোমেটিক লগইন ক্রিডেনশিয়াল পাবেন",
      "কোর্স কন্টেন্ট এক্সেস শুরু করুন"
    ],
    note: "পেমেন্ট সম্পন্ন হওয়ার পর ৫-১০ মিনিটের মধ্যে আপনার অ্যাকাউন্ট এক্টিভ হয়ে যাবে।",
    tags: ["অনলাইন পেমেন্ট", "অটোমেটিক এক্টিভেশন", "তাৎক্ষণিক এক্সেস"]
  }
];