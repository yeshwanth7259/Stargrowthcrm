import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { StarGrowthHubLogo } from './StarGrowthHubLogo';
import {
  ShieldCheck,
  KeyRound,
  Mail,
  ArrowRight,
  Sparkles,
  Lock,
  BarChart3,
  Users,
  Settings
} from 'lucide-react';

type Department = 'MANAGER' | 'ACCOUNTANT' | 'EMPLOYEE' | 'CLIENT' | 'SETUP';

export const LoginPage: React.FC<{ onOpenSetup?: () => void }> = ({ onOpenSetup }) => {
  const { login } = useCRM();
  const [department, setDepartment] = useState<Department>('MANAGER');
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setErrorMsg('Please enter a valid work email address.');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch(`http://${window.location.hostname}:8000/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          department,
          email: emailInput,
          password: passwordInput
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const result = await response.json();
      const user = result.user;
      
      if (department !== 'SETUP') {
        const isManagerDept = department === 'MANAGER';
        const isManagerRole = user.role === 'MANAGER' || user.role === 'SUPER_MANAGER';
        
        if (isManagerDept && !isManagerRole) {
          throw new Error(`Invalid role. You selected MANAGER but you are a ${user.role}`);
        } else if (!isManagerDept && user.role !== department) {
          throw new Error(`Invalid role. You selected ${department} but you are a ${user.role}`);
        }
      }

      // Normally we would update Redux or context here
      // For now, we simulate the CRM context login if it exists, or just redirect
      if (login) {
         login(user.id, emailInput, user);
      }
      localStorage.setItem('crm_token', result.access_token);
      
      window.location.href = `/${user.role.toLowerCase()}/dashboard`;
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabClick = (dept: Department) => {
    if (dept === 'SETUP' && onOpenSetup) {
      onOpenSetup();
    } else {
      setDepartment(dept);
      setErrorMsg('');
    }
  };

  const instantAccounts = [
    { name: 'Aarav Sharma', title: 'Managing Director & Growth Strategist', email: 'aarav@stargrowthhub.com', img: 'https://ui-avatars.com/api/?name=Aarav+Sharma&background=0D8ABC&color=fff' },
    { name: 'yeshwanth k', title: 'Agency CEO & Founder', email: 'yesh5yash@gmail.com', img: 'https://ui-avatars.com/api/?name=yeshwanth+k&background=0D8ABC&color=fff' }
  ];

  return (
    <div className="min-h-screen bg-[#050B14] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/2"></div>
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StarGrowthHubLogo size="lg" showText={false} />
          <div>
            <h1 className="text-xl font-black text-white tracking-wide uppercase">Star Growth Hub</h1>
            <p className="text-[10px] text-amber-500 font-bold tracking-widest uppercase">Digital Marketing Agency</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-slate-900/60 border border-slate-800 rounded-full px-4 py-1.5 text-xs text-slate-400 backdrop-blur-md">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Encrypted Agency CRM Workstation</span>
        </div>
      </header>

      {/* Main Split Layout */}
      <main className="relative z-10 max-w-6xl mx-auto w-full px-4 py-2 flex-1 flex flex-col justify-center mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 bg-[#0B1320]/80 border border-slate-800/80 rounded-[2rem] shadow-2xl overflow-hidden backdrop-blur-xl">
          
          {/* Left Panel: Information */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#121B2A] via-[#0F1724] to-[#1E1610] p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800/80">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold px-3 py-1 rounded-full mb-8">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Operating Platform 2.0</span>
              </div>

              <h2 className="text-4xl font-black text-white tracking-tight leading-[1.1] mb-6">
                Welcome to Star Growth Hub
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-10">
                Empowering India's top performance marketers, SEO strategists, and clients with real-time campaign tracking, deliverables, and invoices.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20">
                    <BarChart3 className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-200 mb-1">MULTI-CHANNEL PPC & SEO</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">Track Google Ads, Meta Ads, and Organic Search deliverables in real-time.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-200 mb-1">CLIENT RETAINER PORTAL</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">Streamlined approvals, ad copy previews, and retainer invoices in ₹ (INR).</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                    <Users className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-200 mb-1">TEAM ATTENDANCE & AI COPILOT</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">Workstation shift check-ins and automated AI pitch proposal generator.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 flex items-center justify-between text-xs text-slate-600 font-medium">
              <span>Star Growth Hub Ltd.</span>
              <span className="text-amber-500/70">v2.4.0 Secure</span>
            </div>
          </div>

          {/* Right Panel: Authentication */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-[#070D18]">
            <div className="w-full max-w-md mx-auto">
              
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-black text-white tracking-tight">Workstation Sign In</h2>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                  <Lock className="w-5 h-5 text-amber-500" />
                </div>
              </div>
              <p className="text-xs text-slate-400 mb-8">Select your department portal or register company setup.</p>

              {/* Department Tabs */}
              <div className="flex flex-wrap items-center gap-1 bg-[#121B2A] p-1.5 rounded-2xl mb-8 border border-slate-800">
                {[
                  { id: 'MANAGER', label: 'CEO / Manager' },
                  { id: 'EMPLOYEE', label: 'Employee' },
                  { id: 'CLIENT', label: 'Client' },
                  { id: 'ACCOUNTANT', label: 'Accountant' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabClick(tab.id as Department)}
                    className={`flex-1 min-w-[70px] flex items-center justify-center gap-1.5 py-2 px-3 text-[10px] sm:text-xs font-bold rounded-xl transition-all cursor-pointer
                      ${department === tab.id 
                        ? 'bg-amber-500 text-slate-950 shadow-md' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      }`}
                  >
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {errorMsg && (
                <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-semibold flex items-center gap-2">
                  <span>⚠️ {errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2">
                    Work Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="e.g. name@stargrowthhub.in"
                      className="w-full bg-[#121B2A] border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-sm font-medium text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••••"
                      className="w-full bg-[#121B2A] border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-sm font-medium text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-4 px-4 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    <>
                      <span>Login to {department} Portal</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
                
                {department === 'MANAGER' && onOpenSetup && (
                  <div className="mt-6 text-center">
                    <button 
                      type="button" 
                      onClick={onOpenSetup}
                      className="text-sm text-slate-500 hover:text-amber-500 transition-colors underline cursor-pointer font-bold"
                    >
                      First time? Register Company
                    </button>
                  </div>
                )}
              </form>

            </div>
          </div>
        </div>

        {/* Bottom footer section */}
        <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mt-6 px-4">
          <span>Switch roles anytime from the workstation header.</span>
          <button className="flex items-center gap-1 hover:text-amber-500 transition-colors cursor-pointer">
            <span className="font-bold text-amber-500">Client Portal Access</span>
            <ArrowRight className="w-3 h-3 text-amber-500" />
          </button>
        </div>

      </main>

    </div>
  );
};
