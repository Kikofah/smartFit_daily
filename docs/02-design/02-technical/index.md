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
`high-level-architecture.md` อยู่ก่อนเสมอ

`detailed-design/{NN}-{epic-slug}.md` (หนึ่งไฟล์ต่อ epic, เลข 2 หลักนำหน้าเรียงตามลำดับ Epic เดียวกับ
`01-spec/`) ในโฟลเดอร์นี้คือชั้นถัดจาก `api-spec.md`/
`database-schema.md` หนึ่งระดับ — **Detailed Design** เชิง conceptual: Sequence Diagram (บังคับทุก
feature), State Diagram (สำหรับ entity ที่มี state transition มีความหมาย), และอัลกอริทึมหลัก (สำหรับ
feature ที่มีการคำนวณ) — ยังคง**ไม่ผูกมัดกับ technical stack จริง** (ไม่ต้องมีข้อยกเว้นเพิ่มเพราะ sequence/
state diagram และ pseudocode เป็นกลางทางเทคโนโลยีอยู่แล้ว) สร้าง/อัปเดต/audit โดย skill
`detailed-design-builder` (`.claude/skills/detailed-design-builder/SKILL.md`) เท่านั้น — ต้องมีครบทั้ง
`high-level-architecture.md`, `api-spec.md`, และ `database-schema.md` อยู่ก่อนเสมอ

`tech-stack.md` ในโฟลเดอร์นี้คือ**เอกสารเดียวที่ stack-specific จริง** — ระบุชื่อเทคโนโลยีจริง (mobile
framework, backend, DBMS, cloud provider, การเชื่อมต่อ third-party) แทนที่จะเป็น conceptual เหมือน
เอกสารอื่นทั้งหมดในโฟลเดอร์นี้ สร้าง/อัปเดต/audit โดย skill `tech-stack-builder`
(`.claude/skills/tech-stack-builder/SKILL.md`) เท่านั้น ซึ่งจะถามผู้ใช้แบบเข้มข้น (Discovery
Questionnaire) ก่อนแนะนำเสมอ — ต้องมีครบทั้ง `high-level-architecture.md`, `api-spec.md`,
`database-schema.md`, และ `detailed-design/*.md` อยู่ก่อนเสมอ ปัจจุบัน (อัปเดต 2026-08-29) เลือก React
Native + Expo (mobile/web client) กับ **Firebase** (Cloud Firestore + Cloud Functions + Firebase
Authentication + Firebase Hosting) เป็น backend/database — เปลี่ยนจาก Supabase/PostgreSQL เดิมตามคำขอ
ของผู้ใช้งานโดยตรง (ไม่ใช่ผลจาก Discovery Questionnaire/Weighted Scoring Model เดิม ดู
`tech-stack.md` §2/§5)

**ภาคผนวก: Stack Mapping** (เพิ่ม 2026-08-28): `high-level-architecture.md`, `api-spec.md`,
`database-schema.md`, และแต่ละไฟล์ใน `detailed-design/` ทุกไฟล์มี section ท้ายไฟล์ชื่อ "ภาคผนวก: Stack
Mapping" เป็นข้อยกเว้นเดียวในเนื้อหาแต่ละไฟล์ที่อนุญาตให้มีชื่อเทคโนโลยีจริงได้ — มิเรอร์เนื้อหาจาก
`tech-stack.md` § Mapping จาก Conceptual Docs → Concrete Stack เท่านั้น (ไม่ใช่แหล่งที่มาจริง) สร้าง/
อัปเดตโดย skill เจ้าของไฟล์นั้นๆ เอง (ไม่ใช่ `tech-stack-builder`) และ**เฉพาะเมื่อ** `tech-stack.md` มีอยู่
แล้ว — ถ้ายังไม่มีให้ข้ามไปทั้งหมด ไม่ถือเป็น gap **สถานะปัจจุบัน (2026-08-29): ภาคผนวกของ
`high-level-architecture.md`, `api-spec.md`, และ `database-schema.md` sync กับ `tech-stack.md`
§6.1/§6.2/§6.3 ฉบับ Firebase แล้วทั้งหมด** — `database-schema.md` เลือกแนวทาง **Hybrid** ตามที่ผู้ใช้ยืนยัน
(2026-08-29): เนื้อหาหลักหัวข้อ 1-7 (ER Diagram, ตาราง 15 ตาราง, logical type, relational relationships)
**ไม่เปลี่ยนแปลง** ยังคงเป็น conceptual/relational model เดิมทั้งหมด เพราะ HLA §5 ไม่เปลี่ยน — ส่วนหัวข้อ 8
(ภาคผนวก: Stack Mapping) ขยายเพิ่ม 2 หัวข้อย่อยนอกเหนือจาก logical-type mapping ปกติ คือ **8.2 Table →
Firestore Collection/Document Mapping** (per-table ว่าควรเป็น top-level collection/subcollection/embedded
field) และ **8.3 FK/Constraint Enforcement Migration** (กติกาที่เคย enforce ด้วย FK/constraint ย้ายไป
Cloud Function ไหน อ้าง HLA component เจ้าของ) — **อัปเดต 2026-08-29 (ล่าสุด): `tech-stack.md` §6.1 sync
ให้ละเอียดตรงกับ `database-schema.md` §8.2/§8.3 แล้ว** (per-table Firestore collection/document mapping +
FK/constraint enforcement migration, รวมถึงกติกาใหม่ referential existence validation ที่ผูกกับ NFR-12) —
เป็นการ mechanical re-sync ข้อเท็จจริงที่ตัดสินใจแล้วที่อื่น ไม่ใช่การเปลี่ยนตัวเลือก stack จริงใหม่ จึงทำ
โดยไม่ต้องรัน Discovery Questionnaire ซ้ำ — ภาคผนวกของ
`detailed-design/*.md` ทั้ง 4 epic ก็ sync กับ `tech-stack.md` §6.1 ฉบับ Firebase แล้วเช่นกัน (อัปเดต
2026-08-29 โดย `detailed-design-builder` — ใช้ชื่อ Cloud Function เดียวกับ HLA §10:
`profileUpdate`/`sessionComplete`/`cheatRest`/`recommendation`/`forecast`/`integrations`) — audit
เนื้อหาหลัก (sequence/state diagram/algorithm) ของทั้ง 4 ไฟล์แล้วไม่พบ drift อื่นที่เกี่ยวกับ Firebase**
— **อัปเดต 2026-08-29 (ล่าสุด)**: แก้ถ้อยคำล้าหลังใน `tech-stack.md` §7 ข้อ 1 และ §8 ที่ยังเขียนว่า
`database-schema.md`/ภาคผนวก Stack Mapping ของ HLA/API Spec/Detailed Design "ยังต้องทำ"/"stale" ให้ตรงกับ
สถานะจริงว่า sync/ออกแบบเสร็จสมบูรณ์แล้วทุกไฟล์ (cosmetic wording แก้เองได้ ไม่กระทบตัวเลือก stack จริง)
— **อัปเดต 2026-08-29 (ล่าสุดสุด, `architecture-builder`)**: audit เต็มรูปแบบเทียบ `backlog.md`
ฉบับที่เพิ่งเพิ่ม 2 แถวในตาราง NFR Traceability (NFR-12→REC-2/INT-3, NFR-13→INT-1) พบว่า HLA §1/§7 sync
ครบแล้วจากรอบก่อนหน้า แต่พบว่า**หัวข้อ 10 (ภาคผนวก: Stack Mapping) เองล้าหลังไปอีกชั้น** — ยังอ้างเวอร์ชัน
เบื้องต้นของ `tech-stack.md` §6.1 ทั้งที่ `tech-stack-builder` ปรับให้ละเอียดระดับ per-table/collection ไป
แล้วในรอบ sync ก่อนหน้านี้ (บรรทัดด้านบน) จัดเป็น "Stack Mapping Appendix freshness" (มิเรอร์ข้อเท็จจริงที่
ตัดสินใจแล้วที่อื่น) แก้ได้เองไม่ต้องถามผู้ใช้ — เขียนหัวข้อ 10 ใหม่ให้ตรงกับ §6.1 ฉบับละเอียดปัจจุบันแล้ว
เนื้อหาหลักหัวข้อ 1-9 ของ HLA ไม่พบ drift อื่น
