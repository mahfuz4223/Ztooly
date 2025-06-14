import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import QRGenerator from "./pages/QRGenerator";
import BackgroundRemover from "./pages/BackgroundRemover";
import ImageResizer from "./pages/ImageResizer";
import PDFTools from "./pages/PDFTools";
import PDFToImage from "./pages/PDFToImage";
import JSONTools from "./pages/JSONTools";
import PasswordGenerator from "./pages/PasswordGenerator";
import PrivacyPolicyGenerator from "./pages/PrivacyPolicyGenerator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/qr-generator" element={<QRGenerator />} />
          <Route path="/background-remover" element={<BackgroundRemover />} />
          <Route path="/image-resizer" element={<ImageResizer />} />
          <Route path="/pdf-tools" element={<PDFTools />} />
          <Route path="/pdf-to-image" element={<PDFToImage />} />
          <Route path="/json-tools" element={<JSONTools />} />
          <Route path="/password-generator" element={<PasswordGenerator />} />
          <Route path="/privacy-policy-generator" element={<PrivacyPolicyGenerator />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
