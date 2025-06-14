
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, RefreshCw, Shield, AlertTriangle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
    let feedback = [];
    
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
    if (!pwd) return 'N/A';
    
    let charset = 0;
    if (/[a-z]/.test(pwd)) charset += 26;
    if (/[A-Z]/.test(pwd)) charset += 26;
    if (/[0-9]/.test(pwd)) charset += 10;
    if (/[^A-Za-z0-9]/.test(pwd)) charset += 32;
    
    const combinations = Math.pow(charset, pwd.length);
    const guessesPerSecond = 1000000000; // 1 billion guesses per second
    const secondsToCrack = combinations / (2 * guessesPerSecond);
    
    if (secondsToCrack < 60) return `${Math.round(secondsToCrack)} seconds`;
    if (secondsToCrack < 3600) return `${Math.round(secondsToCrack / 60)} minutes`;
    if (secondsToCrack < 86400) return `${Math.round(secondsToCrack / 3600)} hours`;
    if (secondsToCrack < 31536000) return `${Math.round(secondsToCrack / 86400)} days`;
    if (secondsToCrack < 31536000000) return `${Math.round(secondsToCrack / 31536000)} years`;
    return `${(secondsToCrack / 31536000000).toExponential(2)} years`;
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

  const strength = calculatePasswordStrength(password || customPassword);
  const crackTime = calculateCrackTime(password || customPassword);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Secure Password Generator</h1>
          <p className="text-gray-600">Generate strong, secure passwords and analyze their strength</p>
        </div>

        <Tabs defaultValue="generate" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Generate Password</TabsTrigger>
            <TabsTrigger value="analyze">Analyze Password</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Password Generator
                </CardTitle>
                <CardDescription>
                  Customize your password requirements below
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Password Length: {length[0]}</Label>
                    <Slider
                      value={length}
                      onValueChange={setLength}
                      max={128}
                      min={4}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="uppercase"
                        checked={includeUppercase}
                        onCheckedChange={setIncludeUppercase}
                      />
                      <Label htmlFor="uppercase">Uppercase (A-Z)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="lowercase"
                        checked={includeLowercase}
                        onCheckedChange={setIncludeLowercase}
                      />
                      <Label htmlFor="lowercase">Lowercase (a-z)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="numbers"
                        checked={includeNumbers}
                        onCheckedChange={setIncludeNumbers}
                      />
                      <Label htmlFor="numbers">Numbers (0-9)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="symbols"
                        checked={includeSymbols}
                        onCheckedChange={setIncludeSymbols}
                      />
                      <Label htmlFor="symbols">Symbols (!@#$...)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="exclude-similar"
                        checked={excludeSimilar}
                        onCheckedChange={setExcludeSimilar}
                      />
                      <Label htmlFor="exclude-similar">Exclude Similar (il1Lo0O)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="exclude-ambiguous"
                        checked={excludeAmbiguous}
                        onCheckedChange={setExcludeAmbiguous}
                      />
                      <Label htmlFor="exclude-ambiguous">Exclude Ambiguous</Label>
                    </div>
                  </div>
                </div>

                <Button onClick={generatePassword} className="w-full" size="lg">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate Password
                </Button>
              </CardContent>
            </Card>

            {password && (
              <Card>
                <CardHeader>
                  <CardTitle>Generated Password</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Input
                        value={password}
                        readOnly
                        type={showPassword ? 'text' : 'password'}
                        className="font-mono text-lg pr-20"
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
                  
                  <div className="flex gap-4">
                    <Button 
                      onClick={() => checkPasswordBreach(password)}
                      disabled={isChecking}
                      variant="outline"
                    >
                      {isChecking ? 'Checking...' : 'Check Breach Status'}
                    </Button>
                    
                    {breachStatus !== 'unknown' && (
                      <Badge variant={breachStatus === 'safe' ? 'default' : 'destructive'} className="flex items-center gap-1">
                        {breachStatus === 'safe' ? (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            Not Found in Breaches
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-3 w-3" />
                            Found in Data Breaches
                          </>
                        )}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analyze" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Password Analysis</CardTitle>
                <CardDescription>
                  Enter a password to analyze its strength and security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                
                <Button 
                  onClick={() => checkPasswordBreach(customPassword)}
                  disabled={!customPassword || isChecking}
                  className="w-full"
                >
                  {isChecking ? 'Checking...' : 'Analyze Password'}
                </Button>

                {breachStatus !== 'unknown' && (
                  <Badge variant={breachStatus === 'safe' ? 'default' : 'destructive'} className="flex items-center gap-1 w-fit">
                    {breachStatus === 'safe' ? (
                      <>
                        <CheckCircle className="h-3 w-3" />
                        Not Found in Breaches
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-3 w-3" />
                        Found in Data Breaches
                      </>
                    )}
                  </Badge>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {(password || customPassword) && (
          <Card>
            <CardHeader>
              <CardTitle>Security Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Password Strength</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{strength.label}</span>
                      <span className="text-sm">{strength.score}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${strength.color} transition-all duration-300`}
                        style={{ width: `${(strength.score / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Time to Crack</Label>
                  <div className="text-lg font-semibold text-blue-600">
                    {crackTime}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    At 1 billion guesses per second
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4 text-sm">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="font-semibold text-blue-700">Length</div>
                  <div className="text-blue-600">{(password || customPassword).length} characters</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="font-semibold text-green-700">Uppercase</div>
                  <div className="text-green-600">
                    {/[A-Z]/.test(password || customPassword) ? 'Yes' : 'No'}
                  </div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="font-semibold text-purple-700">Numbers</div>
                  <div className="text-purple-600">
                    {/[0-9]/.test(password || customPassword) ? 'Yes' : 'No'}
                  </div>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <div className="font-semibold text-orange-700">Symbols</div>
                  <div className="text-orange-600">
                    {/[^A-Za-z0-9]/.test(password || customPassword) ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PasswordGenerator;
