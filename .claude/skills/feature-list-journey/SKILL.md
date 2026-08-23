---
name: feature-list-journey
description: Turn a requirement spec / product backlog (epics, user stories, REQ items, MoSCoW priority) into a structured Feature List and a per-feature User Journey document for smartFit_daily. Use whenever the requirement spec or backlog under docs/requirements/ changes, or when asked to create/update Feature List or User Journey docs.
---

# Feature List & User Journey Writer

วิธีการแปลง Requirement Spec / Product Backlog ให้เป็นเอกสารสองชิ้น:
`docs/features/feature-list.md` และ `docs/features/user-journeys.md`

## Input

- `docs/requirements/product-backlog.md` (หรือ requirement spec ฉบับล่าสุดที่ผู้ใช้ให้มา) ซึ่งมี:
  - Feature List แบบสรุปภาพรวม (grouped by Epic)
  - Product Backlog เป็น user stories พร้อม MoSCoW priority (Must/Should/Could/Won't)
  - Requirement Spec เป็นข้อ REQ-xx ที่ระบุเงื่อนไขทำงานจริง

## ขั้นตอน

1. **จัดกลุ่มตาม Epic** — รวม feature/point ทั้งหมดของแต่ละ epic (เช่น Onboarding, Recommendation,
   Planner, Integration) จาก Feature List + Backlog + REQ เข้าด้วยกัน อย่าสร้าง epic ใหม่ที่ไม่มีใน input
2. **ตั้ง Feature ID** — ใช้รูปแบบ `EPIC-N` เรียงตามลำดับที่ปรากฏใน backlog (เช่น `ONB-1`, `REC-1`)
   เพื่อให้ trace กลับไปยัง REQ-xx และ user story ต้นทางได้
3. **สร้าง Feature List** (`docs/features/feature-list.md`) เป็นตารางต่อ epic โดยแต่ละแถวมี:
   Feature ID, ชื่อ feature, Priority (Must/Should/Could), REQ ที่เกี่ยวข้อง, คำอธิบายสั้น 1 บรรทัด
4. **สร้าง User Journey ต่อ feature** (`docs/features/user-journeys.md`) แต่ละ feature ต้องมี:
   - **Actor/Persona** — ใครเป็นผู้ใช้งาน (ผู้ใช้ใหม่ / ผู้ใช้ประจำ)
   - **Goal** — ทำไม user ต้องการ feature นี้ (มาจาก "เพื่อ..." ใน user story)
   - **Trigger** — อะไรทำให้ user เริ่ม flow นี้
   - **Preconditions** — เงื่อนไขก่อนหน้าที่ต้องมี (เช่น ต้องผ่าน onboarding ก่อน)
   - **Steps** — ลำดับขั้นตอนแบบ step-by-step ที่สะท้อนของจริงจาก REQ-xx (ไม่ใช่แค่ UI แต่รวม logic
     เบื้องหลัง เช่น การคำนวณ, edge case)
   - **Success State** — ผลลัพธ์เมื่อ flow สำเร็จ อ้างอิงจาก REQ ที่เกี่ยวข้อง
   - **Alt/Edge Cases** — เส้นทางย่อย เช่น ไม่มีอุปกรณ์ wearable, ไม่ถูกใจวิดีโอ, ตั้ง Rest Day
   - ใส่ diagram แบบ mermaid `flowchart` หรือ `journey` สั้น ๆ ต่อ feature เพื่อให้เห็นภาพรวม
5. **Trace ต้องครบ** — ทุก REQ-xx ในต้นฉบับต้องถูกอ้างอิงอย่างน้อยหนึ่งครั้งในทั้งสองเอกสาร
   ถ้า requirement ใดยังไม่มี feature ชัดเจนให้ระบุไว้ใน section "Open Questions" ท้ายเอกสาร แทนที่จะเดาเอง
6. **ภาษา** — เขียนเป็นภาษาไทยให้สอดคล้องกับต้นฉบับ ใช้ศัพท์เทคนิคภาษาอังกฤษได้ตามความเหมาะสม
   (เช่น streak, wearable, deficit)

## Output

- `docs/features/feature-list.md`
- `docs/features/user-journeys.md`

ทั้งสองไฟล์ต้องลิงก์กลับไปยัง `docs/requirements/product-backlog.md` และลิงก์ถึงกันเอง
