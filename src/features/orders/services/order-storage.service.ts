import { mockOrders } from '../data/mock-orders';
import type { LabOrder } from '../types/order.types';

const STORAGE_KEY = 'wasla-lab-orders-v1';

const cloneMockOrders = () => JSON.parse(JSON.stringify(mockOrders)) as LabOrder[];

export function loadOrders(): LabOrder[] {
  if (typeof window === 'undefined') return cloneMockOrders();

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as LabOrder[]) : cloneMockOrders();
  } catch {
    return cloneMockOrders();
  }
}

export function saveOrders(orders: LabOrder[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch {
    // Local persistence is optional in this frontend-only POC.
  }
}
