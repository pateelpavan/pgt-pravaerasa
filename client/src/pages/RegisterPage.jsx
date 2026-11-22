import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShowcasePanel } from '@/components/ui/nexus-3d-animated-login-futuristic-authentication-ui';
import { 
  Code2, 
  User, 
  Mail, 
  Phone, 
  Building, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.company.trim() || !formData.password) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMsg('Please enter a valid business email address.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company: formData.company.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please check your credentials or try a different email.');
    } finally {
      setLoading(false);
    }
  };

  const brandMark = (
    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 via-amber-500 to-orange-600 p-[2px] shadow-md shadow-orange-500/20">
      <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
        <Code2 className="w-5 h-5 text-orange-600" />
      </div>
    </div>
  );

  return (
    <div className="relative grid min-h-screen w-full overflow-x-hidden bg-[#f8fafc] text-slate-900 lg:grid-cols-2">
      {/* 3D Showcase Panel on Left */}
      <ShowcasePanel
        animate={true}
        parallax={true}
        accent="#EA580C"
        logo={brandMark}
        eyebrow="CLIENT ONBOARDING"
        headline="Build your digital future with PTG"
        tagline="Create your account to unlock real-time sprint tracking, milestone EMI management, and direct engineering collaboration."
      />

      {/* Registration Form Panel on Right */}
      <main className="relative flex items-center justify-center overflow-hidden px-4 py-10 sm:px-8 lg:py-16">
        {/* Soft background glow */}
        <div
          aria-hidden
          className="absolute -inset-4 -z-10 rounded-[2.5rem] opacity-30 blur-3xl pointer-events-none"
          style={{ background: 'linear-gradient(135deg, #EA580C, #3B82F6, #22D3EE)' }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-xl"
        >
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-6 sm:p-10 text-slate-900 shadow-2xl backdrop-blur-xl">
            {/* Top orange accent hairline */}
            <div
              aria-hidden
              className="absolute inset-x-8 top-0 h-[2px]"
              style={{ background: 'linear-gradient(90deg, transparent, #EA580C, #F97316, transparent)' }}
            />

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 shrink-0">{brandMark}</div>
              <span className="text-lg font-bold tracking-[0.18em] text-slate-900 font-['Outfit']">PTG</span>
            </div>

            <h1 className="mt-6 text-2xl font-extrabold tracking-tight sm:text-3xl text-slate-900 font-['Outfit']">
              Client Registration
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-500 font-medium">
              Create your organization account to track live deliverables, milestones, and EMI payment schedules.
            </p>

            {errorMsg && (
              <div className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-300 flex items-start gap-3 text-rose-800 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <p>{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
              {/* Full Name & Company in 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Sharma"
                      required
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20 transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Company Name *
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="e.g. Apex Innovations Pvt Ltd"
                      required
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20 transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Business Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="rahul@apexinnovations.in"
                      required
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20 transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      required
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20 transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min. 6 characters"
                      required
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat password"
                      required
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative isolate flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-full text-sm font-bold text-white shadow-lg transition-all active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-80"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #EA580C, #F97316)',
                    boxShadow: '0 12px 30px -10px rgba(234, 88, 12, 0.6)',
                  }}
                >
                  <span
                    aria-hidden
                    className="absolute inset-y-0 -left-1/2 -z-10 w-1/3 -skew-x-12 bg-white/25 transition-transform duration-700 ease-out group-hover:translate-x-[500%]"
                  />
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating Client Account...
                    </>
                  ) : (
                    <>
                      Create Client Account
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Link back to login */}
            <p className="mt-6 text-center text-sm text-slate-500 font-medium">
              Already have a client account?{' '}
              <Link
                to="/login"
                className="font-bold text-orange-600 hover:text-orange-700 hover:underline"
              >
                Sign in to Portal
              </Link>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
