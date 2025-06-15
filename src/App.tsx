import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useCallback } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import QRGenerator from "./pages/QRGenerator";
import BackgroundRemover from "./pages/BackgroundRemover";
import ImageResizer from "./pages/ImageResizer";
import ImageWatermarker from "./pages/ImageWatermarker";
import ImageEXIFRemover from "./pages/ImageEXIFRemover";
import PDFTools from "./pages/PDFTools";
import PDFToImage from "./pages/PDFToImage";
import JSONTools from "./pages/JSONTools";
import PasswordGenerator from "./pages/PasswordGenerator";
import PrivacyPolicyGenerator from "./pages/PrivacyPolicyGenerator";
import TermsConditionsGenerator from "./pages/TermsConditionsGenerator";
import MarkdownPreviewer from "./pages/MarkdownPreviewer";
import ColorPaletteGenerator from "./pages/ColorPaletteGenerator";
import URLScanner from "./pages/URLScanner";
import PercentageCalculator from "./pages/PercentageCalculator";
import LoanRepaymentCalculator from "./pages/LoanRepaymentCalculator";
import BMICalculator from "./pages/BMICalculator";
import LoremIpsumGenerator from "./pages/LoremIpsumGenerator";
import CaseConverter from "./pages/CaseConverter";
import HashtagGenerator from "./pages/HashtagGenerator";
import ReadingTimeEstimator from "./pages/ReadingTimeEstimator";
import AIHeadlineGenerator from "./pages/AIHeadlineGenerator";
import YouTubeTitleGenerator from "./pages/YouTubeTitleGenerator";
import CSVToJSONConverter from "./pages/CSVToJSONConverter";
import FakeIBANGenerator from "./pages/FakeIBANGenerator";
import BarcodeGenerator from "./pages/BarcodeGenerator";
import FakeCreditCardGenerator from "./pages/FakeCreditCardGenerator";
import FakeAddressGenerator from "./pages/FakeAddressGenerator";
import RandomUserProfileGenerator from "./pages/RandomUserProfileGenerator";
import AIImageCaptionGenerator from "./pages/AIImageCaptionGenerator";
import SocialMediaBioGenerator from "./pages/SocialMediaBioGenerator";
import VideoScriptHookGenerator from "./pages/VideoScriptHookGenerator";
import FakeTweetGenerator from "./pages/FakeTweetGenerator";
import FakeFacebookPostGenerator from "./pages/FakeFacebookPostGenerator";
import TweetToImageConverter from "./pages/TweetToImageConverter";
import CodeSnippetToImage from "./pages/CodeSnippetToImage";
import YouTubeThumbnailGrabber from "./pages/YouTubeThumbnailGrabber";
import InstagramProfileViewer from "./pages/InstagramProfileViewer";
import YouTubeTagExtractor from "./pages/YouTubeTagExtractor";

const queryClient = new QueryClient();

/**
 * Optionally, for demo routes,
 * you might want to have more dynamic configuration here.
 */
const routeTitles: Record<string, string> = {
  "/qr-generator": "QR Generator",
  "/barcode-generator": "Barcode Generator",
  "/code-snippet-to-image": "Code → Image",
  "/youtube-thumbnail-grabber": "YouTube Thumbnail Grabber",
  "/youtube-tag-extractor": "YouTube Tag Extractor",
  "/instagram-profile-viewer": "Instagram Profile Viewer",
  "/background-remover": "Background Remover",
  "/image-resizer": "Image Resizer",
  "/image-watermarker": "Image Watermarker",
  "/image-exif-remover": "EXIF Remover",
  "/pdf-tools": "PDF Tools",
  "/pdf-to-image": "PDF to Image",
  "/json-tools": "JSON Tools",
  "/csv-to-json-converter": "CSV to JSON",
  "/password-generator": "Password Generator",
  "/privacy-policy-generator": "Privacy Policy Generator",
  "/terms-conditions-generator": "Terms & Conditions Generator",
  "/markdown-previewer": "Markdown Previewer",
  "/color-palette-generator": "Palette Generator",
  "/url-scanner": "URL Scanner",
  "/percentage-calculator": "Percentage Calculator",
  "/loan-repayment-calculator": "Loan Repayment",
  "/bmi-calculator": "BMI Calculator",
  "/lorem-ipsum-generator": "Lorem Ipsum",
  "/case-converter": "Case Converter",
  "/hashtag-generator": "Hashtag Generator",
  "/reading-time-estimator": "Reading Time Estimator",
  "/ai-headline-generator": "AI Headline Generator",
  "/youtube-title-generator": "YouTube Title Generator",
  "/social-media-bio-generator": "Social Bio Generator",
  "/video-script-hook-generator": "Script Hook Generator",
  "/ai-image-caption-generator": "AI Image Captioner",
  "/fake-iban-generator": "Fake IBAN Generator",
  "/fake-credit-card-generator": "Fake Credit Card Generator",
  "/fake-address-generator": "Fake Address Generator",
  "/random-user-profile-generator": "Random User Generator",
  "/fake-tweet-generator": "Fake Tweet Generator",
  "/fake-facebook-post-generator": "Fake Fb Post Generator",
  "/tweet-to-image-converter": "Tweet to Image",
};

const AppHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Show a back button except on home ('/')
  const isHomePage = location.pathname === "/";
  const pageTitle = routeTitles[location.pathname] || "";

  // Handle true browser back (or fallback to home)
  const handleBack = useCallback(() => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/");
    }
  }, [navigate]);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-2">
          <div className="flex items-center gap-2">
            {/* Back btn (hidden on home) */}
            {!isHomePage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="mr-1"
                aria-label="Back"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            )}
            {/* Home btn (always visible) */}
            <Link to="/" className="ml-0">
              <Button variant="outline" size="sm" aria-label="Home">
                Home
              </Button>
            </Link>
            {/* Dynamic page title (hidden on home) */}
            {!isHomePage && pageTitle && (
              <span className="ml-2 font-semibold text-base sm:text-lg truncate max-w-xs sm:max-w-lg">{pageTitle}</span>
            )}
          </div>
          {/* Add more global nav actions here if desired */}
          <div className="flex items-center gap-1">
            {/* Example navigation actions */}
            <Link to="/about">
              <Button variant="ghost" size="sm" className="hidden md:inline-flex">About</Button>
            </Link>
            <Link to="/">
              <Button variant="secondary" size="sm" className="hidden md:inline-flex">All Tools</Button>
            </Link>
            {/* Add user/account/profile menu as needed */}
          </div>
        </div>
      </div>
    </nav>
  );
};

const AppContent = () => {
  const location = useLocation();
  // Only show AppHeader when NOT on home page
  const isHomePage = location.pathname === "/";
  return (
    <div className="min-h-screen">
      {!isHomePage && <AppHeader />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/qr-generator" element={<QRGenerator />} />
        <Route path="/barcode-generator" element={<BarcodeGenerator />} />
        <Route path="/code-snippet-to-image" element={<CodeSnippetToImage />} />
        <Route path="/youtube-thumbnail-grabber" element={<YouTubeThumbnailGrabber />} />
        <Route path="/youtube-tag-extractor" element={<YouTubeTagExtractor />} />
        <Route path="/instagram-profile-viewer" element={<InstagramProfileViewer />} />
        <Route path="/background-remover" element={<BackgroundRemover />} />
        <Route path="/image-resizer" element={<ImageResizer />} />
        <Route path="/image-watermarker" element={<ImageWatermarker />} />
        <Route path="/image-exif-remover" element={<ImageEXIFRemover />} />
        <Route path="/pdf-tools" element={<PDFTools />} />
        <Route path="/pdf-to-image" element={<PDFToImage />} />
        <Route path="/json-tools" element={<JSONTools />} />
        <Route path="/csv-to-json-converter" element={<CSVToJSONConverter />} />
        <Route path="/password-generator" element={<PasswordGenerator />} />
        <Route path="/privacy-policy-generator" element={<PrivacyPolicyGenerator />} />
        <Route path="/terms-conditions-generator" element={<TermsConditionsGenerator />} />
        <Route path="/markdown-previewer" element={<MarkdownPreviewer />} />
        <Route path="/color-palette-generator" element={<ColorPaletteGenerator />} />
        <Route path="/url-scanner" element={<URLScanner />} />
        <Route path="/percentage-calculator" element={<PercentageCalculator />} />
        <Route path="/loan-repayment-calculator" element={<LoanRepaymentCalculator />} />
        <Route path="/bmi-calculator" element={<BMICalculator />} />
        <Route path="/lorem-ipsum-generator" element={<LoremIpsumGenerator />} />
        <Route path="/case-converter" element={<CaseConverter />} />
        <Route path="/hashtag-generator" element={<HashtagGenerator />} />
        <Route path="/reading-time-estimator" element={<ReadingTimeEstimator />} />
        <Route path="/ai-headline-generator" element={<AIHeadlineGenerator />} />
        <Route path="/youtube-title-generator" element={<YouTubeTitleGenerator />} />
        <Route path="/social-media-bio-generator" element={<SocialMediaBioGenerator />} />
        <Route path="/video-script-hook-generator" element={<VideoScriptHookGenerator />} />
        <Route path="/ai-image-caption-generator" element={<AIImageCaptionGenerator />} />
        <Route path="/fake-iban-generator" element={<FakeIBANGenerator />} />
        <Route path="/fake-credit-card-generator" element={<FakeCreditCardGenerator />} />
        <Route path="/fake-address-generator" element={<FakeAddressGenerator />} />
        <Route path="/random-user-profile-generator" element={<RandomUserProfileGenerator />} />
        <Route path="/fake-tweet-generator" element={<FakeTweetGenerator />} />
        <Route path="/fake-facebook-post-generator" element={<FakeFacebookPostGenerator />} />
        <Route path="/tweet-to-image-converter" element={<TweetToImageConverter />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
