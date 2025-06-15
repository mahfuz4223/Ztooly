
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

const BMICalculator = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string>('');

  const calculateBMI = () => {
    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    
    if (heightInMeters > 0 && weightInKg > 0) {
      const bmiValue = weightInKg / (heightInMeters * heightInMeters);
      setBmi(Number(bmiValue.toFixed(1)));
      
      if (bmiValue < 18.5) {
        setCategory('Underweight');
      } else if (bmiValue >= 18.5 && bmiValue < 25) {
        setCategory('Normal weight');
      } else if (bmiValue >= 25 && bmiValue < 30) {
        setCategory('Overweight');
      } else {
        setCategory('Obese');
      }
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Underweight':
        return 'text-blue-600';
      case 'Normal weight':
        return 'text-green-600';
      case 'Overweight':
        return 'text-yellow-600';
      case 'Obese':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const clearCalculation = () => {
    setHeight('');
    setWeight('');
    setBmi(null);
    setCategory('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Calculator className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">BMI Calculator</h1>
          <p className="text-gray-600">
            Calculate your Body Mass Index (BMI) to assess your body weight category
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Calculate Your BMI</CardTitle>
            <CardDescription>
              Enter your height and weight to calculate your Body Mass Index
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="e.g., 175"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="e.g., 70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={calculateBMI} className="flex-1">
                Calculate BMI
              </Button>
              <Button onClick={clearCalculation} variant="outline">
                Clear
              </Button>
            </div>

            {bmi !== null && (
              <div className="mt-6 p-6 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Your BMI Result</h3>
                  <div className="text-3xl font-bold text-primary mb-2">{bmi}</div>
                  <div className={`text-lg font-medium ${getCategoryColor(category)}`}>
                    {category}
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">BMI Categories:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Underweight:</span>
                      <span className="text-blue-600">BMI less than 18.5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Normal weight:</span>
                      <span className="text-green-600">BMI 18.5 - 24.9</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Overweight:</span>
                      <span className="text-yellow-600">BMI 25 - 29.9</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Obese:</span>
                      <span className="text-red-600">BMI 30 or greater</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">About BMI</h4>
              <p className="text-blue-800 text-sm">
                BMI is a measure of body fat based on height and weight. While it's a useful screening tool, 
                it doesn't directly measure body fat and may not be accurate for athletes, elderly, or pregnant women. 
                Consult with a healthcare professional for personalized health advice.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BMICalculator;
