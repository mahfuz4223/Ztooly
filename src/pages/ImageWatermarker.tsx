
import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, RotateCcw, Type, Image as ImageIcon, Grid, Palette, Settings, Eye } from 'lucide-react';
import { toast } from 'sonner';

const ImageWatermarker = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [watermarkedImage, setWatermarkedImage] = useState<string | null>(null);
  const [watermarkText, setWatermarkText] = useState('© Your Watermark');
  const [fontSize, setFontSize] = useState([32]);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontColor, setFontColor] = useState('#ffffff');
  const [opacity, setOpacity] = useState([80]);
  const [position, setPosition] = useState('bottom-right');
  const [rotation, setRotation] = useState([0]);
  const [offsetX, setOffsetX] = useState([30]);
  const [offsetY, setOffsetY] = useState([30]);
  const [shadowBlur, setShadowBlur] = useState([4]);
  const [shadowColor, setShadowColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState([1]);
  const [strokeColor, setStrokeColor] = useState('#000000');
  
  // Tiled watermark settings
  const [isTiled, setIsTiled] = useState(false);
  const [tileSpacingX, setTileSpacingX] = useState([150]);
  const [tileSpacingY, setTileSpacingY] = useState([120]);
  const [tileRotation, setTileRotation] = useState([-35]);
  
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
      toast.success('Image uploaded successfully!');
    };
    reader.readAsDataURL(file);
  }, []);

  const getPositionCoordinates = (imgWidth: number, imgHeight: number, textWidth: number, textHeight: number) => {
    const offsetXNum = offsetX[0];
    const offsetYNum = offsetY[0];

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

  const drawWatermarkText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, rotation: number) => {
    ctx.save();

    // Configure text style
    ctx.font = `${fontSize[0]}px ${fontFamily}`;
    ctx.fillStyle = fontColor;
    ctx.globalAlpha = opacity[0] / 100;

    // Configure effects
    if (shadowBlur[0] > 0) {
      ctx.shadowColor = shadowColor;
      ctx.shadowBlur = shadowBlur[0];
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
    }

    if (strokeWidth[0] > 0) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth[0];
    }

    // Apply rotation
    if (rotation !== 0) {
      const textMetrics = ctx.measureText(text);
      const textWidth = textMetrics.width;
      const textHeight = fontSize[0];
      
      ctx.translate(x + textWidth / 2, y - textHeight / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-(textWidth / 2), textHeight / 2);
      
      if (strokeWidth[0] > 0) {
        ctx.strokeText(text, 0, 0);
      }
      ctx.fillText(text, 0, 0);
    } else {
      if (strokeWidth[0] > 0) {
        ctx.strokeText(text, x, y);
      }
      ctx.fillText(text, x, y);
    }

    ctx.restore();
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

      // Measure text for positioning
      ctx.font = `${fontSize[0]}px ${fontFamily}`;
      const textMetrics = ctx.measureText(watermarkText);
      const textWidth = textMetrics.width;
      const textHeight = fontSize[0];

      if (isTiled) {
        // Apply tiled watermark pattern
        const spacingX = tileSpacingX[0];
        const spacingY = tileSpacingY[0];
        const tileRot = tileRotation[0];

        for (let x = 0; x < img.width + spacingX; x += spacingX) {
          for (let y = textHeight; y < img.height + spacingY; y += spacingY) {
            drawWatermarkText(ctx, watermarkText, x, y, tileRot);
          }
        }
      } else {
        // Apply single watermark
        const { x, y } = getPositionCoordinates(img.width, img.height, textWidth, textHeight);
        drawWatermarkText(ctx, watermarkText, x, y, rotation[0]);
      }

      // Convert to data URL
      const watermarkedDataURL = canvas.toDataURL('image/png', 0.95);
      setWatermarkedImage(watermarkedDataURL);
      toast.success('Watermark applied successfully!');
    };

    img.src = originalImage;
  }, [originalImage, watermarkText, fontSize, fontFamily, fontColor, opacity, position, rotation, offsetX, offsetY, shadowBlur, shadowColor, strokeWidth, strokeColor, isTiled, tileSpacingX, tileSpacingY, tileRotation]);

  const downloadImage = useCallback(() => {
    if (!watermarkedImage) {
      toast.error('No watermarked image to download');
      return;
    }

    const link = document.createElement('a');
    link.href = watermarkedImage;
    link.download = `watermarked-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Image downloaded successfully!');
  }, [watermarkedImage]);

  const resetSettings = () => {
    setWatermarkText('© Your Watermark');
    setFontSize([32]);
    setFontFamily('Arial');
    setFontColor('#ffffff');
    setOpacity([80]);
    setPosition('bottom-right');
    setRotation([0]);
    setOffsetX([30]);
    setOffsetY([30]);
    setShadowBlur([4]);
    setShadowColor('#000000');
    setStrokeWidth([1]);
    setStrokeColor('#000000');
    setIsTiled(false);
    setTileSpacingX([150]);
    setTileSpacingY([120]);
    setTileRotation([-35]);
    toast.success('Settings reset to default');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Professional Image Watermarker</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Add stunning watermarks to your images with advanced customization options. 
            Perfect for photographers, designers, and content creators.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Settings Panel */}
          <div className="lg:col-span-8 space-y-6">
            {/* Upload Section */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Upload className="h-5 w-5 text-blue-600" />
                  </div>
                  Upload Your Image
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Select a high-quality image to add your professional watermark
                </CardDescription>
              </CardHeader>
              <CardContent>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative cursor-pointer group"
                >
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors group-hover:bg-blue-50/50">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                        <ImageIcon className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">Drop your image here</h3>
                        <p className="text-sm text-slate-500">or click to browse files</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        PNG, JPG, JPEG supported
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Watermark Mode */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Grid className="h-5 w-5 text-purple-600" />
                  </div>
                  Watermark Style
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Choose between single placement or tiled pattern across the entire image
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Tiled Pattern</Label>
                    <p className="text-sm text-slate-500">Apply watermark across entire image</p>
                  </div>
                  <Switch checked={isTiled} onCheckedChange={setIsTiled} />
                </div>

                {isTiled && (
                  <div className="space-y-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-3">Tiling Options</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Horizontal Spacing</Label>
                        <Slider
                          value={tileSpacingX}
                          onValueChange={setTileSpacingX}
                          max={300}
                          min={50}
                          step={10}
                          className="w-full"
                        />
                        <div className="text-xs text-center text-slate-500 bg-white px-2 py-1 rounded">{tileSpacingX[0]}px</div>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Vertical Spacing</Label>
                        <Slider
                          value={tileSpacingY}
                          onValueChange={setTileSpacingY}
                          max={300}
                          min={50}
                          step={10}
                          className="w-full"
                        />
                        <div className="text-xs text-center text-slate-500 bg-white px-2 py-1 rounded">{tileSpacingY[0]}px</div>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Tile Rotation</Label>
                        <Slider
                          value={tileRotation}
                          onValueChange={setTileRotation}
                          max={90}
                          min={-90}
                          step={5}
                          className="w-full"
                        />
                        <div className="text-xs text-center text-slate-500 bg-white px-2 py-1 rounded">{tileRotation[0]}°</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Text Settings */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Type className="h-5 w-5 text-green-600" />
                  </div>
                  Text Customization
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Customize your watermark text and typography settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-base font-medium">Watermark Text</Label>
                  <Textarea
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    placeholder="Enter your watermark text..."
                    rows={2}
                    className="resize-none border-slate-300 focus:border-blue-500"
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Font Size</Label>
                    <Slider
                      value={fontSize}
                      onValueChange={setFontSize}
                      max={120}
                      min={12}
                      step={2}
                      className="w-full"
                    />
                    <div className="text-sm text-center text-slate-500 bg-slate-100 px-3 py-1 rounded">{fontSize[0]}px</div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-medium">Font Family</Label>
                    <Select value={fontFamily} onValueChange={setFontFamily}>
                      <SelectTrigger className="border-slate-300 focus:border-blue-500">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Font Color</Label>
                    <div className="flex gap-3 items-center">
                      <Input
                        type="color"
                        value={fontColor}
                        onChange={(e) => setFontColor(e.target.value)}
                        className="w-16 h-12 p-1 border-slate-300"
                      />
                      <Input
                        type="text"
                        value={fontColor}
                        onChange={(e) => setFontColor(e.target.value)}
                        placeholder="#ffffff"
                        className="flex-1 border-slate-300 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-medium">Opacity</Label>
                    <Slider
                      value={opacity}
                      onValueChange={setOpacity}
                      max={100}
                      min={10}
                      step={5}
                      className="w-full"
                    />
                    <div className="text-sm text-center text-slate-500 bg-slate-100 px-3 py-1 rounded">{opacity[0]}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Position & Effects (only show when not tiled) */}
            {!isTiled && (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Settings className="h-5 w-5 text-orange-600" />
                    </div>
                    Position & Effects
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Fine-tune watermark placement and visual effects
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Position</Label>
                    <Select value={position} onValueChange={setPosition}>
                      <SelectTrigger className="border-slate-300 focus:border-blue-500">
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

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">X Offset</Label>
                      <Slider
                        value={offsetX}
                        onValueChange={setOffsetX}
                        max={200}
                        min={0}
                        step={5}
                        className="w-full"
                      />
                      <div className="text-xs text-center text-slate-500 bg-slate-100 px-2 py-1 rounded">{offsetX[0]}px</div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Y Offset</Label>
                      <Slider
                        value={offsetY}
                        onValueChange={setOffsetY}
                        max={200}
                        min={0}
                        step={5}
                        className="w-full"
                      />
                      <div className="text-xs text-center text-slate-500 bg-slate-100 px-2 py-1 rounded">{offsetY[0]}px</div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Rotation</Label>
                      <Slider
                        value={rotation}
                        onValueChange={setRotation}
                        max={360}
                        min={-360}
                        step={5}
                        className="w-full"
                      />
                      <div className="text-xs text-center text-slate-500 bg-slate-100 px-2 py-1 rounded">{rotation[0]}°</div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-900">Visual Effects</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Shadow Blur</Label>
                        <Slider
                          value={shadowBlur}
                          onValueChange={setShadowBlur}
                          max={20}
                          min={0}
                          step={1}
                          className="w-full"
                        />
                        <div className="text-xs text-center text-slate-500 bg-slate-100 px-2 py-1 rounded">{shadowBlur[0]}px</div>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Shadow Color</Label>
                        <Input
                          type="color"
                          value={shadowColor}
                          onChange={(e) => setShadowColor(e.target.value)}
                          className="w-full h-12 p-1 border-slate-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Stroke Width</Label>
                        <Slider
                          value={strokeWidth}
                          onValueChange={setStrokeWidth}
                          max={10}
                          min={0}
                          step={1}
                          className="w-full"
                        />
                        <div className="text-xs text-center text-slate-500 bg-slate-100 px-2 py-1 rounded">{strokeWidth[0]}px</div>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Stroke Color</Label>
                        <Input
                          type="color"
                          value={strokeColor}
                          onChange={(e) => setStrokeColor(e.target.value)}
                          className="w-full h-12 p-1 border-slate-300"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button 
                onClick={applyWatermark} 
                className="flex-1 h-14 text-lg bg-blue-600 hover:bg-blue-700 shadow-lg"
                size="lg"
              >
                <Palette className="h-5 w-5 mr-2" />
                Apply Watermark
              </Button>
              <Button 
                onClick={resetSettings} 
                variant="outline" 
                className="h-14 px-8 border-slate-300 hover:bg-slate-50"
                size="lg"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Reset
              </Button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-4">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm sticky top-6">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Eye className="h-5 w-5 text-indigo-600" />
                  </div>
                  Live Preview
                </CardTitle>
                <CardDescription className="text-slate-600">
                  See your watermarked image in real-time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {originalImage && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-slate-700">Original Image</Label>
                    <div className="relative border-2 border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <img
                        src={originalImage}
                        alt="Original"
                        className="w-full h-auto max-h-48 object-contain"
                      />
                      <Badge className="absolute top-2 left-2 bg-slate-900/80 text-white">
                        Original
                      </Badge>
                    </div>
                  </div>
                )}

                {watermarkedImage && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-slate-700">Watermarked Result</Label>
                    <div className="relative border-2 border-green-200 rounded-lg overflow-hidden bg-slate-50">
                      <img
                        src={watermarkedImage}
                        alt="Watermarked"
                        className="w-full h-auto max-h-48 object-contain"
                      />
                      <Badge className="absolute top-2 left-2 bg-green-600 text-white">
                        Watermarked
                      </Badge>
                    </div>
                    <Button 
                      onClick={downloadImage} 
                      className="w-full h-12 bg-green-600 hover:bg-green-700 shadow-md" 
                      size="lg"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Image
                    </Button>
                  </div>
                )}

                {!originalImage && (
                  <div className="text-center py-16 px-4">
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
                        <ImageIcon className="h-10 w-10 text-slate-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-2">No Image Selected</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">
                          Upload an image above to start creating your professional watermark
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default ImageWatermarker;
