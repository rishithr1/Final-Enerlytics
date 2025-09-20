import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Clock, BarChart, Target, Percent, TrendingUp, DollarSign } from 'lucide-react';
import PaybackChart from '../Charts/PaybackChart';

interface EstimationResults {
  paybackPeriod: number;
  totalSavings25Years: number;
  breakEvenYear: number;
  annualROI: number;
  cumulativeROI25Years: number;
  netProfit25Years: number;
}

const UnifiedEstimator: React.FC = () => {
  const { user } = useAuth();
  const [installationCost, setInstallationCost] = useState<number>(500000);
  const [annualSaving, setAnnualSaving] = useState<number>(96000);
  const [monthlySavings, setMonthlySavings] = useState<number>(8000);
  
  // NPV analysis parameters
  const [projectLifetime, setProjectLifetime] = useState<number>(10);
  const [discountRate, setDiscountRate] = useState<number>(8);
  
  // Memoized results to avoid extra renders
  const results: EstimationResults = useMemo(() => {
    if (installationCost > 0 && annualSaving > 0) {
      const paybackPeriod = installationCost / annualSaving;
      const totalSavings25Years = annualSaving * projectLifetime;
      const breakEvenYear = paybackPeriod;
      const annualROI = (annualSaving / installationCost) * 100;
      const cumulativeROI25Years = ((totalSavings25Years - installationCost) / installationCost) * 100;
      const netProfit25Years = totalSavings25Years - installationCost;
      return {
        paybackPeriod,
        totalSavings25Years,
        breakEvenYear,
        annualROI,
        cumulativeROI25Years,
        netProfit25Years,
      };
    }
    return {
      paybackPeriod: 0,
      totalSavings25Years: 0,
      breakEvenYear: 0,
      annualROI: 0,
      cumulativeROI25Years: 0,
      netProfit25Years: 0,
    };
  }, [installationCost, annualSaving, projectLifetime]);

  // Debounced save: avoid write storms while typing
  useEffect(() => {
    if (!user || installationCost <= 0 || annualSaving <= 0) return;
    const debounce = setTimeout(() => {
      void saveEstimationToHistory({
        installationCost,
        annualSaving,
        projectLifetime,
        discountRate,
      }, results);
    }, 800);
    return () => clearTimeout(debounce);
    // Include results to persist the computed values corresponding to inputs
  }, [user, installationCost, annualSaving, projectLifetime, discountRate, results]);

  // Update monthly savings when annual savings change
  useEffect(() => {
    setMonthlySavings(annualSaving / 12);
  }, [annualSaving]);

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const formatYears = (years: number) => {
    if (years < 1) {
      return `${(years * 12).toFixed(1)} months`;
    }
    return `${years.toFixed(1)} years`;
  };

  // Generate data for charts (memoized)
  const chartData = useMemo(() => {
    const data: Array<{ year: number; cumulativeSavings: number; netPosition: number; roi: number; isBreakEven: boolean }> = [];
    for (let year = 1; year <= projectLifetime; year++) {
      const cumulativeSavings = annualSaving * year;
      const netPosition = cumulativeSavings - installationCost;
      const roi = ((cumulativeSavings - installationCost) / installationCost) * 100;
      data.push({
        year,
        cumulativeSavings,
        netPosition,
        roi,
        isBreakEven: year >= results.breakEvenYear,
      });
    }
    return data;
  }, [annualSaving, installationCost, results.breakEvenYear, projectLifetime]);

  const saveEstimationToHistory = async (inputs: any, results: EstimationResults) => {
    try {
      await supabase.from('estimation_history').insert({
        user_id: user?.id,
        estimation_type: 'unified',
        inputs,
        results,
      });
    } catch (error) {
      console.error('Error saving estimation history:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <TrendingUp className="h-8 w-8" />
          <div>
            <h2 className="text-2xl font-bold mb-2">Unified Solar Investment Estimator</h2>
            <p className="text-blue-100">Comprehensive analysis with all financial metrics and visualizations</p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <DollarSign className="h-5 w-5 mr-2 text-green-500" />
          Investment Parameters
        </h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Installation Cost (₹)
            </label>
            <input
              type="number"
              value={installationCost}
              onChange={(e) => setInstallationCost(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              placeholder="Enter installation cost"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Annual Saving (₹)
            </label>
            <input
              type="number"
              value={annualSaving}
              onChange={(e) => setAnnualSaving(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              placeholder="Enter annual savings"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Lifetime (years)
            </label>
            <input
              type="number"
              value={projectLifetime}
              onChange={(e) => setProjectLifetime(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
              placeholder="Project lifetime"
            />
          </div>
        </div>

        {/* Discount Rate */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Discount Rate (%)
          </label>
          <input
            type="number"
            value={discountRate}
            onChange={(e) => setDiscountRate(parseFloat(e.target.value) || 0)}
            className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            max="20"
            step="0.1"
            placeholder="Discount rate"
          />
        </div>
      </div>

      {/* Results Grid - All 4 Analyses */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Payback Period */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Payback Period</h3>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {formatYears(results.paybackPeriod)}
            </div>
            <div className="text-sm text-gray-600 mb-3">
              Time to recover investment
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm text-blue-700">
                <div>Monthly: {formatCurrency(annualSaving / 12)}</div>
                <div>Annual: {formatCurrency(annualSaving)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Benefit Analysis */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <BarChart className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Cost Benefit</h3>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {formatCurrency(results.totalSavings25Years)}
            </div>
            <div className="text-sm text-gray-600 mb-3">
              Total savings over {projectLifetime} {projectLifetime === 1 ? 'year' : 'years'}
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-sm text-green-700">
                <div>Net Profit: {formatCurrency(results.netProfit25Years)}</div>
                <div>Benefit Ratio: {(results.totalSavings25Years / installationCost).toFixed(2)}:1</div>
              </div>
            </div>
          </div>
        </div>

        {/* Break-even Analysis */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Target className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Break-even</h3>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              Year {results.breakEvenYear.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600 mb-3">
              When savings = investment
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="text-sm text-orange-700">
                <div>Break-even: {formatYears(results.breakEvenYear)}</div>
                <div>After: {formatCurrency(installationCost)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ROI Analysis */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Percent className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Return on Investment</h3>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {formatPercentage(results.annualROI)}
            </div>
            <div className="text-sm text-gray-600 mb-3">
              Annual return rate
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-sm text-purple-700">
                <div>25-year ROI: {formatPercentage(results.cumulativeROI25Years)}</div>
                <div>Net Profit: {formatCurrency(results.netProfit25Years)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Charts Section */}
      <div className="space-y-6">
        {/* Payback Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Payback Period Analysis</h3>
          <div className="h-96">
            <PaybackChart 
              initialInvestment={installationCost}
              monthlySavings={monthlySavings}
              paybackPeriod={results.paybackPeriod}
              projectLifetime={projectLifetime}
            />
          </div>
        </div>

      </div>


      {/* Detailed Timeline Analysis */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Investment Timeline Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Year</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Annual Savings</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Cumulative Savings</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Net Position</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">ROI</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 10, 15, 20, 25].filter((y) => y <= projectLifetime).map((year) => {
                const annualSavings = annualSaving;
                const cumulativeSavings = annualSavings * year;
                const netPosition = cumulativeSavings - installationCost;
                const isBreakEven = year >= results.breakEvenYear;
                const roi = ((cumulativeSavings - installationCost) / installationCost) * 100;
                
                return (
                  <tr key={year} className={`border-b border-gray-100 ${
                    isBreakEven ? 'bg-green-50' : ''
                  }`}>
                    <td className="py-3 px-4 font-medium">
                      Year {year}
                      {isBreakEven && year === Math.ceil(results.breakEvenYear) && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Break-even
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">{formatCurrency(annualSavings)}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(cumulativeSavings)}</td>
                    <td className={`py-3 px-4 text-right font-semibold ${
                      netPosition >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(netPosition)}
                    </td>
                    <td className={`py-3 px-4 text-right ${
                      roi >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatPercentage(roi)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Key Investment Insights</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-700">
                <strong>Payback Period:</strong> Your investment will be recovered in {formatYears(results.paybackPeriod)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">
                <strong>{projectLifetime}-Year Benefit:</strong> Total savings of {formatCurrency(results.totalSavings25Years)} over system lifetime
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-700">
                <strong>Break-even Point:</strong> You'll start profiting after {results.breakEvenYear.toFixed(1)} years
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-700">
                <strong>Annual ROI:</strong> {formatPercentage(results.annualROI)} return on your investment
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedEstimator;
