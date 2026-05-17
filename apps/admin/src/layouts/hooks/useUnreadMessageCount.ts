import { useEffect, useState } from 'react';

import { getUnreadMessageCount } from '@/api/message';

export function useUnreadMessageCount(canAccessMessages: boolean) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      if (!canAccessMessages) {
        setUnreadCount(0);
        return;
      }

      try {
        const res = await getUnreadMessageCount();
        setUnreadCount(res.count);
      } catch {
        // ignore
      }
    };

    void fetchUnread();
    const timer = setInterval(() => {
      void fetchUnread();
    }, 30000);

    return () => clearInterval(timer);
  }, [canAccessMessages]);

  return unreadCount;
}
