// Financial Calculation Utilities

/**
 * Calculate Provident Fund (PF) with yearly compounding
 * @param {number} monthlyContribution - Monthly contribution amount
 * @param {number} years - Number of years
 * @param {number} rate - Annual interest rate (default 8.1%)
 * @returns {object} PF calculation results with yearly projection
 */
exports.calculatePF = (monthlyContribution, years = 30, rate = 8.1) => {
  const annualContribution = monthlyContribution * 12;
  const yearlyRate = rate / 100;
  let balance = 0;
  const yearlyProjection = [];

  for (let year = 1; year <= years; year++) {
    const openingBalance = balance;
    const totalContributionSoFar = annualContribution * year;
    
    // Add annual contribution at the start of year
    balance += annualContribution;
    
    // Apply yearly compounding on the total balance
    balance = balance * (1 + yearlyRate);
    
    const totalInterestSoFar = balance - totalContributionSoFar;
    const interestEarnedThisYear = balance - openingBalance - annualContribution;
    
    yearlyProjection.push({
      year,
      openingBalance: Math.round(openingBalance * 100) / 100,
      contribution: annualContribution,
      interestEarned: Math.round(interestEarnedThisYear * 100) / 100,
      closingBalance: Math.round(balance * 100) / 100,
      totalContribution: totalContributionSoFar,
      totalInterest: Math.round(totalInterestSoFar * 100) / 100
    });
  }

  return {
    monthlyContribution,
    annualContribution,
    years,
    rate,
    finalBalance: balance,
    totalContribution: annualContribution * years,
    totalInterest: balance - (annualContribution * years),
    yearlyProjection
  };
};

/**
 * Calculate Income Tax for Old Regime (FY 2024-25)
 * @param {number} taxableIncome - Taxable income after deductions
 * @returns {object} Tax calculation breakdown
 */
exports.calculateOldRegimeTax = (taxableIncome) => {
  let tax = 0;
  const slabs = [];
  
  // Slab 1: Up to ₹2,50,000 - Nil
  if (taxableIncome <= 250000) {
    slabs.push({
      from: 0,
      to: 250000,
      amount: taxableIncome,
      rate: 0,
      tax: 0
    });
  } else {
    // Slab 2: ₹2,50,001 to ₹5,00,000 - 5%
    const slab2Upper = Math.min(taxableIncome, 500000);
    const slab2Amount = slab2Upper - 250000;
    if (slab2Amount > 0) {
      const slab2Tax = slab2Amount * 0.05;
      tax += slab2Tax;
      slabs.push({
        from: 250000,
        to: 500000,
        amount: slab2Amount,
        rate: 5,
        tax: slab2Tax
      });
    }

    // Slab 3: ₹5,00,001 to ₹10,00,000 - 20%
    if (taxableIncome > 500000) {
      const slab3Upper = Math.min(taxableIncome, 1000000);
      const slab3Amount = slab3Upper - 500000;
      if (slab3Amount > 0) {
        const slab3Tax = slab3Amount * 0.20;
        tax += slab3Tax;
        slabs.push({
          from: 500000,
          to: 1000000,
          amount: slab3Amount,
          rate: 20,
          tax: slab3Tax
        });
      }
    }

    // Slab 4: Above ₹10,00,000 - 30%
    if (taxableIncome > 1000000) {
      const slab4Amount = taxableIncome - 1000000;
      const slab4Tax = slab4Amount * 0.30;
      tax += slab4Tax;
      slabs.push({
        from: 1000000,
        to: null,
        amount: slab4Amount,
        rate: 30,
        tax: slab4Tax
      });
    }
  }

  // Health and Education Cess: 4%
  const cess = tax * 0.04;
  const totalTax = tax + cess;

  return {
    regime: 'old',
    taxableIncome,
    slabs,
    tax,
    cess,
    totalTax,
    netIncome: taxableIncome - totalTax
  };
};

/**
 * Calculate Income Tax for New Regime (FY 2024-25)
 * @param {number} taxableIncome - Taxable income
 * @returns {object} Tax calculation breakdown
 */
exports.calculateNewRegimeTax = (taxableIncome) => {
  let tax = 0;
  const slabs = [];

  // Slab 1: Up to ₹3,00,000 - Nil
  if (taxableIncome <= 300000) {
    slabs.push({
      from: 0,
      to: 300000,
      amount: taxableIncome,
      rate: 0,
      tax: 0
    });
  } else {
    // Slab 2: ₹3,00,001 to ₹7,00,000 - 5%
    const slab2Upper = Math.min(taxableIncome, 700000);
    const slab2Amount = slab2Upper - 300000;
    if (slab2Amount > 0) {
      const slab2Tax = slab2Amount * 0.05;
      tax += slab2Tax;
      slabs.push({
        from: 300000,
        to: 700000,
        amount: slab2Amount,
        rate: 5,
        tax: slab2Tax
      });
    }

    // Slab 3: ₹7,00,001 to ₹10,00,000 - 10%
    if (taxableIncome > 700000) {
      const slab3Upper = Math.min(taxableIncome, 1000000);
      const slab3Amount = slab3Upper - 700000;
      if (slab3Amount > 0) {
        const slab3Tax = slab3Amount * 0.10;
        tax += slab3Tax;
        slabs.push({
          from: 700000,
          to: 1000000,
          amount: slab3Amount,
          rate: 10,
          tax: slab3Tax
        });
      }
    }

    // Slab 4: ₹10,00,001 to ₹12,00,000 - 15%
    if (taxableIncome > 1000000) {
      const slab4Upper = Math.min(taxableIncome, 1200000);
      const slab4Amount = slab4Upper - 1000000;
      if (slab4Amount > 0) {
        const slab4Tax = slab4Amount * 0.15;
        tax += slab4Tax;
        slabs.push({
          from: 1000000,
          to: 1200000,
          amount: slab4Amount,
          rate: 15,
          tax: slab4Tax
        });
      }
    }

    // Slab 5: ₹12,00,001 to ₹15,00,000 - 20%
    if (taxableIncome > 1200000) {
      const slab5Upper = Math.min(taxableIncome, 1500000);
      const slab5Amount = slab5Upper - 1200000;
      if (slab5Amount > 0) {
        const slab5Tax = slab5Amount * 0.20;
        tax += slab5Tax;
        slabs.push({
          from: 1200000,
          to: 1500000,
          amount: slab5Amount,
          rate: 20,
          tax: slab5Tax
        });
      }
    }

    // Slab 6: Above ₹15,00,000 - 30%
    if (taxableIncome > 1500000) {
      const slab6Amount = taxableIncome - 1500000;
      const slab6Tax = slab6Amount * 0.30;
      tax += slab6Tax;
      slabs.push({
        from: 1500000,
        to: null,
        amount: slab6Amount,
        rate: 30,
        tax: slab6Tax
      });
    }
  }

  // Health and Education Cess: 4%
  const cess = tax * 0.04;
  const totalTax = tax + cess;

  return {
    regime: 'new',
    taxableIncome,
    slabs,
    tax,
    cess,
    totalTax,
    netIncome: taxableIncome - totalTax
  };
};

/**
 * Calculate EMI (Equated Monthly Installment)
 * @param {number} principal - Loan principal amount
 * @param {number} rate - Annual interest rate
 * @param {number} tenure - Tenure in years
 * @returns {object} EMI calculation with amortization schedule
 */
exports.calculateEMI = (principal, rate, tenure) => {
  const monthlyRate = rate / 12 / 100;
  const numberOfMonths = tenure * 12;
  
  // EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths) / 
              (Math.pow(1 + monthlyRate, numberOfMonths) - 1);
  
  const amortizationSchedule = [];
  let remainingPrincipal = principal;
  let totalInterest = 0;

  for (let month = 1; month <= numberOfMonths; month++) {
    const interestComponent = remainingPrincipal * monthlyRate;
    const principalComponent = emi - interestComponent;
    remainingPrincipal -= principalComponent;
    totalInterest += interestComponent;

    amortizationSchedule.push({
      month,
      emi: emi,
      principalComponent: principalComponent,
      interestComponent: interestComponent,
      remainingPrincipal: Math.max(0, remainingPrincipal)
    });
  }

  return {
    principal,
    rate,
    tenure,
    monthlyRate: monthlyRate * 100,
    numberOfMonths,
    emi,
    totalAmount: emi * numberOfMonths,
    totalInterest,
    principalInterestRatio: {
      principal: principal,
      interest: totalInterest,
      principalPercentage: (principal / (emi * numberOfMonths)) * 100,
      interestPercentage: (totalInterest / (emi * numberOfMonths)) * 100
    },
    amortizationSchedule: amortizationSchedule.slice(0, 12), // First year breakdown
    yearlySummary: generateYearlySummary(amortizationSchedule)
  };
};

/**
 * Generate yearly summary from amortization schedule
 */
function generateYearlySummary(schedule) {
  const yearlySummary = [];
  const years = Math.ceil(schedule.length / 12);

  for (let year = 1; year <= years; year++) {
    const startMonth = (year - 1) * 12;
    const endMonth = Math.min(year * 12, schedule.length);
    const yearSchedule = schedule.slice(startMonth, endMonth);

    const yearlyPrincipal = yearSchedule.reduce((sum, payment) => sum + payment.principalComponent, 0);
    const yearlyInterest = yearSchedule.reduce((sum, payment) => sum + payment.interestComponent, 0);
    const remainingPrincipal = yearSchedule[yearSchedule.length - 1].remainingPrincipal;

    yearlySummary.push({
      year,
      principalPaid: yearlyPrincipal,
      interestPaid: yearlyInterest,
      totalPaid: yearlyPrincipal + yearlyInterest,
      remainingPrincipal
    });
  }

  return yearlySummary;
}

/**
 * Calculate SIP (Systematic Investment Plan) Future Value
 * @param {number} monthlyAmount - Monthly investment amount
 * @param {number} rate - Annual expected return rate
 * @param {number} duration - Duration in years
 * @returns {object} SIP calculation with month-wise growth
 */
exports.calculateSIP = (monthlyAmount, rate, duration) => {
  const monthlyRate = rate / 12 / 100;
  const numberOfMonths = duration * 12;
  
  // SIP Future Value Formula: P * (((1+r)^n - 1) / r) * (1 + r)
  // where P = monthly payment, r = monthly rate, n = number of months
  const futureValue = monthlyAmount * 
    ((Math.pow(1 + monthlyRate, numberOfMonths) - 1) / monthlyRate) * 
    (1 + monthlyRate);
  
  const totalInvestment = monthlyAmount * numberOfMonths;
  const estimatedReturns = futureValue - totalInvestment;

  const monthlyGrowth = [];
  let cumulativeInvestment = 0;
  let cumulativeValue = 0;

  for (let month = 1; month <= numberOfMonths; month++) {
    cumulativeInvestment += monthlyAmount;
    // Calculate value after this month's contribution and growth
    cumulativeValue = monthlyAmount * 
      ((Math.pow(1 + monthlyRate, month) - 1) / monthlyRate) * 
      (1 + monthlyRate);
    
    const returns = cumulativeValue - cumulativeInvestment;
    const growthPercentage = (returns / cumulativeInvestment) * 100;

    monthlyGrowth.push({
      month,
      invested: cumulativeInvestment,
      value: cumulativeValue,
      returns: returns,
      growthPercentage: growthPercentage
    });
  }

  // Yearly summary
  const yearlySummary = [];
  for (let year = 1; year <= duration; year++) {
    const yearEndMonth = year * 12;
    if (yearEndMonth <= numberOfMonths) {
      const yearData = monthlyGrowth[yearEndMonth - 1];
      yearlySummary.push({
        year,
        invested: yearData.invested,
        value: yearData.value,
        returns: yearData.returns,
        growthPercentage: yearData.growthPercentage
      });
    }
  }

  return {
    monthlyAmount,
    rate,
    duration,
    numberOfMonths,
    totalInvestment,
    futureValue,
    estimatedReturns,
    growthPercentage: (estimatedReturns / totalInvestment) * 100,
    monthlyGrowth: monthlyGrowth.slice(0, 24), // First 2 years month-wise
    yearlySummary
  };
};

