# Test Cases — Onboarding & Personalization (ONB-0, ONB-1, ONB-2, ONB-3)

- **ประเภทเอกสาร:** Test Cases (ต่อ Epic — Onboarding & Personalization)
- **สถานะเอกสาร:** Draft
- **วันที่สร้าง:** 2026-08-27
- **สร้างโดย:** skill `test-suite-builder`
- **อัปเดตล่าสุด:** 2026-08-31 (รอบ 2) — formalize การแยกเป้าหมายแคลอรี่ของ ONB-3/REQ-02 เป็น **2 ค่าแยกกัน**
  (`dailyCalorieTargetKcal` เผาผลาญ ไม่มี safety floor / `dailyIntakeTargetKcal` ที่ควรได้รับ มี safety
  floor) ตามที่ `feature-journey-writer`/`api-db-spec-writer` เพิ่งยืนยันจากโค้ดจริงที่ shipped — rescope
  TC-ONB-3-001 ถึง 007 ให้ระบุค่าทั้งสองแยกกันชัดเจน และเพิ่ม **TC-ONB-3-008** ใหม่ทดสอบว่า
  `dailyCalorieTargetKcal` ไม่มี safety floor แม้ในกรณีที่ค่าต่ำมาก — ดู [log
  2026-08-31](../../../05-log/20260831-log.md)

ต้นทาง (upstream, read-only):
[acceptance-criteria.md § Epic 1](../../../01-requirements/acceptance-criteria.md#epic-1-onboarding--personalization) ·
[backlog.md](../../../01-requirements/backlog.md) ·
[01-spec/20260823-01-onboarding-personalization.md](../../../01-requirements/01-spec/20260823-01-onboarding-personalization.md) ·
[user-journeys.md](../../../02-design/01-prototypes/user-journeys.md) ·
ดูภาพหน้าจอประกอบได้ที่ prototype
[v1/00-auth-welcome.html](../../../02-design/01-prototypes/v1/00-auth-welcome.html),
[v1/00-auth-signup.html](../../../02-design/01-prototypes/v1/00-auth-signup.html),
[v1/00-auth-login.html](../../../02-design/01-prototypes/v1/00-auth-login.html),
[v1/00-auth-forgot-password.html](../../../02-design/01-prototypes/v1/00-auth-forgot-password.html)
(เพิ่ม 2026-08-29, ONB-0),
[v1/11-device-integrations.html](../../../02-design/01-prototypes/v1/11-device-integrations.html)
(ปุ่มออกจากระบบของ ONB-0),
[v1/01-onboarding-personal-info.html](../../../02-design/01-prototypes/v1/01-onboarding-personal-info.html),
[v1/02-onboarding-equipment.html](../../../02-design/01-prototypes/v1/02-onboarding-equipment.html),
[v1/03-onboarding-goal-select.html](../../../02-design/01-prototypes/v1/03-onboarding-goal-select.html),
[v1/04-onboarding-goal-confirm.html](../../../02-design/01-prototypes/v1/04-onboarding-goal-confirm.html)

ดูภาพรวม scope/risk/entry-exit criteria ของทั้งโปรเจกต์ที่
[test-plan.md](../test-plan.md) — ทั้ง **ONB-0**, ONB-1, ONB-2, ONB-3 อยู่ใน scope **Must** ของรอบทดสอบนี้

รูปแบบ ID: `TC-{FeatureID}-{3-digit}` เช่น `TC-ONB-1-001`

---

## ONB-0 — สมัครสมาชิก / เข้าสู่ระบบ / ลืมรหัสผ่าน / ออกจากระบบ (REQ-14, REQ-15, REQ-16, REQ-17)

Journey: [user-journeys.md § ONB-0](../../../02-design/01-prototypes/user-journeys.md#onb-0--สมัครสมาชิก--เข้าสู่ระบบ--ลืมรหัสผ่าน--ออกจากระบบ-req-14-req-15-req-16-req-17) ·
AC: [AC-ONB-0-01](../../../01-requirements/acceptance-criteria.md#ac-onb-0-01--สมัครสมาชิกสำเร็จ-สร้างบัญชีผู้ใช้ใหม่ก่อนเข้าสู่-onb-1-req-14),
[AC-ONB-0-02](../../../01-requirements/acceptance-criteria.md#ac-onb-0-02--เข้าสู่ระบบสำเร็จด้วยวิธีเดียวกับที่สมัครไว้-ระบบจดจำสถานะ-login-req-15),
[AC-ONB-0-03](../../../01-requirements/acceptance-criteria.md#ac-onb-0-03--ผู้ใช้ที่สมัครด้วย-emailpassword-ขอรีเซ็ตรหัสผ่านผ่านอีเมลได้-req-16),
[AC-ONB-0-04](../../../01-requirements/acceptance-criteria.md#ac-onb-0-04--บัญชีที่สมัครด้วย-googleapple-ขอรีเซ็ตรหัสผ่านไม่ได้-req-16),
[AC-ONB-0-05](../../../01-requirements/acceptance-criteria.md#ac-onb-0-05--ออกจากระบบจากหน้าโปรไฟล์-ล้าง-session-ทันที-req-17),
[AC-ONB-0-06](../../../01-requirements/acceptance-criteria.md#ac-onb-0-06--session-หมดอายุ-ต้องเข้าสู่ระบบใหม่-req-15),
[AC-ONB-0-07](../../../01-requirements/acceptance-criteria.md#ac-onb-0-07--พื้นผิว-ui-ของ-authentication-ทั้งหมดมีเฉพาะที่เว็บแอปเท่านั้น-เพิ่ม-2026-08-30-req-14-req-15)

> **หมายเหตุการทดสอบ ONB-0**: AC-ONB-0-01 (สมัครสมาชิก) และ AC-ONB-0-02 (เข้าสู่ระบบ) แต่ละอันมี **1 test
> case** ใช้ **email/password เป็นตัวแทน** เท่านั้น ไม่แยก 3 test case ตามวิธี (email/password, Google,
> Apple) เพราะ prototype (`00-auth-signup.html`/`00-auth-login.html`) จำลอง Google OAuth/Sign in with
> Apple เป็น instant success แบบเดียวกันทุกวิธี (ไม่มี OAuth จริง) และผลลัพธ์ปลายทาง (สร้าง/ยืนยัน `userId`
> แล้วไปขั้นตอนถัดไป) เหมือนกันทุกวิธี ไม่ใช่ variation ที่มีค่าต่างกันจริงแบบ AC-ONB-3-01 (ที่ค่าคงที่ต่างกัน
> ตามเป้าหมาย) — ต่างจากรูปแบบ variation ปกติของไฟล์นี้
>
> AC-ONB-0-06 (session หมดอายุ) เป็น **documentation-level test case** เพราะ prototype v1 ยังไม่ implement
> การตรวจสอบ session จริงข้ามการเปิดแอป (ดูหมายเหตุใน `00-auth-welcome.html`) และระยะเวลา session timeout
> ที่แน่นอนยังไม่ระบุใน spec — จัด "not testable in this round" ตาม [test-plan.md §4 R13](../test-plan.md)
> เหมือน R7/R11/R12 รอ backend จริง

### TC-ONB-0-001 — สมัครสมาชิกด้วย email/password สำเร็จ สร้างบัญชีใหม่และเข้าสู่ ONB-1

| Field | รายละเอียด |
|---|---|
| Test ID | TC-ONB-0-001 |
| Test Case Name | สมัครสมาชิกด้วย email/password ครบถ้วน ระบบสร้างบัญชีผู้ใช้ใหม่และพาไปขั้นตอนกรอกข้อมูลส่วนตัว (ONB-1) ทันที |
| Pre-condition | ผู้ใช้เปิดแอปครั้งแรก ยังไม่มีบัญชีผู้ใช้ อยู่ที่หน้า `00-auth-welcome.html` แล้วกดปุ่ม "สร้างบัญชีใหม่" มาถึงหน้า `00-auth-signup.html` |
| Test Steps | 1. เลือกวิธีสมัครสมาชิกด้วย email/password<br>2. กรอกอีเมล = `newuser@example.com`<br>3. กรอกรหัสผ่าน = `Passw0rd!23`<br>4. กดปุ่ม "สมัครสมาชิก" |
| Expected Result | ระบบสร้างบัญชีผู้ใช้ใหม่ (`userId` จำลอง) บันทึกสถานะ signed-in ไว้ (`localStorage` key `smartfit_auth_user`) แล้วพาไปหน้า `01-onboarding-personal-info.html` (ONB-1) ทันที โดยไม่มีขั้นตอนอื่นคั่นกลาง |
| Test Data | อีเมล = `newuser@example.com`, รหัสผ่าน = `Passw0rd!23` — ไม่มี password policy ที่ยืนยันแล้วใน spec (Open Point) เลือกใช้ตัวอย่างที่มีทั้งตัวเลข/ตัวพิมพ์ใหญ่-เล็ก/สัญลักษณ์เป็น content decision ของเอกสารนี้เอง |
| References | REQ-14 · AC-ONB-0-01 · [User Journey ONB-0](../../../02-design/01-prototypes/user-journeys.md#onb-0--สมัครสมาชิก--เข้าสู่ระบบ--ลืมรหัสผ่าน--ออกจากระบบ-req-14-req-15-req-16-req-17) · prototype [00-auth-signup.html](../../../02-design/01-prototypes/v1/00-auth-signup.html) |

### TC-ONB-0-002 — เข้าสู่ระบบด้วย email/password สำเร็จ ระบบจดจำสถานะ login

| Field | รายละเอียด |
|---|---|
| Test ID | TC-ONB-0-002 |
| Test Case Name | เข้าสู่ระบบด้วย email/password ที่สมัครไว้แล้ว ระบบจดจำสถานะ login (session persistence) |
| Pre-condition | ผู้ใช้มีบัญชีอยู่แล้ว (สมัครด้วย email/password ไว้ก่อน เช่นจาก TC-ONB-0-001) และอยู่ที่หน้า `00-auth-login.html` |
| Test Steps | 1. กรอกอีเมล = `newuser@example.com`<br>2. กรอกรหัสผ่าน = `Passw0rd!23`<br>3. กดปุ่ม "เข้าสู่ระบบ" |
| Expected Result | ระบบยืนยันข้อมูลผ่าน บันทึกสถานะ signed-in ไว้ที่ `localStorage` (`smartfit_auth_user`) จำลอง session persistence แล้วพาผู้ใช้เข้าแอปต่อทันที — ถ้ายังไม่เคยผ่าน onboarding มาก่อน พาไปหน้า ONB-1 ต่อ ถ้าผ่านแล้วพาไป Daily Dashboard โดยไม่ต้อง login ซ้ำ |
| Test Data | อีเมล = `newuser@example.com`, รหัสผ่าน = `Passw0rd!23` |
| References | REQ-15 · AC-ONB-0-02 · [User Journey ONB-0](../../../02-design/01-prototypes/user-journeys.md#onb-0--สมัครสมาชิก--เข้าสู่ระบบ--ลืมรหัสผ่าน--ออกจากระบบ-req-14-req-15-req-16-req-17) · prototype [00-auth-login.html](../../../02-design/01-prototypes/v1/00-auth-login.html) |

### TC-ONB-0-003 — ขอรีเซ็ตรหัสผ่านผ่านอีเมล (บัญชี email/password)

| Field | รายละเอียด |
|---|---|
| Test ID | TC-ONB-0-003 |
| Test Case Name | ผู้ใช้บัญชี email/password ลืมรหัสผ่าน ขอรีเซ็ตผ่านอีเมลที่ลงทะเบียนไว้สำเร็จ |
| Pre-condition | ผู้ใช้สมัครด้วย email/password ไว้แล้ว (`newuser@example.com`) และลืมรหัสผ่าน อยู่ที่หน้า `00-auth-login.html` |
| Test Steps | 1. กดลิงก์ "ลืมรหัสผ่าน?"<br>2. มาถึงหน้า `00-auth-forgot-password.html`<br>3. กรอกอีเมล = `newuser@example.com`<br>4. กดปุ่มยืนยัน/ส่งคำขอ |
| Expected Result | ระบบแสดงข้อความยืนยันว่าคำขอรีเซ็ตรหัสผ่านถูกส่งไปยังอีเมลนั้นแล้ว (ไม่มีการส่งอีเมลจริงเพราะยังไม่มี backend) พร้อมทางกลับไปหน้าเข้าสู่ระบบ |
| Test Data | อีเมล = `newuser@example.com` |
| References | REQ-16 · AC-ONB-0-03 · [User Journey ONB-0](../../../02-design/01-prototypes/user-journeys.md#onb-0--สมัครสมาชิก--เข้าสู่ระบบ--ลืมรหัสผ่าน--ออกจากระบบ-req-14-req-15-req-16-req-17) · prototype [00-auth-forgot-password.html](../../../02-design/01-prototypes/v1/00-auth-forgot-password.html) |

### TC-ONB-0-004 — บัญชี Google/Apple เปิดหน้าลืมรหัสผ่าน เห็นข้อความว่าใช้ไม่ได้

| Field | รายละเอียด |
|---|---|
| Test ID | TC-ONB-0-004 |
| Test Case Name | ผู้ใช้บัญชี Google/Apple เปิดหน้าลืมรหัสผ่าน ระบบแจ้งว่าใช้ไม่ได้กับบัญชีประเภทนี้ |
| Pre-condition | ผู้ใช้สมัครสมาชิกด้วย Google OAuth หรือ Sign in with Apple (ไม่มีรหัสผ่านในระบบ) |
| Test Steps | 1. เปิดหน้าเข้าสู่ระบบ (`00-auth-login.html`)<br>2. กดลิงก์ "ลืมรหัสผ่าน?"<br>3. มาถึงหน้า `00-auth-forgot-password.html` |
| Expected Result | หน้าจอแสดงข้อความแจ้งชัดเจนว่า "ใช้ได้เฉพาะบัญชีที่สมัครด้วยอีเมล/รหัสผ่าน — บัญชีที่เชื่อมกับ Google หรือ Apple ไม่มีรหัสผ่านให้รีเซ็ต เข้าสู่ระบบด้วยวิธีเดิมที่สมัครไว้ได้เลย" |
| Test Data | บัญชีตัวอย่าง = สมัครด้วย Google OAuth (ไม่มีรหัสผ่าน) |
| References | REQ-16 · AC-ONB-0-04 · [User Journey ONB-0](../../../02-design/01-prototypes/user-journeys.md#onb-0--สมัครสมาชิก--เข้าสู่ระบบ--ลืมรหัสผ่าน--ออกจากระบบ-req-14-req-15-req-16-req-17) · prototype [00-auth-forgot-password.html](../../../02-design/01-prototypes/v1/00-auth-forgot-password.html) |

### TC-ONB-0-005 — ออกจากระบบจากหน้าโปรไฟล์ ล้าง session ทันที

| Field | รายละเอียด |
|---|---|
| Test ID | TC-ONB-0-005 |
| Test Case Name | ผู้ใช้กดออกจากระบบจากหน้าโปรไฟล์/device integrations ระบบล้าง session ทันที |
| Pre-condition | ผู้ใช้เข้าสู่ระบบอยู่ (มี `smartfit_auth_user` ใน `localStorage` เช่นจาก TC-ONB-0-002) และอยู่ที่หน้า `11-device-integrations.html` |
| Test Steps | 1. เปิดหน้าโปรไฟล์/device integrations<br>2. กดปุ่ม "ออกจากระบบ" |
| Expected Result | ระบบลบ `smartfit_auth_user` ออกจาก `localStorage` ทันที (ล้าง session) แล้วพาผู้ใช้กลับไปหน้าจอเริ่มต้น (`00-auth-welcome.html`) |
| Test Data | session เดิม = signed-in ด้วย `newuser@example.com` → หลัง logout = ไม่มี session |
| References | REQ-17 · AC-ONB-0-05 · [User Journey ONB-0](../../../02-design/01-prototypes/user-journeys.md#onb-0--สมัครสมาชิก--เข้าสู่ระบบ--ลืมรหัสผ่าน--ออกจากระบบ-req-14-req-15-req-16-req-17) · prototype [11-device-integrations.html](../../../02-design/01-prototypes/v1/11-device-integrations.html) |

### TC-ONB-0-006 — Session หมดอายุ ผู้ใช้ต้องเข้าสู่ระบบใหม่ (documentation-level)

| Field | รายละเอียด |
|---|---|
| Test ID | TC-ONB-0-006 |
| Test Case Name | Session ที่จดจำไว้หมดอายุ ระบบพาผู้ใช้กลับไปหน้าเข้าสู่ระบบแทนที่จะเข้าแอปต่อ |
| Pre-condition | ผู้ใช้เคยเข้าสู่ระบบไว้ แต่ session ถูกถือว่าหมดอายุแล้ว (จำลองว่า backend/session store invalidate ค่าที่เคยออกให้ — prototype v1 ไม่ได้ implement การตรวจสอบวันหมดอายุจริง ดูหมายเหตุใน `00-auth-welcome.html`) |
| Test Steps | 1. เปิดแอปอีกครั้งหลัง session ถูกถือว่าหมดอายุ |
| Expected Result | ระบบตรวจไม่พบ session ที่ยังใช้ได้ พาผู้ใช้ไปหน้าเข้าสู่ระบบ (`00-auth-login.html`) แทนที่จะเข้าแอปต่อได้เลย |
| Test Data | ไม่มีตัวเลขระยะเวลา session timeout ที่แน่นอน (Open Point ยังไม่ resolve ใน spec) — test นี้ตรวจเฉพาะ behavior เมื่อ session ถูกถือว่าหมดอายุแล้ว ไม่ตรวจจับเวลาที่แน่นอน |
| References | REQ-15 · AC-ONB-0-06 · [User Journey ONB-0](../../../02-design/01-prototypes/user-journeys.md#onb-0--สมัครสมาชิก--เข้าสู่ระบบ--ลืมรหัสผ่าน--ออกจากระบบ-req-14-req-15-req-16-req-17) — **หมายเหตุ**: ยังไม่มี prototype ที่ implement การตรวจสอบ session จริง (gap, documentation-level test case รอ backend จริงตาม [test-plan.md §4 R13](../test-plan.md)) |

### TC-ONB-0-007 — ยืนยันว่าไม่มีหน้าจอ Authentication อยู่บนแอปมือถือเลย (web-only UI surface, เพิ่ม 2026-08-30)

> **หมายเหตุประเภท test case**: ต่างจาก TC-ONB-0-001–006 ข้างต้น (runtime/UI interaction ปกติ) test case
> นี้เป็น **code-inspection-level test case** — ตรวจสอบโครงสร้างไฟล์ของ codebase จริงแทนการโต้ตอบกับ UI
> เพราะสิ่งที่ต้องยืนยัน (AC-ONB-0-07) คือ "ไม่มีหน้าจอนี้อยู่เลย" ซึ่งพิสูจน์ได้แน่นอนกว่าด้วยการตรวจโค้ด
> มากกว่าการค้นหาหน้าจอไม่เจอในแอปที่รันจริง (negative UI testing มีความเสี่ยงข้ามจุดที่ควรตรวจได้ง่ายกว่า)
> — สามารถ execute ได้ทันทีในรอบนี้ ไม่ต้องรอ backend (ต่างจาก TC-ONB-0-006) เพราะเป็นการตรวจ static
> structure ของโค้ดที่มีอยู่แล้ว ไม่ใช่ runtime behavior

| Field | รายละเอียด |
|---|---|
| Test ID | TC-ONB-0-007 |
| Test Case Name | ตรวจสอบ codebase ของ `apps/mobile/` ว่าไม่มีไฟล์หน้าจอ signup/login/forgot-password/logout ใด ๆ อยู่เลย |
| Pre-condition | มี codebase ของ `smartfit_daily_app/apps/mobile/app/` ให้ตรวจสอบ |
| Test Steps | 1. เปิดโฟลเดอร์ `smartfit_daily_app/apps/mobile/app/`<br>2. ค้นหาไฟล์ที่มีชื่อ/เนื้อหาเกี่ยวกับ signup, login, forgot-password, หรือ logout screen<br>3. เปรียบเทียบรายการไฟล์ทั้งหมดในโฟลเดอร์นี้กับรายการที่คาดหวัง |
| Expected Result | ไม่พบไฟล์หน้าจอ auth ใด ๆ (signup/login/forgot-password/logout) อยู่ใต้ `apps/mobile/app/` เลย มีเพียง `pairing-code.tsx` และ `device-pairing.tsx` เท่านั้นที่เกี่ยวข้องกับการระบุตัวตน/จับคู่อุปกรณ์ ยืนยันว่าพื้นผิว UI ของ Authentication ทั้งหมดอยู่ที่เว็บแอป (`apps/web/client/`) เพียงที่เดียว |
| Test Data | โฟลเดอร์ตรวจสอบ = `smartfit_daily_app/apps/mobile/app/`; ไฟล์ที่คาดว่าพบ = `pairing-code.tsx`, `device-pairing.tsx` เท่านั้น; ไฟล์ที่คาดว่า**ไม่พบ** = ไฟล์ใด ๆ ที่มีคำว่า `signup`/`login`/`forgot-password`/`logout` ในชื่อหรือเนื้อหา |
| References | REQ-14, REQ-15 · AC-ONB-0-07 · [Onboarding spec § ข้อสมมติฐาน/การตัดสินใจที่ยืนยันแล้ว](../../../01-requirements/01-spec/20260823-01-onboarding-personalization.md#ข้อสมมติฐานการตัดสินใจที่ยืนยันแล้ว) — ไม่มีลิงก์ prototype `v1/` เพราะเป็นการตรวจ codebase จริงของ `apps/mobile/`, ไม่ใช่ prototype HTML |

---

> **หมายเหตุการคำนวณ**: ONB-1/REQ-01 อ้างสูตร Mifflin-St Jeor ตรง ๆ (ชื่อสูตรที่นิยามค่าคงที่ตายตัวอยู่แล้ว
> ในสูตรมาตรฐาน) จึงใช้ค่าคงที่มาตรฐานของสูตรนี้ในการคำนวณ Test Data ด้านล่าง:
> - ชาย: BMR = 10×น้ำหนัก(kg) + 6.25×ส่วนสูง(cm) − 5×อายุ(ปี) + 5
> - หญิง: BMR = 10×น้ำหนัก(kg) + 6.25×ส่วนสูง(cm) − 5×อายุ(ปี) − 161
>
> ส่วนค่า **Activity Factor** ต่อระดับกิจกรรม ไม่มีเอกสารต้นทางใด (spec/backlog/journey/prototype)
> ระบุตัวเลขไว้ตรง ๆ — prototype `01-onboarding-personal-info.html` เพียงกำหนดชื่อ 5 ระดับ
> (`sedentary`/`light`/`moderate`/`active`/`very_active`) โดยไม่มีค่าตัวคูณ เพื่อให้ Expected Result ของ
> test case ที่เกี่ยวกับการคำนวณ TDEE ตรวจสอบได้จริง (ไม่ใช่แค่บรรยาย) เอกสารนี้จึงใช้ **ค่ามาตรฐานที่
> ผูกกับสูตร Mifflin-St Jeor โดยทั่วไป** ได้แก่ sedentary=1.2, light=1.375, moderate=1.55, active=1.725,
> very_active=1.9 — เป็น **content decision ของเอกสารนี้เอง ยังไม่ใช่ค่าที่ยืนยันจากผู้ใช้งานหรือ resolve
> ไว้ใน 01-spec/** ถ้าค่าจริงต่างจากนี้ ต้องกลับมาแก้ Test Data ที่เกี่ยวข้องทั้งหมดด้านล่าง (ดูสรุปใน
> "หมายเหตุ/Content Decisions" ท้ายไฟล์)
>
> เช่นเดียวกัน ONB-3/REQ-02 ระบุ safety floor เป็น **ช่วง** 1,200–1,500 kcal/วัน โดยไม่ได้ปักหมุดตัวเลข
> เดียวที่แน่นอน — เอกสารนี้ใช้ **1,200 kcal/วัน** (ขอบล่างของช่วงที่ยืนยันแล้ว ตรงกับค่าที่ prototype
> `04-onboarding-goal-confirm.html` เลือกใช้เป็นตัวอย่างประกอบ) เป็นค่า floor ที่ใช้ใน Test Data ของ
> AC-ONB-3-03 ด้านล่าง — เป็น content decision เช่นกัน
>
> **อัปเดต 2026-08-31**: safety floor ข้างต้นใช้กับ **`dailyIntakeTargetKcal` เท่านั้น**
> `dailyCalorieTargetKcal` (น้ำหนักตัว × ค่าคงที่ต่อเป้าหมาย — ลดน้ำหนัก=4.5, กระชับสัดส่วน=3.0,
> เพิ่มความอึด=5.5) **ไม่มี safety floor ไม่ว่ากรณีใด** — ดู AC-ONB-3-06/TC-ONB-3-008 ด้านล่าง

---

## ONB-1 — กรอกข้อมูลส่วนตัวเพื่อคำนวณเป้าหมายแคลอรี่ (REQ-01)

Journey: [user-journeys.md § ONB-1](../../../02-design/01-prototypes/user-journeys.md#onb-1--กรอกข้อมูลส่วนตัวเพื่อคำนวณเป้าหมายแคลอรี่-req-01) ·
AC: [AC-ONB-1-01](../../../01-requirements/acceptance-criteria.md#ac-onb-1-01--กรอกข้อมูลครบและถูกต้อง-คำนวณ-tdee-สำเร็จ-req-01),
[AC-ONB-1-02](../../../01-requirements/acceptance-criteria.md#ac-onb-1-02--กรอกข้อมูลไม่ครบหรือไม่ถูกต้อง-req-01),
[AC-ONB-1-03](../../../01-requirements/acceptance-criteria.md#ac-onb-1-03--แก้ไขน้ำหนักส่วนสูงภายหลัง-ต้องคำนวณ-tdee-ใหม่-req-01)

> AC-ONB-1-01 มี 2 test case (ชาย/หญิง) เพราะสูตร Mifflin-St Jeor มีค่าคงที่ต่างกันตามเพศ (+5 สำหรับชาย,
> −161 สำหรับหญิง) — เป็น variation ที่มีความหมายต่อผลการคำนวณจริง ไม่ใช่แค่ข้อมูลซ้ำ
> AC-ONB-1-02 มี 2 test case (ข้อมูลไม่ครบ / ข้อมูลไม่ถูกต้อง) ตามที่ AC ระบุ 2 กรณีไว้ในประโยคเดียวกัน

### TC-ONB-1-001 — กรอกข้อมูลครบถูกต้อง (เพศชาย) คำนวณ TDEE สำเร็จ

| Field | รายละเอียด |
|---|---|
| Test ID | TC-ONB-1-001 |
| Test Case Name | กรอกข้อมูลส่วนตัวครบถ้วนถูกต้อง (เพศชาย) ระบบคำนวณ TDEE และไปขั้นตอนเลือกอุปกรณ์ |
| Pre-condition | ผู้ใช้ใหม่ ยังไม่เคยผ่าน onboarding มาก่อน ไม่มี TDEE ในโปรไฟล์ อยู่ที่หน้า `01-onboarding-personal-info.html` |
| Test Steps | 1. กรอกอายุ = 30 ปี<br>2. เลือกเพศ = ชาย<br>3. กรอกน้ำหนัก = 75 กก.<br>4. กรอกส่วนสูง = 175 ซม.<br>5. เลือกระดับกิจกรรม = ปานกลาง (moderate)<br>6. กดปุ่มถัดไป |
| Expected Result | ระบบคำนวณ BMR = 10×75 + 6.25×175 − 5×30 + 5 = 1,698.75 kcal จากนั้นคูณ Activity Factor ระดับปานกลาง (1.55) ได้ **TDEE = 2,633 kcal/วัน** บันทึกลงโปรไฟล์ แล้วพาไปหน้าเลือกอุปกรณ์ (ONB-2) ทันที |
| Test Data | อายุ 30, เพศ ชาย, น้ำหนัก 75 กก., ส่วนสูง 175 ซม., กิจกรรมระดับปานกลาง (Activity Factor 1.55) → คาดว่า TDEE = 2,633 kcal/วัน |
| References | REQ-01 · AC-ONB-1-01 · [User Journey ONB-1](../../../02-design/01-prototypes/user-journeys.md#onb-1--กรอกข้อมูลส่วนตัวเพื่อคำนวณเป้าหมายแคลอรี่-req-01) · prototype [01-onboarding-personal-info.html](../../../02-design/01-prototypes/v1/01-onboarding-personal-info.html) |

### TC-ONB-1-002 — กรอกข้อมูลครบถูกต้อง (เพศหญิง) คำนวณ TDEE สำเร็จ

| Field | รายละเอียด |
|---|---|
| Test ID | TC-ONB-1-002 |
| Test Case Name | กรอกข้อมูลส่วนตัวครบถ้วนถูกต้อง (เพศหญิง) ระบบคำนวณ TDEE และไปขั้นตอนเลือกอุปกรณ์ |
| Pre-condition | ผู้ใช้ใหม่ ยังไม่เคยผ่าน onboarding มาก่อน ไม่มี TDEE ในโปรไฟล์ อยู่ที่หน้า `01-onboarding-personal-info.html` |
| Test Steps | 1. กรอกอายุ = 28 ปี<br>2. เลือกเพศ = หญิง<br>3. กรอกน้ำหนัก = 60 กก.<br>4. กรอกส่วนสูง = 165 ซม.<br>5. เลือกระดับกิจกรรม = เบา (light)<br>6. กดปุ่มถัดไป |
| Expected Result | ระบบคำนวณ BMR = 10×60 + 6.25×165 − 5×28 − 161 = 1,330.25 kcal จากนั้นคูณ Activity Factor ระดับเบา (1.375) ได้ **TDEE = 1,829 kcal/วัน** บันทึกลงโปรไฟล์ แล้วพาไปหน้าเลือกอุปกรณ์ (ONB-2) ทันที |
| Test Data | อายุ 28, เพศ หญิง, น้ำหนัก 60 กก., ส่วนสูง 165 ซม., กิจกรรมระดับเบา (Activity Factor 1.375) → คาดว่า TDEE = 1,829 kcal/วัน |
| References | REQ-01 · AC-ONB-1-01 · [User Journey ONB-1](../../../02-design/01-prototypes/user-journeys.md#onb-1--กรอกข้อมูลส่วนตัวเพื่อคำนวณเป้าหมายแคลอรี่-req-01) · prototype [01-onboarding-personal-info.html](../../../02-design/01-prototypes/v1/01-onboarding-personal-info.html) |

### TC-ONB-1-003 — กรอกข้อมูลไม่ครบ (ขาดฟิลด์เพศ) ไม่ให้ไปขั้นตอนถัดไป

| Field | รายละเอียด |
|---|---|
| Test ID | TC-ONB-1-003 |
| Test Case Name | ไม่เลือกเพศ ระบบบล็อกไม่ให้คำนวณ TDEE / ไปขั้นตอนถัดไป |
| Pre-condition | ผู้ใช้ใหม่อยู่ที่หน้า `01-onboarding-personal-info.html` |
| Test Steps | 1. กรอกอายุ = 30 ปี<br>2. **ไม่เลือกเพศ (ปล่อยว่าง)**<br>3. กรอกน้ำหนัก = 75 กก.<br>4. กรอกส่วนสูง = 175 ซม.<br>5. เลือกระดับกิจกรรม = ปานกลาง<br>6. กดปุ่มถัดไป |
| Expected Result | ระบบแสดงข้อความ error ใต้ฟิลด์เพศ ("กรุณาเลือกเพศ เพื่อใช้ในการคำนวณ BMR") ไม่คำนวณ TDEE และไม่พาไปหน้าเลือกอุปกรณ์ จนกว่าผู้ใช้จะเลือกเพศให้ครบ |
| Test Data | อายุ 30, เพศ (ว่าง), น้ำหนัก 75 กก., ส่วนสูง 175 ซม., กิจกรรมระดับปานกลาง |
| References | REQ-01 · AC-ONB-1-02 · [User Journey ONB-1](../../../02-design/01-prototypes/user-journeys.md#onb-1--กรอกข้อมูลส่วนตัวเพื่อคำนวณเป้าหมายแคลอรี่-req-01) · prototype [01-onboarding-personal-info.html](../../../02-design/01-prototypes/v1/01-onboarding-personal-info.html) |

### TC-ONB-1-004 — กรอกค่าที่ไม่ถูกต้อง (น้ำหนักติดลบ + อายุเกินช่วง) ไม่ให้ไปขั้นตอนถัดไป

| Field | รายละเอียด |
|---|---|
| Test ID | TC-ONB-1-004 |
| Test Case Name | กรอกน้ำหนักติดลบและอายุเกินช่วงที่สมเหตุสมผล ระบบบล็อกไม่ให้คำนวณ TDEE |
| Pre-condition | ผู้ใช้ใหม่อยู่ที่หน้า `01-onboarding-personal-info.html` |
| Test Steps | 1. กรอกอายุ = 150 ปี (เกินช่วง 10–100 ปี)<br>2. เลือกเพศ = ชาย<br>3. กรอกน้ำหนัก = −10 กก. (ติดลบ)<br>4. กรอกส่วนสูง = 175 ซม.<br>5. เลือกระดับกิจกรรม = ปานกลาง<br>6. กดปุ่มถัดไป |
| Expected Result | ระบบแสดงข้อความ error ใต้ฟิลด์อายุ ("กรุณากรอกอายุระหว่าง 10–100 ปี") และใต้ฟิลด์น้ำหนัก ("กรุณากรอกน้ำหนักระหว่าง 20–250 กก. (ห้ามติดลบ)") ไม่คำนวณ TDEE และไม่พาไปหน้าเลือกอุปกรณ์ |
| Test Data | อายุ 150 (นอกช่วง 10–100), เพศ ชาย, น้ำหนัก −10 กก. (ติดลบ, นอกช่วง 20–250), ส่วนสูง 175 ซม., กิจกรรมระดับปานกลาง |
| References | REQ-01 · AC-ONB-1-02 · [User Journey ONB-1](../../../02-design/01-prototypes/user-journeys.md#onb-1--กรอกข้อมูลส่วนตัวเพื่อคำนวณเป้าหมายแคลอรี่-req-01) · prototype [01-onboarding-personal-info.html](../../../02-design/01-prototypes/v1/01-onboarding-personal-info.html) |

### TC-ONB-1-005 — แก้ไขน้ำหนักภายหลัง คำนวณ TDEE ใหม่ทันที

| Field | รายละเอียด |
|---|---|
| Test ID | TC-ONB-1-005 |
| Test Case Name | ผู้ใช้แก้ไขน้ำหนักผ่านหน้า Settings ภายหลัง onboarding ระบบคำนวณ BMR/TDEE ใหม่ทันที |
| Pre-condition | ผู้ใช้มี TDEE เดิมในโปรไฟล์อยู่แล้วจาก TC-ONB-1-001 (อายุ 30, เพศ ชาย, น้ำหนัก 75 กก., ส่วนสูง 175 ซม., กิจกรรมปานกลาง → TDEE เดิม = 2,633 kcal/วัน) |
| Test Steps | 1. เปิดหน้า Settings/โปรไฟล์<br>2. แก้ไขน้ำหนักจาก 75 กก. เป็น 80 กก. (ส่วนสูง/อายุ/เพศ/กิจกรรมเดิม)<br>3. บันทึกการเปลี่ยนแปลง |
| Expected Result | ระบบคำนวณ BMR ใหม่ = 10×80 + 6.25×175 − 5×30 + 5 = 1,748.75 kcal คูณ Activity Factor 1.55 ได้ **TDEE ใหม่ = 2,711 kcal/วัน** แทนที่ค่าเดิม (2,633 kcal/วัน) ในโปรไฟล์ทันที โดยไม่ต้องผ่าน onboarding ใหม่ |
| Test Data | ก่อนแก้ไข: น้ำหนัก 75 กก. → TDEE เดิม 2,633 kcal/วัน; หลังแก้ไข: น้ำหนัก 80 กก. (อายุ 30, เพศ ชาย, ส่วนสูง 175 ซม., กิจกรรมปานกลางเท่าเดิม) → คาดว่า TDEE ใหม่ = 2,711 kcal/วัน |
| References | REQ-01 · AC-ONB-1-03 · [User Journey ONB-1](../../../02-design/01-prototypes/user-journeys.md#onb-1--กรอกข้อมูลส่วนตัวเพื่อคำนวณเป้าหมายแคลอรี่-req-01) |

---

## ONB-2 — เลือกอุปกรณ์ที่มี (REQ-03)

Journey: [user-journeys.md § ONB-2](../../../02-design/01-prototypes/user-journeys.md#onb-2--เลือกอุปกรณ์ที่มี-req-03) ·
AC: [AC-ONB-2-01](../../../01-requirements/acceptance-criteria.md#ac-onb-2-01--เลือกอุปกรณ์และบันทึกเป็น-filter-req-03),
[AC-ONB-2-02](../../../01-requirements/acceptance-criteria.md#ac-onb-2-02--เลือก-ไม่มีอุปกรณ์-กรองเฉพาะวิดีโอ-bodyweight-req-03),
[AC-ONB-2-03](../../../01-requirements/acceptance-criteria.md#ac-onb-2-03--เปลี่ยนอุปกรณ์ภายหลัง-filter-อัปเดตทันที-req-03)

> AC-ONB-2-01 มี 2 test case (เลือกอุปกรณ์เดียว / เลือกหลายอุปกรณ์พร้อมกัน) เพราะ prototype
> (`02-onboarding-equipment.html`) ระบุชัดว่า "เลือกได้มากกว่า 1 อย่าง" — เป็น variation ที่มีผลต่อ
> ค่าที่บันทึกจริงในโปรไฟล์ ไม่ใช่แค่ข้อมูลซ้ำ

### TC-ONB-2-001 — เลือกอุปกรณ์เดียว (ดัมเบล) บันทึกเป็น filter

| Field | รายละเอียด |
|---|---|
| Test ID | TC-ONB-2-001 |
| Test Case Name | เลือกอุปกรณ์ "ดัมเบล" เพียงอย่างเดียว บันทึกเป็นโปรไฟล์อุปกรณ์ |
| Pre-condition | ผู้ใช้ผ่าน ONB-1 แล้ว (มี TDEE ในโปรไฟล์ เช่น จาก TC-ONB-1-001) และมาถึงหน้า `02-onboarding-equipment.html` |
| Test Steps | 1. เปิดหน้าเลือกอุปกรณ์<br>2. แตะ chip "ดัมเบล" ให้ active<br>3. กดยืนยัน/ถัดไป |
| Expected Result | ระบบบันทึกโปรไฟล์อุปกรณ์ = [ดัมเบล] และใช้เป็น filter ทุกครั้งที่เอนจิ้นแนะนำวิดีโอ (REC-1) ทำงานในอนาคต |
| Test Data | อุปกรณ์ที่เลือก = ดัมเบล (`dumbbell`) รายการเดียว |
| References | REQ-03 · AC-ONB-2-01 · [User Journey ONB-2](../../../02-design/01-prototypes/user-journeys.md#onb-2--เลือกอุปกรณ์ที่มี-req-03) · prototype [02-onboarding-equipment.html](../../../02-design/01-prototypes/v1/02-onboarding-equipment.html) |

### TC-ONB-2-002 — เลือกหลายอุปกรณ์พร้อมกัน (ดัมเบล + ยิมครบชุด) บันทึกเป็น filter

| Field | รายละเอียด |
|---|---|
| Test ID | TC-ONB-2-002 |
| Test Case Name | เลือกอุปกรณ์มากกว่า 1 อย่างพร้อมกัน บันทึกครบทุกรายการที่เลือก |
| Pre-condition | ผู้ใช้ผ่าน ONB-1 แล้ว (มี TDEE ในโปรไฟล์) และมาถึงหน้า `02-onboarding-equipment.html` |
| Test Steps | 1. เปิดหน้าเลือกอุปกรณ์<br>2. แตะ chip "ดัมเบล" ให้ active<br>3. แตะ chip "ยิมครบชุด" ให้ active เพิ่ม (ไม่ยกเลิกดัมเบล)<br>4. กดยืนยัน/ถัดไป |
| Expected Result | ระบบบันทึกโปรไฟล์อุปกรณ์ = [ดัมเบล, ยิมครบชุด] ทั้ง 2 รายการ และใช้เป็น filter (union ของทั้งสองอุปกรณ์) ทุกครั้งที่ REC-1 ทำงานในอนาคต |
| Test Data | อุปกรณ์ที่เลือก = ดัมเบล (`dumbbell`) + ยิมครบชุด (`full_gym`) พร้อมกัน 2 รายการ |
| References | REQ-03 · AC-ONB-2-01 · [User Journey ONB-2](../../../02-design/01-prototypes/user-journeys.md#onb-2--เลือกอุปกรณ์ที่มี-req-03) · prototype [02-onboarding-equipment.html](../../../02-design/01-prototypes/v1/02-onboarding-equipment.html) |

### TC-ONB-2-003 — เลือก "ไม่มีอุปกรณ์" กรองเฉพาะวิดีโอ bodyweight

| Field | รายละเอียด |
|---|---|
| Test ID | TC-ONB-2-003 |
| Test Case Name | เลือก "ไม่มีอุปกรณ์" ระบบจำกัด filter ให้เหลือเฉพาะวิดีโอประเภท bodyweight |
| Pre-condition | ผู้ใช้ผ่าน ONB-1 แล้ว (มี TDEE ในโปรไฟล์) และมาถึงหน้า `02-onboarding-equipment.html` |
| Test Steps | 1. เปิดหน้าเลือกอุปกรณ์<br>2. แตะ chip "ไม่มีอุปกรณ์" ให้ active<br>3. กดยืนยัน/ถัดไป |
| Expected Result | ระบบบันทึกโปรไฟล์อุปกรณ์ = [ไม่มีอุปกรณ์] และวิดีโอที่แนะนำใน REC-1 ทั้งหมดในอนาคตถูกกรองให้เหลือเฉพาะประเภท bodyweight เท่านั้น (ไม่รวมวิดีโอที่ต้องใช้ดัมเบล/อุปกรณ์ยิม) |
| Test Data | อุปกรณ์ที่เลือก = ไม่มีอุปกรณ์ (`none`) |
| References | REQ-03 · AC-ONB-2-02 · [User Journey ONB-2](../../../02-design/01-prototypes/user-journeys.md#onb-2--เลือกอุปกรณ์ที่มี-req-03) · prototype [02-onboarding-equipment.html](../../../02-design/01-prototypes/v1/02-onboarding-equipment.html) |

### TC-ONB-2-004 — เปลี่ยนอุปกรณ์ภายหลังผ่านหน้า Settings filter อัปเดตทันที

| Field | รายละเอียด |
|---|---|
| Test ID | TC-ONB-2-004 |
| Test Case Name | ผู้ใช้เพิ่มอุปกรณ์ใหม่ผ่านหน้า Settings ภายหลัง onboarding filter การแนะนำวิดีโอครั้งถัดไปอัปเดตทันที |
| Pre-condition | ผู้ใช้มีโปรไฟล์อุปกรณ์เดิม = [ไม่มีอุปกรณ์] บันทึกอยู่แล้วจาก onboarding (เช่นจาก TC-ONB-2-003) |
| Test Steps | 1. เปิดหน้า Settings<br>2. ไปที่ส่วนอุปกรณ์<br>3. แตะ chip "ดัมเบล" เพิ่ม (ซื้อดัมเบลเพิ่ม)<br>4. บันทึกการเปลี่ยนแปลง<br>5. เปิดหน้า Daily Dashboard เพื่อดูวิดีโอที่แนะนำครั้งถัดไป |
| Expected Result | โปรไฟล์อุปกรณ์อัปเดตเป็น [ไม่มีอุปกรณ์, ดัมเบล] ทันที และการค้นหาวิดีโอแนะนำครั้งถัดไปใน REC-1 ใช้ filter ใหม่นี้ทันที (รวมวิดีโอที่ใช้ดัมเบลได้แล้ว) โดยไม่ต้องรอรอบถัดไปหรือ re-onboarding |
| Test Data | อุปกรณ์เดิม = [ไม่มีอุปกรณ์] → อุปกรณ์ใหม่หลังแก้ไข = [ไม่มีอุปกรณ์, ดัมเบล] |
| References | REQ-03 · AC-ONB-2-03 · [User Journey ONB-2](../../../02-design/01-prototypes/user-journeys.md#onb-2--เลือกอุปกรณ์ที่มี-req-03) |

---

## ONB-3 — ตั้งเป้าหมายหลัก (2 ค่าแคลอรี่แยกกัน: เผาผลาญ + ที่ควรได้รับ พร้อม safety floor) (REQ-02)

Journey: [user-journeys.md § ONB-3](../../../02-design/01-prototypes/user-journeys.md#onb-3--ตั้งเป้าหมายหลัก-req-02) ·
AC: [AC-ONB-3-01](../../../01-requirements/acceptance-criteria.md#ac-onb-3-01--เลือกเป้าหมายหลัก-ระบบแปลงเป็นค่าแคลอรี่เป้าหมายที่ชัดเจน-req-02),
[AC-ONB-3-02](../../../01-requirements/acceptance-criteria.md#ac-onb-3-02--เปลี่ยนเป้าหมายหลักภายหลัง-คำนวณใหม่ทันที-req-02),
[AC-ONB-3-03](../../../01-requirements/acceptance-criteria.md#ac-onb-3-03--tdee-ต่ำมากจน-dailyintaketargetkcal-ต่ำกว่า-safety-floor-ถูกปรับขึ้นเสมอ-req-02),
[AC-ONB-3-04](../../../01-requirements/acceptance-criteria.md#ac-onb-3-04--เลือก-ลดน้ำหนัก-กรอกน้ำหนักเป้าหมาย-บังคับ-ครบถ้วน-บันทึกสำเร็จ-req-02),
[AC-ONB-3-05](../../../01-requirements/acceptance-criteria.md#ac-onb-3-05--เลือก-กระชับสัดส่วนเพิ่มความอึด-ข้ามช่องน้ำหนักเป้าหมาย-ไม่บังคับ-req-02),
[AC-ONB-3-06](../../../01-requirements/acceptance-criteria.md#ac-onb-3-06--คำนวณเป้าหมายแคลอรี่เผาผลาญ-dailycalorietargetkcal-จากน้ำหนักตัวล้วน-ไม่มี-safety-floor-เสมอ-เพิ่ม-2026-08-31-req-02)

> **อัปเดต 2026-08-31**: `PUT /profile/goal` คำนวณ **2 ค่าแยกกัน** ในคำขอเดียวกัน — `dailyCalorieTargetKcal`
> (เผาผลาญจากน้ำหนักตัว × ค่าคงที่ต่อเป้าหมาย, **ไม่มี safety floor**, ใช้จริงโดย REC-1/PLN-3/INT-1) และ
> `dailyIntakeTargetKcal` (TDEE ± ค่าคงที่ต่อเป้าหมาย, **มี safety floor** 1,200 kcal + flag
> `isSafetyFloorApplied`, ยังไม่มีฟีเจอร์ใดใช้จริง) — TC-ONB-3-001 ถึง 007 ด้านล่าง (ของเดิม) ระบุค่าทั้งสอง
> แยกกันชัดเจนแล้ว ส่วน **TC-ONB-3-008 (ใหม่)** ทดสอบเจาะจงว่า `dailyCalorieTargetKcal` ไม่มี safety floor
> แม้ในกรณีค่าต่ำมาก
>
> AC-ONB-3-01 มี 3 test case — หนึ่งรายการต่อเป้าหมาย (ลดน้ำหนัก/กระชับสัดส่วน/เพิ่มความอึด) เพราะแต่ละ
> เป้าหมายผูกกับค่าคงที่ที่ต่างกัน (−500 / +0 / +300 สำหรับ intake, ×4.5 / ×3.0 / ×5.5 สำหรับ burn) ซึ่งเป็น
> business rule หลักของ REQ-02 ที่ต้องตรวจสอบแยกกันให้ครบทั้ง 3 ทาง ไม่ใช่แค่ตรวจ 1 เส้นทางแล้วสรุปว่าครอบคลุม
> ทั้ง 7 test case เดิมของ ONB-3 ใช้ TDEE/น้ำหนักต่อเนื่องมาจาก TC-ONB-1-001 (TDEE 2,633 kcal/วัน, น้ำหนัก 75
> กก.) ยกเว้น TC-ONB-3-005 ที่ต้องใช้ TDEE/น้ำหนักต่ำเป็นพิเศษเพื่อทดสอบ safety floor ของ
> `dailyIntakeTargetKcal` โดยเฉพาะ (TC-ONB-3-008 ใหม่ใช้ persona เดียวกับ TC-ONB-3-005 ต่อ เพื่อแสดง contrast
> ว่า `dailyCalorieTargetKcal` ที่คำนวณในคำขอเดียวกันไม่ถูก floor แม้จะต่ำกว่า 1,200 ก็ตาม)
>
> AC-ONB-3-05 มี 1 test case ครอบคลุมทั้ง "กระชับสัดส่วน" และ "เพิ่มความอึด" (เลือกใช้ "กระชับสัดส่วน" เป็น
> ตัวแทน) เพราะพฤติกรรมของช่อง optional-skip ไม่ได้ต่างกันตามเป้าหมายทั้งสอง (ต่างจาก AC-ONB-3-01 ที่ค่า
> delta ต่างกันจริงและต้องตรวจแยก) ส่วนกรณี "เลือก 'ลดน้ำหนัก' แล้วไม่กรอกน้ำหนักเป้าหมายทั้งที่บังคับ" ไม่มี
> test case เพราะไม่มี AC รองรับ (upstream ไม่ได้ระบุพฤติกรรม validation ไว้ — ดูหมายเหตุใน
> acceptance-criteria.md § AC-ONB-3-05 และรายงานผลของ `test-suite-builder`)

### TC-ONB-3-001 — เลือกเป้าหมาย "ลดน้ำหนัก" แปลงเป็น TDEE − 500

| Field | รายละเอียด |
|---|---|
| Test ID | TC-ONB-3-001 |
| Test Case Name | เลือกเป้าหมาย "ลดน้ำหนัก" ระบบแปลงเป็นค่าแคลอรี่เป้าหมาย TDEE − 500 |
| Pre-condition | ผู้ใช้ผ่าน ONB-1 แล้ว มี TDEE = 2,633 kcal/วัน ในโปรไฟล์ (จาก TC-ONB-1-001) และมาถึงหน้า `03-onboarding-goal-select.html` |
| Test Steps | 1. เปิดหน้าเลือกเป้าหมายหลัก<br>2. เลือก "ลดน้ำหนัก" (`lose`)<br>3. กดยืนยัน |
| Expected Result | ระบบคำนวณ **`dailyIntakeTargetKcal`** = TDEE − 500 = 2,633 − 500 = **2,133 kcal/วัน** (สูงกว่า safety floor 1,200 kcal/วัน จึงไม่ถูกปรับ, `isSafetyFloorApplied = false`) และ **`dailyCalorieTargetKcal`** = น้ำหนักตัว × 4.5 = 75 × 4.5 = **337.5 kcal/วัน** (ไม่มี safety floor) พร้อมกันในคำขอเดียวกัน บันทึกทั้งสองค่า และ onboarding เสร็จสมบูรณ์ |
| Test Data | TDEE = 2,633 kcal/วัน, น้ำหนักตัว = 75 กก., เป้าหมาย = ลดน้ำหนัก (intake delta −500, burn ×4.5) → คาดว่า dailyIntakeTargetKcal = 2,133 kcal/วัน (isSafetyFloorApplied=false), dailyCalorieTargetKcal = 337.5 kcal/วัน |
| References | REQ-02 · AC-ONB-3-01 · AC-ONB-3-06 · [User Journey ONB-3](../../../02-design/01-prototypes/user-journeys.md#onb-3--ตั้งเป้าหมายหลัก-req-02) · prototype [04-onboarding-goal-confirm.html](../../../02-design/01-prototypes/v1/04-onboarding-goal-confirm.html) |

### TC-ONB-3-002 — เลือกเป้าหมาย "กระชับสัดส่วน" แปลงเป็น TDEE + 0 (maintenance)

| Field | รายละเอียด |
|---|---|
| Test ID | TC-ONB-3-002 |
| Test Case Name | เลือกเป้าหมาย "กระชับสัดส่วน" ระบบแปลงเป็นค่าแคลอรี่เป้าหมายเท่ากับ TDEE (maintenance) |
| Pre-condition | ผู้ใช้ผ่าน ONB-1 แล้ว มี TDEE = 2,633 kcal/วัน ในโปรไฟล์ และมาถึงหน้า `03-onboarding-goal-select.html` |
| Test Steps | 1. เปิดหน้าเลือกเป้าหมายหลัก<br>2. เลือก "กระชับสัดส่วน" (`maintain`)<br>3. กดยืนยัน |
| Expected Result | ระบบคำนวณ **`dailyIntakeTargetKcal`** = TDEE + 0 = 2,633 + 0 = **2,633 kcal/วัน** (สูงกว่า safety floor จึงไม่ถูกปรับ, `isSafetyFloorApplied = false`) และ **`dailyCalorieTargetKcal`** = น้ำหนักตัว × 3.0 = 75 × 3.0 = **225.0 kcal/วัน** (ไม่มี safety floor) พร้อมกันในคำขอเดียวกัน บันทึกทั้งสองค่า และ onboarding เสร็จสมบูรณ์ |
| Test Data | TDEE = 2,633 kcal/วัน, น้ำหนักตัว = 75 กก., เป้าหมาย = กระชับสัดส่วน (intake delta +0, burn ×3.0) → คาดว่า dailyIntakeTargetKcal = 2,633 kcal/วัน (isSafetyFloorApplied=false), dailyCalorieTargetKcal = 225.0 kcal/วัน |
| References | REQ-02 · AC-ONB-3-01 · AC-ONB-3-06 · [User Journey ONB-3](../../../02-design/01-prototypes/user-journeys.md#onb-3--ตั้งเป้าหมายหลัก-req-02) · prototype [04-onboarding-goal-confirm.html](../../../02-design/01-prototypes/v1/04-onboarding-goal-confirm.html) |

### TC-ONB-3-003 — เลือกเป้าหมาย "เพิ่มความอึด" แปลงเป็น TDEE + 300

| Field | รายละเอียด |
|---|---|
| Test ID | TC-ONB-3-003 |
| Test Case Name | เลือกเป้าหมาย "เพิ่มความอึด" ระบบแปลงเป็นค่าแคลอรี่เป้าหมาย TDEE + 300 |
| Pre-condition | ผู้ใช้ผ่าน ONB-1 แล้ว มี TDEE = 2,633 kcal/วัน ในโปรไฟล์ และมาถึงหน้า `03-onboarding-goal-select.html` |
| Test Steps | 1. เปิดหน้าเลือกเป้าหมายหลัก<br>2. เลือก "เพิ่มความอึด" (`endurance`)<br>3. กดยืนยัน |
| Expected Result | ระบบคำนวณ **`dailyIntakeTargetKcal`** = TDEE + 300 = 2,633 + 300 = **2,933 kcal/วัน** (สูงกว่า safety floor จึงไม่ถูกปรับ, `isSafetyFloorApplied = false`) และ **`dailyCalorieTargetKcal`** = น้ำหนักตัว × 5.5 = 75 × 5.5 = **412.5 kcal/วัน** (ไม่มี safety floor) พร้อมกันในคำขอเดียวกัน บันทึกทั้งสองค่า และ onboarding เสร็จสมบูรณ์ |
| Test Data | TDEE = 2,633 kcal/วัน, น้ำหนักตัว = 75 กก., เป้าหมาย = เพิ่มความอึด (intake delta +300, burn ×5.5) → คาดว่า dailyIntakeTargetKcal = 2,933 kcal/วัน (isSafetyFloorApplied=false), dailyCalorieTargetKcal = 412.5 kcal/วัน |
| References | REQ-02 · AC-ONB-3-01 · AC-ONB-3-06 · [User Journey ONB-3](../../../02-design/01-prototypes/user-journeys.md#onb-3--ตั้งเป้าหมายหลัก-req-02) · prototype [04-onboarding-goal-confirm.html](../../../02-design/01-prototypes/v1/04-onboarding-goal-confirm.html) |

### TC-ONB-3-004 — เปลี่ยนเป้าหมายหลักภายหลัง คำนวณเป้าหมายแคลอรี่ใหม่ทันที

| Field | รายละเอียด |
|---|---|
| Test ID | TC-ONB-3-004 |
| Test Case Name | ผู้ใช้เปลี่ยนเป้าหมายหลักจาก "ลดน้ำหนัก" เป็น "เพิ่มความอึด" ระบบคำนวณเป้าหมายแคลอรี่ใหม่ทันที |
| Pre-condition | ผู้ใช้มี `dailyIntakeTargetKcal` = 2,133 kcal/วัน และ `dailyCalorieTargetKcal` = 337.5 kcal/วัน บันทึกไว้แล้วจากเป้าหมาย "ลดน้ำหนัก" (จาก TC-ONB-3-001, TDEE ยังคงเป็น 2,633 kcal/วัน, น้ำหนักตัวยังคงเป็น 75 กก.) |
| Test Steps | 1. เปิดหน้าตั้งค่าเป้าหมายหลัก (Settings หรือหน้าเลือกเป้าหมาย)<br>2. เปลี่ยนเป้าหมายจาก "ลดน้ำหนัก" เป็น "เพิ่มความอึด" (`endurance`)<br>3. ยืนยันการเปลี่ยนแปลง |
| Expected Result | ระบบคำนวณทั้งสองค่าใหม่ทันทีด้วยสูตรค่าคงที่เดิมของ REQ-02: `dailyIntakeTargetKcal` = TDEE + 300 = 2,633 + 300 = **2,933 kcal/วัน** (แทนที่ 2,133, `isSafetyFloorApplied = false`) และ `dailyCalorieTargetKcal` = น้ำหนักตัว × 5.5 = 75 × 5.5 = **412.5 kcal/วัน** (แทนที่ 337.5) โดยไม่ต้องคำนวณ TDEE ใหม่ |
| Test Data | TDEE = 2,633 kcal/วัน (ไม่เปลี่ยน), น้ำหนักตัว = 75 กก. (ไม่เปลี่ยน), เป้าหมายเดิม = ลดน้ำหนัก (dailyIntakeTargetKcal 2,133 / dailyCalorieTargetKcal 337.5) → เป้าหมายใหม่ = เพิ่มความอึด (คาดว่า dailyIntakeTargetKcal 2,933, dailyCalorieTargetKcal 412.5) |
| References | REQ-02 · AC-ONB-3-02 · AC-ONB-3-06 · [User Journey ONB-3](../../../02-design/01-prototypes/user-journeys.md#onb-3--ตั้งเป้าหมายหลัก-req-02) · prototype [03-onboarding-goal-select.html](../../../02-design/01-prototypes/v1/03-onboarding-goal-select.html) |

### TC-ONB-3-005 — TDEE ต่ำมากจนแม้เลือก "เพิ่มความอึด" `dailyIntakeTargetKcal` ยังต่ำกว่า safety floor ถูกปรับขึ้นเป็น floor

| Field | รายละเอียด |
|---|---|
| Test ID | TC-ONB-3-005 |
| Test Case Name | ผู้ใช้ตัวเล็ก + กิจกรรมต่ำ ทำให้ TDEE ต่ำมาก แม้เลือกเป้าหมาย "เพิ่มความอึด" (TDEE + 300) `dailyIntakeTargetKcal` ยังต่ำกว่า safety floor ระบบต้องปรับขึ้นเป็น floor เสมอ (ส่วน `dailyCalorieTargetKcal` ไม่ถูกปรับ — ดู TC-ONB-3-008) |
| Pre-condition | ผู้ใช้ผ่าน ONB-1 แล้ว ด้วยข้อมูลที่ทำให้ TDEE ต่ำมาก: อายุ 70 ปี, เพศ หญิง, น้ำหนัก 32 กก., ส่วนสูง 135 ซม., กิจกรรมระดับ sedentary (1.2) → BMR = 10×32 + 6.25×135 − 5×70 − 161 = 652.75 kcal → TDEE = 652.75 × 1.2 = **783 kcal/วัน** และมาถึงหน้า `03-onboarding-goal-select.html` |
| Test Steps | 1. เปิดหน้าเลือกเป้าหมายหลัก<br>2. เลือก "เพิ่มความอึด" (`endurance`) — เป้าหมายที่ให้ค่า intake บวกมากที่สุดในบรรดา 3 ทางเลือก<br>3. กดยืนยัน |
| Expected Result | ระบบคำนวณ `dailyIntakeTargetKcal` ดิบ = TDEE + 300 = 783 + 300 = 1,083 kcal/วัน ซึ่ง**ต่ำกว่า safety floor (1,200 kcal/วัน)** ระบบจึงปรับขึ้นเป็น **1,200 kcal/วัน** (ค่า floor) พร้อมตั้ง **`isSafetyFloorApplied = true`** แทนค่าที่คำนวณได้ ไม่ปล่อยให้ต่ำกว่าเกณฑ์ แม้จะเลือกเป้าหมายที่ให้ intake สูงสุดแล้วก็ตาม — ในคำขอเดียวกัน ระบบยังคำนวณ `dailyCalorieTargetKcal` = น้ำหนักตัว × 5.5 = 32 × 5.5 = **176.0 kcal/วัน** ควบคู่กันไปด้วย (ไม่มี safety floor เกี่ยวข้อง) |
| Test Data | อายุ 70, เพศ หญิง, น้ำหนัก 32 กก., ส่วนสูง 135 ซม., กิจกรรม sedentary → TDEE = 783 kcal/วัน; เป้าหมาย = เพิ่มความอึด (intake TDEE + 300 = 1,083 kcal/วัน ดิบ, burn 32 × 5.5) → คาดว่า dailyIntakeTargetKcal สุดท้ายหลังปรับ = 1,200 kcal/วัน (isSafetyFloorApplied=true), dailyCalorieTargetKcal = 176.0 kcal/วัน |
| References | REQ-02 · AC-ONB-3-03 · [User Journey ONB-3](../../../02-design/01-prototypes/user-journeys.md#onb-3--ตั้งเป้าหมายหลัก-req-02) · prototype [04-onboarding-goal-confirm.html](../../../02-design/01-prototypes/v1/04-onboarding-goal-confirm.html) |

### TC-ONB-3-006 — เลือกเป้าหมาย "ลดน้ำหนัก" กรอกน้ำหนักเป้าหมาย (บังคับ) ครบถ้วน บันทึกสำเร็จ

| Field | รายละเอียด |
|---|---|
| Test ID | TC-ONB-3-006 |
| Test Case Name | เลือกเป้าหมาย "ลดน้ำหนัก" กรอกน้ำหนักเป้าหมายในช่องบังคับครบถ้วน ระบบบันทึกทั้งเป้าหมายแคลอรี่และน้ำหนักเป้าหมาย |
| Pre-condition | ผู้ใช้ผ่าน ONB-1 แล้ว มี TDEE = 2,633 kcal/วัน (น้ำหนักปัจจุบัน 75 กก., จาก TC-ONB-1-001) และมาถึงขั้นตอนเลือกเป้าหมายหลัก |
| Test Steps | 1. เปิดหน้าเลือกเป้าหมายหลัก<br>2. เลือก "ลดน้ำหนัก" (`lose`)<br>3. ระบบแสดงช่องกรอกน้ำหนักเป้าหมาย (target weight) เป็นช่องบังคับ<br>4. กรอกน้ำหนักเป้าหมาย = 70.0 กก.<br>5. กดยืนยัน |
| Expected Result | ระบบคำนวณ **`dailyIntakeTargetKcal`** = TDEE − 500 = 2,633 − 500 = **2,133 kcal/วัน** (สูงกว่า safety floor ไม่ถูกปรับ, `isSafetyFloorApplied = false`) และ **`dailyCalorieTargetKcal`** = น้ำหนักตัว × 4.5 = 75 × 4.5 = **337.5 kcal/วัน** (ไม่มี safety floor) บันทึกทั้งสองค่าและน้ำหนักเป้าหมาย (70.0 กก.) ลงโปรไฟล์พร้อมกัน onboarding เสร็จสมบูรณ์ และค่าน้ำหนักเป้าหมายนี้พร้อมใช้เป็น precondition "มีเป้าหมายน้ำหนัก" ของ INT-1 ทันที |
| Test Data | TDEE = 2,633 kcal/วัน (น้ำหนักปัจจุบัน 75 กก.), เป้าหมาย = ลดน้ำหนัก (intake delta −500, burn ×4.5), น้ำหนักเป้าหมาย = 70.0 กก. (บังคับกรอก, ต่ำกว่าน้ำหนักปัจจุบัน 5 กก. — เลือกใช้ delta 5 กก. ให้สอดคล้องกับ persona ของ INT-1 ใน `test-cases/04-smart-integrations.md` ที่ใช้ delta เดียวกัน แม้ตัวเลขน้ำหนักตั้งต้นจะต่างกัน) → คาดว่า dailyIntakeTargetKcal = 2,133 kcal/วัน (isSafetyFloorApplied=false), dailyCalorieTargetKcal = 337.5 kcal/วัน, น้ำหนักเป้าหมายบันทึกไว้ = 70.0 กก. |
| References | REQ-02 · AC-ONB-3-04 · AC-ONB-3-06 · [User Journey ONB-3](../../../02-design/01-prototypes/user-journeys.md#onb-3--ตั้งเป้าหมายหลัก-req-02) · [INT-1 precondition](../../../02-design/01-prototypes/user-journeys.md#int-1--พยากรณ์วันถึงเป้าหมายน้ำหนัก-req-11) — **หมายเหตุ**: ยังไม่มี prototype screen ใน `v1` ที่ implement ช่องกรอกน้ำหนักเป้าหมายนี้จริง (gap) |

### TC-ONB-3-007 — เลือกเป้าหมาย "กระชับสัดส่วน" ข้ามช่องน้ำหนักเป้าหมาย (ไม่บังคับ) onboarding ยังเสร็จสมบูรณ์ได้

| Field | รายละเอียด |
|---|---|
| Test ID | TC-ONB-3-007 |
| Test Case Name | เลือกเป้าหมาย "กระชับสัดส่วน" ไม่กรอกน้ำหนักเป้าหมาย (ช่องไม่บังคับ) ระบบยังบันทึกเป้าหมายแคลอรี่ได้ปกติแต่ INT-1 ยังใช้งานไม่ได้ |
| Pre-condition | ผู้ใช้ผ่าน ONB-1 แล้ว มี TDEE = 2,633 kcal/วัน และมาถึงขั้นตอนเลือกเป้าหมายหลัก |
| Test Steps | 1. เปิดหน้าเลือกเป้าหมายหลัก<br>2. เลือก "กระชับสัดส่วน" (`maintain`)<br>3. ระบบแสดงช่องกรอกน้ำหนักเป้าหมาย (target weight) เป็นช่องไม่บังคับ<br>4. ไม่กรอกน้ำหนักเป้าหมาย (เว้นว่างไว้)<br>5. กดยืนยัน |
| Expected Result | ระบบบันทึก **`dailyIntakeTargetKcal`** = TDEE + 0 = **2,633 kcal/วัน** (`isSafetyFloorApplied = false`) และ **`dailyCalorieTargetKcal`** = น้ำหนักตัว × 3.0 = 75 × 3.0 = **225.0 kcal/วัน** ตามปกติ (ไม่ต้องมีน้ำหนักเป้าหมาย เพราะไม่บังคับ) onboarding เสร็จสมบูรณ์ แต่โปรไฟล์ไม่มีน้ำหนักเป้าหมายบันทึกไว้ ทำให้ INT-1 (พยากรณ์วันถึงเป้าหมายน้ำหนัก) ยังใช้งานไม่ได้จนกว่าผู้ใช้จะกลับมากรอกน้ำหนักเป้าหมายภายหลัง (ช่องทางที่แน่ชัดยังไม่ถูกระบุใน upstream) |
| Test Data | TDEE = 2,633 kcal/วัน, น้ำหนักตัว = 75 กก., เป้าหมาย = กระชับสัดส่วน (intake delta +0, burn ×3.0), น้ำหนักเป้าหมาย = (ไม่กรอก/null) → คาดว่า dailyIntakeTargetKcal = 2,633 kcal/วัน (isSafetyFloorApplied=false), dailyCalorieTargetKcal = 225.0 kcal/วัน, น้ำหนักเป้าหมายในโปรไฟล์ = ไม่มีค่า (null) |
| References | REQ-02 · AC-ONB-3-05 · AC-ONB-3-06 · [User Journey ONB-3](../../../02-design/01-prototypes/user-journeys.md#onb-3--ตั้งเป้าหมายหลัก-req-02) (Alt/Edge Case ข้อ 3) · [INT-1 precondition/edge case](../../../02-design/01-prototypes/user-journeys.md#int-1--พยากรณ์วันถึงเป้าหมายน้ำหนัก-req-11) — **หมายเหตุ**: ยังไม่มี prototype screen ใน `v1` ที่ implement ช่องกรอกน้ำหนักเป้าหมายนี้จริง (gap) |

### TC-ONB-3-008 — `dailyCalorieTargetKcal` ไม่มี safety floor แม้ค่าที่คำนวณได้ต่ำมาก (ต่างจาก `dailyIntakeTargetKcal`)

| Field | รายละเอียด |
|---|---|
| Test ID | TC-ONB-3-008 |
| Test Case Name | ผู้ใช้ตัวเล็ก + น้ำหนักน้อยมาก (persona เดียวกับ TC-ONB-3-005) ยืนยันว่า `dailyCalorieTargetKcal` ไม่ถูกปรับขึ้นด้วย safety floor เลย แม้ค่าที่คำนวณได้จะต่ำกว่า 1,200 kcal มาก ในขณะที่ `dailyIntakeTargetKcal` ที่คำนวณในคำขอเดียวกันถูก floor |
| Pre-condition | ผู้ใช้ผ่าน ONB-1 แล้ว ด้วยข้อมูลเดียวกับ TC-ONB-3-005: อายุ 70 ปี, เพศ หญิง, น้ำหนัก 32 กก., ส่วนสูง 135 ซม., กิจกรรม sedentary (1.2) → TDEE = 783 kcal/วัน และมาถึงหน้า `03-onboarding-goal-select.html` |
| Test Steps | 1. เปิดหน้าเลือกเป้าหมายหลัก<br>2. เลือก "กระชับสัดส่วน" (`maintain`) — เป้าหมายที่ให้ค่า burn ต่ำที่สุดในบรรดา 3 ทางเลือก (×3.0) เพื่อทดสอบกรณีสุดโต่ง<br>3. กดยืนยัน |
| Expected Result | ระบบคำนวณ **`dailyCalorieTargetKcal`** = น้ำหนักตัว × 3.0 = 32 × 3.0 = **96.0 kcal/วัน** และบันทึกค่านี้ไว้ **ตามที่คำนวณได้ทุกประการ ไม่มีการปรับขึ้นด้วยกลไก safety floor ใด ๆ เลย** (ไม่มี field `isSafetyFloorApplied` ผูกกับค่านี้) แม้จะต่ำกว่า `SAFETY_FLOOR_MIN_KCAL` (1,200 kcal) มากก็ตาม — ในคำขอเดียวกัน `dailyIntakeTargetKcal` = TDEE + 0 = 783 kcal/วัน ดิบ ซึ่งต่ำกว่า floor เช่นกัน จึงถูกปรับขึ้นเป็น 1,200 kcal/วัน พร้อม `isSafetyFloorApplied = true` — ยืนยัน contrast ที่ชัดเจนระหว่างสองฟิลด์ในคำขอเดียวกัน |
| Test Data | อายุ 70, เพศ หญิง, น้ำหนัก 32 กก., ส่วนสูง 135 ซม., กิจกรรม sedentary → TDEE = 783 kcal/วัน; เป้าหมาย = กระชับสัดส่วน (burn 32 × 3.0 = 96.0 ดิบ, intake TDEE + 0 = 783 ดิบ) → คาดว่า dailyCalorieTargetKcal = 96.0 kcal/วัน (ไม่ถูกปรับ), dailyIntakeTargetKcal = 1,200 kcal/วัน (isSafetyFloorApplied=true) |
| References | REQ-02 · AC-ONB-3-06 · [User Journey ONB-3](../../../02-design/01-prototypes/user-journeys.md#onb-3--ตั้งเป้าหมายหลัก-req-02) · [Onboarding spec § ข้อสมมติฐาน/การตัดสินใจที่ยืนยันแล้ว](../../../01-requirements/01-spec/20260823-01-onboarding-personalization.md#ข้อสมมติฐานการตัดสินใจที่ยืนยันแล้ว) · prototype [04-onboarding-goal-confirm.html](../../../02-design/01-prototypes/v1/04-onboarding-goal-confirm.html) |

---

## สรุปจำนวน Test Case ต่อ AC Scenario

| Feature ID | AC Scenario | จำนวน Test Case | Test ID |
|---|---|---|---|
| ONB-0 | AC-ONB-0-01 | 1 (email/password เป็นตัวแทน) | TC-ONB-0-001 |
| ONB-0 | AC-ONB-0-02 | 1 (email/password เป็นตัวแทน) | TC-ONB-0-002 |
| ONB-0 | AC-ONB-0-03 | 1 | TC-ONB-0-003 |
| ONB-0 | AC-ONB-0-04 | 1 | TC-ONB-0-004 |
| ONB-0 | AC-ONB-0-05 | 1 | TC-ONB-0-005 |
| ONB-0 | AC-ONB-0-06 | 1 (documentation-level, not testable in this round) | TC-ONB-0-006 |
| ONB-0 | AC-ONB-0-07 (ใหม่ 2026-08-30) | 1 (code-inspection-level) | TC-ONB-0-007 |
| ONB-1 | AC-ONB-1-01 | 2 (variation: ชาย/หญิง) | TC-ONB-1-001, TC-ONB-1-002 |
| ONB-1 | AC-ONB-1-02 | 2 (variation: ข้อมูลไม่ครบ/ไม่ถูกต้อง) | TC-ONB-1-003, TC-ONB-1-004 |
| ONB-1 | AC-ONB-1-03 | 1 | TC-ONB-1-005 |
| ONB-2 | AC-ONB-2-01 | 2 (variation: เลือก 1 / เลือกหลายอุปกรณ์) | TC-ONB-2-001, TC-ONB-2-002 |
| ONB-2 | AC-ONB-2-02 | 1 | TC-ONB-2-003 |
| ONB-2 | AC-ONB-2-03 | 1 | TC-ONB-2-004 |
| ONB-3 | AC-ONB-3-01 | 3 (variation: ลด/กระชับ/เพิ่มความอึด) | TC-ONB-3-001, TC-ONB-3-002, TC-ONB-3-003 |
| ONB-3 | AC-ONB-3-02 | 1 | TC-ONB-3-004 |
| ONB-3 | AC-ONB-3-03 | 1 | TC-ONB-3-005 |
| ONB-3 | AC-ONB-3-04 | 1 | TC-ONB-3-006 |
| ONB-3 | AC-ONB-3-05 | 1 | TC-ONB-3-007 |
| ONB-3 | AC-ONB-3-06 (ใหม่ 2026-08-31) | 1 (dedicated — ค่า `dailyCalorieTargetKcal` ยัง verify แทรกอยู่ใน TC-ONB-3-001–007 ด้วย) | TC-ONB-3-008 |
| **รวม** | **19 AC scenario** | **24 test case** | TC-ONB-0-001 … TC-ONB-3-008 |

ครบทุก AC scenario ของ ONB-0/ONB-1/ONB-2/ONB-3 ตาม
[acceptance-criteria.md § Epic 1](../../../01-requirements/acceptance-criteria.md#epic-1-onboarding--personalization)
(19/19 scenario มี test case อย่างน้อย 1 รายการ — เพิ่ม AC-ONB-3-06/TC-ONB-3-008 เมื่อ 2026-08-31 หลังการแยก
เป้าหมายแคลอรี่ของ ONB-3/REQ-02 เป็น 2 ค่า) — **มี gap ที่บันทึกไว้ 2 จุด (ไม่มี test case ให้)**:
1. กรณี "เลือกเป้าหมาย 'ลดน้ำหนัก' แล้วไม่กรอกน้ำหนักเป้าหมายทั้งที่เป็นช่องบังคับ" (ONB-3) ไม่มี AC scenario
   รองรับ เพราะ `01-spec/20260823-01-onboarding-personalization.md` และ `user-journeys.md` ยืนยันแค่ว่า
   ช่องนี้ "บังคับกรอก" แต่ไม่ได้ระบุ behavior การ validation (ข้อความ error, ปุ่มถูกบล็อกหรือไม่ ฯลฯ) เมื่อ
   ผู้ใช้ข้ามช่องนี้ไป — ไม่ใช่การเดา behavior เอง จึงยังไม่มี test case สำหรับกรณีนี้
2. **(เพิ่ม 2026-08-29)** ONB-0's REQ-14 (email verification ก่อนใช้งานได้จริงหรือไม่) และ REQ-14's
   password policy — ทั้งสองยังเป็น Open Point ที่ upstream ไม่ได้ระบุพฤติกรรมไว้ ไม่มี AC/test case รองรับ
   เช่นกัน (ดูหมายเหตุใน [acceptance-criteria.md § ONB-0](../../../01-requirements/acceptance-criteria.md#onb-0--สมัครสมาชิก--เข้าสู่ระบบ--ลืมรหัสผ่าน--ออกจากระบบ-เพิ่มใหม่-2026-08-29))
   — ดูรายงานผลของ `test-suite-builder`

---

## หมายเหตุ / Content Decisions ที่ไม่ได้ระบุตรง ๆ ในเอกสารต้นทาง

1. **Activity Factor ต่อระดับกิจกรรม (5 ระดับ)** — ไม่มีเอกสารต้นทางใดระบุค่าตัวคูณจริง ใช้ค่ามาตรฐานที่
   ผูกกับสูตร Mifflin-St Jeor ทั่วไป (sedentary=1.2, light=1.375, moderate=1.55, active=1.725,
   very_active=1.9) เพื่อให้ผลคำนวณใน Expected Result ตรวจสอบได้จริง — ต้องยืนยันกับทีมผลิตภัณฑ์/
   engineering ก่อนใช้เป็นฐานของการ implement จริง ถ้าค่าจริงต่างจากนี้ ต้องแก้ Test Data ของ
   TC-ONB-1-001, TC-ONB-1-002, TC-ONB-1-005 และ TDEE ต้นทางที่ TC-ONB-3-001 ถึง TC-ONB-3-008 อ้างอิงต่อ
   (น้ำหนักตัวจาก TC-ONB-1-001 = 75 กก. ก็เป็น input ตรงของสูตร `dailyCalorieTargetKcal` ด้วยตั้งแต่
   2026-08-31 — ถ้าน้ำหนักตัวต้นทางเปลี่ยน ต้องแก้ Test Data ของค่า burn ใน TC-ONB-3-001 ถึง 004, 006, 007
   ตามไปด้วย)
2. **ค่า safety floor ที่แน่นอน (ภายในช่วง 1,200–1,500 kcal/วัน)** — REQ-02 ยืนยันเฉพาะช่วง ไม่ได้ปักหมุด
   ตัวเลขเดียว ใช้ 1,200 kcal/วัน (ขอบล่างของช่วง ตรงกับตัวอย่างใน prototype
   `04-onboarding-goal-confirm.html`) เป็นค่าที่ใช้ใน TC-ONB-3-005 — ถ้าค่าจริงต่างจากนี้ (เช่น 1,500)
   ต้องแก้ Test Data/Expected Result ของ TC-ONB-3-005
3. ตัวเลขอายุ/น้ำหนัก/ส่วนสูง default และช่วง min–max (อายุ 10–100, น้ำหนัก 20–250 กก., ส่วนสูง
   100–220 ซม.) นำมาจาก input constraints จริงใน prototype `01-onboarding-personal-info.html`
   ไม่ใช่ค่าที่ประดิษฐ์ขึ้นเอง
4. **ค่าน้ำหนักเป้าหมาย (target weight) ของ TC-ONB-3-006 = 70.0 กก.** — ไม่มีเอกสารต้นทางระบุตัวเลขตัวอย่าง
   ไว้ตรง ๆ เลือกใช้ delta 5 กก. ต่ำกว่าน้ำหนักปัจจุบันของ persona นี้ (75 กก. จาก TC-ONB-1-001) เพื่อให้
   สอดคล้อง (delta เท่ากัน แต่คนละตัวเลขตั้งต้น) กับ persona ของ `test-cases/04-smart-integrations.md`
   (น้ำหนักปัจจุบัน 80.0 กก. → เป้าหมาย 75.0 กก. delta 5 กก. เช่นกัน) ไม่ได้ใช้ตัวเลข 75.0 กก. เดียวกันตรง ๆ
   เพราะ persona ของ ONB-3 มีน้ำหนักปัจจุบัน 75 กก. อยู่แล้ว (ใช้ 75.0 กก. เป็นเป้าหมายจะทำให้ delta = 0
   ซึ่งขัดกับความหมายของเป้าหมาย "ลดน้ำหนัก") — เป็น content decision ของเอกสารนี้เอง ยังไม่ใช่ค่าที่ยืนยัน
   จากผู้ใช้งานหรือ resolve ไว้ใน `01-spec/`
5. **(เพิ่ม 2026-08-29)** อีเมล/รหัสผ่านตัวอย่างของ TC-ONB-0-001–003 (`newuser@example.com` /
   `Passw0rd!23`) ไม่มีเอกสารต้นทางระบุตัวอย่างจริงไว้ (password policy เป็น Open Point ที่ยังไม่ resolve
   ตาม `01-spec/20260823-01-onboarding-personalization.md`) เลือกใช้ค่าที่ครบทั้งตัวเลข/ตัวพิมพ์ใหญ่-เล็ก/
   สัญลักษณ์เพื่อให้ Test Data มีความหมายตรวจสอบได้ ไม่ใช่ค่าที่ยืนยันจากผู้ใช้งาน ถ้ามีการกำหนด password
   policy จริงในภายหลัง ต้องกลับมาแก้ Test Data นี้ให้ตรงตามกติกาจริง
6. **(เพิ่ม 2026-08-31)** ค่าคงที่ kcal/กก. ของ `dailyCalorieTargetKcal` (ลดน้ำหนัก=4.5, กระชับสัดส่วน=3.0,
   เพิ่มความอึด=5.5) **ไม่ใช่ค่าที่ประดิษฐ์ขึ้นเองในเอกสารนี้** — ยืนยันแล้วใน
   [Onboarding spec § ข้อสมมติฐาน/การตัดสินใจที่ยืนยันแล้ว](../../../01-requirements/01-spec/20260823-01-onboarding-personalization.md#ข้อสมมติฐานการตัดสินใจที่ยืนยันแล้ว)
   ตรวจสอบกับโค้ดจริง `apps/web/client/src/pages/onboarding/GoalConfirmScreen.tsx` แล้ว — TC-ONB-3-008
   เลือกใช้ persona เดียวกับ TC-ONB-3-005 (น้ำหนัก 32 กก.) แต่เปลี่ยนเป้าหมายเป็น "กระชับสัดส่วน" (×3.0 ซึ่ง
   ให้ค่า burn ต่ำที่สุดในบรรดา 3 ทางเลือก) เพื่อให้เห็น contrast ชัดเจนที่สุดระหว่าง `dailyCalorieTargetKcal`
   ที่ไม่ถูก floor กับ `dailyIntakeTargetKcal` ที่ถูก floor ในคำขอเดียวกัน

---

อ้างอิงต้นฉบับ: [acceptance-criteria.md](../../../01-requirements/acceptance-criteria.md) ·
[backlog.md](../../../01-requirements/backlog.md) ·
[01-spec/20260823-01-onboarding-personalization.md](../../../01-requirements/01-spec/20260823-01-onboarding-personalization.md) ·
[user-journeys.md](../../../02-design/01-prototypes/user-journeys.md) ·
[test-plan.md](../test-plan.md)
