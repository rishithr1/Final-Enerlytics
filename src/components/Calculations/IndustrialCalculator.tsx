import React, { useState } from 'react';
import { Factory, Clock, Zap, Building2, Plus, Trash2 } from 'lucide-react';
import { calculateIndustrialBill } from '../../utils/calculations';
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
        <Icon className="h-5 w-5 text-orange-500" />
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <button
        onClick={() => addAppliance(type)}
        className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:shadow-md transition-all duration-200"
      >
        <Plus className="h-4 w-4" />
        <span>Add Equipment</span>
      </button>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Equipment/Machine</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Rating (kW)</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Quantity</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
              Hours ({type === 'daily' ? 'per day' : 'per month'})
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Energy (kWh)</th>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Equipment name"
                />
              </td>
              <td className="px-4 py-3">
                <input
                  type="number"
                  value={appliance.rating / 1000} // Convert W to kW for display
                  onChange={(e) => updateAppliance(type, index, 'rating', (parseFloat(e.target.value) || 0) * 1000)} // Convert back to W
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  min="0"
                  step="0.1"
                />
              </td>
              <td className="px-4 py-3">
                <input
                  type="number"
                  value={appliance.quantity}
                  onChange={(e) => updateAppliance(type, index, 'quantity', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  min="1"
                />
              </td>
              <td className="px-4 py-3">
                <input
                  type="number"
                  value={appliance.hours}
                  onChange={(e) => updateAppliance(type, index, 'hours', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  min="0"
                  step="0.1"
                />
              </td>
              <td className="px-4 py-3 text-gray-600">
                {((appliance.rating * appliance.quantity * appliance.hours) / 1000).toFixed(2)}
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

const IndustrialCalculator: React.FC = () => {
  const { user } = useAuth();
  const [dailyAppliances, setDailyAppliances] = useState<Appliance[]>([
    { name: 'Motor (Production)', rating: 5000, quantity: 2, hours: 8 }, // 5kW motor
    { name: 'Lighting System', rating: 500, quantity: 10, hours: 12 }, // 0.5kW per unit
    { name: 'Ventilation Fan', rating: 750, quantity: 4, hours: 10 }, // 0.75kW fan
  ]);
  
  const [occasionalAppliances, setOccasionalAppliances] = useState<Appliance[]>([
    { name: 'Heavy Machinery', rating: 15000, quantity: 1, hours: 40 }, // 15kW machine, 40 hours/month
    { name: 'Welding Equipment', rating: 3000, quantity: 2, hours: 20 }, // 3kW welder
  ]);

  const [sanctionedLoad, setSanctionedLoad] = useState<number>(0); // Set to 0 as default since we're removing load parameters
  const [category, setCategory] = useState<string>('industry_general');
  const [supplyType, setSupplyType] = useState<string>('LT');
  const [todType, setTodType] = useState<string>('normal');
  const [demandType, setDemandType] = useState<string>('high_demand');

  // Calculate total units from appliances
  const calculateTotalUnits = () => {
    // Calculate daily energy consumption (Wh)
    const dailyEnergyWh = dailyAppliances.reduce((total, appliance) => 
      total + (appliance.rating * appliance.quantity * appliance.hours), 0
    );

    // Calculate monthly energy from occasional appliances (Wh)
    const occasionalEnergyWh = occasionalAppliances.reduce((total, appliance) => 
      total + (appliance.rating * appliance.quantity * appliance.hours), 0
    );

    // Total monthly energy in Wh
    const totalMonthlyWh = (dailyEnergyWh * 30) + occasionalEnergyWh;
    
    // Convert to kWh
    return totalMonthlyWh / 1000;
  };

  const totalUnits = calculateTotalUnits();
  const [result, setResult] = useState(calculateIndustrialBill(totalUnits, sanctionedLoad, category, supplyType, todType, demandType));

  const industrialCategories = [
    { 
      id: 'industry_general', 
      name: 'A: Industry (General)', 
      description: 'General industrial consumers with LT and HT supply options including TOD pricing'
    },
    { 
      id: 'seasonal_off_season', 
      name: 'B: Seasonal Industries (off-season)', 
      description: 'Industries operating seasonally during off-season periods'
    },
    { 
      id: 'energy_intensive', 
      name: 'C: Energy Intensive Industries', 
      description: 'High energy consumption industries with preferential rates'
    },
    { 
      id: 'cottage_industries', 
      name: 'D: Cottage Industries (up to 10 HP)', 
      description: 'Small scale cottage industries - Free for Dhobighats per Government Order'
    },
    { 
      id: 'industrial_colonies', 
      name: 'Industrial Colonies', 
      description: 'Industrial residential colonies with special tariff structure'
    }
  ];

  const supplyTypes = [
    { id: 'LT', name: 'LT Supply', description: 'Low Tension Supply', available: ['industry_general', 'seasonal_off_season', 'energy_intensive', 'cottage_industries'] },
    { id: '11kV', name: '11 kV Supply', description: 'High Tension 11 kV', available: ['industry_general', 'seasonal_off_season', 'energy_intensive', 'industrial_colonies'] },
    { id: '33kV', name: '33 kV Supply', description: 'High Tension 33 kV', available: ['industry_general', 'seasonal_off_season', 'energy_intensive', 'industrial_colonies'] },
    { id: '132kV', name: '132 kV Supply', description: 'High Tension 132 kV', available: ['industry_general', 'seasonal_off_season', 'energy_intensive', 'industrial_colonies'] },
    { id: '220kV', name: '220 kV Supply', description: 'High Tension 220 kV', available: ['industry_general', 'seasonal_off_season', 'energy_intensive', 'industrial_colonies'] }
  ];

  const todTypes = [
    { id: 'peak', name: 'Peak Hours', description: '06:00-10:00 & 18:00-22:00', timeSlots: 'Morning: 6 AM - 10 AM, Evening: 6 PM - 10 PM' },
    { id: 'off_peak', name: 'Off-Peak Hours', description: '10:00-15:00 & 00:00-06:00', timeSlots: 'Afternoon: 10 AM - 3 PM, Night: 12 AM - 6 AM' },
    { id: 'normal', name: 'Normal Hours', description: '15:00-18:00 & 22:00-24:00', timeSlots: 'Evening: 3 PM - 6 PM, Night: 10 PM - 12 AM' }
  ];

  const demandTypes = [
    { id: 'high_demand', name: 'High Grid Demand', description: 'High electricity demand period with higher rates' },
    { id: 'low_demand', name: 'Low Grid Demand', description: 'Low electricity demand period with preferential rates' }
  ];

  React.useEffect(() => {
    const newTotalUnits = calculateTotalUnits();
    const newResult = calculateIndustrialBill(newTotalUnits, sanctionedLoad, category, supplyType, todType, demandType);
    setResult(newResult);
    
    // Save to history if user is logged in
    if (user && (dailyAppliances.length > 0 || occasionalAppliances.length > 0)) {
      saveToHistory(newResult);
    }
  }, [dailyAppliances, occasionalAppliances, sanctionedLoad, category, supplyType, todType, demandType]);

  const saveToHistory = async (calculationResult: any) => {
    try {
      await supabase.from('calculation_history').insert({
        user_id: user?.id,
        calculation_type: 'industrial',
        inputs: { dailyAppliances, occasionalAppliances, sanctionedLoad, category, supplyType, todType, demandType },
        results: calculationResult,
      });
    } catch (error) {
      console.error('Error saving calculation history:', error);
    }
  };

  const isTodApplicable = () => {
    return category === 'industry_general' && supplyType !== 'LT';
  };

  const isCottageIndustry = () => {
    return category === 'cottage_industries';
  };

  const getAvailableSupplyTypes = () => {
    return supplyTypes.filter(type => type.available.includes(category));
  };

  // Auto-adjust supply type when category changes
  React.useEffect(() => {
    const availableTypes = getAvailableSupplyTypes();
    if (!availableTypes.some(type => type.id === supplyType)) {
      setSupplyType(availableTypes[0]?.id || 'LT');
    }
  }, [category]);

  // Auto-adjust sanctioned load for cottage industries
  React.useEffect(() => {
    if (isCottageIndustry()) {
      setSanctionedLoad(0); // Set to 0 for cottage industries
    }
    // Removed auto-reset to 50 since we no longer use sanctioned load input
  }, [category]);

  const addAppliance = (type: 'daily' | 'occasional') => {
    const newAppliance: Appliance = { name: '', rating: 1000, quantity: 1, hours: type === 'daily' ? 8 : 20 }; // Default 1kW rating
    
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

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <Factory className="h-8 w-8" />
          <div>
            <h2 className="text-2xl font-bold mb-2">Industrial Energy Calculator</h2>
            <p className="text-orange-100">Calculate industrial electricity bills with comprehensive tariff categories and Time of Day pricing</p>
          </div>
        </div>
      </div>

      {/* Category Selection */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <Building2 className="h-5 w-5 mr-2 text-orange-500" />
          Industrial Category Selection
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Industrial Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {industrialCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-600 mt-1">
              {industrialCategories.find(cat => cat.id === category)?.description}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supply Type
            </label>
            <select
              value={supplyType}
              onChange={(e) => setSupplyType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              disabled={isCottageIndustry()}
            >
              {getAvailableSupplyTypes().map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-600 mt-1">
              {getAvailableSupplyTypes().find(type => type.id === supplyType)?.description}
            </p>
            {isCottageIndustry() && (
              <p className="text-sm text-green-600 mt-1 font-medium">
                Only LT Supply available for Cottage Industries
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Time of Day Selection (only for Industry General HT) */}
      {isTodApplicable() && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-orange-500" />
            Time of Day (TOD) Pricing
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Demand Type
              </label>
              <select
                value={demandType}
                onChange={(e) => setDemandType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {demandTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Period
              </label>
              <select
                value={todType}
                onChange={(e) => setTodType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {todTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-600 mt-1">
                {todTypes.find(type => type.id === todType)?.timeSlots}
              </p>
            </div>
          </div>
        </div>
      )}

      <ApplianceTable
        appliances={dailyAppliances}
        type="daily"
        title="Daily Industrial Equipment"
        icon={Factory}
        addAppliance={addAppliance}
        removeAppliance={removeAppliance}
        updateAppliance={updateAppliance}
      />

      <ApplianceTable
        appliances={occasionalAppliances}
        type="occasional"
        title="Occasional/Heavy Equipment"
        icon={Zap}
        addAppliance={addAppliance}
        removeAppliance={removeAppliance}
        updateAppliance={updateAppliance}
      />

      {/* Bill Summary & Tariff Breakdown - Two Column Layout like Commercial */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Bill Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Monthly Units:</span>
              <span className="font-semibold">{totalUnits.toFixed(2)} kWh</span>
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

      {/* Comprehensive Tariff Structure Table */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Industrial Tariff Structure</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-orange-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Consumer Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">LT Supply (Rs./Unit)</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">HT Supply (Rs./Unit)</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">11 kV</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">33 kV</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">132 kV</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">220 kV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 font-medium">A: Industry (General)</td>
                <td className="px-4 py-2">6.70</td>
                <td className="px-4 py-2">TOD</td>
                <td className="px-4 py-2">TOD</td>
                <td className="px-4 py-2">TOD</td>
                <td className="px-4 py-2">TOD</td>
                <td className="px-4 py-2">TOD</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-2 pl-6 text-sm">TOD (High Grid Demand) – Peak (06–10 & 18–22)</td>
                <td className="px-4 py-2">–</td>
                <td className="px-4 py-2">–</td>
                <td className="px-4 py-2">7.80</td>
                <td className="px-4 py-2">7.35</td>
                <td className="px-4 py-2">6.90</td>
                <td className="px-4 py-2">6.85</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-2 pl-6 text-sm">TOD (High Grid Demand) – Off-Peak (10–15 & 00–06)</td>
                <td className="px-4 py-2">–</td>
                <td className="px-4 py-2">–</td>
                <td className="px-4 py-2">5.55</td>
                <td className="px-4 py-2">5.10</td>
                <td className="px-4 py-2">4.65</td>
                <td className="px-4 py-2">4.60</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-2 pl-6 text-sm">TOD (High Grid Demand) – Normal (15–18 & 22–24)</td>
                <td className="px-4 py-2">–</td>
                <td className="px-4 py-2">–</td>
                <td className="px-4 py-2">6.30</td>
                <td className="px-4 py-2">5.85</td>
                <td className="px-4 py-2">5.40</td>
                <td className="px-4 py-2">5.35</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-2 pl-6 text-sm">TOD (Low Grid Demand) – Peak (06–10 & 18–22)</td>
                <td className="px-4 py-2">–</td>
                <td className="px-4 py-2">–</td>
                <td className="px-4 py-2">7.30</td>
                <td className="px-4 py-2">7.00</td>
                <td className="px-4 py-2">6.85</td>
                <td className="px-4 py-2">6.80</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-2 pl-6 text-sm">TOD (Low Grid Demand) – Off-Peak (10–15 & 00–06)</td>
                <td className="px-4 py-2">–</td>
                <td className="px-4 py-2">–</td>
                <td className="px-4 py-2">5.55</td>
                <td className="px-4 py-2">5.10</td>
                <td className="px-4 py-2">4.65</td>
                <td className="px-4 py-2">4.60</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-2 pl-6 text-sm">TOD (Low Grid Demand) – Normal (15–18 & 22–24)</td>
                <td className="px-4 py-2">–</td>
                <td className="px-4 py-2">–</td>
                <td className="px-4 py-2">6.30</td>
                <td className="px-4 py-2">5.85</td>
                <td className="px-4 py-2">5.40</td>
                <td className="px-4 py-2">5.35</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">B: Seasonal Industries (off-season)</td>
                <td className="px-4 py-2">7.45</td>
                <td className="px-4 py-2">7.65</td>
                <td className="px-4 py-2">7.00</td>
                <td className="px-4 py-2">6.70</td>
                <td className="px-4 py-2">6.65</td>
                <td className="px-4 py-2">6.65</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">C: Energy Intensive Industries</td>
                <td className="px-4 py-2">3.75</td>
                <td className="px-4 py-2">5.80</td>
                <td className="px-4 py-2">5.35</td>
                <td className="px-4 py-2">4.95</td>
                <td className="px-4 py-2">4.90</td>
                <td className="px-4 py-2">4.90</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-orange-700">D: Cottage Industries (up to 10 HP)</td>
                <td className="px-4 py-2 text-green-600 font-bold">Free (Dhobighats - Govt. Order)</td>
                <td className="px-4 py-2">–</td>
                <td className="px-4 py-2">–</td>
                <td className="px-4 py-2">–</td>
                <td className="px-4 py-2">–</td>
                <td className="px-4 py-2">–</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">Industrial Colonies</td>
                <td className="px-4 py-2">–</td>
                <td className="px-4 py-2">14.60</td>
                <td className="px-4 py-2">5.35</td>
                <td className="px-4 py-2">7.00</td>
                <td className="px-4 py-2">7.00</td>
                <td className="px-4 py-2">7.00</td>
              </tr>
            </tbody>
          </table>
            </div>
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-orange-800">
              <strong>Fixed Charges:</strong> ₹75 per kW per month for all industrial categories except cottage industries (free). 
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>TOD Pricing:</strong> Time of Day pricing applies only to Industry (General) with HT supply (11kV, 33kV, 132kV, 220kV).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustrialCalculator;