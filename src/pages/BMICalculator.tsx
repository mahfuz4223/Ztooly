import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Target, AlertCircle } from "lucide-react";
import { useGeneratorToolAnalytics } from '@/utils/analyticsHelper';
import { UsageStats } from '@/components/UsageStats';

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

  // Initialize analytics
  const analytics = useGeneratorToolAnalytics('bmi-calculator', 'BMI Calculator');

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
    // Track calculation action
    analytics.trackGenerate();
    
    const heightInMeters = convertHeight(parseFloat(height), heightUnit);
    const weightInKg = convertWeight(parseFloat(weight), weightUnit);
    
    if (heightInMeters > 0 && weightInKg > 0) {
      const bmiValue = weightInKg / (heightInMeters * heightInMeters);
      setBmi(Number(bmiValue.toFixed(1)));
      
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
        return 'text-orange-600';
      case 'Obese':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getHealthTips = (category: string) => {
    const tips = {
      'Underweight': [
        'Eat nutrient-dense, calorie-rich foods',
        'Include healthy fats like nuts and avocados',
        'Consider strength training exercises',
        'Eat frequent, smaller meals'
      ],
      'Normal weight': [
        'Maintain your current healthy lifestyle',
        'Continue regular physical activity',
        'Focus on balanced nutrition',
        'Stay hydrated and get adequate sleep'
      ],
      'Overweight': [
        'Create a moderate calorie deficit',
        'Incorporate both cardio and strength training',
        'Focus on whole foods',
        'Consider portion control strategies'
      ],
      'Obese': [
        'Consult with a healthcare professional',
        'Start with low-impact exercises',
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Calculator className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">BMI Calculator</h1>
            <p className="text-muted-foreground">
              Calculate your Body Mass Index and get health insights
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calculator Form */}
            <Card>
              <CardHeader>
                <CardTitle>Calculate BMI</CardTitle>
                <CardDescription>Enter your measurements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Height */}
                <div className="space-y-2">
                  <Label htmlFor="height">Height</Label>
                  <div className="flex gap-2">
                    <Input
                      id="height"
                      type="number"
                      placeholder="Height"
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

                {/* Weight */}
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight</Label>
                  <div className="flex gap-2">
                    <Input
                      id="weight"
                      type="number"
                      placeholder="Weight"
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
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age (optional)</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Age"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender (optional)</Label>
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

                <div className="flex gap-2 pt-2">
                  <Button onClick={calculateBMI} className="flex-1">
                    Calculate BMI
                  </Button>
                  <Button onClick={clearCalculation} variant="outline">
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-6">
              {bmi !== null ? (
                <>
                  {/* BMI Result */}
                  <Card>
                    <CardHeader className="text-center">
                      <CardTitle>Your BMI</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="text-5xl font-bold text-primary mb-2">{bmi}</div>
                      <div className={`text-xl font-semibold ${getCategoryColor(category)} mb-4`}>
                        {category}
                      </div>
                      
                      {idealWeight && (
                        <div className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <Target className="h-4 w-4" />
                            <span className="font-medium">Ideal Weight Range</span>
                          </div>
                          <div className="text-sm">
                            {idealWeight.min} - {idealWeight.max} kg
                            {weightUnit !== 'kg' && (
                              <span className="text-muted-foreground ml-1">
                                ({(idealWeight.min * (weightUnit === 'lbs' ? 2.20462 : 0.157473)).toFixed(1)} - {(idealWeight.max * (weightUnit === 'lbs' ? 2.20462 : 0.157473)).toFixed(1)} {weightUnit})
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Health Tips */}
                  {category && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Health Tips</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {getHealthTips(category).map((tip, index) => (
                            <div key={index} className="flex items-start gap-2 p-2 rounded-md bg-muted/50">
                              <span className="text-primary mt-1">•</span>
                              <span className="text-sm">{tip}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Ready to Calculate</h3>
                    <p className="text-muted-foreground text-sm">
                      Enter your height and weight to see your BMI
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* BMI Categories */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-center">BMI Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 border rounded-lg">
                  <div className="font-medium text-blue-600">Underweight</div>
                  <div className="text-sm text-muted-foreground">Below 18.5</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="font-medium text-green-600">Normal</div>
                  <div className="text-sm text-muted-foreground">18.5 - 24.9</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="font-medium text-orange-600">Overweight</div>
                  <div className="text-sm text-muted-foreground">25 - 29.9</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="font-medium text-red-600">Obese</div>
                  <div className="text-sm text-muted-foreground">30 and above</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <div className="mt-6 p-4 border border-orange-200 bg-orange-50 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <div className="font-medium text-orange-900 mb-1">Important Note</div>
                <div className="text-orange-800">
                  BMI is a screening tool and may not be accurate for athletes, elderly individuals, 
                  or those with certain medical conditions. Consult a healthcare professional for 
                  personalized advice.
                </div>
              </div>            </div>
          </div>

          {/* Usage Statistics */}
          <UsageStats toolId="bmi-calculator" />
        </div>
      </div>
    </div>
  );
};

export default BMICalculator;
