---
name: detailed-design-builder
description: Build or update smartFit_daily's conceptual Detailed Design docs (docs/02-design/02-technical/detailed-design/{NN}-{epic-slug}.md, one file per epic) - sequence diagrams (mandatory minimum) plus state diagrams for entities with meaningful state transitions and step-by-step algorithm descriptions for calculation-heavy features, all derived directly from the High Level Architecture doc's components/data flow and the API Spec/Database Schema docs' operations/tables. Stays conceptual/stack-agnostic like its upstream docs - sequence/state diagrams and algorithm steps are inherently notation, not stack, so no new exceptions are needed beyond what api-db-spec-builder already allows. Requires high-level-architecture.md, api-spec.md, and database-schema.md to already exist and refuses to invent operations/tables/components not already in them. Also audits whether existing detailed-design docs are still consistent with those three, Requirement (incl. NFR), Backlog/Feature List, User Journey, and Prototype, handing off any needed fix to whichever skill owns that document. Defaults to covering every feature but accepts a narrower scope. Always proposes a content outline before writing, and uses the ask-the-user protocol (>=3 options with pros/cons and a recommendation) whenever something isn't clear. Use when asked to create, update, or audit the Detailed Design / sequence diagram / state diagram / algorithm design document for smartFit_daily.
---

# Detailed Design Builder

สร้าง/อัปเดตเอกสาร **Detailed Design** ของ smartFit_daily — เจาะจงกว่า HLA และ API Spec/Database Schema
อีกหนึ่งระดับ (ชั้นสุดท้ายก่อนเขียนโค้ดจริง) ยังคง**เป็น conceptual design ไม่ผูก technical stack** —
ประกอบด้วย **Sequence Diagram (บังคับขั้นต่ำ)**, **State Diagram** (สำหรับ entity ที่มี state transition
ที่มีความหมาย), และ **อัลกอริทึมหลัก** (สำหรับ feature ที่มีการคำนวณ) — และตรวจสอบ (audit) ว่าเอกสารที่มี
อยู่แล้วยังสอดคล้องกับเอกสารอื่นในโปรเจกต์หรือไม่ skill นี้มี 2 การทำงาน:

- **สร้าง/อัปเดต Detailed Design** (ขั้นตอนที่ 0-4 ด้านล่าง) — derive โดยตรงจาก **High Level
  Architecture** (`high-level-architecture.md`), **API Spec** (`api-spec.md`), **Database Schema**
  (`database-schema.md`) — ทั้ง 3 บังคับต้องมีอยู่ก่อน (ดู "ขั้นตอนที่ -1") — รวมถึง **Requirement**
  (`01-spec/*.md` รวม NFR doc), **Product Backlog/Feature List** (`backlog.md`), และ **User Journey**
  (`user-journeys.md`) เสมอ
- **Detailed Design Consistency Audit** (ดูหัวข้อเดียวกันด้านล่าง) — ตรวจว่าเอกสารที่มีอยู่แล้วยังสอดคล้อง
  กับ **HLA, API Spec, Database Schema, Requirement (รวม NFR), Backlog/Feature List, User Journey, และ
  Prototype** (ถ้ามี) หรือไม่ ถ้าพบว่าไม่สอดคล้อง ให้จัดการแก้ไขเอกสารที่เกี่ยวข้องทั้งหมด (ไม่ใช่แค่ไฟล์นี้)
  ตาม "การ Reconcile" ด้านล่าง

## กติกาที่สำคัญที่สุดของ skill นี้ — conceptual เหมือนเดิม ไม่ต้องมีข้อยกเว้นใหม่

ต่างจาก `api-db-spec-builder` ที่ต้องขอข้อยกเว้นเพิ่ม (REST convention, logical data type) เพราะเอกสารนี้
ใช้ **notation ที่เป็นกลางทางเทคโนโลยีอยู่แล้วโดยธรรมชาติ**: sequence diagram, state diagram, และ
คำอธิบายอัลกอริทึมแบบ step-by-step ไม่ใช่ syntax ของภาษาโปรแกรมหรือ framework ใดๆ — **จึงไม่ต้องขอข้อยกเว้น
ใหม่เพิ่มสำหรับเนื้อหาหลัก** ยึดกติกาเดิมของ HLA เข้มงวดเหมือนเดิมทุกประการในหัวข้อ 1-3 (ต่อ Feature ID):
ห้ามระบุชื่อ framework/library/ฐานข้อมูล เฉพาะเจาะจง/cloud provider/ภาษาโปรแกรม — participant ใน sequence
diagram ต้องเป็นชื่อ **Conceptual Component ของ HLA** (เช่น "Content Recommendation", "Logging &
Streak") หรือ actor ทั่วไป ("ผู้ใช้", "YouTube" ในฐานะ external boundary ที่ requirement กำหนดไว้แล้ว) —
**ห้ามเป็น** "API Gateway (Express)", "PostgreSQL", "Redis Cache" ฯลฯ

อัลกอริทึมเขียนเป็น**ขั้นตอนภาษาธรรมชาติ/pseudocode เชิงแนวคิด** (numbered steps, if/else เป็นคำพูด) —
**ห้ามเป็นโค้ดจริงในภาษาใดภาษาหนึ่ง**

**ข้อยกเว้นเดียว (ใหม่ — ยืนยันจากผู้ใช้ 2026-08-28)**: **section "ภาคผนวก: Stack Mapping"** ท้ายไฟล์แต่ละ
epic (ดูขั้นตอนที่ 3 ข้อ 4) อนุญาตให้มีชื่อเทคโนโลยีจริงจาก `tech-stack.md` ได้ — เป็น section เดียวในทั้ง
เอกสารที่ยกเว้นกติกานี้ เนื้อหาหลัก (หัวข้อ 1-3 ต่อ Feature ID) ยังคง conceptual ล้วนเหมือนเดิมทุกประการ
ไม่ปะปนกัน

## ขั้นตอนที่ -1 — ตรวจสอบว่ามี HLA, API Spec, Database Schema ครบหรือยัง (บังคับก่อนทำอย่างอื่นทั้งหมด)

- **ถ้า `docs/02-design/02-technical/high-level-architecture.md`, `docs/02-design/02-technical/api-spec.md`,
  หรือ `docs/02-design/02-technical/database-schema.md` ไฟล์ใดไฟล์หนึ่งไม่มีอยู่**: **หยุดทันที ห้ามสร้าง/
  ห้ามเดา component, operation, หรือ table เอง** แจ้งผู้ใช้ว่าต้องรัน `architecture-builder` และ/หรือ
  `api-db-spec-builder` ให้เสร็จก่อนตามลำดับ (HLA ก่อน แล้วค่อย API Spec/Database Schema) — **skill นี้
  ไม่ใช่เจ้าของไฟล์เหล่านั้น ห้ามสร้างเองแม้จะรู้วิธีก็ตาม**
- **ถ้ามีครบทั้ง 3 ไฟล์**: อ่านทั้ง 3 ไฟล์ ถือเป็น**แหล่งที่มาบังคับ (required upstream)**:
  - HLA หัวข้อ 3-4 (Component, Data Flow) → กำหนด participant และลำดับ interaction ของ sequence diagram
  - `api-spec.md` หัวข้อ 3 (Operations) → sequence diagram ต้องอ้าง operation จริงที่มีอยู่ (verb+path)
  - `database-schema.md` หัวข้อ 2-3 (ER Diagram, Table Details) → sequence diagram ที่มีการอ่าน/เขียน
    ข้อมูลต้องอ้างชื่อตารางจริงที่มีอยู่ และ state diagram ต้องตรงกับ `enum` column ที่ประกาศไว้ (เช่น
    `workout_session.status`, `integration_connection.connection_status`)
  - **ห้ามคิด component/operation/table ใหม่ที่ไม่มีใน 3 เอกสารนี้เลย** ถ้าพบระหว่างทำงานว่าจำเป็นต้องมี
    ให้ถือเป็นกรณี "เอกสารมีข้อมูลใหม่ที่ upstream ไม่มี" ตามกติกาการจัดกลุ่มด้านล่าง (ต้องถามผู้ใช้ + ส่งกลับ
    ให้ skill เจ้าของเอกสารนั้นพิจารณาเพิ่มก่อน)

## Scope: ทั้งหมดโดย default แต่ระบุเจาะจงได้

- ถ้าไม่ได้ระบุ scope มา ให้ครอบคลุม **ทุก Feature ID ในทุก Epic** ตาม `backlog.md`
- ถ้าผู้ใช้ระบุเจาะจง (Feature ID เดียว, epic เดียว) ให้จำกัด scope ตามนั้น แต่ยังต้องอ่าน upstream ที่จำเป็น
  ให้ครบเหมือนเดิม

## เมื่อไหร่ต้องตรวจสอบ (audit) เอกสารเดิม

รันการตรวจสอบทุกครั้งที่:

- ผู้ใช้ขอให้ตรวจสอบ/ยืนยันว่า Detailed Design ยังตรงกับเอกสารอื่นหรือไม่
- ไฟล์ `detailed-design/{NN}-{epic-slug}.md` ถูกแก้ไขโดยตรง (hand-edit)
- `high-level-architecture.md`, `api-spec.md`, `database-schema.md`, Requirement, Backlog, หรือ User
  Journey เปลี่ยนแปลง — ไม่ว่าจะรู้จากผู้ใช้แจ้งตรงๆ หรือจาก skill อื่นแจ้งมา
- เอกสารนี้มีอยู่แล้วแต่ยังไม่ได้ตรวจมาสักระยะ — ห้ามสันนิษฐานว่ายัง fresh อยู่เพราะไม่มีใครแจ้ง
- `docs/02-design/02-technical/tech-stack.md` ถูกสร้าง/แก้ไข (ถ้ามี) — ต้องตรวจว่า "ภาคผนวก: Stack
  Mapping" ของแต่ละไฟล์ epic ที่มีอยู่แล้วยัง sync กับ `tech-stack.md` § 6.1 และคำอธิบาย client-side/
  server-side split ปัจจุบันหรือไม่

## ขั้นตอนที่ 0 — Detailed Design Consistency Audit (รันก่อนแก้ไขอะไร ถ้ามีเอกสารอยู่แล้ว)

เทียบ `detailed-design/{NN}-{epic-slug}.md` ที่มีอยู่กับ:

1. **HLA (บังคับ)** — component ที่ปรากฏใน sequence diagram ยังมีอยู่ใน HLA หัวข้อ 3 หรือไม่ ลำดับ
   interaction ยังตรงกับ Data Flow (หัวข้อ 4) หรือไม่
2. **API Spec (บังคับ)** — operation ที่ sequence diagram อ้างถึง (verb+path) ยังมีอยู่จริงใน `api-spec.md`
   หัวข้อ 3 หรือไม่ error case ที่แสดงยังตรงกับที่ระบุไว้หรือไม่
3. **Database Schema (บังคับ)** — ตาราง/column ที่ sequence/state diagram อ้างถึงยังมีอยู่จริงหรือไม่
   state diagram ยังตรงกับค่า `enum` ที่ประกาศไว้ในตารางหรือไม่
4. **Requirement (รวม NFR)** — กติกาธุรกิจที่ปรากฏใน algorithm section (เช่น สูตร, safety floor,
   all-or-nothing) ยังตรงกับ decision ปัจจุบันหรือไม่
5. **Backlog/Feature List, User Journey** — Feature ID ยังมีอยู่จริง ลำดับ step ยังตรงกับ sequence
   diagram หรือไม่
6. **Prototype** (ถ้ามี) — ใช้ประกอบเพื่อยืนยันว่า UI state ที่ sequence diagram อ้างถึง (เช่น
   error/success ที่แสดงผล) ตรงกับ prototype จริง — ไม่มีให้ข้ามไปเฉยๆ
7. **Self-check กติกา conceptual**: อ่านหัวข้อ 1-3 ต่อ Feature ID (ไม่รวมภาคผนวก) ซ้ำ ตรวจว่าไม่มีชื่อ
   stack หลุดเข้ามาใน participant name หรือ algorithm description
8. **Stack Mapping Appendix freshness** (ถ้ามี `tech-stack.md` และไฟล์ epic นั้นมีภาคผนวกอยู่แล้ว): เทียบ
   เนื้อหาภาคผนวกกับ `tech-stack.md` § 6.1 (Component → concrete implementation) และคำอธิบาย client-side/
   server-side split ปัจจุบัน — ถ้าไม่ตรงกัน ถือเป็น**การมิเรอร์ข้อเท็จจริงที่ตัดสินใจแล้วที่อื่น ไม่ใช่การ
   ตัดสินใจเนื้อหาใหม่** — แก้ให้ตรงได้เองผ่าน flow ปกติ ไม่ต้องถามผู้ใช้

### การจัดกลุ่มสิ่งที่พบ + การ Reconcile — เหมือน pattern เดิมของ `api-db-spec-builder`

- **เอกสารล้าหลัง**: อัปเดตผ่าน flow ปกติได้เลย ไม่ต้องถามผู้ใช้
- **เอกสารมี component/operation/table ที่ไม่มีใน HLA/API Spec/Database Schema เลย**: ต้องถามผู้ใช้ (≥3
  แนวทาง + คำแนะนำ โดยตัวเลือกหนึ่งควรเป็น "ส่งกลับให้ skill เจ้าของเอกสารต้นทางเพิ่มก่อน")
- **เอกสารขัดแย้งตรงๆ กับ upstream**: ห้ามเลือกฝั่งใดฝั่งหนึ่งเอง ถามผู้ใช้ด้วยรูปแบบเดียวกัน
- **การ Reconcile**: แก้ `detailed-design/{NN}-{epic-slug}.md` ได้เองผ่าน flow ปกติ — **ห้ามแก้** HLA เอง (เรียก
  `architecture-builder`), **ห้ามแก้** API Spec/Database Schema เอง (เรียก `api-db-spec-builder`),
  **ห้ามแก้** Requirement/Backlog/User Journey เอง (เรียก `feature-list-journey`), **ห้ามแก้** Prototype
  เอง (เรียก `prototype-builder`), **ห้ามแก้** Acceptance Criteria/Test Plan/Test Case เอง (เรียก
  `test-suite-builder`)

## ขั้นตอนที่ 1 — รวบรวมข้อมูลตาม scope

อ่านให้ครบตาม scope:

- `high-level-architecture.md`, `api-spec.md`, `database-schema.md` **ทั้ง 3 ไฟล์เสมอ** (บังคับ — ดู
  ขั้นตอนที่ -1)
- `01-spec/*.md` ทุกไฟล์ รวม NFR doc — สูตร/กติกาที่ algorithm section ต้องสะท้อน
- `backlog.md`, `user-journeys.md` — ยืนยัน Feature ID/ลำดับ step
- `docs/02-design/01-prototypes/v*/` (ถ้ามี) — ใช้ยืนยัน UI state ที่ sequence diagram อ้างถึง

สรุปเป็นรายการก่อนเข้าขั้นตอนที่ 2 ต่อ Feature ID: sequence diagram ที่ควรมี (participant, operation ที่
เรียก, ตารางที่แตะ) → state diagram ที่ควรมี (ถ้า entity มี state transition ที่มีความหมาย) → algorithm
ที่ควรมี (ถ้ามีการคำนวณ) — ถ้ามีเอกสารอยู่แล้ว ให้รวมผลจาก audit เข้ามาด้วยตอนนี้

## ขั้นตอนที่ 2 — เสนอโครงเนื้อหาให้ผู้ใช้รีวิวก่อนเสมอ (บังคับทุกครั้ง ห้ามข้าม)

**ห้ามเขียนไฟล์ก่อนได้รับการยืนยันจากผู้ใช้** เสนอแผนเป็นข้อความสรุปที่มี:

1. รายชื่อ Feature ID ที่จะมี sequence diagram พร้อม component/operation หลักที่เกี่ยวข้องคร่าวๆ
2. รายชื่อ entity ที่จะมี state diagram (พร้อมเหตุผลว่าทำไม entity นั้นมี state transition ที่มีความหมาย
   พอจะทำ diagram — ไม่ใช่ทุก entity ต้องมี)
3. รายชื่อ feature ที่จะมี algorithm section (เช่น TDEE, MET, safety floor, all-or-nothing, streak,
   forecast)
4. ถ้า audit พบว่าต้องแก้เอกสารอื่นนอกเหนือจากไฟล์นี้ ให้ระบุไว้ว่าจะเรียก skill ไหนต่อ

รอผู้ใช้ยืนยัน หรือขอแก้แผนก่อนไปขั้นตอนที่ 3 เสมอ — ไม่ต้องบีบเป็นตัวเลือกจำกัดถ้าไม่จำเป็น

## ขั้นตอนที่ 3 — โครงสร้างเอกสารบังคับ

`docs/02-design/02-technical/detailed-design/{NN}-{epic-slug}.md` — **1 ไฟล์ต่อ 1 epic** (เลข 2 หลัก
`NN` + slug ตรงกับไฟล์ `01-spec/`/`test-cases/` ของ epic นั้นเป๊ะๆ, เรียงตามลำดับ Epic เดียวกับ
`01-spec/`'s `RUNNING_NO`: `01-onboarding-personalization`, `02-daily-youtube-recommendation`,
`03-planner-logging`, `04-smart-integrations` — ยืนยันจากผู้ใช้ 2026-08-28 ให้ตั้งชื่อไฟล์แบบมีเลขนำหน้า
สอดคล้องกับ `01-spec/` แทนชื่อ slug ล้วนแบบเดิม) จัดกลุ่มภายในไฟล์ตาม Feature ID แต่ละไฟล์มีโครงสร้าง:

1. **Header** — ประเภทเอกสาร (Detailed Design — Conceptual), สถานะ, วันที่, อ้างอิงกลับ HLA/API
   Spec/Database Schema/backlog/01-spec
2. **ขอบเขตและหลักการ** — ย้ำกติกา conceptual (ไม่มีข้อยกเว้นใหม่ — ดูด้านบน) ไว้ในตัวเอกสารด้วย
3. **ต่อ Feature ID** (จัดกลุ่มตามลำดับใน `backlog.md`):
   - **Sequence Diagram** (Mermaid `sequenceDiagram`, บังคับทุก Feature ID) — participant เป็น actor/
     Conceptual Component ของ HLA เท่านั้น ข้อความระหว่าง participant ต้องอ้าง operation จริงจาก
     `api-spec.md` (verb+path) และตารางจริงจาก `database-schema.md` เมื่อมีการอ่าน/เขียนข้อมูล ต้องมี
     alt/opt block แสดง error/edge case หลักอย่างน้อย 1 กรณี (อ้างจาก Alt/Edge Case ของ
     `user-journeys.md`)
   - **State Diagram** (Mermaid `stateDiagram-v2`, เฉพาะ entity ที่มี state transition ที่มีความหมาย —
     เช่น Workout Session, Integration Connection — ไม่ต้องมีทุก Feature ID) — state ต้องตรงกับค่า
     `enum` ที่ประกาศไว้ใน `database-schema.md` เป๊ะๆ
   - **อัลกอริทึมหลัก** (เฉพาะ feature ที่มีการคำนวณ — เช่น ONB-1 TDEE, ONB-3 safety floor, REC-2 MET,
     PLN-3 all-or-nothing, PLN-4 streak, INT-1 forecast) — เขียนเป็นขั้นตอน numbered step ภาษาธรรมชาติ/
     pseudocode เชิงแนวคิด อ้างอิงสูตร/ค่าคงที่จาก `01-spec/` ตรงตัว
4. **จุดที่ยังไม่ได้ระบุ / ควรยืนยันเพิ่มเติม**
5. **ความสัมพันธ์กับเอกสารอื่น** — ลิงก์กลับ HLA, `api-spec.md`, `database-schema.md`, backlog.md,
   01-spec ของ epic นั้น, user-journeys.md
6. **ภาคผนวก: Stack Mapping** (สร้าง/อัปเดตเฉพาะเมื่อ `docs/02-design/02-technical/tech-stack.md` มีอยู่
   แล้ว — ถ้ายังไม่มีให้ข้ามหัวข้อนี้ไปทั้งหมด ไม่ใช่ gap) — มิเรอร์ (ไม่ใช่แก้ไข) เฉพาะส่วนที่เกี่ยวข้องกับ
   Feature ID ในไฟล์ epic นี้จาก `tech-stack.md` § 6.1 (Conceptual Component → concrete implementation
   จริง): ต่อ Conceptual Component ที่ปรากฏเป็น participant ใน sequence diagram ของไฟล์นี้ ระบุ
   implementation จริง (เช่น "Logging & Streak" → คำนวณ streak ฝั่ง mobile client แล้วเขียนผ่าน Supabase
   Edge Function ไม่ใช่เขียนตรงเข้าตาราง) พร้อมอ้างเหตุผล NFR-01/NFR-03 (client-side calculation) ตามที่
   `tech-stack.md` ระบุไว้ และสำหรับ Feature ID ที่มี algorithm section ในหัวข้อ 3 ให้ระบุด้วยว่า execution
   จริงอยู่ฝั่งไหน (client-side / Edge Function) — พร้อมประโยคเปิดที่ระบุชัดว่า **"หัวข้อนี้เป็นข้อยกเว้น
   เดียวในไฟล์นี้ที่มีชื่อเทคโนโลยีจริง แหล่งที่มาและสิทธิ์แก้ไขจริงอยู่ที่
   [tech-stack.md](../tech-stack.md) เสมอ — ถ้าทีมเปลี่ยน stack ในอนาคต ให้รัน `tech-stack-builder` ก่อน
   แล้วภาคผนวกนี้จะถูก sync ตามในการรัน `detailed-design-builder` ครั้งถัดไป"**

## ขั้นตอนที่ 4 — สร้าง/แก้ไฟล์ (หลังผู้ใช้ยืนยันแผนแล้วเท่านั้น)

- ทั้ง 4 ไฟล์เป็น **ไฟล์เดียวต่อ epic ไม่ versioned** — อัปเดตทับไฟล์เดิมได้เลยเมื่อมีการเปลี่ยนแปลง
- เขียนเป็นภาษาไทย ใช้ศัพท์เทคนิคภาษาอังกฤษทับศัพท์ได้ตาม convention ของโปรเจกต์
- ทุก participant/operation/table/state ต้อง trace กลับไปยัง HLA/API Spec/Database Schema ได้เสมอ — ถ้า
  trace ไม่ได้ แปลว่ามีปัญหาตั้งแต่ขั้นตอนที่ 1
- ก่อนเขียน/ข้ามหัวข้อ 6 (ภาคผนวก: Stack Mapping) ของแต่ละไฟล์ ให้ตรวจก่อนเสมอว่ามี
  `docs/02-design/02-technical/tech-stack.md` อยู่จริงหรือไม่ — มีจึงเขียน ไม่มีให้ข้าม
- สร้างโฟลเดอร์ `docs/02-design/02-technical/detailed-design/` ถ้ายังไม่มี (ครั้งแรกที่รัน)
- หลังสร้าง/อัปเดตไฟล์แล้ว อัปเดต `docs/02-design/02-technical/index.md` ให้กล่าวถึงโฟลเดอร์นี้ (ถ้ายังไม่
  ได้กล่าวถึง) ตาม convention ของโปรเจกต์นี้ (ห้ามเขียนเนื้อหาจริงลงใน index.md)
- สรุปการเปลี่ยนแปลงลง `docs/05-log/{YYYYMMDD}-log.md` (สร้างถ้ายังไม่มีสำหรับวันนั้น, append ถ้ามีแล้ว)

## กติกาเมื่อไม่แน่ใจหรือข้อมูลไม่พอ — ต้องถามผู้ใช้ก่อนเสมอ

ใช้รูปแบบเดียวกับ skill อื่นในโปรเจกต์นี้ทุกครั้งที่เจอความไม่ชัดเจน (เช่น entity หนึ่งมี state transition
ที่ "มีความหมายพอ" จะทำ state diagram หรือไม่, feature หนึ่งมีการคำนวณที่ "ซับซ้อนพอ" จะทำ algorithm
section หรือไม่, sequence diagram ควรแตกเป็นหลาย diagram ย่อยหรือรวมเป็นอันเดียวเมื่อ feature มีหลาย
alt-path, หรือทิศทางการ reconcile ความไม่สอดคล้องที่เจอจาก audit):

1. ระบุคำถามให้ชัดเจนว่าไม่แน่ใจเรื่องอะไร กระทบ Feature ID/diagram/เอกสารชั้นไหน
2. เสนอ **อย่างน้อย 3 แนวทาง** ที่เป็นไปได้
3. อธิบาย **เหตุผล ข้อดี ข้อเสีย** ของแต่ละแนวทาง
4. **แนะนำแนวทางที่ดีที่สุด 1 แนวทาง พร้อมเหตุผลที่แนะนำ**
5. รอคำตอบก่อนเขียนส่วนที่เกี่ยวข้องจริง — ห้ามเดาแล้วเขียนไปก่อน

## Output & รายงานผล

ก่อนหยุดงาน ให้สรุปกลับ:

- ผลจาก Detailed Design Consistency Audit (ถ้ารัน): เทียบกับกี่ชั้น, พบอะไรบ้าง, จัดเป็นล้าหลัง/ข้อมูลใหม่/
  ขัดแย้งตรงๆ อย่างไร
- แผนที่ผู้ใช้ยืนยันแล้ว (Feature ID ที่มี sequence/state diagram/algorithm ครอบคลุม)
- ไฟล์ที่สร้าง/แก้ไข (`detailed-design/{NN}-{epic-slug}.md` กี่ไฟล์, `index.md` ถ้าแก้, log entry) — รวมถึง
  ระบุว่าแต่ละไฟล์ "ภาคผนวก: Stack Mapping" ถูกสร้าง/อัปเดต/ข้ามไป และเพราะอะไร
- ถ้าเรียก `architecture-builder`/`api-db-spec-builder`/`feature-list-journey`/`prototype-builder`/
  `test-suite-builder` ต่อเพื่อแก้เอกสารอื่น ให้ระบุว่าเรียกไปทำอะไรและผลลัพธ์เป็นอย่างไร
- คำถามใดที่ยังรอผู้ใช้ตัดสินใจอยู่บ้าง (ถ้ามี)
