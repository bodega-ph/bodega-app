import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuthWithOrg: vi.fn(),
  transferOwnership: vi.fn(),
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
    transferOwnership: mocks.transferOwnership,
  };
});

import { PATCH } from "../route";

describe("organizations ownership route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuthWithOrg.mockResolvedValue({
      success: true,
      orgId: "org_1",
      session: { user: { id: "owner_1" } },
    });
  });

  it("returns 400 for malformed json body", async () => {
    const req = new Request("http://localhost/api/organizations/org_1/ownership", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: "{",
    });

    const response = await PATCH(req as any, { params: Promise.resolve({ orgId: "org_1" }) });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Invalid JSON body" });
  });
});
