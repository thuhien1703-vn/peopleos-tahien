import { useState, useEffect, useRef } from "react";

// ── BRAND COLORS (từ landing page của chị) ──────────────────
const C = {
  navy:    "#020B18",
  navy2:   "#062040",
  navy3:   "#0A2E50",
  navy4:   "#0F3A60",
  cyan:    "#22D3EE",
  teal:    "#06B6D4",
  cyan2:   "#67E8F9",
  gold:    "#F0C040",
  gold2:   "#FDE68A",
  white:   "#F0F6FF",
  muted:   "#94A3B8",
  border:  "#0F3050",
  border2: "#1A4060",
};

// ── ALL COURSES DATA ────────────────────────────────────────
// ── COMPUTED STATS (dynamic from ALL_COURSES) ──────────────
// Usage: LIVE_COURSES, TOTAL_MODULES, TOTAL_HOURS computed below data

const ALL_COURSES = [
  // ══ PeopleOS Career Path (18 khóa · 3 cấp) ══════════════
  // Cấp 1 — HR Staff & Specialist
  { id:101, cat:"EQ & Lãnh Đạo",   emoji:"🧠", title:"EQ & Self-Mastery",             sub:"Nền tảng cảm xúc cho HR",       dur:"18 phút", type:"Khóa học", level:"HR Staff",       hot:true,  tags:["VI"], url:"/k1-eq-selfmastery",           xp:108, modules:6 },
  { id:102, cat:"EQ & Lãnh Đạo",   emoji:"💬", title:"Giao Tiếp & Ảnh Hưởng",        sub:"Nói để người khác hành động",   dur:"18 phút", type:"Khóa học", level:"HR Staff",       hot:true,  tags:["VI"], url:"/k2-giao-tiep-anh-huong",      xp:108, modules:6 },
  { id:103, cat:"AI-First HR",      emoji:"🤖", title:"AI Literacy Cho HR",            sub:"Prompt · Tools · Automation",   dur:"20 phút", type:"Khóa học", level:"HR Staff",       hot:true,  tags:["VI"], url:"/k3-ai-literacy-hr",           xp:120, modules:6 },
  { id:104, cat:"HR Operations",    emoji:"📋", title:"HR Ops Thực Chiến",             sub:"Hợp đồng · C&B · HRIS VN",     dur:"20 phút", type:"Khóa học", level:"HR Staff",       hot:false, tags:["VI"], url:"/k4-hr-ops-thuc-chien",        xp:120, modules:6 },
  { id:105, cat:"Talent",           emoji:"🔍", title:"Recruiting Cơ Bản",             sub:"JD · Sourcing · Phỏng vấn",    dur:"20 phút", type:"Khóa học", level:"HR Staff",       hot:false, tags:["VI"], soon:true,                           xp:120, modules:6 },
  { id:106, cat:"L&D",              emoji:"🎓", title:"L&D Thực Chiến",               sub:"ADDIE · Kirkpatrick · ILT",     dur:"20 phút", type:"Khóa học", level:"HR Staff",       hot:false, tags:["VI"], soon:true,                           xp:120, modules:6 },
  // Cấp 2 — HR Manager & Senior Specialist
  { id:107, cat:"EQ & Lãnh Đạo",   emoji:"⚡", title:"Leadership Không Chức Danh",   sub:"Dẫn dắt bằng ảnh hưởng",       dur:"20 phút", type:"Khóa học", level:"HR Manager",     hot:true,  tags:["VI"], soon:true,                           xp:132, modules:6 },
  { id:108, cat:"EQ & Lãnh Đạo",   emoji:"🧩", title:"Tư Duy Hệ Thống",              sub:"Quyết định bằng dữ liệu",      dur:"20 phút", type:"Khóa học", level:"HR Manager",     hot:false, tags:["VI"], soon:true,                           xp:132, modules:6 },
  { id:109, cat:"EQ & Lãnh Đạo",   emoji:"🔄", title:"Quản Trị Thay Đổi",            sub:"ADKAR · Kháng cự · Văn hóa",   dur:"20 phút", type:"Khóa học", level:"HR Manager",     hot:false, tags:["VI"], soon:true,                           xp:132, modules:6 },
  { id:110, cat:"Finance-HR",       emoji:"💼", title:"HRBP Mindset",                  sub:"P&L · 9-box · Business lang",  dur:"22 phút", type:"Khóa học", level:"HR Manager",     hot:true,  tags:["VI"], soon:true,                           xp:144, modules:6 },
  { id:111, cat:"Finance-HR",       emoji:"📈", title:"Performance Mgmt · RevPAMH",   sub:"OKR · KPI · Calibration",      dur:"22 phút", type:"Khóa học", level:"HR Manager",     hot:true,  tags:["VI"], soon:true,                           xp:144, modules:6 },
  { id:112, cat:"People Analytics", emoji:"📊", title:"HR Analytics Cơ Bản",          sub:"Attrition · Dashboard · Story", dur:"22 phút", type:"Khóa học", level:"HR Manager",     hot:true,  tags:["VI"], soon:true,                           xp:144, modules:6 },
  // Cấp 3 — HR Director / CHRO
  { id:113, cat:"EQ & Lãnh Đạo",   emoji:"👑", title:"Executive Presence",            sub:"Board · CEO · C-suite lang",   dur:"25 phút", type:"Khóa học", level:"CHRO",           hot:true,  tags:["VI"], soon:true,                           xp:156, modules:6 },
  { id:114, cat:"EQ & Lãnh Đạo",   emoji:"🌐", title:"Tầm Nhìn & Văn Hóa Tổ Chức",  sub:"Culture · Succession · Legacy", dur:"25 phút", type:"Khóa học", level:"CHRO",           hot:false, tags:["VI"], soon:true,                           xp:156, modules:6 },
  { id:115, cat:"AI-First HR",      emoji:"🚀", title:"AI Strategy Cho CHRO",          sub:"Roadmap · Ethics · HR Tech",   dur:"25 phút", type:"Khóa học", level:"CHRO",           hot:true,  tags:["VI"], soon:true,                           xp:156, modules:6 },
  { id:116, cat:"Finance-HR",       emoji:"🧭", title:"Workforce Strategy · Stagility",sub:"Org design · F&B chain",       dur:"25 phút", type:"Khóa học", level:"CHRO",           hot:false, tags:["VI"], soon:true,                           xp:168, modules:6 },
  { id:117, cat:"Finance-HR",       emoji:"💰", title:"Finance-HR Hybrid",             sub:"Total Rewards · ESOP · IPO",   dur:"25 phút", type:"Khóa học", level:"CHRO",           hot:true,  tags:["VI"], soon:true,                           xp:168, modules:6 },
  { id:118, cat:"People Analytics", emoji:"🔭", title:"People Analytics Nâng Cao",    sub:"Predictive · RevPAMH+ · ROI",  dur:"25 phút", type:"Khóa học", level:"CHRO",           hot:false, tags:["VI"], soon:true,                           xp:168, modules:6 },
  // ══ AI-First HR (bổ sung) ════════════════════════════════
  // AI-First HR (8 khóa)
  { id:1,  cat:"AI-First HR",     emoji:"🤔", title:"AI Thật Ra Là Gì?",              sub:"Phiên Bản HR",                 dur:"10 phút", type:"Khóa học", level:"HR Executive",   hot:true,  tags:["VI"] },
  { id:2,  cat:"AI-First HR",     emoji:"💬", title:"Trò Chuyện Với AI",              sub:"HR Edition",                   dur:"12 phút", type:"Khóa học", level:"HR Executive",   hot:true,  tags:["VI"] },
  { id:3,  cat:"AI-First HR",     emoji:"✍️", title:"AI Giúp HR Viết",                sub:"JD, Email & Policy",           dur:"12 phút", type:"Khóa học", level:"HR Manager",     hot:true,  tags:["VI"] },
  { id:4,  cat:"AI-First HR",     emoji:"🎨", title:"AI Cho Hình Ảnh",               sub:"Visual HR & Presentation",     dur:"10 phút", type:"Khóa học", level:"HR Manager",     hot:false, tags:["VI"] },
  { id:5,  cat:"AI-First HR",     emoji:"🎓", title:"AI Cho Học Tập",                sub:"Training & L&D",               dur:"12 phút", type:"Khóa học", level:"HR Manager",     hot:false, tags:["VI"] },
  { id:6,  cat:"AI-First HR",     emoji:"⚡", title:"AI Cho Năng Suất",              sub:"HR Hàng Ngày",                 dur:"10 phút", type:"Khóa học", level:"HR Executive",   hot:true,  tags:["VI"] },
  { id:7,  cat:"AI-First HR",     emoji:"🛡️", title:"An Toàn Với AI",                sub:"Bảo Vệ Data Nhân Viên",        dur:"10 phút", type:"Khóa học", level:"HR Manager",     hot:false, tags:["VI"] },
  { id:8,  cat:"AI-First HR",     emoji:"🚀", title:"Kế Hoạch Hành Động AI",         sub:"30 Ngày Đầu Tiên",             dur:"10 phút", type:"Khóa học", level:"HR Manager",     hot:false, tags:["VI"] },
  // Finance-HR Hybrid (7 khóa)
  { id:9,  cat:"Finance-HR",      emoji:"📊", title:"Đọc P&L Không Cần Kế Toán",     sub:"Finance for HR",               dur:"15 phút", type:"Khóa học", level:"HRBP",           hot:true,  tags:["VI"] },
  { id:10, cat:"Finance-HR",      emoji:"💰", title:"Budget HC — Làm Đúng Từ Đầu",   sub:"Headcount Planning",           dur:"12 phút", type:"Khóa học", level:"HRBP",           hot:true,  tags:["VI"] },
  { id:11, cat:"Finance-HR",      emoji:"📈", title:"RevPAMH — Metric HR Modern",    sub:"Revenue Per Available Man-Hour", dur:"15 phút",type:"Khóa học", level:"HRBP",           hot:true,  tags:["VI"] },
  { id:12, cat:"Finance-HR",      emoji:"🎯", title:"KPI vs OKR — Khi Nào Dùng Gì?", sub:"Performance Framework",       dur:"12 phút", type:"Khóa học", level:"HRBP",           hot:false, tags:["VI"] },
  { id:13, cat:"Finance-HR",      emoji:"🔮", title:"People Analytics Cơ Bản",       sub:"Data-Driven HR",               dur:"15 phút", type:"Khóa học", level:"HR Senior",      hot:false, tags:["VI"] },
  { id:14, cat:"Finance-HR",      emoji:"🏆", title:"Compensation Benchmarking",     sub:"Salary & Benefits Design",     dur:"15 phút", type:"Khóa học", level:"HR Senior",      hot:false, tags:["VI"], soon:true },
  { id:15, cat:"Finance-HR",      emoji:"📋", title:"ESOP & Long-term Incentive",    sub:"Equity Planning",              dur:"15 phút", type:"Khóa học", level:"HR Senior",      hot:false, tags:["VI"], soon:true },
  // People Analytics (5 khóa)
  { id:16, cat:"People Analytics", emoji:"📉", title:"Turnover Analysis",            sub:"Phân Tích & Dự Báo",           dur:"12 phút", type:"Khóa học", level:"HRBP",           hot:true,  tags:["VI"] },
  { id:17, cat:"People Analytics", emoji:"💚", title:"eNPS Từ A Đến Z",              sub:"Engagement & Retention",       dur:"12 phút", type:"Khóa học", level:"HRBP",           hot:false, tags:["VI"] },
  { id:18, cat:"People Analytics", emoji:"🗂️", title:"HR Dashboard Cho CEO",         sub:"Báo Cáo Nhân Sự",              dur:"15 phút", type:"Khóa học", level:"HR Manager",     hot:false, tags:["VI"] },
  { id:19, cat:"People Analytics", emoji:"🔭", title:"Flight Risk Prediction",       sub:"Dự Báo Nghỉ Việc",             dur:"15 phút", type:"Khóa học", level:"HR Senior",      hot:false, tags:["VI"], soon:true },
  { id:20, cat:"People Analytics", emoji:"🧮", title:"Workforce Planning Model",     sub:"Lập Kế Hoạch Nhân Lực",        dur:"20 phút", type:"Khóa học", level:"CHRO",           hot:false, tags:["VI"], soon:true },
  // Talent (6 khóa)
  { id:21, cat:"Talent",          emoji:"🔍", title:"JD & Employer Branding",        sub:"Thu Hút Ứng Viên",             dur:"12 phút", type:"Khóa học", level:"HR Executive",   hot:true,  tags:["VI"] },
  { id:22, cat:"Talent",          emoji:"🎭", title:"Phỏng Vấn Competency-Based",    sub:"STAR Method",                  dur:"12 phút", type:"Khóa học", level:"HR Manager",     hot:true,  tags:["VI"] },
  { id:23, cat:"Talent",          emoji:"🌱", title:"Onboarding 30-60-90 Ngày",      sub:"First Impression Matters",     dur:"10 phút", type:"Khóa học", level:"HR Manager",     hot:false, tags:["VI"] },
  { id:24, cat:"Talent",          emoji:"🤝", title:"Bar Raiser System",             sub:"Tuyển Đúng Người",             dur:"15 phút", type:"Khóa học", level:"HR Senior",      hot:false, tags:["VI"] },
  { id:25, cat:"Talent",          emoji:"🗺️", title:"Career Pathing",               sub:"Lộ Trình Thăng Tiến",          dur:"15 phút", type:"Khóa học", level:"HR Manager",     hot:false, tags:["VI"], soon:true },
  { id:26, cat:"Talent",          emoji:"🧩", title:"Succession Planning",           sub:"Kế Hoạch Kế Thừa",             dur:"20 phút", type:"Khóa học", level:"CHRO",           hot:false, tags:["VI"], soon:true },
  // Total Rewards (4 khóa)
  { id:27, cat:"Total Rewards",   emoji:"💎", title:"Thiết Kế Salary Band",          sub:"Job Grading & Pay Scale",      dur:"15 phút", type:"Khóa học", level:"HR Senior",      hot:true,  tags:["VI"] },
  { id:28, cat:"Total Rewards",   emoji:"🎁", title:"Benefits Strategy",             sub:"Phúc Lợi Toàn Diện",           dur:"12 phút", type:"Khóa học", level:"HR Manager",     hot:false, tags:["VI"] },
  { id:29, cat:"Total Rewards",   emoji:"📊", title:"Mercer Benchmarking",           sub:"So Sánh Thị Trường",           dur:"15 phút", type:"Khóa học", level:"HR Senior",      hot:false, tags:["VI"], soon:true },
  { id:30, cat:"Total Rewards",   emoji:"💹", title:"Variable Pay Design",           sub:"Thiết Kế Thưởng Hiệu Suất",    dur:"15 phút", type:"Khóa học", level:"HR Senior",      hot:false, tags:["VI"], soon:true },
  // CHRO Mindset (5 khóa)
  { id:31, cat:"CHRO Mindset",    emoji:"🧭", title:"HR Strategy Execution",         sub:"Từ Chiến Lược Đến Thực Thi",   dur:"20 phút", type:"Khóa học", level:"CHRO",           hot:true,  tags:["VI"] },
  { id:32, cat:"CHRO Mindset",    emoji:"🌐", title:"Organizational Design",         sub:"Thiết Kế Tổ Chức",             dur:"20 phút", type:"Khóa học", level:"CHRO",           hot:false, tags:["VI"], soon:true },
  { id:33, cat:"CHRO Mindset",    emoji:"💎", title:"Board Presentation Skills",     sub:"HR Báo Cáo HĐQT",              dur:"15 phút", type:"Khóa học", level:"CHRO",           hot:false, tags:["VI"], soon:true },
  { id:34, cat:"CHRO Mindset",    emoji:"🤖", title:"AI Governance Trong HR",        sub:"AI Policy & Ethics",           dur:"20 phút", type:"Khóa học", level:"CHRO",           hot:false, tags:["VI"], soon:true },
  { id:35, cat:"CHRO Mindset",    emoji:"📊", title:"IPO Readiness — HR Chuẩn Bị Gì?", sub:"Pre-IPO HR Checklist",     dur:"20 phút", type:"Khóa học", level:"CHRO",           hot:false, tags:["VI"], soon:true },
];

// ── DYNAMIC STATS ──────────────────────────────────────────
const LIVE_COURSES = ALL_COURSES.filter(c => c.url && !c.soon);
const SOON_COURSES = ALL_COURSES.filter(c => c.soon);
const TOTAL_LIVE = LIVE_COURSES.length;
const TOTAL_MODULES = LIVE_COURSES.reduce((s,c) => s + (c.modules||6), 0);
const TOTAL_HOURS_MIN = LIVE_COURSES.reduce((s,c) => s + parseInt(c.dur||"15"), 0);
const fmt_dur = (min) => min >= 60 ? `${Math.floor(min/60)}h${min%60>0?` ${min%60}m`:""}` : `${min} phút`;

const SKILLS = [
  { key:"EQ & Lãnh Đạo",  emoji:"🧠", color:C.cyan,    tagline:"EQ · Resilience · Leadership · Influence",  stat:"📈 EQ là kỹ năng số 1 mà CEO muốn ở CHRO 2026 (McKinsey)" },
  { key:"Finance-HR",      emoji:"💰", color:C.gold,    tagline:"P&L · Budget HC · RevPAMH · Finance Hybrid",stat:"📈 Finance-HR Hybrid là top 3 kỹ năng hot nhất cho CHRO 2026" },
  { key:"People Analytics",emoji:"📊", color:"#34D399", tagline:"Data · Dashboard · Attrition · Prediction", stat:"📈 People Analytics tăng 185% nhu cầu HRBP toàn cầu" },
  { key:"AI-First HR",     emoji:"🤖", color:"#67E8F9", tagline:"Prompt · Tools · AI Strategy · Automation", stat:"📈 Kỹ năng AI-literacy tăng 70% nhu cầu tuyển dụng (LinkedIn 2026)" },
  { key:"Talent",          emoji:"🎯", color:"#F472B6", tagline:"JD · Recruiting · Onboarding · Succession",  stat:"📈 Structured interview tăng quality-of-hire 40%" },
  { key:"HR Operations",   emoji:"📋", color:"#FB923C", tagline:"C&B · Labor Law · HRIS · Compliance VN",    stat:"📈 HR Ops sai 1 bước = rủi ro pháp lý cho 10,000+ nhân sự" },
];

const HAUS = [
  {
    key:"hr-staff", emoji:"🚀", name:"HR Foundation",
    color:C.cyan, target:"Dành cho HR Staff & Specialist",
    tagline:"Xây nền tảng · Phát triển nghề nghiệp",
    xp:"+696 XP", courses:6,
    tiers:[
      { name:"NOW-READY", ids:[101,102,103] },
      { name:"FUTURE-READY", ids:[104,105,106] },
    ]
  },
  {
    key:"hr-manager", emoji:"⚡", name:"HR Manager Track",
    color:C.gold, target:"Dành cho HR Manager & Senior Specialist",
    tagline:"Dẫn dắt · Phân tích · Tư vấn business",
    xp:"+804 XP", courses:6,
    tiers:[
      { name:"NOW-READY", ids:[107,108,109] },
      { name:"FUTURE-READY", ids:[110,111,112] },
    ]
  },
  {
    key:"chro", emoji:"👑", name:"CHRO Accelerator",
    color:"#A855F7", target:"Dành cho HR Director & CHRO",
    tagline:"Chiến lược · Kiến tạo · Di sản",
    xp:"+972 XP", courses:6,
    tiers:[
      { name:"NOW-READY", ids:[113,114,115] },
      { name:"FUTURE-READY", ids:[116,117,118] },
    ]
  },
];

const LEADERBOARD = [
  { rank:1, name:"Nguyễn Minh Châu",   level:"AI Master HR",        xp:2775, medal:"🥇", badge:"💎" },
  { rank:2, name:"Trần Thị Hoa",       level:"Finance-HR Expert",   xp:2120, medal:"🥈", badge:"⚡" },
  { rank:3, name:"Lê Văn Đức",         level:"CHRO Practitioner",   xp:1895, medal:"🥉", badge:"🔭" },
  { rank:4, name:"Phạm Thu Hằng",      level:"HR Accelerator",      xp:1540, medal:"",   badge:"🚀" },
  { rank:5, name:"Vũ Thị Lan",         level:"HR Foundation",       xp:1230, medal:"",   badge:"🌱" },
];

const DAILY = {
  q:"Theo RevPAMH framework, HR cần đo chỉ số nào để CEO hiểu đóng góp của nhân lực vào doanh thu?",
  opts:[
    { t:"Headcount so với kế hoạch tuyển dụng", ok:false },
    { t:"Doanh thu trên mỗi giờ lao động sẵn sàng phục vụ (Revenue Per Available Man-Hour)", ok:true },
    { t:"Tỷ lệ turnover hàng tháng theo phòng ban", ok:false },
    { t:"Chi phí tuyển dụng trên mỗi hire thành công", ok:false },
  ]
};

// ── HELPERS ────────────────────────────────────────────────
function s(...args) {
  return Object.assign({}, ...args);
}

// ── COURSE CARD ────────────────────────────────────────────
function CourseCard({ c, onOpen, done }) {
  const isDone = done?.includes(c.id);
  const handleClick = () => {
    if (c.soon) return;
    if (c.url) { window.open(c.url, '_blank'); return; }
    onOpen(c);
  };
  return (
    <div onClick={handleClick}
      style={{ background:C.navy2, border:`1px solid ${isDone ? C.teal : C.border}`,
        borderRadius:16, overflow:"hidden", minWidth:260, maxWidth:280, flexShrink:0,
        cursor:c.soon?"default":"pointer", opacity:c.soon?.8:1,
        transition:"transform .15s, border-color .15s",
        position:"relative" }}>
      {/* Thumbnail */}
      <div style={{ height:130, background:`linear-gradient(135deg, ${C.navy3}, ${C.navy4})`,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:52, position:"relative" }}>
        {c.emoji}
        {/* badges */}
        <div style={{ position:"absolute", top:10, left:10, display:"flex", gap:6 }}>
          <span style={{ background:SKILLS.find(s=>s.key===c.cat)?.color||C.cyan,
            color:C.navy, fontSize:10, fontWeight:700, padding:"2px 8px",
            borderRadius:20 }}>{c.cat}</span>
          {c.hot && <span style={{ background:"#EF4444", color:"#fff",
            fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20 }}>HOT</span>}
          {c.soon && <span style={{ background:C.navy3, color:C.muted,
            fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20,
            border:`1px solid ${C.border}` }}>Sắp ra</span>}
        </div>
        {isDone && <div style={{ position:"absolute", top:10, right:10, width:24, height:24,
          borderRadius:"50%", background:C.teal, color:C.navy,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:12, fontWeight:700 }}>✓</div>}
      </div>
      {/* Content */}
      <div style={{ padding:"14px 16px" }}>
        <div style={{ fontSize:11, color:C.muted, marginBottom:4 }}>
          {c.type} · {c.tags.join(" · ")} · 🚀 {c.level}
        </div>
        <div style={{ fontSize:14, fontWeight:600, color:isDone?C.cyan:C.white,
          marginBottom:2, lineHeight:1.4 }}>{c.title}</div>
        <div style={{ fontSize:12, color:C.muted, marginBottom:12 }}>
          ~{c.dur} · {c.sub}
        </div>
        <button style={{ width:"100%", background:`linear-gradient(135deg, ${C.teal}, ${C.navy4})`,
          color:C.navy, border:"none", borderRadius:24, padding:"8px",
          fontSize:13, fontWeight:700, cursor:c.soon?"not-allowed":"pointer" }}>
          {c.soon ? "🔔 Sắp ra mắt" : isDone ? "✓ Xem lại →" : c.url ? "Vào học →" : "Vào học →"}
        </button>
      </div>
    </div>
  );
}

// ── CAROUSEL ───────────────────────────────────────────────
function Carousel({ courses, onOpen, done }) {
  const ref = useRef(null);
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 300, behavior:"smooth" });
  return (
    <div style={{ position:"relative" }}>
      <div ref={ref} style={{ display:"flex", gap:16, overflowX:"auto",
        scrollbarWidth:"none", paddingBottom:8 }}>
        {courses.map(c => <CourseCard key={c.id} c={c} onOpen={onOpen} done={done} />)}
      </div>
      {/* nav arrows */}
      <button onClick={() => scroll(-1)} style={{ position:"absolute", left:-16, top:"40%",
        width:36, height:36, borderRadius:"50%", background:C.navy2,
        border:`1px solid ${C.border}`, color:C.cyan, fontSize:16,
        cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>‹</button>
      <button onClick={() => scroll(1)} style={{ position:"absolute", right:-16, top:"40%",
        width:36, height:36, borderRadius:"50%", background:C.navy2,
        border:`1px solid ${C.border}`, color:C.cyan, fontSize:16,
        cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>›</button>
    </div>
  );
}

// ── LESSON MODAL ───────────────────────────────────────────
function LessonModal({ c, done, onClose, onComplete }) {
  const [sel, setSel] = useState(null);
  const isDone = done?.includes(c.id);
  const opts = [
    {t:"ChatGPT — vì phổ biến nhất", ok:false},
    {t:"Claude — vì giỏi viết văn bản phức tạp, hiểu context sâu, phù hợp với HR senior", ok:true},
    {t:"Gemini — vì của Google", ok:false},
    {t:"Copilot — vì miễn phí khi dùng Microsoft", ok:false},
  ];
  const pick = (i) => {
    if (sel !== null) return;
    setSel(i);
    if (opts[i].ok && !isDone) onComplete(c.id, c.xp||50);
  };
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0,
      background:"rgba(2,11,24,.9)", zIndex:200,
      display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:C.navy2,
        border:`1px solid ${C.teal}`, borderRadius:20, padding:"28px 32px",
        maxWidth:600, width:"100%", maxHeight:"85vh", overflowY:"auto" }}>
        <button onClick={onClose} style={{ float:"right", background:"none", border:"none",
          color:C.muted, fontSize:22, cursor:"pointer" }}>✕</button>

        <div style={{ display:"flex", gap:14, alignItems:"flex-start", marginBottom:20 }}>
          <div style={{ width:54, height:54, borderRadius:"50%",
            background:`linear-gradient(135deg,${C.teal},${C.navy})`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:26, flexShrink:0 }}>{c.emoji}</div>
          <div>
            <div style={{ fontSize:11, color:C.muted, marginBottom:3 }}>
              {c.type} · {c.dur} · +{c.xp||50} XP
            </div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22,
              fontWeight:700, color:C.white, marginBottom:2 }}>{c.title}</div>
            <div style={{ fontSize:13, color:C.cyan }}>{c.sub}</div>
          </div>
        </div>

        {/* content preview */}
        <div style={{ background:C.navy3, border:`1px solid ${C.border}`,
          borderRadius:12, padding:"16px 18px", marginBottom:16 }}>
          <div style={{ fontSize:11, color:C.cyan, fontWeight:700,
            letterSpacing:.8, marginBottom:8 }}>NỘI DUNG BÀI HỌC</div>
          <p style={{ fontSize:14, color:C.muted, lineHeight:1.7, margin:0 }}>
            Bài học micro-learning 10–15 phút — đọc được ngay, áp dụng được hôm nay.<br/>
            Gồm: Concept chính · Ví dụ thực tế HR · Tools & Prompts mẫu · Quiz kiểm tra · FAQ
          </p>
        </div>

        {/* quiz */}
        <div style={{ background:C.navy3, border:`1px solid ${C.border2}`,
          borderRadius:12, padding:"16px 18px", marginBottom:16 }}>
          <div style={{ fontSize:11, color:C.cyan, fontWeight:700,
            letterSpacing:.8, marginBottom:10 }}>🔍 KIỂM TRA NHANH</div>
          <p style={{ fontSize:14, fontWeight:600, color:C.white,
            marginBottom:12, lineHeight:1.6 }}>
            Công cụ AI nào tốt nhất để HR bắt đầu viết JD và phân tích HR policy phức tạp?
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {opts.map((o,i) => {
              let bg=C.navy, br=C.border, cl=C.muted;
              if (sel!==null) {
                if (o.ok) { bg="#001A14"; br=C.teal; cl=C.cyan; }
                else if (sel===i) { bg="#1A0000"; br="#B71C1C"; cl="#EF5350"; }
              }
              return (
                <button key={i} onClick={() => pick(i)} disabled={sel!==null}
                  style={{ background:bg, border:`1px solid ${br}`, borderRadius:10,
                    padding:"10px 14px", textAlign:"left", cursor:sel!==null?"default":"pointer",
                    fontSize:13, color:cl, display:"flex", gap:10, alignItems:"center" }}>
                  <span style={{ width:22, height:22, borderRadius:"50%",
                    border:`1px solid ${br}`, display:"flex", alignItems:"center",
                    justifyContent:"center", fontSize:11, fontWeight:600,
                    flexShrink:0 }}>{String.fromCharCode(65+i)}</span>
                  {o.t}
                  {sel!==null && o.ok && <span style={{ marginLeft:"auto", color:C.cyan }}>✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {(sel!==null && (opts[sel]?.ok || isDone)) && (
          <div style={{ background:"#001A14", border:`1px solid ${C.teal}`,
            borderRadius:12, padding:"16px 18px", textAlign:"center" }}>
            <div style={{ fontSize:22, marginBottom:6 }}>🎉</div>
            <div style={{ fontSize:15, fontWeight:700, color:C.cyan, marginBottom:4 }}>
              {isDone ? "Đã hoàn thành!" : `+${c.xp||50} XP — Xuất sắc!`}
            </div>
            <button onClick={onClose}
              style={{ background:`linear-gradient(135deg,${C.teal},${C.cyan})`,
                color:C.navy, border:"none", borderRadius:20,
                padding:"10px 24px", fontSize:14, fontWeight:700, cursor:"pointer" }}>
              Tiếp tục →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── MAIN ───────────────────────────────────────────────────
export default function PeopleOSHub() {
  const [completed, setCompleted] = useState([]);
  const [xp, setXp] = useState(0);
  const [dailySel, setDailySel] = useState(null);
  const [openCourse, setOpenCourse] = useState(null);
  const [openHaus, setOpenHaus] = useState(null);
  const [openSkill, setOpenSkill] = useState("EQ & Lãnh Đạo");
  const [timer, setTimer] = useState(19800); // 5.5 hours in seconds

  // countdown
  useEffect(() => {
    const t = setInterval(() => setTimer(v => v > 0 ? v-1 : 0), 1000);
    return () => clearInterval(t);
  }, []);
  const fmt = (s) => {
    const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60;
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
  };

  const complete = (id, pts) => {
    if (!completed.includes(id)) {
      setCompleted(p => [...p, id]);
      setXp(p => p + (pts||50));
    }
  };

  const hotCourses = ALL_COURSES.filter(c => c.hot && !c.soon).concat(
    ALL_COURSES.filter(c => c.hot && c.soon).slice(0,4)
  ).slice(0,8);
  const newCourses = ALL_COURSES.filter(c => c.soon).slice(0,10);
  const skillCourses = ALL_COURSES.filter(c => c.cat === openSkill && !c.soon).concat(
    ALL_COURSES.filter(c => c.cat === openSkill && c.soon).slice(0,4)
  );

  const LEVEL = xp >= 600 ? "AI Master HR" : xp >= 350 ? "CHRO Practitioner"
    : xp >= 150 ? "Finance-HR Expert" : xp >= 50 ? "HR Accelerator" : "HR Explorer";

  // ── STYLES ────────────────────────────────────────────────
  const W = { maxWidth:1200, margin:"0 auto", padding:"0 24px" };
  const SH = (label) => (
    <div style={{ fontSize:11, color:C.cyan, fontWeight:700,
      letterSpacing:1.2, marginBottom:6 }}>✦ {label}</div>
  );
  const H2 = (text, sub) => (
    <div style={{ marginBottom:sub?6:24 }}>
      <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:32,
        fontWeight:800, color:C.white, margin:0 }}>{text}</h2>
      {sub && <p style={{ fontSize:14, color:C.muted, margin:"6px 0 24px" }}>{sub}</p>}
    </div>
  );

  return (
    <div style={{ background:C.navy, minHeight:"100vh",
      fontFamily:"'Be Vietnam Pro',sans-serif", color:C.white }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" rel="stylesheet"/>

      {/* ── NAVBAR ── */}
      <nav style={{ background:"rgba(2,11,24,.97)", borderBottom:`1px solid ${C.border}`,
        padding:"0 24px", height:58, display:"flex", alignItems:"center",
        justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:20,
            fontWeight:700, color:C.cyan }}>PeopleOS</span>
          <span style={{ fontSize:11, color:C.muted }}>Learning Hub</span>
          <span style={{ fontSize:11, color:C.muted }}>by TaHien</span>
        </div>
        <div style={{ display:"flex", gap:24, fontSize:13 }}>
          {["Chương trình","Lĩnh vực","Xếp hạng","Về chúng tôi"].map(l => (
            <button key={l} style={{ background:"none", border:"none",
              color:C.muted, cursor:"pointer", fontSize:13, padding:"0 2px" }}>{l}</button>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button style={{ background:"#1A2800", border:`1px solid ${C.gold}`,
            borderRadius:20, padding:"5px 14px", fontSize:12,
            color:C.gold, fontWeight:600, cursor:"pointer" }}>
            🎁 Mời (+50 XP)
          </button>
          <div style={{ background:C.navy2, border:`1px solid ${C.border}`,
            borderRadius:20, padding:"5px 14px", fontSize:13,
            color:C.cyan, fontWeight:600, display:"flex", gap:6 }}>
            <span>⚡</span><span>{xp + (dailySel !== null && DAILY.opts[dailySel]?.ok ? 20 : 0)} XP</span>
          </div>
          <div style={{ width:34, height:34, borderRadius:"50%",
            background:`linear-gradient(135deg,${C.teal},${C.navy2})`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:14, fontWeight:700, border:`2px solid ${C.cyan}` }}>H</div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{ background:`linear-gradient(160deg, ${C.navy} 0%, ${C.navy2} 60%, ${C.navy3} 100%)`,
        borderBottom:`1px solid ${C.border}`, overflow:"hidden", position:"relative" }}>
        <div style={{ ...W, padding:"60px 24px 48px",
          display:"flex", alignItems:"center", justifyContent:"space-between", gap:32 }}>
          {/* Left */}
          <div style={{ flex:1 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8,
              background:C.navy3, border:`1px solid ${C.teal}`, borderRadius:20,
              padding:"4px 14px", fontSize:11, color:C.cyan,
              fontWeight:700, marginBottom:20, letterSpacing:1 }}>
              ✦ AI-powered · Human-centered · Always.
            </div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:46,
              fontWeight:800, color:C.white, margin:"0 0 6px", lineHeight:1.15 }}>
              Học để<br/>
              <span style={{ color:C.cyan }}>dẫn đầu.</span>
            </h1>
            <p style={{ fontSize:17, color:C.muted, margin:"0 0 6px" }}>
              Từ HR Manager → CHRO. Không phải may mắn. Là hệ thống.
            </p>
            <p style={{ fontSize:13, color:C.muted, margin:"0 0 28px" }}>
              Miễn phí · Học mà chơi (gamified) · Dành cho HR professionals Việt Nam
            </p>
            <button style={{ background:`linear-gradient(135deg,${C.teal},${C.cyan})`,
              color:C.navy, border:"none", borderRadius:28,
              padding:"14px 36px", fontSize:15, fontWeight:700, cursor:"pointer" }}>
              Bắt đầu miễn phí →
            </button>
          </div>
          {/* Right — stats */}
          <div style={{ display:"flex", flexDirection:"column", gap:12, flexShrink:0 }}>
            <div style={{ background:C.navy2, border:`1px solid ${C.border}`,
              borderRadius:16, padding:"16px 20px",
              display:"flex", gap:20, alignItems:"center" }}>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:22 }}>🔥</div>
                <div style={{ fontSize:22, fontWeight:700, color:C.cyan }}>2</div>
                <div style={{ fontSize:11, color:C.muted }}>Chuỗi ngày</div>
              </div>
              <div style={{ width:1, height:40, background:C.border }} />
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:22 }}>🌱</div>
                <div style={{ fontSize:14, fontWeight:700, color:C.gold }}>1</div>
                <div style={{ fontSize:11, color:C.muted }}>Cấp độ</div>
                <div style={{ fontSize:11, color:C.gold }}>{LEVEL}</div>
              </div>
              <div style={{ width:1, height:40, background:C.border }} />
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:22 }}>⚡</div>
                <div style={{ fontSize:22, fontWeight:700, color:C.cyan }}>{xp}</div>
                <div style={{ fontSize:11, color:C.muted }}>XP hôm nay</div>
              </div>
            </div>
            {/* progress */}
            <div style={{ background:C.navy2, border:`1px solid ${C.border}`,
              borderRadius:16, padding:"14px 20px" }}>
              <div style={{ display:"flex", justifyContent:"space-between",
                fontSize:12, color:C.muted, marginBottom:8 }}>
                <span>XP hôm nay</span>
                <span style={{ color:C.cyan }}>{xp} / 500</span>
              </div>
              <div style={{ height:6, background:C.navy3, borderRadius:99, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${Math.min((xp/500)*100,100)}%`,
                  background:`linear-gradient(90deg,${C.teal},${C.cyan})`,
                  borderRadius:99, transition:"width .4s ease" }} />
              </div>
              <div style={{ fontSize:11, color:C.muted, marginTop:8, textAlign:"right" }}>
                {completed.length} / {ALL_COURSES.filter(c=>!c.soon).length} khóa
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <div style={{ background:`linear-gradient(90deg,${C.teal},${C.cyan})`,
        padding:"20px 24px" }}>
        <div style={{ ...W, display:"flex", justifyContent:"space-around",
          alignItems:"center" }}>
          {[["👩‍💼","1,200+","HR Professionals"],["📚",`${TOTAL_LIVE} live · ${SOON_COURSES.length} sắp ra`,"Khóa học"],
            ["⏱️",fmt_dur(TOTAL_HOURS_MIN),"Học ngay hôm nay"]].map(([e,v,l]) => (
            <div key={l} style={{ textAlign:"center" }}>
              <div style={{ fontSize:28, fontWeight:800, color:C.navy }}>{e} {v}</div>
              <div style={{ fontSize:12, color:C.navy, fontWeight:600 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div style={{ background:`linear-gradient(180deg,${C.navy2}00,${C.navy2})`,
        padding:"56px 24px" }}>
        <div style={{ ...W }}>
          {SH("HOW IT WORKS")}
          {H2("Học như thế nào?")}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
            {[
              { emoji:"🎯", num:"01", title:"Chọn lộ trình của bạn",
                desc:"HR Foundation · Finance-HR Hybrid · CHRO Accelerator — tìm đúng hành trình cho vị trí của bạn" },
              { emoji:"⚡", num:"02", title:"Bài học nhỏ 10–15 phút",
                desc:"Bài học ngắn, súc tích, thiết kế cho HR Manager bận rộn. Học mọi lúc, mọi nơi." },
              { emoji:"🏆", num:"03", title:"Tích XP & lên cấp",
                desc:"Mỗi bài = XP + huy hiệu + chuỗi ngày học liên tục — và chứng chỉ thêm vào LinkedIn khi hoàn thành." },
            ].map(s => (
              <div key={s.num} style={{ background:C.navy3, border:`1px solid ${C.border}`,
                borderRadius:16, overflow:"hidden" }}>
                <div style={{ height:120, background:`linear-gradient(135deg,${C.navy4},${C.navy3})`,
                  display:"flex", alignItems:"flex-end", justifyContent:"flex-start",
                  padding:"12px 16px" }}>
                  <span style={{ fontSize:36 }}>{s.emoji}</span>
                </div>
                <div style={{ padding:"16px 18px" }}>
                  <div style={{ fontSize:22, fontWeight:800, color:C.cyan, marginBottom:6 }}>
                    {s.num}
                  </div>
                  <div style={{ fontSize:15, fontWeight:700, color:C.white, marginBottom:6 }}>
                    {s.title}
                  </div>
                  <div style={{ fontSize:13, color:C.muted, lineHeight:1.6 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── HANA AI COMPANION ── */}
      <div style={{ background:`linear-gradient(135deg,${C.navy2},${C.navy3})`,
        borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`,
        padding:"56px 24px" }}>
        <div style={{ ...W, display:"flex", gap:48, alignItems:"center" }}>
          {/* mascot */}
          <div style={{ flexShrink:0, textAlign:"center" }}>
            <div style={{ width:140, height:140, borderRadius:"50%",
              background:`radial-gradient(circle at 40% 40%,${C.teal},${C.navy})`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:70, border:`3px solid ${C.cyan}`,
              boxShadow:`0 0 40px ${C.teal}40` }}>🤖</div>
            <div style={{ marginTop:12, background:C.navy2, border:`1px solid ${C.border}`,
              borderRadius:20, padding:"6px 16px", fontSize:12, color:C.cyan,
              fontWeight:600 }}>Hana · PeopleOS AI Guide</div>
          </div>
          {/* text */}
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, color:C.cyan, fontWeight:700,
              letterSpacing:1, marginBottom:8 }}>✦ GẶP GỠ HANA</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:34,
              fontWeight:800, color:C.white, margin:"0 0 12px", lineHeight:1.2 }}>
              Người bạn đồng hành<br/>học tập HR của bạn
            </h2>
            <p style={{ fontSize:14, color:C.muted, lineHeight:1.7, marginBottom:20 }}>
              Hana là trợ lý AI được đào tạo theo Finance-HR Hybrid framework của TaHien —
              sẵn sàng giúp bạn tìm đúng lộ trình, đúng khóa học, và trả lời mọi câu hỏi
              HR phức tạp 24/7.
            </p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:24 }}>
              {[
                ["🎯","Gợi ý lộ trình cá nhân hóa","Trả lời 3 câu hỏi, Hana đề xuất hành trình phù hợp nhất."],
                ["📊","Finance-HR Hybrid Expert","Hana hiểu P&L, Budget HC, RevPAMH — ngôn ngữ của CEO."],
                ["⚡","Sẵn sàng 24/7","Hỏi bất cứ lúc nào. Hana luôn ở đây, không cần đợi."],
                ["💡","HR Cases thực tế","Tư vấn tình huống HR phức tạp dựa trên 20 năm kinh nghiệm."],
              ].map(([e,t,d]) => (
                <div key={t} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                  <div style={{ width:36, height:36, borderRadius:10,
                    background:C.navy3, display:"flex", alignItems:"center",
                    justifyContent:"center", fontSize:18, flexShrink:0 }}>{e}</div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:C.white }}>{t}</div>
                    <div style={{ fontSize:12, color:C.muted }}>{d}</div>
                  </div>
                </div>
              ))}
            </div>
            <button style={{ background:`linear-gradient(135deg,${C.teal},${C.cyan})`,
              color:C.navy, border:"none", borderRadius:28,
              padding:"12px 28px", fontSize:14, fontWeight:700, cursor:"pointer" }}>
              Trò chuyện với Hana →
            </button>
          </div>
        </div>
      </div>

      {/* ── DAILY CHALLENGE ── */}
      <div style={{ background:`linear-gradient(135deg,#2D1000,#1A0A00)`,
        borderBottom:`2px solid ${C.gold}`, padding:"32px 24px" }}>
        <div style={{ ...W }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", marginBottom:16 }}>
            <div>
              <div style={{ fontSize:11, color:C.gold, fontWeight:700,
                letterSpacing:1, marginBottom:4 }}>🔥 THỬ THÁCH HÔM NAY</div>
              <div style={{ fontSize:13, color:C.muted }}>30 giây · +20 XP</div>
            </div>
            <div style={{ background:C.navy, border:`1px solid ${C.border}`,
              borderRadius:10, padding:"6px 16px", fontSize:13,
              color:C.gold, fontWeight:700 }}>
              CÂU HỎI MỚI SAU {fmt(timer)}
            </div>
          </div>
          <p style={{ fontSize:16, fontWeight:600, color:C.white,
            marginBottom:16, lineHeight:1.6 }}>{DAILY.q}</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {DAILY.opts.map((o,i) => {
              let bg=C.navy2, br=C.border, cl=C.muted;
              if (dailySel!==null) {
                if (o.ok) { bg="#001A14"; br=C.teal; cl=C.cyan; }
                else if (dailySel===i) { bg="#1A0000"; br="#B71C1C"; cl="#EF5350"; }
              }
              return (
                <button key={i} onClick={() => {
                  if (dailySel!==null) return;
                  setDailySel(i);
                }} style={{ background:bg, border:`1px solid ${br}`, borderRadius:12,
                  padding:"12px 16px", textAlign:"left", cursor:dailySel!==null?"default":"pointer",
                  fontSize:13, color:cl, display:"flex", gap:10, alignItems:"center" }}>
                  <span style={{ width:26, height:26, borderRadius:"50%",
                    border:`1px solid ${br}`, display:"flex", alignItems:"center",
                    justifyContent:"center", fontSize:12, fontWeight:700,
                    flexShrink:0 }}>{String.fromCharCode(65+i)}</span>
                  {o.t}
                  {dailySel!==null && o.ok && <span style={{ marginLeft:"auto", color:C.cyan, fontWeight:700 }}>✓</span>}
                </button>
              );
            })}
          </div>
          {dailySel!==null && DAILY.opts[dailySel]?.ok && (
            <div style={{ marginTop:12, fontSize:13, color:C.cyan, fontWeight:600 }}>
              🎉 Chính xác! +20 XP — RevPAMH (Revenue Per Available Man-Hour) là metric HR nên report cho CEO.
            </div>
          )}
        </div>
      </div>

      {/* ── HOT COURSES CAROUSEL ── */}
      <div style={{ background:`linear-gradient(135deg,#1A0A00,${C.navy})`,
        borderBottom:`1px solid ${C.border}`, padding:"48px 0" }}>
        <div style={{ ...W }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", marginBottom:24 }}>
            <div>
              <div style={{ display:"inline-flex", background:"#EF4444",
                borderRadius:20, padding:"4px 14px", fontSize:12,
                fontWeight:700, color:"#fff", marginBottom:10 }}>🔥 HOT</div>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:32,
                fontWeight:800, color:C.white, margin:"0 0 4px" }}>Khóa học nổi bật
                  {TOTAL_LIVE > 0 && <span style={{marginLeft:10, fontSize:12, background:C.teal, color:C.navy, borderRadius:12, padding:"2px 10px", verticalAlign:"middle"}}>{TOTAL_LIVE} LIVE</span>}
                </h2>
              <p style={{ fontSize:13, color:C.muted, margin:0 }}>Được học nhiều nhất</p>
            </div>
            <button style={{ background:"none", border:`1px solid ${C.border}`,
              color:C.cyan, borderRadius:20, padding:"8px 18px",
              fontSize:13, cursor:"pointer" }}>Xem tất cả →</button>
          </div>
          <Carousel courses={hotCourses} onOpen={setOpenCourse} done={completed} />
        </div>
      </div>

      {/* ── NEW COURSES CAROUSEL ── */}
      <div style={{ background:C.navy, borderBottom:`1px solid ${C.border}`,
        padding:"48px 0" }}>
        <div style={{ ...W }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", marginBottom:24 }}>
            <div>
              <div style={{ display:"inline-flex", background:C.navy2,
                border:`1px solid ${C.teal}`, borderRadius:20, padding:"4px 14px",
                fontSize:12, fontWeight:700, color:C.cyan, marginBottom:10 }}>✨ MỚI</div>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:32,
                fontWeight:800, color:C.white, margin:"0 0 4px" }}>Khóa học mới</h2>
              <p style={{ fontSize:13, color:C.muted, margin:0 }}>Vừa ra mắt</p>
            </div>
            <button style={{ background:"none", border:`1px solid ${C.border}`,
              color:C.cyan, borderRadius:20, padding:"8px 18px",
              fontSize:13, cursor:"pointer" }}>Xem tất cả →</button>
          </div>
          <Carousel courses={newCourses} onOpen={setOpenCourse} done={completed} />
        </div>
      </div>

      {/* ── 6 SKILLS AREAS ── */}
      <div style={{ background:C.navy2, borderBottom:`1px solid ${C.border}`,
        padding:"56px 0" }}>
        <div style={{ ...W }}>
          {SH("LĨNH VỰC KỸ NĂNG")}
          {H2("6 lĩnh vực để thành công trong HR hiện đại",
            "Mỗi lĩnh vực một sắc màu — chọn nơi bạn muốn phát triển")}
          {/* skill tabs */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:8, marginBottom:24 }}>
            {SKILLS.map(s => (
              <button key={s.key} onClick={() => setOpenSkill(s.key)}
                style={{ background: openSkill===s.key
                  ? `linear-gradient(135deg,${s.color}30,${s.color}10)`
                  : C.navy3,
                  border:`1px solid ${openSkill===s.key ? s.color : C.border}`,
                  borderRadius:14, padding:"14px 10px", cursor:"pointer",
                  borderTop: openSkill===s.key ? `3px solid ${s.color}` : `3px solid transparent` }}>
                <div style={{ fontSize:24, marginBottom:6 }}>{s.emoji}</div>
                <div style={{ fontSize:11, fontWeight:700, color:openSkill===s.key ? s.color : C.muted,
                  lineHeight:1.3 }}>{s.key}</div>
                <div style={{ fontSize:10, color:C.muted, marginTop:4 }}>
                  {ALL_COURSES.filter(c=>c.cat===s.key).length} khóa
                </div>
              </button>
            ))}
          </div>
          {/* skill stat bar */}
          <div style={{ background:C.navy3, border:`1px solid ${C.border}`,
            borderRadius:10, padding:"10px 16px", marginBottom:20,
            fontSize:12, color:C.gold }}>
            {SKILLS.find(s=>s.key===openSkill)?.stat}
          </div>
          {/* courses in selected skill */}
          <Carousel courses={skillCourses} onOpen={setOpenCourse} done={completed} />
        </div>
      </div>

      {/* ── 3 HAUS SYSTEM ── */}
      <div style={{ background:C.navy, borderBottom:`1px solid ${C.border}`,
        padding:"56px 0" }}>
        <div style={{ ...W }}>
          {SH("GO PEOPLEOS SKILLVERSE")}
          {H2("Chương trình học",
            "Ba lộ trình · Ba cấp độ · Một hành trình từ HR Manager → CHRO")}
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {HAUS.map(h => (
              <div key={h.key} style={{ background:C.navy2,
                border:`1px solid ${openHaus===h.key ? h.color : C.border}`,
                borderRadius:16, overflow:"hidden" }}>
                {/* header */}
                <button onClick={() => setOpenHaus(openHaus===h.key ? null : h.key)}
                  style={{ width:"100%", background:"none", border:"none",
                    padding:"20px 24px", cursor:"pointer",
                    display:"flex", alignItems:"center", gap:16,
                    borderLeft:`4px solid ${h.color}` }}>
                  <div style={{ width:52, height:52, borderRadius:"50%",
                    background:C.navy3, display:"flex", alignItems:"center",
                    justifyContent:"center", fontSize:24,
                    border:`2px solid ${h.color}`, flexShrink:0 }}>{h.emoji}</div>
                  <div style={{ flex:1, textAlign:"left" }}>
                    <div style={{ fontSize:11, color:h.color, fontWeight:700,
                      letterSpacing:.8 }}>{h.name.toUpperCase()}</div>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20,
                      fontWeight:700, color:C.white }}>{h.name}</div>
                    <div style={{ fontSize:13, color:C.muted }}>{h.target}</div>
                  </div>
                  <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                    <span style={{ background:"#1A1200", border:`1px solid ${C.gold}`,
                      color:C.gold, fontSize:12, fontWeight:700,
                      padding:"4px 12px", borderRadius:10 }}>{h.xp}</span>
                    <span style={{ fontSize:13, color:C.muted }}>{h.courses} khóa</span>
                    <span style={{ fontSize:18, color:h.color }}>
                      {openHaus===h.key ? "▾" : "▸"}
                    </span>
                  </div>
                </button>
                {/* tiers */}
                {openHaus===h.key && (
                  <div style={{ borderTop:`1px solid ${C.border}` }}>
                    {h.tiers.map(tier => (
                      <div key={tier.name} style={{ padding:"16px 24px",
                        borderBottom:`1px solid ${C.border}` }}>
                        <div style={{ fontSize:11, fontWeight:700, letterSpacing:1,
                          color:tier.name==="NOW-READY"?C.cyan:C.gold,
                          marginBottom:12 }}>
                          📚 {tier.name}
                        </div>
                        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
                          {tier.ids.map(id => {
                            const c = ALL_COURSES.find(x=>x.id===id);
                            if (!c) return null;
                            const done2 = completed.includes(c.id);
                            return (
                              <button key={id} onClick={() => !c.soon && setOpenCourse(c)}
                                style={{ background:done2?"#001A14":C.navy3,
                                  border:`1px solid ${done2?C.teal:C.border}`,
                                  borderRadius:10, padding:"10px 12px", textAlign:"left",
                                  cursor:c.soon?"default":"pointer",
                                  display:"flex", gap:8, alignItems:"center" }}>
                                <span style={{ fontSize:18 }}>{c.emoji}</span>
                                <span style={{ fontSize:12, color:done2?C.cyan:C.white,
                                  fontWeight:600, lineHeight:1.3 }}>{c.title}</span>
                                {c.soon && <span style={{ fontSize:10, color:C.muted,
                                  marginLeft:"auto", flexShrink:0 }}>Sắp ra</span>}
                                {done2 && <span style={{ marginLeft:"auto", color:C.cyan,
                                  fontSize:12 }}>✓</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                    <div style={{ padding:"16px 24px" }}>
                      <button style={{ background:`linear-gradient(135deg,${h.color},${C.navy3})`,
                        border:"none", borderRadius:24, padding:"10px 24px",
                        fontSize:13, fontWeight:700, color:C.navy,
                        cursor:"pointer" }}>
                        Bắt đầu {h.name} →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── LEADERBOARD ── */}
      <div style={{ background:C.navy2, borderBottom:`1px solid ${C.border}`,
        padding:"56px 0" }}>
        <div style={{ ...W }}>
          {SH("BẢNG TUẦN")}
          {H2("Bảng xếp hạng live", "Ai đang dẫn đầu XP ngay lúc này?")}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
            <div style={{ background:C.navy3, border:`1px solid ${C.border}`,
              borderRadius:16, overflow:"hidden" }}>
              <div style={{ background:`linear-gradient(135deg,${C.navy4},${C.navy3})`,
                padding:"12px 20px", fontSize:12, color:C.cyan,
                fontWeight:600, display:"flex", gap:6, alignItems:"center" }}>
                <span>⚡</span> Xếp hạng theo thời gian thực
              </div>
              {LEADERBOARD.map((u,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:14,
                  padding:"14px 20px",
                  borderBottom:i<LEADERBOARD.length-1?`1px solid ${C.border}`:"none",
                  background:i===0?"#0D1F0F":"transparent" }}>
                  <div style={{ width:28, textAlign:"center", fontSize:16 }}>
                    {u.medal || `#${u.rank}`}
                  </div>
                  <div style={{ width:36, height:36, borderRadius:"50%",
                    background:`linear-gradient(135deg,${C.teal},${C.navy3})`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:14, fontWeight:700, color:C.white }}>
                    {u.name.split(" ").pop()[0]}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:600,
                      color:i===0?C.gold:C.white }}>{u.name}</div>
                    <div style={{ fontSize:11, color:C.muted }}>{u.level}</div>
                  </div>
                  <div>
                    <div style={{ fontSize:16, fontWeight:700, color:C.cyan }}>
                      {u.xp.toLocaleString()}
                    </div>
                    <div style={{ fontSize:10, color:C.muted, textAlign:"right" }}>XP</div>
                  </div>
                </div>
              ))}
              {/* my rank */}
              <div style={{ display:"flex", alignItems:"center", gap:14,
                padding:"14px 20px", background:C.navy4,
                borderTop:`2px solid ${C.cyan}` }}>
                <div style={{ width:28, textAlign:"center", fontSize:13,
                  color:C.muted }}>96</div>
                <div style={{ width:36, height:36, borderRadius:"50%",
                  background:`linear-gradient(135deg,${C.teal},${C.navy})`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:14, fontWeight:700, color:C.white,
                  border:`2px solid ${C.cyan}` }}>H</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:600, color:C.cyan }}>Bạn</div>
                  <div style={{ fontSize:11, color:C.muted }}>HR Explorer</div>
                </div>
                <div style={{ fontSize:16, fontWeight:700, color:C.gold }}>
                  {xp + (dailySel!==null && DAILY.opts[dailySel]?.ok ? 20:0)} XP
                </div>
              </div>
            </div>
            {/* my progress */}
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ background:C.navy3, border:`1px solid ${C.border}`,
                borderRadius:16, padding:"20px" }}>
                <div style={{ fontSize:13, color:C.muted, marginBottom:4 }}>Lộ trình của bạn</div>
                <div style={{ fontSize:20, fontWeight:700, color:C.cyan,
                  marginBottom:12 }}>HR Foundation</div>
                <div style={{ height:6, background:C.navy4, borderRadius:99,
                  overflow:"hidden", marginBottom:6 }}>
                  <div style={{ height:"100%",
                    width:`${(completed.filter(id=>id<=8).length/8)*100}%`,
                    background:`linear-gradient(90deg,${C.teal},${C.cyan})`,
                    borderRadius:99 }} />
                </div>
                <div style={{ fontSize:12, color:C.muted }}>
                  {completed.filter(id=>id<=8).length} / 8 khóa · {Math.round((completed.filter(id=>id<=8).length/8)*100)}%
                </div>
              </div>
              <div style={{ background:C.navy3, border:`1px solid ${C.border}`,
                borderRadius:16, padding:"20px" }}>
                <div style={{ fontSize:13, color:C.muted, marginBottom:10 }}>
                  Vào học để thăng hạng!
                </div>
                <button style={{ width:"100%",
                  background:`linear-gradient(135deg,${C.teal},${C.cyan})`,
                  color:C.navy, border:"none", borderRadius:24,
                  padding:"12px", fontSize:14, fontWeight:700, cursor:"pointer" }}>
                  Vào học để thăng hạng →
                </button>
              </div>
              <div style={{ background:C.navy3, border:`1px solid ${C.border}`,
                borderRadius:16, padding:"16px 20px",
                display:"flex", gap:16 }}>
                {[["🏅","Completed","Sắp ra"],["⚡","0 XP hôm nay",`${xp} XP tổng`]].map(([e,t,s]) => (
                  <div key={t}>
                    <div style={{ fontSize:20 }}>{e}</div>
                    <div style={{ fontSize:13, fontWeight:600, color:C.white }}>{t}</div>
                    <div style={{ fontSize:11, color:C.muted }}>{s}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ textAlign:"center", marginTop:16 }}>
            <button style={{ background:"none", border:`1px solid ${C.border}`,
              color:C.muted, borderRadius:20, padding:"8px 20px",
              fontSize:12, cursor:"pointer" }}>Xem bảng đầy đủ →</button>
          </div>
        </div>
      </div>

      {/* ── FOUNDER ── */}
      <div style={{ background:C.navy, borderBottom:`1px solid ${C.border}`,
        padding:"56px 0" }}>
        <div style={{ ...W }}>
          {SH("FOUNDER")}
          <div style={{ display:"flex", gap:32, alignItems:"center" }}>
            <div style={{ width:100, height:100, borderRadius:"50%",
              background:`linear-gradient(135deg,${C.teal},${C.navy2})`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:42, border:`3px solid ${C.cyan}`, flexShrink:0 }}>👩‍💼</div>
            <div>
              <div style={{ fontSize:11, color:C.gold, fontWeight:700,
                marginBottom:4 }}>⭐ Giảng viên chính (Master Instructor)</div>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:26,
                fontWeight:700, color:C.white, margin:"0 0 4px" }}>Tạ Thị Thu Hiền</h3>
              <div style={{ fontSize:13, color:C.muted, marginBottom:12 }}>
                CHCO · Golden Gate Group · Finance-HR Hybrid Pioneer · CMA Australia
              </div>
              <p style={{ fontSize:14, color:C.muted, lineHeight:1.7, margin:"0 0 16px" }}>
                Với hơn 20 năm kinh nghiệm trong tập đoàn F&B lớn nhất Việt Nam (600+ nhà hàng,
                20.000+ nhân viên), là người đầu tiên đưa Finance-HR Hybrid framework vào thực tiễn
                HR Việt Nam, TaHien tin rằng HR giỏi nhất là HR biết nói ngôn ngữ của CEO.
              </p>
              <div style={{ display:"flex", gap:20 }}>
                {[["20+","Năm kinh nghiệm"],["600+","Nhà hàng quản lý"],["1,200+","HR đã đào tạo"]].map(([v,l]) => (
                  <div key={l}>
                    <div style={{ fontSize:22, fontWeight:700, color:C.cyan }}>{v}</div>
                    <div style={{ fontSize:12, color:C.muted }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SUBSCRIBE / CTA ── */}
      <div style={{ background:`linear-gradient(135deg,${C.navy2},${C.navy3})`,
        borderBottom:`1px solid ${C.border}`, padding:"56px 24px",
        textAlign:"center" }}>
        <div style={{ maxWidth:600, margin:"0 auto" }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:30,
            fontWeight:800, color:C.white, margin:"0 0 8px" }}>
            Sẵn sàng dẫn đầu?
          </h2>
          <p style={{ fontSize:15, color:C.muted, margin:"0 0 8px" }}>
            Cùng cộng đồng 1,200+ HR professionals Việt Nam — hoàn toàn miễn phí
          </p>
          <p style={{ fontSize:13, color:C.muted, margin:"0 0 24px" }}>
            Đăng ký nhận thông báo khi có khóa học mới ra mắt.
          </p>
          <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
            <input placeholder="email@congty.com" style={{ background:C.navy2,
              border:`1px solid ${C.border}`, borderRadius:24, padding:"12px 20px",
              fontSize:14, color:C.white, width:260 }} />
            <button style={{ background:`linear-gradient(135deg,${C.teal},${C.cyan})`,
              color:C.navy, border:"none", borderRadius:24,
              padding:"12px 24px", fontSize:14, fontWeight:700, cursor:"pointer" }}>
              Đăng ký
            </button>
          </div>
          <p style={{ fontSize:11, color:C.muted, marginTop:10 }}>
            Bạn có thể huỷ đăng ký bất cứ lúc nào.
          </p>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{ background:C.navy, padding:"40px 24px 24px" }}>
        <div style={{ ...W }}>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:32,
            marginBottom:32 }}>
            <div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22,
                fontWeight:700, color:C.cyan, marginBottom:6 }}>PeopleOS</div>
              <div style={{ fontSize:12, color:C.muted, marginBottom:4 }}>
                Learning Hub · by TaHien
              </div>
              <div style={{ fontSize:12, color:C.muted, lineHeight:1.8 }}>
                Miễn phí · Học mà chơi (gamified)<br/>
                Dành cho HR professionals Việt Nam
              </div>
            </div>
            {[
              ["KẾT NỐI VỚI TAHIEN",["LinkedIn: TaHien","#PeopleOS","#HRxAI","#FinanceHR"]],
              ["HỆ SINH THÁI",["🌐 PeopleOS Community","📧 Newsletter Beehiiv","🤖 Hana AI Assistant","🔧 Claude Cowork"]],
              ["TÀI NGUYÊN",["📖 HR Prompt Library","📊 Finance-HR Toolkit","🎓 Chứng chỉ","💼 Career Path Guide"]],
            ].map(([title,items]) => (
              <div key={title}>
                <div style={{ fontSize:11, fontWeight:700, color:C.muted,
                  marginBottom:12, letterSpacing:.8 }}>{title}</div>
                {items.map(l => (
                  <div key={l} style={{ fontSize:12, color:C.muted, marginBottom:8 }}>{l}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:16,
            display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontSize:12, color:C.muted }}>
              © 2026 PeopleOS Learning Hub · by TaHien
            </div>
            <div style={{ fontSize:12, color:C.muted, fontStyle:"italic" }}>
              AI-powered. Human-centered. Always.
            </div>
          </div>
        </div>
      </div>

      {/* ── LESSON MODAL ── */}
      {openCourse && (
        <LessonModal
          c={openCourse}
          done={completed}
          onClose={() => setOpenCourse(null)}
          onComplete={complete}
        />
      )}
    </div>
  );
}
