
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Copy, RefreshCw, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';
import { UsageStats } from '@/components/UsageStats';

const FakeIBANGenerator = () => {
  const { toast } = useToast();
  const analytics = useAnalytics('fake-iban-generator');
  const [generatedIBAN, setGeneratedIBAN] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('DE');
  const [isGenerating, setIsGenerating] = useState(false);

  // IBAN country codes and lengths
  const ibanFormats = {
    'AD': { length: 24, name: 'Andorra' },
    'AE': { length: 23, name: 'United Arab Emirates' },
    'AL': { length: 28, name: 'Albania' },
    'AT': { length: 20, name: 'Austria' },
    'AZ': { length: 28, name: 'Azerbaijan' },
    'BA': { length: 20, name: 'Bosnia and Herzegovina' },
    'BE': { length: 16, name: 'Belgium' },
    'BG': { length: 22, name: 'Bulgaria' },
    'BH': { length: 22, name: 'Bahrain' },
    'BR': { length: 29, name: 'Brazil' },
    'BY': { length: 28, name: 'Belarus' },
    'CH': { length: 21, name: 'Switzerland' },
    'CR': { length: 22, name: 'Costa Rica' },
    'CY': { length: 28, name: 'Cyprus' },
    'CZ': { length: 24, name: 'Czech Republic' },
    'DE': { length: 22, name: 'Germany' },
    'DK': { length: 18, name: 'Denmark' },
    'DO': { length: 28, name: 'Dominican Republic' },
    'EE': { length: 20, name: 'Estonia' },
    'EG': { length: 29, name: 'Egypt' },
    'ES': { length: 24, name: 'Spain' },
    'FI': { length: 18, name: 'Finland' },
    'FO': { length: 18, name: 'Faroe Islands' },
    'FR': { length: 27, name: 'France' },
    'GB': { length: 22, name: 'United Kingdom' },
    'GE': { length: 22, name: 'Georgia' },
    'GI': { length: 23, name: 'Gibraltar' },
    'GL': { length: 18, name: 'Greenland' },
    'GR': { length: 27, name: 'Greece' },
    'GT': { length: 28, name: 'Guatemala' },
    'HR': { length: 21, name: 'Croatia' },
    'HU': { length: 28, name: 'Hungary' },
    'IE': { length: 22, name: 'Ireland' },
    'IL': { length: 23, name: 'Israel' },
    'IS': { length: 26, name: 'Iceland' },
    'IT': { length: 27, name: 'Italy' },
    'JO': { length: 30, name: 'Jordan' },
    'KW': { length: 30, name: 'Kuwait' },
    'KZ': { length: 20, name: 'Kazakhstan' },
    'LB': { length: 28, name: 'Lebanon' },
    'LC': { length: 32, name: 'Saint Lucia' },
    'LI': { length: 21, name: 'Liechtenstein' },
    'LT': { length: 20, name: 'Lithuania' },
    'LU': { length: 20, name: 'Luxembourg' },
    'LV': { length: 21, name: 'Latvia' },
    'MC': { length: 27, name: 'Monaco' },
    'MD': { length: 24, name: 'Moldova' },
    'ME': { length: 22, name: 'Montenegro' },
    'MK': { length: 19, name: 'North Macedonia' },
    'MR': { length: 27, name: 'Mauritania' },
    'MT': { length: 31, name: 'Malta' },
    'MU': { length: 30, name: 'Mauritius' },
    'NL': { length: 18, name: 'Netherlands' },
    'NO': { length: 15, name: 'Norway' },
    'PK': { length: 24, name: 'Pakistan' },
    'PL': { length: 28, name: 'Poland' },
    'PS': { length: 29, name: 'Palestine' },
    'PT': { length: 25, name: 'Portugal' },
    'QA': { length: 29, name: 'Qatar' },
    'RO': { length: 24, name: 'Romania' },
    'RS': { length: 22, name: 'Serbia' },
    'SA': { length: 24, name: 'Saudi Arabia' },
    'SE': { length: 24, name: 'Sweden' },
    'SI': { length: 19, name: 'Slovenia' },
    'SK': { length: 24, name: 'Slovakia' },
    'SM': { length: 27, name: 'San Marino' },
    'TN': { length: 24, name: 'Tunisia' },
    'TR': { length: 26, name: 'Turkey' },
    'UA': { length: 29, name: 'Ukraine' },
    'VG': { length: 24, name: 'British Virgin Islands' },
    'XK': { length: 20, name: 'Kosovo' }
  };

  const generateRandomNumber = (length: number): string => {
    return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
  };

  const calculateCheckDigits = (countryCode: string, accountIdentifier: string): string => {
    // Move country code and check digits to the end
    const rearranged = accountIdentifier + countryCode + '00';
    
    // Replace letters with numbers (A=10, B=11, ..., Z=35)
    const numeric = rearranged.replace(/[A-Z]/g, (char) => 
      (char.charCodeAt(0) - 55).toString()
    );
    
    // Calculate mod 97
    let remainder = 0;
    for (let i = 0; i < numeric.length; i++) {
      remainder = (remainder * 10 + parseInt(numeric[i])) % 97;
    }
    
    const checkDigits = 98 - remainder;
    return checkDigits.toString().padStart(2, '0');
  };
  const generateFakeIBAN = async () => {
    setIsGenerating(true);
    analytics.trackGenerate();
    
    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const format = ibanFormats[selectedCountry as keyof typeof ibanFormats];
    const accountLength = format.length - 4; // Subtract country code (2) + check digits (2)
    
    // Generate random account identifier
    const accountIdentifier = generateRandomNumber(accountLength);
    
    // Calculate check digits
    const checkDigits = calculateCheckDigits(selectedCountry, accountIdentifier);
    
    // Construct IBAN
    const iban = selectedCountry + checkDigits + accountIdentifier;
    
    // Format with spaces for readability
    const formattedIBAN = iban.replace(/(.{4})/g, '$1 ').trim();
    
    setGeneratedIBAN(formattedIBAN);
    setIsGenerating(false);
  };
  const copyToClipboard = (text: string) => {
    analytics.trackCopy();
    navigator.clipboard.writeText(text.replace(/\s/g, '')).then(() => {
      toast({
        title: "Copied!",
        description: "IBAN copied to clipboard",
      });
    });
  };

  const generateMultiple = async () => {
    const results = [];
    for (let i = 0; i < 5; i++) {
      const format = ibanFormats[selectedCountry as keyof typeof ibanFormats];
      const accountLength = format.length - 4;
      const accountIdentifier = generateRandomNumber(accountLength);
      const checkDigits = calculateCheckDigits(selectedCountry, accountIdentifier);
      const iban = selectedCountry + checkDigits + accountIdentifier;
      const formattedIBAN = iban.replace(/(.{4})/g, '$1 ').trim();
      results.push(formattedIBAN);
    }
    return results;
  };

  const [multipleIBANs, setMultipleIBANs] = useState<string[]>([]);

  const handleGenerateMultiple = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const results = await generateMultiple();
    setMultipleIBANs(results);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
            <AlertTriangle className="h-4 w-4" />
            For Testing Purposes Only
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Fake IBAN Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Generate valid-format IBAN numbers for testing and development purposes. 
            These are not real bank accounts and should never be used for actual transactions.
          </p>
        </div>

        {/* Main Generator */}
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl text-gray-800">Generate IBAN</CardTitle>
            <CardDescription className="text-gray-600">
              Select a country and generate a fake IBAN for testing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Country Selection */}
            <div className="space-y-2">
              <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                Select Country
              </Label>
              <select
                id="country"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {Object.entries(ibanFormats).map(([code, info]) => (
                  <option key={code} value={code}>
                    {code} - {info.name} ({info.length} digits)
                  </option>
                ))}
              </select>
            </div>

            {/* Generate Button */}
            <Button
              onClick={generateFakeIBAN}
              disabled={isGenerating}
              className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Generate IBAN
                </>
              )}
            </Button>

            {/* Generated IBAN Display */}
            {generatedIBAN && (
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Generated IBAN</Label>
                <div className="relative">
                  <Input
                    value={generatedIBAN}
                    readOnly
                    className="pr-12 font-mono text-lg h-12 bg-gray-50 border-gray-200"
                  />
                  <Button
                    onClick={() => copyToClipboard(generatedIBAN)}
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-10 w-10"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Badge variant="secondary">
                    {ibanFormats[selectedCountry as keyof typeof ibanFormats].name}
                  </Badge>
                  <span>•</span>
                  <span>{ibanFormats[selectedCountry as keyof typeof ibanFormats].length} characters</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Multiple Generation */}
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-gray-800">Generate Multiple IBANs</CardTitle>
            <CardDescription>
              Generate 5 IBANs at once for batch testing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleGenerateMultiple}
              disabled={isGenerating}
              variant="outline"
              className="w-full h-11"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating Multiple...
                </>
              ) : (
                'Generate 5 IBANs'
              )}
            </Button>

            {multipleIBANs.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Generated IBANs</Label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {multipleIBANs.map((iban, index) => (
                    <div key={index} className="relative">
                      <Input
                        value={iban}
                        readOnly
                        className="pr-12 font-mono bg-gray-50 border-gray-200"
                      />
                      <Button
                        onClick={() => copyToClipboard(iban)}
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-8 w-8"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="shadow-lg border-0 bg-amber-50/70 backdrop-blur-sm border-amber-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="font-semibold text-amber-800">Important Disclaimer</h3>
                <div className="text-sm text-amber-700 space-y-1">
                  <p>• These IBANs are for testing and development purposes only</p>
                  <p>• They follow the correct format but are not linked to real bank accounts</p>
                  <p>• Never use these for actual financial transactions</p>
                  <p>• Always use official banking channels for real IBAN numbers</p>
                </div>
              </div>
            </div>
          </CardContent>        </Card>

        {/* Usage Statistics */}
        <UsageStats toolId="fake-iban-generator" />
      </div>
    </div>
  );
};

export default FakeIBANGenerator;
