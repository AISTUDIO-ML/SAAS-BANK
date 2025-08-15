function calculateStreamPricing(planType, duration, customAmount) {
  const basePrices = {
    basic: 10,
    premium: 30,
    enterprise: 100
  };

  const discounts = {
    monthly: 0,
    quarterly: 0.1, // 10% discount
    annual: 0.2, // 20% discount
    custom: 0.05 // 5% discount for custom periods
  };

  let basePrice;
  let discount = 0;
  let finalPrice;
  let durationDays;

  if (planType === 'custom' && customAmount) {
    basePrice = parseFloat(customAmount);
    discount = duration >= 90 ? discounts.custom : 0;
    durationDays = duration;
  } else {
    basePrice = basePrices[planType] || basePrices.basic;

    // Determine discount based on duration
    if (duration >= 365) {
      discount = discounts.annual;
      durationDays = 365;
    } else if (duration >= 90) {
      discount = discounts.quarterly;
      durationDays = 90;
    } else {
      discount = discounts.monthly;
      durationDays = 30;
    }

    // Adjust price for duration
    basePrice = basePrice * (durationDays / 30);
  }

  const discountAmount = basePrice * discount;
  finalPrice = basePrice - discountAmount;

  // Calculate flow rate for Superfluid (wei per second)
  const monthlyPriceUSD = finalPrice / (durationDays / 30);
  const flowRateWeiPerSecond = Math.floor(monthlyPriceUSD / 30 / 24 / 60 / 60 * 1e18);

  return {
    planType,
    duration: durationDays,
    basePrice: Math.round(basePrice * 100) / 100,
    discount: Math.round(discount * 100),
    discountAmount: Math.round(discountAmount * 100) / 100,
    finalPrice: Math.round(finalPrice * 100) / 100,
    monthlyEquivalent: Math.round(monthlyPriceUSD * 100) / 100,
    flowRateWeiPerSecond: flowRateWeiPerSecond.toString(),
    savings: discountAmount > 0 ? Math.round(discountAmount * 100) / 100 : 0,
    recommended: duration >= 365 ? true : false
  };
}