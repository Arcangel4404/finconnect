// Financial Recommendations Engine

/**
 * Generate personalized financial recommendations
 */
exports.generateRecommendations = (userProfile) => {
  const recommendations = [];
  const {
    age = 30,
    annualIncome = 500000,
    monthlyExpenses = 30000,
    riskTolerance = 'moderate',
    savingsPercentage = 20,
    goals = [],
    existingInvestments = {},
    hasEmergencyFund = false,
    hasLifeInsurance = false,
    hasHealthInsurance = false,
    dependents = 0
  } = userProfile;
  
  const monthlyIncome = annualIncome / 12;
  const currentSavings = monthlyIncome * (savingsPercentage / 100);
  
  // 1. Emergency Fund Recommendation
  const emergencyFundRequired = monthlyExpenses * 6;
  if (!hasEmergencyFund || existingInvestments.emergencyFund < emergencyFundRequired) {
    const shortfall = emergencyFundRequired - (existingInvestments.emergencyFund || 0);
    recommendations.push({
      type: 'emergency_fund',
      category: 'Emergency Fund',
      priority: 'high',
      recommendation: `Build emergency fund of ₹${emergencyFundRequired.toLocaleString('en-IN')} (6 months expenses)`,
      currentStatus: existingInvestments.emergencyFund || 0,
      targetAmount: emergencyFundRequired,
      shortfall: shortfall,
      suggestedMonthlySaving: Math.min(shortfall / 12, monthlyIncome * 0.3),
      timeframe: '12 months',
      instrument: 'Savings Account / Liquid Mutual Funds',
      reason: 'Essential safety net for unexpected expenses'
    });
  }
  
  // 2. SIP Investment Recommendations
  const availableForInvestment = monthlyIncome - monthlyExpenses - (existingInvestments.sipAmount || 0);
  
  if (availableForInvestment > 5000) {
    // Determine SIP allocation based on age and risk tolerance
    let sipAllocation = {};
    let suggestedSIPAmount = 0;
    
    if (age < 35) {
      // Younger investors can take more risk
      if (riskTolerance === 'high') {
        sipAllocation = {
          largeCap: 40,
          midCap: 30,
          smallCap: 20,
          debt: 10
        };
        suggestedSIPAmount = Math.min(availableForInvestment * 0.8, monthlyIncome * 0.3);
      } else if (riskTolerance === 'moderate') {
        sipAllocation = {
          largeCap: 50,
          midCap: 20,
          smallCap: 10,
          debt: 20
        };
        suggestedSIPAmount = Math.min(availableForInvestment * 0.7, monthlyIncome * 0.25);
      } else {
        sipAllocation = {
          largeCap: 60,
          midCap: 10,
          smallCap: 0,
          debt: 30
        };
        suggestedSIPAmount = Math.min(availableForInvestment * 0.6, monthlyIncome * 0.2);
      }
    } else if (age < 50) {
      // Mid-career investors - balanced approach
      if (riskTolerance === 'high') {
        sipAllocation = {
          largeCap: 50,
          midCap: 25,
          smallCap: 10,
          debt: 15
        };
        suggestedSIPAmount = Math.min(availableForInvestment * 0.7, monthlyIncome * 0.25);
      } else {
        sipAllocation = {
          largeCap: 60,
          midCap: 15,
          smallCap: 5,
          debt: 20
        };
        suggestedSIPAmount = Math.min(availableForInvestment * 0.6, monthlyIncome * 0.2);
      }
    } else {
      // Pre-retirement - more conservative
      sipAllocation = {
        largeCap: 40,
        midCap: 10,
        smallCap: 0,
        debt: 50
      };
      suggestedSIPAmount = Math.min(availableForInvestment * 0.5, monthlyIncome * 0.15);
    }
    
    if (suggestedSIPAmount > 0) {
      recommendations.push({
        type: 'sip',
        category: 'Systematic Investment Plan (SIP)',
        priority: 'high',
        recommendation: `Start SIP of ₹${Math.round(suggestedSIPAmount).toLocaleString('en-IN')} per month`,
        suggestedAmount: Math.round(suggestedSIPAmount),
        allocation: sipAllocation,
        expectedReturns: '12-15% annually (equity), 7-8% (debt)',
        timeframe: '5+ years for best results',
        schemes: this.getRecommendedSchemes(riskTolerance, age),
        reason: `Based on your age (${age}), risk tolerance (${riskTolerance}), and available income`
      });
    }
  }
  
  // 3. Fixed Deposit Recommendations
  if (riskTolerance === 'low' || age > 50) {
    const fdAmount = Math.min(availableForInvestment * 0.3, annualIncome * 0.2);
    if (fdAmount > 10000) {
      recommendations.push({
        type: 'fd',
        category: 'Fixed Deposit',
        priority: 'medium',
        recommendation: `Consider FD of ₹${Math.round(fdAmount).toLocaleString('en-IN')}`,
        suggestedAmount: Math.round(fdAmount),
        expectedReturns: '6.5-7.5% annually',
        timeframe: '1-5 years',
        reason: 'Safe investment option with guaranteed returns'
      });
    }
  }
  
  // 4. Tax Saving Investments (Section 80C)
  if (annualIncome > 500000) {
    const taxSavingAmount = Math.min(150000, availableForInvestment * 12 * 0.3);
    recommendations.push({
      type: 'tax_saving',
      category: 'Tax Saving Investments',
      priority: 'high',
      recommendation: `Invest ₹${Math.round(taxSavingAmount).toLocaleString('en-IN')} in tax-saving instruments (Section 80C)`,
      suggestedAmount: Math.round(taxSavingAmount),
      taxBenefit: `Save up to ₹${Math.round(taxSavingAmount * 0.3)} in taxes (30% bracket)`,
      instruments: ['ELSS Mutual Funds', 'PPF', 'NSC', 'Tax-saving FD'],
      timeframe: 'Before March 31st',
      reason: 'Maximize tax savings under Section 80C'
    });
  }
  
  // 5. Life Insurance
  if (!hasLifeInsurance || dependents > 0) {
    const recommendedCoverage = annualIncome * 10;
    recommendations.push({
      type: 'insurance',
      category: 'Life Insurance',
      priority: dependents > 0 ? 'high' : 'medium',
      recommendation: `Get term insurance coverage of ₹${recommendedCoverage.toLocaleString('en-IN')}`,
      suggestedCoverage: recommendedCoverage,
      estimatedPremium: Math.round(recommendedCoverage * 0.001), // ~0.1% of coverage
      typeRecommendation: 'Term Insurance (Pure protection)',
      reason: `Ensure financial security for dependents (${dependents} dependent${dependents !== 1 ? 's' : ''})`
    });
  }
  
  // 6. Health Insurance
  if (!hasHealthInsurance) {
    const recommendedCoverage = dependents > 0 ? 1000000 : 500000;
    recommendations.push({
      type: 'insurance',
      category: 'Health Insurance',
      priority: 'high',
      recommendation: `Get health insurance coverage of ₹${recommendedCoverage.toLocaleString('en-IN')}`,
      suggestedCoverage: recommendedCoverage,
      estimatedPremium: dependents > 0 ? '₹25,000-35,000' : '₹15,000-25,000',
      reason: 'Protect against medical emergencies and high healthcare costs'
    });
  }
  
  // 7. Retirement Planning
  if (age < 45) {
    const retirementAge = 60;
    const yearsToRetirement = retirementAge - age;
    const retirementCorpus = monthlyExpenses * 12 * 25; // 25 years expenses
    const monthlyContribution = retirementCorpus / (yearsToRetirement * 12 * 1.12); // Simplified calculation
    
    recommendations.push({
      type: 'retirement',
      category: 'Retirement Planning',
      priority: 'medium',
      recommendation: `Start retirement planning - target corpus ₹${Math.round(retirementCorpus).toLocaleString('en-IN')}`,
      suggestedMonthlyContribution: Math.round(monthlyContribution),
      targetCorpus: Math.round(retirementCorpus),
      yearsToRetirement,
      instruments: ['NPS', 'PPF', 'Equity Mutual Funds', 'EPF'],
      reason: `Plan for comfortable retirement in ${yearsToRetirement} years`
    });
  }
  
  // 8. Goal-based Recommendations
  goals.forEach((goal, index) => {
    if (goal.amount && goal.timeframe) {
      const monthsToGoal = goal.timeframe * 12;
      const monthlyRequired = goal.amount / monthsToGoal;
      
      recommendations.push({
        type: 'goal',
        category: `Goal: ${goal.name}`,
        priority: goal.priority || 'medium',
        recommendation: `Save ₹${Math.round(monthlyRequired).toLocaleString('en-IN')}/month for ${goal.name}`,
        targetAmount: goal.amount,
        monthlyRequired: Math.round(monthlyRequired),
        timeframe: `${goal.timeframe} years`,
        instrument: goal.type === 'short_term' ? 'FD/Liquid Funds' : 'SIP/Equity Funds',
        reason: `Achieve ${goal.name} in ${goal.timeframe} years`
      });
    }
  });
  
  return {
    recommendations,
    summary: {
      totalRecommendations: recommendations.length,
      highPriority: recommendations.filter(r => r.priority === 'high').length,
      mediumPriority: recommendations.filter(r => r.priority === 'medium').length,
      lowPriority: recommendations.filter(r => r.priority === 'low').length,
      totalSuggestedMonthlyInvestment: recommendations
        .filter(r => r.suggestedAmount || r.suggestedMonthlyContribution || r.monthlyRequired)
        .reduce((sum, r) => sum + (r.suggestedAmount || r.suggestedMonthlyContribution || r.monthlyRequired || 0), 0)
    },
    generatedAt: new Date().toISOString()
  };
};

/**
 * Get recommended mutual fund schemes based on risk and age
 */
exports.getRecommendedSchemes = (riskTolerance, age) => {
  const schemes = {
    high: {
      largeCap: ['HDFC Top 100 Fund', 'ICICI Prudential Bluechip Fund', 'SBI Bluechip Fund'],
      midCap: ['HDFC Mid-Cap Opportunities Fund', 'Axis Midcap Fund', 'Franklin India Prima Fund'],
      smallCap: ['HDFC Small Cap Fund', 'SBI Small Cap Fund', 'Nippon India Small Cap Fund']
    },
    moderate: {
      largeCap: ['HDFC Top 100 Fund', 'ICICI Prudential Bluechip Fund', 'SBI Bluechip Fund'],
      midCap: ['HDFC Mid-Cap Opportunities Fund', 'Axis Midcap Fund'],
      smallCap: []
    },
    low: {
      largeCap: ['HDFC Top 100 Fund', 'ICICI Prudential Bluechip Fund'],
      midCap: [],
      smallCap: []
    }
  };
  
  return schemes[riskTolerance] || schemes.moderate;
};

