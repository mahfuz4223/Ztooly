
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
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
import CSVToJSONConverter from "./pages/CSVToJSONConverter";
import FakeIBANGenerator from "./pages/FakeIBANGenerator";
import BarcodeGenerator from "./pages/BarcodeGenerator";
import FakeCreditCardGenerator from "./pages/FakeCreditCardGenerator";

const queryClient = new QueryClient();

const AppHeader = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  if (isHomePage) return null;
  
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tools
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

const AppContent = () => (
  <div className="min-h-screen">
    <AppHeader />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/qr-generator" element={<QRGenerator />} />
      <Route path="/barcode-generator" element={<BarcodeGenerator />} />
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
      <Route path="/fake-iban-generator" element={<FakeIBANGenerator />} />
      <Route path="/fake-credit-card-generator" element={<FakeCreditCardGenerator />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </div>
);

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
