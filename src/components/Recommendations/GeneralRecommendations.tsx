import React from 'react';
import { Lightbulb, Zap, Thermometer, Wind, Sun } from 'lucide-react';

const GeneralRecommendations: React.FC = () => {
  const recommendations = [
    {
      category: 'Lighting System',
      icon: Lightbulb,
      color: 'yellow',
      tips: [
        'One of the best energy-saving devices is the light switch. Turn off lights when not required.',
        'Use automatic devices like infrared sensors, motion sensors, timers, dimmers and solar cells to control lighting.',
        'Use task lighting to focus light only where needed instead of lighting entire rooms.',
        'Dirty tube lights and bulbs can absorb up to 50% of light; dust them regularly.',
        'Fluorescent tubes and CFLs are up to 5x more efficient than ordinary bulbs and can save ~70% electricity.',
        'Incandescent bulbs convert ~90% of energy to heat, not light; avoid them.',
        'Replace incandescent bulbs with CFLs/LEDs; CFLs can use up to 75% less electricity.',
        'A 15W CFL can produce the same light as a 60W incandescent bulb.'
      ]
    },
    {
      category: 'Room Air Conditioners',
      icon: Thermometer,
      color: 'red',
      tips: [
        'Use ceiling or table fans first; they cost far less to operate than ACs.',
        'Reduce AC use up to 40% by shading windows and walls; plant trees and shrubs.',
        'Set AC thermostat to 25°C; each degree above 22°C can save ~3–5% energy.',
        'Use ceiling or room fans with AC to feel cooler at higher set points.',
        'Cool and dehumidify rooms with timers; a good AC needs ~30 minutes.',
        'Keep doors to air-conditioned rooms closed as often as possible.',
        'Clean AC filters monthly to maintain airflow and efficiency.',
        'Consider replacing old, inefficient ACs; newer models are more efficient over lifecycle.'
      ]
    },
    {
      category: 'Refrigerators',
      icon: Zap,
      color: 'blue',
      tips: [
        'Keep refrigerators away from heat sources like sunlight, ovens, and ranges; check door seals with a flashlight test.',
        'Ensure space around the fridge for airflow; trapped heat increases energy use.',
        'Allow adequate air circulation inside; avoid overpacking.',
        'Plan before opening the door to minimize open time.',
        'Cool and cover hot foods before storing to reduce energy use and condensation.',
        'Keep rubber door seals clean and tight; replace if they fail the paper test.',
        'Clean condenser coils regularly to help the motor run efficiently.',
        'Defrost manual units regularly; ice build-up insulates and reduces cooling power.'
      ]
    },
    {
      category: 'Water Heater',
      icon: Sun,
      color: 'orange',
      tips: [
        'Insulate hot water pipes, especially in unheated areas (never insulate plastic pipes).',
        'Reduce thermostat from 60°C to 50°C to save over 18% energy.'
      ]
    },
    {
      category: 'Microwave Ovens & Electric Kettles',
      icon: Zap,
      color: 'blue',
      tips: [
        'Microwaves can cut cooking energy by up to 50% versus conventional ovens for small quantities.',
        'Place larger/thicker items on the outer edge for even microwave cooking.',
        'Use electric kettles for heating water; they are more efficient than cooktops.',
        'Choose kettles with auto shut-off and heat-resistant handles.',
        'Clean kettles regularly with boiling water and vinegar to remove deposits.',
        'Don’t overfill kettles; heat only the amount of water needed.'
      ]
    },
    {
      category: 'Computers',
      icon: Wind,
      color: 'green',
      tips: [
        'Turn off home office equipment when not in use; always-on devices can use significant power.',
        'If leaving computers on, at least turn off the monitor; it uses over half the system’s energy.',
        'Enable sleep-mode on computers/monitors/copiers to cut energy by ~40%.',
        'Unplug battery chargers when not charging; they draw power continuously.',
        'Screen savers do not save energy; shutting down reduces wear and saves power.'
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      red: 'bg-red-50 border-red-200 text-red-800',
      green: 'bg-green-50 border-green-200 text-green-800',
      orange: 'bg-orange-50 border-orange-200 text-orange-800'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-50 border-gray-200 text-gray-800';
  };

  const getIconColorClasses = (color: string) => {
    const colorMap = {
      yellow: 'text-yellow-600',
      blue: 'text-blue-600',
      red: 'text-red-600',
      green: 'text-green-600',
      orange: 'text-orange-600'
    };
    return colorMap[color as keyof typeof colorMap] || 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <Lightbulb className="h-8 w-8" />
          <div>
            <h2 className="text-2xl font-bold mb-2">Recommendations</h2>
            <p className="text-green-100">Expert recommendations to reduce your energy consumption and bills</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {recommendations.map((category, index) => {
          const Icon = category.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-3 rounded-lg ${getColorClasses(category.color)}`}>
                  <Icon className={`h-6 w-6 ${getIconColorClasses(category.color)}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{category.category}</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-3">
                {category.tips.map((tip, tipIndex) => (
                  <div key={tipIndex} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700 text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Top Actionable Energy-Saving Wins</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">1</div>
            <div className="text-lg font-semibold text-gray-800">Set AC to 25°C & Clean Filters</div>
            <p className="text-sm text-gray-600">Each degree above 22°C saves ~3–5%. Clean filters monthly for efficiency.</p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">2</div>
            <div className="text-lg font-semibold text-gray-800">Switch to LEDs & Use Sensors</div>
            <p className="text-sm text-gray-600">LEDs/CFLs cut lighting energy up to 70%. Add motion/timer controls.</p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">3</div>
            <div className="text-lg font-semibold text-gray-800">Maintain Refrigerator Seals & Coils</div>
            <p className="text-sm text-gray-600">Tight door seals and clean condenser coils reduce runtime and power use.</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Recommendations</h3>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span>Switch to LED lighting</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span>Set AC to 24°C or higher</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span>Unplug unused electronics</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span>Use ceiling fans with AC</span>
            </label>
          </div>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span>Install window films</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span>Regular AC maintenance</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span>Use timers for water heaters</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span>Consider solar water heating</span>
            </label>
          </div>
        </div>
      </div>

    </div>
  );
};

export default GeneralRecommendations;