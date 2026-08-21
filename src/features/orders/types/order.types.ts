export type OrderStatus =
  | 'new'
  | 'awaiting_review'
  | 'needs_clarification'
  | 'quote_sent'
  | 'in_production'
  | 'rejected';

export type OrderPriority = 'normal' | 'urgent';

export type AttachmentKind = 'stl' | 'image' | 'pdf';

export interface OrderAttachment {
  id: string;
  name: string;
  kind: AttachmentKind;
  size: string;
  label: string;
}

export interface CaseMessage {
  id: string;
  sender: 'doctor' | 'lab';
  author: string;
  body: string;
  time: string;
}

export interface TimelineStep {
  id: string;
  label: string;
  time: string;
  state: 'done' | 'current' | 'upcoming';
}

export interface QuoteDraft {
  price: string;
  workingDays: string;
  promisedDate: string;
  internalNote: string;
}

export interface LabOrder {
  id: string;
  doctorName: string;
  clinicName: string;
  clinicCity: string;
  submittedAt: string;
  service: string;
  teeth: string;
  shade: string;
  patientInitials: string;
  patientAge: string;
  requestedDelivery: string;
  priority: OrderPriority;
  status: OrderStatus;
  unread: boolean;
  prescription: string;
  attachments: OrderAttachment[];
  messages: CaseMessage[];
  timeline: TimelineStep[];
  quote?: QuoteDraft;
}

export type OrderFilter = 'all' | 'attention' | 'urgent' | OrderStatus;
