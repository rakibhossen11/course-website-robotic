'use client';

import Link from 'next/link';
import { 
  Facebook, 
  Youtube, 
  Linkedin, 
  Twitter, 
  Instagram,
  Phone, 
  Mail, 
  MapPin,
  Heart,
  Shield,
  Award,
  Users,
  Clock,
  ChevronRight,
  MessageSquare,
  Globe,
  Download,
  Sparkles,
  GraduationCap,
  BookOpen,
  TrendingUp,
  CheckCircle
} from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', href: '/', icon: ChevronRight },
    { name: 'All Courses', href: '/courses', icon: ChevronRight },
    { name: 'About Us', href: '/about', icon: ChevronRight },
    { name: 'Instructors', href: '/instructors', icon: ChevronRight },
    { name: 'Success Stories', href: '/success', icon: ChevronRight },
  ];

  const courses = [
    { name: 'Web Development', href: '/courses/web-development', students: '5,234' },
    { name: 'Graphics Design', href: '/courses/graphics-design', students: '3,890' },
    { name: 'Digital Marketing', href: '/courses/digital-marketing', students: '4,567' },
    { name: 'Video Editing', href: '/courses/video-editing', students: '2,345' },
    { name: 'App Development', href: '/courses/app-development', students: '3,120' },
  ];

  const support = [
    { name: 'Help Center', href: '/help', icon: MessageSquare },
    { name: 'Contact Us', href: '/contact', icon: Phone },
    { name: 'Privacy Policy', href: '/privacy', icon: Shield },
    { name: 'Terms & Conditions', href: '/terms', icon: BookOpen },
    { name: 'Refund Policy', href: '/refund', icon: Clock },
  ];

  const stats = [
    { label: 'Active Students', value: '50,000+', icon: Users },
    { label: 'Courses', value: '200+', icon: GraduationCap },
    { label: 'Success Rate', value: '98%', icon: TrendingUp },
    { label: 'Countries', value: '120+', icon: Globe },
  ];

  return (
    <>
      {/* CTA Section Above Footer */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold mb-2">Ready to Start Learning?</h3>
              <p className="text-blue-100">Join thousands of students building their skills with us</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/courses" 
                className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                Browse Courses
              </Link>
              <Link 
                href="/signup" 
                className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <footer className="bg-gray-900 text-gray-300">
        {/* Newsletter Section */}
        <div className="bg-gray-800/50 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Stay Updated</h3>
                  <p className="text-gray-400">Get course updates, tips, and resources</p>
                </div>
              </div>
              
              <div className="w-full md:w-auto">
                <form className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Left Column - Brand Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    LearningBD
                  </h2>
                  <p className="text-sm text-gray-400">Learn. Grow. Succeed</p>
                </div>
              </div>

              <p className="text-gray-400 leading-relaxed">
                বাংলাদেশের সবচেয়ে জনপ্রিয় অনলাইন লার্নিং প্ল্যাটফর্ম। হাজারো শিক্ষার্থী আমাদের সাথে দক্ষতা বাড়াচ্ছে এবং ক্যারিয়ার গড়ছে। The most trusted online learning platform in Bangladesh.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <stat.icon className="w-5 h-5 text-blue-400" />
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                    </div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Social Media */}
              <div className="pt-6">
                <p className="text-sm text-gray-400 mb-4">Follow us on social media</p>
                <div className="flex gap-3">
                  {[
                    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:bg-blue-600' },
                    { icon: Youtube, href: '#', label: 'YouTube', color: 'hover:bg-red-600' },
                    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:bg-pink-600' },
                    { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:bg-blue-700' },
                    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:bg-black' },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center transition-all duration-300 ${social.color} hover:scale-110 hover:shadow-lg`}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Columns - Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <ChevronRight className="w-5 h-5 text-blue-400" />
                  Quick Links
                </h3>
                <ul className="space-y-3">
                  {quickLinks.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href} 
                        className="flex items-center gap-2 text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 group"
                      >
                        <link.icon className="w-4 h-4 group-hover:text-blue-400" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Popular Courses */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-400" />
                  Top Courses
                </h3>
                <ul className="space-y-4">
                  {courses.map((course) => (
                    <li key={course.name}>
                      <Link 
                        href={course.href} 
                        className="block hover:text-white transition-colors group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="group-hover:text-blue-400 transition-colors">
                            {course.name}
                          </span>
                          <span className="text-xs bg-gray-800 px-2 py-1 rounded-full">
                            {course.students} students
                          </span>
                        </div>
                        <div className="w-full h-1 bg-gray-800 mt-2 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                            style={{ width: `${Math.random() * 40 + 60}%` }}
                          />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support & Contact */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  Support
                </h3>
                <ul className="space-y-3 mb-8">
                  {support.map((item) => (
                    <li key={item.name}>
                      <Link 
                        href={item.href} 
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                      >
                        <item.icon className="w-4 h-4 group-hover:text-blue-400" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="space-y-4 pt-6 border-t border-gray-800">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Call us</div>
                      <a href="tel:+880123456789" className="text-white hover:text-blue-400 transition-colors">
                        +880 123 456 789
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Email us</div>
                      <a href="mailto:support@learningbd.com" className="text-white hover:text-blue-400 transition-colors">
                        support@learningbd.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Location</div>
                      <div className="text-white">Dhaka, Bangladesh</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* App Download */}
          <div className="bg-gray-800/50 rounded-2xl p-6 mb-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Download className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Get Our Mobile App</h3>
                  <p className="text-gray-400">Learn on the go with our mobile application</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors flex items-center gap-2">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  App Store
                </button>
                <button className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors flex items-center gap-2">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.25-.84-.77-.84-1.35z"/>
                  </svg>
                  Play Store
                </button>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="py-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-sm text-gray-400 mb-3">We Accept</p>
                <div className="flex flex-wrap gap-4">
                  {[
                    { name: 'bKash', color: 'text-pink-500' },
                    { name: 'Nagad', color: 'text-orange-500' },
                    { name: 'Rocket', color: 'text-purple-500' },
                    { name: 'Visa', color: 'text-blue-500' },
                    { name: 'Mastercard', color: 'text-red-500' },
                    { name: 'Amex', color: 'text-green-500' },
                  ].map((method, index) => (
                    <div key={index} className={`${method.color} font-bold text-lg flex items-center gap-2`}>
                      <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                        {method.name.charAt(0)}
                      </div>
                      {method.name}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-400">Certified by</div>
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-400">
                © {year} <span className="text-white font-medium">LearningBD</span>. All rights reserved.
              </div>
              <div className="flex items-center gap-6 text-sm">
                <Link href="/sitemap" className="text-gray-400 hover:text-white transition-colors">
                  Sitemap
                </Link>
                <Link href="/accessibility" className="text-gray-400 hover:text-white transition-colors">
                  Accessibility
                </Link>
                <Link href="/careers" className="text-gray-400 hover:text-white transition-colors">
                  Careers
                </Link>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </div>
            </div>
            <div className="mt-4 text-center text-xs text-gray-500 flex items-center justify-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> in Bangladesh
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}