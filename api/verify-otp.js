import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

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

  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: 'Thiếu thông tin' });

  try {
    initFirebase();
    const db = getFirestore();

    // Kiểm tra OTP
    const otpDoc = await db.collection('otp_sessions').doc(email).get();
    if (!otpDoc.exists) return res.status(400).json({ error: 'Mã không tồn tại. Gửi lại mã mới.' });

    const { code, expiresAt, name } = otpDoc.data();
    if (Date.now() > expiresAt) return res.status(400).json({ error: 'Mã đã hết hạn. Gửi lại mã mới.' });
    if (otp.trim() !== code) return res.status(400).json({ error: 'Mã không đúng. Kiểm tra lại.' });

    // Xóa OTP session
    await db.collection('otp_sessions').doc(email).delete();

    // Tạo hoặc cập nhật user
    const userRef = db.collection('users').doc(email);
    const userDoc = await userRef.get();

    let userData;
    if (!userDoc.exists) {
      // User mới
      userData = {
        email,
        name: name || email.split('@')[0],
        giot: 0,
        done: [],
        streak: 0,
        lastActive: Date.now(),
        createdAt: Date.now(),
      };
      await userRef.set(userData);
    } else {
      // User cũ — cập nhật lastActive
      userData = userDoc.data();
      await userRef.update({ lastActive: Date.now() });
    }

    return res.status(200).json({ success: true, user: userData });
  } catch (err) {
    console.error('verify-otp error:', err);
    return res.status(500).json({ error: 'Lỗi server. Thử lại sau.' });
  }
}
