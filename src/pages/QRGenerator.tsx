
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QrCode, ArrowLeft, Download, Upload, Palette, Frame, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";

const QRGenerator = () => {
  const [inputText, setInputText] = useState("https://example.com");
  const [qrColor, setQrColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [size, setSize] = useState([256]);
  const [errorLevel, setErrorLevel] = useState("M");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [frameStyle, setFrameStyle] = useState("none");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-generate QR code when inputs change
  useEffect(() => {
    if (inputText) {
      generateQRCode();
    }
  }, [inputText, qrColor, bgColor, size, errorLevel, logoFile, frameStyle]);

  const generateQRCode = async () => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const qrSize = size[0];
      const padding = frameStyle !== "none" ? 40 : 20;
      const totalSize = qrSize + padding * 2;

      canvas.width = totalSize;
      canvas.height = totalSize;

      // Clear canvas
      ctx.fillStyle = frameStyle !== "none" ? "#f8f9fa" : bgColor;
      ctx.fillRect(0, 0, totalSize, totalSize);

      // Draw frame if selected
      if (frameStyle !== "none") {
        drawFrame(ctx, totalSize, frameStyle);
      }

      // Generate QR code
      const qrCanvas = document.createElement("canvas");
      await QRCode.toCanvas(qrCanvas, inputText, {
        width: qrSize,
        color: {
          dark: qrColor,
          light: bgColor,
        },
        errorCorrectionLevel: errorLevel as any,
        margin: 0,
      });

      // Draw QR code on main canvas
      ctx.drawImage(qrCanvas, padding, padding, qrSize, qrSize);

      // Add logo if uploaded
      if (logoFile && logoPreview) {
        await addLogo(ctx, padding, qrSize);
      }

      // Convert to data URL
      const dataUrl = canvas.toDataURL("image/png");
      setQrDataUrl(dataUrl);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const drawFrame = (ctx: CanvasRenderingContext2D, size: number, style: string) => {
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 2;

    switch (style) {
      case "rounded":
        ctx.beginPath();
        ctx.roundRect(10, 10, size - 20, size - 20, 15);
        ctx.stroke();
        break;
      case "square":
        ctx.strokeRect(10, 10, size - 20, size - 20);
        break;
      case "circle":
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 15, 0, 2 * Math.PI);
        ctx.stroke();
        break;
    }
  };

  const addLogo = async (ctx: CanvasRenderingContext2D, padding: number, qrSize: number) => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const logoSize = Math.min(qrSize * 0.2, 50);
        const logoX = padding + (qrSize - logoSize) / 2;
        const logoY = padding + (qrSize - logoSize) / 2;

        // Draw white background circle for logo
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2 + 5, 0, 2 * Math.PI);
        ctx.fill();

        // Draw logo
        ctx.drawImage(img, logoX, logoY, logoSize, logoSize);
        resolve();
      };
      img.src = logoPreview;
    });
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadQR = () => {
    if (qrDataUrl) {
      const link = document.createElement("a");
      link.download = "qr-code.png";
      link.href = qrDataUrl;
      link.click();
    }
  };

  const clearLogo = () => {
    setLogoFile(null);
    setLogoPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tools
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <QrCode className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Professional QR Code Generator</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Create Professional QR Codes with Custom Branding</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Generate high-quality, customizable QR codes with logos, custom colors, frames, and more. 
              Perfect for business cards, marketing materials, or any professional application. 
              Real-time preview and instant download.
            </p>
          </div>

          {/* Main Tool */}
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Controls Section */}
            <div className="space-y-6">
              
              {/* Content Input */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Content & Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="qr-input">Text or URL</Label>
                    <Input
                      id="qr-input"
                      placeholder="https://example.com or any text..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Size</Label>
                      <div className="mt-2">
                        <Slider
                          value={size}
                          onValueChange={setSize}
                          max={512}
                          min={128}
                          step={32}
                          className="w-full"
                        />
                        <p className="text-sm text-muted-foreground mt-1">{size[0]}px</p>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Error Correction</Label>
                      <Select value={errorLevel} onValueChange={setErrorLevel}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="L">Low (7%)</SelectItem>
                          <SelectItem value="M">Medium (15%)</SelectItem>
                          <SelectItem value="Q">Quartile (25%)</SelectItem>
                          <SelectItem value="H">High (30%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Styling Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Colors & Style
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>QR Color</Label>
                      <div className="flex gap-2 mt-1">
                        <input
                          type="color"
                          value={qrColor}
                          onChange={(e) => setQrColor(e.target.value)}
                          className="w-12 h-10 rounded border cursor-pointer"
                        />
                        <Input
                          value={qrColor}
                          onChange={(e) => setQrColor(e.target.value)}
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Background Color</Label>
                      <div className="flex gap-2 mt-1">
                        <input
                          type="color"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="w-12 h-10 rounded border cursor-pointer"
                        />
                        <Input
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Frame Style</Label>
                    <Select value={frameStyle} onValueChange={setFrameStyle}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Frame</SelectItem>
                        <SelectItem value="square">Square Frame</SelectItem>
                        <SelectItem value="rounded">Rounded Frame</SelectItem>
                        <SelectItem value="circle">Circle Frame</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Logo Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Frame className="h-5 w-5" />
                    Logo & Branding
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Upload Logo (Optional)</Label>
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Logo
                      </Button>
                      {logoFile && (
                        <Button variant="outline" onClick={clearLogo}>
                          Clear
                        </Button>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    {logoFile && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Logo: {logoFile.name}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Preview Section */}
            <Card className="lg:sticky lg:top-8">
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>
                  Your QR code updates automatically as you make changes
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="bg-muted rounded-lg p-8 mb-4">
                  <canvas
                    ref={canvasRef}
                    className="max-w-full h-auto mx-auto rounded-lg border bg-white"
                    style={{ maxWidth: "300px" }}
                  />
                </div>
                
                <div className="space-y-3">
                  <Button onClick={downloadQR} disabled={!qrDataUrl} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download PNG
                  </Button>
                  
                  <div className="text-sm text-muted-foreground">
                    <p>High resolution • Transparent background support</p>
                    <p>Perfect for print and digital use</p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Use Cases */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-8">Popular Use Cases</h2>
            <div className="grid md:grid-cols-3 gap-6">
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Website Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Perfect for marketing materials, business cards, or anywhere you want people to quickly visit your website.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Wi-Fi Sharing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Create QR codes for Wi-Fi passwords so guests can connect instantly without typing complex passwords.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Share your contact details as a vCard that people can scan and save directly to their phone contacts.
                  </p>
                </CardContent>
              </Card>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default QRGenerator;
