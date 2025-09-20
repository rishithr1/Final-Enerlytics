import React, { useState } from 'react';
import { Plus, Trash2, Building, Zap } from 'lucide-react';
import { calculateCommercialBill } from '../../utils/calculations';
import { Appliance } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import BillBreakdownChart from '../Charts/BillBreakdownChart';
import EnergyDistributionChart from '../Charts/EnergyDistributionChart';

type ApplianceTableProps = {
  appliances: Appliance[];
  type: 'daily' | 'occasional';
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  addAppliance: (type: 'daily' | 'occasional') => void;
  removeAppliance: (type: 'daily' | 'occasional', index: number) => void;
  updateAppliance: (
    type: 'daily' | 'occasional',
    index: number,
    field: keyof Appliance,
    value: string | number
  ) => void;
};

const ApplianceTable: React.FC<ApplianceTableProps> = ({
  appliances,
  type,
  title,
  icon: Icon,
  addAppliance,
  removeAppliance,
  updateAppliance,
}) => (
  <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-2">
        <Icon className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <button
        onClick={() => addAppliance(type)}
        className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:shadow-md transition-all duration-200"
      >
        <Plus className="h-4 w-4" />
        <span>Add Appliance</span>
      </button>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Appliance</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Rating (W)</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Quantity</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
              Hours ({type === 'daily' ? 'per day' : 'per month'})
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Energy (Wh)</th>
            <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {appliances.map((appliance, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <input
                  type="text"
                  value={appliance.name}
                  onChange={(e) => updateAppliance(type, index, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Appliance name"
                />
              </td>
              <td className="px-4 py-3">
                <input
                  type="number"
                  value={appliance.rating}
                  onChange={(e) => updateAppliance(type, index, 'rating', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </td>
              <td className="px-4 py-3">
                <input
                  type="number"
                  value={appliance.quantity}
                  onChange={(e) => updateAppliance(type, index, 'quantity', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </td>
              <td className="px-4 py-3">
                <input
                  type="number"
                  value={appliance.hours}
                  onChange={(e) => updateAppliance(type, index, 'hours', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.1"
                />
              </td>
              <td className="px-4 py-3 text-gray-600">
                {(appliance.rating * appliance.quantity * appliance.hours).toLocaleString()}
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => removeAppliance(type, index)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const CommercialCalculator: React.FC = () => {
  const { user } = useAuth();
  const [dailyAppliances, setDailyAppliances] = useState<Appliance[]>([
    { name: 'LED Light', rating: 10, quantity: 10, hours: 8 },
    { name: 'Fan', rating: 75, quantity: 5, hours: 10 },
  ]);
  
  const [occasionalAppliances, setOccasionalAppliances] = useState<Appliance[]>([
    { name: 'Air Conditioner', rating: 1500, quantity: 2, hours: 20 },
  ]);

  const [commercialType, setCommercialType] = useState<string>('standard');

  const commercialTypes = [
    { id: 'standard', name: 'Standard Commercial (Telescopic)', rate: 0 },
    { id: 'advertising', name: 'Advertising Hoardings', rate: 12.25 },
    { id: 'function_halls', name: 'Function Halls / Auditoriums', rate: 12.25 },
    { id: 'startup_power', name: 'Startup Power', rate: 12.25 },
    { id: 'electric_vehicles', name: 'Electric Vehicles / Charging Stations', rate: 6.70 },
    { id: 'green_power', name: 'Green Power', rate: 12.25 },
  ];

  const [result, setResult] = useState(calculateCommercialBill(dailyAppliances, occasionalAppliances, commercialType));

  const addAppliance = (type: 'daily' | 'occasional') => {
    const newAppliance: Appliance = { name: '', rating: 0, quantity: 1, hours: type === 'daily' ? 1 : 1 };
    
    if (type === 'daily') {
      setDailyAppliances([...dailyAppliances, newAppliance]);
    } else {
      setOccasionalAppliances([...occasionalAppliances, newAppliance]);
    }
  };

  const removeAppliance = (type: 'daily' | 'occasional', index: number) => {
    if (type === 'daily') {
      const updated = dailyAppliances.filter((_, i) => i !== index);
      setDailyAppliances(updated);
    } else {
      const updated = occasionalAppliances.filter((_, i) => i !== index);
      setOccasionalAppliances(updated);
    }
  };

  const updateAppliance = (type: 'daily' | 'occasional', index: number, field: keyof Appliance, value: string | number) => {
    if (type === 'daily') {
      const updated = [...dailyAppliances];
      updated[index] = { ...updated[index], [field]: value };
      setDailyAppliances(updated);
    } else {
      const updated = [...occasionalAppliances];
      updated[index] = { ...updated[index], [field]: value };
      setOccasionalAppliances(updated);
    }
  };

  React.useEffect(() => {
    const newResult = calculateCommercialBill(dailyAppliances, occasionalAppliances, commercialType);
    setResult(newResult);
    
    // Save to history if user is logged in
    if (user && (dailyAppliances.length > 0 || occasionalAppliances.length > 0)) {
      saveToHistory(newResult);
    }
  }, [dailyAppliances, occasionalAppliances, commercialType]);

  const saveToHistory = async (calculationResult: any) => {
    try {
      await supabase.from('calculation_history').insert({
        user_id: user?.id,
        calculation_type: 'commercial',
        inputs: { dailyAppliances, occasionalAppliances, commercialType },
        results: calculationResult,
      });
    } catch (error) {
      console.error('Error saving calculation history:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <Building className="h-8 w-8" />
          <div>
            <h2 className="text-2xl font-bold mb-2">Commercial Energy Calculator</h2>
            <p className="text-blue-100">Calculate commercial electricity bills based on your appliances usage and commercial type</p>
          </div>
        </div>
      </div>

      {/* Commercial Type Selection */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Commercial Usage Type</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Commercial Category
            </label>
            <select
              value={commercialType}
              onChange={(e) => setCommercialType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {commercialTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name} {type.rate > 0 && `(₹${type.rate}/unit)`}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-center">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Selected Rate:</strong> {
                  commercialType === 'standard' 
                    ? 'Telescopic Tariff (0-50: ₹5.40, 51-100: ₹7.65, 101-300: ₹9.05, 301-500: ₹9.60, 500+: ₹10.15)'
                    : `₹${commercialTypes.find(t => t.id === commercialType)?.rate}/unit`
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <ApplianceTable
        appliances={dailyAppliances}
        type="daily"
        title="Daily Appliances"
        icon={Building}
        addAppliance={addAppliance}
        removeAppliance={removeAppliance}
        updateAppliance={updateAppliance}
      />

      <ApplianceTable
        appliances={occasionalAppliances}
        type="occasional"
        title="Occasional Appliances"
        icon={Zap}
        addAppliance={addAppliance}
        removeAppliance={removeAppliance}
        updateAppliance={updateAppliance}
      />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Bill Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Monthly Units:</span>
              <span className="font-semibold">{result.totalUnits.toFixed(2)} kWh</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-blue-600">
              <span>Total Bill:</span>
              <span>₹{result.totalBill.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Tariff Breakdown</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {result.breakdown.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.slab} @ ₹{item.rate}</span>
                <span className="font-semibold">₹{item.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <BillBreakdownChart data={result.breakdown} />
        <EnergyDistributionChart 
          dailyAppliances={dailyAppliances} 
          occasionalAppliances={occasionalAppliances} 
        />
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Commercial Tariff Structure</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Consumer Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Energy Charges (₹/Unit)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr><td className="px-4 py-2 font-medium">A(i): Commercial (0–50 units)</td><td className="px-4 py-2">5.40</td></tr>
              <tr><td className="px-4 py-2 font-medium">A(i): Commercial (51–100 units)</td><td className="px-4 py-2">7.65</td></tr>
              <tr><td className="px-4 py-2 font-medium">A(i): Commercial (101–300 units)</td><td className="px-4 py-2">9.05</td></tr>
              <tr><td className="px-4 py-2 font-medium">A(i): Commercial (301–500 units)</td><td className="px-4 py-2">9.60</td></tr>
              <tr><td className="px-4 py-2 font-medium">A(i): Commercial (Above 500 units)</td><td className="px-4 py-2">10.15</td></tr>
              <tr><td className="px-4 py-2 font-medium">Time of Day Tariff (TOD – Peak 6 PM to 10 PM)</td><td className="px-4 py-2">—</td></tr>
              <tr><td className="px-4 py-2 font-medium">(ii) Advertising Hoardings</td><td className="px-4 py-2">12.25</td></tr>
              <tr><td className="px-4 py-2 font-medium">(iii) Function halls / Auditoriums</td><td className="px-4 py-2">12.25</td></tr>
              <tr><td className="px-4 py-2 font-medium">(B): Startup power</td><td className="px-4 py-2">12.25</td></tr>
              <tr><td className="px-4 py-2 font-medium">(C): Electric Vehicles / Charging Stations</td><td className="px-4 py-2">6.70</td></tr>
              <tr><td className="px-4 py-2 font-medium">(D): Green Power</td><td className="px-4 py-2">12.25</td></tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Standard Commercial uses telescopic tariff structure. 
            Special categories use flat rates as shown above.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommercialCalculator;