import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { 
  ShieldCheck, 
  Users, 
  Briefcase, 
  CreditCard, 
  Video, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  LogOut, 
  RefreshCw, 
  ExternalLink, 
  Sliders, 
  Check,
  Mail,
  Send
} from 'lucide-react';

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'clients' | 'projects' | 'meetings' | 'payments'
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sendingEmailId, setSendingEmailId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Overview stats
  const [overview, setOverview] = useState({
    totalClients: 0,
    activeProjects: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    upcomingMeetings: []
  });

  // Clients list
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');

  // Selected client detail view
  const [selectedClientData, setSelectedClientData] = useState(null);

  // Project management form state
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    status: 'In Progress',
    progress: 0
  });
  const [newMilestone, setNewMilestone] = useState({ title: '', date: '', completed: false });

  // Meeting scheduler state
  const [meetingForm, setMeetingForm] = useState({
    clientId: '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    meetingLink: 'https://meet.google.com/ptg-consultation',
    notes: ''
  });
  const [editingMeetingId, setEditingMeetingId] = useState(null);
  const [meetingsList, setMeetingsList] = useState([]);

  // Payment management state (in Indian Rupees)
  const [paymentForm, setPaymentForm] = useState({
    totalAmount: 150000,
    d1: '',
    d2: '',
    d3: ''
  });

  // Fetch all admin data
  const loadAdminData = async () => {
    try {
      const [ovRes, clientsRes, meetsRes] = await Promise.all([
        api.getAdminOverview(),
        api.getAdminClients(),
        api.getAdminMeetings()
      ]);

      if (ovRes.data) setOverview(ovRes.data);
      if (clientsRes.clients) {
        setClients(clientsRes.clients);
        if (!selectedClientId && clientsRes.clients.length > 0) {
          setSelectedClientId(clientsRes.clients[0].id);
        }
      }
      if (meetsRes.meetings) setMeetingsList(meetsRes.meetings);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      setErrorMsg(err.message || 'Error loading administrator records.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // When selectedClientId changes, load that client's full details
  useEffect(() => {
    if (!selectedClientId) return;
    async function loadClient() {
      try {
        const res = await api.getAdminClientDetails(selectedClientId);
        if (res.success) {
          setSelectedClientData(res);
          if (res.project) {
            setProjectForm({
              name: res.project.name || '',
              description: res.project.description || '',
              status: res.project.status || 'In Progress',
              progress: res.project.progress || 0
            });
          }
          if (res.payment) {
            setPaymentForm(prev => ({
              ...prev,
              totalAmount: res.payment.totalAmount || 150000
            }));
          }
        }
      } catch (err) {
        console.error('Error loading client details:', err);
      }
    }
    loadClient();
  }, [selectedClientId]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setErrorMsg('');
    setSuccessMsg('');
    loadAdminData();
  };

  // --- EMAIL DUE NOTIFICATION ACTION ---
  const handleSendDueEmail = async ({ clientId, installmentId = null }) => {
    if (!clientId) return;
    const targetId = installmentId || clientId;
    setSendingEmailId(targetId);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await api.sendPaymentDueEmail({ clientId, installmentId });
      if (res.success) {
        setSuccessMsg(`✓ Notice sent to ${res.recipient}! Subject: "${res.subject}" (Ref: ${res.refId})`);
        if (selectedClientId === clientId) {
          const updated = await api.getAdminClientDetails(clientId);
          if (updated.success) setSelectedClientData(updated);
        }
      }
    } catch (err) {
      console.error('Failed to send payment due reminder:', err);
      setErrorMsg(err.message || 'Failed to dispatch payment due reminder email.');
    } finally {
      setSendingEmailId(null);
    }
  };

  // --- PROJECT ACTIONS ---
  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!selectedClientId) return;
    try {
      await api.saveProject({
        clientId: selectedClientId,
        ...projectForm
      });
      setSuccessMsg('Project updated successfully.');
      loadAdminData();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update project.');
    }
  };

  const handleAddMilestone = async (e) => {
    e.preventDefault();
    if (!selectedClientData?.project?.id || !newMilestone.title.trim()) return;
    try {
      await api.addMilestone(selectedClientData.project.id, newMilestone);
      setNewMilestone({ title: '', date: '', completed: false });
      setSuccessMsg('Milestone added.');
      const res = await api.getAdminClientDetails(selectedClientId);
      setSelectedClientData(res);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to add milestone.');
    }
  };

  const handleToggleMilestone = async (mId, currentCompleted) => {
    if (!selectedClientData?.project?.id) return;
    try {
      await api.updateMilestone(selectedClientData.project.id, mId, {
        completed: !currentCompleted
      });
      const res = await api.getAdminClientDetails(selectedClientId);
      setSelectedClientData(res);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to toggle milestone.');
    }
  };

  const handleDeleteMilestone = async (mId) => {
    if (!selectedClientData?.project?.id) return;
    try {
      await api.deleteMilestone(selectedClientData.project.id, mId);
      const res = await api.getAdminClientDetails(selectedClientId);
      setSelectedClientData(res);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete milestone.');
    }
  };

  // --- MEETING ACTIONS ---
  const handleScheduleMeeting = async (e) => {
    e.preventDefault();
    try {
      if (editingMeetingId) {
        await api.updateMeeting(editingMeetingId, meetingForm);
        setSuccessMsg('Meeting details updated.');
        setEditingMeetingId(null);
      } else {
        await api.createMeeting(meetingForm);
        setSuccessMsg('Meeting scheduled successfully.');
      }
      setMeetingForm({
        clientId: selectedClientId || '',
        title: '',
        date: new Date().toISOString().split('T')[0],
        time: '14:00',
        meetingLink: 'https://meet.google.com/ptg-consultation',
        notes: ''
      });
      loadAdminData();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to schedule meeting.');
    }
  };

  const handleDeleteMeeting = async (id) => {
    if (!window.confirm('Delete this scheduled meeting?')) return;
    try {
      await api.deleteMeeting(id);
      setSuccessMsg('Meeting removed.');
      loadAdminData();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete meeting.');
    }
  };

  const handleEditMeetingClick = (m) => {
    setEditingMeetingId(m.id);
    setMeetingForm({
      clientId: m.clientId,
      title: m.title,
      date: m.date,
      time: m.time,
      meetingLink: m.meetingLink,
      notes: m.notes || ''
    });
    setActiveTab('meetings');
  };

  // --- PAYMENT & EMI ACTIONS ---
  const handleSetupEMI = async (e) => {
    e.preventDefault();
    if (!selectedClientId) return;
    try {
      await api.setupPaymentPlan({
        clientId: selectedClientId,
        totalAmount: Number(paymentForm.totalAmount),
        dueDates: [paymentForm.d1, paymentForm.d2, paymentForm.d3].filter(Boolean)
      });
      setSuccessMsg('Milestone EMI schedule created and updated.');
      loadAdminData();
      const res = await api.getAdminClientDetails(selectedClientId);
      setSelectedClientData(res);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to configure EMI plan.');
    }
  };

  const handleUpdateInstallmentStatus = async (instId, status) => {
    try {
      await api.updateInstallmentStatus(instId, { status });
      setSuccessMsg(`Installment status updated to ${status}.`);
      loadAdminData();
      const res = await api.getAdminClientDetails(selectedClientId);
      setSelectedClientData(res);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update installment status.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-slate-500">Loading Administrator Console...</p>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 bg-[#f8fafc]">
      
      {/* 1. Admin Top Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-700 bg-orange-50 px-3 py-0.5 rounded-full border border-orange-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
                Administrative Command Center
              </span>
              <span className="text-xs text-slate-500 font-medium">Master Level: Paverasa Private Limited</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
              PTG Admin Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Manage client records, assign projects, synchronize Google Meet reviews, and govern milestone EMI payments in Indian Rupees (₹).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-all shadow-sm"
              title="Refresh Records"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-orange-500' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-all"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* 2. Overview Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
          
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-orange-600" />
              Total Clients
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-slate-900 font-['Outfit']">
                {overview.totalClients}
              </span>
              <span className="text-[11px] font-bold text-orange-600">Registered</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-amber-600" />
              Active Projects
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-amber-600 font-['Outfit']">
                {overview.activeProjects}
              </span>
              <span className="text-[11px] font-bold text-amber-700">In Sprint</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <span className="text-sm font-black text-emerald-600">₹</span>
              Total Revenue
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-emerald-600 font-['Outfit']">
                ₹{(overview.totalRevenue || 0).toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] font-bold text-emerald-700">Collected</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-orange-500" />
              Pending Payments
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-orange-600 font-['Outfit']">
                ₹{(overview.pendingPayments || 0).toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] font-bold text-orange-700">EMI Balance</span>
            </div>
          </div>

        </div>
      </div>

      {/* Messages */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-700 hover:text-emerald-950 font-bold">✕</button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="text-rose-700 hover:text-rose-950 font-bold">✕</button>
        </div>
      )}

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'overview', label: 'Overview Dashboard', icon: ShieldCheck },
          { id: 'clients', label: 'Client Management', icon: Users },
          { id: 'projects', label: 'Project & Milestone Governance', icon: Briefcase },
          { id: 'meetings', label: 'Meeting Scheduler', icon: Video },
          { id: 'payments', label: 'Payment & EMI Management', icon: CreditCard }
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

      {/* 4. Tab Contents */}

      {/* TAB: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Quick Client Selector */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-['Outfit'] flex items-center gap-2">
              <Users className="w-4 h-4 text-orange-600" />
              <span>Quick Select Client</span>
            </h3>
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {clients.map(c => (
                <div
                  key={c.id}
                  onClick={() => setSelectedClientId(c.id)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    selectedClientId === c.id
                      ? 'bg-orange-50 border-orange-400 text-orange-950 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <p className="text-xs font-bold">{c.name}</p>
                  <p className="text-[11px] text-orange-600 font-semibold">{c.company}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 font-medium">
                    <span>{c.email}</span>
                    <span className="font-bold text-slate-800">{c.project?.progress || 0}% Progress</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Meetings List */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-['Outfit'] flex items-center gap-2">
                <Video className="w-4 h-4 text-orange-600" />
                <span>Upcoming Scheduled Meetings</span>
              </h3>
              <button
                onClick={() => setActiveTab('meetings')}
                className="text-xs text-orange-600 hover:text-orange-700 font-bold"
              >
                + Schedule Meeting
              </button>
            </div>

            <div className="space-y-3">
              {overview.upcomingMeetings.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center font-medium">No meetings scheduled.</p>
              ) : (
                overview.upcomingMeetings.map(m => (
                  <div key={m.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{m.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-semibold border border-orange-200">
                          {m.company}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {m.date} at {m.time} • Client: {m.clientName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={m.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Link</span>
                      </a>
                      <button
                        onClick={() => handleEditMeetingClick(m)}
                        className="p-1.5 rounded-xl bg-slate-200 text-slate-700 hover:text-slate-900"
                        title="Edit Meeting"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* TAB: CLIENT MANAGEMENT */}
      {activeTab === 'clients' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">Registered Clients Directory</h2>
              <p className="text-xs text-slate-500 font-medium">View registered accounts, company profiles, active projects, and financials</p>
            </div>
            <span className="text-xs font-bold text-orange-700 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              {clients.length} Total Registered
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">Client Name & ID</th>
                  <th className="py-3 px-4 font-bold">Company</th>
                  <th className="py-3 px-4 font-bold">Contact Info</th>
                  <th className="py-3 px-4 font-bold">Assigned Project</th>
                  <th className="py-3 px-4 font-bold">Progress</th>
                  <th className="py-3 px-4 font-bold">Payment Summary</th>
                  <th className="py-3 px-4 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clients.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{c.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{c.id}</p>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-orange-600">{c.company}</td>
                    <td className="py-3.5 px-4 space-y-0.5">
                      <p className="text-slate-800 font-medium">{c.email}</p>
                      <p className="text-slate-500 text-[10px]">{c.phone || 'No phone'}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800">
                        {c.project?.name || 'Unassigned'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-orange-500 h-full rounded-full"
                            style={{ width: `${c.project?.progress || 0}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-orange-600">{c.project?.progress || 0}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-emerald-600 font-extrabold">₹{(c.payment?.amountPaid || 0).toLocaleString('en-IN')} Paid</p>
                      <p className="text-amber-600 font-bold text-[10px]">₹{(c.payment?.balance || 0).toLocaleString('en-IN')} Pending</p>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedClientId(c.id);
                          setActiveTab('projects');
                        }}
                        className="px-2.5 py-1 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-[11px] font-bold border border-orange-200"
                      >
                        Manage Project
                      </button>
                      <button
                        onClick={() => {
                          setSelectedClientId(c.id);
                          setActiveTab('payments');
                        }}
                        className="px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold border border-emerald-200"
                      >
                        Payments
                      </button>
                      <button
                        onClick={() => handleSendDueEmail({ clientId: c.id })}
                        disabled={sendingEmailId === c.id}
                        title="Send Payment Due Reminder Email to Client"
                        className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-[11px] font-bold shadow-sm inline-flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        {sendingEmailId === c.id ? 'Sending...' : 'Send Due Notice'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: PROJECT MANAGEMENT */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          
          {/* Client Selector Bar */}
          <div className="bg-white border border-slate-200 rounded-3xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-600">Selecting Target Client:</span>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-orange-500"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.company}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs text-slate-600 font-medium">
              Active Project: <strong className="text-orange-600">{selectedClientData?.project?.name || 'None'}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Project Details & Progress Controller */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-orange-600" />
                <span>Project Scope & Progress Controller</span>
              </h3>

              <form onSubmit={handleSaveProject} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Project Name</label>
                  <input
                    type="text"
                    value={projectForm.name}
                    onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Project Description & Scope</label>
                  <textarea
                    rows="3"
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-orange-500 resize-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                    <select
                      value={projectForm.status}
                      onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:outline-none focus:border-orange-500"
                    >
                      <option value="Planning">Planning</option>
                      <option value="In Progress">In Progress</option>
                      <option value="In Review">In Review</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700">Progress: {projectForm.progress}%</label>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={projectForm.progress}
                      onChange={(e) => setProjectForm({ ...projectForm, progress: Number(e.target.value) })}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500 mt-2"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Save & Update Project Progress
                </button>
              </form>
            </div>

            {/* Milestones Management */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-orange-600" />
                <span>Manage Milestones</span>
              </h3>

              {/* Add Milestone Form */}
              <form onSubmit={handleAddMilestone} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <p className="text-xs font-bold text-slate-800">Add New Milestone</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Milestone title (e.g. Core API Setup)"
                    value={newMilestone.title}
                    onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-medium"
                    required
                  />
                  <input
                    type="date"
                    value={newMilestone.date}
                    onChange={(e) => setNewMilestone({ ...newMilestone, date: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Milestone</span>
                </button>
              </form>

              {/* Milestones List */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {(!selectedClientData?.project?.milestones || selectedClientData.project.milestones.length === 0) ? (
                  <p className="text-xs text-slate-500 py-4 text-center font-medium">No milestones added yet.</p>
                ) : (
                  selectedClientData.project.milestones.map((m) => (
                    <div
                      key={m.id}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => handleToggleMilestone(m.id, m.completed)}
                          className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                            m.completed
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'bg-white border-slate-300 text-transparent hover:text-slate-400'
                          }`}
                          title="Toggle Completion"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <div>
                          <p className={`font-bold ${m.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                            {m.title}
                          </p>
                          <p className="text-[10px] text-slate-500 font-medium">{m.date || 'No target date'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          m.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {m.completed ? 'Completed' : 'Pending'}
                        </span>
                        <button
                          onClick={() => handleDeleteMilestone(m.id)}
                          className="p-1 text-slate-400 hover:text-rose-600"
                          title="Delete Milestone"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB: MEETING SCHEDULER */}
      {activeTab === 'meetings' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Scheduler Form */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                <Video className="w-5 h-5 text-orange-600" />
                <span>{editingMeetingId ? 'Edit Scheduled Meeting' : 'Schedule Client Meeting'}</span>
              </h3>

              <form onSubmit={handleScheduleMeeting} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Client</label>
                  <select
                    value={meetingForm.clientId}
                    onChange={(e) => setMeetingForm({ ...meetingForm, clientId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-orange-500"
                    required
                  >
                    <option value="">Select a Client...</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.company})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Meeting Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Sprint 2 Architectural Demo"
                    value={meetingForm.title}
                    onChange={(e) => setMeetingForm({ ...meetingForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={meetingForm.date}
                      onChange={(e) => setMeetingForm({ ...meetingForm, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Time</label>
                    <input
                      type="time"
                      value={meetingForm.time}
                      onChange={(e) => setMeetingForm({ ...meetingForm, time: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Meeting Link (Google Meet / Zoom)</label>
                  <input
                    type="url"
                    placeholder="https://meet.google.com/abc-xyz"
                    value={meetingForm.meetingLink}
                    onChange={(e) => setMeetingForm({ ...meetingForm, meetingLink: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Agenda / Meeting Notes</label>
                  <textarea
                    rows="3"
                    placeholder="Topics to discuss, deliverables to demo..."
                    value={meetingForm.notes}
                    onChange={(e) => setMeetingForm({ ...meetingForm, notes: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-orange-500 resize-none"
                  ></textarea>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-all cursor-pointer"
                  >
                    {editingMeetingId ? 'Update Meeting' : 'Schedule Meeting'}
                  </button>
                  {editingMeetingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingMeetingId(null);
                        setMeetingForm({
                          clientId: '',
                          title: '',
                          date: new Date().toISOString().split('T')[0],
                          time: '14:00',
                          meetingLink: 'https://meet.google.com/ptg-consultation',
                          notes: ''
                        });
                      }}
                      className="px-3 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Meetings Table */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 font-['Outfit']">All Scheduled Client Meetings</h3>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {meetingsList.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center font-medium">No meetings currently on the calendar.</p>
                ) : (
                  meetingsList.map((m) => (
                    <div
                      key={m.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{m.title}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-bold border border-orange-200">
                            {m.company}
                          </span>
                        </div>
                        <p className="text-slate-500 text-[11px] font-medium">
                          {m.date} at {m.time} • Client: {m.clientName}
                        </p>
                        {m.notes && <p className="text-slate-600 text-[11px] italic">{m.notes}</p>}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={m.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs flex items-center gap-1 font-bold shadow-sm"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Link</span>
                        </a>
                        <button
                          onClick={() => handleEditMeetingClick(m)}
                          className="p-1.5 rounded-xl bg-slate-200 text-slate-700 hover:text-slate-900"
                          title="Edit"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteMeeting(m.id)}
                          className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB: PAYMENT MANAGEMENT */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          
          {/* Client Selector Bar */}
          <div className="bg-white border border-slate-200 rounded-3xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-600">Selecting Target Client:</span>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-orange-500"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.company}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="text-xs text-slate-600 font-medium">
                Total: <strong className="text-slate-900">₹{(selectedClientData?.payment?.totalAmount || 0).toLocaleString('en-IN')}</strong> • 
                Paid: <strong className="text-emerald-600">₹{(selectedClientData?.payment?.amountPaid || 0).toLocaleString('en-IN')}</strong> • 
                Balance: <strong className="text-amber-600">₹{(selectedClientData?.payment?.balance || 0).toLocaleString('en-IN')}</strong>
              </div>
              {selectedClientId && (
                <button
                  onClick={() => handleSendDueEmail({ clientId: selectedClientId })}
                  disabled={sendingEmailId === selectedClientId}
                  className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-sm inline-flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                  title="Send Payment Due Notice to Selected Client"
                >
                  <Mail className="w-3.5 h-3.5" />
                  {sendingEmailId === selectedClientId ? 'Dispatching...' : 'Send Payment Due Email'}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Configure EMI Form */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-orange-600" />
                <span>Configure Milestone EMI Plan</span>
              </h3>

              <form onSubmit={handleSetupEMI} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Project Amount (₹ INR)</label>
                  <input
                    type="number"
                    min="1"
                    value={paymentForm.totalAmount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, totalAmount: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:outline-none focus:border-orange-500"
                    required
                  />
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">
                    Will be split into milestone installments of ~₹{Math.round(paymentForm.totalAmount / 3).toLocaleString('en-IN')} each.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <p className="font-bold text-slate-800">Target Milestone Due Dates</p>
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold">Installment #1 Due Date:</span>
                    <input
                      type="date"
                      value={paymentForm.d1}
                      onChange={(e) => setPaymentForm({ ...paymentForm, d1: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 mt-1 font-medium"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold">Installment #2 Due Date:</span>
                    <input
                      type="date"
                      value={paymentForm.d2}
                      onChange={(e) => setPaymentForm({ ...paymentForm, d2: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 mt-1 font-medium"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold">Installment #3 Due Date:</span>
                    <input
                      type="date"
                      value={paymentForm.d3}
                      onChange={(e) => setPaymentForm({ ...paymentForm, d3: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 mt-1 font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Apply & Enable Milestone EMI
                </button>
              </form>
            </div>

            {/* Installments Status Management */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                Installment Verification & Status Controller
              </h3>

              <div className="space-y-4">
                {(!selectedClientData?.installments || selectedClientData.installments.length === 0) ? (
                  <p className="text-xs text-slate-500 py-6 text-center font-medium">
                    No active EMI installments configured for this client. Use the form on the left to set up the EMI plan.
                  </p>
                ) : (
                  selectedClientData.installments.map((inst) => (
                    <div
                      key={inst.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-slate-700">
                            Installment #{inst.installmentNumber}
                          </span>
                          <span className="text-xs font-black text-orange-600 ml-2">
                            ₹{Number(inst.amount).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          inst.status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : inst.status === 'Overdue'
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : 'bg-orange-100 text-orange-800 border-orange-300'
                        }`}>
                          {inst.status}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-600 font-medium flex items-center justify-between">
                        <span>Due Date: {inst.dueDate}</span>
                        {inst.paidDate && <span className="text-emerald-700 font-bold">Paid on: {inst.paidDate}</span>}
                      </div>

                      {/* Status toggle buttons */}
                      <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 font-semibold">Change Status:</span>
                        <button
                          onClick={() => handleUpdateInstallmentStatus(inst.id, 'Paid')}
                          className="px-2.5 py-1 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-[10px] border border-emerald-300"
                        >
                          Mark Paid ✓
                        </button>
                        <button
                          onClick={() => handleUpdateInstallmentStatus(inst.id, 'Pending')}
                          className="px-2.5 py-1 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-[10px] border border-amber-300"
                        >
                          Mark Pending ⏳
                        </button>
                        <button
                          onClick={() => handleUpdateInstallmentStatus(inst.id, 'Overdue')}
                          className="px-2.5 py-1 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-[10px] border border-rose-300"
                        >
                          Mark Overdue ⚠
                        </button>
                        <button
                          onClick={() => handleSendDueEmail({ clientId: selectedClientId, installmentId: inst.id })}
                          disabled={sendingEmailId === inst.id}
                          className="px-2.5 py-1 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-[10px] border border-orange-300 inline-flex items-center gap-1 ml-auto disabled:opacity-50 cursor-pointer"
                          title="Send Email Due Reminder for this specific installment"
                        >
                          <Mail className="w-3 h-3 text-orange-600" />
                          {sendingEmailId === inst.id ? 'Dispatching...' : 'Email Due Notice'}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
