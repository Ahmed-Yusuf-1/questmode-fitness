// src/lib/firebase-admin.js
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import path from 'path';
import fs from 'fs';

const serviceAccountPath = path.resolve(process.cwd(), 'firebase-admin-sdk.json');

if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(`Could not find the Firebase Admin SDK key file at: ${serviceAccountPath}. Please ensure 'firebase-admin-sdk.json' is in the root of your project.`);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const adminDb = getFirestore();
const adminAuth = getAuth();

export { adminDb, adminAuth };