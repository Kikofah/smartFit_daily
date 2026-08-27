---
name: pipeline-orchestrator
description: Run smartFit_daily's documentation pipeline continuously in one invocation - Requirement (01-spec) -> Backlog/Feature List -> User Journey -> Acceptance Criteria + Test Plan + Test Case - instead of the user having to invoke feature-list-journey and test-suite-builder separately for each stage. Takes a raw requirement description (new or a change to an existing one) and drives it end to end, pausing only when a stage's own ask-user protocol requires it. Does not touch Prototype (docs/02-design/01-prototypes/v*/) - that stays a separate, explicitly-requested step via prototype-builder. Use when asked to take a requirement all the way through backlog, user journey, acceptance criteria, test plan, and test cases in one go, or to run the full pipeline / all stages continuously.
---

# Pipeline Orchestrator

รวม 3 ขั้นตอนที่ปกติต้องรันแยกกัน ให้ทำงานต่อเนื่องในการเรียกครั้งเดียว โดยไม่ต้องให้ผู้ใช้เรียก skill ทีละตัว:

1. **Requirement** (`docs/01-requirements/01-spec/*.md`) — เขียน/อัปเดตเอกสาร requirement จาก raw input
   ของผู้ใช้ ตาม "Requirement workflow" ใน `CLAUDE.md`
2. **Backlog / Feature List / User Journey** — ตาม methodology เต็มของ skill `feature-list-journey`
   (`.claude/skills/feature-list-journey/SKILL.md`)
3. **Acceptance Criteria + Test Plan + Test Case** — ตาม methodology เต็มของ skill `test-suite-builder`
   (`.claude/skills/test-suite-builder/SKILL.md`)

**ไม่รวม Prototype** (`docs/02-design/01-prototypes/v*/`) — ถ้าผู้ใช้ต้องการ mockup จริงด้วย ให้แนะนำเรียก
`prototype-builder` แยกต่างหากหลัง pipeline นี้เสร็จ ไม่ใช่รันอัตโนมัติเป็นส่วนหนึ่งของ pipeline นี้ (ผู้ใช้ไม่ได้
ระบุ Prototype ไว้ใน scope ของ orchestrator นี้)

**สำคัญ**: skill นี้เป็นแค่ "ตัวเรียงลำดับ" — ไม่มีกติกาการเขียนเอกสารเป็นของตัวเอง กติกาจริงทั้งหมดอยู่ใน
`CLAUDE.md` (Requirement workflow) และเอกสาร skill ทั้งสองข้างบน อ่านของจริงจากที่นั่นทุกครั้งที่รัน ห้าม
จำ/เดารูปแบบจากความจำ เผื่อเอกสารเหล่านั้นถูกแก้ไขไปแล้วหลังจากที่ skill นี้ถูกเขียน

## Input

รับ raw requirement description จากผู้ใช้ (ภาษาพูดปกติ อาจเป็นภาษาไทย) หรือการอ้างอิงถึง requirement ที่มี
อยู่แล้วที่ต้องการปรับ ถ้าข้อความมีมากกว่า 1 requirement ที่แยกจากกันจริง ๆ ให้แยกเป็นหลาย item แล้วรัน agent
`pipeline-runner` ทีละ item ตามลำดับ (**ไม่รันพร้อมกัน** เพื่อไม่ให้ RUNNING_NO ของ `01-spec/` หรือ Feature ID
ชนกันระหว่าง item)

## ขั้นตอนการทำงาน

1. ระบุ requirement (หรือหลาย requirement) จากคำขอของผู้ใช้/บทสนทนา ถ้าไม่มีอะไรให้ทำงานด้วยเลย ให้ถามผู้ใช้
   ว่าต้องการให้ pipeline นี้ทำงานกับ requirement อะไร
2. ยืนยันว่ากำลังทำงานในโปรเจกต์ smartFit_daily (มี `docs/01-requirements/01-spec/` อยู่จริง) ก่อนเริ่ม
3. รัน agent `pipeline-runner` (`.claude/agents/pipeline-runner.md`) หนึ่งตัวต่อหนึ่ง requirement ให้ทำครบ
   ทั้ง 3 stage ก่อนเริ่ม item ถัดไป — แต่ละ stage หยุดถามผู้ใช้ได้ตามกติกาเดิมของมันเอง (ดูด้านล่าง)
4. หลังทุก item เสร็จ (หรือหยุดกลางทางเพราะรอคำตอบผู้ใช้) สรุปผลรวมกลับให้ผู้ใช้ ตาม "Output" ด้านล่าง

## กติกาการถามผู้ใช้ — สืบทอดจากทุก stage ไม่ใช่กติกาใหม่หรือถูกตัดออก

Pipeline นี้ไม่ได้ลด/ข้ามกติกา "ถามผู้ใช้ก่อนเสมอ" ของแต่ละ stage เมื่อ stage ไหนต้องหยุดถาม (เช่น
Requirement ใหม่มีความคลุมเครือ, `feature-list-journey` เจอข้อขัดแย้งระหว่างชั้น, `test-suite-builder`
ต้อง bootstrap เอกสาร NFR) ให้หยุดถามตรงนั้นจริง ๆ ตามรูปแบบของ stage นั้น (อย่างน้อย 3 แนวทาง + เหตุผล/
ข้อดี/ข้อเสีย + คำแนะนำ 1 แนวทาง) แล้วรอคำตอบก่อนไปต่อ — สิ่งที่ pipeline นี้ตัดออกคือ**การที่ผู้ใช้ต้องพิมพ์
เรียก skill เองทีละขั้นตอน** ไม่ใช่การตัดขั้นตอนตรวจสอบ/ถามที่มีอยู่เดิมของแต่ละ stage

## Output & การบันทึก log

หลังจบทุก item (หรือหยุดกลางทางเพราะรอคำตอบผู้ใช้) ให้:

1. สรุปกลับเป็นรายงานเดียวครอบคลุมทั้ง pipeline ต่อ requirement: ไฟล์ requirement ที่สร้าง/แก้,
   backlog.md/user-journeys.md ที่อัปเดต, acceptance-criteria.md/test-plan.md/test-cases/*.md ที่อัปเดต,
   คำถามที่ถามผู้ใช้และคำตอบที่ได้ (ถ้ามี), gap/Open Point ที่เหลืออยู่
2. เขียน entry เดียวใน `docs/05-log/{YYYYMMDD}-log.md` (สร้างถ้ายังไม่มีสำหรับวันนั้น, append ถ้ามีแล้ว)
   สรุปทั้ง pipeline run นี้ในครั้งเดียว — ไม่ใช่แยก log ทีละ stage

## เรียกใช้เมื่อไหร่

- ผู้ใช้อธิบาย requirement/feature ใหม่ และต้องการผลลัพธ์ครบทั้ง backlog + user journey + acceptance
  criteria + test plan + test case ในการเรียกครั้งเดียว โดยไม่ต้องบอกให้รันแต่ละ skill เอง
- ผู้ใช้ขอปรับ requirement ที่มีอยู่แล้ว และต้องการให้ผลกระทบ (backlog/journey/AC/test) ถูกอัปเดตให้ครบใน
  การเรียกครั้งเดียว
- ผู้ใช้ขอ "รัน pipeline ทั้งหมด" หรือ "ทำให้ครบทุกขั้นตอนต่อเนื่องกัน" ตรง ๆ

ถ้าผู้ใช้ต้องการแค่ stage เดียว (เช่น "แค่อัปเดต backlog พอ" หรือ "แค่ตรวจ Prototype") ให้ใช้ skill เดี่ยวที่
เกี่ยวข้องแทน (`feature-list-journey`, `test-suite-builder`, หรือ `prototype-builder`) ไม่ต้องใช้ orchestrator
นี้ — orchestrator นี้เหมาะกับกรณีที่ต้องการให้ผลกระทบไหลผ่านทุก stage จริง ๆ ในครั้งเดียว
