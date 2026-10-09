import ExcelJS from 'exceljs';

/**
 * Exports Executive Package Profitability & Pricing Ledger (.xlsx)
 */
export async function exportPackageProfitabilityExcel({
  list = [],
  activeProvider = 'KhmerTopUp',
  gameFilter = 'ALL',
  filename = `MLBB_TopUp_Package_Profitability_${new Date().toISOString().slice(0, 10)}.xlsx`
}) {
  if (!list || list.length === 0) return;

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'MLBB TopUp Store Engine';
  workbook.lastModifiedBy = 'Store Administrator';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Package Profitability', {
    views: [{ showGridLines: true }]
  });

  const totalCount = list.length;
  const sumRevenue = list.reduce((acc, p) => acc + (Number(p.totalRevenue || 0) || (Number(p.retailPrice || 0) * Number(p.unitsSold || 0))), 0);
  const sumCost = list.reduce((acc, p) => acc + Number(p.totalProviderCost || p.providerCost || 0), 0);
  const sumProfit = list.reduce((acc, p) => acc + (Number(p.totalProfit || 0) || (Number(p.unitNetProfit || 0) * Number(p.unitsSold || 0))), 0);
  const avgMargin = totalCount > 0 ? (list.reduce((acc, p) => acc + Number(p.retailMarginPct || 0), 0) / totalCount) / 100 : 0;

  // 1. Title Banner (Rows 1 & 2)
  sheet.mergeCells('A1:Q1');
  const titleCell = sheet.getCell('A1');
  titleCell.value = 'MLBB TOPUP STORE — EXECUTIVE PACKAGE PROFITABILITY & PRICING STATEMENT';
  titleCell.font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  sheet.getRow(1).height = 36;

  sheet.mergeCells('A2:Q2');
  const metaCell = sheet.getCell('A2');
  metaCell.value = `Report Timestamp: ${new Date().toLocaleString()}  |  Active Supplier: ${activeProvider}  |  Catalog Scope: ${gameFilter.toUpperCase()} (${totalCount} Packages)`;
  metaCell.font = { name: 'Segoe UI', size: 9, italic: true, color: { argb: 'FF94A3B8' } };
  metaCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
  metaCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  sheet.getRow(2).height = 22;

  sheet.addRow([]); // Blank Row 3

  // 2. KPI Summary Cards (Rows 4-5)
  const kpis = [
    { label: 'CATALOG PACKAGES', val: totalCount, fmt: '#,##0', color: 'FF0F172A', startCol: 1, endCol: 3 },
    { label: 'TOTAL CATALOG REVENUE', val: sumRevenue, fmt: '"$"#,##0.00', color: 'FF0284C7', startCol: 4, endCol: 6 },
    { label: 'SUPPLIER WHOLESALE COGS', val: sumCost, fmt: '"$"#,##0.00', color: 'FF475569', startCol: 7, endCol: 9 },
    { label: 'ESTIMATED NET PROFIT', val: sumProfit, fmt: '"+"#,##0.00;"-"#,##0.00;0.00', color: 'FF059669', startCol: 10, endCol: 12 },
    { label: 'AVERAGE RETAIL MARGIN', val: avgMargin, fmt: '0.0%', color: 'FFD97706', startCol: 13, endCol: 15 }
  ];

  kpis.forEach((kpi) => {
    const colStartChar = String.fromCharCode(64 + kpi.startCol);
    const colEndChar = String.fromCharCode(64 + kpi.endCol);

    sheet.mergeCells(`${colStartChar}4:${colEndChar}4`);
    const lblCell = sheet.getCell(`${colStartChar}4`);
    lblCell.value = kpi.label;
    lblCell.font = { name: 'Segoe UI', size: 8, bold: true, color: { argb: 'FF64748B' } };
    lblCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
    lblCell.alignment = { horizontal: 'center', vertical: 'middle' };

    sheet.mergeCells(`${colStartChar}5:${colEndChar}5`);
    const valCell = sheet.getCell(`${colStartChar}5`);
    valCell.value = kpi.val;
    valCell.font = { name: 'Segoe UI', size: 13, bold: true, color: { argb: kpi.color } };
    valCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
    valCell.alignment = { horizontal: 'center', vertical: 'middle' };
    if (kpi.fmt) valCell.numFmt = kpi.fmt;

    for (let r = 4; r <= 5; r++) {
      for (let c = kpi.startCol; c <= kpi.endCol; c++) {
        const cell = sheet.getCell(r, c);
        cell.border = {
          top: r === 4 ? { style: 'thin', color: { argb: 'FFCBD5E1' } } : undefined,
          bottom: r === 5 ? { style: 'thin', color: { argb: 'FFCBD5E1' } } : undefined,
          left: c === kpi.startCol ? { style: 'thin', color: { argb: 'FFCBD5E1' } } : undefined,
          right: c === kpi.endCol ? { style: 'thin', color: { argb: 'FFCBD5E1' } } : undefined
        };
      }
    }
  });

  sheet.getRow(4).height = 18;
  sheet.getRow(5).height = 26;
  sheet.addRow([]); // Blank Row 6

  // 3. Table Header Row (Row 7)
  const headers = [
    '#',
    'Game Category',
    'Package Name',
    'Diamonds / Units',
    'Seller Retail ($)',
    'Provider Wholesale Cost ($)',
    'Active Supplier Gateway',
    'VIP Reseller Price ($)',
    'Unit Net Profit ($)',
    'Retail Margin (%)',
    'Reseller Unit Profit ($)',
    'Reseller Margin (%)',
    'Units Sold',
    'Total Net Profit ($)',
    'Total Gross Revenue ($)',
    'Status',
    'Pass / Promo Tag'
  ];

  const headerRow = sheet.addRow(headers);
  headerRow.height = 28;
  headerRow.eachCell((cell) => {
    cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = {
      top: { style: 'medium', color: { argb: 'FF0F172A' } },
      bottom: { style: 'medium', color: { argb: 'FF0F172A' } },
      left: { style: 'thin', color: { argb: 'FF334155' } },
      right: { style: 'thin', color: { argb: 'FF334155' } }
    };
  });

  sheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 7 }];

  // 4. Data Rows (Row 8+)
  list.forEach((p, idx) => {
    const isEven = idx % 2 === 0;
    const bgHex = isEven ? 'FFFFFFFF' : 'FFF8FAFC';

    const rowData = [
      idx + 1,
      p.gameName || 'Mobile Legends',
      p.name,
      Number(p.diamondAmount || 0),
      Number(p.retailPrice || 0),
      Number(p.providerCost || 0),
      p.activeProvider || activeProvider,
      Number(p.resellerPrice || 0),
      Number(p.unitNetProfit || 0),
      Number(p.retailMarginPct || 0) / 100,
      Number(p.resellerUnitProfit || 0),
      Number(p.resellerMarginPct || 0) / 100,
      Number(p.unitsSold || 0),
      Number(p.totalProfit || 0),
      Number(p.totalRevenue || 0),
      p.status || 'Active',
      p.tag || 'Standard'
    ];

    const row = sheet.addRow(rowData);
    row.height = 22;

    row.eachCell((cell, colIndex) => {
      cell.font = { name: 'Segoe UI', size: 9, color: { argb: 'FF334155' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgHex } };
      cell.border = {
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
      };

      if ([1, 4, 13, 16, 17].includes(colIndex)) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      } else if ([5, 6, 8, 9, 10, 11, 12, 14, 15].includes(colIndex)) {
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      } else {
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
      }

      if ([5, 6, 8, 9, 11, 14, 15].includes(colIndex)) {
        cell.numFmt = '"$"#,##0.00';
      }
      if ([10, 12].includes(colIndex)) {
        cell.numFmt = '0.0%';
      }
      if (colIndex === 4 || colIndex === 13) {
        cell.numFmt = '#,##0';
      }

      if ([9, 11, 14].includes(colIndex) && cell.value > 0) {
        cell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: 'FF059669' } };
      }

      if (colIndex === 16) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } };
        cell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: 'FF15803D' } };
      }

      if (colIndex === 17 && cell.value && cell.value !== 'Standard') {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
        cell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: 'FFB45309' } };
      }
    });
  });

  // 5. Summary Total Row
  const startRow = 8;
  const endRow = list.length + 7;

  const totalRow = sheet.addRow([
    'TOTALS',
    `Catalog Master (${totalCount} packages)`,
    '',
    `=SUM(D${startRow}:D${endRow})`,
    `=AVERAGE(E${startRow}:E${endRow})`,
    `=AVERAGE(F${startRow}:F${endRow})`,
    activeProvider,
    `=AVERAGE(H${startRow}:H${endRow})`,
    `=AVERAGE(I${startRow}:I${endRow})`,
    `=AVERAGE(J${startRow}:J${endRow})`,
    `=AVERAGE(K${startRow}:K${endRow})`,
    `=AVERAGE(L${startRow}:L${endRow})`,
    `=SUM(M${startRow}:M${endRow})`,
    `=SUM(N${startRow}:N${endRow})`,
    `=SUM(O${startRow}:O${endRow})`,
    'Active',
    'Master'
  ]);

  totalRow.height = 26;
  totalRow.eachCell((cell, colIndex) => {
    cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF0F172A' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };
    cell.border = {
      top: { style: 'medium', color: { argb: 'FF0F172A' } },
      bottom: { style: 'double', color: { argb: 'FF0F172A' } }
    };

    if ([5, 6, 8, 9, 11, 14, 15].includes(colIndex)) {
      cell.numFmt = '"$"#,##0.00';
      cell.alignment = { horizontal: 'right', vertical: 'middle' };
    } else if ([10, 12].includes(colIndex)) {
      cell.numFmt = '0.0%';
      cell.alignment = { horizontal: 'right', vertical: 'middle' };
    } else if ([4, 13].includes(colIndex)) {
      cell.numFmt = '#,##0';
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    } else {
      cell.alignment = { horizontal: 'left', vertical: 'middle' };
    }
  });

  sheet.columns.forEach((column) => {
    let maxLen = 0;
    column.eachCell({ includeEmpty: true }, (cell) => {
      const s = cell.value ? cell.value.toString() : '';
      if (s.length > maxLen && !s.startsWith('=')) {
        maxLen = s.length;
      }
    });
    column.width = Math.max(maxLen + 4, 12);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

/**
 * Exports Executive Orders & Sales Ledger (.xlsx)
 */
export async function exportOrdersLedgerExcel({
  orders = [],
  filename = `MLBB_TopUp_Orders_Ledger_Statement_${new Date().toISOString().slice(0, 10)}.xlsx`
}) {
  if (!orders || orders.length === 0) return;

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'MLBB TopUp Store Engine';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Sales Ledger', {
    views: [{ showGridLines: true }]
  });

  const totalCount = orders.length;
  const totalRev = orders.reduce((acc, o) => acc + Number(o.amount || o.price || 0), 0);

  sheet.mergeCells('A1:L1');
  const titleCell = sheet.getCell('A1');
  titleCell.value = 'MLBB TOPUP STORE — OFFICIAL ORDERS & SALES LEDGER STATEMENT';
  titleCell.font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  sheet.getRow(1).height = 36;

  sheet.mergeCells('A2:L2');
  const metaCell = sheet.getCell('A2');
  metaCell.value = `Report Timestamp: ${new Date().toLocaleString()}  |  Total Orders: ${totalCount}  |  Total Sales Revenue: $${totalRev.toFixed(2)} USD`;
  metaCell.font = { name: 'Segoe UI', size: 9, italic: true, color: { argb: 'FF94A3B8' } };
  metaCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
  metaCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  sheet.getRow(2).height = 22;

  sheet.addRow([]);

  const headers = [
    '#',
    'Order ID',
    'Player ID / User ID',
    'Server ID / Zone',
    'Game Title',
    'Package / Item Purchased',
    'Diamonds / Units',
    'Amount Paid ($)',
    'Payment Status',
    'Fulfillment Status',
    'Payment Method',
    'Transaction Timestamp'
  ];

  const headerRow = sheet.addRow(headers);
  headerRow.height = 26;
  headerRow.eachCell((cell) => {
    cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'medium', color: { argb: 'FF0F172A' } },
      bottom: { style: 'medium', color: { argb: 'FF0F172A' } }
    };
  });

  sheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 4 }];

  orders.forEach((o, idx) => {
    const isEven = idx % 2 === 0;
    const bgHex = isEven ? 'FFFFFFFF' : 'FFF8FAFC';

    const row = sheet.addRow([
      idx + 1,
      o.orderId || o.id,
      o.playerID || o.playerId,
      o.serverID || o.serverId || '11446',
      o.gameName || 'Mobile Legends',
      o.productName || `${o.diamondAmount || ''} Diamonds`,
      Number(o.diamondAmount || 0),
      Number(o.amount || o.price || 0),
      o.paymentStatus || 'Paid',
      o.topupStatus || 'Completed',
      o.paymentMethod || 'aba_payway',
      o.createdAt || ''
    ]);

    row.height = 20;

    row.eachCell((cell, colIndex) => {
      cell.font = { name: 'Segoe UI', size: 9, color: { argb: 'FF334155' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgHex } };
      cell.border = { bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } } };

      if ([1, 7, 9, 10, 11].includes(colIndex)) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      } else if (colIndex === 8) {
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
        cell.numFmt = '"$"#,##0.00';
      } else {
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
      }

      if (colIndex === 7) cell.numFmt = '#,##0';

      if (colIndex === 9 || colIndex === 10) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } };
        cell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: 'FF15803D' } };
      }
    });
  });

  const startRow = 5;
  const endRow = orders.length + 4;
  const totalRow = sheet.addRow([
    'TOTALS',
    `${totalCount} Orders Recorded`,
    '',
    '',
    'All Games',
    'Master Ledger',
    `=SUM(G${startRow}:G${endRow})`,
    `=SUM(H${startRow}:H${endRow})`,
    'Paid',
    'Completed',
    'ABA PAYWAY',
    'Ledger Complete'
  ]);

  totalRow.height = 24;
  totalRow.eachCell((cell, colIndex) => {
    cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF0F172A' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };
    cell.border = {
      top: { style: 'medium', color: { argb: 'FF0F172A' } },
      bottom: { style: 'double', color: { argb: 'FF0F172A' } }
    };

    if (colIndex === 8) {
      cell.numFmt = '"$"#,##0.00';
      cell.alignment = { horizontal: 'right', vertical: 'middle' };
    } else if (colIndex === 7) {
      cell.numFmt = '#,##0';
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    }
  });

  sheet.columns.forEach((col) => {
    let maxLen = 0;
    col.eachCell({ includeEmpty: true }, (c) => {
      const valStr = c.value ? c.value.toString() : '';
      if (valStr.length > maxLen && !valStr.startsWith('=')) {
        maxLen = valStr.length;
      }
    });
    col.width = Math.max(maxLen + 4, 12);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}
