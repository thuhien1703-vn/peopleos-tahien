import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function initFirebase() {
  if (getApps().length > 0) return;
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, giot, done, streak } = req.body;
  if (!email) return res.status(400).json({ error: 'Thiếu email' });

  try {
    initFirebase();
    const db = getFirestore();
    const userRef = db.collection('users').doc(email);
    
    const update = { lastActive: Date.now() };
    if (typeof giot === 'number') update.giot = giot;
    if (Array.isArray(done)) update.done = done;
    if (typeof streak === 'number') update.streak = streak;

    await userRef.update(update);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('update-giot error:', err);
    return res.status(500).json({ error: 'Lỗi server' });
  }
}
