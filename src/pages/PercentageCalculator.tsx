import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function PercentageCalculator() {
  const [value, setValue] = useState<number | null>(null);
  const [percentage, setPercentage] = useState<number | null>(null);
  const [result, setResult] = useState<number | null>(null);

  const calculatePercentage = () => {
    if (value !== null && percentage !== null) {
      setResult((percentage / 100) * value);
    }
  };

  const calculateValue = () => {
    if (result !== null && percentage !== null) {
      setValue((result / percentage) * 100);
    }
  };

  const calculatePercentageChange = () => {
    if (value !== null && result !== null) {
      setPercentage(((result - value) / value) * 100);
    }
  };

  return (
    <div>
      {/* Removed local nav/back btn */}
      <div className="max-w-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4 pt-8 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
          📊 Percentage Calculator
        </h1>
        <div className="mt-4 md:mt-0 flex-shrink-0">
          <span className="inline-flex h-10 w-10 rounded-full bg-pink-100 items-center justify-center">
            <span role="img" aria-label="percent" className="text-pink-500 text-2xl">%</span>
          </span>
        </div>
      </div>
      <div className="max-w-2xl mx-auto text-muted-foreground px-4 -mt-4 mb-3 text-base">
        Quick percentage calculations for any need.
      </div>
      {/* Main contents... */}
      <div className="min-h-screen bg-background py-6 px-4 flex justify-center items-start">
        <Card className="w-full max-w-2xl mx-auto shadow-lg">
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="value">Value</Label>
              <Input
                type="number"
                id="value"
                placeholder="Enter value"
                value={value !== null ? value.toString() : ""}
                onChange={(e) => setValue(e.target.value ? parseFloat(e.target.value) : null)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="percentage">Percentage</Label>
              <Input
                type="number"
                id="percentage"
                placeholder="Enter percentage"
                value={percentage !== null ? percentage.toString() : ""}
                onChange={(e) => setPercentage(e.target.value ? parseFloat(e.target.value) : null)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="result">Result</Label>
              <Input
                type="number"
                id="result"
                placeholder="Result will appear here"
                value={result !== null ? result.toString() : ""}
                readOnly
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={calculatePercentage}
              >
                Calculate Percentage
              </button>
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={calculateValue}
              >
                Calculate Value
              </button>
              <button
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                onClick={calculatePercentageChange}
              >
                Calculate % Change
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
