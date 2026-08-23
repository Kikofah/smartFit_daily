---
name: feature-list-journey
description: Audit a requirement spec / product backlog (epics, user stories, REQ items, MoSCoW priority) for gaps, then create or update the Product Backlog and per-feature User Journey docs for smartFit_daily. Use whenever a requirement doc under docs/01-requirements/01-spec/ changes, or when asked to audit/create/update the Feature List, Product Backlog, or User Journey docs.
---

# Feature List & User Journey Writer

วิธีการตรวจสอบ (audit) Requirement Spec / Product Backlog แล้วสร้างหรืออัปเดตเอกสารสองชิ้น:
`docs/01-requirements/backlog.md` (Feature List / Product Backlog) และ
`docs/02-design/01-prototypes/user-journeys.md` (User Journey)

## Input

- `docs/01-requirements/01-spec/*.md` (ไม่รวม `index.md`) — เอกสาร requirement แยกไฟล์ต่อ Epic ซึ่งแต่ละไฟล์มี:
  - ขอบเขต (Scope), รายละเอียด (Description)
  - เงื่อนไข/กติกาทางธุรกิจ (Business Rules) เป็นข้อ REQ-xx ที่ระบุเงื่อนไขทำงานจริง
  - ข้อสมมติฐาน/การตัดสินใจที่ยืนยันแล้ว, จุดที่ยังไม่ได้ระบุ
- เอกสารเดิม `docs/01-requirements/backlog.md` / `docs/02-design/01-prototypes/user-journeys.md` ถ้ามีอยู่แล้ว
  (สำหรับกรณี update)

## ขั้นตอนที่ 0 — Audit ก่อนเขียนเอกสาร

ก่อนสร้าง/อัปเดตเอกสารใด ๆ ให้ตรวจสอบ requirement spec ทุกไฟล์ใน `01-spec/` ก่อนเสมอ:

1. ทุก user story/feature ต้อง map ไปยัง REQ-xx อย่างน้อย 1 ข้อ และทุก REQ-xx ต้อง map ไปยัง feature ได้
2. หา requirement ที่ **ขาดรายละเอียดที่จำเป็นต่อการเขียน Steps ให้เป็นรูปธรรม** เช่น สูตรคำนวณ, ค่าคงที่,
   เกณฑ์ tolerance, กติกา edge case ที่ spec ไม่ได้ระบุ (ไม่ใช่แค่ nice-to-have แต่เป็นสิ่งที่ถ้าไม่รู้
   จะเขียน Steps/Success State ผิดหรือคลุมเครือ)
3. หา feature ที่ทับซ้อนกัน หรือ REQ ที่ขัดแย้งกันเองข้าม epic

## กติกาเมื่อไม่แน่ใจหรือข้อมูลไม่พอ — ต้องถามผู้ใช้ก่อนเสมอ

**ห้ามเดาเอาเอง** เมื่อเจอจุดที่ audit แล้วพบว่าข้อมูลไม่พอต่อการเขียน Steps/Success State ให้ถูกต้อง
ให้หยุดและถามผู้ใช้งานตามรูปแบบนี้เสมอ:

1. ระบุคำถามให้ชัดเจนว่าไม่แน่ใจเรื่องอะไร และกระทบ feature/REQ ไหน
2. เสนอ **อย่างน้อย 3 แนวทาง** ที่เป็นไปได้
3. อธิบาย **เหตุผล ข้อดี ข้อเสีย** ของแต่ละแนวทาง
4. **แนะนำแนวทางที่ดีที่สุด 1 แนวทาง พร้อมเหตุผลที่แนะนำ**
5. รอคำตอบจากผู้ใช้ก่อนเขียนส่วนที่เกี่ยวข้องในเอกสารจริง — ห้ามใส่ placeholder ที่คลุมเครือแทนการถาม

หลังผู้ใช้ตอบแล้ว บันทึกคำตอบไว้ใน section "ข้อสมมติฐาน/การตัดสินใจที่ยืนยันแล้ว" ของเอกสาร spec
(`docs/01-requirements/01-spec/{...}.md`) ที่ REQ นั้นสังกัดอยู่ก่อน แล้วจึงอ้างอิงกลับมาจาก backlog.md/
user-journeys.md — ไม่ใช่เขียน decision ไว้ที่ backlog.md/user-journeys.md เป็นที่แรก

เกณฑ์คร่าว ๆ ว่าเมื่อไหร่ต้องถาม vs. เมื่อไหร่แค่บันทึกไว้ใน "Open Questions": ถ้าความไม่ชัดเจนนั้น
**เปลี่ยนแปลง Steps/Success State/Diagram ของ feature ที่เป็น Must หรือ Should อย่างมีนัยสำคัญ** ให้ถามก่อนเสมอ
ถ้าเป็นรายละเอียด implementation ปลีกย่อยของ feature ที่ยังไม่กระทบโครงสร้าง journey (เช่น Could-priority
integration ที่ยังไม่ต้องลง detail ระดับนั้น) ให้บันทึกไว้ใน "Open Questions" (user-journeys.md) และ
"จุดที่ยังไม่ได้ระบุ / ควรยืนยันเพิ่มเติม" (เอกสาร spec ที่เกี่ยวข้อง) แทนได้โดยไม่ต้องถามทุกข้อ
— แต่ต้องระบุให้ครบ ห้ามตัดทิ้งเงียบ ๆ

## ขั้นตอนการเขียนเอกสาร

1. **จัดกลุ่มตาม Epic** — รวม feature/point ทั้งหมดของแต่ละ epic (หนึ่งไฟล์ใน `01-spec/` ต่อหนึ่ง epic เช่น
   Onboarding, Recommendation, Planner, Integration) อย่าสร้าง epic ใหม่ที่ไม่มีในเอกสาร spec
2. **ตั้ง Feature ID** — ใช้รูปแบบ `EPIC-N` เรียงตามลำดับที่ปรากฏใน spec (เช่น `ONB-1`, `REC-1`)
   เพื่อให้ trace กลับไปยัง REQ-xx และเอกสาร spec ต้นทางได้ (คงรหัสเดิมไว้เมื่อเป็นการ update ไม่เปลี่ยนเลขใหม่
   สำหรับ feature ที่มีอยู่แล้ว)

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

- `docs/01-requirements/backlog.md`
- `docs/02-design/01-prototypes/user-journeys.md`

ทั้งสองไฟล์ต้องลิงก์กลับไปยังเอกสาร spec ที่เกี่ยวข้องใน `docs/01-requirements/01-spec/` และลิงก์ถึงกันเอง
เมื่อเป็นการ update เอกสารเดิม ให้แก้เฉพาะส่วนที่เปลี่ยน คงเนื้อหาที่ยังถูกต้องไว้ ไม่ต้องเขียนใหม่ทั้งไฟล์
โดยไม่จำเป็น ห้ามแก้ไข `index.md` ของแต่ละโฟลเดอร์ — เป็นคำอธิบายโครงสร้างเท่านั้น ไม่ใช่ที่เก็บเนื้อหาจริง
