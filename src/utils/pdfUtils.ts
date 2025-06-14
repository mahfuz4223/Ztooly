
import { PDFDocument, rgb } from 'pdf-lib';

export const compressPDF = async (file: File, quality: 'low' | 'medium' | 'high' = 'medium'): Promise<Blob> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  
  // Compression settings based on quality
  const compressionSettings = {
    low: { quality: 0.3 },
    medium: { quality: 0.6 },
    high: { quality: 0.8 }
  };
  
  const pdfBytes = await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });
  
  return new Blob([pdfBytes], { type: 'application/pdf' });
};

export const mergePDFs = async (files: File[]): Promise<Blob> => {
  const mergedPdf = await PDFDocument.create();
  
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }
  
  const pdfBytes = await mergedPdf.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
};

export const pdfToImages = async (file: File, format: 'png' | 'jpg' = 'png', dpi: number = 150): Promise<string[]> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Simulate PDF to image conversion (in a real app, you'd use pdf.js or similar)
    // For demo purposes, we'll create placeholder images
    const images: string[] = [];
    
    // Create a sample converted page
    canvas.width = 595;
    canvas.height = 842;
    
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#000000';
      ctx.font = '24px Arial';
      ctx.fillText('Converted PDF Page', 50, 100);
      ctx.fillText(`Format: ${format.toUpperCase()}`, 50, 150);
      ctx.fillText(`DPI: ${dpi}`, 50, 200);
      
      const dataUrl = canvas.toDataURL(`image/${format}`);
      images.push(dataUrl);
    }
    
    setTimeout(() => resolve(images), 1000);
  });
};

export const pdfToWord = async (file: File): Promise<Blob> => {
  // Simulate PDF to Word conversion
  const content = `
    Document converted from PDF: ${file.name}
    
    This is a simulated conversion. In a real implementation, 
    you would use libraries like pdf2pic, pdf-parse, or server-side 
    conversion services to extract text and formatting from PDF files.
    
    Conversion completed successfully!
  `;
  
  return new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
};

export const generatePDFPreview = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 300;
    canvas.height = 400;
    
    if (ctx) {
      // Create a preview thumbnail
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add border
      ctx.strokeStyle = '#dee2e6';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
      
      // Add PDF icon and text
      ctx.fillStyle = '#dc3545';
      ctx.font = 'bold 24px Arial';
      ctx.fillText('PDF', canvas.width / 2 - 25, 50);
      
      ctx.fillStyle = '#6c757d';
      ctx.font = '14px Arial';
      ctx.fillText(file.name, 10, canvas.height - 60);
      ctx.fillText(`Size: ${(file.size / 1024 / 1024).toFixed(2)} MB`, 10, canvas.height - 40);
      ctx.fillText('Click to process', 10, canvas.height - 20);
      
      resolve(canvas.toDataURL());
    }
  });
};
