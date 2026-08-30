# Test Cases: Smart Integrations (INT-0, INT-1, INT-2, INT-3)

- **ประเภทเอกสาร:** Test Cases (ต่อ Epic — ไฟล์นี้ครอบคลุมเฉพาะ Epic 4: Smart Integrations)
- **สถานะเอกสาร:** Draft
- **วันที่สร้าง:** 2026-08-27
- **สร้างโดย:** skill `test-suite-builder`

เอกสารนี้ให้ step-by-step test case ของทุก Feature ใน Epic 4 (Smart Integrations: **INT-0, INT-1, INT-2,
INT-3**) สร้างจาก [acceptance-criteria.md](../../../01-requirements/acceptance-criteria.md) (Epic 4 section
— AC-INT-0-01 ถึง AC-INT-3-03, อัปเดต 2026-08-29 ด้วย AC-INT-1-04/AC-INT-3-03 จาก NFR-13/NFR-12, อัปเดต
2026-08-30 ด้วยการย้าย AC-INT-2-03–06/AC-INT-3-04 เดิมมาเป็น AC-INT-0-01–04 หลัง `feature-list-journey`
ตั้ง Feature ID **INT-0**/REQ-18 ให้กลไกรหัสจับคู่อุปกรณ์เป็นของตัวเอง, อัปเดต 2026-08-31 ด้วย
AC-INT-1-05 ถึง AC-INT-1-07 ใหม่ ครอบคลุม operation `GET /insights/weight-records`) ร่วมกับ [backlog.md](../../../01-requirements/backlog.md#int-0--ยืนยันตัวตนก่อนจับคู่อุปกรณ์ผ่านรหัสจับคู่-pairing-code)
(คำอธิบาย feature), [01-spec/20260823-04-smart-integrations.md](../../../01-requirements/01-spec/20260823-04-smart-integrations.md)
(REQ-18/11/12/13 และค่าคงที่ 7,700 kcal ≈ 1 กก.), และ
[user-journeys.md](../../../02-design/01-prototypes/user-journeys.md#epic-4-smart-integrations) (flow/Alt-Edge
Case) — ตาม methodology ของ `test-suite-builder` เอกสารทั้งสี่นี้เป็น read-only upstream ไฟล์นี้ไม่แก้ไข

> **หมายเหตุขอบเขต**: ตาม [test-plan.md §1](../test-plan.md#1-ขอบเขต-scope) Epic 4 ทั้งหมดเป็น MoSCoW
> **Could** และ**อยู่นอกขอบเขตการ execute ของรอบทดสอบปัจจุบัน** (ยังไม่ถูก implement จริง) — ไฟล์นี้เตรียม
> test case ไว้ล่วงหน้าตามที่ scope ของ `test-suite-builder` กำหนด (default = full backlog coverage)
> เพื่อให้พร้อมใช้ execute ทันทีเมื่อ Epic 4 ถูกหยิบขึ้นมา implement จริง — **ข้อยกเว้น (เพิ่ม 2026-08-30)**:
> TC-INT-0-001 ถึง TC-INT-0-005 และ TC-INT-3-004 (กลไกรหัสจับคู่อุปกรณ์ pairing-code — ย้ายจาก
> TC-INT-2-003 ถึง TC-INT-2-007 เดิม หลัง INT-0/REQ-18 เป็น Feature ID ทางการ) **execute ได้จริงแล้ว
> ในรอบนี้** แม้ INT-2/INT-3 เองยังเป็น Could/นอกขอบเขต เพราะ backend จริงของกลไกนี้ implement แล้วที่
> `apps/web/server/routes/pairing/index.ts` — ดู [test-plan.md §4 R14](../test-plan.md#4-risk-management)

**ตัวอย่างหน้าจอที่เกี่ยวข้อง** (prototype `v1`):
[10-progress-insights.html](../../../02-design/01-prototypes/v1/10-progress-insights.html) (INT-1),
[11-device-integrations.html](../../../02-design/01-prototypes/v1/11-device-integrations.html) (INT-2/INT-3
รายการอุปกรณ์),
[12-device-pairing.html](../../../02-design/01-prototypes/v1/12-device-pairing.html) (INT-2/INT-3
flow การจับคู่/fallback)

รูปแบบ ID: `TC-{FeatureID}-{3-digit}` เช่น `TC-INT-1-001`

## Persona ทดสอบร่วม (ใช้ตลอดทั้งไฟล์เพื่อความสอดคล้องของข้อมูล)

ผู้ใช้ประจำที่ผ่าน onboarding แล้ว: อายุ 30 ปี เพศชาย ส่วนสูง 170 ซม. น้ำหนักปัจจุบัน (ก่อนซิงค์) 80.0 กก.
Activity Factor 1.55 (ตัวอย่างระดับกิจกรรมปานกลาง) → TDEE เดิม = 10×80 + 6.25×170 − 5×30 + 5 = 1,717.5 BMR
× 1.55 = **2,662 kcal/วัน** เป้าหมายหลัก = ลดน้ำหนัก (ONB-3: TDEE − 500) → เป้าหมายแคลอรี่รายวัน =
**2,162 kcal/วัน** เป้าหมายน้ำหนัก = 75.0 กก.

---

## สารบัญ

- [INT-0 — ยืนยันตัวตนก่อนจับคู่อุปกรณ์ผ่านรหัสจับคู่](#int-0--ยืนยันตัวตนก่อนจับคู่อุปกรณ์ผ่านรหัสจับคู่-req-18)
  — TC-INT-0-001 ถึง 005 (renumbering 2026-08-30 จาก TC-INT-2-003 ถึง 007 เดิม)
- [INT-1 — พยากรณ์วันถึงเป้าหมายน้ำหนัก](#int-1--พยากรณ์วันถึงเป้าหมายน้ำหนัก) — TC-INT-1-001 ถึง 008
  (006–008 เพิ่ม 2026-08-31, `GET /insights/weight-records`)
- [INT-2 — ซิงค์ตาชั่งอัจฉริยะ](#int-2--ซิงค์ตาชั่งอัจฉริยะ) — TC-INT-2-001 ถึง 002 (003–007 เดิมย้ายไป
  INT-0 แล้วเมื่อ 2026-08-30)
- [INT-3 — ซิงค์ข้อมูล Wearable](#int-3--ซิงค์ข้อมูล-wearable) — TC-INT-3-001 ถึง 004 (004 เพิ่ม 2026-08-30,
  cross-reference ไปยัง TC-INT-0-005 อัปเดต 2026-08-30 รอบ renumbering)

---

## INT-0 — ยืนยันตัวตนก่อนจับคู่อุปกรณ์ผ่านรหัสจับคู่ (REQ-18)

REQ-18 · Spec: [01-spec/20260823-04-smart-integrations.md](../../../01-requirements/01-spec/20260823-04-smart-integrations.md) ·
AC: [acceptance-criteria.md#int-0--ยืนยันตัวตนก่อนจับคู่อุปกรณ์ผ่านรหัสจับคู่-pairing-code](../../../01-requirements/acceptance-criteria.md#int-0--ยืนยันตัวตนก่อนจับคู่อุปกรณ์ผ่านรหัสจับคู่-pairing-code) ·
Journey: [user-journeys.md#int-0--ยืนยันตัวตนก่อนจับคู่อุปกรณ์ผ่านรหัสจับคู่-req-18](../../../02-design/01-prototypes/user-journeys.md#int-0--ยืนยันตัวตนก่อนจับคู่อุปกรณ์ผ่านรหัสจับคู่-req-18)

> **หมายเหตุ (renumbering, เพิ่ม 2026-08-30)**: TC-INT-0-001 ถึง TC-INT-0-005 ด้านล่างนี้ย้ายมาจาก
> TC-INT-2-003, TC-INT-2-004, TC-INT-2-005, TC-INT-2-006, TC-INT-2-007 เดิม ตามลำดับ หลังจาก
> `feature-list-journey` ตั้ง Feature ID **INT-0** พร้อม **REQ-18** ของตัวเองให้กลไกรหัสจับคู่อุปกรณ์
> (pairing-code identity handoff) แทนที่จะเป็น implicit precondition ของ INT-2 เนื้อหา Test Steps/
> Expected Result/Test Data ไม่เปลี่ยน มีแค่ ID/References/การจัดกลุ่มที่ปรับให้ตรง REQ-18 — ต่างจาก
> test case อื่นของ Epic 4 กลุ่มนี้ **execute ได้จริงในรอบนี้** แม้ INT-2/INT-3 เองยังเป็น Could/นอกขอบเขต
> เพราะ backend จริงของกลไกนี้มีอยู่แล้ว (`apps/web/server/routes/pairing/index.ts`, ดู
> [test-plan.md §4 R14](../test-plan.md#4-risk-management)) — endpoint จริงคือ
> `POST /api/pairing/create-code` (ต้องยืนยันตัวตนก่อนเรียก) และ `POST /api/pairing/redeem` (ไม่ต้อง
> ยืนยันตัวตน) ซึ่ง mount จริงต่างจากชื่อ conceptual `POST /auth/pairing-codes`/`.../redeem` ใน
> [api-spec.md §3.1](../../../02-design/02-technical/api-spec.md) (conceptual REST convention เทียบเท่ากัน
> — ดู mapping ที่ [tech-stack.md §6.3.1](../../../02-design/02-technical/tech-stack.md))

### TC-INT-0-001 — ขอรหัสจับคู่อุปกรณ์จากเว็บสำเร็จ (mint pairing-code, ต้องยืนยันตัวตนก่อน)

- **Pre-condition**: ผู้ใช้ (persona ด้านบน) ล็อกอินอยู่บนเว็บแอปแล้ว (ONB-0) มี session/ID token ที่ valid
  และเปิดหน้าโปรไฟล์
- **Test Steps**:
  1. ที่หน้าโปรไฟล์ กดปุ่ม "ขอรหัสจับคู่อุปกรณ์"
  2. Client เรียก `POST /api/pairing/create-code` พร้อม auth header ที่ valid
  3. สังเกต response และรหัสที่แสดงบนหน้าจอ
- **Expected Result**: Server สร้างเอกสาร `pairingCodes/{code}` ใหม่ใน Firestore ผูกกับ `uid` ของผู้ใช้คนนี้
  ตอบกลับ `201` พร้อม `{ code, expiresAt }` — `code` เป็นตัวเลข 6 หลัก และ `expiresAt` = เวลาปัจจุบัน + 5
  นาทีพอดี (ISO string) หน้าจอเว็บแสดงรหัส 6 หลักนั้นให้ผู้ใช้เห็นทันที
- **Test Data**: `uid` ตัวอย่าง = `"uid_test_001"`, เวลาที่เรียก = `2026-08-30T10:00:00.000Z` → คาดว่า
  `expiresAt` = `2026-08-30T10:05:00.000Z`, รูปแบบ `code` = ตัวเลข 6 หลัก เช่น `"482913"`
- **References**: REQ-18 · AC-INT-0-01 · [Smart Integrations spec § ข้อสมมติฐาน/การตัดสินใจที่ยืนยันแล้ว](../../../01-requirements/01-spec/20260823-04-smart-integrations.md#ข้อสมมติฐานการตัดสินใจที่ยืนยันแล้ว) ·
  [api-spec.md §3.1](../../../02-design/02-technical/api-spec.md) (`POST /auth/pairing-codes`, conceptual
  เทียบเท่า `POST /api/pairing/create-code` จริง) · [user-journeys.md#int-0--ยืนยันตัวตนก่อนจับคู่อุปกรณ์ผ่านรหัสจับคู่-req-18](../../../02-design/01-prototypes/user-journeys.md#int-0--ยืนยันตัวตนก่อนจับคู่อุปกรณ์ผ่านรหัสจับคู่-req-18)
  (steps 1–3) · [11-device-integrations.html](../../../02-design/01-prototypes/v1/11-device-integrations.html)
  (ปุ่ม "ขอรหัสจับคู่อุปกรณ์" แสดงรหัส 6 หลัก + expiry countdown)

### TC-INT-0-002 — กรอกรหัสจับคู่บนมือถือสำเร็จ แลกเป็น session แบบ silent (redeem สำเร็จ)

- **Pre-condition**: ผู้ใช้มีรหัสจับคู่ 6 หลักที่ยังไม่หมดอายุและยังไม่ถูกใช้จาก TC-INT-0-001 (`code = "482913"`,
  `uid = "uid_test_001"`) และเปิด companion app บนมือถือ (ไม่มีหน้าจอ auth ของตัวเอง)
- **Test Steps**:
  1. บน companion app กรอกรหัสจับคู่ = `482913`
  2. Client เรียก `POST /api/pairing/redeem` พร้อม body `{ "code": "482913" }` (ไม่มี auth header)
  3. สังเกต response ที่ได้กลับมา
  4. ตรวจสอบว่าเอกสาร `pairingCodes/482913` ใน Firestore ยังอยู่หรือไม่หลังเรียกเสร็จ
- **Expected Result**: Server ตรวจสอบว่ารหัสยังไม่หมดอายุ ลบเอกสาร `pairingCodes/482913` ทิ้งถาวรทันที
  (single-use) แล้วตอบกลับ `200` พร้อม Firebase custom token ที่ผูกกับ `uid = "uid_test_001"` — companion
  app ใช้ token นั้น sign in แบบ silent (ไม่ต้องกรอก credential ใด ๆ) แล้วเข้าสู่หน้าจับคู่อุปกรณ์จริง
  (device-pairing) เอกสาร `pairingCodes/482913` ไม่มีอยู่ใน Firestore อีกต่อไปหลังจากนี้
- **Test Data**: `code` ที่กรอก = `"482913"` (ยังไม่หมดอายุ ยังไม่ถูกใช้) → คาดว่าได้ `customToken` ที่ decode
  แล้วมี `uid = "uid_test_001"`
- **References**: REQ-18 · AC-INT-0-02 · [api-spec.md §3.1](../../../02-design/02-technical/api-spec.md)
  (`POST /auth/pairing-codes/redeem`, conceptual เทียบเท่า `POST /api/pairing/redeem` จริง) ·
  [12-device-pairing.html](../../../02-design/01-prototypes/v1/12-device-pairing.html) ·
  [user-journeys.md#int-0--ยืนยันตัวตนก่อนจับคู่อุปกรณ์ผ่านรหัสจับคู่-req-18](../../../02-design/01-prototypes/user-journeys.md#int-0--ยืนยันตัวตนก่อนจับคู่อุปกรณ์ผ่านรหัสจับคู่-req-18)
  (steps 4–6)

### TC-INT-0-003 — รหัสจับคู่ไม่ถูกต้อง/หมดอายุ/ถูกใช้ไปแล้ว ระบบตอบ `410` กรณีเดียวเสมอ (consolidated)

> **หมายเหตุการรวม test case**: 3 variation ด้านล่าง (ไม่พบรหัสเลย/หมดอายุแล้ว/ถูกใช้ไปแล้ว) ถูกรวมไว้ใน
> test case เดียวกันโดยตั้งใจ — เพราะโค้ดจริง (`apps/web/server/routes/pairing/index.ts`) ลบเอกสาร Firestore
> ทิ้งทันทีที่ redeem สำเร็จครั้งแรก ทำให้ทั้ง 3 สถานการณ์คืนผลลัพธ์ที่**สังเกตไม่ออกว่าต่างกัน**จาก client
> ฝั่งเดียว (response เดียวกันทุกกรณี) การแยกเป็น 3 test case จะสื่อเป็นนัยผิด ๆ ว่ามี behavior ที่แยกจากกันจริง
> ทั้งที่ไม่มี — จึงเขียนเป็น 1 test case ที่มีหลาย Test Data variation แทน ตรงตาม decision ที่ resolve แล้ว
> ใน [api-spec.md §3.1](../../../02-design/02-technical/api-spec.md)

- **Pre-condition**: มี 3 สถานการณ์ทดสอบแยกกัน (ก) `code` ที่ไม่เคยถูกสร้างขึ้นมาเลย (ข) `code` ที่เคยสร้าง
  แต่หมดอายุแล้ว (เกิน 5 นาทีจากที่ mint) (ค) `code` ที่เคยสร้างและถูก redeem สำเร็จไปแล้วครั้งหนึ่ง (เช่น
  จาก TC-INT-0-002)
- **Test Steps** (ทำซ้ำทั้ง 3 สถานการณ์แยกกัน):
  1. Client เรียก `POST /api/pairing/redeem` พร้อม `code` ของสถานการณ์นั้น
  2. สังเกต response
- **Expected Result**: ทั้ง 3 สถานการณ์ ระบบตอบกลับ **`410 Gone`** พร้อมข้อความ error เดียวกัน
  (`"This code is invalid or has expired."`) เหมือนกันทุกกรณี — ไม่มีการแยกแยะให้ client ทราบว่าเป็นกรณี
  ไหน ไม่ mint token ใด ๆ ในทั้ง 3 กรณี
- **Test Data**:
  | สถานการณ์ | `code` ที่ส่งไป | ผลที่คาดหวัง |
  |---|---|---|
  | (ก) ไม่เคยมีอยู่จริง | `"000000"` (ไม่มีเอกสาร `pairingCodes/000000` ใน Firestore) | `410` |
  | (ข) หมดอายุแล้ว | `"482913"` แต่เรียกที่เวลา `2026-08-30T10:05:01.000Z` (เกิน `expiresAt` 1 วินาที) | `410` |
  | (ค) ถูกใช้ไปแล้ว | `"482913"` เรียกซ้ำอีกครั้งหลัง TC-INT-0-002 redeem สำเร็จไปแล้ว (เอกสารถูกลบไปแล้ว) | `410` |
- **References**: REQ-18 · AC-INT-0-03 · [api-spec.md §3.1](../../../02-design/02-technical/api-spec.md)
  (`POST /auth/pairing-codes/redeem` — แก้ error case เป็น `410` กรณีเดียวเมื่อ 2026-08-30 รอบ 5) ·
  [12-device-pairing.html](../../../02-design/01-prototypes/v1/12-device-pairing.html) (สถานะรหัสไม่ถูกต้อง)

### TC-INT-0-004 — รหัสจับคู่หมดอายุตามเวลา TTL 5 นาทีพอดี (expiry timing boundary)

- **Pre-condition**: ผู้ใช้มีรหัสจับคู่ที่เพิ่ง mint จาก `POST /api/pairing/create-code` ที่เวลา
  `2026-08-30T10:00:00.000Z` (`expiresAt = 2026-08-30T10:05:00.000Z`)
- **Test Steps**:
  1. เรียก `POST /api/pairing/redeem` ด้วยรหัสเดิม ที่เวลา `2026-08-30T10:04:59.000Z` (ก่อนหมดอายุ 1 วินาที)
  2. สังเกต response ของขั้นตอนที่ 1
  3. ขอรหัสใหม่ mint อีกครั้งที่เวลา `2026-08-30T10:00:00.000Z` (`expiresAt` เดิม) แล้วเรียก redeem ด้วยรหัส
     เดิมที่เวลา `2026-08-30T10:05:00.000Z` พอดี (ตรงกับ `expiresAt` เป๊ะ)
  4. สังเกต response ของขั้นตอนที่ 3
- **Expected Result**: ขั้นตอนที่ 1 (ก่อนหมดอายุ 1 วินาที) → redeem สำเร็จ `200` พร้อม custom token —
  ขั้นตอนที่ 3 (ตรงกับเวลาหมดอายุพอดี, เงื่อนไขโค้ดจริงคือ `new Date(data.expiresAt) < new Date()`) →
  เวลาปัจจุบันไม่ได้ "น้อยกว่า" `expiresAt` อย่างเคร่งครัด (เท่ากันพอดี) จึงยังไม่ถือว่าหมดอายุ **redeem
  สำเร็จ** `200` เช่นกัน (boundary นี้ inclusive ที่ฝั่ง valid ตามเงื่อนไขโค้ดจริง ไม่ใช่ exclusive) — ต้อง
  ทดสอบที่ 1 มิลลิวินาทีหลัง `expiresAt` แยกต่างหาก (ดู TC-INT-0-003 สถานการณ์ (ข)) เพื่อยืนยันฝั่งหมดอายุจริง
- **Test Data**: `expiresAt` = `2026-08-30T10:05:00.000Z`; เวลาทดสอบ (1) = `10:04:59.000Z` (ก่อนหมดอายุ,
  คาดว่า `200`), เวลาทดสอบ (2) = `10:05:00.000Z` พอดี (คาดว่า `200` ตาม boundary inclusive ของโค้ดจริง),
  เทียบกับ TC-INT-0-003 (ข) ที่ `10:05:01.000Z` (คาดว่า `410`)
- **References**: REQ-18 · AC-INT-0-03 · [api-spec.md §3.1](../../../02-design/02-technical/api-spec.md) ·
  [13-companion-pairing-code.html](../../../02-design/01-prototypes/v1/13-companion-pairing-code.html)
  (สถานะรหัสไม่ถูกต้อง/หมดอายุ) — ไม่มีลิงก์ user-journeys.md เพราะเป็น boundary test ระดับ implementation
  ไม่ใช่ Alt/Edge Case ของ journey โดยตรง

### TC-INT-0-005 — ยังไม่ผ่านกลไกรหัสจับคู่ ระบบไม่ให้เข้าหน้าจับคู่อุปกรณ์บนมือถือ (precondition guard)

- **Pre-condition**: ผู้ใช้เปิด companion app บนมือถือเครื่องนี้เป็นครั้งแรก ยังไม่เคย redeem รหัสจับคู่
  อุปกรณ์สำเร็จเลย (ไม่มี session ที่ผูกกับบัญชีผู้ใช้ใด)
- **Test Steps**:
  1. เปิด companion app
  2. พยายาม navigate ไปหน้าจับคู่อุปกรณ์โดยตรง — ทดสอบแยกทั้ง 2 ปลายทาง: (ก) หน้าจับคู่ตาชั่งอัจฉริยะ
     (device-pairing, `device=scale`, ปลายทางของ INT-2) และ (ข) หน้าเชื่อมต่อ wearable (device-pairing,
     `device=wearable`, ปลายทางของ INT-3)
- **Expected Result**: ทั้ง 2 ปลายทาง แอปพามาที่หน้าจอกรอกรหัสจับคู่ (`pairing-code.tsx`) เหมือนกัน แทนที่
  จะให้เข้าหน้าจับคู่อุปกรณ์ได้โดยตรง — ต้อง redeem รหัสจับคู่สำเร็จก่อน (TC-INT-0-002) จึงจะเข้าหน้าจับคู่
  อุปกรณ์จริง (ปลายทางใดก็ได้) ได้
- **Test Data**: session ปัจจุบันของมือถือเครื่องนี้ = ไม่มี (ไม่เคย redeem มาก่อน)
- **References**: REQ-18 · AC-INT-0-04 · [user-journeys.md#onb-0--สมัครสมาชิก--เข้าสู่ระบบ--ลืมรหัสผ่าน--ออกจากระบบ-req-14-req-15-req-16-req-17](../../../02-design/01-prototypes/user-journeys.md#onb-0--สมัครสมาชิก--เข้าสู่ระบบ--ลืมรหัสผ่าน--ออกจากระบบ-req-14-req-15-req-16-req-17)
  (Alt/Edge Case: "ผู้ใช้เปิดแอปมือถือโดยยังไม่เคยสมัคร/เข้าสู่ระบบบนเว็บมาก่อน") ·
  [user-journeys.md#int-0--ยืนยันตัวตนก่อนจับคู่อุปกรณ์ผ่านรหัสจับคู่-req-18](../../../02-design/01-prototypes/user-journeys.md#int-0--ยืนยันตัวตนก่อนจับคู่อุปกรณ์ผ่านรหัสจับคู่-req-18)
  · flow เชิงเส้น [11-device-integrations.html](../../../02-design/01-prototypes/v1/11-device-integrations.html) →
  [13-companion-pairing-code.html](../../../02-design/01-prototypes/v1/13-companion-pairing-code.html) →
  [12-device-pairing.html](../../../02-design/01-prototypes/v1/12-device-pairing.html) (ปลายทางเป็นหน้า
  จับคู่ตาชั่งหรือหน้าเชื่อมต่อ wearable แล้วแต่ผู้ใช้เลือก — ดู TC-INT-3-004 สำหรับ cross-reference
  ปลายทาง wearable โดยเฉพาะ)

---

## INT-1 — พยากรณ์วันถึงเป้าหมายน้ำหนัก

REQ-11 · Spec: [01-spec/20260823-04-smart-integrations.md](../../../01-requirements/01-spec/20260823-04-smart-integrations.md) ·
AC: [acceptance-criteria.md#int-1--พยากรณ์วันถึงเป้าหมายน้ำหนัก](../../../01-requirements/acceptance-criteria.md#int-1--พยากรณ์วันถึงเป้าหมายน้ำหนัก) ·
Journey: [user-journeys.md#int-1--พยากรณ์วันถึงเป้าหมายน้ำหนัก-req-11](../../../02-design/01-prototypes/user-journeys.md#int-1--พยากรณ์วันถึงเป้าหมายน้ำหนัก-req-11)

### TC-INT-1-001 — เห็นวันที่คาดว่าจะถึงเป้าหมายน้ำหนัก (คำนวณจากอัตราขาดดุลเฉลี่ยจริง)

- **Pre-condition**: ผู้ใช้ (persona ด้านบน) มีเป้าหมายน้ำหนัก 75.0 กก. บันทึกไว้ (จาก ONB-3) และมีประวัติ
  log แคลอรี่จริงสะสมจาก PLN-3 เพียงพอ โดยอัตราขาดดุลเฉลี่ยที่คำนวณได้จาก log ไม่เป็น 0 และสอดคล้องกับ
  ทิศทางเป้าหมาย (ลดน้ำหนัก)
- **Test Steps**:
  1. เปิดแอปและไปที่แท็บ "ความคืบหน้า" (Progress/Insights)
  2. สังเกตค่าที่แสดงในการ์ดพยากรณ์ (forecast card)
- **Expected Result**: ระบบแสดงวันที่คาดว่าจะถึงเป้าหมายน้ำหนัก โดยคำนวณตามสูตร: น้ำหนักที่ต้องลด =
  80.0 − 75.0 = 5.0 กก. → แคลอรี่รวมที่ต้องขาดดุล = 5.0 × 7,700 = 38,500 kcal → จำนวนวัน = 38,500 ÷ 500
  (อัตราขาดดุลเฉลี่ย/วัน) = **77 วัน** จากวันที่เปิดหน้า (ถ้าเปิดหน้าวันที่ 27 ส.ค. 2569 → วันที่คาดการณ์ที่
  แสดง = **12 พ.ย. 2569**) พร้อมแสดงอัตราขาดดุลเฉลี่ยและน้ำหนักปัจจุบันประกอบ
- **Test Data**: น้ำหนักปัจจุบัน 80.0 กก. เป้าหมาย 75.0 กก. อัตราขาดดุลเฉลี่ยจาก log จริงย้อนหลัง =
  500 kcal/วัน (ตรงกับเป้าหมายแคลอรี่รายวัน TDEE−500 พอดี) วันที่เปิดหน้าอ้างอิง = 27 ส.ค. 2569
- **References**: REQ-11 · AC-INT-1-01 · [user-journeys.md#int-1--พยากรณ์วันถึงเป้าหมายน้ำหนัก-req-11](../../../02-design/01-prototypes/user-journeys.md#int-1--พยากรณ์วันถึงเป้าหมายน้ำหนัก-req-11) ·
  [10-progress-insights.html](../../../02-design/01-prototypes/v1/10-progress-insights.html) (สถานะ `forecastState`)

### TC-INT-1-002 — ประวัติ log ไม่เพียงพอ แสดง empty state แทนวันที่พยากรณ์

- **Pre-condition**: ผู้ใช้เพิ่งผ่าน onboarding และตั้งเป้าหมายน้ำหนัก 75.0 กก. แต่ยังมีประวัติ log แคลอรี่
  จริงสะสมน้อยมาก (เช่น เพิ่งเริ่มใช้แอป 1 วัน)
- **Test Steps**:
  1. เปิดแอปและไปที่แท็บ "ความคืบหน้า"
  2. สังเกตเนื้อหาที่แสดงแทนการ์ดพยากรณ์
- **Expected Result**: ระบบไม่แสดงวันที่คาดการณ์ใด ๆ แต่แสดง empty state ที่มีข้อความทั่วไปว่ายังพยากรณ์
  ไม่ได้และต้องสะสมข้อมูลเพิ่ม (เช่น "ยังต้องบันทึกผลอีกสักระยะก่อนเริ่มพยากรณ์ได้") พร้อมปุ่มพาไปบันทึกผล —
  **ทดสอบเฉพาะว่า empty state ปรากฏและไม่มีวันที่ปลอมแสดงขึ้นมา ไม่ทดสอบจำนวนวันขั้นต่ำที่แน่นอน** เพราะ
  เกณฑ์ตัวเลขยังเป็น Open Question ที่ยังไม่ resolve (ดูหมายเหตุท้ายไฟล์)
- **Test Data**: เป้าหมายน้ำหนัก 75.0 กก. จำนวนวันที่มี log จริง = 1 วัน (ตัวอย่างกรณี "ข้อมูลยังไม่พอ"
  อย่างชัดเจน ไม่ใช่ค่าขอบเขต/threshold ที่แน่นอน)
- **References**: REQ-11 · AC-INT-1-02 · [user-journeys.md#int-1--พยากรณ์วันถึงเป้าหมายน้ำหนัก-req-11](../../../02-design/01-prototypes/user-journeys.md#int-1--พยากรณ์วันถึงเป้าหมายน้ำหนัก-req-11) ·
  [10-progress-insights.html](../../../02-design/01-prototypes/v1/10-progress-insights.html) (สถานะ `insufficientState`,
  demo toggle "ตัวอย่าง: ข้อมูลยังไม่พอ")

### TC-INT-1-003 — อัตราขาดดุลเฉลี่ยเป็น 0 แสดงข้อความแจ้งเตือนแทนวันที่

- **Pre-condition**: ผู้ใช้มีเป้าหมายน้ำหนัก 75.0 กก. และมีประวัติ log เพียงพอ แต่พฤติกรรมการกินจริงในช่วง
  ที่ผ่านมาทำให้อัตราขาดดุลเฉลี่ยที่คำนวณได้เท่ากับ 0
- **Test Steps**:
  1. เปิดแอปและไปที่แท็บ "ความคืบหน้า"
  2. สังเกตเนื้อหาที่แสดงแทนการ์ดพยากรณ์
- **Expected Result**: ระบบไม่แสดงวันที่คาดการณ์ (เพราะหารด้วยอัตรา 0 คำนวณวันไม่ได้จริง) แต่แสดงข้อความ
  แจ้งเตือนแทน (เช่น แจ้งว่ายังไม่สามารถพยากรณ์ได้จากอัตราการเปลี่ยนแปลงปัจจุบัน)
- **Test Data**: น้ำหนักปัจจุบัน 80.0 กก. เป้าหมาย 75.0 กก. อัตราขาดดุลเฉลี่ยจาก log จริงย้อนหลัง 14 วัน =
  **0 kcal/วัน**
- **References**: REQ-11 · AC-INT-1-03 (variation 1/2 — ดูหมายเหตุ Test Data variation ใน References ของ
  TC-INT-1-004 ด้วย) · [user-journeys.md#int-1--พยากรณ์วันถึงเป้าหมายน้ำหนัก-req-11](../../../02-design/01-prototypes/user-journeys.md#int-1--พยากรณ์วันถึงเป้าหมายน้ำหนัก-req-11) ·
  [10-progress-insights.html](../../../02-design/01-prototypes/v1/10-progress-insights.html)

### TC-INT-1-004 — อัตราขาดดุลเฉลี่ยสวนทางเป้าหมาย แสดงข้อความแจ้งเตือนแทนวันที่

- **Pre-condition**: ผู้ใช้มีเป้าหมายน้ำหนัก 75.0 กก. (ทิศทาง = ลดน้ำหนัก) และมีประวัติ log เพียงพอ แต่ log
  จริงย้อนหลังกลับแสดงว่าผู้ใช้กินเกิน (surplus) เฉลี่ยต่อวัน สวนทางกับทิศทางเป้าหมาย
- **Test Steps**:
  1. เปิดแอปและไปที่แท็บ "ความคืบหน้า"
  2. สังเกตเนื้อหาที่แสดงแทนการ์ดพยากรณ์
- **Expected Result**: ระบบไม่แสดงวันที่คาดการณ์ (เพราะทิศทางที่คำนวณได้สวนทางกับเป้าหมาย น้ำหนักจะห่าง
  เป้าหมายมากขึ้นไม่ใช่เข้าใกล้) แต่แสดงข้อความแจ้งเตือนแทน
- **Test Data**: น้ำหนักปัจจุบัน 80.0 กก. เป้าหมาย 75.0 กก. (ทิศทาง = ลด) แต่อัตราเฉลี่ยจาก log จริงย้อนหลัง
  14 วัน = **ส่วนเกิน (surplus) +150 kcal/วัน** (สวนทางเป้าหมายลดน้ำหนัก)
- **References**: REQ-11 · AC-INT-1-03 (variation 2/2 — TC-INT-1-003 และ TC-INT-1-004 ครอบคลุมทั้งสองกรณี
  ย่อยของ AC-INT-1-03: "เป็น 0" และ "สวนทางเป้าหมาย") ·
  [user-journeys.md#int-1--พยากรณ์วันถึงเป้าหมายน้ำหนัก-req-11](../../../02-design/01-prototypes/user-journeys.md#int-1--พยากรณ์วันถึงเป้าหมายน้ำหนัก-req-11) ·
  [10-progress-insights.html](../../../02-design/01-prototypes/v1/10-progress-insights.html)

### TC-INT-1-005 — กราฟแนวโน้มน้ำหนัก/แคลอรี่ใช้ earth-tone palette ไม่ใช้ red/green traffic-light (NFR-13)

> **หมายเหตุ scope**: เช่นเดียวกับ test case อื่นของ Epic 4 — test case นี้ **ยัง execute ไม่ได้ในรอบ
> ทดสอบปัจจุบัน** เพราะ INT-1 อยู่นอกขอบเขต execution (Could ตาม [test-plan.md
> §1](../test-plan.md#1-ขอบเขต-scope)) แม้เนื้อหา NFR-13 เองจะตรวจสอบได้ทันทีจาก prototype โดยไม่ต้องรอ
> backend ก็ตาม — เตรียมไว้ล่วงหน้าให้พร้อม execute เมื่อ Epic 4 เข้า scope

- **Pre-condition**: ผู้ใช้ (persona ด้านบน) เปิดหน้า Progress/Insights ที่มีกราฟแนวโน้มน้ำหนักแสดงอยู่
  เตรียมข้อมูลทดสอบ 2 ชุด: (a) แนวโน้มน้ำหนักลดลง และ (b) แนวโน้มน้ำหนักเพิ่มขึ้น (เช่น หลัง Cheat Day
  ต่อเนื่อง) เพื่อยืนยันว่าสีกราฟไม่เปลี่ยนตามทิศทางของตัวเลข
- **Test Steps**:
  1. เปิดหน้า Progress/Insights (prototype `10-progress-insights.html`) ด้วยชุดข้อมูล (a) แนวโน้มลดลง
  2. ตรวจสอบสีของเส้นข้อมูลจริงและเส้น/พื้นที่เป้าหมายในกราฟ
  3. สลับไปใช้ชุดข้อมูล (b) แนวโน้มเพิ่มขึ้น แล้วตรวจสอบสีของกราฟอีกครั้ง
- **Expected Result**: ทั้งสองชุดข้อมูล กราฟใช้สีเดียวกันเสมอ — เส้นข้อมูลจริงใช้ `--color-clay` เส้น/
  พื้นที่เป้าหมายใช้ `--color-sage` แบบจาง (opacity ~30%) ไม่มีการเปลี่ยนไปใช้สีแดง (red) เมื่อน้ำหนักเพิ่ม
  ขึ้น หรือสีเขียว (green) เมื่อน้ำหนักลดลง ตรงตามที่ [DESIGN.md
  §4.4](../../../02-design/01-prototypes/DESIGN.md) กำหนด
- **Test Data**: ชุด (a) แนวโน้มลดลง: น้ำหนัก 80.0 → 79.2 → 78.5 กก.; ชุด (b) แนวโน้มเพิ่มขึ้น: น้ำหนัก
  78.5 → 79.0 → 79.4 กก. — คาดหวังสีกราฟเดียวกัน (`--color-clay`/`--color-sage`) ในทั้งสองชุด
- **References**: REQ-11, NFR-13 · AC-INT-1-04 · [DESIGN.md §4.4](../../../02-design/01-prototypes/DESIGN.md) ·
  [10-progress-insights.html](../../../02-design/01-prototypes/v1/10-progress-insights.html) — ไม่มีลิงก์
  user-journeys.md เพราะ scenario นี้มาจาก NFR-13 ไม่ใช่ Alt/Edge Case ของ journey (ดูหมายเหตุใต้
  AC-INT-1-04 ใน acceptance-criteria.md)

### TC-INT-1-006 — ดูประวัติน้ำหนักเรียงจากเก่าไปใหม่ (`GET /insights/weight-records`, เพิ่ม 2026-08-31)

> **หมายเหตุ (เพิ่ม 2026-08-31)**: TC-INT-1-006 ถึง TC-INT-1-008 ครอบคลุม operation ใหม่
> `GET /insights/weight-records` ที่เพิ่มเข้า [api-spec.md §3.7](../../../02-design/02-technical/api-spec.md)
> เมื่อ 2026-08-31 (ก่อนหน้านี้ไม่มี test case ครอบคลุมเลย — coverage gap ที่พบระหว่าง self-freshness audit
> ของ `test-suite-builder`) — endpoint จริงคือ `GET /api/insights/weight-records`
> (`apps/web/server/routes/insights-forecast/index.ts`)

- **Pre-condition**: ผู้ใช้ (persona ด้านบน) มี Weight Record บันทึกไว้แล้ว 3 รายการ: `2026-08-20` = 80.0 กก.
  (กรอกเอง), `2026-08-25` = 79.6 กก. (กรอกเอง), `2026-08-30` = 79.2 กก. (ซิงค์จากตาชั่งอัจฉริยะ, ตรงกับ
  TC-INT-2-001)
- **Test Steps**:
  1. เปิดหน้า Progress/Insights ซึ่งเรียก `GET /api/insights/weight-records` โดยไม่ระบุช่วงวันที่
  2. สังเกตลำดับข้อมูลที่ใช้วาดกราฟแนวโน้มน้ำหนัก
- **Expected Result**: ระบบคืนรายการ Weight Record ทั้ง 3 รายการเรียง**จากเก่าไปใหม่**ตามเวลาที่บันทึก:
  `[{date: "2026-08-20", weightKg: 80.0}, {date: "2026-08-25", weightKg: 79.6}, {date: "2026-08-30",
  weightKg: 79.2}]` — กราฟแนวโน้มน้ำหนักบนหน้า Progress/Insights แสดงเส้นข้อมูลตามลำดับเวลาที่ถูกต้อง
- **Test Data**: 3 Weight Record: (`2026-08-20`, 80.0 กก.), (`2026-08-25`, 79.6 กก.), (`2026-08-30`, 79.2
  กก.) → ลำดับที่คาดหวัง = เก่าไปใหม่ตามที่ระบุ
- **References**: REQ-11 · AC-INT-1-05 · [api-spec.md §3.7](../../../02-design/02-technical/api-spec.md)
  (`GET /insights/weight-records`) · [10-progress-insights.html](../../../02-design/01-prototypes/v1/10-progress-insights.html) —
  ไม่มีลิงก์ user-journeys.md เพราะเป็นรายละเอียดระดับ endpoint ที่ journey ไม่ได้ลงรายละเอียดแยก (ดูหมายเหตุ
  ใต้ AC-INT-1-05 ใน acceptance-criteria.md)

### TC-INT-1-007 — กรองประวัติน้ำหนักด้วยช่วงวันที่ (optional `fromDate`/`toDate`)

- **Pre-condition**: ผู้ใช้มี Weight Record ชุดเดียวกับ TC-INT-1-006 (`2026-08-20` = 80.0 กก., `2026-08-25`
  = 79.6 กก., `2026-08-30` = 79.2 กก.)
- **Test Steps**:
  1. เรียก `GET /api/insights/weight-records?fromDate=2026-08-24&toDate=2026-08-30`
  2. สังเกตรายการที่ได้กลับมา
- **Expected Result**: ระบบคืนเฉพาะ Weight Record ที่บันทึกอยู่ในช่วง `2026-08-24` ถึง `2026-08-30` เท่านั้น
  คือ `2026-08-25` (79.6 กก.) และ `2026-08-30` (79.2 กก.) — ไม่รวม `2026-08-20` เพราะอยู่นอกช่วง ยังคงเรียง
  จากเก่าไปใหม่เหมือน TC-INT-1-006
- **Test Data**: `fromDate=2026-08-24`, `toDate=2026-08-30` → ผลลัพธ์ที่คาดหวัง = 2 รายการ (79.6 กก.,
  79.2 กก.) จากทั้งหมด 3 รายการ
- **References**: REQ-11 · AC-INT-1-06 · [api-spec.md §3.7](../../../02-design/02-technical/api-spec.md)
  (`GET /insights/weight-records` — request: ช่วงวันที่ optional) —
  ไม่มีลิงก์ user-journeys.md ด้วยเหตุผลเดียวกับ TC-INT-1-006

### TC-INT-1-008 — ยังไม่มี Weight Record เลย คืนรายการว่างเปล่า ไม่ error

- **Pre-condition**: ผู้ใช้เพิ่งผ่าน onboarding และยังไม่เคยมี Weight Record บันทึกไว้เลย (ยังไม่เคยกรอกน้ำหนัก
  หรือซิงค์จากตาชั่งอัจฉริยะ)
- **Test Steps**:
  1. เปิดหน้า Progress/Insights ครั้งแรก ซึ่งเรียก `GET /api/insights/weight-records`
  2. สังเกต response และเนื้อหาที่แสดงแทนกราฟแนวโน้มน้ำหนัก
- **Expected Result**: ระบบคืน `200 OK` พร้อมรายการว่างเปล่า (`[]`) — ไม่ใช่ error ใด ๆ — หน้าจอแสดง empty
  state ของกราฟแนวโน้มน้ำหนักแทนกราฟที่มีข้อมูลจริง
- **Test Data**: ผู้ใช้ไม่มี Weight Record ใด ๆ ในระบบ → คาดหวังผลลัพธ์ = `[]`
- **References**: REQ-11 · AC-INT-1-07 · [api-spec.md §3.7](../../../02-design/02-technical/api-spec.md)
  (`GET /insights/weight-records`) · [10-progress-insights.html](../../../02-design/01-prototypes/v1/10-progress-insights.html) —
  ไม่มีลิงก์ user-journeys.md ด้วยเหตุผลเดียวกับ TC-INT-1-006

---

## INT-2 — ซิงค์ตาชั่งอัจฉริยะ

REQ-12 · Spec: [01-spec/20260823-04-smart-integrations.md](../../../01-requirements/01-spec/20260823-04-smart-integrations.md) ·
AC: [acceptance-criteria.md#int-2--ซิงค์ตาชั่งอัจฉริยะ](../../../01-requirements/acceptance-criteria.md#int-2--ซิงค์ตาชั่งอัจฉริยะ) ·
Journey: [user-journeys.md#int-2--ซิงค์ตาชั่งอัจฉริยะ-req-12](../../../02-design/01-prototypes/user-journeys.md#int-2--ซิงค์ตาชั่งอัจฉริยะ-req-12)

> **หมายเหตุ (renumbering, เพิ่ม 2026-08-30)**: TC-INT-2-003 ถึง TC-INT-2-007 เดิม (กลไกรหัสจับคู่อุปกรณ์
> pairing-code identity handoff) ย้ายไปเป็น **TC-INT-0-001 ถึง TC-INT-0-005** ทั้งหมดแล้ว (ดู
> [INT-0 section](#int-0--ยืนยันตัวตนก่อนจับคู่อุปกรณ์ผ่านรหัสจับคู่-req-18) ด้านบน) เพราะกลไกนี้ได้รับ
> Feature ID/REQ-18 ของตัวเองแล้ว ไม่ใช่ precondition ทางเทคนิคที่ไม่มี REQ number แยกอีกต่อไป —
> precondition guard test case สำหรับปลายทางตาชั่งอัจฉริยะโดยเฉพาะ ดู **TC-INT-0-005**

### TC-INT-2-001 — จับคู่ตาชั่งสำเร็จ ซิงค์น้ำหนัก/องค์ประกอบร่างกายอัตโนมัติ และคำนวณ TDEE ใหม่

- **Pre-condition**: ผู้ใช้ (persona ด้านบน, น้ำหนักในโปรไฟล์ปัจจุบัน 80.0 กก., TDEE เดิม 2,662 kcal/วัน)
  อยู่ที่หน้าโปรไฟล์ และมีตาชั่งอัจฉริยะที่รองรับ Bluetooth
- **Test Steps**:
  1. ที่หน้าโปรไฟล์ ในส่วน "อุปกรณ์ที่เชื่อมต่อ" กดปุ่ม "เชื่อมต่อ" ที่แถว "ตาชั่งอัจฉริยะ"
  2. รอสถานะ "กำลังเชื่อมต่อ..." จนขึ้นสถานะ "เชื่อมต่อตาชั่งอัจฉริยะสำเร็จ"
  3. กลับไปหน้าโปรไฟล์ — ตาชั่งอยู่ในสถานะจับคู่แล้ว
  4. ผู้ใช้ขึ้นชั่งน้ำหนักบนตาชั่งที่จับคู่ไว้ ตาชั่งส่งค่าน้ำหนัก 79.2 กก. และเปอร์เซ็นต์ไขมัน 24.5% ผ่าน
     Bluetooth มาที่แอปโดยอัตโนมัติ
  5. เปิดหน้าโปรไฟล์/หน้าตั้งค่าข้อมูลส่วนตัว ตรวจสอบค่าน้ำหนักที่บันทึกไว้
- **Expected Result**: น้ำหนักในโปรไฟล์อัปเดตเป็น 79.2 กก. และองค์ประกอบร่างกาย (ไขมัน 24.5%) ถูกบันทึก
  โดยผู้ใช้ไม่ต้องกรอกเอง ระบบคำนวณ TDEE ใหม่ทันทีตามสูตร Mifflin-St Jeor (ONB-1): BMR ใหม่ =
  10×79.2 + 6.25×170 − 5×30 + 5 = 1,709.5 → TDEE ใหม่ = 1,709.5 × 1.55 = **2,650 kcal/วัน** (ลดลงจาก
  2,662 kcal/วัน เดิม) ค่านี้ถูกใช้เป็น baseline ต่อให้ REC-2 (คำนวณแคลอรี่เผาผลาญ) และ INT-1 (พยากรณ์)
  ในครั้งถัดไป
- **Test Data**: น้ำหนักก่อนซิงค์ 80.0 กก. → น้ำหนักหลังซิงค์จากตาชั่ง 79.2 กก., ไขมัน 24.5%, TDEE เดิม
  2,662 kcal/วัน → TDEE ใหม่ 2,650 kcal/วัน
- **References**: REQ-01, REQ-12 · AC-INT-2-01 (เชื่อมโยงกับ AC-ONB-1-03 เรื่องคำนวณ TDEE ใหม่) ·
  [user-journeys.md#int-2--ซิงค์ตาชั่งอัจฉริยะ-req-12](../../../02-design/01-prototypes/user-journeys.md#int-2--ซิงค์ตาชั่งอัจฉริยะ-req-12) ·
  [12-device-pairing.html?device=scale](../../../02-design/01-prototypes/v1/12-device-pairing.html) (สถานะ
  `successState`), [11-device-integrations.html](../../../02-design/01-prototypes/v1/11-device-integrations.html)

### TC-INT-2-002 — เชื่อมต่อตาชั่งไม่สำเร็จ fallback ให้กรอกน้ำหนักเอง

- **Pre-condition**: ผู้ใช้พยายามจับคู่/ซิงค์ตาชั่งอัจฉริยะ แต่การเชื่อมต่อ Bluetooth ขาดหายระหว่างทาง
- **Test Steps**:
  1. ที่หน้าโปรไฟล์ กดปุ่ม "เชื่อมต่อ" ที่แถว "ตาชั่งอัจฉริยะ"
  2. ระบบพยายามเชื่อมต่อแต่ล้มเหลว (Bluetooth timeout)
  3. สังเกตหน้าจอที่แสดงหลังเชื่อมต่อไม่สำเร็จ
  4. กรอกน้ำหนักด้วยตนเองในฟอร์มที่ปรากฏ แล้วกดบันทึก
- **Expected Result**: ระบบแสดงสถานะ "เชื่อมต่อตาชั่งอัจฉริยะไม่สำเร็จ" พร้อมตกกลับ (fallback) ไปยังฟอร์ม
  กรอกน้ำหนักด้วยตนเอง (stepper input) แทนการซิงค์อัตโนมัติ เมื่อผู้ใช้กรอกและบันทึก ค่าน้ำหนักที่กรอกเอง
  ถูกบันทึกลงโปรไฟล์เหมือนกับกรณีซิงค์อัตโนมัติสำเร็จ (นำไปคำนวณ TDEE ใหม่ต่อได้เช่นเดียวกับ TC-INT-2-001)
- **Test Data**: น้ำหนักที่กรอกเอง = 79.5 กก. (ปรับผ่านปุ่ม +/− ทีละ 0.1 กก. จากค่าตั้งต้นในฟอร์ม)
- **References**: REQ-12 · AC-INT-2-02 · [user-journeys.md#int-2--ซิงค์ตาชั่งอัจฉริยะ-req-12](../../../02-design/01-prototypes/user-journeys.md#int-2--ซิงค์ตาชั่งอัจฉริยะ-req-12) ·
  [12-device-pairing.html?device=scale](../../../02-design/01-prototypes/v1/12-device-pairing.html) (สถานะ
  `failureState` → `scaleFallbackForm`)

---

## INT-3 — ซิงค์ข้อมูล Wearable

REQ-13 · Spec: [01-spec/20260823-04-smart-integrations.md](../../../01-requirements/01-spec/20260823-04-smart-integrations.md) ·
AC: [acceptance-criteria.md#int-3--ซิงค์ข้อมูล-wearable](../../../01-requirements/acceptance-criteria.md#int-3--ซิงค์ข้อมูล-wearable) ·
Journey: [user-journeys.md#int-3--ซิงค์ข้อมูล-wearable-req-13](../../../02-design/01-prototypes/user-journeys.md#int-3--ซิงค์ข้อมูล-wearable-req-13)

### TC-INT-3-001 — มีข้อมูลจาก wearable ใช้แทนค่าประมาณจากสูตร MET

- **Pre-condition**: ผู้ใช้ (น้ำหนักหลังซิงค์จาก TC-INT-2-001 = 79.2 กก.) เชื่อมต่อ Wearable (เช่น Apple
  Watch) ผ่าน Apple Health สำเร็จแล้ว และกำลังเล่นวิดีโอออกกำลังกายประเภทคาร์ดิโอ ความเข้มข้นสูง
- **Test Steps**:
  1. เริ่มออกกำลังกายตามวิดีโอที่แนะนำ (REC-1) โดย wearable กำลังบันทึกอัตราการเต้นหัวใจอยู่
  2. ออกกำลังกายจนจบ/หยุดวิดีโอ ที่เวลาทำจริง 45 นาที
  3. Wearable ส่งค่าแคลอรี่ที่เผาผลาญจริง (จากอัตราการเต้นหัวใจ) มาที่แอป
  4. เปิดหน้าสรุปผลหลังออกกำลังกาย (workout result)
- **Expected Result**: ระบบใช้ค่าจาก wearable แทนค่าประมาณจากสูตร MET ในการบันทึกแคลอรี่ของเซสชันนี้ —
  ค่าประมาณจากสูตร MET ที่จะได้ถ้าไม่มี wearable = MET(8, คาร์ดิโอ/สูง) × 79.2 กก. × 0.75 ชม. =
  **475 kcal** แต่ค่าที่บันทึกจริงในหน้าสรุปผลและ log คือค่าจาก wearable = **520 kcal** (ไม่ใช่ 475)
  พร้อม label แหล่งที่มาว่า "จากข้อมูล wearable"
- **Test Data**: น้ำหนัก 79.2 กก., ประเภทคาร์ดิโอ, ความเข้มข้นสูง (MET ตัวอย่าง = 8), เวลาที่ทำจริง 45 นาที
  (0.75 ชม.) → ค่าประมาณ MET = 475 kcal, ค่าจาก wearable ที่ใช้จริง = 520 kcal
- **References**: REQ-05, REQ-13 · AC-INT-3-01 (เชื่อมโยงกับ AC-REC-2-03) ·
  [user-journeys.md#int-3--ซิงค์ข้อมูล-wearable-req-13](../../../02-design/01-prototypes/user-journeys.md#int-3--ซิงค์ข้อมูล-wearable-req-13) ·
  [07-workout-result.html](../../../02-design/01-prototypes/v1/07-workout-result.html) (สถานะ "จากข้อมูล
  wearable"), [11-device-integrations.html](../../../02-design/01-prototypes/v1/11-device-integrations.html)

### TC-INT-3-002 — Wearable ไม่ได้เชื่อมต่อ/ข้อมูลไม่ครบ ใช้ค่าประมาณจากสูตร MET แทนชั่วคราว

- **Pre-condition**: ผู้ใช้ (น้ำหนัก 79.2 กก.) กำลังออกกำลังกายวิดีโอประเภทคาร์ดิโอ ความเข้มข้นสูงเช่นเดียว
  กับ TC-INT-3-001 แต่ครั้งนี้ไม่ได้เชื่อมต่อ wearable (หรือข้อมูลจาก wearable มาไม่ครบ/ล่าช้า)
- **Test Steps**:
  1. เริ่มออกกำลังกายตามวิดีโอที่แนะนำ โดยไม่มี wearable เชื่อมต่ออยู่
  2. ออกกำลังกายจนจบ/หยุดวิดีโอ ที่เวลาทำจริง 45 นาที
  3. เปิดหน้าสรุปผลหลังออกกำลังกาย
- **Expected Result**: ระบบใช้ค่าประมาณจากสูตร MET (REC-2) แทนชั่วคราว: kcal = MET(8) × 79.2 กก. ×
  0.75 ชม. = **475 kcal** พร้อม label แหล่งที่มาว่า "ประมาณจากสูตร MET" ค่านี้ถูกใช้ต่อในการบันทึก log
  (PLN-3) จนกว่าจะมีข้อมูล wearable ที่สมบูรณ์
- **Test Data**: น้ำหนัก 79.2 กก., ประเภทคาร์ดิโอ, ความเข้มข้นสูง (MET ตัวอย่าง = 8), เวลาที่ทำจริง 45
  นาที (0.75 ชม.) → ค่าที่บันทึกจริง = 475 kcal (ไม่มี wearable ให้เทียบ)
- **References**: REQ-05, REQ-13 · AC-INT-3-02 (เชื่อมโยงกับ AC-REC-2-01) ·
  [user-journeys.md#int-3--ซิงค์ข้อมูล-wearable-req-13](../../../02-design/01-prototypes/user-journeys.md#int-3--ซิงค์ข้อมูล-wearable-req-13) ·
  [07-workout-result.html](../../../02-design/01-prototypes/v1/07-workout-result.html) (สถานะ "ประมาณจาก
  สูตร MET")

### TC-INT-3-003 — ส่ง sessionId ที่ไม่มีอยู่จริงมากับ wearable reading ระบบต้อง reject ก่อนเขียนข้อมูล (NFR-12)

> **หมายเหตุ testability**: เช่นเดียวกับ TC-REC-2-005 — ตาม [test-plan.md §4 Risk
> R12](../test-plan.md#4-risk-management) test case นี้ **ยัง execute ไม่ได้ในรอบนี้** เพราะต้องการ
> backend/Cloud Function จริงที่ยังไม่มีในโปรเจกต์ (นอกจากนี้ INT-3 เองก็อยู่นอกขอบเขต execution อยู่แล้ว
> เพราะเป็น Epic 4/Could) — เตรียมไว้ล่วงหน้าตามหลักฐานใน database-schema.md §8.3

- **Pre-condition**: ผู้ใช้เชื่อมต่อ wearable สำเร็จแล้ว (INT-3) แต่ wearable device ส่งค่าแคลอรี่มาพร้อม
  `sessionId` ที่ไม่ตรงกับ Workout Session ใดของผู้ใช้ในระบบ เช่น session ถูกลบไปแล้วหรือหมดอายุ
  (ตัวอย่าง `sessionId` = `"sess_x9y8z7"`)
- **Test Steps**:
  1. Wearable ส่งค่าแคลอรี่ที่เผาผลาญ (เช่น 300 kcal) มาที่ `POST /integrations/wearable/readings`
     พร้อม `sessionId` = `"sess_x9y8z7"`
  2. สังเกต response ของ endpoint
  3. ตรวจสอบว่ามี Wearable Reading ใหม่ถูกบันทึกจากคำขอนี้หรือไม่
  4. ตรวจสอบว่า workout result ของ session จริง (ถ้ามี) ยังใช้ค่าประมาณจากสูตร MET ตามปกติหรือไม่
- **Expected Result**: ระบบตรวจสอบว่า session ปลายทางมีอยู่จริงและเป็นของผู้ใช้คนเดียวกันก่อนเขียน
  Wearable Reading เสมอ (referential existence validation ตาม NFR-12 — ดู database-schema.md §8.3 ที่
  ยกตัวอย่าง `sessionId` ใน endpoint นี้ไว้ตรง) พบว่าไม่มีอยู่จริง จึงปฏิเสธคำขอ ไม่บันทึก Wearable
  Reading ใด ๆ และค่าที่ใช้แทนค่าประมาณ MET ของ session ที่แท้จริงจึงไม่ถูกเปลี่ยนแปลงจากคำขอนี้
- **Test Data**: `sessionId` ทดสอบ = `"sess_x9y8z7"` (ไม่มีอยู่จริง), ค่าแคลอรี่จาก wearable ที่ส่งมา =
  300 kcal (ค่าตัวอย่าง ไม่มีผลต่อผลลัพธ์เพราะคำขอถูก reject)
- **References**: REQ-13, NFR-12 · AC-INT-3-03 ·
  [database-schema.md §8.3](../../../02-design/02-technical/database-schema.md#83-fk--constraint-enforcement-migration-ย้ายจาก-schema-level-ไป-cloud-function) ·
  [api-spec.md §3.7](../../../02-design/02-technical/api-spec.md) — ไม่มีลิงก์ user-journeys.md เพราะ
  scenario นี้เป็นระดับ API/backend validation ไม่ใช่ Alt/Edge Case ของ journey (ดูหมายเหตุใต้
  AC-INT-3-03 ใน acceptance-criteria.md)

### TC-INT-3-004 — ยังไม่ผ่านกลไกรหัสจับคู่ ระบบไม่ให้เข้าหน้าเชื่อมต่อ wearable บนมือถือ (precondition guard, เพิ่ม 2026-08-30)

> **หมายเหตุ (อัปเดต 2026-08-30 รอบ renumbering)**: กลไก pairing-code เดียวกันกับ **TC-INT-0-001 ถึง
> TC-INT-0-005** (เดิมคือ TC-INT-2-003 ถึง 007 ก่อนที่กลไกนี้จะได้ Feature ID/REQ-18 ของตัวเอง — ดู
> [INT-0 section](#int-0--ยืนยันตัวตนก่อนจับคู่อุปกรณ์ผ่านรหัสจับคู่-req-18) ด้านบน) — test case นี้ยืนยัน
> เฉพาะส่วนที่ต่างจาก TC-INT-0-005 คือปลายทางหลัง redeem สำเร็จเป็นหน้าเชื่อมต่อ wearable แทนหน้าจับคู่
> ตาชั่ง ไม่ทดสอบ mint/redeem/expiry ซ้ำ (ดู TC-INT-0-001 ถึง 004 สำหรับกลไกนั้น) — ที่จริงแล้ว TC-INT-0-005
> เองครอบคลุมทั้ง 2 ปลายทาง (ตาชั่ง/wearable) ไว้แล้วในตัว test case เดียว test case นี้จึงเป็น
> cross-reference ยืนยันซ้ำเฉพาะฝั่ง wearable แยกไว้ใน section INT-3 เพื่อให้ค้นหาง่ายจากที่นี่โดยตรง

- **Pre-condition**: ผู้ใช้เปิด companion app บนมือถือเครื่องนี้เป็นครั้งแรก ยังไม่เคย redeem รหัสจับคู่
  อุปกรณ์สำเร็จเลย
- **Test Steps**:
  1. เปิด companion app
  2. พยายาม navigate ไปหน้าเชื่อมต่อ wearable (device-pairing, `device=wearable`) โดยตรง
- **Expected Result**: แอปพามาที่หน้าจอกรอกรหัสจับคู่ (`pairing-code.tsx`) แทนที่จะให้เข้าหน้าเชื่อมต่อ
  wearable ได้โดยตรง — ต้อง redeem รหัสจับคู่สำเร็จก่อน (กลไกเดียวกันกับ TC-INT-0-002) จึงจะเข้าหน้าเชื่อม
  ต่อ wearable จริงได้
- **Test Data**: session ปัจจุบันของมือถือเครื่องนี้ = ไม่มี (ไม่เคย redeem มาก่อน)
- **References**: REQ-18 · AC-INT-0-04 · [user-journeys.md#onb-0--สมัครสมาชิก--เข้าสู่ระบบ--ลืมรหัสผ่าน--ออกจากระบบ-req-14-req-15-req-16-req-17](../../../02-design/01-prototypes/user-journeys.md#onb-0--สมัครสมาชิก--เข้าสู่ระบบ--ลืมรหัสผ่าน--ออกจากระบบ-req-14-req-15-req-16-req-17)
  (Alt/Edge Case: "ผู้ใช้เปิดแอปมือถือโดยยังไม่เคยสมัคร/เข้าสู่ระบบบนเว็บมาก่อน") ·
  [user-journeys.md#int-0--ยืนยันตัวตนก่อนจับคู่อุปกรณ์ผ่านรหัสจับคู่-req-18](../../../02-design/01-prototypes/user-journeys.md#int-0--ยืนยันตัวตนก่อนจับคู่อุปกรณ์ผ่านรหัสจับคู่-req-18)
  · **ดูรายละเอียดกลไกเต็มที่ TC-INT-0-005** — flow เชิงเส้นเดียวกันกับ TC-INT-0-005
  [11-device-integrations.html](../../../02-design/01-prototypes/v1/11-device-integrations.html) →
  [13-companion-pairing-code.html](../../../02-design/01-prototypes/v1/13-companion-pairing-code.html) →
  [12-device-pairing.html](../../../02-design/01-prototypes/v1/12-device-pairing.html)

---

## หมายเหตุ: Gap ที่ยังไม่มี test case (Open Question ที่ยังไม่ resolve)

ตาม methodology ของ `test-suite-builder` — gap ที่เกิดจาก upstream (spec/journey) ยังไม่นิยามพฤติกรรม
ชัดเจน จะไม่ถูก invent เป็น test case ในไฟล์นี้:

- **INT-2**: กรณี "มีค่าน้ำหนักหลายค่าในวันเดียว (ชั่งหลายรอบ) ใช้ค่าล่าสุดหรือค่าเฉลี่ยของวันนั้น" —
  ยังไม่ระบุใน [01-spec/20260823-04-smart-integrations.md § จุดที่ยังไม่ได้ระบุ](../../../01-requirements/01-spec/20260823-04-smart-integrations.md#จุดที่ยังไม่ได้ระบุ--ควรยืนยันเพิ่มเติม)
  และ [user-journeys.md Open Questions ข้อ 5](../../../02-design/01-prototypes/user-journeys.md#open-questions)
  — ไม่มี AC scenario รองรับเช่นกัน (ดูหมายเหตุใต้ AC-INT-2-02 ใน acceptance-criteria.md)
- **INT-3**: กรณี "ค่าจาก wearable กับค่าประมาณจากสูตร MET ต่างกันมาก" — ยังไม่ระบุวิธีจัดการความขัดแย้ง
  ในเอกสารเดียวกัน — ไม่มี AC scenario รองรับเช่นกัน (ดูหมายเหตุใต้ AC-INT-3-02 ใน acceptance-criteria.md)

ทั้งสองจุดตรงกับ Risk R5 ใน [test-plan.md §4 Risk Management](../test-plan.md#4-risk-management) ซึ่งระบุไว้
แล้วว่า "เขียนได้เฉพาะ happy-path (ไม่มีข้อมูลชนกัน) ระหว่างที่ยังไม่ resolve" — ไฟล์นี้ปฏิบัติตามข้อนั้น

---

## สรุปจำนวน Test Case ต่อ Feature และการ map กับ AC

| Feature ID | AC ที่ครอบคลุม | Test Case ที่ map | หมายเหตุ |
|---|---|---|---|
| INT-0 | AC-INT-0-01 (เดิม AC-INT-2-03) | TC-INT-0-001 | 1:1 — execute ได้จริง (backend มีอยู่แล้ว) |
| INT-0 | AC-INT-0-02 (เดิม AC-INT-2-04) | TC-INT-0-002 | 1:1 — execute ได้จริง |
| INT-0 | AC-INT-0-03 (เดิม AC-INT-2-05) | TC-INT-0-003, TC-INT-0-004 | 1 AC → 2 TC (TC-003: 3 สถานการณ์ consolidated เป็น 410 เดียว; TC-004: boundary timing ของ TTL) — execute ได้จริง |
| INT-0 | AC-INT-0-04 (เดิม AC-INT-2-06 + AC-INT-3-04 รวมกัน) | TC-INT-0-005 | 1:1 — execute ได้จริง (ครอบคลุมทั้ง 2 ปลายทาง ตาชั่ง/wearable ในตัว) |
| INT-1 | AC-INT-1-01 | TC-INT-1-001 | 1:1 |
| INT-1 | AC-INT-1-02 | TC-INT-1-002 | 1:1 |
| INT-1 | AC-INT-1-03 | TC-INT-1-003, TC-INT-1-004 | 1 AC → 2 TC (variation: ขาดดุล = 0 / ขาดดุลสวนทางเป้าหมาย) |
| INT-1 | AC-INT-1-04 (ใหม่, NFR-13, เพิ่ม 2026-08-29) | TC-INT-1-005 | 1:1 — "not testable in this round" (Epic 4/Could, ดู test-plan.md §1) |
| INT-1 | AC-INT-1-05 (ใหม่, เพิ่ม 2026-08-31, `GET /insights/weight-records`) | TC-INT-1-006 | 1:1 |
| INT-1 | AC-INT-1-06 (ใหม่, เพิ่ม 2026-08-31) | TC-INT-1-007 | 1:1 |
| INT-1 | AC-INT-1-07 (ใหม่, เพิ่ม 2026-08-31) | TC-INT-1-008 | 1:1 |
| INT-2 | AC-INT-2-01 | TC-INT-2-001 | 1:1 |
| INT-2 | AC-INT-2-02 | TC-INT-2-002 | 1:1 |
| INT-3 | AC-INT-3-01 | TC-INT-3-001 | 1:1 |
| INT-3 | AC-INT-3-02 | TC-INT-3-002 | 1:1 |
| INT-3 | AC-INT-3-03 (ใหม่, NFR-12, เพิ่ม 2026-08-29) | TC-INT-3-003 | 1:1 — "not testable in this round" (ดู test-plan.md R12) |
| INT-3 | AC-INT-0-04 (cross-ref, เดิม AC-INT-3-04) | TC-INT-3-004 | 1:1 — execute ได้จริง (cross-reference ยืนยันเฉพาะฝั่ง wearable ของ TC-INT-0-005) |
| **รวม** | **16 AC scenario ไม่ซ้ำ** (ครบทุก AC ของ INT-0/1/2/3 ใน acceptance-criteria.md — TC-INT-3-004 map ซ้ำกับ AC-INT-0-04) | **19 test case** | |

> อัปเดต 2026-08-31 (`test-suite-builder`, coverage gap): เพิ่ม **TC-INT-1-006 ถึง TC-INT-1-008** ครอบคลุม
> **AC-INT-1-05 ถึง AC-INT-1-07** ใหม่ (operation `GET /insights/weight-records` ที่เพิ่มเข้า
> `api-spec.md §3.7` เมื่อ 2026-08-31 ซึ่งก่อนหน้านี้ไม่มี test case ครอบคลุมเลย) — AC ไม่ซ้ำจาก 13 เป็น
> **16**, test case จาก 16 เป็น **19**

> อัปเดต 2026-08-30 (reconcile ตาม CLAUDE.md § "Docs/code drift"): +5 AC scenario / +6 test case จากกลไก
> รหัสจับคู่อุปกรณ์ (pairing-code identity handoff) ที่ implement จริงแล้วใน `apps/web/server/routes/pairing/`
> — ต่างจาก test case อื่นของ Epic 4 กลุ่มนี้ execute ได้จริงในรอบนี้แม้ INT-2/INT-3 เองยังเป็น Could/นอก
> ขอบเขต (ดู test-plan.md §4 R14)
>
> อัปเดต 2026-08-30 (renumbering): กลไก pairing-code ได้ Feature ID **INT-0**/REQ-18 ของตัวเองจาก
> `feature-list-journey` — TC-INT-2-003 ถึง 007 เดิม (5 test case) ย้ายเป็น **TC-INT-0-001 ถึง 005**
> (ยังคง 5 test case เท่าเดิม เพียงย้าย section) INT-2 เหลือ TC-INT-2-001/002 เดิม INT-3 ยังมี TC-INT-3-004
> อยู่เหมือนเดิมแต่เปลี่ยนไป cross-reference AC-INT-0-04/TC-INT-0-005 แทนการยืนยันกลไกลำพัง — รวม test case
> ทั้งไฟล์ยังคง **16 test case** เท่าเดิม (ย้าย ไม่ได้เพิ่ม/ลด) AC scenario ไม่ซ้ำที่ครอบคลุมลดจาก 14 เป็น
> **13** เพราะ AC-INT-2-06/AC-INT-3-04 เดิมรวมเป็น AC-INT-0-04 เดียว

---

อ้างอิงต้นฉบับ: [acceptance-criteria.md](../../../01-requirements/acceptance-criteria.md) ·
[backlog.md](../../../01-requirements/backlog.md) ·
[01-spec/20260823-04-smart-integrations.md](../../../01-requirements/01-spec/20260823-04-smart-integrations.md) ·
[user-journeys.md](../../../02-design/01-prototypes/user-journeys.md) ·
[test-plan.md](../test-plan.md) · [prototype v1](../../../02-design/01-prototypes/v1/README.md)
