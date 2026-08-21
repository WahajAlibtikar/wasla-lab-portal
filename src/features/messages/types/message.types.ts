export interface ConversationMessage {
  id: string;
  sender: 'doctor' | 'lab' | 'internal';
  author: string;
  body: string;
  time: string;
  attachments?: Array<{ name: string; size: string }>;
}

export interface Conversation {
  id: string;
  caseId: string;
  doctor: string;
  initials: string;
  clinic: string;
  service: string;
  status: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: ConversationMessage[];
}
