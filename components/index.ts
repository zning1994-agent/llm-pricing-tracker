// Re-export components from src/components
export { default as Header, Header as HeaderComponent } from '../src/components/Header';
export type { HeaderProps } from '../src/components/Header';

export { default as LastUpdated, LastUpdated as LastUpdatedComponent } from '../src/components/LastUpdated';
export type { LastUpdatedProps } from '../src/components/LastUpdated';

export { default as PricingTable, PricingTable as PricingTableComponent } from '../src/components/PricingTable';
export type { PricingTableProps, PricingPlan } from '../src/components/PricingTable';

export { default as BenchmarkChart, BenchmarkChart as BenchmarkChartComponent } from '../src/components/BenchmarkChart';
export type { BenchmarkChartProps, BenchmarkScore, BenchmarkType } from '../src/components/BenchmarkChart';

export { default as CapabilityMatrix, CapabilityMatrix as CapabilityMatrixComponent } from '../src/components/CapabilityMatrix';
export type { CapabilityMatrixProps, ModelCapability, CapabilityCategory, CapabilityLevel } from '../src/components/CapabilityMatrix';
