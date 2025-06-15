import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, RefreshCw, Download, CreditCard, AlertTriangle, FileText, FileSpreadsheet, Code, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreditCardData {
  number: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  holderName: string;
  brand: string;
}

const FakeCreditCardGenerator = () => {
  const [cards, setCards] = useState<CreditCardData[]>([]);
  const [cardBrand, setCardBrand] = useState('visa');
  const [quantity, setQuantity] = useState(1);
  const [holderName, setHolderName] = useState('JOHN DOE');
  const [outputFormat, setOutputFormat] = useState('json');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const cardBrands = [
    { value: 'visa', label: 'Visa', prefix: '4', color: 'from-blue-600 to-blue-800', logo: '💳' },
    { value: 'mastercard', label: 'Mastercard', prefix: '5', color: 'from-red-600 to-red-800', logo: '🔴' },
    { value: 'amex', label: 'American Express', prefix: '3', color: 'from-green-600 to-green-800', logo: '💚' },
    { value: 'discover', label: 'Discover', prefix: '6', color: 'from-orange-600 to-orange-800', logo: '🟠' }
  ];

  const outputFormats = [
    { value: 'json', label: 'JSON', icon: Code, description: 'JavaScript Object Notation' },
    { value: 'csv', label: 'CSV', icon: FileSpreadsheet, description: 'Comma Separated Values' },
    { value: 'xml', label: 'XML', icon: Code, description: 'Extensible Markup Language' },
    { value: 'txt', label: 'TXT', icon: FileText, description: 'Plain Text Format' }
  ];

  const luhnChecksum = (cardNumber: string): boolean => {
    let sum = 0;
    let isEven = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i));
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  };

  const generateCardNumber = (brand: string): string => {
    const brandConfig = cardBrands.find(b => b.value === brand);
    if (!brandConfig) return '';

    let cardNumber = brandConfig.prefix;
    
    const targetLength = brand === 'amex' ? 15 : 16;
    
    for (let i = cardNumber.length; i < targetLength - 1; i++) {
      cardNumber += Math.floor(Math.random() * 10).toString();
    }
    
    let sum = 0;
    let isEven = true;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i));
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    const checkDigit = (10 - (sum % 10)) % 10;
    cardNumber += checkDigit.toString();
    
    return cardNumber;
  };

  const formatCardNumber = (number: string): string => {
    if (cardBrand === 'amex') {
      return number.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
    }
    return number.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const generateCards = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const newCards: CreditCardData[] = [];
      
      for (let i = 0; i < quantity; i++) {
        const cardNumber = generateCardNumber(cardBrand);
        const currentYear = new Date().getFullYear();
        const expiryMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
        const expiryYear = String(currentYear + Math.floor(Math.random() * 5) + 1).slice(-2);
        const cvv = cardBrand === 'amex' 
          ? Math.floor(Math.random() * 9000 + 1000).toString()
          : Math.floor(Math.random() * 900 + 100).toString();
        
        newCards.push({
          number: cardNumber,
          expiryMonth,
          expiryYear,
          cvv,
          holderName: holderName.toUpperCase(),
          brand: cardBrand
        });
      }
      
      setCards(newCards);
      setIsGenerating(false);
      
      toast({
        title: "✅ Generation Complete",
        description: `Successfully generated ${quantity} fake credit card${quantity > 1 ? 's' : ''}!`,
      });
    }, 1200);
  };

  const copyCardData = (card: CreditCardData) => {
    const cardData = `Card Number: ${card.number}
Expiry: ${card.expiryMonth}/${card.expiryYear}
CVV: ${card.cvv}
Holder: ${card.holderName}`;
    
    navigator.clipboard.writeText(cardData);
    toast({
      title: "📋 Copied",
      description: "Card data copied to clipboard!",
    });
  };

  const generateOutputData = (format: string): string => {
    switch (format) {
      case 'csv':
        const csvHeader = 'Card Number,Expiry Month,Expiry Year,CVV,Holder Name,Brand\n';
        const csvData = cards.map(card => 
          `${card.number},${card.expiryMonth},${card.expiryYear},${card.cvv},"${card.holderName}",${card.brand}`
        ).join('\n');
        return csvHeader + csvData;
      
      case 'xml':
        const xmlData = cards.map(card => `
  <card>
    <number>${card.number}</number>
    <expiryMonth>${card.expiryMonth}</expiryMonth>
    <expiryYear>${card.expiryYear}</expiryYear>
    <cvv>${card.cvv}</cvv>
    <holderName>${card.holderName}</holderName>
    <brand>${card.brand}</brand>
  </card>`).join('');
        return `<?xml version="1.0" encoding="UTF-8"?>\n<creditCards>${xmlData}\n</creditCards>`;
      
      case 'txt':
        return cards.map((card, index) => `
Card #${index + 1}
---------
Number: ${card.number}
Expiry: ${card.expiryMonth}/${card.expiryYear}
CVV: ${card.cvv}
Holder: ${card.holderName}
Brand: ${card.brand.toUpperCase()}
`).join('\n');
      
      case 'json':
      default:
        return JSON.stringify(cards, null, 2);
    }
  };

  const downloadData = () => {
    const data = generateOutputData(outputFormat);
    const blob = new Blob([data], { type: getContentType(outputFormat) });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fake-credit-cards.${outputFormat}`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "📥 Download Complete",
      description: `Credit card data downloaded as ${outputFormat.toUpperCase()}!`,
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

  const clearCards = () => {
    setCards([]);
    toast({
      title: "🗑️ Cleared",
      description: "All generated cards have been cleared.",
    });
  };

  const getBrandColor = (brand: string): string => {
    const brandConfig = cardBrands.find(b => b.value === brand);
    return brandConfig?.color || 'from-gray-600 to-gray-800';
  };

  const getBrandLogo = (brand: string): string => {
    const brandConfig = cardBrands.find(b => b.value === brand);
    return brandConfig?.logo || '💳';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-3xl mb-6 shadow-2xl">
            <CreditCard className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Fake Credit Card Generator
          </h1>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
            Generate realistic-looking fake credit cards for testing, development, and educational purposes with advanced export options
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Enhanced Settings Panel */}
          <div className="lg:col-span-4">
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                <div className="flex items-center space-x-3">
                  <Settings className="w-6 h-6 text-blue-600" />
                  <div>
                    <CardTitle className="text-2xl text-gray-800">Configuration</CardTitle>
                    <CardDescription className="text-gray-600">Set up your generation parameters</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8 p-6">
                <div className="space-y-3">
                  <Label htmlFor="brand" className="text-sm font-semibold text-gray-700">
                    Card Brand
                  </Label>
                  <Select value={cardBrand} onValueChange={setCardBrand}>
                    <SelectTrigger className="h-12 bg-gray-50 border-2 border-gray-200 hover:border-blue-300 transition-colors">
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {cardBrands.map((brand) => (
                        <SelectItem key={brand.value} value={brand.value}>
                          <div className="flex items-center space-x-2">
                            <span>{brand.logo}</span>
                            <span>{brand.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="quantity" className="text-sm font-semibold text-gray-700">
                    Quantity (1-20)
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(20, Number(e.target.value))))}
                    min="1"
                    max="20"
                    className="h-12 bg-gray-50 border-2 border-gray-200 hover:border-blue-300 transition-colors"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="holderName" className="text-sm font-semibold text-gray-700">
                    Cardholder Name
                  </Label>
                  <Input
                    id="holderName"
                    value={holderName}
                    onChange={(e) => setHolderName(e.target.value)}
                    placeholder="Enter cardholder name"
                    className="h-12 bg-gray-50 border-2 border-gray-200 hover:border-blue-300 transition-colors"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="outputFormat" className="text-sm font-semibold text-gray-700">
                    Output Format
                  </Label>
                  <Select value={outputFormat} onValueChange={setOutputFormat}>
                    <SelectTrigger className="h-12 bg-gray-50 border-2 border-gray-200 hover:border-blue-300 transition-colors">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
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
                    onClick={generateCards}
                    disabled={isGenerating}
                    className="w-full h-14 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
                        Generating Cards...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-3" />
                        Generate Cards
                      </>
                    )}
                  </Button>

                  {cards.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={downloadData}
                        variant="outline"
                        className="h-12 border-2 border-green-200 hover:bg-green-50 hover:border-green-300 text-green-700"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        onClick={clearCards}
                        variant="outline"
                        className="h-12 border-2 border-red-200 hover:bg-red-50 hover:border-red-300 text-red-700"
                      >
                        Clear All
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Credit Cards Display */}
          <div className="lg:col-span-8">
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-gray-800">Generated Cards</CardTitle>
                    <CardDescription className="text-gray-600">
                      {cards.length > 0 ? `${cards.length} card${cards.length > 1 ? 's' : ''} ready for export` : 'No cards generated yet'}
                    </CardDescription>
                  </div>
                  {cards.length > 0 && (
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Export as {outputFormat.toUpperCase()}</div>
                      <div className="text-2xl font-bold text-blue-600">{cards.length}</div>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {cards.length === 0 ? (
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-dashed border-gray-300 p-16 text-center">
                    <CreditCard className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Cards Generated</h3>
                    <p className="text-gray-500">Configure your settings and click generate to create cards</p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {cards.map((card, index) => (
                      <div
                        key={index}
                        className="relative group"
                      >
                        {/* Enhanced Credit Card Design */}
                        <div className={`relative w-full h-64 bg-gradient-to-br ${getBrandColor(card.brand)} rounded-3xl p-8 text-white shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-3xl overflow-hidden`}>
                          {/* Card Background Patterns */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>
                          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
                          <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full translate-y-16 -translate-x-16"></div>
                          
                          {/* Chip */}
                          <div className="absolute top-6 left-8">
                            <div className="w-14 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg">
                              <div className="w-10 h-6 bg-yellow-300 rounded-md"></div>
                            </div>
                          </div>
                          
                          {/* Card Number */}
                          <div className="absolute top-24 left-8 right-8">
                            <p className="text-3xl font-mono tracking-wider font-semibold">
                              {formatCardNumber(card.number)}
                            </p>
                          </div>
                          
                          {/* Card Details */}
                          <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                            <div>
                              <p className="text-xs opacity-80 mb-1 font-medium">VALID THRU</p>
                              <p className="text-xl font-mono font-bold">{card.expiryMonth}/{card.expiryYear}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs opacity-80 mb-1 font-medium">CVV</p>
                              <p className="text-xl font-mono font-bold">{card.cvv}</p>
                            </div>
                          </div>
                          
                          {/* Cardholder Name */}
                          <div className="absolute bottom-16 left-8">
                            <p className="text-xs opacity-80 mb-1 font-medium">CARDHOLDER NAME</p>
                            <p className="text-lg font-bold tracking-wider">{card.holderName}</p>
                          </div>
                          
                          {/* Brand Logo */}
                          <div className="absolute top-6 right-8 flex items-center space-x-2">
                            <span className="text-2xl">{getBrandLogo(card.brand)}</span>
                            <p className="text-xl font-bold tracking-wider">
                              {card.brand.toUpperCase()}
                            </p>
                          </div>
                        </div>
                        
                        {/* Enhanced Copy Button */}
                        <Button
                          onClick={() => copyCardData(card)}
                          size="sm"
                          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border-white/30 shadow-lg"
                          variant="outline"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Disclaimer */}
        <Card className="mt-12 shadow-2xl border-0 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-l-amber-400">
          <CardContent className="p-8">
            <div className="flex items-start space-x-4">
              <AlertTriangle className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-xl font-bold text-amber-900 mb-3">⚠️ Important Legal Disclaimer</h4>
                <p className="text-amber-800 leading-relaxed text-lg">
                  These are <strong>fake credit card numbers</strong> generated for testing and development purposes only. 
                  They are <strong>NOT real credit cards</strong> and cannot be used for actual purchases or transactions. 
                  Using fake credit card information for fraudulent purposes is <strong>illegal and strictly prohibited</strong>. 
                  Always use legitimate payment methods for real transactions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Usage Info */}
        <Card className="mt-8 shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800">📖 Usage Information & Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-gray-800 flex items-center">
                  ✅ Valid Use Cases
                </h4>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-center">• Software testing and QA</li>
                  <li className="flex items-center">• Payment form validation</li>
                  <li className="flex items-center">• Educational purposes</li>
                  <li className="flex items-center">• Development environments</li>
                  <li className="flex items-center">• API testing and integration</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-gray-800 flex items-center">
                  🚀 Advanced Features
                </h4>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-center">• Luhn algorithm compliance</li>
                  <li className="flex items-center">• Multiple card brand support</li>
                  <li className="flex items-center">• Realistic 3D card design</li>
                  <li className="flex items-center">• Bulk generation (up to 20)</li>
                  <li className="flex items-center">• Multiple export formats</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-gray-800 flex items-center">
                  📊 Export Formats
                </h4>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-center">• JSON for web applications</li>
                  <li className="flex items-center">• CSV for spreadsheets</li>
                  <li className="flex items-center">• XML for enterprise systems</li>
                  <li className="flex items-center">• TXT for simple text files</li>
                  <li className="flex items-center">• Copy individual cards</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FakeCreditCardGenerator;
