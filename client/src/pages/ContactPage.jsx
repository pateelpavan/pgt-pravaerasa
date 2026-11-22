import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  MessageSquare, 
  ShieldCheck,
  Building
} from 'lucide-react';
import { api } from '../services/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please complete all required fields (Name, Email, and Message).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.submitContact(formData);
      setSuccessMsg(res.message || 'Inquiry submitted successfully! Our lead architect will respond within 24 hours.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send message. Please try again or reach out directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 bg-[#f8fafc]">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-3.5 py-1 rounded-full border border-orange-200">
          Get in Touch
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-['Outfit']">
          Start Your Technical Engagement
        </h1>
        <p className="text-base text-slate-600">
          Whether you need a full-stack platform, an enterprise mobile application, or a customized milestone EMI plan in Indian Rupees (₹), our architects are ready.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Contact Form */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-slate-900">
            <MessageSquare className="w-5 h-5 text-orange-600" />
            <h2 className="text-xl font-bold font-['Outfit']">Send a Direct Message</h2>
          </div>

          {successMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-start gap-3 text-emerald-800 text-sm animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
              <div>
                <p className="font-bold text-emerald-900">Message Received!</p>
                <p className="text-xs text-emerald-700 mt-0.5">{successMsg}</p>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-300 flex items-start gap-3 text-rose-800 text-sm animate-in fade-in">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
              <p className="text-xs font-semibold">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Full Name <span className="text-orange-600">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rachel Chen"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-orange-500 focus:bg-white focus:ring-1 focus:ring-orange-500 transition-all font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Work Email <span className="text-orange-600">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="rachel@company.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-orange-500 focus:bg-white focus:ring-1 focus:ring-orange-500 transition-all font-medium"
                  required
                />
              </div>

            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 7416472177 or +91 98765 43210"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-orange-500 focus:bg-white focus:ring-1 focus:ring-orange-500 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Project Overview & Requirements <span className="text-orange-600">*</span>
              </label>
              <textarea
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                placeholder="Describe your product scope, targeted timeline, desired tech stack, or specific questions regarding our flexible EMI installment options..."
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-orange-500 focus:bg-white focus:ring-1 focus:ring-orange-500 transition-all resize-none font-medium"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-md shadow-orange-500/20 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Transmitting Message...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Message to Engineering Lead</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Company Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
              <Building className="w-5 h-5 text-orange-600" />
              Company Office
            </h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800">Paverasa Private Limited</p>
                  <p className="text-slate-500 text-xs mt-0.5 leading-relaxed font-medium">
                    Middletown, A504, Medchal, Telangana, India
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-600 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 font-semibold">Direct Inquiries</p>
                  <a href="mailto:pgtpaverasa3@gmail.com" className="text-orange-600 font-bold hover:underline text-sm">
                    pgtpaverasa3@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-600 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 font-semibold">Direct Phone Support</p>
                  <a href="tel:+917416472177" className="text-orange-600 font-bold hover:underline text-sm">
                    +91 7416472177
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 font-semibold">Operational Hours</p>
                  <p className="text-xs font-bold text-emerald-600">
                    24 Hours / 7 Days Operations (Always Open)
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-orange-50/70 border border-orange-200 space-y-3">
            <div className="flex items-center gap-2 text-orange-800 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-orange-600" />
              <span>Client Assurance SLA</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              All discussions are covered under our mutual non-disclosure agreement. Registered clients also enjoy 24/7 access to scheduled video reviews and live milestone monitoring.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
