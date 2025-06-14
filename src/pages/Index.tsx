
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  QrCode, 
  Scissors, 
  ImageIcon, 
  FileText, 
  Shield, 
  Code, 
  Plus,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-center">Tools</h1>
          <p className="text-center text-muted-foreground mt-2">Simple tools for smart people</p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold mb-6">Your Daily Toolkit, Instantly</h1>
        <h2 className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          A collection of free, powerful online tools to simplify your everyday tasks—no account required, ever.
        </h2>
        
        {/* How it Works */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
          <div className="text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 className="font-semibold mb-2">Choose Your Tool</h3>
            <p className="text-muted-foreground">Pick from our collection of helpful utilities</p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">2</span>
            </div>
            <h3 className="font-semibold mb-2">Upload Your File or Enter Data</h3>
            <p className="text-muted-foreground">Add your content securely in your browser</p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">3</span>
            </div>
            <h3 className="font-semibold mb-2">Download Your Result Instantly</h3>
            <p className="text-muted-foreground">Get your processed file in seconds</p>
          </div>
        </div>

        <p className="text-lg mb-8">Ready to simplify your tasks? Pick a tool below and get started!</p>
      </section>

      {/* Tools Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          
          {/* QR Code Generator */}
          <Link to="/qr-generator">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <QrCode className="h-8 w-8 text-primary" />
                  <CardTitle>Instant QR Codes</CardTitle>
                </div>
                <CardDescription>
                  Create QR codes for websites, Wi-Fi passwords, or contact info in seconds.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  Create Your QR Code <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Background Remover */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Scissors className="h-8 w-8 text-primary" />
                <CardTitle>Background Remover</CardTitle>
              </div>
              <CardDescription>
                Remove backgrounds from images instantly. Perfect for logos, products, and profile pictures.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Remove Background <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Image Resizer */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <ImageIcon className="h-8 w-8 text-primary" />
                <CardTitle>Smart Image Resizer</CardTitle>
              </div>
              <CardDescription>
                Resize images for social media, websites, or email without losing quality.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Resize Your Image <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* PDF Tools */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <CardTitle>PDF Tools</CardTitle>
              </div>
              <CardDescription>
                Merge, split, or compress PDFs. All the PDF utilities you need in one place.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Edit PDFs Now <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Password Generator */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-primary" />
                <CardTitle>Secure Password Generator</CardTitle>
              </div>
              <CardDescription>
                Generate strong, unique passwords. Created on your device—never stored or transmitted.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Generate Secure Password <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* JSON Tools */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Code className="h-8 w-8 text-primary" />
                <CardTitle>JSON Tools</CardTitle>
              </div>
              <CardDescription>
                View, format, and validate JSON data. Essential tools for developers and students.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Format Your JSON <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* More Tools Coming Soon */}
          <Card className="hover:shadow-lg transition-shadow border-dashed">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Plus className="h-8 w-8 text-muted-foreground" />
                <CardTitle className="text-muted-foreground">More on the Way!</CardTitle>
              </div>
              <CardDescription>
                We're always working on adding new tools to make your life easier. Have a suggestion? Let us know!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Stay Tuned <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* About */}
            <div>
              <h3 className="font-semibold mb-4">About Tools</h3>
              <p className="text-muted-foreground text-sm">
                We believe everyone deserves access to simple, powerful tools without the hassle of accounts or subscriptions. 
                Our mission is to make everyday tasks easier for everyone, everywhere.
              </p>
            </div>

            {/* Privacy */}
            <div>
              <h3 className="font-semibold mb-4">Privacy First</h3>
              <p className="text-muted-foreground text-sm">
                We respect your privacy. We do not store your files or data. All processing happens securely in your browser.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-4">Get in Touch</h3>
              <p className="text-muted-foreground text-sm">
                Have a suggestion for a new tool? Found a bug? We'd love to hear from you and make Tools even better.
              </p>
            </div>

          </div>

          <div className="border-t mt-8 pt-8 text-center">
            <p className="text-muted-foreground text-sm">
              © 2024 Tools. Free to use, forever. No strings attached.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
