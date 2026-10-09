import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Exports Executive Package Profitability Statement as a styled A4 PDF Document (Landscape)
 */
export function exportPackageProfitabilityPDF({
  list = [],
  activeProvider = 'KhmerTopUp',
  gameFilter = 'ALL',
  filename = `MLBB_TopUp_Package_Profitability_A4_${new Date().toISOString().slice(0, 10)}.pdf`
}) {
  if (!list || list.length === 0) return;

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4' // Standard A4: 297mm x 210mm
  });

  const totalCount = list.length;
  const sumRevenue = list.reduce((acc, p) => acc + (Number(p.totalRevenue || 0) || (Number(p.retailPrice || 0) * Number(p.unitsSold || 0))), 0);
  const sumCost = list.reduce((acc, p) => acc + Number(p.totalProviderCost || p.providerCost || 0), 0);
  const sumProfit = list.reduce((acc, p) => acc + (Number(p.totalProfit || 0) || (Number(p.unitNetProfit || 0) * Number(p.unitsSold || 0))), 0);
  const avgMargin = totalCount > 0 ? (list.reduce((acc, p) => acc + Number(p.retailMarginPct || 0), 0) / totalCount).toFixed(1) : '0.0';

  // 1. Header Banner Box
  doc.setFillColor(15, 23, 42); // #0F172A Dark Navy
  doc.rect(0, 0, 297, 24, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text('MLBB TOPUP STORE — EXECUTIVE PACKAGE PROFITABILITY STATEMENT', 10, 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184); // #94A3B8
  doc.text(`Generated: ${new Date().toLocaleString()}  |  Active Supplier: ${activeProvider}  |  Catalog Scope: ${gameFilter.toUpperCase()} (${totalCount} Packages)`, 10, 17);

  // 2. KPI Summary Cards (Top Block on Page 1)
  const cardY = 28;
  const cardW = 53;
  const cardH = 14;
  const gap = 3.5;
  let startX = 10;

  const kpis = [
    { label: 'CATALOG PACKAGES', val: `${totalCount} Pkgs`, color: [15, 23, 42] },
    { label: 'TOTAL REVENUE', val: `$${sumRevenue.toFixed(2)}`, color: [2, 132, 199] },
    { label: 'SUPPLIER COGS', val: `$${sumCost.toFixed(2)}`, color: [71, 85, 105] },
    { label: 'EST. NET PROFIT', val: `+$${sumProfit.toFixed(2)}`, color: [5, 150, 105] },
    { label: 'AVG MARGIN', val: `${avgMargin}%`, color: [217, 119, 6] }
  ];

  kpis.forEach((kpi) => {
    // Card background
    doc.setFillColor(241, 245, 249); // #F1F5F9
    doc.roundedRect(startX, cardY, cardW, cardH, 1.5, 1.5, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.2);
    doc.roundedRect(startX, cardY, cardW, cardH, 1.5, 1.5, 'S');

    // Label
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.label, startX + cardW / 2, cardY + 4.5, { align: 'center' });

    // Value
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(kpi.color[0], kpi.color[1], kpi.color[2]);
    doc.text(kpi.val, startX + cardW / 2, cardY + 11, { align: 'center' });

    startX += cardW + gap;
  });

  // 3. Table Data Preparation
  const tableHeaders = [
    '#',
    'Game',
    'Package Name',
    'Units',
    'Retail ($)',
    'Cost ($)',
    'Reseller ($)',
    'Unit Net ($)',
    'Margin (%)',
    'Res. Profit',
    'Res. Margin',
    'Sold',
    'Total Profit ($)',
    'Total Rev ($)',
    'Status'
  ];

  const tableRows = list.map((p, idx) => [
    idx + 1,
    p.gameName || 'MLBB',
    p.name,
    p.diamondAmount || 0,
    `$${Number(p.retailPrice || 0).toFixed(2)}`,
    `$${Number(p.providerCost || 0).toFixed(2)}`,
    `$${Number(p.resellerPrice || 0).toFixed(2)}`,
    `+$${Number(p.unitNetProfit || 0).toFixed(2)}`,
    `${Number(p.retailMarginPct || 0).toFixed(1)}%`,
    `+$${Number(p.resellerUnitProfit || 0).toFixed(2)}`,
    `${Number(p.resellerMarginPct || 0).toFixed(1)}%`,
    p.unitsSold || 0,
    `+$${Number(p.totalProfit || 0).toFixed(2)}`,
    `$${Number(p.totalRevenue || 0).toFixed(2)}`,
    p.status || 'Active'
  ]);

  // Add Totals Summary Row
  tableRows.push([
    'TOTAL',
    'Catalog Master',
    `${totalCount} Packages`,
    list.reduce((a, b) => a + Number(b.diamondAmount || 0), 0),
    `$${sumRevenue.toFixed(2)}`,
    `$${sumCost.toFixed(2)}`,
    '--',
    `+$${sumProfit.toFixed(2)}`,
    `${avgMargin}%`,
    '--',
    '--',
    list.reduce((a, b) => a + Number(b.unitsSold || 0), 0),
    `+$${sumProfit.toFixed(2)}`,
    `$${sumRevenue.toFixed(2)}`,
    'Active'
  ]);

  // 4. Generate AutoTable with A4 Page Layout Rules
  autoTable(doc, {
    startY: 46,
    head: [tableHeaders],
    body: tableRows,
    theme: 'grid',
    margin: { left: 10, right: 10, top: 26, bottom: 15 },
    styles: {
      font: 'helvetica',
      fontSize: 7.5,
      cellPadding: 2,
      textColor: [51, 65, 85],
      lineColor: [226, 232, 240],
      lineWidth: 0.15,
      valign: 'middle'
    },
    headStyles: {
      fillColor: [30, 41, 59], // #1E293B Dark Navy
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center'
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252] // #F8FAFC
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      1: { halign: 'left', cellWidth: 22 },
      2: { halign: 'left', cellWidth: 42 },
      3: { halign: 'right', cellWidth: 16 },
      4: { halign: 'right', cellWidth: 18 },
      5: { halign: 'right', cellWidth: 18 },
      6: { halign: 'right', cellWidth: 18 },
      7: { halign: 'right', cellWidth: 18, fontStyle: 'bold', textColor: [5, 150, 105] },
      8: { halign: 'right', cellWidth: 16 },
      9: { halign: 'right', cellWidth: 16 },
      10: { halign: 'right', cellWidth: 16 },
      11: { halign: 'center', cellWidth: 12 },
      12: { halign: 'right', cellWidth: 20, fontStyle: 'bold', textColor: [5, 150, 105] },
      13: { halign: 'right', cellWidth: 20 },
      14: { halign: 'center', cellWidth: 17 }
    },
    didParseCell: (data) => {
      // Style Totals Row at the bottom
      if (data.row.index === tableRows.length - 1) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [226, 232, 240];
        data.cell.styles.textColor = [15, 23, 42];
      }
    },
    didDrawPage: (data) => {
      // Re-draw Header Bar on Pages 2+
      if (data.pageNumber > 1) {
        doc.setFillColor(15, 23, 42);
        doc.rect(0, 0, 297, 18, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        doc.text('MLBB TOPUP STORE — PACKAGE PROFITABILITY STATEMENT', 10, 11);
      }

      // Footer Page Numbering
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);

      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.line(10, 202, 287, 202);

      doc.text('MLBB TopUp Store Official Executive A4 Financial Statement', 10, 206);
      doc.text(`Page ${data.pageNumber} of ${pageCount}`, 287, 206, { align: 'right' });
    }
  });

  doc.save(filename);
}

/**
 * Exports Official Orders Sales Ledger as a styled A4 PDF Document (Landscape)
 */
export function exportOrdersLedgerPDF({
  orders = [],
  filename = `MLBB_TopUp_Orders_Ledger_A4_${new Date().toISOString().slice(0, 10)}.pdf`
}) {
  if (!orders || orders.length === 0) return;

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const totalCount = orders.length;
  const totalRev = orders.reduce((acc, o) => acc + Number(o.amount || o.price || 0), 0);

  // 1. Header Banner
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 297, 24, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text('MLBB TOPUP STORE — OFFICIAL ORDERS & SALES LEDGER STATEMENT', 10, 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated: ${new Date().toLocaleString()}  |  Total Orders: ${totalCount}  |  Total Sales Revenue: $${totalRev.toFixed(2)} USD`, 10, 17);

  // 2. Table Rows
  const headers = [
    '#',
    'Order ID',
    'Player ID',
    'Server ID',
    'Game Title',
    'Item Purchased',
    'Units',
    'Amount ($)',
    'Payment Status',
    'Fulfillment',
    'Method',
    'Date & Time'
  ];

  const rows = orders.map((o, idx) => [
    idx + 1,
    o.orderId || o.id,
    o.playerID || o.playerId,
    o.serverID || o.serverId || '11446',
    o.gameName || 'Mobile Legends',
    o.productName || `${o.diamondAmount || ''} Diamonds`,
    o.diamondAmount || 0,
    `$${Number(o.amount || o.price || 0).toFixed(2)}`,
    o.paymentStatus || 'Paid',
    o.topupStatus || 'Completed',
    o.paymentMethod || 'aba_payway',
    o.createdAt || ''
  ]);

  rows.push([
    'TOTAL',
    `${totalCount} Orders`,
    '--',
    '--',
    'All Games',
    'Master Ledger Summary',
    orders.reduce((a, b) => a + Number(b.diamondAmount || 0), 0),
    `$${totalRev.toFixed(2)}`,
    'Paid',
    'Completed',
    'ABA PAYWAY',
    'Completed'
  ]);

  autoTable(doc, {
    startY: 28,
    head: [headers],
    body: rows,
    theme: 'grid',
    margin: { left: 10, right: 10, top: 24, bottom: 15 },
    styles: {
      font: 'helvetica',
      fontSize: 8,
      cellPadding: 2,
      textColor: [51, 65, 85],
      lineColor: [226, 232, 240],
      lineWidth: 0.15,
      valign: 'middle'
    },
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'center'
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { halign: 'left', cellWidth: 30 },
      2: { halign: 'left', cellWidth: 26 },
      3: { halign: 'center', cellWidth: 20 },
      4: { halign: 'left', cellWidth: 32 },
      5: { halign: 'left', cellWidth: 42 },
      6: { halign: 'right', cellWidth: 18 },
      7: { halign: 'right', cellWidth: 22, fontStyle: 'bold', textColor: [2, 132, 199] },
      8: { halign: 'center', cellWidth: 22 },
      9: { halign: 'center', cellWidth: 24 },
      10: { halign: 'center', cellWidth: 20 },
      11: { halign: 'left', cellWidth: 31 }
    },
    didParseCell: (data) => {
      if (data.row.index === rows.length - 1) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [226, 232, 240];
        data.cell.styles.textColor = [15, 23, 42];
      }
    },
    didDrawPage: (data) => {
      if (data.pageNumber > 1) {
        doc.setFillColor(15, 23, 42);
        doc.rect(0, 0, 297, 18, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        doc.text('MLBB TOPUP STORE — OFFICIAL ORDERS LEDGER', 10, 11);
      }

      const pageCount = doc.internal.getNumberOfPages();
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);

      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.line(10, 202, 287, 202);

      doc.text('MLBB TopUp Store Official Executive A4 Sales Statement', 10, 206);
      doc.text(`Page ${data.pageNumber} of ${pageCount}`, 287, 206, { align: 'right' });
    }
  });

  doc.save(filename);
}
