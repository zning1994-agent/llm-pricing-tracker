import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import LastUpdated from './components/LastUpdated';
import PricingTable from './components/PricingTable';
import BenchmarkChart from './components/BenchmarkChart';
import CapabilityMatrix from './components/CapabilityMatrix';
import { modelsData } from './data/models';

const App: React.FC = () => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const handleRefresh = useCallback(async () => {
    // Simulate data refresh - in production this would fetch new data
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLastUpdated(new Date());
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onDataRefresh={handleRefresh} lastRefreshed={lastUpdated} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Model Data</h2>
          <LastUpdated lastUpdated={lastUpdated} />
        </div>

        <div className="grid gap-6">
          <section>
            <h3 className="text-md font-medium text-gray-700 mb-4">Pricing Comparison</h3>
            <PricingTable models={modelsData} />
          </section>

          <section>
            <h3 className="text-md font-medium text-gray-700 mb-4">Benchmark Scores</h3>
            <BenchmarkChart models={modelsData} />
          </section>

          <section>
            <h3 className="text-md font-medium text-gray-700 mb-4">Capability Matrix</h3>
            <CapabilityMatrix models={modelsData} />
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;
