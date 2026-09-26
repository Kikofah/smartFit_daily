# Task Breakdown — Future Phase

- **ประเภทเอกสาร:** Task Breakdown
- **สถานะเอกสาร:** Draft
- **วันที่สร้าง:** 2026-08-28
- **อัปเดตล่าสุด:** 2026-09-26 — เพิ่ม `TASK-INT-0` (Pairing Code — REQ-18) ที่ขาดไปตั้งแต่ `backlog.md` เพิ่ม
  Feature ID INT-0 เมื่อ 2026-08-30 — Status ทุก task = กำลังทำ ตามการยืนยันของผู้ใช้ (มีโค้ดจริงแล้ว แต่ยัง
  ไม่ผ่าน Exit Criteria ของ [Release Plan §3.3](../02-plan/release-plan.md#33-future-phase))
- **สร้างโดย:** skill `plan-task-builder`
- **อ้างอิงจาก:** [Release Plan](../02-plan/release-plan.md), [Product Backlog](../backlog.md)

## 1. ขอบเขตของ Phase นี้

การเชื่อมต่ออุปกรณ์ภายนอก (ตาชั่งอัจฉริยะ, wearable) และพยากรณ์วันที่คาดว่าจะถึงเป้าหมายน้ำหนัก — ทั้งหมด
เป็น optional ไม่ผูกกับ core loop รายวัน (NFR-07) — Feature ID: INT-0, INT-1, INT-2, INT-3 (ทั้งหมด MoSCoW =
Could) ต้องมี [MVP Phase](phase-1-mvp-core-loop.md) และ [Next Phase](phase-2-motivation-recommendation-ux.md)
เสร็จก่อน รายละเอียดเต็มดู [Release Plan §3.3](../02-plan/release-plan.md#33-future-phase)

## 2. Task List

| Task ID | ชื่อ Task | Feature ID/REQ | Status | คำอธิบาย | References |
|---|---|---|---|---|---|
| TASK-INT-0 | ยืนยันตัวตนก่อนจับคู่อุปกรณ์ผ่านรหัสจับคู่ (Pairing Code) | INT-0 / REQ-18 | กำลังทำ | ออกรหัสจับคู่ 6 หลักจากเว็บ (อายุ 5 นาที, ใช้ครั้งเดียว, 1 รหัสที่ใช้ได้ต่อบัญชี) แล้วแลกเป็น session บนแอป mobile แบบ silent พร้อม rate limit เมื่อกรอกผิด 5 ครั้งใน 15 นาที — precondition ของ `TASK-INT-2`/`TASK-INT-3` | AC-INT-0-01–08, [detailed-design/04-smart-integrations.md § INT-0](../../02-design/02-technical/detailed-design/04-smart-integrations.md) |
| TASK-INT-1 | พยากรณ์วันถึงเป้าหมายน้ำหนัก | INT-1 / REQ-11 | กำลังทำ | พยากรณ์จากอัตราขาดดุล/เกินดุลแคลอรี่เฉลี่ยที่บันทึกจริง (7,700 kcal ≈ 1 กก.) | AC-INT-1-01–03, [detailed-design/04-smart-integrations.md](../../02-design/02-technical/detailed-design/04-smart-integrations.md) |
| TASK-INT-2 | ซิงค์ตาชั่งอัจฉริยะ | INT-2 / REQ-12 | กำลังทำ | จับคู่ตาชั่งผ่าน Bluetooth/Health API พร้อม consent ซิงค์น้ำหนัก/องค์ประกอบร่างกาย | AC-INT-2-01–02, [detailed-design/04-smart-integrations.md](../../02-design/02-technical/detailed-design/04-smart-integrations.md) |
| TASK-INT-3 | ซิงค์ข้อมูล Wearable | INT-3 / REQ-13 | กำลังทำ | ขอ consent เข้าถึง Health API/wearable ใช้ค่าจริงแทนค่าประมาณ MET เมื่อมี | AC-INT-3-01–02, [detailed-design/04-smart-integrations.md](../../02-design/02-technical/detailed-design/04-smart-integrations.md) |

## 3. จุดที่ยังไม่ได้ระบุ / ควรยืนยันเพิ่มเติม

- INT-1's จำนวนวัน log ขั้นต่ำก่อนเริ่มพยากรณ์ได้ ยังไม่ระบุใน `01-spec/` (โค้ดใช้ 3 วันไปก่อน — ดู
  `test-cases/04-smart-integrations.md` § INT-1)
- INT-2/INT-3's ลำดับความสำคัญเมื่อข้อมูลจากหลายแหล่งขัดกัน (ชั่งน้ำหนักหลายครั้งต่อวัน, wearable ต่างจาก
  MET มาก) ยังไม่ระบุ
- ทั้งสามข้อนี้ไม่กระทบการมีอยู่ของ task แต่ต้อง resolve ก่อน implement จริงตามที่ระบุไว้แล้วใน
  [test-plan.md §4 (R4, R5)](../../03-testing/01-test-plan/test-plan.md)

## 4. ความสัมพันธ์กับเอกสารอื่น

- [Release Plan](../02-plan/release-plan.md) — แผน phase ที่ task เหล่านี้สังกัดอยู่
- [Product Backlog](../backlog.md) — แหล่งที่มาของ Feature ID/REQ ทุกตัว
- [Requirement — Smart Integrations](../01-spec/20260823-04-smart-integrations.md)
- [User Journeys](../../02-design/01-prototypes/user-journeys.md) — ลำดับ step ของแต่ละ feature
- [MVP Phase](phase-1-mvp-core-loop.md), [Next Phase](phase-2-motivation-recommendation-ux.md)
  — phase ก่อนหน้าที่ต้องเสร็จก่อน
