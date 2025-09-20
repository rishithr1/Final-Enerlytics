import { TariffSlab, DomesticResult, CommercialResult, IndustrialResult } from '../types';

// Domestic Tariff Slabs
const domesticTariff: TariffSlab[] = [
  { threshold: 30, rate: 1.90 },
  { threshold: 75, rate: 3.00 },
  { threshold: 125, rate: 4.50 },
  { threshold: 225, rate: 6.00 },
  { threshold: 400, rate: 8.75 },
  { threshold: Infinity, rate: 9.75 }
];

// Commercial Tariff Slabs (Energy Charges) - Updated rates
const commercialEnergyTariff: TariffSlab[] = [
  { threshold: 50, rate: 5.40 },
  { threshold: 100, rate: 7.65 },
  { threshold: 300, rate: 9.05 },
  { threshold: 500, rate: 9.60 },
  { threshold: Infinity, rate: 10.15 }
];

const commercialFixedRate = 75; // Rs per kW per month
const industrialFixedRate = 75; // Rs per kW per month

// Industrial Tariff Rates based on the provided slab data
const industrialTariffRates = {
  // Industry (General) - LT Supply
  industry_general: {
    LT: 6.70,
    // HT Supply with TOD pricing
    '11kV': {
      high_demand: {
        peak: 7.80,        // 06-10 & 18-22
        off_peak: 5.55,    // 10-15 & 00-06
        normal: 6.30       // 15-18 & 22-24
      },
      low_demand: {
        peak: 7.30,        // 06-10 & 18-22
        off_peak: 5.55,    // 10-15 & 00-06
        normal: 6.30       // 15-18 & 22-24
      }
    },
    '33kV': {
      high_demand: {
        peak: 7.35,
        off_peak: 5.10,
        normal: 5.85
      },
      low_demand: {
        peak: 7.00,
        off_peak: 5.10,
        normal: 5.85
      }
    },
    '132kV': {
      high_demand: {
        peak: 6.90,
        off_peak: 4.65,
        normal: 5.40
      },
      low_demand: {
        peak: 6.85,
        off_peak: 4.65,
        normal: 5.40
      }
    },
    '220kV': {
      high_demand: {
        peak: 6.85,
        off_peak: 4.60,
        normal: 5.35
      },
      low_demand: {
        peak: 6.80,
        off_peak: 4.60,
        normal: 5.35
      }
    }
  },
  
  // Seasonal Industries (off-season)
  seasonal_off_season: {
    LT: 7.45,
    '11kV': 7.65,
    '33kV': 7.00,
    '132kV': 6.70,
    '220kV': 6.65
  },
  
  // Energy Intensive Industries
  energy_intensive: {
    LT: 3.75,
    '11kV': 5.80,
    '33kV': 5.35,
    '132kV': 4.95,
    '220kV': 4.90
  },
  
  // Cottage Industries (up to 10 HP) - Free for Dhobighats per Govt. Order
  cottage_industries: {
    LT: 0  // Free
  },
  
  // Industrial Colonies
  industrial_colonies: {
    '11kV': 14.60,
    '33kV': 5.35,
    '132kV': 7.00,
    '220kV': 7.00
  }
};

export function calculateTelescopicBill(
  totalUnits: number, 
  tariffSlabs: TariffSlab[]
): { bill: number; breakdown: Array<{ slab: string; units: number; rate: number; amount: number }> } {
  let bill = 0;
  let prev = 0;
  const breakdown = [];

  for (let i = 0; i < tariffSlabs.length; i++) {
    const { threshold, rate } = tariffSlabs[i];
    if (totalUnits <= prev) break;

    const slabUnits = Math.min(totalUnits, threshold) - prev;
    if (slabUnits > 0) {
      const amount = slabUnits * rate;
      bill += amount;
      
      // Show actual units consumed in this slab, not the full slab range
      const startUnit = prev + 1;
      const endUnit = Math.min(totalUnits, threshold);
      const slabLabel = startUnit === endUnit ? `${startUnit}` : `${startUnit}-${endUnit}`;
      
      breakdown.push({
        slab: slabLabel,
        units: slabUnits,
        rate,
        amount
      });
    }
    prev = threshold;
  }

  return { bill, breakdown };
}

// Reverse calculation: Bill → Units using telescopic tariff structure
export function calculateUnitsFromBill(
  targetBill: number,
  tariffSlabs: TariffSlab[],
  tolerance: number = 0.01
): { units: number; actualBill: number; breakdown: Array<{ slab: string; units: number; rate: number; amount: number }> } {
  if (targetBill <= 0) {
    return { units: 0, actualBill: 0, breakdown: [] };
  }

  // Binary search approach for efficiency
  let low = 0;
  let high = targetBill / Math.min(...tariffSlabs.map(s => s.rate)); // Rough upper bound
  let bestResult: { units: number; actualBill: number; breakdown: Array<{ slab: string; units: number; rate: number; amount: number }> } = 
    { units: 0, actualBill: 0, breakdown: [] };
  
  // Extend the high bound if needed
  while (high < 10000) { // Safety limit
    const { bill } = calculateTelescopicBill(high, tariffSlabs);
    if (bill >= targetBill) break;
    high *= 2;
  }

  // Binary search to find units that produce target bill
  for (let iteration = 0; iteration < 100; iteration++) {
    const midUnits = (low + high) / 2;
    const { bill, breakdown } = calculateTelescopicBill(midUnits, tariffSlabs);
    
    if (Math.abs(bill - targetBill) <= tolerance) {
      return { units: midUnits, actualBill: bill, breakdown };
    }
    
    if (bill < targetBill) {
      low = midUnits;
      bestResult = { units: midUnits, actualBill: bill, breakdown };
    } else {
      high = midUnits;
    }
    
    // If range becomes very small, return best result
    if (high - low < 0.01) {
      break;
    }
  }
  
  return bestResult;
}

// Convenience functions for different tariff types
export function calculateDomesticUnitsFromBill(targetBill: number) {
  return calculateUnitsFromBill(targetBill, domesticTariff);
}

export function calculateCommercialUnitsFromBill(targetBill: number) {
  return calculateUnitsFromBill(targetBill, commercialEnergyTariff);
}

export function calculateDomesticBill(
  dailyAppliances: Array<{ name: string; rating: number; quantity: number; hours: number }>,
  occasionalAppliances: Array<{ name: string; rating: number; quantity: number; hours: number }>
): DomesticResult {
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
  const totalUnits = totalMonthlyWh / 1000;

  // Calculate bill using telescopic tariff
  const { bill, breakdown } = calculateTelescopicBill(totalUnits, domesticTariff);

  return {
    totalUnits,
    totalBill: bill,
    breakdown
  };
}

export function calculateCommercialBill(
  dailyAppliances: Array<{ name: string; rating: number; quantity: number; hours: number }>,
  occasionalAppliances: Array<{ name: string; rating: number; quantity: number; hours: number }>,
  commercialType: string
): CommercialResult {
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
  const totalUnits = totalMonthlyWh / 1000;

  // Determine rate based on commercial type
  let rate: number;
  switch (commercialType) {
    case 'advertising':
      rate = 12.25;
      break;
    case 'function_halls':
      rate = 12.25;
      break;
    case 'startup_power':
      rate = 12.25;
      break;
    case 'electric_vehicles':
      rate = 6.70;
      break;
    case 'green_power':
      rate = 12.25;
      break;
    default:
      // Use telescopic tariff for standard commercial
      const { bill, breakdown } = calculateTelescopicBill(totalUnits, commercialEnergyTariff);
      return {
        totalUnits,
        totalBill: bill,
        breakdown
      };
  }

  // For special commercial types, use flat rate
  const totalBill = totalUnits * rate;
  const breakdown = [{
    slab: `${commercialType.replace('_', ' ').toUpperCase()}`,
    units: totalUnits,
    rate: rate,
    amount: totalBill
  }];

  return {
    totalUnits,
    totalBill,
    breakdown
  };
}

export function calculateIndustrialBill(
  totalUnits: number,
  sanctionedLoad: number,
  category: string = 'industry_general',
  supplyType: string = 'LT',
  todType: string = 'normal',
  demandType: string = 'high_demand'
): IndustrialResult {
  // Fixed charge calculation - free for cottage industries
  const fixedCharge = category === 'cottage_industries' ? 0 : sanctionedLoad * industrialFixedRate;
  let energyRate = 0;
  let categoryName = '';
  let supplyTypeName = '';
  let todTypeName = '';

  // Determine energy rate based on category and supply type
  switch (category) {
    case 'industry_general':
      categoryName = 'Industry (General)';
      const generalRates = industrialTariffRates.industry_general;
      
      if (supplyType === 'LT') {
        energyRate = generalRates.LT;
        supplyTypeName = 'LT Supply';
      } else {
        supplyTypeName = `${supplyType} Supply`;
        const voltageRates = generalRates[supplyType as keyof typeof generalRates];
        if (voltageRates && typeof voltageRates === 'object') {
          const demandRates = voltageRates[demandType as keyof typeof voltageRates];
          if (demandRates && typeof demandRates === 'object') {
            energyRate = demandRates[todType as keyof typeof demandRates];
            todTypeName = `TOD (${demandType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}) - ${todType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`;
          }
        }
      }
      break;
    
    case 'seasonal_off_season':
      categoryName = 'Seasonal Industries (off-season)';
      supplyTypeName = `${supplyType} Supply`;
      const seasonalRates = industrialTariffRates.seasonal_off_season;
      energyRate = seasonalRates[supplyType as keyof typeof seasonalRates] || 0;
      break;
    
    case 'energy_intensive':
      categoryName = 'Energy Intensive Industries';
      supplyTypeName = `${supplyType} Supply`;
      const intensiveRates = industrialTariffRates.energy_intensive;
      energyRate = intensiveRates[supplyType as keyof typeof intensiveRates] || 0;
      break;
    
    case 'cottage_industries':
      categoryName = 'Cottage Industries (up to 10 HP)';
      supplyTypeName = 'LT Supply (Free)';
      energyRate = industrialTariffRates.cottage_industries.LT;
      break;
    
    case 'industrial_colonies':
      categoryName = 'Industrial Colonies';
      supplyTypeName = `${supplyType} Supply`;
      const colonyRates = industrialTariffRates.industrial_colonies;
      energyRate = colonyRates[supplyType as keyof typeof colonyRates] || 0;
      break;
    
    default:
      categoryName = 'Industry (General)';
      energyRate = industrialTariffRates.industry_general.LT;
      supplyTypeName = 'LT Supply';
  }

  const energyCharge = totalUnits * energyRate;
  const totalBill = fixedCharge + energyCharge;

  // Create breakdown
  const breakdown = [];
  
  if (fixedCharge > 0) {
    breakdown.push({
      slab: 'Fixed Charges',
      units: sanctionedLoad,
      rate: industrialFixedRate,
      amount: fixedCharge
    });
  }
  
  breakdown.push({
    slab: category === 'cottage_industries' ? `Energy Charges (${categoryName} - Free)` : `Energy Charges (${categoryName})`,
    units: totalUnits,
    rate: energyRate,
    amount: energyCharge
  });

  return {
    totalUnits,
    totalBill,
    fixedCharge,
    energyCharge,
    breakdown,
    category: categoryName,
    supplyType: supplyTypeName,
    todType: todTypeName || undefined
  };
}

export function calculatePaybackPeriod(
  initialInvestment: number,
  monthlySavings: number
): number {
  return initialInvestment / (monthlySavings * 12);
}

export function calculateNPVandBCR(
  initialInvestment: number,
  annualSavings: number,
  projectLifetime: number,
  discountRate: number = 0.08
): { npv: number; bcr: number } {
  let presentValueSavings = 0;
  
  for (let t = 1; t <= projectLifetime; t++) {
    presentValueSavings += annualSavings / Math.pow(1 + discountRate, t);
  }
  
  const npv = -initialInvestment + presentValueSavings;
  const bcr = presentValueSavings / initialInvestment;
  
  return { npv, bcr };
}

export function calculateBreakEven(
  fixedCosts: number,
  variableCostPerUnit: number,
  pricePerUnit: number
): { breakEvenUnits: number; breakEvenRevenue: number } {
  const breakEvenUnits = fixedCosts / (pricePerUnit - variableCostPerUnit);
  const breakEvenRevenue = breakEvenUnits * pricePerUnit;
  
  return { breakEvenUnits, breakEvenRevenue };
}

export function calculateROI(
  initialInvestment: number,
  netProfit: number
): number {
  return (netProfit / initialInvestment) * 100;
}

// Solar system cost table based on market rates
const solarSystemCosts = {
  1: { min: 65000, max: 85000 },
  2: { min: 105000, max: 125000 },
  3: { min: 150000, max: 170000 },
  4: { min: 185000, max: 205000 },
  5: { min: 230000, max: 250000 },
  6: { min: 285000, max: 295000 },
  7: { min: 315000, max: 325000 },
  8: { min: 360000, max: 380000 },
  9: { min: 405000, max: 415000 },
  10: { min: 450000, max: 460000 }
};

// Function to get investment cost based on required capacity
function getSolarInvestmentCost(requiredKW: number): { investment: number; costRange: string } {
  // For capacities up to 10kW, use the table
  if (requiredKW <= 10 && solarSystemCosts[requiredKW as keyof typeof solarSystemCosts]) {
    const costData = solarSystemCosts[requiredKW as keyof typeof solarSystemCosts];
    const investment = Math.round((costData.min + costData.max) / 2); // Use average cost
    const costRange = `₹${costData.min.toLocaleString()} - ₹${costData.max.toLocaleString()}`;
    return { investment, costRange };
  }
  
  // For capacities above 10kW, extrapolate based on 10kW cost (₹46,000 per kW average)
  const costPerKW = 46000;
  const investment = requiredKW * costPerKW;
  const minCost = requiredKW * 45000;
  const maxCost = requiredKW * 47000;
  const costRange = `₹${minCost.toLocaleString()} - ₹${maxCost.toLocaleString()}`;
  return { investment, costRange };
}

export function generateSolarRecommendation(
  monthlyBill: number,
  tariffType: 'domestic' | 'commercial' = 'domestic'
): {
  recommendSolar: boolean;
  requiredKW: number;
  estimatedGeneration: number;
  monthlyUnits: number;
  savings: number;
  investment: number;
  paybackPeriod: number;
  actualBill: number;
  breakdown: Array<{ slab: string; units: number; rate: number; amount: number }>;
  costRange?: string;
} {
  const recommendSolar = monthlyBill > 4000;
  
  if (!recommendSolar) {
    return {
      recommendSolar: false,
      requiredKW: 0,
      estimatedGeneration: 0,
      monthlyUnits: 0,
      savings: 0,
      investment: 0,
      paybackPeriod: 0,
      actualBill: 0,
      breakdown: [],
      costRange: undefined
    };
  }

  // Use reverse calculation to get accurate units from bill
  const unitsResult = tariffType === 'domestic' 
    ? calculateDomesticUnitsFromBill(monthlyBill)
    : calculateCommercialUnitsFromBill(monthlyBill);
    
  const monthlyUnits = unitsResult.units;
  const actualBill = unitsResult.actualBill;
  const breakdown = unitsResult.breakdown;
  
  // Calculate required capacity using the corrected formula:
  // Required Solar Capacity (kW) = (Monthly Units ÷ 120), rounded UP to the next whole number
  // This is based on: 1 kW generates 4 units/day × 30 days = 120 units/month
  const requiredKW = Math.max(1, Math.ceil(monthlyUnits / 120));
  
  // Estimated monthly generation using 4 units/day per kW
  const estimatedGeneration = requiredKW * 4 * 30; // kWh per month
  
  // Calculate savings using the actual tariff structure
  // Assume 90% of consumption is offset by solar
  const offsetUnits = Math.min(estimatedGeneration, monthlyUnits * 0.9);
  const remainingUnits = Math.max(0, monthlyUnits - offsetUnits);
  
  // Calculate bill for remaining units after solar offset
  const remainingBillResult = tariffType === 'domestic'
    ? calculateTelescopicBill(remainingUnits, domesticTariff)
    : calculateTelescopicBill(remainingUnits, commercialEnergyTariff);
    
  const savings = actualBill - remainingBillResult.bill;
  
  // Get accurate investment cost based on system size
  const { investment, costRange } = getSolarInvestmentCost(requiredKW);
  
  const paybackPeriod = investment / (savings * 12);

  return {
    recommendSolar: true,
    requiredKW,
    estimatedGeneration,
    monthlyUnits,
    savings,
    investment,
    paybackPeriod,
    actualBill,
    breakdown,
    costRange
  };
}