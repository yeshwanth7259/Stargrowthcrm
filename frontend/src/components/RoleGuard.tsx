import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

// Assuming we have some auth context or redux slice
// For now, let's mock reading from localStorage
interface User {
  id: string;
  name: string;
  role: string;
  department: string;
}

const getAuthUser = (): User | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const user = getAuthUser();

  if (!user) {
    return <Navigate to="/departments" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export const PermissionGuard: React.FC<{ children: ReactNode, permission: string }> = ({ children, permission }) => {
    // Implement more fine-grained permissions later based on matrix
    return <>{children}</>;
};
