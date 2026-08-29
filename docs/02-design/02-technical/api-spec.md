# API Spec (Conceptual) — smartFit_daily

- **ประเภทเอกสาร:** API Spec — Conceptual, REST-style convention (ไม่ผูก technical stack)
- **สถานะเอกสาร:** Draft
- **วันที่สร้าง:** 2026-08-28
- **อัปเดตล่าสุด:** 2026-08-29 (รอบ 3) — sync หัวข้อ 6 (ภาคผนวก: Stack Mapping) ให้ตรงกับ `tech-stack.md`
  §6.3.1 ฉบับสมบูรณ์ (mechanical re-sync ล้วน ไม่ใช่การตัดสินใจใหม่ — ไม่แตะเนื้อหาหลักหัวข้อ 1-5): เพิ่ม
  หัวข้อย่อย **6.3.1** สรุป mapping ระดับ operation ของทั้ง 8 operation ในหัวข้อ 3.1 (Account & Session
  Management) — resolve ⚠️ placeholder เดิมที่ทิ้งไว้ในรอบ 2 (7 ใน 8 operation เป็น client SDK call ตรง
  ของ Firebase Authentication มีเพียง `POST /auth/forgot-password` เท่านั้นที่ต้องเป็น Cloud Function)
- **อัปเดตก่อนหน้า:** 2026-08-29 (รอบ 2) — audit พบว่า `high-level-architecture.md` เพิ่ง add Conceptual
  Component ใหม่ **"Account & Session Management" (§3.1)** ครอบคลุม ONB-0 (REQ-14–17) พร้อม entity
  **User Account** ใหม่ (§5) แต่เอกสารนี้ยังไม่มี operation รองรับเลย (เอกสารล้าหลัง ไม่ใช่ข้อขัดแย้ง) —
  เพิ่มหัวข้อ **3.1 Account & Session Management** (8 operations: signup/login แยก 3 วิธี +
  forgot-password + logout — ยืนยันจากผู้ใช้ 2026-08-29 ว่าแยก endpoint ต่อวิธีแทนการรวมเป็น endpoint
  เดียว) แล้ว renumber หัวข้อเดิม 3.1–3.7 → 3.2–3.8 ให้ตรงกับการ renumber component ของ HLA, เพิ่มจุดที่
  ยังไม่ได้ระบุใหม่ 6 ข้อในหัวข้อ 4 (email verification, password policy, session timeout, ขอบเขต NFR-05,
  account enumeration policy, การชนกันของอีเมลจากผู้ให้บริการภายนอก), และปรับหัวข้อ 6 (ภาคผนวก: Stack
  Mapping) ให้ระบุว่า operation ใหม่ของ component นี้ยังไม่มี mapping ทางการใน `tech-stack.md` §6.1/§6.3
  (เอกสารล้าหลังจุดเดียวกับที่ HLA §10 เองก็ทิ้ง ⚠️ ไว้) — audit หัวข้อ 1-2 (Scope/Conventions) และ 5
  (ความสัมพันธ์กับเอกสารอื่น) แล้วไม่พบ drift อื่น (ดู [log 2026-08-29](../../05-log/20260829-log.md))
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

### 3.1 Account & Session Management

| Operation | Verb + Path | Feature/REQ | Request (เชิงแนวคิด) | Response (เชิงแนวคิด) | Error/Edge Case | NFR |
|---|---|---|---|---|---|---|
| สมัครสมาชิกด้วยอีเมล/รหัสผ่าน | `POST /auth/signup/email` | ONB-0/REQ-14 | อีเมล, รหัสผ่าน (credential เชิงแนวคิด) | User Account ที่สร้างใหม่ (`signup_method = email_password`) → พาไปขั้นตอน ONB-1 ต่อทันที | `409` อีเมลนี้มีบัญชีอยู่แล้ว, `400` รูปแบบอีเมล/รหัสผ่านไม่ถูกต้อง (เกณฑ์ password policy ยังไม่ระบุ — ดูจุดที่ยังไม่ได้ระบุ) | NFR-04 (เข้ารหัสระหว่างส่ง), NFR-11 (PDPA — บันทึกการสร้างบัญชี) |
| สมัครสมาชิกผ่าน Google | `POST /auth/signup/google` | ONB-0/REQ-14 | ผลการยืนยันตัวตนจากผู้ให้บริการภายนอก (เชิงแนวคิด — ไม่ระบุรูปแบบ token/redirect) | User Account ที่สร้างใหม่ (`signup_method = google`) พร้อมอีเมลที่ยืนยันแล้วจากผู้ให้บริการ → พาไปขั้นตอน ONB-1 ต่อทันที | การยืนยันตัวตนกับผู้ให้บริการล้มเหลว → ไม่สร้างบัญชี ไม่มี fallback แบบ "ข้ามไปเลย" ตาม HLA §6.4 (ผู้ใช้ต้องลองใหม่/เปลี่ยนวิธี), อีเมลจากผู้ให้บริการนี้ตรงกับบัญชีที่มีอยู่แล้วด้วยวิธีอื่น → พฤติกรรมยังไม่ระบุ (ดูจุดที่ยังไม่ได้ระบุ) | NFR-04, NFR-11 (NFR-05 ยังเป็น open point ต่อ boundary นี้ — ดู HLA §8 ข้อ 6) |
| สมัครสมาชิกผ่าน Apple | `POST /auth/signup/apple` | ONB-0/REQ-14 | ผลการยืนยันตัวตนจากผู้ให้บริการภายนอก (เชิงแนวคิด) | User Account ที่สร้างใหม่ (`signup_method = apple`) พร้อมอีเมลที่ยืนยันแล้ว → พาไปขั้นตอน ONB-1 ต่อทันที | เหมือน `POST /auth/signup/google` ข้างต้นทุกประการ | เหมือน `POST /auth/signup/google` ข้างต้น |
| เข้าสู่ระบบด้วยอีเมล/รหัสผ่าน | `POST /auth/login/email` | ONB-0/REQ-15 | อีเมล, รหัสผ่าน | User Account ที่ตรงกัน + session ที่ถูกจดจำไว้ (session persistence) → พาไปหน้าที่เหมาะสม (ONB-1 ถ้ายังไม่เคยผ่าน หรือ Daily Dashboard ถ้าผ่านแล้ว) | `401` credential ไม่ถูกต้อง, พฤติกรรมเมื่ออีเมลไม่มีอยู่ในระบบเลยยังไม่ระบุแยกจากกรณีรหัสผ่านผิด (account enumeration policy — ดูจุดที่ยังไม่ได้ระบุ) | NFR-04 |
| เข้าสู่ระบบผ่าน Google | `POST /auth/login/google` | ONB-0/REQ-15 | ผลการยืนยันตัวตนจากผู้ให้บริการภายนอก | User Account ที่ตรงกัน + session ที่ถูกจดจำไว้ | การยืนยันตัวตนกับผู้ให้บริการล้มเหลว → ต้องลองใหม่/เปลี่ยนวิธี (ไม่มี fallback ตาม HLA §6.4) | NFR-04 |
| เข้าสู่ระบบผ่าน Apple | `POST /auth/login/apple` | ONB-0/REQ-15 | ผลการยืนยันตัวตนจากผู้ให้บริการภายนอก | User Account ที่ตรงกัน + session ที่ถูกจดจำไว้ | เหมือน `POST /auth/login/google` ข้างต้น | NFR-04 |
| ขอรีเซ็ตรหัสผ่าน | `POST /auth/forgot-password` | ONB-0/REQ-16 | อีเมลที่ลงทะเบียนไว้ | `204`/`202` คำขอรีเซ็ตถูกส่งแล้ว (ช่องทางส่งจริงไม่ระบุ) | `422` ถ้าบัญชีของอีเมลนั้นสมัครผ่าน Google/Apple (ไม่มีรหัสผ่านให้รีเซ็ตตาม REQ-16), พฤติกรรมเมื่ออีเมลไม่มีอยู่ในระบบเลยยังไม่ระบุ (account enumeration policy — ดูจุดที่ยังไม่ได้ระบุ) | NFR-04 |
| ออกจากระบบ | `POST /auth/logout` | ONB-0/REQ-17 | — | `204` ล้าง session ที่จดจำไว้ทันที | — | — |

### 3.2 Personalization & Profile

| Operation | Verb + Path | Feature/REQ | Request (เชิงแนวคิด) | Response (เชิงแนวคิด) | Error/Edge Case | NFR |
|---|---|---|---|---|---|---|
| ดูโปรไฟล์ปัจจุบัน | `GET /profile` | — | — | User Profile + Equipment Profile + Goal Selection (ถ้ามี) | `404` ถ้ายังไม่เคยทำ ONB-1 เลย | NFR-04 (ข้อมูลสุขภาพ) |
| ตั้ง/แก้ข้อมูลส่วนตัว | `PUT /profile/personal-info` | ONB-1/REQ-01 | อายุ, เพศ, น้ำหนัก, ส่วนสูง, ระดับกิจกรรม | User Profile พร้อม TDEE ที่คำนวณใหม่ | `400` ค่าติดลบ/นอกช่วงที่สมเหตุสมผล | NFR-01 (คำนวณ client-side ไม่มี latency), NFR-04 |
| ตั้ง/แก้อุปกรณ์ที่มี | `PUT /profile/equipment` | ONB-2/REQ-03 | รายการอุปกรณ์ที่เลือก (multi-select: ไม่มี/ดัมเบล/ยิมครบชุด) | Equipment Profile ที่บันทึกแล้ว | `400` เลือก "ไม่มีอุปกรณ์" พร้อมตัวอื่น (mutual exclusion ตาม decision ที่ resolve แล้ว) | — |
| ตั้ง/แก้เป้าหมายหลัก | `PUT /profile/goal` | ONB-3/REQ-02 | ประเภทเป้าหมาย, น้ำหนักเป้าหมาย (บังคับเมื่อ "ลดน้ำหนัก") | Goal Selection พร้อมเป้าหมายแคลอรี่รายวันหลังปรับ safety floor | `400` ขาดน้ำหนักเป้าหมายตอนเลือก "ลดน้ำหนัก" | — |

### 3.3 Content Recommendation

| Operation | Verb + Path | Feature/REQ | Request | Response | Error/Edge Case | NFR |
|---|---|---|---|---|---|---|
| ดูวิดีโอแนะนำวันนี้ | `GET /workouts/today/recommendation` | REC-1, REC-4/REQ-04, REQ-07 | — | Video/Workout Content ที่จับคู่ (รวม warmup/cooldown ถ้าความเข้มข้นสูง) พร้อมเป้าหมายแคลอรี่วันนี้ | `204` ถ้าวันนี้เป็น Cheat/Rest Day (ไม่มีวิดีโอแนะนำ) | NFR-01 (ต้องไม่มี latency ที่สังเกตได้) |
| เปลี่ยนวิดีโอ | `POST /workouts/today/recommendation/swap` | REC-3/REQ-06 | id ของวิดีโอที่เพิ่งถูกปฏิเสธ (สะสมจาก client) | Video/Workout Content ใหม่ คงเป้าหมายเดิม | `409` ถ้าหาวิดีโอใหม่ไม่ได้อีก (ขยายเกณฑ์แล้ว) — tolerance ตัวเลขยังไม่ระบุ (ดูจุดที่ยังไม่ได้ระบุ) | — |

### 3.4 Exertion & Calorie Calculation

| Operation | Verb + Path | Feature/REQ | Request | Response | Error/Edge Case | NFR |
|---|---|---|---|---|---|---|
| เริ่มเซสชันออกกำลังกาย | `POST /workouts/sessions` | REC-1, REC-4/REQ-04, REQ-07 | id วิดีโอหลัก (จาก recommendation หรือ swap) | Workout Session ที่สร้างใหม่ (รวม session_video ของ warmup/หลัก/cooldown ถ้ามี) | — | — |
| จบ/หยุดเซสชัน | `POST /workouts/sessions/{sessionId}/complete` | REC-2/REQ-05 | เวลาที่ใช้จริง (วินาที/นาที) | Actual Calorie Burn (kcal ที่คำนวณจาก MET หรือแทนที่ด้วยค่า wearable ถ้ามี) — สร้าง Daily Log ต่อโดยอัตโนมัติ (ดู 3.5) | `404` sessionId ไม่พบ | NFR-02 (feedback ทันทีภายใน 250ms) |

### 3.5 Planner & Day-Status

| Operation | Verb + Path | Feature/REQ | Request | Response | Error/Edge Case | NFR |
|---|---|---|---|---|---|---|
| ดูแผนรายสัปดาห์ | `GET /planner/week` | PLN-1/REQ-08 | — | Weekly Plan/Calendar Entry ทั้ง 7 วัน (จ.-อา.) พร้อม flag read-only ต่อวัน | — | — |
| ตั้ง/แก้แผนของวัน | `PUT /planner/days/{date}` | PLN-1/REQ-08 | ประเภทกิจกรรม (หรือปล่อยว่างเพื่อใช้ default) | Weekly Plan/Calendar Entry ของวันนั้น | `409` ถ้าวันนั้นเป็นวันในอดีตที่มี log อยู่แล้ว (read-only ไม่มีข้อยกเว้น) | NFR-02 |
| ตั้ง Cheat/Rest Day | `POST /planner/days/{date}/cheat-rest` | PLN-2/REQ-09 | — | Day Status = Cheat/Rest, สถานะวันนั้นถูก mark "ครบเป้าหมาย" | `409` ถ้า `date` ไม่ใช่วันนี้และมี log อยู่ก่อน (decision ที่ resolve แล้ว: ทับ log ได้เฉพาะวันนี้เท่านั้น), `409` ถ้าเป็นวันในอดีตของสัปดาห์ (read-only ตาม PLN-1 ไม่มีข้อยกเว้น) | NFR-02 |
| ยกเลิก Cheat/Rest Day | `DELETE /planner/days/{date}/cheat-rest` | PLN-2/REQ-09 | — | `204` วันนั้นกลับไปนับเป้าหมายตามปกติ | ใช้ได้เฉพาะก่อนสิ้นวันของ `date` นั้น | NFR-02 |

### 3.6 Logging & Streak

| Operation | Verb + Path | Feature/REQ | Request | Response | Error/Edge Case | NFR |
|---|---|---|---|---|---|---|
| ดูประวัติ log | `GET /logs` | PLN-3/REQ-10 | ช่วงวันที่ (optional) | รายการ Daily Log เรียงย้อนหลัง | — | NFR-08 (ต้องไม่หายจาก network ไม่เสถียร) |
| ดู log ของวันหนึ่ง | `GET /logs/{date}` | PLN-3/REQ-10 | — | Daily Log ของวันนั้น (นาทีที่ออกกำลังกาย, kcal สะสม, สถานะครบ/ไม่ครบเป้าหมาย) | `404` ยังไม่มี log ของวันนั้น | — |
| ดู streak ปัจจุบัน | `GET /streak` | PLN-4/REQ-09, REQ-10 | — | Streak count ปัจจุบัน (จาก Streak cache — ดู database-schema.md) | — | — |

### 3.7 Insights & Forecast

| Operation | Verb + Path | Feature/REQ | Request | Response | Error/Edge Case | NFR |
|---|---|---|---|---|---|---|
| ดูพยากรณ์เป้าหมายน้ำหนัก | `GET /insights/forecast` | INT-1/REQ-11 | — | วันที่คาดว่าจะถึงเป้าหมาย, อัตราขาดดุลเฉลี่ย | `422` ถ้ายังไม่มีน้ำหนักเป้าหมาย (ต้องกรอกที่ ONB-3 ก่อน), `422` ถ้า log สะสมไม่พอ (จำนวนวันขั้นต่ำยังไม่ระบุ — ดูจุดที่ยังไม่ได้ระบุ) | — |

### 3.8 Integration Gateway

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
6. **ONB-0/REQ-14 (สมัครสมาชิก)**: ยังไม่ระบุว่าต้องมีขั้นตอนยืนยันอีเมล (email verification) ก่อนใช้งานได้
   จริงหรือไม่ — กระทบว่า `POST /auth/signup/email` ควรพาผู้ใช้ไปต่อ ONB-1 ทันทีหรือต้องรอยืนยันอีเมลก่อน
7. **ONB-0/REQ-14 (สมัครสมาชิก)**: ยังไม่ระบุกติกาความซับซ้อนของรหัสผ่าน (password policy) สำหรับ
   email/password — กระทบเงื่อนไข `400` ของ `POST /auth/signup/email`
8. **ONB-0/REQ-15 (เข้าสู่ระบบ)**: ยังไม่ระบุระยะเวลาหมดอายุของ session (session timeout) ที่แน่นอน
9. **ONB-0/NFR-05**: ยังไม่ชัดว่า NFR-05 (ต้องขอ consent ชัดเจนก่อนเชื่อมต่อระบบภายนอก) ครอบคลุมการสมัคร/
   เข้าสู่ระบบผ่านผู้ให้บริการยืนยันตัวตนภายนอก (Google/Apple) ด้วยหรือไม่ (HLA §8 ข้อ 6 ทิ้ง open point
   นี้ไว้เช่นกัน) — กระทบว่า `POST /auth/signup/google`, `/apple` และ `POST /auth/login/google`, `/apple`
   ต้องมี consent-prompt step แยกต่างหากในเชิงแนวคิดหรือไม่
10. **ONB-0**: พฤติกรรมของ `POST /auth/login/email` และ `POST /auth/forgot-password` เมื่ออีเมลไม่มีอยู่
    ในระบบเลย (ไม่ใช่แค่รหัสผ่านผิด) ยังไม่ระบุ — เกี่ยวข้องกับนโยบาย account enumeration ที่ upstream ยัง
    ไม่ได้ตัดสินใจ
11. **ONB-0/REQ-14 (Google/Apple)**: พฤติกรรมเมื่ออีเมลจากผู้ให้บริการภายนอกตรงกับบัญชีที่มีอยู่แล้วด้วยวิธี
    อื่น (เช่น เคยสมัครด้วย email/password มาก่อน) ยังไม่ระบุ — ควร merge เข้าบัญชีเดียวกันหรือปฏิเสธการ
    สมัครซ้ำ

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

> **อัปเดต 2026-08-29**: มิเรอร์ใหม่ทั้งหมดจาก Supabase/PostgREST เป็น Firebase Cloud Functions ตามการ
> เปลี่ยน stack ใน `tech-stack.md` §2/§5 (2026-08-29) — หัวข้อ 1-5 ข้างต้น**ไม่ต้องแก้ไขเนื้อหาใดๆ**
> เพราะยังเป็น REST-style convention เชิงแนวคิดล้วน ไม่ผูกกับว่า backend จริงมี auto-generated API หรือไม่
>
> **อัปเดต 2026-08-29 (รอบ 3 — resolve mapping ระดับ operation ของ Account & Session Management)**:
> `tech-stack.md` §6.3.1 ขยาย mapping ระดับ operation ของทั้ง 8 operation ในหัวข้อ 3.1 ให้สมบูรณ์แล้ว —
> sync มาไว้ที่หัวข้อ 6.3.1 ด้านล่าง (mechanical re-sync ล้วน ไม่ใช่การตัดสินใจใหม่) resolve ⚠️
> placeholder เดิมของรอบ 2 ได้: 7 ใน 8 operation (`POST /auth/signup/{email,google,apple}`,
> `POST /auth/login/{email,google,apple}`, `POST /auth/logout`) เป็น **client SDK call ตรง** ของ Firebase
> Authentication ไม่ต้องมี Cloud Function ครอบ มีเพียง `POST /auth/forgot-password` เท่านั้นที่ต้องเป็น
> Cloud Function (`forgotPassword`) เพราะต้อง enforce เงื่อนไข `422` ที่ client SDK เพียงอย่างเดียวไม่รองรับ

มิเรอร์จาก [tech-stack.md § 6.3](tech-stack.md#63-api-specmds-rest-convention--firebase-cloud-functions-routing)
(อัปเดต 2026-08-29):

- **ทุก operation ในหัวข้อ 3 ต้อง implement เป็น Cloud Function เอง** — Firestore **ไม่มี auto-generated
  REST API แบบ PostgREST ของ Supabase ให้ใช้ฟรี** ต่างจาก mapping เดิม (2026-08-28) ที่แยก CRUD ธรรมดา
  ออกจาก business-logic operation ได้ชัดเจน ตอนนี้ทั้งสองกลุ่มต้องเขียนเป็น **Cloud Function (Callable
  Function หรือ HTTPS Function)** เหมือนกันหมด โดย map 1:1 กับ resource path เดิมของหัวข้อ 3 เป็น function
  name/route convention:
  - **Operation ที่เป็น CRUD ตรงไปตรงมา** (เช่น `GET /profile`, `GET /logs`, `GET /logs/{date}`,
    `GET /planner/week`, `GET /streak`) → Cloud Function ที่ทำหน้าที่อ่าน/เขียน Firestore ตรงไปตรงมา
    (ไม่มีทางเลือก auto-generate เหมือน PostgREST เดิม เพิ่มปริมาณงาน dev เทียบกับ mapping เดิม)
  - **Operation ที่มี business logic/validation/เรียก external API** (เช่น `PUT /profile/goal`,
    `GET /workouts/today/recommendation`, `POST /workouts/sessions/{sessionId}/complete`,
    `POST /planner/days/{date}/cheat-rest`, ทุก endpoint ใต้ `/integrations/*`) → Cloud Function เดิม
    ตามแนวทางเดียวกัน ไม่เปลี่ยนจากเดิม ต่างแค่ runtime (Firebase Cloud Functions แทน Supabase Edge
    Function)

### 6.3.1 หัวข้อ 3.1 Account & Session Management — ข้อยกเว้นของกติกาข้างต้น

มิเรอร์จาก [tech-stack.md § 6.3.1](tech-stack.md#631-account--session-management-onb-0--ข้อยกเว้นของกติกาข้างต้น)
(อัปเดต 2026-08-29): **8 operation ของหัวข้อ 3.1 ส่วนใหญ่ไม่เข้ากติกา "ทุก operation ต้องเป็น Cloud
Function" ข้างต้น** — เพราะ Firebase Authentication (ต่างจาก Firestore) มี client SDK ที่ทำหน้าที่นี้ให้
โดยตรงอยู่แล้ว:

| Operation (หัวข้อ 3.1) | Firebase Implementation |
|---|---|
| `POST /auth/signup/email` | **Client SDK โดยตรง** — ไม่ต้องมี Cloud Function |
| `POST /auth/signup/google` | **Client SDK โดยตรง** — เป็น SDK call เดียวกันเป๊ะกับ `POST /auth/login/google` (Firebase ไม่มี endpoint แยก signup/login สำหรับ OAuth provider — client อ่าน flag "ผู้ใช้ใหม่หรือไม่" ที่ SDK คืนมาเพื่อตัดสินเส้นทางต่อแทนการแยก route) |
| `POST /auth/signup/apple` | **Client SDK โดยตรง** — เป็น SDK call เดียวกันเป๊ะกับ `POST /auth/login/apple` เช่นเดียวกับ Google ข้างต้น |
| `POST /auth/login/email` | **Client SDK โดยตรง** — ไม่ต้องมี Cloud Function |
| `POST /auth/login/google` | **Client SDK เดียวกับ `POST /auth/signup/google`** เป๊ะ |
| `POST /auth/login/apple` | **Client SDK เดียวกับ `POST /auth/signup/apple`** เป๊ะ |
| `POST /auth/forgot-password` | **Cloud Function (Callable) `forgotPassword`** — operation เดียวในหัวข้อ 3.1 ที่ต้องเป็น Cloud Function เพราะต้อง enforce เงื่อนไข `422` ("บัญชีนี้สมัครผ่าน Google/Apple ไม่มีรหัสผ่านให้รีเซ็ต") ซึ่ง client SDK เพียงอย่างเดียวไม่รองรับการแยกกรณีนี้ |
| `POST /auth/logout` | **Client SDK โดยตรง** — ล้าง token ที่ client เก็บไว้ทันที ไม่มี server-side session ให้ invalidate ฝั่ง Cloud Function จึงไม่ต้องมี Cloud Function |

**สรุป**: จาก 8 operation มีเพียง `POST /auth/forgot-password` เท่านั้นที่ต้องเป็น Cloud Function — ที่เหลือ
เป็น client SDK call ตรงทั้งหมด ต่างจาก component อื่นทุกตัวในหัวข้อ 6.3 ที่ต้องเขียน Cloud Function ครอบทุก
operation เพราะ Firestore ไม่มี auto-generated API — เป็นข้อยกเว้นโดยธรรมชาติของบริการ Firebase
Authentication เอง ไม่ใช่การเลือก stack ใหม่

ดู [tech-stack.md](tech-stack.md) สำหรับ mapping ที่เหลือ (HLA Component → implementation, logical
type → Firestore field type) และเหตุผลการเลือก stack
