import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/authSlice';
import { Crown, Building2, UserCircle, Briefcase, KeyRound } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"

export default function CompanySetup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
    fetch('http://localhost:8000/api/v1/setup/status')
      .then(res => res.json())
      .then(data => {
        if (data.initialized) {
          navigate('/');
        } else {
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false); // Assume not initialized or server down
      });
  }, [navigate]);

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
      const response = await fetch('http://localhost:8000/api/v1/setup/register-manager', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Setup failed");
      }
      
      const result = await response.json();
      dispatch(loginSuccess({ token: result.access_token, user: result.user }));
      
      navigate('/manager/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-center items-center p-4">
        <div className="animate-pulse text-zinc-500">Initializing workspace...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-center items-center p-4 py-12">
      <div className="w-full max-w-4xl bg-zinc-900 border border-zinc-800 shadow-2xl rounded-2xl p-8 relative overflow-hidden">
        
        <div className="flex flex-col items-center mb-10 pt-4 border-b border-zinc-800 pb-8">
          <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
            <Crown size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Initialize Workspace</h1>
          <p className="text-zinc-400 text-center max-w-lg">
            Welcome to Star Growth Hub CRM. Set up your agency details and create the Super Manager account to begin.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-md mb-8 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Company Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="text-primary" size={24} />
                <h2 className="text-xl font-semibold text-zinc-100">Agency Details</h2>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1.5 text-zinc-300">Company Name *</label>
                <Input required name="company_name" placeholder="Star Growth Hub" onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-zinc-300">Company Email *</label>
                <Input required name="company_email" type="email" placeholder="contact@agency.com" onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-zinc-300">Company Phone *</label>
                <Input required name="company_phone" placeholder="+1 234 567 8900" onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-zinc-300">GST Number (Optional)</label>
                <Input name="gst_number" placeholder="22AAAAA0000A1Z5" onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-primary" />
              </div>
            </div>

            {/* Manager Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <UserCircle className="text-primary" size={24} />
                <h2 className="text-xl font-semibold text-zinc-100">Super Manager Account</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-zinc-300">First Name *</label>
                  <Input required name="manager_first_name" placeholder="John" onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-zinc-300">Last Name</label>
                  <Input name="manager_last_name" placeholder="Doe" onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-primary" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-zinc-300">Login Email *</label>
                <Input required name="email" type="email" placeholder="admin@agency.com" onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-primary" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-zinc-300">Password *</label>
                  <Input required name="password" type="password" placeholder="••••••••" onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-zinc-300">Confirm *</label>
                  <Input required name="confirm_password" type="password" placeholder="••••••••" onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-primary" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-800">
            <Button type="submit" disabled={submitting} className="w-full h-14 text-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all shadow-lg hover:shadow-primary/25">
              {submitting ? "Provisioning Workspace..." : "Initialize Workspace & Continue"}
            </Button>
            <p className="text-center text-zinc-500 text-xs mt-4">
              By initializing the workspace, you agree to become the primary custodian of this CRM instance.
              This action cannot be undone.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
