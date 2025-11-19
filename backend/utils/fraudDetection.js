// Fraud Detection Rules and Logic

/**
 * Analyze transaction for fraud patterns
 */
exports.analyzeTransaction = (transactionData, userProfile, transactionHistory = []) => {
  const riskFactors = [];
  let riskScore = 0;
  const recommendations = [];
  
  // Rule 1: Transaction > ₹50,000 without PAN
  if (transactionData.amount > 50000 && !transactionData.hasPAN) {
    riskFactors.push({
      rule: 'High value transaction without PAN',
      description: `Transaction of ₹${transactionData.amount.toLocaleString('en-IN')} exceeds ₹50,000 limit without PAN verification`,
      severity: 'high',
      score: 35
    });
    riskScore += 35;
    recommendations.push('Require PAN verification for transactions above ₹50,000');
  }
  
  // Rule 2: More than 10 transactions in 1 hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentTransactions = transactionHistory.filter(txn => 
    new Date(txn.timestamp) > oneHourAgo
  );
  
  if (recentTransactions.length > 10) {
    riskFactors.push({
      rule: 'High transaction frequency',
      description: `${recentTransactions.length} transactions in the last 1 hour`,
      severity: 'medium',
      score: 25
    });
    riskScore += 25;
    recommendations.push('Verify transaction pattern - unusual frequency detected');
  }
  
  // Rule 3: Large sudden withdrawals
  const averageTransaction = transactionHistory.length > 0
    ? transactionHistory.reduce((sum, txn) => sum + Math.abs(txn.amount), 0) / transactionHistory.length
    : 0;
  
  if (transactionData.type === 'debit' && transactionData.amount > averageTransaction * 5 && averageTransaction > 0) {
    riskFactors.push({
      rule: 'Large sudden withdrawal',
      description: `Withdrawal of ₹${transactionData.amount.toLocaleString('en-IN')} is ${(transactionData.amount / averageTransaction).toFixed(1)}x higher than average transaction`,
      severity: 'high',
      score: 30
    });
    riskScore += 30;
    recommendations.push('Verify large withdrawal - exceeds normal transaction pattern');
  }
  
  // Rule 4: Income vs transaction mismatch
  if (userProfile && userProfile.annualIncome) {
    const monthlyIncome = userProfile.annualIncome / 12;
    const transactionAmount = Math.abs(transactionData.amount);
    
    if (transactionData.type === 'debit' && transactionAmount > monthlyIncome * 0.5) {
      riskFactors.push({
        rule: 'Income vs transaction mismatch',
        description: `Transaction amount (₹${transactionAmount.toLocaleString('en-IN')}) exceeds 50% of monthly income (₹${Math.round(monthlyIncome).toLocaleString('en-IN')})`,
        severity: 'medium',
        score: 20
      });
      riskScore += 20;
      recommendations.push('Verify transaction against user income pattern');
    }
  }
  
  // Rule 5: Unusual transaction time
  const transactionTime = new Date(transactionData.timestamp);
  const hour = transactionTime.getHours();
  const day = transactionTime.getDay(); // 0 = Sunday, 6 = Saturday
  
  if ((hour >= 0 && hour < 6) || (day === 0 && hour > 20)) {
    riskFactors.push({
      rule: 'Unusual transaction time',
      description: `Transaction at ${hour}:00 on ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day]}`,
      severity: 'low',
      score: 10
    });
    riskScore += 10;
  }
  
  // Rule 6: Location mismatch
  if (transactionData.location && userProfile && userProfile.primaryLocation) {
    if (transactionData.location.toLowerCase() !== userProfile.primaryLocation.toLowerCase()) {
      riskFactors.push({
        rule: 'Location mismatch',
        description: `Transaction from ${transactionData.location}, user's primary location is ${userProfile.primaryLocation}`,
        severity: 'medium',
        score: 15
      });
      riskScore += 15;
      recommendations.push('Verify transaction location - different from user primary location');
    }
  }
  
  // Rule 7: Merchant category risk
  const highRiskMerchants = ['gambling', 'crypto_exchange', 'casino', 'adult_content'];
  if (transactionData.merchantCategory && highRiskMerchants.includes(transactionData.merchantCategory.toLowerCase())) {
    riskFactors.push({
      rule: 'High-risk merchant category',
      description: `Transaction with high-risk merchant category: ${transactionData.merchantCategory}`,
      severity: 'high',
      score: 25
    });
    riskScore += 25;
    recommendations.push('Flagged merchant category - review transaction details');
  }
  
  // Rule 8: First-time transaction pattern
  if (transactionHistory.length === 0 && transactionData.amount > 10000) {
    riskFactors.push({
      rule: 'First-time large transaction',
      description: 'First transaction and amount exceeds ₹10,000',
      severity: 'medium',
      score: 20
    });
    riskScore += 20;
    recommendations.push('Verify first-time transaction - additional verification may be required');
  }
  
  // Determine risk level
  const riskLevel = riskScore < 30 ? 'Low' : riskScore < 60 ? 'Medium' : 'High';
  const isFraudulent = riskScore >= 50;
  
  // Calculate confidence score
  const confidence = Math.max(0, Math.min(100, 100 - riskScore + (riskFactors.length * 2)));
  
  return {
    riskScore: Math.min(100, riskScore),
    riskLevel,
    isFraudulent,
    confidence: Math.round(confidence),
    riskFactors,
    recommendations: recommendations.length > 0 ? recommendations : ['No additional actions required'],
    action: isFraudulent ? 'Block and review' : riskScore >= 30 ? 'Flag for review' : 'Proceed',
    analysisTimestamp: new Date().toISOString()
  };
};

