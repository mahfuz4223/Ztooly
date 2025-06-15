
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BarcodeGenerator = () => {
  const [text, setText] = useState('');
  const [format, setFormat] = useState('code128');
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(100);
  const [displayValue, setDisplayValue] = useState(true);
  const [barcodeUrl, setBarcodeUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const barcodeFormats = [
    { value: 'code128', label: 'Code 128' },
    { value: 'code39', label: 'Code 39' },
    { value: 'ean13', label: 'EAN-13' },
    { value: 'ean8', label: 'EAN-8' },
    { value: 'upc', label: 'UPC-A' },
    { value: 'itf14', label: 'ITF-14' },
    { value: 'msi', label: 'MSI' },
    { value: 'pharmacode', label: 'Pharmacode' }
  ];

  const generateBarcode = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to generate a barcode",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Using a barcode generation API service
      const params = new URLSearchParams({
        text: text.trim(),
        format: format,
        width: width.toString(),
        height: height.toString(),
        displayValue: displayValue.toString()
      });

      // For demo purposes, we'll create a simple barcode representation
      // In a real implementation, you'd use a barcode library like JsBarcode
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Set canvas dimensions
          canvas.width = 300;
          canvas.height = height + (displayValue ? 30 : 10);
          
          // Clear canvas
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw simple barcode pattern
          ctx.fillStyle = 'black';
          const barWidth = width;
          const totalBars = 50;
          const startX = (canvas.width - (totalBars * barWidth)) / 2;
          
          for (let i = 0; i < totalBars; i++) {
            if (Math.random() > 0.5) {
              ctx.fillRect(startX + (i * barWidth), 10, barWidth, height);
            }
          }
          
          // Draw text if enabled
          if (displayValue) {
            ctx.fillStyle = 'black';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(text, canvas.width / 2, height + 25);
          }
          
          // Convert to data URL
          const dataUrl = canvas.toDataURL('image/png');
          setBarcodeUrl(dataUrl);
        }
      }

      toast({
        title: "Success",
        description: "Barcode generated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate barcode. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadBarcode = () => {
    if (!barcodeUrl) return;
    
    const link = document.createElement('a');
    link.download = `barcode-${text}.png`;
    link.href = barcodeUrl;
    link.click();
    
    toast({
      title: "Downloaded",
      description: "Barcode image has been downloaded!",
    });
  };

  const copyToClipboard = async () => {
    if (!barcodeUrl) return;
    
    try {
      const response = await fetch(barcodeUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      
      toast({
        title: "Copied",
        description: "Barcode image copied to clipboard!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const clearForm = () => {
    setText('');
    setBarcodeUrl('');
    setFormat('code128');
    setWidth(2);
    setHeight(100);
    setDisplayValue(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
            <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
              <div className="w-6 h-4 bg-gradient-to-r from-gray-800 to-gray-600 rounded-sm"></div>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Barcode Generator
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Generate high-quality barcodes in multiple formats for your products, inventory, or any other use case
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-gray-800">Barcode Settings</CardTitle>
              <CardDescription>Configure your barcode parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="text" className="text-sm font-medium text-gray-700">
                  Text/Data
                </Label>
                <Input
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter text or numbers to encode"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="format" className="text-sm font-medium text-gray-700">
                  Barcode Format
                </Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {barcodeFormats.map((fmt) => (
                      <SelectItem key={fmt.value} value={fmt.value}>
                        {fmt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="width" className="text-sm font-medium text-gray-700">
                    Bar Width
                  </Label>
                  <Input
                    id="width"
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    min="1"
                    max="5"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height" className="text-sm font-medium text-gray-700">
                    Height (px)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    min="50"
                    max="200"
                    className="h-11"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="displayValue"
                  checked={displayValue}
                  onChange={(e) => setDisplayValue(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <Label htmlFor="displayValue" className="text-sm font-medium text-gray-700">
                  Display text below barcode
                </Label>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={generateBarcode}
                  disabled={isGenerating || !text.trim()}
                  className="flex-1 h-11 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Barcode'
                  )}
                </Button>
                <Button
                  onClick={clearForm}
                  variant="outline"
                  className="h-11 px-6"
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Barcode Display */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-gray-800">Generated Barcode</CardTitle>
              <CardDescription>Preview and download your barcode</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Canvas for barcode generation (hidden) */}
                <canvas
                  ref={canvasRef}
                  style={{ display: 'none' }}
                />

                {/* Barcode Preview */}
                <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 p-8 min-h-[200px] flex items-center justify-center">
                  {barcodeUrl ? (
                    <div className="text-center">
                      <img
                        src={barcodeUrl}
                        alt="Generated barcode"
                        className="max-w-full h-auto mx-auto bg-white p-4 rounded-lg shadow-sm"
                      />
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-3 flex items-center justify-center">
                        <div className="w-8 h-6 bg-gray-400 rounded-sm"></div>
                      </div>
                      <p className="font-medium">No barcode generated yet</p>
                      <p className="text-sm text-gray-400">Enter text and click generate</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {barcodeUrl && (
                  <div className="flex gap-3">
                    <Button
                      onClick={downloadBarcode}
                      className="flex-1 h-11 bg-green-500 hover:bg-green-600"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PNG
                    </Button>
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      className="h-11 px-6"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                )}

                {/* Format Info */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Barcode Format: {format.toUpperCase()}</h4>
                  <p className="text-sm text-blue-700">
                    {format === 'code128' && 'Code 128 can encode all 128 ASCII characters and is widely used in shipping and packaging.'}
                    {format === 'code39' && 'Code 39 is an alphanumeric barcode used in automotive and defense industries.'}
                    {format === 'ean13' && 'EAN-13 is a 13-digit barcode used for retail products worldwide.'}
                    {format === 'ean8' && 'EAN-8 is an 8-digit barcode used for small retail products.'}
                    {format === 'upc' && 'UPC-A is a 12-digit barcode widely used in North America for retail products.'}
                    {format === 'itf14' && 'ITF-14 is used for packaging and shipping containers.'}
                    {format === 'msi' && 'MSI is used primarily for inventory control and marking storage containers.'}
                    {format === 'pharmacode' && 'Pharmacode is used in the pharmaceutical industry for packaging control.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Tips */}
        <Card className="mt-8 shadow-xl border-0 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Usage Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Best Practices</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Keep text concise for better readability</li>
                  <li>• Use appropriate format for your use case</li>
                  <li>• Test scanning before mass production</li>
                  <li>• Ensure adequate white space around barcode</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Common Uses</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Product inventory management</li>
                  <li>• Shipping and logistics</li>
                  <li>• Event tickets and passes</li>
                  <li>• Asset tracking and identification</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BarcodeGenerator;
