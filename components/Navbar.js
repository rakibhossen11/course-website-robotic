'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon, UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/components/AuthContext'; // Adjust path as needed
import Image from 'next/image';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, logout, loading } = useAuth();

  // Public navigation items (visible to everyone)
  const publicNavigation = [
    // { name: 'Home', href: '/' },
    { name: 'Course-Details', href: '/course-Details' },
    // { name: 'Pricing', href: '/pricing' },
    // { name: 'About Us', href: '/about' },
    // { name: 'Contact', href: '/contact' },
  ];

  // Logged-in user navigation items (visible only when user is logged in)
  const userNavigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'My Classes', href: '/student' },
    { name: 'Enrollments', href: '/admin/enrollments' },
    // { name: 'My Courses', href: '/my-courses' },
    // { name: 'Progress', href: '/progress' },
    // { name: 'Assignments', href: '/assignments' },
  ];

  // Admin navigation items (if you have admin role)
  const adminNavigation = [
    { name: 'Admin Panel', href: '/admin' },
    { name: 'Manage Courses', href: '/admin/courses' },
    { name: 'Users', href: '/admin/users' },
    { name: 'Analytics', href: '/admin/analytics' },
  ];

  // Combine navigation based on user status
  const getNavigationItems = () => {
    if (user) {
      // Check if user is admin
      const isAdmin = user.role === 'admin' || user.isAdmin;
      
      return [
        ...publicNavigation,
        ...userNavigation,
        ...(isAdmin ? adminNavigation : [])
      ];
    }
    return publicNavigation;
  };

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
  };

  // Check if user is admin
  const isAdmin = user && (user.role === 'admin' || user.isAdmin);

  // Show loading state briefly
  if (loading) {
    return (
      <>
        <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0">
                <Link href="/" className="text-xl font-bold text-gray-900">
                  LearningBD
                </Link>
              </div>
              <div className="text-sm text-gray-500">Loading...</div>
            </div>
          </div>
        </nav>
        <div className="h-16" />
      </>
    );
  }

  return (
    <>
      {/* Fixed Navbar */}
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-xl font-bold text-gray-900">
                LearningBD
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="flex space-x-8">
                {getNavigationItems().map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-black hover:text-blue-600 font-bold transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Search Icon */}
              <button className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
                <MagnifyingGlassIcon className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </button>

              {/* User Profile or Auth Buttons */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
                  >
                    {user.photoURL ? (
                      <div className="relative h-8 w-8 rounded-full overflow-hidden border border-gray-300">
                        <Image
                          src={user.photoURL}
                          alt={user.displayName || 'User'}
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <UserCircleIcon className="h-8 w-8 text-gray-400" />
                    )}
                    <span className="hidden lg:inline">
                      {user.displayName ? user.displayName.split(' ')[0] : user.email}
                    </span>
                    <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                  </button>

                  {/* User Dropdown Menu */}
                  {userDropdownOpen && (
                    <>
                      {/* Backdrop */}
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setUserDropdownOpen(false)}
                      />
                      
                      {/* Dropdown */}
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50 py-1">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <div className="flex items-center">
                            {user.photoURL ? (
                              <div className="relative h-8 w-8 rounded-full overflow-hidden border border-gray-300 mr-2">
                                <Image
                                  src={user.photoURL}
                                  alt={user.displayName || 'User'}
                                  width={32}
                                  height={32}
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <UserCircleIcon className="h-8 w-8 text-gray-400 mr-2" />
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {user.displayName || 'User'}
                              </p>
                              <p className="text-xs text-gray-500 truncate">{user.email}</p>
                              {isAdmin && (
                                <span className="text-xs text-red-600 font-semibold">Admin</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          Profile Settings
                        </Link>
                        <Link
                          href="/my-courses"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          My Courses
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 border-t border-gray-100"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 border-t border-gray-100"
                        >
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/login"
                    className="text-sm font-medium text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="text-sm font-medium text-white bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              {user ? (
                <div className="flex items-center space-x-2 mr-4">
                  {user.photoURL ? (
                    <div className="relative h-8 w-8 rounded-full overflow-hidden border border-gray-300">
                      <Image
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <UserCircleIcon className="h-8 w-8 text-gray-400" />
                  )}
                </div>
              ) : null}
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <Dialog as="div" className="md:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-lg">
          <div className="flex items-center justify-between h-16 px-4">
            <Link href="/" className="text-xl font-bold text-gray-900">
              LearningBD
            </Link>
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          
          <div className="mt-6 px-4 pt-4 pb-3 space-y-4">
            {/* User Info in Mobile Menu */}
            {user && (
              <div className="pb-3 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  {user.photoURL ? (
                    <div className="relative h-10 w-10 rounded-full overflow-hidden border border-gray-300">
                      <Image
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <UserCircleIcon className="h-10 w-10 text-gray-400" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user.displayName || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    {isAdmin && (
                      <span className="text-xs text-red-600 font-semibold">Admin</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Public Navigation Links */}
            {publicNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-base font-medium text-gray-700 hover:text-blue-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {/* User-specific Navigation Links */}
            {user && (
              <>
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    My Account
                  </h3>
                  {userNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block text-base font-medium text-gray-700 hover:text-blue-600 py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </>
            )}

            {/* Admin Navigation Links */}
            {isAdmin && (
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-2">
                  Admin
                </h3>
                {adminNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block text-base font-medium text-red-600 hover:text-red-700 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}

            <div className="pt-4 border-t border-gray-200">
              <button className="w-full flex items-center justify-center p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 mb-2">
                <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                Search
              </button>
              
              {user ? (
                <>
                  <Link
                    href="/profile"
                    className="block w-full text-left text-base font-medium text-gray-700 px-4 py-2 hover:bg-gray-50 rounded-md mb-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left text-base font-medium text-red-600 px-4 py-2 hover:bg-gray-50 rounded-md"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block w-full text-left text-base font-medium text-gray-700 px-4 py-2 hover:bg-gray-50 rounded-md mb-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="block w-full text-left text-base font-medium text-white bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;