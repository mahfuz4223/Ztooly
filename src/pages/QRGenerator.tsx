
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, ArrowLeft, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const QRGenerator = () => {
  const [inputText, setInputText] = useState("");

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
              <h1 className="text-2xl font-bold">QR Code Generator</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Create Professional QR Codes Instantly</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Generate high-quality QR codes for websites, Wi-Fi passwords, contact information, or any text. 
              Perfect for marketing materials, business cards, or sharing information quickly. 
              No signup required, completely free, and your data never leaves your browser.
            </p>
          </div>

          {/* Main Tool */}
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle>Enter Your Content</CardTitle>
                <CardDescription>
                  Type or paste any text, URL, or information you want to encode
                </CardDescription>
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
                <Button className="w-full" disabled={!inputText}>
                  Create Your QR Code
                </Button>
              </CardContent>
            </Card>

            {/* Preview Section */}
            <Card>
              <CardHeader>
                <CardTitle>Your QR Code</CardTitle>
                <CardDescription>
                  Preview and download your generated QR code
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                {inputText ? (
                  <div className="space-y-4">
                    <div className="bg-muted rounded-lg p-8">
                      <div className="w-48 h-48 bg-white border rounded-lg mx-auto flex items-center justify-center">
                        <QrCode className="h-32 w-32 text-muted-foreground" />
                      </div>
                    </div>
                    <Button>
                      <Download className="h-4 w-4 mr-2" />
                      Download PNG
                    </Button>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-16">
                    Enter some text above to see your QR code
                  </div>
                )}
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
