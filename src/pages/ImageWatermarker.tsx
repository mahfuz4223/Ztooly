import React, { useState, useRef, useCallback, useEffect } from 'react';
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
import { useImageToolAnalytics } from '@/utils/analyticsHelper';
import { UsageStats } from '@/components/UsageStats';

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
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Tiled watermark settings
  const [isTiled, setIsTiled] = useState(false);
  const [tileSpacingX, setTileSpacingX] = useState([150]);
  const [tileSpacingY, setTileSpacingY] = useState([120]);
  const [tileRotation, setTileRotation] = useState([-35]);
    const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize analytics
  const analytics = useImageToolAnalytics('image-watermarker', 'Image Watermarker');

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      if (originalImage && originalImage.startsWith('data:')) {
        URL.revokeObjectURL(originalImage);
      }
      if (watermarkedImage && watermarkedImage.startsWith('blob:')) {
        URL.revokeObjectURL(watermarkedImage);
      }
    };
  }, [originalImage, watermarkedImage]);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file (PNG, JPG, JPEG, WebP)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image file is too large. Please select a file smaller than 10MB');
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        if (!result) {
          toast.error('Failed to read the image file');
          return;
        }
          setOriginalImage(result);
        setWatermarkedImage(null);
        
        // Track image upload
        analytics.trackUpload();
        
        toast.success('Image uploaded successfully!');
      } catch (error) {
        console.error('Error reading file:', error);
        toast.error('Failed to process the image file');
      }
    };

    reader.onerror = () => {
      toast.error('Error reading the image file');
    };

    reader.readAsDataURL(file);
    
    // Reset input to allow same file selection
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [analytics]);

  const getPositionCoordinates = (imgWidth: number, imgHeight: number, textWidth: number, textHeight: number) => {
    const offsetXNum = Math.max(0, Math.min(offsetX[0], imgWidth - textWidth));
    const offsetYNum = Math.max(0, Math.min(offsetY[0], imgHeight));

    switch (position) {
      case 'top-left':
        return { x: offsetXNum, y: offsetYNum + textHeight };
      case 'top-center':
        return { x: Math.max(0, imgWidth / 2 - textWidth / 2), y: offsetYNum + textHeight };
      case 'top-right':
        return { x: Math.max(0, imgWidth - textWidth - offsetXNum), y: offsetYNum + textHeight };
      case 'center-left':
        return { x: offsetXNum, y: imgHeight / 2 };
      case 'center':
        return { x: Math.max(0, imgWidth / 2 - textWidth / 2), y: imgHeight / 2 };
      case 'center-right':
        return { x: Math.max(0, imgWidth - textWidth - offsetXNum), y: imgHeight / 2 };
      case 'bottom-left':
        return { x: offsetXNum, y: Math.max(textHeight, imgHeight - offsetYNum) };
      case 'bottom-center':
        return { x: Math.max(0, imgWidth / 2 - textWidth / 2), y: Math.max(textHeight, imgHeight - offsetYNum) };
      case 'bottom-right':
      default:
        return { x: Math.max(0, imgWidth - textWidth - offsetXNum), y: Math.max(textHeight, imgHeight - offsetYNum) };
    }
  };

  const drawWatermarkText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, rotation: number) => {
    try {
      ctx.save();

      // Validate and set font
      const validFontSize = Math.max(8, Math.min(fontSize[0], 200));
      ctx.font = `${validFontSize}px ${fontFamily}`;
      
      // Validate and set color
      const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      ctx.fillStyle = colorRegex.test(fontColor) ? fontColor : '#ffffff';
      
      // Validate and set opacity
      const validOpacity = Math.max(0.1, Math.min(opacity[0] / 100, 1));
      ctx.globalAlpha = validOpacity;

      // Configure shadow effects
      if (shadowBlur[0] > 0) {
        ctx.shadowColor = colorRegex.test(shadowColor) ? shadowColor : '#000000';
        ctx.shadowBlur = Math.max(0, Math.min(shadowBlur[0], 50));
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
      }

      // Configure stroke
      if (strokeWidth[0] > 0) {
        ctx.strokeStyle = colorRegex.test(strokeColor) ? strokeColor : '#000000';
        ctx.lineWidth = Math.max(0, Math.min(strokeWidth[0], 20));
      }

      // Apply rotation with proper bounds checking
      const validRotation = ((rotation % 360) + 360) % 360;
      if (validRotation !== 0) {
        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width;
        const textHeight = validFontSize;
        
        // Ensure rotation center is within bounds
        const centerX = Math.max(0, Math.min(x + textWidth / 2, ctx.canvas.width));
        const centerY = Math.max(0, Math.min(y - textHeight / 2, ctx.canvas.height));
        
        ctx.translate(centerX, centerY);
        ctx.rotate((validRotation * Math.PI) / 180);
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
    } catch (error) {
      console.error('Error drawing watermark text:', error);
      toast.error('Failed to draw watermark text');
    }
  };

  const applyWatermark = useCallback(() => {
    // Validate inputs
    if (!originalImage) {
      toast.error('Please upload an image first');
      return;
    }

    if (!watermarkText.trim()) {
      toast.error('Please enter watermark text');
      return;
    }

    if (watermarkText.trim().length > 100) {
      toast.error('Watermark text is too long (max 100 characters)');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      toast.error('Canvas not available');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      toast.error('Cannot get canvas context');
      return;
    }

    setIsProcessing(true);
    
    // Track watermark processing start
    analytics.trackProcess();

    const img = new Image();
    
    img.onload = () => {
      try {
        // Validate image dimensions
        if (img.width <= 0 || img.height <= 0) {
          throw new Error('Invalid image dimensions');
        }

        // Set canvas size with reasonable limits
        const maxDimension = 4096;
        const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
        
        canvas.width = Math.floor(img.width * scale);
        canvas.height = Math.floor(img.height * scale);

        // Clear canvas and draw image
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Measure text for positioning
        const validFontSize = Math.max(8, Math.min(fontSize[0] * scale, 200));
        ctx.font = `${validFontSize}px ${fontFamily}`;
        const textMetrics = ctx.measureText(watermarkText.trim());
        const textWidth = textMetrics.width;
        const textHeight = validFontSize;

        if (isTiled) {
          // Apply tiled watermark pattern
          const spacingX = Math.max(50, tileSpacingX[0] * scale);
          const spacingY = Math.max(50, tileSpacingY[0] * scale);
          const tileRot = tileRotation[0];

          for (let x = 0; x < canvas.width + spacingX; x += spacingX) {
            for (let y = textHeight; y < canvas.height + spacingY; y += spacingY) {
              // Ensure position is within canvas bounds
              if (x < canvas.width && y < canvas.height) {
                drawWatermarkText(ctx, watermarkText.trim(), x, y, tileRot);
              }
            }
          }
        } else {
          // Apply single watermark
          const { x, y } = getPositionCoordinates(canvas.width, canvas.height, textWidth, textHeight);
          drawWatermarkText(ctx, watermarkText.trim(), x, y, rotation[0]);
        }

        // Convert to data URL with error handling
        try {
          const watermarkedDataURL = canvas.toDataURL('image/png', 0.95);
          if (!watermarkedDataURL || watermarkedDataURL === 'data:,') {
            throw new Error('Failed to generate watermarked image');
          }
            setWatermarkedImage(watermarkedDataURL);
          
          // Track successful watermark generation
          analytics.trackGenerate();
          
          toast.success('Watermark applied successfully!');
        } catch (canvasError) {
          console.error('Canvas toDataURL error:', canvasError);
          toast.error('Failed to generate watermarked image');
        }
      } catch (error) {
        console.error('Error applying watermark:', error);
        toast.error('Failed to apply watermark. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    };

    img.onerror = () => {
      console.error('Failed to load image');
      toast.error('Failed to load the image. Please try uploading again.');
      setIsProcessing(false);
    };

    img.src = originalImage;
  }, [originalImage, watermarkText, fontSize, fontFamily, fontColor, opacity, position, rotation, offsetX, offsetY, shadowBlur, shadowColor, strokeWidth, strokeColor, isTiled, tileSpacingX, tileSpacingY, tileRotation]);

  const downloadImage = useCallback(() => {
    if (!watermarkedImage) {
      toast.error('No watermarked image to download');
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = watermarkedImage;
      link.download = `watermarked-${Date.now()}.png`;      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Track download action
      analytics.trackDownload();
      
      toast.success('Image downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download image');
    }
  }, [watermarkedImage, analytics]);

  const resetSettings = () => {
    try {
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
    } catch (error) {
      console.error('Reset error:', error);
      toast.error('Failed to reset settings');
    }
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
                  Select a high-quality image to add your professional watermark (max 10MB)
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
                        PNG, JPG, JPEG, WebP supported
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
                    maxLength={100}
                    className="resize-none border-slate-300 focus:border-blue-500"
                  />
                  <div className="text-xs text-slate-500 text-right">
                    {watermarkText.length}/100 characters
                  </div>
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
                        pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
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
                disabled={isProcessing || !originalImage || !watermarkText.trim()}
                className="flex-1 h-14 text-lg bg-blue-600 hover:bg-blue-700 shadow-lg disabled:opacity-50"
                size="lg"
              >
                <Palette className="h-5 w-5 mr-2" />
                {isProcessing ? 'Processing...' : 'Apply Watermark'}
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
                        onError={() => {
                          console.error('Failed to display original image');
                          toast.error('Failed to display original image');
                        }}
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
                        onError={() => {
                          console.error('Failed to display watermarked image');
                          toast.error('Failed to display watermarked image');
                        }}
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
        </div>        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Usage Statistics */}
        <UsageStats toolId="image-watermarker" />
      </div>
    </div>
  );
};

export default ImageWatermarker;
