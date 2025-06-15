
import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Upload, Download, RotateCcw, Type, Image as ImageIcon, Grid2X2, AlignLeft } from 'lucide-react';
import { toast } from 'sonner';

const ImageWatermarker = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [watermarkedImage, setWatermarkedImage] = useState<string | null>(null);
  const [watermarkText, setWatermarkText] = useState('Watermark');
  const [fontSize, setFontSize] = useState([24]);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontColor, setFontColor] = useState('#ffffff');
  const [opacity, setOpacity] = useState([70]);
  const [position, setPosition] = useState('bottom-right');
  const [rotation, setRotation] = useState([0]);
  const [offsetX, setOffsetX] = useState([20]);
  const [offsetY, setOffsetY] = useState([20]);
  const [shadowBlur, setShadowBlur] = useState([2]);
  const [shadowColor, setShadowColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState([0]);
  const [strokeColor, setStrokeColor] = useState('#000000');
  
  // Tiled watermark settings
  const [isTiled, setIsTiled] = useState(false);
  const [tileSpacingX, setTileSpacingX] = useState([100]);
  const [tileSpacingY, setTileSpacingY] = useState([100]);
  const [tileRotation, setTileRotation] = useState([-45]);
  
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
      const watermarkedDataURL = canvas.toDataURL('image/png');
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
    link.download = 'watermarked-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Image downloaded successfully!');
  }, [watermarkedImage]);

  const resetSettings = () => {
    setWatermarkText('Watermark');
    setFontSize([24]);
    setFontFamily('Arial');
    setFontColor('#ffffff');
    setOpacity([70]);
    setPosition('bottom-right');
    setRotation([0]);
    setOffsetX([20]);
    setOffsetY([20]);
    setShadowBlur([2]);
    setShadowColor('#000000');
    setStrokeWidth([0]);
    setStrokeColor('#000000');
    setIsTiled(false);
    setTileSpacingX([100]);
    setTileSpacingY([100]);
    setTileRotation([-45]);
    toast.success('Settings reset to default');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Image Watermarker</h1>
        <p className="text-muted-foreground">Add custom text watermarks to your images with advanced styling and tiling options</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="xl:col-span-2 space-y-6">
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
                className="w-full h-24 border-dashed"
              >
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon className="h-8 w-8" />
                  <span>Choose Image or Drag & Drop</span>
                </div>
              </Button>
            </CardContent>
          </Card>

          {/* Watermark Mode */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Grid2X2 className="h-5 w-5" />
                Watermark Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Tiled Watermark</Label>
                  <p className="text-sm text-muted-foreground">Apply watermark across entire image</p>
                </div>
                <Switch checked={isTiled} onCheckedChange={setIsTiled} />
              </div>

              {isTiled && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="space-y-2">
                    <Label>Horizontal Spacing</Label>
                    <Slider
                      value={tileSpacingX}
                      onValueChange={setTileSpacingX}
                      max={300}
                      min={50}
                      step={10}
                    />
                    <div className="text-xs text-muted-foreground text-center">{tileSpacingX[0]}px</div>
                  </div>
                  <div className="space-y-2">
                    <Label>Vertical Spacing</Label>
                    <Slider
                      value={tileSpacingY}
                      onValueChange={setTileSpacingY}
                      max={300}
                      min={50}
                      step={10}
                    />
                    <div className="text-xs text-muted-foreground text-center">{tileSpacingY[0]}px</div>
                  </div>
                  <div className="space-y-2">
                    <Label>Tile Rotation</Label>
                    <Slider
                      value={tileRotation}
                      onValueChange={setTileRotation}
                      max={90}
                      min={-90}
                      step={5}
                    />
                    <div className="text-xs text-muted-foreground text-center">{tileRotation[0]}°</div>
                  </div>
                </div>
              )}
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
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="watermark-text">Watermark Text</Label>
                <Textarea
                  id="watermark-text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="Enter your watermark text"
                  rows={2}
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Font Size</Label>
                  <Slider
                    value={fontSize}
                    onValueChange={setFontSize}
                    max={100}
                    min={8}
                    step={1}
                  />
                  <div className="text-xs text-muted-foreground text-center">{fontSize[0]}px</div>
                </div>

                <div>
                  <Label>Font Family</Label>
                  <Select value={fontFamily} onValueChange={setFontFamily}>
                    <SelectTrigger className="mt-2">
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
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Font Color</Label>
                  <div className="flex gap-2 items-center mt-2">
                    <Input
                      type="color"
                      value={fontColor}
                      onChange={(e) => setFontColor(e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      type="text"
                      value={fontColor}
                      onChange={(e) => setFontColor(e.target.value)}
                      placeholder="#ffffff"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Opacity</Label>
                  <Slider
                    value={opacity}
                    onValueChange={setOpacity}
                    max={100}
                    min={10}
                    step={5}
                  />
                  <div className="text-xs text-muted-foreground text-center">{opacity[0]}%</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Position & Effects (only show when not tiled) */}
          {!isTiled && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlignLeft className="h-5 w-5" />
                  Position & Effects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Position</Label>
                  <Select value={position} onValueChange={setPosition}>
                    <SelectTrigger className="mt-2">
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Offset X</Label>
                    <Slider
                      value={offsetX}
                      onValueChange={setOffsetX}
                      max={100}
                      min={0}
                      step={1}
                    />
                    <div className="text-xs text-muted-foreground text-center">{offsetX[0]}px</div>
                  </div>
                  <div className="space-y-2">
                    <Label>Offset Y</Label>
                    <Slider
                      value={offsetY}
                      onValueChange={setOffsetY}
                      max={100}
                      min={0}
                      step={1}
                    />
                    <div className="text-xs text-muted-foreground text-center">{offsetY[0]}px</div>
                  </div>
                  <div className="space-y-2">
                    <Label>Rotation</Label>
                    <Slider
                      value={rotation}
                      onValueChange={setRotation}
                      max={360}
                      min={-360}
                      step={5}
                    />
                    <div className="text-xs text-muted-foreground text-center">{rotation[0]}°</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Shadow Blur</Label>
                    <Slider
                      value={shadowBlur}
                      onValueChange={setShadowBlur}
                      max={20}
                      min={0}
                      step={1}
                    />
                    <div className="text-xs text-muted-foreground text-center">{shadowBlur[0]}px</div>
                  </div>
                  <div>
                    <Label>Shadow Color</Label>
                    <Input
                      type="color"
                      value={shadowColor}
                      onChange={(e) => setShadowColor(e.target.value)}
                      className="mt-2 w-full h-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Stroke Width</Label>
                    <Slider
                      value={strokeWidth}
                      onValueChange={setStrokeWidth}
                      max={10}
                      min={0}
                      step={1}
                    />
                    <div className="text-xs text-muted-foreground text-center">{strokeWidth[0]}px</div>
                  </div>
                  <div>
                    <Label>Stroke Color</Label>
                    <Input
                      type="color"
                      value={strokeColor}
                      onChange={(e) => setStrokeColor(e.target.value)}
                      className="mt-2 w-full h-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button onClick={applyWatermark} className="flex-1" size="lg">
              Apply Watermark
            </Button>
            <Button onClick={resetSettings} variant="outline" size="lg">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Live preview of your watermarked image</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {originalImage && (
                <div>
                  <Label className="text-sm font-medium">Original Image</Label>
                  <div className="mt-2 border rounded-lg overflow-hidden bg-muted/20">
                    <img
                      src={originalImage}
                      alt="Original"
                      className="w-full h-auto max-h-48 object-contain"
                    />
                  </div>
                </div>
              )}

              {watermarkedImage && (
                <div>
                  <Label className="text-sm font-medium">Watermarked Image</Label>
                  <div className="mt-2 border rounded-lg overflow-hidden bg-muted/20">
                    <img
                      src={watermarkedImage}
                      alt="Watermarked"
                      className="w-full h-auto max-h-48 object-contain"
                    />
                  </div>
                  <Button onClick={downloadImage} className="w-full mt-4" size="lg">
                    <Download className="h-4 w-4 mr-2" />
                    Download Image
                  </Button>
                </div>
              )}

              {!originalImage && (
                <div className="text-center py-16 text-muted-foreground">
                  <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <h3 className="font-medium mb-1">No Image Selected</h3>
                  <p className="text-sm">Upload an image to start watermarking</p>
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
