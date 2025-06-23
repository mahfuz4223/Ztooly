import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QrCode, Download, Upload, Palette, Frame, Settings, Facebook, Github, X, Linkedin, Instagram, Youtube, Globe, Mail, Phone, Wifi } from "lucide-react";
import QRCodeStyling from "qr-code-styling";
import { UsageStats } from "@/components/UsageStats";
import { useQRToolAnalytics } from "@/utils/analyticsHelper";

const QRGenerator = () => {
  // Enhanced Analytics tracking
  const analytics = useQRToolAnalytics('qr-generator', 'QR Code Generator');

  const [inputText, setInputText] = useState("https://example.com");
  const [qrColor, setQrColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [size, setSize] = useState([300]);
  const [errorLevel, setErrorLevel] = useState("M");
  const [logoType, setLogoType] = useState("none");
  const [customLogoFile, setCustomLogoFile] = useState<File | null>(null);
  const [customLogoPreview, setCustomLogoPreview] = useState<string>("");
  
  // Enhanced styling options
  const [dotsType, setDotsType] = useState("square");
  const [cornersSquareType, setCornersSquareType] = useState("square");
  const [cornersDotType, setCornersDotType] = useState("square");
  const [gradientType, setGradientType] = useState("linear");
  const [gradientColor1, setGradientColor1] = useState("#000000");
  const [gradientColor2, setGradientColor2] = useState("#000000");
  const [useGradient, setUseGradient] = useState(false);
  const [cornersSquareColor, setCornersSquareColor] = useState("#000000");
  const [cornersDotColor, setCornersDotColor] = useState("#000000");
  
  const qrCodeRef = useRef<QRCodeStyling | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Prebuilt logos with URLs
  const prebuiltLogos = {
    facebook: {
      name: "Facebook",
      color: "#1877F2",
      icon: Facebook,
      url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzE4NzdGMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE4IDJoLTNhNSA1IDAgMCAwLTUgNXYzSDd2NGgzdjhoNHYtOGgzbDEtNGgtNFY3YTEgMSAwIDAgMSAxLTFoM3oiLz4KPC9zdmc+"
    },
    github: {
      name: "GitHub", 
      color: "#181717",
      icon: Github,
      url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzE4MTcxNyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTkgMTljLTUgMS41LTUtMi41LTctM20xNCA2di0zLjg3YTMuMzcgMy4zNyAwIDAgMC0uOTQtMi42MWMzLjE0LS4zNSA2LjQ0LTEuNTQgNi40NC03QTUuNDQgNS40NCAwIDAgMCAyMCA0Ljc3IDUuMDcgNS4wNyAwIDAgMCAxOS45MSAxUzE4LjczLjY1IDE2IDIuNDhhMTMuMzggMTMuMzggMCAwIDAtNyAwQzYuMjcuNjUgNS4wOSAxIDUuMDkgMUE1LjA3IDUuMDcgMCAwIDAgNSA0Ljc3YTUuNDQgNS40NCAwIDAgMC0xLjUgMy43OGMwIDUuNDIgMy4zIDYuNjEgNi40NCA3QTMuMzcgMy4zNyAwIDAgMCA5IDE4LjEzVjIyIi8+Cjwvc3ZnPg=="
    },
    twitter: {
      name: "X (Twitter)",
      color: "#000000",
      icon: X,
      url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzAwMDAwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIyIDRzLS43IDIuMS0yIDMuNGMxLjYgMTAtOS40IDE3LjMtMTggMTEuNiAyLjIuMSA0LjQtLjYgNi0yQzMgMTUuNS41IDkuNiAzIDVjMi4yIDIuNiA1LjYgNC4xIDkgNC0uOS00LjIgNC02LjYgNy0zLjggMS4xIDAgMy0xLjIgMy0xLjJ6Ii8+Cjwvc3ZnPg=="
    },
    linkedin: {
      name: "LinkedIn",
      color: "#0A66C2", 
      icon: Linkedin,
      url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzBBNjZDMiIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2IDhhNiA2IDAgMCAxIDYgNnY3aC00di03YTIgMiAwIDAgMC0yLTIgMiAyIDAgMCAwLTIgMnY3aC00di03YTYgNiAwIDAgMSA2LTZ6Ii8+CjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjEyIiB4PSIyIiB5PSI5Ii8+CjxjaXJjbGUgY3g9IjQiIGN5PSI0IiByPSIyIi8+Cjwvc3ZnPg=="
    },
    instagram: {
      name: "Instagram",
      color: "#E4405F",
      icon: Instagram,
      url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0U0NDA1RiIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB4PSIyIiB5PSIyIiByeD0iNSIgcnk9IjUiLz4KPHBhdGggZD0ibTE2IDExLjM3QTQgNCAwIDEgMSAxMi42MyA4IDQgNCAwIDAgMSAxNiAxMS4zN3oiLz4KPGxpbmUgeDE9IjE3LjUiIHgyPSIxNy41MSIgeTE9IjYuNSIgeTI9IjYuNSIvPgo8L3N2Zz4="
    },
    youtube: {
      name: "YouTube",
      color: "#FF0000",
      icon: Youtube,
      url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGMDAwMCIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIuNSAxN2EyNC4xMiAyNC4xMiAwIDAgMSAwLTEwIDIgMiAwIDAgMSAxLjQtMS40IDQ5LjU2IDQ5LjU2IDAgMCAxIDE2LjIgMEEyIDIgMCAwIDEgMjEuNSA3YTI0LjEyIDI0LjEyIDAgMCAxIDAgMTAgMiAyIDAgMCAxLTEuNCAxLjQgNDkuNTUgNDkuNTUgMCAwIDEtMTYuMiAwQTIgMiAwIDAgMSAyLjUgMTciLz4KPHBvbHlnb24gcG9pbnRzPSIxMCw4IDE2LDEyIDEwLDE2Ii8+Cjwvc3ZnPg=="
    },
    website: {
      name: "Website",
      color: "#6366F1",
      icon: Globe,
      url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzYzNjZGMSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiLz4KPHBhdGggZD0ibTIgMTIgMjAgMCIvPgo8cGF0aCBkPSJNMTIgMmExNS4zIDE1LjMgMCAwIDEgNCAxMCAxNS4zIDE1LjMgMCAwIDEtNCAxMCAxNS4zIDE1LjMgMCAwIDEtNC0xMCAxNS4zIDE1LjMgMCAwIDEgNC0xMHoiLz4KPC9zdmc+"
    },
    email: {
      name: "Email",
      color: "#059669",
      icon: Mail,
      url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzA1OTY2OSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgNGgxNmMxLjEgMCAyIC45IDIgMnYxMmMwIDEuMS0uOSAyLTIgMkg0Yy0xLjEgMC0yLS45LTItMnoiLz4KPHBvbHlsaW5lIHBvaW50cz0iMjIsNiAxMiwxMyAyLDYiLz4KPC9zdmc+"
    },
    phone: {
      name: "Phone",
      color: "#7C3AED",
      icon: Phone,
      url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzdDM0FFRCIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIyIDE2LjkydjNhMiAyIDAgMCAxLTIuMTggMiAxOS43OSAxOS43OSAwIDAgMS04LjYzLTMuMDcgMTkuNSAxOS41IDAgMCAxLTYtNiAxOS43OSAxOS43OSAwIDAgMS0zLjA3LTguNjdBMiAyIDAgMCAxIDQuMTEgMmgzYTIgMiAwIDAgMSAyIDEuNzIgMTIuODQgMTIuODQgMCAwIDAgLjcgMi44MSAyIDIgMCAwIDEtLjQ1IDIuMTFMOC4wOSA5LjkxYTE2IDE2IDAgMCAwIDYgNmwxLjI3LTEuMjdhMiAyIDAgMCAxIDIuMTEtLjQ1IDEyLjg0IDEyLjg0IDAgMCAwIDIuODEuN0EyIDIgMCAwIDEgMjIgMTYuOTJ6Ii8+Cjwvc3ZnPg=="
    },
    wifi: {
      name: "Wi-Fi",
      color: "#0891B2",
      icon: Wifi,
      url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzA4OTFCMiIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0ibTEgOSAyMiAwIi8+CjxwYXRoIGQ9Ik05IDljMCAxLjE3LS41IDIuMi0xLjMgMi45bC0uNy0uN2MuNC0uNC43LTEgLjctMS42Ii8+CjxwYXRoIGQ9Ik0yMCA9YzAgMS4xNy0uNSAyLjItMS4zIDIuOWwtLjctLjdjLjQtLjQuNy0xIC43LTEuNiIvPgo8cGF0aCBkPSJNMTYgOWMwIDEuMTctLjUgMi4yLTEuMyAyLjlsLS43LS43Yy40LS40LjctMSAuNy0xLjYiLz4KPHBhdGggZD0iTTEyIDljMCAxLjE3LS41IDIuMi0xLjMgMi45bC0uNy0uN2MuNC0uNC43LTEgLjctMS42Ii8+CjxwYXRoIGQ9Ik04IDljMCAxLjE3LS41IDIuMi0xLjMgMi45bC0uNy0uN2MuNC0uNC43LTEgLjctMS42Ii8+CjxwYXRoIGQ9Ik00IDljMCAxLjE3LS41IDIuMi0xLjMgMi45bC0uNy0uN2MuNC0uNC43LTEgLjctMS42Ii8+Cjwvc3ZnPg=="
    }
  };

  // Initialize QR Code Styling
  useEffect(() => {
    const qrCode = new QRCodeStyling({
      width: size[0],
      height: size[0],
      type: "canvas",
      data: inputText,
      margin: 10,
      qrOptions: {
        typeNumber: 0,
        mode: "Byte",
        errorCorrectionLevel: errorLevel as any
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: 5,
        crossOrigin: "anonymous"
      },
      dotsOptions: {
        color: useGradient ? undefined : qrColor,
        gradient: useGradient ? {
          type: gradientType as any,
          rotation: 0,
          colorStops: [
            { offset: 0, color: gradientColor1 },
            { offset: 1, color: gradientColor2 }
          ]
        } : undefined,
        type: dotsType as any
      },
      backgroundOptions: {
        color: bgColor
      },
      cornersSquareOptions: {
        color: cornersSquareColor,
        type: cornersSquareType as any
      },
      cornersDotOptions: {
        color: cornersDotColor,
        type: cornersDotType as any
      }
    });

    qrCodeRef.current = qrCode;
    
    if (canvasRef.current) {
      qrCode.append(canvasRef.current);
    }

    return () => {
      if (canvasRef.current) {
        canvasRef.current.innerHTML = '';
      }
    };
  }, []);

  // Update QR code when options change
  useEffect(() => {
    if (qrCodeRef.current) {
      const logoUrl = logoType === "custom" ? customLogoPreview : 
                     logoType !== "none" ? prebuiltLogos[logoType as keyof typeof prebuiltLogos]?.url : 
                     undefined;

      qrCodeRef.current.update({
        width: size[0],
        height: size[0],
        data: inputText,
        image: logoUrl,
        qrOptions: {
          errorCorrectionLevel: errorLevel as any
        },
        dotsOptions: {
          color: useGradient ? undefined : qrColor,
          gradient: useGradient ? {
            type: gradientType as any,
            rotation: 0,
            colorStops: [
              { offset: 0, color: gradientColor1 },
              { offset: 1, color: gradientColor2 }
            ]
          } : undefined,
          type: dotsType as any
        },
        backgroundOptions: {
          color: bgColor
        },
        cornersSquareOptions: {
          color: cornersSquareColor,
          type: cornersSquareType as any
        },
        cornersDotOptions: {
          color: cornersDotColor,
          type: cornersDotType as any
        }
      });
    }
  }, [inputText, qrColor, bgColor, size, errorLevel, logoType, customLogoPreview, dotsType, cornersSquareType, cornersDotType, gradientType, gradientColor1, gradientColor2, useGradient, cornersSquareColor, cornersDotColor]);

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
    if (qrCodeRef.current) {
      qrCodeRef.current.download({
        name: "qr-code",
        extension: "png"
      });
      // Track download action
      analytics.trackDownload();
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
      <div className="container mx-auto px-1 pt-4 sm:px-4 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-12 px-1">
            <h1 className="text-2xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Advanced QR Code Generator with Professional Styling
            </h1>            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
              Create stunning QR codes with advanced customization options including gradients, 
              custom shapes, professional logos, and unlimited styling possibilities.
            </p>
            
            {/* Usage Statistics */}
            <div className="mt-4 flex justify-center">
              <UsageStats toolId="qr-generator" />
            </div>
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

              {/* Advanced Styling */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Advanced Styling
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Dot Style */}
                  <div>
                    <Label>Dot Style</Label>
                    <Select value={dotsType} onValueChange={setDotsType}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="square">Square</SelectItem>
                        <SelectItem value="dots">Dots</SelectItem>
                        <SelectItem value="rounded">Rounded</SelectItem>
                        <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                        <SelectItem value="classy">Classy</SelectItem>
                        <SelectItem value="classy-rounded">Classy Rounded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Corner Styles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label>Corner Square Style</Label>
                      <Select value={cornersSquareType} onValueChange={setCornersSquareType}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="square">Square</SelectItem>
                          <SelectItem value="dot">Dot</SelectItem>
                          <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Corner Dot Style</Label>
                      <Select value={cornersDotType} onValueChange={setCornersDotType}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="square">Square</SelectItem>
                          <SelectItem value="dot">Dot</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Gradient Toggle */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="gradient-toggle"
                      checked={useGradient}
                      onChange={(e) => setUseGradient(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="gradient-toggle">Use Gradient Colors</Label>
                  </div>

                  {/* Color Options */}
                  {useGradient ? (
                    <div className="space-y-4">
                      <div>
                        <Label>Gradient Type</Label>
                        <Select value={gradientType} onValueChange={setGradientType}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="linear">Linear</SelectItem>
                            <SelectItem value="radial">Radial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <Label>Gradient Color 1</Label>
                          <div className="flex gap-2 mt-1">
                            <input
                              type="color"
                              value={gradientColor1}
                              onChange={(e) => setGradientColor1(e.target.value)}
                              className="w-10 h-10 rounded border cursor-pointer"
                            />
                            <Input
                              value={gradientColor1}
                              onChange={(e) => setGradientColor1(e.target.value)}
                              placeholder="#000000"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label>Gradient Color 2</Label>
                          <div className="flex gap-2 mt-1">
                            <input
                              type="color"
                              value={gradientColor2}
                              onChange={(e) => setGradientColor2(e.target.value)}
                              className="w-10 h-10 rounded border cursor-pointer"
                            />
                            <Input
                              value={gradientColor2}
                              onChange={(e) => setGradientColor2(e.target.value)}
                              placeholder="#000000"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
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
                  )}

                  {/* Background and Corner Colors */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
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

                    <div>
                      <Label>Corner Square Color</Label>
                      <div className="flex gap-2 mt-1">
                        <input
                          type="color"
                          value={cornersSquareColor}
                          onChange={(e) => setCornersSquareColor(e.target.value)}
                          className="w-10 h-10 rounded border cursor-pointer"
                        />
                        <Input
                          value={cornersSquareColor}
                          onChange={(e) => setCornersSquareColor(e.target.value)}
                          placeholder="#000000"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Corner Dot Color</Label>
                      <div className="flex gap-2 mt-1">
                        <input
                          type="color"
                          value={cornersDotColor}
                          onChange={(e) => setCornersDotColor(e.target.value)}
                          className="w-10 h-10 rounded border cursor-pointer"
                        />
                        <Input
                          value={cornersDotColor}
                          onChange={(e) => setCornersDotColor(e.target.value)}
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Logo Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Frame className="h-5 w-5" />
                    Logo & Branding
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                  Your QR code updates automatically with advanced styling
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 sm:p-8 mb-4 sm:mb-6 border-2 border-dashed border-gray-200">
                  <div
                    ref={canvasRef}
                    className="w-full h-auto mx-auto rounded-lg shadow-lg bg-white"
                    style={{ maxWidth: 350, minWidth: 180 }}
                  />
                </div>
                <div className="space-y-4">
                  <Button onClick={downloadQR} className="w-full" size="lg">
                    <Download className="h-4 w-4 mr-2" />
                    Download High Quality PNG
                  </Button>
                  <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
                    <p>• Professional quality output</p>
                    <p>• Advanced styling options</p>
                    <p>• Custom logo support</p>
                    <p>• Gradient and shape customization</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Advanced Features */}
          <div className="mt-10 sm:mt-16">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8">Advanced Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              
              <Card className="text-center">
                <CardHeader>
                  <Palette className="h-7 w-7 sm:h-8 sm:w-8 mx-auto text-primary mb-2" />
                  <CardTitle className="text-base sm:text-lg">Gradient Colors</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Create stunning QR codes with linear and radial gradients for eye-catching designs.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Frame className="h-7 w-7 sm:h-8 sm:w-8 mx-auto text-blue-600 mb-2" />
                  <CardTitle className="text-base sm:text-lg">Custom Shapes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Choose from dots, rounded squares, classy styles, and more for unique QR codes.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <QrCode className="h-7 w-7 sm:h-8 sm:w-8 mx-auto text-green-600 mb-2" />
                  <CardTitle className="text-base sm:text-lg">Corner Styling</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Customize corner squares and dots independently for professional branding.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Settings className="h-7 w-7 sm:h-8 sm:w-8 mx-auto text-purple-600 mb-2" />
                  <CardTitle className="text-base sm:text-lg">Pro Quality</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Professional-grade QR codes perfect for business cards, marketing, and branding.
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
