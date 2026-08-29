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
— **อัปเดต 2026-08-29 (ล่าสุดสุดสุด, `architecture-builder`)**: เพิ่ม Feature ใหม่ **ONB-0**
(Authentication — REQ-14–17: สมัครสมาชิก/เข้าสู่ระบบ/ลืมรหัสผ่าน/ออกจากระบบ) เข้า `01-spec/`/`backlog.md`/
`user-journeys.md` เมื่อวันเดียวกัน แต่ยังไม่มี Conceptual Component ใดใน `high-level-architecture.md`
ครอบคลุมเลย — เพิ่ม Component ใหม่ **"Account & Session Management" (§3.1)**, renumber component เดิม
เป็น §3.2–3.8 (รวม 8 component), ขยาย §2/§6.4 (external integration boundary ใหม่: ผู้ให้บริการยืนยัน
ตัวตนภายนอก Google/Apple ตาม REQ-14), เพิ่ม subgraph ONB-0 นำหน้า Flow 1 (Onboarding) ใน §4.1, เพิ่ม
entity **User Account** ใน §5, ปรับปรุง §7 ว่า NFR-04/06/11 ที่เคยอ้าง "เมื่อมีระบบบัญชีผู้ใช้จริง" เป็น
จริงแล้วไม่ใช่สมมติฐานอนาคต, เพิ่มจุดที่ยังไม่ได้ระบุใน §8 (ขอบเขต NFR-05 ต่อผู้ให้บริการยืนยันตัวตน), และ
เพิ่มแถวใหม่ใน §10 ภาคผนวก Stack Mapping พร้อมระบุชัดว่า `tech-stack.md` §6.1 **ยังไม่มี mapping ระดับ
operation ของ component นี้ — รอ `tech-stack-builder` ขยายในรอบถัดไป** (ไม่ใช่ gap ของ HLA เอง)
— **อัปเดต 2026-08-29 (ล่าสุดสุดสุดสุด, `api-db-spec-builder`)**: `api-spec.md`/`database-schema.md`
ตามให้ทันการเพิ่ม Component "Account & Session Management" (HLA §3.1)/entity "User Account" (HLA §5)
ข้างต้นแล้ว (เอกสารล้าหลัง ไม่ใช่ข้อขัดแย้ง) — `api-spec.md` เพิ่มหัวข้อ **3.1 Account & Session
Management** (8 operations: `POST /auth/signup/{email,google,apple}`,
`POST /auth/login/{email,google,apple}`, `POST /auth/forgot-password`, `POST /auth/logout` — แยก
endpoint ต่อวิธีสมัคร/เข้าสู่ระบบ ยืนยันจากผู้ใช้ 2026-08-29) แล้ว renumber หัวข้อเดิม 3.1–3.7 → 3.2–3.8;
`database-schema.md` เพิ่มตาราง **`user_account`** (หัวข้อ 3.1 ใหม่ แบบ "thin identity anchor" ยืนยันจาก
ผู้ใช้ 2026-08-29 — เก็บ `signup_method`/`email`/`credential_reference`/`external_provider_reference`/
`created_at` เท่านั้น **ไม่ persist session status** เพราะเป็นข้อมูล ephemeral) พร้อม FK ใหม่
`user_profile.user_account_id` (1:1) แล้ว renumber ตารางเดิม 3.1–3.15 → 3.2–3.16 — ทั้งสองไฟล์เพิ่ม
จุดที่ยังไม่ได้ระบุใหม่ (email verification, password policy, session timeout, ขอบเขต NFR-05, account
enumeration, การชนกันของอีเมลข้ามผู้ให้บริการ) และปรับภาคผนวก Stack Mapping ให้ระบุว่า operation/ตารางใหม่
นี้ยังไม่มี mapping ทางการใน `tech-stack.md` §6.1/§6.3 (จุดเดียวกับที่ HLA §10 ทิ้งไว้) — ระหว่างแก้ พบและ
แก้ cross-reference ล้าหลังจุดหนึ่งใน `database-schema.md` §4 ที่ยังอ้าง "HLA หัวข้อ 3.1" สำหรับ
Personalization & Profile (ที่จริงคือ HLA หัวข้อ 3.2 หลัง renumber) ด้วย
— **อัปเดต 2026-08-29 (ล่าสุดสุดสุดสุดสุด, `detailed-design-builder`)**: `detailed-design/01-onboarding-personalization.md`
ตามให้ทันการเพิ่ม Component "Account & Session Management" (HLA §3.1)/8 operations ใน `api-spec.md` §3.1/
ตาราง `user_account` ข้างต้นแล้ว (เอกสารล้าหลัง ไม่ใช่ข้อขัดแย้ง) — เพิ่ม section ใหม่ **ONB-0** (ก่อน
ONB-1) พร้อม 3 sequence diagram แยกตามที่ผู้ใช้ยืนยัน (สมัครสมาชิก / เข้าสู่ระบบ+ลืมรหัสผ่าน / ออกจากระบบ)
— ไม่มี state diagram (session เป็น ephemeral ไม่ persist เป็น column ตาม `database-schema.md` §3.1 —
ไม่ใช่ state transition ที่มี `enum` รองรับ, ยืนยันกับผู้ใช้แล้ว) และไม่มี algorithm section (REQ-14–17
ไม่ใช่ feature เชิงคำนวณ) — เพิ่ม `Note` บอก precondition ของ ONB-0 ในไดอะแกรมเดิมของ ONB-1, แก้เลขหัวข้อ
HLA/API Spec ที่ renumber แล้วซึ่งค้างอยู่ในหัวข้อ "ความสัมพันธ์กับเอกสารอื่น" (Personalization & Profile
§3.1→§3.2), และเพิ่มแถว "Account & Session Management" ในภาคผนวก Stack Mapping พร้อม ⚠️ เดียวกับที่ HLA
§10/`api-spec.md` §6 ทิ้งไว้ (ยืนยันแล้วว่า `tech-stack.md` §6.1 ยังไม่มีแถวนี้จริง) — audit เนื้อหาเดิมของ
ONB-1/2/3 แล้วไม่พบ drift อื่นนอกจากเลขหัวข้อที่ค้าง
— **อัปเดต 2026-08-29 (ล่าสุดสุดสุดสุดสุดสุด, `tech-stack-builder`)**: sync `tech-stack.md` ให้ครอบคลุม
Component ใหม่ **"Account & Session Management" (ONB-0)** ที่ทั้ง 4 ไฟล์ข้างต้นทิ้ง ⚠️ ไว้รอ — เป็นการ
**mechanical mapping ของ component/operation ที่มีอยู่แล้วจริงไปสู่ Firebase ที่เลือกไว้แล้ว ไม่ใช่การเลือก
เทคโนโลยีใหม่** จึงไม่ต้องรัน Discovery Questionnaire ซ้ำ: เพิ่มแถวแรกในหัวข้อ 6.1 สรุปว่า `user_account`
(thin identity anchor) **ไม่ต้องมี Firestore document แยกเลย** เพราะ field ทั้งหมด map ตรงกับ Firebase
Auth's `UserRecord` เอง (`id`=UID เดียวกับ `users/{userId}`, `signup_method` derive จาก `providerData`,
`credential_reference` ไม่มี field ให้เข้าถึงเพราะ Firebase Auth เก็บเองภายใน ฯลฯ); เพิ่มหัวข้อย่อย 6.3.1
ใหม่ mapping ทั้ง 8 operation ของ `api-spec.md` §3.1 — พบว่า 7 ใน 8 เป็น **client SDK call ตรง** (ต่างจาก
component อื่นทุกตัวที่ต้องเป็น Cloud Function ทั้งหมดเพราะ Firestore ไม่มี auto-generated API — Firebase
Auth มี client SDK ให้ใช้ตรงอยู่แล้ว) มีเพียง `POST /auth/forgot-password` ที่ต้องเป็น Cloud Function
`forgotPassword` เพื่อ enforce เงื่อนไข `422`; เพิ่มเหตุผลในหัวข้อ 4 และจุดที่ยังไม่ได้ตัดสินใจใหม่ 3 ข้อใน
หัวข้อ 7 (Firebase OAuth client setup, NFR-11 audit trail mechanism, account merge ข้ามวิธีสมัคร — ทั้งหมด
ไม่กระทบตัวเลือก stack) — **ผลกระทบต่อเอกสารอื่น**: ภาคผนวก Stack Mapping ของ HLA §10, `api-spec.md` §6,
`database-schema.md` §8.2, และ `detailed-design/01-onboarding-personalization.md` ยัง**ค้าง ⚠️ เดิมอยู่ —
stale ไปแล้วหลัง sync รอบนี้** ต้องรัน `architecture-builder`/`api-db-spec-builder`/
`detailed-design-builder` ตามลำดับเพื่อ sync ภาคผนวกแต่ละไฟล์ต่อ (mechanical re-sync ไม่ใช่ ask-user)
— **อัปเดต 2026-08-29 (ล่าสุดสุดสุดสุดสุดสุดสุด, `architecture-builder`)**: sync แถว "Account & Session
Management" ในภาคผนวก Stack Mapping (HLA §10) ให้ตรงกับ `tech-stack.md` §6.1/§6.3.1 ฉบับสมบูรณ์แล้ว —
แทนที่ ⚠️ placeholder เดิมด้วยรายละเอียดจริง (ไม่ต้องมี Firestore document แยกสำหรับ `user_account`, map
ตรงกับ Firebase Auth's `UserRecord`; 7 ใน 8 operation เป็น client SDK call ตรง มีแค่
`POST /auth/forgot-password` ที่เป็น Cloud Function `forgotPassword`) — mechanical re-sync ล้วนๆ ไม่แตะ
เนื้อหาหลัก §1-9 — ภาคผนวก Stack Mapping ของ `api-spec.md` §6, `database-schema.md` §8.2, และ
`detailed-design/01-onboarding-personalization.md` ยังค้าง ⚠️ เดิมอยู่ ต้องรัน `api-db-spec-builder`/
`detailed-design-builder` ต่อเพื่อ sync ส่วนที่เหลือ
— **อัปเดต 2026-08-29 (ล่าสุดสุดสุดสุดสุดสุดสุดสุด, `api-db-spec-builder`)**: sync ภาคผนวก Stack Mapping
ของ `api-spec.md` §6.3.1 ให้ตรงกับ `tech-stack.md` §6.3.1 ฉบับสมบูรณ์แล้ว (7 ใน 8 operation เป็น client SDK
call ตรง มีแค่ `POST /auth/forgot-password` เป็น Cloud Function `forgotPassword`) — mechanical re-sync
ล้วนๆ — **`database-schema.md` §8.2/§8.3 แถว `user_account` ยังค้าง ⚠️ placeholder เดิมอยู่** (ยังไม่ sync)
ต้องรัน `api-db-spec-builder` ต่อสำหรับไฟล์นั้นโดยเฉพาะ
— **อัปเดต 2026-08-29 (ล่าสุดที่สุด, `detailed-design-builder`)**: sync แถว "Account & Session Management"
ในภาคผนวก Stack Mapping ของ `detailed-design/01-onboarding-personalization.md` ให้ตรงกับ `tech-stack.md`
§6.1/§6.3.1 ฉบับสมบูรณ์แล้ว — แทนที่ ⚠️ placeholder เดิมด้วยรายละเอียดจริง (per-field mapping กับ Firebase
Auth's `UserRecord` + operation-level mapping: 7 ใน 8 client SDK ตรง, `forgot-password` เป็น Cloud
Function `forgotPassword`) — พิจารณาแล้วว่าไม่จำเป็นต้องเพิ่มหมายเหตุ client SDK vs Cloud Function ลงใน
sequence diagram หลักทั้ง 3 ไดอะแกรมของ ONB-0 เพราะไม่กระทบความถูกต้องเชิง conceptual (diagram ใช้
Conceptual Component เดียวอยู่แล้ว) — mechanical re-sync ล้วนๆ ไม่แตะเนื้อหาหลักอื่นของไฟล์ — คงเหลือเพียง
`database-schema.md` §8.2/§8.3 ที่ยังค้าง ⚠️ ให้ `api-db-spec-builder` sync ต่อ
— **อัปเดต 2026-08-29 (ปิดท้าย, `api-db-spec-builder`)**: sync ⚠️ placeholder ที่เหลือสุดท้ายในเชนนี้แล้ว
เสร็จสมบูรณ์ — `api-spec.md` เพิ่มหัวข้อย่อย **6.3.1** (operation-level mapping ของ 8 operation ในหัวข้อ 3.1
มิเรอร์จาก `tech-stack.md` §6.3.1: 7 ใน 8 เป็น client SDK call ตรง มีแค่ `POST /auth/forgot-password` เป็น
Cloud Function `forgotPassword`) และ `database-schema.md` แก้แถว `user_account` ในหัวข้อ 8.2 (มิเรอร์จาก
`tech-stack.md` §6.1: ไม่มี Firestore document แยก map ตรงกับ Firebase Auth's `UserRecord` ทุก field) พร้อม
sync แถว signup-method-conditional required fields ในหัวข้อ 8.3 ให้สอดคล้องกัน (ไม่ต้องมี Cloud Function
บังคับเพิ่มนอกจาก `forgotPassword`) — mechanical re-sync ล้วนๆ ไม่แตะเนื้อหาหลักหัวข้อ 1-5 ของ `api-spec.md`
และหัวข้อ 1-7 ของ `database-schema.md` — **ตอนนี้ภาคผนวก Stack Mapping ของ HLA/API Spec/Database Schema/
Detailed Design ทั้งหมด sync กับ `tech-stack.md` §6.1/§6.3.1 ฉบับสมบูรณ์ครบทุกไฟล์แล้ว ไม่มี ⚠️ placeholder
ค้างในเชนของ Component "Account & Session Management" อีก**
