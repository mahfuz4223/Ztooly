import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileImage, FileText, Minimize, Merge, Shield, KeyRound, PlusSquare } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const pdfTools = [
  {
    id: "pdf-to-image",
    title: "PDF to Image",
    description: "Convert PDF pages to images (PNG, JPG), high quality with DPI settings.",
    icon: FileImage,
    path: "/pdf-to-image",
    gradient: "from-blue-500 to-blue-600"
  },
  {
    id: "pdf-to-word",
    title: "PDF to Word",
    description: "Convert PDFs to editable Word (DOCX).",
    icon: FileText,
    path: "/pdf-to-word",
    gradient: "from-orange-500 to-orange-600"
  },
  {
    id: "merge-pdf",
    title: "PDF Merger",
    description: "Combine multiple PDF files into one.",
    icon: Merge,
    path: "/pdf-merge",
    gradient: "from-purple-500 to-purple-700"
  },
  {
    id: "compress-pdf",
    title: "PDF Compressor",
    description: "Reduce PDF size while preserving quality.",
    icon: Minimize,
    path: "/pdf-compress",
    gradient: "from-green-500 to-green-600"
  },
  {
    id: "pdf-password",
    title: "Add PDF Password",
    description: "Protect your PDF with a password (encryption).",
    icon: KeyRound,
    path: "/pdf-password",
    gradient: "from-pink-500 to-pink-600"
  },
  // You can easily add more tools here!
];

const PDFTools = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-50 to-slate-200 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-background/90 sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Tools
            </Link>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">PDF Tools Suite</h1>
                <p className="text-sm text-muted-foreground">All-in-one professional PDF utilities</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8 max-w-2xl">
          <h2 className="font-extrabold text-2xl md:text-3xl mb-2 bg-gradient-to-r from-fuchsia-500 to-blue-500 bg-clip-text text-transparent">Powerful PDF Tools — Free & Private</h2>
          <p className="text-lg text-muted-foreground">
            Instantly convert, merge, compress, protect, or transform your PDF files—all securely in your browser. Click any tool to get started.
          </p>
        </div>
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pdfTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card 
                key={tool.id}
                className="hover:scale-105 hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-primary group"
                onClick={() => navigate(tool.path)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 bg-gradient-to-br ${tool.gradient} rounded-xl flex items-center justify-center group-hover:scale-105 transition`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg mb-1">{tool.title}</CardTitle>
                      <CardDescription className="text-xs">{tool.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
          {/* Add more pdf tools here! */}
          <Card className="opacity-60 cursor-not-allowed">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-gradient-to-br from-gray-300 to-gray-400 rounded-xl flex items-center justify-center">
                  <PlusSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg mb-1">More Coming Soon</CardTitle>
                  <CardDescription className="text-xs">OCR, eSign, Split PDF, and more on the way!</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PDFTools;
