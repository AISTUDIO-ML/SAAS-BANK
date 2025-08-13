
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Waves, Clock, Shield, BarChart3, Coins, Users } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
  {
    icon: Waves,
    title: "Superfluid Integration",
    description: "Real-time money streaming for continuous subscription payments without manual transactions.",
    gradient: "from-blue-500 to-blue-600"
  },
  {
    icon: Clock,
    title: "Sablier Time-locks",
    description: "Secure time-locked payments for scheduled releases and long-term commitments.",
    gradient: "from-purple-500 to-purple-600"
  },
  {
    icon: Shield,
    title: "AI Access Control",
    description: "Intelligent monitoring and automatic access management based on payment streams.",
    gradient: "from-green-500 to-green-600"
  },
  {
    icon: Coins,
    title: "USDT Billing",
    description: "Stable cryptocurrency billing on Ethereum-compatible chains for predictable costs.",
    gradient: "from-orange-500 to-orange-600"
  },
  {
    icon: BarChart3,
    title: "Stream Analytics",
    description: "Real-time monitoring of payment streams with comprehensive dashboards and insights.",
    gradient: "from-indigo-500 to-indigo-600"
  },
  {
    icon: Users,
    title: "User Management",
    description: "Complete admin dashboard for managing users, subscriptions, and payment streams.",
    gradient: "from-pink-500 to-pink-600"
  }];


  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Modern SaaS
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Leverage cutting-edge blockchain technology to revolutionize your subscription model
            with automated payments and intelligent access control.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>);

          })}
        </div>
      </div>
    </section>);

};

export default FeaturesSection;