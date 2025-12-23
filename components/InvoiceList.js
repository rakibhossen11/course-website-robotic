'use client';

import { useState } from 'react';
import { useInvoice } from '@/app/contexts/InvoiceContext';
import InvoiceGenerator from './InvoiceGenerator';
import { 
  FaReceipt, 
  FaSearch, 
  FaFilter, 
  FaDownload,
  FaEye,
  FaFilePdf,
  FaCheckCircle,
  FaClock,
  FaTimesCircle
} from 'react-icons/fa';

export default function InvoiceList() {
  const { invoices, loading, setSelectedInvoice } = useInvoice();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoiceState] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return `৳${amount.toLocaleString('en-BD')}`;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: { color: 'bg-green-100 text-green-800', icon: FaCheckCircle },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: FaClock },
      cancelled: { color: 'bg-red-100 text-red-800', icon: FaTimesCircle }
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewInvoice = (invoice) => {
    setSelectedInvoiceState(invoice);
    setSelectedInvoice(invoice);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading invoices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FaReceipt className="w-6 h-6 text-blue-600" />
            My Invoices
          </h2>
          <p className="text-gray-600 mt-1">View and download your payment invoices</p>
        </div>
        <div className="text-sm text-gray-500">
          {invoices.length} invoice{invoices.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by invoice ID or course name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter - Desktop */}
          <div className="hidden md:flex gap-2">
            {['all', 'paid', 'pending', 'cancelled'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FaFilter className="w-5 h-5" />
            Filter
          </button>
        </div>

        {/* Mobile Filters Panel */}
        {showFilters && (
          <div className="md:hidden p-4 bg-gray-50 rounded-lg">
            <div className="flex flex-wrap gap-2">
              {['all', 'paid', 'pending', 'cancelled'].map(status => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setShowFilters(false);
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Invoice List */}
      {filteredInvoices.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <FaReceipt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No invoices found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'You haven\'t purchased any courses yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInvoices.map(invoice => (
            <div
              key={invoice.id}
              className="border border-gray-200 rounded-xl hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  {/* Invoice Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <FaFilePdf className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{invoice.courseName}</h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-gray-600">#{invoice.id}</span>
                          <span className="text-sm text-gray-600">
                            {formatDate(invoice.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-4">
                      {getStatusBadge(invoice.status)}
                      <span className="text-lg font-bold text-blue-600">
                        {formatCurrency(invoice.totalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleViewInvoice(invoice)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FaEye className="w-4 h-4" />
                      View Invoice
                    </button>
                    <button
                      onClick={() => handleViewInvoice(invoice)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <FaDownload className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Statistics */}
      {filteredInvoices.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(filteredInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0))}
              </div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
            <div className="bg-green-50 p-4 rounded-xl">
              <div className="text-2xl font-bold text-green-600">
                {filteredInvoices.filter(inv => inv.status === 'paid').length}
              </div>
              <div className="text-sm text-gray-600">Paid Invoices</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-xl">
              <div className="text-2xl font-bold text-yellow-600">
                {filteredInvoices.filter(inv => inv.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending Invoices</div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Generator Modal */}
      {selectedInvoice && (
        <InvoiceGenerator 
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoiceState(null)}
        />
      )}
    </div>
  );
}