import { useMemo, useState } from 'react';
import { initialConversations } from '../data/mock-conversations';

export function useConversations() {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState(initialConversations[0].id);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('ar');
    return conversations.filter(
      (item) =>
        !normalized ||
        [item.caseId, item.doctor, item.clinic, item.service]
          .join(' ')
          .toLocaleLowerCase('ar')
          .includes(normalized),
    );
  }, [conversations, query]);
  const selected =
    conversations.find((item) => item.id === selectedId) ?? conversations[0];

  const selectConversation = (id: string) => {
    setSelectedId(id);
    setConversations((current) =>
      current.map((item) => (item.id === id ? { ...item, unread: 0 } : item)),
    );
  };

  const sendMessage = (body: string, internal: boolean) => {
    const trimmed = body.trim();
    if (!trimmed) return;
    setConversations((current) =>
      current.map((item) =>
        item.id === selectedId
          ? {
              ...item,
              lastMessage: internal ? 'تمت إضافة ملاحظة داخلية.' : trimmed,
              lastTime: 'الآن',
              messages: [
                ...item.messages,
                {
                  id: `msg-${Date.now()}`,
                  sender: internal ? 'internal' : 'lab',
                  author: 'أحمد العتيبي',
                  body: trimmed,
                  time: 'الآن',
                },
              ],
            }
          : item,
      ),
    );
  };

  return {
    filtered,
    selected,
    selectedId,
    query,
    setQuery,
    selectConversation,
    sendMessage,
  };
}
