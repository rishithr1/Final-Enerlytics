import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Settings, Save, Plus, Trash2, Edit } from 'lucide-react';
import { TariffSettings } from '../../types';

const TariffManagement: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [tariffs, setTariffs] = useState<TariffSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTariff, setEditingTariff] = useState<TariffSettings | null>(null);
  const [newTariff, setNewTariff] = useState({
    tariff_type: 'domestic' as 'domestic' | 'commercial' | 'industrial',
    tariff_data: {},
  });

  useEffect(() => {
    if (isAdmin) {
      fetchTariffs();
    }
  }, [isAdmin]);

  const fetchTariffs = async () => {
    try {
      const { data, error } = await supabase
        .from('tariff_settings')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setTariffs(data || []);
    } catch (error) {
      console.error('Error fetching tariffs:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveTariff = async (tariffData: any) => {
    try {
      const { error } = await supabase
        .from('tariff_settings')
        .upsert({
          ...tariffData,
          updated_by: user?.id,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      fetchTariffs();
      setEditingTariff(null);
    } catch (error) {
      console.error('Error saving tariff:', error);
    }
  };

  const deleteTariff = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tariff_settings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchTariffs();
    } catch (error) {
      console.error('Error deleting tariff:', error);
    }
  };

  if (!isAdmin) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-red-500 mb-4">
          <Settings className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Access Denied</h3>
        <p className="text-gray-600">You need admin privileges to access this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <Settings className="h-8 w-8" />
          <div>
            <h2 className="text-2xl font-bold mb-2">Tariff Management</h2>
            <p className="text-red-100">Manage electricity tariff rates and structures</p>
          </div>
        </div>
      </div>

      {/* Domestic Tariff Settings */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Domestic Tariff Slabs</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-green-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Units Range</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Rate (₹/kWh)</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr><td className="px-4 py-2">0-30</td><td className="px-4 py-2">1.90</td><td className="px-4 py-2 text-center"><button className="text-blue-600 hover:text-blue-800"><Edit className="h-4 w-4" /></button></td></tr>
              <tr><td className="px-4 py-2">31-75</td><td className="px-4 py-2">3.00</td><td className="px-4 py-2 text-center"><button className="text-blue-600 hover:text-blue-800"><Edit className="h-4 w-4" /></button></td></tr>
              <tr><td className="px-4 py-2">76-125</td><td className="px-4 py-2">4.50</td><td className="px-4 py-2 text-center"><button className="text-blue-600 hover:text-blue-800"><Edit className="h-4 w-4" /></button></td></tr>
              <tr><td className="px-4 py-2">126-225</td><td className="px-4 py-2">6.00</td><td className="px-4 py-2 text-center"><button className="text-blue-600 hover:text-blue-800"><Edit className="h-4 w-4" /></button></td></tr>
              <tr><td className="px-4 py-2">226-400</td><td className="px-4 py-2">8.75</td><td className="px-4 py-2 text-center"><button className="text-blue-600 hover:text-blue-800"><Edit className="h-4 w-4" /></button></td></tr>
              <tr><td className="px-4 py-2">400</td><td className="px-4 py-2">9.75</td><td className="px-4 py-2 text-center"><button className="text-blue-600 hover:text-blue-800"><Edit className="h-4 w-4" /></button></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Commercial Tariff Settings */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Commercial Tariff Structure</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Fixed Charges</h4>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span>Fixed Charge Rate:</span>
                <span className="font-semibold">₹75/kW/month</span>
                <button className="text-blue-600 hover:text-blue-800">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Energy Charges</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <span className="text-sm">0-50 units:</span>
                <span className="font-semibold">₹5.40/kWh</span>
                <button className="text-blue-600 hover:text-blue-800">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <span className="text-sm">51-100 units:</span>
                <span className="font-semibold">₹7.65/kWh</span>
                <button className="text-blue-600 hover:text-blue-800">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <span className="text-sm">101-300 units:</span>
                <span className="font-semibold">₹9.05/kWh</span>
                <button className="text-blue-600 hover:text-blue-800">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <span className="text-sm">301-500 units:</span>
                <span className="font-semibold">₹9.60/kWh</span>
                <button className="text-blue-600 hover:text-blue-800">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <span className="text-sm">500 units:</span>
                <span className="font-semibold">₹10.15/kWh</span>
                <button className="text-blue-600 hover:text-blue-800">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Industrial Tariff Settings */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Industrial Tariff Structure</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Fixed Charges:</span>
              <span className="font-semibold">₹75/kW/month</span>
              <button className="text-blue-600 hover:text-blue-800">
                <Edit className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Energy Charges:</span>
              <span className="font-semibold">₹6.70/kWh</span>
              <button className="text-blue-600 hover:text-blue-800">
                <Edit className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Changes Button */}
      <div className="flex justify-end">
        <button className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:shadow-md transition-all duration-200">
          <Save className="h-5 w-5" />
          <span>Save All Changes</span>
        </button>
      </div>

      {/* Recent Changes Log */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Tariff Changes</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <div>
              <span className="font-medium">Domestic Slab 1 Rate Updated</span>
              <div className="text-sm text-gray-500">Changed from ₹1.85 to ₹1.90</div>
            </div>
            <div className="text-sm text-gray-500">2 days ago</div>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <div>
              <span className="font-medium">Commercial Fixed Charge Updated</span>
              <div className="text-sm text-gray-500">Changed from ₹70 to ₹75 per kW</div>
            </div>
            <div className="text-sm text-gray-500">1 week ago</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TariffManagement;