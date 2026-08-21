import { useMemo, useState } from 'react';
import { initialDeliveryTasks } from '../data/mock-delivery';
import type { DeliveryStatus } from '../types/delivery.types';

export function useDeliveryTasks() {
  const [tasks, setTasks] = useState(initialDeliveryTasks);
  const [selectedId, setSelectedId] = useState(initialDeliveryTasks[0].id);
  const [tab, setTab] = useState<'today' | 'upcoming' | 'completed'>('today');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('ar');
    return tasks.filter((task) => {
      const matchesTab =
        tab === 'completed'
          ? task.status === 'completed'
          : tab === 'today'
            ? task.status !== 'completed'
            : task.status === 'scheduled';
      return (
        matchesTab &&
        (!normalized ||
          [task.id, task.caseId, task.clinic, task.doctor, task.district]
            .join(' ')
            .toLocaleLowerCase('ar')
            .includes(normalized))
      );
    });
  }, [query, tab, tasks]);
  const selected = tasks.find((task) => task.id === selectedId) ?? tasks[0];
  const updateStatus = (status: DeliveryStatus) =>
    setTasks((current) =>
      current.map((task) =>
        task.id === selectedId ? { ...task, status } : task,
      ),
    );

  return {
    filtered,
    selected,
    selectedId,
    setSelectedId,
    tab,
    setTab,
    query,
    setQuery,
    updateStatus,
  };
}
