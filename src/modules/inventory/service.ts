/**
 * Inventory Service - Public API for the inventory module
 * Imports from items and locations modules for select data
 */
import * as repo from "./repository";
import { getItemsForSelect } from "@/modules/items";
import { getLocationsForSelect } from "@/modules/locations";
import { getOrganizationName } from "@/modules/organizations";
import { generateInventoryCsv, type CsvExportResult } from "./csv-generator";
import type { InventoryPageData, InventoryRow } from "./types";

export type { InventoryPageData, InventoryRow } from "./types";

export type PaginatedInventoryResponse = {
  inventory: InventoryRow[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

function toInventoryRow(row: {
  id: string;
  quantity: { toString(): string };
  item: {
    id: string;
    name: string;
    sku: string;
    unit: string;
    category: string | null;
    lowStockThreshold: { toString(): string } | null;
  };
  location: { id: string; name: string };
}): InventoryRow {
  return {
    id: row.id,
    quantity: row.quantity.toString(),
    item: {
      ...row.item,
      lowStockThreshold: row.item.lowStockThreshold?.toString() ?? null,
    },
    location: row.location,
  };
}

export async function getInventory(orgId: string): Promise<InventoryPageData> {
  const [rawInventory, items, locations] = await Promise.all([
    repo.listCurrentStock(orgId),
    getItemsForSelect(orgId),
    getLocationsForSelect(orgId),
  ]);

  const inventory: InventoryRow[] = rawInventory.map(toInventoryRow);

  return { inventory, items, locations };
}

/**
 * Get a single page of inventory rows with DB-level pagination.
 * Prefer this over getInventory() in API routes.
 */
export async function getInventoryPage(
  orgId: string,
  page: number,
  limit: number,
): Promise<PaginatedInventoryResponse> {
  const { rows, total } = await repo.listCurrentStockPage(orgId, page, limit);

  return {
    inventory: rows.map(toInventoryRow),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get count of stock rows in organization.
 * Cross-module service function for aggregation.
 */
export async function getDataCount(orgId: string): Promise<number> {
  return repo.countStock(orgId);
}

/**
 * Get low stock items for dashboard display.
 */
export async function getLowStockItems(orgId: string): Promise<InventoryRow[]> {
  const stock = await repo.listCurrentStock(orgId);

  return stock
    .filter((row) => {
      const qty = Number(row.quantity);
      const threshold = row.item.lowStockThreshold
        ? Number(row.item.lowStockThreshold)
        : 0;
      return threshold > 0 && qty <= threshold;
    })
    .map(toInventoryRow);
}

/**
 * Generate CSV export of inventory
 */
export async function generateInventoryCsvExport(
  orgId: string,
  limit?: number,
): Promise<CsvExportResult> {
  const [rows, orgName] = await Promise.all([
    repo.getInventoryForExport(orgId, limit),
    getOrganizationName(orgId),
  ]);

  return generateInventoryCsv(rows, orgName ?? "inventory");
}
