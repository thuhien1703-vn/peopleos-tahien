const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

function initFirebase() {
  if (getApps().length > 0) return;
  initializeApp({ credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  })});
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: 'Thieu thong tin' });

  try {
    initFirebase();
    const db = getFirestore();
    const otpDoc = await db.collection('otp_sessions').doc(email).get();
    if (!otpDoc.exists) return res.status(400).json({ error: 'Ma khong ton tai. Gui lai ma moi.' });

    const { code, expiresAt, name } = otpDoc.data();
    if (Date.now() > expiresAt) return res.status(400).json({ error: 'Ma da het han. Gui lai ma moi.' });
    if (otp.trim() !== code) return res.status(400).json({ error: 'Ma khong dung. Kiem tra lai.' });

    await db.collection('otp_sessions').doc(email).delete();

    const userRef = db.collection('users').doc(email);
    const userDoc = await userRef.get();
    let userData;

    if (!userDoc.exists) {
      userData = { email, name: name || email.split('@')[0], giot: 0, done: [], streak: 0, lastActive: Date.now(), createdAt: Date.now() };
      await userRef.set(userData);
    } else {
      userData = userDoc.data();
      await userRef.update({ lastActive: Date.now() });
    }

    return res.status(200).json({ success: true, user: userData });
  } catch (err) {
    console.error('verify-otp error:', err);
    return res.status(500).json({ error: 'Loi server.' });
  }
};
