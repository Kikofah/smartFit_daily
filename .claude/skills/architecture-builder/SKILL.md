---
name: architecture-builder
description: Build or update the conceptual High Level Architecture doc for smartFit_daily (docs/02-design/02-technical/high-level-architecture.md) - system context, conceptual components/modules, data flow per user journey, conceptual data entities, and external integration boundaries, deliberately NOT tied to any technical stack (no specific framework/database/cloud/language names). Also audits whether an existing architecture doc is still consistent with Requirement (01-spec, including the NFR doc), Backlog/Feature List, User Journey, and Prototype (all four by default, or a specified subset), handing off any needed fix to whichever skill owns that document. Defaults to covering every feature but accepts a narrower scope. Always proposes a content outline for the user to review before writing, and uses the ask-the-user protocol (>=3 options with pros/cons and a recommendation) whenever something isn't clear from upstream docs. Use when asked to create, update, or audit the High Level Architecture / system architecture / conceptual architecture document for smartFit_daily.
---

# Architecture Builder

สร้าง/อัปเดตเอกสาร **High Level Architecture (HLA)** ของ smartFit_daily ในลักษณะ **conceptual ล้วน — ยังไม่
ผูกมัดกับ technical stack ใดๆ** และตรวจสอบ (audit) ว่าเอกสารที่มีอยู่แล้วยังสอดคล้องกับเอกสารอื่นในโปรเจกต์
หรือไม่ skill นี้มี 2 การทำงาน:

- **สร้าง/อัปเดต HLA** (ขั้นตอนที่ 0-4 ด้านล่าง) — รวมข้อมูลจาก **Requirement** (`01-spec/*.md` ทุกไฟล์
  รวม NFR doc), **Product Backlog/Feature List** (`backlog.md`), และ **User Journey**
  (`user-journeys.md`) เสมอ — **ห้ามสร้างจากแหล่งใดแหล่งหนึ่งเพียงอย่างเดียว**
- **Architecture Consistency Audit** (ดูหัวข้อเดียวกันด้านล่าง) — ตรวจว่าเอกสารที่มีอยู่แล้วยังสอดคล้องกับ
  **Requirement (รวม NFR), Backlog/Feature List, User Journey, และ Prototype** (ถ้ามี) หรือไม่ ถ้าพบว่า
  ไม่สอดคล้อง ให้จัดการแก้ไขเอกสารที่เกี่ยวข้องทั้งหมด (ไม่ใช่แค่ไฟล์นี้) ตาม "การ Reconcile" ด้านล่าง

## กติกาที่สำคัญที่สุดของ skill นี้ — ต้อง conceptual ล้วน ห้ามผูก technical stack

เอกสารนี้ตอบคำถาม **"ระบบประกอบด้วยอะไรบ้าง และข้อมูลไหลผ่านส่วนไหนบ้าง"** ไม่ใช่ **"จะ implement ด้วย
อะไร"** — นี่คือกติกาที่ต้องยึดเข้มงวดที่สุดของทั้งเอกสาร เพราะเป็นเหตุผลที่เอกสารนี้ถูกสร้างแยกจาก
`docs/02-design/02-technical/` ในอนาคตที่จะเป็นเอกสารเชิง stack-specific (ดู "ความสัมพันธ์กับเอกสารอื่น")

- **ห้ามระบุ**: ชื่อ framework/library (เช่น React, Flutter, Django), ชื่อฐานข้อมูล (เช่น PostgreSQL,
  MongoDB, Firestore), ชื่อ cloud provider/service เฉพาะเจาะจง (เช่น AWS Lambda, Google Cloud Run),
  ภาษาโปรแกรม, รูปแบบ API เฉพาะ (REST vs GraphQL vs gRPC), หรือ protocol เฉพาะเจาะจงเกินความจำเป็น
- **ใช้แทนด้วยคำเชิงหน้าที่/บทบาท** เช่น "mobile client" แทนชื่อ framework, "แหล่งเก็บข้อมูลเชิงสัมพันธ์/
  โครงสร้าง" แทนชื่อ DB, "compute/service layer ฝั่ง server" แทนชื่อ cloud service, "external
  integration ผ่าน API ของผู้ให้บริการภายนอก" แทนการระบุ protocol เฉพาะ
- ถ้าพบว่าตัวเองกำลังจะเขียนชื่อ stack ใดๆ ลงไป ให้หยุดแล้วถามตัวเองว่า "ถ้าทีมเปลี่ยน stack ทั้งหมดพรุ่งนี้
  ประโยคนี้จะยังจริงอยู่ไหม" — ถ้าไม่จริง ให้เขียนใหม่ให้เป็นระดับแนวคิด
- ข้อยกเว้นเดียว: การอ้างอิงชื่อระบบภายนอกที่ business rule กำหนดไว้แล้วจริงๆ ใน `01-spec/` (เช่น "YouTube"
  ใน REQ-04, "Apple Health/Google Health Connect" ใน REQ-13) ไม่ถือเป็นการผูก stack เพราะเป็นข้อเท็จจริง
  ของ requirement เอง ไม่ใช่การเลือก stack ของทีมพัฒนา — แต่ยังต้องอธิบายว่าระบบเหล่านี้เป็น **external
  integration boundary** ไม่ใช่ส่วนหนึ่งของ stack ที่ทีมเลือก

## Scope: ทั้งหมดโดย default แต่ระบุเจาะจงได้

- ถ้าไม่ได้ระบุ scope มา ให้ครอบคลุม **ทุก feature ในทุก epic** ตาม `backlog.md`
- ถ้าผู้ใช้ระบุเจาะจง (Feature ID เดียว, epic เดียว, หรือ section เดียวของเอกสาร เช่น "แค่ Data Flow ของ
  Epic 2 พอ") ให้จำกัด scope ตามนั้น แต่ยังต้องอ่าน upstream ที่จำเป็นให้ครบเหมือนเดิม

## เมื่อไหร่ต้องตรวจสอบ (audit) เอกสารเดิม

รันการตรวจสอบทุกครั้งที่:

- ผู้ใช้ขอให้ตรวจสอบ/ยืนยันว่า HLA ยังตรงกับเอกสารอื่นหรือไม่
- ไฟล์ `high-level-architecture.md` ถูกแก้ไขโดยตรง (hand-edit) — ห้ามสันนิษฐานว่ายังสอดคล้องกันอยู่
- Requirement (`01-spec/*.md` รวม NFR doc), Backlog, หรือ User Journey เปลี่ยนแปลง — ไม่ว่าจะรู้จากผู้ใช้
  แจ้งตรงๆ หรือจาก `feature-list-journey`/`test-suite-builder`/`prototype-builder` แจ้งมา
- เอกสารนี้มีอยู่แล้วแต่ยังไม่ได้ตรวจมาสักระยะ — ห้ามสันนิษฐานว่ายัง fresh อยู่เพราะไม่มีใครแจ้ง ให้ตรวจตาม
  ขั้นตอนที่ 0 ทุกครั้งที่ถูกเรียก แม้จะดูเหมือนไม่มีอะไรเปลี่ยน

## ขั้นตอนที่ 0 — Architecture Consistency Audit (รันก่อนแก้ไขอะไร ถ้ามีเอกสารอยู่แล้ว)

เทียบเอกสาร HLA ที่มีอยู่กับ:

1. **Requirement** (`01-spec/*.md` ทุกไฟล์ รวม NFR doc) — ทุก Feature ID/Epic มี component หรือ data
   flow ที่ครอบคลุมมันอยู่ในเอกสารหรือไม่ กติกาธุรกิจที่ระบุไว้ในเอกสาร (ถ้ามีการอ้างถึง) ยังตรงกับ decision
   ปัจจุบันหรือไม่ ขอบเขต external integration ยังตรงกับ REQ-11/12/13 และ NFR-05/07 ปัจจุบันหรือไม่
2. **Backlog/Feature List** (`backlog.md`) — Feature ID ที่เอกสารอ้างถึงยังมีอยู่จริง priority ที่ implied
   จาก "ระดับความสำคัญของ component" (ถ้ามี) ยังสมเหตุสมผลกับ MoSCoW ปัจจุบัน
3. **User Journey** (`user-journeys.md`) — ลำดับ data flow ที่เอกสารบรรยายยังตรงกับ Steps ปัจจุบันของ
   Feature ID นั้นหรือไม่ (นี่คือจุดที่ drift เกิดง่ายที่สุด เพราะ data flow section ผูกกับ journey โดยตรง)
4. **Prototype** (`docs/02-design/01-prototypes/v*/`, ถ้ามี) — ใช้เป็นข้อมูลอ้างอิงประกอบเท่านั้น (ไม่ใช่
   source of truth เท่า 3 อย่างข้างต้น) เพื่อยืนยันว่า data ที่ conceptual component ผลิต/ใช้ตรงกับ state ที่
   UI แสดงจริง — ถ้าไม่มี prototype ให้ข้ามข้อนี้ไปเฉยๆ ไม่ใช่ gap
5. **Self-check กติกา conceptual**: อ่านเอกสารตัวเองซ้ำ ตรวจว่ามีคำศัพท์ผูก stack หลุดเข้ามาหรือไม่ (เช่น
   ชื่อ framework/DB/cloud ที่ไม่ใช่ข้อยกเว้นตามกติกาข้างบน) — ถ้าเจอ ถือเป็นสิ่งที่ต้องแก้ทันทีไม่ต้องถามผู้ใช้
   (เป็นการรักษากติกาเดิมของเอกสาร ไม่ใช่การตัดสินใจเนื้อหาใหม่)

### การจัดกลุ่มสิ่งที่พบ (แบบเดียวกับ `prototype-builder`)

- **เอกสารล้าหลัง** (upstream เปลี่ยนไปแล้ว เอกสารยังเป็นของเดิม ไม่มีข้อขัดแย้ง): อัปเดตผ่าน flow ปกติ
  (ขั้นตอนที่ 1-4) ได้เลย ไม่ต้องถามผู้ใช้
- **เอกสารมีข้อมูล/แนวคิดใหม่ที่ไม่มีอยู่ใน upstream เลย** (เช่น มีคนเพิ่ม component ที่ไม่ได้มาจาก feature
  ไหนเลย) — ห้ามเดาว่าควรทำอย่างไร ให้ถามผู้ใช้ (≥3 แนวทาง + ข้อดี/ข้อเสีย + คำแนะนำ)
- **เอกสารขัดแย้งตรงๆ กับ upstream** (เช่น data flow ที่บรรยายไม่ตรงกับลำดับ step จริงใน journey) — ห้าม
  เลือกฝั่งใดฝั่งหนึ่งเอง ถามผู้ใช้ด้วยรูปแบบเดียวกัน

### การ Reconcile — แก้เฉพาะไฟล์ที่ skill นี้เป็นเจ้าของ

- **`docs/02-design/02-technical/high-level-architecture.md`** — แก้ตรงนี้ได้เองผ่าน flow ปกติ
- **Requirement/Backlog/User Journey** — **ห้ามแก้เอง** ให้เรียก `feature-list-journey` พร้อมระบุว่าอะไร
  ต้องเปลี่ยนและเพราะอะไร (มาจาก audit ของ HLA)
- **Prototype** — **ห้ามแก้เอง** ให้เรียก `prototype-builder` พร้อมรายละเอียดเดียวกัน
- **Acceptance Criteria/Test Plan/Test Case** — **ห้ามแก้เอง** ถ้า audit นี้บังเอิญไปกระทบสิ่งที่เอกสารเหล่านี้
  อ้างอิงอยู่ ให้เรียก `test-suite-builder` แทน

## ขั้นตอนที่ 1 — รวบรวมข้อมูลตาม scope

อ่านให้ครบตาม scope:

- `01-spec/*.md` ทุกไฟล์ รวม NFR doc (`20260827-05-non-functional-requirements.md`) — ธุรกิจ rule, ระบบ
  ภายนอกที่เกี่ยวข้อง (YouTube, Health API/wearable, Bluetooth), NFR ด้าน performance/security/reliability
- `backlog.md` — Feature ID → Epic → MoSCoW
- `user-journeys.md` — ลำดับ step/diagram ของแต่ละ feature (นี่คือแหล่งหลักของ Data Flow section)
- `docs/02-design/01-prototypes/v*/` (ถ้ามี) — ใช้เป็นข้อมูลประกอบเพื่อยืนยันว่า data ที่ระบุสอดคล้องกับ UI
  state จริง ไม่ใช่แหล่งอ้างอิงหลัก
- `DESIGN.md` (ถ้ามี) — ใช้เฉพาะเพื่อความสอดคล้องของศัพท์ที่ใช้เรียกแนวคิดเดียวกัน (เช่นถ้า DESIGN.md เรียก
  ริงแคลอรี่ว่า "Calorie Ring" เอกสารนี้ก็ควรเรียกแนวคิดข้อมูลเบื้องหลังด้วยชื่อที่สอดคล้องกัน) — **ไม่ใช้
  DESIGN.md เพื่อกำหนดโครงสร้างเอกสารนี้** (นั่นเป็นเรื่อง UI ไม่ใช่ architecture)

สรุปเป็นรายการก่อนเข้าขั้นตอนที่ 2: Feature ID → Epic → conceptual component ที่ควรรับผิดชอบ → REQ ที่
เกี่ยวข้อง → external system ที่เกี่ยวข้อง (ถ้ามี) — ถ้ามีเอกสารอยู่แล้ว ให้รวมผลจาก "Architecture
Consistency Audit" เข้ามาด้วยตอนนี้

## ขั้นตอนที่ 2 — เสนอโครงเนื้อหาให้ผู้ใช้รีวิวก่อนเสมอ (บังคับทุกครั้ง ห้ามข้าม)

**ห้ามเขียนไฟล์ก่อนได้รับการยืนยันจากผู้ใช้** เสนอแผนเป็นข้อความสรุปที่มี:

1. รายชื่อ conceptual component/module ที่จะบรรยาย พร้อม Feature ID/Epic ที่แต่ละอันรับผิดชอบ
2. รายชื่อ data flow ที่จะบรรยาย (อิงจาก user journey ไหนบ้าง) — ถ้ามาจาก audit ให้ระบุว่าทำไมต้องแก้ flow
   ไหน
3. รายชื่อ external integration boundary ที่จะครอบคลุม (YouTube, Health API/wearable, Bluetooth
   สมาร์ตสเกล)
4. ถ้า audit พบว่าต้องแก้เอกสารอื่นนอกเหนือจากไฟล์นี้ด้วย (Requirement/Backlog/User Journey/Prototype/
   AC/Test Plan/Test Case) ให้ระบุไว้ในแผนนี้ว่าจะเรียก skill ไหนต่อ

รอผู้ใช้ยืนยัน หรือขอแก้แผน (เพิ่ม/ลด component, เปลี่ยนขอบเขต) ก่อนไปขั้นตอนที่ 3 เสมอ — ไม่ต้องบีบเป็น
ตัวเลือกจำกัดถ้าไม่จำเป็น (การยืนยันแผนเป็น free-form)

## ขั้นตอนที่ 3 — โครงสร้างเอกสารบังคับ (ทุก section ต้องมี ไม่ต้องถามผู้ใช้ซ้ำเรื่องโครงสร้าง เว้นแต่จะขอ
ปรับเปลี่ยนเอง)

`docs/02-design/02-technical/high-level-architecture.md` ต้องมีครบทุกหัวข้อนี้ ตามลำดับ:

1. **Header** — ประเภทเอกสาร (High Level Architecture — Conceptual), สถานะ, วันที่สร้าง/แก้ล่าสุด, อ้างอิง
   จากเอกสารอะไรบ้าง (ลิงก์กลับ `backlog.md`, `01-spec/index.md`, `user-journeys.md`)
2. **ขอบเขตและหลักการ (Scope & Principles)** — ย้ำกติกา conceptual/ไม่ผูก stack ไว้ในตัวเอกสารด้วย (ไม่ใช่
   แค่ใน skill file) เพื่อให้คนอ่านเอกสารเข้าใจว่าทำไมไม่มีชื่อ tech ปรากฏ และเอกสารนี้เป็นพื้นฐานก่อนที่
   `02-technical/` จะมีเอกสาร stack-specific เพิ่มในอนาคต
3. **System Context** — ผู้ใช้ (actor), ระบบ smartFit_daily โดยรวมเป็นกล่องเดียว, ระบบภายนอกที่เกี่ยวข้อง
   (YouTube, Health API/wearable, Bluetooth สมาร์ตสเกล) และทิศทางการสื่อสารระดับสูงสุด — ใช้ Mermaid
   diagram แบบ context diagram (เช่น `graph LR` หรือ `flowchart LR`) ประกอบเสมอ
4. **Conceptual Components / Modules** — บล็อกเชิงตรรกะที่ตั้งชื่อตามหน้าที่ ไม่ใช่ตามเทคโนโลยี (เช่น
   "Personalization & Profile", "Recommendation Engine", "Planner & Logging", "Progress & Insights",
   "Integration Gateway") — แต่ละ component ต้องระบุ: หน้าที่รับผิดชอบ, Feature ID/Epic ที่มันรองรับ, และ
   component อื่นที่มันคุยด้วย (ระดับแนวคิด ไม่ใช่ API endpoint จริง)
5. **Data Flow ตาม User Journey** — นี่คือ section หลักที่ผู้ใช้ระบุไว้ชัดเจนว่าต้องมี ทำ 1 flow ต่อ 1 กลุ่ม
   journey ที่สัมพันธ์กัน (เช่น Onboarding flow, Daily Recommendation flow, Logging/Streak flow, Smart
   Integration flow) แต่ละ flow ต้องมี Mermaid flowchart/sequence ระดับ conceptual (data เข้า → component
   ไหนประมวลผล → data ออกไปไหน) พร้อมข้อความอธิบายที่ map กลับไปยัง Step ใน `user-journeys.md` ของ Feature
   ID นั้นๆ อย่างชัดเจน (อ้าง Step ที่เท่าไหร่)
6. **Conceptual Data Entities** — รายการข้อมูลหลักที่ระบบต้องรู้จัก (เช่น User Profile, Daily Calorie
   Target, Video Recommendation, Workout Session, Daily Log, Streak, Plan/Calendar Entry, Weight
   Record, Wearable Reading) พร้อมความสัมพันธ์ระดับแนวคิด (เช่น "1 User Profile มีได้หลาย Daily Log")
   — **ห้ามเป็น database schema จริง** (ห้ามมี data type, primary/foreign key, ชื่อตาราง)
7. **External Integration Boundaries** — ต่อระบบภายนอกแต่ละตัว (YouTube, Health API/wearable, Bluetooth
   สมาร์ตสเกล): ข้อมูลอะไรไหลผ่าน boundary นี้ ทิศทางไหน (เข้า/ออก/สองทาง) และอ้างอิง NFR ที่เกี่ยวข้อง
   (NFR-05 consent, NFR-07 fallback เมื่อระบบภายนอกล่ม)
8. **Cross-cutting Concerns (เชิงแนวคิด)** — อ้างอิง NFR doc ในระดับแนวคิด (เช่น "ต้องรองรับการทำงานต่อได้
   แม้ external integration ไม่พร้อม" อ้าง NFR-07, "ข้อมูลสุขภาพต้องได้รับการปกป้อง" อ้าง NFR-04) — ไม่ระบุ
   วิธี implement
9. **จุดที่ยังไม่ได้ระบุ / ควรยืนยันเพิ่มเติม** — ตาม convention เดียวกับเอกสารอื่นในโปรเจกต์นี้ (ห้ามฟันธง
   สิ่งที่ upstream ไม่ได้ระบุ)
10. **ความสัมพันธ์กับเอกสารอื่น** — ลิงก์กลับ `backlog.md`, `01-spec/*.md` ที่เกี่ยวข้อง, `user-journeys.md`,
    prototype (ถ้าใช้อ้างอิง), และหมายเหตุว่าเอกสารนี้เป็นพื้นฐานก่อนเอกสาร stack-specific ใดๆ ใน
    `02-technical/` ที่จะตามมาในอนาคต (database schema, API design, tech choices — ไม่ใช่หน้าที่ของ skill
    นี้)

## ขั้นตอนที่ 4 — สร้าง/แก้ไฟล์ (หลังผู้ใช้ยืนยันแผนแล้วเท่านั้น)

- เอกสารเป็น **ไฟล์เดียว ไม่ versioned** (ต่างจาก prototype) — อัปเดตทับไฟล์เดิมได้เลยเมื่อมีการเปลี่ยนแปลง
  ไม่ต้องถามเรื่อง version folder
- เขียนเป็นภาษาไทย ใช้ศัพท์เทคนิคภาษาอังกฤษทับศัพท์ได้ตาม convention ของโปรเจกต์ (ดู CLAUDE.md § Language)
- ทุก Mermaid diagram ต้องเป็นระดับแนวคิด (ชื่อ node เป็นหน้าที่/ข้อมูล ไม่ใช่ชื่อ service/technology จริง)
- หลังสร้าง/อัปเดตไฟล์แล้ว อัปเดต `docs/02-design/02-technical/index.md` ให้กล่าวถึงไฟล์นี้ (ถ้ายังไม่ได้
  กล่าวถึง) ตาม convention ของโปรเจกต์นี้ (ห้ามเขียนเนื้อหาจริงลงใน index.md)
- สรุปการเปลี่ยนแปลงลง `docs/05-log/{YYYYMMDD}-log.md` (สร้างถ้ายังไม่มีสำหรับวันนั้น, append ถ้ามีแล้ว)

## กติกาเมื่อไม่แน่ใจหรือข้อมูลไม่พอ — ต้องถามผู้ใช้ก่อนเสมอ

ใช้รูปแบบเดียวกับ skill อื่นในโปรเจกต์นี้ทุกครั้งที่เจอความไม่ชัดเจน (เช่น component ไหนควรรับผิดชอบ
feature ที่คาบเกี่ยวหลายอย่าง, ระดับความละเอียดของ data flow ที่ user-journeys.md ไม่ได้ระบุพอ, หรือทิศทาง
การ reconcile ความไม่สอดคล้องที่เจอจาก audit):

1. ระบุคำถามให้ชัดเจนว่าไม่แน่ใจเรื่องอะไร กระทบ component/flow/เอกสารชั้นไหน
2. เสนอ **อย่างน้อย 3 แนวทาง** ที่เป็นไปได้
3. อธิบาย **เหตุผล ข้อดี ข้อเสีย** ของแต่ละแนวทาง
4. **แนะนำแนวทางที่ดีที่สุด 1 แนวทาง พร้อมเหตุผลที่แนะนำ**
5. รอคำตอบก่อนเขียนส่วนที่เกี่ยวข้องจริง — ห้ามเดาแล้วเขียนไปก่อน

## Output & รายงานผล

ก่อนหยุดงาน ให้สรุปกลับ:

- ผลจาก Architecture Consistency Audit (ถ้ารัน): เทียบกับกี่ชั้น, พบอะไรบ้าง, จัดเป็นล้าหลัง/ข้อมูลใหม่/
  ขัดแย้งตรงๆ อย่างไร
- แผนที่ผู้ใช้ยืนยันแล้ว (component/data flow ที่ครอบคลุม)
- ไฟล์ที่สร้าง/แก้ไข (`high-level-architecture.md`, `index.md` ถ้าแก้, log entry)
- ถ้าเรียก `feature-list-journey`/`prototype-builder`/`test-suite-builder` ต่อเพื่อแก้เอกสารอื่น ให้ระบุว่า
  เรียกไปทำอะไรและผลลัพธ์เป็นอย่างไร
- คำถามใดที่ยังรอผู้ใช้ตัดสินใจอยู่บ้าง (ถ้ามี)
