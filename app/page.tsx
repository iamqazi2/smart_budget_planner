'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, TrendingUp, ChartPie as PieChart, Target, ArrowRight, CircleCheck as CheckCircle2, Sparkles, Shield, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="w-full">
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              Your Personal Finance Assistant
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6 animate-fade-in-up">
              Take Control of Your
              <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Financial Future
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
              Plan your budget, track expenses, and achieve your financial goals with our smart,
              intuitive budgeting tool. Start building better money habits today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
              <Link href="/budget-planner">
                <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  Start Budget Planning
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="border-2 hover:bg-emerald-50 transition-all duration-300">
                  View Dashboard
                  <PieChart className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose SmartBudget?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your money effectively in one place
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Simple & Secure',
                description: 'Easy to use interface with secure data storage. No complex features, just what you need.',
                color: 'emerald',
              },
              {
                icon: Zap,
                title: 'Real-time Insights',
                description: 'Get instant feedback on your spending habits and budget status with visual charts.',
                color: 'teal',
              },
              {
                icon: Target,
                title: 'Goal Focused',
                description: 'Set financial goals and track your progress. Stay motivated with clear targets.',
                color: 'green',
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three simple steps to better financial management
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: Wallet,
                title: 'Set Your Budget',
                description: 'Enter your monthly income and allocate amounts to different spending categories.',
              },
              {
                step: '02',
                icon: TrendingUp,
                title: 'Track Expenses',
                description: 'Record your daily expenses and watch your spending patterns emerge.',
              },
              {
                step: '03',
                icon: PieChart,
                title: 'Analyze & Improve',
                description: 'Review insights and adjust your budget to reach your financial goals faster.',
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center text-emerald-600 font-bold text-sm">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Quick Budgeting Tips
            </h2>
            <p className="text-lg text-gray-600">
              Essential advice to get started
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              'Follow the 50/30/20 rule: 50% needs, 30% wants, 20% savings',
              'Track every expense, no matter how small',
              'Review your budget weekly to stay on track',
              'Build an emergency fund of 3-6 months expenses',
            ].map((tip, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
                <CardContent className="p-6">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mb-3" />
                  <p className="text-gray-700">{tip}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/tips">
              <Button variant="outline" size="lg" className="border-2 hover:bg-emerald-50">
                View All Tips
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-12 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Start Your Financial Journey?
            </h2>
            <p className="text-xl text-emerald-50 mb-8">
              Join thousands of users who have taken control of their finances
            </p>
            <Link href="/budget-planner">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 shadow-lg hover:shadow-xl transition-all duration-300">
                Get Started Now
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
