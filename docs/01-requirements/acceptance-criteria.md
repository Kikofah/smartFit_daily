# Acceptance Criteria — smartFit_daily

เอกสารนี้แจกแจง Acceptance Criteria แบบ **Given-When-Then** ของทุก Feature ใน
[backlog.md](backlog.md) (16 Feature ID ครบทุก Epic — เพิ่ม ONB-0 Authentication เมื่อ 2026-08-29,
เพิ่ม INT-0 Pairing Code identity handoff เมื่อ 2026-08-30) โดยยึด
**Success State** เป็น happy-path
scenario และ **Alt/Edge Cases** ที่มีอยู่แล้วใน
[user-journeys.md](../02-design/01-prototypes/user-journeys.md) เป็น scenario เพิ่มเติมต่อ feature —
ไม่มีการสร้าง edge case ใหม่ที่ไม่มีอยู่ใน journey เดิม (จุดที่ journey ทิ้งไว้เป็น Open Question โดยไม่มี
พฤติกรรมที่นิยามชัดเจน จะไม่ถูกแปลงเป็น scenario ในไฟล์นี้ — ดูหมายเหตุท้ายแต่ละ feature ที่เกี่ยวข้อง)

**ข้อยกเว้นเดียว (เพิ่ม 2026-08-29)**: scenario ที่มาจาก Non-Functional Requirement ที่ตัดขวางหลาย Epic
(เช่น NFR-12, NFR-13) ไม่ได้มาจาก Alt/Edge Case ของ `user-journeys.md` โดยตรง แต่มาจาก
[01-spec/20260827-05-non-functional-requirements.md](01-spec/20260827-05-non-functional-requirements.md)
ที่ `feature-list-journey` ยืนยัน mapping กับ Feature ID เฉพาะไว้แล้วใน [backlog.md NFR
Traceability](backlog.md#non-functional-requirements-nfr-traceability) พร้อมหลักฐานตรงในเอกสารเทคนิค
อื่น (`api-spec.md`, `database-schema.md`, `DESIGN.md`) — ไม่ใช่การเดา edge case ใหม่ แต่ละ scenario
ประเภทนี้มีหมายเหตุกำกับไว้ชัดเจนว่าอ้างอิงจากที่ใด

ต้นทาง: [01-spec/](01-spec/index.md) · [backlog.md](backlog.md) ·
[user-journeys.md](../02-design/01-prototypes/user-journeys.md) ·
ดูตัวอย่างหน้าจอที่เกี่ยวข้องได้ที่ [prototype v1](../02-design/01-prototypes/v1/README.md)

รูปแบบ ID: `AC-{FeatureID}-{2-digit}` เช่น `AC-ONB-1-01` แต่ละ scenario ระบุ `REQ-xx` ที่เกี่ยวข้องไว้ใน
หัวข้อเสมอ

---

## สารบัญ

- [Epic 1: Onboarding & Personalization](#epic-1-onboarding--personalization) — ONB-0, ONB-1, ONB-2, ONB-3
- [Epic 2: Daily YouTube Recommendation](#epic-2-daily-youtube-recommendation) — REC-1, REC-2, REC-3, REC-4
- [Epic 3: Planner & Logging](#epic-3-planner--logging) — PLN-1, PLN-2, PLN-3, PLN-4
- [Epic 4: Smart Integrations](#epic-4-smart-integrations) — INT-0, INT-1, INT-2, INT-3

---

## Epic 1: Onboarding & Personalization

Spec: [01-spec/20260823-01-onboarding-personalization.md](01-spec/20260823-01-onboarding-personalization.md)

### ONB-0 — สมัครสมาชิก / เข้าสู่ระบบ / ลืมรหัสผ่าน / ออกจากระบบ (เพิ่มใหม่ 2026-08-29)

#### AC-ONB-0-01 — สมัครสมาชิกสำเร็จ สร้างบัญชีผู้ใช้ใหม่ก่อนเข้าสู่ ONB-1 (REQ-14)
- **Given**: ผู้ใช้เปิดแอปครั้งแรกและยังไม่มีบัญชีผู้ใช้
- **When**: ผู้ใช้เลือกวิธีสมัครสมาชิก 1 ใน 3 วิธี (email/password, Google OAuth, หรือ Sign in with Apple)
  แล้วกรอก/ยืนยันข้อมูลที่จำเป็นครบถ้วน
- **Then**: ระบบสร้างบัญชีผู้ใช้ใหม่ (`userId`) ก่อนเข้าสู่ขั้นตอนกรอกข้อมูลส่วนตัวเสมอ — ห้ามเริ่ม ONB-1
  ก่อนมีบัญชีผู้ใช้จริง แล้วพาไปหน้ากรอกข้อมูลส่วนตัว (ONB-1) ทันที
- Prototype: [00-auth-signup.html](../02-design/01-prototypes/v1/00-auth-signup.html)

#### AC-ONB-0-02 — เข้าสู่ระบบสำเร็จด้วยวิธีเดียวกับที่สมัครไว้ ระบบจดจำสถานะ login (REQ-15)
- **Given**: ผู้ใช้มีบัญชีผู้ใช้อยู่แล้ว (ผู้ใช้ประจำ/returning user)
- **When**: ผู้ใช้เลือกวิธีเข้าสู่ระบบด้วยวิธีเดียวกับที่สมัครไว้ (email/password, Google, หรือ Apple)
  และเข้าสู่ระบบสำเร็จ
- **Then**: ระบบจดจำสถานะเข้าสู่ระบบไว้ (session persistence) แล้วพาผู้ใช้เข้าแอปต่อทันที (ไปยัง Daily
  Dashboard ถ้าผ่าน onboarding ครบแล้ว หรือกลับไปทำ ONB-1 ต่อถ้ายังไม่เคยผ่าน) โดยไม่ต้อง login ซ้ำจนกว่า
  จะออกจากระบบเอง (REQ-17) หรือ session หมดอายุ
- Prototype: [00-auth-login.html](../02-design/01-prototypes/v1/00-auth-login.html)

#### AC-ONB-0-03 — ผู้ใช้ที่สมัครด้วย email/password ขอรีเซ็ตรหัสผ่านผ่านอีเมลได้ (REQ-16)
- **Given**: ผู้ใช้สมัครสมาชิกด้วยวิธี email/password และลืมรหัสผ่านขณะเข้าสู่ระบบ
- **When**: ผู้ใช้กดลิงก์ "ลืมรหัสผ่าน?" แล้วกรอกอีเมลที่ลงทะเบียนไว้และกดยืนยัน
- **Then**: ระบบแสดงข้อความยืนยันว่าคำขอรีเซ็ตรหัสผ่านถูกส่งไปยังอีเมลนั้นแล้ว แล้วให้ผู้ใช้กลับไปเข้าสู่ระบบ
  ใหม่หลังตั้งรหัสผ่านใหม่
- Prototype: [00-auth-forgot-password.html](../02-design/01-prototypes/v1/00-auth-forgot-password.html)

#### AC-ONB-0-04 — บัญชีที่สมัครด้วย Google/Apple ขอรีเซ็ตรหัสผ่านไม่ได้ (REQ-16)
- **Given**: ผู้ใช้สมัครสมาชิกด้วย Google OAuth หรือ Sign in with Apple (ไม่มีรหัสผ่านในระบบ)
- **When**: ผู้ใช้เปิดหน้าลืมรหัสผ่าน
- **Then**: ระบบแจ้งว่าบัญชีที่เชื่อมกับ Google/Apple ไม่มีรหัสผ่านให้รีเซ็ต และแนะนำให้เข้าสู่ระบบด้วยวิธี
  เดิมที่สมัครไว้แทน
- Prototype: [00-auth-forgot-password.html](../02-design/01-prototypes/v1/00-auth-forgot-password.html)

#### AC-ONB-0-05 — ออกจากระบบจากหน้าโปรไฟล์ ล้าง session ทันที (REQ-17)
- **Given**: ผู้ใช้เข้าสู่ระบบอยู่ (มี session ที่จดจำไว้ตาม REQ-15)
- **When**: ผู้ใช้กดปุ่ม "ออกจากระบบ" จากหน้าโปรไฟล์
- **Then**: ระบบล้าง session ที่จดจำไว้ทันที แล้วพากลับไปหน้าจอสมัครสมาชิก/เข้าสู่ระบบเริ่มต้น
- Prototype: [11-device-integrations.html](../02-design/01-prototypes/v1/11-device-integrations.html)
  (ปุ่ม "ออกจากระบบ" ในส่วนบัญชีผู้ใช้)

#### AC-ONB-0-06 — Session หมดอายุ ต้องเข้าสู่ระบบใหม่ (REQ-15)
- **Given**: ผู้ใช้เคยเข้าสู่ระบบไว้ แต่ session ที่จดจำไว้หมดอายุแล้ว (ระยะเวลาที่แน่นอนยังไม่ระบุ — ดู
  "จุดที่ยังไม่ได้ระบุ" ของ Onboarding spec)
- **When**: ผู้ใช้เปิดแอปอีกครั้ง
- **Then**: ระบบตรวจไม่พบ session ที่ยังใช้ได้ จึงพาไปหน้าเข้าสู่ระบบให้ผู้ใช้ยืนยันตัวตนใหม่ แทนที่จะปล่อยให้
  เข้าแอปต่อ
- Prototype: ไม่มี — prototype v1 ยังไม่ implement การตรวจสอบ session จริง (ดูหมายเหตุใน
  `00-auth-welcome.html` ที่ระบุว่า "no real session check here") เป็น documentation-level scenario
  รอ backend จริง

#### AC-ONB-0-07 — พื้นผิว UI ของ Authentication ทั้งหมดมีเฉพาะที่เว็บแอปเท่านั้น (เพิ่ม 2026-08-30, REQ-14, REQ-15)
- **Given**: ผู้ใช้เปิดแอปมือถือ (companion app, `apps/mobile/`) ที่ยังไม่เคยสมัครสมาชิก/เข้าสู่ระบบบนเว็บแอปมาก่อนเลย
- **When**: ผู้ใช้ค้นหาหรือพยายามเข้าถึงหน้าจอสมัครสมาชิก/เข้าสู่ระบบ/ลืมรหัสผ่าน/ออกจากระบบบนแอปมือถือ
- **Then**: ไม่มีหน้าจอ Authentication เหล่านี้อยู่บนแอปมือถือเลย (ยืนยันจากโค้ดจริง: มีเฉพาะ `pairing-code.tsx`
  และ `device-pairing.tsx` ใต้ `apps/mobile/app/`) ผู้ใช้ต้องสมัครสมาชิก/เข้าสู่ระบบผ่านเว็บแอปก่อนเสมอ แล้วใช้
  กลไกรหัสจับคู่อุปกรณ์ (pairing-code — ดู AC-INT-0-01 ถึง AC-INT-0-04) ระบุตัวตนบนมือถือแทนการมีหน้าจอ
  auth ของตัวเอง
- Prototype: ไม่มี — เป็นการยืนยันจาก codebase จริงของ `apps/mobile/`, ไม่ใช่หน้าจอใน prototype `v1/`
- ต้นทาง decision: [Onboarding spec § ข้อสมมติฐาน/การตัดสินใจที่ยืนยันแล้ว](01-spec/20260823-01-onboarding-personalization.md#ข้อสมมติฐานการตัดสินใจที่ยืนยันแล้ว)
  (บันทึกจาก codebase จริง 2026-08-30)

> หมายเหตุ: journey ของ ONB-0 ยังมี Alt/Edge Case อีก 2 จุดที่ไม่ได้ถูกแปลงเป็น scenario ในไฟล์นี้ เพราะยัง
> เป็น Open Point ที่ upstream ไม่ได้ระบุ**พฤติกรรม**ไว้ชัดเจน (ต่างจาก AC-ONB-0-06 ที่พฤติกรรมชัดเจนแล้ว
> เพียงแต่ตัวเลข parameter ยังไม่ระบุ): (1) ต้องมีขั้นตอนยืนยันอีเมล (email verification) ก่อนใช้งานได้จริง
> หรือไม่ — กระทบว่าเข้าสู่ ONB-1 ได้ทันทีหลังสมัครหรือต้องรอยืนยันอีเมลก่อน (2) กติกาความซับซ้อนของรหัสผ่าน
> (password policy) สำหรับ email/password — ทั้งสองยังไม่มีพฤติกรรมที่นิยามชัดเจนให้แปลงเป็น scenario ได้
> ดู [จุดที่ยังไม่ได้ระบุของ Onboarding spec](01-spec/20260823-01-onboarding-personalization.md#จุดที่ยังไม่ได้ระบุ--ควรยืนยันเพิ่มเติม)
> (ดูรายงานผลของ `test-suite-builder`)

---

### ONB-1 — กรอกข้อมูลส่วนตัวเพื่อคำนวณเป้าหมายแคลอรี่

#### AC-ONB-1-01 — กรอกข้อมูลครบและถูกต้อง คำนวณ TDEE สำเร็จ (REQ-01)
- **Given**: ผู้ใช้ใหม่อยู่ที่ขั้นตอน onboarding ยังไม่มี TDEE ในโปรไฟล์
- **When**: ผู้ใช้กรอกอายุ เพศ น้ำหนัก ส่วนสูง และเลือกระดับกิจกรรมครบถ้วนถูกต้อง แล้วกดถัดไป
- **Then**: ระบบคำนวณ BMR ด้วยสูตร Mifflin-St Jeor คูณด้วย Activity Factor ได้ TDEE บันทึกลงโปรไฟล์
  แล้วพาไปขั้นตอนเลือกอุปกรณ์ (ONB-2)
- Prototype: [01-onboarding-personal-info.html](../02-design/01-prototypes/v1/01-onboarding-personal-info.html)

#### AC-ONB-1-02 — กรอกข้อมูลไม่ครบหรือไม่ถูกต้อง (REQ-01)
- **Given**: ผู้ใช้ใหม่อยู่ที่ขั้นตอนกรอกข้อมูลส่วนตัว
- **When**: ผู้ใช้กรอกข้อมูลไม่ครบ หรือกรอกค่าที่ไม่ถูกต้อง (เช่น ค่าติดลบ หรือเกินช่วงที่สมเหตุสมผล) แล้วกดถัดไป
- **Then**: ระบบไม่คำนวณ TDEE และไม่ให้ไปขั้นตอนถัดไป จนกว่าผู้ใช้จะแก้ไขข้อมูลให้ครบและถูกต้อง
- Prototype: [01-onboarding-personal-info.html](../02-design/01-prototypes/v1/01-onboarding-personal-info.html)

#### AC-ONB-1-03 — แก้ไขน้ำหนัก/ส่วนสูงภายหลัง ต้องคำนวณ TDEE ใหม่ (REQ-01)
- **Given**: ผู้ใช้มี TDEE อยู่ในโปรไฟล์แล้วจากการทำ onboarding ครั้งก่อน
- **When**: ผู้ใช้แก้ไขน้ำหนักหรือส่วนสูงภายหลัง (เช่น ผ่านหน้าตั้งค่าโปรไฟล์ หรือค่าที่ซิงค์มาจากตาชั่งอัจฉริยะ
  INT-2)
- **Then**: ระบบคำนวณ BMR/TDEE ใหม่ทันทีด้วยค่าล่าสุด แทนที่ค่าเดิมในโปรไฟล์

---

### ONB-2 — เลือกอุปกรณ์ที่มี

#### AC-ONB-2-01 — เลือกอุปกรณ์และบันทึกเป็น filter (REQ-03)
- **Given**: ผู้ใช้ผ่าน ONB-1 แล้ว (มี TDEE) และมาถึงขั้นตอนเลือกอุปกรณ์
- **When**: ผู้ใช้เลือกอุปกรณ์ที่มี (ไม่มีอุปกรณ์ / ดัมเบล / ยิมครบชุด) แล้วยืนยัน
- **Then**: ระบบบันทึกโปรไฟล์อุปกรณ์ และใช้เป็น filter ทุกครั้งที่เอนจิ้นแนะนำวิดีโอ (REC-1) ทำงานในอนาคต
- Prototype: [02-onboarding-equipment.html](../02-design/01-prototypes/v1/02-onboarding-equipment.html)

#### AC-ONB-2-02 — เลือก "ไม่มีอุปกรณ์" กรองเฉพาะวิดีโอ bodyweight (REQ-03)
- **Given**: ผู้ใช้อยู่ที่ขั้นตอนเลือกอุปกรณ์
- **When**: ผู้ใช้เลือก "ไม่มีอุปกรณ์"
- **Then**: ระบบกรองวิดีโอที่แนะนำเฉพาะประเภท bodyweight เท่านั้น
- Prototype: [02-onboarding-equipment.html](../02-design/01-prototypes/v1/02-onboarding-equipment.html)

#### AC-ONB-2-03 — เปลี่ยนอุปกรณ์ภายหลัง filter อัปเดตทันที (REQ-03)
- **Given**: ผู้ใช้มีโปรไฟล์อุปกรณ์เดิมบันทึกอยู่แล้ว
- **When**: ผู้ใช้เปลี่ยนอุปกรณ์ภายหลัง (เช่น ซื้อดัมเบลเพิ่ม) ผ่านหน้า Settings
- **Then**: filter ที่ใช้ในการแนะนำวิดีโอครั้งถัดไปอัปเดตตามอุปกรณ์ใหม่ทันที

---

### ONB-3 — ตั้งเป้าหมายหลัก (deficit/surplus คงที่ + safety floor)

#### AC-ONB-3-01 — เลือกเป้าหมายหลัก ระบบแปลงเป็นค่าแคลอรี่เป้าหมายที่ชัดเจน (REQ-02)
- **Given**: ผู้ใช้ผ่าน ONB-1 แล้ว (มี TDEE) และ TDEE ที่ได้เมื่อลบ/บวกค่าคงที่ของเป้าหมายแล้วไม่ต่ำกว่า
  safety floor (1,200–1,500 kcal/วัน)
- **When**: ผู้ใช้เลือกเป้าหมายหลัก 1 ใน 3 แบบ (ลดน้ำหนัก / กระชับสัดส่วน / เพิ่มความอึด) แล้วยืนยัน
- **Then**: ระบบแปลงเป้าหมายเป็นค่าคงที่ตายตัว (ลดน้ำหนัก = TDEE − 500, กระชับสัดส่วน = TDEE + 0,
  เพิ่มความอึด = TDEE + 300 kcal/วัน) บันทึกเป็นเป้าหมายแคลอรี่รายวัน และ onboarding เสร็จสมบูรณ์
- Prototype: [04-onboarding-goal-confirm.html](../02-design/01-prototypes/v1/04-onboarding-goal-confirm.html)

#### AC-ONB-3-02 — เปลี่ยนเป้าหมายหลักภายหลัง คำนวณใหม่ทันที (REQ-02)
- **Given**: ผู้ใช้มีเป้าหมายแคลอรี่รายวันบันทึกไว้แล้วจากเป้าหมายหลักเดิม
- **When**: ผู้ใช้เปลี่ยนเป้าหมายหลัก (เช่น จากลดน้ำหนักเป็นเพิ่มความอึด)
- **Then**: ระบบคำนวณเป้าหมายแคลอรี่รายวันใหม่ทันทีด้วยสูตรค่าคงที่เดิม (ตาม mapping ในเป้าหมายใหม่)
- Prototype: [03-onboarding-goal-select.html](../02-design/01-prototypes/v1/03-onboarding-goal-select.html)

#### AC-ONB-3-03 — TDEE ต่ำมากจนต่ำกว่า safety floor ถูกปรับขึ้นเสมอ (REQ-02)
- **Given**: ผู้ใช้มี TDEE ต่ำมาก (เช่น น้ำหนักตัวน้อย + ระดับกิจกรรมต่ำ) จนแม้เลือกเป้าหมาย "เพิ่มความอึด"
  (TDEE + 300) ผลลัพธ์ยังต่ำกว่า safety floor (1,200–1,500 kcal/วัน)
- **When**: ผู้ใช้เลือกเป้าหมายหลักและยืนยัน
- **Then**: ระบบปรับเป้าหมายแคลอรี่รายวันขึ้นเป็นค่า safety floor แทนค่าที่คำนวณได้ ไม่ปล่อยให้ต่ำกว่าเกณฑ์
- Prototype: [04-onboarding-goal-confirm.html](../02-design/01-prototypes/v1/04-onboarding-goal-confirm.html)

#### AC-ONB-3-04 — เลือก "ลดน้ำหนัก" กรอกน้ำหนักเป้าหมาย (บังคับ) ครบถ้วน บันทึกสำเร็จ (REQ-02)
- **Given**: ผู้ใช้ผ่าน ONB-1 แล้ว (มี TDEE) และอยู่ที่ขั้นตอนเลือกเป้าหมายหลัก
- **When**: ผู้ใช้เลือกเป้าหมาย **"ลดน้ำหนัก"** แล้วกรอกน้ำหนักเป้าหมาย (target weight, kg) ที่ถูกต้องในช่อง
  ที่ระบบบังคับให้กรอก แล้วยืนยัน
- **Then**: ระบบบันทึกทั้งเป้าหมายแคลอรี่รายวัน (TDEE − 500 kcal/วัน ปรับตาม safety floor ถ้าจำเป็น) และ
  น้ำหนักเป้าหมายลงโปรไฟล์พร้อมกัน onboarding เสร็จสมบูรณ์ และค่าน้ำหนักเป้าหมายนี้พร้อมใช้เป็น precondition
  "มีเป้าหมายน้ำหนัก" ของ [INT-1](../02-design/01-prototypes/user-journeys.md#int-1--พยากรณ์วันถึงเป้าหมายน้ำหนัก-req-11)
  ทันที
- Prototype: [04-onboarding-goal-confirm.html](../02-design/01-prototypes/v1/04-onboarding-goal-confirm.html)
  (ช่องกรอกน้ำหนักเป้าหมายแบบ stepper input พร้อม validation บังคับกรอก)

#### AC-ONB-3-05 — เลือก "กระชับสัดส่วน"/"เพิ่มความอึด" ข้ามช่องน้ำหนักเป้าหมาย (ไม่บังคับ) (REQ-02)
- **Given**: ผู้ใช้ผ่าน ONB-1 แล้ว (มี TDEE) และอยู่ที่ขั้นตอนเลือกเป้าหมายหลัก
- **When**: ผู้ใช้เลือกเป้าหมาย **"กระชับสัดส่วน"** หรือ **"เพิ่มความอึด"** แล้วไม่กรอกน้ำหนักเป้าหมาย (ข้าม
  ช่องที่ไม่บังคับ) แล้วยืนยัน
- **Then**: ระบบบันทึกเป้าหมายแคลอรี่รายวันตามปกติ (maintenance หรือ TDEE + 300 ตามที่เลือก) โดยไม่ต้องมี
  น้ำหนักเป้าหมาย onboarding เสร็จสมบูรณ์เช่นกัน แต่โปรไฟล์จะไม่มีน้ำหนักเป้าหมายบันทึกไว้ ทำให้
  [INT-1](../02-design/01-prototypes/user-journeys.md#int-1--พยากรณ์วันถึงเป้าหมายน้ำหนัก-req-11)
  ยังพยากรณ์วันถึงเป้าหมายน้ำหนักให้ไม่ได้ จนกว่าผู้ใช้จะกรอกน้ำหนักเป้าหมายภายหลัง
- Prototype: [04-onboarding-goal-confirm.html](../02-design/01-prototypes/v1/04-onboarding-goal-confirm.html)
  (ช่องกรอกน้ำหนักเป้าหมายแบบ stepper input, optional เมื่อเลือกเป้าหมายอื่นที่ไม่ใช่ "ลดน้ำหนัก")
- หมายเหตุ: ช่องทางที่ผู้ใช้จะกลับมากรอกน้ำหนักเป้าหมายภายหลังยังไม่ถูกระบุ (ดู
  [จุดที่ยังไม่ได้ระบุของ Onboarding spec](01-spec/20260823-01-onboarding-personalization.md#จุดที่ยังไม่ได้ระบุ--ควรยืนยันเพิ่มเติม))

> หมายเหตุ: กรณี "เลือก 'ลดน้ำหนัก' แล้วไม่กรอกน้ำหนักเป้าหมาย (ทั้งที่บังคับ)" — ไม่ได้ถูกแปลงเป็น scenario
> ในไฟล์นี้ เพราะ `01-spec/20260823-01-onboarding-personalization.md` และ `user-journeys.md` ยืนยันเพียงว่า
> ช่องนี้ "บังคับกรอก" แต่ไม่ได้ระบุพฤติกรรม/ข้อความ validation ที่ระบบควรแสดงเมื่อผู้ใช้ข้ามช่องนี้ไป (ต่างจาก
> กรณี optional-skip ของ AC-ONB-3-05 ที่ journey ระบุผลลัพธ์ไว้ชัดเจนว่า INT-1 จะใช้งานไม่ได้) — เป็น gap ที่
> รายงานไว้แทนการเดา (ดูรายงานผลของ `test-suite-builder`)

---

## Epic 2: Daily YouTube Recommendation

Spec: [01-spec/20260823-02-daily-youtube-recommendation.md](01-spec/20260823-02-daily-youtube-recommendation.md)

### REC-1 — แนะนำวิดีโอตรงเป้าแคลอรี่รายวัน

#### AC-REC-1-01 — เห็นวิดีโอแนะนำตรงเป้าแคลอรี่ กรองด้วยอุปกรณ์ (REQ-04)
- **Given**: ผู้ใช้มีเป้าหมายแคลอรี่รายวัน (ONB-3) และโปรไฟล์อุปกรณ์ (ONB-2) แล้ว วันนี้ไม่ใช่ Cheat/Rest Day
- **When**: ผู้ใช้เปิดหน้า Daily Dashboard
- **Then**: ระบบดึงเป้าหมายแคลอรี่ของวันนี้ filter วิดีโอด้วยอุปกรณ์ที่มี และแสดงวิดีโอที่แนะนำอย่างน้อย 1
  รายการที่คาดว่าเผาผลาญแคลอรี่ใกล้เคียงเป้าหมายที่สุด
- Prototype: [05-daily-dashboard.html](../02-design/01-prototypes/v1/05-daily-dashboard.html)

#### AC-REC-1-02 — ไม่มีวิดีโอตรงเป้า ระบบขยายเกณฑ์การค้นหา (REQ-04)
- **Given**: ผู้ใช้เปิดหน้า Daily Dashboard และมีเป้าหมายแคลอรี่ของวันนี้แล้ว
- **When**: ไม่มีวิดีโอในคลังที่ตรงกับอุปกรณ์ + แคลอรี่เป้าหมายพอดี
- **Then**: ระบบขยายเกณฑ์การค้นหา (ผ่อนช่วงแคลอรี่) แล้วจับคู่วิดีโอใหม่อีกครั้ง
- Prototype: [05-daily-dashboard.html](../02-design/01-prototypes/v1/05-daily-dashboard.html)

#### AC-REC-1-03 — วันนี้เป็น Cheat Day/Rest Day ไม่แนะนำวิดีโอ (REQ-04)
- **Given**: ผู้ใช้เปิดหน้า Daily Dashboard
- **When**: วันนี้ถูกตั้งเป็น Cheat Day หรือ Rest Day (PLN-2)
- **Then**: ระบบไม่แนะนำวิดีโอสำหรับวันนี้ (ข้ามขั้นตอน REC-1 ทั้งหมด)
- Prototype: [05-daily-dashboard.html](../02-design/01-prototypes/v1/05-daily-dashboard.html)

> หมายเหตุ: journey ของ REC-1 ยังมี Alt/Edge Case ที่ระบุว่า "เกณฑ์ tolerance ที่แน่นอนว่า 'ใกล้เคียง'
> แค่ไหนถึงเรียกว่าตรงเป้า ยังไม่ระบุ" — เป็นพารามิเตอร์ที่ยังไม่ถูกกำหนดค่า ไม่ใช่พฤติกรรมที่นิยามไว้
> จึงไม่แปลงเป็น scenario ในไฟล์นี้ (ดู [Open Questions ของ user-journeys.md](../02-design/01-prototypes/user-journeys.md#open-questions) ข้อ 1)

### REC-2 — คำนวณแคลอรี่เผาผลาญจริง (สูตร MET)

#### AC-REC-2-01 — คำนวณแคลอรี่เผาผลาญจริงด้วยสูตร MET (REQ-05)
- **Given**: ผู้ใช้กำลังเล่นวิดีโอออกกำลังกายที่มี metadata ระยะเวลา ประเภทกิจกรรม และระดับความเข้มข้น
  ครบถ้วน และไม่มีข้อมูลจาก wearable
- **When**: ผู้ใช้จบ/หยุดวิดีโอออกกำลังกาย
- **Then**: ระบบอ่านระยะเวลาที่ทำจริง ค้นหาค่า MET จาก lookup table (ประเภท × ความเข้มข้น) แล้วคำนวณ
  kcal = MET × น้ำหนักตัว(kg) × เวลา(ชม.) และบันทึกค่าแคลอรี่ที่เผาผลาญของเซสชันนั้น
- Prototype: [07-workout-result.html](../02-design/01-prototypes/v1/07-workout-result.html)

#### AC-REC-2-02 — หยุดวิดีโอกลางคัน คำนวณตามเวลาที่ทำจริงเท่านั้น (REQ-05)
- **Given**: ผู้ใช้กำลังเล่นวิดีโอออกกำลังกายอยู่
- **When**: ผู้ใช้หยุดวิดีโอกลางคันก่อนวิดีโอจบ
- **Then**: ระบบคำนวณแคลอรี่เผาผลาญโดยใช้เฉพาะระยะเวลาที่ทำจริงในสูตร MET ไม่ใช่เวลาเต็มของวิดีโอ
- Prototype: [07-workout-result.html](../02-design/01-prototypes/v1/07-workout-result.html)

#### AC-REC-2-03 — มีข้อมูลจาก wearable ใช้ค่านั้นแทนค่าประมาณ MET (REQ-05)
- **Given**: ผู้ใช้กำลังออกกำลังกายและมี wearable เชื่อมต่ออยู่ (INT-3) ที่ส่งข้อมูลแคลอรี่เผาผลาญจริงมา
- **When**: ผู้ใช้จบ/หยุดวิดีโอออกกำลังกาย
- **Then**: ระบบใช้ค่าแคลอรี่จาก wearable แทนค่าประมาณจากสูตร MET ในการบันทึกแคลอรี่เผาผลาญของเซสชันนั้น
- Prototype: [07-workout-result.html](../02-design/01-prototypes/v1/07-workout-result.html)

#### AC-REC-2-04 — ส่ง sessionId ที่ไม่มีอยู่จริง ระบบต้อง reject ก่อนเขียนข้อมูล (REQ-05, NFR-12)
- **Given**: Client ส่งคำขอจบ/หยุดเซสชันออกกำลังกายด้วย `sessionId` ที่ไม่ตรงกับ Workout Session ใดของ
  ผู้ใช้คนนี้ในระบบ (เช่น session ถูกลบไปแล้ว หมดอายุ หรือเป็นของผู้ใช้อื่น)
- **When**: Client เรียก `POST /workouts/sessions/{sessionId}/complete` ด้วย `sessionId` นั้น
- **Then**: ระบบตรวจสอบว่า session ปลายทางมีอยู่จริงและเป็นของผู้ใช้คนเดียวกันก่อนเขียนข้อมูลเสมอ
  (referential existence validation ตาม NFR-12) เมื่อไม่พบ ระบบปฏิเสธคำขอด้วย `404 sessionId ไม่พบ`
  (error case ที่ระบุไว้แล้วใน [api-spec.md §3.3](../02-design/02-technical/api-spec.md)) โดยไม่สร้าง
  Actual Calorie Burn หรือ Daily Log ใด ๆ จากคำขอนี้
- Prototype: ไม่มี — เป็น server-side validation ที่ไม่มี UI mockup เฉพาะใน `v1/`

> หมายเหตุ: scenario นี้ไม่ได้มาจาก Alt/Edge Case ใน user-journeys.md (journey ของ REC-2 ไม่ได้ลงราย
> ละเอียดระดับ API/backend) แต่มาจาก [NFR-12](01-spec/20260827-05-non-functional-requirements.md)
> (เพิ่ม 2026-08-29) ซึ่ง `feature-list-journey` ยืนยันแล้วว่าผูกกับ REC-2 โดยตรง (ดู [backlog.md NFR
> Traceability หมายเหตุ 1](backlog.md#non-functional-requirements-nfr-traceability)) และมีหลักฐาน error
> case ที่ระบุไว้แล้วจริงใน api-spec.md §3.3 (`404 sessionId ไม่พบ`) — ไม่ใช่การเดา edge case ใหม่

### REC-3 — เปลี่ยนวิดีโอโดยคงเป้าแคลอรี่เดิม

#### AC-REC-3-01 — กดเปลี่ยนวิดีโอ แคลอรี่เป้าหมายของวันไม่เปลี่ยน (REQ-06)
- **Given**: ผู้ใช้มีวิดีโอที่แนะนำอยู่แล้วจาก REC-1
- **When**: ผู้ใช้กดปุ่ม "เปลี่ยนวิดีโอ"/"ลองวิดีโออื่น"
- **Then**: ระบบเก็บค่าแคลอรี่เป้าหมายของวันไว้คงเดิม ค้นหาวิดีโอใหม่ด้วย filter อุปกรณ์ + แคลอรี่เป้าหมายเดียวกัน
  โดยไม่รวมวิดีโอที่เพิ่งถูกปฏิเสธ แล้วแสดงวิดีโอใหม่แทนที่วิดีโอเดิม
- Prototype: [05-daily-dashboard.html](../02-design/01-prototypes/v1/05-daily-dashboard.html)

#### AC-REC-3-02 — กดเปลี่ยนวิดีโอซ้ำจนไม่เหลือตัวเลือก (REQ-06)
- **Given**: ผู้ใช้กดปุ่ม "เปลี่ยนวิดีโอ" ซ้ำหลายครั้งจนปฏิเสธวิดีโอที่ตรงเงื่อนไขไปเกือบหมด
- **When**: ผู้ใช้กดปุ่ม "เปลี่ยนวิดีโอ" อีกครั้งและไม่เหลือวิดีโอที่ตรงเงื่อนไข (อุปกรณ์ + แคลอรี่เป้าหมาย)
  ที่ยังไม่ถูกปฏิเสธ
- **Then**: ระบบแจ้งผู้ใช้ว่าไม่มีวิดีโออื่นที่ตรงเป้าหมายแล้ว หรือขยายเกณฑ์การค้นหา
- Prototype: [05-daily-dashboard.html](../02-design/01-prototypes/v1/05-daily-dashboard.html)

### REC-4 — วอร์มอัพ–คูลดาวน์อัตโนมัติ

#### AC-REC-4-01 — วิดีโอหลักความเข้มข้นสูง แทรกวอร์มอัพ–คูลดาวน์อัตโนมัติ (REQ-07)
- **Given**: ระบบเลือกวิดีโอหลักให้ผู้ใช้แล้ว (จาก REC-1 หรือ REC-3)
- **When**: วิดีโอหลักที่เลือกมีระดับความเข้มข้น "สูง"
- **Then**: ระบบแทรกวิดีโอวอร์มอัพ 3 นาทีก่อนวิดีโอหลัก และคูลดาวน์ 3 นาทีหลังวิดีโอหลักอัตโนมัติ รวมเป็น
  เซสชันเดียว (วอร์มอัพ → หลัก → คูลดาวน์)
- Prototype: [06-workout-session.html](../02-design/01-prototypes/v1/06-workout-session.html)

#### AC-REC-4-02 — วิดีโอหลักความเข้มข้นต่ำ/ปานกลาง ไม่แทรกวอร์มอัพ–คูลดาวน์ (REQ-07)
- **Given**: ระบบเลือกวิดีโอหลักให้ผู้ใช้แล้ว
- **When**: วิดีโอหลักที่เลือกมีระดับความเข้มข้น "ต่ำ" หรือ "ปานกลาง"
- **Then**: ระบบแสดงวิดีโอหลักตามปกติ โดยไม่แทรกวอร์มอัพ/คูลดาวน์
- Prototype: [06-workout-session.html](../02-design/01-prototypes/v1/06-workout-session.html)

#### AC-REC-4-03 — ผู้ใช้ข้ามวอร์มอัพ/คูลดาวน์เอง นับเฉพาะเวลา/แคลอรี่ที่ทำจริง (REQ-07)
- **Given**: ผู้ใช้อยู่ในเซสชันที่มีวอร์มอัพ/คูลดาวน์แทรกอัตโนมัติ
- **When**: ผู้ใช้ข้ามส่วนวอร์มอัพหรือคูลดาวน์เอง
- **Then**: ระบบยังคงนับเฉพาะเวลาและแคลอรี่ของส่วนที่ทำจริงเท่านั้น (ตามการคำนวณใน REC-2)

> หมายเหตุ: journey ของ REC-4 ยังมี Alt/Edge Case ที่ระบุว่า "เวลา/แคลอรี่ของวอร์มอัพ-คูลดาวน์นับรวมใน
> เป้าหมายรายวันหรือไม่ ยังไม่ระบุ" — เป็นพารามิเตอร์ที่ยังไม่ถูกกำหนดค่า ไม่ใช่พฤติกรรมที่นิยามไว้ จึงไม่
> แปลงเป็น scenario ในไฟล์นี้ (ดู [Open Questions ของ user-journeys.md](../02-design/01-prototypes/user-journeys.md#open-questions) ข้อ 2)

---

## Epic 3: Planner & Logging

Spec: [01-spec/20260823-03-planner-logging.md](01-spec/20260823-03-planner-logging.md)

### PLN-1 — ปฏิทินวางแผนรายสัปดาห์

#### AC-PLN-1-01 — เห็นและกำหนดแผนออกกำลังกายล่วงหน้าเป็นสัปดาห์ (REQ-08)
- **Given**: ผู้ใช้ผ่าน onboarding แล้ว (มีเป้าหมายแคลอรี่รายวัน) และเปิดแท็บ Planner/ปฏิทิน
- **When**: ผู้ใช้เลือกวันในสัปดาห์และกำหนดประเภทกิจกรรมของวันนั้นเอง
- **Then**: ระบบบันทึกประเภทกิจกรรมของวันนั้นลงในแผนรายสัปดาห์ และแสดงผลในปฏิทิน/Daily Dashboard ของวันนั้น
- Prototype: [08-weekly-planner.html](../02-design/01-prototypes/v1/08-weekly-planner.html)

#### AC-PLN-1-02 — ไม่กำหนดแผนล่วงหน้าในบางวัน ใช้ค่า default อัตโนมัติ (REQ-08)
- **Given**: ผู้ใช้เปิดปฏิทินรายสัปดาห์
- **When**: ผู้ใช้ปล่อยวันใดวันหนึ่งไว้โดยไม่กำหนดประเภทกิจกรรมเอง และไม่ตั้งเป็น Cheat/Rest Day
- **Then**: วันนั้นใช้ค่า default คือให้ระบบแนะนำอัตโนมัติตาม REC-1
- Prototype: [08-weekly-planner.html](../02-design/01-prototypes/v1/08-weekly-planner.html)

#### AC-PLN-1-03 — วันที่ผ่านมาแล้วซึ่งมี log อยู่ก่อน เปิดดูได้เฉพาะแบบ read-only (REQ-08)
- **Given**: ผู้ใช้เปิดปฏิทินรายสัปดาห์แบบ fixed calendar week (จันทร์–อาทิตย์) และมีวันที่ผ่านมาแล้วในสัปดาห์
  เดียวกันซึ่งมี log บันทึกไว้ก่อนแล้ว (ไม่ว่าสถานะ log เดิมจะครบเป้าหมายหรือไม่)
- **When**: ผู้ใช้แตะ/เปิดดูวันนั้นในปฏิทิน
- **Then**: ระบบเปิดชีทรายละเอียดของวันนั้นแบบ read-only เท่านั้น ไม่อนุญาตให้แก้ไขประเภทกิจกรรมของวันนั้นผ่าน
  หน้านี้ ส่วนวันนี้และวันในอนาคตของสัปดาห์เดียวกัน (ที่ยังไม่มี log) ยังคงกำหนด/แก้ไขแผนได้ตามปกติ — ตาม
  [decision ที่ resolve แล้ว](01-spec/20260823-03-planner-logging.md#ข้อสมมติฐานการตัดสินใจที่ยืนยันแล้ว)
  เมื่อ 2026-08-27 (เดิมเป็น Open Question ที่ยังไม่ระบุ ปิดแล้ว)
- Prototype: [08-weekly-planner.html](../02-design/01-prototypes/v1/08-weekly-planner.html)

### PLN-2 — โหมด Cheat Day / Rest Day (preserve log, completed wins)

#### AC-PLN-2-01 — ตั้ง Cheat/Rest Day ในวันที่ยังไม่มี log (REQ-09)
- **Given**: วันที่ผู้ใช้เลือกยังไม่มี log บันทึกอยู่
- **When**: ผู้ใช้ตั้งวันนั้นเป็น Cheat Day หรือ Rest Day ผ่านปฏิทิน (PLN-1) หรือหน้า Daily Dashboard
- **Then**: ระบบหยุดนับเป้าหมายแคลอรี่ของวันนั้น ไม่แนะนำวิดีโอสำหรับวันนั้น (ข้าม REC-1) และ mark สถานะวันนั้น
  เป็น "ครบเป้าหมาย" (completed) ทันที
- Prototype: [05-daily-dashboard.html](../02-design/01-prototypes/v1/05-daily-dashboard.html)

#### AC-PLN-2-02 — ตั้ง Cheat/Rest Day ทับ log ของวันนี้ที่มีอยู่แล้ว เก็บ log เดิมไว้ (REQ-09)
- **Given**: วันนี้มี log บันทึกอยู่แล้วจากการออกกำลังกายจริง (ไม่ว่าสถานะเดิมจะครบเป้าหมายหรือไม่)
- **When**: ผู้ใช้ตั้งวันนี้เป็น Cheat Day หรือ Rest Day ภายหลัง (เช่น หลังออกกำลังกายเสร็จในวันเดียวกัน)
- **Then**: ระบบเก็บ log เดิมไว้ทั้งหมดไม่ลบทิ้ง และ mark สถานะวันนั้นเป็น "ครบเป้าหมาย" (completed) เสมอ
  (completed ชนะเสมอ) — การทับ log ด้วยวิธีนี้ทำได้เฉพาะ **วันนี้เท่านั้น** ตาม
  [decision ที่ resolve แล้วเมื่อ 2026-08-28](01-spec/20260823-03-planner-logging.md#ข้อสมมติฐานการตัดสินใจที่ยืนยันแล้ว)
  (ดู AC-PLN-2-04 สำหรับกรณีวันในอดีตของสัปดาห์)
- Prototype: [05-daily-dashboard.html](../02-design/01-prototypes/v1/05-daily-dashboard.html)

#### AC-PLN-2-03 — ยกเลิกการตั้ง Cheat/Rest Day ก่อนสิ้นวัน (REQ-09)
- **Given**: วันนั้นถูกตั้งเป็น Cheat Day/Rest Day อยู่ก่อนแล้ว
- **When**: ผู้ใช้ยกเลิกการตั้ง Cheat/Rest Day ก่อนสิ้นวัน
- **Then**: วันนั้นกลับไปนับเป้าหมายแคลอรี่ตามปกติ และสถานะจะถูกประเมินใหม่ตามกติกาของ PLN-3
- Prototype: [05-daily-dashboard.html](../02-design/01-prototypes/v1/05-daily-dashboard.html)

#### AC-PLN-2-04 — พยายามตั้ง/เปลี่ยน Cheat/Rest Day ทับ log ของวันในอดีตของสัปดาห์ ถูกปิดกั้น (REQ-09)
- **Given**: ผู้ใช้เปิดปฏิทินรายสัปดาห์และเลือกวันในอดีตของสัปดาห์เดียวกัน (fixed calendar week ของ PLN-1)
  ซึ่งมี log อยู่ก่อนแล้ว
- **When**: ผู้ใช้พยายามตั้งหรือเปลี่ยน Cheat Day/Rest Day ทับ log ของวันนั้นผ่านปฏิทิน
- **Then**: ระบบปิดกั้นการแก้ไข วันนั้นเปิดได้แบบ read-only เท่านั้น ตาม
  [decision ของ PLN-1 ที่ resolve แล้ว](01-spec/20260823-03-planner-logging.md#ข้อสมมติฐานการตัดสินใจที่ยืนยันแล้ว)
  โดยไม่มีข้อยกเว้นสำหรับ PLN-2 — การทับ log ด้วย Cheat/Rest Day ทำได้เฉพาะวันนี้เท่านั้น (ดู AC-PLN-2-02)
  ([resolve แล้วเมื่อ 2026-08-28](01-spec/20260823-03-planner-logging.md#ข้อสมมติฐานการตัดสินใจที่ยืนยันแล้ว)
  เดิมเป็นคำถามที่ `test-suite-builder` พบระหว่าง self-freshness audit)
- Prototype: [08-weekly-planner.html](../02-design/01-prototypes/v1/08-weekly-planner.html)

### PLN-3 — บันทึกผลรายวัน (all-or-nothing)

#### AC-PLN-3-01 — ออกกำลังกายถึงหรือเกินเป้าหมาย 100% บันทึก log ครบเป้าหมาย (REQ-10)
- **Given**: ผู้ใช้มีค่าแคลอรี่เผาผลาญจริงจาก REC-2 และเป้าหมายแคลอรี่ของวันจาก ONB-3/REC-1 วันนี้ไม่ใช่
  Cheat/Rest Day
- **When**: แคลอรี่ที่เผาผลาญจริงถึงหรือเกินเป้าหมาย 100%
- **Then**: ระบบสร้าง log entry ที่มีนาทีออกกำลังกายจริง แคลอรี่ที่เผาผลาญสะสม และสถานะ "ครบเป้าหมาย" แล้ว
  อัปเดตสถิติรวมและส่งต่อสถานะให้ PLN-4
- Prototype: [07-workout-result.html](../02-design/01-prototypes/v1/07-workout-result.html)

#### AC-PLN-3-02 — ออกกำลังกายไม่ถึงเป้าหมาย บันทึก log ไม่ครบเป้าหมาย ไม่มี partial credit (REQ-10)
- **Given**: ผู้ใช้มีค่าแคลอรี่เผาผลาญจริงจาก REC-2 และเป้าหมายแคลอรี่ของวันจาก ONB-3/REC-1 วันนี้ไม่ใช่
  Cheat/Rest Day
- **When**: แคลอรี่ที่เผาผลาญจริงไม่ถึงเป้าหมาย 100% (เช่น ทำได้ 95%)
- **Then**: ระบบสร้าง log สถานะ "ไม่ครบเป้าหมาย" โดยไม่มี partial credit ใด ๆ แล้วส่งต่อสถานะให้ PLN-4
- Prototype: [07-workout-result.html](../02-design/01-prototypes/v1/07-workout-result.html)

#### AC-PLN-3-03 — วันนี้เป็น Cheat/Rest Day ข้ามขั้นตอน PLN-3 ทั้งหมด (REQ-10)
- **Given**: วันนี้ถูกตั้งเป็น Cheat Day หรือ Rest Day
- **When**: ถึงสิ้นวัน (ไม่มีการออกกำลังกายเทียบเป้าหมายผ่านขั้นตอนนี้)
- **Then**: ระบบข้ามขั้นตอนเปรียบเทียบแคลอรี่/สร้าง log ของ PLN-3 ทั้งหมด สถานะของวันนั้นถูกกำหนดโดย PLN-2 แทน
- Prototype: [05-daily-dashboard.html](../02-design/01-prototypes/v1/05-daily-dashboard.html)

### PLN-4 — ติดตาม Streak ต่อเนื่อง (strict, ไม่มี partial credit)

#### AC-PLN-4-01 — วันที่ครบเป้าหมายต่อเนื่อง (จาก log จริงหรือ Cheat/Rest Day) นับ streak ต่อเนื่อง (REQ-09, REQ-10)
- **Given**: ผู้ใช้มีประวัติ log ย้อนหลังอย่างน้อย 1 วัน
- **When**: ระบบไล่ตรวจสอบสถานะแต่ละวันย้อนหลังจากวันปัจจุบัน และพบว่าสถานะเป็น "ครบเป้าหมาย" (completed) —
  ไม่ว่าจะมาจาก log จริงที่ครบ 100% (PLN-3) หรือจาก Cheat/Rest Day (PLN-2)
- **Then**: ระบบนับวันนั้นต่อเนื่องเป็นส่วนหนึ่งของ streak และแสดงจำนวนวัน streak ที่ถูกต้องบน Dashboard
- Prototype: [05-daily-dashboard.html](../02-design/01-prototypes/v1/05-daily-dashboard.html)

#### AC-PLN-4-02 — ขาด log ไป 1 วันโดยไม่ตั้ง Cheat/Rest Day streak รีเซ็ตเป็น 0 (REQ-09, REQ-10)
- **Given**: ผู้ใช้มี streak ต่อเนื่องอยู่ก่อนหน้า
- **When**: มีวันที่ผู้ใช้ไม่มี log เลย และไม่ได้ตั้งเป็น Cheat Day/Rest Day
- **Then**: ระบบถือว่า streak ขาดทันทีที่วันนั้น และรีเซ็ต streak เป็น 0
- Prototype: [05-daily-dashboard.html](../02-design/01-prototypes/v1/05-daily-dashboard.html)

#### AC-PLN-4-03 — log สถานะ "ไม่ครบเป้าหมาย" ทำให้ streak ขาดทันที (REQ-09, REQ-10)
- **Given**: ผู้ใช้มี streak ต่อเนื่องอยู่ก่อนหน้า
- **When**: มีวันที่ log มีสถานะ "ไม่ครบเป้าหมาย" จาก PLN-3 (เช่น ทำได้ 90–99% ของเป้าหมาย)
- **Then**: ระบบถือว่า streak ขาดทันทีเหมือนไม่มี log เลย ไม่มี partial credit หรือ grace miss ใด ๆ และรีเซ็ต
  streak เป็น 0
- Prototype: [05-daily-dashboard.html](../02-design/01-prototypes/v1/05-daily-dashboard.html)

---

## Epic 4: Smart Integrations

Spec: [01-spec/20260823-04-smart-integrations.md](01-spec/20260823-04-smart-integrations.md)

### INT-0 — ยืนยันตัวตนก่อนจับคู่อุปกรณ์ผ่านรหัสจับคู่ (Pairing Code)

> **หมายเหตุ (renumbering, เพิ่ม 2026-08-30)**: 4 scenario ด้านล่างนี้ย้ายมาจาก AC-INT-2-03, AC-INT-2-04,
> AC-INT-2-05, AC-INT-2-06 และ AC-INT-3-04 เดิม หลังจาก `feature-list-journey` ทำให้กลไกรหัสจับคู่อุปกรณ์
> (pairing-code identity handoff) เป็น Feature ID ของตัวเอง (**INT-0**) พร้อม business rule ของตัวเอง
> (**REQ-18**) ใน `backlog.md`/`user-journeys.md` แทนที่จะเป็น "implicit precondition" ที่ผูกอยู่ใต้ INT-2
> เนื้อหา Given-When-Then ไม่เปลี่ยน มีแค่ ID/การจัดกลุ่ม/REQ ที่อ้างอิงที่ปรับให้ตรงกับ REQ-18 — AC-INT-2-06
> และ AC-INT-3-04 เดิม (precondition guard คนละปลายทาง) รวมเป็น scenario เดียว (AC-INT-0-04) เพราะกลไก
> เดียวกันทุกประการ ต่างกันแค่ปลายทางหลัง redeem สำเร็จ

#### AC-INT-0-01 — ขอรหัสจับคู่อุปกรณ์จากเว็บสำเร็จ (mint pairing-code, REQ-18)
- **Given**: ผู้ใช้ล็อกอินอยู่บนเว็บแอปแล้ว (ONB-0) และเปิดหน้าโปรไฟล์
- **When**: ผู้ใช้กดปุ่มขอรหัสจับคู่อุปกรณ์
- **Then**: ระบบสร้างรหัสจับคู่อุปกรณ์ 6 หลัก อายุการใช้งาน 5 นาทีนับจากออกรหัส ผูกกับ `userId` ของผู้ใช้คนนั้น
  และแสดงรหัสบนหน้าจอเว็บทันที
- Prototype: [11-device-integrations.html](../02-design/01-prototypes/v1/11-device-integrations.html)
  (ปุ่ม "ขอรหัสจับคู่อุปกรณ์" แสดงรหัส 6 หลัก + expiry countdown)
- ต้นทาง decision: [Smart Integrations spec § ข้อสมมติฐาน/การตัดสินใจที่ยืนยันแล้ว](01-spec/20260823-04-smart-integrations.md#ข้อสมมติฐานการตัดสินใจที่ยืนยันแล้ว),
  [api-spec.md §3.1](../02-design/02-technical/api-spec.md) (`POST /auth/pairing-codes`) ·
  [user-journeys.md#int-0--ยืนยันตัวตนก่อนจับคู่อุปกรณ์ผ่านรหัสจับคู่-req-18](../02-design/01-prototypes/user-journeys.md#int-0--ยืนยันตัวตนก่อนจับคู่อุปกรณ์ผ่านรหัสจับคู่-req-18)
  (steps 1–3)

#### AC-INT-0-02 — กรอกรหัสจับคู่บนมือถือสำเร็จ แลกเป็น session แบบ silent (redeem pairing-code, REQ-18)
- **Given**: ผู้ใช้เปิด companion app บนมือถือ (ไม่มีหน้าจอ auth ของตัวเอง) และมีรหัสจับคู่ 6 หลักที่ยังไม่หมด
  อายุ/ยังไม่ถูกใช้จากเว็บ (จาก AC-INT-0-01)
- **When**: ผู้ใช้กรอกรหัสนั้นบนมือถือ
- **Then**: ระบบตรวจสอบว่ารหัสถูกต้อง ยังไม่หมดอายุ และยังไม่ถูกใช้ ลบรหัสทิ้งถาวรทันที (single-use enforce
  ด้วยการลบ ไม่ใช่ตั้งสถานะ "ใช้แล้ว") แล้ว mint token ผูกกับบัญชีเดิมที่สร้างรหัสไว้ มือถือใช้ token นั้น
  sign in แบบ silent (ไม่ต้องกรอก credential ซ้ำ) แล้วเข้าสู่หน้าจับคู่อุปกรณ์จริง (INT-2 หรือ INT-3 UI
  แล้วแต่ว่าผู้ใช้ต้องการจับคู่อุปกรณ์ชนิดใด)
- Prototype: [12-device-pairing.html](../02-design/01-prototypes/v1/12-device-pairing.html)
- ต้นทาง decision: [Smart Integrations spec § ข้อสมมติฐาน/การตัดสินใจที่ยืนยันแล้ว](01-spec/20260823-04-smart-integrations.md#ข้อสมมติฐานการตัดสินใจที่ยืนยันแล้ว),
  [api-spec.md §3.1](../02-design/02-technical/api-spec.md) (`POST /auth/pairing-codes/redeem`) ·
  [user-journeys.md#int-0--ยืนยันตัวตนก่อนจับคู่อุปกรณ์ผ่านรหัสจับคู่-req-18](../02-design/01-prototypes/user-journeys.md#int-0--ยืนยันตัวตนก่อนจับคู่อุปกรณ์ผ่านรหัสจับคู่-req-18)
  (steps 4–7)

#### AC-INT-0-03 — รหัสจับคู่ไม่ถูกต้อง/หมดอายุ/ถูกใช้ไปแล้ว ระบบปฏิเสธด้วยกรณีเดียว (410, REQ-18)
- **Given**: ผู้ใช้กรอกรหัสจับคู่บนมือถือที่ไม่ตรงกับรหัสใดที่ยังใช้ได้จริง (ไม่ว่าจะเพราะไม่เคยมีอยู่จริง,
  หมดอายุไปแล้ว, หรือถูกใช้ไปแล้วก่อนหน้านี้ — 3 สถานการณ์นี้แยกไม่ออกอีกต่อไปเพราะรหัสถูกลบทิ้งถาวรทันทีที่
  redeem สำเร็จครั้งแรก)
- **When**: มือถือส่งรหัสนั้นไป redeem
- **Then**: ระบบปฏิเสธคำขอด้วยกรณีเดียวครอบคลุมทั้ง 3 สถานการณ์ (ไม่แยกแยะให้ผู้ใช้ทราบว่าเป็นกรณีไหน — เป็น
  ความจริงเชิง implementation ที่ตั้งใจยอมรับ ไม่ใช่ช่องโหว่) และไม่ mint token ใด ๆ ผู้ใช้ต้องกลับไปขอรหัส
  ใหม่จากเว็บ
- Prototype: [13-companion-pairing-code.html](../02-design/01-prototypes/v1/13-companion-pairing-code.html)
  (สถานะรหัสไม่ถูกต้อง/หมดอายุ)
- ต้นทาง decision: [api-spec.md §3.1](../02-design/02-technical/api-spec.md) (`POST /auth/pairing-codes/redeem`
  — แก้ error case เป็น `410` กรณีเดียวเมื่อ 2026-08-30 รอบ 5) ·
  [user-journeys.md#int-0--ยืนยันตัวตนก่อนจับคู่อุปกรณ์ผ่านรหัสจับคู่-req-18](../02-design/01-prototypes/user-journeys.md#int-0--ยืนยันตัวตนก่อนจับคู่อุปกรณ์ผ่านรหัสจับคู่-req-18)
  (Alt/Edge Case แรก)

#### AC-INT-0-04 — ต้องผ่านกลไกรหัสจับคู่สำเร็จก่อน จึงจะเข้าหน้าจับคู่อุปกรณ์ (ตาชั่งอัจฉริยะหรือ wearable) บนมือถือได้ (precondition guard, REQ-18)
- **Given**: ผู้ใช้เปิด companion app บนมือถือที่ยังไม่เคย redeem รหัสจับคู่อุปกรณ์สำเร็จ (ไม่มี session ที่
  ผูกกับบัญชีผู้ใช้ใด — ไม่ว่าจะเพราะยังไม่มีบัญชีจากเว็บเลย หรือมีบัญชีแล้วแต่ยังไม่ redeem รหัสบนมือถือเครื่อง
  นี้)
- **When**: ผู้ใช้พยายามเข้าหน้าจับคู่ตาชั่งอัจฉริยะ (ปลายทางของ INT-2) หรือหน้าเชื่อมต่อ wearable (ปลายทาง
  ของ INT-3) บนมือถือ
- **Then**: ระบบไม่ให้เข้าหน้าจับคู่อุปกรณ์ปลายทางใด ๆ จนกว่าจะผ่านขั้นตอนกลไกรหัสจับคู่ครบ (ขอรหัสจากเว็บ
  ONB-0 → กรอกรหัสบนมือถือ → redeem สำเร็จ, AC-INT-0-01/02) ก่อนเสมอ — พฤติกรรมเดียวกันไม่ว่าจะพยายามเข้า
  ปลายทางใด (ปลายทาง INT-2 หรือ INT-3 เท่านั้นที่ต่างกัน ไม่ใช่กลไกรหัสจับคู่)
- Prototype: flow เชิงเส้น [11-device-integrations.html](../02-design/01-prototypes/v1/11-device-integrations.html)
  (ขอรหัสบนเว็บ) → [13-companion-pairing-code.html](../02-design/01-prototypes/v1/13-companion-pairing-code.html)
  (กรอกรหัสบนมือถือ) → [12-device-pairing.html](../02-design/01-prototypes/v1/12-device-pairing.html)
  (เข้าหน้าจับคู่อุปกรณ์จริงหลัง redeem สำเร็จ — ปลายทางแตกต่างกันตาม INT-2/INT-3 ที่ผู้ใช้เลือก)
- ต้นทาง: [user-journeys.md § ONB-0 Alt/Edge Cases](../02-design/01-prototypes/user-journeys.md#onb-0--สมัครสมาชิก--เข้าสู่ระบบ--ลืมรหัสผ่าน--ออกจากระบบ-req-14-req-15-req-16-req-17)
  (ผู้ใช้เปิดแอปมือถือโดยยังไม่เคยสมัคร/เข้าสู่ระบบบนเว็บมาก่อน → ใช้ INT-2/INT-3 ไม่ได้เลย),
  [user-journeys.md#int-0--ยืนยันตัวตนก่อนจับคู่อุปกรณ์ผ่านรหัสจับคู่-req-18](../02-design/01-prototypes/user-journeys.md#int-0--ยืนยันตัวตนก่อนจับคู่อุปกรณ์ผ่านรหัสจับคู่-req-18)
  (Alt/Edge Case ที่สอง)

---

### INT-1 — พยากรณ์วันถึงเป้าหมายน้ำหนัก

#### AC-INT-1-01 — เห็นวันที่คาดว่าจะถึงเป้าหมายน้ำหนัก (REQ-11)
- **Given**: ผู้ใช้มีเป้าหมายน้ำหนัก (จาก ONB-3) และมีประวัติ log แคลอรี่จริงสะสมเพียงพอ (PLN-3) โดยมีอัตรา
  ขาดดุล/เกินดุลเฉลี่ยที่ไม่เป็น 0 และสอดคล้องกับทิศทางเป้าหมาย
- **When**: ผู้ใช้เปิดหน้า Progress/Insights
- **Then**: ระบบดึงอัตราขาดดุลแคลอรี่เฉลี่ยจาก log จริง แปลงเป็นอัตราการเปลี่ยนแปลงน้ำหนักด้วยค่าคงที่
  7,700 kcal ≈ 1 กก. แล้วคำนวณและแสดงวันที่คาดว่าจะถึงน้ำหนักเป้าหมาย
- Prototype: [10-progress-insights.html](../02-design/01-prototypes/v1/10-progress-insights.html)

#### AC-INT-1-02 — ประวัติ log ไม่เพียงพอ แจ้งให้สะสมข้อมูลเพิ่ม (REQ-11)
- **Given**: ผู้ใช้เพิ่งเริ่มใช้แอปและมีประวัติ log แคลอรี่จริงสะสมไม่เพียงพอ
- **When**: ผู้ใช้เปิดหน้า Progress/Insights
- **Then**: ระบบแจ้งผู้ใช้ว่ายังพยากรณ์ไม่ได้ ต้องสะสมข้อมูลเพิ่ม แทนที่จะแสดงวันที่คาดการณ์
- Prototype: [10-progress-insights.html](../02-design/01-prototypes/v1/10-progress-insights.html)

#### AC-INT-1-03 — อัตราขาดดุลเฉลี่ยเป็น 0 หรือสวนทางเป้าหมาย แสดงข้อความแจ้งเตือนแทน (REQ-11)
- **Given**: ผู้ใช้มีประวัติ log เพียงพอ แต่อัตราขาดดุล/เกินดุลแคลอรี่เฉลี่ยที่คำนวณได้เป็น 0 หรือสวนทางกับ
  เป้าหมายที่ตั้งไว้
- **When**: ผู้ใช้เปิดหน้า Progress/Insights
- **Then**: ระบบแสดงข้อความแจ้งเตือนแทนวันที่คาดการณ์ (ไม่แสดงวันที่ที่คำนวณไม่ได้จริง)
- Prototype: [10-progress-insights.html](../02-design/01-prototypes/v1/10-progress-insights.html)

#### AC-INT-1-04 — กราฟแนวโน้มน้ำหนัก/แคลอรี่ใช้ earth-tone palette ไม่ใช้ red/green traffic-light (REQ-11, NFR-13)
- **Given**: ผู้ใช้เปิดหน้า Progress/Insights ที่มีกราฟแนวโน้มน้ำหนัก/แคลอรี่แสดงอยู่ ไม่ว่าตัวเลขล่าสุดจะ
  เพิ่มขึ้นหรือลดลงจากค่าก่อนหน้า
- **When**: ระบบ render กราฟแนวโน้มนั้น
- **Then**: กราฟใช้ palette earth tone เดียวกับ design system เท่านั้น — เส้นข้อมูลจริงใช้ `--color-clay`
  เส้น/พื้นที่เป้าหมายใช้ `--color-sage` แบบจาง (opacity ~30%) — ห้ามใช้สี red/green แบบ traffic-light สื่อ
  ความหมายว่าน้ำหนักขึ้น = แย่ (แดง) หรือลง = ดี (เขียว) ไม่ว่าตัวเลขจะเปลี่ยนทิศทางใด
- Prototype: [10-progress-insights.html](../02-design/01-prototypes/v1/10-progress-insights.html)
  (inline SVG line chart ใช้สี `--color-clay`/`--color-sage` ตรงตามกติกานี้)

> หมายเหตุ: scenario นี้มาจาก [NFR-13](01-spec/20260827-05-non-functional-requirements.md) (เพิ่ม
> 2026-08-29) ซึ่ง mirror [DESIGN.md §4.4](../02-design/01-prototypes/DESIGN.md) และยืนยันการ mapping
> กับ INT-1 เท่านั้นจาก [backlog.md NFR Traceability
> หมายเหตุ 2](backlog.md#non-functional-requirements-nfr-traceability) — ไม่ใช่ Alt/Edge Case ของ
> user-journeys.md แต่มีหลักฐานตรงในเอกสารอื่นแล้ว จึงไม่ใช่การเดา

### INT-2 — ซิงค์ตาชั่งอัจฉริยะ

#### AC-INT-2-01 — ซิงค์น้ำหนัก/องค์ประกอบร่างกายจากตาชั่งอัจฉริยะอัตโนมัติ (REQ-12)
- **Given**: ผู้ใช้จับคู่ตาชั่งอัจฉริยะกับแอปผ่าน Bluetooth หรือ Health API สำเร็จแล้ว
- **When**: ผู้ใช้ชั่งน้ำหนัก
- **Then**: ระบบซิงค์ค่าน้ำหนัก/องค์ประกอบร่างกายล่าสุดเข้าโปรไฟล์ผู้ใช้ทันทีโดยไม่ต้องกรอกเอง และค่านี้ถูกใช้
  คำนวณ TDEE ใหม่ (ONB-1), แคลอรี่เผาผลาญ (REC-2), และพยากรณ์เป้าหมาย (INT-1) ต่อ
- Prototype: [12-device-pairing.html](../02-design/01-prototypes/v1/12-device-pairing.html)

#### AC-INT-2-02 — เชื่อมต่อไม่สำเร็จ fallback ให้กรอกน้ำหนักเอง (REQ-12)
- **Given**: ผู้ใช้พยายามซิงค์น้ำหนักจากตาชั่งอัจฉริยะ
- **When**: การเชื่อมต่อ Bluetooth หรือ Health API ไม่สำเร็จ หรือขาดหาย
- **Then**: ระบบตกกลับไปให้ผู้ใช้กรอกน้ำหนักเอง แทนการซิงค์อัตโนมัติ
- Prototype: [11-device-integrations.html](../02-design/01-prototypes/v1/11-device-integrations.html)

> **หมายเหตุ (renumbering, เพิ่ม 2026-08-30)**: กลไกรหัสจับคู่อุปกรณ์ (mint/redeem/error-case/precondition
> guard) ที่เคยอยู่ที่ AC-INT-2-03 ถึง AC-INT-2-06 ย้ายไปเป็น **AC-INT-0-01 ถึง AC-INT-0-04** ทั้งหมดแล้ว
> (ดู [INT-0 section](#int-0--ยืนยันตัวตนก่อนจับคู่อุปกรณ์ผ่านรหัสจับคู่-pairing-code) ด้านบน) เพราะกลไกนี้
> ได้รับ Feature ID/REQ-18 ของตัวเองแล้ว ไม่ใช่ business rule เฉพาะของ INT-2/REQ-12 อีกต่อไป —
> precondition guard scenario สำหรับปลายทางตาชั่งอัจฉริยะโดยเฉพาะ ดู **AC-INT-0-04**

> หมายเหตุ: journey ของ INT-2 ยังมี Alt/Edge Case ที่ระบุว่า "มีค่าน้ำหนักหลายค่าในวันเดียว ใช้ค่าล่าสุด
> หรือค่าเฉลี่ยของวันนั้น ยังไม่ระบุชัดเจน" — เป็นพฤติกรรมที่ยังไม่ถูกตัดสินใจ จึงไม่แปลงเป็น scenario ในไฟล์นี้
> (ดู [Open Questions ของ user-journeys.md](../02-design/01-prototypes/user-journeys.md#open-questions) ข้อ 5)

### INT-3 — ซิงค์ข้อมูล Wearable

#### AC-INT-3-01 — มีข้อมูลจาก wearable ใช้แทนค่าประมาณจากสูตร MET (REQ-13)
- **Given**: ผู้ใช้เชื่อมต่อ wearable ผ่าน Apple Health/Google Health Connect สำเร็จแล้ว
- **When**: ผู้ใช้ออกกำลังกาย และมีข้อมูลแคลอรี่ที่เผาผลาญจริงจาก wearable ส่งมา
- **Then**: ระบบใช้ค่าจาก wearable แทนที่ค่าประมาณจากสูตร MET (REC-2) และค่านี้ถูกใช้ในการบันทึก log (PLN-3)
  และการพยากรณ์ (INT-1) ต่อ
- Prototype: [11-device-integrations.html](../02-design/01-prototypes/v1/11-device-integrations.html)

#### AC-INT-3-02 — Wearable ไม่ได้เชื่อมต่อหรือข้อมูลไม่ครบ ใช้ค่าประมาณจากสูตร MET แทนชั่วคราว (REQ-13)
- **Given**: ผู้ใช้กำลังออกกำลังกาย
- **When**: Wearable ไม่ได้เชื่อมต่อ หรือข้อมูลจาก wearable มาช้า/ไม่ครบ
- **Then**: ระบบใช้ค่าประมาณจากสูตร MET (REC-2) แทนชั่วคราว จนกว่าจะมีข้อมูล wearable ที่สมบูรณ์
- Prototype: [11-device-integrations.html](../02-design/01-prototypes/v1/11-device-integrations.html)

> หมายเหตุ: journey ของ INT-3 ยังมี Alt/Edge Case ที่ระบุว่า "ค่าจาก wearable กับค่าประมาณจากสูตร MET
> ต่างกันมาก ยังไม่ระบุวิธีจัดการความขัดแย้ง" — เป็นพฤติกรรมที่ยังไม่ถูกตัดสินใจ จึงไม่แปลงเป็น scenario
> ในไฟล์นี้ (ดู [Open Questions ของ user-journeys.md](../02-design/01-prototypes/user-journeys.md#open-questions) ข้อ 5)

#### AC-INT-3-03 — ส่ง sessionId ที่ไม่มีอยู่จริงมากับ wearable reading ระบบต้อง reject ก่อนเขียนข้อมูล (REQ-13, NFR-12)
- **Given**: Wearable ส่งค่าแคลอรี่ที่เผาผลาญมาที่ระบบพร้อม `sessionId` ที่ไม่ตรงกับ Workout Session ใด
  ของผู้ใช้คนนี้ (เช่น session ถูกลบ/หมดอายุ หรือผิดผู้ใช้)
- **When**: Client เรียก `POST /integrations/wearable/readings` ด้วย `sessionId` นั้น
- **Then**: ระบบตรวจสอบว่า session ปลายทางมีอยู่จริงและเป็นของผู้ใช้คนเดียวกันก่อนเขียน Wearable Reading
  เสมอ (referential existence validation ตาม NFR-12) เมื่อไม่พบ ระบบปฏิเสธคำขอนี้ ไม่บันทึก Wearable
  Reading และไม่นำค่านั้นไปแทนที่ค่าประมาณ MET ของ session ใด ๆ — ระบบยังคงใช้ค่าประมาณจากสูตร MET
  (REC-2) ตามปกติสำหรับ session ที่แท้จริงต่อไป
- Prototype: ไม่มี — เป็น server-side validation ที่ไม่มี UI mockup เฉพาะใน `v1/`

> หมายเหตุ: เช่นเดียวกับ AC-REC-2-04 — มาจาก [NFR-12](01-spec/20260827-05-non-functional-requirements.md)
> ไม่ใช่ Alt/Edge Case ของ user-journeys.md ยืนยันการ mapping กับ INT-3 จาก [backlog.md NFR Traceability
> หมายเหตุ 1](backlog.md#non-functional-requirements-nfr-traceability) และหลักฐานตรงใน
> [database-schema.md §8.3](../02-design/02-technical/database-schema.md#83-fk--constraint-enforcement-migration-ย้ายจาก-schema-level-ไป-cloud-function)
> ที่ยกตัวอย่าง `sessionId` ใน `POST /integrations/wearable/readings` ไว้ชัดเจนว่าเป็นกรณีที่ต้องตรวจสอบ

> **หมายเหตุ (renumbering, เพิ่ม 2026-08-30)**: precondition guard scenario ที่เคยเป็น **AC-INT-3-04**
> ย้ายไปรวมกับปลายทาง INT-2 เป็นสถานการณ์เดียวที่ **AC-INT-0-04** แล้ว (ดู
> [INT-0 section](#int-0--ยืนยันตัวตนก่อนจับคู่อุปกรณ์ผ่านรหัสจับคู่-pairing-code) ด้านบน) เพราะกลไกรหัส
> จับคู่อุปกรณ์เป็นกลไกเดียวกันทุกประการไม่ว่าปลายทางจะเป็นตาชั่งอัจฉริยะ (INT-2) หรือ wearable (INT-3) —
> ตอนนี้มี Feature ID/REQ-18 ของตัวเองแล้ว ไม่ใช่ technical precondition ที่ไม่มี REQ number แยกอีกต่อไป

---

## สรุปจำนวน Scenario ต่อ Feature

| Feature ID | จำนวน AC Scenario |
|---|---|
| ONB-0 | 7 |
| ONB-1 | 3 |
| ONB-2 | 3 |
| ONB-3 | 5 |
| REC-1 | 3 |
| REC-2 | 4 |
| REC-3 | 2 |
| REC-4 | 3 |
| PLN-1 | 3 |
| PLN-2 | 4 |
| PLN-3 | 3 |
| PLN-4 | 3 |
| INT-0 | 4 |
| INT-1 | 4 |
| INT-2 | 2 |
| INT-3 | 3 |
| **รวม** | **56** |

> อัปเดต 2026-08-29: +3 scenario จาก NFR-12/NFR-13 ที่เพิ่มใหม่ (AC-REC-2-04, AC-INT-3-03 จาก NFR-12;
> AC-INT-1-04 จาก NFR-13) — ดูหมายเหตุข้อยกเว้นที่ต้นไฟล์
>
> อัปเดต 2026-08-29 (เพิ่มเติม): +6 scenario จาก **ONB-0** (Authentication) ที่เพิ่มเข้า backlog.md เป็น
> Feature ID ใหม่ (Must) — AC-ONB-0-01 ถึง AC-ONB-0-06 ครอบคลุม REQ-14/15/16/17 ทั้งหมด รวม Feature ID
> ทั้งหมดในไฟล์นี้จาก 14 เป็น **15** และรวม scenario จาก 45 เป็น **51**
>
> อัปเดต 2026-08-30 (reconcile ตาม CLAUDE.md § "Docs/code drift" — ONB-0 เป็น web-only + กลไก pairing-code
> ใหม่): +6 scenario — **AC-ONB-0-07** (พื้นผิว UI เป็น web-only เท่านั้น), **AC-INT-2-03 ถึง AC-INT-2-06**
> (mint/redeem/error-case/precondition ของกลไกรหัสจับคู่อุปกรณ์ที่ทำให้มือถือไม่มีหน้าจอ auth ของตัวเองยังคง
> ระบุตัวตนผู้ใช้ได้ก่อนจับคู่ตาชั่งอัจฉริยะ), **AC-INT-3-04** (precondition เดียวกันสำหรับ wearable) รวม
> scenario จาก 51 เป็น **57** (Feature ID ยังคง 15 ตัวเท่าเดิม — ไม่มี Feature ID ใหม่ เพียงเพิ่ม scenario
> ภายใน ONB-0/INT-2/INT-3 ที่มีอยู่แล้ว)
>
> อัปเดต 2026-08-30 (renumbering หลัง `feature-list-journey` เพิ่ม Feature ID **INT-0** + **REQ-18**
> formal): AC-INT-2-03 ถึง AC-INT-2-06 และ AC-INT-3-04 (รวม 5 scenario) ย้ายเป็น **AC-INT-0-01 ถึง
> AC-INT-0-04** (4 scenario — AC-INT-2-06 กับ AC-INT-3-04 ซึ่งเป็น precondition guard คนละปลายทางรวมเป็น
> scenario เดียวเพราะกลไกเดียวกันทุกประการ) INT-2 เหลือ 2 scenario เดิม (01/02) INT-3 เหลือ 3 scenario เดิม
> (01/02/03) รวม Feature ID ในไฟล์นี้จาก 15 เป็น **16** และรวม scenario จาก 57 เป็น **56** (57 − 5 ย้ายออก
> + 4 ย้ายเข้า INT-0) — เนื้อหา Given-When-Then ไม่เปลี่ยน มีแค่ ID/การจัดกลุ่ม/REQ อ้างอิงที่ปรับ

---

อ้างอิงต้นฉบับ: [backlog.md](backlog.md) · [01-spec/](01-spec/index.md) ·
[user-journeys.md](../02-design/01-prototypes/user-journeys.md)
