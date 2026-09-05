import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

function getFirebaseApp(): FirebaseApp | null {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  if (!config.apiKey || !config.storageBucket) {
    return null;
  }

  return getApps().length ? getApps()[0]! : initializeApp(config);
}

export function isFirebaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  );
}

export async function uploadAdminFile(
  file: File,
  folder: "plots" | "experiences"
): Promise<string> {
  const app = getFirebaseApp();
  if (!app) {
    throw new Error(
      "Firebase is not configured. Paste a URL instead, or set NEXT_PUBLIC_FIREBASE_* env vars."
    );
  }
  const storage = getStorage(app);
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `AdminUploads/${folder}/${Date.now()}-${safeName}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
