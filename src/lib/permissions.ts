import type { Permission, UserRole } from '@/types'
import { ROLE_PERMISSIONS } from '@/types'
import { isProtectedSuperAdmin } from './supabase'

export function hasPermission(role: UserRole | undefined, permission: Permission): boolean {
  if (!role) return false
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

export function hasAnyPermission(role: UserRole | undefined, permissions: Permission[]): boolean {
  if (!role) return false
  return permissions.some((p) => hasPermission(role, p))
}

export function hasAllPermissions(role: UserRole | undefined, permissions: Permission[]): boolean {
  if (!role) return false
  return permissions.every((p) => hasPermission(role, p))
}

/**
 * Critical: Check whether the target user is the protected Super Admin.
 * No one except the Super Admin themselves can modify this account.
 */
export function canModifyTarget(
  currentUserEmail: string | undefined,
  currentRole: UserRole | undefined,
  targetEmail: string | undefined,
): { allowed: boolean; reason?: string } {
  if (!currentUserEmail || !targetEmail) return { allowed: false, reason: 'Missing user information.' }

  // Super admin can modify anyone (except themselves for role downgrade — see below)
  if (isProtectedSuperAdmin(currentUserEmail)) {
    return { allowed: true }
  }

  // Nobody else can touch the protected super admin
  if (isProtectedSuperAdmin(targetEmail)) {
    return {
      allowed: false,
      reason: 'Access Denied — This action requires Super Admin authorization.',
    }
  }

  // Admins can modify users but cannot change roles to super_admin
  if (currentRole === 'admin') {
    return { allowed: true }
  }

  // HR and others can modify per their role but cannot escalate to super_admin
  if (hasPermission(currentRole, 'edit_users')) {
    return { allowed: true }
  }

  return { allowed: false, reason: 'Insufficient permissions.' }
}

export function canAssignRole(
  currentUserEmail: string | undefined,
  currentRole: UserRole | undefined,
  targetRole: UserRole,
): { allowed: boolean; reason?: string } {
  // Only super admin can assign super_admin role
  if (targetRole === 'super_admin') {
    if (!isProtectedSuperAdmin(currentUserEmail)) {
      return {
        allowed: false,
        reason: 'Access Denied — Only the protected Super Admin can grant Super Admin role.',
      }
    }
    return { allowed: true }
  }

  // Super admin can assign any non-super role
  if (isProtectedSuperAdmin(currentUserEmail)) return { allowed: true }

  // Admins can change roles within their scope (cannot grant super_admin)
  if (currentRole === 'admin' && hasPermission(currentRole, 'change_roles')) {
    return { allowed: true }
  }

  if (hasPermission(currentRole, 'change_roles')) {
    return { allowed: true }
  }

  return { allowed: false, reason: 'Insufficient permissions to change roles.' }
}

export const ACCESS_DENIED_MESSAGE = 'Access Denied — This action requires Super Admin authorization.'
