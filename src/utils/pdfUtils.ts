
import { PDFDocument, rgb } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker with a more reliable setup for Vite
const setupWorker = () => {
  if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
    // Try multiple CDN sources for better reliability
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  }
};

// Initialize worker on module load
setupWorker();

export const compressPDF = async (file: File, quality: 'low' | 'medium' | 'high' = 'medium'): Promise<Blob> => {
  try {
    console.log('Starting PDF compression...');
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Compression settings based on quality
    const compressionSettings = {
      low: { useObjectStreams: true, compress: true },
      medium: { useObjectStreams: true, compress: true },
      high: { useObjectStreams: false, compress: false }
    };
    
    const settings = compressionSettings[quality];
    const pdfBytes = await pdfDoc.save({
      useObjectStreams: settings.useObjectStreams,
      addDefaultPage: false,
    });
    
    console.log('PDF compression completed successfully');
    return new Blob([pdfBytes], { type: 'application/pdf' });
  } catch (error) {
    console.error('Error compressing PDF:', error);
    throw new Error('Failed to compress PDF. Please try again.');
  }
};

export const mergePDFs = async (files: File[]): Promise<Blob> => {
  try {
    console.log('Starting PDF merge...');
    const mergedPdf = await PDFDocument.create();
    
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    
    const pdfBytes = await mergedPdf.save();
    console.log('PDF merge completed successfully');
    return new Blob([pdfBytes], { type: 'application/pdf' });
  } catch (error) {
    console.error('Error merging PDFs:', error);
    throw new Error('Failed to merge PDFs. Please check that all files are valid PDFs.');
  }
};

export const pdfToImages = async (file: File, format: 'png' | 'jpg' = 'png', dpi: number = 150): Promise<string[]> => {
  try {
    console.log('Starting PDF to images conversion with enhanced PDF.js setup...');
    
    // Force worker setup with fallback options
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    }
    
    const arrayBuffer = await file.arrayBuffer();
    
    // Enhanced loading configuration for better compatibility
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      verbosity: 0,
      disableAutoFetch: true,
      disableStream: true,
      disableRange: true,
      useSystemFonts: false,
      cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/cmaps/`,
      cMapPacked: true
    });
    
    const pdf = await loadingTask.promise;
    const images: string[] = [];
    
    // Calculate scale based on DPI (PDF.js default is 72 DPI)
    const scale = dpi / 72;
    
    console.log(`Converting ${pdf.numPages} pages to ${format} at ${dpi} DPI...`);
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) {
        throw new Error('Failed to get canvas 2D context');
      }
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
        enableWebGL: false // Disable WebGL for better compatibility
      };
      
      await page.render(renderContext).promise;
      
      // Convert canvas to data URL with specified format
      const dataUrl = format === 'jpg' 
        ? canvas.toDataURL('image/jpeg', 0.8) 
        : canvas.toDataURL('image/png');
      
      images.push(dataUrl);
      console.log(`Converted page ${pageNum}/${pdf.numPages}`);
    }
    
    console.log(`PDF to images conversion completed. ${images.length} images generated.`);
    return images;
  } catch (error) {
    console.error('Error converting PDF to images:', error);
    throw new Error(`Failed to convert PDF to images: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const pdfToWord = async (file: File): Promise<Blob> => {
  try {
    console.log('Starting PDF to Word conversion...');
    
    // Force worker setup
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    }
    
    const arrayBuffer = await file.arrayBuffer();
    
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      verbosity: 0,
      disableAutoFetch: true,
      disableStream: true,
      disableRange: true
    });
    
    const pdf = await loadingTask.promise;
    let extractedText = '';
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      extractedText += pageText + '\n\n';
    }
    
    // Create a simple text document (in a real app, you'd use a proper Word library)
    const content = `Document converted from PDF: ${file.name}\n\nExtracted Content:\n\n${extractedText}`;
    
    console.log('PDF to Word conversion completed successfully');
    return new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  } catch (error) {
    console.error('Error converting PDF to Word:', error);
    throw new Error('Failed to convert PDF to Word. Please ensure the file is a valid PDF.');
  }
};

export const generatePDFPreview = async (file: File): Promise<string> => {
  try {
    console.log('Generating PDF preview...');
    
    // Force worker setup
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    }
    
    const arrayBuffer = await file.arrayBuffer();
    
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      verbosity: 0,
      disableAutoFetch: true,
      disableStream: true,
      disableRange: true,
      useSystemFonts: false
    });
    
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1); // Get first page
    
    const scale = 0.8; // Scale for thumbnail
    const viewport = page.getViewport({ scale });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      throw new Error('Failed to get canvas 2D context');
    }
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
      enableWebGL: false
    };
    
    await page.render(renderContext).promise;
    console.log('PDF preview generated successfully');
    return canvas.toDataURL();
  } catch (error) {
    console.error('Error generating PDF preview:', error);
    
    // Fallback to basic preview if PDF rendering fails
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = 300;
      canvas.height = 400;
      
      if (ctx) {
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = '#dee2e6';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#dc3545';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PDF', canvas.width / 2, 50);
        
        ctx.fillStyle = '#6c757d';
        ctx.font = '14px Arial';
        ctx.fillText(file.name.substring(0, 30), canvas.width / 2, canvas.height - 60);
        ctx.fillText(`Size: ${(file.size / 1024 / 1024).toFixed(2)} MB`, canvas.width / 2, canvas.height - 40);
        ctx.fillText('Preview unavailable', canvas.width / 2, canvas.height - 20);
        
        resolve(canvas.toDataURL());
      }
    });
  }
};
