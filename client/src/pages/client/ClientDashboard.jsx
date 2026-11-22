import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import PaymentCalendar from '../../components/PaymentCalendar';
import MeetingCalendar from '../../components/MeetingCalendar';
import { 
  LayoutDashboard, 
  Layers, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  Video, 
  User, 
  Lock, 
  AlertCircle, 
  Building, 
  RefreshCw, 
  Edit2, 
  Check 
} from 'lucide-react';

export default function ClientDashboard() {
  const { user, updateCurrentUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'project' | 'meetings' | 'payments' | 'profile'

  // Change password form state
  const [pwdForm, setPwdForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [pwdError, setPwdError] = useState('');

  // Profile edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    company: ''
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');

  const fetchDashboard = async () => {
    try {
      const res = await api.getClientDashboard();
      if (res.success && res.data) {
        setDashboardData(res.data);
        setProfileForm({
          name: res.data.profile.name || '',
          phone: res.data.profile.phone || '',
          company: res.data.profile.company || ''
        });
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setErrorMsg(err.message || 'Unable to fetch client dashboard details.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboard();
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwdSuccess('');
    setPwdError('');

    if (!pwdForm.currentPassword || !pwdForm.newPassword) {
      setPwdError('Please complete all password fields.');
      return;
    }

    if (pwdForm.newPassword !== pwdForm.confirmNewPassword) {
      setPwdError('New passwords do not match.');
      return;
    }

    if (pwdForm.newPassword.length < 6) {
      setPwdError('New password must be at least 6 characters long.');
      return;
    }

    setPwdLoading(true);
    try {
      const res = await api.changePassword(pwdForm);
      setPwdSuccess(res.message || 'Password changed successfully!');
      setPwdForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      setPwdError(err.message || 'Error updating password.');
    } finally {
      setPwdLoading(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess('');

    try {
      const res = await api.updateClientProfile(profileForm);
      setProfileSuccess('Profile details updated.');
      updateCurrentUser(res.user);
      setIsEditingProfile(false);
    } catch (err) {
      alert(err.message || 'Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-slate-500">Loading your PTG Client Dashboard...</p>
      </div>
    );
  }

  const { project, meetings = [], payment, installments = [] } = dashboardData || {};

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 bg-[#f8fafc]">
      
      {/* 1. Dashboard Welcome & Overview Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-0.5 rounded-full border border-orange-200">
                Client Portal
              </span>
              <span className="text-xs text-slate-400 font-medium">• Account ID: {user?.id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
              Welcome back, {user?.name}
            </h1>
            <p className="text-sm text-slate-600 font-medium flex items-center gap-2">
              <Building className="w-4 h-4 text-orange-600" />
              <span>{user?.company || 'Enterprise Partner'}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-all shadow-sm"
              title="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-orange-500' : ''}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
          
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Project Progress</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-orange-600 font-['Outfit']">
                {project?.progress || 0}%
              </span>
              <span className="text-[11px] font-bold text-slate-500">
                {project?.status || 'Active'}
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${project?.progress || 0}%` }}
              ></div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Total Project Value</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-slate-900 font-['Outfit']">
                ₹{(payment?.totalAmount || 0).toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] font-bold text-orange-600">Fixed Scope</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">Distributed via Milestone EMI</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Amount Paid</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-emerald-600 font-['Outfit']">
                ₹{(payment?.amountPaid || 0).toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] font-bold text-emerald-700">
                {payment?.totalAmount ? Math.round((payment.amountPaid / payment.totalAmount) * 100) : 0}% Paid
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">Verified Receipts on Record</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Balance Remaining</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-amber-600 font-['Outfit']">
                ₹{(payment?.balance || 0).toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] font-bold text-amber-700">Pending EMI</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">Tied to Milestone Deliveries</p>
          </div>

        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'overview', label: 'All Modules Overview', icon: LayoutDashboard },
          { id: 'project', label: 'Project & Milestones', icon: Layers },
          { id: 'meetings', label: 'Scheduled Meetings', icon: Video },
          { id: 'payments', label: 'Payments & EMI Schedule', icon: CreditCard },
          { id: 'profile', label: 'Profile & Security', icon: User }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 shadow-sm'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Tab Contents */}

      {/* OVERVIEW OR PROJECT PROGRESS SECTION */}
      {(activeTab === 'overview' || activeTab === 'project') && (
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-orange-600" />
                <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">
                  Project Progress: {project?.id ? project.name : 'Pending Project Assignment'}
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {project?.id 
                  ? `Last updated on ${project.lastUpdated ? new Date(project.lastUpdated).toLocaleDateString() : 'Today'}`
                  : 'Awaiting project scoping by technical leads'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                project?.status === 'Completed'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : project?.status === 'In Progress'
                  ? 'bg-orange-50 text-orange-700 border-orange-300'
                  : 'bg-slate-100 text-slate-600 border-slate-300'
              }`}>
                ● {project?.id ? project.status : 'Awaiting Assignment'}
              </span>
            </div>
          </div>

          {!project?.id ? (
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 font-['Outfit']">
                No Active Project Assigned Yet
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed font-medium">
                Your client portal account is successfully active. Your technical project lead will configure your project scope, deliverables, and sprint milestones. Once updated by administration, real-time progress will appear here.
              </p>
            </div>
          ) : (
            <>
              {/* Description */}
              {project?.description && (
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200 font-medium">
                  {project.description}
                </p>
              )}

              {/* Progress Bar (0-100%) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600">Overall Milestone Execution</span>
                  <span className="text-orange-600">{project?.progress || 0}% Completed</span>
                </div>
                <div className="w-full bg-slate-100 h-3.5 rounded-full p-0.5 border border-slate-200 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 h-full rounded-full transition-all duration-700 shadow-sm"
                    style={{ width: `${project?.progress || 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Milestones list with Completed / Pending status */}
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-['Outfit'] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-600" />
                  <span>Milestones & Technical Deliverables</span>
                </h3>

                {(!project?.milestones || project.milestones.length === 0) ? (
                  <p className="text-xs text-slate-500 font-medium py-3">No milestones registered yet for this project.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {project.milestones.map((m) => (
                      <div
                        key={m.id}
                        className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                          m.completed
                            ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900'
                            : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {m.completed ? (
                            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                              <Check className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center shrink-0">
                              <Clock className="w-4 h-4" />
                            </div>
                          )}
                          <div>
                            <p className={`text-xs font-bold ${m.completed ? 'text-emerald-950' : 'text-slate-800'}`}>
                              {m.title}
                            </p>
                            {m.date && (
                              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                                Target Date: {m.date}
                              </p>
                            )}
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          m.completed
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}>
                          {m.completed ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      )}

      {/* MEETINGS SECTION */}
      {(activeTab === 'overview' || activeTab === 'meetings') && (
        <section className="space-y-4">
          <MeetingCalendar meetings={meetings} />
        </section>
      )}

      {/* PAYMENTS & EMI SECTION */}
      {(activeTab === 'overview' || activeTab === 'payments') && (
        <section className="space-y-6">
          
          {/* EMI Cards */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-orange-600" />
                  <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">
                    Milestone EMI Schedule
                  </h2>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Project investment distributed into verified milestone installments in Indian Rupees (₹)
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500 font-medium block">Total Project Investment</span>
                <span className="text-xl font-black text-slate-900 font-['Outfit']">
                  ₹{(payment?.totalAmount || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Installments grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {installments.map((inst) => {
                const isPaid = inst.status === 'Paid';
                const isOverdue = inst.status === 'Overdue';

                let cardBorder = 'border-slate-200 bg-slate-50/70';
                let badgeClass = 'bg-orange-100 text-orange-800 border-orange-300';

                if (isPaid) {
                  cardBorder = 'border-emerald-300 bg-emerald-50/40 shadow-sm shadow-emerald-500/5';
                  badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
                } else if (isOverdue) {
                  cardBorder = 'border-rose-300 bg-rose-50/40';
                  badgeClass = 'bg-rose-100 text-rose-800 border-rose-300';
                }

                return (
                  <div
                    key={inst.id}
                    className={`p-5 rounded-2xl border ${cardBorder} transition-all space-y-3 relative overflow-hidden`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">
                        Installment #{inst.installmentNumber}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeClass}`}>
                        {inst.status}
                      </span>
                    </div>

                    <div>
                      <span className="text-2xl font-black text-slate-900 font-['Outfit']">
                        ₹{Number(inst.amount).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-slate-200/80 space-y-1 text-xs">
                      <div className="flex items-center justify-between text-slate-600 font-medium">
                        <span>Due Date:</span>
                        <span className="font-bold text-slate-800">{inst.dueDate}</span>
                      </div>
                      {inst.paidDate && (
                        <div className="flex items-center justify-between text-emerald-700 font-medium">
                          <span>Paid On:</span>
                          <span className="font-bold">{inst.paidDate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Payment History Table */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-['Outfit']">
                Payment History & Receipts
              </h3>

              {(!payment?.history || payment.history.length === 0) ? (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 font-medium">
                  No previous transactions recorded. Once your first installment is settled, receipts will appear here.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4 font-bold">Date</th>
                        <th className="py-3 px-4 font-bold">Amount</th>
                        <th className="py-3 px-4 font-bold">Method / Receipt</th>
                        <th className="py-3 px-4 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {payment.history.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-bold text-slate-900">{tx.date}</td>
                          <td className="py-3 px-4 font-extrabold text-emerald-600">₹{Number(tx.amount).toLocaleString('en-IN')}</td>
                          <td className="py-3 px-4 text-slate-600 font-medium">{tx.method} ({tx.receiptNo})</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 text-[10px] font-bold">
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Payment Calendar Component */}
          <PaymentCalendar installments={installments} />

        </section>
      )}

      {/* PROFILE & SECURITY SETTINGS */}
      {(activeTab === 'overview' || activeTab === 'profile') && (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Profile Details */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">Client Profile</h3>
              </div>
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="text-xs text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{isEditingProfile ? 'Cancel' : 'Edit Profile'}</span>
              </button>
            </div>

            {profileSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold">
                {profileSuccess}
              </div>
            )}

            {isEditingProfile ? (
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={profileForm.company}
                    onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-orange-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs"
                >
                  {profileSaving ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </form>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">Full Name</span>
                  <span className="font-bold text-slate-900">{user?.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">Business Email</span>
                  <span className="font-bold text-orange-600">{user?.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">Phone Number</span>
                  <span className="font-bold text-slate-900">{user?.phone || 'Not provided'}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500 font-semibold">Company Name</span>
                  <span className="font-bold text-slate-900">{user?.company || 'Not provided'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Change Password Section */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <Lock className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">Change Password</h3>
            </div>

            {pwdSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{pwdSuccess}</span>
              </div>
            )}

            {pwdError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{pwdError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={pwdForm.currentPassword}
                  onChange={(e) => setPwdForm({ ...pwdForm, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-orange-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  New Password (min 6 chars)
                </label>
                <input
                  type="password"
                  value={pwdForm.newPassword}
                  onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
                  placeholder="Enter new password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-orange-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={pwdForm.confirmNewPassword}
                  onChange={(e) => setPwdForm({ ...pwdForm, confirmNewPassword: e.target.value })}
                  placeholder="Re-type new password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-orange-500 font-medium"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={pwdLoading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {pwdLoading ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>
          </div>

        </section>
      )}

    </div>
  );
}
