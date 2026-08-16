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

  const { tab = 'all', email = '' } = req.query;

  try {
    initFirebase();
    const db = getFirestore();

    let query = db.collection('users').orderBy('giot', 'desc').limit(50);

    // Weekly: filter lastActive within 7 days
    if (tab === 'week') {
      const since = Date.now() - 7 * 24 * 60 * 60 * 1000;
      query = db.collection('users')
        .where('lastActive', '>=', since)
        .orderBy('lastActive', 'desc')
        .orderBy('giot', 'desc')
        .limit(50);
    }

    const snap = await query.get();
    const users = snap.docs.map((doc, i) => {
      const d = doc.data();
      return {
        rank: i + 1,
        // Không trả email của người khác ra ngoài (chống thu thập danh bạ email).
        // Chỉ đánh dấu dòng của chính người đang xem để highlight "(bạn)".
        isMe: !!email && doc.id === email,
        name: d.name || 'Ẩn danh',
        giot: d.giot || 0,
        done: Array.isArray(d.done) ? d.done.length : 0,
        streak: d.streak || 0,
        lastActive: d.lastActive || 0,
      };
    });

    // Find current user rank if email provided
    let myRank = null;
    if (email) {
      const meIdx = snap.docs.findIndex(doc => doc.id === email);
      if (meIdx >= 0) {
        myRank = meIdx + 1;
      } else {
        // Not in top 50 — get their actual rank
        const meSnap = await db.collection('users').doc(email).get();
        if (meSnap.exists) {
          const meGiot = meSnap.data().giot || 0;
          const aboveSnap = await db.collection('users')
            .where('giot', '>', meGiot).count().get();
          myRank = aboveSnap.data().count + 1;
        }
      }
    }

    return res.status(200).json({ users, myRank, tab });
  } catch (err) {
    console.error('leaderboard error:', err);
    return res.status(500).json({ error: err.message });
  }
};
