# Tech Stack — smartFit_daily

- **ประเภทเอกสาร:** Tech Stack — Concrete/Stack-Specific
- **สถานะเอกสาร:** Draft
- **วันที่สร้าง:** 2026-08-28
- **อัปเดตล่าสุด:** 2026-08-29 — เปลี่ยน Database/Backend/Authentication/Hosting เป็น Firebase ตามคำขอ
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

## 3. Recommended Tech Stack

| องค์ประกอบ                  | เทคโนโลยีที่เลือก                                                                                                                                                  |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Mobile/Client**           | React Native + Expo (EAS Development Build สำหรับ native module)                                                                                                   |
| **Backend/API**             | Firebase Cloud Functions (Node.js/TypeScript) — HTTPS Functions + Callable Functions สำหรับ business logic |
| **Database**                | Cloud Firestore (NoSQL document database, managed โดย Firebase) |
| **Authentication**          | Firebase Authentication — email/password + Google OAuth + Sign in with Apple |
| **Hosting/Infra**           | Firebase Hosting (เว็บที่ build จาก Expo web export) + Firebase/Google Cloud (Cloud Functions + Firestore) |
| **Third-party Integration** | YouTube Data API v3, `react-native-health` (Apple HealthKit), `react-native-health-connect` (Google Health Connect), `react-native-ble-plx` (Bluetooth สมาร์ตสเกล) |
| **CI/CD & Dev Tooling**     | EAS Build + EAS Submit (มือถือ), GitHub Actions (lint/test), Firebase CLI deploy (Cloud Functions/Hosting/Firestore Security Rules)                                |

## 4. เหตุผลการเลือก (Rationale)

- **React Native + Expo**: ทีมถนัด JavaScript/TypeScript อยู่แล้ว (จาก Discovery) — โค้ดฐานเดียวคุมทั้ง
  iOS, Android, และ Web (ผ่าน Expo web export) ตรงกับ Platform targets ที่ต้องการทั้ง 3 แพลตฟอร์ม EAS
  Build ทำให้ build iOS ได้โดยไม่ต้องมีเครื่อง Mac จริง ซึ่งสำคัญเมื่องบจำกัด และ timeline ปานกลาง (3-6
  เดือน) เหมาะกับความเร็วของ Expo มากกว่าการเขียน native 3 codebase แยก — **ไม่ได้รับผลกระทบจากการเปลี่ยน
  Backend/Database ในหัวข้อนี้**
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
- **Firebase Cloud Functions (แทนที่ Supabase Edge Function)**: เป็น serverless compute ของ Firebase
  ที่ทำหน้าที่เดียวกับ Supabase Edge Function เดิม — รับผลการคำนวณจาก client แล้ว validate/บังคับกติกา
  ธุรกิจก่อนเขียนลง Firestore เป็นเกราะป้องกันชั้นที่สองฝั่ง server เหมือนเดิม ต่างกันที่ Firestore ไม่มี
  PostgREST auto-generated API มาให้ฟรีเหมือน Supabase จึงต้องเขียน Cloud Function ครอบคลุมทุก operation
  เอง แม้แต่ CRUD ธรรมดา (ดูหัวข้อ 6.3 และหัวข้อ 7 ข้อ 6 เรื่อง cost)
- **Firebase Hosting**: จับคู่กับ Expo web export ได้ตรงไปตรงมาเหมือน Vercel เดิม แต่รวมอยู่ใน billing/
  console เดียวกับ Cloud Functions และ Firestore ตรงกับการตัดสินใจ "ย้ายทั้งระบบไป Firebase ecosystem"
  ลดความซับซ้อนจากการดูแล 2 ผู้ให้บริการ (Supabase + Vercel) เหลือผู้ให้บริการเดียว
- **Client-side calculation ตาม NFR-01/NFR-03**: [Detailed Design](detailed-design/) ระบุชัดว่า TDEE
  (ONB-1), safety floor (ONB-3), MET+wearable override (REC-2), streak walk-back (PLN-4), และ forecast
  (INT-1) ต้องเป็นการคำนวณที่ไม่มี network latency — จึง implement อัลกอริทึมเหล่านี้ใน React Native app
  โดยตรงเหมือนเดิม แล้วส่งผลลัพธ์ที่คำนวณแล้วไปบันทึกผ่าน **Firebase Cloud Function** (แทนที่ Supabase Edge
  Function เดิม) เพื่อให้ Cloud Function ทำหน้าที่ validate/บังคับกติกาธุรกิจเป็นเกราะป้องกันชั้นที่สองฝั่ง
  server ด้วย ไม่ใช่พึ่งพา client ฝ่ายเดียว
- **PDPA มาตรฐาน (ไม่มี residency เฉพาะ)**: Firebase/Google Cloud รองรับการเลือก region ของ Cloud
  Functions และ Firestore ได้ (เช่น `asia-southeast1` — สิงคโปร์ ใกล้ไทยที่สุดในบรรดา region หลักที่
  Firebase มี) และมี **Firestore Security Rules** ทดแทน Row Level Security (RLS) ของ Supabase เดิม เพื่อ
  บังคับใช้ NFR-04 (แยกสิทธิ์การเข้าถึงข้อมูลต่อผู้ใช้) — ต้องออกแบบ rule set ใหม่ให้เทียบเท่า RLS เดิม
  (ยังไม่ได้เขียนจริง ดูหัวข้อ 7 ข้อ 2)

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

### 6.1 HLA's Conceptual Component → Firebase Implementation

> รายละเอียด per-table/collection ด้านล่าง sync ตรงจาก [`database-schema.md` §8.2/§8.3](database-schema.md#82-table--firestore-collectiondocument-mapping)
> (2026-08-29, แนวทาง Hybrid) — เกณฑ์ embed vs. subcollection: ข้อมูล **bounded** (ขอบเขตจำนวนจำกัดชัดเจน),
> ความสัมพันธ์ 1:1/multi-select เล็กกับผู้ใช้หรือเซสชันเดียว, และไม่มี pattern query อิสระ → **embed**
> ในเอกสารแม่; ข้อมูล **unbounded** (สะสมทุกวัน/ทุกเซสชัน) หรือต้อง query/pagination อิสระ →
> **subcollection แยก** (ป้องกัน document โตเกินขีดจำกัดขนาดของ Firestore ด้วย)

| Conceptual Component (HLA §3) | Concrete Implementation |
|---|---|
| Personalization & Profile | Top-level collection `users`, document ID = Firebase Auth UID (`users/{userId}`) — field `age`/`sex`/`weightKg`/`heightCm`/`activityLevel`/`tdeeKcal` อยู่ในตัว document โดยตรง; embedded map field `goalSelection` (`goalType`/`targetWeightKg`/`dailyCalorieTargetKcal`/`isSafetyFloorApplied`) และ embedded array field `equipmentTypes: string[]` (สูงสุด 3 ค่าตาม ONB-2) อยู่ใน document เดียวกัน (bounded, 1:1/multi-select เล็ก ไม่มี pattern query แยก) + Firestore Security Rule จำกัดสิทธิ์ต่อผู้ใช้ (`request.auth.uid == userId`) + Cloud Function `profileUpdate` enforce equipment mutual exclusion และ safety floor (`goalSelection.dailyCalorieTargetKcal` ≥ 1,200–1,500 kcal) — ยังไม่ยืนยันว่า operation `PUT /profile/goal` ใช้ฟังก์ชันเดียวกับ `profileUpdate` หรือแยกต่างหาก — คำนวณ TDEE/target kcal ที่ฝั่ง client ก่อนส่งเหมือนเดิม |
| Content Recommendation | Cloud Function `recommendation` (Callable) เรียก YouTube Data API v3 + ตรรกะ matching/widen-retry — สร้าง document `users/{userId}/workoutSessions/{sessionId}` พร้อม embedded array field `sessionVideos: []` (1-3 รายการ หลัก+วอร์มอัพ/คูลดาวน์ ตาม REC-1/REC-4 เขียนครั้งเดียวตอนสร้าง session, bounded ไม่มี pattern query แยก); ระหว่างสลับวิดีโอ (REC-3) อัปเดต embedded array field `rejectedVideoIds: []` (แต่ละรายการเป็น map `{externalVideoId, rejectedAt}`) ใน document เดียวกัน เพื่อกันแนะนำวิดีโอซ้ำในเซสชันเดียวกัน |
| Exertion & Calorie Calculation | คำนวณ MET ที่ client (React Native) ตาม NFR-01/03 → Cloud Function `sessionComplete` validate แล้วเขียน embedded map field `actualCalorieBurn` (`source`/`metValue`/`calculatedKcal`) ลงใน document `workoutSessions/{sessionId}` เดียวกัน (1:1 กับ session ไม่มี pattern query อิสระ); ค่าจาก wearable (INT-3) เก็บเป็น embedded map field `wearableReading` (`platform`/`calorieValueKcal`/`recordedAt`) ใน document เดียวกัน เขียนได้ทั้งก่อน/หลัง `sessionComplete` ตามลำดับที่ INT-3 มาถึงจริง — ถ้ามาถึงก่อน complete ให้ `sessionComplete` อ่านมาใช้แทนค่าประมาณ MET; ทุก operation ที่รับ `sessionId` จาก client (เช่น `POST /integrations/wearable/readings`) ต้อง `get()` ยืนยันว่า document นั้นมีอยู่จริงและเป็นของผู้ใช้คนเดียวกันก่อนเขียนเสมอ (**referential existence validation** — กติกาใหม่จาก NFR-12/`database-schema.md` §8.3 เพราะ Firestore ไม่มี FK เลย) |
| Planner & Day-Status | Subcollection `users/{userId}/weeklyPlanEntries/{date}` และ `users/{userId}/dayStatus/{date}` (document ID = ISO date เช่น `2026-08-31` ทั้งคู่ — unbounded สะสมทุกสัปดาห์/ทุกวัน) ใช้ document ID ตรงกับ `dailyLogs/{date}` (ดู Logging & Streak) เพื่ออ่าน 3 เอกสารของวันเดียวกันด้วย `get()` ตรงได้เร็วโดยไม่ต้อง query แยก (รองรับ NFR-01); Cloud Function ที่รับ `PUT /planner/days/{date}` อ่าน `dailyLogs/{date}` ก่อนเสมอเพื่อคำนวณ read-only flag (`plan_date < วันนี้ AND มี daily_log ของวันเดียวกัน` — แทน Postgres view เดิม) ก่อนอนุญาตเขียน `weeklyPlanEntries/{date}`; Cloud Function `cheatRest` อ่าน `dailyLogs/{date}` ก่อนเขียน `dayStatus/{date}` เพื่อ enforce กติกา "วันนี้เท่านั้น" (ทับ log ที่มีอยู่แล้วได้เฉพาะ `status_date` = วันนี้) |
| Logging & Streak | Subcollection `users/{userId}/dailyLogs/{date}` (document ID = ISO date — unbounded, pattern การ query ช่วงวันที่บ่อยที่สุดในระบบ) + embedded map field `streakSnapshot` (`currentStreakDays`/`computedAt`) ภายใน `users/{userId}` (1:1 อ่านพร้อม Dashboard ทุกครั้งตาม NFR-01); all-or-nothing (`completionStatus` ต้อง 100% เท่านั้น ไม่มีค่ากลาง) enforce ที่ Cloud Function ที่เขียน `dailyLogs/{date}` (ต่อจาก `sessionComplete`/`cheatRest`) เพราะ Firestore ไม่มี CHECK constraint; Cloud Function ที่ trigger จาก Firestore `onWrite` ของ `dailyLogs/{date}`/`dayStatus/{date}` recompute `streakSnapshot` ใหม่ทุกครั้งที่ต้นทางเปลี่ยน |
| Insights & Forecast | Subcollection `users/{userId}/weightRecords/{recordId}` (unbounded ทุกครั้งที่ชั่ง/กรอกเอง ต้อง query ช่วงเวลา) + embedded map field `weightForecastSnapshot` (`forecastedGoalDate`/`averageDailyDeficitKcal`/`computedAt`) ภายใน `users/{userId}` (1:1 อ่านพร้อมหน้า Insights) — Cloud Function `forecast` คำนวณจากประวัติ `dailyLogs`/`weightRecords` แล้วเขียนทับ `weightForecastSnapshot` |
| Integration Gateway | Embedded map field `integrationConnections: { smartScale: {...}, wearable: {...} }` ภายใน `users/{userId}` (bounded — 2 ประเภทตายตัวตาม INT-2/INT-3 ของ backlog ปัจจุบัน อ่านพร้อมโปรไฟล์เพื่อตัดสิน UI ปุ่มเชื่อมต่อ/ตัดการเชื่อมต่อ) — Cloud Function `integrations` orchestrate การเชื่อมต่อ + native module ฝั่ง client (`react-native-health`, `react-native-health-connect`, `react-native-ble-plx`) — ไม่เปลี่ยนจากเดิม |

⚠️ **Referential existence validation เป็นกติกา cross-cutting** ไม่ได้ผูกกับ Component เดียว — ทุก Cloud
Function ที่รับ id อ้างอิงจาก client (เช่น `sessionId`, `userId` ที่ embed อยู่ใน path) ต้อง `get()` ยืนยันว่า
document ปลายทางมีอยู่จริงและเป็นของผู้ใช้คนเดียวกันก่อนเขียนเสมอ — เจ้าของการ enforce คือ Cloud Function
ของแต่ละ operation นั้นเอง (ดู [`database-schema.md` §8.3](database-schema.md#83-fk--constraint-enforcement-migration-ย้ายจาก-schema-level-ไป-cloud-function)
แถวสุดท้าย และ NFR-12)

### 6.2 `database-schema.md`'s Logical Type → Firestore Field Type

| Logical Type | Firestore Field Type |
|---|---|
| `identifier` | auto-generated document ID (string) หรือ string field ที่เก็บ reference ไปยัง document อื่น (Firestore ไม่มี FK จริง — ต้อง validate ความถูกต้องที่ Cloud Function) |
| `string` | `string` |
| `integer` | `number` (Firestore เก็บเป็น number เดียว ไม่แยก int/float — ต้อง validate ขอบเขต/ทศนิยมที่ Cloud Function) |
| `decimal` | `number` |
| `boolean` | `boolean` |
| `date` | `Timestamp` (ตั้งเวลาเป็นเที่ยงคืนของวันนั้น) หรือ `string` รูปแบบ ISO-8601 |
| `datetime` | `Timestamp` |
| `enum` | `string` ที่ validate ค่าที่อนุญาตไว้ใน Cloud Function (Firestore ไม่มี native enum/check constraint เหมือน PostgreSQL) |

⚠️ ตารางนี้เป็น mapping ระดับ field type เท่านั้น — โครงสร้าง collection/document จริงที่ denormalize จาก
15 ตาราง relational เดิม (รวมการแปลง FK เป็น reference field หรือ embedded document) ยังไม่ถูกออกแบบอย่าง
เป็นทางการ ต้องให้ `api-db-spec-builder` ทำต่อ

### 6.3 `api-spec.md`'s REST Convention → Firebase Cloud Functions Routing

- **Operation ที่เป็น CRUD ตรงไปตรงมา** (เช่น `GET /profile`, `GET /logs`, `GET /logs/{date}`) — Firestore
  **ไม่มี auto-generated REST API แบบ PostgREST** จึงต้องเขียนเป็น **Cloud Function (Callable Function)**
  เองทุก operation แม้เป็น CRUD ธรรมดา โดย map 1:1 กับ resource path เดิมของ `api-spec.md` เป็น function
  name/route convention (เพิ่มปริมาณงาน dev เทียบกับ Supabase เดิมที่ auto-generate ให้ฟรี — ดูหัวข้อ 7
  ข้อ 6)
- **Operation ที่มี business logic/validation/เรียก external API** (เช่น `PUT /profile/goal`,
  `GET /workouts/today/recommendation`, `POST /workouts/sessions/{sessionId}/complete`,
  `POST /planner/days/{date}/cheat-rest`, ทุก endpoint ใต้ `/integrations/*`) → implement เป็น
  **Cloud Function (HTTPS Function หรือ Callable Function)** โดยคง HTTP verb + resource path เดิมตามที่
  `api-spec.md` กำหนดไว้เป็น convention การตั้งชื่อ

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
5. **Web app scope — RESOLVED (2026-08-28)**: เดิมคือ "Expo web export ครอบคลุมทุก feature เท่ากับ
   mobile หรือไม่" ปัจจุบัน resolve แล้ว: **core loop parity เต็มทุกแพลตฟอร์ม + Epic 4 (INT-1/INT-2/
   INT-3) เป็น mobile-only โดยตั้งใจ** เว็บแสดงข้อความ "ไม่รองรับ" อย่างสงบแทน (fallback ตาม NFR-07) — ไม่
   กระทบจากการเปลี่ยน Backend/Database เป็น Firebase ในหัวข้อนี้ — บันทึกอย่างเป็นทางการไว้ที่
   [high-level-architecture.md §6.2/§6.3](high-level-architecture.md)
6. **Cost projection ของ Firebase (ใหม่ 2026-08-29)**: Firebase คิดค่าใช้จ่ายแบบ pay-per-read/write/
   invocation (Firestore) และ per-invocation (Cloud Functions) ต่างจาก Supabase ที่เป็น fixed tier —
   ยังไม่มีการประเมิน cost projection ที่ scale การใช้งานจริง (เช่น จำนวน daily active user ที่คาดหวัง)
   ควรทำก่อน launch เพื่อไม่ให้งบ MVP เกินคาด
7. **สอดคล้องกับ Open Points เดิมของ conceptual docs**: ค่า Activity Factor/MET lookup table จริง,
   ตัวเลข tolerance ของ REC-1, จำนวนวัน log ขั้นต่ำของ INT-1 ฯลฯ ยังไม่ resolve — ต้องแก้ที่ต้นทาง
   (`01-spec/`) ก่อน ไม่ใช่ตัดสินใจในเอกสารนี้

## 8. ความสัมพันธ์กับเอกสารอื่น

- [High Level Architecture](high-level-architecture.md) — ที่มาของ Conceptual Component ทั้ง 7 ตัวที่
  map ในหัวข้อ 6.1 — **ภาคผนวก Stack Mapping (หัวข้อ 10) ของไฟล์นี้ sync กับหัวข้อ 6.1 ฉบับ Firebase แล้ว**
  (อัปเดตโดย `architecture-builder` เมื่อ 2026-08-29 — ดู `docs/05-log/20260829-log.md`) ไม่มีงานค้าง
- [API Spec](api-spec.md) — ที่มาของ operation ทั้งหมดที่ map เป็น Cloud Function ในหัวข้อ 6.3 —
  **ภาคผนวก Stack Mapping (หัวข้อ 6) ของไฟล์นี้ sync กับหัวข้อ 6.3 ฉบับ Firebase แล้ว** (อัปเดตโดย
  `api-db-spec-builder` เมื่อ 2026-08-29) ไม่มีงานค้าง
- [Database Schema](database-schema.md) — ที่มาของตาราง/logical type เดิมที่ map เป็น Firestore ในหัวข้อ
  6.2 — **ภาคผนวกหัวข้อ 8 เสร็จสมบูรณ์แล้วในแนวทาง Hybrid** ที่ยืนยันจากผู้ใช้ (2026-08-29): 8.1 (logical
  type → Firestore field type), 8.2 (per-table → Firestore collection/document mapping ครบ 15 ตาราง),
  8.3 (FK/constraint enforcement migration ไป Cloud Function) — เนื้อหาหลักหัวข้อ 1-7 ยังคงเป็น
  logical/relational model + ER Diagram เดิมทั้งหมดตามกติกาบังคับของ `api-db-spec-builder` (ดูหัวข้อ 7
  ข้อ 1 ด้านบน) ไม่มีงานค้าง
- [Detailed Design](detailed-design/) — ที่มาของ NFR-01/03 client-side computation ที่กำหนดการแบ่งงาน
  ระหว่าง React Native app กับ Firebase Cloud Function — **ภาคผนวก Stack Mapping ของทั้ง 4 ไฟล์ epic sync
  กับหัวข้อ 6.1/6.3 ฉบับ Firebase แล้ว** (อัปเดตโดย `detailed-design-builder` เมื่อ 2026-08-29, ใช้ชื่อ
  Cloud Function เดียวกับหัวข้อ 6.1: `profileUpdate`/`sessionComplete`/`cheatRest`/`recommendation`/
  `forecast`/`integrations`) ไม่มีงานค้าง
- [Product Backlog](../../01-requirements/backlog.md), [Requirement 4 epic + NFR](../../01-requirements/01-spec/index.md)
