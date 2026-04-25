import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import LastUpdated from './components/LastUpdated';
import RefreshButton from '../components/RefreshButton';
import PricingTable from './components/PricingTable';
import BenchmarkChart from './components/BenchmarkChart';
import CapabilityMatrix from './components/CapabilityMatrix';
import { modelsData } from './data/models';

const App: React.FC = () => {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    // Simulate data refresh - in production this would fetch new data
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLastUpdated(new Date());
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onDataRefresh={handleRefresh} />

      {/* Status Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Data Status:</span>
              <LastUpdated lastUpdated={lastUpdated} />
            </div>
            <RefreshButton onClick={handleRefresh} isLoading={isLoading} disabled={isLoading} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-1 xl:grid-cols-2">
          {/* Pricing Table - Full width */}
          <section className="xl:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing Comparison</h2>
            <PricingTable models={modelsData} />
          </section>

          {/* Benchmark Chart */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Benchmark Scores</h2>
            <BenchmarkChart models={modelsData} />
          </section>

          {/* Capability Matrix */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Capability Matrix</h2>
            <CapabilityMatrix models={modelsData} />
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;
