
import { ArrowLeft, Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

// Updated and more relevant menu links for tool pages
const menuLinks = [
  { href: "/", label: "All Tools" },
  { href: "/help-center", label: "Help Center" },
  { href: "/contact", label: "Contact" },
];

export default function SiteNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isHomePage = location.pathname === "/";

  // Handle the back navigation, fallback to homepage for a more consistent experience
  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 border-b border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Back Button and Logo */}
          <div className="flex items-center space-x-3">
            {/* Back Button (show on non-home pages) */}
            {!isHomePage && (
              <button
                aria-label="Back"
                onClick={handleBack}
                className="mr-2 p-2 rounded-lg bg-muted hover:bg-primary/10 transition-colors flex gap-2 items-center"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline text-base font-medium">Back</span>
              </button>
            )}
            {/* Logo and Brand Name linked to homepage */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative w-10 h-10 bg-gradient-to-br from-primary via-primary to-primary/60 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  className="h-6 w-6 text-primary-foreground relative z-10"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.7" />
                  <circle cx="12" cy="12" r="5" fill="currentColor" opacity="0.5" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl z-0" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary via-purple-600 to-primary/60 bg-clip-text text-transparent select-none">
                ToolKit
              </span>
            </Link>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {menuLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-muted-foreground hover:text-primary transition-all duration-300 font-medium relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open main menu"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 animate-fade-in">
            {menuLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
