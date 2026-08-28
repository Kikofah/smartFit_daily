---
name: api-db-spec-builder
description: Build or update smartFit_daily's conceptual API Spec (docs/02-design/02-technical/api-spec.md) and Database Schema/ER model (docs/02-design/02-technical/database-schema.md) - both stack-agnostic but one level more concrete than the High Level Architecture doc. API Spec uses a REST-style convention (HTTP verb + resource path + status code, chosen as a neutral lingua franca, not a framework choice) grouped by the HLA's conceptual components. Database Schema is a logical/relational data model (tables, columns with logical types, an ER diagram, keys and relationships) derived directly from the HLA's conceptual data entities - never DBMS-specific types or syntax. Requires docs/02-design/02-technical/high-level-architecture.md to already exist (owned by architecture-builder) and refuses to invent components/entities not already in it. Also audits whether existing api-spec.md/database-schema.md are still consistent with the HLA doc, Requirement (incl. NFR), Backlog/Feature List, User Journey, and Prototype, handing off any needed fix to whichever skill owns that document. Defaults to covering every feature but accepts a narrower scope. Always proposes a content outline before writing, and uses the ask-the-user protocol (>=3 options with pros/cons and a recommendation) whenever something isn't clear. Use when asked to create, update, or audit the API Spec / API design / Database Schema / ER diagram / data model document for smartFit_daily.
---

# API & Database Spec Builder

สร้าง/อัปเดตเอกสาร 2 ฉบับของ smartFit_daily ที่อยู่**ถัดจาก** High Level Architecture (HLA) หนึ่งระดับ —
ยังคง**ไม่ผูกมัดกับ technical stack** แต่เจาะจงกว่า HLA พอที่จะใช้งานจริงได้ — และตรวจสอบ (audit) ว่า
เอกสารที่มีอยู่แล้วยังสอดคล้องกับเอกสารอื่นในโปรเจกต์หรือไม่ skill นี้มี 2 การทำงาน:

- **สร้าง/อัปเดต API Spec + Database Schema** (ขั้นตอนที่ 0-4 ด้านล่าง) — derive โดยตรงจาก
  **High Level Architecture** (`high-level-architecture.md`, บังคับต้องมีอยู่ก่อน — ดู "ขั้นตอนที่ -1"),
  **Requirement** (`01-spec/*.md` รวม NFR doc), **Product Backlog/Feature List** (`backlog.md`), และ
  **User Journey** (`user-journeys.md`) เสมอ
- **API & Database Consistency Audit** (ดูหัวข้อเดียวกันด้านล่าง) — ตรวจว่าเอกสารที่มีอยู่แล้วยังสอดคล้อง
  กับ **High Level Architecture, Requirement (รวม NFR), Backlog/Feature List, User Journey, และ
  Prototype** (ถ้ามี) หรือไม่ ถ้าพบว่าไม่สอดคล้อง ให้จัดการแก้ไขเอกสารที่เกี่ยวข้องทั้งหมด (ไม่ใช่แค่ไฟล์นี้)
  ตาม "การ Reconcile" ด้านล่าง

## กติกาที่สำคัญที่สุดของ skill นี้ — conceptual แต่เจาะจงกว่า HLA ด้วยข้อยกเว้นที่กำหนดไว้แล้วเท่านั้น

เอกสารทั้งสองฉบับนี้ยังคง**ห้ามผูก technical stack** เหมือน HLA (ห้ามระบุชื่อ framework/library, ฐานข้อมูล
เฉพาะเจาะจง เช่น PostgreSQL/MongoDB/Firestore, cloud provider/service, ภาษาโปรแกรม) **แต่ผู้ใช้ยืนยันแล้ว
ว่าอนุญาตข้อยกเว้นเพิ่ม 2 อย่าง** เพราะเป็นภาษากลางที่ทำให้ spec ใช้งานได้จริง ไม่ใช่การเลือก stack ของทีม:

1. **API Spec ใช้ REST-style convention** — HTTP verb (`GET`/`POST`/`PUT`/`PATCH`/`DELETE`) + resource
   path เชิงแนวคิด (เช่น `/profile`, `/workouts/today/recommendation`) + HTTP status code — **ห้ามมี**
   actual domain/base URL, ห้ามมี route syntax เฉพาะ framework (เช่น Express `router.get(...)`, Django
   URLconf), ห้ามระบุ auth mechanism เฉพาะเจาะจง (เช่น "JWT", "OAuth2 Bearer token" ใช้คำกลางแทนเช่น
   "ต้องยืนยันตัวตนผู้ใช้ก่อนเรียก" พอ)
2. **Database Schema ใช้ logical/abstract data type** — `string`, `integer`, `decimal`, `boolean`,
   `date`, `datetime`, `enum`, `identifier` เท่านั้น — **ห้ามมี** DBMS-specific type (เช่น `VARCHAR(255)`,
   `SERIAL`, `ObjectId`, `JSONB`), ห้ามระบุ index syntax จริง, ห้ามระบุ storage engine

ถ้าพบว่าตัวเองกำลังจะเขียนสิ่งที่นอกเหนือจาก 2 ข้อยกเว้นข้างบน ให้กลับไปใช้กติกาเดียวกับ `architecture-builder`
("ถ้าทีมเปลี่ยน stack ทั้งหมดพรุ่งนี้ ประโยคนี้จะยังจริงอยู่ไหม") ข้อยกเว้นเดียวกันกับ HLA เรื่องชื่อระบบ
ภายนอกที่ requirement กำหนดไว้แล้ว (YouTube, Apple Health/Google Health Connect) ยังใช้ได้ที่นี่เช่นกัน

## ขั้นตอนที่ -1 — ตรวจสอบว่ามี High Level Architecture หรือยัง (บังคับก่อนทำอย่างอื่นทั้งหมด)

- **ถ้า `docs/02-design/02-technical/high-level-architecture.md` ไม่มีอยู่**: **หยุดทันที ห้ามสร้าง/
  ห้ามเดา component หรือ data entity เอง** แจ้งผู้ใช้ว่าต้องรัน skill `architecture-builder`
  (หรือ agent `architecture-writer`) ให้เสร็จก่อน — **skill นี้ไม่ใช่เจ้าของไฟล์นั้น ห้ามสร้างเองแม้จะรู้
  วิธีก็ตาม** (ต่างจาก `test-suite-builder`'s NFR bootstrap ที่ได้รับอนุญาตให้สร้างไฟล์ใหม่ในกรณีนั้น
  โดยเฉพาะ — กรณีนี้ไม่ใช่ข้อยกเว้นแบบเดียวกัน)
- **ถ้ามีอยู่แล้ว**: อ่านทั้งไฟล์ ถือเป็น**แหล่งที่มาบังคับ (required upstream)** ของ Conceptual
  Component (หัวข้อ 3 ของ HLA) และ Conceptual Data Entity (หัวข้อ 5 ของ HLA) ที่ API operation และ
  table ทุกตัวใน 2 เอกสารนี้ต้อง derive มาโดยตรง — **ห้ามคิด component/entity ใหม่ที่ไม่มีใน HLA เลย** ถ้า
  พบระหว่างทำงานว่าจำเป็นต้องมีตัวที่ HLA ไม่มี ให้ถือเป็นกรณี "เอกสารมีข้อมูลใหม่ที่ upstream ไม่มี" ตาม
  กติกาการจัดกลุ่มด้านล่าง (ต้องถามผู้ใช้ + ส่งกลับให้ `architecture-builder` พิจารณาเพิ่มก่อน) ไม่ใช่
  เพิ่มเงียบๆ ในเอกสารของ skill นี้เอง

## Scope: ทั้งหมดโดย default แต่ระบุเจาะจงได้

- ถ้าไม่ได้ระบุ scope มา ให้ครอบคลุม **ทุก conceptual component/data entity ใน HLA ปัจจุบัน** (ซึ่งครอบคลุม
  ทุก feature ใน `backlog.md` อยู่แล้วโดยอ้อม เพราะ HLA ผูก component กับ Feature ID ไว้แล้ว)
- ถ้าผู้ใช้ระบุเจาะจง (component เดียว, Feature ID เดียว, epic เดียว, หรือเอกสารใดเอกสารหนึ่งจาก 2 ชนิด —
  เช่น "แค่ Database Schema พอ") ให้จำกัด scope ตามนั้น แต่ยังต้องอ่าน upstream ที่จำเป็นให้ครบเหมือนเดิม

## เมื่อไหร่ต้องตรวจสอบ (audit) เอกสารเดิม

รันการตรวจสอบทุกครั้งที่:

- ผู้ใช้ขอให้ตรวจสอบ/ยืนยันว่า API Spec/Database Schema ยังตรงกับเอกสารอื่นหรือไม่
- ไฟล์ `api-spec.md` หรือ `database-schema.md` ถูกแก้ไขโดยตรง (hand-edit)
- `high-level-architecture.md`, Requirement (`01-spec/*.md` รวม NFR), Backlog, หรือ User Journey
  เปลี่ยนแปลง — ไม่ว่าจะรู้จากผู้ใช้แจ้งตรงๆ หรือจาก `architecture-builder`/`feature-list-journey`/
  `prototype-builder`/`test-suite-builder` แจ้งมา
- เอกสารนี้มีอยู่แล้วแต่ยังไม่ได้ตรวจมาสักระยะ — ห้ามสันนิษฐานว่ายัง fresh อยู่เพราะไม่มีใครแจ้ง ให้ตรวจตาม
  ขั้นตอนที่ 0 ทุกครั้งที่ถูกเรียก

## ขั้นตอนที่ 0 — API & Database Consistency Audit (รันก่อนแก้ไขอะไร ถ้ามีเอกสารอยู่แล้ว)

เทียบ `api-spec.md`/`database-schema.md` ที่มีอยู่กับ:

1. **High Level Architecture (บังคับที่สุด)** — Conceptual Component ทุกตัวใน HLA มี operation ใน
   `api-spec.md` ครอบคลุมหรือไม่ Conceptual Data Entity ทุกตัวมีตารางใน `database-schema.md` ครอบคลุม
   หรือไม่ ความสัมพันธ์ระหว่าง entity ที่ HLA ระบุ (หัวข้อ 5) ตรงกับ foreign key/relationship ที่ประกาศไว้
   หรือไม่ ถ้า HLA ถูกแก้ไข (component/entity เปลี่ยนชื่อ/เพิ่ม/ลบ) เอกสารนี้ต้องตามให้ทัน
2. **Requirement (รวม NFR)** — validation/constraint ที่ปรากฏใน operation หรือ column (เช่น safety
   floor ของ ONB-3, all-or-nothing ของ PLN-3) ยังตรงกับ decision ปัจจุบันหรือไม่ operation ที่เกี่ยวกับ
   consent/ข้อมูลสุขภาพยังตรงกับ NFR-04/05/07 ปัจจุบันหรือไม่
3. **Backlog/Feature List** — Feature ID ที่ operation/table อ้างถึงยังมีอยู่จริง
4. **User Journey** — operation ที่ควรมีตามลำดับ data flow ใน journey ยังครบหรือไม่ (step ใหม่ที่เพิ่มมา
   ต้องมี operation รองรับ)
5. **Prototype** (`docs/02-design/01-prototypes/v*/`, ถ้ามี) — ใช้ประกอบเพื่อยืนยันว่า request/response
   ที่ประกาศไว้พอสำหรับ state ที่ UI ต้องแสดงจริง ไม่ใช่ source of truth หลัก — ไม่มีให้ข้ามไปเฉยๆ
6. **Self-check กติกา conceptual**: อ่านเอกสารตัวเองซ้ำ ตรวจว่ามีคำศัพท์ผูก stack หลุดเข้ามานอกเหนือจาก
   2 ข้อยกเว้นที่อนุญาตแล้ว (REST convention, logical data type) หรือไม่

### การจัดกลุ่มสิ่งที่พบ (แบบเดียวกับ `architecture-builder`/`prototype-builder`)

- **เอกสารล้าหลัง** (upstream เปลี่ยนไปแล้ว เอกสารยังเป็นของเดิม ไม่มีข้อขัดแย้ง): อัปเดตผ่าน flow ปกติ
  (ขั้นตอนที่ 1-4) ได้เลย ไม่ต้องถามผู้ใช้
- **เอกสารมีข้อมูล/แนวคิดใหม่ที่ไม่มีอยู่ใน HLA/upstream เลย** (เช่น operation หรือ table ที่ไม่มี
  component/entity รองรับใน HLA): ห้ามเดาว่าควรทำอย่างไร ให้ถามผู้ใช้ (≥3 แนวทาง + ข้อดี/ข้อเสีย +
  คำแนะนำ) — ตัวเลือกหนึ่งควรเป็น "ส่งกลับให้ `architecture-builder` เพิ่ม component/entity ใน HLA ก่อน"
  เสมอ
- **เอกสารขัดแย้งตรงๆ กับ upstream**: ห้ามเลือกฝั่งใดฝั่งหนึ่งเอง ถามผู้ใช้ด้วยรูปแบบเดียวกัน

### การ Reconcile — แก้เฉพาะไฟล์ที่ skill นี้เป็นเจ้าของ

- **`docs/02-design/02-technical/api-spec.md`** และ **`docs/02-design/02-technical/database-schema.md`**
  — แก้ตรงนี้ได้เองผ่าน flow ปกติ
- **High Level Architecture** — **ห้ามแก้เอง** ให้เรียก `architecture-builder` พร้อมระบุว่า component/
  entity ไหนต้องเพิ่ม/เปลี่ยน และเพราะอะไร (มาจาก audit ของ skill นี้)
- **Requirement/Backlog/User Journey** — **ห้ามแก้เอง** ให้เรียก `feature-list-journey`
- **Prototype** — **ห้ามแก้เอง** ให้เรียก `prototype-builder`
- **Acceptance Criteria/Test Plan/Test Case** — **ห้ามแก้เอง** ให้เรียก `test-suite-builder`

## ขั้นตอนที่ 1 — รวบรวมข้อมูลตาม scope

อ่านให้ครบตาม scope:

- `docs/02-design/02-technical/high-level-architecture.md` **ทั้งไฟล์เสมอ** (บังคับ — ดูขั้นตอนที่ -1)
  โดยเฉพาะหัวข้อ 3 (Conceptual Components), หัวข้อ 4 (Data Flow — ใช้ระบุว่า operation ไหนควรมี),
  หัวข้อ 5 (Conceptual Data Entities), และหัวข้อ 6 (External Integration Boundaries — ผูกกับ operation
  ที่เกี่ยวกับ INT-2/INT-3)
- `01-spec/*.md` ทุกไฟล์ รวม NFR doc — validation rule, constraint, และ NFR ที่ต้องสะท้อนใน API/schema
- `backlog.md` — Feature ID → Epic → MoSCoW (ใช้จัดลำดับความสำคัญของ operation/table ถ้าจำเป็น)
- `user-journeys.md` — ลำดับ step ใช้ยืนยันว่า operation ครอบคลุมทุกจุดที่ data ต้องเข้า/ออกจริง
- `docs/02-design/01-prototypes/v*/` (ถ้ามี) — ใช้ยืนยัน request/response shape ให้พอกับ UI state จริง

สรุปเป็นรายการก่อนเข้าขั้นตอนที่ 2: Component (จาก HLA) → operation ที่ควรมี → entity (จาก HLA) → table
ที่ควรมี → ความสัมพันธ์ระหว่าง table — ถ้ามีเอกสารอยู่แล้ว ให้รวมผลจาก "API & Database Consistency Audit"
เข้ามาด้วยตอนนี้

## ขั้นตอนที่ 2 — เสนอโครงเนื้อหาให้ผู้ใช้รีวิวก่อนเสมอ (บังคับทุกครั้ง ห้ามข้าม)

**ห้ามเขียนไฟล์ก่อนได้รับการยืนยันจากผู้ใช้** เสนอแผนเป็นข้อความสรุปที่มี:

1. รายชื่อ operation ที่จะบรรยายใน `api-spec.md` จัดกลุ่มตาม Component ของ HLA พร้อม HTTP verb + resource
   path เชิงแนวคิดคร่าวๆ
2. รายชื่อ table ที่จะบรรยายใน `database-schema.md` พร้อม entity ของ HLA ที่แต่ละตาราง derive มา
3. ความสัมพันธ์หลักระหว่างตาราง (จะปรากฏใน ER diagram)
4. ถ้า audit พบว่าต้องแก้เอกสารอื่นนอกเหนือจาก 2 ไฟล์นี้ (HLA/Requirement/Backlog/User Journey/Prototype)
   ให้ระบุไว้ในแผนนี้ว่าจะเรียก skill ไหนต่อ

รอผู้ใช้ยืนยัน หรือขอแก้แผนก่อนไปขั้นตอนที่ 3 เสมอ — ไม่ต้องบีบเป็นตัวเลือกจำกัดถ้าไม่จำเป็น (การยืนยันแผน
เป็น free-form)

## ขั้นตอนที่ 3 — โครงสร้างเอกสารบังคับ

### 3.1 `docs/02-design/02-technical/api-spec.md`

1. **Header** — ประเภทเอกสาร (API Spec — Conceptual, REST-style convention), สถานะ, วันที่, อ้างอิงกลับ
   HLA/backlog/01-spec
2. **ขอบเขตและหลักการ** — ย้ำกติกา conceptual + REST-style เป็นภาษากลาง (ไม่ใช่ framework) ไว้ในตัวเอกสาร
3. **Conventions** — นิยามครั้งเดียวใช้ทั้งไฟล์: รูปแบบ resource path, ความหมายของแต่ละ HTTP verb ที่ใช้,
   โครงสร้าง response envelope/error shape แบบ conceptual (เช่น "ทุก response ที่ error ต้องมี error code
   + message เชิงแนวคิด"), สมมติฐานเรื่อง authentication (ต้องยืนยันตัวตนก่อนเรียกทุก endpoint ยกเว้นระบุ
   ไว้เป็นอื่น — ไม่ระบุกลไกเฉพาะ)
4. **API Resources & Operations** — จัดกลุ่มตาม **Conceptual Component ของ HLA** (7 component) ต่อ
   component มีตาราง/block ต่อ operation ประกอบด้วย: ชื่อ operation, HTTP verb + resource path,
   Feature ID/REQ ที่เกี่ยวข้อง, request payload เชิงแนวคิด (อ้างชื่อ Data Entity จาก HLA), response
   payload เชิงแนวคิด, error/edge case หลัก (อ้างอิง Alt/Edge Case จาก user-journeys.md), และ NFR ที่
   เกี่ยวข้อง (เช่น operation ที่แตะข้อมูลสุขภาพต้องตั้ง flag เกี่ยวกับ NFR-04/05)
5. **จุดที่ยังไม่ได้ระบุ / ควรยืนยันเพิ่มเติม** — ตาม convention เดียวกับเอกสารอื่น
6. **ความสัมพันธ์กับเอกสารอื่น** — ลิงก์กลับ HLA, backlog.md, 01-spec/, user-journeys.md, และ
   `database-schema.md` (คู่กัน)

### 3.2 `docs/02-design/02-technical/database-schema.md`

1. **Header** — ประเภทเอกสาร (Database Schema — Conceptual/Logical Data Model), สถานะ, วันที่, อ้างอิง
2. **ขอบเขตและหลักการ** — ย้ำกติกา logical data type เท่านั้น (ไม่ใช่ DBMS จริง) และระบุว่าโมเดลนี้เป็น
   relational/table-based ตามที่ผู้ใช้ต้องการ (ตาราง + ER Diagram) — ไม่ตัดสินใจแทนว่า production จะใช้
   relational DB จริงหรือไม่ เป็นแค่โมเดลเชิงตรรกะที่ทำให้เห็นความสัมพันธ์ของข้อมูลชัดเจน
3. **ER Diagram** — ใช้ Mermaid `erDiagram` ครอบคลุมทุกตารางและความสัมพันธ์ (cardinality แบบ `||--o{`
   ฯลฯ) ในภาพเดียว (หรือแยกเป็นกลุ่มถ้าใหญ่เกินไปจนอ่านยาก — ต้องระบุเหตุผลถ้าแยก)
4. **Table Details** — 1 subsection ต่อ 1 ตาราง (derive จาก Conceptual Data Entity ของ HLA แบบ 1:1 หรือ
   ระบุเหตุผลถ้าไม่ใช่ 1:1 เช่น 1 entity แตกเป็นหลายตารางเพื่อ normalize) แต่ละตารางมี: ชื่อตาราง,
   คำอธิบาย, Feature ID/REQ ที่เกี่ยวข้อง, ตาราง column (ชื่อ, logical type, required/optional, เป็น
   primary/foreign key ของอะไร, คำอธิบาย, กติกาธุรกิจที่ผูกอยู่ถ้ามี)
5. **Relationships & Constraints (เชิงแนวคิด)** — สรุป cardinality/referential integrity เป็นคำพูด (ไม่ใช่
   SQL) และระบุชัดว่ากติกาไหน**บังคับใช้ไม่ได้ที่ระดับ schema** ต้องเป็นหน้าที่ของ application/service
   layer (เช่น all-or-nothing ของ PLN-3, safety floor ของ ONB-3 — schema เก็บค่าได้ แต่ไม่ enforce
   ตรรกะพวกนี้ด้วยตัวเอง) พร้อมระบุว่า component ไหนใน HLA เป็นเจ้าของกติกานั้น
6. **Query/Access Pattern Considerations (เชิงแนวคิด, ไม่บังคับแต่แนะนำให้มี)** — pattern การเข้าถึงข้อมูล
   ที่คาดว่าจะเกิดบ่อย (เช่น "ค้นหา Daily Log ตาม user + ช่วงวันที่ เป็น pattern หลักของ PLN-4/INT-1") โดย
   ไม่ระบุ index syntax จริง
7. **จุดที่ยังไม่ได้ระบุ / ควรยืนยันเพิ่มเติม**
8. **ความสัมพันธ์กับเอกสารอื่น** — ลิงก์กลับ HLA, backlog.md, 01-spec/, และ `api-spec.md` (คู่กัน)

## ขั้นตอนที่ 4 — สร้าง/แก้ไฟล์ (หลังผู้ใช้ยืนยันแผนแล้วเท่านั้น)

- ทั้งสองเอกสารเป็น **ไฟล์เดียว ไม่ versioned** (เหมือน HLA) — อัปเดตทับไฟล์เดิมได้เลยเมื่อมีการเปลี่ยนแปลง
- เขียนเป็นภาษาไทย ใช้ศัพท์เทคนิคภาษาอังกฤษทับศัพท์ได้ตาม convention ของโปรเจกต์
- ทุก entity/table/operation ต้อง trace กลับไปยัง Conceptual Component/Data Entity ของ HLA ได้เสมอ — ถ้า
  trace ไม่ได้ แปลว่ามีปัญหาตั้งแต่ขั้นตอนที่ 1 (ต้องกลับไปแก้ก่อน ไม่ใช่ปล่อยผ่าน)
- หลังสร้าง/อัปเดตไฟล์แล้ว อัปเดต `docs/02-design/02-technical/index.md` ให้กล่าวถึงทั้งสองไฟล์ (ถ้ายังไม่
  ได้กล่าวถึง) ตาม convention ของโปรเจกต์นี้ (ห้ามเขียนเนื้อหาจริงลงใน index.md)
- สรุปการเปลี่ยนแปลงลง `docs/05-log/{YYYYMMDD}-log.md` (สร้างถ้ายังไม่มีสำหรับวันนั้น, append ถ้ามีแล้ว)

## กติกาเมื่อไม่แน่ใจหรือข้อมูลไม่พอ — ต้องถามผู้ใช้ก่อนเสมอ

ใช้รูปแบบเดียวกับ skill อื่นในโปรเจกต์นี้ทุกครั้งที่เจอความไม่ชัดเจน (เช่น 1 entity ควรแตกเป็นหลายตารางเพื่อ
normalize หรือไม่, operation หนึ่งควรแยกเป็นหลาย endpoint หรือรวมเป็นเดียว, ระดับความละเอียดของ error case
ที่ upstream ไม่ได้ระบุพอ, หรือทิศทางการ reconcile ความไม่สอดคล้องที่เจอจาก audit):

1. ระบุคำถามให้ชัดเจนว่าไม่แน่ใจเรื่องอะไร กระทบ operation/table/เอกสารชั้นไหน
2. เสนอ **อย่างน้อย 3 แนวทาง** ที่เป็นไปได้
3. อธิบาย **เหตุผล ข้อดี ข้อเสีย** ของแต่ละแนวทาง
4. **แนะนำแนวทางที่ดีที่สุด 1 แนวทาง พร้อมเหตุผลที่แนะนำ**
5. รอคำตอบก่อนเขียนส่วนที่เกี่ยวข้องจริง — ห้ามเดาแล้วเขียนไปก่อน

## Output & รายงานผล

ก่อนหยุดงาน ให้สรุปกลับ:

- ผลจาก API & Database Consistency Audit (ถ้ารัน): เทียบกับกี่ชั้น, พบอะไรบ้าง, จัดเป็นล้าหลัง/ข้อมูลใหม่/
  ขัดแย้งตรงๆ อย่างไร
- แผนที่ผู้ใช้ยืนยันแล้ว (operation/table ที่ครอบคลุม)
- ไฟล์ที่สร้าง/แก้ไข (`api-spec.md`, `database-schema.md`, `index.md` ถ้าแก้, log entry)
- ถ้าเรียก `architecture-builder`/`feature-list-journey`/`prototype-builder`/`test-suite-builder` ต่อเพื่อ
  แก้เอกสารอื่น ให้ระบุว่าเรียกไปทำอะไรและผลลัพธ์เป็นอย่างไร
- คำถามใดที่ยังรอผู้ใช้ตัดสินใจอยู่บ้าง (ถ้ามี)
