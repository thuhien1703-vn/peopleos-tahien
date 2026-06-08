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
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    initFirebase();
    const db = getFirestore();
    const snap = await db.collection('users')
      .orderBy('giot', 'desc')
      .limit(50)
      .get();
    const users = snap.docs.map((doc, i) => {
      const d = doc.data();
      return {
        rank: i + 1,
        name: d.name || 'Ẩn danh',
        giot: d.giot || 0,
        done: (d.done || []).length,
        streak: d.streak || 0,
        createdAt: d.createdAt?.toDate?.()?.toISOString() || null,
      };
    });
    return res.status(200).json({ users });
  } catch (err) {
    console.error('leaderboard error:', err);
    return res.status(500).json({ error: err.message });
  }
};
