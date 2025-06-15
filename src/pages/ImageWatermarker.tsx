
import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Download, RotateCcw, Type, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

const ImageWatermarker = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [watermarkedImage, setWatermarkedImage] = useState<string | null>(null);
  const [watermarkText, setWatermarkText] = useState('Watermark');
  const [fontSize, setFontSize] = useState('24');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontColor, setFontColor] = useState('#ffffff');
  const [opacity, setOpacity] = useState('0.7');
  const [position, setPosition] = useState('bottom-right');
  const [rotation, setRotation] = useState('0');
  const [offsetX, setOffsetX] = useState('20');
  const [offsetY, setOffsetY] = useState('20');
  const [shadowBlur, setShadowBlur] = useState('2');
  const [shadowColor, setShadowColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState('0');
  const [strokeColor, setStrokeColor] = useState('#000000');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
      setWatermarkedImage(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const getPositionCoordinates = (imgWidth: number, imgHeight: number, textWidth: number, textHeight: number) => {
    const offsetXNum = parseInt(offsetX) || 20;
    const offsetYNum = parseInt(offsetY) || 20;

    switch (position) {
      case 'top-left':
        return { x: offsetXNum, y: offsetYNum + textHeight };
      case 'top-center':
        return { x: imgWidth / 2 - textWidth / 2, y: offsetYNum + textHeight };
      case 'top-right':
        return { x: imgWidth - textWidth - offsetXNum, y: offsetYNum + textHeight };
      case 'center-left':
        return { x: offsetXNum, y: imgHeight / 2 };
      case 'center':
        return { x: imgWidth / 2 - textWidth / 2, y: imgHeight / 2 };
      case 'center-right':
        return { x: imgWidth - textWidth - offsetXNum, y: imgHeight / 2 };
      case 'bottom-left':
        return { x: offsetXNum, y: imgHeight - offsetYNum };
      case 'bottom-center':
        return { x: imgWidth / 2 - textWidth / 2, y: imgHeight - offsetYNum };
      case 'bottom-right':
      default:
        return { x: imgWidth - textWidth - offsetXNum, y: imgHeight - offsetYNum };
    }
  };

  const applyWatermark = useCallback(() => {
    if (!originalImage || !watermarkText.trim()) {
      toast.error('Please upload an image and enter watermark text');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the original image
      ctx.drawImage(img, 0, 0);

      // Configure watermark text style
      const fontSizeNum = parseInt(fontSize) || 24;
      ctx.font = `${fontSizeNum}px ${fontFamily}`;
      ctx.fillStyle = fontColor;
      ctx.globalAlpha = parseFloat(opacity) || 0.7;

      // Configure text effects
      const shadowBlurNum = parseInt(shadowBlur) || 0;
      const strokeWidthNum = parseInt(strokeWidth) || 0;
      
      if (shadowBlurNum > 0) {
        ctx.shadowColor = shadowColor;
        ctx.shadowBlur = shadowBlurNum;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
      }

      if (strokeWidthNum > 0) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidthNum;
      }

      // Measure text
      const textMetrics = ctx.measureText(watermarkText);
      const textWidth = textMetrics.width;
      const textHeight = fontSizeNum;

      // Get position coordinates
      const { x, y } = getPositionCoordinates(img.width, img.height, textWidth, textHeight);

      // Apply rotation if specified
      const rotationNum = parseInt(rotation) || 0;
      if (rotationNum !== 0) {
        ctx.save();
        ctx.translate(x + textWidth / 2, y - textHeight / 2);
        ctx.rotate((rotationNum * Math.PI) / 180);
        ctx.translate(-(textWidth / 2), textHeight / 2);
        
        if (strokeWidthNum > 0) {
          ctx.strokeText(watermarkText, 0, 0);
        }
        ctx.fillText(watermarkText, 0, 0);
        ctx.restore();
      } else {
        if (strokeWidthNum > 0) {
          ctx.strokeText(watermarkText, x, y);
        }
        ctx.fillText(watermarkText, x, y);
      }

      // Convert to data URL
      const watermarkedDataURL = canvas.toDataURL('image/png');
      setWatermarkedImage(watermarkedDataURL);
      toast.success('Watermark applied successfully!');
    };

    img.src = originalImage;
  }, [originalImage, watermarkText, fontSize, fontFamily, fontColor, opacity, position, rotation, offsetX, offsetY, shadowBlur, shadowColor, strokeWidth, strokeColor]);

  const downloadImage = useCallback(() => {
    if (!watermarkedImage) {
      toast.error('No watermarked image to download');
      return;
    }

    const link = document.createElement('a');
    link.href = watermarkedImage;
    link.download = 'watermarked-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Image downloaded successfully!');
  }, [watermarkedImage]);

  const resetSettings = () => {
    setWatermarkText('Watermark');
    setFontSize('24');
    setFontFamily('Arial');
    setFontColor('#ffffff');
    setOpacity('0.7');
    setPosition('bottom-right');
    setRotation('0');
    setOffsetX('20');
    setOffsetY('20');
    setShadowBlur('2');
    setShadowColor('#000000');
    setStrokeWidth('0');
    setStrokeColor('#000000');
    toast.success('Settings reset to default');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Image Watermarker</h1>
        <p className="text-muted-foreground">Add custom text watermarks to your images with advanced styling options</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings Panel */}
        <div className="space-y-6">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Image
              </CardTitle>
              <CardDescription>Select an image to add watermark to</CardDescription>
            </CardHeader>
            <CardContent>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="w-full"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Choose Image
              </Button>
            </CardContent>
          </Card>

          {/* Text Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Text Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="watermark-text">Watermark Text</Label>
                <Textarea
                  id="watermark-text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="Enter your watermark text"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="font-size">Font Size</Label>
                  <Input
                    id="font-size"
                    type="number"
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                    min="8"
                    max="200"
                  />
                </div>
                <div>
                  <Label htmlFor="font-family">Font Family</Label>
                  <Select value={fontFamily} onValueChange={setFontFamily}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Verdana">Verdana</SelectItem>
                      <SelectItem value="Courier New">Courier New</SelectItem>
                      <SelectItem value="Impact">Impact</SelectItem>
                      <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="font-color">Font Color</Label>
                  <Input
                    id="font-color"
                    type="color"
                    value={fontColor}
                    onChange={(e) => setFontColor(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="opacity">Opacity</Label>
                  <Input
                    id="opacity"
                    type="number"
                    value={opacity}
                    onChange={(e) => setOpacity(e.target.value)}
                    min="0"
                    max="1"
                    step="0.1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Position & Effects */}
          <Card>
            <CardHeader>
              <CardTitle>Position & Effects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="position">Position</Label>
                <Select value={position} onValueChange={setPosition}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top-left">Top Left</SelectItem>
                    <SelectItem value="top-center">Top Center</SelectItem>
                    <SelectItem value="top-right">Top Right</SelectItem>
                    <SelectItem value="center-left">Center Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="center-right">Center Right</SelectItem>
                    <SelectItem value="bottom-left">Bottom Left</SelectItem>
                    <SelectItem value="bottom-center">Bottom Center</SelectItem>
                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="offset-x">Offset X</Label>
                  <Input
                    id="offset-x"
                    type="number"
                    value={offsetX}
                    onChange={(e) => setOffsetX(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="offset-y">Offset Y</Label>
                  <Input
                    id="offset-y"
                    type="number"
                    value={offsetY}
                    onChange={(e) => setOffsetY(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="rotation">Rotation (°)</Label>
                  <Input
                    id="rotation"
                    type="number"
                    value={rotation}
                    onChange={(e) => setRotation(e.target.value)}
                    min="-360"
                    max="360"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="shadow-blur">Shadow Blur</Label>
                  <Input
                    id="shadow-blur"
                    type="number"
                    value={shadowBlur}
                    onChange={(e) => setShadowBlur(e.target.value)}
                    min="0"
                    max="20"
                  />
                </div>
                <div>
                  <Label htmlFor="shadow-color">Shadow Color</Label>
                  <Input
                    id="shadow-color"
                    type="color"
                    value={shadowColor}
                    onChange={(e) => setShadowColor(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stroke-width">Stroke Width</Label>
                  <Input
                    id="stroke-width"
                    type="number"
                    value={strokeWidth}
                    onChange={(e) => setStrokeWidth(e.target.value)}
                    min="0"
                    max="10"
                  />
                </div>
                <div>
                  <Label htmlFor="stroke-color">Stroke Color</Label>
                  <Input
                    id="stroke-color"
                    type="color"
                    value={strokeColor}
                    onChange={(e) => setStrokeColor(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button onClick={applyWatermark} className="flex-1">
              Apply Watermark
            </Button>
            <Button onClick={resetSettings} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Original and watermarked image preview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {originalImage && (
                <div>
                  <Label className="text-sm font-medium">Original Image</Label>
                  <div className="mt-2 border rounded-lg overflow-hidden">
                    <img
                      src={originalImage}
                      alt="Original"
                      className="w-full h-auto max-h-64 object-contain bg-gray-50"
                    />
                  </div>
                </div>
              )}

              {watermarkedImage && (
                <div>
                  <Label className="text-sm font-medium">Watermarked Image</Label>
                  <div className="mt-2 border rounded-lg overflow-hidden">
                    <img
                      src={watermarkedImage}
                      alt="Watermarked"
                      className="w-full h-auto max-h-64 object-contain bg-gray-50"
                    />
                  </div>
                  <Button onClick={downloadImage} className="w-full mt-4">
                    <Download className="h-4 w-4 mr-2" />
                    Download Watermarked Image
                  </Button>
                </div>
              )}

              {!originalImage && (
                <div className="text-center py-12 text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Upload an image to start watermarking</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ImageWatermarker;
