import { NextRequest, NextResponse } from "next/server";
import { requireAuthWithOrg } from "@/lib/api-auth";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    // Verify authentication and org membership
    const auth = await requireAuthWithOrg();
    if (!auth.success) return auth.response;

    const { orgId: activeOrgId, orgRole } = auth;
    const { orgId: requestedOrgId } = await params;

    // Verify user is accessing their active org (prevent cross-org access)
    if (requestedOrgId !== activeOrgId) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    // Only ORG_ADMIN can view members list
    if (orgRole !== "ORG_ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Fetch members with user details (use requestedOrgId, not activeOrgId)
    const members = await prisma.membership.findMany({
      where: {
        orgId: requestedOrgId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        role: "desc", // ORG_ADMIN first
      },
    });

    return NextResponse.json({
      members: members.map((m) => ({
        id: m.user.id,
        name: m.user.name,
        email: m.user.email,
        role: m.role,
      })),
    });
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
