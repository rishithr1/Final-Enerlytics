import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Zap, 
  Calculator, 
  TrendingUp, 
  Lightbulb, 
  History, 
  Settings,
  LogOut,
  User,
  Shield
} from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navigationItems = [
    { id: 'calculations', label: 'Calculations', icon: Calculator, path: '/dashboard/calculations' },
    { id: 'estimations', label: 'Estimations', icon: TrendingUp, path: '/dashboard/estimations' },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb, path: '/dashboard/recommendations' },
    { id: 'history', label: 'History', icon: History, path: '/dashboard/history' },
  ];

  const adminItems = [
    { id: 'admin', label: 'Admin Panel', icon: Shield, path: '/dashboard/admin' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-green-500" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Energy Audit Pro
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <User className="h-5 w-5" />
                <span className="text-sm font-medium">{user?.user_metadata?.full_name || user?.email}</span>
                {isAdmin && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Admin</span>
                )}
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto py-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
            
            {isAdmin && adminItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md'
                      : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-300">
            Energy Audit Pro - Comprehensive energy analysis and recommendations for sustainable living
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Calculate • Analyze • Optimize • Save Energy
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;