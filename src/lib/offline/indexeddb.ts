// IndexedDB helper for offline caching of emergency contacts and attractions
// Ensures emergency contacts are 100% accessible with zero cellular reception

import type { EmergencyContact, Attraction, TransportMatrix } from '@/lib/types/database';

const DB_NAME = 'naujan-trail-offline';
const DB_VERSION = 1;

interface NaujanDB {
  emergencyContacts: EmergencyContact[];
  attractions: Attraction[];
  transportMatrix: TransportMatrix[];
}

type StoreName = keyof NaujanDB;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('emergencyContacts')) {
        db.createObjectStore('emergencyContacts', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('attractions')) {
        db.createObjectStore('attractions', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('transportMatrix')) {
        db.createObjectStore('transportMatrix', { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveToOffline<T extends StoreName>(
  storeName: T,
  data: NaujanDB[T]
): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);

  // Clear existing data
  store.clear();

  // Add new data
  for (const item of data) {
    store.put(item);
  }

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getFromOffline<T extends StoreName>(
  storeName: T
): Promise<NaujanDB[T]> {
  const db = await openDB();
  const tx = db.transaction(storeName, 'readonly');
  const store = tx.objectStore(storeName);
  const request = store.getAll();

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result as NaujanDB[T]);
    request.onerror = () => reject(request.error);
  });
}

export async function isOfflineDataAvailable(storeName: StoreName): Promise<boolean> {
  try {
    const data = await getFromOffline(storeName);
    return data.length > 0;
  } catch {
    return false;
  }
}
