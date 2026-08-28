# API Spec (Conceptual) — smartFit_daily

- **ประเภทเอกสาร:** API Spec — Conceptual, REST-style convention (ไม่ผูก technical stack)
- **สถานะเอกสาร:** Draft
- **วันที่สร้าง:** 2026-08-28
- **สร้างโดย:** skill `api-db-spec-builder`
- **อ้างอิงจาก:** [High Level Architecture](high-level-architecture.md),
  [Product Backlog](../../01-requirements/backlog.md),
  [Requirement ทั้ง 4 epic + NFR](../../01-requirements/01-spec/index.md)

## 1. ขอบเขตและหลักการ (Scope & Principles)

เอกสารนี้เจาะจงกว่า [High Level Architecture](high-level-architecture.md) หนึ่งระดับ — ยังคง**ไม่ผูก
technical stack** (ไม่มีชื่อ framework/library, cloud provider, ภาษาโปรแกรม) **ยกเว้น 1 ข้อที่ยืนยันแล้ว**:
ใช้ **REST-style convention** (HTTP verb + resource path เชิงแนวคิด + status code) เป็นภาษากลาง เพราะเป็น
มาตรฐานสากลที่ไม่ผูกกับ framework ใดๆ ไม่ใช่การเลือก stack ของทีม — เอกสารนี้**ไม่มี** actual domain/base
URL, ไม่มี route syntax เฉพาะ framework, และไม่ระบุ auth mechanism เฉพาะเจาะจง (ใช้คำกลาง "ต้องยืนยันตัวตน
ผู้ใช้ก่อนเรียก" แทน)

ทุก operation ในเอกสารนี้ต้อง trace กลับไปยัง **Conceptual Component** ของ HLA ได้เสมอ (ดูหัวข้อ 3 ของ
HLA) และทุก payload ต้องอ้างอิงชื่อ **Conceptual Data Entity** ของ HLA (ดูหัวข้อ 5 ของ HLA) — ไม่มี
operation ใดที่ไม่มี component รองรับ

## 2. Conventions

- **Resource path**: เขียนแบบ noun/plural (`/profile`, `/workouts/sessions`, `/planner/days/{date}`) —
  `{date}` เป็น path parameter รูปแบบ ISO date เชิงแนวคิด (ไม่ระบุ format string เฉพาะ)
- **HTTP verb**: `GET` = อ่าน, `POST` = สร้าง/สั่งการที่มีผลข้างเคียง (เช่น "sync", "complete"),
  `PUT` = กำหนดค่าทั้งหมดของ sub-resource แบบ idempotent (ใช้กับ onboarding steps เพราะเป็นการ "ตั้งค่า
  ปัจจุบัน" ไม่ใช่สร้างรายการใหม่ซ้ำ), `DELETE` = ยกเลิก/ตัดการเชื่อมต่อ
- **Response envelope (เชิงแนวคิด)**: response ที่สำเร็จคืนค่า resource โดยตรง (ไม่มี wrapper เพิ่ม)
  response ที่ error ต้องมีอย่างน้อย `error.code` (เชิงแนวคิด ไม่ใช่ string ตายตัว) และ `error.message`
  ที่มนุษย์อ่านได้
- **Status code ที่ใช้**: `200` สำเร็จ (อ่าน/อัปเดต), `201` สร้างสำเร็จ, `204` สำเร็จไม่มีเนื้อหาตอบกลับ,
  `400` ข้อมูล request ไม่ถูกต้อง (เช่น validation error ของ REQ-01), `401` ยังไม่ยืนยันตัวตน, `404` ไม่พบ
  resource, `409` conflict กับกติกาธุรกิจ (เช่น พยายามแก้วันที่เป็น read-only ของ PLN-1), `422` ข้อมูลถูก
  ต้องตามรูปแบบแต่ขัดกติกาธุรกิจ (เช่น พยายามตั้ง Cheat/Rest Day ย้อนหลังเกินวันนี้ตาม PLN-2)
- **Authentication (เชิงแนวคิด)**: ทุก endpointในเอกสารนี้ต้อง "ยืนยันตัวตนผู้ใช้ก่อนเรียก" เสมอ (ไม่ระบุ
  กลไก) ยกเว้นจะระบุไว้เป็นอื่นในตัว operation เอง — ไม่มี endpoint ใดในเอกสารนี้ที่ยกเว้น

## 3. API Resources & Operations

### 3.1 Personalization & Profile

| Operation | Verb + Path | Feature/REQ | Request (เชิงแนวคิด) | Response (เชิงแนวคิด) | Error/Edge Case | NFR |
|---|---|---|---|---|---|---|
| ดูโปรไฟล์ปัจจุบัน | `GET /profile` | — | — | User Profile + Equipment Profile + Goal Selection (ถ้ามี) | `404` ถ้ายังไม่เคยทำ ONB-1 เลย | NFR-04 (ข้อมูลสุขภาพ) |
| ตั้ง/แก้ข้อมูลส่วนตัว | `PUT /profile/personal-info` | ONB-1/REQ-01 | อายุ, เพศ, น้ำหนัก, ส่วนสูง, ระดับกิจกรรม | User Profile พร้อม TDEE ที่คำนวณใหม่ | `400` ค่าติดลบ/นอกช่วงที่สมเหตุสมผล | NFR-01 (คำนวณ client-side ไม่มี latency), NFR-04 |
| ตั้ง/แก้อุปกรณ์ที่มี | `PUT /profile/equipment` | ONB-2/REQ-03 | รายการอุปกรณ์ที่เลือก (multi-select: ไม่มี/ดัมเบล/ยิมครบชุด) | Equipment Profile ที่บันทึกแล้ว | `400` เลือก "ไม่มีอุปกรณ์" พร้อมตัวอื่น (mutual exclusion ตาม decision ที่ resolve แล้ว) | — |
| ตั้ง/แก้เป้าหมายหลัก | `PUT /profile/goal` | ONB-3/REQ-02 | ประเภทเป้าหมาย, น้ำหนักเป้าหมาย (บังคับเมื่อ "ลดน้ำหนัก") | Goal Selection พร้อมเป้าหมายแคลอรี่รายวันหลังปรับ safety floor | `400` ขาดน้ำหนักเป้าหมายตอนเลือก "ลดน้ำหนัก" | — |

### 3.2 Content Recommendation

| Operation | Verb + Path | Feature/REQ | Request | Response | Error/Edge Case | NFR |
|---|---|---|---|---|---|---|
| ดูวิดีโอแนะนำวันนี้ | `GET /workouts/today/recommendation` | REC-1, REC-4/REQ-04, REQ-07 | — | Video/Workout Content ที่จับคู่ (รวม warmup/cooldown ถ้าความเข้มข้นสูง) พร้อมเป้าหมายแคลอรี่วันนี้ | `204` ถ้าวันนี้เป็น Cheat/Rest Day (ไม่มีวิดีโอแนะนำ) | NFR-01 (ต้องไม่มี latency ที่สังเกตได้) |
| เปลี่ยนวิดีโอ | `POST /workouts/today/recommendation/swap` | REC-3/REQ-06 | id ของวิดีโอที่เพิ่งถูกปฏิเสธ (สะสมจาก client) | Video/Workout Content ใหม่ คงเป้าหมายเดิม | `409` ถ้าหาวิดีโอใหม่ไม่ได้อีก (ขยายเกณฑ์แล้ว) — tolerance ตัวเลขยังไม่ระบุ (ดูจุดที่ยังไม่ได้ระบุ) | — |

### 3.3 Exertion & Calorie Calculation

| Operation | Verb + Path | Feature/REQ | Request | Response | Error/Edge Case | NFR |
|---|---|---|---|---|---|---|
| เริ่มเซสชันออกกำลังกาย | `POST /workouts/sessions` | REC-1, REC-4/REQ-04, REQ-07 | id วิดีโอหลัก (จาก recommendation หรือ swap) | Workout Session ที่สร้างใหม่ (รวม session_video ของ warmup/หลัก/cooldown ถ้ามี) | — | — |
| จบ/หยุดเซสชัน | `POST /workouts/sessions/{sessionId}/complete` | REC-2/REQ-05 | เวลาที่ใช้จริง (วินาที/นาที) | Actual Calorie Burn (kcal ที่คำนวณจาก MET หรือแทนที่ด้วยค่า wearable ถ้ามี) — สร้าง Daily Log ต่อโดยอัตโนมัติ (ดู 3.5) | `404` sessionId ไม่พบ | NFR-02 (feedback ทันทีภายใน 250ms) |

### 3.4 Planner & Day-Status

| Operation | Verb + Path | Feature/REQ | Request | Response | Error/Edge Case | NFR |
|---|---|---|---|---|---|---|
| ดูแผนรายสัปดาห์ | `GET /planner/week` | PLN-1/REQ-08 | — | Weekly Plan/Calendar Entry ทั้ง 7 วัน (จ.-อา.) พร้อม flag read-only ต่อวัน | — | — |
| ตั้ง/แก้แผนของวัน | `PUT /planner/days/{date}` | PLN-1/REQ-08 | ประเภทกิจกรรม (หรือปล่อยว่างเพื่อใช้ default) | Weekly Plan/Calendar Entry ของวันนั้น | `409` ถ้าวันนั้นเป็นวันในอดีตที่มี log อยู่แล้ว (read-only ไม่มีข้อยกเว้น) | NFR-02 |
| ตั้ง Cheat/Rest Day | `POST /planner/days/{date}/cheat-rest` | PLN-2/REQ-09 | — | Day Status = Cheat/Rest, สถานะวันนั้นถูก mark "ครบเป้าหมาย" | `409` ถ้า `date` ไม่ใช่วันนี้และมี log อยู่ก่อน (decision ที่ resolve แล้ว: ทับ log ได้เฉพาะวันนี้เท่านั้น), `409` ถ้าเป็นวันในอดีตของสัปดาห์ (read-only ตาม PLN-1 ไม่มีข้อยกเว้น) | NFR-02 |
| ยกเลิก Cheat/Rest Day | `DELETE /planner/days/{date}/cheat-rest` | PLN-2/REQ-09 | — | `204` วันนั้นกลับไปนับเป้าหมายตามปกติ | ใช้ได้เฉพาะก่อนสิ้นวันของ `date` นั้น | NFR-02 |

### 3.5 Logging & Streak

| Operation | Verb + Path | Feature/REQ | Request | Response | Error/Edge Case | NFR |
|---|---|---|---|---|---|---|
| ดูประวัติ log | `GET /logs` | PLN-3/REQ-10 | ช่วงวันที่ (optional) | รายการ Daily Log เรียงย้อนหลัง | — | NFR-08 (ต้องไม่หายจาก network ไม่เสถียร) |
| ดู log ของวันหนึ่ง | `GET /logs/{date}` | PLN-3/REQ-10 | — | Daily Log ของวันนั้น (นาทีที่ออกกำลังกาย, kcal สะสม, สถานะครบ/ไม่ครบเป้าหมาย) | `404` ยังไม่มี log ของวันนั้น | — |
| ดู streak ปัจจุบัน | `GET /streak` | PLN-4/REQ-09, REQ-10 | — | Streak count ปัจจุบัน (จาก Streak cache — ดู database-schema.md) | — | — |

### 3.6 Insights & Forecast

| Operation | Verb + Path | Feature/REQ | Request | Response | Error/Edge Case | NFR |
|---|---|---|---|---|---|---|
| ดูพยากรณ์เป้าหมายน้ำหนัก | `GET /insights/forecast` | INT-1/REQ-11 | — | วันที่คาดว่าจะถึงเป้าหมาย, อัตราขาดดุลเฉลี่ย | `422` ถ้ายังไม่มีน้ำหนักเป้าหมาย (ต้องกรอกที่ ONB-3 ก่อน), `422` ถ้า log สะสมไม่พอ (จำนวนวันขั้นต่ำยังไม่ระบุ — ดูจุดที่ยังไม่ได้ระบุ) | — |

### 3.7 Integration Gateway

| Operation | Verb + Path | Feature/REQ | Request | Response | Error/Edge Case | NFR |
|---|---|---|---|---|---|---|
| ขอเชื่อมต่อตาชั่งอัจฉริยะ | `POST /integrations/smart-scale/connect` | INT-2/REQ-12 | — | Integration Consent/Connection State = pending/connected | ต้องผ่าน consent prompt ก่อนเสมอ | NFR-05 |
| ตัดการเชื่อมต่อตาชั่ง | `DELETE /integrations/smart-scale` | INT-2/REQ-12 | — | `204` | — | — |
| ส่งค่าน้ำหนักที่ซิงค์ (หรือกรอกเอง) | `POST /integrations/smart-scale/sync` | INT-2/REQ-12 | น้ำหนัก/องค์ประกอบร่างกาย, แหล่งที่มา (ตาชั่ง/กรอกเอง) | Weight Record ที่บันทึกแล้ว → trigger คำนวณ TDEE ใหม่ | เชื่อมต่อ Bluetooth ไม่สำเร็จ → client fallback เป็นกรอกเอง (ยังเรียก endpoint เดียวกัน ต่างแค่ source) | NFR-04, NFR-07 |
| ขอเชื่อมต่อ wearable | `POST /integrations/wearable/connect` | INT-3/REQ-13 | — | Integration Consent/Connection State = pending/connected | ต้องผ่าน consent prompt ก่อนเสมอ | NFR-05 |
| ตัดการเชื่อมต่อ wearable | `DELETE /integrations/wearable` | INT-3/REQ-13 | — | `204` | — | — |
| ส่งค่าแคลอรี่จาก wearable | `POST /integrations/wearable/readings` | INT-3/REQ-13 | sessionId, ค่าแคลอรี่จาก wearable | Wearable Reading ที่บันทึก → ใช้แทนค่าประมาณ MET ใน `POST /workouts/sessions/{sessionId}/complete` ถ้ามาถึงก่อน | ถ้าไม่มีข้อมูล wearable ระบบใช้ค่าประมาณ MET ตามเดิม (ไม่ใช่ error) | NFR-04, NFR-07 |

## 4. จุดที่ยังไม่ได้ระบุ / ควรยืนยันเพิ่มเติม

1. **REC-1/REC-3**: ตัวเลข tolerance การจับคู่วิดีโอ-แคลอรี่ยังไม่ระบุ — `GET /workouts/today/recommendation`
   และ `POST .../swap` จึงยังบอกไม่ได้ชัดว่า "ไม่พบวิดีโอที่ตรงพอ" (`409`) จะ trigger เมื่อไหร่แน่นอน
2. **REC-4**: ยังไม่ระบุว่าเวลา/แคลอรี่ของ warmup/cooldown นับรวมเข้ากับเป้าหมายรายวันหรือไม่ — กระทบว่า
   `POST /workouts/sessions/{sessionId}/complete`'s เวลาที่ใช้จริง ควรรวมหรือไม่รวมช่วง warmup/cooldown
3. **INT-1**: จำนวนวัน log ขั้นต่ำก่อนพยากรณ์ได้ยังไม่ระบุ — `GET /insights/forecast`'s เงื่อนไข `422`
   "log สะสมไม่พอ" ยังไม่มีตัวเลขที่แน่นอน
4. **INT-2/INT-3**: ลำดับความสำคัญเมื่อข้อมูลชนกัน (ชั่งน้ำหนักหลายครั้งต่อวัน, wearable ต่างจาก MET มาก)
   ยังไม่ระบุ — กระทบว่า `POST /integrations/smart-scale/sync` ควรมีพฤติกรรมอย่างไรเมื่อเรียกซ้ำในวันเดียวกัน
5. **Rate limiting / pagination**: ยังไม่มี requirement ใดระบุถึงเรื่องนี้ — `GET /logs` ที่คืนประวัติ
   ทั้งหมดอาจต้องมี pagination เมื่อข้อมูลมากขึ้น แต่ยังไม่ได้ตัดสินใจรูปแบบ

## 5. ความสัมพันธ์กับเอกสารอื่น

- [High Level Architecture](high-level-architecture.md) — ทุก operation ในเอกสารนี้ derive จาก
  Conceptual Component (หัวข้อ 3) และ Conceptual Data Entity (หัวข้อ 5) ของเอกสารนั้นโดยตรง
- [Product Backlog](../../01-requirements/backlog.md), [Requirement 4 epic + NFR](../../01-requirements/01-spec/index.md) —
  แหล่งที่มาของ Feature ID/REQ ที่แต่ละ operation อ้างถึง
- [database-schema.md](database-schema.md) — โครงสร้างข้อมูลที่ operation แต่ละตัวอ่าน/เขียน (คู่กัน)

## 6. ภาคผนวก: Stack Mapping

> **หัวข้อนี้เป็นข้อยกเว้นเดียวในเอกสารนี้ (นอกเหนือจาก REST convention) ที่มีชื่อเทคโนโลยีจริง** แหล่งที่มา
> และสิทธิ์แก้ไขจริงอยู่ที่ [tech-stack.md](tech-stack.md) เสมอ — หัวข้อ 1-5 ข้างต้นยังคง conceptual ตาม
> กติกาเดิมทุกประการ ถ้าทีมเปลี่ยน stack ในอนาคต ให้รัน `tech-stack-builder` ก่อน แล้วภาคผนวกนี้จะถูก sync
> ตามในการรัน `api-db-spec-builder` ครั้งถัดไป

มิเรอร์จาก [tech-stack.md § 6.3](tech-stack.md#63-api-specmds-rest-convention--supabase-routing)
(2026-08-28):

- **Operation ที่เป็น CRUD ตรงไปตรงมา** (เช่น `GET /profile`, `GET /logs`, `GET /logs/{date}`,
  `GET /planner/week`, `GET /streak`) → ใช้ **PostgREST auto-generated API** ของ Supabase โดยตรง (มี RLS
  policy คุมสิทธิ์ต่อผู้ใช้)
- **Operation ที่มี business logic/validation/เรียก external API** (เช่น `PUT /profile/goal`,
  `GET /workouts/today/recommendation`, `POST /workouts/sessions/{sessionId}/complete`,
  `POST /planner/days/{date}/cheat-rest`, ทุก endpoint ใต้ `/integrations/*`) → implement เป็น
  **Supabase Edge Function** (Deno/TypeScript) โดยคง HTTP verb + resource path เดิมตามที่หัวข้อ 3 กำหนด
  ไว้เป็น convention การตั้งชื่อ route

ดู [tech-stack.md](tech-stack.md) สำหรับ mapping ที่เหลือ (HLA Component → implementation, logical
type → PostgreSQL type) และเหตุผลการเลือก stack
