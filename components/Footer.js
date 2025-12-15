'use client';

import Link from 'next/link';
import { Facebook, Youtube, Linkedin, Twitter, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'All Courses', href: '/courses' },
    { name: 'About Us', href: '/about' },
  ];

  const courses = [
    { name: 'Web Development', href: '/courses/web-development' },
    { name: 'Graphics Design', href: '/courses/graphics-design' },
    { name: 'Digital Marketing', href: '/courses/digital-marketing' },
    { name: 'Video Editing', href: '/courses/video-editing' },
  ];

  const support = [
    { name: 'Contact Us', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms & Conditions', href: '/terms' },
    { name: 'Refund Policy', href: '/refund' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Column 1 */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">LearningBD</h2>
            <p className="text-sm leading-relaxed mb-3">
              বাংলাদেশের সবচেয়ে জনপ্রিয় অনলাইন লার্নিং প্ল্যাটফর্ম। হাজারো শিক্ষার্থী আমাদের সাথে দক্ষতা বাড়াচ্ছে।
            </p>
            <p className="text-sm">
              The most popular online learning platform in Bangladesh.
            </p>

            <div className="flex space-x-4 mt-6">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-700">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-black">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white transition">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Popular Courses</h3>
            <ul className="space-y-3">
              {courses.map((course) => (
                <li key={course.name}>
                  <Link href={course.href} className="text-sm hover:text-white transition">
                    {course.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Get in Touch</h3>
            <ul className="space-y-3 mb-6">
              {support.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm hover:text-white transition">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4" />
                <span>+880 123 456 789</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <span>support@learningbd.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        {/* <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-sm mb-4">We Accept</p>
          <div className="flex justify-center gap-8 flex-wrap">
            <span className="text-pink-500 font-bold text-xl">bKash</span>
            <span className="text-orange-500 font-bold text-xl">Nagad</span>
            <span className="text-purple-500 font-bold text-xl">Rocket</span>
            <span className="text-blue-500 font-bold text-xl">Visa</span>
            <span className="text-red-600 font-bold text-xl">Mastercard</span>
          </div>
        </div> */}

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          © {year} <span className="text-white font-medium">LearningBD</span>. All rights reserved. 
          Made with love in Bangladesh
        </div>
      </div>
    </footer>
  );
}