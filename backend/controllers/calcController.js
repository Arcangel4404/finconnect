// Financial Calculator Controllers
const financialCalculations = require('../utils/financialCalculations');

exports.calculatePF = (req, res) => {
  try {
    const { basicSalary = 50000, da = 0, years = 30, rate = 8.1 } = req.body;
    
    // PF is 12% of (basic salary + DA)
    const pfBase = basicSalary + da;
    const employeeContribution = pfBase * 0.12;
    const employerContribution = pfBase * 0.12;
    const totalMonthlyContribution = employeeContribution + employerContribution;
    
    // Calculate PF with yearly compounding
    const pfCalculation = financialCalculations.calculatePF(totalMonthlyContribution, years, rate);
    
    res.json({
      success: true,
      data: {
        monthlyContribution: {
          employee: Math.round(employeeContribution),
          employer: Math.round(employerContribution),
          total: Math.round(totalMonthlyContribution)
        },
        annualContribution: Math.round(totalMonthlyContribution * 12),
        years,
        rate,
        finalBalance: Math.round(pfCalculation.finalBalance),
        totalContribution: Math.round(pfCalculation.totalContribution),
        totalInterest: Math.round(pfCalculation.totalInterest),
        yearlyProjection: pfCalculation.yearlyProjection.map(year => ({
          year: year.year,
          openingBalance: Math.round(year.openingBalance),
          contribution: Math.round(year.contribution),
          interestEarned: Math.round(year.interestEarned),
          closingBalance: Math.round(year.closingBalance),
          totalContribution: Math.round(year.totalContribution),
          totalInterest: Math.round(year.totalInterest)
        })),
        breakdown: {
          basicSalary,
          da,
          pfBase,
          contributionRate: 12,
          employeeContributionPercentage: 12,
          employerContributionPercentage: 12
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.calculateTax = (req, res) => {
  try {
    const { annualIncome = 800000, deductions = {}, regime = 'new' } = req.body;
    
    // Calculate taxable income based on regime
    let taxableIncome;
    let deductionBreakdown = {};
    
    if (regime === 'old') {
      // Old regime allows various deductions (80C, 80D, HRA, etc.)
      const section80C = deductions.section80C || 0; // Max 1,50,000
      const section80D = deductions.section80D || 0; // Health insurance
      const section80G = deductions.section80G || 0; // Donations
      const section24 = deductions.section24 || 0; // Home loan interest
      const hra = deductions.hra || 0; // HRA exemption
      const standardDeduction = 50000; // Standard deduction in old regime
      
      const totalDeductions = Math.min(section80C, 150000) + section80D + section80G + 
                              Math.min(section24, 200000) + hra + standardDeduction;
      
      taxableIncome = annualIncome - totalDeductions;
      
      deductionBreakdown = {
        section80C: Math.min(section80C, 150000),
        section80D,
        section80G,
        section24: Math.min(section24, 200000),
        hra,
        standardDeduction,
        total: totalDeductions
      };
    } else {
      // New regime has limited deductions, standard deduction of ₹75,000
      const standardDeduction = 75000;
      const otherDeductions = deductions.otherDeductions || 0;
      
      taxableIncome = annualIncome - standardDeduction - otherDeductions;
      
      deductionBreakdown = {
        standardDeduction,
        otherDeductions,
        total: standardDeduction + otherDeductions
      };
    }
    
    // Calculate tax based on selected regime
    let taxResult;
    if (regime === 'old') {
      taxResult = financialCalculations.calculateOldRegimeTax(taxableIncome);
    } else {
      taxResult = financialCalculations.calculateNewRegimeTax(taxableIncome);
    }
    
    // Calculate effective tax rate
    const effectiveTaxRate = (taxResult.totalTax / annualIncome) * 100;
    
    res.json({
      success: true,
      data: {
        annualIncome,
        regime,
        deductionBreakdown,
        taxableIncome: Math.round(taxableIncome),
        taxBreakdown: {
          slabs: taxResult.slabs.map(slab => ({
            from: slab.from,
            to: slab.to,
            amount: Math.round(slab.amount),
            rate: slab.rate,
            tax: Math.round(slab.tax)
          })),
          baseTax: Math.round(taxResult.tax),
          cess: Math.round(taxResult.cess),
          totalTax: Math.round(taxResult.totalTax)
        },
        netIncome: Math.round(taxResult.netIncome),
        effectiveTaxRate: parseFloat(effectiveTaxRate.toFixed(2)),
        // Comparison with other regime
        comparison: regime === 'old' 
          ? { newRegime: financialCalculations.calculateNewRegimeTax(taxableIncome) }
          : { oldRegime: financialCalculations.calculateOldRegimeTax(taxableIncome) }
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.calculateEMI = (req, res) => {
  try {
    const { principal = 1000000, rate = 8.5, tenure = 20 } = req.body;
    
    // Validate inputs
    if (principal <= 0 || rate < 0 || tenure <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Principal, rate, and tenure must be positive numbers'
      });
    }
    
    // Calculate EMI using utility function
    const emiCalculation = financialCalculations.calculateEMI(principal, rate, tenure);
    
    res.json({
      success: true,
      data: {
        principal,
        rate,
        tenure,
        emi: Math.round(emiCalculation.emi),
        totalAmount: Math.round(emiCalculation.totalAmount),
        totalInterest: Math.round(emiCalculation.totalInterest),
        principalInterestRatio: {
          principal: Math.round(emiCalculation.principalInterestRatio.principal),
          interest: Math.round(emiCalculation.principalInterestRatio.interest),
          principalPercentage: parseFloat(emiCalculation.principalInterestRatio.principalPercentage.toFixed(2)),
          interestPercentage: parseFloat(emiCalculation.principalInterestRatio.interestPercentage.toFixed(2))
        },
        amortizationSchedule: emiCalculation.amortizationSchedule.map(month => ({
          month: month.month,
          emi: Math.round(month.emi),
          principalComponent: Math.round(month.principalComponent),
          interestComponent: Math.round(month.interestComponent),
          remainingPrincipal: Math.round(month.remainingPrincipal)
        })),
        yearlySummary: emiCalculation.yearlySummary.map(year => ({
          year: year.year,
          principalPaid: Math.round(year.principalPaid),
          interestPaid: Math.round(year.interestPaid),
          totalPaid: Math.round(year.totalPaid),
          remainingPrincipal: Math.round(year.remainingPrincipal)
        }))
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.calculateSIP = (req, res) => {
  try {
    const { monthlyAmount = 5000, rate = 12, duration = 5 } = req.body;
    
    // Validate inputs
    if (monthlyAmount <= 0 || rate < 0 || duration <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Monthly amount, rate, and duration must be positive numbers'
      });
    }
    
    // Calculate SIP using utility function
    const sipCalculation = financialCalculations.calculateSIP(monthlyAmount, rate, duration);
    
    res.json({
      success: true,
      data: {
        monthlyAmount,
        rate,
        duration,
        numberOfMonths: sipCalculation.numberOfMonths,
        totalInvestment: Math.round(sipCalculation.totalInvestment),
        futureValue: Math.round(sipCalculation.futureValue),
        estimatedReturns: Math.round(sipCalculation.estimatedReturns),
        growthPercentage: parseFloat(sipCalculation.growthPercentage.toFixed(2)),
        monthlyGrowth: sipCalculation.monthlyGrowth.map(month => ({
          month: month.month,
          invested: Math.round(month.invested),
          value: Math.round(month.value),
          returns: Math.round(month.returns),
          growthPercentage: parseFloat(month.growthPercentage.toFixed(2))
        })),
        yearlySummary: sipCalculation.yearlySummary.map(year => ({
          year: year.year,
          invested: Math.round(year.invested),
          value: Math.round(year.value),
          returns: Math.round(year.returns),
          growthPercentage: parseFloat(year.growthPercentage.toFixed(2))
        }))
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

