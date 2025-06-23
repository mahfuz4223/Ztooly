import { 
  ArrowLeft, 
  Menu, 
  X, 
  Zap, 
  Wrench, 
  Search,
  Moon,
  Sun,
  Star,
  Github,
  Twitter,
  ChevronDown,
  QrCode,
  ImageIcon,
  FileText,
  Shield,
  Calculator,
  PenTool,
  Repeat,
  User,
  Brain,
  Share2,
  Camera,
  TrendingUp,
  Heart,
  ExternalLink,
  Command,
  Bookmark,
  Clock
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Tool categories with their respective tools
const toolCategories = [
  {
    id: "qr-codes",
    name: "QR & Barcodes",
    icon: QrCode,
    tools: [
      { name: "QR Generator", href: "/qr-generator", description: "Create QR codes instantly" },
      { name: "Barcode Generator", href: "/barcode-generator", description: "Generate various barcode formats" }
    ]
  },
  {
    id: "image",
    name: "Image Tools",
    icon: ImageIcon,
    tools: [
      { name: "Background Remover", href: "/background-remover", description: "Remove image backgrounds" },
      { name: "Image Resizer", href: "/image-resizer", description: "Resize images for any platform" },
      { name: "Image EXIF Remover", href: "/image-exif-remover", description: "Remove metadata from images" },
      { name: "Image Watermarker", href: "/image-watermarker", description: "Add watermarks to images" }
    ]
  },
  {
    id: "document",
    name: "Documents",
    icon: FileText,
    tools: [
      { name: "PDF Tools", href: "/pdf-tools", description: "Comprehensive PDF utilities" },
      { name: "Markdown Previewer", href: "/markdown-previewer", description: "Preview Markdown in real-time" }
    ]
  },
  {
    id: "security",
    name: "Security & Dev",
    icon: Shield,
    tools: [
      { name: "Password Generator", href: "/password-generator", description: "Generate secure passwords" },
      { name: "JSON Tools", href: "/json-tools", description: "Format and validate JSON" },
      { name: "URL Scanner", href: "/url-scanner", description: "Scan URLs for safety" }
    ]
  },
  {
    id: "calculators",
    name: "Calculators",
    icon: Calculator,
    tools: [
      { name: "BMI Calculator", href: "/bmi-calculator", description: "Calculate body mass index" },
      { name: "Percentage Calculator", href: "/percentage-calculator", description: "Calculate percentages" },
      { name: "Loan Calculator", href: "/loan-repayment-calculator", description: "Calculate loan payments" }
    ]
  },
  {
    id: "generators",
    name: "Generators",
    icon: PenTool,
    tools: [
      { name: "Color Palette Generator", href: "/color-palette-generator", description: "Generate color palettes" },
      { name: "Lorem Ipsum Generator", href: "/lorem-ipsum-generator", description: "Generate placeholder text" },
      { name: "Hashtag Generator", href: "/hashtag-generator", description: "Generate trending hashtags" },
      { name: "Privacy Policy Generator", href: "/privacy-policy-generator", description: "Create privacy policies" },
      { name: "Terms Generator", href: "/terms-conditions-generator", description: "Generate terms & conditions" }
    ]
  },
  {
    id: "converters",
    name: "Converters",
    icon: Repeat,
    tools: [
      { name: "CSV to JSON", href: "/csv-to-json-converter", description: "Convert CSV to JSON" },
      { name: "Case Converter", href: "/case-converter", description: "Convert text case" },
      { name: "Code to Image", href: "/code-snippet-to-image", description: "Convert code to images" },
      { name: "Tweet to Image", href: "/tweet-to-image-converter", description: "Convert tweets to images" }
    ]
  },
  {
    id: "fake-data",
    name: "Fake Data",
    icon: User,
    tools: [
      { name: "Fake Address Generator", href: "/fake-address-generator", description: "Generate fake addresses" },
      { name: "Fake Credit Card", href: "/fake-credit-card-generator", description: "Generate test credit cards" },
      { name: "Fake IBAN Generator", href: "/fake-iban-generator", description: "Generate test IBAN codes" },
      { name: "Random User Profile", href: "/random-user-profile-generator", description: "Generate user profiles" },
      { name: "Fake Tweet Generator", href: "/fake-tweet-generator", description: "Create fake tweets" },
      { name: "Fake Facebook Post", href: "/fake-facebook-post-generator", description: "Create fake Facebook posts" }
    ]
  },
  {
    id: "ai-content",
    name: "AI Content",
    icon: Brain,
    tools: [
      { name: "AI Headlines", href: "/ai-headline-generator", description: "Generate catchy headlines" },
      { name: "Image Captions", href: "/ai-image-caption-generator", description: "AI-powered image captions" },
      { name: "YouTube Titles", href: "/youtube-title-generator", description: "Generate YouTube titles" },
      { name: "Video Script Hooks", href: "/video-script-hook-generator", description: "Create engaging video hooks" }
    ]
  },
  {
    id: "social-media",
    name: "Social Media",
    icon: Share2,
    tools: [
      { name: "Social Bio Generator", href: "/social-media-bio-generator", description: "Create social media bios" },
      { name: "Instagram Viewer", href: "/instagram-profile-viewer", description: "View Instagram profiles" },
      { name: "YouTube Thumbnails", href: "/youtube-thumbnail-grabber", description: "Extract YouTube thumbnails" },
      { name: "YouTube Tags", href: "/youtube-tag-extractor", description: "Extract YouTube tags" }
    ]
  },
  {
    id: "media-tools",
    name: "Media Tools",
    icon: Camera,
    tools: [
      { name: "Reading Time", href: "/reading-time-estimator", description: "Estimate reading time" }
    ]
  }
];

const quickLinks = [
  { href: "/", label: "All Tools", icon: Zap },
  { href: "/help-center", label: "Help Center", icon: Heart },
  { href: "/contact", label: "Contact", icon: ExternalLink },
];

const socialLinks = [
  { href: "https://github.com", label: "GitHub", icon: Github },
  { href: "https://twitter.com", label: "Twitter", icon: Twitter }
];

export default function SiteNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  
  const isHomePage = location.pathname === "/";

  // Get all tools for search functionality
  const allTools = toolCategories.flatMap(category => 
    category.tools.map(tool => ({
      ...tool,
      category: category.name,
      categoryIcon: category.icon
    }))
  );

  // Filter tools based on search query
  const filteredTools = allTools.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle dark mode toggle
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Handle favorites
  const toggleFavorite = (toolHref: string) => {
    setFavorites(prev => 
      prev.includes(toolHref) 
        ? prev.filter(fav => fav !== toolHref)
        : [...prev, toolHref]
    );
  };

  // Handle back navigation
  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };
  // Handle search
  const handleSearch = (tool: { href: string; name: string; description: string; category: string }) => {
    navigate(tool.href);
    setSearchOpen(false);
    setSearchQuery("");
    setMobileMenuOpen(false);
  };

  // Handle click outside for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setMegaMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === 'Escape') {
        setSearchOpen(false);
        setMegaMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Section: Back Button + Logo */}
          <div className="flex items-center space-x-3">
            {!isHomePage && (
              <button
                onClick={handleBack}
                className="mr-2 p-2 rounded-lg bg-muted hover:bg-primary/10 transition-all duration-200 flex gap-2 items-center group"
                aria-label="Go back"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                <span className="hidden sm:inline text-sm font-medium">Back</span>
              </button>
            )}
              <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative w-10 h-10 bg-gradient-to-br from-primary via-primary to-primary/60 rounded-xl flex items-center justify-center shadow-lg overflow-hidden group-hover:shadow-xl group-hover:shadow-primary/25 transition-all duration-300">
                <Wrench className="h-5 w-5 text-primary-foreground relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary via-purple-600 to-primary/60 bg-clip-text text-transparent">
                Ztooly
              </span>
            </Link>
          </div>

          {/* Center Section: Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Tools Mega Menu */}
            <div className="relative" ref={megaMenuRef}>
              <button
                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted/50 transition-all duration-200 font-medium"
              >
                <span>Tools</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${megaMenuOpen ? 'rotate-180' : ''}`} />
              </button>
                {/* Mega Menu Dropdown */}
              {megaMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-[1000px] max-w-[95vw] bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {toolCategories.map((category) => (
                      <div key={category.id} className="space-y-3">
                        <div className="flex items-center space-x-2 text-sm font-semibold text-foreground border-b border-border/30 pb-2">
                          <category.icon className="h-4 w-4 text-primary" />
                          <span>{category.name}</span>
                          <span className="text-xs text-muted-foreground">({category.tools.length})</span>
                        </div>
                        <div className="space-y-2">
                          {category.tools.map((tool) => (
                            <Link
                              key={tool.href}
                              to={tool.href}
                              onClick={() => setMegaMenuOpen(false)}
                              className="block p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                            >
                              <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                {tool.name}
                              </div>
                              <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                {tool.description}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* View All Tools */}
                  <div className="mt-6 pt-4 border-t border-border/50">
                    <Link
                      to="/"
                      onClick={() => setMegaMenuOpen(false)}
                      className="flex items-center justify-center space-x-2 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors group w-full"
                    >
                      <Zap className="h-4 w-4 text-primary" />
                      <span className="font-medium text-primary">View All {toolCategories.reduce((total, cat) => total + cat.tools.length, 0)} Tools</span>
                      <ArrowLeft className="h-4 w-4 text-primary rotate-180 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Links */}
            {quickLinks.slice(1).map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted/50 transition-all duration-200 font-medium"
              >
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Right Section: Search + Actions */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative" ref={searchRef}>
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground min-w-[200px] justify-start"
              >
                <Search className="h-4 w-4" />
                <span className="text-sm">Search tools...</span>
                <div className="ml-auto flex items-center space-x-1 text-xs">
                  <Command className="h-3 w-3" />
                  <span>K</span>
                </div>
              </button>
              
              <button
                onClick={() => setSearchOpen(true)}
                className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Search Dropdown */}
              {searchOpen && (
                <div className="absolute top-full right-0 mt-2 w-[400px] max-w-[90vw] bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
                  <div className="p-4 border-b border-border/50">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search tools..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4"
                        autoFocus
                      />
                    </div>
                  </div>
                  
                  <div className="max-h-[400px] overflow-y-auto">
                    {searchQuery ? (
                      filteredTools.length > 0 ? (
                        <div className="p-2">
                          {filteredTools.slice(0, 8).map((tool) => (
                            <button
                              key={tool.href}
                              onClick={() => handleSearch(tool)}
                              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                            >
                              <tool.categoryIcon className="h-4 w-4 text-primary flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-foreground truncate">{tool.name}</div>
                                <div className="text-xs text-muted-foreground truncate">{tool.description}</div>
                              </div>
                              <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                                {tool.category}
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 text-center text-muted-foreground">
                          <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No tools found for "{searchQuery}"</p>
                        </div>
                      )
                    ) : (
                      <div className="p-4">
                        <div className="text-sm font-medium text-foreground mb-3">Quick Access</div>
                        <div className="space-y-1">
                          {favorites.length > 0 ? (
                            favorites.slice(0, 5).map((fav) => {
                              const tool = allTools.find(t => t.href === fav);
                              return tool ? (
                                <button
                                  key={tool.href}
                                  onClick={() => handleSearch(tool)}
                                  className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors text-left"
                                >
                                  <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                                  <span className="font-medium text-foreground">{tool.name}</span>
                                </button>
                              ) : null;
                            })
                          ) : (
                            <div className="text-center py-6 text-muted-foreground">
                              <Bookmark className="h-6 w-6 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">No favorites yet</p>
                              <p className="text-xs">Star tools to see them here</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Social Links - Desktop Only */}
            <div className="hidden lg:flex items-center space-x-1">
              {socialLinks.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
            <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Mobile Quick Links */}
              <div className="space-y-2">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <link.icon className="h-5 w-5 text-primary" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                ))}
              </div>              {/* Mobile Tool Categories */}
              <div className="border-t border-border/50 pt-4">
                <div className="text-sm font-semibold text-foreground mb-3 px-3">All Tool Categories</div>
                <div className="space-y-3">
                  {toolCategories.map((category) => (
                    <div key={category.id} className="space-y-2">
                      <div className="flex items-center justify-between px-3 text-sm font-medium text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <category.icon className="h-4 w-4" />
                          <span>{category.name}</span>
                        </div>
                        <span className="text-xs bg-muted px-2 py-1 rounded">
                          {category.tools.length}
                        </span>
                      </div>
                      <div className="pl-6 space-y-1">
                        {category.tools.map((tool) => (
                          <Link
                            key={tool.href}
                            to={tool.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block p-2 rounded-lg hover:bg-muted/50 transition-colors text-sm"
                          >
                            {tool.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Social Links */}
              <div className="border-t border-border/50 pt-4">
                <div className="flex items-center justify-center space-x-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.href}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <social.icon className="h-5 w-5" />
                      <span className="text-sm">{social.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
