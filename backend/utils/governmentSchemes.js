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
    benefits: eligible ? `Interest subsidy of up to ₹${subsidy.toLocaleString('en-IN')}` : null,
    applicationLink: eligible ? 'https://pmaymis.gov.in/' : null
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
    benefits: eligible ? '₹2,00,000 life cover at ₹436 per year' : null,
    applicationLink: eligible ? 'https://www.jansuraksha.gov.in/Forms.aspx' : null
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
    benefits: eligible ? '₹2,00,000 accidental death/disability cover at ₹20 per year' : null,
    applicationLink: eligible ? 'https://www.jansuraksha.gov.in/Forms.aspx' : null
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
    governmentContribution: eligible ? 'Government co-contribution of 50% of subscriber contribution or ₹1,000 per annum, whichever is lower' : null,
    applicationLink: eligible ? 'https://www.npscra.nsdl.co.in/nsdl/atal-pension-yojana/forms.php' : null
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
    details: 'Various scholarship schemes based on merit, income, and category',
    applicationLink: scholarships.length > 0 ? 'https://scholarships.gov.in/' : null
  };
};

/**
 * Check eligibility for Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)
 */
exports.checkPMKISAN = (userData) => {
  const { age, annualIncome, occupation } = userData;
  
  const eligibilityCriteria = {
    age: age >= 18,
    income: annualIncome <= 200000,
    occupation: occupation === 'farmer' || occupation === 'agriculture' || occupation === 'private'
  };
  
  const eligible = eligibilityCriteria.age && 
                   eligibilityCriteria.income && 
                   eligibilityCriteria.occupation;
  
  return {
    schemeCode: 'pmkisan',
    schemeName: 'Pradhan Mantri Kisan Samman Nidhi',
    eligible,
    criteria: eligibilityCriteria,
    benefits: eligible ? '₹6,000 per year in 3 installments of ₹2,000 each' : null,
    amount: 6000,
    details: 'Direct income support scheme for farmers',
    applicationLink: eligible ? 'https://pmkisan.gov.in/' : null
  };
};

/**
 * Check eligibility for Ayushman Bharat (PM-JAY)
 */
exports.checkAyushmanBharat = (userData) => {
  const { age, annualIncome, hasAadhar, familyMembers, occupation } = userData;
  
  const eligibilityCriteria = {
    age: age >= 0, // All ages
    income: annualIncome <= 500000, // ₹5 Lakh per family
    aadhar: hasAadhar,
    family: familyMembers >= 1,
    occupation: occupation !== 'government' // Excludes government employees
  };
  
  const eligible = eligibilityCriteria.income && 
                   eligibilityCriteria.aadhar && 
                   eligibilityCriteria.family &&
                   eligibilityCriteria.occupation;
  
  return {
    schemeCode: 'ayushman',
    schemeName: 'Ayushman Bharat / PM-JAY',
    eligible,
    criteria: eligibilityCriteria,
    coverage: 500000, // ₹5 Lakh coverage per family
    details: 'Health insurance scheme providing coverage of ₹5 Lakh per family per year',
    benefits: eligible ? 'Free healthcare coverage of ₹5,00,000 per family per year for secondary and tertiary hospitalization' : null,
    applicationLink: eligible ? 'https://pmjay.gov.in/' : null
  };
};

/**
 * Check eligibility for Pradhan Mantri Ujjwala Yojana
 */
exports.checkUjjwala = (userData) => {
  const { gender, hasOwnHouse, annualIncome, hasAadhar } = userData;
  
  const eligibilityCriteria = {
    gender: gender === 'female',
    income: annualIncome <= 100000, // Below Poverty Line
    housing: !hasOwnHouse || true, // Priority for those without LPG connection
    aadhar: hasAadhar
  };
  
  const eligible = eligibilityCriteria.gender && 
                   eligibilityCriteria.income && 
                   eligibilityCriteria.aadhar;
  
  return {
    schemeCode: 'ujjwala',
    schemeName: 'Pradhan Mantri Ujjwala Yojana',
    eligible,
    criteria: eligibilityCriteria,
    subsidy: 1600, // Subsidy on LPG connection
    details: 'Free LPG connection scheme for women from Below Poverty Line families',
    benefits: eligible ? 'Free LPG connection with subsidy of ₹1,600' : null,
    applicationLink: eligible ? 'https://www.pmuy.gov.in/' : null
  };
};

/**
 * Check eligibility for Stand Up India
 */
exports.checkStandUpIndia = (userData) => {
  const { age, category, gender, occupation, annualIncome, hasBankAccount } = userData;
  
  const eligibilityCriteria = {
    age: age >= 18,
    category: category === 'SC' || category === 'ST',
    gender: gender === 'female',
    occupation: occupation === 'business' || occupation === 'entrepreneur' || occupation === 'private',
    income: annualIncome <= 2000000, // ₹20 Lakh
    bankAccount: hasBankAccount
  };
  
  const eligible = (eligibilityCriteria.category || eligibilityCriteria.gender) &&
                   eligibilityCriteria.age && 
                   eligibilityCriteria.occupation && 
                   eligibilityCriteria.income &&
                   eligibilityCriteria.bankAccount;
  
  return {
    schemeCode: 'standup',
    schemeName: 'Stand Up India',
    eligible,
    criteria: eligibilityCriteria,
    loanAmount: 10000000, // Up to ₹1 Crore
    details: 'Loan scheme for SC/ST and women entrepreneurs',
    benefits: eligible ? 'Bank loans from ₹10 lakh to ₹1 crore for setting up new enterprises' : null,
    applicationLink: eligible ? 'https://www.standupmitra.in/' : null
  };
};

/**
 * Check eligibility for MUDRA
 */
exports.checkMUDRA = (userData) => {
  const { age, occupation, annualIncome, hasBankAccount } = userData;
  
  const eligibilityCriteria = {
    age: age >= 18,
    occupation: occupation === 'business' || occupation === 'entrepreneur' || occupation === 'private',
    income: annualIncome <= 10000000, // Micro and small enterprises
    bankAccount: hasBankAccount
  };
  
  const eligible = eligibilityCriteria.age && 
                   eligibilityCriteria.occupation && 
                   eligibilityCriteria.income &&
                   eligibilityCriteria.bankAccount;
  
  const loanCategories = {
    shishu: { amount: 50000, name: 'Shishu (up to ₹50,000)' },
    kishore: { amount: 500000, name: 'Kishore (₹50,001 to ₹5,00,000)' },
    tarun: { amount: 1000000, name: 'Tarun (₹5,00,001 to ₹10,00,000)' }
  };
  
  return {
    schemeCode: 'mudra',
    schemeName: 'MUDRA (Micro Units Development & Refinance Agency)',
    eligible,
    criteria: eligibilityCriteria,
    loanCategories,
    details: 'Loan scheme for micro and small enterprises',
    benefits: eligible ? 'Loans up to ₹10 lakh for micro and small businesses in three categories: Shishu, Kishore, and Tarun' : null,
    applicationLink: eligible ? 'https://www.mudra.org.in/' : null
  };
};

/**
 * Check eligibility for Pradhan Mantri Matru Vandana Yojana
 */
exports.checkMatruVandana = (userData) => {
  const { age, gender, hasBankAccount, hasAadhar, occupation, annualIncome } = userData;
  
  const eligibilityCriteria = {
    age: age >= 19 && age <= 40,
    gender: gender === 'female',
    bankAccount: hasBankAccount,
    aadhar: hasAadhar,
    occupation: occupation !== 'government', // Excludes government employees
    income: annualIncome <= 150000 // Below Poverty Line
  };
  
  const eligible = eligibilityCriteria.age && 
                   eligibilityCriteria.gender && 
                   eligibilityCriteria.bankAccount &&
                   eligibilityCriteria.aadhar &&
                   eligibilityCriteria.occupation &&
                   eligibilityCriteria.income;
  
  return {
    schemeCode: 'matruvandana',
    schemeName: 'Pradhan Mantri Matru Vandana Yojana',
    eligible,
    criteria: eligibilityCriteria,
    amount: 5000, // Total benefit
    details: 'Maternity benefit scheme for pregnant and lactating mothers',
    benefits: eligible ? '₹5,000 in three installments for first live birth' : null,
    applicationLink: eligible ? 'https://pmmvy.nic.in/' : null
  };
};

/**
 * Check eligibility for PM-KMY (Kisan Maan Dhan Yojana)
 */
exports.checkPMKMY = (userData) => {
  const { age, hasBankAccount, hasAadhar, occupation, annualIncome } = userData;
  
  const eligibilityCriteria = {
    age: age >= 18 && age <= 40,
    bankAccount: hasBankAccount,
    aadhar: hasAadhar,
    occupation: occupation === 'farmer' || occupation === 'agriculture',
    income: annualIncome <= 150000 // Small and marginal farmers
  };
  
  const eligible = eligibilityCriteria.age && 
                   eligibilityCriteria.bankAccount && 
                   eligibilityCriteria.aadhar &&
                   eligibilityCriteria.occupation &&
                   eligibilityCriteria.income;
  
  const pensionAmounts = {
    min: 3000,
    max: 5000
  };
  
  return {
    schemeCode: 'pmkmy',
    schemeName: 'Pradhan Mantri Kisan Maan Dhan Yojana',
    eligible,
    criteria: eligibilityCriteria,
    pensionRange: pensionAmounts,
    details: 'Pension scheme for small and marginal farmers',
    benefits: eligible ? 'Minimum assured pension of ₹3,000 per month after 60 years of age' : null,
    contribution: 'Monthly contribution varies based on age (₹55 to ₹200)',
    applicationLink: eligible ? 'https://pmkmy.gov.in/' : null
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
    scholarships: this.checkScholarships(userData),
    pmkisan: this.checkPMKISAN(userData),
    ayushman: this.checkAyushmanBharat(userData),
    ujjwala: this.checkUjjwala(userData),
    standup: this.checkStandUpIndia(userData),
    mudra: this.checkMUDRA(userData),
    matruvandana: this.checkMatruVandana(userData),
    pmkmy: this.checkPMKMY(userData)
  };
};

