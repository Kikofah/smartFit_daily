# 01 - Requirements

รวมเอกสารทุกอย่างที่เกี่ยวกับ **ความต้องการของโปรเจกต์** ตั้งแต่ต้นน้ำถึงปลายน้ำ แบ่งเป็น 3 หมวดย่อยตามลำดับการไหลของงาน:

- [[01-spec/index|01-spec]] — ข้อกำหนด/สเปคของระบบ (อะไรที่ต้องมี)
- [[02-plan/index|02-plan]] — แผนงานและ roadmap (จะทำเมื่อไหร่ ทำอย่างไร)
- [[03-task/index|03-task]] — งานย่อยที่แตกออกมาให้ลงมือทำได้จริง (ทำทีละอย่างอย่างไร)

โฟลเดอร์นี้คือจุดเริ่มต้นของทุกโปรเจกต์ ก่อนจะต่อยอดไปสู่การออกแบบใน [[../02-design/index|02-design]]

`backlog.md` และ `acceptance-criteria.md` ในโฟลเดอร์นี้เป็นไฟล์เดี่ยว (ไม่ใช่โฟลเดอร์ย่อย) —
`acceptance-criteria.md` คือ Acceptance Criteria แบบ Given-When-Then ต่อ backlog item สร้าง/อัปเดตโดย
skill `test-suite-builder` (`.claude/skills/test-suite-builder/SKILL.md`) เท่านั้น
