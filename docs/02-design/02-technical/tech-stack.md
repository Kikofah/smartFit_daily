# Tech Stack — smartFit_daily

- **ประเภทเอกสาร:** Tech Stack — Concrete/Stack-Specific
- **สถานะเอกสาร:** Draft
- **วันที่สร้าง:** 2026-08-28
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
  Model เต็มรูปแบบ ดูหัวข้อ 5)
- Backend & Database (BaaS provider) → **Supabase** (แนะนำ — เทียบกับ 6 ทางเลือกอื่นด้วย Weighted Scoring
  Model เต็มรูปแบบ ดูหัวข้อ 5)

## 3. Recommended Tech Stack

| องค์ประกอบ | เทคโนโลยีที่เลือก |
|---|---|
| **Mobile/Client** | React Native + Expo (EAS Development Build สำหรับ native module) |
| **Backend/API** | Supabase (PostgREST auto-generated API + Supabase Edge Functions สำหรับ business logic) |
| **Database** | PostgreSQL (managed โดย Supabase) |
| **Authentication** | Supabase Auth — email/password + Google OAuth + Sign in with Apple |
| **Hosting/Infra** | Supabase Cloud (backend + database), Vercel (เว็บ build จาก Expo web export) |
| **Third-party Integration** | YouTube Data API v3, `react-native-health` (Apple HealthKit), `react-native-health-connect` (Google Health Connect), `react-native-ble-plx` (Bluetooth สมาร์ตสเกล) |
| **CI/CD & Dev Tooling** | EAS Build + EAS Submit (มือถือ), GitHub Actions (lint/test), Vercel auto-deploy (เว็บ) |

## 4. เหตุผลการเลือก (Rationale)

- **React Native + Expo**: ทีมถนัด JavaScript/TypeScript อยู่แล้ว (จาก Discovery) — โค้ดฐานเดียวคุมทั้ง
  iOS, Android, และ Web (ผ่าน Expo web export) ตรงกับ Platform targets ที่ต้องการทั้ง 3 แพลตฟอร์ม EAS
  Build ทำให้ build iOS ได้โดยไม่ต้องมีเครื่อง Mac จริง ซึ่งสำคัญเมื่องบจำกัด และ timeline ปานกลาง (3-6
  เดือน) เหมาะกับความเร็วของ Expo มากกว่าการเขียน native 3 codebase แยก
- **Supabase**: `database-schema.md` ถูกออกแบบเป็น relational/logical model ที่มี ER diagram และ
  foreign key ชัดเจนอยู่แล้ว (15 ตาราง) — Supabase สร้างบน PostgreSQL จริง จึง map ตรงจาก schema ที่มี
  อยู่แล้วได้ทันทีโดยไม่ต้อง denormalize ใหม่ (ต่างจาก Firebase ที่ใช้ Firestore แบบ NoSQL) ตรงกับคำตอบ
  Discovery ที่เลือก Backend-as-a-Service และงบจำกัด (Supabase มี free tier ที่ใช้งานได้จริงสำหรับ MVP)
- **Supabase Auth**: มาพร้อม Supabase อยู่แล้ว ลดเวลา dev ตรงกับ timeline ที่จำกัด — Google/Apple OAuth
  ครอบคลุมผู้ใช้ทั้งสองแพลตฟอร์มหลัก
- **Vercel สำหรับเว็บ**: จับคู่กับ Expo web export ได้ตรงไปตรงมา free tier เหมาะกับงบ MVP
- **Client-side calculation ตาม NFR-01/NFR-03**: [Detailed Design](detailed-design/) ระบุชัดว่า TDEE
  (ONB-1), safety floor (ONB-3), MET+wearable override (REC-2), streak walk-back (PLN-4), และ forecast
  (INT-1) ต้องเป็นการคำนวณที่ไม่มี network latency — จึง implement อัลกอริทึมเหล่านี้ใน React Native app
  โดยตรง แล้วส่งผลลัพธ์ที่คำนวณแล้วไปบันทึกผ่าน **Supabase Edge Function** (ไม่ใช่เขียนตรงไปยังตารางผ่าน
  PostgREST) เพื่อให้ Edge Function ทำหน้าที่ validate/บังคับกติกาธุรกิจ (เช่น all-or-nothing, safety
  floor) เป็นเกราะป้องกันชั้นที่สองฝั่ง server ด้วย ไม่ใช่พึ่งพา client ฝ่ายเดียว — ตรงกับที่
  `database-schema.md` § Relationships & Constraints ระบุไว้ว่ากติกาเหล่านี้ "บังคับใช้ไม่ได้ที่ระดับ
  schema" ต้องเป็นหน้าที่ของ application layer
- **PDPA มาตรฐาน (ไม่มี residency เฉพาะ)**: Supabase รองรับการเลือก region ของ database ได้ (เช่น
  Singapore ใกล้ไทยที่สุดในบรรดา region ที่ Supabase มี) และมี Row Level Security (RLS) ในตัวซึ่งช่วย
  บังคับใช้ NFR-04 (เข้ารหัส/แยกสิทธิ์การเข้าถึงข้อมูลต่อผู้ใช้) ได้โดยตรง

## 5. ทางเลือกอื่นที่พิจารณาแล้ว (Alternatives Considered)

> **เพิ่มเติม 2026-08-28**: ขยายจากตารางข้อดี/ข้อเสีย 3 ทางเลือกเดิม เป็น **Weighted Scoring Model**
> (เกณฑ์เชิงปริมาณถ่วงน้ำหนัก) ครอบคลุม ≥5 ทางเลือกต่อจุดตัดสินใจ ตามคำขอให้ทำการวิเคราะห์เชิงเปรียบเทียบที่
> เข้มงวดขึ้นสำหรับใช้เป็นเอกสารประกอบวิชา/โครงงาน — เกณฑ์และน้ำหนัก derive จาก Discovery Questionnaire
> (หัวข้อ 2), NFR-01/03/04/05/06/11, และ `database-schema.md`'s relational model ที่ยืนยันแล้วทั้งหมด
> ไม่ใช่การตัดสินใจใหม่ — **ผลลัพธ์ยืนยันตัวเลือกเดิมทั้งสองจุด (React Native + Expo, Supabase) ไม่มีการ
> เปลี่ยนแปลงคำแนะนำใดๆ ในหัวข้อ 3/4/6**

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
| **React Native + Expo (เลือก)** | ตรงกับทีม JS/TS, ecosystem/community ใหญ่ที่สุด, EAS Build ไม่ต้องมี Mac, ต้นทุนต่ำ | native module (BLE/HealthKit/Health Connect) พึ่ง library บุคคลที่สาม — ความเสี่ยง maintenance (ดูหัวข้อ 7 ข้อ 2) |
| Ionic + Capacitor | ทีมถนัดที่สุด (web tech ล้วน), reuse code สูงสุด, ต้นทุนต่ำ | native BLE/HealthKit integration อ่อนกว่า React Native/Flutter ชัดเจน — เสี่ยงต่อ INT-2/INT-3 โดยตรง |
| Flutter | native module (health/BLE) เสถียร/ดูแลดีกว่าบางตัวใน React Native, performance ดี, reuse สูง | ทีมต้องเรียน Dart ใหม่ทั้งหมด — เสี่ยงกิน timeline 3-6 เดือน |
| Kotlin Multiplatform + Compose Multiplatform | native capability ดีที่สุดในกลุ่ม cross-platform | Compose Multiplatform Web ยังไม่ mature เท่าตัวอื่น, ทีมต้องเรียน Kotlin, community เล็ก |
| Native แยก 3 codebase | native capability เต็มร้อย ไม่มีข้อจำกัดจาก wrapper library | ต้นทุนพัฒนา 3 เท่า ขัดกับงบ/timeline โดยตรง แทบไม่มี code reuse |
| .NET MAUI | enterprise backing จาก Microsoft, native compiled | ทีมไม่มีพื้นฐาน C#/.NET เลย, web story อ่อนกว่ากลุ่มอื่น |

**ผลลัพธ์**: React Native + Expo ชนะชัดเจน (4.40/5) — ยืนยันตัวเลือกเดิม ไม่เปลี่ยนแปลง จุดอ่อนเดียวที่คะแนน
สะท้อนตรงกับ open point เดิมในหัวข้อ 7 ข้อ 2 (HealthKit/Health Connect library maturity)

### Backend & Database — Weighted Scoring Model

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
| **Supabase (เลือก)** | PostgreSQL จริง ตรงกับ relational model ของ `database-schema.md` ทันที, PostgREST auto-generate API ตรงกับ REST convention ของ `api-spec.md` โดยตรง, RLS ตรงกับ NFR-04/06, open-source (ไม่ lock-in) | ecosystem/plugin เล็กกว่า Firebase, ยังใหม่กว่า |
| Custom Node.js/NestJS + PostgreSQL | ทีมถนัดที่สุด, control เต็มที่, ไม่ lock-in | ต้องสร้าง auth/API/RLS-equivalent เองทั้งหมด — กิน timeline มากที่สุดในกลุ่มที่พิจารณา |
| Custom Django + PostgreSQL | security default แข็งแรง, ORM ดีกับ PostgreSQL | ทีมต้องเรียน Python ใหม่ |
| Appwrite | open-source เหมือน Supabase, มี auto-generate API/SDK | database เป็น document-style ไม่ใช่ relational แท้ — ต้องปรับ schema ใหม่ |
| PocketBase | เริ่มได้เร็วที่สุด, ฟรีเกือบเต็ม (single binary self-host) | SQLite ไม่เหมาะ production ที่มี concurrent write ทุกวัน, security/encryption ต้อง implement เอง |
| Firebase | Ecosystem/community ใหญ่ที่สุด เอกสารเยอะ | ใช้ Firestore (NoSQL) ต้องออกแบบ schema ใหม่ทั้งหมดจาก relational model ที่มีอยู่แล้ว เสี่ยง denormalize ข้อมูลซับซ้อน (15 ตารางที่มี FK ชัดเจน), vendor lock-in สูงสุด |
| AWS Amplify | ยืดหยุ่น scale ได้ดีมากในระยะยาว, enterprise-grade | Setup/learning curve สูงกว่า, ทีมไม่มีพื้นฐาน AWS, billing คาดเดายากสำหรับทีมเล็ก — ไม่เหมาะกับงบ MVP จำกัด+timeline 3-6 เดือน |

**ผลลัพธ์**: Supabase ชนะชัดเจนที่สุด (4.65/5) — ยืนยันตัวเลือกเดิม ไม่เปลี่ยนแปลง คู่แข่งอันดับ 2 คือ Custom
Node.js/NestJS + PostgreSQL (3.80) หากทีมต้องการ control เต็มที่และยอมแลกกับเวลาพัฒนาที่นานขึ้น

## 6. Mapping จาก Conceptual Docs → Concrete Stack

### 6.1 HLA's Conceptual Component → Supabase Implementation

| Conceptual Component (HLA §3) | Concrete Implementation |
|---|---|
| Personalization & Profile | ตาราง `user_profile`/`goal_selection`/`equipment_selection` + RLS policy ต่อผู้ใช้ + Edge Function `profile-update` (validate safety floor, equipment mutual exclusion) — คำนวณ TDEE/target kcal ที่ฝั่ง client ก่อนส่ง |
| Content Recommendation | Edge Function `recommendation` เรียก YouTube Data API v3 + ตรรกะ matching/widen-retry |
| Exertion & Calorie Calculation | คำนวณ MET ที่ client (React Native) ตาม NFR-01/03 → Edge Function `session-complete` validate + เขียน `actual_calorie_burn` |
| Planner & Day-Status | ตาราง `weekly_plan_entry`/`day_status` + Postgres view คำนวณ read-only flag + Edge Function `cheat-rest` (nested check ตาม Detailed Design) |
| Logging & Streak | ตาราง `daily_log`/`streak_snapshot` + Postgres function หรือ Edge Function สำหรับ recompute streak หลังทุกครั้งที่ log เปลี่ยน |
| Insights & Forecast | ตาราง `weight_forecast_snapshot` + Edge Function `forecast` คำนวณจากประวัติ `daily_log`/`weight_record` |
| Integration Gateway | Edge Function `integrations` orchestrate การเชื่อมต่อ + native module ฝั่ง client (`react-native-health`, `react-native-health-connect`, `react-native-ble-plx`) |

### 6.2 `database-schema.md`'s Logical Type → PostgreSQL Type

| Logical Type | PostgreSQL Type |
|---|---|
| `identifier` | `uuid` (default `gen_random_uuid()`) |
| `string` | `text` |
| `integer` | `integer` |
| `decimal` | `numeric` |
| `boolean` | `boolean` |
| `date` | `date` |
| `datetime` | `timestamptz` |
| `enum` | PostgreSQL native `enum` type (เช่น `workout_session_status`, `connection_status`) |

### 6.3 `api-spec.md`'s REST Convention → Supabase Routing

- **Operation ที่เป็น CRUD ตรงไปตรงมา** (เช่น `GET /profile`, `GET /logs`, `GET /logs/{date}`) → ใช้
  **PostgREST auto-generated API** ของ Supabase โดยตรง (มี RLS policy คุมสิทธิ์ต่อผู้ใช้)
- **Operation ที่มี business logic/validation/เรียก external API** (เช่น `PUT /profile/goal`,
  `GET /workouts/today/recommendation`, `POST /workouts/sessions/{sessionId}/complete`,
  `POST /planner/days/{date}/cheat-rest`, ทุก endpoint ใต้ `/integrations/*`) → implement เป็น
  **Supabase Edge Function** (Deno/TypeScript) โดยคง HTTP verb + resource path เดิมตามที่ `api-spec.md`
  กำหนดไว้เป็น convention การตั้งชื่อ route

## 7. จุดที่ยังไม่ได้ตัดสินใจ / ควรยืนยันเพิ่มเติม

1. **Supabase region**: ยังไม่ได้เลือก region ที่แน่นอน (เช่น Singapore) — ควรยืนยันก่อนเริ่ม provision
   จริง โดยเฉพาะถ้ามีข้อกำหนด PDPA ที่ชัดเจนขึ้นภายหลัง
2. **HealthKit/Health Connect library ที่แน่นอน**: `react-native-health`/`react-native-health-connect`
   เป็นตัวเลือกที่นิยม แต่ยังไม่ได้ประเมิน maintenance status ล่าสุดหรือเทียบกับการเขียน custom native
   module เอง
3. **Web app scope — RESOLVED (2026-08-28)**: เดิมคือ "Expo web export ครอบคลุมทุก feature เท่ากับ
   mobile หรือไม่" ปัจจุบัน resolve แล้ว: **core loop parity เต็มทุกแพลตฟอร์ม + Epic 4 (INT-1/INT-2/
   INT-3) เป็น mobile-only โดยตั้งใจ** เว็บแสดงข้อความ "ไม่รองรับ" อย่างสงบแทน (fallback ตาม NFR-07) — ไม่
   กระทบตัวเลือก stack ใดๆ ในเอกสารนี้ (ยังเป็น React Native + Expo + Supabase เหมือนเดิม) เป็นเพียงการ
   ยืนยันขอบเขต feature บน platform ไม่ใช่การเปลี่ยนเทคโนโลยี — บันทึกอย่างเป็นทางการไว้ที่
   [high-level-architecture.md §6.2/§6.3](high-level-architecture.md) ไม่ใช่ decision ใหม่ของเอกสารนี้
4. **สอดคล้องกับ Open Points เดิมของ conceptual docs**: ค่า Activity Factor/MET lookup table จริง,
   ตัวเลข tolerance ของ REC-1, จำนวนวัน log ขั้นต่ำของ INT-1 ฯลฯ ยังไม่ resolve — ต้องแก้ที่ต้นทาง
   (`01-spec/`) ก่อน ไม่ใช่ตัดสินใจในเอกสารนี้

## 8. ความสัมพันธ์กับเอกสารอื่น

- [High Level Architecture](high-level-architecture.md) — ที่มาของ Conceptual Component ทั้ง 7 ตัวที่
  map ในหัวข้อ 6.1
- [API Spec](api-spec.md) — ที่มาของ operation ทั้งหมดที่ map เป็น PostgREST/Edge Function ในหัวข้อ 6.3
- [Database Schema](database-schema.md) — ที่มาของตาราง/logical type ทั้งหมดที่ map เป็น PostgreSQL
  ในหัวข้อ 6.2
- [Detailed Design](detailed-design/) — ที่มาของ NFR-01/03 client-side computation ที่กำหนดการแบ่งงาน
  ระหว่าง React Native app กับ Supabase Edge Function
- [Product Backlog](../../01-requirements/backlog.md), [Requirement 4 epic + NFR](../../01-requirements/01-spec/index.md)
