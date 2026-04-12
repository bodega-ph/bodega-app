import { NextRequest, NextResponse } from "next/server";
import { requireAuthWithOrg } from "@/lib/api-auth";
import {
  deleteOrganization,
  getOrganizationOwner,
  OrganizationsApiError,
  updateOrganization,
} from "@/features/organizations/server";

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

    const { orgId: activeOrgId } = auth;
    const { orgId: requestedOrgId } = await params;

    if (requestedOrgId !== activeOrgId) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    if (!isRecord(body) || typeof body.name !== "string") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const updatedOrg = await updateOrganization(requestedOrgId, { name: body.name });

    return NextResponse.json({
      message: "Organization updated successfully",
      organization: updatedOrg,
    });
  } catch (error) {
    if (error instanceof OrganizationsApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Error updating organization:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const auth = await requireAuthWithOrg({ allowedRoles: ["ORG_ADMIN"] });
    if (!auth.success) return auth.response;

    const { orgId: activeOrgId, session } = auth;
    const { orgId: requestedOrgId } = await params;
    const userId = session.user.id;

    if (requestedOrgId !== activeOrgId) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    if (!isRecord(body)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    if (
      "ownerConfirmation" in body &&
      typeof body.ownerConfirmation !== "string" &&
      typeof body.ownerConfirmation !== "undefined"
    ) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const ownerConfirmation =
      typeof body.ownerConfirmation === "string" ? body.ownerConfirmation.trim() : undefined;

    const owner = await getOrganizationOwner(requestedOrgId);

    const result = await deleteOrganization(requestedOrgId, {
      requesterUserId: userId,
      ownerConfirmation,
    });

    if (!result.deleted) {
      return NextResponse.json(
        {
          error: "Organization has existing data",
          requiresConfirmation: true,
          ownerConfirmationRequired: true,
          owner,
          details: result.details,
        },
        { status: 409 }
      );
    }

    return NextResponse.json({
      message: "Organization deleted successfully",
      nextOrgId: result.nextOrgId,
    });
  } catch (error) {
    if (error instanceof OrganizationsApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Error deleting organization:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
