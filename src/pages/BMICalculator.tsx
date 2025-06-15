
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Info, Target, TrendingUp } from "lucide-react";

const BMICalculator = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [heightUnit, setHeightUnit] = useState('cm');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string>('');
  const [idealWeight, setIdealWeight] = useState<{min: number, max: number} | null>(null);

  const convertHeight = (value: number, unit: string): number => {
    switch (unit) {
      case 'cm': return value / 100;
      case 'm': return value;
      case 'ft': return value * 0.3048;
      case 'in': return value * 0.0254;
      default: return value;
    }
  };

  const convertWeight = (value: number, unit: string): number => {
    switch (unit) {
      case 'kg': return value;
      case 'lbs': return value * 0.453592;
      case 'st': return value * 6.35029;
      default: return value;
    }
  };

  const calculateBMI = () => {
    const heightInMeters = convertHeight(parseFloat(height), heightUnit);
    const weightInKg = convertWeight(parseFloat(weight), weightUnit);
    
    if (heightInMeters > 0 && weightInKg > 0) {
      const bmiValue = weightInKg / (heightInMeters * heightInMeters);
      setBmi(Number(bmiValue.toFixed(1)));
      
      // Calculate ideal weight range (BMI 18.5-24.9)
      const idealMin = 18.5 * (heightInMeters * heightInMeters);
      const idealMax = 24.9 * (heightInMeters * heightInMeters);
      setIdealWeight({
        min: Number(idealMin.toFixed(1)),
        max: Number(idealMax.toFixed(1))
      });
      
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

  const getHealthTips = (category: string, age: string, gender: string) => {
    const tips = {
      'Underweight': [
        'Eat nutrient-dense, calorie-rich foods',
        'Include healthy fats like nuts, avocados, and olive oil',
        'Consider strength training to build muscle mass',
        'Eat frequent, smaller meals throughout the day'
      ],
      'Normal weight': [
        'Maintain your current healthy lifestyle',
        'Continue regular physical activity',
        'Focus on balanced nutrition',
        'Stay hydrated and get adequate sleep'
      ],
      'Overweight': [
        'Create a moderate calorie deficit through diet and exercise',
        'Incorporate both cardio and strength training',
        'Focus on whole foods and reduce processed foods',
        'Consider portion control strategies'
      ],
      'Obese': [
        'Consult with a healthcare professional for a personalized plan',
        'Start with low-impact exercises like walking or swimming',
        'Focus on sustainable lifestyle changes',
        'Consider working with a registered dietitian'
      ]
    };
    return tips[category] || [];
  };

  const clearCalculation = () => {
    setHeight('');
    setWeight('');
    setAge('');
    setGender('');
    setBmi(null);
    setCategory('');
    setIdealWeight(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Calculator className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced BMI Calculator</h1>
          <p className="text-gray-600">
            Calculate your Body Mass Index with multiple units and get personalized health insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Card */}
          <Card>
            <CardHeader>
              <CardTitle>Calculate Your BMI</CardTitle>
              <CardDescription>
                Enter your measurements to calculate your Body Mass Index
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Height Input */}
              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <div className="flex gap-2">
                  <Input
                    id="height"
                    type="number"
                    placeholder="Enter height"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={heightUnit} onValueChange={setHeightUnit}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cm">cm</SelectItem>
                      <SelectItem value="m">m</SelectItem>
                      <SelectItem value="ft">ft</SelectItem>
                      <SelectItem value="in">in</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Weight Input */}
              <div className="space-y-2">
                <Label htmlFor="weight">Weight</Label>
                <div className="flex gap-2">
                  <Input
                    id="weight"
                    type="number"
                    placeholder="Enter weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={weightUnit} onValueChange={setWeightUnit}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="lbs">lbs</SelectItem>
                      <SelectItem value="st">st</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Age and Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age (optional)</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Years"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender (optional)</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={calculateBMI} className="flex-1">
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate BMI
                </Button>
                <Button onClick={clearCalculation} variant="outline">
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Card */}
          {bmi !== null && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Your Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Your BMI</h3>
                  <div className="text-4xl font-bold text-primary mb-2">{bmi}</div>
                  <div className={`text-lg font-medium ${getCategoryColor(category)}`}>
                    {category}
                  </div>
                </div>

                {idealWeight && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Ideal Weight Range
                    </h4>
                    <p className="text-blue-800">
                      {idealWeight.min} - {idealWeight.max} kg
                      {weightUnit !== 'kg' && (
                        <span className="text-sm ml-2">
                          ({(idealWeight.min * (weightUnit === 'lbs' ? 2.20462 : 0.157473)).toFixed(1)} - {(idealWeight.max * (weightUnit === 'lbs' ? 2.20462 : 0.157473)).toFixed(1)} {weightUnit})
                        </span>
                      )}
                    </p>
                  </div>
                )}

                {category && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Health Tips
                    </h4>
                    <ul className="text-green-800 text-sm space-y-2">
                      {getHealthTips(category, age, gender).map((tip, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* BMI Categories Reference */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>BMI Categories Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="text-blue-600 font-semibold">Underweight</div>
                <div className="text-sm text-gray-600">BMI less than 18.5</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-green-600 font-semibold">Normal weight</div>
                <div className="text-sm text-gray-600">BMI 18.5 - 24.9</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-yellow-600 font-semibold">Overweight</div>
                <div className="text-sm text-gray-600">BMI 25 - 29.9</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-red-600 font-semibold">Obese</div>
                <div className="text-sm text-gray-600">BMI 30 or greater</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
          <h4 className="font-semibold text-yellow-900 mb-2">Important Disclaimer</h4>
          <p className="text-yellow-800 text-sm">
            BMI is a screening tool and doesn't directly measure body fat. It may not be accurate for athletes, 
            elderly individuals, pregnant women, or those with certain medical conditions. Always consult with 
            a healthcare professional for personalized health advice and before making significant lifestyle changes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BMICalculator;
