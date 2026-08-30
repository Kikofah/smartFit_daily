# Task Breakdown — MVP Phase

- **ประเภทเอกสาร:** Task Breakdown
- **สถานะเอกสาร:** Draft
- **วันที่สร้าง:** 2026-08-28
- **อัปเดตล่าสุด:** 2026-08-31 — แก้คำอธิบาย `TASK-REC-1` ให้ตรงกับ implementation จริง: ตัดส่วน "ขยายเกณฑ์
  ค้นหาถ้าไม่พบ" ออก (ไม่มีจริง) เปลี่ยนเป็นค้นหาครั้งเดียวแล้วให้ขั้นตอน AI เลือกวิดีโอที่ดีที่สุดจากผลที่พบ
  ตามที่แก้ไขแล้วใน `detailed-design/02-daily-youtube-recommendation.md`, `api-spec.md`,
  `high-level-architecture.md`, `tech-stack.md`, `backlog.md`, `user-journeys.md` — ไม่ reset Status ของ
  task เดิม (ยังไม่เริ่มเหมือนเดิม)
- **อัปเดตก่อนหน้า:** 2026-08-29 — เพิ่ม `TASK-ONB-0` (Authentication — REQ-14–17) ตามที่ `backlog.md` เพิ่ม
  Feature ID ใหม่ ONB-0 เข้า MVP Phase, แก้ไข stale reference "Supabase" → "Firebase" ใน `TASK-INFRA-01`
  ให้ตรงกับ `tech-stack.md` ฉบับปัจจุบัน — ไม่ reset Status ของ task เดิมที่มีอยู่แล้ว (ทั้งหมดยัง "ยังไม่
  เริ่ม" เหมือนเดิม)
- **สร้างโดย:** skill `plan-task-builder`
- **อ้างอิงจาก:** [Release Plan](../02-plan/release-plan.md), [Product Backlog](../backlog.md)

## 1. ขอบเขตของ Phase นี้

Core loop รายวันใช้งานได้ครบวงจร: สมัครสมาชิก/เข้าสู่ระบบ (Authentication) → onboarding คำนวณเป้าหมาย
แคลอรี่ → แนะนำ/บันทึกการออกกำลังกาย → วางแผนรายสัปดาห์ + Cheat/Rest Day → บันทึกผล all-or-nothing —
Feature ID: ONB-0, ONB-1, ONB-2, ONB-3, REC-1, REC-2, PLN-1, PLN-2, PLN-3 (ทั้งหมด MoSCoW = Must)
รายละเอียดเต็มดู [Release Plan §3.1](../02-plan/release-plan.md#31-mvp-phase)

## 2. Task List

| Task ID | ชื่อ Task | Feature ID/REQ | Status | คำอธิบาย | References |
|---|---|---|---|---|---|
| TASK-INFRA-01 | ติดตั้ง backend/ระบบบัญชีผู้ใช้จริง | (Infrastructure — ไม่มี Feature ID) | ยังไม่เริ่ม | Provision Firebase project จริง (Authentication + Firestore + Security Rules — เปลี่ยนจาก Supabase เดิมตาม `tech-stack.md` ฉบับ 2026-08-29) ตาม [tech-stack.md](../../02-design/02-technical/tech-stack.md) — ทำให้ NFR-04/NFR-06/NFR-08/NFR-11 ตรวจสอบได้จริง (ปัจจุบัน mark "not testable in this round" ใน test-plan.md เพราะยังไม่มี backend จริง) — เป็น prerequisite ของ `TASK-ONB-0` (ต้อง provision Firebase Auth ก่อนจึง implement business logic ของ ONB-0 ได้) | NFR-04, NFR-06, NFR-08, NFR-11, [tech-stack.md §7](../../02-design/02-technical/tech-stack.md#7-จุดที่ยังไม่ได้ตัดสินใจ--ควรยืนยันเพิ่มเติม) (Firebase project region ยังไม่เลือก) |
| TASK-ONB-0 | สมัครสมาชิก / เข้าสู่ระบบ / ลืมรหัสผ่าน / ออกจากระบบ (Authentication) | ONB-0 / REQ-14, REQ-15, REQ-16, REQ-17 | ยังไม่เริ่ม | Implement สมัครสมาชิก 3 วิธี (email/password, Google OAuth, Sign in with Apple) สร้าง `userId` ก่อนเข้าสู่ ONB-1 เสมอ, เข้าสู่ระบบด้วยวิธีเดียวกับที่สมัครพร้อม session persistence, รีเซ็ตรหัสผ่านผ่านอีเมล (เฉพาะบัญชี email/password), และออกจากระบบล้าง session ทันที — ขึ้นกับ `TASK-INFRA-01` เสร็จก่อน | AC-ONB-0-01–06, [detailed-design/01-onboarding-personalization.md § ONB-0](../../02-design/02-technical/detailed-design/01-onboarding-personalization.md) |
| TASK-ONB-1 | กรอกข้อมูลส่วนตัวเพื่อคำนวณเป้าหมายแคลอรี่ | ONB-1 / REQ-01 | ยังไม่เริ่ม | รับอายุ เพศ น้ำหนัก ส่วนสูง ระดับกิจกรรม คำนวณ BMR/TDEE ด้วยสูตร Mifflin-St Jeor (Precondition: ผ่าน ONB-0 แล้ว — มีบัญชีผู้ใช้จริง) | AC-ONB-1-01–03, [detailed-design/01-onboarding-personalization.md](../../02-design/02-technical/detailed-design/01-onboarding-personalization.md) |
| TASK-ONB-2 | เลือกอุปกรณ์ที่มี | ONB-2 / REQ-03 | ยังไม่เริ่ม | เลือกอุปกรณ์ (ไม่มี/ดัมเบล/ยิมครบชุด แบบ multi-select) บันทึกเป็น filter ของวิดีโอ | AC-ONB-2-01–03 |
| TASK-ONB-3 | ตั้งเป้าหมายหลัก (deficit/surplus + safety floor) | ONB-3 / REQ-02 | ยังไม่เริ่ม | เลือกประเภทเป้าหมาย แปลงเป็นเป้าหมายแคลอรี่รายวัน ปรับตาม safety floor 1,200–1,500 kcal | AC-ONB-3-01–03, [detailed-design/01-onboarding-personalization.md](../../02-design/02-technical/detailed-design/01-onboarding-personalization.md) |
| TASK-REC-1 | แนะนำวิดีโอตรงเป้าแคลอรี่รายวัน | REC-1 / REQ-04 | ยังไม่เริ่ม | จับคู่วิดีโอตามเป้าหมายแคลอรี่ + filter อุปกรณ์ (ค้นหาครั้งเดียว ให้ขั้นตอน AI ประเมิน/เลือกวิดีโอที่ดีที่สุดจากที่พบ ไม่มีการขยายเกณฑ์ค้นหาซ้ำ) | AC-REC-1-01–03, [detailed-design/02-daily-youtube-recommendation.md](../../02-design/02-technical/detailed-design/02-daily-youtube-recommendation.md) |
| TASK-REC-2 | คำนวณแคลอรี่เผาผลาญจริง (สูตร MET) | REC-2 / REQ-05 | ยังไม่เริ่ม | คำนวณ kcal = MET × น้ำหนักตัว × เวลาจริง หลังจบ/หยุดเซสชัน | AC-REC-2-01–03, [detailed-design/02-daily-youtube-recommendation.md](../../02-design/02-technical/detailed-design/02-daily-youtube-recommendation.md) |
| TASK-PLN-1 | ปฏิทินวางแผนรายสัปดาห์ | PLN-1 / REQ-08 | ยังไม่เริ่ม | ปฏิทิน fixed calendar week (จ.-อา.) กำหนดกิจกรรมล่วงหน้า วันในอดีตที่มี log เป็น read-only | AC-PLN-1-01–03, [detailed-design/03-planner-logging.md](../../02-design/02-technical/detailed-design/03-planner-logging.md) |
| TASK-PLN-2 | โหมด Cheat Day / Rest Day | PLN-2 / REQ-09 | ยังไม่เริ่ม | ตั้ง Cheat/Rest Day มาร์ก "ครบเป้าหมาย" — ทับ log เดิมได้เฉพาะวันนี้เท่านั้น | AC-PLN-2-01–04, [detailed-design/03-planner-logging.md](../../02-design/02-technical/detailed-design/03-planner-logging.md) |
| TASK-PLN-3 | บันทึกผลรายวัน (all-or-nothing) | PLN-3 / REQ-10 | ยังไม่เริ่ม | เทียบแคลอรี่ที่เผาผลาญจริงกับเป้าหมาย ≥100% เท่านั้นถือว่าครบ ไม่มี partial credit | AC-PLN-3-01–03, [detailed-design/03-planner-logging.md](../../02-design/02-technical/detailed-design/03-planner-logging.md) |

## 3. จุดที่ยังไม่ได้ระบุ / ควรยืนยันเพิ่มเติม

- ลำดับการพัฒนาที่แน่นอนภายใน phase (ขนานหรือเรียงตาม dependency เป๊ะๆ) ยังไม่ฟันธง — ขึ้นกับทรัพยากรทีม
  พัฒนาจริงที่ยังไม่มี ณ ตอนนี้ (ดู [Release Plan §5](../02-plan/release-plan.md#5-จุดที่ยังไม่ได้ระบุ--ควรยืนยันเพิ่มเติม))
- จุดที่ยังไม่ได้ระบุเดิมของแต่ละ feature (เช่น REC-1 tolerance, Activity Factor ต่อระดับ, safety floor
  ตัวเลขแน่นอน, **TASK-ONB-0**: email verification ก่อนใช้งานจริงหรือไม่, password policy, session
  timeout ที่แน่นอน, ขอบเขต NFR-05 ต่อผู้ให้บริการยืนยันตัวตนภายนอก) ยังไม่ resolve ใน `01-spec/` — ไม่กระทบ
  การมีอยู่ของ task นี้ แต่กระทบรายละเอียดตอน implement
- **TASK-INFRA-01**: `tech-stack.md` § 7 ยังไม่เลือก Firebase project region ที่แน่นอน — ควรยืนยันก่อนเริ่ม
  provision จริง (เป็น open point เดิมของ `tech-stack.md` ไม่ใช่ของไฟล์นี้)

## 4. ความสัมพันธ์กับเอกสารอื่น

- [Release Plan](../02-plan/release-plan.md) — แผน phase ที่ task เหล่านี้สังกัดอยู่
- [Product Backlog](../backlog.md) — แหล่งที่มาของ Feature ID/REQ ทุกตัว
- [Requirement — Onboarding & Personalization](../01-spec/20260823-01-onboarding-personalization.md),
  [Requirement — Daily YouTube Recommendation](../01-spec/20260823-02-daily-youtube-recommendation.md),
  [Requirement — Planner & Logging](../01-spec/20260823-03-planner-logging.md)
- [User Journeys](../../02-design/01-prototypes/user-journeys.md) — ลำดับ step ของแต่ละ feature
- [Non-Functional Requirements](../01-spec/20260827-05-non-functional-requirements.md),
  [Tech Stack](../../02-design/02-technical/tech-stack.md) — ที่มาของ `TASK-INFRA-01`
