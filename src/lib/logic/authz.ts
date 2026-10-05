export const ROLES = ["patient", "provider", "provider_staff", "admin"] as const;
export type Role = (typeof ROLES)[number];

export function isRole(value: string | null | undefined): value is Role {
  return !!value && (ROLES as readonly string[]).includes(value);
}

export function canAccessPatientArea(role: Role | null): boolean {
  return role === "patient" || role === "admin";
}

export function canAccessProviderPortal(role: Role | null): boolean {
  return role === "provider" || role === "provider_staff" || role === "admin";
}

export function canAccessAdmin(role: Role | null): boolean {
  return role === "admin";
}

export function canManageProvider(
  actor: { role: Role | null; providerIds: string[] },
  providerId: string,
): boolean {
  if (actor.role === "admin") return true;
  if (actor.role !== "provider" && actor.role !== "provider_staff") return false;
  return actor.providerIds.includes(providerId);
}

export function canReadPatient(
  actor: { userId: string; role: Role | null; relatedPatientIds: string[] },
  patientId: string,
): boolean {
  if (actor.role === "admin") return true;
  if (actor.userId === patientId) return true;
  if (actor.role === "provider" || actor.role === "provider_staff") {
    return actor.relatedPatientIds.includes(patientId);
  }
  return false;
}

export function canChangeOwnRole(nextRole: Role, currentRole: Role): boolean {
  return nextRole === currentRole;
}
