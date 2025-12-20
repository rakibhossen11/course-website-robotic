'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import { 
  Bars3Icon, 
  XMarkIcon, 
  MagnifyingGlassIcon, 
  UserCircleIcon, 
  ChevronDownIcon,
  HomeIcon,
  BookOpenIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  AcademicCapIcon,
  UsersIcon,
  PresentationChartLineIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/components/AuthContext';
import Image from 'next/image';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, loading } = useAuth();
  const dropdownRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navigation configuration
  const navigation = {
    public: [
      { name: 'Home', href: '/', icon: HomeIcon },
      { name: 'Courses', href: '/courses', icon: BookOpenIcon },
      { name: 'Pricing', href: '/pricing', icon: ChartBarIcon },
      { name: 'About Us', href: '/about', icon: UsersIcon },
    ],
    user: [
      { name: 'Dashboard', href: '/dashboard', icon: PresentationChartLineIcon },
      { name: 'My Courses', href: '/my-courses', icon: BookOpenIcon },
      { name: 'Progress', href: '/progress', icon: ChartBarIcon },
      { name: 'Assignments', href: '/assignments', icon: AcademicCapIcon },
    ],
    admin: [
      { name: 'Admin Panel', href: '/admin', icon: Cog6ToothIcon },
      { name: 'Manage Courses', href: '/courses', icon: BookOpenIcon },
      { name: 'Users', href: '/users', icon: UsersIcon },
      { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
    ]
  };

  const getNavigationItems = () => {
    if (user) {
      const isAdmin = user.role === 'admin' || user.isAdmin;
      return [
        ...navigation.public,
        ...navigation.user,
        ...(isAdmin ? navigation.admin : [])
      ];
    }
    return navigation.public;
  };

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
  };

  const isAdmin = user && (user.role === 'admin' || user.isAdmin);

  if (loading) {
    return (
      <>
        <nav className="fixed top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg animate-pulse" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  LearningBD
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-8 w-20 bg-gray-200 rounded-md animate-pulse" />
                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
              </div>
            </div>
          </div>
        </nav>
        <div className="h-16" />
      </>
    );
  }

  return (
    <>
      <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg' 
          : 'bg-white border-b border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                  <AcademicCapIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    LearningBD
                  </h1>
                  <p className="text-xs text-gray-500 -mt-1">Learn. Grow. Succeed</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {getNavigationItems().map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
                >
                  <item.icon className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Search Button */}
              <button className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>

              {/* Notifications */}
              {user && (
                <button className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors relative">
                  <BellIcon className="h-5 w-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              )}

              {/* User Profile */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                  >
                    <div className="flex items-center space-x-3">
                      {user.photoURL ? (
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm">
                          <Image
                            src={user.photoURL}
                            alt={user.displayName || 'User'}
                            fill
                            sizes="32px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <UserCircleIcon className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-900">
                          {user.displayName?.split(' ')[0] || 'User'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {isAdmin ? 'Admin' : 'Student'}
                        </p>
                      </div>
                    </div>
                    <ChevronDownIcon className={`h-4 w-4 text-gray-500 transition-transform ${
                      userDropdownOpen ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {/* User Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                      {/* User Info */}
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          {user.photoURL ? (
                            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                              <Image
                                src={user.photoURL}
                                alt={user.displayName || 'User'}
                                width={48}
                                height={48}
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <UserCircleIcon className="w-6 h-6 text-white" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">
                              {user.displayName || 'User'}
                            </p>
                            <p className="text-sm text-gray-600 truncate">{user.email}</p>
                            {isAdmin && (
                              <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full">
                                Admin
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quick Links */}
                      <div className="p-2">
                        {navigation.user.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center space-x-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <item.icon className="w-4 h-4" />
                            <span>{item.name}</span>
                          </Link>
                        ))}
                      </div>

                      {/* Admin Section */}
                      {isAdmin && (
                        <div className="border-t border-gray-100 p-2">
                          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Admin Tools
                          </div>
                          {navigation.admin.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="flex items-center space-x-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              onClick={() => setUserDropdownOpen(false)}
                            >
                              <item.icon className="w-4 h-4" />
                              <span>{item.name}</span>
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Settings & Logout */}
                      <div className="border-t border-gray-100 p-2">
                        <Link
                          href="/profile"
                          className="flex items-center space-x-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <Cog6ToothIcon className="w-4 h-4" />
                          <span>Settings</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <ArrowRightOnRectangleIcon className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/login"
                    className="text-sm font-medium text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2.5 rounded-lg hover:shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md"
                  >
                    Get Started Free
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center space-x-3">
              {user && (
                <button className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors relative">
                  <BellIcon className="h-5 w-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              )}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-white shadow-2xl">
          <div className="flex flex-col h-full">
            {/* Mobile Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-3" onClick={() => setMobileMenuOpen(false)}>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <AcademicCapIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-gray-900">LearningBD</h1>
                    <p className="text-xs text-gray-500">Learn. Grow. Succeed</p>
                  </div>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* User Info */}
            {user && (
              <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                <div className="flex items-center space-x-4">
                  {user.photoURL ? (
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-4 border-white shadow-md">
                      <Image
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        width={56}
                        height={56}
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <UserCircleIcon className="w-8 h-8 text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {user.displayName || 'User'}
                    </p>
                    <p className="text-sm text-gray-600 truncate">{user.email}</p>
                    {isAdmin && (
                      <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Menu
                </div>
                {navigation.public.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-xl transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
              </div>

              {/* User Navigation */}
              {user && (
                <div className="mt-8 space-y-2">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    My Account
                  </div>
                  {navigation.user.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-xl transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Admin Navigation */}
              {isAdmin && (
                <div className="mt-8 space-y-2">
                  <div className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-4">
                    Admin Tools
                  </div>
                  {navigation.admin.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="p-6 border-t border-gray-100 space-y-3">
              {user ? (
                <>
                  <Link
                    href="/profile"
                    className="flex items-center justify-center space-x-2 px-4 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Cog6ToothIcon className="w-5 h-5" />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center space-x-2 w-full px-4 py-3 text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center justify-center px-4 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="flex items-center justify-center px-4 py-3 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:shadow-lg transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Start Learning Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;