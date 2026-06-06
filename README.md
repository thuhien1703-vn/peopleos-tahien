# PeopleOS Learning Hub

**by TaHien — CHCO Golden Gate Group**  
*Biên soạn cho cộng đồng HR Vietnam. PeopleOS Community · 2026.*

---

## Stack
- **Framework**: Next.js 14
- **Hosting**: Vercel
- **State**: localStorage (client-side)
- **Design**: Hành Thủy — navy/cyan/gold, Playfair Display + Be Vietnam Pro

## Deploy lên Vercel

1. Push repo lên GitHub
2. Vào [vercel.com](https://vercel.com) → Import Git Repository
3. Chọn repo này → Deploy (tự detect Next.js, không cần config)

## Local dev

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Cấu trúc

```
peopleos-hub/
├── pages/
│   ├── _app.js          # Global styles + Head
│   ├── _document.js     # Google Fonts, meta tags
│   └── index.js         # Entry point
├── components/
│   └── PeopleOSHub.jsx  # Main app component
├── public/              # Static assets
├── vercel.json
└── package.json
```
