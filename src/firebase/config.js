import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBjVaNDIoUvm0La7OwGqLxmMFQcrNb_Oh4",
  authDomain: "skillzone-esports.firebaseapp.com",
  projectId: "skillzone-esports",
  storageBucket: "skillzone-esports.firebasestorage.app",
  messagingSenderId: "496866292552",
  appId: "1:496866292552:web:21054909e1ce530243f97d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

// Firebase Messaging - Only initialize on supported browsers
// iOS Safari does NOT support Firebase Cloud Messaging
let messagingInstance = null;

const isMessagingSupported = () => {
  // Check if running in a browser that supports messaging
  if (typeof window === 'undefined') return false;

  // iOS Safari check - iOS doesn't support FCM web push
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isIOSSafari = isIOS && /Safari/.test(navigator.userAgent);

  // Check for required APIs
  const hasServiceWorker = 'serviceWorker' in navigator;
  const hasNotification = 'Notification' in window;
  const hasPushManager = 'PushManager' in window;

  // iOS Safari doesn't fully support Push API
  if (isIOS) {
    console.log('iOS detected - FCM not supported, using Firestore notifications only');
    return false;
  }

  return hasServiceWorker && hasNotification && hasPushManager;
};

// Lazy initialization of messaging to prevent iOS crashes
export const getMessagingInstance = async () => {
  if (messagingInstance) return messagingInstance;

  if (!isMessagingSupported()) {
    console.log('Firebase Messaging not supported on this browser');
    return null;
  }

  try {
    const { getMessaging } = await import('firebase/messaging');
    messagingInstance = getMessaging(app);
    return messagingInstance;
  } catch (error) {
    console.error('Failed to initialize Firebase Messaging:', error);
    return null;
  }
};

// For backward compatibility - but returns null on iOS
export const messaging = null; // Will be initialized lazily

export default app;

