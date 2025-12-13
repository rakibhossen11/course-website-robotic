'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Courses', href: '/courses' },
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

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
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
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

              {/* Auth Buttons */}
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
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
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
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-base font-medium text-gray-700 hover:text-blue-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-200">
              <button className="w-full flex items-center justify-center p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 mb-2">
                <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                Search
              </button>
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