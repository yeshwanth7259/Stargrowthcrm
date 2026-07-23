import React, { useState, useEffect } from 'react';
import { Crown, Building2, UserCircle, KeyRound, Sparkles } from "lucide-react";
import { StarGrowthHubLogo } from './StarGrowthHubLogo';

export const CompanySetup: React.FC<{ onSetupComplete: () => void }> = ({ onSetupComplete }) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    company_name: '',
    company_email: '',
    company_phone: '',
    gst_number: '',
    website: '',
    address: '',
    manager_first_name: '',
    manager_last_name: '',
    email: '',
    password: '',
    confirm_password: ''
  });

  useEffect(() => {
    // Check if already initialized
    fetch(`http://${window.location.hostname}:8000/api/v1/setup/status`)
      .then(res => res.json())
      .then(data => {
        if (data.initialized) {
          onSetupComplete();
        } else {
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false); 
      });
  }, [onSetupComplete]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      const response = await fetch(`http://${window.location.hostname}:8000/api/v1/setup/register-manager`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Setup failed");
      }
      
      const result = await response.json();
      localStorage.setItem('crm_user', JSON.stringify(result.user));
      localStorage.setItem('crm_token', result.access_token);
      
      onSetupComplete();
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center font-sans">
        <div className="animate-pulse text-amber-500 font-bold">Initializing workspace...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center py-12 px-4 font-sans relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-3xl pointer-events-none translate-y-1/2"></div>
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none"></div>

      <div className="w-full max-w-4xl bg-slate-900/90 border border-slate-800/80 shadow-2xl rounded-3xl p-8 relative overflow-hidden backdrop-blur-xl z-10">
        
        <div className="flex flex-col items-center mb-10 pt-4 border-b border-slate-800/80 pb-8">
          <StarGrowthHubLogo size="md" showText={false} />
          <div className="mt-6 mb-2 flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Operating Platform 2.0</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-2">Initialize Workspace</h1>
          <p className="text-slate-400 text-center max-w-lg text-sm">
            Welcome to Star Growth Hub. Set up your agency details and create the Super Manager account to begin.
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm p-4 rounded-xl mb-8 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Company Section */}
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="text-amber-500" size={20} />
                <h2 className="text-lg font-bold text-slate-100">Agency Details</h2>
              </div>
              
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-slate-300">Company Name *</label>
                <input required name="company_name" placeholder="Star Growth Hub" onChange={handleChange} className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-slate-300">Company Email *</label>
                <input required name="company_email" type="email" placeholder="contact@agency.com" onChange={handleChange} className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-slate-300">Company Phone *</label>
                <input required name="company_phone" placeholder="+1 234 567 8900" onChange={handleChange} className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-slate-300">GST Number (Optional)</label>
                <input name="gst_number" placeholder="22AAAAA0000A1Z5" onChange={handleChange} className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" />
              </div>
            </div>

            {/* Manager Section */}
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-6">
                <Crown className="text-amber-500" size={20} />
                <h2 className="text-lg font-bold text-slate-100">Super Manager Account</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-slate-300">First Name *</label>
                  <input required name="manager_first_name" placeholder="John" onChange={handleChange} className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-slate-300">Last Name</label>
                  <input name="manager_last_name" placeholder="Doe" onChange={handleChange} className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5 text-slate-300">Login Email *</label>
                <input required name="email" type="email" placeholder="admin@agency.com" onChange={handleChange} className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-slate-300">Password *</label>
                  <input required name="password" type="password" placeholder="••••••••" onChange={handleChange} className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-slate-300">Confirm *</label>
                  <input required name="confirm_password" type="password" placeholder="••••••••" onChange={handleChange} className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80">
            <button type="submit" disabled={submitting} className="w-full h-14 text-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 cursor-pointer">
              {submitting ? "Provisioning Workspace..." : "Initialize Workspace & Continue"}
            </button>
            <p className="text-center text-slate-500 text-xs mt-4">
              By initializing the workspace, you agree to become the primary custodian of this CRM instance.
              This action cannot be undone.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
