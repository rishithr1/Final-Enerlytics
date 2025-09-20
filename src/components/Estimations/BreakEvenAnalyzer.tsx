import React, { useState } from 'react';
import { Target, Activity } from 'lucide-react';
import { calculateBreakEven } from '../../utils/calculations';

const BreakEvenAnalyzer: React.FC = () => {
  const [fixedCosts, setFixedCosts] = useState<number>(100000);
  const [variableCostPerUnit, setVariableCostPerUnit] = useState<number>(15);
  const [pricePerUnit, setPricePerUnit] = useState<number>(25);
  
  const [result, setResult] = useState(calculateBreakEven(100000, 15, 25));

  React.useEffect(() => {
    const newResult = calculateBreakEven(fixedCosts, variableCostPerUnit, pricePerUnit);
    setResult(newResult);
  }, [fixedCosts, variableCostPerUnit, pricePerUnit]);

  const contributionMargin = pricePerUnit - variableCostPerUnit;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <Target className="h-8 w-8" />
          <div>
            <h2 className="text-2xl font-bold mb-2">Break-even Analysis</h2>
            <p className="text-purple-100">Determine the minimum sales volume needed to cover all costs</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-purple-500" />
            Cost Parameters
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fixed Costs (₹)
              </label>
              <input
                type="number"
                value={fixedCosts}
                onChange={(e) => setFixedCosts(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Variable Cost per Unit (₹)
              </label>
              <input
                type="number"
                value={variableCostPerUnit}
                onChange={(e) => setVariableCostPerUnit(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selling Price per Unit (₹)
              </label>
              <input
                type="number"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Break-even Results</h3>
          
          <div className="space-y-4">
            <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {isFinite(result.breakEvenUnits) ? Math.ceil(result.breakEvenUnits).toLocaleString() : 'N/A'}
              </div>
              <div className="text-gray-600">Break-even Units</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-lg font-bold text-green-600">
                  ₹{isFinite(result.breakEvenRevenue) ? result.breakEvenRevenue.toLocaleString() : 'N/A'}
                </div>
                <div className="text-sm text-green-700">Break-even Revenue</div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-lg font-bold text-blue-600">
                  ₹{contributionMargin.toFixed(2)}
                </div>
                <div className="text-sm text-blue-700">Contribution Margin</div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Analysis Interpretation</h3>
          <div className="space-y-3">
            {contributionMargin <= 0 ? (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <div className="font-semibold text-red-800">Invalid Configuration</div>
                <div className="text-sm text-red-700">
                  Selling price must be higher than variable cost per unit to achieve break-even.
                </div>
              </div>
            ) : (
              <>
                <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                  <div className="font-semibold text-purple-800">Break-even Point</div>
                  <div className="text-sm text-purple-700">
                    You need to sell {Math.ceil(result.breakEvenUnits).toLocaleString()} units to cover all costs.
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="font-semibold text-blue-800">Margin Analysis</div>
                  <div className="text-sm text-blue-700">
                    Each unit contributes ₹{contributionMargin.toFixed(2)} towards covering fixed costs.
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Cost Structure</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Fixed Costs:</span>
              <span className="font-semibold">₹{fixedCosts.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Variable Cost/Unit:</span>
              <span className="font-semibold">₹{variableCostPerUnit.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Selling Price/Unit:</span>
              <span className="font-semibold">₹{pricePerUnit.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 font-semibold">
              <span className="text-gray-800">Contribution Margin:</span>
              <span className={contributionMargin > 0 ? 'text-green-600' : 'text-red-600'}>
                ₹{contributionMargin.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakEvenAnalyzer;