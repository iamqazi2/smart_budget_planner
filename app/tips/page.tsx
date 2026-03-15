'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, PiggyBank, TrendingUp, Target, Shield, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle2, Calculator, Calendar, CreditCard } from 'lucide-react';

const tips = [
  {
    category: 'Budgeting Basics',
    icon: Calculator,
    color: 'emerald',
    tips: [
      {
        title: 'Follow the 50/30/20 Rule',
        description:
          'Allocate 50% of income to needs (rent, utilities, groceries), 30% to wants (entertainment, dining out), and 20% to savings and debt repayment.',
        icon: PiggyBank,
      },
      {
        title: 'Track Every Expense',
        description:
          'Small purchases add up quickly. Track everything you spend, no matter how small, to understand your spending patterns.',
        icon: CheckCircle2,
      },
      {
        title: 'Review Weekly',
        description:
          'Check your budget and expenses at least once a week to stay on track and make adjustments as needed.',
        icon: Calendar,
      },
    ],
  },
  {
    category: 'Saving Strategies',
    icon: PiggyBank,
    color: 'teal',
    tips: [
      {
        title: 'Build an Emergency Fund',
        description:
          'Aim to save 3-6 months of expenses in an easily accessible account for unexpected situations.',
        icon: Shield,
      },
      {
        title: 'Automate Your Savings',
        description:
          'Set up automatic transfers to your savings account right after payday. Pay yourself first!',
        icon: TrendingUp,
      },
      {
        title: 'Use the 24-Hour Rule',
        description:
          'Wait 24 hours before making non-essential purchases. This helps avoid impulse buying.',
        icon: Target,
      },
    ],
  },
  {
    category: 'Common Mistakes',
    icon: AlertTriangle,
    color: 'amber',
    tips: [
      {
        title: 'Not Planning for Irregular Expenses',
        description:
          'Account for annual or quarterly expenses like insurance, car maintenance, or subscriptions in your monthly budget.',
        icon: AlertTriangle,
      },
      {
        title: 'Ignoring Small Subscriptions',
        description:
          'Review all recurring subscriptions regularly. Cancel services you no longer use or need.',
        icon: CreditCard,
      },
      {
        title: 'Setting Unrealistic Goals',
        description:
          'Be realistic with your budget. Too restrictive budgets are hard to maintain and often fail.',
        icon: Target,
      },
    ],
  },
];

const quickTips = [
  'Use cash for discretionary spending to limit overspending',
  'Compare prices before making purchases',
  'Cook at home more often to save on food costs',
  'Take advantage of free entertainment options',
  'Negotiate bills and recurring expenses annually',
  'Buy generic brands when quality is comparable',
  'Use coupons and cashback apps strategically',
  'Plan major purchases during sale seasons',
];

export default function Tips() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-4">
          <Lightbulb className="w-4 h-4" />
          Financial Wisdom
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Budget Tips & Advice</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Expert advice to help you manage your money better and achieve your financial goals
        </p>
      </div>

      <div className="space-y-12">
        {tips.map((section, index) => {
          const SectionIcon = section.icon;
          return (
            <div key={index}>
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br from-${section.color}-500 to-${section.color}-600 flex items-center justify-center`}
                >
                  <SectionIcon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{section.category}</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {section.tips.map((tip, tipIndex) => {
                  const TipIcon = tip.icon;
                  return (
                    <Card
                      key={tipIndex}
                      className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center mb-3">
                          <TipIcon className="w-6 h-6 text-emerald-600" />
                        </div>
                        <CardTitle className="text-lg">{tip.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{tip.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Quick Money-Saving Tips</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickTips.map((tip, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700 text-sm">{tip}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-12 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Take Control?</h2>
        <p className="text-xl text-emerald-50 mb-8 max-w-2xl mx-auto">
          Start applying these tips today and watch your financial health improve
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/budget-planner"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-emerald-600 font-medium hover:bg-emerald-50 shadow-lg transition-all"
          >
            Create Your Budget
          </a>
          <a
            href="/expense-tracker"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-white text-white font-medium hover:bg-white/10 transition-all"
          >
            Track Expenses
          </a>
        </div>
      </div>

      <div className="mt-16 grid md:grid-cols-3 gap-8">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Set Clear Goals</h3>
            <p className="text-gray-600">
              Define specific, measurable financial goals to stay motivated and focused on your budget.
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Progress</h3>
            <p className="text-gray-600">
              Regularly review your spending and savings to see how far you've come and adjust as needed.
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Stay Consistent</h3>
            <p className="text-gray-600">
              Building good financial habits takes time. Be patient and consistent with your efforts.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
