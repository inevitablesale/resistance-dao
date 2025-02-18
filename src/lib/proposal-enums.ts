
export enum FirmSize {
  BELOW_1M,
  ONE_TO_FIVE_M,
  FIVE_TO_TEN_M,
  TEN_PLUS
}

export enum DealType {
  ACQUISITION,
  MERGER,
  EQUITY_BUYOUT,
  FRANCHISE,
  SUCCESSION
}

export enum GeographicFocus {
  LOCAL,
  REGIONAL,
  NATIONAL,
  REMOTE
}

export enum PaymentTerm {
  CASH,
  SELLER_FINANCING,
  EARNOUT,
  EQUITY_ROLLOVER,
  BANK_FINANCING
}

export enum OperationalStrategy {
  TECH_MODERNIZATION,
  PROCESS_STANDARDIZATION,
  STAFF_RETENTION
}

export enum GrowthStrategy {
  GEOGRAPHIC_EXPANSION,
  SERVICE_EXPANSION,
  CLIENT_GROWTH
}

export enum IntegrationStrategy {
  MERGING_OPERATIONS,
  CULTURE_INTEGRATION,
  SYSTEMS_CONSOLIDATION
}

export const FIRM_SIZE_LABELS: Record<FirmSize, string> = {
  [FirmSize.BELOW_1M]: "Below $1M Revenue",
  [FirmSize.ONE_TO_FIVE_M]: "$1M - $5M Revenue",
  [FirmSize.FIVE_TO_TEN_M]: "$5M - $10M Revenue",
  [FirmSize.TEN_PLUS]: "$10M+ Revenue"
};

export const DEAL_TYPE_LABELS: Record<DealType, string> = {
  [DealType.ACQUISITION]: "Full Acquisition",
  [DealType.MERGER]: "Merger",
  [DealType.EQUITY_BUYOUT]: "Equity Buyout",
  [DealType.FRANCHISE]: "Franchise",
  [DealType.SUCCESSION]: "Succession Planning"
};

export const GEOGRAPHIC_FOCUS_LABELS: Record<GeographicFocus, string> = {
  [GeographicFocus.LOCAL]: "Local",
  [GeographicFocus.REGIONAL]: "Regional",
  [GeographicFocus.NATIONAL]: "National",
  [GeographicFocus.REMOTE]: "Remote"
};

export const PAYMENT_TERM_LABELS: Record<PaymentTerm, string> = {
  [PaymentTerm.CASH]: "Cash",
  [PaymentTerm.SELLER_FINANCING]: "Seller Financing",
  [PaymentTerm.EARNOUT]: "Earnout",
  [PaymentTerm.EQUITY_ROLLOVER]: "Equity Rollover",
  [PaymentTerm.BANK_FINANCING]: "Bank Financing"
};

export const OPERATIONAL_STRATEGY_LABELS: Record<OperationalStrategy, string> = {
  [OperationalStrategy.TECH_MODERNIZATION]: "Technology Modernization",
  [OperationalStrategy.PROCESS_STANDARDIZATION]: "Process Standardization",
  [OperationalStrategy.STAFF_RETENTION]: "Staff Retention & Development"
};

export const GROWTH_STRATEGY_LABELS: Record<GrowthStrategy, string> = {
  [GrowthStrategy.GEOGRAPHIC_EXPANSION]: "Geographic Expansion",
  [GrowthStrategy.SERVICE_EXPANSION]: "Service Line Expansion",
  [GrowthStrategy.CLIENT_GROWTH]: "Client Base Growth"
};

export const INTEGRATION_STRATEGY_LABELS: Record<IntegrationStrategy, string> = {
  [IntegrationStrategy.MERGING_OPERATIONS]: "Merging Operations",
  [IntegrationStrategy.CULTURE_INTEGRATION]: "Cultural Integration",
  [IntegrationStrategy.SYSTEMS_CONSOLIDATION]: "Systems Consolidation"
};
