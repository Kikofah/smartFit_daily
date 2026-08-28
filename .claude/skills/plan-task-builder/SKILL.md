---
name: plan-task-builder
description: Build or update smartFit_daily's Plan/Phase/Release doc (docs/01-requirements/02-plan/release-plan.md) and per-phase Task Breakdown docs (docs/01-requirements/03-task/{phase-slug}.md) - dividing the backlog into phases/releases using a hybrid MoSCoW + dependency-aware strategy, then breaking each phase's features into a task list (Feature-ID-level by default, no time estimates, status-only tracking with no Owner column since no real team exists yet). Derives phases and tasks directly from Requirement (01-spec, including the NFR doc), Product Backlog/Feature List (backlog.md), and User Journey (user-journeys.md), which must all already exist. Uses High Level Architecture's component relationships (if it exists) as the primary signal for cross-feature dependencies, and Detailed Design (if it exists and scope is narrowed to a specific feature) to ground deeper task decomposition - never inventing dependencies or sub-tasks that aren't traceable to an existing document. Also audits whether existing plan/task docs are still consistent with backlog.md, 01-spec/, and user-journeys.md, handing off any needed fix to whichever skill owns that document. Defaults to covering every feature but accepts a narrower scope. Always proposes a content outline before writing, and uses the ask-the-user protocol (>=3 options with pros/cons and a recommendation) whenever something isn't clear. Use when asked to create, update, or audit the release plan / phase plan / roadmap / task breakdown / task list document for smartFit_daily.
---

# Plan & Task Builder

สร้าง/อัปเดตเอกสาร 2 ชิ้นของ smartFit_daily ที่แปลง Product Backlog ให้เป็น**แผนดำเนินงานที่ลงมือทำได้จริง**
— **Plan/Phase/Release** (แบ่งงานเป็น phase/release) และ **Task Breakdown** (แตกงานย่อยต่อ phase) — และ
ตรวจสอบ (audit) ว่าเอกสารที่มีอยู่แล้วยังสอดคล้องกับเอกสารอื่นในโปรเจกต์หรือไม่ skill นี้มี 2 การทำงาน:

- **สร้าง/อัปเดต Plan + Task Breakdown** (ขั้นตอนที่ 0-4 ด้านล่าง) — derive โดยตรงจาก **Requirement**
  (`01-spec/*.md` ทุกไฟล์ รวม NFR doc), **Product Backlog/Feature List** (`backlog.md`), และ
  **User Journey** (`user-journeys.md`) — ทั้ง 3 บังคับต้องมีอยู่ก่อน (ดู "ขั้นตอนที่ -1") — ใช้ **High
  Level Architecture** (ถ้ามี) เป็นแหล่งสัญญาณหลักของ dependency ระหว่าง feature และ **Detailed Design**
  (ถ้ามีและ scope แคบลงเฉพาะ feature เดียว) เป็นฐานสำหรับแตก task ย่อยละเอียดขึ้น
- **Plan & Task Consistency Audit** (ดูหัวข้อเดียวกันด้านล่าง) — ตรวจว่าเอกสารที่มีอยู่แล้วยังสอดคล้องกับ
  **Requirement (รวม NFR), Backlog/Feature List, และ User Journey** หรือไม่ ถ้าพบว่าไม่สอดคล้อง ให้จัดการ
  แก้ไขเอกสารที่เกี่ยวข้องทั้งหมด (ไม่ใช่แค่ไฟล์นี้) ตาม "การ Reconcile" ด้านล่าง

## กติกาที่สำคัญที่สุดของ skill นี้ — ห้ามคิด dependency/estimate/task ที่ไม่มีหลักฐานรองรับ

เอกสารทั้งสองฉบับนี้เป็นเอกสารบริหารจัดการงาน (project management) ไม่ใช่เอกสารเชิงเทคนิค แต่ยัง**ต้อง trace
กลับไปยัง upstream ได้เสมอ** เหมือนเอกสารอื่นในไปป์ไลน์นี้ — ห้ามประดิษฐ์สิ่งต่อไปนี้ขึ้นเองโดยไม่มี
หลักฐานรองรับ:

1. **Dependency ระหว่าง feature**: ต้อง derive จาก (ก) กติกาธุรกิจใน `01-spec/*.md` ที่ระบุว่า feature หนึ่ง
   ต้องใช้ผลลัพธ์ของอีก feature (เช่น ONB-1's TDEE เป็น input ของ ONB-3/REC-1/REC-2) หรือ (ข) ความสัมพันธ์
   "คุยกับ" ระหว่าง Conceptual Component ใน `high-level-architecture.md` §3 (ถ้ามี) — **ห้ามเดา dependency
   เอง** ถ้าไม่แน่ใจว่า feature สองตัวเกี่ยวพันกันจริงหรือไม่ ให้ใช้กติกา "ถามผู้ใช้ก่อนเสมอ" ด้านล่าง
2. **Time estimate/velocity**: **ห้ามใส่ตัวเลขเวลาใดๆ** (ยืนยันจากผู้ใช้ 2026-08-28 — โปรเจกต์นี้ยังไม่มีทีม
   จริง/velocity ข้อมูลให้อ้างอิง) — เอกสารทั้งสองฉบับใช้**การเรียงลำดับ (sequencing) เท่านั้น** ไม่ใช่
   calendar-based estimate ถ้าผู้ใช้ให้ข้อมูล timeline จริงมาในอนาคต ค่อยเพิ่มเป็นข้อมูลเสริม ไม่ใช่ default
3. **Task ย่อยระดับละเอียด**: **ค่า default คือ 1 task ต่อ 1 Feature ID** (ยืนยันจากผู้ใช้ — ป้องกันการ
   ประดิษฐ์ task breakdown ที่ไม่มี upstream รองรับ) แตกเป็น sub-task ละเอียดกว่านั้น (เช่น UI/logic/API/test
   แยกกัน) ได้เฉพาะเมื่อ (ก) ผู้ใช้ระบุ scope แคบลงเฉพาะ feature เดียวหรือไม่กี่ feature และ (ข) มี
   `detailed-design/{NN}-{epic-slug}.md` ของ feature นั้นอยู่แล้วให้ derive sub-task จาก sequence diagram/
   algorithm steps จริง — ถ้าไม่มี Detailed Design ให้คงเป็นระดับ Feature ID เดียว ห้ามแตกเอง

## ขั้นตอนที่ -1 — ตรวจสอบว่ามี Requirement, Backlog, User Journey ครบหรือยัง (บังคับก่อนทำอย่างอื่นทั้งหมด)

- **ถ้า `01-spec/*.md` (อย่างน้อย 1 ไฟล์ต่อ epic), `backlog.md`, หรือ `user-journeys.md` ไฟล์ใดไฟล์หนึ่ง
  ไม่มีอยู่**: **หยุดทันที ห้ามสร้าง/ห้ามเดา feature หรือ phase เอง** แจ้งผู้ใช้ว่าต้องรัน
  `feature-list-journey` ให้เอกสารทั้ง 3 ชั้นครบก่อน — **skill นี้ไม่ใช่เจ้าของไฟล์เหล่านั้น**
- **ถ้ามีครบ**: อ่านทั้ง 3 ชั้น ถือเป็นแหล่งที่มาบังคับ ทุก phase และทุก task ต้อง trace กลับไปยัง Feature
  ID ใน `backlog.md` ได้เสมอ — **ห้ามคิด feature ใหม่ที่ไม่มีใน backlog เลย**
- **ไม่บังคับ (informational เท่านั้น)**: `high-level-architecture.md` (ใช้หา dependency ระหว่าง
  component), `api-spec.md`/`database-schema.md`/`detailed-design/*.md` (ใช้แตก sub-task เมื่อ scope
  แคบ), `docs/01-requirements/acceptance-criteria.md`/`docs/03-testing/01-test-plan/test-plan.md`
  (ใช้ mirror รูปแบบ Entry/Exit Criteria ต่อ phase), `docs/02-design/02-technical/tech-stack.md` (ไม่มี
  ผลต่อการแบ่ง phase — เป็นการตัดสินใจเชิงธุรกิจ/ลำดับความสำคัญ ไม่ใช่เชิงเทคนิค) — ไฟล์เหล่านี้ไม่มีก็ข้ามไป
  เฉยๆ ไม่ใช่ gap ที่ต้องแจ้ง

## Scope: ทั้งหมดโดย default แต่ระบุเจาะจงได้

- ถ้าไม่ได้ระบุ scope มา ให้ครอบคลุม **ทุก Feature ID ในทุก Epic** ตาม `backlog.md` และสร้างทั้ง
  `release-plan.md` และ task breakdown ของทุก phase
- ถ้าผู้ใช้ระบุเจาะจง (Feature ID เดียว/ไม่กี่ตัว, epic เดียว, phase เดียว, หรือแค่เอกสารใดเอกสารหนึ่งจาก
  2 ชนิด) ให้จำกัด scope ตามนั้น — **การระบุ scope แคบลงเฉพาะ feature คือเงื่อนไขที่ทำให้แตก sub-task
  ละเอียดได้ (ดูกติกาข้อ 3 ด้านบน)**

## เมื่อไหร่ต้องตรวจสอบ (audit) เอกสารเดิม

รันการตรวจสอบทุกครั้งที่:

- ผู้ใช้ขอให้ตรวจสอบ/ยืนยันว่า Plan/Task ยังตรงกับเอกสารอื่นหรือไม่
- ไฟล์ `release-plan.md` หรือ `03-task/*.md` ถูกแก้ไขโดยตรง (hand-edit)
- `01-spec/*.md`, `backlog.md`, หรือ `user-journeys.md` เปลี่ยนแปลง — ไม่ว่าจะรู้จากผู้ใช้แจ้งตรงๆ หรือจาก
  `feature-list-journey` แจ้งมา
- เอกสารนี้มีอยู่แล้วแต่ยังไม่ได้ตรวจมาสักระยะ — ห้ามสันนิษฐานว่ายัง fresh อยู่เพราะไม่มีใครแจ้ง

## ขั้นตอนที่ 0 — Plan & Task Consistency Audit (รันก่อนแก้ไขอะไร ถ้ามีเอกสารอยู่แล้ว)

เทียบ `release-plan.md`/`03-task/*.md` ที่มีอยู่กับ:

1. **Backlog/Feature List (บังคับที่สุด)** — Feature ID ทุกตัวที่ `release-plan.md` จัด phase ไว้ยังมีอยู่
   จริงใน `backlog.md` หรือไม่ Feature ID ใหม่ที่เพิ่งเพิ่มเข้า backlog มี phase รองรับหรือยัง MoSCoW
   priority ที่ใช้จัด phase ยังตรงกับปัจจุบันหรือไม่ (feature ที่เคย Could แล้วถูกปรับเป็น Must ต้องย้าย
   phase)
2. **Requirement (รวม NFR)** — กติกาธุรกิจที่ใช้อ้างเป็นเหตุผล dependency (เช่น "ONB-1 ต้องมาก่อน REC-1
   เพราะ REC-1 ต้องใช้ TDEE") ยังตรงกับ decision ปัจจุบันหรือไม่
3. **User Journey** — ลำดับ step ที่อ้างอิงยังตรงกับปัจจุบันหรือไม่
4. **High Level Architecture** (ถ้ามี) — component relationship ที่ใช้อ้างเป็นเหตุผล dependency ยังตรง
   กับหัวข้อ 3 ของ HLA ปัจจุบันหรือไม่
5. **Self-check กติกาที่สำคัญที่สุด**: อ่านเอกสารตัวเองซ้ำ ตรวจว่ามีตัวเลขเวลา/estimate หลุดเข้ามาหรือไม่
   (ต้องไม่มีเลยตามกติกาที่ยืนยันแล้ว) และตรวจว่า sub-task ที่แตกไว้ (ถ้ามี) ยัง trace กลับไปยัง
   Detailed Design ได้จริงหรือไม่

### การจัดกลุ่มสิ่งที่พบ (แบบเดียวกับ `architecture-builder`/`api-db-spec-builder`)

- **เอกสารล้าหลัง** (upstream เปลี่ยนไปแล้ว เอกสารยังเป็นของเดิม ไม่มีข้อขัดแย้ง เช่น Feature ID เปลี่ยนเลข
  แต่ยังอยู่ phase เดิม): อัปเดตผ่าน flow ปกติได้เลย ไม่ต้องถามผู้ใช้
- **เอกสารมี Feature ID ที่ไม่มีใน backlog เลย หรือมี dependency ที่ไม่มีหลักฐานรองรับ**: ต้องถามผู้ใช้ (≥3
  แนวทาง + คำแนะนำ)
- **เอกสารขัดแย้งตรงๆ กับ upstream** (เช่น MoSCoW เปลี่ยนจน feature ควรย้าย phase แต่ไม่แน่ใจว่าย้ายไปไหน
  เหมาะสมกว่า): ห้ามเลือกฝั่งใดฝั่งหนึ่งเอง ถามผู้ใช้ด้วยรูปแบบเดียวกัน

### การ Reconcile — แก้เฉพาะไฟล์ที่ skill นี้เป็นเจ้าของ

- **`docs/01-requirements/02-plan/release-plan.md`** และ **`docs/01-requirements/03-task/{phase-slug}.md`**
  — แก้ตรงนี้ได้เองผ่าน flow ปกติ
- **Requirement/Backlog/User Journey** — **ห้ามแก้เอง** ให้เรียก `feature-list-journey`
- **High Level Architecture/API Spec/Database Schema/Detailed Design/Tech Stack** — **ห้ามแก้เอง** ให้
  เรียก `architecture-builder`/`api-db-spec-builder`/`detailed-design-builder`/`tech-stack-builder`
  ตามลำดับ (ปกติไม่ควรเกิดขึ้น เพราะ skill นี้ใช้เอกสารเหล่านี้เป็นข้อมูลประกอบเท่านั้น ไม่ใช่แหล่งที่มาบังคับ)
- **Acceptance Criteria/Test Plan/Test Case** — **ห้ามแก้เอง** ให้เรียก `test-suite-builder`
- **Prototype** — **ห้ามแก้เอง** ให้เรียก `prototype-builder`

## ขั้นตอนที่ 1 — รวบรวมข้อมูลตาม scope

อ่านให้ครบตาม scope:

- `01-spec/*.md` ทุกไฟล์ รวม NFR doc, `backlog.md`, `user-journeys.md` **ทั้ง 3 ชั้นเสมอ** (บังคับ — ดู
  ขั้นตอนที่ -1)
- `high-level-architecture.md` (ถ้ามี) — หัวข้อ 3 (Conceptual Components — ใช้ field "คุยกับ" หา
  dependency ระหว่าง feature)
- `detailed-design/{NN}-{epic-slug}.md` (ถ้ามีและ scope แคบเฉพาะ feature) — ใช้แตก sub-task
- `docs/01-requirements/acceptance-criteria.md`/`docs/03-testing/01-test-plan/test-plan.md` (ถ้ามี) —
  ใช้ mirror รูปแบบ Entry/Exit Criteria

สรุปเป็นรายการก่อนเข้าขั้นตอนที่ 2: Feature ID → MoSCoW → dependency ที่พบ (พร้อมอ้างอิงแหล่งที่มา) →
phase ที่ควรจัด → เหตุผล — ถ้ามีเอกสารอยู่แล้ว ให้รวมผลจาก audit เข้ามาด้วยตอนนี้

## ขั้นตอนที่ 2 — เสนอโครงเนื้อหาให้ผู้ใช้รีวิวก่อนเสมอ (บังคับทุกครั้ง ห้ามข้าม)

**ห้ามเขียนไฟล์ก่อนได้รับการยืนยันจากผู้ใช้** เสนอแผนเป็นข้อความสรุปที่มี:

1. จำนวน phase ที่เสนอ พร้อม Feature ID ที่จัดอยู่ในแต่ละ phase และเหตุผล (MoSCoW + dependency ที่พบ)
2. dependency ข้าม phase ที่พบ (ถ้ามี) พร้อมแหล่งที่มาที่อ้างอิง (REQ-xx หรือ HLA component)
3. รายชื่อไฟล์ task breakdown ที่จะสร้าง (1 ไฟล์ต่อ phase)
4. ถ้า audit พบว่าต้องแก้เอกสารอื่นนอกเหนือจากไฟล์นี้ ให้ระบุไว้ว่าจะเรียก skill ไหนต่อ

รอผู้ใช้ยืนยัน หรือขอแก้แผนก่อนไปขั้นตอนที่ 3 เสมอ — ไม่ต้องบีบเป็นตัวเลือกจำกัดถ้าไม่จำเป็น

## ขั้นตอนที่ 3 — โครงสร้างเอกสารบังคับ

### 3.1 `docs/01-requirements/02-plan/release-plan.md` (ไฟล์เดียว ไม่ versioned)

1. **Header** — ประเภทเอกสาร (Release Plan — Phase/Milestone Breakdown), สถานะ, วันที่, อ้างอิงกลับ
   `backlog.md`/`01-spec/index.md`/`user-journeys.md`
2. **ขอบเขตและหลักการ** — อธิบายกลยุทธ์ hybrid MoSCoW + dependency-aware ไว้ในตัวเอกสารด้วย และย้ำว่า
   เอกสารนี้**ไม่มีตัวเลขเวลา/estimate** (ใช้การเรียงลำดับเท่านั้น) เพราะยังไม่มีทีมจริง/ข้อมูล velocity —
   ถ้าในอนาคตมีข้อมูลจริง ค่อยเพิ่มเป็นส่วนเสริม
3. **ภาพรวม Phase/Release** — ตารางสรุป: Phase → Feature ID ที่รวม → เป้าหมาย (Objective) ของ phase นั้น
   → เหตุผลการจัดกลุ่ม (MoSCoW/dependency)
4. **รายละเอียดต่อ Phase** — ต่อ phase มี: Objective, รายชื่อ Feature ID (พร้อม MoSCoW/REQ), Dependency
   Notes (feature ไหนต้องมาก่อน/หลังอะไร พร้อมอ้างอิงแหล่งที่มา), Entry/Exit Criteria (mirror รูปแบบของ
   `test-plan.md` §5 ถ้ามีให้ใช้อ้างอิง)
5. **Dependency Map** — Mermaid diagram (`flowchart`) แสดงลำดับ phase → phase และ hard dependency ข้าม
   phase ที่พบ (ถ้ามี)
6. **จุดที่ยังไม่ได้ระบุ / ควรยืนยันเพิ่มเติม**
7. **ความสัมพันธ์กับเอกสารอื่น** — ลิงก์กลับ `backlog.md`, `01-spec/*.md`, `user-journeys.md`,
   `high-level-architecture.md` (ถ้าใช้อ้างอิง dependency), `03-task/` (ลิงก์ไปยัง task breakdown ของ
   แต่ละ phase)

### 3.2 `docs/01-requirements/03-task/{phase-slug}.md` (1 ไฟล์ต่อ 1 phase, ไม่ versioned)

`phase-slug` ตั้งชื่อสั้นสื่อความหมาย (เช่น `phase-1-mvp-core-loop`) ให้สอดคล้องกับชื่อ phase ใน
`release-plan.md`

1. **Header** — ประเภทเอกสาร (Task Breakdown), สถานะ, วันที่, อ้างอิงกลับ `release-plan.md`/`backlog.md`
2. **ขอบเขตของ Phase นี้** — สรุปสั้นจาก `release-plan.md` (Objective + Feature ID ที่รวม)
3. **Task List** — ตาราง 1 แถวต่อ 1 task (ค่า default = 1 task ต่อ 1 Feature ID ตามกติกาที่ยืนยันแล้ว —
   แตก sub-task ได้เฉพาะเมื่อเข้าเงื่อนไขในกติกาที่สำคัญที่สุด) มีคอลัมน์อย่างน้อย: Task ID
   (`TASK-{FeatureID}` หรือ `TASK-{FeatureID}-{เลข 2 หลัก}` ถ้าแตก sub-task), ชื่อ Task, Feature ID/REQ
   ที่เกี่ยวข้อง, **Status** (ค่าเดียว 3 สถานะ: `ยังไม่เริ่ม`/`กำลังทำ`/`เสร็จแล้ว` — default `ยังไม่เริ่ม`
   เสมอตอนสร้างใหม่ — **ไม่มีคอลัมน์ Owner** ตามที่ยืนยันแล้ว), คำอธิบายสั้น, References (REQ-xx, AC ID
   ถ้ามีใน `acceptance-criteria.md`, section ที่เกี่ยวข้องใน `detailed-design/` ถ้าใช้แตก sub-task)
4. **จุดที่ยังไม่ได้ระบุ / ควรยืนยันเพิ่มเติม**
5. **ความสัมพันธ์กับเอกสารอื่น** — ลิงก์กลับ `release-plan.md`, `backlog.md`, `01-spec/` ของ epic ที่
   เกี่ยวข้อง, `user-journeys.md`

## ขั้นตอนที่ 4 — สร้าง/แก้ไฟล์ (หลังผู้ใช้ยืนยันแผนแล้วเท่านั้น)

- ทั้งสองเอกสารเป็น **ไฟล์เดียว/1 ไฟล์ต่อ phase ไม่ versioned** — อัปเดตทับไฟล์เดิมได้เลยเมื่อมีการเปลี่ยนแปลง
- เขียนเป็นภาษาไทย ใช้ศัพท์เทคนิคภาษาอังกฤษทับศัพท์ได้ตาม convention ของโปรเจกต์
- **เมื่ออัปเดตไฟล์ `03-task/*.md` ที่มีอยู่แล้ว ห้ามรีเซ็ตค่า Status ของ task ที่มีอยู่แล้วกลับเป็น
  "ยังไม่เริ่ม"** — คงค่า Status เดิมไว้เสมอ เว้นแต่ผู้ใช้สั่งให้รีเซ็ตตรงๆ (Status คือข้อมูลที่มีความหมาย
  เฉพาะครั้ง ไม่ใช่เนื้อหาที่ derive ใหม่ทุกครั้งเหมือน field อื่น)
- ทุก Feature ID ที่ปรากฏต้อง trace กลับไปยัง `backlog.md` ได้เสมอ — ถ้า trace ไม่ได้ แปลว่ามีปัญหาตั้งแต่
  ขั้นตอนที่ 1
- **ห้ามแก้ไข `docs/01-requirements/02-plan/index.md` หรือ `docs/01-requirements/03-task/index.md`** —
  เป็นคำอธิบายโครงสร้างเท่านั้น ไม่ใช่ที่เก็บเนื้อหาจริง (ตาม convention ของโปรเจกต์นี้)
- สรุปการเปลี่ยนแปลงลง `docs/05-log/{YYYYMMDD}-log.md` (สร้างถ้ายังไม่มีสำหรับวันนั้น, append ถ้ามีแล้ว)

## กติกาเมื่อไม่แน่ใจหรือข้อมูลไม่พอ — ต้องถามผู้ใช้ก่อนเสมอ

ใช้รูปแบบเดียวกับ skill อื่นในโปรเจกต์นี้ทุกครั้งที่เจอความไม่ชัดเจน (เช่น feature สอง feature เกี่ยวพันกัน
จริงหรือไม่โดยไม่มีหลักฐานชัดใน spec/HLA, feature หนึ่งควรอยู่ phase ไหนเมื่อ MoSCoW กับ dependency ชี้ไปคน
ละทาง, หรือทิศทางการ reconcile ความไม่สอดคล้องที่เจอจาก audit):

1. ระบุคำถามให้ชัดเจนว่าไม่แน่ใจเรื่องอะไร กระทบ feature/phase/เอกสารชั้นไหน
2. เสนอ **อย่างน้อย 3 แนวทาง** ที่เป็นไปได้
3. อธิบาย **เหตุผล ข้อดี ข้อเสีย** ของแต่ละแนวทาง
4. **แนะนำแนวทางที่ดีที่สุด 1 แนวทาง พร้อมเหตุผลที่แนะนำ**
5. รอคำตอบก่อนเขียนส่วนที่เกี่ยวข้องจริง — ห้ามเดาแล้วเขียนไปก่อน

## Output & รายงานผล

ก่อนหยุดงาน ให้สรุปกลับ:

- ผลจาก Plan & Task Consistency Audit (ถ้ารัน): เทียบกับกี่ชั้น, พบอะไรบ้าง, จัดเป็นล้าหลัง/ข้อมูลใหม่/
  ขัดแย้งตรงๆ อย่างไร
- แผนที่ผู้ใช้ยืนยันแล้ว (phase ที่ครอบคลุม, Feature ID ต่อ phase)
- ไฟล์ที่สร้าง/แก้ไข (`release-plan.md`, `03-task/{phase-slug}.md` กี่ไฟล์, log entry)
- ถ้าเรียก `feature-list-journey`/`architecture-builder`/`test-suite-builder`/`prototype-builder` ต่อ
  เพื่อแก้เอกสารอื่น ให้ระบุว่าเรียกไปทำอะไรและผลลัพธ์เป็นอย่างไร
- คำถามใดที่ยังรอผู้ใช้ตัดสินใจอยู่บ้าง (ถ้ามี)
