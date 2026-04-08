/**
 * Indicators Module - Business Logic
 */

import { IndicatorsRepository } from "./repository";
import { prisma } from "@/lib/db";
import type { InventoryIndicators } from "./types";

export class IndicatorsService {
  constructor(private repo: IndicatorsRepository) {}

  async getInventoryIndicators(orgId: string): Promise<InventoryIndicators> {
    const [lowStock, largeOutbound, frequentAdjustments] = await Promise.all([
      this.repo.getLowStockItems(orgId),
      this.repo.getLargeOutboundItems(orgId, 7),
      this.repo.getFrequentAdjustmentItems(orgId, 7, 3),
    ]);

    return {
      lowStock,
      largeOutbound,
      frequentAdjustments,
    };
  }
}

/**
 * Standalone factory function — preferred public API.
 * Callers should use this instead of manually instantiating
 * IndicatorsService + IndicatorsRepository.
 *
 * @example
 * import { getInventoryIndicators } from "@/modules/indicators";
 * const indicators = await getInventoryIndicators(orgId);
 */
export async function getInventoryIndicators(
  orgId: string,
): Promise<InventoryIndicators> {
  const repo = new IndicatorsRepository(prisma);
  const service = new IndicatorsService(repo);
  return service.getInventoryIndicators(orgId);
}
