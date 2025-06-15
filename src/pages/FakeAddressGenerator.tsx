
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, RefreshCw, Download, MapPin, Globe, Settings, FileText, Code, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddressData {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  countryCode: string;
}

const FakeAddressGenerator = () => {
  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('random');
  const [quantity, setQuantity] = useState(1);
  const [outputFormat, setOutputFormat] = useState('json');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const countries = [
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'IT', name: 'Italy', flag: '🇮🇹' },
    { code: 'ES', name: 'Spain', flag: '🇪🇸' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
    { code: 'CN', name: 'China', flag: '🇨🇳' },
    { code: 'IN', name: 'India', flag: '🇮🇳' },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
    { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
    { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
    { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
    { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
    { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
    { code: 'RU', name: 'Russia', flag: '🇷🇺' },
    { code: 'NL', name: 'Netherlands', flag: '🇳🇱' }
  ];

  const outputFormats = [
    { value: 'json', label: 'JSON', icon: Code, description: 'JavaScript Object Notation' },
    { value: 'csv', label: 'CSV', icon: FileSpreadsheet, description: 'Comma Separated Values' },
    { value: 'xml', label: 'XML', icon: Code, description: 'Extensible Markup Language' },
    { value: 'txt', label: 'TXT', icon: FileText, description: 'Plain Text Format' }
  ];

  const addressTemplates = {
    US: {
      streets: ['Main St', 'Oak Ave', 'Park Rd', 'First St', 'Second Ave', 'Broadway', 'Washington St', 'Lincoln Ave'],
      cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego'],
      states: ['NY', 'CA', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI'],
      postalFormat: () => Math.floor(Math.random() * 90000 + 10000).toString()
    },
    CA: {
      streets: ['Main St', 'King St', 'Queen St', 'University Ave', 'College St', 'Dundas St', 'Bloor St'],
      cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City'],
      states: ['ON', 'BC', 'QC', 'AB', 'MB', 'SK', 'NS', 'NB', 'NL', 'PE'],
      postalFormat: () => `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 10)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))} ${Math.floor(Math.random() * 10)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 10)}`
    },
    GB: {
      streets: ['High Street', 'Church Lane', 'Victoria Road', 'The Green', 'Mill Lane', 'School Lane', 'Queens Road'],
      cities: ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds', 'Sheffield', 'Bristol', 'Newcastle'],
      states: ['England', 'Scotland', 'Wales', 'Northern Ireland'],
      postalFormat: () => `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 10)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`
    },
    AU: {
      streets: ['Collins St', 'Swanston St', 'George St', 'Pitt St', 'Elizabeth St', 'Bourke St', 'Flinders St'],
      cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Newcastle', 'Canberra'],
      states: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'],
      postalFormat: () => Math.floor(Math.random() * 9000 + 1000).toString()
    },
    DE: {
      streets: ['Hauptstraße', 'Kirchgasse', 'Schulstraße', 'Gartenstraße', 'Bahnhofstraße', 'Dorfstraße'],
      cities: ['Berlin', 'Hamburg', 'München', 'Köln', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dortmund'],
      states: ['Bayern', 'Baden-Württemberg', 'Nordrhein-Westfalen', 'Hessen', 'Sachsen', 'Berlin'],
      postalFormat: () => Math.floor(Math.random() * 90000 + 10000).toString()
    }
  };

  const getRandomStreetNumber = () => Math.floor(Math.random() * 9999 + 1);

  const generateAddress = (countryCode: string): AddressData => {
    const country = countries.find(c => c.code === countryCode) || countries[0];
    const template = addressTemplates[countryCode as keyof typeof addressTemplates] || addressTemplates.US;
    
    const street = `${getRandomStreetNumber()} ${template.streets[Math.floor(Math.random() * template.streets.length)]}`;
    const city = template.cities[Math.floor(Math.random() * template.cities.length)];
    const state = template.states[Math.floor(Math.random() * template.states.length)];
    const postalCode = template.postalFormat();

    return {
      street,
      city,
      state,
      postalCode,
      country: country.name,
      countryCode: country.code
    };
  };

  const generateAddresses = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const newAddresses: AddressData[] = [];
      
      for (let i = 0; i < quantity; i++) {
        let countryCode = selectedCountry;
        if (selectedCountry === 'random') {
          countryCode = countries[Math.floor(Math.random() * countries.length)].code;
        }
        
        newAddresses.push(generateAddress(countryCode));
      }
      
      setAddresses(newAddresses);
      setIsGenerating(false);
      
      toast({
        title: "✅ Generation Complete",
        description: `Successfully generated ${quantity} fake address${quantity > 1 ? 'es' : ''}!`,
      });
    }, 800);
  };

  const generateOutputData = (format: string): string => {
    switch (format) {
      case 'csv':
        const csvHeader = 'Street,City,State,Postal Code,Country,Country Code\n';
        const csvData = addresses.map(addr => 
          `"${addr.street}","${addr.city}","${addr.state}","${addr.postalCode}","${addr.country}","${addr.countryCode}"`
        ).join('\n');
        return csvHeader + csvData;
      
      case 'xml':
        const xmlData = addresses.map(addr => `
  <address>
    <street>${addr.street}</street>
    <city>${addr.city}</city>
    <state>${addr.state}</state>
    <postalCode>${addr.postalCode}</postalCode>
    <country>${addr.country}</country>
    <countryCode>${addr.countryCode}</countryCode>
  </address>`).join('');
        return `<?xml version="1.0" encoding="UTF-8"?>\n<addresses>${xmlData}\n</addresses>`;
      
      case 'txt':
        return addresses.map((addr, index) => `
Address #${index + 1}
-----------
Street: ${addr.street}
City: ${addr.city}
State: ${addr.state}
Postal Code: ${addr.postalCode}
Country: ${addr.country}
Country Code: ${addr.countryCode}
`).join('\n');
      
      case 'json':
      default:
        return JSON.stringify(addresses, null, 2);
    }
  };

  const copyOutputData = () => {
    const outputData = generateOutputData(outputFormat);
    navigator.clipboard.writeText(outputData);
    toast({
      title: "📋 Copied",
      description: `${outputFormat.toUpperCase()} data copied to clipboard!`,
    });
  };

  const downloadData = () => {
    const data = generateOutputData(outputFormat);
    const blob = new Blob([data], { type: getContentType(outputFormat) });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fake-addresses.${outputFormat}`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "📥 Download Complete",
      description: `Address data downloaded as ${outputFormat.toUpperCase()}!`,
    });
  };

  const getContentType = (format: string): string => {
    const types = {
      json: 'application/json',
      csv: 'text/csv',
      xml: 'application/xml',
      txt: 'text/plain'
    };
    return types[format as keyof typeof types] || 'text/plain';
  };

  const clearAddresses = () => {
    setAddresses([]);
    toast({
      title: "🗑️ Cleared",
      description: "All generated addresses have been cleared.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 rounded-3xl mb-6 shadow-2xl">
            <MapPin className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Fake Address Generator
          </h1>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
            Generate realistic fake addresses from around the world for testing, development, and educational purposes
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Settings Panel */}
          <div className="lg:col-span-4">
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-t-lg">
                <div className="flex items-center space-x-3">
                  <Settings className="w-6 h-6 text-green-600" />
                  <div>
                    <CardTitle className="text-2xl text-gray-800">Configuration</CardTitle>
                    <CardDescription className="text-gray-600">Set up your generation parameters</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8 p-6">
                <div className="space-y-3">
                  <Label htmlFor="country" className="text-sm font-semibold text-gray-700">
                    Country Selection
                  </Label>
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger className="h-12 bg-gray-50 border-2 border-gray-200 hover:border-green-300 transition-colors">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50 max-h-60">
                      <SelectItem value="random">
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4" />
                          <span>🌍 Random Worldwide</span>
                        </div>
                      </SelectItem>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          <div className="flex items-center space-x-2">
                            <span>{country.flag}</span>
                            <span>{country.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="quantity" className="text-sm font-semibold text-gray-700">
                    Quantity (1-50)
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(50, Number(e.target.value))))}
                    min="1"
                    max="50"
                    className="h-12 bg-gray-50 border-2 border-gray-200 hover:border-green-300 transition-colors"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="outputFormat" className="text-sm font-semibold text-gray-700">
                    Output Format
                  </Label>
                  <Select value={outputFormat} onValueChange={setOutputFormat}>
                    <SelectTrigger className="h-12 bg-gray-50 border-2 border-gray-200 hover:border-green-300 transition-colors">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      {outputFormats.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          <div className="flex items-center space-x-3">
                            <format.icon className="w-4 h-4" />
                            <div>
                              <div className="font-medium">{format.label}</div>
                              <div className="text-xs text-gray-500">{format.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4 pt-4">
                  <Button
                    onClick={generateAddresses}
                    disabled={isGenerating}
                    className="w-full h-14 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
                        Generating Addresses...
                      </>
                    ) : (
                      <>
                        <MapPin className="w-5 h-5 mr-3" />
                        Generate Addresses
                      </>
                    )}
                  </Button>

                  {addresses.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      <Button
                        onClick={copyOutputData}
                        variant="outline"
                        className="h-12 border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-700"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        onClick={downloadData}
                        variant="outline"
                        className="h-12 border-2 border-green-200 hover:bg-green-50 hover:border-green-300 text-green-700"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        onClick={clearAddresses}
                        variant="outline"
                        className="h-12 border-2 border-red-200 hover:bg-red-50 hover:border-red-300 text-red-700"
                      >
                        Clear
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Output Display */}
          <div className="lg:col-span-8">
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-6 bg-gradient-to-r from-purple-50 to-green-50 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-gray-800">Generated Output</CardTitle>
                    <CardDescription className="text-gray-600">
                      {addresses.length > 0 ? `${addresses.length} address${addresses.length > 1 ? 'es' : ''} in ${outputFormat.toUpperCase()} format` : 'No addresses generated yet'}
                    </CardDescription>
                  </div>
                  {addresses.length > 0 && (
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Format: {outputFormat.toUpperCase()}</div>
                      <div className="text-2xl font-bold text-green-600">{addresses.length}</div>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {addresses.length === 0 ? (
                  <div className="bg-gradient-to-br from-gray-50 to-green-50 rounded-2xl border-2 border-dashed border-gray-300 p-16 text-center">
                    <MapPin className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Addresses Generated</h3>
                    <p className="text-gray-500">Configure your settings and click generate to create addresses</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Output ({outputFormat.toUpperCase()})
                      </h3>
                      <div className="flex space-x-2">
                        {outputFormats.map((format) => (
                          <Button
                            key={format.value}
                            onClick={() => setOutputFormat(format.value)}
                            variant={outputFormat === format.value ? "default" : "outline"}
                            size="sm"
                            className="h-8"
                          >
                            <format.icon className="w-3 h-3 mr-1" />
                            {format.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-6 overflow-auto max-h-96">
                      <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
                        {generateOutputData(outputFormat)}
                      </pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Usage Info */}
        <Card className="mt-8 shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800">📍 Worldwide Address Generation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-gray-800">🌍 Supported Countries</h4>
                <ul className="text-gray-600 space-y-2">
                  <li>• United States & Canada</li>
                  <li>• United Kingdom & Australia</li>
                  <li>• European Union countries</li>
                  <li>• Asian Pacific regions</li>
                  <li>• Latin American countries</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-gray-800">✅ Valid Use Cases</h4>
                <ul className="text-gray-600 space-y-2">
                  <li>• Software testing & QA</li>
                  <li>• Form validation testing</li>
                  <li>• Database population</li>
                  <li>• Educational purposes</li>
                  <li>• Development environments</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-gray-800">📊 Export Formats</h4>
                <ul className="text-gray-600 space-y-2">
                  <li>• JSON for web applications</li>
                  <li>• CSV for spreadsheets</li>
                  <li>• XML for enterprise systems</li>
                  <li>• TXT for simple text files</li>
                  <li>• Real-time format switching</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FakeAddressGenerator;
