import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calculator, Percent, Sparkles, Zap, TrendingUp, TrendingDown } from "lucide-react";
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
        return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-ping"></div>
      </div>

      <header className="relative z-10 max-w-4xl mx-auto px-4 py-8 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="mr-1 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white"
          onClick={() => navigate("/")}
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl md:text-4xl font-bold flex items-center gap-3 text-white">
          <div className="relative">
            <Percent className="w-10 h-10 text-yellow-400 animate-bounce" />
            <Sparkles className="w-4 h-4 text-white absolute -top-1 -right-1 animate-pulse" />
          </div>
          <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
            Percentage Calculator
          </span>
        </h1>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-4 pb-8">
        {/* Crazy Tab Navigation */}
        <div className="flex flex-wrap gap-3 mb-8 p-2 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
          {[
            { key: "basic", label: "Basic %" },
            { key: "increase", label: "% Increase" },
            { key: "decrease", label: "% Decrease" },
            { key: "what-percent", label: "What %" }
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`
                transition-all duration-300 transform hover:scale-105 flex items-center gap-2
                ${activeTab === tab.key 
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg shadow-yellow-400/50 animate-pulse' 
                  : 'text-white hover:bg-white/20 hover:shadow-lg'
                }
              `}
            >
              {getTabIcon(tab.key as typeof activeTab)}
              {tab.label}
            </Button>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Calculator Card with crazy effects */}
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 transform hover:scale-[1.02]">
            <CardHeader className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-white">
                <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-spin-slow">
                  <Zap className="w-6 h-6 text-black" />
                </div>
                <span className="bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                  {activeTab === "basic" && "Calculate X% of Y"}
                  {activeTab === "increase" && "Percentage Increase"}
                  {activeTab === "decrease" && "Percentage Decrease"}
                  {activeTab === "what-percent" && "What Percentage"}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {activeTab === "basic" && (
                <>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="basic-percent" className="text-white font-semibold flex items-center gap-2">
                        <Percent className="w-4 h-4 text-yellow-400" />
                        Percentage (%)
                      </Label>
                      <Input
                        id="basic-percent"
                        type="number"
                        placeholder="25"
                        value={basicPercent}
                        onChange={(e) => setBasicPercent(e.target.value)}
                        className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="basic-number" className="text-white font-semibold flex items-center gap-2">
                        <Calculator className="w-4 h-4 text-pink-400" />
                        Of Number
                      </Label>
                      <Input
                        id="basic-number"
                        type="number"
                        placeholder="200"
                        value={basicNumber}
                        onChange={(e) => setBasicNumber(e.target.value)}
                        className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={calculateBasic} 
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-purple-500/30 transform hover:scale-105 transition-all duration-300 animate-pulse"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Calculate {basicPercent}% of {basicNumber}
                  </Button>
                </>
              )}

              {activeTab === "increase" && (
                <>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="increase-original" className="text-white font-semibold flex items-center gap-2">
                        <Calculator className="w-4 h-4 text-pink-400" />
                        Original Number
                      </Label>
                      <Input
                        id="increase-original"
                        type="number"
                        placeholder="100"
                        value={increaseOriginal}
                        onChange={(e) => setIncreaseOriginal(e.target.value)}
                        className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="increase-percent" className="text-white font-semibold flex items-center gap-2">
                        <Percent className="w-4 h-4 text-yellow-400" />
                        Increase by (%)
                      </Label>
                      <Input
                        id="increase-percent"
                        type="number"
                        placeholder="20"
                        value={increasePercent}
                        onChange={(e) => setIncreasePercent(e.target.value)}
                        className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
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
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="decrease-original" className="text-white font-semibold flex items-center gap-2">
                        <Calculator className="w-4 h-4 text-pink-400" />
                        Original Number
                      </Label>
                      <Input
                        id="decrease-original"
                        type="number"
                        placeholder="100"
                        value={decreaseOriginal}
                        onChange={(e) => setDecreaseOriginal(e.target.value)}
                        className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="decrease-percent" className="text-white font-semibold flex items-center gap-2">
                        <Percent className="w-4 h-4 text-yellow-400" />
                        Decrease by (%)
                      </Label>
                      <Input
                        id="decrease-percent"
                        type="number"
                        placeholder="15"
                        value={decreasePercent}
                        onChange={(e) => setDecreasePercent(e.target.value)}
                        className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
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
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="what-percent-x" className="text-white font-semibold flex items-center gap-2">
                        <Calculator className="w-4 h-4 text-pink-400" />
                        Number
                      </Label>
                      <Input
                        id="what-percent-x"
                        type="number"
                        placeholder="50"
                        value={whatPercentX}
                        onChange={(e) => setWhatPercentX(e.target.value)}
                        className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="what-percent-y" className="text-white font-semibold flex items-center gap-2">
                        <Calculator className="w-4 h-4 text-pink-400" />
                        Of Number
                      </Label>
                      <Input
                        id="what-percent-y"
                        type="number"
                        placeholder="200"
                        value={whatPercentY}
                        onChange={(e) => setWhatPercentY(e.target.value)}
                        className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  </div>
                  <Button onClick={calculateWhatPercent} className="w-full">
                    Calculate Percentage
                  </Button>
                </>
              )}

              <Button 
                onClick={resetAll} 
                variant="outline" 
                className="w-full border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300 transform hover:scale-105"
              >
                <Zap className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </CardContent>
          </Card>

          {/* Results Card with animations */}
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 transform hover:scale-[1.02]">
            <CardHeader className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-t-lg">
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
                Magic Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {activeTab === "basic" && basicResult !== null && (
                <div className="p-6 bg-gradient-to-r from-green-400/20 to-emerald-400/20 border border-green-400/30 rounded-xl shadow-lg transform animate-scale-in">
                  <p className="text-sm text-green-300 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Result:
                  </p>
                  <p className="text-4xl font-bold text-green-200 animate-pulse">
                    {basicResult.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-300 mt-2">
                    {basicPercent}% of {basicNumber} = {basicResult.toLocaleString()}
                  </p>
                </div>
              )}

              {activeTab === "increase" && increaseResult !== null && (
                <div className="p-6 bg-blue-500/20 border border-blue-400/30 rounded-xl shadow-lg">
                  <p className="text-sm text-blue-300 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Result:
                  </p>
                  <p className="text-4xl font-bold text-blue-200">
                    {increaseResult.toLocaleString()}
                  </p>
                  <p className="text-sm text-blue-300 mt-2">
                    {increaseOriginal} + {increasePercent}% = {increaseResult.toLocaleString()}
                  </p>
                  <p className="text-xs text-blue-500 mt-1">
                    Increase amount: {((parseFloat(increaseOriginal) * parseFloat(increasePercent)) / 100).toLocaleString()}
                  </p>
                </div>
              )}

              {activeTab === "decrease" && decreaseResult !== null && (
                <div className="p-6 bg-orange-500/20 border border-orange-400/30 rounded-xl shadow-lg">
                  <p className="text-sm text-orange-300 mb-2 flex items-center gap-2">
                    <TrendingDown className="w-4 h-4" />
                    Result:
                  </p>
                  <p className="text-4xl font-bold text-orange-200">
                    {decreaseResult.toLocaleString()}
                  </p>
                  <p className="text-sm text-orange-300 mt-2">
                    {decreaseOriginal} - {decreasePercent}% = {decreaseResult.toLocaleString()}
                  </p>
                  <p className="text-xs text-orange-500 mt-1">
                    Decrease amount: {((parseFloat(decreaseOriginal) * parseFloat(decreasePercent)) / 100).toLocaleString()}
                  </p>
                </div>
              )}

              {activeTab === "what-percent" && whatPercentResult !== null && (
                <div className="p-6 bg-purple-500/20 border border-purple-400/30 rounded-xl shadow-lg">
                  <p className="text-sm text-purple-300 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Result:
                  </p>
                  <p className="text-4xl font-bold text-purple-200">
                    {whatPercentResult.toFixed(2)}%
                  </p>
                  <p className="text-sm text-purple-300 mt-2">
                    {whatPercentX} is {whatPercentResult.toFixed(2)}% of {whatPercentY}
                  </p>
                </div>
              )}

              {/* Crazy Examples */}
              <div className="mt-8 p-6 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-400/30 backdrop-blur-sm">
                <h3 className="font-bold mb-4 text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400 animate-spin" />
                  Magic Examples:
                </h3>
                <div className="text-sm text-indigo-200 space-y-2">
                  {activeTab === "basic" && (
                    <>
                      <p className="hover:text-yellow-300 transition-colors cursor-pointer">✨ 25% of 200 = 50</p>
                      <p className="hover:text-yellow-300 transition-colors cursor-pointer">⚡ 10% of 500 = 50</p>
                      <p className="hover:text-yellow-300 transition-colors cursor-pointer">🔥 75% of 80 = 60</p>
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

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes scale-in {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PercentageCalculator;
