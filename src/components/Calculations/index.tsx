import React, { useState } from 'react';
import { Home, Building, Factory } from 'lucide-react';
import DomesticCalculator from './DomesticCalculator';
import CommercialCalculator from './CommercialCalculator';
import IndustrialCalculator from './IndustrialCalculator';

const Calculations: React.FC = () => {
  const [activeCalculator, setActiveCalculator] = useState<string>('domestic');

  const calculators = [
    { id: 'domestic', label: 'Domestic', icon: Home, component: DomesticCalculator },
    { id: 'commercial', label: 'Commercial', icon: Building, component: CommercialCalculator },
    { id: 'industrial', label: 'Industrial', icon: Factory, component: IndustrialCalculator },
  ];

  const ActiveComponent = calculators.find(calc => calc.id === activeCalculator)?.component || DomesticCalculator;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {calculators.map((calc) => {
          const Icon = calc.icon;
          return (
            <button
              key={calc.id}
              onClick={() => setActiveCalculator(calc.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeCalculator === calc.id
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="font-medium">{calc.label}</span>
            </button>
          );
        })}
      </div>

      <ActiveComponent />
    </div>
  );
};

export default Calculations;