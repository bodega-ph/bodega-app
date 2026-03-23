import { NextRequest, NextResponse } from "next/server";
import { requireAuthWithOrg } from "@/lib/api-auth";
import { prisma } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    // Verify authentication and org membership
    const auth = await requireAuthWithOrg();
    if (!auth.success) return auth.response;

    const { orgId: activeOrgId, orgRole } = auth;
    const { orgId: requestedOrgId } = await params;

    // Verify user is accessing their active org (prevent cross-org manipulation)
    if (requestedOrgId !== activeOrgId) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    // Only ORG_ADMIN can update organization
    if (orgRole !== "ORG_ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { name } = body;

    // Validate organization name
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Organization name is required" },
        { status: 400 }
      );
    }

    // Update organization (use requestedOrgId, not activeOrgId)
    const updatedOrg = await prisma.organization.update({
      where: { id: requestedOrgId },
      data: {
        name: name.trim(),
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    return NextResponse.json({
      message: "Organization updated successfully",
      organization: updatedOrg,
    });
  } catch (error) {
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
    // Verify authentication and org membership
    const auth = await requireAuthWithOrg();
    if (!auth.success) return auth.response;

    const { orgId: activeOrgId, orgRole, session } = auth;
    const { orgId: requestedOrgId } = await params;
    const userId = (session.user as any).id;

    // Verify user is accessing their active org (prevent cross-org manipulation)
    if (requestedOrgId !== activeOrgId) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    // Only ORG_ADMIN can delete organization
    if (orgRole !== "ORG_ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Check if user has other organizations (use requestedOrgId)
    const userMemberships = await prisma.membership.findMany({
      where: { userId },
      select: { orgId: true },
    });

    if (userMemberships.length <= 1) {
      return NextResponse.json(
        { error: "Cannot delete your last organization" },
        { status: 400 }
      );
    }

    // Find another org to switch to after deletion (exclude requestedOrgId)
    const nextOrgId = userMemberships.find((m) => m.orgId !== requestedOrgId)?.orgId;
    
    if (!nextOrgId) {
      return NextResponse.json(
        { error: "No valid organization to switch to" },
        { status: 400 }
      );
    }

    // Check for force parameter
    const url = new URL(req.url);
    const force = url.searchParams.get("force") === "true";

    // Get data counts for the REQUESTED org (not active org from session)
    const [itemCount, locationCount, movementCount, stockCount] = await Promise.all([
      prisma.item.count({ where: { orgId: requestedOrgId } }),
      prisma.location.count({ where: { orgId: requestedOrgId } }),
      prisma.movement.count({ where: { orgId: requestedOrgId } }),
      prisma.currentStock.count({ where: { orgId: requestedOrgId } }),
    ]);

    const hasData = itemCount > 0 || locationCount > 0 || movementCount > 0 || stockCount > 0;

    // If data exists and no force flag, return counts for confirmation
    if (hasData && !force) {
      return NextResponse.json(
        {
          error: "Organization has existing data",
          requiresConfirmation: true,
          details: {
            items: itemCount,
            locations: locationCount,
            movements: movementCount,
            stock: stockCount,
          },
        },
        { status: 409 } // 409 Conflict - needs user decision
      );
    }

    // Cascade delete in transaction (respects FK constraints)
    // CRITICAL: Use requestedOrgId (validated URL param), NOT activeOrgId from session
    await prisma.$transaction(async (tx) => {
      // Delete in dependency order: most dependent first
      await tx.currentStock.deleteMany({ where: { orgId: requestedOrgId } });
      await tx.movement.deleteMany({ where: { orgId: requestedOrgId } });
      await tx.item.deleteMany({ where: { orgId: requestedOrgId } });
      await tx.location.deleteMany({ where: { orgId: requestedOrgId } });
      await tx.membership.deleteMany({ where: { orgId: requestedOrgId } });
      // Finally, delete organization
      await tx.organization.delete({ where: { id: requestedOrgId } });
    });

    return NextResponse.json({
      message: "Organization deleted successfully",
      nextOrgId, // Return next org to switch to
    });
  } catch (error) {
    console.error("Error deleting organization:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
