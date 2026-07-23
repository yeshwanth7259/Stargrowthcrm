from fastapi import HTTPException, status
from typing import List, Optional
from app.models.user import User, UserRole

class PermissionGuard:
    def __init__(self, allowed_roles: List[UserRole]):
        self.allowed_roles = allowed_roles

    def __call__(self, current_user: User) -> User:
        if current_user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action"
            )
        return current_user

# Pre-defined guards
require_super_manager = PermissionGuard([UserRole.SUPER_MANAGER])
require_manager_level = PermissionGuard([UserRole.SUPER_MANAGER, UserRole.MANAGER])
require_accountant = PermissionGuard([UserRole.SUPER_MANAGER, UserRole.ACCOUNTANT])
require_internal = PermissionGuard([UserRole.SUPER_MANAGER, UserRole.MANAGER, UserRole.ACCOUNTANT, UserRole.EMPLOYEE])
require_any_user = PermissionGuard([UserRole.SUPER_MANAGER, UserRole.MANAGER, UserRole.ACCOUNTANT, UserRole.EMPLOYEE, UserRole.CLIENT])
