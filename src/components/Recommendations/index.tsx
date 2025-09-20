import React, { useState } from 'react';
import { Lightbulb, Sun } from 'lucide-react';
import GeneralRecommendations from './GeneralRecommendations';
import SolarRecommendations from './SolarRecommendations';

const Recommendations: React.FC = () => {
  const [activeRecommendation, setActiveRecommendation] = useState<string>('general');

  const recommendations = [
    { id: 'general', label: 'General Tips', icon: Lightbulb, component: GeneralRecommendations },
    { id: 'solar', label: 'Solar Analysis', icon: Sun, component: SolarRecommendations },
  ];

  const ActiveComponent = recommendations.find(rec => rec.id === activeRecommendation)?.component || GeneralRecommendations;

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {recommendations.map((rec) => {
          const Icon = rec.icon;
          return (
            <button
              key={rec.id}
              onClick={() => setActiveRecommendation(rec.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                activeRecommendation === rec.id
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{rec.label}</span>
            </button>
          );
        })}
      </div>

      <ActiveComponent />
    </div>
  );
};

export default Recommendations;