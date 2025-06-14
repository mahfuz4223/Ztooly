
import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  ImageIcon, 
  Upload, 
  Download, 
  Smartphone, 
  Monitor, 
  Tablet,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  X,
  RotateCcw,
  Crop,
  Settings,
  Zap,
  ArrowLeft,
  Eye,
  FileImage,
  Maximize2
} from "lucide-react";
import { Link } from "react-router-dom";

interface ProcessedImage {
  url: string;
  width: number;
  height: number;
  size: number;
  format: string;
}

const ImageResizer = () => {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string>('');
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [customWidth, setCustomWidth] = useState<number>(800);
  const [customHeight, setCustomHeight] = useState<number>(600);
  const [quality, setQuality] = useState<number[]>([90]);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [outputFormat, setOutputFormat] = useState<string>('original');
  const [originalDimensions, setOriginalDimensions] = useState<{width: number, height: number} | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const presets = [
    { id: 'instagram-square', name: 'Instagram Square', width: 1080, height: 1080, icon: Instagram },
    { id: 'instagram-story', name: 'Instagram Story', width: 1080, height: 1920, icon: Instagram },
    { id: 'facebook-cover', name: 'Facebook Cover', width: 1200, height: 630, icon: Facebook },
    { id: 'youtube-thumbnail', name: 'YouTube Thumbnail', width: 1280, height: 720, icon: Youtube },
    { id: 'linkedin-post', name: 'LinkedIn Post', width: 1200, height: 627, icon: Linkedin },
    { id: 'twitter-post', name: 'Twitter Post', width: 1200, height: 675, icon: X },
    { id: 'mobile', name: 'Mobile (375x667)', width: 375, height: 667, icon: Smartphone },
    { id: 'tablet', name: 'Tablet (768x1024)', width: 768, height: 1024, icon: Tablet },
    { id: 'desktop', name: 'Desktop (1920x1080)', width: 1920, height: 1080, icon: Monitor },
  ];

  const demoImages = [
    { name: 'Nature Photo', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600', size: '2.1 MB' },
    { name: 'City View', url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600', size: '1.8 MB' },
    { name: 'Portrait', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800', size: '1.5 MB' },
  ];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, GIF, WebP)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 50MB",
        variant: "destructive",
      });
      return;
    }

    setOriginalImage(file);
    const url = URL.createObjectURL(file);
    setOriginalImageUrl(url);
    
    // Get original dimensions
    const img = new Image();
    img.onload = () => {
      setOriginalDimensions({ width: img.width, height: img.height });
      setCustomWidth(img.width);
      setCustomHeight(img.height);
    };
    img.src = url;
    
    setProcessedImages([]);
    setSelectedPreset('');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handlePresetSelect = (preset: typeof presets[0]) => {
    setSelectedPreset(preset.id);
    setCustomWidth(preset.width);
    if (maintainAspectRatio && originalDimensions) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      setCustomHeight(Math.round(preset.width / aspectRatio));
    } else {
      setCustomHeight(preset.height);
    }
  };

  const handleDimensionChange = (dimension: 'width' | 'height', value: number) => {
    if (dimension === 'width') {
      setCustomWidth(value);
      if (maintainAspectRatio && originalDimensions) {
        const aspectRatio = originalDimensions.width / originalDimensions.height;
        setCustomHeight(Math.round(value / aspectRatio));
      }
    } else {
      setCustomHeight(value);
      if (maintainAspectRatio && originalDimensions) {
        const aspectRatio = originalDimensions.width / originalDimensions.height;
        setCustomWidth(Math.round(value * aspectRatio));
      }
    }
    setSelectedPreset('');
  };

  const resizeImage = async () => {
    if (!originalImage) return;

    setIsProcessing(true);
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = customWidth;
        canvas.height = customHeight;
        
        if (ctx) {
          // Enable image smoothing for better quality
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          ctx.drawImage(img, 0, 0, customWidth, customHeight);
          
          const format = outputFormat === 'original' ? originalImage.type : `image/${outputFormat}`;
          const qualityValue = quality[0] / 100;
          
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const processedImage: ProcessedImage = {
                url,
                width: customWidth,
                height: customHeight,
                size: blob.size,
                format: format.split('/')[1].toUpperCase(),
              };
              
              setProcessedImages([processedImage]);
              setIsProcessing(false);
              
              toast({
                title: "Image resized successfully!",
                description: `New size: ${customWidth}x${customHeight} (${(blob.size / 1024 / 1024).toFixed(2)} MB)`,
              });
            }
          }, format, qualityValue);
        }
      };
      
      img.src = originalImageUrl;
    } catch (error) {
      console.error('Error resizing image:', error);
      toast({
        title: "Error",
        description: "Failed to resize image. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const downloadImage = (processedImage: ProcessedImage) => {
    const link = document.createElement('a');
    link.href = processedImage.url;
    link.download = `resized-${customWidth}x${customHeight}.${processedImage.format.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: "Your resized image is being downloaded.",
    });
  };

  const reset = () => {
    setOriginalImage(null);
    setOriginalImageUrl('');
    setProcessedImages([]);
    setSelectedPreset('');
    setCustomWidth(800);
    setCustomHeight(600);
    setOriginalDimensions(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Tools</span>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Smart Image Resizer</h1>
                  <p className="text-sm text-muted-foreground">Resize images for any platform or device</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {!originalImage ? (
          <div className="max-w-4xl mx-auto">
            {/* Upload Section */}
            <Card className="mb-8">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl mb-2">Upload Your Image</CardTitle>
                <CardDescription className="text-lg">
                  Drag and drop an image or click to browse. Supports JPG, PNG, GIF, and WebP formats.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer ${
                    dragActive
                      ? "border-primary bg-primary/5 scale-105"
                      : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                      <Upload className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <p className="text-xl font-semibold mb-2">Drop your image here</p>
                      <p className="text-muted-foreground">or click to browse files</p>
                    </div>
                    <Button size="lg" className="mt-4">
                      <Upload className="h-5 w-5 mr-2" />
                      Choose Image
                    </Button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Demo Images */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Try with Demo Images
                </CardTitle>
                <CardDescription>
                  Click on any demo image below to see how the resizer works
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {demoImages.map((demo, index) => (
                    <div
                      key={index}
                      className="relative group cursor-pointer rounded-lg overflow-hidden border hover:shadow-lg transition-all duration-300"
                      onClick={async () => {
                        try {
                          const response = await fetch(demo.url);
                          const blob = await response.blob();
                          const file = new File([blob], `demo-${index + 1}.jpg`, { type: 'image/jpeg' });
                          handleFile(file);
                        } catch (error) {
                          toast({
                            title: "Error loading demo image",
                            description: "Please try uploading your own image instead.",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      <img
                        src={demo.url}
                        alt={demo.name}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <p className="text-white font-medium">{demo.name}</p>
                        <p className="text-white/70 text-sm">{demo.size}</p>
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                          <FileImage className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Controls */}
              <div className="lg:col-span-1 space-y-6">
                {/* Original Image Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileImage className="h-5 w-5" />
                      Original Image
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {originalDimensions && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Dimensions:</span>
                          <span className="font-medium">{originalDimensions.width} × {originalDimensions.height}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">File size:</span>
                          <span className="font-medium">{formatFileSize(originalImage.size)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Format:</span>
                          <span className="font-medium">{originalImage.type.split('/')[1].toUpperCase()}</span>
                        </div>
                      </>
                    )}
                    <Button onClick={reset} variant="outline" className="w-full">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Choose Different Image
                    </Button>
                  </CardContent>
                </Card>

                {/* Presets */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Quick Presets
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-2">
                      {presets.map((preset) => {
                        const Icon = preset.icon;
                        return (
                          <Button
                            key={preset.id}
                            variant={selectedPreset === preset.id ? "default" : "outline"}
                            className="justify-start h-auto p-3"
                            onClick={() => handlePresetSelect(preset)}
                          >
                            <Icon className="h-4 w-4 mr-3" />
                            <div className="text-left">
                              <div className="font-medium">{preset.name}</div>
                              <div className="text-xs text-muted-foreground">{preset.width} × {preset.height}</div>
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Custom Dimensions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crop className="h-5 w-5" />
                      Custom Dimensions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="aspect-ratio"
                        checked={maintainAspectRatio}
                        onCheckedChange={setMaintainAspectRatio}
                      />
                      <Label htmlFor="aspect-ratio">Lock aspect ratio</Label>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="width">Width</Label>
                        <Input
                          id="width"
                          type="number"
                          value={customWidth}
                          onChange={(e) => handleDimensionChange('width', parseInt(e.target.value) || 0)}
                          min="1"
                          max="10000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="height">Height</Label>
                        <Input
                          id="height"
                          type="number"
                          value={customHeight}
                          onChange={(e) => handleDimensionChange('height', parseInt(e.target.value) || 0)}
                          min="1"
                          max="10000"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Advanced Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Advanced Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Quality: {quality[0]}%</Label>
                      <Slider
                        value={quality}
                        onValueChange={setQuality}
                        max={100}
                        min={1}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="format">Output Format</Label>
                      <select
                        id="format"
                        value={outputFormat}
                        onChange={(e) => setOutputFormat(e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
                      >
                        <option value="original">Same as original</option>
                        <option value="jpeg">JPEG</option>
                        <option value="png">PNG</option>
                        <option value="webp">WebP</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                {/* Resize Button */}
                <Button
                  onClick={resizeImage}
                  disabled={isProcessing || !originalImage}
                  size="lg"
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Maximize2 className="h-5 w-5 mr-2" />
                      Resize Image
                    </>
                  )}
                </Button>
              </div>

              {/* Right Column - Preview */}
              <div className="lg:col-span-2 space-y-6">
                {/* Original Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Original Image</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg overflow-hidden bg-muted/30">
                      <img
                        src={originalImageUrl}
                        alt="Original"
                        className="w-full h-auto max-h-96 object-contain"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Processed Results */}
                {processedImages.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        Resized Image
                        <Button
                          onClick={() => downloadImage(processedImages[0])}
                          size="sm"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border rounded-lg overflow-hidden bg-muted/30">
                          <img
                            src={processedImages[0].url}
                            alt="Resized"
                            className="w-full h-auto max-h-96 object-contain"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                          <div className="bg-muted/50 rounded-lg p-3">
                            <div className="text-sm text-muted-foreground">Dimensions</div>
                            <div className="font-semibold">{processedImages[0].width} × {processedImages[0].height}</div>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-3">
                            <div className="text-sm text-muted-foreground">File Size</div>
                            <div className="font-semibold">{formatFileSize(processedImages[0].size)}</div>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-3">
                            <div className="text-sm text-muted-foreground">Format</div>
                            <div className="font-semibold">{processedImages[0].format}</div>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-3">
                            <div className="text-sm text-muted-foreground">Compression</div>
                            <div className="font-semibold">
                              {((1 - processedImages[0].size / originalImage.size) * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageResizer;
