---
name: test-suite-builder
description: Build or update Acceptance Criteria (Given-When-Then per backlog item), the project-wide Test Plan, and step-by-step Test Cases for smartFit_daily, from Requirement (01-spec), Product Backlog/Feature List (backlog.md), User Journey (user-journeys.md), and prototypes (02-design/01-prototypes/v*/) when they exist. Defaults to full backlog coverage but accepts a narrower scope (a Feature ID, an Epic, or just one of the three outputs). Use when asked to create/update acceptance criteria, a test plan, or test cases for smartFit_daily.
---

# Test Suite Builder

สร้าง/อัปเดตเอกสารทดสอบ 3 ชิ้นของ smartFit_daily โดยถือว่า **Requirement (`01-spec/`), Backlog/Feature
List (`backlog.md`), User Journey (`user-journeys.md`) เป็น upstream source ที่อ่านอย่างเดียว (read-only)**
— skill นี้ไม่มีหน้าที่ reconcile ความไม่สอดคล้องของ 3 ชั้นนั้น (เป็นหน้าที่ของ skill `feature-list-journey`)
ถ้าพบว่า 3 ชั้นนั้นไม่สอดคล้องกันเอง ให้แจ้งผู้ใช้ให้รัน `feature-list-journey` ก่อน แล้วค่อยกลับมาทำต่อ

## เอกสารที่ skill นี้ดูแล

1. **Acceptance Criteria** — `docs/01-requirements/acceptance-criteria.md` — Given-When-Then ต่อ
   Backlog Item (Feature ID) รับข้อมูลจาก `backlog.md` + เอกสาร spec ที่เกี่ยวข้องใน `01-spec/` + prototype
   ที่เกี่ยวข้องถ้ามี (`docs/02-design/01-prototypes/v*/`)
2. **Test Plan** — `docs/03-testing/01-test-plan/test-plan.md` — ไฟล์เดียวสำหรับทั้งโปรเจกต์: scope,
   ประเภทการทดสอบ, environment, risk management, entry/exit criteria รับข้อมูลจาก `backlog.md` รวมถึง
   Non-Functional Requirement (ดู "NFR bootstrap" ด้านล่าง) และข้อมูลอื่นที่เกี่ยวข้อง (เช่น `CLAUDE.md`
   Project status)
3. **Test Case** — `docs/03-testing/01-test-plan/test-cases/{epic-slug}.md` — **หนึ่งไฟล์ต่อ epic**
   (slug ตรงกับไฟล์ `01-spec/` ของ epic นั้นเป๊ะ ๆ: `onboarding-personalization`,
   `daily-youtube-recommendation`, `planner-logging`, `smart-integrations`) แบบ step-by-step ต่อ
   Feature ID ภายใน epic นั้น รับข้อมูลจาก `acceptance-criteria.md` + `backlog.md` + `user-journeys.md`
   (+ prototype ถ้ามี)

## Scope: ทั้งหมดโดย default แต่ระบุเจาะจงได้

- ถ้าไม่ได้ระบุมา ให้ครอบคลุมทุก Feature ID ในทุก epic ตาม `backlog.md` และสร้างทั้ง 3 เอกสาร
- ถ้าผู้ใช้ระบุเจาะจง (Feature ID เดียว, epic เดียว, หรือแค่เอกสารใดเอกสารหนึ่งจาก 3 ชนิด) ให้จำกัด scope
  ตามนั้น แต่ยังต้องอ่าน upstream ทั้งหมดที่จำเป็นสำหรับ scope นั้นให้ครบ ไม่ตัดข้อมูลเพื่อความเร็ว

## กติกาการแก้ไข upstream (ข้อยกเว้นที่อนุญาตเท่านั้น)

Skill นี้**ห้ามแก้ไข** `01-spec/*.md` ที่มีอยู่แล้ว, `backlog.md`, หรือ `user-journeys.md` ยกเว้น 2 กรณีนี้:

1. เพิ่มลิงก์ 1 บรรทัดใน section "## Acceptance Criteria" (checklist เดิม) ของแต่ละ `01-spec/*.md`
   ที่เกี่ยวข้อง ให้ชี้ไปยัง `acceptance-criteria.md` ของ epic นั้น (เก็บ checklist เดิมไว้เป็นสรุปย่อ
   ไม่ลบ ตาม convention ของโปรเจกต์นี้)
2. สร้างเอกสาร requirement **ใหม่** สำหรับ Non-Functional Requirement ใน `01-spec/` เมื่อยังไม่มี
   (ดู "NFR bootstrap" ด้านล่าง) — เป็นการสร้างไฟล์ใหม่ ไม่ใช่แก้ไฟล์เดิม

ถ้าตรวจพบว่า Requirement/Backlog/User Journey ไม่สอดคล้องกันเอง (เช่น REQ ที่อ้างไม่มีจริง, Feature ID
ไม่ตรงกันระหว่าง `backlog.md` กับ `user-journeys.md`) **ห้ามพยายามแก้ไขปัญหานั้นเอง** ให้หยุดแล้วแจ้งผู้ใช้
ว่าควรรัน skill `feature-list-journey` ให้เอกสารทั้ง 3 สอดคล้องกันก่อน

## 1. Acceptance Criteria (`docs/01-requirements/acceptance-criteria.md`)

- จัดกลุ่มตาม Epic แล้วตาม Feature ID ภายใน (โครงสร้างเดียวกับ `backlog.md`)
- ต่อ Feature ID: เขียนอย่างน้อย 1 scenario สำหรับ happy path (จาก Success State ใน `user-journeys.md`)
  และ 1 scenario ต่อ Alt/Edge Case ที่มีอยู่แล้วใน `user-journeys.md` ของ feature นั้น — **ห้ามคิด edge
  case ใหม่ที่ไม่มีอยู่ใน upstream เลย** ถ้าเจอ behavior ที่ควรมี test แต่ upstream ไม่ได้ระบุไว้ ให้บันทึกไว้
  เป็น gap (ดู "รายงานผล" ด้านล่าง) แทนการเดา
- รูปแบบ: **Given-When-Then** ต่อ scenario เช่น
  ```
  ### AC-ONB-1-01 — กรอกข้อมูลครบและถูกต้อง (REQ-01)
  - **Given**: ผู้ใช้ใหม่อยู่ที่ขั้นตอน onboarding ยังไม่มี TDEE ในโปรไฟล์
  - **When**: ผู้ใช้กรอกอายุ เพศ น้ำหนัก ส่วนสูง และเลือกระดับกิจกรรมครบถ้วนถูกต้อง แล้วกดถัดไป
  - **Then**: ระบบคำนวณ BMR/TDEE และบันทึกลงโปรไฟล์ แล้วพาไปขั้นตอน ONB-2
  ```
- Scenario ID: `AC-{FeatureID}-{เลข 2 หลัก}` เช่น `AC-ONB-1-01`, `AC-ONB-1-02`
- ทุก scenario ต้องอ้างอิง Feature ID, REQ-xx ที่เกี่ยวข้อง และลิงก์ไป prototype screen ที่ตรงกัน (ถ้ามี
  ใน `docs/02-design/01-prototypes/v*/`)
- ต้องลิงก์กลับไปยัง `backlog.md` และเอกสาร `01-spec/` ของ epic นั้น

## 2. Test Plan (`docs/03-testing/01-test-plan/test-plan.md`)

ไฟล์เดียวสำหรับทั้งโปรเจกต์ (ไม่แยกต่อ epic/feature) ต้องมีอย่างน้อย:

- **Scope**: ทดสอบ feature ไหนบ้าง (อ้างจาก MoSCoW ใน `backlog.md` — ระบุว่า Could/Won't ที่ยังไม่ implement
  ไม่อยู่ใน scope ของรอบทดสอบนี้)
- **ประเภทการทดสอบ**: เลือกที่เกี่ยวข้องจริงกับแอปนี้ (เช่น functional, integration กับ YouTube API/wearable,
  usability สำหรับ onboarding, regression รอบ release)
- **Test Environment**: อุปกรณ์/OS ที่ต้อง cover, ความต้องการ mock/test data สำหรับ dependency ภายนอก
  (YouTube API, Health API/wearable, ตาชั่งอัจฉริยะ)
- **Risk Management**: ความเสี่ยงหลัก × โอกาสเกิด/ผลกระทบ × วิธีลดความเสี่ยง (จุดที่ดีที่จะดึงมาคือ Open
  Points ที่มีอยู่แล้วใน `01-spec/*.md` เช่น ความคลาดเคลื่อนของสูตร MET, ข้อมูลชนกันจากหลาย wearable)
- **Entry/Exit Criteria**: เงื่อนไขที่พร้อมเริ่มทดสอบ และเงื่อนไขที่ถือว่าทดสอบผ่าน/พอแล้ว

### NFR bootstrap (บังคับก่อนเขียนส่วนที่ต้องใช้ Non-Functional Requirement)

`test-plan.md` ต้องใช้ Non-Functional Requirement (performance, security, availability, ฯลฯ) แต่
ปัจจุบันโปรเจกต์นี้ยังไม่มีเอกสาร NFR ใน `01-spec/` เลย:

- **ถ้ายังไม่มีเอกสาร NFR**: ห้ามเดา/แต่ง NFR เอาเอง ให้หยุดแล้วถามผู้ใช้ (ใช้ AskUserQuestion) โดยเสนอ
  แนวทางการนิยาม NFR อย่างน้อย 3 แนวทาง พร้อมข้อดี/ข้อเสีย เช่น:
  - เน้น performance/availability (เช่น เวลาโหลดหน้าจอ, uptime ของการ sync wearable) — เหมาะถ้ากังวลเรื่อง
    experience ของแอปที่ใช้ทุกวัน แต่อาจมองข้าม risk เรื่องข้อมูลสุขภาพ
  - เน้น security/privacy (เช่น การเก็บข้อมูลสุขภาพ/น้ำหนัก, การเชื่อม Health API) — เหมาะเพราะแอปนี้จัดการ
    ข้อมูลสุขภาพส่วนบุคคล แต่ถ้าเน้นแต่เรื่องนี้อาจไม่ครอบคลุม experience
  - นิยามแบบสมดุลครอบคลุมทั้งสองด้าน (performance + security + reliability) — ครอบคลุมกว่าแต่ใช้เวลา
    ตอบคำถามมากกว่า
  - **แนะนำ**: แบบสมดุล เพราะแอปนี้ทั้งใช้ทุกวัน (ต้อง responsive) และเก็บข้อมูลสุขภาพ (ต้อง secure) พร้อมกัน
  - เมื่อผู้ใช้ตอบแล้ว ให้สร้างเอกสารใหม่ `docs/01-requirements/01-spec/{YYYYMMDD}-{RUNNING_NO}-non-functional-requirements.md`
    ตาม template เดียวกับ 4 ไฟล์ spec ที่มีอยู่ (Scope, รายละเอียด, เงื่อนไข/กติกาทางธุรกิจ เป็น NFR-xx,
    Acceptance Criteria, ข้อสมมติฐาน/การตัดสินใจที่ยืนยันแล้ว, จุดที่ยังไม่ได้ระบุ) — `RUNNING_NO` ต่อจาก
    เลขล่าสุดที่มีอยู่ใน `01-spec/` (ปัจจุบันคือ 05)
  - ถ้าคำตอบยังคลุมเครือเกินกว่าจะเขียน NFR-xx ที่เป็นรูปธรรมได้ ให้ถามต่อด้วยกติกา "ถามผู้ใช้ก่อนเสมอ"
    ด้านล่างจนกว่าจะเพียงพอ
- **ถ้ามีเอกสาร NFR อยู่แล้ว**: อ่านทั้งไฟล์แล้ว derive ส่วนที่เกี่ยวข้องของ Test Plan จากมัน ห้ามเขียน
  ตัวเลข/เกณฑ์ NFR ใหม่ตรงใน `test-plan.md` เอง

ต้องลิงก์กลับไปยัง `backlog.md` และเอกสาร NFR spec doc

## 3. Test Case (`docs/03-testing/01-test-plan/test-cases/{epic-slug}.md`)

- หนึ่งไฟล์ต่อ epic (4 ไฟล์: `onboarding-personalization.md`, `daily-youtube-recommendation.md`,
  `planner-logging.md`, `smart-integrations.md`) จัดกลุ่มภายในไฟล์ตาม Feature ID
- แต่ละ test case ต้องมีอย่างน้อยฟิลด์เหล่านี้ (เป็นตารางหรือ block ก็ได้ แต่ต้องมีครบ):

  | ฟิลด์ | คำอธิบาย |
  |---|---|
  | Test ID | `TC-{FeatureID}-{เลข 3 หลัก}` เช่น `TC-ONB-1-001` |
  | Test Case Name | ชื่อสั้นบอกว่าทดสอบอะไร |
  | Pre-condition | สถานะก่อนเริ่มทดสอบ |
  | Test Steps | ลำดับขั้นตอนแบบ step-by-step (เลขลำดับ) |
  | Expected Result | ผลลัพธ์ที่ควรได้ต่อ step หรือรวมท้าย |
  | Test Data | ค่าข้อมูลตัวอย่างที่ใช้ทดสอบจริง (ไม่ใช่ placeholder ลอย ๆ) |
  | References | REQ-xx, AC ID (`AC-{FeatureID}-xx`), และลิงก์ไปยัง section ที่เกี่ยวข้องใน `user-journeys.md` |

- ทุก AC scenario ของ feature นั้นต้องมี test case ครอบคลุมอย่างน้อย 1 รายการ (1 AC อาจต้องมีหลาย test
  case ถ้ามีหลาย test data variation — ถ้าเกิดกรณีนี้ให้ระบุไว้ชัดในคอลัมน์ References)
- ต้องลิงก์กลับไปยัง `acceptance-criteria.md`, `backlog.md`, `user-journeys.md` และ prototype (ถ้าใช้)

## กติกาเมื่อไม่แน่ใจหรือข้อมูลไม่พอ — ต้องถามผู้ใช้ก่อนเสมอ

ใช้รูปแบบเดียวกับ skill อื่นในโปรเจกต์นี้ทุกครั้งที่เจอความไม่ชัดเจน (NFR bootstrap, edge case ที่ upstream
ไม่ได้ระบุ, test data ที่ไม่มีตัวอย่างจริงให้ใช้, ฯลฯ):

1. ระบุคำถามให้ชัดเจนว่าไม่แน่ใจเรื่องอะไร กระทบเอกสาร/feature ไหน
2. เสนอ **อย่างน้อย 3 แนวทาง** ที่เป็นไปได้
3. อธิบาย **เหตุผล ข้อดี ข้อเสีย** ของแต่ละแนวทาง
4. **แนะนำแนวทางที่ดีที่สุด 1 แนวทาง พร้อมเหตุผลที่แนะนำ**
5. รอคำตอบก่อนเขียนส่วนที่เกี่ยวข้องจริง — ห้ามเดาแล้วเขียนไปก่อน

## Output & รายงานผล

ก่อนหยุดงาน ให้สรุปกลับ:

- scope ที่ทำจริง (feature/epic ไหนบ้าง, สร้างเอกสารไหนบ้างจาก 3 ชนิด)
- ไฟล์ที่สร้าง/แก้ไข ทั้งหมด (รวมลิงก์ที่เพิ่มเข้า `01-spec/*.md` เดิม และ NFR spec doc ใหม่ถ้ามี)
- gap ที่พบ (เช่น edge case ที่ upstream ไม่ได้ระบุ จึงยังไม่มี AC/test case ให้) แทนที่จะเงียบไป
- คำถามใดที่ยังรอผู้ใช้ตัดสินใจอยู่บ้าง
