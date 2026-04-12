// Server-only exports - DO NOT import in Client Components
// Actions are kept in features, modules are re-exported
export { createOrg, switchOrg } from "./actions/org";

// Re-exports from @/modules/organizations
export {
  OrganizationsApiError,
  addMember,
  deleteOrganization,
  getOrganizationOwner,
  getMembers,
  removeMember,
  transferOwnership,
  updateMemberRole,
  updateOrganization,
} from "@/modules/organizations";

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
} from "@/modules/organizations";
