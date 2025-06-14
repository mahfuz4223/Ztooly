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
  Download,
  Star,
  Users,
  Globe,
  ChevronDown
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const categories = [
    { id: "all", name: "All Tools", icon: Sparkles },
    { id: "qr-codes", name: "QR & Codes", icon: QrCode },
    { id: "image", name: "Image Tools", icon: ImageIcon },
    { id: "document", name: "Documents", icon: FileText },
    { id: "security", name: "Security & Dev", icon: Shield }
  ];

  const tools = [
    {
      id: "qr-generator",
      title: "Instant QR Codes",
      description: "Create QR codes for websites, Wi-Fi passwords, or contact info in seconds.",
      icon: QrCode,
      category: "qr-codes",
      link: "/qr-generator",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      id: "background-remover",
      title: "Background Remover",
      description: "Remove backgrounds from images instantly. Perfect for logos, products, and profile pictures.",
      icon: Scissors,
      category: "image",
      link: "/background-remover",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      id: "image-resizer",
      title: "Smart Image Resizer",
      description: "Resize images for social media, websites, or email without losing quality.",
      icon: ImageIcon,
      category: "image",
      link: "/image-resizer",
      gradient: "from-green-500 to-green-600"
    },
    {
      id: "pdf-tools",
      title: "PDF Tools",
      description: "Convert, merge, compress, and edit PDFs. All the PDF utilities you need in one place.",
      icon: FileText,
      category: "document",
      link: "/pdf-tools",
      gradient: "from-red-500 to-red-600"
    },
    {
      id: "password-generator",
      title: "Secure Password Generator",
      description: "Generate strong, unique passwords. Created on your device—never stored or transmitted.",
      icon: Shield,
      category: "security",
      link: "/password-generator",
      gradient: "from-orange-500 to-orange-600"
    },
    {
      id: "json-tools",
      title: "JSON Tools",
      description: "View, format, and validate JSON data. Essential tools for developers and students.",
      icon: Code,
      category: "security",
      link: "/json-tools",
      gradient: "from-indigo-500 to-indigo-600"
    }
  ];

  const filteredTools = selectedCategory === "all" 
    ? tools 
    : tools.filter(tool => tool.category === selectedCategory);

  const stats = [
    { label: "Active Users", value: "50K+", icon: Users },
    { label: "Tools Available", value: "12+", icon: Sparkles },
    { label: "Countries", value: "150+", icon: Globe },
    { label: "User Rating", value: "4.9", icon: Star }
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        
        {/* Mouse Following Gradient */}
        <div 
          className="absolute w-96 h-96 bg-gradient-radial from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl transition-all duration-300 ease-out"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
      </div>

      {/* Enhanced Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary via-primary to-primary/60 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                ToolKit
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#tools" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Tools</a>
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Features</a>
              <a href="#stats" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Stats</a>
              <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors font-medium">About</a>
              <Button className="shadow-lg hover:shadow-xl transition-all duration-300">
                <Zap className="h-4 w-4 mr-2" />
                Get Started
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-4 animate-fade-in">
              <a href="#tools" className="block text-muted-foreground hover:text-foreground transition-colors font-medium">Tools</a>
              <a href="#features" className="block text-muted-foreground hover:text-foreground transition-colors font-medium">Features</a>
              <a href="#stats" className="block text-muted-foreground hover:text-foreground transition-colors font-medium">Stats</a>
              <a href="#about" className="block text-muted-foreground hover:text-foreground transition-colors font-medium">About</a>
              <Button className="w-full">
                <Zap className="h-4 w-4 mr-2" />
                Get Started
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section className="relative py-24 lg:py-40 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 backdrop-blur-sm animate-fade-in">
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Powered Tools Platform
              <div className="ml-2 px-2 py-1 bg-primary/20 rounded-full text-xs">NEW</div>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 animate-fade-in">
              <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
                Your Digital
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-purple-500 to-primary/60 bg-clip-text text-transparent leading-tight">
                Productivity Hub
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in delay-200">
              Transform your workflow with our collection of powerful, AI-enhanced tools. 
              <br />
              <span className="text-primary font-medium">No accounts • No limits • No complexity</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in delay-300">
              <Button size="lg" className="text-lg px-10 py-6 shadow-2xl hover:shadow-primary/25 hover:scale-105 transition-all duration-300 bg-gradient-to-r from-primary to-primary/80">
                <Zap className="h-5 w-5 mr-2" />
                Start Building Now
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-10 py-6 backdrop-blur-sm hover:bg-muted/50 hover:scale-105 transition-all duration-300">
                <Download className="h-5 w-5 mr-2" />
                Explore Tools
              </Button>
            </div>

            {/* Scroll indicator */}
            <div className="mt-16 animate-bounce">
              <ChevronDown className="h-6 w-6 text-muted-foreground mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-primary/20">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="py-24 bg-muted/30 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Choose Our Platform?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for speed, security, and simplicity
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Instant processing with zero wait times. Our tools are optimized for maximum performance.",
                gradient: "from-yellow-500 to-orange-500"
              },
              {
                icon: Lock,
                title: "Privacy First",
                description: "All processing happens in your browser. We never store or access your files.",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: Sparkles,
                title: "No Sign-up Required",
                description: "Jump straight in and start using any tool immediately. No barriers, no friction.",
                gradient: "from-purple-500 to-pink-500"
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="text-center group animate-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
                  <div className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Tools Section */}
      <section id="tools" className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Powerful Tools for Every Need</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional-grade utilities that work instantly in your browser
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-3 px-8 py-4 rounded-2xl border transition-all duration-300 backdrop-blur-sm ${
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground border-primary shadow-xl scale-105"
                      : "bg-background/50 text-muted-foreground border-muted hover:bg-muted/50 hover:text-foreground hover:scale-105"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium text-sm">{category.name}</span>
                </button>
              );
            })}
          </div>

          {/* Tools Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {filteredTools.map((tool, index) => {
              const Icon = tool.icon;
              const ToolCard = (
                <Card className="hover:shadow-2xl transition-all duration-500 cursor-pointer border-0 bg-gradient-to-br from-background/80 to-muted/50 hover:scale-105 group backdrop-blur-sm animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${tool.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <CardTitle className="group-hover:text-primary transition-colors text-lg">{tool.title}</CardTitle>
                      </div>
                    </div>
                    <CardDescription className="text-sm leading-relaxed mt-3">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full group/btn shadow-lg hover:shadow-xl transition-all duration-300">
                      Get Started
                      <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              );

              return tool.link.startsWith("#") ? (
                <div key={tool.id}>{ToolCard}</div>
              ) : (
                <Link key={tool.id} to={tool.link}>
                  {ToolCard}
                </Link>
              );
            })}

            {/* Coming Soon Card */}
            <Card className="hover:shadow-2xl transition-all duration-500 border-dashed border-2 bg-gradient-to-br from-background/80 to-muted/50 hover:scale-105 backdrop-blur-sm animate-fade-in" style={{ animationDelay: `${filteredTools.length * 100}ms` }}>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-muted to-muted/60 rounded-2xl flex items-center justify-center shadow-lg">
                    <Plus className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-muted-foreground text-lg">More Coming Soon!</CardTitle>
                </div>
                <CardDescription className="leading-relaxed mt-3">
                  We're constantly adding new AI-powered tools. Have a suggestion? Let us know!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full group shadow-lg hover:shadow-xl transition-all duration-300">
                  Stay Tuned 
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* No Tools Found State */}
          {filteredTools.length === 0 && (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">No tools found</h3>
              <p className="text-muted-foreground text-lg">
                We're working on adding tools to this category. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Enhanced About Section */}
      <section id="about" className="py-24 bg-muted/30 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-10">Built for Everyone, Everywhere</h2>
            <p className="text-xl text-muted-foreground mb-16 leading-relaxed">
              We believe powerful tools shouldn't come with barriers. That's why we've created a platform 
              where anyone can access professional-grade utilities instantly, securely, and completely free. 
              <br /><br />
              <span className="text-primary font-medium">No accounts • No subscriptions • No complications</span>
              <br />
              Just the tools you need, when you need them.
            </p>
            
            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  title: "Privacy First",
                  description: "All processing happens in your browser. We never see, store, or access your files.",
                  icon: Lock
                },
                {
                  title: "Always Free",
                  description: "Our mission is to democratize access to powerful tools for everyone, everywhere.",
                  icon: Star
                },
                {
                  title: "Constantly Evolving",
                  description: "We're always adding new tools and improving existing ones based on user feedback.",
                  icon: Sparkles
                }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="animate-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-4 text-xl">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="border-t bg-background/50 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary via-primary to-primary/60 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold">ToolKit</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Professional tools for everyone. Free, secure, and always available.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-6 text-lg">Tools</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="/qr-generator" className="hover:text-primary transition-colors">QR Generator</a></li>
                <li><a href="/background-remover" className="hover:text-primary transition-colors">Background Remover</a></li>
                <li><a href="/image-resizer" className="hover:text-primary transition-colors">Image Resizer</a></li>
                <li><a href="/pdf-tools" className="hover:text-primary transition-colors">PDF Tools</a></li>
                <li><a href="/password-generator" className="hover:text-primary transition-colors">Password Generator</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-6 text-lg">Company</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#about" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-6 text-lg">Support</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Feature Requests</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Bug Reports</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 text-center">
            <p className="text-muted-foreground">
              © 2024 ToolKit. Free to use, forever. Built with ❤️ for the internet.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
