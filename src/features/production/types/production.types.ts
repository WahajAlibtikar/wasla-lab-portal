export type ProductionStage = 'design' | 'manufacturing' | 'quality' | 'ready';

export interface ProductionCase {
  id: string;
  service: string;
  doctor: string;
  clinic: string;
  due: string;
  attachments: number;
  technician: string;
  technicianInitials: string;
  stage: ProductionStage;
  priority: 'normal' | 'urgent' | 'overdue';
}
