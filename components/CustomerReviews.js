'use client';

import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';

export default function CustomerReviews() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedReview, setExpandedReview] = useState(null);

  const reviews = [
    {
      id: 1,
      name: 'রিয়াদ হোসেন',
      role: 'রোবোটিক্স ইঞ্জিনিয়ার, ট্রান্সকম',
      rating: 5,
      date: '২ সপ্তাহ আগে',
      content: 'আমি প্রোগ্রামিং বা ইলেকট্রনিক্সের কোনো ব্যাকগ্রাউন্ড ছাড়াই কোর্সে জয়েন করি। প্রথমদিকে একটু কঠিন মনে হলেও মেন্টরদের সাপোর্ট অসাধারণ ছিল। এখন একটি মোবাইল রোবট প্রজেক্ট করছি যেটা সম্পূর্ণ নিজে বানিয়েছি। সত্যিই জীবন বদলে দেওয়া অভিজ্ঞতা।',
      avatarColor: 'from-blue-500 to-cyan-500',
      verified: true,
      helpful: 42,
      project: 'অটোনোমাস ড্রোন'
    },
    {
      id: 2,
      name: 'আয়েশা সিদ্দিকা',
      role: 'সফটওয়্যার ডেভেলপার',
      rating: 5,
      date: '১ মাস আগে',
      content: 'কোর্সের স্ট্রাকচার এবং প্র্যাকটিকাল ফোকাস আমাকে সবচেয়ে বেশি ইম্প্রেস করেছে। প্রতিটি মডিউল শেষে একটি প্রজেক্ট করতে হয় যা রিয়েল-ওয়ার্ল্ড স্কিল ডেভেলপ করতে সাহায্য করে। ৩ মাস পরেই প্রথম ইন্টার্নশিপ পেয়ে গেছি!',
      avatarColor: 'from-purple-500 to-pink-500',
      verified: true,
      helpful: 38,
      project: 'রোবোটিক আর্ম'
    },
    {
      id: 3,
      name: 'সজল চন্দ্র',
      role: 'ইলেকট্রিকাল ইঞ্জিনিয়ার',
      rating: 4,
      date: '২ মাস আগে',
      content: 'প্রজেক্ট-বেজড লার্নিং সিস্টেম দারুণ কাজ করে। কোর্সের সবচেয়ে ভালো অংশ হল কমিউনিটি সাপোর্ট। যেকোনো সমস্যায় ২৪ ঘন্টার মধ্যে সলিউশন পেয়ে যাই। কেবল একটি বিষয় - আরও কিছু এডভান্সড কনটেন্ট যোগ করা যেতে পারে।',
      avatarColor: 'from-green-500 to-emerald-500',
      verified: true,
      helpful: 25,
      project: 'স্মার্ট হোম সিস্টেম'
    },
    {
      id: 4,
      name: 'তাসনিমা ইসলাম',
      role: 'শিক্ষার্থী, বুয়েট',
      rating: 5,
      date: '৩ সপ্তাহ আগে',
      content: 'ল্যাব কিট পেয়ে খুবই খুশি। বাড়িতে বসেই রিয়েল হ্যান্ডস-অন এক্সপেরিয়েন্স পেয়েছি। মেন্টররা প্রতিটি ধাপে গাইড করেছে। রোবোকন বাংলাদেশ কম্পিটিশনে আমাদের টিম ২য় স্থান অধিকার করেছে!',
      avatarColor: 'from-orange-500 to-red-500',
      verified: true,
      helpful: 56,
      project: 'লাইন ফলোয়ার রোবট'
    },
    {
      id: 5,
      name: 'জুবায়ের আহমেদ',
      role: 'মেকানিকাল ইঞ্জিনিয়ার',
      rating: 4,
      date: '১ সপ্তাহ আগে',
      content: 'কোর্স কনটেন্ট খুব ভালো, তবে কখনো কখনো লাইভ সেশনের সময়টা আরও ফ্লেক্সিবল হলে ভালো হত। যাইহোক, রেকর্ডেড লেকচার এবং প্রজেক্ট গাইডলাইন এক্সিলেন্ট।',
      avatarColor: 'from-yellow-500 to-amber-500',
      verified: false,
      helpful: 12,
      project: 'অটোমেটেড রোবট'
    },
    {
      id: 6,
      name: 'নুসরাত জাহান',
      role: 'AI রিসার্চার',
      rating: 5,
      date: '২ মাস আগে',
      content: 'AI এবং রোবোটিক্সের ইন্টিগ্রেশন যেভাবে শেখানো হয়েছে তা অসাধারণ। বিশেষ করে কম্পিউটার ভিশন এবং রিয়েল-টাইম ডিসিশন মেকিং অংশগুলো খুবই প্র্যাকটিকাল। এখন আমি আমার নিজের স্টার্টআপ শুরু করছি।',
      avatarColor: 'from-indigo-500 to-purple-500',
      verified: true,
      helpful: 67,
      project: 'AI-পাওয়ারড রোবট'
    }
  ];

  const filteredReviews = activeFilter === 'all' 
    ? reviews 
    : activeFilter === 'verified' 
    ? reviews.filter(r => r.verified)
    : reviews.filter(r => r.rating === 5);

  const averageRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;
  const ratingDistribution = [5,4,3,2,1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percentage: (reviews.filter(r => r.rating === star).length / reviews.length) * 100
  }));

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            শিক্ষার্থীদের মূল্যায়ন
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            আমাদের ১৮০০+ শিক্ষার্থীদের মধ্যে ৪.৮/৫ ⭐ রেটিং। দেখুন তাদের অভিজ্ঞতা।
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 左侧 - 评分概览 */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200 shadow-sm sticky top-8">
              {/* 平均评分 */}
              <div className="text-center mb-8">
                <div className="text-5xl font-bold text-gray-900 mb-2">{averageRating.toFixed(1)}</div>
                <div className="flex justify-center mb-3">
                  {[1,2,3,4,5].map((star) => (
                    <StarIcon 
                      key={star}
                      className={`w-6 h-6 ${star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="text-gray-600">
                  {reviews.length} টি রিভিউ ভিত্তিক
                </p>
              </div>

              {/* 评分分布 */}
              <div className="space-y-3 mb-8">
                {ratingDistribution.map((dist) => (
                  <div key={dist.star} className="flex items-center">
                    <div className="flex items-center w-16">
                      <span className="text-gray-700 w-4">{dist.star}</span>
                      <StarIcon className="w-4 h-4 text-yellow-400 ml-1" />
                    </div>
                    <div className="flex-1 mx-3">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-400 rounded-full"
                          style={{ width: `${dist.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-10 text-right text-gray-600 text-sm">
                      {dist.count}
                    </div>
                  </div>
                ))}
              </div>

              {/* 过滤器 */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 mb-3">ফিল্টার করুন:</h4>
                {[
                  { id: 'all', label: 'সব রিভিউ', count: reviews.length },
                  { id: 'verified', label: 'ভেরিফায়েড শিক্ষার্থী', count: reviews.filter(r => r.verified).length },
                  { id: '5star', label: '৫ স্টার রিভিউ', count: reviews.filter(r => r.rating === 5).length }
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`w-full flex justify-between items-center px-4 py-3 rounded-lg transition-all ${
                      activeFilter === filter.id 
                        ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span>{filter.label}</span>
                    <span className="bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded-full">
                      {filter.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* 写评价按钮 */}
              <button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-300">
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  আপনার রিভিউ লিখুন
                </span>
              </button>
            </div>
          </div>

          {/* 右侧 - 评价列表 */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {filteredReviews.map((review) => (
                <div 
                  key={review.id} 
                  className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-blue-200 transition-all duration-300 hover:shadow-md"
                >
                  {/* 评价头部 */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                    <div className="flex items-center gap-4 mb-3 sm:mb-0">
                      {/* 头像 */}
                      <div className={`w-12 h-12 bg-gradient-to-r ${review.avatarColor} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                        {review.name.charAt(0)}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900">{review.name}</h4>
                          {review.verified && (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                              </svg>
                              ভেরিফায়েড
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{review.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* 评分 */}
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map((star) => (
                          <StarIcon 
                            key={star}
                            className={`w-5 h-5 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                  </div>

                  {/* 评价内容 */}
                  <div className="mb-4">
                    <div className={`text-gray-700 ${expandedReview === review.id ? '' : 'line-clamp-3'}`}>
                      {review.content}
                    </div>
                    {review.content.length > 150 && (
                      <button
                        onClick={() => setExpandedReview(expandedReview === review.id ? null : review.id)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
                      >
                        {expandedReview === review.id ? 'কম দেখান' : 'আরও পড়ুন'}
                      </button>
                    )}
                  </div>

                  {/* 项目标签 */}
                  {review.project && (
                    <div className="mb-4">
                      <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                        </svg>
                        প্রজেক্ট: {review.project}
                      </span>
                    </div>
                  )}

                  {/* 评价底部 */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/>
                      </svg>
                      <span className="text-sm">{review.helpful} জনের জন্য সহায়ক</span>
                    </div>

                    <div className="flex gap-2">
                      <button className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                        </svg>
                      </button>
                      <button className="text-gray-500 hover:text-green-600 p-2 rounded-full hover:bg-green-50 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/>
                        </svg>
                      </button>
                      <button className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 分页 */}
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-2">
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:border-blue-500 hover:text-blue-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                  </svg>
                </button>
                {[1,2,3].map((page) => (
                  <button
                    key={page}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium ${
                      page === 1 
                        ? 'bg-blue-600 text-white' 
                        : 'border border-gray-300 hover:border-blue-500 hover:text-blue-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:border-blue-500 hover:text-blue-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}