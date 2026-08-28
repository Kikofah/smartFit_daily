# 02 - Technical

เก็บเอกสาร **การออกแบบเชิงเทคนิค (Technical Design)** เช่น

- System architecture / โครงสร้างระบบโดยรวม
- Database schema
- API design / data contract
- เทคโนโลยีและไลบรารีที่เลือกใช้ พร้อมเหตุผล

เอกสารในโฟลเดอร์นี้คือพิมพ์เขียวที่ทีมพัฒนาใช้อ้างอิงตอนลงมือเขียนโค้ด และเป็นฐานในการวางแผนทดสอบใน [[../../03-testing/01-test-plan/index|01-test-plan]]

`high-level-architecture.md` ในโฟลเดอร์นี้คือ **High Level Architecture เชิง conceptual** — system
context, conceptual components/modules, data flow ตาม user journey, conceptual data entities, และ
external integration boundaries — **ยังไม่ผูกมัดกับ technical stack ใดๆ** สร้าง/อัปเดต/audit โดย skill
`architecture-builder` (`.claude/skills/architecture-builder/SKILL.md`) เท่านั้น เป็นพื้นฐานที่ต้องมีก่อน
ที่เอกสารชั้นถัดไปในโฟลเดอร์นี้จะถูกสร้าง

`api-spec.md` และ `database-schema.md` ในโฟลเดอร์นี้คือชั้นถัดจาก `high-level-architecture.md` หนึ่งระดับ
— **API Spec** (REST-style convention เป็นภาษากลาง) และ **Database Schema** (logical/relational data
model พร้อม ER Diagram) — ยังคง**ไม่ผูกมัดกับ technical stack จริง** (ไม่มีชื่อ framework/DBMS/cloud
provider) ยกเว้น REST convention และ logical data type ที่ยืนยันแล้วว่าอนุญาต สร้าง/อัปเดต/audit โดย
skill `api-db-spec-builder` (`.claude/skills/api-db-spec-builder/SKILL.md`) เท่านั้น — ต้องมี
`high-level-architecture.md` อยู่ก่อนเสมอ เป็นพื้นฐานก่อนที่เอกสาร stack-specific จริง (tech choices เมื่อ
ทีมเลือก stack) จะถูกเพิ่มเข้าโฟลเดอร์นี้ในอนาคต
