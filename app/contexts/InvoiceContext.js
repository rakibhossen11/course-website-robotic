'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';

const InvoiceContext = createContext();

export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoice must be used within InvoiceProvider');
  }
  return context;
};

export const InvoiceProvider = ({ children }) => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Load user's invoices
  useEffect(() => {
    if (user) {
      loadInvoices();
    }
  }, [user]);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      // In a real app, fetch from API
      const mockInvoices = [
        {
          id: 'INV-2024-001',
          userId: user.uid,
          courseId: 'course-001',
          courseName: 'Complete Android Development Bootcamp',
          amount: 3999,
          discount: 3000,
          totalAmount: 3999,
          tax: 0,
          status: 'paid', // paid, pending, cancelled
          paymentMethod: 'bKash',
          transactionId: 'TX123456789',
          createdAt: '2024-01-15T10:30:00Z',
          dueDate: '2024-01-15T10:30:00Z',
          paidAt: '2024-01-15T10:35:00Z',
          billingAddress: {
            name: user.displayName || 'John Doe',
            email: user.email,
            phone: '+880123456789',
            address: '123 Main Street, Dhaka, Bangladesh'
          },
          items: [
            {
              name: 'Complete Android Development Bootcamp',
              description: 'Lifetime access to course content',
              quantity: 1,
              unitPrice: 6999,
              discount: 3000,
              total: 3999
            }
          ]
        },
        {
          id: 'INV-2024-002',
          userId: user.uid,
          courseId: 'course-002',
          courseName: 'Full Stack Web Development Masterclass',
          amount: 4999,
          discount: 3000,
          totalAmount: 4999,
          tax: 0,
          status: 'paid',
          paymentMethod: 'Nagad',
          transactionId: 'TX987654321',
          createdAt: '2024-01-10T14:20:00Z',
          dueDate: '2024-01-10T14:20:00Z',
          paidAt: '2024-01-10T14:25:00Z',
          billingAddress: {
            name: user.displayName || 'John Doe',
            email: user.email,
            phone: '+880123456789',
            address: '123 Main Street, Dhaka, Bangladesh'
          },
          items: [
            {
              name: 'Full Stack Web Development Masterclass',
              description: 'Live sessions + Project portfolio',
              quantity: 1,
              unitPrice: 7999,
              discount: 3000,
              total: 4999
            }
          ]
        }
      ];
      setInvoices(mockInvoices);
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateInvoice = async (courseData) => {
    const newInvoice = {
      id: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
      userId: user.uid,
      courseId: courseData.id,
      courseName: courseData.title,
      amount: courseData.price,
      discount: courseData.originalPrice - courseData.price,
      totalAmount: courseData.price,
      tax: 0,
      status: 'pending',
      paymentMethod: '',
      transactionId: '',
      createdAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      paidAt: null,
      billingAddress: {
        name: user.displayName || '',
        email: user.email || '',
        phone: '',
        address: ''
      },
      items: [
        {
          name: courseData.title,
          description: courseData.description.substring(0, 100) + '...',
          quantity: 1,
          unitPrice: courseData.originalPrice,
          discount: courseData.originalPrice - courseData.price,
          total: courseData.price
        }
      ]
    };

    setInvoices(prev => [newInvoice, ...prev]);
    return newInvoice;
  };

  const updateInvoiceStatus = (invoiceId, status, paymentData = {}) => {
    setInvoices(prev => prev.map(invoice => {
      if (invoice.id === invoiceId) {
        return {
          ...invoice,
          status,
          paymentMethod: paymentData.method || invoice.paymentMethod,
          transactionId: paymentData.transactionId || invoice.transactionId,
          paidAt: status === 'paid' ? new Date().toISOString() : invoice.paidAt
        };
      }
      return invoice;
    }));
  };

  const getInvoiceById = (invoiceId) => {
    return invoices.find(invoice => invoice.id === invoiceId);
  };

  return (
    <InvoiceContext.Provider value={{
      invoices,
      loading,
      selectedInvoice,
      setSelectedInvoice,
      generateInvoice,
      updateInvoiceStatus,
      getInvoiceById,
      loadInvoices
    }}>
      {children}
    </InvoiceContext.Provider>
  );
};