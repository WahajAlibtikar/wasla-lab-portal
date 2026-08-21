import { useEffect, useMemo, useState } from 'react';
import { loadOrders, saveOrders } from '../services/order-storage.service';
import type { LabOrder, OrderFilter, OrderStatus, QuoteDraft } from '../types/order.types';

function matchesFilter(order: LabOrder, filter: OrderFilter) {
  if (filter === 'all') return true;
  if (filter === 'attention') return ['new', 'awaiting_review', 'needs_clarification'].includes(order.status);
  if (filter === 'urgent') return order.priority === 'urgent';
  return order.status === filter;
}

export function useLabOrders() {
  const [orders, setOrders] = useState<LabOrder[]>(loadOrders);
  const [selectedOrderId, setSelectedOrderId] = useState(() => loadOrders()[0]?.id ?? '');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<OrderFilter>('all');

  useEffect(() => saveOrders(orders), [orders]);

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('ar');

    return orders.filter((order) => {
      const searchable = [order.id, order.doctorName, order.clinicName, order.service, order.teeth]
        .join(' ')
        .toLocaleLowerCase('ar');
      return matchesFilter(order, filter) && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [filter, orders, query]);

  const selectedOrder = filteredOrders.find((order) => order.id === selectedOrderId) ?? filteredOrders[0] ?? null;
  const visibleSelectedOrderId = selectedOrder?.id ?? '';

  const selectOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setOrders((current) => current.map((order) => (order.id === orderId ? { ...order, unread: false } : order)));
  };

  const updateOrder = (orderId: string, update: Partial<LabOrder>) => {
    setOrders((current) => current.map((order) => (order.id === orderId ? { ...order, ...update } : order)));
  };

  const addTimelineStep = (order: LabOrder, label: string, state: 'done' | 'current' = 'current') => [
    ...order.timeline.map((step) => (step.state === 'current' ? { ...step, state: 'done' as const } : step)),
    { id: `timeline-${Date.now()}`, label, time: 'الآن', state },
  ];

  const setStatus = (orderId: string, status: OrderStatus, timelineLabel: string) => {
    const order = orders.find((item) => item.id === orderId);
    if (!order) return;
    updateOrder(orderId, { status, timeline: addTimelineStep(order, timelineLabel) });
  };

  const saveQuote = (orderId: string, quote: QuoteDraft) => updateOrder(orderId, { quote });

  const acceptQuote = (orderId: string, quote: QuoteDraft) => {
    const order = orders.find((item) => item.id === orderId);
    if (!order) return;
    updateOrder(orderId, {
      quote,
      status: 'quote_sent',
      timeline: addTimelineStep(order, 'تم قبول الحالة وإرسال عرض السعر للطبيب'),
    });
  };

  return {
    orders,
    filteredOrders,
    selectedOrder,
    selectedOrderId: visibleSelectedOrderId,
    query,
    filter,
    setQuery,
    setFilter,
    selectOrder,
    saveQuote,
    acceptQuote,
    requestClarification: (orderId: string) => setStatus(orderId, 'needs_clarification', 'تم طلب توضيح من الطبيب'),
    rejectOrder: (orderId: string) => setStatus(orderId, 'rejected', 'تم رفض الطلب وإبلاغ الطبيب'),
  };
}
