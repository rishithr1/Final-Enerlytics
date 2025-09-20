import React, { useState } from 'react';
import { TrendingUp, Percent } from 'lucide-react';
import { calculateROI } from '../../utils/calculations';

const ROICalculator: React.FC = () => {
  const [initialInvestment, setInitialInvestment] = useState<number>(500000);
  const [netProfit, setNetProfit] = useState<number>(150000);
  const [roi, setRoi] = useState<number>(calculateROI(500000, 150000));

  React.useEffect(() => {
    const newRoi = calculateROI(initialInvestment, netProfit);
    setRoi(newRoi);
  }, [initialInvestment, netProfit]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <Percent className="h-8 w-8" />
          <div>
            <h2 className="text-2xl font-bold mb-2">Return on Investment Calculator</h2>
            <p className="text-indigo-100">Calculate the efficiency of your investment returns</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-indigo-500" />
            Investment Details
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Net Profit (₹)
              </label>
              <input
                type="number"
                value={netProfit}
                onChange={(e) => setNetProfit(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <div className="text-xs text-gray-500 mt-1">
                Net profit over the entire investment period
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">ROI Analysis</h3>
          
          <div className="space-y-4">
            <div className={`text-center p-6 rounded-lg ${
              roi > 0 ? 'bg-gradient-to-r from-green-50 to-teal-50' : 'bg-gradient-to-r from-red-50 to-pink-50'
            }`}>
              <div className={`text-4xl font-bold mb-2 ${
                roi > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {roi.toFixed(2)}%
              </div>
              <div className="text-gray-600">Return on Investment</div>
              <div className={`text-sm mt-2 ${
                roi > 0 ? 'text-green-700' : 'text-red-700'
              }`}>
                {roi > 0 ? 'Profitable Investment' : 'Loss Making Investment'}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-lg font-bold text-blue-600">
                  ₹{initialInvestment.toLocaleString()}
                </div>
                <div className="text-sm text-blue-700">Investment</div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className={`text-lg font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{netProfit.toLocaleString()}
                </div>
                <div className="text-sm text-purple-700">Net Profit</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">ROI Interpretation</h3>
          <div className="space-y-3">
            {roi > 20 && (
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <div className="font-semibold text-green-800">Excellent ROI</div>
                <div className="text-sm text-green-700">
                  Your investment is generating exceptional returns above 20%.
                </div>
              </div>
            )}
            
            {roi > 10 && roi <= 20 && (
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <div className="font-semibold text-blue-800">Good ROI</div>
                <div className="text-sm text-blue-700">
                  Your investment is generating healthy returns between 10-20%.
                </div>
              </div>
            )}
            
            {roi > 0 && roi <= 10 && (
              <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                <div className="font-semibold text-yellow-800">Moderate ROI</div>
                <div className="text-sm text-yellow-700">
                  Your investment is generating modest returns below 10%.
                </div>
              </div>
            )}
            
            {roi <= 0 && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <div className="font-semibold text-red-800">Negative ROI</div>
                <div className="text-sm text-red-700">
                  Your investment is generating losses. Consider reviewing your strategy.
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Calculation Formula</h3>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">ROI Formula:</div>
              <div className="font-mono text-lg text-center p-3 bg-white rounded border">
                ROI = (Net Profit ÷ Investment) × 100
              </div>
            </div>
            
            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="text-sm text-indigo-600 mb-2">Your Calculation:</div>
              <div className="font-mono text-sm text-center">
                ROI = (₹{netProfit.toLocaleString()} ÷ ₹{initialInvestment.toLocaleString()}) × 100
              </div>
              <div className="font-mono text-sm text-center mt-1">
                ROI = {roi.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">ROI Benchmarks</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-lg font-bold text-red-600">&lt; 0%</div>
            <div className="text-sm text-red-700">Loss</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-lg font-bold text-yellow-600">0-10%</div>
            <div className="text-sm text-yellow-700">Low</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">10-20%</div>
            <div className="text-sm text-blue-700">Good</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">&gt; 20%</div>
            <div className="text-sm text-green-700">Excellent</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROICalculator;