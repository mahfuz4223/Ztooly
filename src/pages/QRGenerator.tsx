import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QrCode, ArrowLeft, Download, Upload, Palette, Frame, Settings, Facebook, Github, X, Linkedin, Instagram, Youtube, Globe, Mail, Phone, Wifi } from "lucide-react";
import { Link } from "react-router-dom";
import QRCode from "qrcode";

const QRGenerator = () => {
  const [inputText, setInputText] = useState("https://example.com");
  const [qrColor, setQrColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [size, setSize] = useState([300]);
  const [errorLevel, setErrorLevel] = useState("M");
  const [logoType, setLogoType] = useState("none");
  const [customLogoFile, setCustomLogoFile] = useState<File | null>(null);
  const [customLogoPreview, setCustomLogoPreview] = useState<string>("");
  const [frameStyle, setFrameStyle] = useState("none");
  const [frameColor, setFrameColor] = useState("#e2e8f0");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [qrStyle, setQrStyle] = useState("squares"); // NEW - QR module style
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Prebuilt logos with SVG paths
  const prebuiltLogos = {
    facebook: {
      name: "Facebook",
      color: "#1877F2",
      icon: Facebook
    },
    github: {
      name: "GitHub", 
      color: "#181717",
      icon: Github
    },
    twitter: {
      name: "X (Twitter)",
      color: "#000000",
      icon: X
    },
    linkedin: {
      name: "LinkedIn",
      color: "#0A66C2", 
      icon: Linkedin
    },
    instagram: {
      name: "Instagram",
      color: "#E4405F",
      icon: Instagram
    },
    youtube: {
      name: "YouTube",
      color: "#FF0000",
      icon: Youtube
    },
    website: {
      name: "Website",
      color: "#6366F1",
      icon: Globe
    },
    email: {
      name: "Email",
      color: "#059669",
      icon: Mail
    },
    phone: {
      name: "Phone",
      color: "#7C3AED",
      icon: Phone
    },
    wifi: {
      name: "Wi-Fi",
      color: "#0891B2",
      icon: Wifi
    }
  };

  // Auto-generate QR code when inputs change
  useEffect(() => {
    if (inputText) {
      generateQRCode();
    }
    // eslint-disable-next-line
  }, [inputText, qrColor, bgColor, size, errorLevel, logoType, customLogoFile, frameStyle, frameColor, qrStyle]);

  const generateQRCode = async () => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const qrSize = size[0];
      const padding = frameStyle !== "none" ? 40 : 12;
      const totalSize = qrSize + padding * 2;

      canvas.width = totalSize;
      canvas.height = totalSize;

      ctx.clearRect(0, 0, totalSize, totalSize);
      ctx.fillStyle = frameStyle !== "none" ? "#f8f9fa" : bgColor;
      ctx.fillRect(0, 0, totalSize, totalSize);

      // Draw frame as before:
      if (frameStyle !== "none") {
        drawFrame(ctx, totalSize, frameStyle);
      }

      // Use QRCode to create matrix data
      const qr = await QRCode.create(inputText, {
        errorCorrectionLevel: errorLevel as any,
      });

      // Draw modules according to qrStyle
      const modules = qr.modules;
      const numModules = modules.size;
      const cell = qrSize / numModules;

      for (let row = 0; row < numModules; row++) {
        for (let col = 0; col < numModules; col++) {
          if (!modules.data[row * numModules + col]) continue;
          const x = padding + col * cell;
          const y = padding + row * cell;
          ctx.fillStyle = qrColor;

          // --- New Styles ---
          if (qrStyle === "dots") {
            ctx.beginPath();
            ctx.arc(x + cell / 2, y + cell / 2, cell * 0.4, 0, 2 * Math.PI);
            ctx.fill();
          } else if (qrStyle === "rounded") {
            ctx.beginPath();
            ctx.moveTo(x + cell * 0.3, y);
            ctx.lineTo(x + cell * 0.7, y);
            ctx.quadraticCurveTo(x + cell, y, x + cell, y + cell * 0.3);
            ctx.lineTo(x + cell, y + cell * 0.7);
            ctx.quadraticCurveTo(x + cell, y + cell, x + cell * 0.7, y + cell);
            ctx.lineTo(x + cell * 0.3, y + cell);
            ctx.quadraticCurveTo(x, y + cell, x, y + cell * 0.7);
            ctx.lineTo(x, y + cell * 0.3);
            ctx.quadraticCurveTo(x, y, x + cell * 0.3, y);
            ctx.fill();
          } else {
            // squares default
            ctx.fillRect(x, y, cell, cell);
          }
        }
      }

      // Finder patterns (draw with solid squares so they're scannable):
      function drawFinderPattern(cx: number, cy: number) {
        ctx.save();
        ctx.strokeStyle = qrColor;
        ctx.lineWidth = 2;
        ctx.fillStyle = "#fff";
        ctx.fillRect(cx, cy, cell * 7, cell * 7);
        ctx.strokeRect(cx, cy, cell * 7, cell * 7);

        ctx.fillStyle = qrColor;
        ctx.fillRect(cx + cell, cy + cell, cell * 5, cell * 5);
        ctx.fillStyle = "#fff";
        ctx.fillRect(cx + 2 * cell, cy + 2 * cell, cell * 3, cell * 3);
        ctx.fillStyle = qrColor;
        ctx.fillRect(cx + 3 * cell, cy + 3 * cell, cell, cell);
        ctx.restore();
      }
      // Top left
      drawFinderPattern(padding, padding);
      // Top right
      drawFinderPattern(padding + cell * (numModules - 7), padding);
      // Bottom left
      drawFinderPattern(padding, padding + cell * (numModules - 7));

      // Add logo if needed (as before)
      if (logoType !== "none") {
        if (logoType === "custom" && customLogoFile && customLogoPreview) {
          await addCustomLogo(ctx, padding, qrSize);
        } else if (prebuiltLogos[logoType as keyof typeof prebuiltLogos]) {
          await addPrebuiltLogo(ctx, padding, qrSize, logoType);
        }
      }

      // Convert to data URL as usual
      const dataUrl = canvas.toDataURL("image/png");
      setQrDataUrl(dataUrl);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const drawFrame = (ctx: CanvasRenderingContext2D, size: number, style: string) => {
    ctx.strokeStyle = frameColor;
    ctx.fillStyle = frameColor;
    ctx.lineWidth = 3;

    switch (style) {
      case "modern":
        // Modern gradient frame
        const gradient = ctx.createLinearGradient(0, 0, size, size);
        gradient.addColorStop(0, frameColor);
        gradient.addColorStop(1, frameColor + "80");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(15, 15, size - 30, size - 30, 20);
        ctx.stroke();
        break;
      case "rounded":
        ctx.beginPath();
        ctx.roundRect(12, 12, size - 24, size - 24, 15);
        ctx.stroke();
        break;
      case "square":
        ctx.strokeRect(12, 12, size - 24, size - 24);
        break;
      case "circle":
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 20, 0, 2 * Math.PI);
        ctx.stroke();
        break;
      case "elegant":
        // Double border elegant frame
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 10, size - 20, size - 20);
        ctx.strokeRect(15, 15, size - 30, size - 30);
        break;
      case "shadow":
        // Shadow effect frame
        ctx.fillStyle = frameColor + "40";
        ctx.fillRect(18, 18, size - 26, size - 26);
        ctx.strokeStyle = frameColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(12, 12, size - 24, size - 24);
        break;
    }
  };

  const addPrebuiltLogo = async (ctx: CanvasRenderingContext2D, padding: number, qrSize: number, logoKey: string) => {
    return new Promise<void>((resolve) => {
      const logoSize = Math.min(qrSize * 0.2, 60);
      const logoX = padding + (qrSize - logoSize) / 2;
      const logoY = padding + (qrSize - logoSize) / 2;

      // Draw white background circle for logo
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2 + 8, 0, 2 * Math.PI);
      ctx.fill();
      
      // Add subtle shadow
      ctx.fillStyle = "#00000020";
      ctx.beginPath();
      ctx.arc(logoX + logoSize / 2 + 2, logoY + logoSize / 2 + 2, logoSize / 2 + 8, 0, 2 * Math.PI);
      ctx.fill();

      // Draw white circle again on top
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2 + 8, 0, 2 * Math.PI);
      ctx.fill();

      // Create SVG for the icon
      const logo = prebuiltLogos[logoKey as keyof typeof prebuiltLogos];
      const IconComponent = logo.icon;
      
      // Create a temporary div to render the icon
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = `<svg width="${logoSize * 0.6}" height="${logoSize * 0.6}" viewBox="0 0 24 24" fill="${logo.color}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${getIconPath(logoKey)}
      </svg>`;
      
      const svgData = new XMLSerializer().serializeToString(tempDiv.firstChild as Node);
      const img = new Image();
      
      img.onload = () => {
        const iconSize = logoSize * 0.6;
        const iconX = logoX + (logoSize - iconSize) / 2;
        const iconY = logoY + (logoSize - iconSize) / 2;
        ctx.drawImage(img, iconX, iconY, iconSize, iconSize);
        resolve();
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    });
  };

  const getIconPath = (logoKey: string) => {
    const paths = {
      facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
      github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>',
      twitter: '<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>',
      linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
      instagram: '<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>',
      youtube: '<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><polygon points="10,8 16,12 10,16"/>',
      website: '<circle cx="12" cy="12" r="10"/><path d="m2 12 20 0"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
      email: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2z"/><polyline points="22,6 12,13 2,6"/>',
      phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
      wifi: '<path d="m1 9 22 0"/><path d="M9 9c0 1.17-.5 2.2-1.3 2.9l-.7-.7c.4-.4.7-1 .7-1.6"/><path d="M20 9c0 1.17-.5 2.2-1.3 2.9l-.7-.7c.4-.4.7-1 .7-1.6"/><path d="M16 9c0 1.17-.5 2.2-1.3 2.9l-.7-.7c.4-.4.7-1 .7-1.6"/><path d="M12 9c0 1.17-.5 2.2-1.3 2.9l-.7-.7c.4-.4.7-1 .7-1.6"/><path d="M8 9c0 1.17-.5 2.2-1.3 2.9l-.7-.7c.4-.4.7-1 .7-1.6"/><path d="M4 9c0 1.17-.5 2.2-1.3 2.9l-.7-.7c.4-.4.7-1 .7-1.6"/>'
    };
    return paths[logoKey as keyof typeof paths] || '';
  };

  const addCustomLogo = async (ctx: CanvasRenderingContext2D, padding: number, qrSize: number) => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const logoSize = Math.min(qrSize * 0.2, 60);
        const logoX = padding + (qrSize - logoSize) / 2;
        const logoY = padding + (qrSize - logoSize) / 2;

        // Draw white background circle for logo
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2 + 8, 0, 2 * Math.PI);
        ctx.fill();

        // Draw logo
        ctx.drawImage(img, logoX, logoY, logoSize, logoSize);
        resolve();
      };
      img.src = customLogoPreview;
    });
  };

  const handleCustomLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCustomLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomLogoPreview(e.target?.result as string);
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

  const clearCustomLogo = () => {
    setCustomLogoFile(null);
    setCustomLogoPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Quick templates
  const quickTemplates = [
    { name: "Website", value: "https://example.com", logo: "website" },
    { name: "Facebook", value: "https://facebook.com/yourpage", logo: "facebook" },
    { name: "GitHub", value: "https://github.com/yourusername", logo: "github" },
    { name: "LinkedIn", value: "https://linkedin.com/in/yourprofile", logo: "linkedin" },
    { name: "Email", value: "mailto:contact@example.com", logo: "email" },
    { name: "Phone", value: "tel:+1234567890", logo: "phone" },
  ];

  const applyTemplate = (template: typeof quickTemplates[0]) => {
    setInputText(template.value);
    setLogoType(template.logo);
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      {/* Removed local Header - now use global AppHeader */}

      <div className="container mx-auto px-1 pt-4 sm:px-4 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-12 px-1">
            <h1 className="text-2xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Create Professional QR Codes with Advanced Customization
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
              Generate high-quality QR codes with custom shapes and styles,
              branded logos, professional frames, and real-time preview.
            </p>
          </div>

          {/* Quick Templates */}
          <Card className="mb-6 sm:mb-8">
            <CardHeader>
              <CardTitle>Quick Templates</CardTitle>
              <CardDescription>Start with a pre-configured template</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
                {quickTemplates.map((template) => (
                  <Button
                    key={template.name}
                    variant="outline"
                    size="sm"
                    onClick={() => applyTemplate(template)}
                    className="h-auto p-2 sm:p-3 flex flex-col gap-1 sm:gap-2"
                  >
                    {React.createElement(prebuiltLogos[template.logo as keyof typeof prebuiltLogos]?.icon || Globe, {
                      className: "h-5 w-5",
                      style: { color: prebuiltLogos[template.logo as keyof typeof prebuiltLogos]?.color }
                    })}
                    <span className="text-xs">{template.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Main Tool */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            
            {/* Controls Section */}
            <div className="space-y-4 sm:space-y-6 flex-1 min-w-0">

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
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label>Size (px)</Label>
                      <div className="mt-1 sm:mt-2">
                        <Slider
                          value={size}
                          onValueChange={setSize}
                          max={512}
                          min={200}
                          step={50}
                          className="w-full"
                        />
                        <p className="text-sm text-muted-foreground">{size[0]}px</p>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Error Correction</Label>
                      <Select value={errorLevel} onValueChange={setErrorLevel}>
                        <SelectTrigger className="mt-1">
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

              {/* Colors */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Colors & Style
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label>QR Color</Label>
                      <div className="flex gap-2 mt-1">
                        <input
                          type="color"
                          value={qrColor}
                          onChange={(e) => setQrColor(e.target.value)}
                          className="w-10 h-10 rounded border cursor-pointer"
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
                          className="w-10 h-10 rounded border cursor-pointer"
                        />
                        <Input
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Style selector */}
                  <div>
                    <Label>QR Style</Label>
                    <Select value={qrStyle} onValueChange={setQrStyle}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="squares">Squares (Classic)</SelectItem>
                        <SelectItem value="dots">Dots</SelectItem>
                        <SelectItem value="rounded">Rounded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Frame & Logo */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Frame className="h-5 w-5" />
                    Frame & Logo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label>Frame Style</Label>
                      <Select value={frameStyle} onValueChange={setFrameStyle}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Frame</SelectItem>
                          <SelectItem value="modern">Modern</SelectItem>
                          <SelectItem value="elegant">Elegant</SelectItem>
                          <SelectItem value="rounded">Rounded</SelectItem>
                          <SelectItem value="square">Square</SelectItem>
                          <SelectItem value="circle">Circle</SelectItem>
                          <SelectItem value="shadow">Shadow</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {frameStyle !== "none" && (
                      <div>
                        <Label>Frame Color</Label>
                        <div className="flex gap-2 mt-1">
                          <input
                            type="color"
                            value={frameColor}
                            onChange={(e) => setFrameColor(e.target.value)}
                            className="w-10 h-10 rounded border cursor-pointer"
                          />
                          <Input
                            value={frameColor}
                            onChange={(e) => setFrameColor(e.target.value)}
                            placeholder="#e2e8f0"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Logo</Label>
                    <Select value={logoType} onValueChange={setLogoType}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a logo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Logo</SelectItem>
                        <SelectItem value="custom">Custom Logo</SelectItem>
                        {Object.entries(prebuiltLogos).map(([key, logo]) => (
                          <SelectItem key={key} value={key}>
                            {logo.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {logoType === "custom" && (
                    <div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex-1"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Choose Custom Logo
                        </Button>
                        {customLogoFile && (
                          <Button variant="outline" onClick={clearCustomLogo}>
                            Clear
                          </Button>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleCustomLogoUpload}
                        className="hidden"
                      />
                      {customLogoFile && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Logo: {customLogoFile.name}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>

            {/* Preview Section */}
            <Card className="mt-6 lg:mt-0 w-full max-w-md mx-auto lg:mx-0 lg:sticky lg:top-8">
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>
                  Your QR code updates automatically as you make changes
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 sm:p-8 mb-4 sm:mb-6 border-2 border-dashed border-gray-200">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-auto mx-auto rounded-lg shadow-lg bg-white"
                    style={{ maxWidth: 350, minWidth: 180, width: "100%" }}
                  />
                </div>
                <div className="space-y-4">
                  <Button onClick={downloadQR} disabled={!qrDataUrl} className="w-full" size="lg">
                    <Download className="h-4 w-4 mr-2" />
                    Download High Quality PNG
                  </Button>
                  <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
                    <p>• High resolution PNG format</p>
                    <p>• Transparent background support</p>
                    <p>• Professional quality output</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Use Cases */}
          <div className="mt-10 sm:mt-16">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8">Popular Use Cases</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              
              <Card className="text-center">
                <CardHeader>
                  <Globe className="h-7 w-7 sm:h-8 sm:w-8 mx-auto text-primary mb-2" />
                  <CardTitle className="text-base sm:text-lg">Website Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Perfect for marketing materials, business cards, or anywhere you want people to quickly visit your website.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Facebook className="h-7 w-7 sm:h-8 sm:w-8 mx-auto text-blue-600 mb-2" />
                  <CardTitle className="text-base sm:text-lg">Social Media</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Link to your social media profiles with branded QR codes featuring platform-specific logos.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Wifi className="h-7 w-7 sm:h-8 sm:w-8 mx-auto text-green-600 mb-2" />
                  <CardTitle className="text-base sm:text-lg">Wi-Fi Sharing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Create QR codes for Wi-Fi passwords so guests can connect instantly without typing complex passwords.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Mail className="h-7 w-7 sm:h-8 sm:w-8 mx-auto text-purple-600 mb-2" />
                  <CardTitle className="text-base sm:text-lg">Contact Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Share your contact details as vCard or direct email/phone links with professional branding.
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
