---
name: technical-design-orchestrator
description: Run smartFit_daily's technical-design pipeline continuously in one invocation - High Level Architecture -> API Spec & Database Schema -> Detailed Design -> Non-Functional Requirements Review - instead of the user having to invoke architecture-builder, api-db-spec-builder, and detailed-design-builder separately and then manually check whether the NFR doc needs updating afterward. Defaults to covering the entire backlog but accepts a narrower scope (Feature ID or Epic), matching the three builder skills' own scope conventions. The NFR Review stage is audit-only - it reads the (now current) HLA, Detailed Design, DESIGN.md, and tech-stack.md for NFR-relevant content not yet reflected in the NFR doc, and reports findings, but never edits the NFR doc itself - the user decides whether to run test-suite-builder afterward. Use when asked to run the technical design pipeline / update architecture through detailed design in one go / regenerate the technical design chain continuously, without invoking each stage by hand.
---

# Technical Design Orchestrator

รวม 4 ขั้นตอนที่ปกติต้องรันแยกกัน ให้ทำงานต่อเนื่องในการเรียกครั้งเดียว โดยไม่ต้องให้ผู้ใช้เรียก skill/
ทำการ review ทีละตัว:

1. **High Level Architecture** — ตาม methodology เต็มของ skill `architecture-builder`
   (`.claude/skills/architecture-builder/SKILL.md`)
2. **API Spec & Database Schema** — ตาม methodology เต็มของ skill `api-db-spec-builder`
   (`.claude/skills/api-db-spec-builder/SKILL.md`)
3. **Detailed Design** — ตาม methodology เต็มของ skill `detailed-design-builder`
   (`.claude/skills/detailed-design-builder/SKILL.md`)
4. **Non-Functional Requirements Review** — ตาม methodology ใหม่ที่กำหนดไว้ในเอกสารนี้เอง (ดูหัวข้อ
   "ขั้นตอนที่ 4" ด้านล่าง) — เพราะไม่มี skill ไหนในโปรเจกต์นี้เป็นเจ้าของ "การ review NFR" โดยตรงมาก่อน

**ไม่รวม Prototype และ Tech Stack** — ทั้งสองยังคงเป็นขั้นตอนแยกที่ต้องเรียกเองตามปกติ
(`prototype-builder`, `tech-stack-builder`) ไม่ใช่ส่วนหนึ่งของ orchestrator นี้ (ผู้ใช้ไม่ได้ระบุไว้ใน
scope ของ orchestrator นี้ และทั้งสองมีจังหวะการตัดสินใจ/ถามผู้ใช้ที่หนักกว่า ไม่ควรรันอัตโนมัติแบบ
ต่อเนื่อง)

**สำคัญ**: 3 ขั้นตอนแรก (สถาปัตยกรรม, API/DB spec, detailed design) เป็นแค่ "ตัวเรียงลำดับ" ที่เรียก
methodology เดิมของแต่ละ skill ไม่มีกติกาการเขียนเอกสารเป็นของตัวเอง อ่านของจริงจาก skill file ทั้ง 3 ทุก
ครั้งที่รัน ห้ามจำ/เดารูปแบบจากความจำ เผื่อเอกสารเหล่านั้นถูกแก้ไขไปแล้วหลังจากที่ skill นี้ถูกเขียน — ส่วน
ขั้นตอนที่ 4 (NFR Review) มีกติกาเป็นของตัวเองจริง เพราะไม่มี skill อื่นเป็นเจ้าของ (ดูด้านล่าง)

## Input

รับ scope ที่ต้องการ (Feature ID เดียว, Epic เดียว, หรือทั้ง backlog) — **default คือทั้ง backlog** (เหมือน
`architecture-builder`/`api-db-spec-builder`/`detailed-design-builder`) ไม่ใช่ raw requirement text แบบ
`pipeline-orchestrator` เพราะ 3 skill แรกทำงานกับ Requirement/Backlog/User Journey ที่มีอยู่แล้ว ไม่ใช่การ
สร้าง requirement ใหม่ ถ้าผู้ใช้ไม่ได้ระบุ scope มา ให้ถือว่าเป็นทั้ง backlog โดย default ไม่ต้องถาม

## ขั้นตอนการทำงาน

1. ยืนยันว่ากำลังทำงานในโปรเจกต์ smartFit_daily (มี `docs/01-requirements/01-spec/` อยู่จริง) ก่อนเริ่ม
2. ระบุ scope จากคำขอของผู้ใช้ (Feature ID/Epic/ทั้ง backlog) ตาม "Input" ด้านบน
3. **ขั้นตอนที่ 1 — High Level Architecture**: รัน agent `architecture-writer`
   (`.claude/agents/architecture-writer.md`) ตาม scope ที่กำหนด — ทำตามขั้นตอนทั้งหมดของมันเอง (audit,
   เสนอโครง, รอยืนยัน, เขียนไฟล์) รวมถึงหยุดถามผู้ใช้ตามกติกาเดิมของมันถ้าจำเป็น
4. **ขั้นตอนที่ 2 — API Spec & Database Schema**: รัน agent `api-db-spec-writer`
   (`.claude/agents/api-db-spec-writer.md`) ตาม scope เดียวกัน — ต้องรอขั้นตอนที่ 1 เสร็จก่อนเสมอ (มัน
   ตรวจสอบเองว่ามี `high-level-architecture.md` อยู่แล้ว ซึ่งตอนนี้มีแน่นอนเพราะเพิ่งผ่านขั้นตอนที่ 1)
5. **ขั้นตอนที่ 3 — Detailed Design**: รัน agent `detailed-design-writer`
   (`.claude/agents/detailed-design-writer.md`) ตาม scope เดียวกัน — ต้องรอขั้นตอนที่ 2 เสร็จก่อนเสมอ
6. **ขั้นตอนที่ 4 — Non-Functional Requirements Review**: ทำตาม methodology ด้านล่างนี้เอง (ไม่ใช่การ
   เรียก skill อื่น) — **เป็น audit-only ห้ามเขียนไฟล์ใดๆ ทั้งสิ้น**
7. สรุปผลรวมกลับให้ผู้ใช้ตาม "Output" ด้านล่าง

## ขั้นตอนที่ 4 — NFR Review Methodology (audit-only, ห้ามเขียนไฟล์)

นี่คือ methodology ใหม่ของ orchestrator นี้เอง (ยืนยันจากผู้ใช้ 2026-08-28 ว่าเป็น audit-only ไม่ auto-fix)
เพราะไม่มี skill ไหนในโปรเจกต์นี้เป็นเจ้าของการ "review ว่า NFR doc ควรมีอะไรเพิ่ม" โดยตรงมาก่อน (ต่างจาก
`test-suite-builder` ที่แค่ bootstrap/derive test artifact จาก NFR ที่มีอยู่แล้ว ไม่ได้ตรวจว่า NFR เองควร
ขยายหรือไม่)

### ขั้นตอนที่ -1 ของ NFR Review — ตรวจว่ามี NFR doc หรือยัง

- **ถ้ายังไม่มีเอกสาร NFR ใน `01-spec/`**: ข้ามขั้นตอนที่ 4 ทั้งหมด แจ้งผู้ใช้ว่าต้องรัน `test-suite-builder`
  (NFR bootstrap) ก่อนถึงจะมี NFR doc ให้ review — **orchestrator นี้ไม่สร้าง NFR doc เอง**
- **ถ้ามีอยู่แล้ว**: อ่านทั้งไฟล์ ถือเป็นจุดตั้งต้นของการ review

### แหล่งข้อมูลที่ใช้เทียบ (อ่านฉบับล่าสุดหลังผ่านขั้นตอนที่ 1-3 แล้ว ไม่ใช่ฉบับก่อนรัน)

1. **`high-level-architecture.md` §7 Cross-cutting Concerns และ §6 External Integration Boundaries** —
   ทุก NFR ที่ถูกอ้างถึงในสองหัวข้อนี้ต้องมีอยู่จริงใน NFR doc และเนื้อหาต้องตรงกัน — ถ้า HLA กล่าวถึง
   concern ที่ไม่มี NFR รองรับเลย ถือเป็น candidate ใหม่
2. **`detailed-design/{epic-slug}.md`'s ภาคผนวก: Stack Mapping** (ถ้ามี) — ส่วนที่ระบุ client-side/
   server-side split ต้องสอดคล้องกับ NFR-01/NFR-03 (หรือ NFR performance ที่เทียบเท่า) ที่มีอยู่
3. **`docs/02-design/01-prototypes/DESIGN.md`** (ถ้ามี) — ตรวจทุก subsection ของหัวข้อ 4 (UX
   Guidelines & Rules) ว่ามี rule ใดที่ยังไม่ถูก formalize เป็น NFR บ้าง (pattern เดียวกับที่ NFR-02 เคย
   mirror §4.6 และ NFR-09/NFR-10 เคย mirror §4.3/§4.5 มาก่อน) — ถ้าเจอ rule ที่ยังไม่มี NFR รองรับ ถือเป็น
   candidate ใหม่
4. **`docs/02-design/02-technical/tech-stack.md`** (ถ้ามี) — ตรวจคำตอบ Discovery Questionnaire (หัวข้อ
   2: compliance/residency, offline support, budget/scale ฯลฯ) ว่ามีคำตอบใดที่ควรเป็น NFR แต่ยังไม่มี
   (pattern เดียวกับที่ NFR-11 เคย derive จากคำตอบ PDPA มาก่อน)
5. **`docs/03-testing/01-test-plan/test-plan.md`** (ถ้ามี) — ตรวจว่า Risk ใน §4 ที่อ้างถึง NFR ยังตรงกับ
   เนื้อหา NFR ปัจจุบันหรือไม่ (fact drift)

### การจัดกลุ่มสิ่งที่พบ

- **NFR doc ล้าหลัง** (เนื้อหาที่มีอยู่แล้วไม่ตรงกับ HLA/Detailed Design ที่เพิ่งอัปเดต แต่ไม่ใช่แนวคิดใหม่):
  รายงานไว้ว่าล้าหลังตรงไหน
- **Candidate NFR ใหม่ที่มีหลักฐานชัดเจน** (มี rule/คำตอบ Discovery ที่ยังไม่ถูก formalize): รายงานพร้อม
  อ้างอิงแหล่งที่มาชัดเจน (เช่น "DESIGN.md §4.4 มีกติกาเรื่อง data visualization ที่ยังไม่มี NFR รองรับ")
- **จุดที่ไม่แน่ใจว่าควรเป็น NFR ใหม่หรือไม่** (เช่น ข้อมูลไม่ชัดพอจะสรุป): ใช้กติกา "ถามผู้ใช้ก่อนเสมอ"
  ด้านล่าง เสนอ ≥3 แนวทาง — ไม่ฟันธงเอง

### ห้ามเขียนไฟล์ใดๆ ในขั้นตอนที่ 4 ไม่ว่ากรณีใด

รายงานผลกลับไปหาผู้ใช้เท่านั้น ถ้าผู้ใช้ต้องการให้ actually เขียน NFR doc ตามที่พบ ให้แนะนำว่าต้องเรียก
`test-suite-builder` (agent `test-suite-writer`) ต่อ — **orchestrator นี้และ agent ของมันไม่มีสิทธิ์แก้ไข
`01-spec/*.md` เอง** เหมือนกับที่ 3 ขั้นตอนแรกก็ไม่มีสิทธิ์แก้ไฟล์ที่ตัวเองไม่ได้เป็นเจ้าของเช่นกัน

## กติกาการถามผู้ใช้ — สืบทอดจากทุก stage ไม่ใช่กติกาใหม่หรือถูกตัดออก

Orchestrator นี้ไม่ได้ลด/ข้ามกติกา "ถามผู้ใช้ก่อนเสมอ" ของแต่ละ stage เมื่อ stage ไหนต้องหยุดถาม (เช่น
`architecture-builder` เจอ component ที่ต้องตัดสินใจ, `api-db-spec-builder` เจอทางเลือกการ normalize,
`detailed-design-builder` เจอ entity ที่ไม่แน่ใจว่าควรมี state diagram หรือไม่, หรือขั้นตอนที่ 4 เจอ
candidate NFR ที่ไม่แน่ใจ) ให้หยุดถามตรงนั้นจริง ๆ ตามรูปแบบของ stage นั้น (อย่างน้อย 3 แนวทาง + เหตุผล/
ข้อดี/ข้อเสีย + คำแนะนำ 1 แนวทาง) แล้วรอคำตอบก่อนไปต่อ — สิ่งที่ orchestrator นี้ตัดออกคือ**การที่ผู้ใช้
ต้องพิมพ์เรียก skill เองทีละขั้นตอน** ไม่ใช่การตัดขั้นตอนตรวจสอบ/ถามที่มีอยู่เดิมของแต่ละ stage

## Output & การบันทึก log

หลังจบทั้ง 4 ขั้นตอน (หรือหยุดกลางทางเพราะรอคำตอบผู้ใช้) ให้:

1. สรุปกลับเป็นรายงานเดียวครอบคลุมทั้ง pipeline: ไฟล์ที่สร้าง/แก้ในขั้นตอนที่ 1-3
   (`high-level-architecture.md`, `api-spec.md`, `database-schema.md`, `detailed-design/*.md`),
   คำถามที่ถามผู้ใช้และคำตอบที่ได้ (ถ้ามี) ต่อ stage, และ **ผลจาก NFR Review (ขั้นตอนที่ 4)** แยกเป็น
   3 กลุ่มตามที่ระบุไว้ข้างบน (ล้าหลัง / candidate ใหม่ / ไม่แน่ใจ) พร้อมระบุชัดว่ายังไม่ได้เขียนอะไรลง
   NFR doc เลย — แนะนำให้รัน `test-suite-builder` ต่อถ้าผู้ใช้ต้องการให้ actually อัปเดต
2. เขียน entry เดียวใน `docs/05-log/{YYYYMMDD}-log.md` (สร้างถ้ายังไม่มีสำหรับวันนั้น, append ถ้ามีแล้ว)
   สรุปทั้ง pipeline run นี้ในครั้งเดียว — ไม่ใช่แยก log ทีละ stage

## เรียกใช้เมื่อไหร่

- ผู้ใช้ต้องการอัปเดต/สร้างเอกสารเชิงเทคนิคทั้ง 3 ชั้น (HLA → API/DB Spec → Detailed Design) พร้อมกัน
  ต่อเนื่อง โดยไม่ต้องเรียกทีละ skill เอง แล้วให้ตรวจ NFR ต่อท้ายด้วยว่ามีอะไรควรเพิ่มบ้าง
- ผู้ใช้ขอ "รัน technical design pipeline ทั้งหมด" หรือ "อัปเดต architecture ถึง detailed design
  ต่อเนื่องกัน" ตรง ๆ

ถ้าผู้ใช้ต้องการแค่ stage เดียว (เช่น "แค่อัปเดต HLA พอ" หรือ "แค่ review NFR พอ") ให้ใช้ skill เดี่ยวที่
เกี่ยวข้องแทน (`architecture-builder`, `api-db-spec-builder`, `detailed-design-builder`) หรือรันเฉพาะ
ขั้นตอนที่ 4 ของเอกสารนี้แยกได้โดยไม่ต้องรัน 3 ขั้นตอนแรกถ้าผู้ใช้ระบุชัดว่าต้องการแค่ review NFR — ไม่ต้อง
ใช้ orchestrator นี้ทั้งหมดถ้าผู้ใช้ไม่ได้ต้องการให้ทุก stage ไหลต่อกันจริง ๆ — และ**ไม่ใช้แทน
`pipeline-orchestrator`** ซึ่งทำงานกับ Requirement → Backlog/Feature List/User Journey → AC/Test
Plan/Test Case คนละ chain กัน
