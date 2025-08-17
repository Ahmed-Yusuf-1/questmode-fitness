// src/lib/firebase-admin.js
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import path from 'path';
import fs from 'fs';

// Construct an absolute path to the service account key from the project's root
const serviceAccountPath = path.resolve(process.cwd(), 'firebase-admin-sdk.json');

// Check if the file actually exists before trying to use it
if (!fs.existsSync(serviceAccountPath)) {
    // This will throw a very clear error in your terminal if the file is missing or misplaced
    throw new Error(`Could not find the Firebase Admin SDK key file at: ${serviceAccountPath}. Please ensure 'firebase-admin-sdk.json' is in the root of your project.`);
}

// Read the file and parse it as JSON
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));


// Initialize the app if it hasn't been already
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const adminDb = getFirestore();
const adminAuth = getAuth();

export { adminDb, adminAuth };