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

const TAKEAWAYS = [
  { course: 'K1 · EQ & Self-Mastery', text: 'EQ không phải tính cách bẩm sinh. Đó là hệ cơ — có thể luyện tập mỗi ngày.' },
  { course: 'K8 · Finance-HR Hybrid', text: 'Khi HR hiểu P&L, HR không còn xin ngân sách — HR đề xuất đầu tư với ROI rõ ràng.' },
  { course: 'K10 · HRBP Mindset', text: 'HRBP không phải HR làm thêm việc của business. HRBP là business person với HR expertise.' },
  { course: 'K6 · L&D Thực Chiến', text: 'Training không đo được hiệu quả là chi phí, không phải đầu tư.' },
  { course: 'K12 · HR Analytics', text: 'HR Reporting kể chuyện gì đã xảy ra. HR Analytics giải thích tại sao và gợi ý điều gì nên làm tiếp.' },
  { course: 'K16 · Stagility', text: 'Workforce linh hoạt không phải là không ổn định. Đó là thiết kế có chủ ý.' },
  { course: 'K3 · AI Literacy', text: 'AI không thay HR. HR dùng AI thay HR không dùng AI.' },
];

const NEXT_COURSE_MAP = {
  k1: { url: '/k2-giao-tiep-anh-huong', name: 'K2 · Giao Tiếp & Ảnh Hưởng' },
  k2: { url: '/k3-ai-literacy-hr', name: 'K3 · AI Literacy Cho HR' },
  k3: { url: '/k4-hr-ops-thuc-chien', name: 'K4 · HR Ops Thực Chiến' },
  k4: { url: '/k5-recruiting-co-ban', name: 'K5 · Recruiting Cơ Bản' },
  k5: { url: '/k6-ld-thuc-chien', name: 'K6 · L&D Thực Chiến' },
  k6: { url: '/bridge-assessment', name: 'Bridge Assessment → Growth Track' },
  k7: { url: '/k8-finance-hr-hybrid', name: 'K8 · Finance-HR Hybrid ★' },
  k8: { url: '/k9-talent-management', name: 'K9 · Talent Management' },
  k9: { url: '/k10-hrbp-mindset', name: 'K10 · HRBP Mindset' },
  k10: { url: '/k11-performance-revpamh', name: 'K11 · Performance RevPAMH ★' },
  k11: { url: '/k12-hr-analytics', name: 'K12 · HR Analytics' },
  k12: { url: '/k13-executive-presence', name: 'K13 · Executive Presence' },
  k13: { url: '/k14-tam-nhin-van-hoa', name: 'K14 · Văn Hóa & Culture Design' },
  k14: { url: '/k15-ai-strategy-chro', name: 'K15 · AI Strategy CHRO' },
  k15: { url: '/k16-workforce-stagility', name: 'K16 · Stagility & Workforce ★' },
  k16: { url: '/k17-finance-hr-advanced', name: 'K17 · Finance-HR Nâng Cao' },
  k17: { url: '/k18-people-analytics-plus', name: 'K18 · People Analytics+' },
  k18: { url: '/kiem-tra-trinh-do', name: 'Kiểm tra trình độ toàn diện' },
};

function getNextCourse(doneList) {
  const order = ['k1','k2','k3','k4','k5','k6','k7','k8','k9','k10','k11','k12','k13','k14','k15','k16','k17','k18'];
  for (const k of order) {
    if (!doneList.includes(k)) {
      return NEXT_COURSE_MAP[k] || null;
    }
  }
  return null;
}

function buildEmailHTML(user, nextCourse, takeaway, rank) {
  const name = user.name || 'bạn';
  const giot = user.giot || 0;
  const doneCount = (user.done || []).length;
  const streak = user.streak || 0;

  return `
<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F0F4F8;font-family:Arial,sans-serif">
<div style="max-width:560px;margin:0 auto;padding:24px 16px">

  <!-- Header -->
  <div style="background:#020B18;border-radius:16px 16px 0 0;padding:28px 28px 20px;text-align:center;border-bottom:2px solid #22D3EE">
    <div style="font-family:Georgia,serif;font-size:26px;font-weight:700;color:#22D3EE">PeopleOS</div>
    <div style="font-size:12px;color:#8BB8CC;margin-top:4px">Learning Hub · Weekly Digest · by TaHien</div>
  </div>

  <!-- Greeting -->
  <div style="background:#062040;padding:24px 28px;border-left:3px solid #22D3EE">
    <div style="font-size:15px;color:#E8F4F8;margin-bottom:4px">Chào <b>${name}</b> 👋</div>
    <div style="font-size:13px;color:#8BB8CC;line-height:1.6">Đây là digest học tập tuần này của bạn từ PeopleOS.</div>
  </div>

  <!-- Stats -->
  <div style="background:#062040;padding:20px 28px;border-top:1px solid rgba(34,211,238,.1)">
    <div style="font-size:11px;font-weight:700;color:#8BB8CC;letter-spacing:.08em;text-transform:uppercase;margin-bottom:14px">📊 Tóm tắt của bạn</div>
    <div style="display:flex;gap:0">
      <div style="flex:1;text-align:center;padding:14px 10px;background:#0A2E50;border-radius:10px;margin-right:8px">
        <div style="font-size:24px;font-weight:800;color:#22D3EE">${giot}</div>
        <div style="font-size:11px;color:#8BB8CC;margin-top:2px">💧 Giọt tích lũy</div>
      </div>
      <div style="flex:1;text-align:center;padding:14px 10px;background:#0A2E50;border-radius:10px;margin-right:8px">
        <div style="font-size:24px;font-weight:800;color:#10B981">${doneCount}</div>
        <div style="font-size:11px;color:#8BB8CC;margin-top:2px">📚 Khóa hoàn thành</div>
      </div>
      <div style="flex:1;text-align:center;padding:14px 10px;background:#0A2E50;border-radius:10px;margin-right:8px">
        <div style="font-size:24px;font-weight:800;color:#F0C040">${streak}</div>
        <div style="font-size:11px;color:#8BB8CC;margin-top:2px">🔥 Ngày streak</div>
      </div>
      <div style="flex:1;text-align:center;padding:14px 10px;background:#0A2E50;border-radius:10px">
        <div style="font-size:24px;font-weight:800;color:#A78BFA">#${rank || '—'}</div>
        <div style="font-size:11px;color:#8BB8CC;margin-top:2px">🏆 Xếp hạng</div>
      </div>
    </div>
  </div>

  <!-- Takeaway of the week -->
  <div style="background:#0D1A2E;padding:24px 28px;border-top:1px solid rgba(34,211,238,.1);border-left:3px solid #F0C040">
    <div style="font-size:11px;font-weight:700;color:#F0C040;letter-spacing:.08em;text-transform:uppercase;margin-bottom:12px">💡 Câu mang đi tuần này</div>
    <div style="font-size:16px;font-style:italic;color:#E8F4F8;line-height:1.7;margin-bottom:8px">"${takeaway.text}"</div>
    <div style="font-size:12px;color:#8BB8CC">— TaHien · ${takeaway.course}</div>
  </div>

  <!-- Next course -->
  ${nextCourse ? `
  <div style="background:#062040;padding:24px 28px;border-top:1px solid rgba(34,211,238,.1)">
    <div style="font-size:11px;font-weight:700;color:#8BB8CC;letter-spacing:.08em;text-transform:uppercase;margin-bottom:12px">📍 Tiếp theo trong lộ trình của bạn</div>
    <div style="font-size:15px;font-weight:700;color:#22D3EE;margin-bottom:6px">${nextCourse.name}</div>
    <div style="font-size:13px;color:#8BB8CC;margin-bottom:16px">~20 phút · Học ngay để duy trì streak và tích thêm Giọt</div>
    <a href="https://peopleos-tahien.vercel.app${nextCourse.url}" style="display:inline-block;background:linear-gradient(135deg,#22D3EE,#06B6D4);color:#020B18;border-radius:10px;padding:12px 24px;font-size:14px;font-weight:700;text-decoration:none">Học ngay →</a>
  </div>
  ` : `
  <div style="background:#062040;padding:24px 28px;border-top:1px solid rgba(34,211,238,.1)">
    <div style="font-size:15px;font-weight:700;color:#22D3EE;margin-bottom:6px">🎉 Bạn đã hoàn thành toàn bộ 18 khóa!</div>
    <div style="font-size:13px;color:#8BB8CC;margin-bottom:16px">Xem xếp hạng và chia sẻ thành tựu lên LinkedIn.</div>
    <a href="https://peopleos-tahien.vercel.app" style="display:inline-block;background:linear-gradient(135deg,#F0C040,#E6A820);color:#020B18;border-radius:10px;padding:12px 24px;font-size:14px;font-weight:700;text-decoration:none">Về Learning Hub</a>
  </div>
  `}

  <!-- Footer -->
  <div style="background:#020B18;border-radius:0 0 16px 16px;padding:20px 28px;text-align:center;border-top:1px solid rgba(34,211,238,.1)">
    <div style="font-size:11px;color:#4A7A94;line-height:1.8">
      PeopleOS Learning Hub · by TaHien · CHCO Golden Gate Group<br>
      <a href="https://peopleos-tahien.vercel.app" style="color:#22D3EE;text-decoration:none">peopleos-tahien.vercel.app</a>
    </div>
  </div>

</div>
</body>
</html>`;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Bao mat (sua 30/08): repo nay PUBLIC nen KHONG duoc de secret du phong trong ma nguon.
  // Vercel tu gui header `Authorization: Bearer $CRON_SECRET` khi goi cron,
  // nen khong con nhan key qua query string (query string bi ghi vao log).
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return res.status(500).json({ error: 'CRON_SECRET chua duoc cau hinh' });
  }
  if (req.headers['authorization'] !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    initFirebase();
    const db = getFirestore();

    // Get all active users (active in last 30 days)
    const since = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const snap = await db.collection('users')
      .where('lastActive', '>=', since)
      .orderBy('lastActive', 'desc')
      .limit(500)
      .get();

    if (snap.empty) {
      return res.status(200).json({ sent: 0, message: 'No active users' });
    }

    // Get leaderboard for ranks
    const lbSnap = await db.collection('users').orderBy('giot', 'desc').limit(100).get();
    const rankMap = {};
    lbSnap.docs.forEach((doc, i) => { rankMap[doc.id] = i + 1; });

    // Pick takeaway of the week (rotate by week number)
    const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
    const takeaway = TAKEAWAYS[weekNum % TAKEAWAYS.length];

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
    });

    let sent = 0, failed = 0;
    const users = snap.docs.map(doc => ({ email: doc.id, ...doc.data() }));

    for (const user of users) {
      if (!user.email || !user.email.includes('@')) continue;
      try {
        const doneList = Array.isArray(user.done) ? user.done : [];
        const nextCourse = getNextCourse(doneList);
        const rank = rankMap[user.email] || null;
        const html = buildEmailHTML(user, nextCourse, takeaway, rank);

        await transporter.sendMail({
          from: '"PeopleOS Learning Hub" <' + process.env.GMAIL_USER + '>',
          to: user.email,
          subject: `[PeopleOS] Digest tuần này · ${user.giot || 0} Giọt · "${takeaway.text.substring(0, 40)}..."`,
          html,
        });
        sent++;
        // Small delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 200));
      } catch (e) {
        failed++;
        console.error('Failed to send to', user.email, e.message);
      }
    }

    return res.status(200).json({
      success: true, sent, failed,
      total: users.length, takeaway: takeaway.course
    });
  } catch (err) {
    console.error('weekly-digest error:', err);
    return res.status(500).json({ error: err.message });
  }
};
