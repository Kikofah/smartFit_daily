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
- Mobile/Client framework → **React Native + Expo** (แนะนำ, เทียบกับ Flutter และ Native+เว็บแยก)
- Backend & Database (BaaS provider) → **Supabase** (แนะนำ, เทียบกับ Firebase และ AWS Amplify)

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

### Mobile/Client Framework

| ทางเลือก | ข้อดี | ข้อเสีย | เลือกหรือไม่ |
|---|---|---|---|
| **React Native + Expo** | ตรงกับทีม JS/TS, โค้ดเดียวคุม 3 แพลตฟอร์ม, EAS Build ไม่ต้องมี Mac, ระบบนิเวศ library ใหญ่ | native module (HealthKit/Health Connect/BLE) ต้องพึ่ง library ภายนอกหรือเขียน custom native module เอง, ต้องใช้ EAS Development Build แทน Expo Go | **เลือก** |
| Flutter | Performance/UI ดีมาก โค้ดเดียวคุม 3 แพลตฟอร์มเช่นกัน | ใช้ภาษา Dart ที่ทีมไม่มีพื้นฐานมาก่อน เพิ่ม learning curve ที่ขัดกับ timeline 3-6 เดือน | ไม่เลือก |
| Native (Swift + Kotlin) + เว็บแยก | เข้าถึง native capability ได้เต็มที่ไม่ต้องพึ่ง wrapper library | ต้องเขียน 3 codebase แยกกัน (iOS/Android/Web) ใช้เวลาและงบมากกว่ามาก ขัดกับงบจำกัด+ทีม JS/TS | ไม่เลือก |

### Backend & Database (BaaS provider)

| ทางเลือก | ข้อดี | ข้อเสีย | เลือกหรือไม่ |
|---|---|---|---|
| **Supabase** | PostgreSQL จริง ตรงกับ relational model ของ `database-schema.md` ทันที, มี Auth/Storage/ Realtime/Edge Functions ในตัว, open-source | ecosystem/plugin เล็กกว่า Firebase | **เลือก** |
| Firebase | Ecosystem/community ใหญ่ที่สุด เอกสารเยอะ | ใช้ Firestore (NoSQL) ต้องออกแบบ schema ใหม่ทั้งหมดจาก relational model ที่มีอยู่แล้ว เสี่ยง denormalize ข้อมูลซับซ้อน (เช่น ความสัมพันธ์ 15 ตารางที่มี FK ชัดเจน) | ไม่เลือก |
| AWS Amplify | ยืดหยุ่น scale ได้ดีมากในระยะยาว | Setup/learning curve สูงกว่า ไม่เหมาะกับงบ MVP จำกัด+timeline 3-6 เดือน | ไม่เลือก |

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
