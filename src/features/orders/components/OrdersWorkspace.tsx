import { useCallback, useState } from 'react';
import { Toast } from '../../../components/shared/Toast';
import { useLabOrders } from '../hooks/use-lab-orders';
import { MetricCards } from './MetricCards';
import { OrderDetails } from './OrderDetails';
import { OrderList } from './OrderList';

export function OrdersWorkspace() {
  const {
    filteredOrders,
    selectedOrder,
    selectedOrderId,
    query,
    filter,
    setQuery,
    setFilter,
    selectOrder,
    saveQuote,
    acceptQuote,
    requestClarification,
    rejectOrder,
  } = useLabOrders();
  const [notice, setNotice] = useState('');
  const clearNotice = useCallback(() => setNotice(''), []);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold text-ink">طلبات تحتاج انتباهك</h2>
        <p className="mt-1 text-sm text-muted">راجع الملفات الطبية وأرسل قرار المعمل من مكان واحد.</p>
      </div>

      <MetricCards />

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(320px,.72fr)_minmax(0,1.55fr)]">
        <OrderList
          orders={filteredOrders}
          selectedOrderId={selectedOrderId}
          query={query}
          filter={filter}
          onQueryChange={setQuery}
          onFilterChange={setFilter}
          onSelect={selectOrder}
        />
        <OrderDetails
          order={selectedOrder}
          onSaveQuote={(quote) => selectedOrder && saveQuote(selectedOrder.id, quote)}
          onAcceptQuote={(quote) => selectedOrder && acceptQuote(selectedOrder.id, quote)}
          onRequestClarification={() => selectedOrder && requestClarification(selectedOrder.id)}
          onReject={() => selectedOrder && rejectOrder(selectedOrder.id)}
          onNotify={setNotice}
        />
      </div>

      {notice ? <Toast message={notice} onClose={clearNotice} /> : null}
    </div>
  );
}
