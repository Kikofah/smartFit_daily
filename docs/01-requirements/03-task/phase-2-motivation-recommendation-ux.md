# Task Breakdown — Next Phase

- **ประเภทเอกสาร:** Task Breakdown
- **สถานะเอกสาร:** Draft
- **วันที่สร้าง:** 2026-08-28
- **สร้างโดย:** skill `plan-task-builder`
- **อ้างอิงจาก:** [Release Plan](../02-plan/release-plan.md), [Product Backlog](../backlog.md)

## 1. ขอบเขตของ Phase นี้

เพิ่มความสามารถเปลี่ยนวิดีโอ (คงเป้าหมายเดิม), วอร์มอัพ-คูลดาวน์อัตโนมัติสำหรับวิดีโอความเข้มข้นสูง, และ
แสดง streak ต่อเนื่องเพื่อสร้างแรงจูงใจ — Feature ID: REC-3, REC-4, PLN-4 (ทั้งหมด MoSCoW = Should) ต้องมี
[MVP Phase](phase-1-mvp-core-loop.md) เสร็จก่อน รายละเอียดเต็มดู
[Release Plan §3.2](../02-plan/release-plan.md#32-next-phase)

## 2. Task List

| Task ID | ชื่อ Task | Feature ID/REQ | Status | คำอธิบาย | References |
|---|---|---|---|---|---|
| TASK-REC-3 | เปลี่ยนวิดีโอโดยคงเป้าแคลอรี่เดิม | REC-3 / REQ-06 | ยังไม่เริ่ม | ผู้ใช้กดเปลี่ยนวิดีโอ คงเป้าหมายเดิม ค้นหาใหม่ไม่รวมวิดีโอที่เพิ่งปฏิเสธ | AC-REC-3-01–02, [detailed-design/daily-youtube-recommendation.md](../../02-design/02-technical/detailed-design/daily-youtube-recommendation.md) |
| TASK-REC-4 | วอร์มอัพ–คูลดาวน์อัตโนมัติ | REC-4 / REQ-07 | ยังไม่เริ่ม | ตรวจความเข้มข้นของวิดีโอหลัก ถ้าสูงประกอบวอร์มอัพ 3 นาที + หลัก + คูลดาวน์ 3 นาที | AC-REC-4-01–03, [detailed-design/daily-youtube-recommendation.md](../../02-design/02-technical/detailed-design/daily-youtube-recommendation.md) |
| TASK-PLN-4 | ติดตาม Streak ต่อเนื่อง | PLN-4 / REQ-09, REQ-10 | ยังไม่เริ่ม | ไล่ประวัติ Daily Log ย้อนหลัง นับวันต่อเนื่องที่ครบเป้าหมาย ไม่มี grace period | AC-PLN-4-01–03, [detailed-design/planner-logging.md](../../02-design/02-technical/detailed-design/planner-logging.md) |

## 3. จุดที่ยังไม่ได้ระบุ / ควรยืนยันเพิ่มเติม

- REC-4's เวลา/แคลอรี่ของวอร์มอัพ-คูลดาวน์นับรวมเข้ากับเป้าหมายรายวัน (ที่ PLN-3 ใช้ประเมิน) หรือไม่ ยังไม่
  ระบุใน `01-spec/` (ดู [Release Plan §5](../02-plan/release-plan.md#5-จุดที่ยังไม่ได้ระบุ--ควรยืนยันเพิ่มเติม))

## 4. ความสัมพันธ์กับเอกสารอื่น

- [Release Plan](../02-plan/release-plan.md) — แผน phase ที่ task เหล่านี้สังกัดอยู่
- [Product Backlog](../backlog.md) — แหล่งที่มาของ Feature ID/REQ ทุกตัว
- [Requirement — Daily YouTube Recommendation](../01-spec/20260823-02-daily-youtube-recommendation.md),
  [Requirement — Planner & Logging](../01-spec/20260823-03-planner-logging.md)
- [User Journeys](../../02-design/01-prototypes/user-journeys.md) — ลำดับ step ของแต่ละ feature
- [MVP Phase](phase-1-mvp-core-loop.md) — phase ก่อนหน้าที่ต้องเสร็จก่อน
