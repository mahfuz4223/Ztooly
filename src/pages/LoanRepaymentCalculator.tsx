
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, DollarSign, Percent, Calendar } from "lucide-react";
import { useGeneratorToolAnalytics } from '@/utils/analyticsHelper';
import { UsageStats } from '@/components/UsageStats';

const LoanRepaymentCalculator = () => {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [results, setResults] = useState<{
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
  } | null>(null);

  // Initialize analytics
  const analytics = useGeneratorToolAnalytics('loan-repayment-calculator', 'Loan Repayment Calculator');
  const calculateLoan = () => {
    // Track calculation
    analytics.trackGenerate();
    
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12; // Monthly interest rate
    const months = parseInt(loanTerm) * 12; // Convert years to months

    if (principal <= 0 || rate < 0 || months <= 0) {
      return;
    }

    // Monthly payment formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
    const monthlyPayment = principal * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - principal;

    setResults({
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalPayment: Math.round(totalPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Calculator className="h-10 w-10 text-blue-600" />
            Loan Repayment Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Calculate your monthly loan payments, total payment amount, and interest costs. 
            Perfect for mortgages, auto loans, personal loans, and more.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Loan Details
              </CardTitle>
              <CardDescription>
                Enter your loan information to calculate repayment details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="loanAmount">Loan Amount ($)</Label>
                <Input
                  id="loanAmount"
                  type="number"
                  placeholder="250,000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="text-lg"
                />
                <p className="text-sm text-gray-500">
                  The total amount you want to borrow
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.01"
                  placeholder="3.5"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="text-lg"
                />
                <p className="text-sm text-gray-500">
                  The yearly interest rate (APR)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="loanTerm">Loan Term (Years)</Label>
                <Input
                  id="loanTerm"
                  type="number"
                  placeholder="30"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  className="text-lg"
                />
                <p className="text-sm text-gray-500">
                  How many years to repay the loan
                </p>
              </div>

              <Button 
                onClick={calculateLoan} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                disabled={!loanAmount || !interestRate || !loanTerm}
              >
                Calculate Loan Payment
              </Button>
            </CardContent>
          </Card>

          {/* Results Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Payment Breakdown
              </CardTitle>
              <CardDescription>
                Your loan repayment details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results ? (
                <div className="space-y-6">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="text-center">
                      <p className="text-sm text-green-600 mb-1">Monthly Payment</p>
                      <p className="text-3xl font-bold text-green-700">
                        {formatCurrency(results.monthlyPayment)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
                      <p className="text-sm text-blue-600 mb-1">Total Payment</p>
                      <p className="text-xl font-bold text-blue-700">
                        {formatCurrency(results.totalPayment)}
                      </p>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 text-center">
                      <p className="text-sm text-orange-600 mb-1">Total Interest</p>
                      <p className="text-xl font-bold text-orange-700">
                        {formatCurrency(results.totalInterest)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Payment Summary:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• You'll pay {formatCurrency(results.monthlyPayment)} every month</li>
                      <li>• Total of {formatCurrency(results.totalInterest)} in interest over the loan term</li>
                      <li>• Interest represents {((results.totalInterest / results.totalPayment) * 100).toFixed(1)}% of total payments</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Enter loan details to see payment breakdown</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Information Section */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="h-5 w-5" />
              How Loan Payments Work
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Principal</h3>
                <p className="text-sm text-gray-600">
                  The original loan amount you borrowed
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <Percent className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Interest</h3>
                <p className="text-sm text-gray-600">
                  The cost of borrowing money, calculated as a percentage
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Term</h3>
                <p className="text-sm text-gray-600">
                  The length of time to repay the loan in full
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">💡 Tips for Better Loan Terms:</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• <strong>Improve your credit score</strong> to qualify for lower interest rates</li>
                <li>• <strong>Make a larger down payment</strong> to reduce the loan amount</li>
                <li>• <strong>Choose a shorter term</strong> to pay less interest overall</li>
                <li>• <strong>Shop around</strong> with multiple lenders to compare rates</li>
              </ul>
            </div>          </CardContent>
        </Card>
        
        {/* Usage Statistics */}
        <UsageStats toolId="loan-repayment-calculator" />
      </div>
    </div>
  );
};

export default LoanRepaymentCalculator;
