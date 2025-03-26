// calculator.js

export default class ROICalculator {
   constructor(country = 'nz') {
       this.country = country.toLowerCase();
       this.cropsData = null;
   }

   // Load the crop data based on country
   async initialize() {
       try {
           const response = await fetch(`https://jelly-digital-nz.github.io/roi-calculator-frost-boss/data/${this.country}-crops.json`);
           this.cropsData = await response.json();
           return true;
       } catch (error) {
           console.error('Error loading crop data:', error);
           return false;
       }
   }

   // Main calculation function to match Excel formulas
   calculate({
       cropType,
       cropYield,         // C8 in Excel - annual crop yield
       reductionPercent,  // C9 in Excel - reduction percentage
       cropValue,         // C10 in Excel - value per tonne
       dieselCost,        // C12 in Excel - diesel cost per litre
       runningHours,      // C16 in Excel - machine running hours
       protectedArea,     // C17 in Excel - area in hectares
       interestRate       // C13 in Excel - interest rate
   }) {
       const cropData = this.cropsData.crops[cropType];
       if (!cropData) throw new Error('Invalid crop type');

       // Calculate number of fans needed (low and high range)
       const fansLow = Math.ceil(protectedArea / cropData.coverage.low);
       const fansHigh = Math.ceil(protectedArea / cropData.coverage.high);

       // Constants from Background Data sheet
       const MAINTENANCE_COST = 1000;
       const DIESEL_CONSUMPTION = 21; // litres per hour
       const ANNUAL_INVESTMENT = 9044.39;

       // Calculate annual operating costs per fan
       const operatingCostPerFan = MAINTENANCE_COST + (runningHours * DIESEL_CONSUMPTION * dieselCost);

       // Calculate total potential loss (same for both ranges)
       const totalPotentialLoss = cropYield * reductionPercent/100 * cropValue * protectedArea;

       // Low Range Calculations
       const lowRangeAnnualInvestment = (fansLow * ANNUAL_INVESTMENT) + (fansLow * operatingCostPerFan);
       const lowRangeGain = totalPotentialLoss - lowRangeAnnualInvestment;
       const lowRangeROI = (lowRangeGain / lowRangeAnnualInvestment) * 100;

       // High Range Calculations
       const highRangeAnnualInvestment = (fansHigh * ANNUAL_INVESTMENT) + (fansHigh * operatingCostPerFan);
       const highRangeGain = totalPotentialLoss - highRangeAnnualInvestment;
       const highRangeROI = (highRangeGain / highRangeAnnualInvestment) * 100;

       // Per Hectare Calculations
       const lowRangeAnnualInvestmentPerHa = lowRangeAnnualInvestment / protectedArea;
       const highRangeAnnualInvestmentPerHa = highRangeAnnualInvestment / protectedArea;
       const gainPerHa = totalPotentialLoss / protectedArea;

       return {
           summary: {
               lowRange: {
                   fansRequired: fansLow,
                   annualInvestment: lowRangeAnnualInvestment,
                   investmentGain: lowRangeGain,
                   roi: lowRangeROI
               },
               highRange: {
                   fansRequired: fansHigh,
                   annualInvestment: highRangeAnnualInvestment,
                   investmentGain: highRangeGain,
                   roi: highRangeROI
               }
           },
           perHectare: {
               lowRange: {
                   annualInvestment: lowRangeAnnualInvestmentPerHa,
                   gain: gainPerHa,
                   roi: lowRangeROI // ROI is the same per hectare
               },
               highRange: {
                   annualInvestment: highRangeAnnualInvestmentPerHa,
                   gain: gainPerHa,
                   roi: highRangeROI // ROI is the same per hectare
               }
           },
           details: {
               totalPotentialLoss,
               operatingCosts: {
                   perFan: operatingCostPerFan,
                   diesel: {
                       consumptionPerHour: DIESEL_CONSUMPTION,
                       costPerHour: DIESEL_CONSUMPTION * dieselCost,
                       annualCostPerFan: runningHours * DIESEL_CONSUMPTION * dieselCost
                   },
                   maintenance: MAINTENANCE_COST
               }
           }
       };
   }

   // Helper function to format currency based on country
   formatCurrency(value) {
       const currencyMap = {
           'nz': 'NZD',
           'au': 'AUD'
       };
       
       const currency = currencyMap[this.country] || 'NZD';
       const locale = this.country === 'au' ? 'en-AU' : 'en-NZ';
       
       return new Intl.NumberFormat(locale, {
           style: 'currency',
           currency: currency
       }).format(value);
   }

   // Helper function to format percentage
   formatPercentage(value) {
       const locale = this.country === 'au' ? 'en-AU' : 'en-NZ';
       
       return new Intl.NumberFormat(locale, {
           style: 'percent',
           minimumFractionDigits: 2,
           maximumFractionDigits: 2
       }).format(value/100);
   }
}
