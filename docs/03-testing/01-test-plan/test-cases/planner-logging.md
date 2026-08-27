# Test Cases — Epic 3: Planner & Logging

เอกสารนี้แจกแจง Test Case แบบ step-by-step ของทุก Feature ID ใน Epic **Planner & Logging**
(PLN-1, PLN-2, PLN-3, PLN-4) โดยยึด [acceptance-criteria.md](../../../01-requirements/acceptance-criteria.md)
เป็น scenario ตั้งต้น (ทุก AC scenario มี test case ครอบคลุมอย่างน้อย 1 รายการ — บาง AC มีมากกว่า 1
test case เพื่อครอบคลุม test-data variation ที่มีความหมาย ดูคอลัมน์ References ของแต่ละ test case)

ต้นทาง: [acceptance-criteria.md](../../../01-requirements/acceptance-criteria.md) ·
[backlog.md](../../../01-requirements/backlog.md) ·
[user-journeys.md](../../../02-design/01-prototypes/user-journeys.md) ·
[01-spec/20260823-03-planner-logging.md](../../../01-requirements/01-spec/20260823-03-planner-logging.md) ·
[prototype v1](../../../02-design/01-prototypes/v1/README.md)

รูปแบบ ID: `TC-{FeatureID}-{เลข 3 หลัก}` เช่น `TC-PLN-1-001`

**หมายเหตุเรื่อง Test Data**: ตัวเลขแคลอรี่ในตัวอย่างของ `v1/08-weekly-planner.html` และ
`v1/09-log-history.html` เป็นค่าตัวอย่างประกอบภาพ (illustrative placeholder ตามที่ระบุในคอมเมนต์ของ
ไฟล์ทั้งสอง) ไม่ได้ผูกกับเป้าหมายแคลอรี่ต่อวันค่าใดค่าหนึ่งที่แน่นอน — test case ในเอกสารนี้จึงแบ่งเป็น
2 กลุ่ม: (1) test case ของ PLN-1/PLN-2 ที่อ้างอิงวันที่/สถานะ log จากตัวอย่างสัปดาห์เดียวกับ prototype
(จันทร์ 24 – อาทิตย์ 30 ส.ค. 2026, วันนี้ = พฤหัสบดี 27 ส.ค. 2026) เพื่อความสอดคล้องกับ mockup ที่มีอยู่
(2) test case ของ PLN-3/PLN-4 ที่ต้องการความแม่นยำระดับ % ของเป้าหมาย (boundary test) จึงกำหนด
เป้าหมายแคลอรี่ต่อวันเป็นค่ากลม ๆ ที่ชัดเจนขึ้นเอง (เช่น 500 kcal) แทนการยืมค่าตัวอย่างจาก prototype —
ทั้งสองกลุ่มสอดคล้องกับกติกาทางธุรกิจใน REQ-08/09/10 เหมือนกัน ต่างกันแค่ตัวเลขที่เลือกใช้

---

## สารบัญ

- [PLN-1 — ปฏิทินวางแผนรายสัปดาห์](#pln-1--ปฏิทินวางแผนรายสัปดาห์) — TC-PLN-1-001 ถึง 003
- [PLN-2 — โหมด Cheat Day / Rest Day](#pln-2--โหมด-cheat-day--rest-day) — TC-PLN-2-001 ถึง 005
- [PLN-3 — บันทึกผลรายวัน (all-or-nothing)](#pln-3--บันทึกผลรายวัน-all-or-nothing) — TC-PLN-3-001 ถึง 005
- [PLN-4 — ติดตาม Streak ต่อเนื่อง](#pln-4--ติดตาม-streak-ต่อเนื่อง) — TC-PLN-4-001 ถึง 004

---

## PLN-1 — ปฏิทินวางแผนรายสัปดาห์

Feature: [backlog.md#pln-1](../../../01-requirements/backlog.md) · REQ-08 ·
AC: [AC-PLN-1-01, AC-PLN-1-02](../../../01-requirements/acceptance-criteria.md#pln-1--ปฏิทินวางแผนรายสัปดาห์) ·
Journey: [user-journeys.md#pln-1](../../../02-design/01-prototypes/user-journeys.md#pln-1--ปฏิทินวางแผนรายสัปดาห์-req-08) ·
Prototype: [08-weekly-planner.html](../../../02-design/01-prototypes/v1/08-weekly-planner.html)

### TC-PLN-1-001 — กำหนดประเภทกิจกรรมเองของวันนี้ (ยังไม่มี log)

| ฟิลด์ | รายละเอียด |
|---|---|
| Test Case Name | ผู้ใช้กำหนดประเภทกิจกรรมของวันนี้เองผ่านปฏิทินรายสัปดาห์ |
| Pre-condition | ผู้ใช้ผ่าน onboarding แล้ว (มีเป้าหมายแคลอรี่รายวัน) เปิดแท็บ Planner เห็นสัปดาห์ 24–30 ส.ค. 2026 วันนี้ (พฤหัสบดี 27 ส.ค.) ยังไม่มี log และยังไม่ได้กำหนดประเภทกิจกรรม |
| Test Steps | 1. เปิดแท็บ Planner/ปฏิทิน<br>2. แตะวันพฤหัสบดี 27 ส.ค. (วันนี้)<br>3. ในชีทรายละเอียดวัน เลือกชิปประเภทกิจกรรม "เวทเทรนนิ่ง"<br>4. กด "บันทึก" |
| Expected Result | ระบบบันทึกประเภทกิจกรรม "เวทเทรนนิ่ง" ของวันพฤหัสบดี 27 ส.ค. ลงแผนรายสัปดาห์ และแสดงผลตรงกันทั้งในปฏิทินและ Daily Dashboard ของวันนั้น |
| Test Data | สัปดาห์ 24–30 ส.ค. 2026, วันที่เลือก = พฤหัสบดี 27 ส.ค. 2026 (วันนี้), ประเภทกิจกรรมที่เลือก = "เวทเทรนนิ่ง" |
| References | REQ-08 · AC-PLN-1-01 · [user-journeys.md#pln-1](../../../02-design/01-prototypes/user-journeys.md#pln-1--ปฏิทินวางแผนรายสัปดาห์-req-08) ขั้นตอน 3–5 |

### TC-PLN-1-002 — กำหนดประเภทกิจกรรมล่วงหน้าของวันในอนาคต

| ฟิลด์ | รายละเอียด |
|---|---|
| Test Case Name | ผู้ใช้กำหนดแผนล่วงหน้าของวันในอนาคต (คนละประเภทกิจกรรมจาก TC-PLN-1-001 เพื่อความหมายของ variation) |
| Pre-condition | ผู้ใช้เปิดปฏิทินรายสัปดาห์ วันศุกร์ 28 ส.ค. 2026 เป็นวันในอนาคต ยังไม่มี log และยังไม่ได้กำหนดประเภทกิจกรรม |
| Test Steps | 1. เปิดแท็บ Planner/ปฏิทิน<br>2. แตะวันศุกร์ 28 ส.ค.<br>3. เลือกชิปประเภทกิจกรรม "HIIT"<br>4. กด "บันทึก" |
| Expected Result | ระบบบันทึกประเภทกิจกรรม "HIIT" ของวันศุกร์ 28 ส.ค. ลงแผนรายสัปดาห์ล่วงหน้า และวันนั้นแสดงผลเป็น "HIIT" เมื่อถึงวันจริง |
| Test Data | สัปดาห์ 24–30 ส.ค. 2026, วันที่เลือก = ศุกร์ 28 ส.ค. 2026 (วันในอนาคต), ประเภทกิจกรรมที่เลือก = "HIIT" |
| References | REQ-08 · AC-PLN-1-01 · [user-journeys.md#pln-1](../../../02-design/01-prototypes/user-journeys.md#pln-1--ปฏิทินวางแผนรายสัปดาห์-req-08) ขั้นตอน 3–5 |

### TC-PLN-1-003 — ปล่อยวันไว้ไม่กำหนด ใช้ค่า default แนะนำอัตโนมัติ

| ฟิลด์ | รายละเอียด |
|---|---|
| Test Case Name | ผู้ใช้ปล่อยวันในอนาคตไว้โดยไม่กำหนดประเภทกิจกรรมและไม่ตั้ง Cheat/Rest Day |
| Pre-condition | ผู้ใช้เปิดปฏิทินรายสัปดาห์ วันเสาร์ 29 ส.ค. 2026 เป็นวันในอนาคต ยังไม่มี log |
| Test Steps | 1. เปิดแท็บ Planner/ปฏิทิน<br>2. แตะวันเสาร์ 29 ส.ค.<br>3. เลือกชิป "ปล่อยว่าง (แนะนำอัตโนมัติ)" (หรือไม่เลือกชิปใดเลย) และไม่เปิดสวิตช์ Cheat Day/Rest Day<br>4. กด "บันทึก" |
| Expected Result | วันเสาร์ 29 ส.ค. ไม่มีประเภทกิจกรรมที่กำหนดเอง ระบบใช้ค่า default คือให้เอนจิ้นแนะนำวิดีโออัตโนมัติตาม REC-1 เมื่อถึงวันนั้น |
| Test Data | สัปดาห์ 24–30 ส.ค. 2026, วันที่เลือก = เสาร์ 29 ส.ค. 2026, ประเภทกิจกรรม = ปล่อยว่าง, Cheat/Rest Day = ปิด |
| References | REQ-08 · AC-PLN-1-02 · [user-journeys.md#pln-1](../../../02-design/01-prototypes/user-journeys.md#pln-1--ปฏิทินวางแผนรายสัปดาห์-req-08) ขั้นตอน 4, Alt/Edge Case ข้อ 1 |

> **Gap ที่ข้ามไปโดยตั้งใจ**: Alt/Edge Case ของ PLN-1 ที่ระบุว่า "ผู้ใช้แก้ไขแผนของวันที่ผ่านไปแล้ว
> (มี log แล้ว) ได้หรือไม่ ยังไม่ระบุชัดเจน" (ดู [Open Questions ของ user-journeys.md](../../../02-design/01-prototypes/user-journeys.md#open-questions)
> ข้อ 3) ไม่มี test case ให้ในเอกสารนี้ เพราะ `acceptance-criteria.md` เองก็ไม่ได้แปลงจุดนี้เป็น scenario
> ไว้ (พฤติกรรมยังไม่ถูกนิยาม แม้ว่า `v1/08-weekly-planner.html` จะ mockup เป็น read-only ก็ตาม แต่เป็น
> ทางเลือกของ mockup เอง ไม่ใช่มติ product) ยังเป็น open question ที่รอการยืนยันจากผู้ใช้อยู่

---

## PLN-2 — โหมด Cheat Day / Rest Day

Feature: [backlog.md#pln-2](../../../01-requirements/backlog.md) · REQ-09 ·
AC: [AC-PLN-2-01, AC-PLN-2-02, AC-PLN-2-03](../../../01-requirements/acceptance-criteria.md#pln-2--โหมด-cheat-day--rest-day-preserve-log-completed-wins) ·
Journey: [user-journeys.md#pln-2](../../../02-design/01-prototypes/user-journeys.md#pln-2--โหมด-cheat-day--rest-day-req-09) ·
Prototype: [08-weekly-planner.html](../../../02-design/01-prototypes/v1/08-weekly-planner.html),
[05-daily-dashboard.html](../../../02-design/01-prototypes/v1/05-daily-dashboard.html)

### TC-PLN-2-001 — ตั้ง Rest Day ในวันที่ยังไม่มี log

| ฟิลด์ | รายละเอียด |
|---|---|
| Test Case Name | ตั้งวันในอนาคตที่ยังไม่มี log เป็น Rest Day |
| Pre-condition | วันเสาร์ 29 ส.ค. 2026 ยังไม่มี log บันทึกอยู่ และมีเป้าหมายแคลอรี่รายวันที่กำลังทำงานอยู่ |
| Test Steps | 1. เปิดปฏิทินรายสัปดาห์ แตะวันเสาร์ 29 ส.ค.<br>2. เปิดสวิตช์ "Cheat Day / Rest Day"<br>3. กด "บันทึก" |
| Expected Result | ระบบหยุดนับเป้าหมายแคลอรี่ของวันเสาร์ 29 ส.ค. ไม่แนะนำวิดีโอสำหรับวันนั้น (ข้าม REC-1) และ mark สถานะวันนั้นเป็น "ครบเป้าหมาย" (completed) ทันที |
| Test Data | วันที่ตั้ง = เสาร์ 29 ส.ค. 2026, ประเภท = Rest Day, สถานะก่อนตั้ง = ไม่มี log |
| References | REQ-09 · AC-PLN-2-01 · [user-journeys.md#pln-2](../../../02-design/01-prototypes/user-journeys.md#pln-2--โหมด-cheat-day--rest-day-req-09) ขั้นตอน 3–4 |

### TC-PLN-2-002 — ตั้ง Cheat Day ในวันที่ยังไม่มี log (variation ของประเภท)

| ฟิลด์ | รายละเอียด |
|---|---|
| Test Case Name | ตั้งวันในอนาคตที่ยังไม่มี log เป็น Cheat Day (แทนที่จะเป็น Rest Day เพื่อยืนยันว่าทั้งสองประเภทมีผลเหมือนกัน) |
| Pre-condition | วันอาทิตย์ 30 ส.ค. 2026 ยังไม่มี log บันทึกอยู่ |
| Test Steps | 1. เปิดปฏิทินรายสัปดาห์ แตะวันอาทิตย์ 30 ส.ค.<br>2. เปิดสวิตช์ "Cheat Day / Rest Day" (เลือกระบุเป็น Cheat Day ผ่านหน้า Daily Dashboard ของวันนั้น)<br>3. กด "บันทึก" |
| Expected Result | ระบบหยุดนับเป้าหมายแคลอรี่ของวันอาทิตย์ 30 ส.ค. ไม่แนะนำวิดีโอ และ mark สถานะวันนั้นเป็น "ครบเป้าหมาย" (completed) ทันที เหมือนกับผลของ Rest Day ใน TC-PLN-2-001 |
| Test Data | วันที่ตั้ง = อาทิตย์ 30 ส.ค. 2026, ประเภท = Cheat Day, สถานะก่อนตั้ง = ไม่มี log |
| References | REQ-09 · AC-PLN-2-01 · [user-journeys.md#pln-2](../../../02-design/01-prototypes/user-journeys.md#pln-2--โหมด-cheat-day--rest-day-req-09) ขั้นตอน 3–4 |

### TC-PLN-2-003 — ตั้ง Rest Day ย้อนหลังในวันที่มี log ครบเป้าหมายอยู่แล้ว

| ฟิลด์ | รายละเอียด |
|---|---|
| Test Case Name | ตั้ง Cheat/Rest Day ในวันที่มี log ครบเป้าหมายอยู่แล้ว ต้องเก็บ log เดิมไว้ |
| Pre-condition | วันอังคาร 25 ส.ค. 2026 มี log อยู่แล้วจากการออกกำลังกายจริง: เวทเทรนนิ่ง 25 นาที, 385 kcal, สถานะ "ครบเป้าหมาย" |
| Test Steps | 1. เปิดปฏิทินรายสัปดาห์ แตะวันอังคาร 25 ส.ค.<br>2. เปิดสวิตช์ "Cheat Day / Rest Day" ย้อนหลัง<br>3. กด "บันทึก" |
| Expected Result | ระบบเก็บ log เดิม (เวทเทรนนิ่ง 25 นาที, 385 kcal) ไว้ทั้งหมด ไม่ลบทิ้ง และสถานะวันนั้นยังคง "ครบเป้าหมาย" (completed) เหมือนเดิม |
| Test Data | วันที่ตั้ง = อังคาร 25 ส.ค. 2026, log เดิม = เวทเทรนนิ่ง 25 นาที / 385 kcal / สถานะครบเป้าหมาย, ประเภทที่ตั้งใหม่ = Rest Day |
| References | REQ-09 · AC-PLN-2-02 · [user-journeys.md#pln-2](../../../02-design/01-prototypes/user-journeys.md#pln-2--โหมด-cheat-day--rest-day-req-09) ขั้นตอน 5–6, Alt/Edge Case ข้อ 1 |

### TC-PLN-2-004 — ตั้ง Cheat Day ย้อนหลังในวันที่มี log "ไม่ครบเป้าหมาย" อยู่แล้ว (completed ชนะเสมอ)

| ฟิลด์ | รายละเอียด |
|---|---|
| Test Case Name | ตั้ง Cheat/Rest Day ย้อนหลังทับ log เดิมที่สถานะ "ไม่ครบเป้าหมาย" ต้องเปลี่ยนสถานะเป็นครบเป้าหมายเสมอ (completed ชนะเสมอ) |
| Pre-condition | วันจันทร์ 24 ส.ค. 2026 มี log อยู่แล้วจากการออกกำลังกายจริง: 260 kcal จากเป้าหมายวันนั้น 400 kcal (65%) สถานะ "ไม่ครบเป้าหมาย" |
| Test Steps | 1. เปิดปฏิทินรายสัปดาห์ แตะวันจันทร์ 24 ส.ค.<br>2. เปิดสวิตช์ "Cheat Day / Rest Day" ย้อนหลัง (เลือก Cheat Day)<br>3. กด "บันทึก" |
| Expected Result | ระบบเก็บ log เดิม (260 kcal) ไว้ไม่ลบทิ้ง แต่เปลี่ยนสถานะของวันนั้นจาก "ไม่ครบเป้าหมาย" เป็น "ครบเป้าหมาย" (completed) ทันที ตามกติกา "completed ชนะเสมอ" — Cheat/Rest Day ที่ตั้งย้อนหลังไม่ทำให้สถานะแย่ลงหรือคงสถานะเดิมที่แย่กว่าไว้ |
| Test Data | วันที่ตั้ง = จันทร์ 24 ส.ค. 2026, log เดิม = 260 kcal / เป้าหมายวันนั้น 400 kcal / สถานะเดิม "ไม่ครบเป้าหมาย", ประเภทที่ตั้งใหม่ = Cheat Day |
| References | REQ-09 · AC-PLN-2-02 · [user-journeys.md#pln-2](../../../02-design/01-prototypes/user-journeys.md#pln-2--โหมด-cheat-day--rest-day-req-09) ขั้นตอน 5–6, Alt/Edge Case ข้อ 1 (หมายเหตุ: เป็น test-data variation เพิ่มเติมของ AC-PLN-2-02 นอกเหนือจาก TC-PLN-2-003 — กรณีนี้สำคัญกว่าเพราะพิสูจน์ว่า "completed ชนะเสมอ" ทำงานแม้ log เดิมจะเป็นสถานะแย่ที่สุดก็ตาม) |

### TC-PLN-2-005 — ยกเลิกการตั้ง Cheat/Rest Day ก่อนสิ้นวัน

| ฟิลด์ | รายละเอียด |
|---|---|
| Test Case Name | ผู้ใช้ยกเลิกการตั้ง Rest Day ของวันนี้ก่อนสิ้นวัน กลับไปนับเป้าหมายแคลอรี่ตามปกติ |
| Pre-condition | วันพุธ 26 ส.ค. 2026 ถูกตั้งเป็น Rest Day อยู่ก่อนแล้ว (สถานะ "ครบเป้าหมาย" จาก PLN-2) ยังไม่สิ้นวัน |
| Test Steps | 1. เปิดปฏิทินรายสัปดาห์ แตะวันพุธ 26 ส.ค.<br>2. ปิดสวิตช์ "Cheat Day / Rest Day"<br>3. กด "บันทึก" |
| Expected Result | วันพุธ 26 ส.ค. กลับไปนับเป้าหมายแคลอรี่ตามปกติ (ไม่ใช่ completed อัตโนมัติอีกต่อไป) และสถานะของวันนั้นจะถูกประเมินใหม่ตามกติกา all-or-nothing ของ PLN-3 เมื่อมีการออกกำลังกายจริงหรือถึงสิ้นวัน |
| Test Data | วันที่ยกเลิก = พุธ 26 ส.ค. 2026, สถานะก่อนยกเลิก = Rest Day (ครบเป้าหมาย), การกระทำ = ปิดสวิตช์ Cheat/Rest Day ก่อนสิ้นวัน |
| References | REQ-09 · AC-PLN-2-03 · [user-journeys.md#pln-2](../../../02-design/01-prototypes/user-journeys.md#pln-2--โหมด-cheat-day--rest-day-req-09) Alt/Edge Case ข้อ 2 |

---

## PLN-3 — บันทึกผลรายวัน (all-or-nothing)

Feature: [backlog.md#pln-3](../../../01-requirements/backlog.md) · REQ-10 ·
AC: [AC-PLN-3-01, AC-PLN-3-02, AC-PLN-3-03](../../../01-requirements/acceptance-criteria.md#pln-3--บันทึกผลรายวัน-all-or-nothing) ·
Journey: [user-journeys.md#pln-3](../../../02-design/01-prototypes/user-journeys.md#pln-3--บันทึกผลรายวันเมื่อครบเป้าหมาย-req-10) ·
Prototype: [07-workout-result.html](../../../02-design/01-prototypes/v1/07-workout-result.html)

> **PLN-3 เป็น feature ที่เข้มงวดเรื่องกติกามากที่สุดในแอป (all-or-nothing, ไม่มี partial credit)**
> ชุด test case ด้านล่างจึงเจาะกรณี boundary โดยเฉพาะ: พอดี 100% (ผ่าน), ต่ำกว่า 100% แบบเฉียดที่สุด
> (ต้องไม่ผ่าน แม้จะใกล้เคียงมาก — จุดที่ implement ผิดได้ง่ายที่สุด), และเกิน 100% ไปมาก (ผ่าน ไม่มี
> extra credit) ทุก test case ในกลุ่มนี้ใช้เป้าหมายแคลอรี่ต่อวันคงที่ = **500 kcal** เพื่อให้คำนวณ % ได้
> ตรงและตรวจสอบได้ชัดเจน

### TC-PLN-3-001 — เผาผลาญจริงเท่ากับเป้าหมายพอดี 100% (boundary: ผ่าน)

| ฟิลด์ | รายละเอียด |
|---|---|
| Test Case Name | แคลอรี่เผาผลาญจริงเท่ากับเป้าหมายพอดี 100% ต้องบันทึกสถานะ "ครบเป้าหมาย" |
| Pre-condition | ผู้ใช้มีเป้าหมายแคลอรี่วันนี้ = 500 kcal (จาก ONB-3/REC-1) วันนี้ไม่ใช่ Cheat/Rest Day ผู้ใช้เพิ่งจบวิดีโอออกกำลังกาย |
| Test Steps | 1. ระบบคำนวณแคลอรี่เผาผลาญจริงจาก REC-2 ได้ 500 kcal<br>2. ระบบเทียบกับเป้าหมายวันนี้ (500 kcal)<br>3. ระบบตัดสินสถานะ log |
| Expected Result | 500/500 = 100% พอดี ระบบสร้าง log entry ที่มีนาทีออกกำลังกายจริง, แคลอรี่สะสม 500 kcal, สถานะ "ครบเป้าหมาย" อัปเดตสถิติรวมและส่งต่อสถานะ "ครบเป้าหมาย" ให้ PLN-4 |
| Test Data | เป้าหมายวันนี้ = 500 kcal, แคลอรี่เผาผลาญจริง = 500 kcal (100%) |
| References | REQ-10 · AC-PLN-3-01 · [user-journeys.md#pln-3](../../../02-design/01-prototypes/user-journeys.md#pln-3--บันทึกผลรายวันเมื่อครบเป้าหมาย-req-10) ขั้นตอน 3–4 |

### TC-PLN-3-002 — เผาผลาญจริงเกินเป้าหมายไปมาก (well above 100%: ผ่าน ไม่มี extra credit)

| ฟิลด์ | รายละเอียด |
|---|---|
| Test Case Name | แคลอรี่เผาผลาญจริงเกินเป้าหมายไปมาก ยังคงบันทึกสถานะ "ครบเป้าหมาย" เท่านั้น ไม่มีสถานะพิเศษเพิ่มเติม |
| Pre-condition | ผู้ใช้มีเป้าหมายแคลอรี่วันนี้ = 500 kcal วันนี้ไม่ใช่ Cheat/Rest Day ผู้ใช้เพิ่งจบวิดีโอออกกำลังกายความเข้มข้นสูงต่อเนื่องหลายเซสชัน |
| Test Steps | 1. ระบบคำนวณแคลอรี่เผาผลาญจริงจาก REC-2 ได้ 650 kcal<br>2. ระบบเทียบกับเป้าหมายวันนี้ (500 kcal)<br>3. ระบบตัดสินสถานะ log |
| Expected Result | 650/500 = 130% เกินเป้าหมาย ระบบสร้าง log สถานะ "ครบเป้าหมาย" (เหมือนกรณี 100% พอดี) บันทึกแคลอรี่สะสมจริงตามที่เผาผลาญได้ (650 kcal) โดยไม่มี partial/extra credit หรือสถานะพิเศษใด ๆ เพิ่มจากการเกินเป้า |
| Test Data | เป้าหมายวันนี้ = 500 kcal, แคลอรี่เผาผลาญจริง = 650 kcal (130%) |
| References | REQ-10 · AC-PLN-3-01 · [user-journeys.md#pln-3](../../../02-design/01-prototypes/user-journeys.md#pln-3--บันทึกผลรายวันเมื่อครบเป้าหมาย-req-10) ขั้นตอน 3–4 (test-data variation ของ AC-PLN-3-01 ร่วมกับ TC-PLN-3-001) |

### TC-PLN-3-003 — เผาผลาญจริงต่ำกว่าเป้าหมายเฉียดที่สุด 99% (boundary: ต้องไม่ผ่าน)

| ฟิลด์ | รายละเอียด |
|---|---|
| Test Case Name | แคลอรี่เผาผลาญจริง 99% ของเป้าหมาย (ต่ำกว่า 100% แค่ 1%) ต้องบันทึกสถานะ "ไม่ครบเป้าหมาย" อย่างเคร่งครัด ไม่มี partial credit |
| Pre-condition | ผู้ใช้มีเป้าหมายแคลอรี่วันนี้ = 500 kcal วันนี้ไม่ใช่ Cheat/Rest Day ผู้ใช้เพิ่งจบวิดีโอออกกำลังกาย |
| Test Steps | 1. ระบบคำนวณแคลอรี่เผาผลาญจริงจาก REC-2 ได้ 495 kcal<br>2. ระบบเทียบกับเป้าหมายวันนี้ (500 kcal)<br>3. ระบบตัดสินสถานะ log |
| Expected Result | 495/500 = 99% ยังไม่ถึง 100% (ขาดไป 5 kcal) ระบบต้องสร้าง log สถานะ "ไม่ครบเป้าหมาย" โดยไม่มี partial credit ใด ๆ (ห้ามปัดขึ้นเป็นครบเป้าหมายแม้จะใกล้เคียงมาก) แล้วส่งต่อสถานะ "ไม่ครบเป้าหมาย" ให้ PLN-4 |
| Test Data | เป้าหมายวันนี้ = 500 kcal, แคลอรี่เผาผลาญจริง = 495 kcal (99%, ขาด 5 kcal) |
| References | REQ-10 · AC-PLN-3-02 · [user-journeys.md#pln-3](../../../02-design/01-prototypes/user-journeys.md#pln-3--บันทึกผลรายวันเมื่อครบเป้าหมาย-req-10) ขั้นตอน 5, Alt/Edge Case ข้อ 1 — **boundary test ที่สำคัญที่สุดของ PLN-3** |

### TC-PLN-3-004 — เผาผลาญจริงต่ำกว่าเป้าหมายชัดเจน (well below 100%: ไม่ผ่าน)

| ฟิลด์ | รายละเอียด |
|---|---|
| Test Case Name | แคลอรี่เผาผลาญจริงต่ำกว่าเป้าหมายชัดเจน บันทึกสถานะ "ไม่ครบเป้าหมาย" |
| Pre-condition | ผู้ใช้มีเป้าหมายแคลอรี่วันนี้ = 500 kcal วันนี้ไม่ใช่ Cheat/Rest Day ผู้ใช้หยุดวิดีโอออกกำลังกายกลางคัน |
| Test Steps | 1. ระบบคำนวณแคลอรี่เผาผลาญจริงจาก REC-2 ได้ 350 kcal<br>2. ระบบเทียบกับเป้าหมายวันนี้ (500 kcal)<br>3. ระบบตัดสินสถานะ log |
| Expected Result | 350/500 = 70% ระบบสร้าง log สถานะ "ไม่ครบเป้าหมาย" โดยไม่มี partial credit ใด ๆ |
| Test Data | เป้าหมายวันนี้ = 500 kcal, แคลอรี่เผาผลาญจริง = 350 kcal (70%) |
| References | REQ-10 · AC-PLN-3-02 · [user-journeys.md#pln-3](../../../02-design/01-prototypes/user-journeys.md#pln-3--บันทึกผลรายวันเมื่อครบเป้าหมาย-req-10) ขั้นตอน 5 (test-data variation ของ AC-PLN-3-02 ร่วมกับ TC-PLN-3-003 — กรณีนี้ไม่ใช่ boundary แต่ยืนยันว่ากติกา all-or-nothing ใช้ได้ทั่วไป ไม่ใช่แค่ใกล้ boundary) |

### TC-PLN-3-005 — วันนี้เป็น Cheat/Rest Day ข้ามขั้นตอน PLN-3 ทั้งหมด

| ฟิลด์ | รายละเอียด |
|---|---|
| Test Case Name | วันที่ถูกตั้งเป็น Cheat Day/Rest Day ไม่ผ่านการเปรียบเทียบแคลอรี่ของ PLN-3 |
| Pre-condition | วันนี้ถูกตั้งเป็น Rest Day ไว้แล้ว (ผ่าน PLN-2) |
| Test Steps | 1. ถึงสิ้นวัน โดยไม่มีการออกกำลังกายเทียบเป้าหมายผ่านขั้นตอน PLN-3<br>2. ระบบประเมินสถานะของวันนั้น |
| Expected Result | ระบบข้ามขั้นตอนเปรียบเทียบแคลอรี่จริง/เป้าหมายและการสร้าง log ของ PLN-3 ทั้งหมด สถานะของวันนั้น ("ครบเป้าหมาย") ถูกกำหนดโดย PLN-2 แทน ไม่มีการสร้าง log แบบ all-or-nothing ซ้ำ |
| Test Data | วันนี้ = Rest Day (ตั้งไว้ล่วงหน้าผ่าน PLN-2), ไม่มีแคลอรี่เผาผลาญจริงจาก REC-2 ให้เทียบ |
| References | REQ-09, REQ-10 · AC-PLN-3-03 · [user-journeys.md#pln-3](../../../02-design/01-prototypes/user-journeys.md#pln-3--บันทึกผลรายวันเมื่อครบเป้าหมาย-req-10) Alt/Edge Case ข้อ 2 |

---

## PLN-4 — ติดตาม Streak ต่อเนื่อง

Feature: [backlog.md#pln-4](../../../01-requirements/backlog.md) · REQ-09, REQ-10 ·
AC: [AC-PLN-4-01, AC-PLN-4-02, AC-PLN-4-03](../../../01-requirements/acceptance-criteria.md#pln-4--ติดตาม-streak-ต่อเนื่อง-strict-ไม่มี-partial-credit) ·
Journey: [user-journeys.md#pln-4](../../../02-design/01-prototypes/user-journeys.md#pln-4--ติดตาม-streak-ต่อเนื่อง-req-09-req-10) ·
Prototype: [05-daily-dashboard.html](../../../02-design/01-prototypes/v1/05-daily-dashboard.html),
[09-log-history.html](../../../02-design/01-prototypes/v1/09-log-history.html)

### TC-PLN-4-001 — คำนวณ streak ต่อเนื่องรวมวันที่ครบเป้าหมายจาก log จริงและจาก Cheat/Rest Day

| ฟิลด์ | รายละเอียด |
|---|---|
| Test Case Name | Streak นับรวมทั้งวันที่ครบเป้าหมายจริง (PLN-3) และวันที่เป็น Cheat/Rest Day (PLN-2) อย่างต่อเนื่อง |
| Pre-condition | ผู้ใช้มีประวัติ log ย้อนหลัง (ใช้ตัวอย่างเดียวกับ `v1/09-log-history.html`): พฤหัสบดี 27 ส.ค. (410 kcal, ครบเป้าหมาย), พุธ 26 ส.ค. (Rest Day, ครบเป้าหมาย), อังคาร 25 ส.ค. (385 kcal, ครบเป้าหมาย), จันทร์ 24 ส.ค. (260 kcal, ไม่ครบเป้าหมาย) |
| Test Steps | 1. ผู้ใช้เปิด Dashboard ในวันพฤหัสบดี 27 ส.ค. 2026<br>2. ระบบไล่ตรวจสอบสถานะแต่ละวันย้อนหลังจากวันนี้<br>3. ระบบนับต่อเนื่องจนพบวันที่สถานะ "ไม่ครบเป้าหมาย"<br>4. ระบบแสดงจำนวนวัน streak |
| Expected Result | ระบบนับ พฤหัสบดี 27 (ครบเป้าหมาย) → พุธ 26 (ครบเป้าหมายจาก Rest Day) → อังคาร 25 (ครบเป้าหมาย) ต่อเนื่องกัน แล้วหยุดที่จันทร์ 24 (ไม่ครบเป้าหมาย) ซึ่งไม่นับรวม ระบบแสดง **streak = 3 วัน** บน Dashboard |
| Test Data | ประวัติ: 27 ส.ค.=ครบเป้าหมาย(410kcal), 26 ส.ค.=ครบเป้าหมาย(Rest Day), 25 ส.ค.=ครบเป้าหมาย(385kcal), 24 ส.ค.=ไม่ครบเป้าหมาย(260kcal) → ผลลัพธ์ streak = 3 |
| References | REQ-09, REQ-10 · AC-PLN-4-01 · [user-journeys.md#pln-4](../../../02-design/01-prototypes/user-journeys.md#pln-4--ติดตาม-streak-ต่อเนื่อง-req-09-req-10) ขั้นตอน 1–3, 6 |

### TC-PLN-4-002 — ขาด log ไป 1 วันโดยไม่ตั้ง Cheat/Rest Day streak รีเซ็ตเป็น 0

| ฟิลด์ | รายละเอียด |
|---|---|
| Test Case Name | วันที่ไม่มี log เลยและไม่ได้ตั้ง Cheat/Rest Day ทำให้ streak ขาดทันที |
| Pre-condition | ผู้ใช้มี streak ต่อเนื่อง 5 วันก่อนหน้า วันนี้ผู้ใช้ไม่ได้ออกกำลังกายเลย (ไม่มี log) และไม่ได้ตั้งวันนี้เป็น Cheat Day/Rest Day |
| Test Steps | 1. ถึงสิ้นวัน วันนี้ไม่มี log และไม่มีการตั้ง Cheat/Rest Day<br>2. ระบบไล่คำนวณ streak ย้อนหลังจากวันนี้<br>3. ระบบตรวจพบว่าวันนี้ไม่มีสถานะ "ครบเป้าหมาย" |
| Expected Result | ระบบถือว่า streak ขาดทันทีที่วันนี้ และรีเซ็ต **streak เป็น 0** แม้ว่าก่อนหน้านี้จะมี streak ต่อเนื่อง 5 วันก็ตาม |
| Test Data | streak ก่อนหน้า = 5 วัน, วันนี้ = ไม่มี log, ไม่มีการตั้ง Cheat/Rest Day → ผลลัพธ์ streak = 0 |
| References | REQ-09, REQ-10 · AC-PLN-4-02 · [user-journeys.md#pln-4](../../../02-design/01-prototypes/user-journeys.md#pln-4--ติดตาม-streak-ต่อเนื่อง-req-09-req-10) ขั้นตอน 4–5, Alt/Edge Case ข้อ 1 |

### TC-PLN-4-003 — Boundary: log "ไม่ครบเป้าหมาย" ที่ 99% ทำให้ streak ขาดทันที ไม่มี grace

| ฟิลด์ | รายละเอียด |
|---|---|
| Test Case Name | แม้ทำได้เกือบเต็มเป้าหมาย (99%) log สถานะ "ไม่ครบเป้าหมาย" ก็ยังทำให้ streak ขาดทันทีเหมือนไม่มี log เลย ไม่มี partial credit หรือ grace miss ใด ๆ |
| Pre-condition | ผู้ใช้มี streak ต่อเนื่อง 10 วันก่อนหน้า (ครบเป้าหมายทุกวัน) วันนี้เป้าหมายแคลอรี่ = 500 kcal |
| Test Steps | 1. วันนี้ผู้ใช้ออกกำลังกายได้แคลอรี่จริง 495 kcal (99% ของเป้าหมาย)<br>2. PLN-3 ตัดสินสถานะ log ของวันนี้เป็น "ไม่ครบเป้าหมาย" (ตาม TC-PLN-3-003)<br>3. ระบบไล่คำนวณ streak ย้อนหลังจากวันนี้ |
| Expected Result | แม้ทำได้ถึง 99% ของเป้าหมาย ระบบยังคงถือว่า streak ขาดทันทีเหมือนไม่มี log เลย (ไม่มี partial credit หรือ grace miss ใด ๆ) และรีเซ็ต **streak เป็น 0** ที่วันนี้ ทั้งที่ก่อนหน้ามี streak ยาวถึง 10 วัน |
| Test Data | streak ก่อนหน้า = 10 วัน (ครบเป้าหมายทุกวัน), เป้าหมายวันนี้ = 500 kcal, แคลอรี่เผาผลาญจริงวันนี้ = 495 kcal (99%) → สถานะ log = ไม่ครบเป้าหมาย → ผลลัพธ์ streak = 0 |
| References | REQ-09, REQ-10 · AC-PLN-4-03 · [user-journeys.md#pln-4](../../../02-design/01-prototypes/user-journeys.md#pln-4--ติดตาม-streak-ต่อเนื่อง-req-09-req-10) ขั้นตอน 4–5, Alt/Edge Case ข้อ 2 — **boundary/strict-rule test ที่สำคัญที่สุดของ PLN-4** เชื่อมกับ TC-PLN-3-003 |

### TC-PLN-4-004 — ไม่มี grace ตลอดช่วง 90–99% ไม่ใช่แค่ใกล้ boundary (variation)

| ฟิลด์ | รายละเอียด |
|---|---|
| Test Case Name | แม้ทำได้ 90% ของเป้าหมาย (ไม่ใช่แค่เฉียด 99%) ก็ยังไม่มีเกณฑ์ผ่อนปรนใด ๆ streak ขาดทันทีเหมือนกัน |
| Pre-condition | ผู้ใช้มี streak ต่อเนื่อง 4 วันก่อนหน้า (ครบเป้าหมายทุกวัน) วันนี้เป้าหมายแคลอรี่ = 500 kcal |
| Test Steps | 1. วันนี้ผู้ใช้ออกกำลังกายได้แคลอรี่จริง 450 kcal (90% ของเป้าหมาย)<br>2. PLN-3 ตัดสินสถานะ log ของวันนี้เป็น "ไม่ครบเป้าหมาย"<br>3. ระบบไล่คำนวณ streak ย้อนหลังจากวันนี้ |
| Expected Result | ระบบถือว่า streak ขาดทันทีเหมือนไม่มี log เลย และรีเซ็ต **streak เป็น 0** — ยืนยันว่าไม่มีเกณฑ์ผ่อนปรนแบบขั้นบันได (เช่น ≥90% ยังนับต่อ) ตลอดทั้งช่วง 90–99% ไม่ใช่แค่จุดที่เฉียด 100% ที่สุด |
| Test Data | streak ก่อนหน้า = 4 วัน (ครบเป้าหมายทุกวัน), เป้าหมายวันนี้ = 500 kcal, แคลอรี่เผาผลาญจริงวันนี้ = 450 kcal (90%) → สถานะ log = ไม่ครบเป้าหมาย → ผลลัพธ์ streak = 0 |
| References | REQ-09, REQ-10 · AC-PLN-4-03 · [user-journeys.md#pln-4](../../../02-design/01-prototypes/user-journeys.md#pln-4--ติดตาม-streak-ต่อเนื่อง-req-09-req-10) Alt/Edge Case ข้อ 2 (test-data variation ของ AC-PLN-4-03 ร่วมกับ TC-PLN-4-003 — ครอบคลุมขอบล่างของช่วง 90–99% ที่ journey ยกตัวอย่างไว้ ไม่ใช่แค่ขอบบน) |

---

## สรุปจำนวน Test Case ต่อ Feature

| Feature ID | จำนวน AC Scenario | จำนวน Test Case | Test ID |
|---|---|---|---|
| PLN-1 | 2 | 3 | TC-PLN-1-001 ถึง 003 |
| PLN-2 | 3 | 5 | TC-PLN-2-001 ถึง 005 |
| PLN-3 | 3 | 5 | TC-PLN-3-001 ถึง 005 |
| PLN-4 | 3 | 4 | TC-PLN-4-001 ถึง 004 |
| **รวม** | **11** | **17** | |

---

อ้างอิงต้นฉบับ: [acceptance-criteria.md](../../../01-requirements/acceptance-criteria.md) ·
[backlog.md](../../../01-requirements/backlog.md) ·
[user-journeys.md](../../../02-design/01-prototypes/user-journeys.md) ·
[01-spec/20260823-03-planner-logging.md](../../../01-requirements/01-spec/20260823-03-planner-logging.md)
