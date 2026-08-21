export type InvoiceStatus = 'paid' | 'balance_due' | 'overdue';

export interface Invoice {
  id: string;
  caseId: string;
  clinic: string;
  doctor: string;
  service: string;
  subtotal: number;
  tax: number;
  paid: number;
  dueDate: string;
  status: InvoiceStatus;
}
