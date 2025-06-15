
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, RefreshCw, Download, CreditCard, AlertTriangle } from 'lucide-react';
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
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const cardBrands = [
    { value: 'visa', label: 'Visa', prefix: '4', color: 'from-blue-600 to-blue-800' },
    { value: 'mastercard', label: 'Mastercard', prefix: '5', color: 'from-red-600 to-red-800' },
    { value: 'amex', label: 'American Express', prefix: '3', color: 'from-green-600 to-green-800' },
    { value: 'discover', label: 'Discover', prefix: '6', color: 'from-orange-600 to-orange-800' }
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
    
    // Generate remaining digits based on card type
    const targetLength = brand === 'amex' ? 15 : 16;
    
    for (let i = cardNumber.length; i < targetLength - 1; i++) {
      cardNumber += Math.floor(Math.random() * 10).toString();
    }
    
    // Calculate check digit using Luhn algorithm
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
        title: "Success",
        description: `Generated ${quantity} fake credit card${quantity > 1 ? 's' : ''}!`,
      });
    }, 1000);
  };

  const copyCardData = (card: CreditCardData) => {
    const cardData = `Card Number: ${card.number}
Expiry: ${card.expiryMonth}/${card.expiryYear}
CVV: ${card.cvv}
Holder: ${card.holderName}`;
    
    navigator.clipboard.writeText(cardData);
    toast({
      title: "Copied",
      description: "Card data copied to clipboard!",
    });
  };

  const downloadAsJSON = () => {
    const dataStr = JSON.stringify(cards, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fake-credit-cards.json';
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: "Credit card data downloaded as JSON!",
    });
  };

  const clearCards = () => {
    setCards([]);
  };

  const getBrandColor = (brand: string): string => {
    const brandConfig = cardBrands.find(b => b.value === brand);
    return brandConfig?.color || 'from-gray-600 to-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl mb-4">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Fake Credit Card Generator
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Generate realistic-looking fake credit cards for testing and development purposes
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Settings Panel */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-gray-800">Card Settings</CardTitle>
              <CardDescription>Configure your credit card parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="brand" className="text-sm font-medium text-gray-700">
                  Card Brand
                </Label>
                <Select value={cardBrand} onValueChange={setCardBrand}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {cardBrands.map((brand) => (
                      <SelectItem key={brand.value} value={brand.value}>
                        {brand.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(10, Number(e.target.value))))}
                  min="1"
                  max="10"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="holderName" className="text-sm font-medium text-gray-700">
                  Cardholder Name
                </Label>
                <Input
                  id="holderName"
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                  placeholder="Enter cardholder name"
                  className="h-11"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={generateCards}
                  disabled={isGenerating}
                  className="flex-1 h-11 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Cards'
                  )}
                </Button>
                {cards.length > 0 && (
                  <Button
                    onClick={clearCards}
                    variant="outline"
                    className="h-11 px-6"
                  >
                    Clear
                  </Button>
                )}
              </div>

              {cards.length > 0 && (
                <Button
                  onClick={downloadAsJSON}
                  variant="outline"
                  className="w-full h-11"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download as JSON
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Credit Cards Display */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-gray-800">Generated Cards</CardTitle>
                <CardDescription>
                  {cards.length > 0 ? `${cards.length} card${cards.length > 1 ? 's' : ''} generated` : 'No cards generated yet'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {cards.length === 0 ? (
                  <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
                    <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="font-medium text-gray-600">No cards generated yet</p>
                    <p className="text-sm text-gray-400">Configure settings and click generate</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cards.map((card, index) => (
                      <div
                        key={index}
                        className="relative group"
                      >
                        {/* Credit Card */}
                        <div className={`relative w-full h-56 bg-gradient-to-br ${getBrandColor(card.brand)} rounded-2xl p-6 text-white shadow-2xl transform transition-all duration-300 hover:scale-105`}>
                          {/* Card Background Pattern */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl"></div>
                          <div className="absolute top-4 right-4">
                            <div className="w-12 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-md flex items-center justify-center">
                              <div className="w-8 h-5 bg-yellow-300 rounded-sm"></div>
                            </div>
                          </div>
                          
                          {/* Card Number */}
                          <div className="absolute top-20 left-6 right-6">
                            <p className="text-2xl font-mono tracking-wider">
                              {formatCardNumber(card.number)}
                            </p>
                          </div>
                          
                          {/* Card Details */}
                          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                            <div>
                              <p className="text-xs opacity-70 mb-1">VALID THRU</p>
                              <p className="text-lg font-mono">{card.expiryMonth}/{card.expiryYear}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs opacity-70 mb-1">CVV</p>
                              <p className="text-lg font-mono">{card.cvv}</p>
                            </div>
                          </div>
                          
                          {/* Cardholder Name */}
                          <div className="absolute bottom-6 left-6">
                            <p className="text-xs opacity-70 mb-1">CARDHOLDER NAME</p>
                            <p className="text-sm font-semibold tracking-wide">{card.holderName}</p>
                          </div>
                          
                          {/* Brand Logo */}
                          <div className="absolute bottom-6 right-6">
                            <p className="text-lg font-bold tracking-wider">
                              {card.brand.toUpperCase()}
                            </p>
                          </div>
                        </div>
                        
                        {/* Copy Button */}
                        <Button
                          onClick={() => copyCardData(card)}
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/20 hover:bg-white/30 backdrop-blur text-white border-white/30"
                          variant="outline"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Disclaimer */}
        <Card className="mt-8 shadow-xl border-0 bg-amber-50/80 backdrop-blur border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-900 mb-2">Important Disclaimer</h4>
                <p className="text-sm text-amber-800 leading-relaxed">
                  These are fake credit card numbers generated for testing and development purposes only. 
                  They are NOT real credit cards and cannot be used for actual purchases or transactions. 
                  Using fake credit card information for fraudulent purposes is illegal and strictly prohibited. 
                  Always use legitimate payment methods for real transactions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Info */}
        <Card className="mt-8 shadow-xl border-0 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Usage Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Valid Use Cases</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Software testing and QA</li>
                  <li>• Payment form validation</li>
                  <li>• Educational purposes</li>
                  <li>• Development and staging environments</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Features</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Luhn algorithm compliant numbers</li>
                  <li>• Multiple card brand support</li>
                  <li>• Realistic card design</li>
                  <li>• Bulk generation capability</li>
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
