import React from 'react';
import { 
  Building2, 
  Target, 
  Eye, 
  ShieldCheck, 
  Award, 
  HeartHandshake, 
  Compass, 
  Globe, 
  Mail, 
  Cpu 
} from 'lucide-react';

export default function AboutPage() {
  const team = [
    {
      name: 'Vikramaditya Sengupta',
      role: 'Chief Executive Officer & Founder',
      company: 'Paverasa Private Limited',
      bio: 'Ex-Principal Cloud Architect with 15+ years orchestrating distributed architectures and scaling enterprise SaaS platforms.',
      tags: ['Enterprise Strategy', 'Distributed Systems', 'Cloud Ops']
    },
    {
      name: 'Dr. Ananya Nair',
      role: 'Chief Technology Officer',
      company: 'Paverasa Tech Growth',
      bio: 'Ph.D. in Computer Science, specialized in real-time WebRTC communications, microservices resilience, and AI workflow optimization.',
      tags: ['System Architecture', 'AI Engineering', 'Full Stack']
    },
    {
      name: 'Ethan Gallagher',
      role: 'Head of Product & Design Systems',
      company: 'Paverasa Tech Growth',
      bio: 'Award-winning product designer dedicated to crafting cohesive design tokens, micro-interactions, and high-conversion UX flows.',
      tags: ['Design Systems', 'UX Research', 'Design Systems']
    },
    {
      name: 'Priyanka Sharma',
      role: 'Director of Agile Engineering & Delivery',
      company: 'Paverasa Tech Growth',
      bio: 'Certified Agile Master managing sprint velocity, milestone governance, and technical client relationships.',
      tags: ['Milestone Governance', 'Agile Delivery', 'QA Automation']
    }
  ];

  const values = [
    {
      icon: Award,
      title: 'Engineering Rigor',
      desc: 'We uphold strict code quality benchmarks, comprehensive unit/E2E test suites, and strict performance metrics on every project.'
    },
    {
      icon: ShieldCheck,
      title: 'Radical Transparency',
      desc: 'From our live progress bar to granular milestone states and payment schedules, you always possess complete visibility.'
    },
    {
      icon: HeartHandshake,
      title: 'Client-Centric EMI Financing',
      desc: 'We stand behind our deliveries with structured EMI milestone options in Indian Rupees (₹), sharing investment risk and guaranteeing results.'
    },
    {
      icon: Compass,
      title: 'Long-Term Partnership',
      desc: 'Beyond code delivery, we provide post-deployment SLA support, cloud cost audits, and proactive architecture updates.'
    }
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-24 bg-[#f8fafc]">
      
      {/* 1. Header & Story */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold shadow-sm">
          <Building2 className="w-4 h-4 text-orange-600" />
          <span>The Paverasa Story</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
          Pioneering the Next Era of <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500">Tech Freelancing</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Founded under <strong className="text-slate-900 font-bold">Paverasa Private Limited</strong>, Paverasa Tech Growth (PTG) was created to solve a persistent industry challenge: bridging elite freelance engineering flexibility with the bulletproof accountability, milestone tracking, and financial transparency of top-tier software enterprises.
        </p>
      </section>

      {/* 2. Story Detailed Card */}
      <section className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-['Outfit']">
              Why We Built Paverasa Tech Growth
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Traditional freelance marketplaces often lack technical governance, predictable timelines, and milestone guarantees. Meanwhile, conventional software consultancies demand rigid multi-month retainers with slow turnaround times.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              PTG introduces a balanced hybrid: dedicated senior software architects, direct video syncs, a 24/7 client progress dashboard, and an industry-first milestone EMI model that aligns our incentives directly with your milestones.
            </p>
            <div className="flex items-center gap-6 pt-2">
              <div>
                <p className="text-3xl font-extrabold text-orange-600 font-['Outfit']">2026</p>
                <p className="text-xs text-slate-500 font-semibold">Next-Gen Standards</p>
              </div>
              <div className="h-10 w-[1px] bg-slate-200" />
              <div>
                <p className="text-3xl font-extrabold text-amber-600 font-['Outfit']">100%</p>
                <p className="text-xs text-slate-500 font-semibold">Milestone Driven</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50/60 p-7 rounded-2xl border border-orange-200 space-y-4">
            <div className="flex items-center gap-2 text-orange-700 text-xs font-bold uppercase tracking-wider">
              <Cpu className="w-4 h-4 text-orange-600" />
              <span>Our Operating Philosophy</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed italic">
              "We measure success not by hours logged, but by production software shipped, zero-regression sprints, and measurable tech growth for our partners."
            </p>
            <div className="pt-2 border-t border-orange-200 flex items-center justify-between text-xs text-slate-600">
              <span className="font-bold text-slate-800">Paverasa Private Limited</span>
              <span className="font-semibold text-orange-600">Bengaluru, India</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 hover:border-orange-300 transition-all">
          <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-['Outfit']">
            Our Mission
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            To empower startups, growth-stage ventures, and enterprises with accessible, top-tier freelance engineering teams that deliver high-performance software with unwavering milestone accountability and fair, flexible financing.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 hover:border-orange-300 transition-all">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-['Outfit']">
            Our Vision
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            To stand as the world's most trusted technology execution platform, pioneering transparent digital client portals, synchronized live sprint reviews, and risk-free installment structures for global businesses.
          </p>
        </div>
      </section>

      {/* 4. Core Values */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 font-['Outfit']">
            The Principles That Drive Us
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Every line of code and customer interaction at PTG is governed by our foundational values.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((val, idx) => {
            const VIcon = val.icon;
            return (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-orange-300 transition-all">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
                  <VIcon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2 font-['Outfit']">
                  {val.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {val.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Team Section */}
      <section className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-3.5 py-1 rounded-full border border-orange-200">
            Leadership & Leads
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit']">
            Meet the Engineering Directors
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            A seasoned collective of technologists, product architects, and delivery strategists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-orange-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white text-xl font-bold font-['Outfit'] shadow-md shadow-orange-500/20">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                    {member.name}
                  </h3>
                  <p className="text-xs font-bold text-orange-600 mt-0.5">
                    {member.role}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {member.company}
                  </p>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {member.bio}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex flex-wrap gap-1">
                {member.tags.map((t, tidx) => (
                  <span
                    key={tidx}
                    className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
