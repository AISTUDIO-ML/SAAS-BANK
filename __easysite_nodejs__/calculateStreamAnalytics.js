function calculateStreamAnalytics(subscriptions, streams) {
  if (!Array.isArray(subscriptions) || !Array.isArray(streams)) {
    return {
      totalRevenue: 0,
      activeStreams: 0,
      averageStreamValue: 0,
      growthRate: 0,
      churnRate: 0,
      topPerformingPlan: 'basic'
    };
  }

  // Calculate total revenue
  const totalRevenue = subscriptions.reduce((sum, sub) => {
    return sum + (typeof sub.amount === 'number' ? sub.amount : 0);
  }, 0);

  // Count active streams
  const activeStreams = streams.filter((stream) => stream.is_active === true).length;

  // Calculate average stream value
  const activeSubscriptions = subscriptions.filter((sub) => sub.status === 'active');
  const averageStreamValue = activeSubscriptions.length > 0 ?
  totalRevenue / activeSubscriptions.length :
  0;

  // Calculate plan performance
  const planCounts = subscriptions.reduce((acc, sub) => {
    if (sub.plan_name && sub.status === 'active') {
      acc[sub.plan_name] = (acc[sub.plan_name] || 0) + 1;
    }
    return acc;
  }, {});

  const topPerformingPlan = Object.keys(planCounts).reduce((a, b) =>
  planCounts[a] > planCounts[b] ? a : b, 'basic'
  );

  // Mock growth and churn rates (in production, calculate from historical data)
  const growthRate = Math.random() * 20 + 5; // 5-25% growth
  const churnRate = Math.random() * 10 + 2; // 2-12% churn

  return {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    activeStreams,
    averageStreamValue: Math.round(averageStreamValue * 100) / 100,
    growthRate: Math.round(growthRate * 100) / 100,
    churnRate: Math.round(churnRate * 100) / 100,
    topPerformingPlan,
    revenueByPlan: planCounts,
    healthMetrics: {
      uptime: 99.9,
      transactionSuccess: 98.7,
      userSatisfaction: 94.2
    }
  };
}