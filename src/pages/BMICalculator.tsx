import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Info, Target, TrendingUp, Heart } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-full shadow-lg">
                <Calculator className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">BMI Calculator</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Calculate your Body Mass Index with multiple units and get personalized health insights
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calculator Card */}
            <div className="lg:col-span-1">
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Calculate Your BMI
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Enter your measurements below
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Height Input */}
                  <div className="space-y-3">
                    <Label htmlFor="height" className="text-sm font-semibold text-gray-700">Height</Label>
                    <div className="flex gap-3">
                      <Input
                        id="height"
                        type="number"
                        placeholder="Enter height"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="flex-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <Select value={heightUnit} onValueChange={setHeightUnit}>
                        <SelectTrigger className="w-24 border-gray-200">
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
                  <div className="space-y-3">
                    <Label htmlFor="weight" className="text-sm font-semibold text-gray-700">Weight</Label>
                    <div className="flex gap-3">
                      <Input
                        id="weight"
                        type="number"
                        placeholder="Enter weight"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="flex-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <Select value={weightUnit} onValueChange={setWeightUnit}>
                        <SelectTrigger className="w-24 border-gray-200">
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
                    <div className="space-y-3">
                      <Label htmlFor="age" className="text-sm font-semibold text-gray-700">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="Years"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="gender" className="text-sm font-semibold text-gray-700">Gender</Label>
                      <Select value={gender} onValueChange={setGender}>
                        <SelectTrigger className="border-gray-200">
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

                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={calculateBMI} 
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3"
                    >
                      <Calculator className="h-4 w-4 mr-2" />
                      Calculate BMI
                    </Button>
                    <Button onClick={clearCalculation} variant="outline" className="px-6 border-gray-300 hover:bg-gray-50">
                      Clear
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-2 space-y-6">
              {bmi !== null ? (
                <>
                  {/* BMI Result Card */}
                  <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="text-center pb-4">
                      <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                        <Heart className="h-6 w-6 text-red-500" />
                        Your BMI Result
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                        <div className="text-6xl font-bold text-blue-600 mb-2">{bmi}</div>
                        <div className={`text-2xl font-semibold ${getCategoryColor(category)} mb-4`}>
                          {category}
                        </div>
                        
                        {idealWeight && (
                          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="font-semibold text-blue-900 mb-2 flex items-center justify-center gap-2">
                              <Target className="h-4 w-4" />
                              Ideal Weight Range
                            </h4>
                            <p className="text-blue-800 text-lg font-medium">
                              {idealWeight.min} - {idealWeight.max} kg
                              {weightUnit !== 'kg' && (
                                <span className="text-sm ml-2 font-normal">
                                  ({(idealWeight.min * (weightUnit === 'lbs' ? 2.20462 : 0.157473)).toFixed(1)} - {(idealWeight.max * (weightUnit === 'lbs' ? 2.20462 : 0.157473)).toFixed(1)} {weightUnit})
                                </span>
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Health Tips Card */}
                  {category && (
                    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                      <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                        <CardTitle className="flex items-center gap-2">
                          <Info className="h-5 w-5" />
                          Personalized Health Tips
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid gap-3">
                          {getHealthTips(category, age, gender).map((tip, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                              <span className="text-green-600 mt-1 text-lg">•</span>
                              <span className="text-green-800 font-medium">{tip}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-12 text-center">
                    <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Ready to Calculate</h3>
                    <p className="text-gray-500">Enter your height and weight to see your BMI results and personalized health tips.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* BMI Categories Reference */}
          <Card className="mt-10 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center text-2xl">BMI Categories Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-6 border-2 border-blue-200 rounded-xl bg-blue-50 text-center">
                  <div className="text-blue-600 font-bold text-lg mb-2">Underweight</div>
                  <div className="text-blue-700 font-medium">BMI less than 18.5</div>
                </div>
                <div className="p-6 border-2 border-green-200 rounded-xl bg-green-50 text-center">
                  <div className="text-green-600 font-bold text-lg mb-2">Normal weight</div>
                  <div className="text-green-700 font-medium">BMI 18.5 - 24.9</div>
                </div>
                <div className="p-6 border-2 border-yellow-200 rounded-xl bg-yellow-50 text-center">
                  <div className="text-yellow-600 font-bold text-lg mb-2">Overweight</div>
                  <div className="text-yellow-700 font-medium">BMI 25 - 29.9</div>
                </div>
                <div className="p-6 border-2 border-red-200 rounded-xl bg-red-50 text-center">
                  <div className="text-red-600 font-bold text-lg mb-2">Obese</div>
                  <div className="text-red-700 font-medium">BMI 30 or greater</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <div className="mt-8 p-6 bg-amber-50 rounded-xl border border-amber-200 shadow-lg">
            <h4 className="font-bold text-amber-900 mb-3 text-lg">⚠️ Important Disclaimer</h4>
            <p className="text-amber-800 leading-relaxed">
              BMI is a screening tool and doesn't directly measure body fat. It may not be accurate for athletes, 
              elderly individuals, pregnant women, or those with certain medical conditions. Always consult with 
              a healthcare professional for personalized health advice and before making significant lifestyle changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BMICalculator;
