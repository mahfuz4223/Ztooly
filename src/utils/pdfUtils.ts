
import { PDFDocument, rgb } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export const compressPDF = async (file: File, quality: 'low' | 'medium' | 'high' = 'medium'): Promise<Blob> => {
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
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const images: string[] = [];
  
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const scale = dpi / 72; // Convert DPI to scale factor
    const viewport = page.getViewport({ scale });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    if (context) {
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
      
      const dataUrl = canvas.toDataURL(`image/${format}`, format === 'jpg' ? 0.8 : 1.0);
      images.push(dataUrl);
    }
  }
  
  return images;
};

export const pdfToWord = async (file: File): Promise<Blob> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
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
  
  return new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
};

export const generatePDFPreview = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1); // Get first page
    
    const scale = 0.8; // Scale for thumbnail
    const viewport = page.getViewport({ scale });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    if (context) {
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
      
      return canvas.toDataURL();
    }
  } catch (error) {
    console.error('Error generating PDF preview:', error);
  }
  
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
};
