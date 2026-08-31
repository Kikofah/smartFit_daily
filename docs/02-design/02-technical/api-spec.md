# API Spec (Conceptual) — smartFit_daily

- **ประเภทเอกสาร:** API Spec — Conceptual, REST-style convention (ไม่ผูก technical stack)
- **สถานะเอกสาร:** Draft
- **วันที่สร้าง:** 2026-08-28
- **อัปเดตล่าสุด:** 2026-08-31 (รอบ 9) — `feature-journey-writer` formalize การแยกเป้าหมายแคลอรี่ของ
  ONB-3/REQ-02 เป็น **2 ค่าแยกกัน** (ยืนยันแล้ว ตรวจสอบกับโค้ดจริง `apps/web/server/routes/personalization-profile/index.ts`
  และ `packages/shared-types/src/entities/personalizationProfile.ts` โดยตรง): แก้ Request ของ
  `PUT /profile/goal` (หัวข้อ 3.2) ให้ระบุทั้ง `dailyCalorieTargetKcal` (เป้าหมายเผาผลาญจากการออกกำลังกาย —
  ไม่มี safety floor, ใช้โดย REC-1/PLN-3/INT-1 เหมือนเดิม) และ `dailyIntakeTargetKcal` (เป้าหมายที่ควรได้รับ
  ต่อวัน, reinstated — TDEE ± ค่าส่วนต่างตามเป้าหมาย มี safety floor) และแก้ Response ให้ระบุ
  `isSafetyFloorApplied` กลับเข้ามา (server re-derive ซ้ำจาก `dailyIntakeTargetKcal` เท่านั้น) — ไม่กระทบ
  operation อื่นใด (REC-1/PLN-3/INT-1 ยังใช้ `dailyCalorieTargetKcal` เหมือนเดิมตามที่เอกสารบรรยายไว้แล้ว) —
  ดู [log 2026-08-31](../../05-log/20260831-log.md)
- **อัปเดตก่อนหน้า:** 2026-08-31 (รอบ 8, factual correction) — แก้ error/edge case ของ `POST
  /workouts/today/recommendation/swap` (REC-3, หัวข้อ 3.3) จากเดิมที่อ้าง "ขยายเกณฑ์แล้ว" (widen-retry
  loop) เป็น "การค้นหาผู้สมัคร 1 ครั้ง + ขั้นตอนจับคู่/ประเมินด้วย AI 1 ครั้ง (single-pass) ไม่เหลือ
  candidate ที่ใช้งานได้เลย" ให้ตรงกับ implementation จริงที่ shipped แล้ว (ยืนยันแล้วใน
  `detailed-design/02-daily-youtube-recommendation.md` และ `tech-stack.md` §6.1 ในรอบ reconcile ก่อนหน้า
  ของวันเดียวกัน) — resolve จุดที่ยังไม่ได้ระบุเดิมข้อ 1 ในหัวข้อ 4 (ตัวเลข tolerance) ว่า "ไม่มีตัวเลข
  tolerance ใช้ AI ranking แบบ best-effort ครั้งเดียวแทน" ไม่ใช่การตัดสินใจ business rule ใหม่ — ไม่กระทบ
  `database-schema.md` (ไม่มี column ใดอ้าง tolerance ตัวเลข) — ดู [log
  2026-08-31](../../05-log/20260831-log.md)
- **อัปเดตก่อนหน้า:** 2026-08-31 (รอบ 7) — เพิ่ม operation ใหม่ `GET /insights/weight-records` ในหัวข้อ
  3.7 (Insights & Forecast) — Weight Record entity (HLA §5) เดิมเขียนได้ผ่าน `POST
  /integrations/smart-scale/sync` (หัวข้อ 3.8) เท่านั้น ไม่มีทางอ่านประวัติกลับมาเลย ทำให้กราฟแนวโน้ม
  น้ำหนักของ INT-1 (Progress screen) ต้องพึ่ง mock data ต่อไปไม่ได้ แม้ `GET /insights/forecast` จะคำนวณ
  จริงแล้ว — วางไว้ที่ Insights & Forecast (ไม่ใช่ Integration Gateway) เพราะ HLA §3.7/§5 ระบุชัดว่า
  component นี้เป็นผู้ **อ่าน** Weight Record history เพื่อพยากรณ์/แสดงแนวโน้ม ส่วน Integration Gateway
  เป็นผู้ **เขียน** จากการซิงค์อุปกรณ์เท่านั้น — ยืนยันแผนกับผู้ใช้ก่อนเขียนแล้ว (แนวทางเดียว ไม่มีข้อขัดแย้ง)
  ไม่กระทบ `database-schema.md` (ตาราง `weight_record` มีอยู่แล้วครบ) — ดู [log
  2026-08-31](../../05-log/20260831-log.md)
- **อัปเดตก่อนหน้า:** 2026-08-30 (รอบ 6) — Citation-only fix: `feature-journey-writer` formalize กลไก
  pairing-code เป็น Feature ID **INT-0** พร้อม business rule **REQ-18** ใหม่ (ดู `backlog.md` § INT-0
  และ `20260823-04-smart-integrations.md` § REQ-18) แทนที่การอ้างว่าเป็น "precondition ทางเทคนิค
  implicit ของ INT-2/INT-3 (REQ-12/REQ-13)" เดิม — แก้ Feature/REQ column ของทั้ง 2 operation ในหัวข้อ
  3.1 (`POST /auth/pairing-codes`, `.../redeem`) จาก "INT-2, INT-3 (implicit...)" เป็น "INT-0/REQ-18"
  และ resolve จุดที่ยังไม่ได้ระบุข้อ 12 ในหัวข้อ 4 (เดิมบอกว่า "ยังไม่มี REQ number formal") ว่า resolve
  แล้ว — ไม่แตะเนื้อหา request/response/error/NFR อื่นใดของ 2 operation นี้ (no re-modeling) — ไม่พบ
  citation อื่นต่อ REQ-12/REQ-13 ที่ต้องแก้ในเอกสารนี้ (ดู [log
  2026-08-30](../../05-log/20260830-log.md))
- **อัปเดตก่อนหน้า:** 2026-08-30 (รอบ 5) — Reconcile 2 จุดตาม `tech-stack.md`/โค้ดจริง (`apps/web/server/routes/pairing/index.ts`
  ที่ `tech-stack-writer` อ่านตรงยืนยันแล้ว): (1) แก้ error/edge case ของ `POST /auth/pairing-codes/redeem`
  (หัวข้อ 3.1) จากเดิม 3 กรณีแยก (`404` ไม่พบ/`409` ถูกใช้แล้ว/`422` หมดอายุ) เป็น **`410 Gone` กรณีเดียว**
  ครอบคลุมทั้งสามสถานการณ์ (ไม่พบรหัสเลย/หมดอายุแล้ว/ถูกใช้ไปแล้ว) เพราะโค้ดจริง **ลบ document ทิ้งทันทีหลัง
  redeem สำเร็จ (delete-on-redeem) แทนการตั้ง flag `is_used`** ทำให้ "ถูกใช้ไปแล้ว" และ "ไม่เคยมีอยู่จริง"
  แยกออกจากกันไม่ได้อีกต่อไปในทางปฏิบัติ ณ operation นี้ — นี่คือการแก้เอกสารให้ตรงกับพฤติกรรมที่ shipped ไป
  แล้วจริง (ตามที่ `tech-stack.md` §7 ข้อ 8 flag ไว้) ไม่ใช่การตัดสินใจ business rule ใหม่ — เพิ่ม `410` เข้า
  รายการ status code ของหัวข้อ 2 ด้วย (2) mechanical re-sync หัวข้อ 6 (ภาคผนวก: Stack Mapping) ทั้งหมดให้ตรง
  กับ `tech-stack.md` §6.3/§6.3.1 ฉบับล่าสุด (Express.js บน Google Cloud Run แทนที่ Firebase Cloud Functions
  เดิม, 10 operation ในหัวข้อ 3.1 sync ครบแล้วแทนที่ตัวเลข "8" ที่เคยล้าหลัง) — audit หัวข้อ 1, 3.2-3.8, 4, 5
  แล้วไม่พบ drift อื่น (ดู [log 2026-08-30](../../05-log/20260830-log.md))
- **อัปเดตก่อนหน้า:** 2026-08-30 (รอบ 4) — audit พบว่า `high-level-architecture.md` เพิ่งอัปเดต 2 จุด: (1)
  §3.1 ระบุชัดว่าเว็บไคลเอนต์เป็นทางเข้าเดียว (sole entry point) ของ credential-based auth ทุกวิธี —
  ปรับหัวข้อ 2 (Conventions, ข้อ Authentication) ให้แก้ประโยคปิดท้ายที่เคยเขียนไว้ว่า "ไม่มี endpoint ใดใน
  เอกสารนี้ที่ยกเว้น" เพราะไม่จริงอีกต่อไปหลังเพิ่ม operation ใหม่ตามข้อ (2) — operation signup/login/
  forgot-password/logout เดิมในหัวข้อ 3.1 **ไม่เปลี่ยนแปลง** (เอกสารล้าหลังเชิง wording เท่านั้น) (2) HLA
  §4.5/§5 เพิ่มกลไกใหม่ **Identity Handoff — Pairing-Code Mechanism** (component interaction ระหว่าง
  Account & Session Management ↔ Integration Gateway) พร้อม entity **Pairing Credential** — เพิ่ม 2
  operation ใหม่ท้ายหัวข้อ 3.1: `POST /auth/pairing-codes` (session ที่ยืนยันตัวตนแล้วขอรหัสจับคู่อุปกรณ์)
  และ `POST /auth/pairing-codes/redeem` (ไคลเอนต์ที่ยังไม่ยืนยันตัวตนแลกรหัสเป็น session — **ข้อยกเว้นเดียว
  ในเอกสารนี้** ต่อกติกา "ทุก endpoint ต้องยืนยันตัวตนก่อนเรียก" ตาม HLA §4.5) พร้อม error/edge case ครบ 3
  กรณี (`404` รหัสไม่พบ, `409` รหัสถูกใช้ไปแล้ว, `422` รหัสหมดอายุ) และ NFR ที่เกี่ยวข้อง (NFR-04, NFR-05
  — เป็น open point เดียวกับที่ HLA §8 ข้อ 7 ทิ้งไว้ว่า NFR-05 ยังไม่ระบุตรงๆ ว่าครอบคลุมกลไกนี้) — เพิ่มจุดที่
  ยังไม่ได้ระบุใหม่ 2 ข้อในหัวข้อ 4 (ดูข้อ 12-13) — **ไม่แตะหัวข้อ 6 (ภาคผนวก: Stack Mapping)** ตามที่ผู้ใช้
  ยืนยันชัดเจนว่า `tech-stack.md` ยังไม่ reconcile จาก Firebase Cloud Functions/React Native-Expo เดิมมาเป็น
  Express + web-first ตามโค้ดจริง (ต้องรอ `tech-stack-builder`) — หัวข้อ 6.3.1 ที่เคยระบุ "8 operation" จึง
  กลายเป็นข้อมูลล้าหลังเพิ่มอีกชั้น (ตอนนี้หัวข้อ 3.1 มี 10 operation แล้ว) รอ resolve พร้อมกันในรอบ
  `tech-stack-builder` ถัดไป — audit หัวข้อ 1, 3.2-3.8, 5 แล้วไม่พบ drift อื่น (ดู
  [log 2026-08-30](../../05-log/20260830-log.md))
- **อัปเดตก่อนหน้า:** 2026-08-29 (รอบ 3) — sync หัวข้อ 6 (ภาคผนวก: Stack Mapping) ให้ตรงกับ `tech-stack.md`
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
  resource, `409` conflict กับกติกาธุรกิจ (เช่น พยายามแก้วันที่เป็น read-only ของ PLN-1), `410` resource
  เคยมีอยู่แต่ถูกลบ/สิ้นสภาพถาวรแล้วไม่มีทางกู้คืน (เพิ่ม 2026-08-30 — ใช้เฉพาะ
  `POST /auth/pairing-codes/redeem` ในหัวข้อ 3.1 ที่ implementation จริงลบ credential ทิ้งทันทีหลัง redeem
  สำเร็จ 1 ครั้ง ทำให้ไม่มีทางแยก "ไม่เคยมีอยู่จริง" ออกจาก "เคยมีแต่ถูกใช้ไปแล้ว" ได้อีก), `422` ข้อมูลถูก
  ต้องตามรูปแบบแต่ขัดกติกาธุรกิจ (เช่น พยายามตั้ง Cheat/Rest Day ย้อนหลังเกินวันนี้ตาม PLN-2)
- **Authentication (เชิงแนวคิด)**: ทุก endpointในเอกสารนี้ต้อง "ยืนยันตัวตนผู้ใช้ก่อนเรียก" เสมอ (ไม่ระบุ
  กลไก) ยกเว้นจะระบุไว้เป็นอื่นในตัว operation เอง — มี**ข้อยกเว้นเดียว**ในเอกสารนี้ทั้งหมดคือ
  `POST /auth/pairing-codes/redeem` (หัวข้อ 3.1, เพิ่ม 2026-08-30) ซึ่งออกแบบมาให้ไคลเอนต์ที่ยังไม่เคยยืนยัน
  ตัวตนมาก่อนเลยเรียกได้โดยตรง (เป็นกลไก identity handoff ตาม HLA §4.5 — precondition ทางเทคนิคของ
  INT-2/INT-3) — endpoint อื่นทั้งหมดในเอกสารนี้ยังคงต้องยืนยันตัวตนก่อนเสมอ ไม่มีข้อยกเว้นอื่นนอกจากนี้

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
| ขอรหัสจับคู่อุปกรณ์ (mint pairing code, เพิ่ม 2026-08-30) | `POST /auth/pairing-codes` | INT-0/REQ-18 (precondition ทางเทคนิคร่วมของ INT-2/INT-3 — formalize เป็น Feature ID/REQ ของตัวเองแล้ว 2026-08-30 รอบ 6 แทนที่การอ้างอิงแบบ implicit เดิม) | — (ต้องยืนยันตัวตนผู้ใช้ก่อนเรียกตามปกติ ตามหัวข้อ 2) | Pairing Credential ที่สร้างใหม่: รหัสจับคู่อุปกรณ์ 6 หลัก + เวลาหมดอายุ (5 นาทีนับจากออกรหัส) | — (ไม่มี edge case พิเศษนอกเหนือจาก `401` มาตรฐานถ้ายังไม่ยืนยันตัวตน) | NFR-04 (เข้ารหัสระหว่างส่ง), NFR-05 (เจตนารมณ์เดียวกับการปกป้อง credential/consent — NFR-05 ปัจจุบันยังไม่ระบุตรงๆ ว่าครอบคลุมกลไกนี้ ดู HLA §8 ข้อ 7) |
| แลกรหัสจับคู่อุปกรณ์เป็น session (redeem pairing code, เพิ่ม 2026-08-30, แก้ error case 2026-08-30 รอบ 5) | `POST /auth/pairing-codes/redeem` | INT-0/REQ-18 (เหมือนแถวบน) | รหัสจับคู่อุปกรณ์ 6 หลักที่ผู้ใช้กรอกบนไคลเอนต์ที่ไม่มีหน้าจอ auth ของตัวเอง — **operation นี้ไม่ต้องยืนยันตัวตนผู้ใช้ก่อนเรียก** (ข้อยกเว้นเดียวของหัวข้อ 2 Authentication) | session credential ที่ผูกกับ User Account เจ้าของรหัส — เชิงแนวคิดเทียบเท่ากับสิ่งที่ operation เข้าสู่ระบบอื่นในหัวข้อนี้คืนกลับ (session ที่ใช้เรียก endpoint ที่ต้องยืนยันตัวตนต่อจากนี้ได้ทันที) โดยไม่ต้องกรอก credential ซ้ำ | `410` รหัสไม่ถูกต้อง/หมดอายุ/ถูกใช้ไปแล้ว — **กรณีเดียวครอบคลุมทั้ง 3 สถานการณ์เดิม** (ไม่พบรหัสเลย, หมดอายุแล้ว, ถูกใช้ไปแล้ว) เพราะกลไก single-use enforce ด้วยการ**ลบ Pairing Credential ทิ้งถาวรทันทีที่ redeem สำเร็จ**แทนการตั้งสถานะ "ใช้แล้ว" ที่ยังคงเก็บแถวไว้ตรวจสอบ — เมื่อแถวถูกลบไปแล้ว operation นี้แยกไม่ออกอีกต่อไปว่ารหัสที่กรอกมา "ไม่เคยมีอยู่จริงตั้งแต่แรก" หรือ "เคยมีแต่ถูก redeem ไปแล้วก่อนหน้านี้" — เป็นความจริงเชิง implementation ที่ตั้งใจยอมรับ ไม่ใช่ช่องโหว่ (เดิมเอกสารนี้เคยแยกเป็น `404`/`409`/`422` 3 กรณี ซึ่งไม่ตรงกับพฤติกรรมจริง — แก้ไขแล้ว 2026-08-30 รอบ 5) | NFR-04, NFR-05 (เหมือนแถวบน) |

### 3.2 Personalization & Profile

| Operation | Verb + Path | Feature/REQ | Request (เชิงแนวคิด) | Response (เชิงแนวคิด) | Error/Edge Case | NFR |
|---|---|---|---|---|---|---|
| ดูโปรไฟล์ปัจจุบัน | `GET /profile` | — | — | User Profile + Equipment Profile + Goal Selection (ถ้ามี) | `404` ถ้ายังไม่เคยทำ ONB-1 เลย | NFR-04 (ข้อมูลสุขภาพ) |
| ตั้ง/แก้ข้อมูลส่วนตัว | `PUT /profile/personal-info` | ONB-1/REQ-01 | อายุ, เพศ, น้ำหนัก, ส่วนสูง, ระดับกิจกรรม | User Profile พร้อม TDEE ที่คำนวณใหม่ | `400` ค่าติดลบ/นอกช่วงที่สมเหตุสมผล | NFR-01 (คำนวณ client-side ไม่มี latency), NFR-04 |
| ตั้ง/แก้อุปกรณ์ที่มี | `PUT /profile/equipment` | ONB-2/REQ-03 | รายการอุปกรณ์ที่เลือก (multi-select: ไม่มี/ดัมเบล/ยิมครบชุด) | Equipment Profile ที่บันทึกแล้ว | `400` เลือก "ไม่มีอุปกรณ์" พร้อมตัวอื่น (mutual exclusion ตาม decision ที่ resolve แล้ว) | — |
| ตั้ง/แก้เป้าหมายหลัก | `PUT /profile/goal` | ONB-3/REQ-02 | ประเภทเป้าหมาย, น้ำหนักเป้าหมาย (บังคับเมื่อ "ลดน้ำหนัก"), **เป้าหมายแคลอรี่จากการออกกำลังกาย** (`dailyCalorieTargetKcal` — น้ำหนักตัว × ค่าคงที่ kcal/กก. ต่อเป้าหมาย, ไม่มี safety floor), **เป้าหมายแคลอรี่ที่ควรได้รับต่อวัน** (`dailyIntakeTargetKcal` — TDEE ± ค่าส่วนต่างตามเป้าหมาย, reinstated 2026-08-31) — ทั้งสองค่าคำนวณฝั่ง client (NFR-01/03) | Goal Selection พร้อมทั้งสองเป้าหมายแคลอรี่ และ `isSafetyFloorApplied` (server re-derive ซ้ำจาก `dailyIntakeTargetKcal` เทียบ safety floor ขั้นต่ำ เป็นชั้นตรวจสอบที่สอง ไม่เชื่อค่าจาก client อย่างเดียว — ใช้กับเป้าหมาย intake เท่านั้น เพราะเป้าหมายการออกกำลังกายไม่มี safety floor) | `400` ขาดน้ำหนักเป้าหมายตอนเลือก "ลดน้ำหนัก" | NFR-01 (คำนวณ client-side) |

### 3.3 Content Recommendation

| Operation | Verb + Path | Feature/REQ | Request | Response | Error/Edge Case | NFR |
|---|---|---|---|---|---|---|
| ดูวิดีโอแนะนำวันนี้ | `GET /workouts/today/recommendation` | REC-1, REC-4/REQ-04, REQ-07 | — | Video/Workout Content ที่จับคู่ (รวม warmup/cooldown ถ้าความเข้มข้นสูง) พร้อมเป้าหมายแคลอรี่วันนี้ | `204` ถ้าวันนี้เป็น Cheat/Rest Day (ไม่มีวิดีโอแนะนำ) | NFR-01 (ต้องไม่มี latency ที่สังเกตได้) |
| เปลี่ยนวิดีโอ | `POST /workouts/today/recommendation/swap` | REC-3/REQ-06 | id ของวิดีโอที่เพิ่งถูกปฏิเสธ (สะสมจาก client) | Video/Workout Content ใหม่ คงเป้าหมายเดิม | `409` เมื่อการค้นหาผู้สมัคร 1 ครั้ง + ขั้นตอนจับคู่/ประเมินด้วย AI 1 ครั้ง (single-pass เดียวกับ REC-1 — ไม่มี tolerance ตัวเลข ไม่มีการขยายเกณฑ์/ค้นหาซ้ำ) ไม่เหลือ candidate ที่ใช้งานได้เลย (แก้ 2026-08-31 — ดูจุดที่ยังไม่ได้ระบุที่ resolve แล้วในหัวข้อ 4) | — |

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
| ดูประวัติน้ำหนัก | `GET /insights/weight-records` | INT-1/REQ-11 | ช่วงวันที่ (optional) | รายการ Weight Record เรียงตามเวลาที่บันทึก (ใช้แสดงกราฟแนวโน้มน้ำหนักและเป็นข้อมูลตั้งต้นของการพยากรณ์) | — | — |

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

1. ~~**REC-1/REC-3**: ตัวเลข tolerance การจับคู่วิดีโอ-แคลอรี่ยังไม่ระบุ~~ — **resolved 2026-08-31**:
   ไม่มีตัวเลข tolerance และไม่มีการขยายเกณฑ์ค้นหาซ้ำ (retry/widen) แต่อย่างใด — implementation จริง (ยืนยัน
   ตรงกับ `detailed-design/02-daily-youtube-recommendation.md` ที่ resolve จุดเดียวกันไปแล้วในรอบเดียวกันนี้)
   ค้นหาผู้สมัครจาก YouTube เพียง**ครั้งเดียว** แล้วให้ขั้นตอนจับคู่/ประเมินด้วย AI ครั้งเดียวเลือก candidate
   ที่ดีที่สุด 1 รายการแบบ best-effort (single-pass) — `409` ของทั้ง `GET /workouts/today/recommendation`
   และ `POST .../swap` trigger เมื่อรอบ single-pass นี้ไม่เหลือ candidate ที่ใช้งานได้เลยเท่านั้น จุดนี้จึงไม่
   ใช่ open point อีกต่อไป (แก้ error/edge case ของ `POST .../swap` ในหัวข้อ 3.3 ให้ตรงแล้ว)
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
12. ~~**Pairing-code mechanism**: ยังไม่มี REQ number formal สำหรับกลไกนี้~~ — **resolved 2026-08-30
    รอบ 6**: `feature-journey-writer` formalize กลไกนี้เป็น Feature ID **INT-0** พร้อม business rule
    **REQ-18** แล้ว (แทนที่การอ้างอิงแบบ implicit precondition ของ REQ-12/REQ-13 เดิม — ดู
    `backlog.md` § INT-0 และ `20260823-04-smart-integrations.md` § REQ-18) — `POST /auth/pairing-codes`
    และ `.../redeem` ในหัวข้อ 3.1 อัปเดต Feature/REQ column เป็น INT-0/REQ-18 แล้ว จุดนี้จึงไม่ใช่ open
    point อีกต่อไป
13. **`POST /auth/pairing-codes`**: ยังไม่ระบุว่าอนุญาตให้มีรหัสที่ยังไม่หมดอายุ/ยังไม่ถูกใช้มากกว่า 1 รหัส
    ต่อ User Account เดียวกันพร้อมกันหรือไม่ (เช่น กดขอรหัสซ้ำก่อนรหัสเดิมหมดอายุ) — กระทบว่าควร invalidate
    รหัสเดิมทันทีหรือปล่อยให้ใช้ได้ทั้งคู่ และควรมี rate limit ต่อการกดขอรหัสซ้ำถี่ๆ หรือไม่ (brute-force
    risk ของรหัส 6 หลัก — เกี่ยวโยงกับจุดที่ 5 ข้างต้นเรื่อง rate limiting ที่ยังไม่มี requirement รองรับ)

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

> **อัปเดต 2026-08-30 (รอบ 5 — reconcile ตาม CLAUDE.md § "Docs/code drift")**: ทั้งหัวข้อ 6.3/6.3.1 ด้านล่าง
> เขียนใหม่ทั้งหมดจาก "Firebase Cloud Functions Routing" เป็น **"Express.js Routing บน Google Cloud
> Run"** ตามการ reconcile ของ `tech-stack.md` (2026-08-30) ที่ยืนยันแล้วว่าโค้ดจริง re-architecture ไปตั้งแต่
> 2026-08-29 (Express.js แทน Cloud Functions, `apps/web`/`apps/mobile` แยกกัน) — และเพิ่ม mapping ของ 2
> operation ใหม่ (`POST /auth/pairing-codes`, `.../redeem`) ที่ทำให้จำนวน operation ของหัวข้อ 3.1 เพิ่มจาก
> 8 เป็น **10** ทั้งหมดนี้เป็น mechanical re-sync ล้วน (ข้อเท็จจริงที่ตัดสินใจแล้วใน `tech-stack.md`) ไม่ใช่
> การตัดสินใจใหม่ในเอกสารนี้ — หัวข้อ 1-5 ข้างต้นไม่ต้องแก้ไขใดๆ เพิ่มเติมจากที่แก้ไปแล้วในหัวข้อ 3.1 (ดู
> อัปเดตล่าสุดด้านบนสุดของเอกสาร สำหรับการแก้ error case ของ `.../redeem` ที่เป็นการแก้เนื้อหาหลัก ไม่ใช่
> ภาคผนวกนี้)

มิเรอร์จาก [tech-stack.md § 6.3](tech-stack.md#63-api-specmds-rest-convention--expressjs-routing)
(อัปเดต 2026-08-30):

- **ทุก operation ในหัวข้อ 3 ต้อง implement เป็น Express route handler เอง** — Firestore **ไม่มี
  auto-generated REST API แบบ PostgREST ของ Supabase ให้ใช้ฟรี** ข้อเท็จจริงนี้ไม่เปลี่ยนไม่ว่าจะรันบน
  compute engine ไหน (Cloud Functions เดิม หรือ Express.js ปัจจุบัน) สิ่งที่เปลี่ยนคือรูปแบบไฟล์/การ mount
  route: **1 โฟลเดอร์ต่อ Conceptual Component** (`apps/web/server/routes/{component-slug}/`) ที่มี
  `index.ts` เป็น Express `Router()` รวม operation ทั้งหมดของ component นั้น แล้ว mount เข้า
  `apps/web/server/index.ts` ด้วย prefix `/api` ร่วมกัน — HTTP verb + resource path ของหัวข้อ 3 ยังคงตรง
  กับ Express route path 1:1 เหมือนเดิม (เพียงเติม prefix `/api`):
  - **Operation ที่เป็น CRUD ตรงไปตรงมา** (เช่น `GET /profile`, `GET /logs`, `GET /logs/{date}`,
    `GET /planner/week`, `GET /streak`) → Express route handler ที่ทำหน้าที่อ่าน/เขียน Firestore
    ตรงไปตรงมา (ไม่มีทางเลือก auto-generate เหมือน PostgREST เดิม)
  - **Operation ที่มี business logic/validation/เรียก external API** (เช่น `PUT /profile/goal`,
    `GET /workouts/today/recommendation`, `POST /workouts/sessions/{sessionId}/complete`,
    `POST /planner/days/{date}/cheat-rest`, ทุก endpoint ใต้ `/integrations/*`) → Express route handler
    เดียวกัน ผ่าน `authenticate` middleware กลาง (`apps/web/server/middleware/authenticate.ts`) ที่ตรวจ
    Firebase ID Token แล้วเซ็ต `req.userId` แทนที่ `request.auth.uid` อัตโนมัติของ Cloud Functions'
    `onCall()` เดิม — รันบน **Google Cloud Run** (deploy จาก container image เดียว ครอบคลุมทั้ง Express
    + built web client) แทนที่ Firebase Hosting + Cloud Functions เดิม

### 6.3.1 หัวข้อ 3.1 Account & Session Management (รวม Identity Handoff) — ข้อยกเว้นของกติกาข้างต้น

มิเรอร์จาก [tech-stack.md § 6.3.1](tech-stack.md#631-account--session-management-onb-0--identity-handoff--ข้อยกเว้นของกติกาข้างต้น)
(อัปเดต 2026-08-30): หัวข้อ 3.1 มี **10 operation** แล้ว (2 ใหม่คือ `POST /auth/pairing-codes` และ
`.../redeem` สำหรับกลไก identity handoff) — ส่วนใหญ่ยังไม่เข้ากติกา "ทุก operation ต้องเป็น Express route"
ข้างต้น เพราะ Firebase Authentication (ต่างจาก Firestore) มี client SDK ที่ทำหน้าที่นี้ให้โดยตรงอยู่แล้ว
**ยกเว้น 2 operation ใหม่ของกลไก pairing-code ที่ต้องเป็น Express route จริง** เพราะ Firebase
Authentication ไม่มีแนวคิด "device-pairing code" ให้ใช้สำเร็จรูปในตัว SDK:

| Operation (หัวข้อ 3.1) | Express.js/Firebase Implementation |
|---|---|
| `POST /auth/signup/email` | **Client SDK โดยตรง** — ไม่ต้องมี Express route |
| `POST /auth/signup/google` | **Client SDK โดยตรง** — เป็น SDK call เดียวกันเป๊ะกับ `POST /auth/login/google` (Firebase ไม่มี endpoint แยก signup/login สำหรับ OAuth provider — client อ่าน flag "ผู้ใช้ใหม่หรือไม่" ที่ SDK คืนมาเพื่อตัดสินเส้นทางต่อแทนการแยก route) |
| `POST /auth/signup/apple` | **Client SDK โดยตรง** — เป็น SDK call เดียวกันเป๊ะกับ `POST /auth/login/apple` เช่นเดียวกับ Google ข้างต้น |
| `POST /auth/login/email` | **Client SDK โดยตรง** — ไม่ต้องมี Express route |
| `POST /auth/login/google` | **Client SDK เดียวกับ `POST /auth/signup/google`** เป๊ะ |
| `POST /auth/login/apple` | **Client SDK เดียวกับ `POST /auth/signup/apple`** เป๊ะ |
| `POST /auth/forgot-password` | **Express route** `POST /api/auth/forgot-password` (`apps/web/server/routes/account-session/forgotPassword.ts`, ไม่มี `authenticate` middleware — precondition คือยังไม่มี session) — operation เดียวในกลุ่ม auth เดิมที่ต้องเป็น route จริงเพราะต้อง enforce เงื่อนไข `422` ("บัญชีนี้สมัครผ่าน Google/Apple ไม่มีรหัสผ่านให้รีเซ็ต") ซึ่ง client SDK เพียงอย่างเดียวไม่รองรับการแยกกรณีนี้ |
| `POST /auth/logout` | **Client SDK โดยตรง** — ล้าง token ที่ client เก็บไว้ทันที ไม่มี server-side session ให้ invalidate ฝั่ง Express จึงไม่ต้องมี route |
| `POST /auth/pairing-codes` (ใหม่ 2026-08-30) | **Express route** `POST /api/pairing/create-code` (`apps/web/server/routes/pairing/index.ts`, ต้องผ่าน `authenticate` middleware ก่อนเสมอ) สร้าง document ใหม่ที่ `pairingCodes/{code}` (top-level collection, รหัส 6 หลักเป็น document ID เอง) เก็บ `uid`/`createdAt`/`expiresAt` (TTL 5 นาที) แล้วคืนรหัส + เวลาหมดอายุ |
| `POST /auth/pairing-codes/redeem` (ใหม่ 2026-08-30) | **Express route** `POST /api/pairing/redeem` (**ข้อยกเว้นเดียว** ไม่มี `authenticate` middleware) อ่าน `pairingCodes/{code}`, ถ้าไม่พบหรือหมดอายุ (`expiresAt < now`) คืน `410 Gone`, ถ้าสำเร็จ `delete()` document ทิ้งทันที (single-use ผ่านการลบ ไม่ใช่ set `is_used` flag) แล้วเรียก `auth.createCustomToken(uid)` คืน custom token — status code `410` ครอบคลุมทั้ง "ไม่พบ"/"หมดอายุ"/"ถูกใช้ไปแล้ว" เป็นเงื่อนไขเดียว เพราะเมื่อ document ถูกลบไปแล้ว 3 กรณีนี้แยกไม่ออกจากกันอีกต่อไป (แก้ error case ในหัวข้อ 3.1 ให้ตรงกับพฤติกรรมนี้แล้ว 2026-08-30 รอบ 5) |

**สรุป**: จาก 10 operation มี 7 ตัวเป็น client SDK call ตรง (Google/Apple signup กับ login เป็น SDK call
เดียวกันจริงๆ) และ 3 ตัวเป็น Express route จริง (`forgot-password`, `pairing-codes`,
`pairing-codes/redeem`) — ต่างจาก component อื่นทุกตัวในหัวข้อ 6.3 ที่ต้องเขียน route ครอบทุก operation
เพราะ Firestore ไม่มี auto-generated API — เป็นข้อยกเว้นโดยธรรมชาติของบริการ Firebase Authentication เอง
สำหรับ 7 ใน 10 operation ส่วน 2 operation ของกลไก pairing-code ต้องเป็น route เพราะเป็นตรรกะที่ทีมออกแบบเอง
ไม่มีใน SDK ให้ใช้สำเร็จรูป ไม่ใช่การเลือก stack ใหม่

ดู [tech-stack.md](tech-stack.md) สำหรับ mapping ที่เหลือ (HLA Component → implementation, logical
type → Firestore field type) และเหตุผลการเลือก stack
