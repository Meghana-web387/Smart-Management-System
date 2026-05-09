import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

/**
 * Robust PDF Export using a standalone autoTable call
 */
export const exportToPDF = (data, fileName, title) => {
  try {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235); // Blue-600
    doc.text(title, 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`SmartMS Analytics | Generated on: ${new Date().toLocaleString()}`, 14, 28);
    
    // Line
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 32, 196, 32);

    // Data Preparation
    const headers = [Object.keys(data[0]).map(k => k.toUpperCase())];
    const body = data.map(obj => Object.values(obj));

    // Standalone autoTable call
    autoTable(doc, {
      head: headers,
      body: body,
      startY: 40,
      styles: { fontSize: 9, cellPadding: 4, font: 'helvetica' },
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [245, 247, 250] },
      margin: { top: 40 }
    });

    doc.save(`${fileName}.pdf`);
  } catch (err) {
    console.error("PDF Export failed:", err);
    alert("PDF generation failed. Re-syncing system...");
  }
};

/**
 * Robust Excel Export
 */
export const exportToExcel = (data, fileName) => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  } catch (err) {
    alert("Excel download failed.");
  }
};
