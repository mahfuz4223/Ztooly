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
  Sparkles,
  Zap,
  Lock,
  Download,
  Star,
  Users,
  Globe,
  ChevronDown,
  MousePointer,
  Workflow,
  Brain,
  Rocket,
  Hash,
  Calculator,
  Palette,
  Eye,
  Type,
  Clock,
  Droplets,
  TrendingUp,
  Heart,
  Scale,
  PenTool,
  FileCode,
  Repeat,
  Link as LinkIcon,
  Activity,
  FileX,
  Shuffle,
  CreditCard,
  User,
  MapPin,
  Banknote,
  Share2,
  Twitter,
  Facebook,
  Camera,
  Youtube,
  Instagram,
  Tag,
  Barcode
} from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { useState, useEffect } from "react";
import SiteFooter from "@/components/SiteFooter";

export default function Index() {
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
    { id: "qr-codes", name: "QR & Barcodes", icon: QrCode },
    { id: "image", name: "Image Tools", icon: ImageIcon },
    { id: "document", name: "Documents", icon: FileText },
    { id: "security", name: "Security & Dev", icon: Shield },
    { id: "calculators", name: "Calculators", icon: Calculator },
    { id: "generators", name: "Generators", icon: PenTool },
    { id: "converters", name: "Converters", icon: Repeat },
    { id: "fake-data", name: "Fake Data", icon: User },
    { id: "ai-content", name: "AI Content", icon: Brain },
    { id: "social-media", name: "Social Media", icon: Share2 },
    { id: "media-tools", name: "Media Tools", icon: Camera }
  ];

  // Map: id → route for those that exist, null/"" for coming soon
  const toolRoutes = {
    "qr-generator": "/qr-generator",
    "barcode-generator": "/barcode-generator",
    "background-remover": "/background-remover",
    "image-resizer": "/image-resizer",
    "image-exif-remover": "/image-exif-remover",
    "image-watermarker": "/image-watermarker",
    "pdf-tools": "/pdf-tools",
    "csv-to-json": "/csv-to-json-converter",
    "markdown-previewer": "/markdown-previewer",
    "password-generator": "/password-generator",
    "json-tools": "/json-tools",
    "url-scanner": "/url-scanner",
    "percentage-calculator": "/percentage-calculator",
    "loan-calculator": "/loan-repayment-calculator",
    "bmi-calculator": "/bmi-calculator",
    "color-palette-generator": "/color-palette-generator",
    "privacy-policy-generator": "/privacy-policy-generator",
    "terms-conditions-generator": "/terms-conditions-generator",
    "lorem-ipsum-generator": "/lorem-ipsum-generator",
    "hashtag-generator": "/hashtag-generator",
    "case-converter": "/case-converter",
    "reading-time-estimator": "/reading-time-estimator",
    "fake-iban-generator": "/fake-iban-generator",
    "fake-credit-card-generator": "/fake-credit-card-generator",
    "fake-address-generator": "/fake-address-generator",
    "random-user-profile-generator": "/random-user-profile-generator",
    "ai-headline-generator": "/ai-headline-generator",
    "image-caption-generator": "/ai-image-caption-generator",
    "youtube-title-generator": "/youtube-title-generator",
    "social-bio-generator": "/social-media-bio-generator",
    "video-script-hook-generator": "/video-script-hook-generator",
    "meme-idea-generator": "", // coming soon
    "fake-tweet-generator": "/fake-tweet-generator",
    "fake-facebook-post-generator": "/fake-facebook-post-generator",
    "tweet-to-image-converter": "/tweet-to-image-converter",
    "text-to-story-image": "", // coming soon
    "code-to-image-converter": "/code-snippet-to-image",
    "youtube-thumbnail-grabber": "/youtube-thumbnail-grabber",
    "instagram-profile-viewer": "/instagram-profile-viewer",
    "youtube-tag-extractor": "/youtube-tag-extractor",
  };

  const tools = [
    // Existing QR & Barcode Tools
    {
      id: "qr-generator",
      title: "Instant QR Codes",
      description: "Create QR codes for websites, Wi-Fi passwords, or contact info in seconds.",
      icon: QrCode,
      category: "qr-codes",
      link: toolRoutes["qr-generator"],
      gradient: "from-blue-500 to-blue-600"
    },
    {
      id: "barcode-generator",
      title: "Barcode Generator",
      description: "Generate various barcode formats including UPC, EAN, Code 128, and more for products and inventory.",
      icon: Barcode,
      category: "qr-codes",
      link: toolRoutes["barcode-generator"],
      gradient: "from-slate-500 to-slate-600"
    },

    // Existing Image Tools
    {
      id: "background-remover",
      title: "Background Remover",
      description: "Remove backgrounds from images instantly. Perfect for logos, products, and profile pictures.",
      icon: Scissors,
      category: "image",
      link: toolRoutes["background-remover"],
      gradient: "from-purple-500 to-purple-600"
    },
    {
      id: "image-resizer",
      title: "Smart Image Resizer",
      description: "Resize images for social media, websites, or email without losing quality.",
      icon: ImageIcon,
      category: "image",
      link: toolRoutes["image-resizer"],
      gradient: "from-green-500 to-green-600"
    },
    {
      id: "image-exif-remover",
      title: "Image EXIF Data Remover",
      description: "Remove metadata and location data from your images to protect your privacy.",
      icon: FileX,
      category: "image",
      link: toolRoutes["image-exif-remover"],
      gradient: "from-pink-500 to-pink-600"
    },
    {
      id: "image-watermarker",
      title: "Image Watermarker",
      description: "Add watermarks to your images to protect your intellectual property and brand.",
      icon: Droplets,
      category: "image",
      link: toolRoutes["image-watermarker"],
      gradient: "from-blue-400 to-blue-500"
    },

    // Existing Document Tools
    {
      id: "pdf-tools",
      title: "PDF Tools",
      description: "Convert, merge, compress, and edit PDFs. All the PDF utilities you need in one place.",
      icon: FileText,
      category: "document",
      link: toolRoutes["pdf-tools"],
      gradient: "from-red-500 to-red-600"
    },
    {
      id: "csv-to-json",
      title: "CSV to JSON Converter",
      description: "Convert CSV files to JSON format instantly. Perfect for data processing and API integration.",
      icon: FileCode,
      category: "converters",
      link: toolRoutes["csv-to-json"],
      gradient: "from-emerald-500 to-emerald-600"
    },
    {
      id: "markdown-previewer",
      title: "Markdown to HTML Previewer",
      description: "Preview and convert Markdown to HTML in real-time. Great for documentation and blogs.",
      icon: Eye,
      category: "converters",
      link: toolRoutes["markdown-previewer"],
      gradient: "from-violet-500 to-violet-600"
    },

    // Existing Security & Dev Tools
    {
      id: "password-generator",
      title: "Secure Password Generator",
      description: "Generate strong, unique passwords. Created on your device—never stored or transmitted.",
      icon: Shield,
      category: "security",
      link: toolRoutes["password-generator"],
      gradient: "from-orange-500 to-orange-600"
    },
    {
      id: "json-tools",
      title: "JSON Tools",
      description: "View, format, and validate JSON data. Essential tools for developers and students.",
      icon: Code,
      category: "security",
      link: toolRoutes["json-tools"],
      gradient: "from-indigo-500 to-indigo-600"
    },
    {
      id: "url-scanner",
      title: "URL Scanner (Link Checker)",
      description: "Check if URLs are safe, working, and accessible. Verify links before sharing or visiting.",
      icon: LinkIcon,
      category: "security",
      link: toolRoutes["url-scanner"],
      gradient: "from-amber-500 to-amber-600"
    },

    // Existing Calculators
    {
      id: "percentage-calculator",
      title: "Percentage Calculator",
      description: "Calculate percentages, percentage change, and percentage of numbers quickly and easily.",
      icon: TrendingUp,
      category: "calculators",
      link: toolRoutes["percentage-calculator"],
      gradient: "from-lime-500 to-lime-600"
    },
    {
      id: "loan-calculator",
      title: "Loan Repayment Calculator",
      description: "Calculate loan payments, interest rates, and repayment schedules for any type of loan.",
      icon: Calculator,
      category: "calculators",
      link: toolRoutes["loan-calculator"],
      gradient: "from-sky-500 to-sky-600"
    },
    {
      id: "bmi-calculator",
      title: "BMI Calculator",
      description: "Calculate your Body Mass Index and get health insights based on your height and weight.",
      icon: Heart,
      category: "calculators",
      link: toolRoutes["bmi-calculator"],
      gradient: "from-red-400 to-red-500"
    },

    // Existing Generators
    {
      id: "color-palette-generator",
      title: "Color Palette Generator",
      description: "Generate beautiful color palettes for your designs. Extract colors from images or create custom schemes.",
      icon: Palette,
      category: "generators",
      link: toolRoutes["color-palette-generator"],
      gradient: "from-rose-500 to-rose-600"
    },
    {
      id: "privacy-policy-generator",
      title: "Privacy Policy Generator",
      description: "Generate GDPR-compliant privacy policies for your website or app in minutes.",
      icon: Shield,
      category: "generators",
      link: toolRoutes["privacy-policy-generator"],
      gradient: "from-slate-500 to-slate-600"
    },
    {
      id: "terms-conditions-generator",
      title: "Terms & Conditions Generator",
      description: "Create professional terms and conditions for your business or website.",
      icon: FileText,
      category: "generators",
      link: toolRoutes["terms-conditions-generator"],
      gradient: "from-zinc-500 to-zinc-600"
    },
    {
      id: "lorem-ipsum-generator",
      title: "Lorem Ipsum Generator",
      description: "Generate placeholder text for your designs and mockups. Customize length and format.",
      icon: Type,
      category: "generators",
      link: toolRoutes["lorem-ipsum-generator"],
      gradient: "from-purple-400 to-purple-500"
    },
    {
      id: "hashtag-generator",
      title: "Hashtag Generator",
      description: "Generate relevant hashtags for social media posts to increase reach and engagement.",
      icon: Hash,
      category: "generators",
      link: toolRoutes["hashtag-generator"],
      gradient: "from-green-400 to-green-500"
    },

    // Existing Text Tools (moved to converters)
    {
      id: "case-converter",
      title: "Case Converter",
      description: "Convert text between different cases: uppercase, lowercase, title case, camelCase, and more.",
      icon: Type,
      category: "converters",
      link: toolRoutes["case-converter"],
      gradient: "from-orange-400 to-orange-500"
    },
    {
      id: "reading-time-estimator",
      title: "Reading Time Estimator",
      description: "Calculate reading time for your content. Perfect for blogs, articles, and documentation.",
      icon: Clock,
      category: "calculators",
      link: toolRoutes["reading-time-estimator"],
      gradient: "from-teal-500 to-teal-600"
    },

    // NEW FAKE DATA GENERATORS
    {
      id: "fake-iban-generator",
      title: "Fake IBAN Generator",
      description: "Generate realistic IBAN numbers for testing banking applications and payment systems.",
      icon: Banknote,
      category: "fake-data",
      link: toolRoutes["fake-iban-generator"],
      gradient: "from-emerald-600 to-teal-600"
    },
    {
      id: "fake-credit-card-generator",
      title: "Fake Credit Card Generator",
      description: "Generate test credit card numbers for development and testing purposes only.",
      icon: CreditCard,
      category: "fake-data",
      link: toolRoutes["fake-credit-card-generator"],
      gradient: "from-blue-600 to-indigo-600"
    },
    {
      id: "fake-address-generator",
      title: "Fake Address Generator",
      description: "Generate realistic addresses for testing and development purposes worldwide.",
      icon: MapPin,
      category: "fake-data",
      link: toolRoutes["fake-address-generator"],
      gradient: "from-red-600 to-pink-600"
    },
    {
      id: "random-user-profile-generator",
      title: "Random User Profile Generator",
      description: "Generate complete fake user profiles with names, addresses, emails, and more for testing.",
      icon: User,
      category: "fake-data",
      link: toolRoutes["random-user-profile-generator"],
      gradient: "from-purple-600 to-violet-600"
    },

    // NEW AI-POWERED CONTENT TOOLS
    {
      id: "ai-headline-generator",
      title: "AI Headline Generator",
      description: "Generate compelling headlines for your content using AI. Perfect for blogs, ads, and social media.",
      icon: Brain,
      category: "ai-content",
      link: toolRoutes["ai-headline-generator"],
      gradient: "from-cyan-500 to-cyan-600"
    },
    {
      id: "image-caption-generator",
      title: "AI Image Caption Generator",
      description: "Generate descriptive captions for your images using advanced AI technology.",
      icon: ImageIcon,
      category: "ai-content",
      link: toolRoutes["image-caption-generator"],
      gradient: "from-indigo-600 to-purple-600"
    },
    {
      id: "youtube-title-generator",
      title: "YouTube Title Idea Generator",
      description: "Generate catchy and engaging YouTube video titles using AI to boost your views.",
      icon: Youtube,
      category: "ai-content",
      link: toolRoutes["youtube-title-generator"],
      gradient: "from-red-600 to-red-500"
    },
    {
      id: "social-bio-generator",
      title: "Social Media Bio Generator",
      description: "Create engaging social media bios for all platforms using AI-powered suggestions.",
      icon: Share2,
      category: "ai-content",
      link: toolRoutes["social-bio-generator"],
      gradient: "from-pink-600 to-rose-600"
    },
    {
      id: "video-script-hook-generator",
      title: "Video Script Hook Generator",
      description: "Generate compelling hooks for your short videos to increase engagement and retention.",
      icon: Camera,
      category: "ai-content",
      link: toolRoutes["video-script-hook-generator"],
      gradient: "from-orange-600 to-amber-600"
    },
    {
      id: "meme-idea-generator",
      title: "AI Meme Idea Generator",
      description: "Generate viral meme ideas and concepts using AI to boost your social media presence.",
      icon: Sparkles,
      category: "ai-content",
      link: toolRoutes["meme-idea-generator"],
      gradient: "from-yellow-600 to-orange-600"
    },

    // NEW SOCIAL MEDIA TOOLS
    {
      id: "fake-tweet-generator",
      title: "Fake Tweet Generator",
      description: "Create realistic-looking fake tweets for presentations, mockups, and educational content.",
      icon: Twitter,
      category: "social-media",
      link: toolRoutes["fake-tweet-generator"],
      gradient: "from-blue-500 to-sky-500"
    },
    {
      id: "fake-facebook-post-generator",
      title: "Fake Facebook Post Generator",
      description: "Generate fake Facebook posts for design mockups and educational demonstrations.",
      icon: Facebook,
      category: "social-media",
      link: toolRoutes["fake-facebook-post-generator"],
      gradient: "from-blue-600 to-blue-700"
    },

    // NEW CONTENT CONVERTERS
    {
      id: "tweet-to-image-converter",
      title: "Tweet to Image Converter",
      description: "Convert tweets into beautiful, shareable images for Instagram, LinkedIn, and other platforms.",
      icon: ImageIcon,
      category: "converters",
      link: toolRoutes["tweet-to-image-converter"],
      gradient: "from-cyan-600 to-blue-600"
    },
    {
      id: "text-to-story-image",
      title: "Text to Instagram Story",
      description: "Transform text content into visually appealing Instagram story images with custom designs.",
      icon: Instagram,
      category: "converters",
      link: toolRoutes["text-to-story-image"],
      gradient: "from-pink-500 to-purple-500"
    },
    {
      id: "code-to-image-converter",
      title: "Code Snippet to Image",
      description: "Convert code snippets into beautiful, syntax-highlighted images for sharing and presentations.",
      icon: Code,
      category: "converters",
      link: toolRoutes["code-to-image-converter"],
      gradient: "from-gray-600 to-slate-600"
    },

    // NEW MEDIA & ASSET GRABBERS
    {
      id: "youtube-thumbnail-grabber",
      title: "YouTube Thumbnail Grabber",
      description: "Extract and download high-quality thumbnails from any YouTube video instantly.",
      icon: Youtube,
      category: "media-tools",
      link: toolRoutes["youtube-thumbnail-grabber"],
      gradient: "from-red-500 to-red-600"
    },
    {
      id: "instagram-profile-viewer",
      title: "Instagram Profile Picture Viewer",
      description: "View and download Instagram profile pictures in high definition quality.",
      icon: Instagram,
      category: "media-tools",
      link: toolRoutes["instagram-profile-viewer"],
      gradient: "from-purple-500 via-pink-500 to-orange-500"
    },
    {
      id: "youtube-tag-extractor",
      title: "YouTube Video Tag Extractor",
      description: "Extract tags and metadata from YouTube videos to analyze content strategies.",
      icon: Tag,
      category: "media-tools",
      link: toolRoutes["youtube-tag-extractor"],
      gradient: "from-teal-600 to-green-600"
    }
  ];

  const filteredTools = selectedCategory === "all" 
    ? tools 
    : tools.filter(tool => tool.category === selectedCategory);

  const stats = [
    { label: "Active Users", value: "100K+", icon: Users },
    { label: "Tools Available", value: "50+", icon: Sparkles },
    { label: "Countries", value: "180+", icon: Globe },
    { label: "User Rating", value: "4.9", icon: Star }
  ];

  // Add scroll-to-tools for CTA buttons
  const scrollToTools = () => {
    const toolsSection = document.getElementById("tools");
    if (toolsSection) {
      toolsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Enhanced Interactive Background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Dynamic Grid Network */}
        <div className="absolute inset-0">
          <svg className="w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-primary/40"/>
              </pattern>
              <radialGradient id="mouseGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.4"/>
                <stop offset="30%" stopColor="rgb(147, 51, 234)" stopOpacity="0.3"/>
                <stop offset="60%" stopColor="rgb(239, 68, 68)" stopOpacity="0.2"/>
                <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floating Network Nodes with Enhanced Animation */}
        <div className="absolute top-20 left-20 w-3 h-3 bg-blue-500/70 rounded-full blur-sm animate-pulse shadow-lg shadow-blue-500/50" />
        <div className="absolute top-40 right-32 w-2 h-2 bg-purple-500/70 rounded-full blur-sm animate-pulse delay-1000 shadow-lg shadow-purple-500/50" />
        <div className="absolute bottom-32 left-1/4 w-4 h-4 bg-green-500/70 rounded-full blur-sm animate-pulse delay-2000 shadow-lg shadow-green-500/50" />
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-yellow-500/70 rounded-full blur-sm animate-pulse delay-500 shadow-lg shadow-yellow-500/50" />
        <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-pink-500/70 rounded-full blur-sm animate-pulse delay-1500 shadow-lg shadow-pink-500/50" />
        
        {/* Enhanced Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/15 via-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-l from-purple-500/15 via-pink-500/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-t from-green-500/15 via-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse delay-2000" />
        
        {/* Enhanced Interactive Mouse Following Gradient - Enhanced */}
        <div 
          className="absolute w-[600px] h-[600px] rounded-full blur-3xl transition-all duration-700 ease-out opacity-60"
          style={{
            left: mousePosition.x - 300,
            top: mousePosition.y - 300,
            background: `radial-gradient(circle, 
              rgba(59, 130, 246, 0.4) 0%, 
              rgba(147, 51, 234, 0.3) 25%, 
              rgba(239, 68, 68, 0.2) 50%, 
              rgba(34, 197, 94, 0.1) 75%, 
              transparent 100%)`
          }}
        />

        {/* Enhanced Grid Pattern with Color Variations */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_110%)]" />
        
        {/* Animated Connection Lines with Enhanced Effects */}
        <div className="absolute inset-0">
          <svg className="w-full h-full opacity-20" viewBox="0 0 1920 1080">
            <defs>
              <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.8"/>
                <stop offset="50%" stopColor="rgb(147, 51, 234)" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="rgb(239, 68, 68)" stopOpacity="0.4"/>
              </linearGradient>
              <linearGradient id="lineGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity="0.8"/>
                <stop offset="50%" stopColor="rgb(59, 130, 246)" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="rgb(147, 51, 234)" stopOpacity="0.4"/>
              </linearGradient>
            </defs>
            <line x1="200" y1="200" x2="800" y2="400" stroke="url(#lineGrad1)" strokeWidth="2" className="animate-pulse">
              <animate attributeName="stroke-dasharray" values="0,1000;1000,0;0,1000" dur="8s" repeatCount="indefinite"/>
            </line>
            <line x1="1200" y1="300" x2="400" y2="700" stroke="url(#lineGrad2)" strokeWidth="2" className="animate-pulse delay-1000">
              <animate attributeName="stroke-dasharray" values="0,1000;1000,0;0,1000" dur="10s" repeatCount="indefinite"/>
            </line>
            <line x1="600" y1="100" x2="1400" y2="600" stroke="url(#lineGrad1)" strokeWidth="1" className="animate-pulse delay-500">
              <animate attributeName="stroke-dasharray" values="0,800;800,0;0,800" dur="12s" repeatCount="indefinite"/>
            </line>
          </svg>
        </div>
      </div>

      {/* Enhanced Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-6xl mx-auto">
            {/* Floating Badge */}
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 backdrop-blur-sm animate-fade-in shadow-lg">
              <Brain className="h-4 w-4 mr-2" />
              AI-Powered Tools Platform
              <div className="ml-3 px-2 py-1 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full text-xs flex items-center">
                <Sparkles className="h-3 w-3 mr-1" />
                50+ TOOLS
              </div>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 animate-fade-in leading-none">
              <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                Your Digital
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent relative">
                Powerhouse
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 blur-2xl -z-10 rounded-full"></div>
              </span>
            </h1>
            
            {/* Enhanced Description */}
            <p className="text-lg md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in delay-200">
              Transform your workflow with our collection of 
              <span className="text-primary font-semibold"> AI-enhanced tools</span>. 
              <br />
              <span className="text-base md:text-lg bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent font-medium">
                ⚡ No accounts • 🔒 Privacy first • 🚀 Instant results
              </span>
            </p>
            
            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in delay-300 mb-16">
              <Button
                size="lg"
                className="text-lg px-10 py-6 shadow-2xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300 bg-gradient-to-r from-primary via-purple-600 to-primary/80 relative overflow-hidden group"
                onClick={scrollToTools}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <Rocket className="h-5 w-5 mr-3" />
                Start Creating Now
                <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-10 py-6 backdrop-blur-sm hover:bg-muted/50 hover:scale-105 transition-all duration-300 border-2 group"
                onClick={scrollToTools}
              >
                <MousePointer className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform" />
                Explore Tools
              </Button>
            </div>

            {/* Interactive Stats Preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-fade-in delay-500">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="text-center group cursor-pointer" style={{ animationDelay: `${600 + index * 100}ms` }}>
                    <div className="w-16 h-16 bg-gradient-to-br from-background/80 to-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm border border-primary/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <Icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{stat.value}</div>
                    <div className="text-xs md:text-sm text-muted-foreground font-medium">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Scroll indicator */}
            <div className="mt-16 animate-bounce delay-1000">
              <div className="flex flex-col items-center">
                <span className="text-sm text-muted-foreground mb-2 font-medium">Discover More</span>
                <ChevronDown className="h-6 w-6 text-primary animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="py-20 bg-muted/20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Our Platform?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
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
      <section id="tools" className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Tools for Every Need</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional-grade utilities that work instantly in your browser
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all duration-300 backdrop-blur-sm text-sm font-medium ${
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                      : "bg-background/50 text-muted-foreground border-muted hover:bg-muted/50 hover:text-foreground hover:scale-105"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>

          {/* Tools Grid - Fixed Layout */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {filteredTools.map((tool, index) => {
              const Icon = tool.icon;
              const ToolCard = (
                <Card className="hover:shadow-xl transition-all duration-500 cursor-pointer border-0 bg-gradient-to-br from-background/80 to-muted/50 hover:scale-105 group backdrop-blur-sm animate-fade-in h-full flex flex-col" style={{ animationDelay: `${index * 50}ms` }}>
                  <CardHeader className="pb-3 flex-shrink-0">
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${tool.gradient} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="group-hover:text-primary transition-colors text-base leading-tight">{tool.title}</CardTitle>
                      </div>
                    </div>
                    <CardDescription className="text-sm leading-relaxed mt-2 flex-grow">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 mt-auto">
                    {/* If the tool's link is defined, render the button */}
                    {tool.link ? (
                      <RouterLink to={tool.link}>
                        <Button size="sm" className="w-full group/btn shadow-md hover:shadow-lg transition-all duration-300">
                          Get Started
                          <ArrowRight className="h-3 w-3 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </RouterLink>
                    ) : (
                      <Button size="sm" variant="outline" className="w-full group/btn shadow-md hover:shadow-lg transition-all duration-300 opacity-60 cursor-not-allowed" disabled>
                        Coming Soon
                        <ArrowRight className="h-3 w-3 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );

              // Always render ToolCard directly, link is within CardContent now
              return <div key={tool.id} className="h-full">{ToolCard}</div>;
            })}

            {/* Coming Soon Card with consistent height */}
            <Card className="opacity-60 cursor-not-allowed h-full flex flex-col">
              <CardHeader className="pb-3 flex-shrink-0">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-400 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Plus className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base leading-tight">More Coming Soon</CardTitle>
                  </div>
                </div>
                <CardDescription className="text-sm leading-relaxed mt-2 flex-grow">
                  OCR, eSign, Split PDF, and more exciting tools are on the way!
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 mt-auto">
                <Button size="sm" variant="outline" className="w-full opacity-60 cursor-not-allowed" disabled>
                  Coming Soon
                  <ArrowRight className="h-3 w-3 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* No Tools Found State */}
          {filteredTools.length === 0 && (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Shuffle className="h-10 w-10 text-muted-foreground" />
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
      <section id="about" className="py-20 bg-muted/20 relative z-10">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">About ToolKit</h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            ToolKit is your all-in-one platform for professional-grade digital utilities. We focus on speed, privacy, and ease of use, providing a wide range of tools that run entirely in your browser.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Whether you need to generate QR codes, remove image backgrounds, create strong passwords, or leverage AI-powered content generators, ToolKit has you covered. No sign-ups, no data collection, just powerful tools at your fingertips.
          </p>
        </div>
      </section>

      {/* Render the correct single footer only */}
      <SiteFooter />
    </div>
  );
}
