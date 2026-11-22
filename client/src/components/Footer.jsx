import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Code2, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  CreditCard,
  Clock
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white text-slate-600 border-t border-slate-200 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200">
          
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 p-[2px] shadow-sm">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900 font-['Outfit']">
                  PTG <span className="text-xs text-orange-600 font-semibold">Tech Growth</span>
                </span>
                <span className="text-xs text-slate-500">PTG, a brand of Paverasa Private Limited.</span>
              </div>
            </Link>
            
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              Empowering scaling startups, enterprises, and ambitious founders with premier tech freelance talent, structured milestones, and secure flexible EMI financing.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-700 bg-orange-50/80 px-3 py-1.5 rounded-full border border-orange-200/60 font-medium">
                <Shield className="w-3.5 h-3.5 text-orange-600" />
                <span>Enterprise SLA Guaranteed</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 bg-amber-50/80 px-3 py-1.5 rounded-full border border-amber-200/60 font-medium">
                <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                <span>Milestone EMI Ready</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-slate-900 text-sm font-bold tracking-wider uppercase mb-4 font-['Outfit']">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link to="/" className="hover:text-orange-600 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-orange-600 transition-colors">About Us</Link>
              </li>
              <li>
                <a href="/#services" className="hover:text-orange-600 transition-colors">Services</a>
              </li>
              <li>
                <a href="/#how-we-work" className="hover:text-orange-600 transition-colors">How We Work</a>
              </li>
              <li>
                <a href="/#why-us" className="hover:text-orange-600 transition-colors">Why Choose Us</a>
              </li>
              <li>
                <Link to="/contact" className="hover:text-orange-600 transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Tech Services */}
          <div>
            <h3 className="text-slate-900 text-sm font-bold tracking-wider uppercase mb-4 font-['Outfit']">
              Specializations
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li className="hover:text-orange-600 transition-colors cursor-pointer">Web Application Architecture</li>
              <li className="hover:text-orange-600 transition-colors cursor-pointer">Cross-Platform Mobile Apps</li>
              <li className="hover:text-orange-600 transition-colors cursor-pointer">Product Design & UI/UX Systems</li>
              <li className="hover:text-orange-600 transition-colors cursor-pointer">Cloud, DevOps & Microservices</li>
              <li className="hover:text-orange-600 transition-colors cursor-pointer">Performance & Security Audits</li>
              <li className="hover:text-orange-600 transition-colors cursor-pointer">Digital Growth & Technical SEO</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-slate-900 text-sm font-bold tracking-wider uppercase mb-4 font-['Outfit']">
              Headquarters
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <span>Middletown, A504, Medchal, Telangana</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-orange-600 shrink-0" />
                <a href="mailto:pgtpaverasa3@gmail.com" className="hover:text-orange-600 transition-colors font-medium">
                  pgtpaverasa3@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-orange-600 shrink-0" />
                <a href="tel:+917416472177" className="hover:text-orange-600 transition-colors font-medium">
                  +91 7416472177
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-emerald-600 font-bold">
                <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>24 Hours Operations</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Mandatory Copyright Notice Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p className="font-semibold text-slate-700">
            © 2026 Paverasa Private Limited. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6 font-medium">
            <span className="hover:text-orange-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-orange-600 cursor-pointer">Terms of Service</span>
            <span className="hover:text-orange-600 cursor-pointer">Security Compliance</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
