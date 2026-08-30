# Tech Stack — smartFit_daily

- **ประเภทเอกสาร:** Tech Stack — Concrete/Stack-Specific
- **สถานะเอกสาร:** Draft
- **วันที่สร้าง:** 2026-08-28
- **อัปเดตล่าสุด:** 2026-08-31 — **Tech Stack Consistency Audit + Reconciliation** ต่อจากที่
  `detailed-design-builder`/`api-db-spec-builder` เพิ่ง audit โค้ดจริงใน commit `b463436` เมื่อวันเดียวกันแล้ว
  flag มาที่ท้าย log ว่า `tech-stack.md` เองก็ล้าหลังจากจุดเดียวกัน — ทั้งหมดเป็นการบันทึก/แก้ให้ตรงกับ
  ข้อเท็จจริงที่ทีม implement/ตัดสินใจไปแล้วจริง ไม่มีจุดใดเป็นการเปลี่ยนตัวเลือก stack ใหม่ จึงแก้ผ่าน flow
  ปกติไม่ต้องรัน Discovery Questionnaire: (1) เพิ่ม **Google Gemini** (`@google/genai` SDK, model
  `gemini-3.6-flash`) เป็นเทคโนโลยีจริงที่เลือกแล้วสำหรับขั้นตอน ranking/ประเมินความเข้มข้นของวิดีโอใน
  Content Recommendation (REC-1/REC-4) — เป็นขั้นตอนเสริมต่อจาก YouTube Data API v3 search ไม่ใช่แทนที่
  (ผู้ใช้ยืนยันก่อนรันรอบนี้ว่าเป็นการบันทึกการตัดสินใจที่ทำและ ship ไปแล้วจริง ไม่ใช่จุดที่ต้องเลือกใหม่ — ดู
  หัวข้อ 3/4/5) (2) แก้แถว **Content Recommendation** และ **Insights & Forecast** ในหัวข้อ 6.1 ที่ยังเขียนว่า
  เป็น stub/รอ implement ทั้งที่ ship จริงและทำงานเต็มรูปแบบแล้ว พร้อมเพิ่ม operation ใหม่
  `GET /api/insights/weight-records` (`api-spec.md` §3.7, เพิ่ม 2026-08-31) เข้าแถว Insights & Forecast
  (3) ตัด **forecast (INT-1)** ออกจากรายการ "Client-side calculation ตาม NFR-01/NFR-03" ในหัวข้อ 4 เพราะ
  `detailed-design-builder` แก้ไปแล้วว่า INT-1 คำนวณฝั่ง server ทั้งหมด ไม่มีข้อจำกัด latency แบบเดียวกับ
  REC-2 — **ผลกระทบต่อเอกสารอื่น**: HLA §10 (แถว Content Recommendation ยังอ้าง widen-retry ที่ไม่มีจริงและ
  ไม่มี mapping ของ Gemini) และ `database-schema.md` §8.2/§8.3 (ยังไม่มีแถว
  `today_recommendation_snapshot`/`today_recommendation_rejected_video`) จะ stale ต่อจากการแก้รอบนี้ —
  ควรรัน `architecture-builder`/`api-db-spec-builder` ต่อ (ดูหัวข้อ 8) — ดู log
  [2026-08-31](../../05-log/20260831-log.md)
- **อัปเดตก่อนหน้า:** 2026-08-30 — **Tech Stack Consistency Audit + Reconciliation** ตาม CLAUDE.md §
  "Docs/code drift": โค้ดจริงใน `smartfit_daily_app/` ได้ re-architecture ไปแล้วตั้งแต่ 2026-08-29 (เลิกใช้
  Firebase Cloud Functions แทนที่ด้วย **Express.js (TypeScript)**, แยก **web ออกเป็น `apps/web` ต่างหาก**
  จาก React Native เดิมที่เหลือ**เฉพาะ `apps/mobile` ตัดขอบเขตเหลือ INT-2/INT-3**) ทั้งที่เอกสารนี้ยังระบุ
  Firebase Cloud Functions + React Native/Expo คุมทั้ง 3 แพลตฟอร์มอยู่ — audit แล้วเป็น**การเปลี่ยนตัวเลือก
  stack จริง** (Backend compute engine, Hosting/Infra, client/codebase split) ไม่ใช่แค่ wording ล้าหลัง จึง
  หยุดถามผู้ใช้ด้วย mini Discovery Questionnaire เฉพาะหมวด **Hosting/Infra** ก่อนแก้ไฟล์ (คำถาม: Express
  server ที่ตอนนี้ serve ทั้ง REST API และ built web client ด้วย ควร run การผลิตจริงที่ไหน) — ผู้ใช้ยืนยัน
  **Google Cloud Run** (เทียบกับ Render/Fly.io/VM แบบดั้งเดิม — ดูหัวข้อ 5) เพราะอยู่ GCP project เดียวกับ
  Firestore/Firebase Auth ที่เลือกไว้แล้วอยู่แล้ว (Application Default Credentials ใช้งานได้ทันทีไม่ต้อง
  จัดการ service account key file แยก), autoscale-to-zero เข้ากับงบ MVP จำกัดมาก, deploy จาก container
  image เดียว (Dockerfile) ครอบคลุมทั้ง Express + built client ในคราวเดียว — แก้หัวข้อ 2 (หมายเหตุ
  platform-target realization), 3/4 (Mobile/Client, Web/Client ใหม่, Backend/API, Hosting/Infra, CI/CD &
  Dev Tooling), 6.1/6.2/6.3 (remap ทุก "Cloud Function" เดิม → Express route จริงที่มีอยู่แล้วใน
  `apps/web/server/routes/*/index.ts`, เพิ่ม mapping กลไก pairing-code, แก้จำนวน operation ของ Account &
  Session Management จาก 8 เป็น **10** ให้ตรงกับ `api-spec.md` §3.1 ฉบับล่าสุด), 7, 8 — ดู log
  [2026-08-30](../../05-log/20260830-log.md)
- **อัปเดตก่อนหน้านั้น:** 2026-08-29 (รอบใหม่) — sync ให้ครอบคลุม Feature ใหม่ **ONB-0 (Authentication)**
  ที่ upstream ทั้ง 4 ชั้น (HLA §3.1/§5/§6.4, `api-spec.md` §3.1 — 8 operations, `database-schema.md` §3.1
  ตาราง `user_account`, `detailed-design/01-onboarding-personalization.md` — 3 sequence diagram) เพิ่ม
  เข้ามาแล้วเมื่อวันเดียวกัน โดยทิ้ง ⚠️ ไว้ในภาคผนวก Stack Mapping ของตัวเองว่ารอหัวข้อนี้ขยาย mapping ระดับ
  operation — **เป็นการ mechanical mapping ของ component/operation ที่มีอยู่แล้วจริงไปสู่ Firebase (stack
  ที่เลือกไว้แล้วตั้งแต่ 2026-08-29 รอบก่อน) ไม่ใช่การเลือกเทคโนโลยีใหม่** จึงไม่ต้องรัน Discovery
  Questionnaire ซ้ำ — เพิ่มแถว "Account & Session Management" ในหัวข้อ 6.1 (map `user_account` เข้ากับ
  Firebase Auth's `UserRecord` โดยตรง ไม่ต้องมี Firestore document แยก), เพิ่มหัวข้อย่อย 6.3.1 สำหรับ mapping
  ทั้ง 8 operation (ส่วนใหญ่เป็น client SDK call ตรง ยกเว้น `forgot-password` ที่ต้องเป็น Cloud Function),
  เพิ่มเหตุผลในหัวข้อ 4, และเพิ่มจุดที่ยังไม่ได้ตัดสินใจใหม่ 3 ข้อในหัวข้อ 7 (ดู log
  `docs/05-log/20260829-log.md`)
- **อัปเดตก่อนหน้านั้นอีกที:** 2026-08-29 — เปลี่ยน Database/Backend/Authentication/Hosting เป็น Firebase ตามคำขอ
  ของผู้ใช้งานโดยตรง (ดูหัวข้อ 2 และ 5); sync หัวข้อ 6.1 ให้ละเอียดตรงกับ `database-schema.md` §8.2/8.3
  ฉบับ Hybrid (per-table Firestore collection/document mapping + FK/constraint enforcement migration —
  เป็นการ mechanical re-sync ข้อเท็จจริงที่ตัดสินใจแล้วที่อื่น ไม่ใช่การเปลี่ยนตัวเลือก stack จริงใหม่ จึงไม่
  ต้องรัน Discovery Questionnaire ซ้ำ); แก้ถ้อยคำที่ล้าหลังใน §7 ข้อ 1 และ §8 ที่ยังบอกว่า
  `database-schema.md`/ภาคผนวก Stack Mapping ของ HLA/API Spec/Detailed Design "ยังต้องทำ"/"stale" ทั้งที่
  งาน sync ทั้งหมดเสร็จแล้วจริง (cosmetic wording เท่านั้น ไม่กระทบตัวเลือก stack จริง — ตรวจสอบไฟล์จริงยืนยัน
  ก่อนแก้)
- **สร้างโดย:** skill `tech-stack-builder`
- **อ้างอิงจาก:** [High Level Architecture](high-level-architecture.md), [API Spec](api-spec.md),
  [Database Schema](database-schema.md), [Detailed Design](detailed-design/),
  [Product Backlog](../../01-requirements/backlog.md),
  [Requirement ทั้ง 4 epic + NFR](../../01-requirements/01-spec/index.md)

## 1. ขอบเขตและหลักการ

เอกสารนี้เป็น**จุดเดียวในทั้ง pipeline ของ `02-technical/` ที่ระบุเทคโนโลยีจริงโดยเจตนา** — ต่างจาก
[High Level Architecture](high-level-architecture.md), [API Spec/Database Schema](api-spec.md),
และ [Detailed Design](detailed-design/) ที่ต้องคง conceptual ล้วนไม่ผูก stack เอกสารนี้แปลง conceptual
chain ทั้งหมดให้เป็นทางเลือกที่ implement ได้จริง โดยอ้างอิงจาก **Discovery Questionnaire** ที่ถามผู้ใช้
งานโดยตรง (หัวข้อ 2) ร่วมกับข้อกำหนดทางเทคนิคที่ปรากฏใน HLA/API Spec/Database Schema/Detailed Design

## 2. สรุปคำตอบจาก Discovery Questionnaire (2026-08-28)

| หมวด | คำตอบ |
|---|---|
| Platform targets | iOS + Android + Web app |
| Team background | ทีมถนัด JavaScript/TypeScript (web/React ecosystem) |
| Hosting/Infra preference | ไม่มี preference เฉพาะ — ให้แนะนำ |
| Backend approach preference | Backend-as-a-Service |
| Budget/Scale tier | งบจำกัดมาก (prototype/MVP) |
| Timeline | ปานกลาง (3-6 เดือน) |
| Data compliance/residency | ไม่มีข้อกำหนด residency เฉพาะ แต่ต้องทำตาม PDPA มาตรฐาน |
| Offline support | ไม่จำเป็นต้อง support offline |

**การตัดสินใจเพิ่มเติมที่ถามแยก** (เพราะมีทางเลือกสำคัญมากกว่า 1 ทาง ตามกติกาของ skill):
- Mobile/Client framework → **React Native + Expo** (แนะนำ — เทียบกับ 5 ทางเลือกอื่นด้วย Weighted Scoring
  Model เต็มรูปแบบ ดูหัวข้อ 5) — **ไม่เปลี่ยนแปลงจากการอัปเดต 2026-08-29**
- Backend & Database (BaaS provider) → เดิมเลือก **Supabase** จาก Weighted Scoring Model (ดูหัวข้อ 5) —
  **แทนที่ด้วย Firebase ตามการตัดสินใจ 2026-08-29 ด้านล่าง**

### การตัดสินใจเปลี่ยนแปลงเพิ่มเติม (2026-08-29) — ย้าย Backend/Database ไป Firebase

ผู้ใช้งานร้องขอโดยตรงให้เปลี่ยนองค์ประกอบ Database จาก PostgreSQL (Supabase) ไปใช้ Firebase เนื่องจากเป็น
การเปลี่ยนตัวเลือก stack จริง (ไม่ใช่แค่เอกสารล้าหลัง) จึงถามผู้ใช้เพิ่มเติม 2 ประเด็นตามกติกาบังคับของ
skill นี้ ก่อนแก้ไฟล์จริง:

| ประเด็นที่ถาม | ตัวเลือกที่เสนอ | คำตอบที่ยืนยัน |
|---|---|---|
| Database engine (เพราะ `database-schema.md` เป็น relational model เต็มรูปแบบ ขัดกับธรรมชาติ NoSQL ของ Firebase) | (1) Firestore เต็มรูปแบบ (2) Firebase Realtime Database (3) Hybrid: Firebase (Auth/Storage/Functions) + PostgreSQL (4) คงเดิม | **Firestore เต็มรูปแบบ** |
| Backend/API & Authentication (เพราะ PostgREST/Supabase Edge Function ผูกกับ PostgreSQL โดยตรง ใช้ต่อกับ Firestore ไม่ได้) | (1) ย้ายทั้งระบบไป Firebase ecosystem (2) เปลี่ยนเฉพาะ Database แต่คง Supabase Auth (3) ยังไม่ตัดสินใจ | **ย้ายทั้งระบบไป Firebase ecosystem** |

ผลคือ Database, Backend/API, Authentication, และ Hosting/Infra เปลี่ยนทั้งหมดไปเป็น Firebase (ดูหัวข้อ 3
และ 4) — Mobile/Client และ Third-party Integration Setup ไม่อยู่ในขอบเขตของการเปลี่ยนแปลงนี้และไม่เปลี่ยน

### การ Reconcile เพิ่มเติม (2026-08-30) — Backend/API ย้ายจาก Firebase Cloud Functions ไป Express.js บน Google Cloud Run, แยก Mobile/Web เป็นคนละ codebase

**สถานการณ์**: ตาม CLAUDE.md § "Docs/code drift" ทีมได้ re-architecture โค้ดจริงไปแล้วตั้งแต่ 2026-08-29 —
วันเดียวกับที่เอกสารนี้เพิ่งเลือก Firebase Cloud Functions — เปลี่ยนเป็น Express.js (TypeScript) รันเอง แล้ว
ตัด React Native/Expo ที่เดิมตั้งใจคุมทั้ง iOS/Android/Web (Platform targets ในตารางข้างต้น) ให้เหลือเฉพาะ
`apps/mobile` ที่ทำหน้าที่ INT-2 (Bluetooth smart-scale sync) กับ INT-3 (wearable HealthKit/Health Connect
sync) เท่านั้น — ทุกอย่างอื่น (ONB-*, REC-*, PLN-*, INT-1) ย้ายไป `apps/web` ซึ่งเป็นเว็บแอปใหม่ (React +
Vite client + Express server ในโปรเจกต์เดียว) ที่เขียนขึ้นแทน "Expo web export" เดิมที่เอกสารนี้เคยระบุไว้

**การประเมินตามกติกาบังคับของ skill นี้**: นี่เป็น**การเปลี่ยนตัวเลือก stack จริง** 3 จุด — (1) Backend
compute engine (Cloud Functions → Express.js ที่ต้องมี host เอง) (2) Hosting/Infra (Firebase Hosting ที่
ผูกกับ Cloud Functions โดยอัตโนมัติ ใช้กับ Express.js เองไม่ได้) (3) Client/codebase split (1 React
Native+Expo codebase คุม 3 แพลตฟอร์ม → 2 codebase แยก: `apps/web` React+Vite กับ `apps/mobile` React
Native+Expo ที่ตัดขอบเขตแล้ว) — ไม่ใช่แค่เอกสารล้าหลังเชิง wording จึง**ต้องถามผู้ใช้ก่อนแก้** ตามกติกาข้อ
"ห้ามแก้ตัวเลือก stack เองแม้จะรู้คำตอบที่ควรจะเป็น" ของ skill นี้

Backend compute engine (Express.js เอง) และ Client/codebase split (React+Vite สำหรับเว็บ, React
Native+Expo ตัดขอบเขตสำหรับมือถือ) เป็นข้อเท็จจริงที่ทีมตัดสินใจไปแล้วจริงในโค้ด (ไม่ใช่ทางเลือกที่ต้องถามซ้ำ
— เอกสารนี้แค่ตามให้ทัน) มีเพียงจุดเดียวที่ยังไม่มีคำตอบจากที่ไหนเลยคือ **Express server (ซึ่งตอนนี้ serve
ทั้ง REST API และ built web client) ควร run การผลิตจริงที่ไหน** — จึงถาม mini Discovery Questionnaire
เฉพาะหมวดนี้:

| ประเด็นที่ถาม | ตัวเลือกที่เสนอ | คำตอบที่ยืนยัน |
|---|---|---|
| Hosting/Infra สำหรับ Express server ในการผลิตจริง | (1) Google Cloud Run (2) Render (3) Fly.io (4) VM แบบดั้งเดิม (เช่น Compute Engine/EC2 self-managed) | **Google Cloud Run** |

**เหตุผลของคำตอบ** (ยืนยันจากผู้ใช้): อยู่ใน GCP project เดียวกับ Firestore/Firebase Auth ที่เลือกไว้แล้ว
ตั้งแต่ 2026-08-29 — Application Default Credentials ใช้งานได้ทันทีไม่ต้องจัดการ service account key file
แยกเหมือนถ้า deploy ไปผู้ให้บริการนอก GCP (Render/Fly.io/VM ทั้ง 3 ตัวเลือกที่เหลือต้องมี), autoscale-to-zero
เข้ากับงบ MVP จำกัดมากที่ยืนยันไว้ตั้งแต่ Discovery รอบแรก (หัวข้อ 2 ด้านบน), deploy จาก container image
เดียว (Dockerfile) ครอบคลุมทั้ง Express + React+Vite client ที่ build แล้วในคราวเดียว ตรงกับโครงสร้างจริงที่
`apps/web/server/index.ts` serve ทั้งคู่อยู่แล้ว (ดูหัวข้อ 5 สำหรับตารางเปรียบเทียบ 4 ตัวเลือกแบบเต็ม)

ผลคือ Backend/API และ Hosting/Infra เปลี่ยนจาก Firebase Cloud Functions/Firebase Hosting เป็น Express.js
บน Google Cloud Run (ดูหัวข้อ 3 และ 4) — Database (Cloud Firestore) และ Authentication (Firebase
Authentication) **ไม่เปลี่ยน** เพราะยังคงเรียกผ่าน Firebase Admin SDK จาก Express ได้เหมือนเดิมทุกประการ
เพียงแค่ compute layer ที่เรียก SDK เปลี่ยนจาก Cloud Functions runtime เป็น Express server เอง

## 3. Recommended Tech Stack

| องค์ประกอบ                  | เทคโนโลยีที่เลือก                                                                                                                                                  |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Web/Client** (ใหม่ 2026-08-30) | React + Vite (`apps/web/client/`) — พอร์ตคอมโพเนนต์จาก React Native เดิมผ่าน `react-native-web`, หน้าจอมิเรอร์ `docs/02-design/01-prototypes/v1/`, ครอบคลุม ONB-*/REC-*/PLN-*/INT-1 ทั้งหมด (core loop เต็ม) |
| **Mobile/Client**           | React Native + Expo (EAS Development Build สำหรับ native module) — **ตัดขอบเขต 2026-08-30**: เหลือเฉพาะ INT-2 (Bluetooth smart-scale sync ผ่าน `react-native-ble-plx`) และ INT-3 (wearable HealthKit/Health Connect sync) ไม่มีหน้าจอ auth ของตัวเอง ไม่ build web target อีกต่อไป |
| **Backend/API**             | **Express.js (Node.js/TypeScript)** — เปลี่ยนจาก Firebase Cloud Functions (2026-08-30) — หนึ่ง Express app (`apps/web/server/`) serve ทั้ง REST API (route file ต่อ Conceptual Component ของ HLA §3) และ React+Vite client ที่ build แล้ว (static + catch-all ใน `NODE_ENV==='production'` block ของ `apps/web/server/index.ts`) |
| **Database**                | Cloud Firestore (NoSQL document database, managed โดย Firebase) — **ไม่เปลี่ยน**, เข้าถึงผ่าน Firebase Admin SDK จาก Express แทน Cloud Functions runtime |
| **Authentication**          | Firebase Authentication — email/password + Google OAuth + Sign in with Apple — **ไม่เปลี่ยน** เพิ่มกลไก pairing-code handoff ใหม่ (Firestore `pairingCodes/{code}` + `auth.createCustomToken`) สำหรับ `apps/mobile` ที่ไม่มีหน้าจอ auth ของตัวเอง (ดูหัวข้อ 6.1) |
| **Hosting/Infra**           | **Google Cloud Run** — เปลี่ยนจาก Firebase Hosting + Cloud Functions (2026-08-30, ยืนยันจากผู้ใช้หลัง mini Discovery Questionnaire — ดูหัวข้อ 2) — deploy container image เดียว (Dockerfile) ครอบคลุมทั้ง Express + built client, autoscale-to-zero, ใช้ Application Default Credentials ใน GCP project เดียวกับ Firestore/Firebase Auth |
| **Third-party Integration** | YouTube Data API v3 (เรียกจาก Express, `apps/web/server/services/youtube.ts`, อ่าน `YOUTUBE_API_KEY`) เป็นแหล่งค้นหาวิดีโอผู้สมัคร (candidate search) ให้ REC-1/REC-4 — **เพิ่มใหม่ 2026-08-31 (ยืนยันเป็นการบันทึกข้อเท็จจริงที่ ship แล้ว ไม่ใช่จุดตัดสินใจใหม่):** **Google Gemini** (`@google/genai` SDK, model `gemini-3.6-flash`, `apps/web/server/services/videoRecommender.ts`, อ่าน `GEMINI_API_KEY` หรือ `GOOGLE_API_KEY`) เป็นขั้นตอน**เสริม**ต่อจาก YouTube search — ใช้จัดอันดับ/เลือกวิดีโอที่ตรงเป้าหมายแคลอรี่คงเหลือ/อุปกรณ์ที่สุด 1 รายการ พร้อมประเมิน intensity/แคลอรี่โดยประมาณจาก title+description+duration (ไม่ใช่การแทนที่ YouTube Data API v3), `react-native-health` (Apple HealthKit), `react-native-health-connect` (Google Health Connect), `react-native-ble-plx` (Bluetooth สมาร์ตสเกล) — 3 ตัวหลังอยู่ใน `apps/mobile` เท่านั้น ไม่เปลี่ยนจากเดิม |
| **CI/CD & Dev Tooling**     | GitHub Actions (`.github/workflows/ci.yml` — lint/typecheck/test ทุก workspace, ยังไม่มี deploy step), EAS Build + EAS Submit (เฉพาะ `apps/mobile` ตอนนี้), gcloud/Cloud Build build+deploy container image ไป Cloud Run สำหรับ `apps/web` (ยังไม่ได้ wire เข้า CI — ดูหัวข้อ 7) |

## 4. เหตุผลการเลือก (Rationale)

- **React Native + Expo (ตัดขอบเขต 2026-08-30)**: ทีมถนัด JavaScript/TypeScript อยู่แล้ว (จาก Discovery)
  — เดิมตั้งใจให้โค้ดฐานเดียวคุมทั้ง iOS, Android, และ Web (ผ่าน Expo web export) ตรงกับ Platform targets
  ที่ต้องการทั้ง 3 แพลตฟอร์ม แต่ทีมพบว่า Bluetooth (INT-2) และ HealthKit/Health Connect (INT-3) เป็น native
  capability ที่เว็บทำไม่ได้จริง ในขณะที่ฟีเจอร์ที่เหลือทั้งหมด (ONB-*/REC-*/PLN-*/INT-1) ทำงานบนเว็บได้ดีกว่า
  ไม่ต้องติดตั้งแอป จึงตัดสินใจ**แยก 2 codebase** แทนการคุมด้วยโค้ดฐานเดียว: `apps/mobile` (React
  Native+Expo, เหลือเฉพาะ INT-2/INT-3, EAS Build ยังจำเป็นสำหรับ build iOS โดยไม่ต้องมีเครื่อง Mac จริง) กับ
  `apps/web` ใหม่ (ดูบรรทัดถัดไป) — **นี่คือข้อเท็จจริงที่ทีมตัดสินใจไปแล้วในโค้ด (ไม่ใช่ทางเลือกที่ต้องถามซ้ำ)
  เอกสารนี้แค่ตามให้ทัน**
- **React + Vite (Web/Client ใหม่ 2026-08-30)**: แทนที่ "Expo web export" เดิมที่ยังไม่เคยถูก implement จริง
  — ใช้ react-native-web พอร์ตคอมโพเนนต์ที่มีอยู่แล้วจาก React Native codebase เดิมมาสร้างหน้าจอที่มิเรอร์
  `docs/02-design/01-prototypes/v1/` แทน ทำให้ core loop ทุก feature ยกเว้น INT-2/INT-3 ใช้งานผ่าน browser
  ได้ทันทีไม่ต้องติดตั้งแอป ตรงกับ Timeline ปานกลาง (3-6 เดือน) และงบจำกัดมากที่ยืนยันไว้ตั้งแต่ Discovery
  รอบแรก — Vite ให้ dev server เร็วกว่า Expo web export สำหรับ workflow ที่เป็นเว็บล้วน
- **Cloud Firestore (แทนที่ PostgreSQL/Supabase, 2026-08-29)**: เป็นการตัดสินใจโดยตรงของผู้ใช้งาน
  (ดูหัวข้อ 2) ให้รวมทุกองค์ประกอบไว้ใน Firebase ecosystem เดียว — ข้อแลกเปลี่ยนที่ทราบและยอมรับแล้วคือ
  `database-schema.md` ปัจจุบันออกแบบเป็น relational model เต็มรูปแบบ (15 ตาราง + FK ชัดเจน) ซึ่ง Firestore
  ไม่มี native FK/referential integrity — business rule ที่เคย enforce ได้บางส่วนที่ระดับ schema (เช่น
  all-or-nothing logging, safety floor, equipment mutual exclusion, cheat/rest nested check) ต้องย้ายไป
  enforce ทั้งหมดที่ Cloud Function layer แทน ต้องรัน `api-db-spec-builder` เพื่อออกแบบ collection/document
  structure ใหม่อย่างเป็นทางการ (ดูหัวข้อ 7 ข้อ 1)
- **Firebase Authentication**: มาพร้อม Firebase อยู่แล้ว ทดแทน Supabase Auth ด้วยความสามารถเทียบเท่า —
  Google OAuth + Sign in with Apple ครอบคลุมผู้ใช้ทั้งสองแพลตฟอร์มหลักเหมือนเดิม ลดเวลา dev ตรงกับ
  timeline ที่จำกัด
- **Account & Session Management (ONB-0, เพิ่ม 2026-08-29)**: การเลือก Firebase Authentication ไว้แล้ว
  ข้างต้นครอบคลุม ONB-0 (REQ-14–17) ได้ตรงตัวโดยไม่ต้องตัดสินใจ stack ใหม่ — ทั้ง 3 วิธีสมัคร/เข้าสู่ระบบที่
  `api-spec.md` §3.1 กำหนด (email/password, Google, Apple) เป็นความสามารถมาตรฐานของ Firebase Auth SDK
  อยู่แล้ว และ `user_account` (thin identity anchor ตาม `database-schema.md` §3.1) ไม่ต้องมี Firestore
  document แยกเพราะ field ทั้งหมด (`signup_method`/`email`/`credential_reference`/
  `external_provider_reference`/`created_at`) map ตรงกับ Firebase Auth's `UserRecord` เองครบถ้วน (ดูหัวข้อ
  6.1 แถวแรก) — ลด surface ที่ต้องดูแลเองลงไปอีก ตรงกับหลักการ "ย้ายทั้งระบบไป Firebase ecosystem" เดิม;
  ข้อยกเว้นเดียวคือ `POST /auth/forgot-password` ที่ต้องมี Cloud Function เพิ่มเพื่อ enforce เงื่อนไข `422`
  (บัญชี Google/Apple ไม่มีรหัสผ่านให้รีเซ็ต) เพราะ client SDK เพียงอย่างเดียวไม่รองรับการแยกกรณีนี้ (ดูหัวข้อ
  6.3.1)
- **Express.js (แทนที่ Firebase Cloud Functions, 2026-08-30)**: ยังทำหน้าที่เดียวกับ Cloud Functions เดิม
  ทุกประการ — รับผลการคำนวณจาก client แล้ว validate/บังคับกติกาธุรกิจก่อนเขียนลง Firestore เป็นเกราะป้องกัน
  ชั้นที่สองฝั่ง server (ผ่าน Firebase Admin SDK ตัวเดียวกัน เพียงแค่รันจาก Express process แทน Cloud
  Functions runtime) — เหตุผลที่เปลี่ยน: ทีมต้องการควบคุม routing/middleware เอง (`authenticate` middleware
  แทน `onCall()`'s อัตโนมัติ `request.auth.uid`) และรวม static file serving ของ built client ไว้ใน process
  เดียวกัน (ดูหัวข้อ 3) ซึ่ง Cloud Functions ทำไม่ได้ตรงไปตรงมาเท่า Express — ยังคงต้องเขียน route ครอบคลุม
  ทุก operation เองเช่นเดิม (Firestore ไม่มี auto-generated API ไม่ว่าจะรันบน compute engine ไหน — ดูหัวข้อ
  6.3) — **นี่คือข้อเท็จจริงที่ทีมตัดสินใจไปแล้วในโค้ด ไม่ใช่ทางเลือกที่ต้องถามซ้ำ**
- **Google Cloud Run (แทนที่ Firebase Hosting, 2026-08-30 — ยืนยันจากผู้ใช้ผ่าน mini Discovery
  Questionnaire ดูหัวข้อ 2)**: Firebase Hosting ผูกกับ static site/Cloud Functions โดยอัตโนมัติ ใช้กับ
  Express.js ที่ต้อง serve ทั้ง API และ client เองในโปรเซสเดียวไม่ได้ตรงไปตรงมา — Cloud Run รับ container
  image (Dockerfile) เดียวที่รัน Express ได้ตรงตามโครงสร้างจริง อยู่ GCP project เดียวกับ Firestore/Firebase
  Auth ทำให้ Application Default Credentials ใช้งานได้ทันทีไม่ต้องจัดการ service account key file แยก,
  autoscale-to-zero เข้ากับงบ MVP จำกัดมาก (ไม่มี traffic ก็ไม่มีค่าใช้จ่าย) — ยังคงอยู่ใน Firebase/Google
  Cloud ecosystem เดียวตามหลักการ "ย้ายทั้งระบบไป Firebase ecosystem" เดิม (2026-08-29) เพียงแค่เปลี่ยนว่า
  compute layer ไหนรัน business logic เอง
- **Google Gemini (`@google/genai`, model `gemini-3.6-flash`) สำหรับ video ranking ของ Content
  Recommendation — เพิ่มใหม่ 2026-08-31 (บันทึกการตัดสินใจที่ทีม implement/ship ไปแล้วจริง ไม่ใช่จุด
  ตัดสินใจใหม่ที่ต้องเทียบเชิงปริมาณ — ผู้ใช้ยืนยันก่อนรันรอบนี้)**: YouTube Data API v3 (`services/
  youtube.ts`) คืนเฉพาะ title/description/duration ต่อวิดีโอ ไม่มี field เชิงโครงสร้างสำหรับ "แคลอรี่ที่
  เผาผลาญ"/ความเข้มข้นให้ filter ตรงๆ เลย — ทีมจึงเพิ่ม Gemini เป็นขั้นตอนที่สองต่อจาก YouTube search (ไม่ใช่
  แทนที่) ให้ประเมิน/เลือกวิดีโอที่ดีที่สุด 1 รายการจาก candidate ที่มีอยู่ พร้อมประเมิน `activityType`/
  `intensity`/`estimatedKcal`/`includesWarmupCooldown` จาก title+description+duration ล้วนแบบ best-effort
  (`services/videoRecommender.ts`) — เลือก **tier Flash** โดยเฉพาะ (ไม่ใช่ Pro) เพราะเป็น tier เดียวที่มี
  free-tier quota ให้ใช้งานจริงโดยไม่ต้องเปิด billing (Pro-tier model เช่น `gemini-3.1-pro-preview` ไม่มี
  free-tier quota เลยตาม comment ในโค้ดเอง) ตรงกับ Budget/Scale tier "งบจำกัดมาก" ที่ยืนยันไว้ตั้งแต่
  Discovery รอบแรก (หัวข้อ 2) และมีความสามารถเพียงพอสำหรับงาน ranking ผู้สมัครไม่กี่รายการต่อครั้ง —
  ทางเลือกอื่นที่มีอยู่จริง (เช่น OpenAI GPT-4o-mini, Anthropic Claude Haiku, หรือ rule-based keyword
  filtering ไม่พึ่ง AI เลย) ไม่ได้ถูกประเมินเชิงปริมาณอย่างเป็นทางการในเอกสารนี้ เพราะนี่เป็นการบันทึกย้อนหลัง
  ของการตัดสินใจที่ implement และ ship ไปแล้วจริง ไม่ใช่จุดตัดสินใจใหม่ (ดูหัวข้อ 5 สำหรับบันทึกทางเลือก
  โดยสังเขป) — env var ที่อ่าน (`GEMINI_API_KEY`/`GOOGLE_API_KEY`) มีอยู่แล้วใน `apps/web/.env.example`
  (ตรวจสอบแล้ว 2026-08-31)
- **Client-side calculation ตาม NFR-01/NFR-03**: [Detailed Design](detailed-design/) ระบุชัดว่า TDEE
  (ONB-1), safety floor (ONB-3), MET+wearable override (REC-2), และ streak walk-back (PLN-4)
  ต้องเป็นการคำนวณที่ไม่มี network latency — **แก้ไข 2026-08-31**: เดิมรายการนี้เคยรวม forecast (INT-1)
  ด้วย แต่ `detailed-design-builder` audit พบว่าเป็นการเข้าใจผิดจากการ generalize มาจาก REC-2's MET
  calculation ที่มีเหตุผลด้าน latency ระหว่างออกกำลังกายจริงชัดเจน (ต้องการ feedback ภายใน 250ms ตาม
  NFR-02) — **Forecast (INT-1) ไม่มีข้อจำกัด latency แบบเดียวกันเลย**: เป็น bodyless
  `GET /api/insights/forecast` ที่คำนวณทั้งหมดฝั่ง server (`apps/web/server/routes/insights-forecast/
  index.ts`) ไม่มี client-side precomputation ใดๆ ตั้งแต่แรก (ดูหัวข้อ 6.1 แถว Insights & Forecast) —
  ตัดออกจากรายการนี้ให้ตรงกับ `detailed-design/04-smart-integrations.md` ฉบับล่าสุดแล้ว — จึง implement
  อัลกอริทึมที่เหลือ (TDEE/safety floor/MET/streak walk-back) ที่ client โดยตรงเหมือนเดิม
  (React+Vite web client สำหรับ feature เหล่านี้ทั้งหมด เพราะทั้งหมดอยู่ใน `apps/web` แล้วหลังตัดขอบเขต
  มือถือ — ดูหัวข้อ 3) แล้วส่งผลลัพธ์ที่คำนวณแล้วไปบันทึกผ่าน **Express route** (แทนที่ Firebase Cloud
  Function เดิม) เพื่อให้ route นั้นทำหน้าที่ validate/บังคับกติกาธุรกิจเป็นเกราะป้องกันชั้นที่สองฝั่ง server
  ด้วย ไม่ใช่พึ่งพา client ฝ่ายเดียว — streak recompute (PLN-4) เปลี่ยนจาก Firestore `onWrite` trigger
  อัตโนมัติเดิมของ Cloud Functions เป็นการเรียกฟังก์ชัน `recomputeStreak()` ตรงจากทุก route ที่เขียน
  `dailyLogs` เอง เพราะ Express ไม่มี event-driven infrastructure แบบ Firestore trigger ให้ใช้ฟรีเหมือน
  Cloud Functions (ดูหัวข้อ 6.1 แถว Logging & Streak)
- **PDPA มาตรฐาน (ไม่มี residency เฉพาะ)**: Firebase/Google Cloud รองรับการเลือก region ของ Cloud Run และ
  Firestore ได้ (เช่น `asia-southeast1` — สิงคโปร์ ใกล้ไทยที่สุดในบรรดา region หลักที่ Firebase/Google
  Cloud มี) และมี **Firestore Security Rules** ทดแทน Row Level Security (RLS) ของ Supabase เดิม เพื่อ
  บังคับใช้ NFR-04 (แยกสิทธิ์การเข้าถึงข้อมูลต่อผู้ใช้) — ต้องออกแบบ rule set ใหม่ให้เทียบเท่า RLS เดิม
  (ยังไม่ได้เขียนจริง ดูหัวข้อ 7 ข้อ 2) — **หมายเหตุ 2026-08-30**: การยืนยันตัวตนระดับ route ปัจจุบัน enforce
  เองใน `authenticate` middleware ของ Express (`server/middleware/authenticate.ts` เรียก
  `auth.verifyIdToken()`) ซึ่งเป็นคนละชั้นกับ Firestore Security Rules — ทั้งสองชั้นต้องมีคู่กัน ไม่ใช่
  ทดแทนกัน (Security Rules ป้องกันการเข้าถึง Firestore โดยตรงจาก client SDK ถ้ามีในอนาคต, middleware
  ป้องกันการเรียก Express route)

## 5. ทางเลือกอื่นที่พิจารณาแล้ว (Alternatives Considered)

> **เพิ่มเติม 2026-08-28**: ขยายจากตารางข้อดี/ข้อเสีย 3 ทางเลือกเดิม เป็น **Weighted Scoring Model**
> (เกณฑ์เชิงปริมาณถ่วงน้ำหนัก) ครอบคลุม ≥5 ทางเลือกต่อจุดตัดสินใจ ตามคำขอให้ทำการวิเคราะห์เชิงเปรียบเทียบที่
> เข้มงวดขึ้นสำหรับใช้เป็นเอกสารประกอบวิชา/โครงงาน — เกณฑ์และน้ำหนัก derive จาก Discovery Questionnaire
> (หัวข้อ 2), NFR-01/03/04/05/06/11, และ `database-schema.md`'s relational model ที่ยืนยันแล้วทั้งหมด
> ไม่ใช่การตัดสินใจใหม่ — **ผลลัพธ์ยืนยันตัวเลือกเดิมทั้งสองจุด (React Native + Expo, Supabase) ไม่มีการ
> เปลี่ยนแปลงคำแนะนำใดๆ ในหัวข้อ 3/4/6 ณ ตอนนั้น**
>
> **อัปเดต 2026-08-29**: ผลการประเมิน Backend & Database ด้านล่าง (Supabase ชนะที่ 4.65/5, Firebase อยู่
> อันดับ 5 ที่ 3.20/5) **ยังคงเป็นบันทึกที่ถูกต้องของการประเมินเชิงเทคนิค ณ วันที่ 2026-08-28** — ไม่ได้ถูก
> invalidate แต่**ผู้ใช้งานตัดสินใจโดยตรง (business/organizational decision) ให้เลือก Firebase แทน**
> โดยรับทราบข้อแลกเปลี่ยนที่โมเดลระบุไว้แล้ว โดยเฉพาะเกณฑ์ที่ Firebase ได้คะแนนต่ำสุดในกลุ่ม:
> **Relational/DB fit (1/5)** — ต้องออกแบบ schema ใหม่ทั้งหมดจาก relational model ที่มีอยู่แล้ว และ
> **Vendor lock-in (1/5)** — ล็อกกับ Google Cloud ecosystem สูงสุดในบรรดาตัวเลือกที่พิจารณา เหตุผลของ
> การตัดสินใจนี้ไม่ได้มาจากเกณฑ์ทางเทคนิคในตาราง จึงบันทึกแยกไว้ที่นี่เพื่อความโปร่งใส ไม่แก้ไขตัวเลขในตาราง
> เดิมย้อนหลัง

### Mobile/Client Framework — Weighted Scoring Model

**เกณฑ์และน้ำหนัก** (รวม 100%):

| เกณฑ์ | น้ำหนัก | เหตุผล |
|---|---|---|
| Team fit / Learning curve | 20% | ทีมถนัด JS/TS (Discovery Questionnaire หัวข้อ 2) |
| Time-to-MVP | 20% | Timeline 3-6 เดือน + งบจำกัดมาก (Discovery Questionnaire) |
| Native capability (BLE/HealthKit/Health Connect) | 20% | INT-2/INT-3 เป็น hard requirement ของ backlog |
| Cross-platform code reuse (iOS+Android+Web) | 15% | ลดต้นทุน dev ต่อแพลตฟอร์ม |
| Cost (tooling/build service) | 10% | งบจำกัดมาก |
| Ecosystem/community maturity | 10% | ลดความเสี่ยงติดขัดกลางทาง |
| Scalability ระยะยาว | 5% | สำคัญน้อยสุดในบริบท MVP นี้ |

**คะแนนต่อทางเลือก** (1-5 ต่อเกณฑ์, คะแนนรวมถ่วงน้ำหนักเต็ม 5):

| ทางเลือก | Team fit (20%) | Time-to-MVP (20%) | Native cap. (20%) | Reuse (15%) | Cost (10%) | Ecosystem (10%) | Scalability (5%) | **รวม** |
|---|---|---|---|---|---|---|---|---|
| **React Native + Expo** | 5 | 5 | 3 | 4 | 5 | 5 | 4 | **4.40** |
| Ionic + Capacitor | 5 | 4 | 2 | 5 | 5 | 3 | 3 | **3.90** |
| Flutter | 2 | 3 | 4 | 5 | 5 | 4 | 5 | **3.70** |
| Kotlin Multiplatform + Compose Multiplatform | 1 | 2 | 5 | 3 | 5 | 2 | 5 | **3.00** |
| Native แยก 3 codebase (Swift+Kotlin+เว็บแยก) | 2 | 1 | 5 | 1 | 2 | 5 | 5 | **2.70** |
| .NET MAUI | 1 | 2 | 3 | 3 | 4 | 3 | 4 | **2.55** |

**ข้อดี/ข้อเสียต่อทางเลือก**:

| ทางเลือก | ข้อดี | ข้อเสีย |
|---|---|---|
| **React Native + Expo (เลือก)** | ตรงกับทีม JS/TS, ecosystem/community ใหญ่ที่สุด, EAS Build ไม่ต้องมี Mac, ต้นทุนต่ำ | native module (BLE/HealthKit/Health Connect) พึ่ง library บุคคลที่สาม — ความเสี่ยง maintenance (ดูหัวข้อ 7 ข้อ 4) |
| Ionic + Capacitor | ทีมถนัดที่สุด (web tech ล้วน), reuse code สูงสุด, ต้นทุนต่ำ | native BLE/HealthKit integration อ่อนกว่า React Native/Flutter ชัดเจน — เสี่ยงต่อ INT-2/INT-3 โดยตรง |
| Flutter | native module (health/BLE) เสถียร/ดูแลดีกว่าบางตัวใน React Native, performance ดี, reuse สูง | ทีมต้องเรียน Dart ใหม่ทั้งหมด — เสี่ยงกิน timeline 3-6 เดือน |
| Kotlin Multiplatform + Compose Multiplatform | native capability ดีที่สุดในกลุ่ม cross-platform | Compose Multiplatform Web ยังไม่ mature เท่าตัวอื่น, ทีมต้องเรียน Kotlin, community เล็ก |
| Native แยก 3 codebase | native capability เต็มร้อย ไม่มีข้อจำกัดจาก wrapper library | ต้นทุนพัฒนา 3 เท่า ขัดกับงบ/timeline โดยตรง แทบไม่มี code reuse |
| .NET MAUI | enterprise backing จาก Microsoft, native compiled | ทีมไม่มีพื้นฐาน C#/.NET เลย, web story อ่อนกว่ากลุ่มอื่น |

**ผลลัพธ์**: React Native + Expo ชนะชัดเจน (4.40/5) — ยืนยันตัวเลือกเดิม ไม่เปลี่ยนแปลง จุดอ่อนเดียวที่คะแนน
สะท้อนตรงกับ open point เดิมในหัวข้อ 7 ข้อ 4 (HealthKit/Health Connect library maturity)

### Backend & Database — Weighted Scoring Model (บันทึกการประเมิน 2026-08-28 — ดูหมายเหตุอัปเดต 2026-08-29 ด้านบน)

**เกณฑ์และน้ำหนัก** (รวม 100%):

| เกณฑ์ | น้ำหนัก | เหตุผล |
|---|---|---|
| Relational/DB fit กับ schema ที่มีอยู่แล้ว | 20% | `database-schema.md` เป็น relational 15 ตาราง + FK ชัดเจนแล้ว |
| Time-to-MVP (auto-generated API ฯลฯ) | 20% | งบจำกัดมาก + timeline 3-6 เดือน |
| Security/Compliance | 15% | NFR-04/05/06/11 (encryption, consent, PDPA) |
| Cost/free-tier | 15% | งบจำกัดมาก |
| Team fit | 15% | ทีม JS/TS |
| Ecosystem maturity | 10% | ลดความเสี่ยงติดขัดกลางทาง |
| Vendor lock-in / portability | 5% | สำคัญน้อยสุดในบริบท MVP นี้ |

**คะแนนต่อทางเลือก**:

| ทางเลือก | DB fit (20%) | Time-to-MVP (20%) | Security (15%) | Cost (15%) | Team fit (15%) | Ecosystem (10%) | Lock-in (5%) | **รวม** |
|---|---|---|---|---|---|---|---|---|
| **Supabase** | 5 | 5 | 5 | 5 | 4 | 3 | 5 | **4.65** |
| Custom Node.js/NestJS + PostgreSQL | 5 | 2 | 3 | 3 | 5 | 5 | 5 | **3.80** |
| Custom Django + PostgreSQL | 5 | 3 | 4 | 3 | 2 | 5 | 5 | **3.70** |
| Appwrite | 2 | 4 | 3 | 4 | 4 | 2 | 4 | **3.25** |
| PocketBase | 2 | 4 | 2 | 5 | 4 | 2 | 4 | **3.25** |
| Firebase | 1 | 4 | 3 | 4 | 4 | 5 | 1 | **3.20** |
| AWS Amplify | 3 | 2 | 4 | 3 | 2 | 5 | 2 | **2.95** |

**ข้อดี/ข้อเสียต่อทางเลือก**:

| ทางเลือก | ข้อดี | ข้อเสีย |
|---|---|---|
| Supabase | PostgreSQL จริง ตรงกับ relational model ของ `database-schema.md` ทันที, PostgREST auto-generate API ตรงกับ REST convention ของ `api-spec.md` โดยตรง, RLS ตรงกับ NFR-04/06, open-source (ไม่ lock-in) | ecosystem/plugin เล็กกว่า Firebase, ยังใหม่กว่า |
| Custom Node.js/NestJS + PostgreSQL | ทีมถนัดที่สุด, control เต็มที่, ไม่ lock-in | ต้องสร้าง auth/API/RLS-equivalent เองทั้งหมด — กิน timeline มากที่สุดในกลุ่มที่พิจารณา |
| Custom Django + PostgreSQL | security default แข็งแรง, ORM ดีกับ PostgreSQL | ทีมต้องเรียน Python ใหม่ |
| Appwrite | open-source เหมือน Supabase, มี auto-generate API/SDK | database เป็น document-style ไม่ใช่ relational แท้ — ต้องปรับ schema ใหม่ |
| PocketBase | เริ่มได้เร็วที่สุด, ฟรีเกือบเต็ม (single binary self-host) | SQLite ไม่เหมาะ production ที่มี concurrent write ทุกวัน, security/encryption ต้อง implement เอง |
| **Firebase (เลือกจริงหลังการตัดสินใจ 2026-08-29 — ดูหมายเหตุด้านบน)** | Ecosystem/community ใหญ่ที่สุด เอกสารเยอะ, รวม Auth/Functions/Hosting/Database ไว้ผู้ให้บริการเดียว, Firestore SDK ผสานกับ React Native ได้ตรงไปตรงมา | ใช้ Firestore (NoSQL) ต้องออกแบบ schema ใหม่ทั้งหมดจาก relational model ที่มีอยู่แล้ว เสี่ยง denormalize ข้อมูลซับซ้อน (15 ตารางที่มี FK ชัดเจน), vendor lock-in สูงสุด, ไม่มี PostgREST-equivalent จึงต้องเขียน Cloud Function ครอบคลุมทุก endpoint เอง |
| AWS Amplify | ยืดหยุ่น scale ได้ดีมากในระยะยาว, enterprise-grade | Setup/learning curve สูงกว่า, ทีมไม่มีพื้นฐาน AWS, billing คาดเดายากสำหรับทีมเล็ก — ไม่เหมาะกับงบ MVP จำกัด+timeline 3-6 เดือน |

**ผลลัพธ์การประเมิน (2026-08-28)**: Supabase ชนะชัดเจนที่สุด (4.65/5), Firebase อยู่อันดับสุดท้าย (3.20/5)
**ผลจริงที่นำไปใช้ (2026-08-29)**: Firebase — ตามการตัดสินใจโดยตรงของผู้ใช้งานในหัวข้อ 2 ไม่ใช่ผลจากตาราง
นี้

### Hosting/Infra สำหรับ Express.js Server (ใหม่ 2026-08-30 — mini Discovery Questionnaire ตามหัวข้อ 2)

**บริบท**: ต่างจาก Mobile/Client และ Backend & Database ด้านบนที่ใช้ Weighted Scoring Model เต็มรูปแบบ
จุดนี้เป็น mini Discovery Questionnaire แบบเจาะจง (1 คำถาม, 4 ตัวเลือก) เพราะ Backend/API เอง
(Express.js) เป็นข้อเท็จจริงที่ทีมตัดสินใจไปแล้วในโค้ด มีเพียง "จะรัน Express.js ที่ไหน" ที่ยังไม่มีคำตอบ

| ทางเลือก | ข้อดี | ข้อเสีย |
|---|---|---|
| **Google Cloud Run (เลือก)** | อยู่ GCP project เดียวกับ Firestore/Firebase Auth ที่เลือกไว้แล้ว — Application Default Credentials ใช้งานได้ทันที ไม่ต้องจัดการ service account key file แยก, autoscale-to-zero เข้ากับงบ MVP จำกัดมาก (ไม่มี traffic ไม่มีค่าใช้จ่าย), deploy จาก container image เดียว (Dockerfile) ตรงกับโครงสร้างจริงที่ Express serve ทั้ง API และ built client ในโปรเซสเดียว | ต้อง maintain Dockerfile เอง (ต่างจาก buildpack-based ของ Render), cold start หลัง scale-to-zero มีผลกับ NFR-02 (250ms feedback) ในคำขอแรกหลัง idle — ต้องประเมินเพิ่ม (ดูหัวข้อ 7) |
| Render | Setup ง่ายกว่า Cloud Run (ไม่ต้องเขียน Dockerfile เอง ถ้าใช้ buildpack), free tier มี | อยู่นอก GCP ecosystem — ต้องสร้าง/จัดการ Firebase service account key file แยกต่างหาก เป็นความเสี่ยง credential รั่วไหลเพิ่มเทียบกับ ADC ของ Cloud Run, billing/console แยกจาก Firestore/Firebase Auth |
| Fly.io | Global edge deployment, cold start เร็วกว่า Cloud Run ในหลายกรณี | อยู่นอก GCP ecosystem เหมือน Render (ต้องจัดการ service account key file เอง), ทีมไม่มีประสบการณ์ตรง, ต้นทุนคาดเดายากกว่าสำหรับทีมเล็ก |
| VM แบบดั้งเดิม (เช่น Google Compute Engine/EC2 self-managed) | ควบคุมเต็มที่ ไม่มี cold start | ต้อง maintain OS/patching/scaling เอง — ขัดกับงบจำกัดมาก+timeline ปานกลางโดยตรง, ไม่มี autoscale-to-zero (ค่าใช้จ่ายคงที่แม้ไม่มี traffic) |

**ผลลัพธ์**: Google Cloud Run — ยืนยันจากผู้ใช้งานโดยตรง ด้วยเหตุผลเรื่อง GCP-native credential handling
(ADC) และ autoscale-to-zero เป็นหลัก (ไม่ใช่ผลจาก Weighted Scoring Model เชิงปริมาณเหมือน 2 จุดตัดสินใจ
ก่อนหน้า — เพราะเป็นคำถามเดียวที่มีมิติ trade-off ชัดเจนพอที่ไม่ต้องถ่วงน้ำหนักหลายเกณฑ์)

### Video Ranking Model สำหรับ Content Recommendation (Gemini) — บันทึกการตัดสินใจที่ทำไปแล้วจริง (ใหม่ 2026-08-31)

**บริบท**: ต่างจาก 3 จุดตัดสินใจด้านบนที่ skill นี้ยังไม่มีคำตอบตอนเริ่มต้น จุดนี้เป็นเทคโนโลยีที่ทีม
implement และ ship ไปแล้วจริงใน `apps/web/server/services/videoRecommender.ts` ก่อนที่ `tech-stack.md`
จะรู้จักด้วยซ้ำ — ผู้ใช้ยืนยันก่อนรันรอบนี้ว่าเป็นการบันทึกเอกสารให้ตรงกับของจริง ไม่ใช่จุดที่ต้องเปิดเทียบ
ทางเลือกใหม่ (จึงไม่มี Weighted Scoring Model เต็มรูปแบบเหมือนหัวข้อข้างบน) ตารางด้านล่างเป็นเพียงบันทึก
โดยสังเขปว่ามีทางเลือกอื่นอะไรบ้างและเพราะเหตุใด Gemini (tier Flash) จึงเพียงพอ:

| ทางเลือก | ข้อดี | ข้อเสีย |
|---|---|---|
| **Google Gemini, model `gemini-3.6-flash` (เลือกจริง — ship แล้ว)** | มี free-tier quota ให้ใช้งานจริงโดยไม่ต้องเปิด billing (ต่างจาก Gemini Pro-tier ที่ไม่มี free-tier เลย), รองรับ `responseSchema`/structured JSON output ตรงกับความต้องการ parse ผลลัพธ์แบบมีโครงสร้าง, อยู่ใน Google Cloud ecosystem เดียวกับ Firebase/Firestore ที่เลือกไว้แล้ว | ความสามารถ reasoning ต่ำกว่า tier Pro/รุ่นใหญ่กว่าของค่ายอื่น — ยอมรับได้เพราะงานคือ ranking ผู้สมัครไม่กี่รายการ ไม่ใช่งาน reasoning ซับซ้อน |
| OpenAI GPT-4o-mini | ราคาถูก, คุณภาพ ranking ดีเทียบเท่ากัน | ไม่มี free-tier แบบไม่ต้องผูกบัตรเครดิตเหมือน Gemini Flash, อยู่นอก Google Cloud ecosystem (ต้องจัดการ API key/billing แยกผู้ให้บริการ) |
| Anthropic Claude Haiku | คุณภาพ ranking/reasoning ดี, structured output รองรับ | ไม่มี free-tier ให้ใช้งานจริงเลย (ต้องเปิด billing ตั้งแต่แรก) ขัดกับงบ MVP จำกัดมากที่ยืนยันไว้ตั้งแต่ Discovery รอบแรก |
| Rule-based keyword filtering (ไม่พึ่ง AI) | ไม่มีต้นทุน API เลย, latency ต่ำสุด, ไม่ต้องพึ่ง external AI provider | ประเมิน intensity/แคลอรี่จาก title/description ไม่ได้แม่นยำเท่าโมเดลภาษา, ต้องเขียน/ดูแล keyword list เองต่อเนื่อง ความเสี่ยง maintenance สูง |

**ผลลัพธ์**: Google Gemini (`gemini-3.6-flash`) — ยืนยันเป็นข้อเท็จจริงที่ทีม implement และ ship ไปแล้ว
ไม่ใช่ผลจากการเปรียบเทียบเชิงปริมาณใหม่ในเอกสารนี้

## 6. Mapping จาก Conceptual Docs → Concrete Stack

> **หมายเหตุ 2026-08-29**: หัวข้อนี้ทั้งหมดถูกเขียนใหม่จาก Supabase/PostgreSQL เป็น Firebase/Firestore
> ตามการเปลี่ยนแปลงในหัวข้อ 2
>
> **อัปเดต 2026-08-29 (รอบ sync ล่าสุด)**: หัวข้อ 6.1 เดิมเป็นเพียง**แนวทางเบื้องต้น**ระดับ Conceptual
> Component คร่าวๆ เท่านั้น ตอนนี้ `api-db-spec-builder` ได้ออกแบบ Firestore collection/document structure
> อย่างเป็นทางการแล้วในแนวทาง **Hybrid** (ยืนยันจากผู้ใช้ — คง `database-schema.md` หัวข้อ 1-7 เป็น
> logical/relational model เดิมทั้งหมด แล้วขยายเฉพาะภาคผนวกหัวข้อ 8 ให้มี per-table mapping) — หัวข้อ 6.1
> ด้านล่างจึง sync ให้ละเอียดตรงกับ [`database-schema.md` §8.2](database-schema.md#82-table--firestore-collectiondocument-mapping)
> (per-table embed vs. subcollection) และ [§8.3](database-schema.md#83-fk--constraint-enforcement-migration-ย้ายจาก-schema-level-ไป-cloud-function)
> (FK/constraint enforcement migration) แล้ว ถือเป็น**เนื้อหาที่สมบูรณ์ระดับ per-table** ไม่ใช่แนวทาง
> เบื้องต้นอีกต่อไป — หัวข้อ 6.2/6.3 ไม่เปลี่ยนแปลงจากรอบก่อน
>
> **อัปเดต 2026-08-29 (รอบใหม่ — เพิ่ม Account & Session Management)**: เพิ่มแถวแรกในตารางหัวข้อ 6.1
> ด้านล่าง และหัวข้อย่อย 6.3.1 ใหม่ สำหรับ Component ใหม่ **"Account & Session Management" (HLA §3.1,
> ONB-0/REQ-14–17)** ที่ก่อนหน้านี้ทุกภาคผนวก Stack Mapping ต้นทาง (HLA §10, `api-spec.md` §6,
> `database-schema.md` §8.2, `detailed-design/01-onboarding-personalization.md` ภาคผนวก) ทิ้ง ⚠️ ไว้ว่า
> ยังไม่มี mapping ระดับนี้ — **เป็นการ mechanical mapping ไปสู่ Firebase ที่เลือกไว้แล้ว ไม่ใช่การเลือก
> เทคโนโลยีใหม่** ผลสรุป: `user_account` (thin identity anchor ตาม `database-schema.md` §3.1) ไม่ต้องมี
> Firestore document แยกเลย เพราะ field ทั้งหมดของมัน map ตรงกับ Firebase Auth's `UserRecord` เองอยู่แล้ว
> (ดูรายละเอียดในแถวตาราง) — resolve ⚠️ ในหัวข้อ 8.2 ของ `database-schema.md` ได้ในทางปฏิบัติ (ต้องรอ
> `api-db-spec-builder` sync ภาคผนวกฝั่งนั้นเองในการรันครั้งถัดไป — ดูหัวข้อ 8 ด้านล่าง)
>
> **อัปเดต 2026-08-30 (Backend/API compute layer เปลี่ยนจาก Firebase Cloud Functions → Express.js)**:
> ทุกจุดในหัวข้อ 6.1/6.3/6.3.1 ที่เคยเขียนว่า **"Cloud Function `{ชื่อ}`"** เปลี่ยนเป็น **Express route
> handler จริง** ที่มีอยู่แล้วในโค้ด (`apps/web/server/routes/{component-slug}/index.ts`, mount ผ่าน
> `apps/web/server/index.ts`) — Database (Cloud Firestore, หัวข้อ 6.2) **ไม่เปลี่ยนแปลง** เพราะยังเข้าถึง
> ผ่าน Firebase Admin SDK ตัวเดียวกัน เพียงแค่เรียกจาก Express process แทน Cloud Functions runtime — เพิ่ม
> mapping ใหม่สำหรับกลไก **pairing-code identity handoff** (HLA §4.5, `api-spec.md` §3.1 2 operation ใหม่,
> `database-schema.md` §3.17 ตาราง `pairing_credential`) ที่ยังไม่มี mapping มาก่อนเลย และแก้จำนวน
> operation ของ Account & Session Management ในหัวข้อ 6.3.1 จาก 8 เป็น **10** ให้ตรงกับ `api-spec.md` §3.1
> ฉบับล่าสุด (2026-08-30) — เป็น mechanical mapping ของโค้ด/operation ที่มีอยู่จริงแล้วไปสู่เอกสารนี้ ไม่ใช่
> การเลือกเทคโนโลยีใหม่ (ยืนยันแล้วผ่าน mini Discovery Questionnaire เฉพาะหมวด Hosting/Infra ในหัวข้อ 2)

### 6.1 HLA's Conceptual Component → Express.js + Cloud Firestore Implementation

> รายละเอียด per-table/collection ด้านล่าง sync ตรงจาก [`database-schema.md` §8.2/§8.3](database-schema.md#82-table--firestore-collectiondocument-mapping)
> (2026-08-29, แนวทาง Hybrid) — เกณฑ์ embed vs. subcollection: ข้อมูล **bounded** (ขอบเขตจำนวนจำกัดชัดเจน),
> ความสัมพันธ์ 1:1/multi-select เล็กกับผู้ใช้หรือเซสชันเดียว, และไม่มี pattern query อิสระ → **embed**
> ในเอกสารแม่; ข้อมูล **unbounded** (สะสมทุกวัน/ทุกเซสชัน) หรือต้อง query/pagination อิสระ →
> **subcollection แยก** (ป้องกัน document โตเกินขีดจำกัดขนาดของ Firestore ด้วย)

| Conceptual Component (HLA §3) | Concrete Implementation |
|---|---|
| Account & Session Management | **Firebase Authentication จัดการ credential/session ทั้งหมดเอง — ไม่มี Firestore collection แยกสำหรับ credential** เพราะ `user_account` (thin identity anchor ตาม `database-schema.md` §3.1) map ตรงกับ Firebase Auth's `UserRecord` เองครบทุก field: `id` = Firebase Auth UID (`uid`) — **ค่าเดียวกับที่ `users/{userId}` ของ Personalization & Profile (แถวถัดไป) ใช้เป็น document ID อยู่แล้ว** จึงไม่ต้องเก็บ `user_profile.user_account_id` (FK 1:1 ใน `database-schema.md` §3.2) เป็น field แยกใน Firestore เลย; `signup_method`/`email`/`external_provider_reference`/`created_at` derive จาก `UserRecord` field ตรงๆ; `credential_reference` ไม่มี field ให้เข้าถึงเพราะ Firebase Auth เก็บ password hash ไว้ภายในเองทั้งหมด — **ทั้งหมดนี้ไม่เปลี่ยนจากรอบก่อน** สิ่งที่เปลี่ยน (2026-08-30) คือ compute layer ที่เรียก Admin SDK: sign-up/login/logout ทั้ง 6 วิธี **ยังคงเป็น client SDK call ตรงจาก `apps/web/client/src/services/authService.ts`** (ไม่มี Express route เลย — ดูหัวข้อ 6.3.1), มีเพียง `forgot-password` ที่ implement เป็น **Express route จริง** `POST /api/auth/forgot-password` (`apps/web/server/routes/account-session/forgotPassword.ts`, mount ผ่าน `app.use('/api/auth', accountSessionRouter)` โดยตั้งใจไม่ใส่ `authenticate` middleware เพราะยังไม่มี session ตอนเรียก) แทนที่ Cloud Function `forgotPassword` เดิม เรียก `auth.getUserByEmail(email)` ตรวจ `providerData` เหมือนเดิมทุกประการ; **เพิ่มใหม่ 2026-08-30 — กลไก pairing-code identity handoff** (HLA §4.5, `api-spec.md` §3.1 ท้ายตาราง, `database-schema.md` §3.17): ไม่ persist ที่ตาราง/collection ใต้ `users/{userId}` แบบ entity อื่นทั้งหมด แต่ใช้ **top-level collection `pairingCodes/{code}`** แยกต่างหาก (document ID = ตัวรหัส 6 หลักเอง ไม่ใช่ auto-generated ID — ตรงกับที่ query หลักคือค้นด้วย `code` ไม่ใช่ user id ตาม `database-schema.md` §4) เก็บ field `uid` (เจ้าของรหัส)/`createdAt`/`expiresAt` (TTL 5 นาทีนับจากออกรหัส) — mint ผ่าน **Express route** `POST /api/pairing/create-code` (ต้องยืนยันตัวตนก่อน — `authenticate` middleware, `apps/web/server/routes/pairing/index.ts`) เรียกจากหน้า Profile ของเว็บไคลเอนต์; redeem ผ่าน **Express route** `POST /api/pairing/redeem` (**ข้อยกเว้นเดียว** ไม่มี `authenticate` middleware ตามที่ `api-spec.md` §2 ระบุ) ซึ่งอ่าน document, ตรวจ `expiresAt`, แล้วเรียก **`auth.createCustomToken(uid)`** คืน custom token ให้ `apps/mobile` เอาไปเข้าสู่ระบบต่อด้วย `signInWithCustomToken` (Firebase Auth client SDK ฝั่ง React Native) — **หมายเหตุการ enforce single-use**: `database-schema.md` §3.17 ออกแบบไว้เป็น `is_used` boolean conceptual field แต่ Express route จริงใช้ **`ref.delete()` ลบ document ทิ้งทันทีหลัง redeem สำเร็จแทนการตั้ง flag** — ผลลัพธ์เชิงความหมายเดียวกัน (redeem ซ้ำไม่ได้) เพียงแค่เลือก implement ด้วยการลบแทนการ set flag (ไม่ต้องเก็บ document ที่ใช้แล้วต่อ เพราะไม่มี use case ต้องดูประวัติ pairing เก่า) — ดูหัวข้อ 6.3.1 สำหรับ mapping operation ระดับ REST ทั้ง 10 |
| Personalization & Profile | Top-level collection `users`, document ID = Firebase Auth UID (`users/{userId}`) — field `age`/`sex`/`weightKg`/`heightCm`/`activityLevel`/`tdeeKcal` อยู่ในตัว document โดยตรง; embedded map field `goalSelection` (`goalType`/`targetWeightKg`/`dailyCalorieTargetKcal`/`isSafetyFloorApplied`) และ embedded array field `equipmentTypes: string[]` (สูงสุด 3 ค่าตาม ONB-2) อยู่ใน document เดียวกัน (bounded, 1:1/multi-select เล็ก ไม่มี pattern query แยก) + Firestore Security Rule จำกัดสิทธิ์ต่อผู้ใช้ (`request.auth.uid == userId`, ยังไม่ได้เขียนจริง ดูหัวข้อ 7) + **Express route** `GET /api/profile`, `PUT /api/profile/personal-info`, `PUT /api/profile/equipment`, `PUT /api/profile/goal` (แทนที่ Cloud Function `profileUpdate` เดิม — จริงๆ แล้วแยกเป็น 3 route handler ในไฟล์เดียว `apps/web/server/routes/personalization-profile/index.ts` ไม่ใช่ 1 ฟังก์ชันรวม) enforce equipment mutual exclusion (`equipmentTypes.includes('none') && length > 1` → `400`) และ safety floor (`dailyCalorieTargetKcal <= 1200` → ตั้ง `isSafetyFloorApplied`) — คำนวณ TDEE/target kcal ที่ฝั่ง client (React+Vite) ก่อนส่งเหมือนเดิม |
| Content Recommendation | **Express route** `GET /api/workouts/today/recommendation`, `POST /api/workouts/today/recommendation/swap`, `POST /api/workouts/sessions` (แทนที่ Cloud Function `recommendation` เดิม — `apps/web/server/routes/content-recommendation/index.ts`) — **แก้ 2026-08-31: implement จริงแล้วเต็มรูปแบบ ไม่ใช่ stub `501` อีกต่อไป** เป็น 2 ขั้นตอนต่อกัน: (1) **YouTube Data API v3** `search.list`+`videos.list` (`apps/web/server/services/youtube.ts`, อ่าน `YOUTUBE_API_KEY`) ค้นหาผู้สมัครสูงสุด 15 รายการตามคำค้นที่ derive จากอุปกรณ์ของผู้ใช้ กรองวิดีโอที่ embed ไม่ได้ทิ้ง (2) **Google Gemini** (`@google/genai`, model `gemini-3.6-flash`, `apps/web/server/services/videoRecommender.ts`, อ่าน `GEMINI_API_KEY`/`GOOGLE_API_KEY`) เลือกวิดีโอที่ตรงเป้าหมายแคลอรี่คงเหลือ/อุปกรณ์ที่สุด 1 รายการ พร้อมประเมิน `activityType`/`intensity`/`estimatedKcal`/`includesWarmupCooldown` แบบ best-effort เป็น **single-pass ล้วน** (ไม่มี tolerance ตัวเลข/widen-retry loop — ตรงกับที่ `detailed-design/02-daily-youtube-recommendation.md` แก้ไปแล้ว 2026-08-31) — ผลลัพธ์ cache เป็น embedded map field **`users/{userId}.todaysRecommendation`** (`computedFor`: วันที่คำนวณ ISO date, `video`: ผลลัพธ์ที่เลือก, `rejectedVideoIds: string[]`) mapping กับ 2 ตารางใหม่ `database-schema.md` §3.18/§3.19 (`today_recommendation_snapshot`/`today_recommendation_rejected_video`) — embed รวมเป็น field เดียวแทนที่จะเป็น 2 ตารางแยก (เข้าเกณฑ์ embed เดียวกับ `weightForecastSnapshot`/`streakSnapshot`: bounded, 1:1 กับผู้ใช้, ไม่มี pattern query อิสระ) — recompute เฉพาะเมื่อ `computedFor` ไม่ตรงกับวันนี้ (`GET .../recommendation`) หรือถูกเรียกจาก `POST .../swap` (REC-3, ส่ง `rejectedVideoIds` สะสม + วิดีโอปัจจุบันเข้า exclude list ก่อนค้นหาใหม่) — `POST /api/workouts/sessions` แยกต่างหาก สร้าง document `users/{userId}/workoutSessions/{sessionId}` เมื่อผู้ใช้กดเริ่มเซสชันจริง (`startedAt`/`status: 'in_progress'`) — **ยังเป็น TODO ในโค้ดจริง (ไม่เปลี่ยนจากการตรวจสอบรอบนี้)**: ยังไม่เขียน embedded array field `sessionVideos: []` (1-3 รายการตาม REC-1/REC-4) ลงใน document นี้เลย ต่างจาก `todaysRecommendation` ด้านบนที่ implement ครบแล้ว |
| Exertion & Calorie Calculation | คำนวณ MET ที่ client (React+Vite) ตาม NFR-01/03 → **Express route** `POST /api/workouts/sessions/:sessionId/complete` (แทนที่ Cloud Function `sessionComplete` เดิม — `apps/web/server/routes/exertion-calorie/index.ts`) validate แล้วเขียน embedded map field `actualCalorieBurn` ลงใน document `workoutSessions/{sessionId}` เดียวกัน; ค่าจาก wearable (INT-3) เขียนผ่าน **Express route** `POST /api/integrations/wearable/readings` (ดูแถว Integration Gateway) เป็น embedded map field `wearableReading` ใน document เดียวกัน — ถ้ามาถึงก่อน complete route จะอ่านมาใช้แทนค่าประมาณ MET; referential existence validation (**NFR-12**, Firestore ไม่มี FK) ทำผ่าน helper function ที่แยกเป็นไฟล์กลาง `apps/web/server/assertDocExists.ts` (throw `NotFoundError` ที่ error-handling middleware กลางของ Express แปลงเป็น `404` ให้อัตโนมัติ) เรียกใช้ซ้ำจากทั้ง route นี้และ `POST /api/integrations/wearable/readings` — แทนที่แนวคิดเดิมที่ให้แต่ละ Cloud Function `get()` เองแยกกัน |
| Planner & Day-Status | Subcollection `users/{userId}/weeklyPlanEntries/{date}` และ `users/{userId}/dayStatus/{date}` (document ID = ISO date — unbounded) — **Express route** `GET /api/planner/week`, `PUT /api/planner/days/:date`, `POST /api/planner/days/:date/cheat-rest`, `DELETE /api/planner/days/:date/cheat-rest` (แทนที่ Cloud Function `cheatRest`/read-only-flag Cloud Function เดิม — `apps/web/server/routes/planner-day-status/index.ts`) อ่าน `dailyLogs/{date}` ก่อนเสมอเพื่อคำนวณ read-only flag/enforce กติกา "วันนี้เท่านั้น" เหมือนตรรกะเดิม |
| Logging & Streak | Subcollection `users/{userId}/dailyLogs/{date}` (document ID = ISO date) + embedded map field `streakSnapshot` ภายใน `users/{userId}` — **Express route** `GET /api/logs`, `GET /api/logs/:date`, `GET /api/streak` (`apps/web/server/routes/logging-streak/index.ts`); all-or-nothing enforce ที่ route ที่เขียน `dailyLogs/{date}` (planner-day-status/exertion-calorie) เหมือนเดิม — **เปลี่ยนสำคัญ (2026-08-30)**: เดิม Cloud Functions มี Firestore `onWrite` trigger recompute `streakSnapshot` อัตโนมัติ แต่ **Express ไม่มี event-driven infrastructure แบบนั้นให้ใช้ฟรี** จึงเปลี่ยนเป็นฟังก์ชันธรรมดา `recomputeStreak(userId)` (`apps/web/server/routes/logging-streak/recomputeStreak.ts`) ที่ทุก route ซึ่งเขียน `dailyLogs`/`dayStatus` (`exertion-calorie` และ `planner-day-status`) ต้อง `import` แล้วเรียกเองโดยตรงหลังเขียนเสร็จ — เป็นการเปลี่ยนแปลงสถาปัตยกรรมที่มีนัยสำคัญ (explicit call แทน implicit trigger) ต้องระวังเวลาเพิ่ม route ใหม่ที่เขียน `dailyLogs` ในอนาคตไม่ให้ลืมเรียก |
| Insights & Forecast | Subcollection `users/{userId}/weightRecords/{recordId}` + embedded map field `weightForecastSnapshot` ภายใน `users/{userId}` — **Express route** `GET /api/insights/forecast`, `GET /api/insights/weight-records` (ตัวหลังเพิ่มใหม่ `api-spec.md` §3.7, 2026-08-31 — แทนที่ Cloud Function `forecast` เดิม, ทั้งคู่อยู่ใน `apps/web/server/routes/insights-forecast/index.ts`) — **แก้ 2026-08-31: implement จริงแล้วเต็มรูปแบบ ไม่ใช่รอคำนวณจริงอีกต่อไป**: `GET .../forecast` เป็น bodyless GET ที่ **server คำนวณเองทั้งหมด** อ่าน `goalSelection.targetWeightKg`, ต้องมี `dailyLogs` สะสมอย่างน้อย `MIN_LOG_DAYS_FOR_FORECAST = 3` วัน (ค่า placeholder เชิงปฏิบัติ ยังไม่ resolve เป็นทางการ ดูหัวข้อ 7 ข้อ 10), คำนวณ**ค่าเฉลี่ยแคลอรี่ที่เผาผลาญจริงต่อวัน**จาก `accumulatedKcal` ของทุก `dailyLogs` (ไม่ใช่ผลต่างจากเป้าหมาย — สูตรที่ `detailed-design/04-smart-integrations.md` แก้ไปแล้ว 2026-08-31) หารด้วย `KCAL_PER_KG = 7700` ได้อัตราการเปลี่ยนแปลงน้ำหนักต่อวัน แล้วเขียนทับ `weightForecastSnapshot`; `GET .../weight-records` คืนรายการ `weightRecords` เรียงเก่าสุดก่อน (`recordedAt` ascending, รองรับ `fromDate`/`toDate` optional) ใช้แสดงกราฟแนวโน้มบน Progress screen แทนที่ mock data เดิม |
| Integration Gateway | Embedded map field `integrationConnections: { smartScale: {...}, wearable: {...} }` ภายใน `users/{userId}` — **Express route** `POST /api/integrations/smart-scale/connect`, `DELETE /api/integrations/smart-scale`, `POST /api/integrations/smart-scale/sync`, `POST /api/integrations/wearable/connect`, `DELETE /api/integrations/wearable`, `POST /api/integrations/wearable/readings` (แทนที่ Cloud Function `integrations` เดิม — `apps/web/server/routes/integration-gateway/index.ts`) + native module ฝั่ง `apps/mobile` เท่านั้น (`react-native-health`, `react-native-health-connect`, `react-native-ble-plx`) — รับ identity handoff จากกลไก pairing-code (แถว Account & Session Management ด้านบน) ก่อนเริ่มกระบวนการจับคู่จริงตาม HLA §3.8/§4.5 |

⚠️ **Referential existence validation เป็นกติกา cross-cutting** ไม่ได้ผูกกับ Component เดียว — ทุก Express
route ที่รับ id อ้างอิงจาก client (เช่น `sessionId`, `userId` ที่ embed อยู่ใน path) ต้องยืนยันว่า document
ปลายทางมีอยู่จริงและเป็นของผู้ใช้คนเดียวกันก่อนเขียนเสมอ — ปัจจุบัน implement ผ่าน helper กลาง
`assertDocExists()`/`NotFoundError` (`apps/web/server/assertDocExists.ts`) ที่แต่ละ route เรียกใช้ซ้ำ
(แทนที่แนวคิดเดิมที่ให้แต่ละ Cloud Function ทำ `get()` เองแยกกันไม่มี helper กลาง) ดู [`database-schema.md`
§8.3](database-schema.md#83-fk--constraint-enforcement-migration-ย้ายจาก-schema-level-ไป-cloud-function)
แถวสุดท้าย และ NFR-12

### 6.2 `database-schema.md`'s Logical Type → Firestore Field Type

> **หมายเหตุ 2026-08-30**: หัวข้อนี้**ไม่เปลี่ยนแปลง** — Database (Cloud Firestore) ไม่ได้รับผลกระทบจาก
> การย้าย compute layer ไป Express.js เลย เพียงแค่ตอนนี้ "Cloud Function" ในคอลัมน์ขวาอ่านว่า "Express
> route handler" แทน (ดูหัวข้อ 6.1/6.3 สำหรับรายละเอียด mapping ต่อ operation จริง)

| Logical Type | Firestore Field Type |
|---|---|
| `identifier` | auto-generated document ID (string) หรือ string field ที่เก็บ reference ไปยัง document อื่น (Firestore ไม่มี FK จริง — ต้อง validate ความถูกต้องที่ Express route) |
| `string` | `string` |
| `integer` | `number` (Firestore เก็บเป็น number เดียว ไม่แยก int/float — ต้อง validate ขอบเขต/ทศนิยมที่ Express route) |
| `decimal` | `number` |
| `boolean` | `boolean` |
| `date` | `Timestamp` (ตั้งเวลาเป็นเที่ยงคืนของวันนั้น) หรือ `string` รูปแบบ ISO-8601 |
| `datetime` | `Timestamp` |
| `enum` | `string` ที่ validate ค่าที่อนุญาตไว้ใน Express route (Firestore ไม่มี native enum/check constraint เหมือน PostgreSQL) |

### 6.3 `api-spec.md`'s REST Convention → Express.js Routing

> **อัปเดต 2026-08-30**: เปลี่ยนจาก "Firebase Cloud Functions Routing" — Firestore ยังคงไม่มี
> auto-generated REST API แบบ PostgREST เหมือนเดิม (ข้อเท็จจริงนี้ไม่เปลี่ยนไม่ว่าจะรันบน compute engine
> ไหน) สิ่งที่เปลี่ยนคือ**รูปแบบไฟล์/การ mount route**: แทนที่จะเป็น 1 Cloud Function ต่อ operation เดิม
> ตอนนี้เป็น **1 โฟลเดอร์ต่อ Conceptual Component** (`apps/web/server/routes/{component-slug}/`,
> slug ตรงกับชื่อ component แบบ kebab-case) ที่มี `index.ts` เป็น Express `Router()` รวม operation ทั้งหมด
> ของ component นั้นไว้ในไฟล์เดียว (ยกเว้น logic ที่ถูกแยกออกมาเป็นไฟล์ช่วยต่างหากเมื่อถูก reuse ข้าม
> component เช่น `recomputeStreak.ts`) แล้ว mount เข้า `apps/web/server/index.ts` ด้วย prefix `/api`
> ร่วมกัน (`app.use('/api', api)`) — HTTP verb + resource path ของ `api-spec.md` ยังคงตรงกับ Express route
> path 1:1 เหมือนเดิม (เพียงเติม prefix `/api` ที่ระดับ mount)

- **Operation ที่เป็น CRUD ตรงไปตรงมา** (เช่น `GET /profile`, `GET /logs`, `GET /logs/{date}`) — Firestore
  **ไม่มี auto-generated REST API แบบ PostgREST** จึงต้องเขียนเป็น **Express route handler** เองทุก
  operation แม้เป็น CRUD ธรรมดา โดย map 1:1 กับ resource path เดิมของ `api-spec.md` (เติม prefix `/api`)
  เป็น route path จริง (เพิ่มปริมาณงาน dev เทียบกับ Supabase เดิมที่ auto-generate ให้ฟรี — ดูหัวข้อ 7)
- **Operation ที่มี business logic/validation/เรียก external API** (เช่น `PUT /profile/goal`,
  `GET /workouts/today/recommendation`, `POST /workouts/sessions/{sessionId}/complete`,
  `POST /planner/days/{date}/cheat-rest`, ทุก endpoint ใต้ `/integrations/*`) → implement เป็น
  **Express route handler** เดียวกัน โดยคง HTTP verb + resource path เดิมตามที่ `api-spec.md` กำหนดไว้ —
  ทุก route ที่ต้องยืนยันตัวตนก่อนเรียก (ทั้งหมดยกเว้น `forgot-password`/`pairing-codes/redeem` — ดูหัวข้อ
  6.3.1) ผ่าน `authenticate` middleware กลาง (`apps/web/server/middleware/authenticate.ts`) ที่ตรวจ
  Firebase ID Token แล้วเซ็ต `req.userId` แทนที่ `request.auth.uid` อัตโนมัติของ Cloud Functions'
  `onCall()` เดิม

#### 6.3.1 Account & Session Management (ONB-0 + Identity Handoff) — ข้อยกเว้นของกติกาข้างต้น

> **อัปเดต 2026-08-30**: `api-spec.md` §3.1 เพิ่ม 2 operation ใหม่ (`POST /auth/pairing-codes`,
> `POST /auth/pairing-codes/redeem`, เพิ่ม 2026-08-30 สำหรับกลไก identity handoff) ทำให้จำนวน operation
> ของ component นี้เพิ่มจาก 8 เป็น **10** — ตารางด้านล่าง sync ให้ครบทั้ง 10 แล้ว

**10 operation ของ `api-spec.md` §3.1 ส่วนใหญ่ไม่เข้ากติกา "ทุก operation ต้องเป็น Express route" ข้างต้น**
— เพราะ Firebase Authentication (ต่างจาก Firestore) มี **client SDK ที่ทำหน้าที่นี้ให้โดยตรงอยู่แล้ว**
ไม่ต้องเขียน route ครอบทุกตัวเหมือน CRUD ของ Firestore — **ยกเว้น 2 operation ใหม่ของกลไก pairing-code
ที่ต้องเป็น Express route จริง** เพราะ Firebase Authentication เองไม่มีแนวคิด "device-pairing code" ให้ใน
SDK แบบสำเร็จรูป (ต้องเขียนตรรกะ mint/validate/exchange เองทั้งหมด):

| Operation (`api-spec.md` §3.1) | Express.js/Firebase Implementation |
|---|---|
| `POST /auth/signup/email` | **Client SDK โดยตรง** (`apps/web/client/src/services/authService.ts`'s `signUpWithEmail()`) — `createUserWithEmailAndPassword(auth, email, password)` — Firebase คืน `409`-เทียบเท่า (`auth/email-already-in-use`) และ `400`-เทียบเท่า (`auth/invalid-email`, `auth/weak-password`) ให้เองที่ระดับ SDK ไม่ต้องมี Express route |
| `POST /auth/signup/google` | **Client SDK โดยตรง** — `GoogleAuthProvider.credential(idToken)` → `signInWithCredential(auth, credential)` (`loginWithGoogle()` ใน `authService.ts` — ปัจจุบันเป็น stub รอ wire native Google Sign-In flow จริง) — **หมายเหตุสำคัญ**: Firebase Auth ไม่มี endpoint แยก "signup" กับ "login" สำหรับ OAuth provider เป็นการเรียก SDK ตัวเดียวกันกับ `POST /auth/login/google` ทุกประการ — client อ่าน field `userCredential.additionalUserInfo.isNewUser` ที่ SDK คืนมาเพื่อตัดสินเส้นทางต่อแทนการแยก route |
| `POST /auth/signup/apple` | **Client SDK โดยตรง** — `OAuthProvider('apple.com').credential(...)` → `signInWithCredential` (`loginWithApple()` ใน `authService.ts`) — เป็น SDK call เดียวกันกับ `POST /auth/login/apple` เช่นเดียวกับ Google (ดู `isNewUser` ข้างต้น) |
| `POST /auth/login/email` | **Client SDK โดยตรง** — `signInWithEmailAndPassword(auth, email, password)` (`loginWithEmail()`) — Firebase คืน `401`-เทียบเท่า (`auth/wrong-password`, `auth/user-not-found`) ที่ระดับ SDK |
| `POST /auth/login/google` | **Client SDK เดียวกับ `POST /auth/signup/google`** เป๊ะ (ดูหมายเหตุแถวนั้น) |
| `POST /auth/login/apple` | **Client SDK เดียวกับ `POST /auth/signup/apple`** เป๊ะ (ดูหมายเหตุแถว signup/google) |
| `POST /auth/forgot-password` | **Express route** `POST /api/auth/forgot-password` (`apps/web/server/routes/account-session/forgotPassword.ts`, mount ไม่มี `authenticate` middleware — precondition คือยังไม่มี session) — operation เดียวในกลุ่ม auth เดิม (นอกเหนือกลไก pairing-code) ที่ต้องเป็น route จริงเพราะต้อง enforce เงื่อนไข `422` ("บัญชีนี้สมัครผ่าน Google/Apple ไม่มีรหัสผ่านให้รีเซ็ต") ซึ่ง client SDK's `sendPasswordResetEmail()` เพียงอย่างเดียวไม่รองรับการแยกกรณีนี้ — เรียก `auth.getUserByEmail(email)` ตรวจ `providerData[0].providerId !== 'password'` ก่อน ถ้าใช่คืน `422`, ถ้าไม่คืน `202` (ยังไม่ implement การส่งอีเมลจริง — TODO ในโค้ด) |
| `POST /auth/logout` | **Client SDK โดยตรง** — `signOut(auth)` (`logout()` ใน `authService.ts`) ล้าง ID token/refresh token ที่ client เก็บไว้ทันที (Firebase ID token เป็น stateless JWT ไม่มี server-side session ให้ invalidate ฝั่ง Express) — ไม่ต้องมี route |
| `POST /auth/pairing-codes` (ใหม่ 2026-08-30) | **Express route** `POST /api/pairing/create-code` (**หมายเหตุชื่อ path**: ต่างจาก resource path เชิงแนวคิดของ `api-spec.md` เล็กน้อย — `apps/web/server/routes/pairing/index.ts` ต้อง `authenticate` middleware ก่อนเสมอ) สร้าง document ใหม่ที่ `pairingCodes/{code}` (top-level collection, รหัส 6 หลักจาก `crypto.randomInt(100000, 999999)` เป็น document ID) เก็บ `uid`/`createdAt`/`expiresAt` (TTL 5 นาที) แล้วคืนรหัส + เวลาหมดอายุให้ client |
| `POST /auth/pairing-codes/redeem` (ใหม่ 2026-08-30) | **Express route** `POST /api/pairing/redeem` (**ข้อยกเว้นเดียว** ไม่มี `authenticate` middleware — ตรงกับที่ `api-spec.md` §2 ระบุว่าเป็น operation เดียวที่ไม่ต้องยืนยันตัวตนก่อนเรียก) อ่าน `pairingCodes/{code}`, ถ้าไม่พบหรือหมดอายุ (`expiresAt < now`) คืน error, ถ้าสำเร็จ `delete()` document (single-use ผ่านการลบ ไม่ใช่ set `is_used` flag — ดูหมายเหตุหัวข้อ 6.1) แล้วเรียก **`auth.createCustomToken(uid)`** คืน custom token — **หมายเหตุ status code**: โค้ดจริงปัจจุบันคืน `410 Gone` รวมทั้งกรณี "ไม่พบรหัส" และ "หมดอายุ" เป็นเงื่อนไขเดียว ยังไม่แยก `404`/`409`/`422` ตามที่ `api-spec.md` §3.1 ระบุไว้ (ดูหัวข้อ 7) |

**สรุป**: จาก 10 operation มี 7 ตัวเป็น client SDK call ตรง (Google/Apple signup กับ login เป็น SDK call
เดียวกันจริงๆ นับซ้ำ) และ 3 ตัวเป็น Express route จริง (`forgot-password`, `pairing-codes`,
`pairing-codes/redeem`) — ต่างจาก component อื่นทุกตัวในหัวข้อ 6.1/6.3 ที่ต้องเขียน route ครอบทุก
operation เพราะ Firestore ไม่มี auto-generated API — **Firebase Authentication มี client SDK ให้ใช้ตรง
อยู่แล้วสำหรับ 7 ใน 10 operation จึงเป็นข้อยกเว้นของกติกาทั่วไปข้างต้นโดยธรรมชาติของบริการนี้เอง ไม่ใช่การ
เลือก stack ใหม่ ส่วน 2 operation ของกลไก pairing-code ต้องเป็น route เพราะเป็นตรรกะที่ทีมออกแบบเอง ไม่มี
ใน SDK ของ Firebase Authentication ให้ใช้สำเร็จรูป**

## 7. จุดที่ยังไม่ได้ตัดสินใจ / ควรยืนยันเพิ่มเติม

1. **database-schema.md collection/document design — RESOLVED (2026-08-29)**: เดิมข้อนี้ระบุว่าหัวข้อ
   6.1/6.2 เป็นเพียงแนวทางเบื้องต้น ต้องรอ `api-db-spec-builder` ออกแบบ Firestore collection/document
   structure อย่างเป็นทางการก่อนจึงจะใช้พัฒนาจริงได้ — **งานนี้เสร็จสมบูรณ์แล้ว**: `api-db-spec-builder`
   ออกแบบ collection/document mapping ครบทั้ง 15 ตารางเดิมในแนวทาง **Hybrid** (ยืนยันจากผู้ใช้ 2026-08-29)
   — คงเนื้อหาหลักหัวข้อ 1-7 ของ `database-schema.md` เป็น logical/relational model + ER Diagram เดิม
   ทั้งหมด แล้วขยายเฉพาะภาคผนวก [§8.2 (Table → Firestore Collection/Document Mapping)](database-schema.md#82-table--firestore-collectiondocument-mapping)
   และ [§8.3 (FK/Constraint Enforcement Migration)](database-schema.md#83-fk--constraint-enforcement-migration-ย้ายจาก-schema-level-ไป-cloud-function)
   ให้ครอบคลุมทุกตาราง หัวข้อ 6.1 ของไฟล์นี้เองก็ sync ให้ละเอียดตรงกับ §8.2/§8.3 นั้นแล้วเช่นกัน (ดูหมายเหตุ
   "อัปเดต 2026-08-29 (รอบ sync ล่าสุด)" เหนือหัวข้อ 6.1 ด้านบน) — ไม่มีงานค้างส่วนนี้อีก
2. **Firestore Security Rules (ใหม่ 2026-08-29)**: ยังไม่ได้ออกแบบ rule set จริงที่เทียบเท่า Row Level
   Security (RLS) เดิมของ Supabase สำหรับ NFR-04/06 — ต้องทำก่อน provision จริง
3. **Firebase project region (แทนที่ point เดิมเรื่อง Supabase region, 2026-08-29)**: ยังไม่ได้เลือก
   region ที่แน่นอน (เช่น `asia-southeast1` — สิงคโปร์) — ควรยืนยันก่อนเริ่ม provision จริง โดยเฉพาะถ้ามี
   ข้อกำหนด PDPA ที่ชัดเจนขึ้นภายหลัง
4. **HealthKit/Health Connect library ที่แน่นอน**: `react-native-health`/`react-native-health-connect`
   เป็นตัวเลือกที่นิยม แต่ยังไม่ได้ประเมิน maintenance status ล่าสุดหรือเทียบกับการเขียน custom native
   module เอง — ไม่เปลี่ยนจากการสลับ backend/database
5. **Web app scope — RESOLVED (2026-08-28), แก้ไขเพิ่มเติม 2026-08-30**: เดิมคือ "Expo web export
   ครอบคลุมทุก feature เท่ากับ mobile หรือไม่" — คำตอบเดิม ("Epic 4 ทั้ง INT-1/INT-2/INT-3 เป็น
   mobile-only") **ล้าหลังไปแล้วหลัง re-architecture 2026-08-29**: ปัจจุบันมีเพียง **INT-2 (Bluetooth
   smart-scale sync) และ INT-3 (wearable sync) เท่านั้นที่เป็น mobile-only** — **INT-1 (weight forecast)
   อยู่ใน `apps/web` แล้ว** (`GET /api/insights/forecast`, ดูหัวข้อ 6.1 แถว Insights & Forecast) เพราะไม่มี
   native capability ที่เว็บทำไม่ได้ ตรงกับหลักการที่ทีมยึดจริง ("แยก native-only capability ออกไปมือถือ
   เท่านั้น ไม่ใช่ทั้ง Epic") — core loop parity เต็มทุกแพลตฟอร์มยังคงจริงอยู่ (ทุก feature ยกเว้น INT-2/
   INT-3 ทำงานบนเว็บได้) แก้ไขให้ตรงกับโค้ดจริงในหัวข้อนี้แล้ว
6. **Google Cloud Run cold start กับ NFR-02 (ใหม่ 2026-08-30)**: NFR-02 กำหนด UI feedback ภายใน 250ms —
   Cloud Run ที่ autoscale-to-zero มี cold start (container ใหม่ต้องเริ่มโปรเซส Express) สำหรับ request
   แรกหลัง idle ซึ่งมักเกิน 250ms ได้ง่าย — ยังไม่ได้ประเมินว่าต้องตั้ง minimum instance count ≥ 1 (เสีย
   ค่าใช้จ่ายคงที่ ขัดกับ autoscale-to-zero ที่เป็นเหตุผลหลักที่เลือก Cloud Run) หรือยอมรับ cold start
   เฉพาะ route ที่ไม่ผูก NFR-02 โดยตรง (ดูหัวข้อ 4 — NFR-02 ผูกกับ optimistic UI ฝั่ง client เป็นหลักอยู่
   แล้ว ไม่ใช่ round-trip เต็ม จึงอาจไม่กระทบจริง แต่ยังไม่ได้ยืนยัน)
7. **Dockerfile และ CI/CD deploy pipeline ไป Cloud Run ยังไม่มี (ใหม่ 2026-08-30)**: `apps/web/` ยังไม่มี
   `Dockerfile`, และ `.github/workflows/ci.yml` ปัจจุบันมีแค่ lint/typecheck/test ไม่มี step build+deploy
   container image ไป Cloud Run เลย — ต้องเขียนทั้งสองก่อน provision จริง (ไม่กระทบตัวเลือก stack เพราะ
   Cloud Run ยืนยันแล้วในหัวข้อ 2)
8. **Pairing-code redeem status code ไม่ตรงกับ `api-spec.md` (ใหม่ 2026-08-30)**: `api-spec.md` §3.1 ระบุ
   error case ของ `POST /auth/pairing-codes/redeem` แยก 3 กรณี (`404` ไม่พบรหัส, `409` ถูกใช้แล้ว, `422`
   หมดอายุ) แต่โค้ดจริงปัจจุบัน (`apps/web/server/routes/pairing/index.ts`) คืน **`410 Gone`** รวมทั้งกรณี
   "ไม่พบ" และ "หมดอายุ" เป็นเงื่อนไขเดียว (ตรวจ `data` ไม่มีหรือ `expiresAt` ผ่านไปแล้ว) และไม่แยกกรณี "ถูกใช้
   ไปแล้ว" ต่างหาก (เพราะ implementation ใช้การ `delete()` document แทนการตั้ง `is_used` flag — เมื่อถูกใช้
   ไปแล้ว document จะหายไปเลย ทำให้ redeem ซ้ำตกไปอยู่ในเงื่อนไข "ไม่พบ" เดียวกับรหัสที่ไม่เคยมีอยู่จริง) —
   ยังไม่ตัดสินใจว่าควรแก้โค้ดให้ตรงกับ conceptual spec (แยก 404/409/422 จริง) หรือควรแก้ `api-spec.md` ให้
   ตรงกับโค้ด (ยุบเหลือ `410` เดียว) — เป็นเรื่องของ `api-db-spec-builder`/ทีม dev ตัดสินใจ ไม่ใช่ตัวเลือก
   stack ที่ต้องตัดสินใจในเอกสารนี้
9. **Cost projection ของ Firebase + Cloud Run (ใหม่ 2026-08-29, ปรับปรุง 2026-08-30)**: Firebase/Google
   Cloud คิดค่าใช้จ่ายแบบ pay-per-read/write (Firestore) และ pay-per-request/vCPU-time (Cloud Run แทน
   per-invocation ของ Cloud Functions เดิม — โมเดลคล้ายกันแต่ไม่เหมือนเป๊ะ) ต่างจาก Supabase ที่เป็น fixed
   tier — ยังไม่มีการประเมิน cost projection ที่ scale การใช้งานจริง (เช่น จำนวน daily active user ที่
   คาดหวัง) ควรทำก่อน launch เพื่อไม่ให้งบ MVP เกินคาด
10. **สอดคล้องกับ Open Points เดิมของ conceptual docs**: ค่า Activity Factor/MET lookup table จริง,
    ตัวเลข tolerance ของ REC-1, จำนวนวัน log ขั้นต่ำของ INT-1 ฯลฯ ยังไม่ resolve — ต้องแก้ที่ต้นทาง
    (`01-spec/`) ก่อน ไม่ใช่ตัดสินใจในเอกสารนี้
11. **Firebase project OAuth client setup สำหรับ Google/Apple Sign-In (ใหม่ 2026-08-29, ONB-0)**: ยังไม่ได้
    ทำ configuration จริงใน Firebase Console/Google Cloud Console (SHA-1/SHA-256 fingerprint สำหรับ Android
    Google Sign-In, OAuth client ID ของ iOS/Android/Web แยกกัน) และใน Apple Developer portal (Services ID +
    Sign in with Apple capability) — ต้องทำก่อน provision จริง ไม่กระทบตัวเลือก stack (ยังเป็น Firebase
    Authentication เหมือนเดิม)
12. **NFR-11 audit/consent record-keeping สำหรับการสร้างบัญชี (ใหม่ 2026-08-29, ONB-0, ปรับปรุงคำ 2026-08-30)**:
    `database-schema.md` §3.1 ระบุว่า `user_account.created_at` "ใช้ประกอบ consent record-keeping ตาม
    NFR-11" แต่ยังไม่มีการออกแบบว่ากลไก audit trail จริงเป็นอย่างไร (เช่น **Express route ที่ trigger เอง
    หลังเรียก Firebase Auth signup สำเร็จ** — เดิมข้อนี้เคยเสนอ Cloud Functions' `onCreate` Auth Trigger
    ซึ่งไม่มีใน Express แล้ว ต้องเป็นการเรียกตรงจาก client หรือ route แทน) — ยังไม่ตัดสินใจในเอกสารนี้เพราะ
    รูปแบบ consent record-keeping ที่แน่นอนยังเป็น open point ที่ต้นทาง (`01-spec/`/HLA §8) ก่อน ไม่ใช่
    ประเด็นของการเลือก stack
13. **Account merge ข้ามวิธีสมัคร (ใหม่ 2026-08-29, ONB-0, ปรับปรุงคำ 2026-08-30)**: `api-spec.md` §4 ข้อ
    11 ทิ้ง open point ไว้ว่าพฤติกรรมเมื่ออีเมลจากผู้ให้บริการภายนอกตรงกับบัญชีที่มีอยู่แล้วด้วยวิธีอื่นยังไม่
    ระบุ — ถ้า resolve เป็น "merge เข้าบัญชีเดียวกัน" ในอนาคต จะต้องมี **Express route เพิ่ม** (เช่น ใช้
    Firebase Admin SDK's `linkWithCredential` หรือ custom merge logic — เดิมข้อนี้เคยเขียนว่า "Cloud
    Function เพิ่ม") ซึ่งยังไม่ได้ออกแบบเพราะรอ resolve ที่ต้นทางก่อนตามกติกาบังคับของ skill นี้ (ห้ามตัดสินใจ
    business rule แทนเอกสารต้นทาง)

## 8. ความสัมพันธ์กับเอกสารอื่น

> **สถานะภาคผนวก Stack Mapping ณ 2026-08-30 — RESOLVED**: ความ stale ของทั้ง 4 จุด (HLA §10,
> `api-spec.md` §6, `database-schema.md` §8, ทุกไฟล์ใน `detailed-design/`) ที่เคยเกิดจากการ
> re-architecture ไป Express+web-first (Cloud Function → Express route, pairing-code mapping, 8→10
> operation) ถูก `architecture-builder`/`api-db-spec-builder`/`detailed-design-builder` sync ครบทุกจุด
> แล้วภายในวันเดียวกัน (2026-08-30) — ดู [index.md](index.md) สำหรับลำดับการ sync แบบละเอียด
>
> **สถานะภาคผนวก Stack Mapping ณ 2026-08-31 (หลังรอบนี้)**: การแก้หัวข้อ 3/4/6.1 รอบนี้ (เพิ่ม Gemini,
> แก้แถว Content Recommendation/Insights & Forecast, เพิ่ม operation `GET /insights/weight-records`)
> ทำให้ภาคผนวกบางจุด**กลายเป็น stale ใหม่เฉพาะจุดที่เกี่ยวข้อง** — ไม่ใช่ทั้ง 4 จุดเหมือนรอบก่อน:
> `detailed-design/02-daily-youtube-recommendation.md` และ `04-smart-integrations.md` **sync ล่วงหน้าไป
> แล้วเมื่อวันเดียวกัน** (ก่อนรอบนี้ — ดู log 2026-08-31) จึงไม่ stale จากรอบนี้ ส่วนที่ยัง stale จริงคือ
> HLA §10 และ `database-schema.md` §8.2/§8.3 (ดูรายละเอียดในแต่ละบูลเลตด้านล่าง)

- [High Level Architecture](high-level-architecture.md) — ที่มาของ Conceptual Component ทั้ง **8 ตัว**
  ที่ map ในหัวข้อ 6.1 — **ภาคผนวก Stack Mapping (§10) แถว "Content Recommendation" ยัง stale หลังรอบนี้**:
  ยังอ้าง "ตรรกะ matching/widen-retry" ที่ไม่มีจริง (โค้ดเป็น single-pass) และไม่มี mapping ของ **Gemini**
  เข้าไปเลย (ต่างจากแถว "Insights & Forecast" ของ HLA §10 ที่ sync ถูกต้องอยู่แล้วว่าเป็น server-side
  คำนวณจริง) ควรรัน `architecture-builder` ต่อเพื่อ sync §10 ให้ตรงกับหัวข้อ 6.1 ฉบับนี้ (mechanical
  re-sync ไม่ใช่ ask-user ตามกติกาของ `architecture-builder` เอง)
- [API Spec](api-spec.md) — ที่มาของ operation ทั้งหมดที่ map เป็น Express route/Client SDK ในหัวข้อ
  6.3/6.3.1 — ภาคผนวก Stack Mapping (§6) sync กับ Express.js/Google Cloud Run ครบแล้ว, operation ใหม่
  `GET /insights/weight-records` (§3.7, 2026-08-31) เข้าเกณฑ์กติกาทั่วไป "CRUD ตรงไปตรงมา → Express route
  handler" ที่ §6 ระบุไว้แล้วโดยไม่ต้องแก้เพิ่ม — **ไม่ stale จากรอบนี้**
- [Database Schema](database-schema.md) — ที่มาของตาราง/logical type ที่ map เป็น Firestore ในหัวข้อ 6.1/
  6.2 — **ภาคผนวก Stack Mapping (§8.2/§8.3) ยัง stale หลังรอบนี้**: 2 ตารางใหม่ `today_recommendation_
  snapshot`/`today_recommendation_rejected_video` (§3.18/§3.19, เพิ่ม 2026-08-31) ยังไม่มีแถว mapping
  เลยในภาคผนวก — เพิ่งยืนยันในหัวข้อ 6.1 ของไฟล์นี้ว่า embed รวมเป็น field เดียว
  `users/{userId}.todaysRecommendation` (`computedFor`/`video`/`rejectedVideoIds`) เข้าเกณฑ์ embed แบบ
  เดียวกับ `weightForecastSnapshot`/`streakSnapshot` — ควรรัน `api-db-spec-builder` ต่อเพื่อเพิ่ม 2 แถวนี้
  เข้า §8.2/§8.3
- [Detailed Design](detailed-design/) — `02-daily-youtube-recommendation.md` และ
  `04-smart-integrations.md` sync ภาคผนวก Stack Mapping ของตัวเองกับ Gemini/server-side forecast ไปแล้ว
  ล่วงหน้าเมื่อ 2026-08-31 (ก่อนรอบนี้ของ `tech-stack.md`) — **ไม่ stale จากรอบนี้** ส่วน
  `01-onboarding-personalization.md` และ `03-planner-logging.md` ไม่มีการเปลี่ยนแปลงที่เกี่ยวข้องกับรอบนี้
- [Product Backlog](../../01-requirements/backlog.md), [Requirement 4 epic + NFR](../../01-requirements/01-spec/index.md)
