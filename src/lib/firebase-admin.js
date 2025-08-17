import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

if (!process.env.FIREBASE_ADMIN_SDK_JSON) {
  throw new Error('The FIREBASE_ADMIN_SDK_JSON environment variable is not set.');
}

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_JSON);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const adminDb = getFirestore();
const adminAuth = getAuth();

export { adminDb, adminAuth };