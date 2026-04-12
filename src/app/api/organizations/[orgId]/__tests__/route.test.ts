import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuthWithOrg: vi.fn(),
  deleteOrganization: vi.fn(),
  getOrganizationOwner: vi.fn(),
  updateOrganization: vi.fn(),
}));

vi.mock("@/lib/api-auth", () => ({
  requireAuthWithOrg: mocks.requireAuthWithOrg,
}));

vi.mock("@/features/organizations/server", async () => {
  const actual = await vi.importActual<typeof import("@/features/organizations/server")>(
    "@/features/organizations/server"
  );

  return {
    ...actual,
    deleteOrganization: mocks.deleteOrganization,
    getOrganizationOwner: mocks.getOrganizationOwner,
    updateOrganization: mocks.updateOrganization,
  };
});

import { DELETE } from "../route";

describe("organizations [orgId] delete route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuthWithOrg.mockResolvedValue({
      success: true,
      orgId: "org_1",
      session: { user: { id: "owner_1" } },
    });
    mocks.getOrganizationOwner.mockResolvedValue({
      id: "owner_1",
      name: "Owner",
      email: "owner@example.com",
    });
  });

  it("returns 400 for malformed json body", async () => {
    const req = new Request("http://localhost/api/organizations/org_1", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: "{",
    });

    const response = await DELETE(req as any, { params: Promise.resolve({ orgId: "org_1" }) });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Invalid JSON body" });
  });
});
