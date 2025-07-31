import { useEffect } from 'react';

import { useCartState, useCartDispatch } from '../contexts/CartContext';
import { getNotifications } from '../reducer';

export function useNotifications() {
  const state = useCartState();
  const dispatch = useCartDispatch();

  const notifications = getNotifications(state);

  useEffect(() => {
    if (state?.notifications && notifications.length > 0) {
      notifications.forEach((noti: { message: string; id: Date }) => {
        alert(noti.message);
        dispatch?.({ type: 'REMOVE_NOTIFICATION', payload: { notificationId: noti.id } });
      });
    }
  }, [notifications, dispatch]);
}
