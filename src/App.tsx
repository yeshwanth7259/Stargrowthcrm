import React, { useState, useEffect } from 'react';
import { CRMProvider, useCRM } from './context/CRMContext';
import { Header } from './components/Header';
import { Sidebar, TabType } from './components/Sidebar';
import { LoginPage } from './components/LoginPage';
import { ManagerDashboard } from './components/views/ManagerDashboard';
import { EmployeeDashboard } from './components/views/EmployeeDashboard';
import { ClientPortal } from './components/views/ClientPortal';
import { ProjectsView } from './components/views/ProjectsView';
import { TasksView } from './components/views/TasksView';
import { LeadsView } from './components/views/LeadsView';
import { AttendanceView } from './components/views/AttendanceView';
import { AIAssistantView } from './components/views/AIAssistantView';
import { InvoicesView } from './components/views/InvoicesView';

import { NewProjectModal } from './components/modals/NewProjectModal';
import { NewTaskModal } from './components/modals/NewTaskModal';
import { NewLeadModal } from './components/modals/NewLeadModal';
import { CheckInModal } from './components/modals/CheckInModal';

import { CompanySetup } from './components/CompanySetup';

const CRMContent: React.FC = () => {
  const { activeRole, isAuthenticated } = useCRM();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSetupOpen, setIsSetupOpen] = useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);

  // Synchronize default tab on role switch
  useEffect(() => {
    if (activeRole === 'manager') {
      setActiveTab('overview');
    } else if (activeRole === 'employee') {
      setActiveTab('tasks');
    } else if (activeRole === 'client') {
      setActiveTab('client-portal');
    }
  }, [activeRole]);

  if (!isAuthenticated) {
    if (isSetupOpen) {
      return <CompanySetup onSetupComplete={() => setIsSetupOpen(false)} />;
    }
    return <LoginPage onOpenSetup={() => setIsSetupOpen(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 antialiased selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Header */}
      <Header
        onOpenCheckInModal={() => setIsCheckInModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      <div className="flex-1 flex w-full">
        {/* Navigation Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsMobileMenuOpen(false); // Auto close on mobile
          }} 
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Workspace Canvas */}
        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'overview' && (
            <ManagerDashboard
              onOpenNewProject={() => setIsProjectModalOpen(true)}
              onOpenNewLead={() => setIsLeadModalOpen(true)}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsView
              onOpenNewProject={() => setIsProjectModalOpen(true)}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'tasks' && (
            activeRole === 'employee' ? (
              <EmployeeDashboard
                onOpenCheckInModal={() => setIsCheckInModalOpen(true)}
                onOpenNewTaskModal={() => setIsTaskModalOpen(true)}
              />
            ) : (
              <TasksView
                onOpenNewTaskModal={() => setIsTaskModalOpen(true)}
                searchQuery={searchQuery}
              />
            )
          )}

          {activeTab === 'leads' && (
            <LeadsView
              onOpenNewLeadModal={() => setIsLeadModalOpen(true)}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceView
              onOpenCheckInModal={() => setIsCheckInModalOpen(true)}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'approvals' && <ClientPortal />}

          {activeTab === 'invoices' && <InvoicesView />}

          {activeTab === 'ai-tools' && <AIAssistantView />}

          {activeTab === 'client-portal' && <ClientPortal />}

          {activeTab === 'support' && <ClientPortal />}
        </main>
      </div>

      {/* Global Modals */}
      <NewProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />

      <NewTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />

      <NewLeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
      />

      <CheckInModal
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <CRMProvider>
      <CRMContent />
    </CRMProvider>
  );
}
