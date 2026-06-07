import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Init Firebase Admin
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

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, name } = req.body;
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'Email không hợp lệ' });

  try {
    initFirebase();
    const db = getFirestore();
    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 phút

    // Lưu OTP vào Firestore
    await db.collection('otp_sessions').doc(email).set({ code: otp, expiresAt, name: name || '' });

    // Gửi email qua Resend
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'PeopleOS <onboarding@resend.dev>',
        to: [email],
        subject: `${otp} — Mã xác minh PeopleOS Learning Hub`,
        html: `
          <div style="font-family:'Be Vietnam Pro',Arial,sans-serif;max-width:480px;margin:0 auto;background:#020B18;padding:32px;border-radius:16px">
            <div style="text-align:center;margin-bottom:24px">
              <div style="font-family:Georgia,serif;font-size:24px;font-weight:700;color:#22D3EE">PeopleOS</div>
              <div style="font-size:12px;color:#94A3B8">Learning Hub · by TaHien</div>
            </div>
            <p style="color:#F0F6FF;font-size:15px;margin-bottom:8px">Xin chào ${name || ''},</p>
            <p style="color:#94A3B8;font-size:14px;margin-bottom:24px">Đây là mã xác minh của bạn để đăng nhập vào PeopleOS Learning Hub:</p>
            <div style="background:linear-gradient(135deg,#06B6D4,#22D3EE);border-radius:12px;padding:20px;text-align:center;margin-bottom:24px">
              <div style="font-size:42px;font-weight:800;letter-spacing:12px;color:#020B18;font-family:monospace">${otp}</div>
            </div>
            <p style="color:#94A3B8;font-size:12px;text-align:center">Mã có hiệu lực trong <strong style="color:#F0C040">10 phút</strong>.</p>
            <p style="color:#94A3B8;font-size:12px;text-align:center">Nếu bạn không yêu cầu mã này, hãy bỏ qua email này.</p>
            <hr style="border:none;border-top:1px solid #0F3050;margin:24px 0">
            <p style="color:#4A7A94;font-size:11px;text-align:center">TaHien · CHCO Golden Gate Group · PeopleOS Community 2026</p>
          </div>
        `,
      }),
    });

    if (!resendRes.ok) {
      const err = await resendRes.text();
      console.error('Resend error:', err);
      return res.status(500).json({ error: 'Không gửi được email. Thử lại sau.' });
    }

    return res.status(200).json({ success: true, message: 'OTP đã được gửi' });
  } catch (err) {
    console.error('send-otp error:', err);
    return res.status(500).json({ error: 'Lỗi server. Thử lại sau.' });
  }
}
