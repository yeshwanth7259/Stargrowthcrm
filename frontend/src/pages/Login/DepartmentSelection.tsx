import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function DepartmentSelection() {
  const navigate = useNavigate();

  const departments = [
    { name: 'Manager', path: '/login/manager', icon: '👑', desc: 'Agency Owners & Managers' },
    { name: 'Employee', path: '/login/employee', icon: '💼', desc: 'Agency Staff & Team' },
    { name: 'Client', path: '/login/client', icon: '🤝', desc: 'Clients & Partners' },
    { name: 'Accountant', path: '/login/accountant', icon: '📊', desc: 'Finance & Accounts' }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-4">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Star Growth Hub
        </h1>
        <p className="text-slate-400">Select your workspace department to continue</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        {departments.map((dept) => (
          <button
            key={dept.name}
            onClick={() => navigate(dept.path)}
            className="flex items-center p-6 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-blue-500/50 rounded-2xl transition-all group text-left"
          >
            <div className="text-4xl mr-6 p-4 bg-slate-800 rounded-xl group-hover:scale-110 transition-transform">
              {dept.icon}
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">{dept.name}</h2>
              <p className="text-slate-400">{dept.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
