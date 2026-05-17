export function hasPermission(
  permissions: string[] | undefined,
  requiredPermissions?: string[],
) {
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true;
  }

  if (!permissions || permissions.length === 0) {
    return false;
  }

  return requiredPermissions.every((permission) =>
    permissions.includes(permission),
  );
}
