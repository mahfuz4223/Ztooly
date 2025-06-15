
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calculator, Percent, TrendingUp, TrendingDown, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PercentageCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"basic" | "increase" | "decrease" | "what-percent">("basic");
  const navigate = useNavigate();

  // Basic percentage calculation (X% of Y)
  const [basicPercent, setBasicPercent] = useState("");
  const [basicNumber, setBasicNumber] = useState("");
  const [basicResult, setBasicResult] = useState<number | null>(null);

  // Percentage increase
  const [increaseOriginal, setIncreaseOriginal] = useState("");
  const [increasePercent, setIncreasePercent] = useState("");
  const [increaseResult, setIncreaseResult] = useState<number | null>(null);

  // Percentage decrease
  const [decreaseOriginal, setDecreaseOriginal] = useState("");
  const [decreasePercent, setDecreasePercent] = useState("");
  const [decreaseResult, setDecreaseResult] = useState<number | null>(null);

  // What percentage is X of Y
  const [whatPercentX, setWhatPercentX] = useState("");
  const [whatPercentY, setWhatPercentY] = useState("");
  const [whatPercentResult, setWhatPercentResult] = useState<number | null>(null);

  const calculateBasic = () => {
    const percent = parseFloat(basicPercent);
    const number = parseFloat(basicNumber);
    if (!isNaN(percent) && !isNaN(number)) {
      setBasicResult((percent / 100) * number);
    }
  };

  const calculateIncrease = () => {
    const original = parseFloat(increaseOriginal);
    const percent = parseFloat(increasePercent);
    if (!isNaN(original) && !isNaN(percent)) {
      setIncreaseResult(original + (original * percent / 100));
    }
  };

  const calculateDecrease = () => {
    const original = parseFloat(decreaseOriginal);
    const percent = parseFloat(decreasePercent);
    if (!isNaN(original) && !isNaN(percent)) {
      setDecreaseResult(original - (original * percent / 100));
    }
  };

  const calculateWhatPercent = () => {
    const x = parseFloat(whatPercentX);
    const y = parseFloat(whatPercentY);
    if (!isNaN(x) && !isNaN(y) && y !== 0) {
      setWhatPercentResult((x / y) * 100);
    }
  };

  const resetAll = () => {
    setBasicPercent("");
    setBasicNumber("");
    setBasicResult(null);
    setIncreaseOriginal("");
    setIncreasePercent("");
    setIncreaseResult(null);
    setDecreaseOriginal("");
    setDecreasePercent("");
    setDecreaseResult(null);
    setWhatPercentX("");
    setWhatPercentY("");
    setWhatPercentResult(null);
  };

  const getTabIcon = (tab: typeof activeTab) => {
    switch (tab) {
      case "basic":
        return <Calculator className="w-4 h-4" />;
      case "increase":
        return <TrendingUp className="w-4 h-4" />;
      case "decrease":
        return <TrendingDown className="w-4 h-4" />;
      case "what-percent":
        return <HelpCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="max-w-6xl mx-auto px-4 py-8 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="mr-1"
          onClick={() => navigate("/")}
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-3">
          <Percent className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Percentage Calculator
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-8">
        <div className="mb-8 text-center">
          <p className="text-lg text-gray-600 mb-4">
            Calculate percentages, increases, decreases, and find what percentage one number is of another.
          </p>
          <p className="text-sm text-gray-500">
            Perfect for discounts, tips, grades, statistics, and financial calculations.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 p-1 bg-white rounded-lg shadow-sm border">
          {[
            { key: "basic", label: "Basic Percentage", desc: "Find X% of Y" },
            { key: "increase", label: "Percentage Increase", desc: "Add X% to a number" },
            { key: "decrease", label: "Percentage Decrease", desc: "Subtract X% from a number" },
            { key: "what-percent", label: "What Percentage", desc: "Find what % X is of Y" }
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className="flex-1 flex flex-col items-center gap-1 h-auto py-3"
            >
              {getTabIcon(tab.key as typeof activeTab)}
              <span className="font-medium">{tab.label}</span>
              <span className="text-xs opacity-70">{tab.desc}</span>
            </Button>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Calculator Card */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="flex items-center gap-3 text-xl">
                {getTabIcon(activeTab)}
                <span>
                  {activeTab === "basic" && "Calculate X% of Y"}
                  {activeTab === "increase" && "Add Percentage to Number"}
                  {activeTab === "decrease" && "Subtract Percentage from Number"}
                  {activeTab === "what-percent" && "Find Percentage Ratio"}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {activeTab === "basic" && (
                <>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Find what percentage of a number equals. For example: What is 25% of 200?
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="basic-percent" className="font-medium">
                          Percentage (%)
                        </Label>
                        <Input
                          id="basic-percent"
                          type="number"
                          placeholder="25"
                          value={basicPercent}
                          onChange={(e) => setBasicPercent(e.target.value)}
                          className="text-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="basic-number" className="font-medium">
                          Of Number
                        </Label>
                        <Input
                          id="basic-number"
                          type="number"
                          placeholder="200"
                          value={basicNumber}
                          onChange={(e) => setBasicNumber(e.target.value)}
                          className="text-lg"
                        />
                      </div>
                    </div>
                  </div>
                  <Button onClick={calculateBasic} className="w-full" size="lg">
                    Calculate {basicPercent}% of {basicNumber}
                  </Button>
                </>
              )}

              {activeTab === "increase" && (
                <>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Add a percentage to a number. For example: Increase 100 by 20% = 120
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="increase-original" className="font-medium">
                          Original Number
                        </Label>
                        <Input
                          id="increase-original"
                          type="number"
                          placeholder="100"
                          value={increaseOriginal}
                          onChange={(e) => setIncreaseOriginal(e.target.value)}
                          className="text-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="increase-percent" className="font-medium">
                          Increase by (%)
                        </Label>
                        <Input
                          id="increase-percent"
                          type="number"
                          placeholder="20"
                          value={increasePercent}
                          onChange={(e) => setIncreasePercent(e.target.value)}
                          className="text-lg"
                        />
                      </div>
                    </div>
                  </div>
                  <Button onClick={calculateIncrease} className="w-full" size="lg">
                    Calculate Increase
                  </Button>
                </>
              )}

              {activeTab === "decrease" && (
                <>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Subtract a percentage from a number. For example: Decrease 100 by 15% = 85
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="decrease-original" className="font-medium">
                          Original Number
                        </Label>
                        <Input
                          id="decrease-original"
                          type="number"
                          placeholder="100"
                          value={decreaseOriginal}
                          onChange={(e) => setDecreaseOriginal(e.target.value)}
                          className="text-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="decrease-percent" className="font-medium">
                          Decrease by (%)
                        </Label>
                        <Input
                          id="decrease-percent"
                          type="number"
                          placeholder="15"
                          value={decreasePercent}
                          onChange={(e) => setDecreasePercent(e.target.value)}
                          className="text-lg"
                        />
                      </div>
                    </div>
                  </div>
                  <Button onClick={calculateDecrease} className="w-full" size="lg">
                    Calculate Decrease
                  </Button>
                </>
              )}

              {activeTab === "what-percent" && (
                <>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Find what percentage one number is of another. For example: 50 is what % of 200? = 25%
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="what-percent-x" className="font-medium">
                          First Number
                        </Label>
                        <Input
                          id="what-percent-x"
                          type="number"
                          placeholder="50"
                          value={whatPercentX}
                          onChange={(e) => setWhatPercentX(e.target.value)}
                          className="text-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="what-percent-y" className="font-medium">
                          Of This Number
                        </Label>
                        <Input
                          id="what-percent-y"
                          type="number"
                          placeholder="200"
                          value={whatPercentY}
                          onChange={(e) => setWhatPercentY(e.target.value)}
                          className="text-lg"
                        />
                      </div>
                    </div>
                  </div>
                  <Button onClick={calculateWhatPercent} className="w-full" size="lg">
                    Calculate Percentage
                  </Button>
                </>
              )}

              <Button onClick={resetAll} variant="outline" className="w-full">
                Clear All Fields
              </Button>
            </CardContent>
          </Card>

          {/* Results Card */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-xl">Results & Examples</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {activeTab === "basic" && basicResult !== null && (
                <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700 mb-2 font-medium">Result:</p>
                  <p className="text-3xl font-bold text-green-800 mb-2">
                    {basicResult.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600">
                    {basicPercent}% of {basicNumber} = {basicResult.toLocaleString()}
                  </p>
                </div>
              )}

              {activeTab === "increase" && increaseResult !== null && (
                <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700 mb-2 font-medium">Result:</p>
                  <p className="text-3xl font-bold text-blue-800 mb-2">
                    {increaseResult.toLocaleString()}
                  </p>
                  <p className="text-sm text-blue-600">
                    {increaseOriginal} + {increasePercent}% = {increaseResult.toLocaleString()}
                  </p>
                  <p className="text-xs text-blue-500 mt-1">
                    Increase amount: +{((parseFloat(increaseOriginal) * parseFloat(increasePercent)) / 100).toLocaleString()}
                  </p>
                </div>
              )}

              {activeTab === "decrease" && decreaseResult !== null && (
                <div className="p-6 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-700 mb-2 font-medium">Result:</p>
                  <p className="text-3xl font-bold text-orange-800 mb-2">
                    {decreaseResult.toLocaleString()}
                  </p>
                  <p className="text-sm text-orange-600">
                    {decreaseOriginal} - {decreasePercent}% = {decreaseResult.toLocaleString()}
                  </p>
                  <p className="text-xs text-orange-500 mt-1">
                    Decrease amount: -{((parseFloat(decreaseOriginal) * parseFloat(decreasePercent)) / 100).toLocaleString()}
                  </p>
                </div>
              )}

              {activeTab === "what-percent" && whatPercentResult !== null && (
                <div className="p-6 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-sm text-purple-700 mb-2 font-medium">Result:</p>
                  <p className="text-3xl font-bold text-purple-800 mb-2">
                    {whatPercentResult.toFixed(2)}%
                  </p>
                  <p className="text-sm text-purple-600">
                    {whatPercentX} is {whatPercentResult.toFixed(2)}% of {whatPercentY}
                  </p>
                </div>
              )}

              {/* Examples Section */}
              <div className="p-6 bg-gray-50 rounded-lg border">
                <h3 className="font-semibold mb-4 text-gray-900">Common Examples:</h3>
                <div className="text-sm text-gray-600 space-y-2">
                  {activeTab === "basic" && (
                    <>
                      <p>• 25% of 200 = 50 (quarter of 200)</p>
                      <p>• 10% of 500 = 50 (tip calculation)</p>
                      <p>• 75% of 80 = 60 (test score)</p>
                      <p>• 15% of 120 = 18 (discount amount)</p>
                    </>
                  )}
                  {activeTab === "increase" && (
                    <>
                      <p>• 100 + 20% = 120 (price increase)</p>
                      <p>• 50 + 10% = 55 (salary raise)</p>
                      <p>• 200 + 25% = 250 (markup)</p>
                      <p>• 1000 + 5% = 1050 (interest)</p>
                    </>
                  )}
                  {activeTab === "decrease" && (
                    <>
                      <p>• 100 - 20% = 80 (discount)</p>
                      <p>• 50 - 10% = 45 (sale price)</p>
                      <p>• 200 - 25% = 150 (clearance)</p>
                      <p>• 1000 - 15% = 850 (tax deduction)</p>
                    </>
                  )}
                  {activeTab === "what-percent" && (
                    <>
                      <p>• 25 is 50% of 50 (half)</p>
                      <p>• 10 is 20% of 50 (one fifth)</p>
                      <p>• 75 is 37.5% of 200</p>
                      <p>• 90 is 90% of 100 (A grade)</p>
                    </>
                  )}
                </div>
              </div>

              {/* Usage Tips */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">💡 Usage Tips:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Use decimals for precise calculations (e.g., 12.5%)</li>
                  <li>• Great for calculating tips, discounts, and taxes</li>
                  <li>• Perfect for academic grade calculations</li>
                  <li>• Useful for business markup and profit margins</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PercentageCalculator;
