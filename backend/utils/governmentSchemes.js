// Government Schemes Eligibility Rules

/**
 * Check eligibility for Pradhan Mantri Awas Yojana (PMAY)
 */
exports.checkPMAY = (userData) => {
  const { age, annualIncome, location, hasOwnHouse, familyMembers } = userData;
  
  const eligibilityCriteria = {
    age: age >= 18,
    income: {
      ews: annualIncome <= 300000, // Economically Weaker Section
      lig: annualIncome > 300000 && annualIncome <= 600000, // Low Income Group
      mig1: annualIncome > 600000 && annualIncome <= 1200000, // Middle Income Group 1
      mig2: annualIncome > 1200000 && annualIncome <= 1800000, // Middle Income Group 2
      eligible: annualIncome <= 1800000
    },
    housing: !hasOwnHouse,
    family: familyMembers >= 1
  };
  
  const eligible = eligibilityCriteria.age && 
                   eligibilityCriteria.income.eligible && 
                   eligibilityCriteria.housing && 
                   eligibilityCriteria.family;
  
  let subsidy = 0;
  if (eligible) {
    if (eligibilityCriteria.income.ews || eligibilityCriteria.income.lig) {
      subsidy = 600000; // ₹6 Lakh subsidy
    } else if (eligibilityCriteria.income.mig1) {
      subsidy = 900000; // ₹9 Lakh subsidy
    } else if (eligibilityCriteria.income.mig2) {
      subsidy = 1200000; // ₹12 Lakh subsidy
    }
  }
  
  return {
    schemeCode: 'pmay',
    schemeName: 'Pradhan Mantri Awas Yojana',
    eligible,
    criteria: eligibilityCriteria,
    subsidy,
    details: 'Housing scheme for affordable housing with interest subsidy',
    benefits: eligible ? `Interest subsidy of up to ₹${subsidy.toLocaleString('en-IN')}` : null
  };
};

/**
 * Check eligibility for Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)
 */
exports.checkPMJJBY = (userData) => {
  const { age, hasBankAccount, hasAadhar } = userData;
  
  const eligibilityCriteria = {
    age: age >= 18 && age <= 50,
    bankAccount: hasBankAccount,
    aadhar: hasAadhar
  };
  
  const eligible = eligibilityCriteria.age && 
                   eligibilityCriteria.bankAccount && 
                   eligibilityCriteria.aadhar;
  
  return {
    schemeCode: 'pmjjby',
    schemeName: 'Pradhan Mantri Jeevan Jyoti Bima Yojana',
    eligible,
    criteria: eligibilityCriteria,
    premium: 436, // Annual premium (₹436 per year)
    coverage: 200000, // ₹2 Lakh coverage
    details: 'Life insurance scheme providing coverage for death due to any cause',
    benefits: eligible ? '₹2,00,000 life cover at ₹436 per year' : null
  };
};

/**
 * Check eligibility for Pradhan Mantri Suraksha Bima Yojana (PMSBY)
 */
exports.checkPMSBY = (userData) => {
  const { age, hasBankAccount, hasAadhar } = userData;
  
  const eligibilityCriteria = {
    age: age >= 18 && age <= 70,
    bankAccount: hasBankAccount,
    aadhar: hasAadhar
  };
  
  const eligible = eligibilityCriteria.age && 
                   eligibilityCriteria.bankAccount && 
                   eligibilityCriteria.aadhar;
  
  return {
    schemeCode: 'pmsby',
    schemeName: 'Pradhan Mantri Suraksha Bima Yojana',
    eligible,
    criteria: eligibilityCriteria,
    premium: 20, // Annual premium (₹20 per year)
    coverage: 200000, // ₹2 Lakh coverage
    details: 'Accidental death and disability insurance scheme',
    benefits: eligible ? '₹2,00,000 accidental death/disability cover at ₹20 per year' : null
  };
};

/**
 * Check eligibility for Atal Pension Yojana (APY)
 */
exports.checkAPY = (userData) => {
  const { age, hasBankAccount, hasAadhar, occupation } = userData;
  
  const eligibilityCriteria = {
    age: age >= 18 && age <= 40,
    bankAccount: hasBankAccount,
    aadhar: hasAadhar,
    occupation: occupation !== 'government' // Excludes government employees
  };
  
  const eligible = eligibilityCriteria.age && 
                   eligibilityCriteria.bankAccount && 
                   eligibilityCriteria.aadhar &&
                   eligibilityCriteria.occupation;
  
  const pensionOptions = [1000, 2000, 3000, 4000, 5000];
  const contributionAmounts = {
    1000: { monthly: 42, yearly: 504 },
    2000: { monthly: 84, yearly: 1008 },
    3000: { monthly: 126, yearly: 1512 },
    4000: { monthly: 168, yearly: 2016 },
    5000: { monthly: 210, yearly: 2520 }
  };
  
  return {
    schemeCode: 'apy',
    schemeName: 'Atal Pension Yojana',
    eligible,
    criteria: eligibilityCriteria,
    pensionOptions,
    contributionAmounts,
    details: 'Pension scheme for workers in unorganized sector',
    benefits: eligible ? 'Guaranteed pension of ₹1,000-₹5,000 per month after 60 years' : null,
    governmentContribution: eligible ? 'Government co-contribution of 50% of subscriber contribution or ₹1,000 per annum, whichever is lower' : null
  };
};

/**
 * Check eligibility for Scholarship schemes
 */
exports.checkScholarships = (userData) => {
  const { age, annualIncome, education, category, gender, state } = userData;
  
  const scholarships = [];
  
  // Pre-Matric Scholarship
  if (education === 'school' && annualIncome <= 250000) {
    const preMatricEligible = (category === 'SC' || category === 'ST' || category === 'OBC' || category === 'Minority');
    if (preMatricEligible) {
      scholarships.push({
        name: 'Pre-Matric Scholarship',
        eligible: true,
        amount: 15000, // Annual
        criteria: { education: 'school', income: '<= ₹2.5 Lakh', category },
        benefits: '₹15,000 per year for school education'
      });
    }
  }
  
  // Post-Matric Scholarship
  if (education === 'college' && annualIncome <= 250000) {
    const postMatricEligible = (category === 'SC' || category === 'ST' || category === 'OBC');
    if (postMatricEligible) {
      scholarships.push({
        name: 'Post-Matric Scholarship',
        eligible: true,
        amount: 35000, // Annual
        criteria: { education: 'college', income: '<= ₹2.5 Lakh', category },
        benefits: '₹35,000 per year for college education'
      });
    }
  }
  
  // Merit Scholarship
  if (education === 'college' && annualIncome <= 800000) {
    scholarships.push({
      name: 'Central Sector Scholarship',
      eligible: true,
      amount: 10000, // Annual
      criteria: { education: 'college', income: '<= ₹8 Lakh', meritBased: true },
      benefits: '₹10,000 per year based on merit (75% in 12th standard)'
    });
  }
  
  // Girl Child Scholarship
  if (gender === 'female' && education === 'college' && annualIncome <= 800000) {
    scholarships.push({
      name: 'Girl Child Scholarship',
      eligible: true,
      amount: 5000, // Annual
      criteria: { gender: 'female', education: 'college', income: '<= ₹8 Lakh' },
      benefits: '₹5,000 per year for girl students'
    });
  }
  
  return {
    schemeCode: 'scholarships',
    schemeName: 'Government Scholarship Schemes',
    eligible: scholarships.length > 0,
    scholarships,
    totalEligible: scholarships.length,
    details: 'Various scholarship schemes based on merit, income, and category'
  };
};

/**
 * Check eligibility for all schemes
 */
exports.checkAllSchemes = (userData) => {
  return {
    pmay: this.checkPMAY(userData),
    pmjjby: this.checkPMJJBY(userData),
    pmsby: this.checkPMSBY(userData),
    apy: this.checkAPY(userData),
    scholarships: this.checkScholarships(userData)
  };
};

