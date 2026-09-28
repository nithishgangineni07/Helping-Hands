import React, { useState } from 'react';
import {
  FolderLock,
  FileText,
  Upload,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Download
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const TrustDocuments = () => {
  const { user } = useAuth();

  const [docs, setDocs] = useState([
    {
      title: 'Trust Deed & Incorporation Certificate',
      type: 'Registration',
      status: 'Verified',
      date: '2024-03-12',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    },
    {
      title: '80G Income Tax Exemption Order',
      type: 'Tax Exemption',
      status: 'Verified',
      date: '2024-06-20',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    },
    {
      title: '12A Charitable Institution Registration',
      type: 'Tax Exemption',
      status: 'Verified',
      date: '2024-06-20',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    }
  ]);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docType, setDocType] = useState('Supporting Document');

  const handleUpload = (e) => {
    e.preventDefault();
    if (!docTitle) return;
    setDocs((prev) => [
      ...prev,
      {
        title: docTitle,
        type: docType,
        status: 'Pending Verification',
        date: new Date().toISOString().split('T')[0],
        url: '#'
      }
    ]);
    setUploadOpen(false);
    setDocTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-950">
            Regulatory Documents & Vault
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Secure digital repository for verified legal certificates, tax exemptions, and banking authorizations.
          </p>
        </div>

        <button
          onClick={() => setUploadOpen(true)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* DOCUMENT CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {docs.map((doc, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                  {doc.type}
                </span>
                <span className="text-[10px] text-gray-400 font-semibold">{doc.date}</span>
              </div>

              <div className="flex items-start gap-3 mt-4">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-charcoal-900 text-sm">{doc.title}</h4>
                  <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-emerald-700">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{doc.status}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline"
              >
                <span>View Certificate</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* UPLOAD MODAL */}
      {uploadOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 p-5 sm:p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-base font-extrabold text-charcoal-900">
              Upload Compliance Document
            </h3>

            <form onSubmit={handleUpload} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Document Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. Annual Audited Financial Statement 2025-26"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">Document Category</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                >
                  <option value="Tax Exemption">80G / 12A Certificate</option>
                  <option value="Registration">Trust Registration Proof</option>
                  <option value="FCRA">FCRA Regulatory Document</option>
                  <option value="Audited Financials">Annual Audit Report</option>
                  <option value="Supporting Document">Other Statutory Proof</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">Select PDF File</label>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs cursor-pointer"
                />
              </div>

              <div className="pt-3 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setUploadOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm flex items-center justify-center gap-1.5"
                >
                  Upload & Queue Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default TrustDocuments;
