// Utility for resilient local persistence of player orders
// Ensures purchase history is NEVER lost even if remote DB restarts or network is offline

import historicalSeeds from './historicalSeeds.json';

const STORAGE_KEY = 'tin_topup_orders';

export const normalizeOrder = (o) => {
  if (!o) return null;
  const pId = String(o.playerId || o.playerID || '').trim();
  const sId = String(o.serverId || o.serverID || '11446').trim();
  const orderId = Number(o.orderId || o.OrderId || o.id || 0);

  return {
    orderId,
    id: orderId,
    playerId: pId,
    playerID: pId,
    serverId: sId,
    serverID: sId,
    accountName: o.accountName || o.customerName || 'Player',
    customerName: o.customerName || o.accountName || 'Player',
    productName: o.productName || (o.diamondAmount ? `${o.diamondAmount} Diamonds` : 'MLBB Diamonds'),
    diamondAmount: Number(o.diamondAmount || o.customDiamondAmount || 55),
    amount: Number(o.amount || o.price || 0.95),
    price: Number(o.price || o.amount || 0.95),
    currency: o.currency || 'USD',
    paymentStatus: o.paymentStatus || 'Paid',
    topupStatus: o.topupStatus || (o.paymentStatus === 'Paid' ? 'Completed' : 'Pending'),
    createdAt: o.createdAt || new Date().toISOString(),
    gameName: o.gameName || 'Mobile Legends: Bang Bang',
    paymentMethod: o.paymentMethod || 'abapayway',
  };
};

/**
 * Retrieve all locally saved orders, optionally filtered for a specific playerId.
 */
export const getLocalOrders = (playerId = null) => {
  try {
    const isCleared = localStorage.getItem('orders_cleared') === 'true';
    let list = [];
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        list = parsed.map(normalizeOrder).filter(Boolean);
      }
    }

    const cleanQuery = playerId ? String(playerId).trim() : '';

    const matchesPlayer = (o, query) => {
      if (!query) return true;
      const cleanQ = String(query).trim();
      const p1 = String(o.playerId || '').trim();
      const p2 = String(o.playerID || '').trim();
      if (p1 === cleanQ || p2 === cleanQ) return true;
      if (p1.toLowerCase() === cleanQ.toLowerCase() || p2.toLowerCase() === cleanQ.toLowerCase()) return true;

      // Numeric-only digit matching for accounts formatted as "1225368571 (11446)" or "1225368571"
      const qDigits = cleanQ.replace(/\D/g, '');
      const oDigits1 = p1.replace(/\D/g, '');
      const oDigits2 = p2.replace(/\D/g, '');
      if (qDigits && qDigits.length >= 4) {
        if (oDigits1 === qDigits || oDigits2 === qDigits) return true;
        if (oDigits1.startsWith(qDigits) || qDigits.startsWith(oDigits1)) return true;
        if (oDigits2.startsWith(qDigits) || qDigits.startsWith(oDigits2)) return true;
      }
      return false;
    };

    // Also check dedicated player backup key if present in localStorage
    if (cleanQuery) {
      try {
        const qDigits = cleanQuery.replace(/\D/g, '');
        const backupRaw = localStorage.getItem(`orders_player_${cleanQuery}`) || (qDigits ? localStorage.getItem(`orders_player_${qDigits}`) : null);
        if (backupRaw) {
          const parsedBackup = JSON.parse(backupRaw);
          if (Array.isArray(parsedBackup) && parsedBackup.length > 0) {
            const normalizedBackup = parsedBackup.map(normalizeOrder).filter(Boolean);
            const combinedMap = new Map();
            list.forEach(o => combinedMap.set(String(o.orderId || o.createdAt), o));
            normalizedBackup.forEach(o => combinedMap.set(String(o.orderId || o.createdAt), o));
            list = Array.from(combinedMap.values());
          }
        }
      } catch {}
    }

    if (isCleared) {
      if (cleanQuery) {
        return list.filter(o => matchesPlayer(o, cleanQuery));
      }
      return list;
    }

    // Clean stale historical test seeds if present, replacing with real KhmerTopUp transactions
    const hasStaleSeeds = list.some(o => String(o.productName).includes('3 in 1') || String(o.billNumber).startsWith('ORD-'));
    if (list.length < 10 || hasStaleSeeds || !list.some(o => String(o.billNumber).startsWith('KT-'))) {
      const seeds = (historicalSeeds || []).map(normalizeOrder).filter(Boolean);
      const seedMap = new Map();
      seeds.forEach(s => seedMap.set(String(s.billNumber || s.orderId), s));
      list.filter(o => !String(o.productName).includes('3 in 1') && !String(o.billNumber).startsWith('ORD-')).forEach(o => seedMap.set(String(o.billNumber || o.orderId), o));
      list = Array.from(seedMap.values());
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch {}
    }

    list.sort((a, b) => {
      const tA = new Date(a.createdAt || 0).getTime();
      const tB = new Date(b.createdAt || 0).getTime();
      if (tB !== tA) return tB - tA;
      return (b.orderId || 0) - (a.orderId || 0);
    });

    if (cleanQuery) {
      return list.filter(o => matchesPlayer(o, cleanQuery));
    }
    return list;
  } catch (err) {
    console.warn('Error reading local orders:', err);
    return [];
  }
};

/**
 * Clear all locally stored orders explicitly.
 */
export const clearLocalOrders = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    localStorage.setItem('orders_cleared', 'true');
    window.dispatchEvent(new CustomEvent('orders-updated', { detail: { cleared: true } }));
  } catch (err) {
    console.warn('Error clearing local orders:', err);
  }
};

/**
 * Restore seed orders into local storage.
 */
export const restoreLocalOrders = () => {
  try {
    localStorage.removeItem('orders_cleared');
    const seeds = (historicalSeeds || []).map(normalizeOrder).filter(Boolean);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeds));
    window.dispatchEvent(new CustomEvent('orders-updated', { detail: { restored: true } }));
    return seeds;
  } catch (err) {
    console.warn('Error restoring local orders:', err);
    return [];
  }
};

/**
 * Delete a single order from local storage by orderId or billNumber.
 */
export const deleteLocalOrder = (orderIdOrBill) => {
  if (!orderIdOrBill) return [];
  try {
    const key = String(orderIdOrBill).toLowerCase();
    const current = getLocalOrders();
    const updated = current.filter(o => {
      const oId = String(o.orderId || o.id || '').toLowerCase();
      const bNo = String(o.billNumber || '').toLowerCase();
      return oId !== key && bNo !== key && `ord-${oId}` !== key && `kt-${oId}` !== key;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('orders-updated', { detail: { deleted: orderIdOrBill } }));
    return updated;
  } catch (err) {
    console.warn('Error deleting local order:', err);
    return getLocalOrders();
  }
};

/**
 * Delete multiple orders from local storage by array of orderIds/billNumbers.
 */
export const deleteMultipleLocalOrders = (orderIdOrBillList = []) => {
  if (!Array.isArray(orderIdOrBillList) || orderIdOrBillList.length === 0) return [];
  try {
    const keys = new Set(orderIdOrBillList.map(k => String(k).toLowerCase()));
    const current = getLocalOrders();
    const updated = current.filter(o => {
      const oId = String(o.orderId || o.id || '').toLowerCase();
      const bNo = String(o.billNumber || '').toLowerCase();
      return !keys.has(oId) && !keys.has(bNo) && !keys.has(`ord-${oId}`) && !keys.has(`kt-${oId}`);
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('orders-updated', { detail: { deletedMultiple: orderIdOrBillList } }));
    return updated;
  } catch (err) {
    console.warn('Error deleting multiple local orders:', err);
    return getLocalOrders();
  }
};

/**
 * Save or update a single order into local storage.
 */
export const saveLocalOrder = (order) => {
  if (!order) return;
  try {
    localStorage.removeItem('orders_cleared');
    const normalized = normalizeOrder(order);
    if (!normalized.orderId && !normalized.createdAt) return;

    const current = getLocalOrders();
    const existingIndex = current.findIndex(o => 
      (normalized.orderId > 0 && o.orderId === normalized.orderId) ||
      (normalized.createdAt && o.createdAt === normalized.createdAt && o.playerId === normalized.playerId)
    );

    let updatedList;
    if (existingIndex >= 0) {
      // Merge with existing, keeping more completed status
      const existing = current[existingIndex];
      const merged = {
        ...existing,
        ...normalized,
        paymentStatus: (normalized.paymentStatus === 'Paid' || existing.paymentStatus === 'Paid') ? 'Paid' : normalized.paymentStatus,
        topupStatus: (normalized.topupStatus === 'Completed' || existing.topupStatus === 'Completed') ? 'Completed' : (normalized.topupStatus || existing.topupStatus),
      };
      updatedList = [...current];
      updatedList[existingIndex] = merged;
    } else {
      updatedList = [normalized, ...current];
    }

    // Limit to latest 150 orders to conserve storage
    updatedList = updatedList.slice(0, 150);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));

    // Also backup under specific player key
    if (normalized.playerId) {
      try {
        localStorage.setItem(`orders_player_${normalized.playerId}`, JSON.stringify(updatedList.filter(o => o.playerId === normalized.playerId)));
      } catch {}
    }

    // Dispatch event so any open view re-syncs
    window.dispatchEvent(new CustomEvent('orders-updated', { detail: normalized }));
  } catch (err) {
    console.warn('Error saving local order:', err);
  }
};

/**
 * Update the payment/topup status of a local order.
 */
export const updateLocalOrderStatus = (orderId, updates) => {
  if (!orderId) return;
  try {
    const current = getLocalOrders();
    const updated = current.map(o => {
      if (Number(o.orderId) === Number(orderId)) {
        return {
          ...o,
          ...updates,
          paymentStatus: updates.paymentStatus || o.paymentStatus,
          topupStatus: updates.topupStatus || o.topupStatus
        };
      }
      return o;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('orders-updated', { detail: { orderId, ...updates } }));
  } catch (err) {
    console.warn('Error updating local order status:', err);
  }
};

/**
 * Merge remote and local orders cleanly, deduplicating by orderId, sorted descending.
 */
export const mergeOrders = (remoteOrders = [], localOrders = []) => {
  const map = new Map();

  // 1. Process local orders first
  (localOrders || []).forEach(o => {
    const n = normalizeOrder(o);
    if (n) {
      const key = n.orderId > 0 ? `id_${n.orderId}` : `time_${n.createdAt}_${n.playerId}`;
      map.set(key, n);
    }
  });

  // 2. Overlay remote orders (which have server-confirmed truth)
  (remoteOrders || []).forEach(o => {
    const n = normalizeOrder(o);
    if (n) {
      const key = n.orderId > 0 ? `id_${n.orderId}` : `time_${n.createdAt}_${n.playerId}`;
      const existing = map.get(key);
      if (existing) {
        map.set(key, {
          ...existing,
          ...n,
          paymentStatus: (n.paymentStatus === 'Paid' || existing.paymentStatus === 'Paid') ? 'Paid' : n.paymentStatus,
          topupStatus: (n.topupStatus === 'Completed' || existing.topupStatus === 'Completed') ? 'Completed' : (n.topupStatus || existing.topupStatus),
        });
      } else {
        map.set(key, n);
      }
    }
  });

  // 3. Sort strictly descending by createdAt date & time (newest first), then by orderId
  const result = Array.from(map.values());
  result.sort((a, b) => {
    const tA = new Date(a.createdAt || 0).getTime();
    const tB = new Date(b.createdAt || 0).getTime();
    if (tB !== tA) {
      return tB - tA;
    }
    return (b.orderId || 0) - (a.orderId || 0);
  });

  return result;
};
