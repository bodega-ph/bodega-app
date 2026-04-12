import { NextRequest, NextResponse } from "next/server";
import { requireAuthWithOrg } from "@/lib/api-auth";
import { OrganizationsApiError, transferOwnership } from "@/features/organizations/server";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const auth = await requireAuthWithOrg({ allowedRoles: ["ORG_ADMIN"] });
    if (!auth.success) return auth.response;

    const { orgId: activeOrgId, session } = auth;
    const { orgId: requestedOrgId } = await params;

    if (requestedOrgId !== activeOrgId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    if (!isRecord(body) || typeof body.targetUserId !== "string") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const result = await transferOwnership(requestedOrgId, {
      actorUserId: session.user.id,
      targetUserId: body.targetUserId,
    });

    return NextResponse.json({
      message: "Ownership transferred successfully",
      owner: result.owner,
    });
  } catch (error) {
    if (error instanceof OrganizationsApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Error transferring ownership:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
