import InvoiceList from '@/components/InvoiceList';
import { InvoiceProvider } from '../contexts/InvoiceContext';
import { FaReceipt, FaFileInvoiceDollar } from 'react-icons/fa';

export const metadata = {
  title: 'My Invoices - LearningBD',
  description: 'View and download your course payment invoices',
};

export default function InvoicesPage() {
  return (
    <InvoiceProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <FaFileInvoiceDollar className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Payment Invoices</h1>
                <p className="text-blue-100">Access and download all your course payment receipts</p>
              </div>
              
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm text-blue-100">Access Available</div>
              </div>
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm text-blue-100">Secure & Verified</div>
              </div>
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                <div className="text-2xl font-bold">PDF</div>
                <div className="text-sm text-blue-100">Download Format</div>
              </div>
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                <div className="text-2xl font-bold">Tax</div>
                <div className="text-sm text-blue-100">Compliant Invoices</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Invoice List */}
            <div className="lg:col-span-2">
              <InvoiceList />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Help Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaReceipt className="w-5 h-5 text-blue-600" />
                  Invoice Help
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">Need a duplicate invoice?</p>
                    <p className="text-xs text-blue-700 mt-1">Contact support with your invoice ID</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-900">Tax purposes?</p>
                    <p className="text-xs text-green-700 mt-1">All invoices include VAT details</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm font-medium text-purple-900">Payment issues?</p>
                    <p className="text-xs text-purple-700 mt-1">Check payment status in invoice</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <p className="font-medium text-gray-900">Download All Invoices</p>
                    <p className="text-xs text-gray-600">Get ZIP file of all invoices</p>
                  </button>
                  <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <p className="font-medium text-gray-900">Email Invoices</p>
                    <p className="text-xs text-gray-600">Send to your registered email</p>
                  </button>
                  <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <p className="font-medium text-gray-900">Print Bulk Invoices</p>
                    <p className="text-xs text-gray-600">Print multiple invoices</p>
                  </button>
                </div>
              </div>

              {/* Tax Information */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Tax Information</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• All invoices are tax-compliant</p>
                  <p>• Include VAT registration number</p>
                  <p>• Valid for accounting purposes</p>
                  <p>• Can be used for reimbursement</p>
                  <p>• Digital signatures included</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </InvoiceProvider>
  );
}