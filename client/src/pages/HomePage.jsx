import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Code2, 
  Smartphone, 
  Palette, 
  TrendingUp, 
  Cloud, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  CreditCard, 
  Calendar, 
  Users, 
  Sparkles,
  ChevronRight,
  BarChart3
} from 'lucide-react';

export default function HomePage() {
  const services = [
    {
      icon: Code2,
      title: 'Web Application Development',
      desc: 'Bespoke, high-performance web platforms built with React, Next.js, Node.js, and secure cloud microservices tailored for rapid growth.',
      tags: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'Tailwind']
    },
    {
      icon: Smartphone,
      title: 'Cross-Platform Mobile Apps',
      desc: 'Fluid, native-grade iOS and Android mobile experiences engineered with React Native and Flutter with real-time offline sync.',
      tags: ['React Native', 'Flutter', 'iOS & Android', 'Offline-First']
    },
    {
      icon: Palette,
      title: 'UI/UX Design Systems',
      desc: 'Intuitive user journeys, pixel-perfect design systems, interactive Figma prototypes, and conversion-optimized web interfaces.',
      tags: ['Figma', 'Design Systems', 'Micro-Interactions', 'UX Research']
    },
    {
      icon: TrendingUp,
      title: 'Digital Marketing & Growth',
      desc: 'Data-driven performance marketing, technical SEO audits, conversion rate optimization, and automated business analytics.',
      tags: ['Technical SEO', 'Performance Ads', 'Conversion Rate', 'Analytics']
    },
    {
      icon: Cloud,
      title: 'Cloud & DevOps Architecture',
      desc: 'Resilient cloud infrastructure on AWS and GCP with automated CI/CD pipelines, Docker containerization, and high availability.',
      tags: ['AWS', 'Docker', 'Kubernetes', 'CI/CD Pipelines']
    },
    {
      icon: Cpu,
      title: 'AI & Automation Solutions',
      desc: 'Custom generative AI integrations, intelligent workflow automations, and smart data pipelines that amplify operational productivity.',
      tags: ['LLMs', 'OpenAI', 'Python Automation', 'Data Pipelines']
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'Discovery & Architecture Scope',
      desc: 'We conduct an in-depth technical analysis to define your product requirements, choose optimal tech stacks, and produce clear architecture roadmaps.'
    },
    {
      step: '02',
      title: 'Milestones & EMI Structuring',
      desc: 'Your project is structured into transparent milestones with an accessible EMI payment plan. You pay in verified installments as milestones succeed.'
    },
    {
      step: '03',
      title: 'Agile Sprint Execution & Syncs',
      desc: 'Senior tech talent crafts your solution with iterative two-week sprints, live progress updates on your portal, and scheduled video review meetings.'
    },
    {
      step: '04',
      title: 'Rigorous QA, Audit & Handover',
      desc: 'Comprehensive automated test coverage, performance benchmarking, security vulnerability audits, and clean handover with 100% IP ownership.'
    }
  ];

  const benefits = [
    {
      title: 'Vetted Senior Engineers',
      desc: 'Work exclusively with top-tier freelance engineers, designers, and cloud architects rigorously vetted for enterprise standards.',
      icon: Users
    },
    {
      title: 'Real-Time Client Dashboard',
      desc: 'Monitor live project percentages, inspect milestone completion states, and access calendar schedules 24/7 on your portal.',
      icon: BarChart3
    },
    {
      title: 'Transparent Milestone EMI',
      desc: 'Project investment is distributed into predictable EMI installments tied to milestone deliveries for complete financial peace of mind.',
      icon: CreditCard
    },
    {
      title: 'Direct Video Consultations',
      desc: 'Stay aligned through regular Google Meet review sessions scheduled directly into your synchronized meeting calendar.',
      icon: Calendar
    },
    {
      title: '99.8% On-Time Delivery',
      desc: 'Agile milestone governance and strict technical roadmapping eliminate scope creep and ensure timely releases.',
      icon: Clock
    },
    {
      title: 'Enterprise IP & Code Security',
      desc: 'Comprehensive non-disclosure agreements and full intellectual property transfer to your organization from day one.',
      icon: ShieldCheck
    }
  ];

  return (
    <div className="relative overflow-hidden bg-[#f8fafc]">
      
      {/* Light Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-orange-200/40 via-amber-100/30 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[800px] -left-48 w-96 h-96 bg-orange-100/50 blur-3xl rounded-full pointer-events-none -z-10" />

      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs sm:text-sm font-bold shadow-sm">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span>Paverasa Tech Growth (PTG) • A brand of Paverasa Private Limited</span>
          </div>

          {/* PTG Logo Display & Headline */}
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-orange-600 p-[3px] shadow-xl shadow-orange-500/20">
              <div className="w-full h-full bg-white rounded-[13px] flex items-center justify-center">
                <Code2 className="w-9 h-9 text-orange-600" />
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight font-['Outfit'] leading-[1.1]">
              Architecting Your Growth with <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500">Precision Engineering</span>
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            PTG combines elite freelance software architects, live milestone tracking, and milestone-verified EMI financing in Indian Rupees (₹) to scale your digital initiatives.
          </p>

          {/* Hero Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-bold text-white bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 hover:border-orange-400 hover:text-orange-600 shadow-sm transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Login to Portal</span>
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-12 max-w-3xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-orange-600 font-['Outfit']">140+</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">Enterprise Deliveries</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-['Outfit']">99.8%</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">On-Time Milestones</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-orange-500 font-['Outfit']">EMI</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">Milestone Flexibility</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-['Outfit']">24/7</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">Portal Tracking</p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Services Section */}
      <section id="services" className="py-20 bg-white border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-3.5 py-1 rounded-full border border-orange-200">
              Enterprise Tech Stack
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-['Outfit']">
              Comprehensive Technology Services
            </h2>
            <p className="text-base text-slate-600">
              From web platforms and native mobile apps to UI/UX and cloud scalability, PTG provides end-to-end technical execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <div
                  key={idx}
                  className="p-7 rounded-3xl bg-[#f8fafc] border border-slate-200 hover:border-orange-300 hover:bg-white transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/5 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-100/80 border border-orange-200 flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 font-['Outfit'] group-hover:text-orange-600 transition-colors">
                      {srv.title}
                    </h3>
                    
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {srv.desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-4 border-t border-slate-200/80 flex flex-wrap gap-1.5">
                    {srv.tags.map((t, tidx) => (
                      <span
                        key={tidx}
                        className="text-[11px] font-bold text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3. How We Work (4-Step Process) */}
      <section id="how-we-work" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-3.5 py-1 rounded-full border border-orange-200">
            Transparent Workflow
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-['Outfit']">
            How We Work: The 4-Step Journey
          </h2>
          <p className="text-base text-slate-600">
            A battle-tested methodology designed for total transparency, predictable delivery, and verified value at every phase.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st, i) => (
            <div
              key={i}
              className="relative p-6 rounded-3xl bg-white border border-slate-200 hover:border-orange-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-4xl font-black text-orange-200 font-['Outfit'] block mb-3">
                  {st.step}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-2 font-['Outfit']">
                  {st.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {st.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-orange-600">
                <span>Phase {i + 1} Delivery</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Why Choose Us Section */}
      <section id="why-us" className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-3.5 py-1 rounded-full border border-orange-200">
              The PTG Advantage
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-['Outfit']">
              Why Global Clients Choose PTG
            </h2>
            <p className="text-base text-slate-600">
              We bridge the agility of premier freelancing with the institutional governance and accountability of top consulting firms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((bn, idx) => {
              const BIcon = bn.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#f8fafc] border border-slate-200 hover:border-orange-300 hover:bg-white transition-all shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
                    <BIcon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 font-['Outfit']">
                    {bn.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {bn.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 p-8 sm:p-14 text-center overflow-hidden shadow-xl text-white">
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold font-['Outfit']">
              Transform Your Vision into Production Software
            </h2>
            <p className="text-orange-50 text-sm sm:text-base leading-relaxed">
              Create your client account now, review live project timelines, and unlock flexible milestone EMI financing in Indian Rupees (₹).
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-orange-700 font-bold text-sm shadow-md hover:bg-orange-50 transition-all active:scale-95 cursor-pointer"
              >
                Register as a Client
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-orange-700/60 hover:bg-orange-700 text-white border border-white/20 font-bold text-sm transition-all active:scale-95 cursor-pointer"
              >
                Schedule Free Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
