# Prototype v1 — smartFit_daily

รันครั้งแรก ยังไม่มี version folder อื่นมาก่อน สร้างขึ้นตาม skill `prototype-builder`
(`.claude/skills/prototype-builder/SKILL.md`)

## Scope

ครอบคลุมทั้ง 14 Feature ใน 4 Epic (ทุก feature ใน `backlog.md` ณ วันที่สร้าง 2026-08-27) รวม 12 หน้าจอ HTML
ดูสารบัญเต็มที่ [index.html](index.html)

| # | ไฟล์ | Feature ID | REQ |
|---|---|---|---|
| 01 | `01-onboarding-personal-info.html` | ONB-1 | REQ-01 |
| 02 | `02-onboarding-equipment.html` | ONB-2 | REQ-03 |
| 03 | `03-onboarding-goal-select.html` | ONB-3 | REQ-02 |
| 04 | `04-onboarding-goal-confirm.html` | ONB-3 | REQ-02 |
| 05 | `05-daily-dashboard.html` | REC-1, REC-3, PLN-2, PLN-4 | REQ-04, REQ-06, REQ-09, REQ-10 |
| 06 | `06-workout-session.html` | REC-2, REC-4 | REQ-05, REQ-07 |
| 07 | `07-workout-result.html` | REC-2, PLN-3 | REQ-05, REQ-10 |
| 08 | `08-weekly-planner.html` | PLN-1, PLN-2 | REQ-08, REQ-09 |
| 09 | `09-log-history.html` | PLN-3 | REQ-10 |
| 10 | `10-progress-insights.html` | INT-1 | REQ-11 |
| 11 | `11-device-integrations.html` | INT-2, INT-3 | REQ-12, REQ-13 |
| 12 | `12-device-pairing.html` | INT-2, INT-3 | REQ-12, REQ-13 |

หลาย feature ที่เป็น "state/action บนหน้าเดิม" ไม่ได้แยกเป็นไฟล์ใหม่ (สอดคล้องกับ user journey ที่ไม่ได้แยก
screen จริง): REC-3 (เปลี่ยนวิดีโอ) และ PLN-2/PLN-4 อยู่บนไฟล์ 05, PLN-2 (toggle) อยู่บน bottom sheet ของไฟล์ 08

## แหล่งข้อมูลที่อ้างอิง

- [backlog.md](../../../01-requirements/backlog.md) — Feature ID/Priority/REQ mapping
- [01-spec/](../../../01-requirements/01-spec/index.md) — Requirement ทั้ง 4 epic (REQ-01 – REQ-13)
- [user-journeys.md](../user-journeys.md) — ลำดับ step/diagram ต่อ feature
- [DESIGN.md](../DESIGN.md) — token/component ทั้งหมด
- [acceptance-criteria.md](../../../01-requirements/acceptance-criteria.md),
  [test-plan.md](../../../03-testing/01-test-plan/test-plan.md),
  [test-cases/](../../../03-testing/01-test-plan/test-cases/) — เพิ่มเข้ามาเป็นแหล่งอ้างอิงตั้งแต่การ audit
  รอบ 2026-08-28 (ดู "เปลี่ยนแปลงจาก audit" ด้านล่าง) หลังจากไม่มีให้อ้างอิงตอนสร้าง version นี้ครั้งแรก

## ข้อตกลงร่วมระหว่างทุกไฟล์

- CSS variables ชุดเดียวกันตรงตาม DESIGN.md 2.1–2.4 (คัดลอกซ้ำในทุกไฟล์เพื่อให้แต่ละไฟล์เปิดได้อิสระแบบ
  self-contained ไม่พึ่งไฟล์ CSS ร่วม)
- ฟอนต์ IBM Plex Sans Thai ผ่าน Google Fonts link + fallback stack ตาม DESIGN.md 2.2
- Bottom tab nav 4 tab (วันนี้/แผน/ความคืบหน้า/โปรไฟล์) ปรากฏเฉพาะหน้าหลัก 6 หน้า (05, 08, 09, 10, 11) —
  ไม่ปรากฏใน Onboarding (01–04, ใช้ progress dots แทนตาม DESIGN.md 4.1) และไม่ปรากฏในหน้า session/sub-flow
  ที่เป็น immersive หรือ modal-like (06, 07, 12 — ใช้ปุ่ม Ghost "ปิด"/"ย้อนกลับ" แทน)
- หน้า 09/10 (ทั้งคู่อยู่ใต้ tab "ความคืบหน้า") มี sub-tab เล็ก "ภาพรวม"/"ประวัติ" เชื่อมกัน — เป็นการตัดสินใจ
  ระหว่างสร้าง ไม่ได้ระบุไว้ชัดเจนใน user-journeys.md

## การตัดสินใจเรื่อง Screen ที่ถามผู้ใช้ก่อนสร้าง (ตามกติกา ask-user ของ skill)

ผู้ใช้ยืนยันทั้ง 3 ข้อก่อนเริ่มสร้างไฟล์:

1. **ONB-3**: แยกเป็น 2 หน้าจอ (เลือกเป้าหมาย → ยืนยันตัวเลข kcal ที่คำนวณแล้ว) แทนการรวมหน้าเดียว
2. **PLN-1 Day Detail**: ใช้ bottom sheet (overlay บนหน้า `08-weekly-planner.html`) แทน full screen แยก
3. **PLN-3 Log History**: สร้างเป็นหน้าจอจริง (`09-log-history.html`) แม้ user-journeys.md จะไม่ได้วาดไว้เป็น
   diagram ชัดเจน มีแค่ข้อความอ้างถึง "ดูย้อนหลัง"

## Content decisions ที่ agent แต่ละกลุ่มตัดสินใจเองระหว่างสร้าง (ไม่ได้ระบุไว้ชัดใน spec/journey ต้นทาง)

**Onboarding (01–04)**
- ตัวอย่าง TDEE/safety floor เป็นค่าสมมติ (TDEE 1,500 kcal, floor 1,200 kcal) เพื่อสาธิตกลไกเท่านั้น ไม่ใช่คำนวณจริง
- ฟิลด์เพศจำกัดแค่ หญิง/ชาย เพราะสูตร Mifflin-St Jeor มีแค่ 2 branch — ยังไม่ครอบคลุม non-binary (ควรเป็น
  open question เพิ่มใน spec)
- การเลือก "ไม่มีอุปกรณ์" ในหน้า 02 จะ deselect ตัวเลือกอื่นอัตโนมัติ (mutual exclusion) — journey ไม่ได้ระบุ
  กติกานี้ชัดเจน
- ใช้ `localStorage` ส่งค่าระหว่างหน้า onboarding (ไม่มี backend จริง)

**Core loop (05–07)**
- ตัวอย่างผลลัพธ์ REC-2 ใช้ตัวเลขสมมติ (620/589 kcal) ไม่ใช่คำนวณจากสูตร MET จริง
- เลือกวิดีโอตัวอย่างความเข้มข้น "สูง" เพื่อสาธิตลำดับวอร์มอัพ-คูลดาวน์ (REC-4) — วิดีโอเข้มข้นต่ำ/กลางจะไม่มี
  ขั้นตอนนี้ (ไม่ได้ทำตัวอย่างไว้)
- Label แหล่งที่มาแคลอรี่ ("จาก wearable" / "ประมาณจากสูตร MET") เป็น pattern ที่ประกอบขึ้นเอง เพราะ DESIGN.md
  ไม่มี component นี้ชื่อเฉพาะ
- Streak ตัวอย่างตั้งไว้ที่ 5 วัน (ไม่ใช่ 0) เพื่อสาธิตสถานะ active ของ Streak Badge

**Planner & History (08–09)**
- สัปดาห์ตัวอย่าง: จ. 24–อา. 30 ส.ค. 2569 (วันนี้ = พฤ. 27 ส.ค. ตรงกับวันที่สร้างจริง)
- **แก้ open question ของ PLN-1** (แก้ log วันที่ผ่านมาแล้วได้ไหม) โดยเลือกให้ Day Detail sheet เป็น read-only
  สำหรับวันที่ผ่านมาแล้วที่มี log อยู่ก่อน — เป็นทางเลือกของ mockup เท่านั้น **ยังไม่ใช่การตัดสินใจ product
  จริง** ควรถามผู้ใช้/ทีมยืนยันแล้วบันทึกใน spec ถ้าต้องการให้เป็นกติกาจริง
- ตัวเลือกประเภทกิจกรรมใน Day Detail (คาร์ดิโอ/เวทเทรนนิ่ง/HIIT/ปล่อยว่าง) อนุมานจาก filter ของ REC-1 ไม่มีอยู่
  ใน 01-spec โดยตรง
- หน้า Log History (09) เป็นการอนุมานว่ามีอยู่จริง — journey มีแค่ข้อความ "ดูย้อนหลัง" ไม่ได้วาด diagram

**Insights & Integrations (10–12)**
- ตัวเลขพยากรณ์ (วันที่, deficit rate, กราฟ) เป็นข้อมูลสมมติทั้งหมด ไม่มี logic คำนวณจริง
- ไอคอน empty state ของ INT-1 เลือกเป็น bar-chart line icon เอง (DESIGN.md ไม่ได้ระบุไอคอนเฉพาะ)
- หน้า Profile (11) เพิ่ม section "การตั้งค่า" ครอบ 2 ลิงก์แก้ไขข้อมูล — ไม่ได้ระบุชื่อ section นี้ไว้ตรง ๆ

## Open Questions ที่ตั้งใจ "ไม่ฟันธง" ในภาพ (คงไว้เป็น neutral/placeholder ตามกติกา ask-user)

- REC-1: ตัวเลข tolerance การจับคู่วิดีโอ-แคลอรี่
- REC-4: วอร์มอัพ/คูลดาวน์นับรวมเป้าหมายรายวันหรือไม่
- PLN-1: แก้ไข log ย้อนหลังของวันที่ผ่านมาแล้วได้จริงหรือไม่ (mockup เลือก "ไม่ได้" แต่ยังไม่ใช่มติ)
- INT-1: จำนวนวันขั้นต่ำก่อนเริ่มพยากรณ์ได้
- INT-2/INT-3: การ resolve ข้อมูลขัดแย้งเมื่อมีหลายแหล่ง (เช่น ชั่งน้ำหนักหลายครั้งต่อวัน, wearable กับ MET
  ต่างกันมาก)

จุดเหล่านี้ควรถูกหยิบไปตัดสินใจจริงผ่าน `01-spec/` (แล้วให้ `feature-list-journey` ปรับ `user-journeys.md`
ตาม) ก่อนจะ build เป็น production UI — ไม่ควรอ้างอิงพฤติกรรมที่ mockup แสดงไว้เป็นกติกาจริงโดยไม่ยืนยันก่อน

## เปลี่ยนแปลงจาก audit (Prototype Consistency Audit, 2026-08-27/28)

`prototype-builder` รัน full consistency audit ของ v1 ทั้ง 12 หน้าจอ เทียบกับทั้ง 7 ชั้น
(Requirement/NFR, Backlog, User Journey, Acceptance Criteria, Test Case, Test Plan, DESIGN.md) หลังจาก
`feature-list-journey` เพิ่ง resolve นิยาม "ปฏิทินรายสัปดาห์" ของ PLN-1 (fixed calendar week, ไม่ใช่
rolling 7-day-forward) และเพิ่ม NFR traceability เข้า `backlog.md`/`user-journeys.md` เมื่อ 2026-08-27
ผลตรวจ: ส่วนใหญ่สอดคล้องกันดี (ดูรายละเอียดเต็มใน log การ audit) พบ 5 จุดที่ต้องแก้ ทั้งหมดเป็น
prototype ล้าหลัง/บั๊กภายในของตัว prototype เอง — **ไม่มีจุดใดขัดแย้งกับเอกสารต้นทาง** จึงไม่ต้องเรียก
`feature-list-journey`/`test-suite-builder` ต่อรอบนี้ ผู้ใช้ยืนยันให้แก้ v1 ตรง ๆ (ไม่สร้าง v2) เพราะเป็น
การแก้เล็ก ๆ กับ version ที่ยังไม่ผ่าน review เป็นทางการ:

1. **`05-daily-dashboard.html`** — วันในสัปดาห์ของ "27 ส.ค." เขียนผิดเป็น "วันอังคาร" ทั้งที่ 27 ส.ค. 2569
   คือวันพฤหัสบดีตามสัปดาห์ตัวอย่างเดียวกับ `08-weekly-planner.html`/`09-log-history.html`/test case
   ทุกไฟล์ — แก้เป็น "วันพฤหัสบดี 27 ส.ค."
2. **`05-daily-dashboard.html`** — Streak Badge เดิมตั้งไว้ที่ "5 วัน" เป็นค่า placeholder อิสระ แต่
   dataset ของสัปดาห์เดียวกันใน `09-log-history.html` (ซึ่ง `TC-PLN-4-001` อ้างอิงเป็น canonical dataset
   แล้ว) คำนวณ streak ได้ = 3 วัน (พฤ 27 → พุธ 26 (Rest Day) → อังคาร 25 ต่อเนื่อง แล้วขาดที่จันทร์ 24) —
   แก้ Streak Badge เป็น "3 วัน" ให้ตรงกับ dataset เดียวกัน
3. **`08-weekly-planner.html`** — comment ต้นไฟล์และ caption ในชีทรายละเอียดวัน (`readonlyCaption`) ยังเขียน
   ว่ากติกา read-only ของวันที่ผ่านมาแล้ว "ยังไม่ยืนยัน"/"ยังเป็น mockup decision เท่านั้น" ทั้งที่ตอนนี้
   resolve เป็นทางการแล้วเมื่อ 2026-08-27 ใน
   [`01-spec/20260823-03-planner-logging.md`](../../../01-requirements/01-spec/20260823-03-planner-logging.md#ข้อสมมติฐานการตัดสินใจที่ยืนยันแล้ว)
   — แก้ comment/caption ให้สะท้อนว่าเป็น confirmed decision แล้ว (พฤติกรรมเดิมของ prototype ถูกต้องอยู่แล้ว
   ไม่ต้องแก้ logic ใด ๆ)
4. **`08-weekly-planner.html`** — วันจันทร์ 24 ส.ค. เดิมแสดงสถานะ "ครบเป้าหมาย" (เครื่องหมายถูกสีเขียว,
   กิจกรรม "คาร์ดิโอ 30 นาที") ซึ่งขัดแย้งกับ `09-log-history.html` ที่แสดงวันเดียวกันเป็น "ไม่ครบเป้าหมาย"
   (260 kcal, ไม่มีไอคอน) และขัดกับ test case `TC-PLN-2-004`/`TC-PLN-4-001` ที่ใช้ "จันทร์ 24 ส.ค. =
   ไม่ครบเป้าหมาย (260 kcal)" เป็น test data มาตรฐาน — แก้สถานะวันจันทร์ 24 เป็น `data-status="missed"`
   (ไม่มีไอคอน ตาม DESIGN.md 3.5) และปรับ logic ให้ยังถือว่าวันนี้เป็น read-only เหมือน "cheatrest" (เพราะมี
   log อยู่แล้ว ตาม decision ข้อ 3)
5. **`12-device-pairing.html`** — ปุ่ม stepper (+/−) ของฟอร์มกรอกน้ำหนักด้วยตนเอง (scale fallback) มีขนาด
   36×36px เล็กกว่าเกณฑ์ขั้นต่ำ 44×44px ที่กำหนดใน
   [DESIGN.md §4.3 Accessibility](../DESIGN.md) และไม่ตรงกับปุ่ม stepper แบบเดียวกันใน
   `01-onboarding-personal-info.html` ที่ใช้ 44×44px อยู่แล้ว — ขยายเป็น 44×44px ให้ตรงตาม DESIGN.md

## เปลี่ยนแปลงจาก audit (Prototype Consistency Audit, 2026-08-28 รอบที่ 2)

`prototype-builder` รัน full consistency audit ของ v1 ทั้ง 12 หน้าจอ เทียบกับทั้ง 7 ชั้นอีกครั้ง (Requirement/
NFR, Backlog, User Journey, **Acceptance Criteria, Test Case, Test Plan** — ครั้งแรกที่เทียบกับ 3 ชั้นนี้แบบ
เต็มรูปแบบ เพราะตอน audit รอบก่อน (2026-08-27/28) ยังไม่มีทั้ง 3 เอกสารนี้ — ตอนนี้มีแล้วจาก `test-suite-builder`
วันที่ 2026-08-27/28, DESIGN.md) หลังจากมีการ rename ไฟล์ `detailed-design/*.md`/`test-cases/*.md` แบบ mechanical
(เติมเลขนำหน้า 01-04 ให้ตรง Epic order, commit `eed7f67`) และรัน `technical-design-orchestrator` เต็มรูปแบบ
(commit `9d06211`) ผลตรวจ: ส่วนใหญ่ยังสอดคล้องกันดี (5 จุดที่แก้ไปในรอบ 2026-08-27/28 ก่อนหน้ายังคงถูกต้อง
ตรวจซ้ำแล้ว) พบ 4 จุดใหม่ ทั้งหมดเป็น **prototype ล้าหลัง** (เอกสารต้นทางเปลี่ยน/เพิ่มไปแล้ว prototype ยังไม่ตาม
ไม่ใช่ข้อขัดแย้ง) — ผู้ใช้ยืนยันให้แก้ v1 ตรง ๆ (ไม่สร้าง v2) เพราะยังเป็นการแก้ที่ไม่กระทบ layout เดิมมากและ
version นี้ยังไม่ผ่าน review เป็นทางการ:

1. **`04-onboarding-goal-confirm.html`** — ไม่มีช่องกรอก "น้ำหนักเป้าหมาย (target weight, kg)" เลย ทั้งที่
   [Onboarding spec § ข้อสมมติฐาน/การตัดสินใจที่ยืนยันแล้ว](../../../01-requirements/01-spec/20260823-01-onboarding-personalization.md#ข้อสมมติฐานการตัดสินใจที่ยืนยันแล้ว)
   (resolve เมื่อ 2026-08-28 — หลังจาก v1 ถูกสร้างครั้งแรก) กำหนดให้ต้องกรอกค่านี้: **บังคับ**เมื่อเลือกเป้าหมาย
   "ลดน้ำหนัก", **ไม่บังคับ**สำหรับเป้าหมายอื่น ค่านี้เป็นแหล่งที่มาจริงของ precondition "มีเป้าหมายน้ำหนัก" ที่
   INT-1 ใช้พยากรณ์ (ดู `test-cases/04-smart-integrations.md`'s persona ที่สมมติว่ามีค่านี้อยู่แล้วโดยไม่มี
   ที่มาในหน้าจอใดเลย) — เพิ่มช่อง stepper "น้ำหนักเป้าหมาย (กก.)" บนหน้านี้ (ไม่ใช่
   `03-onboarding-goal-select.html`) พร้อม label/hint ที่เปลี่ยนตามเป้าหมายที่เลือก (บังคับ/ไม่บังคับ) และ
   validate ก่อนปุ่ม "เริ่มใช้งาน" จะพาไปหน้าถัดไปได้ — บันทึกค่าไว้ที่ `localStorage` key
   `smartfit_onb_target_weight` เมื่อมีการกรอก (ตำแหน่งหน้าจอนี้เลือกผ่าน ask-user protocol แล้ว: option ที่
   เลือกคือรวมไว้ในหน้าสรุปสุดท้ายเพื่อไม่ให้กระทบโครงสร้าง 4 ขั้นตอน/4 progress dot เดิม)
2. **`08-weekly-planner.html`** — chip เลือกประเภทกิจกรรมในชีทรายละเอียดวัน (`.activity-options .chip`) สูง
   36px ต่ำกว่าเกณฑ์ขั้นต่ำ 44×44px ตาม [DESIGN.md §4.3](../DESIGN.md)/NFR-09 และไม่ตรงกับ chip แบบเดียวกันใน
   `02-onboarding-equipment.html` ที่ใช้ 44px อยู่แล้ว — ขยายเป็น `min-height:44px` ให้ตรงกัน
3. **`05-daily-dashboard.html`** (และ `README.md`/`index.html` แถวเดียวกัน) — header comment ระบุ Feature
   ID `PLN-4` แต่ REQ tag มีแค่ `REQ-04, REQ-06, REQ-09` ขาด `REQ-10` ทั้งที่ PLN-4 ผูกกับทั้ง REQ-09 **และ**
   REQ-10 ตาม [backlog.md § REQ Traceability Matrix](../../../01-requirements/backlog.md#req-traceability-matrix)
   — เพิ่ม `REQ-10` เข้าไปในทั้ง 3 ไฟล์
4. **`11-device-integrations.html`** — ส่วน "การตั้งค่า" มีลิงก์แก้ไขอุปกรณ์/ข้อมูลส่วนตัว แต่ไม่มีทางเข้าไป
   แก้ไขเป้าหมายหลัก/น้ำหนักเป้าหมายเลย ทั้งที่
   [AC-ONB-3-02](../../../01-requirements/acceptance-criteria.md#ac-onb-3-02--เปลี่ยนเป้าหมายหลักภายหลัง-คำนวณใหม่ทันที-req-02)/
   `TC-ONB-3-004` ระบุ flow ว่า "เปิดหน้าตั้งค่าเป้าหมายหลัก (**Settings** หรือหน้าเลือกเป้าหมาย)" — เพิ่มลิงก์
   "แก้ไขเป้าหมายหลัก / น้ำหนักเป้าหมาย" ไปยัง `03-onboarding-goal-select.html` (bundle มาพร้อมกับข้อ 1
   เพราะเป็นข้อมูลชุดเดียวกัน)

จุดที่ 5-6 ที่ audit นี้พบด้วยแต่ **ไม่ได้แก้ในไฟล์นี้** (เพราะเป็นไฟล์ที่ `prototype-builder` ไม่ได้เป็นเจ้าของ)
ถูกส่งต่อให้ `test-suite-builder` แก้แยกต่างหาก (เรียกคู่ขนานกัน ไม่ใช่ audit นี้เป็นคนแก้เอง):

- `acceptance-criteria.md` § Epic 1 (ONB-3) ยังไม่มี AC scenario สำหรับการกรอกน้ำหนักเป้าหมาย
  (บังคับ/ไม่บังคับตามเป้าหมายที่เลือก) — ตกหล่นเพราะ AC ไฟล์นี้เขียนก่อน decision ของ ONB-3 เรื่องนี้จะ resolve
- `test-cases/01-onboarding-personalization.md` ยังไม่มี test case สำหรับ validate ช่องน้ำหนักเป้าหมาย
  (บังคับเมื่อเลือก "ลดน้ำหนัก", ไม่บังคับเมื่อเลือกอื่น) ด้วยเหตุผลเดียวกัน
