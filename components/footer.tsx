import Link from 'next/link';
import { Wallet } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-white/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-semibold text-gray-900">SmartBudget</p>
                <p className="text-sm text-gray-600">Plan your finances, track your spending, stay in control.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-2">
            <div>
              <p className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Navigate</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/" className="hover:text-gray-900">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/budget-planner" className="hover:text-gray-900">
                    Budget Planner
                  </Link>
                </li>
                <li>
                  <Link href="/expense-tracker" className="hover:text-gray-900">
                    Expenses
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-gray-900">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/tips" className="hover:text-gray-900">
                    Tips
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Legal</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="#" className="hover:text-gray-900">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-900">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-900">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-sm text-gray-500 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} SmartBudget. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
