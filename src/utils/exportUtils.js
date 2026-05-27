import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const exportToPDF = async (element, name) => {
  if (!element) return;
  
  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      useCORS: true,
      logging: false,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
    const fileName = name ? `${name.replace(/\s+/g, '_')}_Resume.pdf` : 'Resume.pdf';
    pdf.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
  }
};

export const exportToWord = async (element, name) => {
  if (!element) return;
  
  try {
    // Clone the element so we can modify it without affecting the live DOM
    const clone = element.cloneNode(true);
    
    // Convert to inline styles to preserve formatting in Word
    const htmlString = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset="UTF-8">
          <title>Resume</title>
          <style>
            body { font-family: Arial, sans-serif; }
            h1, h2, h3, h4 { color: #2563eb; }
            .timeline-item { margin-bottom: 15px; }
          </style>
        </head>
        <body>
          ${clone.innerHTML}
        </body>
      </html>
    `;
    
    // Create a Blob containing the HTML data wrapped for Word
    const blob = new Blob(['\ufeff', htmlString], { 
      type: 'application/msword' 
    });
    
    const fileName = name ? `${name.replace(/\s+/g, '_')}_Resume.doc` : 'Resume.doc';
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = fileName;
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Error generating Word document:', error);
    alert('Failed to generate Word document. Please try again.');
  }
};
