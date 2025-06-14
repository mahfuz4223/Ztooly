
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
  ArrowRight,
  Menu,
  X,
  Sparkles,
  Zap,
  Lock,
  Download
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Tools
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#tools" className="text-muted-foreground hover:text-foreground transition-colors">Tools</a>
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
              <Button>Get Started</Button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-4">
              <a href="#tools" className="block text-muted-foreground hover:text-foreground transition-colors">Tools</a>
              <a href="#features" className="block text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#about" className="block text-muted-foreground hover:text-foreground transition-colors">About</a>
              <Button className="w-full">Get Started</Button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Powered Tools Platform
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              Your Digital Toolkit,
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Instantly Available
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Transform your workflow with our collection of powerful, AI-enhanced tools. 
              No accounts, no limits, no complexity—just pure productivity at your fingertips.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6">
                <Zap className="h-5 w-5 mr-2" />
                Start Building Now
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                <Download className="h-5 w-5 mr-2" />
                Explore Tools
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Our Platform?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for speed, security, and simplicity
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Instant processing with zero wait times. Our tools are optimized for maximum performance.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Lock className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Privacy First</h3>
              <p className="text-muted-foreground">
                All processing happens in your browser. We never store or access your files.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">No Sign-up Required</h3>
              <p className="text-muted-foreground">
                Jump straight in and start using any tool immediately. No barriers, no friction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Categories */}
      <section id="tools" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Tools for Every Need</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional-grade utilities that work instantly in your browser
            </p>
          </div>

          {/* QR & Codes Category */}
          <div className="mb-16">
            <h3 className="text-2xl font-semibold mb-8 flex items-center">
              <QrCode className="h-6 w-6 mr-3 text-primary" />
              QR Codes & Generation
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link to="/qr-generator">
                <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-background to-muted/30 hover:scale-105">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center">
                        <QrCode className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <CardTitle>Instant QR Codes</CardTitle>
                    </div>
                    <CardDescription>
                      Create QR codes for websites, Wi-Fi passwords, or contact info in seconds.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full group">
                      Create Your QR Code 
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* Image Tools Category */}
          <div className="mb-16">
            <h3 className="text-2xl font-semibold mb-8 flex items-center">
              <ImageIcon className="h-6 w-6 mr-3 text-primary" />
              Image Processing
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-background to-muted/30 hover:scale-105">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center">
                      <Scissors className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle>Background Remover</CardTitle>
                  </div>
                  <CardDescription>
                    Remove backgrounds from images instantly. Perfect for logos, products, and profile pictures.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full group">
                    Remove Background 
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-background to-muted/30 hover:scale-105">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle>Smart Image Resizer</CardTitle>
                  </div>
                  <CardDescription>
                    Resize images for social media, websites, or email without losing quality.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full group">
                    Resize Your Image 
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Document Tools Category */}
          <div className="mb-16">
            <h3 className="text-2xl font-semibold mb-8 flex items-center">
              <FileText className="h-6 w-6 mr-3 text-primary" />
              Document Processing
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-background to-muted/30 hover:scale-105">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center">
                      <FileText className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle>PDF Tools</CardTitle>
                  </div>
                  <CardDescription>
                    Merge, split, or compress PDFs. All the PDF utilities you need in one place.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full group">
                    Edit PDFs Now 
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Security & Development Category */}
          <div className="mb-16">
            <h3 className="text-2xl font-semibold mb-8 flex items-center">
              <Shield className="h-6 w-6 mr-3 text-primary" />
              Security & Development
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-background to-muted/30 hover:scale-105">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center">
                      <Shield className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle>Secure Password Generator</CardTitle>
                  </div>
                  <CardDescription>
                    Generate strong, unique passwords. Created on your device—never stored or transmitted.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full group">
                    Generate Secure Password 
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-background to-muted/30 hover:scale-105">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center">
                      <Code className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle>JSON Tools</CardTitle>
                  </div>
                  <CardDescription>
                    View, format, and validate JSON data. Essential tools for developers and students.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full group">
                    Format Your JSON 
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>

              {/* More Tools Coming Soon */}
              <Card className="hover:shadow-xl transition-all duration-300 border-dashed border-2 bg-gradient-to-br from-background to-muted/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
                      <Plus className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-muted-foreground">More Coming Soon!</CardTitle>
                  </div>
                  <CardDescription>
                    We're constantly adding new AI-powered tools. Have a suggestion? Let us know!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full group">
                    Stay Tuned 
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Built for Everyone, Everywhere</h2>
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              We believe powerful tools shouldn't come with barriers. That's why we've created a platform 
              where anyone can access professional-grade utilities instantly, securely, and completely free. 
              No accounts, no subscriptions, no complications—just the tools you need, when you need them.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-4 text-lg">Privacy First</h3>
                <p className="text-muted-foreground text-sm">
                  All processing happens in your browser. We never see, store, or access your files.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-lg">Always Free</h3>
                <p className="text-muted-foreground text-sm">
                  Our mission is to democratize access to powerful tools for everyone, everywhere.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-lg">Constantly Evolving</h3>
                <p className="text-muted-foreground text-sm">
                  We're always adding new tools and improving existing ones based on user feedback.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">Tools</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Professional tools for everyone. Free, secure, and always available.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Tools</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/qr-generator" className="hover:text-foreground transition-colors">QR Generator</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Background Remover</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Image Resizer</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">PDF Tools</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#about" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Feature Requests</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Bug Reports</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center">
            <p className="text-muted-foreground text-sm">
              © 2024 Tools. Free to use, forever. Built with ❤️ for the internet.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
