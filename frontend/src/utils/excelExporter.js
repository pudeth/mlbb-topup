import ExcelJS from 'exceljs';

/**
 * Exports Compact & Professional Package Profitability & Pricing Ledger (.xlsx)
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

  // 1. Compact Title Block (Rows 1 & 2 - Unmerged, Clean)
  sheet.getCell('A1').value = 'MLBB TopUp Store — Package Profitability & Pricing Statement';
  sheet.getCell('A1').font = { name: 'Segoe UI', size: 13, bold: true, color: { argb: 'FF0F172A' } };
  sheet.getRow(1).height = 24;

  sheet.getCell('A2').value = `Generated: ${new Date().toLocaleString()}  |  Active Supplier: ${activeProvider}  |  Catalog Scope: ${gameFilter.toUpperCase()} (${totalCount} Packages)`;
  sheet.getCell('A2').font = { name: 'Segoe UI', size: 9, italic: true, color: { argb: 'FF64748B' } };
  sheet.getRow(2).height = 18;

  sheet.addRow([]); // Blank Row 3 (Height 10)
  sheet.getRow(3).height = 10;

  // 2. Data Table Header Row (Row 4)
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
  headerRow.height = 26;
  headerRow.eachCell((cell) => {
    cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF0F172A' } },
      bottom: { style: 'medium', color: { argb: 'FF0F172A' } },
      left: { style: 'thin', color: { argb: 'FF334155' } },
      right: { style: 'thin', color: { argb: 'FF334155' } }
    };
  });

  // Freeze top headers at Row 4
  sheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 4 }];

  // 3. Compact Data Rows (Row 5+)
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
    row.height = 20;

    row.eachCell((cell, colIndex) => {
      cell.font = { name: 'Segoe UI', size: 9, color: { argb: 'FF334155' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgHex } };
      cell.border = {
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
      };

      // Alignment
      if ([1, 4, 13, 16, 17].includes(colIndex)) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      } else if ([5, 6, 8, 9, 10, 11, 12, 14, 15].includes(colIndex)) {
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      } else {
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
      }

      // Number Formats
      if ([5, 6, 8, 9, 11, 14, 15].includes(colIndex)) {
        cell.numFmt = '"$"#,##0.00';
      }
      if ([10, 12].includes(colIndex)) {
        cell.numFmt = '0.0%';
      }
      if (colIndex === 4 || colIndex === 13) {
        cell.numFmt = '#,##0';
      }

      // Highlighting Positive Profit
      if ([9, 11, 14].includes(colIndex) && cell.value > 0) {
        cell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: 'FF047857' } };
      }

      // Status pill badge color
      if (colIndex === 16) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } };
        cell.font = { name: 'Segoe UI', size: 8.5, bold: true, color: { argb: 'FF15803D' } };
      }

      // Promo/Tag pill badge color
      if (colIndex === 17 && cell.value && cell.value !== 'Standard') {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
        cell.font = { name: 'Segoe UI', size: 8.5, bold: true, color: { argb: 'FFB45309' } };
      }
    });
  });

  // 4. Compact Summary Totals Row
  const startRow = 5;
  const endRow = list.length + 4;

  const totalRow = sheet.addRow([
    'TOTALS',
    `Catalog (${totalCount} pkgs)`,
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

  totalRow.height = 24;
  totalRow.eachCell((cell, colIndex) => {
    cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF0F172A' } };
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

  // 5. Clean Fixed Proportional Column Widths (Prevents Huge Stretching)
  const columnWidths = [
    5,   // 1: #
    18,  // 2: Game Category
    28,  // 3: Package Name
    14,  // 4: Diamonds / Units
    14,  // 5: Seller Retail ($)
    16,  // 6: Provider Wholesale Cost ($)
    15,  // 7: Supplier Gateway
    14,  // 8: VIP Reseller Price ($)
    13,  // 9: Unit Net Profit ($)
    12,  // 10: Retail Margin (%)
    14,  // 11: Reseller Unit Profit ($)
    12,  // 12: Reseller Margin (%)
    10,  // 13: Units Sold
    14,  // 14: Total Net Profit ($)
    15,  // 15: Total Gross Revenue ($)
    10,  // 16: Status
    15   // 17: Pass / Promo Tag
  ];

  sheet.columns.forEach((col, idx) => {
    col.width = columnWidths[idx] || 14;
  });

  // Download Trigger
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
 * Exports Compact & Professional Orders & Sales Ledger (.xlsx)
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

  // 1. Compact Title Block
  sheet.getCell('A1').value = 'MLBB TopUp Store — Official Orders & Sales Ledger Statement';
  sheet.getCell('A1').font = { name: 'Segoe UI', size: 13, bold: true, color: { argb: 'FF0F172A' } };
  sheet.getRow(1).height = 24;

  sheet.getCell('A2').value = `Generated: ${new Date().toLocaleString()}  |  Total Orders: ${totalCount}  |  Currency: USD ($)`;
  sheet.getCell('A2').font = { name: 'Segoe UI', size: 9, italic: true, color: { argb: 'FF64748B' } };
  sheet.getRow(2).height = 18;

  sheet.addRow([]);
  sheet.getRow(3).height = 10;

  // 2. Table Headers (Row 4)
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
    cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF0F172A' } },
      bottom: { style: 'medium', color: { argb: 'FF0F172A' } }
    };
  });

  sheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 4 }];

  // 3. Compact Data Rows
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
        cell.font = { name: 'Segoe UI', size: 8.5, bold: true, color: { argb: 'FF15803D' } };
      }
    });
  });

  // 4. Totals Row
  const startRow = 5;
  const endRow = orders.length + 4;
  const totalRow = sheet.addRow([
    'TOTALS',
    `${totalCount} Orders`,
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
    cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF0F172A' } };
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

  const orderWidths = [5, 18, 16, 12, 18, 26, 12, 14, 12, 14, 14, 20];
  sheet.columns.forEach((col, idx) => {
    col.width = orderWidths[idx] || 14;
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
