import React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { ThemeProvider } from "./components/ThemeProvider"
import { useSelector } from "react-redux"
import type { RootState } from "./store"

// Pages
import Login from "./pages/Login"
import ManagerDashboard from "./pages/ManagerDashboard"
import EmployeeDashboard from "./pages/EmployeeDashboard"
import ClientDashboard from "./pages/ClientDashboard"
import AccountantDashboard from "./pages/AccountantDashboard"
import CompanySetup from "./pages/Setup/CompanySetup"

const RoleProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole: string | string[] }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
  const location = useLocation()

  if (!isAuthenticated || !user) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  const hasAccess = Array.isArray(allowedRole) ? allowedRole.includes(user.role) : user.role === allowedRole;

  if (!hasAccess) {
    // Redirect to their correct dashboard
    return <Navigate to={`/${user.role.toLowerCase()}/dashboard`} replace />
  }

  return children
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="stargrowth-crm-theme">
      <Router>
        <Routes>
          <Route path="/setup" element={<CompanySetup />} />
          <Route path="/" element={<Login />} />
          
          <Route 
            path="/manager/dashboard" 
            element={
              <RoleProtectedRoute allowedRole={["MANAGER", "SUPER_MANAGER"]}>
                <ManagerDashboard />
              </RoleProtectedRoute>
            } 
          />
          
          <Route 
            path="/employee/dashboard" 
            element={
              <RoleProtectedRoute allowedRole="EMPLOYEE">
                <EmployeeDashboard />
              </RoleProtectedRoute>
            } 
          />
          
          <Route 
            path="/client/dashboard" 
            element={
              <RoleProtectedRoute allowedRole="CLIENT">
                <ClientDashboard />
              </RoleProtectedRoute>
            } 
          />
          
          <Route 
            path="/accountant/dashboard" 
            element={
              <RoleProtectedRoute allowedRole="ACCOUNTANT">
                <AccountantDashboard />
              </RoleProtectedRoute>
            } 
          />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
