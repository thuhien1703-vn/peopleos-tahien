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

// 10 HR professionals — tên thật, tỉnh thành thực tế VN, progress realistic
// Weekly active users — lastActive within 7 days (refreshed on each seed call)
const NOW = Date.now();
const DAY = 24 * 60 * 60 * 1000;

const SEED_USERS = [
  // ── Top 5: active this week (show in both All-time & Weekly tab) ──
  {
    email: 'linh.nguyen.hrm@gmail.com',
    name: 'Nguyễn Thị Linh',
    giot: 1248,
    done: ['k1','k2','k3','k4','k5','k6','k7','k8','k9','k10'],
    streak: 24,
    city: 'Hà Nội',
    role: 'HR Manager · Masan Group',
    lastActive: NOW - 0.5 * DAY,
    createdAt: NOW - 45 * DAY,
  },
  {
    email: 'minh.tran.hrbp@gmail.com',
    name: 'Trần Đức Minh',
    giot: 1092,
    done: ['k1','k2','k3','k4','k5','k6','k7','k8','k9'],
    streak: 18,
    city: 'TP. Hồ Chí Minh',
    role: 'HRBP · Vingroup',
    lastActive: NOW - 1 * DAY,
    createdAt: NOW - 38 * DAY,
  },
  {
    email: 'huong.pham.talent@gmail.com',
    name: 'Phạm Thị Hương',
    giot: 984,
    done: ['k1','k2','k3','k4','k5','k6','k7','k8'],
    streak: 15,
    city: 'Đà Nẵng',
    role: 'Talent Acquisition Lead · FPT Software',
    lastActive: NOW - 2 * DAY,
    createdAt: NOW - 32 * DAY,
  },
  {
    email: 'nam.le.hrd@gmail.com',
    name: 'Lê Hoàng Nam',
    giot: 876,
    done: ['k1','k2','k3','k4','k5','k6','k7'],
    streak: 12,
    city: 'TP. Hồ Chí Minh',
    role: 'HRD · Công ty CP Bán lẻ Kỹ thuật số',
    lastActive: NOW - 3 * DAY,
    createdAt: NOW - 28 * DAY,
  },
  {
    email: 'thuy.vo.lnd@gmail.com',
    name: 'Võ Ngọc Thúy',
    giot: 768,
    done: ['k1','k2','k3','k4','k5','k6'],
    streak: 9,
    city: 'Hải Phòng',
    role: 'L&D Specialist · Techcombank',
    lastActive: NOW - 4 * DAY,
    createdAt: NOW - 22 * DAY,
  },
  // ── Bottom 5: older activity (All-time tab only) ──
  {
    email: 'cuong.hoang.hrops@gmail.com',
    name: 'Hoàng Văn Cường',
    giot: 648,
    done: ['k1','k2','k3','k4','k5'],
    streak: 7,
    city: 'Cần Thơ',
    role: 'HR Executive · Grab Vietnam',
    lastActive: NOW - 10 * DAY,
    createdAt: NOW - 18 * DAY,
  },
  {
    email: 'mai.dang.recruiter@gmail.com',
    name: 'Đặng Thị Mai',
    giot: 528,
    done: ['k1','k2','k3','k4'],
    streak: 5,
    city: 'Bình Dương',
    role: 'Recruiter · Unilever Vietnam',
    lastActive: NOW - 12 * DAY,
    createdAt: NOW - 14 * DAY,
  },
  {
    email: 'ha.nguyen.hrstaf@gmail.com',
    name: 'Nguyễn Hà Anh',
    giot: 396,
    done: ['k1','k2','k3'],
    streak: 4,
    city: 'Hà Nội',
    role: 'HR Staff · Vinamilk',
    lastActive: NOW - 14 * DAY,
    createdAt: NOW - 10 * DAY,
  },
  {
    email: 'long.bui.hrjunior@gmail.com',
    name: 'Bùi Thanh Long',
    giot: 264,
    done: ['k1','k2'],
    streak: 3,
    city: 'Đồng Nai',
    role: 'HR Junior · Novaland',
    lastActive: NOW - 16 * DAY,
    createdAt: NOW - 7 * DAY,
  },
  {
    email: 'trang.phan.hrnew@gmail.com',
    name: 'Phan Thị Trang',
    giot: 132,
    done: ['k1'],
    streak: 2,
    city: 'Quảng Nam',
    role: 'HR Fresher · Công ty CP Dệt may',
    lastActive: NOW - 20 * DAY,
    createdAt: NOW - 5 * DAY,
  },
];

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Auth check
  const key = req.query.key || (req.headers['authorization'] || '');
  if (!key.includes(process.env.CRON_SECRET || 'peopleos-weekly-2026')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    initFirebase();
    const db = getFirestore();
    const batch = db.batch();
    let seeded = 0;

    for (const user of SEED_USERS) {
      const ref = db.collection('users').doc(user.email);
      const existing = await ref.get();
      // Always update seeded users' lastActive so weekly tab stays fresh
      const existingData = existing.exists ? existing.data() : {};
      if (!existing.exists || existingData.isSeeded) {
        batch.set(ref, {
          name: user.name,
          email: user.email,
          giot: user.giot,
          done: user.done,
          streak: user.streak,
          city: user.city,
          role: user.role,
          lastActive: user.lastActive,
          createdAt: user.createdAt,
          isSeeded: true,
        });
        seeded++;
      }
    }

    await batch.commit();
    return res.status(200).json({
      success: true,
      seeded,
      skipped: SEED_USERS.length - seeded,
      message: `Seeded ${seeded} users, skipped ${SEED_USERS.length - seeded} existing`,
    });
  } catch (err) {
    console.error('seed-users error:', err);
    return res.status(500).json({ error: err.message });
  }
};
