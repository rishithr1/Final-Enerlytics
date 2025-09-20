import React, { useMemo, useState, useEffect } from 'react';
import { Sun, Calculator, Zap, TrendingUp, Info } from 'lucide-react';
import { generateSolarRecommendation } from '../../utils/calculations';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const SolarRecommendations: React.FC = () => {
  const { user } = useAuth();
  const [monthlyBill, setMonthlyBill] = useState<number>(6000);
  const [tariffType, setTariffType] = useState<'domestic' | 'commercial'>('domestic');
  
  const recommendation = useMemo(() => 
    generateSolarRecommendation(monthlyBill, tariffType), 
    [monthlyBill, tariffType]
  );
  
  // Calculate daily units from the accurate monthly units
  const dailyUnits = recommendation.monthlyUnits / 30;

  useEffect(() => {
    if (user && monthlyBill > 0) {
      const t = setTimeout(() => {
        void saveRecommendationToHistory({ monthlyBill, tariffType }, recommendation);
      }, 800);
      return () => clearTimeout(t);
    }
  }, [user, monthlyBill, tariffType, recommendation]);

  const saveRecommendationToHistory = async (inputs: any, results: any) => {
    try {
      await supabase.from('recommendation_history').insert({
        user_id: user?.id,
        recommendation_type: 'solar',
        inputs,
        results,
      });
    } catch (error) {
      console.error('Error saving recommendation history:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <Sun className="h-8 w-8" />
          <div>
            <h2 className="text-2xl font-bold mb-2">Personalized Solar Recommendations</h2>
            <p className="text-yellow-100">Get customized solar solutions based on your electricity bill</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
            <Calculator className="h-5 w-5 mr-2 text-yellow-500" />
            Your Electricity Details
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tariff Type
              </label>
              <select
                value={tariffType}
                onChange={(e) => setTariffType(e.target.value as 'domestic' | 'commercial')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="domestic">Domestic</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Electricity Bill (₹)
              </label>
              <input
                type="number"
                value={monthlyBill}
                onChange={(e) => setMonthlyBill(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                min="0"
                placeholder="Enter your monthly bill amount"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Recommendation Status</h3>
          
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Monthly Units (Calculated):</span>
              <span className="font-semibold text-gray-800">{recommendation.monthlyUnits.toFixed(1)} kWh</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-600">Daily Units:</span>
              <span className="font-semibold text-gray-800">{dailyUnits.toFixed(1)} kWh/day</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-600">Actual Bill (Verified):</span>
              <span className="font-semibold text-gray-800">₹{recommendation.actualBill.toFixed(0)}</span>
            </div>
            <div className="text-xs text-gray-500 mt-2 flex items-center">
              <Info className="h-3 w-3 mr-1" />
              Using accurate {tariffType} telescopic tariff calculation
            </div>
          </div>
          
          {/* Tariff Breakdown */}
          {recommendation.breakdown.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">Tariff Breakdown</h4>
              <div className="space-y-1">
                {recommendation.breakdown.map((item, index) => (
                  <div key={index} className="flex justify-between text-xs">
                    <span className="text-blue-600">Units {item.slab}: {item.units.toFixed(1)} @ ₹{item.rate}</span>
                    <span className="font-semibold text-blue-800">₹{item.amount.toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {!recommendation.recommendSolar ? (
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-lg font-semibold text-blue-800 mb-2">
                Solar Not Recommended
              </div>
              <div className="text-blue-700">
                Your monthly bill is ₹{monthlyBill.toLocaleString()}. Solar is typically cost-effective for bills above ₹4,000/month.
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  ✓ Solar Recommended
                </div>
                <div className="text-orange-700">Perfect candidate for solar installation</div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-green-600">
                    {recommendation.requiredKW} kW
                  </div>
                  <div className="text-xs text-green-700">System Size</div>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {recommendation.paybackPeriod.toFixed(1)} years
                  </div>
                  <div className="text-xs text-blue-700">Payback Period</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {recommendation.recommendSolar && (
        <>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-3">
                <Zap className="h-5 w-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-800">System Specifications</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Required Capacity:</span>
                  <span className="font-semibold">{recommendation.requiredKW} kW</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Generation:</span>
                  <span className="font-semibold">{recommendation.estimatedGeneration.toFixed(0)} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Consumption:</span>
                  <span className="font-semibold">{recommendation.monthlyUnits.toFixed(1)} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">System Type:</span>
                  <span className="font-semibold">Grid-tied</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Panel Type:</span>
                  <span className="font-semibold">Monocrystalline</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-800">Financial Benefits</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">System Size:</span>
                  <span className="font-semibold">{recommendation.requiredKW} kW</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Investment Cost:</span>
                  <span className="font-semibold">₹{recommendation.investment.toLocaleString()}</span>
                </div>
                {recommendation.costRange && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Cost Range:</span>
                    <span className="font-semibold text-sm text-blue-600">{recommendation.costRange}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Savings:</span>
                  <span className="font-semibold text-green-600">₹{recommendation.savings.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Bill:</span>
                  <span className="font-semibold">₹{recommendation.actualBill.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Post-Solar Bill:</span>
                  <span className="font-semibold text-green-600">₹{(recommendation.actualBill - recommendation.savings).toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Annual Savings:</span>
                  <span className="font-semibold text-green-600">₹{(recommendation.savings * 12).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">25-year Savings:</span>
                  <span className="font-semibold text-green-600">₹{(recommendation.savings * 12 * 25).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Environmental Impact</h3>
              
              <div className="space-y-3">
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-sm text-green-600">CO2 Reduction/Year</div>
                  <div className="font-bold text-green-800">
                    {(recommendation.estimatedGeneration * 12 * 0.82).toFixed(0)} kg
                  </div>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-sm text-blue-600">Trees Equivalent</div>
                  <div className="font-bold text-blue-800">
                    {Math.round(recommendation.estimatedGeneration * 12 * 0.82 / 22)} trees
                  </div>
                </div>
                
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="text-sm text-purple-600">Coal Offset/Year</div>
                  <div className="font-bold text-purple-800">
                    {(recommendation.estimatedGeneration * 12 * 0.4).toFixed(0)} kg
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Installation Guidelines</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Site Requirements</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• South-facing roof with minimal shading</li>
                  <li>• Roof area: {(recommendation.requiredKW * 80).toFixed(0)} sq ft minimum</li>
                  <li>• Roof age: Less than 10 years preferred</li>
                  <li>• Structural capacity: 15-20 kg/sq meter</li>
                  <li>• Clear access for maintenance</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Next Steps</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Get professional site assessment</li>
                  <li>• Obtain multiple quotes from certified installers</li>
                  <li>• Check for government subsidies and net metering</li>
                  <li>• Ensure proper permits and approvals</li>
                  <li>• Plan for system monitoring and maintenance</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Government Incentives</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="font-semibold text-orange-800">Central Government Subsidy</div>
                <div className="text-sm text-orange-700">Up to 40% subsidy for residential systems up to 3kW</div>
              </div>
              <div>
                <div className="font-semibold text-yellow-800">Net Metering Benefits</div>
                <div className="text-sm text-yellow-700">Sell excess power back to the grid at attractive rates</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SolarRecommendations;