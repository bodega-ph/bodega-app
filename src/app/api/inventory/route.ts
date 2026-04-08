import { NextResponse } from "next/server";
import { requireAuthWithOrg } from "@/lib/api-auth";
import { getInventoryPage } from "@/modules/inventory";

function parsePaginationParam(
  value: string | null,
  fallback: number,
  min: number,
  max: number,
): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

export async function GET(request: Request) {
  const auth = await requireAuthWithOrg();
  if (!auth.success) return auth.response;
  const { orgId } = auth;

  const { searchParams } = new URL(request.url);
  const page = parsePaginationParam(searchParams.get("page"), 1, 1, 10_000);
  const limit = parsePaginationParam(searchParams.get("limit"), 50, 1, 100);

  // Pagination is pushed down to the database — no full-table fetch.
  const result = await getInventoryPage(orgId, page, limit);

  return NextResponse.json(result);
}
