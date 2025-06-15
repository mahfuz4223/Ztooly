
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calculator, Percent } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-background">
      <header className="max-w-4xl mx-auto px-4 py-8 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="mr-1"
          onClick={() => navigate("/")}
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <Percent className="w-8 h-8 text-primary" />
          Percentage Calculator
        </h1>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 p-1 bg-muted rounded-lg">
          <Button
            variant={activeTab === "basic" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("basic")}
          >
            Basic %
          </Button>
          <Button
            variant={activeTab === "increase" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("increase")}
          >
            % Increase
          </Button>
          <Button
            variant={activeTab === "decrease" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("decrease")}
          >
            % Decrease
          </Button>
          <Button
            variant={activeTab === "what-percent" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("what-percent")}
          >
            What %
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Calculator Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                {activeTab === "basic" && "Calculate X% of Y"}
                {activeTab === "increase" && "Percentage Increase"}
                {activeTab === "decrease" && "Percentage Decrease"}
                {activeTab === "what-percent" && "What Percentage"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeTab === "basic" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="basic-percent">Percentage (%)</Label>
                      <Input
                        id="basic-percent"
                        type="number"
                        placeholder="25"
                        value={basicPercent}
                        onChange={(e) => setBasicPercent(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="basic-number">Of Number</Label>
                      <Input
                        id="basic-number"
                        type="number"
                        placeholder="200"
                        value={basicNumber}
                        onChange={(e) => setBasicNumber(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button onClick={calculateBasic} className="w-full">
                    Calculate {basicPercent}% of {basicNumber}
                  </Button>
                </>
              )}

              {activeTab === "increase" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="increase-original">Original Number</Label>
                      <Input
                        id="increase-original"
                        type="number"
                        placeholder="100"
                        value={increaseOriginal}
                        onChange={(e) => setIncreaseOriginal(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="increase-percent">Increase by (%)</Label>
                      <Input
                        id="increase-percent"
                        type="number"
                        placeholder="20"
                        value={increasePercent}
                        onChange={(e) => setIncreasePercent(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button onClick={calculateIncrease} className="w-full">
                    Calculate Increase
                  </Button>
                </>
              )}

              {activeTab === "decrease" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="decrease-original">Original Number</Label>
                      <Input
                        id="decrease-original"
                        type="number"
                        placeholder="100"
                        value={decreaseOriginal}
                        onChange={(e) => setDecreaseOriginal(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="decrease-percent">Decrease by (%)</Label>
                      <Input
                        id="decrease-percent"
                        type="number"
                        placeholder="15"
                        value={decreasePercent}
                        onChange={(e) => setDecreasePercent(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button onClick={calculateDecrease} className="w-full">
                    Calculate Decrease
                  </Button>
                </>
              )}

              {activeTab === "what-percent" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="what-percent-x">Number</Label>
                      <Input
                        id="what-percent-x"
                        type="number"
                        placeholder="50"
                        value={whatPercentX}
                        onChange={(e) => setWhatPercentX(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="what-percent-y">Of Number</Label>
                      <Input
                        id="what-percent-y"
                        type="number"
                        placeholder="200"
                        value={whatPercentY}
                        onChange={(e) => setWhatPercentY(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button onClick={calculateWhatPercent} className="w-full">
                    Calculate Percentage
                  </Button>
                </>
              )}

              <Button onClick={resetAll} variant="outline" className="w-full">
                Clear All
              </Button>
            </CardContent>
          </Card>

          {/* Results Card */}
          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeTab === "basic" && basicResult !== null && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-600 mb-1">Result:</p>
                  <p className="text-2xl font-bold text-green-700">
                    {basicResult.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    {basicPercent}% of {basicNumber} = {basicResult.toLocaleString()}
                  </p>
                </div>
              )}

              {activeTab === "increase" && increaseResult !== null && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-600 mb-1">Result:</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {increaseResult.toLocaleString()}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    {increaseOriginal} + {increasePercent}% = {increaseResult.toLocaleString()}
                  </p>
                  <p className="text-xs text-blue-500 mt-1">
                    Increase amount: {((parseFloat(increaseOriginal) * parseFloat(increasePercent)) / 100).toLocaleString()}
                  </p>
                </div>
              )}

              {activeTab === "decrease" && decreaseResult !== null && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-600 mb-1">Result:</p>
                  <p className="text-2xl font-bold text-orange-700">
                    {decreaseResult.toLocaleString()}
                  </p>
                  <p className="text-sm text-orange-600 mt-1">
                    {decreaseOriginal} - {decreasePercent}% = {decreaseResult.toLocaleString()}
                  </p>
                  <p className="text-xs text-orange-500 mt-1">
                    Decrease amount: {((parseFloat(decreaseOriginal) * parseFloat(decreasePercent)) / 100).toLocaleString()}
                  </p>
                </div>
              )}

              {activeTab === "what-percent" && whatPercentResult !== null && (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-sm text-purple-600 mb-1">Result:</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {whatPercentResult.toFixed(2)}%
                  </p>
                  <p className="text-sm text-purple-600 mt-1">
                    {whatPercentX} is {whatPercentResult.toFixed(2)}% of {whatPercentY}
                  </p>
                </div>
              )}

              {/* Examples */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Examples:</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  {activeTab === "basic" && (
                    <>
                      <p>• 25% of 200 = 50</p>
                      <p>• 10% of 500 = 50</p>
                      <p>• 75% of 80 = 60</p>
                    </>
                  )}
                  {activeTab === "increase" && (
                    <>
                      <p>• 100 + 20% = 120</p>
                      <p>• 50 + 10% = 55</p>
                      <p>• 200 + 25% = 250</p>
                    </>
                  )}
                  {activeTab === "decrease" && (
                    <>
                      <p>• 100 - 20% = 80</p>
                      <p>• 50 - 10% = 45</p>
                      <p>• 200 - 25% = 150</p>
                    </>
                  )}
                  {activeTab === "what-percent" && (
                    <>
                      <p>• 25 is 50% of 50</p>
                      <p>• 10 is 20% of 50</p>
                      <p>• 75 is 37.5% of 200</p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PercentageCalculator;
