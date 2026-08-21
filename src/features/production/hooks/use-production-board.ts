import { useMemo, useState } from 'react';
import { initialProductionCases } from '../data/mock-production';
import type { ProductionStage } from '../types/production.types';

export function useProductionBoard() {
  const [cases, setCases] = useState(initialProductionCases);
  const [query, setQuery] = useState('');
  const [technician, setTechnician] = useState('all');

  const filteredCases = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('ar');
    return cases.filter((item) => {
      const matchesSearch =
        !normalized ||
        [item.id, item.service, item.doctor, item.clinic]
          .join(' ')
          .toLocaleLowerCase('ar')
          .includes(normalized);
      return (
        matchesSearch &&
        (technician === 'all' || item.technician === technician)
      );
    });
  }, [cases, query, technician]);

  const moveCase = (caseId: string, stage: ProductionStage) => {
    setCases((current) =>
      current.map((item) => (item.id === caseId ? { ...item, stage } : item)),
    );
  };

  return {
    filteredCases,
    query,
    setQuery,
    technician,
    setTechnician,
    moveCase,
  };
}
