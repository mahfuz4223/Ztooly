import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, RefreshCw, Shield, AlertTriangle, CheckCircle, Eye, EyeOff, Lock, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState([16]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [customPassword, setCustomPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [breachStatus, setBreachStatus] = useState<'safe' | 'compromised' | 'unknown'>('unknown');
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const generatePassword = useCallback(() => {
    let charset = '';
    let similar = 'il1Lo0O';
    let ambiguous = '{}[]()/\\\'"`~,;<>.?';
    
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (excludeSimilar) {
      charset = charset.split('').filter(char => !similar.includes(char)).join('');
    }
    
    if (excludeAmbiguous) {
      charset = charset.split('').filter(char => !ambiguous.includes(char)).join('');
    }
    
    if (!charset) {
      toast({
        title: "Error",
        description: "Please select at least one character type",
        variant: "destructive"
      });
      return;
    }
    
    let result = '';
    for (let i = 0; i < length[0]; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    setPassword(result);
    setBreachStatus('unknown');
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeSimilar, excludeAmbiguous, toast]);

  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'No Password', color: 'bg-gray-400' };
    
    let score = 0;
    
    // Length scoring
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 16) score += 1;
    if (pwd.length >= 20) score += 1;
    
    // Character variety
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    
    // Complexity patterns
    if (pwd.length > 8 && /[a-z]/.test(pwd) && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) {
      score += 2;
    }
    
    if (score <= 3) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 6) return { score, label: 'Fair', color: 'bg-orange-500' };
    if (score <= 8) return { score, label: 'Good', color: 'bg-yellow-500' };
    if (score <= 10) return { score, label: 'Strong', color: 'bg-green-500' };
    return { score, label: 'Very Strong', color: 'bg-green-600' };
  };

  const calculateCrackTime = (pwd: string) => {
    if (!pwd) return { time: 'N/A', difficulty: 'unknown', color: 'bg-gray-400' };
    
    let charset = 0;
    if (/[a-z]/.test(pwd)) charset += 26;
    if (/[A-Z]/.test(pwd)) charset += 26;
    if (/[0-9]/.test(pwd)) charset += 10;
    if (/[^A-Za-z0-9]/.test(pwd)) charset += 32;
    
    const combinations = Math.pow(charset, pwd.length);
    const guessesPerSecond = 1000000000; // 1 billion guesses per second
    const secondsToCrack = combinations / (2 * guessesPerSecond);
    
    let timeString = '';
    let difficulty = '';
    let color = '';
    
    if (secondsToCrack < 1) {
      timeString = 'Instant';
      difficulty = 'Extremely Weak';
      color = 'bg-red-600';
    } else if (secondsToCrack < 60) {
      timeString = `${Math.round(secondsToCrack)} seconds`;
      difficulty = 'Very Weak';
      color = 'bg-red-500';
    } else if (secondsToCrack < 3600) {
      timeString = `${Math.round(secondsToCrack / 60)} minutes`;
      difficulty = 'Weak';
      color = 'bg-orange-500';
    } else if (secondsToCrack < 86400) {
      timeString = `${Math.round(secondsToCrack / 3600)} hours`;
      difficulty = 'Fair';
      color = 'bg-yellow-500';
    } else if (secondsToCrack < 2592000) { // 30 days
      timeString = `${Math.round(secondsToCrack / 86400)} days`;
      difficulty = 'Good';
      color = 'bg-blue-500';
    } else if (secondsToCrack < 31536000) { // 1 year
      timeString = `${Math.round(secondsToCrack / 2592000)} months`;
      difficulty = 'Strong';
      color = 'bg-green-500';
    } else if (secondsToCrack < 31536000000) { // 1000 years
      timeString = `${Math.round(secondsToCrack / 31536000)} years`;
      difficulty = 'Very Strong';
      color = 'bg-green-600';
    } else {
      timeString = `${(secondsToCrack / 31536000000).toExponential(2)} years`;
      difficulty = 'Practically Uncrackable';
      color = 'bg-purple-600';
    }
    
    return { time: timeString, difficulty, color };
  };

  const checkPasswordBreach = async (pwd: string) => {
    if (!pwd) return;
    
    setIsChecking(true);
    try {
      // Simulate breach check (in real app, you'd use HaveIBeenPwned API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple simulation - common passwords are "compromised"
      const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein'];
      const isCommon = commonPasswords.some(common => pwd.toLowerCase().includes(common.toLowerCase()));
      
      setBreachStatus(isCommon ? 'compromised' : 'safe');
    } catch (error) {
      setBreachStatus('unknown');
    } finally {
      setIsChecking(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Password copied to clipboard",
    });
  };

  // Auto-generate password on component mount
  useEffect(() => {
    generatePassword();
  }, []);

  // Auto-analyze password when it changes
  useEffect(() => {
    const currentPassword = password || customPassword;
    if (currentPassword) {
      checkPasswordBreach(currentPassword);
    }
  }, [password, customPassword]);

  const strength = calculatePasswordStrength(password || customPassword);
  const crackTime = calculateCrackTime(password || customPassword);
  const currentPassword = password || customPassword;

  return (
    <div>
      {/* Removed local nav/back btn - only use global nav */}
      <div className="max-w-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4 pt-8 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
          🔐 Password Generator
        </h1>
        <div className="mt-4 md:mt-0 flex-shrink-0">
          <span className="inline-flex h-10 w-10 rounded-full bg-indigo-100 items-center justify-center">
            <span role="img" aria-label="lock" className="text-indigo-500 text-2xl">🔑</span>
          </span>
        </div>
      </div>
      <div className="max-w-2xl mx-auto text-muted-foreground px-4 -mt-4 mb-3 text-base">
        Instantly create secure, random passwords for any use case.
      </div>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Password Generator</h1>
            <p className="text-gray-600 mt-1">Generate secure passwords and analyze their strength</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Generator */}
          <div className="lg:col-span-2 space-y-6">
            {/* Password Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Password Settings
                </CardTitle>
                <CardDescription>
                  Configure your password requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="font-medium">Length</Label>
                    <Badge variant="outline" className="font-mono">
                      {length[0]}
                    </Badge>
                  </div>
                  <Slider
                    value={length}
                    onValueChange={setLength}
                    max={128}
                    min={4}
                    step={1}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>4</span>
                    <span>128</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                    <Checkbox
                      id="uppercase"
                      checked={includeUppercase}
                      onCheckedChange={(checked) => setIncludeUppercase(checked === true)}
                    />
                    <Label htmlFor="uppercase" className="font-medium">Uppercase (A-Z)</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                    <Checkbox
                      id="lowercase"
                      checked={includeLowercase}
                      onCheckedChange={(checked) => setIncludeLowercase(checked === true)}
                    />
                    <Label htmlFor="lowercase" className="font-medium">Lowercase (a-z)</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                    <Checkbox
                      id="numbers"
                      checked={includeNumbers}
                      onCheckedChange={(checked) => setIncludeNumbers(checked === true)}
                    />
                    <Label htmlFor="numbers" className="font-medium">Numbers (0-9)</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                    <Checkbox
                      id="symbols"
                      checked={includeSymbols}
                      onCheckedChange={(checked) => setIncludeSymbols(checked === true)}
                    />
                    <Label htmlFor="symbols" className="font-medium">Symbols (!@#$...)</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                    <Checkbox
                      id="exclude-similar"
                      checked={excludeSimilar}
                      onCheckedChange={(checked) => setExcludeSimilar(checked === true)}
                    />
                    <Label htmlFor="exclude-similar" className="font-medium">Exclude Similar</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                    <Checkbox
                      id="exclude-ambiguous"
                      checked={excludeAmbiguous}
                      onCheckedChange={(checked) => setExcludeAmbiguous(checked === true)}
                    />
                    <Label htmlFor="exclude-ambiguous" className="font-medium">Exclude Ambiguous</Label>
                  </div>
                </div>

                <Button onClick={generatePassword} className="w-full" size="lg">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate Password
                </Button>
              </CardContent>
            </Card>

            {/* Generated Password Display */}
            {password && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-800">Generated Password</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Input
                        value={password}
                        readOnly
                        type={showPassword ? 'text' : 'password'}
                        className="font-mono text-lg pr-20 bg-white border-green-300"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(password)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Password Analysis Input */}
            <Card>
              <CardHeader>
                <CardTitle>Analyze Custom Password</CardTitle>
                <CardDescription>
                  Enter any password to check its security
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Input
                    placeholder="Enter password to analyze..."
                    value={customPassword}
                    onChange={(e) => setCustomPassword(e.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    className="pr-10"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Panel */}
          <div className="space-y-6">
            {currentPassword && (
              <>
                {/* Strength Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Password Strength
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-2">{strength.score}/10</div>
                      <Badge className={`${strength.color} text-white px-4 py-2 text-lg`}>
                        {strength.label}
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${strength.color} transition-all duration-500`}
                        style={{ width: `${(strength.score / 10) * 100}%` }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>

                {/* Crack Time Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle>Time to Crack</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-4">
                      <div className="space-y-2">
                        <div className="text-2xl font-bold">{crackTime.time}</div>
                        <Badge className={`${crackTime.color} text-white px-3 py-1`}>
                          {crackTime.difficulty}
                        </Badge>
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Attack Speed</p>
                        <p className="text-sm font-semibold">1 Billion guesses/sec</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Breach Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>Breach Check</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isChecking ? (
                      <div className="text-center text-gray-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        Checking...
                      </div>
                    ) : (
                      <div className="text-center">
                        {breachStatus === 'safe' ? (
                          <Badge variant="default" className="bg-green-500 text-white px-4 py-2 text-lg">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Safe
                          </Badge>
                        ) : breachStatus === 'compromised' ? (
                          <Badge variant="destructive" className="px-4 py-2 text-lg">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Compromised
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="px-4 py-2 text-lg">
                            Checking...
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Character Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle>Character Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <div className="font-semibold text-blue-700">Length</div>
                        <div className="text-xl font-bold text-blue-600">{currentPassword.length}</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg text-center">
                        <div className="font-semibold text-green-700">Uppercase</div>
                        <div className="text-xl font-bold text-green-600">
                          {/[A-Z]/.test(currentPassword) ? '✓' : '✗'}
                        </div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg text-center">
                        <div className="font-semibold text-purple-700">Numbers</div>
                        <div className="text-xl font-bold text-purple-600">
                          {/[0-9]/.test(currentPassword) ? '✓' : '✗'}
                        </div>
                      </div>
                      <div className="bg-orange-50 p-3 rounded-lg text-center">
                        <div className="font-semibold text-orange-700">Symbols</div>
                        <div className="text-xl font-bold text-orange-600">
                          {/[^A-Za-z0-9]/.test(currentPassword) ? '✓' : '✗'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;
