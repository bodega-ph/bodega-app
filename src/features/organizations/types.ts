// Re-export types from module for client components
// Import directly from types.ts to avoid pulling in Prisma
import type { MembershipRole } from "@/modules/organizations/types";

export type { MembershipRole };
export type OrganizationRole = MembershipRole;

export type {
  OrganizationMember,
  OrganizationOwner,
  OrganizationDataCounts,
  UpdateOrganizationPayload,
  AddMemberPayload,
  DeleteOrganizationOptions,
  DeleteOrganizationResult,
  TransferOwnershipPayload,
  TransferOwnershipResult,
} from "@/modules/organizations/types";
