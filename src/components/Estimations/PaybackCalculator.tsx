import React, { useState } from 'react';
import { Clock, DollarSign } from 'lucide-react';
import { calculatePaybackPeriod } from '../../utils/calculations';
import PaybackChart from '../Charts/PaybackChart';

const PaybackCalculator: React.FC = () => {
  const [initialInvestment, setInitialInvestment] = useState<number>(500000);
  const [monthlySavings, setMonthlySavings] = useState<number>(8000);
  const [paybackPeriod, setPaybackPeriod] = useState<number>(calculatePaybackPeriod(500000, 8000));

  React.useEffect(() => {
    const period = calculatePaybackPeriod(initialInvestment, monthlySavings);
    setPaybackPeriod(period);
  }, [initialInvestment, monthlySavings]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <Clock className="h-8 w-8" />
          <div>
            <h2 className="text-2xl font-bold mb-2">Payback Period Calculator</h2>
            <p className="text-blue-100">Calculate how long it takes to recover your investment</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-green-500" />
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Savings (₹)
              </label>
              <input
                type="number"
                value={monthlySavings}
                onChange={(e) => setMonthlySavings(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Payback Analysis</h3>
          
          <div className="space-y-4">
            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {paybackPeriod.toFixed(1)} years
              </div>
              <div className="text-gray-600">Payback Period</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-lg font-bold text-green-600">
                  ₹{(monthlySavings * 12).toLocaleString()}
                </div>
                <div className="text-sm text-green-700">Annual Savings</div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-lg font-bold text-blue-600">
                  {(paybackPeriod * 12).toFixed(0)} months
                </div>
                <div className="text-sm text-blue-700">Months to Payback</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PaybackChart 
        initialInvestment={initialInvestment}
        monthlySavings={monthlySavings}
        paybackPeriod={paybackPeriod}
      />

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Investment Timeline</h3>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((year) => {
            const cumulativeSavings = monthlySavings * 12 * year;
            const isBreakEven = year >= paybackPeriod;
            return (
              <div key={year} className={`flex justify-between items-center p-3 rounded-lg ${
                isBreakEven ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
              }`}>
                <span className="font-medium">Year {year}</span>
                <span className={`font-bold ${isBreakEven ? 'text-green-600' : 'text-gray-600'}`}>
                  ₹{cumulativeSavings.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PaybackCalculator;