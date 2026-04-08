/**
 * Indicators Module - Public exports
 */

export { IndicatorsService, getInventoryIndicators } from "./service";
export { IndicatorsApiError } from "./errors";

export type {
  LowStockItem,
  LargeOutboundItem,
  FrequentAdjustmentItem,
  InventoryIndicators,
} from "./types";
