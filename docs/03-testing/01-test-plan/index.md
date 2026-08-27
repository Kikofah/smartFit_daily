# 01 - Test Plan

เก็บ **แผนการทดสอบ (Test Plan)** เช่น

- Test case / test scenario ของแต่ละฟีเจอร์
- Test data ที่ใช้ทดสอบ
- ขอบเขตที่ทดสอบ (in scope) และไม่ทดสอบ (out of scope)

อ้างอิงจากพิมพ์เขียวเชิงเทคนิคใน [[../../02-design/02-technical/index|02-technical]] ผลการทดสอบจริงบันทึกต่อใน [[../02-test-result/index|02-test-result]]

`test-plan.md` (ไฟล์เดียวทั้งโปรเจกต์) และโฟลเดอร์ `test-cases/{epic-slug}.md` (หนึ่งไฟล์ต่อ epic) ในนี้
สร้าง/อัปเดตโดย skill `test-suite-builder` (`.claude/skills/test-suite-builder/SKILL.md`) เท่านั้น —
รับข้อมูลจาก `../../01-requirements/backlog.md`, `../../01-requirements/acceptance-criteria.md`, และ
`../../02-design/01-prototypes/user-journeys.md`
