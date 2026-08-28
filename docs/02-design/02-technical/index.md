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
ที่เอกสาร stack-specific อื่น (database schema, API design, tech choices) จะถูกเพิ่มเข้าโฟลเดอร์นี้ใน
อนาคต
