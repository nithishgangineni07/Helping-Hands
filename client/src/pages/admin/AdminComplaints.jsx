import React, { useState } from 'react';
import {
  AlertOctagon,
  CheckCircle2,
  Clock,
  Search,
  MessageSquare,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

const INITIAL_COMPLAINTS = [
  {
    id: 'CMP-1042',
    subject: 'Delayed receipt delivery for contribution',
    reportedBy: 'Kavita Menon',
    email: 'kavita.m@example.com',
    trust: 'Helping Hearts Foundation',
    category: 'Receipt / Payment',
    status: 'In Review',
    date: '2026-09-20',
    description: 'Donated ₹5,000 for Medical Equipment on Sep 19. The digital receipt PDF did not arrive via email immediately.'
  },
  {
    id: 'CMP-1039',
    subject: 'Request field visit verification details',
    reportedBy: 'Arjun Das',
    email: 'arjun.das@example.com',
    trust: 'Narayana Welfare Trust',
    category: 'Verification Query',
    status: 'Resolved',
    date: '2026-09-15',
    description: 'Inquired whether independent auditors have verified the school construction milestone in rural MP.'
  },
  {
    id: 'CMP-1031',
    subject: 'Clarification regarding 80G tax exemption certificate',
    reportedBy: 'Sunil Rao',
    email: 'sunil.rao@example.com',
    trust: 'Vidya Jyoti Educational Society',
    category: 'Tax Exemption',
    status: 'Resolved',
    date: '2026-09-10',
    description: 'Needed the trust 80G registration order reference number for filing income tax return.'
  }
];

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = complaints.filter(
    (c) =>
      c.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.trust.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleResolve = (id) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'Resolved' } : c))
    );
    if (selectedComplaint && selectedComplaint.id === id) {
      setSelectedComplaint((prev) => ({ ...prev, status: 'Resolved' }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-950">
          Complaints & Donor Inquiries
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Monitor community transparency reports, disputed transactions, and NGO compliance feedback.
        </p>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search report ID, donor, or trust name..."
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>

        <div className="text-xs font-bold text-gray-500">
          Active Inquiries: <strong className="text-charcoal-900">{filtered.length}</strong>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Ticket ID</th>
                <th className="py-3.5 px-4">Subject</th>
                <th className="py-3.5 px-4">Reported By</th>
                <th className="py-3.5 px-4">Trust Involved</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-charcoal-800 font-medium">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">{c.id}</td>
                  <td className="py-3.5 px-4 font-bold text-charcoal-900 max-w-xs truncate">{c.subject}</td>
                  <td className="py-3.5 px-4 text-gray-600">{c.reportedBy}</td>
                  <td className="py-3.5 px-4 text-gray-600 truncate max-w-[140px]">{c.trust}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 font-bold text-[10px]">
                      {c.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-400">{c.date}</td>
                  <td className="py-3.5 px-4">
                    {c.status === 'Resolved' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[11px]">
                        <CheckCircle2 className="w-3 h-3" /> Resolved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200 text-[11px]">
                        <Clock className="w-3 h-3" /> In Review
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedComplaint(c)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-charcoal-900 font-bold rounded-lg text-[11px] transition-colors"
                    >
                      Investigate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="font-mono text-xs font-extrabold text-emerald-600">{selectedComplaint.id}</span>
                <h3 className="text-base font-extrabold text-charcoal-900 mt-0.5">{selectedComplaint.subject}</h3>
              </div>
              <span className="text-xs text-gray-400">{selectedComplaint.date}</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-xl">
                <div>
                  <span className="text-gray-400 block font-bold">Complainant</span>
                  <span className="font-bold text-charcoal-900">{selectedComplaint.reportedBy} ({selectedComplaint.email})</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-bold">Target Organization</span>
                  <span className="font-bold text-charcoal-900">{selectedComplaint.trust}</span>
                </div>
              </div>

              <div>
                <span className="text-gray-400 font-bold block mb-1">Issue Description</span>
                <p className="p-3 bg-gray-50 rounded-xl text-charcoal-800 leading-relaxed border border-gray-100">
                  {selectedComplaint.description}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <button
                onClick={() => setSelectedComplaint(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
              >
                Close
              </button>

              {selectedComplaint.status !== 'Resolved' && (
                <button
                  onClick={() => handleResolve(selectedComplaint.id)}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition-colors"
                >
                  Mark as Resolved
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminComplaints;
