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

`tech-stack.md` ในโฟลเดอร์นี้คือ**เอกสารเดียวที่ stack-specific จริง** — ระบุชื่อเทคโนโลยีจริง (mobile/web
framework, backend, DBMS, cloud provider, การเชื่อมต่อ third-party) แทนที่จะเป็น conceptual เหมือน
เอกสารอื่นทั้งหมดในโฟลเดอร์นี้ สร้าง/อัปเดต/audit โดย skill `tech-stack-builder`
(`.claude/skills/tech-stack-builder/SKILL.md`) เท่านั้น ซึ่งจะถามผู้ใช้แบบเข้มข้น (Discovery
Questionnaire) ก่อนแนะนำเสมอ — ต้องมีครบทั้ง `high-level-architecture.md`, `api-spec.md`,
`database-schema.md`, และ `detailed-design/*.md` อยู่ก่อนเสมอ ปัจจุบัน (อัปเดต 2026-08-30) เลือก **React +
Vite** (`apps/web/client/`, เว็บ, ครอบคลุม core loop ทั้งหมด) + **React Native + Expo** (`apps/mobile/`,
ตัดขอบเขตเหลือเฉพาะ INT-2/INT-3) เป็น client, **Express.js (TypeScript)** บน **Google Cloud Run** เป็น
backend/hosting (แทนที่ Firebase Cloud Functions + Firebase Hosting เดิม) กับ **Cloud Firestore +
Firebase Authentication** (ไม่เปลี่ยนจากการตัดสินใจ 2026-08-29) เป็น database/auth และ **Google Gemini**
(`@google/genai`, model `gemini-3.6-flash`, เพิ่ม 2026-08-31) เป็นขั้นตอนเสริมของ YouTube Data API v3
สำหรับ ranking/ประเมินความเข้มข้นวิดีโอใน Content Recommendation — ดูรายละเอียดการ reconcile ล่าสุดที่
`tech-stack.md` §2/§5/§6

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
— **อัปเดต 2026-08-30 (`architecture-builder`)**: Architecture Consistency Audit ตาม `feature-list-journey`
ที่เพิ่งพบ 2 จุดล้าหลังใน `high-level-architecture.md` จาก codebase จริง (re-architecture เป็น Express +
web-first) — แก้ทั้งคู่ผ่าน flow ปกติ: (1) ระบุชัดว่าเว็บไคลเอนต์เป็นทางเข้าเดียวของ credential-based auth
(§3.1, §4.1) (2) เพิ่มกลไก pairing-code/identity handoff ใหม่ (Account & Session Management ↔ Integration
Gateway) เป็น component interaction (§3.1, §3.8), data flow ใหม่ใน Flow 5 (§4.5), conceptual data entity
**Pairing Credential** (§5), และหมายเหตุ NFR/open point (§7, §8) — **ไม่แตะภาคผนวก Stack Mapping (§10)**
รอบนี้เพราะ `tech-stack.md` เองยังไม่ได้อัปเดตจาก Firebase Cloud Functions/React Native-Expo เดิมตาม
CLAUDE.md (ต้องรอ `tech-stack-builder`) — ดู log [2026-08-30](../../05-log/20260830-log.md)
— **อัปเดต 2026-08-30 (`api-db-spec-builder`)**: API & Database Consistency Audit ตาม `architecture-builder`
ที่เพิ่งเพิ่มกลไก pairing-code/identity handoff (§4.5) และ entity **Pairing Credential** (§5) ข้างต้น — พบ
2 จุดล้าหลัง แก้ผ่าน flow ปกติทั้งคู่: (1) `api-spec.md` §2 (Conventions, Authentication) เคยระบุว่า "ไม่มี
endpoint ใดที่ยกเว้น" การยืนยันตัวตนก่อนเรียก — แก้ให้ตรงกับ operation ใหม่ (2) เพิ่ม 2 operation ใหม่ท้าย
`api-spec.md` §3.1 (`POST /auth/pairing-codes` ขอรหัสจับคู่อุปกรณ์, `POST /auth/pairing-codes/redeem`
แลกรหัสเป็น session — operation เดียวในเอกสารที่ไม่ต้องยืนยันตัวตนก่อนเรียก พร้อม error case `404`/`409`/
`422`) และเพิ่มตารางใหม่ `pairing_credential` (§3.17) ใน `database-schema.md` พร้อม entity/relationship ใน
ER Diagram (§2), กติกา single-use/short-lived ใน §4 (ระบุชัดว่าตารางนี้ไม่ได้อยู่ใต้ per-user isolation
path เหมือนตารางอื่น — query หลักคือ `code`), และหมายเหตุ pattern ใน §5 — **ไม่แตะภาคผนวก Stack Mapping**
ของทั้งสองไฟล์ (`api-spec.md` §6, `database-schema.md` §8) รอบนี้เช่นเดียวกับ HLA เพราะเหตุผลเดียวกัน (รอ
`tech-stack-builder`) — ผลกระทบต่อเนื่อง: `detailed-design/04-smart-integrations.md` ยังไม่มี sequence
diagram รองรับ 2 operation ใหม่นี้ ต้องรัน `detailed-design-builder` ต่อ — ดู log
[2026-08-30](../../05-log/20260830-log.md)
— **อัปเดต 2026-08-30 (`detailed-design-builder`)**: Detailed Design Consistency Audit ตาม
`api-db-spec-builder` ข้างบน — เพิ่ม section ใหม่ **"Identity Handoff — Pairing-Code Mechanism"** (1
sequence diagram, alt block ครบ 3 edge case `404`/`409`/`422`) ก่อน INT-2 ใน
`detailed-design/04-smart-integrations.md` พร้อม `Note` precondition ในไดอะแกรมเดิมของ INT-2/INT-3 — และ
แก้ `detailed-design/01-onboarding-personalization.md` ให้ระบุ actor ของ ONB-0 ทั้ง 3 sequence diagram ให้
ชัดว่าเป็นเว็บไคลเอนต์เท่านั้น (แก้ความกำกวมเดิมที่ใช้ `ผู้ใช้` เฉยๆ) — audit ยืนยันว่า "Firebase Cloud
Function" ที่ปรากฏในทั้ง 4 ไฟล์ epic ทั้งหมดอยู่ใน "ภาคผนวก: Stack Mapping" เท่านั้น ไม่มี main-body
violation — **ไม่แตะภาคผนวก Stack Mapping ทั้ง 4 ไฟล์** รอบนี้เช่นเดียวกับ HLA/API Spec/Database Schema
เพราะเหตุผลเดียวกัน (รอ `tech-stack-builder`) — ดู log [2026-08-30](../../05-log/20260830-log.md)
— **อัปเดต 2026-08-30 (`tech-stack-builder`)**: Tech Stack Consistency Audit + Reconciliation ที่ทุก
skill ข้างบนรอมาตลอดวันนี้ — audit ยืนยันว่าโค้ดจริงเปลี่ยนตัวเลือก stack จริง 3 จุด (Backend compute
engine: Firebase Cloud Functions → **Express.js**; Hosting/Infra: Firebase Hosting → ต้องเลือกใหม่;
Client split: 1 codebase RN+Expo คุม 3 แพลตฟอร์ม → 2 codebase แยก **React+Vite** (`apps/web`) กับ
**RN+Expo ตัดขอบเขต** (`apps/mobile`, เหลือ INT-2/INT-3)) จึงถาม mini Discovery Questionnaire เฉพาะหมวด
Hosting/Infra ก่อนแก้ (Backend/Client split เป็นข้อเท็จจริงที่ทีมตัดสินใจไปแล้วในโค้ด ไม่ต้องถามซ้ำ) —
ผู้ใช้ยืนยัน **Google Cloud Run** (เทียบกับ Render/Fly.io/VM — ADC ไม่ต้องมี service account key file,
autoscale-to-zero, container image เดียวครอบคลุม Express+built client) — แก้ `tech-stack.md` §2-8: remap
ทุก "Cloud Function" → Express route จริง (`apps/web/server/routes/*/index.ts`), เพิ่ม Web/Client row
ใหม่, เพิ่ม mapping กลไก pairing-code (Firestore `pairingCodes/{code}` top-level ไม่ใช่ใต้ `users/`, TTL 5
นาที, `auth.createCustomToken`/`signInWithCustomToken` — หมายเหตุว่า implementation จริงใช้ delete-on-
redeem แทน `is_used` flag ที่ `database-schema.md` §3.17 ออกแบบไว้), แก้จำนวน operation ของ Account &
Session Management จาก 8 เป็น **10**, แก้ข้อ 5 ในหัวข้อ 7 ที่เคยบอกว่า Epic 4 ทั้งหมด mobile-only (จริงๆ
มีแค่ INT-2/INT-3 — INT-1 อยู่ apps/web แล้ว), เพิ่มจุดที่ยังไม่ได้ตัดสินใจใหม่ (Cloud Run cold start กับ
NFR-02, Dockerfile/CI deploy step ยังไม่มี, pairing-code redeem status code ไม่ตรงกับ `api-spec.md`) —
**ผลกระทบต่อเอกสารอื่น**: ภาคผนวก Stack Mapping ทั้ง 4 จุด (HLA §10, `api-spec.md` §6, `database-schema.md`
§8, ทุกไฟล์ใน `detailed-design/`) **stale อีกครั้ง** ด้วยเหตุผลเดียวกันทั้งหมด (ยังอ้าง Cloud Function เดิม
+ ไม่มี pairing-code mapping + `api-spec.md`/`01-onboarding-personalization.md` ยังนับ 8 ไม่ใช่ 10
operation) — ควรรัน `architecture-builder` → `api-db-spec-builder` → `detailed-design-builder` ตามลำดับ
เพื่อ mechanical re-sync ต่อ (ไม่ใช่ ask-user) — ดู log [2026-08-30](../../05-log/20260830-log.md)
— **อัปเดต 2026-08-30 (`architecture-builder`, Stack Mapping re-sync)**: sync **HLA §10 (ภาคผนวก: Stack
Mapping)** ให้ตรงกับ `tech-stack.md` §6.1/§6.2/§6.3/§6.3.1 ฉบับ Express.js/Google Cloud Run ที่
`tech-stack-builder` เพิ่ง reconcile ข้างบน — เปลี่ยนทุก "Cloud Function `{ชื่อ}`" เป็น Express route จริง,
เพิ่ม mapping กลไก pairing-code (top-level collection `pairingCodes/{code}`, TTL 5 นาที, delete-on-redeem,
`auth.createCustomToken`) เข้าแถว Account & Session Management, แก้จำนวน operation จาก 8 เป็น 10 — เป็น
mechanical re-sync ล้วนๆ ไม่แตะเนื้อหาหลัก §1-9 (ถูกต้องอยู่แล้วจากรอบก่อน) — **ยังเหลือ**: `api-spec.md` §6,
`database-schema.md` §8.2/§8.3, และทุกไฟล์ใน `detailed-design/` ยังค้างอ้าง Cloud Function เดิม/นับ 8
operation — ควรรัน `api-db-spec-builder` → `detailed-design-builder` ต่อเพื่อ sync ส่วนที่เหลือ — ดู log
[2026-08-30](../../05-log/20260830-log.md)
— **อัปเดต 2026-08-30 (`api-db-spec-builder`, reconcile + Stack Mapping re-sync)**: อ่าน
`apps/web/server/routes/pairing/index.ts` ตรงยืนยันพฤติกรรมจริงแล้วแก้ **เนื้อหาหลัก** ของ `api-spec.md`/
`database-schema.md` 2 จุด (ไม่ใช่แค่ภาคผนวก — ตามที่ `tech-stack.md` §7 ข้อ 8 flag ไว้ว่าเป็น discrepancy
จริง): (1) `api-spec.md` §3.1 — แก้ error case ของ `POST /auth/pairing-codes/redeem` จาก 3 กรณีแยก
(`404`/`409`/`422`) เป็น **`410 Gone` กรณีเดียว** เพราะโค้ดจริงลบ document ทิ้งทันทีหลัง redeem สำเร็จ
(delete-on-redeem) ทำให้ 3 กรณีแยกไม่ออกจากกันอีกต่อไป — เพิ่ม `410` เข้ารายการ status code ของหัวข้อ 2 ด้วย
(2) `database-schema.md` §3.17 — **ลบ column `is_used` boolean** ออกจากตาราง `pairing_credential` (และ ER
Diagram §2, กติกาธุรกิจ §4 ข้อ 8) เพราะ implementation จริงใช้ delete-on-redeem แทนการตั้ง flag — ทั้งสอง
จุดนี้เป็นการแก้เอกสารให้ตรงกับพฤติกรรมที่ shipped ไปแล้วจริง (ไม่ใช่การตัดสินใจ business rule ใหม่ ตาม
CLAUDE.md § "Docs/code drift" ที่ยอมรับว่าโค้ดเป็นสัญญาณที่น่าเชื่อถือกว่าสำหรับกลไกที่เพิ่งถูกคิดขึ้นใน
session เดียวกัน) — **แล้วจึง mechanical re-sync ภาคผนวก Stack Mapping ที่เหลือ**: `api-spec.md` §6/§6.3.1
(Express.js บน Google Cloud Run แทน Firebase Cloud Functions เดิม, 10 operation แทน 8) และ
`database-schema.md` §8.1/§8.2/§8.3 (ทุก "Cloud Function" → "Express route", เพิ่มแถว `pairing_credential`
ใหม่ในทั้ง §8.2/§8.3) — **ยังเหลือ**: ทุกไฟล์ใน `detailed-design/` ยังค้างอ้าง Cloud Function เดิม/นับ 8
operation (โดยเฉพาะ `04-smart-integrations.md` ที่ยังมี alt block `404`/`409`/`422` เดิมของ redeem ที่ตอนนี้
ไม่ตรงกับ `api-spec.md` แล้ว) — ควรรัน `detailed-design-builder` ต่อ — ดู log
[2026-08-30](../../05-log/20260830-log.md)
— **อัปเดต 2026-08-30 (`detailed-design-builder`, citation/grouping fix)**: `feature-journey-writer`
formalized กลไก pairing-code เป็นบทบัญญัติ **REQ-18** พร้อม Feature ID ของตัวเอง **INT-0** (แทนที่ implicit
precondition ของ REQ-12/REQ-13 เดิม) — แก้ `detailed-design/04-smart-integrations.md` ให้หัวข้อ "Identity
Handoff — Pairing-Code Mechanism" กลายเป็นหัวข้อกลุ่ม Feature ID `## INT-0 — ... (REQ-18)` ตรงรูปแบบเดียวกับ
INT-1/2/3 อื่น พร้อมแก้ list ความสัมพันธ์กับเอกสารอื่นให้รวม INT-0/REQ-18 — citation/grouping-only ไม่แก้ตัว
diagram หรือเนื้อหา INT-2/INT-3 เอง
— **อัปเดต 2026-08-30 (`detailed-design-builder`, ปิดท้ายเชน)**: (1) แก้ `alt` block ของ sequence diagram
"Identity Handoff — Pairing-Code Mechanism" ใน `detailed-design/04-smart-integrations.md` จาก 3 กรณีแยก
(`404`/`409`/`422`) เป็น **`410 Gone` กรณีเดียว** ให้ตรงกับ `api-spec.md` §3.1 ฉบับล่าสุดเป๊ะ (รวมถึงแก้ mint
step ที่เคยอ้าง `is_used = false` ให้ตรงกับ `database-schema.md` §3.17 ที่ลบ column นี้ออกแล้ว) (2)
mechanical re-sync ภาคผนวก Stack Mapping ที่เหลือทั้ง 4 ไฟล์ให้ตรงกับ `tech-stack.md` §6.1/§6.2/§6.3 ฉบับ
Express.js บน Google Cloud Run ครบ — **ตอนนี้ภาคผนวก Stack Mapping ทั้ง 4 จุด (HLA §10, `api-spec.md` §6,
`database-schema.md` §8, ทุกไฟล์ใน `detailed-design/`) sync กับ `tech-stack.md` ฉบับ Express.js/Google
Cloud Run ครบทุกไฟล์แล้ว ไม่มีจุดใดค้างอ้าง Firebase Cloud Functions เดิมหรือระบุ 8 operation อีก** — ดู log
[2026-08-30](../../05-log/20260830-log.md)
— **อัปเดต 2026-08-30 (`api-db-spec-builder`, citation-only fix)**: `feature-journey-writer` formalize
กลไก pairing-code เป็น Feature ID **INT-0** พร้อม business rule **REQ-18** ใหม่ — แก้ citation ของ 2
operation `POST /auth/pairing-codes`/`.../redeem` ในหัวข้อ 3.1 ของ `api-spec.md` และของตาราง
`pairing_credential` (หัวข้อ 3.17) ใน `database-schema.md` จาก "INT-2, INT-3 (implicit precondition ของ
REQ-12/REQ-13)" เป็น **INT-0/REQ-18** พร้อม resolve จุดที่ยังไม่ได้ระบุที่เคยบอกว่า "ยังไม่มี REQ number
formal" ในทั้งสองไฟล์ — citation-only ไม่มีการ re-model operation/table ใดๆ — ดู log
[2026-08-30](../../05-log/20260830-log.md)
— **อัปเดต 2026-08-30 (`architecture-builder`, citation-only fix, ปิดท้ายเชน)**: แก้ citation เดียวกัน
(INT-2/INT-3 implicit precondition ของ REQ-12/REQ-13 → **REQ-18/Feature ID INT-0**) ใน
`high-level-architecture.md` §3.1/§3.8/§4.5/§5/§7/§8 ให้ครบตามที่ `detailed-design-builder`/
`api-db-spec-builder` แก้ไปแล้วในไฟล์ของตัวเอง พร้อมแก้จำนวน Feature ID ในหัวข้อ 1 จาก 15 เป็น 16 — ไม่แตะ
เนื้อหา component/data flow/entity เดิม (citation-only ล้วนๆ) — ปิดเชน citation fix ของ INT-0/REQ-18 ครบ
ทุกไฟล์ (HLA, API Spec, Database Schema, Detailed Design) — ดู log
[2026-08-30](../../05-log/20260830-log.md)
— **อัปเดต 2026-08-31 (`detailed-design-builder`)**: audit เทียบ `detailed-design/02-daily-youtube-
recommendation.md`/`04-smart-integrations.md` กับโค้ดจริงที่เพิ่ง ship (commit `b463436`) พบเนื้อหาหลักขัด
กับ implementation จริง 2 จุด: (1) **REC-1** ไม่มี tolerance ตัวเลข/widen-retry loop จริง — เป็น
single-pass (ค้นหา YouTube ครั้งเดียว → กรอง embed ไม่ได้ → AI ranking ครั้งเดียวเลือกวิดีโอที่ดีที่สุดแบบ
best-effort) แก้ sequence diagram/algorithm ของ REC-1 (และ REC-3 ที่อ้างถึง) ให้ตรง พร้อม resolve จุดที่
ยังไม่ได้ระบุเดิมเรื่อง tolerance (2) **INT-1** สูตร step 4 ของอัลกอริทึม forecast เขียนผิดเป็นผลต่างจาก
เป้าหมาย (ที่ถูกต้องคือค่าเฉลี่ยแคลอรี่ที่เผาผลาญจริงต่อวันตรงๆ) และ "Execution ของ algorithm" อ้างผิดว่า
คำนวณฝั่ง client ทั้งที่ server คำนวณทั้งหมดจริง — แก้ทั้งสองจุด พร้อมแก้ภาคผนวก Stack Mapping ของทั้งสองไฟล์
(แถว Content Recommendation/Insights & Forecast ที่ยังเขียนว่าเป็น stub ทั้งที่ ship จริงแล้ว) — **พบว่า
`tech-stack.md` §6.1 (แถว Content Recommendation, Insights & Forecast) และ §4 (อ้าง forecast/INT-1 เป็น
client-side ผิด) ก็ล้าหลังจากจุดเดียวกันเช่นกัน — ต้องรัน `tech-stack-builder` ต่อเพื่อ sync** — ดู log
[2026-08-31](../../05-log/20260831-log.md)
— **อัปเดต 2026-08-31 (`tech-stack-builder`)**: Tech Stack Consistency Audit + Reconciliation ตามที่
`detailed-design-builder` ข้างบน flag ไว้ — formalize **Google Gemini** (`@google/genai` SDK, model
`gemini-3.6-flash`) เป็นเทคโนโลยีจริงที่เลือกแล้วสำหรับขั้นตอน ranking/ประเมินความเข้มข้นของวิดีโอใน Content
Recommendation (เสริมต่อจาก YouTube Data API v3 search ไม่ใช่แทนที่ — ผู้ใช้ยืนยันว่าเป็นการบันทึกการ
ตัดสินใจที่ ship ไปแล้วจริง ไม่ใช่จุดตัดสินใจใหม่) แก้แถว Content Recommendation/Insights & Forecast ในหัวข้อ
6.1 ให้ตรงกับ implementation จริง (ไม่ใช่ stub อีกต่อไป) พร้อมเพิ่ม operation ใหม่
`GET /api/insights/weight-records` เข้าแถว Insights & Forecast และตัด forecast (INT-1) ออกจากรายการ
"Client-side calculation ตาม NFR-01/NFR-03" ในหัวข้อ 4 — **ผลกระทบต่อเอกสารอื่น**: HLA §10 (แถว Content
Recommendation ยังอ้าง widen-retry ที่ไม่มีจริงและไม่มี mapping ของ Gemini) และ `database-schema.md`
§8.2/§8.3 (ยังไม่มีแถว `today_recommendation_snapshot`/`today_recommendation_rejected_video`) stale ต่อ —
ควรรัน `architecture-builder`/`api-db-spec-builder` ต่อ — ดู log
[2026-08-31](../../05-log/20260831-log.md)
— **อัปเดต 2026-08-31 (`architecture-builder`, Stack Mapping re-sync)**: sync แถว "Content Recommendation"
ใน **HLA §10 (ภาคผนวก: Stack Mapping)** ให้ตรงกับ `tech-stack.md` §6.1 ฉบับล่าสุดที่ `tech-stack-builder`
เพิ่ง reconcile ข้างบน — ลบข้อความ "ตรรกะ matching/widen-retry" ที่ไม่มีจริงในโค้ด (single-pass ล้วน ไม่มี
tolerance ตัวเลข/widen-retry loop) และเพิ่ม mapping ของ **Google Gemini** (`@google/genai`, model
`gemini-3.6-flash`) เป็นขั้นตอน ranking ต่อจาก YouTube Data API v3 search พร้อม cache field
`users/{userId}.todaysRecommendation` ที่ map กับ `database-schema.md` §3.18/§3.19
(`today_recommendation_snapshot`/`today_recommendation_rejected_video`) — mechanical re-sync ล้วนๆ ไม่แตะ
เนื้อหาหลัก §1-9 (REC-1 ถูกบรรยายเชิงแนวคิดไว้แล้วโดยไม่อ้างรายละเอียด widen-retry ระดับ implementation นี้
อยู่แล้ว) — **ยังเหลือ**: `database-schema.md` §8.2/§8.3 ยังไม่มีแถว
`today_recommendation_snapshot`/`today_recommendation_rejected_video` — ควรรัน `api-db-spec-builder` ต่อ —
ดู log [2026-08-31](../../05-log/20260831-log.md)
— **อัปเดต 2026-08-31 (`api-db-spec-builder`, Stack Mapping re-sync, ปิดท้ายเชน)**: sync
**`database-schema.md` §8.2/§8.3** ให้ตรงกับ `tech-stack.md` §6.1 แถว Content Recommendation ฉบับล่าสุดที่
`tech-stack-builder`/`architecture-builder` เพิ่ง reconcile ข้างบน — เพิ่มแถวใหม่ 2 แถวใน §8.2 สำหรับตาราง
`today_recommendation_snapshot`/`today_recommendation_rejected_video` (หัวข้อ 3.18/3.19) ระบุว่าทั้งคู่ embed
รวมกันเป็น field เดียว `users/{userId}.todaysRecommendation` (`computedFor`/`video`/`rejectedVideoIds`)
เข้าเกณฑ์เดียวกับ `weightForecastSnapshot`/`streakSnapshot` และเพิ่มแถวใหม่ใน §8.3 สำหรับ
recompute-on-cache-miss (Express route `GET /api/workouts/today/recommendation` เทียบ `computedFor` เอง,
`POST .../swap` บังคับ recompute เสมอ) — mechanical re-sync ล้วนๆ ไม่แตะเนื้อหาหลักหัวข้อ 1-7 (ถูกต้องอยู่
แล้วจากรอบ 8) — **ตอนนี้ภาคผนวก Stack Mapping ทั้ง 4 จุด (HLA §10, `api-spec.md` §6, `database-schema.md`
§8, `detailed-design/02-daily-youtube-recommendation.md`/`04-smart-integrations.md`) sync กับ
`tech-stack.md` ฉบับ Gemini+weight-records ครบทุกไฟล์แล้ว ไม่มีจุดใดค้าง** — ดู log
[2026-08-31](../../05-log/20260831-log.md)
— **อัปเดต 2026-08-31 (`api-db-spec-builder`, factual correction)**: แก้ 2 จุดใน `api-spec.md` ที่ยังอ้าง
กลไก "widen-retry"/tolerance ตัวเลขที่ไม่มีจริงในโค้ดสำหรับ REC-1/REC-3 (Content Recommendation) — แก้
error/edge case ของ `POST /workouts/today/recommendation/swap` (หัวข้อ 3.3) ให้ตรงกับพฤติกรรมจริง
(single-pass: ค้นหา 1 ครั้ง + AI ranking 1 ครั้ง คืน `409` เมื่อไม่เหลือ candidate) และ resolve จุดที่ยังไม่
ได้ระบุเดิมข้อ 1 ในหัวข้อ 4 ว่า "ไม่มีตัวเลข tolerance" ให้ตรงกับที่ `detailed-design/02-daily-youtube-
recommendation.md` resolve ไปแล้วก่อนหน้านี้ในวันเดียวกัน — citation/factual correction ล้วนๆ ไม่กระทบ
`database-schema.md` — ดู log [2026-08-31](../../05-log/20260831-log.md)
— **อัปเดต 2026-08-31 (`architecture-builder`, factual correction ของเนื้อหาหลัก §4/§8 ไม่ใช่แค่ภาคผนวก)**:
fresh audit พบว่ารอบ Stack Mapping re-sync ก่อนหน้านี้ในวันเดียวกัน (ดูรายการด้านบน) ตัดสิน (ผิด) ว่าหัวข้อ
1-9 ของ `high-level-architecture.md` ไม่ต้องแก้ — แต่ §4.2 (Flow diagram ของ REC-1) ยังมีโหนด "ขยายเกณฑ์
ค้นหา แล้วลองใหม่" และ §8 ข้อ 1 ยังตั้งเป็น open point เรื่อง tolerance/widen-retry logic ซึ่งขัดกับ
single-pass design จริงที่ `detailed-design/02-daily-youtube-recommendation.md`/`tech-stack.md` §6.1
ยืนยันไปแล้ว — แก้ทั้งสองจุด: §4.2 diagram เปลี่ยนเป็นค้นหาผู้สมัครครั้งเดียว → AI-assisted ranking เลือกตัว
ที่ดีที่สุดแบบ best-effort ในรอบเดียว → ไม่มีผู้สมัครเลยจึง error (ไม่มี retry/widen) และ §8 ข้อ 1 resolve
เป็นข้อเท็จจริงที่ยืนยันแล้วแทน — ไม่แตะ §10 (ถูกต้องอยู่แล้ว) ไม่แก้ `user-journeys.md` เอง
(`feature-journey-writer` แก้คู่ขนาน) — ดู log [2026-08-31](../../05-log/20260831-log.md)
— **อัปเดต 2026-08-31 (`architecture-builder`, follow-up: sync เลข Step กับ `user-journeys.md` ฉบับ 7-step)**:
`feature-journey-writer` แก้ `user-journeys.md` เสร็จแล้ว (REC-1 จาก 5 step มี widen-retry เป็น **7 step**
single-pass; REC-3 เป็น **5 step**) — แก้ `high-level-architecture.md` §4.2 ให้เลิกอ้าง "REC-1 (Step 1-5)"/
"REC-3 (Step 1-4)" ที่ค้างจากรอบก่อน เป็น "REC-1 (Step 1-7)"/"REC-3 (Step 1-5)" พร้อม mapping รายขั้นให้ตรง
กับ diagram 7 step จริงทุกขั้น และปิด follow-up note ใน §8 ข้อ 1 ที่เคยบอกว่ารอ re-check — pure mechanical
cross-reference sync ไม่แตะเนื้อหาแนวคิดที่แก้ไปแล้วในรอบก่อนหน้า ไม่ใช้ AskUserQuestion — ดู log
[2026-08-31](../../05-log/20260831-log.md)
— **อัปเดต 2026-08-31 (`api-db-spec-builder`, reinstate `dailyIntakeTargetKcal`/`isSafetyFloorApplied`)**:
`feature-journey-writer` formalize business-rule change ของ ONB-3/REQ-02 (ship+ตรวจสอบ end-to-end จริงแล้ว)
ที่แยกเป้าหมายแคลอรี่รายวันเป็น **2 ค่า**: `dailyCalorieTargetKcal` (เป้าหมายเผาผลาญจากการออกกำลังกาย ไม่มี
safety floor — REC-1/PLN-3/INT-1 ใช้จริงเหมือนเดิม ไม่เปลี่ยน) และ `dailyIntakeTargetKcal` (reinstated —
TDEE ± ค่าส่วนต่าง มี safety floor `SAFETY_FLOOR_MIN_KCAL = 1200` พร้อม `isSafetyFloorApplied`, ยังไม่มี
feature ใดใช้คำนวณจริง) — ยืนยันจากโค้ดจริงโดยตรง
(`apps/web/server/routes/personalization-profile/index.ts`,
`packages/shared-types/src/entities/personalizationProfile.ts`) แก้ `api-spec.md` §3.2 (`PUT /profile/goal`
request/response) และ `database-schema.md` (ER Diagram, ตาราง `goal_selection` §3.3, §4 ข้อ 2, §8.3 —
คืนคอลัมน์/กติกา/แถว mapping ของ safety floor ที่เคยถูกลบผิดพลาดกลับมา พร้อมแก้คำอธิบาย
`daily_calorie_target_kcal` ที่เคยเขียนผิดว่าเป็นค่า intake ที่ปรับ floor แล้ว) — ไม่ใช้ AskUserQuestion
(formalize decision ที่ยืนยัน/ship แล้วตามที่ระบุในคำสั่งงาน) — **ผลกระทบต่อเอกสารอื่น**: `tech-stack.md`
§6.1 (แถว Personalization & Profile) ยัง stale ด้วยจุดเดียวกัน (field list ของ `goalSelection` ขาด
`dailyIntakeTargetKcal`, safety floor logic อ้างผิดว่าเป็นของ `dailyCalorieTargetKcal`) — ควรรัน
`tech-stack-builder` ต่อ — ดู log [2026-08-31](../../05-log/20260831-log.md)
— **อัปเดต 2026-08-31 (`tech-stack-builder`, factual correction, ปิดท้ายเชน `dailyIntakeTargetKcal`)**:
แก้แถว **Personalization & Profile** ในหัวข้อ 6.1 ของ `tech-stack.md` ตามที่ `api-db-spec-writer` flag
ไว้ข้างบน — เดิมระบุ `goalSelection` มีแค่ 4 field และเข้าใจผิดว่า safety floor gate ที่
`dailyCalorieTargetKcal <= 1200` แก้เป็น 5 field ครบ (เพิ่ม `dailyIntakeTargetKcal`) พร้อมระบุชัดว่า
safety floor gate เฉพาะ `dailyIntakeTargetKcal` เท่านั้น (`dailyCalorieTargetKcal` ไม่มี safety floor)
— factual correction ของ design ที่ ship/ยืนยันแล้ว ไม่กระทบตัวเลือก stack จริง จึงไม่ใช้
AskUserQuestion — ตรวจ §4 (Rationale) แล้วไม่พบข้อความล้าหลังซ้ำอีก — ดู log
[2026-08-31](../../05-log/20260831-log.md)
— **อัปเดต 2026-08-31 (`detailed-design-builder`, ปิดท้ายเชน `dailyIntakeTargetKcal`)**: แก้ section ONB-3
ใน `detailed-design/01-onboarding-personalization.md` ให้ตรงกับ `database-schema.md` §3.3/`api-spec.md`
§3.2 ฉบับล่าสุด (ยืนยันจากโค้ดจริง `GoalConfirmScreen.tsx`) — เดิม sequence diagram/algorithm มีการคำนวณ
เป้าหมายแคลอรี่เดียว (TDEE ± ค่าคงที่ + safety floor) ผิดพลาดและอ้างว่าเป็น input ของ REC-1/PLN-3/INT-1 —
แก้เป็น**2 การคำนวณคู่ขนาน**: `dailyCalorieTargetKcal` (น้ำหนักตัว × ค่าคงที่ kcal/กก. ตามเป้าหมาย — 4.5/
3.0/5.5, ไม่มี safety floor, เป็น input จริงของ REC-1/PLN-3/INT-1) และ `dailyIntakeTargetKcal` (TDEE ±
ค่าส่วนต่างตามเป้าหมาย มี safety floor ที่ 1,200 kcal พร้อม `isSafetyFloorApplied`, ยังไม่มี component ใด
ใช้จริง) — sequence diagram เพิ่ม `par` block แสดง 2 การคำนวณคู่ขนานฝั่งผู้ใช้ก่อนส่งรวมในคำขอ
`PUT /profile/goal` เดียว, resolve "จุดที่ยังไม่ได้ระบุ" ข้อ safety floor range (เป็นค่าคงที่ 1,200 kcal
เดียว ไม่แยกตามเพศ/อายุ), แก้ภาคผนวก Stack Mapping (แถว Personalization & Profile, "Execution ของ
algorithm section") ให้ระบุว่าทั้งสองค่าคำนวณ client-side พร้อมกันแล้วส่งรวมคำขอเดียว — ไม่ใช้
AskUserQuestion (formalize decision ที่ยืนยัน/ship แล้วตามที่ระบุในคำสั่งงาน) — **ปิดเชน
`dailyIntakeTargetKcal` ครบทุกไฟล์แล้ว** (feature-journey-writer → api-db-spec-writer →
detailed-design-writer → tech-stack-writer) — ดู log [2026-08-31](../../05-log/20260831-log.md)
— **อัปเดต 2026-08-31 (`detailed-design-builder`, factual correction, PLN-4 execution)**: audit
`detailed-design/03-planner-logging.md`'s PLN-4 section เทียบกับโค้ดจริงที่เพิ่ง ship
(`apps/web/server/routes/logging-streak/recomputeStreak.ts`) พบว่าย่อหน้า "Execution ของ algorithm" ท้าย
ภาคผนวก Stack Mapping อ้างผิดว่า **Streak walk-back (PLN-4)** คำนวณฝั่ง client (React+Vite web client) ตาม
NFR-01/NFR-03 แล้วส่งผลลัพธ์มาบันทึก — บัคเดียวกับที่พบและแก้แล้วสำหรับ INT-1/Forecast ก่อนหน้าในวันเดียวกัน
— จริงๆ `recomputeStreak()` เป็นฟังก์ชัน**server-side ล้วน** ที่ loop query Firestore ตรงบน server เอง
ไม่มี client เกี่ยวข้องเลย ถูกเรียกอัตโนมัติจาก route อื่น (`exertion-calorie`, `planner-day-status`) หลัง
เขียน `dailyLogs` เสร็จ — แก้ย่อหน้า "Execution ของ algorithm" ให้ตรงกับ execution จริงฝั่ง server เท่านั้น
(เนื้อหาหลัก sequence diagram/algorithm ของ walk-back logic เอง **ไม่เปลี่ยนแปลง**) พร้อมแก้
`tech-stack.md` §4 คู่ขนาน (ตัด "streak walk-back (PLN-4)" ออกจากรายการ "Client-side calculation ตาม
NFR-01/NFR-03") — ไม่ใช้ AskUserQuestion (factual correction ของ implementation ที่ ship แล้ว ตามที่ระบุ
ในคำสั่งงานนี้โดยตรง) — ดู log [2026-08-31](../../05-log/20260831-log.md)
— **อัปเดต 2026-08-31 (status-text fix, `sessionVideos`)**: แก้แถว **Content Recommendation** ใน
`tech-stack.md` §6.1 และภาคผนวก Stack Mapping ของ `high-level-architecture.md` §10 ที่ทั้งคู่ยังระบุว่า
`POST /api/workouts/sessions` "ยังเป็น TODO ในโค้ดจริง" ไม่เขียน embedded array field `sessionVideos: []`
— แต่โค้ดจริง (`apps/web/server/routes/content-recommendation/index.ts`, commit `100bbd3`) implement
แล้ว: เขียน 1 รายการ (main) ตามปกติ หรือ 3 รายการ (warmup/main/cooldown) เมื่อ intensity เป็น `high` ตรงกับ
REC-1/REC-4's algorithm ใน `detailed-design/02-daily-youtube-recommendation.md` ทุกประการอยู่แล้ว (ไม่มี
algorithm drift) — pure status-text correction ล้วนๆ ไม่ต้องใช้ AskUserQuestion — ดู log
[2026-08-31](../../05-log/20260831-log.md)
