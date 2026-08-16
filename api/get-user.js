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
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Thieu email' });
  try {
    initFirebase();
    const db = getFirestore();
    const doc = await db.collection('users').doc(email).get();
    if (!doc.exists) return res.status(404).json({ error: 'User khong ton tai' });
    const d = doc.data();
    // Chỉ trả các trường tiến độ mà giao diện cần — KHÔNG lộ city/role (nơi làm việc)
    // hay các field nội bộ. email chính là tham số người gọi đã cung cấp nên echo lại
    // không lộ thêm thông tin.
    return res.status(200).json({ success: true, user: {
      email: d.email || email,
      name: d.name || '',
      giot: d.giot || 0,
      done: Array.isArray(d.done) ? d.done : [],
      streak: d.streak || 0,
      lastActive: d.lastActive || 0,
    } });
  } catch (err) {
    return res.status(500).json({ error: 'Loi server' });
  }
};
