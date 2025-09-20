import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Calculator, Calendar, Trash2, Eye } from 'lucide-react';
import { CalculationHistory as CalculationHistoryType, EstimationHistory as EstimationHistoryType, RecommendationHistory as RecommendationHistoryType } from '../../types';

const CalculationHistory: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'calculations' | 'estimations' | 'recommendations'>('calculations');
  const [history, setHistory] = useState<CalculationHistoryType[]>([]);
  const [estimationHistory, setEstimationHistory] = useState<EstimationHistoryType[]>([]);
  const [recommendationHistory, setRecommendationHistory] = useState<RecommendationHistoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    if (user) {
      void fetchHistory();
      void fetchEstimationHistory();
      void fetchRecommendationHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('calculation_history')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error fetching calculation history:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEstimationHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('estimation_history')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEstimationHistory(data || []);
    } catch (error) {
      console.error('Error fetching estimation history:', error);
    }
  };

  const fetchRecommendationHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('recommendation_history')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecommendationHistory(data || []);
    } catch (error) {
      console.error('Error fetching recommendation history:', error);
    }
  };

  const deleteHistoryItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('calculation_history')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setHistory(history.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting history item:', error);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'domestic': return 'bg-green-100 text-green-800';
      case 'commercial': return 'bg-blue-100 text-blue-800';
      case 'industrial': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <Calculator className="h-8 w-8" />
          <div>
            <h2 className="text-2xl font-bold mb-2">History</h2>
            <p className="text-green-100">View and manage your past calculations, estimations, and recommendations</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-2 flex space-x-2">
        <button onClick={() => setActiveTab('calculations')} className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'calculations' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800'}`}>Calculations</button>
        <button onClick={() => setActiveTab('estimations')} className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'estimations' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800'}`}>Estimations</button>
        <button onClick={() => setActiveTab('recommendations')} className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'recommendations' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800'}`}>Recommendations</button>
      </div>

      {activeTab === 'calculations' && (history.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <Calculator className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No calculations yet</h3>
          <p className="text-gray-600">Start by creating your first energy calculation!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {history.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Calculator className="h-5 w-5 text-gray-500" />
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(item.calculation_type)}`}>
                      {item.calculation_type.charAt(0).toUpperCase() + item.calculation_type.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteHistoryItem(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Total Units</div>
                  <div className="font-semibold">
                    {item.results?.totalUnits?.toFixed(2) || 'N/A'} kWh
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Total Bill</div>
                  <div className="font-semibold text-green-600">
                    ₹{item.results?.totalBill?.toFixed(2) || 'N/A'}
                  </div>
                </div>
                {item.calculation_type !== 'domestic' && (
                  <>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">Fixed Charges</div>
                      <div className="font-semibold">
                        ₹{item.results?.fixedCharge?.toFixed(2) || 'N/A'}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">Energy Charges</div>
                      <div className="font-semibold">
                        ₹{item.results?.energyCharge?.toFixed(2) || 'N/A'}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}

      {activeTab === 'estimations' && (estimationHistory.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <Calculator className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No estimations yet</h3>
          <p className="text-gray-600">Run the Unified Estimator to generate history.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {estimationHistory.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Calculator className="h-5 w-5 text-gray-500" />
                    <span className={`px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800`}>
                      {item.estimation_type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Payback Period</div>
                  <div className="font-semibold">
                    {item.results?.paybackPeriod?.toFixed(2) || 'N/A'} years
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Total Savings (25y)</div>
                  <div className="font-semibold text-green-600">
                    ₹{item.results?.totalSavings25Years?.toLocaleString?.() || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

      {activeTab === 'recommendations' && (recommendationHistory.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <Calculator className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No recommendations yet</h3>
          <p className="text-gray-600">Use the Solar Recommendations tool to generate history.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {recommendationHistory.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Calculator className="h-5 w-5 text-gray-500" />
                    <span className={`px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800`}>
                      {item.recommendation_type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Required kW</div>
                  <div className="font-semibold">
                    {item.results?.requiredKW || 'N/A'} kW
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Monthly Savings</div>
                  <div className="font-semibold text-green-600">
                    ₹{item.results?.savings?.toFixed?.(0) || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Details</h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Type</div>
                    <div className="font-semibold capitalize">{selectedItem.calculation_type || selectedItem.estimation_type || selectedItem.recommendation_type}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Date</div>
                    <div className="font-semibold">
                      {new Date(selectedItem.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600 mb-2">Inputs</div>
                  <pre className="bg-gray-50 p-3 rounded-lg text-sm overflow-x-auto">
                    {JSON.stringify(selectedItem.inputs, null, 2)}
                  </pre>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600 mb-2">Results</div>
                  <pre className="bg-gray-50 p-3 rounded-lg text-sm overflow-x-auto">
                    {JSON.stringify(selectedItem.results, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalculationHistory;