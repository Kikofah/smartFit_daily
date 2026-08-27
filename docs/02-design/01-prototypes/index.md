# 01 - Prototypes

เก็บ **ต้นแบบหน้าตาของระบบ (UI/UX Prototype)** เช่น

- Wireframe / mockup ของแต่ละหน้าจอ
- User flow และ navigation flow
- Design system เบื้องต้น เช่น สี ฟอนต์ คอมโพเนนต์หลัก

ใช้สำหรับสื่อสารและตกลงหน้าตาของระบบก่อนลงมือพัฒนาจริง โดยอ้างอิงความต้องการจาก [[../../01-requirements/01-spec/index|01-spec]] และส่งต่อรายละเอียดเชิงระบบให้ [[../02-technical/index|02-technical]]

`user-journeys.md` ในโฟลเดอร์นี้คือ user flow ของทุก feature ใน smartFit_daily ในรูปแบบ Mermaid diagram
พร้อม mapping กลับไปยัง requirement แต่ละข้อใน [[../../01-requirements/01-spec/index|01-spec]]

`DESIGN.md` ในโฟลเดอร์นี้คือ Design System (Brand Identity & CI, Design Tokens, UI Components & Patterns,
UX Guidelines & Rules) โทน Earth Tone + Minimalist + Muji-inspired — ใช้เป็นแหล่งอ้างอิงเดียวก่อนออกแบบ
หน้าจอ/component ใหม่

โฟลเดอร์ย่อย `v1/`, `v2/`, ... ในโฟลเดอร์นี้คือ HTML prototype แบบมีเวอร์ชัน สร้าง/อัปเดตโดย skill
`prototype-builder` (`.claude/skills/prototype-builder/SKILL.md`) เท่านั้น — แต่ละ version รวม
Requirement + Backlog/Feature List + User Journey + DESIGN.md เข้าด้วยกัน อย่าสร้าง/แก้ไฟล์ในโฟลเดอร์
เหล่านี้ด้วยมือโดยตรง
