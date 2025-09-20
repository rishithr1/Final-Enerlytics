import React, { useState } from 'react';
import { TrendingUp, BarChart } from 'lucide-react';
import { calculateNPVandBCR } from '../../utils/calculations';

const CostBenefitAnalyzer: React.FC = () => {
  const [initialInvestment, setInitialInvestment] = useState<number>(500000);
  const [annualSavings, setAnnualSavings] = useState<number>(100000);
  const [projectLifetime, setProjectLifetime] = useState<number>(10);
  const [discountRate, setDiscountRate] = useState<number>(8);
  
  const [result, setResult] = useState(calculateNPVandBCR(200000, 10000, 10, 0));

  React.useEffect(() => {
    const newResult = calculateNPVandBCR(initialInvestment, annualSavings, projectLifetime, discountRate / 100);
    setResult(newResult);
  }, [initialInvestment, annualSavings, projectLifetime, discountRate]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <BarChart className="h-8 w-8" />
          <div>
            <h2 className="text-2xl font-bold mb-2">Cost Benefit Analysis</h2>
            <p className="text-green-100">Analyze the financial viability of your investment with NPV and BCR</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
            Investment Parameters
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Initial Investment (₹)
              </label>
              <input
                type="number"
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Savings (₹)
              </label>
              <input
                type="number"
                value={annualSavings}
                onChange={(e) => setAnnualSavings(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Rate (%)
              </label>
              <input
                type="number"
                value={discountRate}
                onChange={(e) => setDiscountRate(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0"
                max="20"
                step="0.1"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Analysis Results</h3>
          
          <div className="space-y-4">
            <div className={`text-center p-6 rounded-lg ${
              result.npv > 0 ? 'bg-gradient-to-r from-green-50 to-teal-50' : 'bg-gradient-to-r from-red-50 to-pink-50'
            }`}>
              <div className={`text-3xl font-bold mb-2 ${
                result.npv > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ₹{result.npv.toLocaleString()}
              </div>
              <div className="text-gray-600">Net Present Value (NPV)</div>
              <div className={`text-sm mt-2 ${
                result.npv > 0 ? 'text-green-700' : 'text-red-700'
              }`}>
                {result.npv > 0 ? 'Profitable Investment' : 'Loss Making Investment'}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-xl font-bold text-blue-600">
                  {result.bcr.toFixed(2)}
                </div>
                <div className="text-sm text-blue-700">Benefit-Cost Ratio</div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-xl font-bold text-purple-600">
                  {projectLifetime} years
                </div>
                <div className="text-sm text-purple-700">Project Life</div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Investment Interpretation</h3>
          <div className="space-y-3">
            <div className={`p-4 rounded-lg ${result.npv > 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className={`font-semibold ${result.npv > 0 ? 'text-green-800' : 'text-red-800'}`}>
                NPV Analysis
              </div>
              <div className={`text-sm ${result.npv > 0 ? 'text-green-700' : 'text-red-700'}`}>
                {result.npv > 0 
                  ? 'The project will generate positive returns and should be accepted.'
                  : 'The project will result in a loss and should be rejected.'}
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${result.bcr > 1 ? 'bg-blue-50 border border-blue-200' : 'bg-yellow-50 border border-yellow-200'}`}>
              <div className={`font-semibold ${result.bcr > 1 ? 'text-blue-800' : 'text-yellow-800'}`}>
                BCR Analysis
              </div>
              <div className={`text-sm ${result.bcr > 1 ? 'text-blue-700' : 'text-yellow-700'}`}>
                {result.bcr > 1 
                  ? 'Benefits exceed costs. The investment is financially viable.'
                  : 'Costs exceed benefits. Consider reviewing the investment parameters.'}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Key Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Investment:</span>
              <span className="font-semibold">₹{initialInvestment.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Savings (Undiscounted):</span>
              <span className="font-semibold">₹{(annualSavings * projectLifetime).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Present Value of Savings:</span>
              <span className="font-semibold">₹{(initialInvestment + result.npv).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 font-semibold">
              <span className="text-gray-800">Net Benefit:</span>
              <span className={result.npv > 0 ? 'text-green-600' : 'text-red-600'}>
                ₹{result.npv.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostBenefitAnalyzer;