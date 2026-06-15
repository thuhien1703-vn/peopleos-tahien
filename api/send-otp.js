const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const nodemailer = require('nodemailer');

function initFirebase() {
  if (getApps().length > 0) return;
  initializeApp({ credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  })});
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, name } = req.body;
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'Email khong hop le' });

  try {
    initFirebase();
    const db = getFirestore();
    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    await db.collection('otp_sessions').doc(email).set({ code: otp, expiresAt, name: name || '' });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: '"PeopleOS Learning Hub" <' + process.env.GMAIL_USER + '>',
      to: email,
      subject: otp + ' — Ma xac minh PeopleOS Learning Hub',
      html: `
<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;background:#020B18;padding:32px;border-radius:16px">
  <div style="text-align:center;margin-bottom:24px">
    <div style="font-family:Georgia,serif;font-size:26px;font-weight:700;color:#22D3EE">PeopleOS</div>
    <div style="font-size:12px;color:#94A3B8;margin-top:4px">Learning Hub &middot; by TaHien</div>
  </div>
  <p style="color:#F0F6FF;font-size:15px;margin-bottom:8px">Xin chao ${name || 'ban'},</p>
  <p style="color:#94A3B8;font-size:14px;margin-bottom:20px">Day la ma xac minh cua ban:</p>
  <div style="background:linear-gradient(135deg,#06B6D4,#22D3EE);border-radius:12px;padding:24px 16px;text-align:center;margin-bottom:24px">
    <div style="font-size:48px;font-weight:800;letter-spacing:8px;color:#020B18;font-family:monospace;white-space:nowrap">${otp}</div>
  </div>
  <p style="color:#94A3B8;font-size:12px;text-align:center">Ma co hieu luc trong <strong style="color:#F0C040">10 phut</strong>.</p>
  <hr style="border:none;border-top:1px solid #0F3050;margin:24px 0">
  <p style="color:#4A7A94;font-size:11px;text-align:center">PeopleOS Learning Hub &middot; by TaHien &middot; 2026</p>
</div>`,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('send-otp error:', err);
    return res.status(500).json({ error: 'Khong gui duoc email. Thu lai sau.' });
  }
};
