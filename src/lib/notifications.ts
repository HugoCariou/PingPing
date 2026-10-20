export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function sendNotification(title: string, body?: string) {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  try {
    new Notification(title, {
      body,
      icon: '/pwa-192x192.svg',
      badge: '/favicon.svg',
    });
  } catch (err) {
    // Sur certains navigateurs mobiles, il faut passer par le service worker registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification(title, {
          body,
          icon: '/pwa-192x192.svg',
        });
      }).catch(() => {});
    }
  }
}
