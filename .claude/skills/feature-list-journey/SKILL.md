---
name: feature-list-journey
description: Audit consistency across smartFit_daily's Requirement docs (01-spec), Product Backlog / Feature List (backlog.md), and User Journey (user-journeys.md), then create or reconcile whichever of them are out of date so all three stay consistent and up to date. Also checks whether downstream Acceptance Criteria/Test Plan/Test Cases (owned by test-suite-builder), Prototypes (owned by prototype-builder), or the High Level Architecture doc (owned by architecture-builder) have gone stale as a result, and flags that instead of rewriting them. Use whenever any one of the three changes - a requirement spec doc, backlog.md, or user-journeys.md is created or edited - when prototype-builder or architecture-builder flags a discrepancy - or when asked to audit/create/update the Requirement, Feature List, Product Backlog, or User Journey docs.
---

# Feature List & User Journey Writer

เอกสาร 3 ชั้นที่ skill นี้ดูแล**เขียน**ให้สอดคล้องและเป็นล่าสุดตลอดเวลา:

1. **Requirement** — `docs/01-requirements/01-spec/*.md` (ไม่รวม `index.md`) หนึ่งไฟล์ต่อ epic — เป็น
   **source of truth**: ขอบเขต (Scope), รายละเอียด, เงื่อนไข/กติกาทางธุรกิจ (REQ-xx),
   ข้อสมมติฐาน/การตัดสินใจที่ยืนยันแล้ว, จุดที่ยังไม่ได้ระบุ
2. **Product Backlog / Feature List** — `docs/01-requirements/backlog.md` (ตารางสรุปทุก epic +
   คำอธิบายแบบเต็มต่อ feature) ที่ derive มาจาก (1)
3. **User Journey** — `docs/02-design/01-prototypes/user-journeys.md` (diagram + คำอธิบายเรียงลำดับ +
   REQ mapping ต่อ feature) ที่ derive มาจาก (1) เช่นกัน

ชั้น (2) และ (3) ต้องไม่มีข้อมูลที่ขัดแย้งหรือเก่ากว่าชั้น (1) และต้องมี Feature ID/REQ ตรงกันทั้งสามชั้นเสมอ

นอกจาก 3 ชั้นนี้ ยังมีเอกสาร/ผลงานดาวน์สตรีมที่ skill อื่นเป็นเจ้าของ (ไม่ใช่ skill นี้): **Acceptance
Criteria** (`docs/01-requirements/acceptance-criteria.md`), **Test Plan**
(`docs/03-testing/01-test-plan/test-plan.md`), **Test Case**
(`docs/03-testing/01-test-plan/test-cases/{epic-slug}.md`) — ทั้ง 3 นี้เป็นของ `test-suite-builder` —
**Prototype** (`docs/02-design/01-prototypes/v*/`) ซึ่งเป็นของ `prototype-builder` — และ **High Level
Architecture** (`docs/02-design/02-technical/high-level-architecture.md`) ซึ่งเป็นของ
`architecture-builder` — skill นี้ **ตรวจสอบ (audit)** ว่าสิ่งเหล่านี้ (ถ้ามีอยู่แล้ว) ยัง
fresh/สอดคล้องกับการเปลี่ยนแปลงใน 3 ชั้นหลักหรือไม่ แต่**ไม่เขียน/แก้ไฟล์เหล่านี้เอง** — ดู "ขั้นตอนที่ 0.5"
ด้านล่าง

## เมื่อไหร่ต้องรัน skill นี้

รันทุกครั้งที่ **ชั้นใดชั้นหนึ่งใน 3 ชั้นหลักเปลี่ยนแปลง** ไม่ใช่แค่ตอนแก้ requirement spec เท่านั้น:

- เอกสาร requirement ใน `01-spec/` ถูกสร้าง/แก้ไข (REQ ใหม่, กติกาทางธุรกิจเปลี่ยน, decision ใหม่/เปลี่ยน,
  Open Point ใหม่)
- `backlog.md` หรือ `user-journeys.md` ถูกแก้ไขโดยตรง (โดยคนหรือ tool อื่น) — กรณีนี้อาจทำให้เกิด **drift**
  จาก spec ต้นทาง ห้ามสันนิษฐานว่ายังสอดคล้องกันอยู่ ต้อง audit ใหม่เสมอ
- ผู้ใช้ขอให้ audit/สร้าง/อัปเดตเอกสารใดในสามชั้นนี้โดยตรง
- `prototype-builder` แจ้งมาจาก Prototype Consistency Audit ของมันว่า prototype เจอข้อมูลที่ควรทำให้
  Requirement/Backlog/User Journey ต้องอัปเดต
- `architecture-builder` แจ้งมาจาก Architecture Consistency Audit ของมันว่าเอกสาร High Level
  Architecture เจอข้อมูลที่ควรทำให้ Requirement/Backlog/User Journey ต้องอัปเดต

## ขั้นตอนที่ 0 — Full Consistency Audit ของ 3 ชั้นหลัก (รันทุกครั้ง ไม่ใช่แค่ครั้งแรกที่สร้างเอกสาร)

อ่านทั้งสามชั้นให้ครบ (ทุกไฟล์ใน `01-spec/`, `backlog.md`, `user-journeys.md`) แล้วตรวจสอบไขว้กันดังนี้:

1. **REQ coverage** — ทุก REQ-xx ที่นิยามใน `01-spec/` ต้องปรากฏใน Feature ID อย่างน้อย 1 รายการใน
   `backlog.md` **และ** มี Step ที่ mapping ถึงใน `user-journeys.md` — ถ้าขาดฝั่งใดฝั่งหนึ่ง ให้ระบุ
2. **Feature ID parity** — เซตของ Feature ID ต้องตรงกันทุกจุด: ตารางสรุปใน `backlog.md`, คำอธิบายเต็มใน
   `backlog.md`, และ entry ใน `user-journeys.md` — ถ้า Feature ID ไหนมีในที่หนึ่งแต่ขาดในอีกที่ ให้ระบุ
3. **Fact consistency** — ตัวเลข/สูตร/กติกาที่อ้างใน `backlog.md` และ `user-journeys.md` ต้องตรงกับข้อความ
   จริงใน section "ข้อสมมติฐาน/การตัดสินใจที่ยืนยันแล้ว" หรือ "เงื่อนไข/กติกาทางธุรกิจ" ของเอกสาร spec
   เจ้าของ REQ นั้น — ถ้าขัดแย้งกัน (เช่น spec บอกค่าคงที่หนึ่ง แต่ journey ใช้อีกค่า) ให้ระบุพร้อม quote
   ข้อความทั้งสองฝั่ง
4. **Priority parity** — MoSCoW priority ของแต่ละ feature ใน `backlog.md` ต้องไม่ขัดกับสิ่งที่ระบุไว้ใน
   เอกสาร spec ของ epic นั้น (ถ้า spec มีการกล่าวถึง priority ไว้)
5. **Freshness** — ถ้าเอกสาร spec ถูกแก้ไข (REQ, decision, scope) หลังจาก `backlog.md`/`user-journeys.md`
   ถูกเขียนครั้งล่าสุด ให้ถือว่าทุก feature/section ที่ derive จาก REQ นั้นต้อง**เขียนใหม่ตามเนื้อหาปัจจุบัน**
   ไม่ใช่แค่บันทึกว่ามันต่างกัน
6. **Reverse drift** (backlog.md/user-journeys.md มีข้อมูลที่ spec ไม่มี) — ถ้า `backlog.md` หรือ
   `user-journeys.md` มีข้อความที่ระบุข้อเท็จจริงเจาะจง (ตัวเลข, สูตร, กติกา, edge case ที่ resolve แล้ว)
   ที่ **ไม่ปรากฏอยู่ใน 01-spec/ เลย** แปลว่ามี drift ที่เกิดจากการแก้ไข downstream โดยตรง ห้ามปล่อยผ่านเงียบ ๆ
   ให้จัดการตาม "การ reconcile drift" ด้านล่าง

## ขั้นตอนที่ 0.5 — ตรวจสอบว่าดาวน์สตรีม (AC/Test Plan/Test Case/Prototype/Architecture) หลุด fresh หรือไม่

หลัง reconcile 3 ชั้นหลักเสร็จแล้ว (หรือถ้าไม่มีอะไรต้อง reconcile เลย) ให้ตรวจต่อว่า
`docs/01-requirements/acceptance-criteria.md`, `docs/03-testing/01-test-plan/test-plan.md`, และ
`docs/03-testing/01-test-plan/test-cases/*.md` (เป็นเจ้าของโดย `test-suite-builder`), prototype
version ล่าสุดใน `docs/02-design/01-prototypes/v*/` (เป็นเจ้าของโดย `prototype-builder`), และ
`docs/02-design/02-technical/high-level-architecture.md` (เป็นเจ้าของโดย `architecture-builder`)
**มีอยู่แล้วหรือยัง**:

- **ถ้ายังไม่มีเอกสาร/prototype/architecture doc เหล่านี้เลย**: ไม่ใช่ gap ที่ต้องแจ้ง — แค่ยังไม่ถูกสร้าง
  ไม่ต้องพูดถึงในรายงาน
- **ถ้ามีอยู่แล้ว**: ตรวจ (ในระดับผิวเผินพอที่จะรู้ว่าต้อง regenerate หรือไม่ ไม่ต้องอ่านลึกเท่า audit หลัก):
  - Feature ID/REQ ที่เพิ่ง reconcile ไปยังคงตรงกับที่อ้างใน `acceptance-criteria.md`/`test-cases/*.md`/
    prototype screen/`high-level-architecture.md` หรือไม่ (เช่น Feature ID เปลี่ยนเลข, REQ ถูกลบ/แก้
    ความหมาย, decision ที่เคย resolve เปลี่ยนไป)
  - Feature ใหม่ที่เพิ่งเพิ่มเข้า `backlog.md`/`user-journeys.md` มี AC/test case/prototype screen/
    component หรือ data flow ใน architecture doc ครอบคลุมหรือยัง
  - Scope/priority ที่เปลี่ยนใน `backlog.md` (เช่น MoSCoW เปลี่ยน) ยังตรงกับ scope ที่ระบุใน
    `test-plan.md` หรือไม่
  - Journey step/diagram ที่เพิ่งแก้ไป ยังตรงกับที่ prototype screen ปัจจุบันแสดง/สื่อถึง หรือกับ data flow
    ที่ `high-level-architecture.md` บรรยายไว้ หรือไม่
- **ถ้าพบว่าหลุด fresh หรือไม่ครอบคลุมแล้ว**: **ห้ามแก้ไฟล์เหล่านี้เอง** (เป็นหน้าที่/รูปแบบเฉพาะของ skill
  เจ้าของแต่ละไฟล์) ให้ระบุไว้ชัดในรายงานผลว่าไฟล์/screen/section ไหนหลุด fresh เพราะอะไร และแนะนำให้รัน
  `test-suite-builder` (agent `test-suite-writer`), `prototype-builder` (agent `prototype-writer`),
  และ/หรือ `architecture-builder` (agent `architecture-writer`) ต่อสำหรับ scope ที่กระทบ

## การ Reconcile Drift (เฉพาะ 3 ชั้นหลัก)

เมื่อ audit เจอความไม่สอดคล้องกันข้างต้น ให้เลือกวิธีจัดการตามลักษณะของความไม่สอดคล้องนั้น:

- **Spec ตามหลัง** (backlog.md/user-journeys.md ระบุข้อเท็จจริงที่ยังไม่มีใน spec แต่ไม่ขัดแย้งกับสิ่งที่
  เคย resolve ไว้แล้ว เช่น เป็นการขยายความจาก decision เดิม): เพิ่มเข้า section
  "ข้อสมมติฐาน/การตัดสินใจที่ยืนยันแล้ว" ของเอกสาร spec เจ้าของก่อน แล้วค่อยให้ backlog.md/user-journeys.md
  อ้างอิงกลับมา
- **Spec กับ downstream ขัดแย้งกันตรง ๆ** (คนละค่า/คนละกติกาในเรื่องเดียวกัน): **ห้ามเลือกฝั่งใดฝั่งหนึ่งเอง**
  ให้ใช้กติกา "ถามผู้ใช้ก่อนเสมอ" ด้านล่าง โดยกรอบตัวเลือกอย่างน้อย 3 แนวทาง เช่น (ก) ยึด spec เป็นหลัก
  แล้วแก้ backlog/journey ให้ตรง (ข) ยึด backlog/journey เป็นหลัก แล้วอัปเดต spec ย้อนกลับ (ค) ค่ากลาง/
  ทางเลือกที่สาม พร้อมเหตุผลว่าทำไมอาจถูกต้องกว่าทั้งสองฝั่งเดิม
- **Spec เปลี่ยนแล้ว downstream แค่ยังไม่ตาม** (ไม่มีข้อขัดแย้ง แค่ล้าหลัง): อัปเดต `backlog.md`/
  `user-journeys.md` ให้ตรงกับ spec ปัจจุบันได้เลยโดยไม่ต้องถาม เพราะนี่คือการ apply decision ที่ resolve
  แล้ว ไม่ใช่ความไม่ชัดเจนใหม่

หลัง reconcile แล้ว เอกสาร spec ของ epic นั้นต้องเป็นแหล่งความจริงสุดท้ายของแต่ละข้อเท็จจริงเสมอ และ
`backlog.md`/`user-journeys.md` ต้องถูก derive ใหม่จากมันให้ตรงกัน

## กติกาเมื่อไม่แน่ใจหรือข้อมูลไม่พอ — ต้องถามผู้ใช้ก่อนเสมอ

**ห้ามเดาเอาเอง** เมื่อเจอจุดที่ audit แล้วพบว่าข้อมูลไม่พอ หรือขัดแย้งกันข้ามชั้น ให้หยุดและถามผู้ใช้งาน
ตามรูปแบบนี้เสมอ:

1. ระบุคำถามให้ชัดเจนว่าไม่แน่ใจ/ขัดแย้งเรื่องอะไร และกระทบ feature/REQ/เอกสารชั้นไหนบ้าง
2. เสนอ **อย่างน้อย 3 แนวทาง** ที่เป็นไปได้
3. อธิบาย **เหตุผล ข้อดี ข้อเสีย** ของแต่ละแนวทาง
4. **แนะนำแนวทางที่ดีที่สุด 1 แนวทาง พร้อมเหตุผลที่แนะนำ**
5. รอคำตอบจากผู้ใช้ก่อนเขียนส่วนที่เกี่ยวข้องในเอกสารจริง — ห้ามใส่ placeholder ที่คลุมเครือแทนการถาม

หลังผู้ใช้ตอบแล้ว บันทึกคำตอบไว้ใน section "ข้อสมมติฐาน/การตัดสินใจที่ยืนยันแล้ว" ของเอกสาร spec
(`docs/01-requirements/01-spec/{...}.md`) ที่ REQ นั้นสังกัดอยู่ก่อนเสมอ แล้วจึงอ้างอิงกลับมาจาก
backlog.md/user-journeys.md — ไม่ใช่เขียน decision ไว้ที่ backlog.md/user-journeys.md เป็นที่แรก

เกณฑ์คร่าว ๆ ว่าเมื่อไหร่ต้องถาม vs. เมื่อไหร่แค่บันทึกไว้ใน "Open Questions": ถ้าความไม่ชัดเจนหรือความขัดแย้งนั้น
**เปลี่ยนแปลง Steps/Success State/Diagram ของ feature ที่เป็น Must หรือ Should อย่างมีนัยสำคัญ** ให้ถามก่อนเสมอ
ถ้าเป็นรายละเอียด implementation ปลีกย่อยของ feature ที่ยังไม่กระทบโครงสร้าง journey (เช่น Could-priority
integration ที่ยังไม่ต้องลง detail ระดับนั้น) ให้บันทึกไว้ใน "Open Questions" (user-journeys.md) และ
"จุดที่ยังไม่ได้ระบุ / ควรยืนยันเพิ่มเติม" (เอกสาร spec ที่เกี่ยวข้อง) แทนได้โดยไม่ต้องถามทุกข้อ
— แต่ต้องระบุให้ครบ ห้ามตัดทิ้งเงียบ ๆ

## ขั้นตอนการเขียน/ปรับเอกสารให้สอดคล้องกัน (เฉพาะ 3 ชั้นหลัก)

1. **จัดกลุ่มตาม Epic** — รวม feature/point ทั้งหมดของแต่ละ epic (หนึ่งไฟล์ใน `01-spec/` ต่อหนึ่ง epic เช่น
   Onboarding, Recommendation, Planner, Integration) อย่าสร้าง epic ใหม่ที่ไม่มีในเอกสาร spec
2. **ตั้ง/คง Feature ID** — ใช้รูปแบบ `EPIC-N` เรียงตามลำดับที่ปรากฏใน spec (เช่น `ONB-1`, `REC-1`)
   เพื่อให้ trace กลับไปยัง REQ-xx และเอกสาร spec ต้นทางได้ (คงรหัสเดิมไว้เมื่อเป็นการ update ไม่เปลี่ยนเลขใหม่
   สำหรับ feature ที่มีอยู่แล้ว — เปลี่ยน ID เดิมได้เฉพาะกรณีที่ audit พบว่า ID ปัจจุบันไม่ตรงกับลำดับใน spec
   แล้วเท่านั้น และต้องอัปเดตทุกจุดที่อ้างถึง ID เดิมให้ตรงกันทั้งหมด — **ถ้าเปลี่ยน Feature ID ที่มีอยู่แล้ว
   ต้องระบุใน "ขั้นตอนที่ 0.5" ด้วยว่ากระทบ AC/Test Plan/Test Case ที่มีอยู่แล้วหรือไม่**)
3. **แก้เฉพาะ feature/REQ ที่ audit พบว่าไม่สอดคล้องหรือล้าหลัง** ไม่ต้องเขียนใหม่ทั้งไฟล์โดยไม่จำเป็น
   แต่ feature ที่ได้รับผลกระทบต้องได้รับการแก้ไขให้ครบทั้งใน `backlog.md` และ `user-journeys.md` พร้อมกัน
   ไม่ใช่แก้ที่เดียวแล้วปล่อยอีกที่ค้าง

### Feature List / Product Backlog (`docs/01-requirements/backlog.md`)

- **ตารางสรุปไว้บนสุด** ต่อหนึ่งตารางรวมทุก epic (ไม่แยกตารางย่อยต่อ epic) มีคอลัมน์:
  Feature ID, ชื่อ Feature, Epic, **MoSCoW Priority**, REQ ที่เกี่ยวข้อง, ลิงก์เอกสาร Spec ใน `01-spec/`
- จัด MoSCoW ให้เห็นชัดในตาราง (เรียงหรือ group ตามลำดับ Must → Should → Could → Won't ภายในแต่ละ epic)
- **ใต้ตาราง** ให้มีคำอธิบายแบบเต็มของแต่ละ Feature แยกเป็นหัวข้อย่อยต่อ feature (จัดกลุ่มตาม Epic ได้)
  แต่ละหัวข้อมี: ชื่อ + Feature ID, Priority พร้อมเหตุผลว่าทำไมถึงอยู่ระดับ MoSCoW นั้น, REQ ที่เกี่ยวข้อง,
  คำอธิบาย 2-4 ประโยคว่า feature ทำอะไรและเชื่อมกับ feature อื่นอย่างไร

### User Journey (`docs/02-design/01-prototypes/user-journeys.md`)

แต่ละ feature ต้องมีลำดับเนื้อหาแบบนี้เสมอ (diagram ก่อน คำอธิบายตามหลัง):

1. **Mermaid diagram** (`flowchart` หรือ `journey`) ของ flow นั้นเป็นอันดับแรก แต่ละ node ควรสั้นและ
   สื่อขั้นตอนจริง (รวม logic เบื้องหลัง ไม่ใช่แค่หน้าจอ UI)
2. **คำอธิบายเรียงลำดับตาม diagram ด้านบน** — อธิบายทีละ node/ทีละขั้นตอนตามลำดับที่ปรากฏใน diagram
   (ห้ามสลับลำดับกับ diagram) โดยแต่ละขั้นตอนต้องมี **REQ mapping** กำกับว่าอิงจาก REQ-xx ข้อไหน
3. หลังคำอธิบายลำดับขั้นตอน ให้มี: Actor/Persona, Goal, Trigger, Preconditions, Success State,
   Alt/Edge Cases (ยังต้องมีครบเหมือนเดิม)

### Trace & ภาษา

- ทุก REQ-xx ในต้นฉบับต้องถูกอ้างอิงอย่างน้อยหนึ่งครั้งในทั้งสองเอกสาร — ระบุไว้ใน "Open Questions"
  ถ้ายังไม่มี feature ชัดเจน (ไม่ใช่ถามผู้ใช้ทุกข้อ ให้ใช้เกณฑ์ด้านบน)
- เขียนเป็นภาษาไทยให้สอดคล้องกับต้นฉบับ ใช้ศัพท์เทคนิคภาษาอังกฤษได้ตามความเหมาะสม (เช่น streak, wearable, deficit)

## Output

- `docs/01-requirements/01-spec/*.md` (เฉพาะไฟล์ที่ได้รับการ reconcile drift ตามด้านบน)
- `docs/01-requirements/backlog.md`
- `docs/02-design/01-prototypes/user-journeys.md`

ทั้งสามชั้นต้องลิงก์ถึงกันให้ครบ (backlog.md ↔ 01-spec/, user-journeys.md ↔ 01-spec/, backlog.md ↔
user-journeys.md) เมื่อเป็นการ update เอกสารเดิม ให้แก้เฉพาะส่วนที่เปลี่ยน คงเนื้อหาที่ยังถูกต้องไว้
ไม่ต้องเขียนใหม่ทั้งไฟล์โดยไม่จำเป็น ห้ามแก้ไข `index.md` ของแต่ละโฟลเดอร์ — เป็นคำอธิบายโครงสร้างเท่านั้น
ไม่ใช่ที่เก็บเนื้อหาจริง **ห้ามแก้ไข `acceptance-criteria.md`, `test-plan.md`, `test-cases/*.md`,
prototype ใด ๆ ใน `v*/`, หรือ `high-level-architecture.md` เอง** ไม่ว่ากรณีใด — เป็นหน้าที่ของ skill
`test-suite-builder`, `prototype-builder`, และ `architecture-builder` ตามลำดับ

ก่อนจบงานทุกครั้ง ให้สรุปผล Consistency Audit กลับไปหาผู้เรียก: พบความไม่สอดคล้องอะไรบ้างใน 3 ชั้นหลัก,
แก้ไขอะไรไปแล้ว, มีอะไรที่ยังรอผู้ใช้ตัดสินใจอยู่บ้าง, และ**ผลตรวจ AC/Test Plan/Test Case/Prototype/
Architecture ตามขั้นตอนที่ 0.5** (ยังไม่มี / ยัง fresh อยู่ / หลุด fresh แล้วต้องรัน `test-suite-builder`,
`prototype-builder`, และ/หรือ `architecture-builder` ต่อสำหรับ scope ไหน)
