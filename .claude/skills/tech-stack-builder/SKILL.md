---
name: tech-stack-builder
description: Build or update smartFit_daily's Tech Stack doc (docs/02-design/02-technical/tech-stack.md) - the ONE genuinely stack-specific document in the pipeline, picking concrete technologies (mobile framework, backend, database engine, hosting, auth, third-party integration setup) instead of staying conceptual. Runs an intensive, structured Discovery Questionnaire (platform targets, team background, hosting/infra preference, backend approach, budget/scale, timeline, data compliance/residency, offline support) before recommending anything - full questionnaire on first run, only the affected dimensions on later re-runs. Requires high-level-architecture.md, api-spec.md, database-schema.md, and detailed-design/*.md to all already exist and maps every recommendation back to them. Also audits whether the existing doc is still consistent with those four docs plus Requirement (incl. NFR), Backlog, User Journey, and Prototype, but - unlike every other skill in this pipeline - NEVER silently auto-updates an actual stack choice even when it finds "merely stale" drift, because changing a real technology choice has real migration cost; it always stops and asks the user first. Use when asked to create, update, or audit the Tech Stack document, or to help choose/recommend an appropriate technology stack for smartFit_daily.
---

# Tech Stack Builder

สร้าง/อัปเดตเอกสาร **Tech Stack** ของ smartFit_daily — เอกสารเดียวในทั้ง pipeline นี้ที่**เลือกเทคโนโลยี
จริง**แทนที่จะเป็น conceptual (ตรงข้ามกับ `architecture-builder`/`api-db-spec-builder`/
`detailed-design-builder` ที่ห้ามผูก stack) — และ**ช่วยเลือก tech stack ที่เหมาะสม**ผ่านการถามผู้ใช้งาน
แบบเข้มข้นก่อนเสมอ ไม่ใช่แค่ถามเมื่อไม่ชัดเจน skill นี้มี 2 การทำงาน:

- **สร้าง/อัปเดต Tech Stack** (ขั้นตอนที่ 0-5 ด้านล่าง) — รัน **Discovery Questionnaire** ก่อนเสมอ แล้ว
  derive คำแนะนำจากคำตอบ + **High Level Architecture, API Spec, Database Schema, Detailed Design**
  (ทั้ง 4 บังคับต้องมีอยู่ก่อน — ดู "ขั้นตอนที่ -1") รวมถึง Requirement (`01-spec/*.md` รวม NFR),
  Backlog, และ User Journey
- **Tech Stack Consistency Audit** — ตรวจว่าเอกสารที่มีอยู่แล้วยังสอดคล้องกับเอกสารต้นทางหรือไม่ **แต่ห้าม
  แก้ตัวเลือก stack จริงเองแม้เจอว่าล้าหลังก็ตาม** — ต้องถามผู้ใช้ก่อนเสมอ (ดู "กติกา Reconcile ที่ต่างจาก
  skill อื่น" ด้านล่าง)

## กติกาที่สำคัญที่สุดของ skill นี้ — เลือกเทคโนโลยีจริงได้ ไม่ใช่ conceptual

เอกสารนี้**ตรงข้าม**กับกติกาของ `architecture-builder`/`api-db-spec-builder`/`detailed-design-builder`
โดยเจตนา: ที่นี่**ต้องระบุชื่อจริง** — framework, ภาษาโปรแกรม, ฐานข้อมูล, cloud provider, บริการจริงที่จะ
ใช้ — เพราะนี่คือจุดที่ conceptual chain (HLA → API Spec/Database Schema → Detailed Design) ถูกแปลงเป็น
การตัดสินใจที่ implement ได้จริง ห้ามเขียนคำแนะนำแบบคลุมเครือ/เชิงหน้าที่เหมือนเอกสารก่อนหน้า (เช่น
"mobile client" เฉยๆ) — ต้องบอกชัดว่าคือ "Framework X" หรือ "Native iOS + Native Android" พร้อมเหตุผล

## ขั้นตอนที่ -1 — ตรวจสอบว่ามีเอกสาร conceptual ครบทั้ง 4 ชั้นหรือยัง (บังคับก่อนทำอย่างอื่นทั้งหมด)

- **ถ้า `high-level-architecture.md`, `api-spec.md`, `database-schema.md`, หรือ
  `detailed-design/*.md` (อย่างน้อย 1 ไฟล์ต่อ epic) ไฟล์ใดไฟล์หนึ่งไม่มีอยู่**: **หยุดทันที ห้ามแนะนำ
  stack เอง** แจ้งผู้ใช้ว่าต้องรัน `architecture-builder` → `api-db-spec-builder` →
  `detailed-design-builder` ให้ครบตามลำดับก่อน — **skill นี้ไม่ใช่เจ้าของไฟล์เหล่านั้น**
- **ถ้ามีครบ**: อ่านทั้ง 4 ไฟล์ ถือเป็นแหล่งที่มาบังคับที่ทุกคำแนะนำ stack ต้อง trace กลับไปได้ — เช่น
  external integration boundary ของ HLA (YouTube, Health API, Bluetooth) บ่งบอกว่า mobile client ต้อง
  เข้าถึง native API ได้จริง, API Spec's REST convention บ่งบอกว่า backend framework ต้องรองรับ REST,
  Database Schema's relational model บ่งบอกทิศทางของฐานข้อมูล (แต่ไม่ผูกมัดว่าต้องเป็น relational DB
  จริงเสมอไป — ต้องถามผู้ใช้ประกอบ), Detailed Design's client-side/server-side split (เช่น NFR-01/NFR-03
  ที่ระบุว่าการคำนวณบางอย่างต้อง client-side ไม่มี network latency) บ่งบอกว่า mobile client ต้องมีความ
  สามารถประมวลผลได้เอง

## ขั้นตอนที่ 0 — Discovery Questionnaire (บังคับก่อนแนะนำ stack ทุกครั้ง — ไม่ใช่แค่ถามเมื่อไม่ชัดเจน)

**นี่คือกติกาที่ต่างจาก skill อื่นในโปรเจกต์นี้ทั้งหมด**: skill อื่นถามผู้ใช้เฉพาะเมื่อเจอความไม่ชัดเจนจาก
เอกสาร ส่วน skill นี้ต้อง**ถามผู้ใช้แบบเข้มข้นเสมอ**ก่อนแนะนำ stack เพราะข้อมูลที่จำเป็น (บริบททีม, งบ,
ระยะเวลา) ไม่มีอยู่ในเอกสารใดๆ ของโปรเจกต์เลย

### ครั้งแรกที่รัน (ยังไม่มี `tech-stack.md`) — ถามให้ครบทุกหมวดต่อไปนี้ (ใช้ AskUserQuestion หลายรอบ
รอบละไม่เกิน 4 ข้อ):

1. **Platform targets** — เฉพาะ iOS / เฉพาะ Android / ทั้งสอง / ต้องมี web app ด้วย
2. **Team background** — ทีมถนัดภาษา/framework อะไรอยู่แล้วบ้าง (หรือยังไม่มีทีม/เริ่มจากศูนย์)
3. **Hosting/Infra preference** — มี cloud provider ที่ผูกพันอยู่แล้วหรือไม่ / ต้องการ self-host / ไม่มี
   preference ให้แนะนำ
4. **Backend approach preference** — อยากได้ custom backend เต็มรูปแบบ / Backend-as-a-Service (เช่น
   Firebase/Supabase style) / ไม่มี preference
5. **Budget/Scale tier** — งบสำหรับ prototype/MVP เทียบกับ scale ที่คาดหวัง (ผู้ใช้กี่คนช่วงแรก, อัตรา
   การเติบโตที่คาดหวัง)
6. **Timeline** — ต้องการ ship เร็วแค่ไหน (กระทบว่าควรเลือกอะไรที่ build เร็วแต่ยืดหยุ่นน้อยกว่า หรือ
   ลงทุนโครงสร้างที่ scale ได้ตั้งแต่ต้น)
7. **Data compliance/residency** — ข้อมูลสุขภาพผู้ใช้ (ผูกกับ NFR-04/05/06) ต้องมี data residency ใน
   ประเทศไทยหรือข้อกำหนด PDPA เฉพาะหรือไม่
8. **Offline support** — ผู้ใช้ต้องใช้งานหลัก (เช่น ดู log, เห็นแผนสัปดาห์) แบบ offline ได้แค่ไหน

แต่ละหมวดที่คำตอบยังไม่ชัดพอจะตัดสินใจได้ ให้ใช้กติกา "ถามผู้ใช้ก่อนเสมอ" ด้านล่างถามต่อจนกว่าจะเพียงพอ

### รันซ้ำครั้งต่อๆ ไป (มี `tech-stack.md` อยู่แล้ว) — ถามเฉพาะหมวดที่เกี่ยวข้องกับสิ่งที่เปลี่ยน

ไม่ต้องถามเต็มชุดซ้ำ — ระบุจาก audit (ขั้นตอนที่ 1) ว่า upstream เปลี่ยนอะไร แล้วถามเฉพาะหมวด Discovery
ที่กระทบโดยตรง (เช่น ถ้า HLA เพิ่ม external integration ใหม่ ให้ถามหมวด Platform targets/Hosting ซ้ำ
เฉพาะส่วนที่เกี่ยวข้อง ไม่ต้องถาม Budget/Timeline ซ้ำถ้าไม่มีอะไรบ่งชี้ว่าเปลี่ยน)

## ขั้นตอนที่ 1 — Tech Stack Consistency Audit (รันก่อนเสมอ ถ้ามีเอกสารอยู่แล้ว)

เทียบ `tech-stack.md` ที่มีอยู่กับ:

1. **HLA, API Spec, Database Schema, Detailed Design (บังคับทั้ง 4)** — component/operation/table/
   diagram ที่ stack ปัจจุบันอ้างอิงยังตรงกับ conceptual doc ปัจจุบันหรือไม่ (เช่น มี external
   integration ใหม่ที่ stack ยังไม่รองรับ)
2. **Requirement (รวม NFR)** — NFR ด้าน performance/security/reliability ที่ stack ต้องตอบสนองยังตรง
   กับ decision ปัจจุบันหรือไม่
3. **Backlog/User Journey** — Feature ID ใหม่ที่กระทบ platform requirement (เช่น feature ที่ต้องพึ่ง
   native capability ใหม่)
4. **Prototype** (ถ้ามี) — ใช้ประกอบเท่านั้น ไม่ใช่ source of truth ของการเลือก stack

### การจัดกลุ่มสิ่งที่พบ + กติกา Reconcile ที่ต่างจาก skill อื่นในโปรเจกต์นี้

- **เอกสารล้าหลังแบบไม่กระทบตัวเลือก stack จริง** (เช่น ลิงก์ตายเพราะ HLA เปลี่ยนชื่อ component, ตัวเลข
  REQ อ้างอิงผิด, wording ของ rationale ที่ไม่ตรงแล้วแต่ข้อสรุป stack ยังเหมือนเดิม): แก้ตรงนี้ได้เองผ่าน
  flow ปกติ ไม่ต้องถามผู้ใช้
- **เอกสารล้าหลังแบบที่อาจกระทบตัวเลือก stack จริง** (เช่น upstream เพิ่ม external integration ใหม่ที่
  stack ปัจจุบันไม่รองรับ, NFR เปลี่ยนจนข้อกำหนด performance/compliance ต่างไป, scope ใหม่ทำให้ platform
  target ที่เคยเลือกไม่พอ): **ห้ามแก้ตัวเลือก stack เองแม้จะรู้คำตอบที่ควรจะเป็น** — ต้องถามผู้ใช้ก่อนเสมอ
  (ผ่าน mini Discovery Questionnaire เฉพาะหมวดที่กระทบ ตามขั้นตอนที่ 0) แล้วรอคำตอบก่อนแก้ไฟล์จริง — นี่
  คือกติกาที่ต่างจาก `architecture-builder`/`api-db-spec-builder`/`detailed-design-builder` ซึ่งได้รับ
  อนุญาตให้ auto-update ส่วนที่ "ล้าหลังแต่ไม่ขัดแย้ง" ได้เอง เพราะที่นี่การเปลี่ยน stack จริงมีต้นทุนการ
  migrate จริงในโลกจริง ไม่ใช่แค่แก้คำในเอกสาร
- **เอกสารขัดแย้งตรงๆ กับ upstream หรือมีข้อมูลใหม่**: ถามผู้ใช้เหมือนเดิม (≥3 แนวทาง + เหตุผล/ข้อดี/
  ข้อเสีย + คำแนะนำ)
- **การ Reconcile ไฟล์อื่น**: **ห้ามแก้** HLA/API Spec/Database Schema/Detailed Design เอง (เรียก
  `architecture-builder`/`api-db-spec-builder`/`detailed-design-builder` ตามลำดับ), **ห้ามแก้**
  Requirement/Backlog/User Journey เอง (เรียก `feature-list-journey`), **ห้ามแก้** Prototype เอง (เรียก
  `prototype-builder`)

## ขั้นตอนที่ 2 — สังเคราะห์คำแนะนำ Tech Stack

จากคำตอบ Discovery Questionnaire + เอกสาร conceptual ทั้ง 4 ชั้น สังเคราะห์คำแนะนำต่อองค์ประกอบ:

- **Mobile/Client** — framework หรือ native ต่อ platform
- **Backend/API** — ภาษา+framework หรือ Backend-as-a-Service
- **Database** — DBMS จริง (derive จาก logical model ใน `database-schema.md`)
- **Authentication** — วิธียืนยันตัวตนจริง
- **Hosting/Infra** — cloud provider + service ที่ใช้
- **Third-party integration setup** — วิธีเชื่อม YouTube Data API, Health API (Apple
  HealthKit/Google Health Connect SDK), Bluetooth (ตาม external boundary ของ HLA)
- **CI/CD & Dev tooling** (เบาๆ พอเป็นแนวทาง ไม่ลงรายละเอียดลึก)

สำหรับ**องค์ประกอบที่มีทางเลือกสำคัญมากกว่า 1 ทาง** (เช่น native vs cross-platform mobile, custom
backend vs BaaS, SQL vs NoSQL) — **ต้องใช้กติกา "ถามผู้ใช้ก่อนเสมอ" ด้านล่าง** เสนอ ≥3 ทางเลือกจริงพร้อม
ชื่อเทคโนโลยีจริงในแต่ละทาง + เหตุผล/ข้อดี/ข้อเสีย + คำแนะนำ 1 ทาง ก่อนสรุปเป็นคำแนะนำสุดท้าย — ไม่ตัดสินใจ
แทนผู้ใช้เงียบๆ แม้จะดูมีคำตอบที่ "ดีที่สุด" ชัดเจนจากมุมมองทางเทคนิคก็ตาม เพราะเป็นการตัดสินใจที่ผูกพันระยะ
ยาวของทีม

## ขั้นตอนที่ 3 — เสนอโครงเนื้อหาให้ผู้ใช้รีวิวก่อนเสมอ (บังคับ ห้ามข้าม)

**ห้ามเขียนไฟล์ก่อนได้รับการยืนยันจากผู้ใช้** เสนอสรุปคำแนะนำ stack ต่อองค์ประกอบ (จากขั้นตอนที่ 2) พร้อม
เหตุผลสั้นๆ ให้ผู้ใช้ยืนยันหรือขอปรับก่อนเขียนไฟล์จริง (ยืนยันแบบ free-form ได้)

## ขั้นตอนที่ 4 — โครงสร้างเอกสารบังคับ

`docs/02-design/02-technical/tech-stack.md` (ไฟล์เดียว ไม่ versioned) ต้องมีครบทุกหัวข้อนี้:

1. **Header** — ประเภทเอกสาร (Tech Stack — Concrete/Stack-Specific), สถานะ, วันที่, อ้างอิงกลับ HLA/API
   Spec/Database Schema/Detailed Design/backlog/01-spec
2. **ขอบเขตและหลักการ** — อธิบายว่าเอกสารนี้เป็นจุดเดียวในทั้ง pipeline ที่ระบุเทคโนโลยีจริงโดยเจตนา
   ต่างจากเอกสารอื่นทั้งหมดใน `02-technical/`
3. **สรุปคำตอบจาก Discovery Questionnaire** — บันทึกบริบทที่ใช้ตัดสินใจไว้ (platform, ทีม, budget,
   timeline, compliance, offline) เพื่อให้ตรวจสอบย้อนหลังได้ว่าทำไมถึงเลือกแบบนี้
4. **Recommended Tech Stack** — ต่อองค์ประกอบ (Mobile/Client, Backend/API, Database, Authentication,
   Hosting/Infra, Third-party Integration Setup, CI/CD & Dev Tooling) ระบุชื่อเทคโนโลยีจริง
5. **เหตุผลการเลือก (Rationale)** — ต่อองค์ประกอบ ผูกกับคำตอบ Discovery + NFR + HLA
6. **ทางเลือกอื่นที่พิจารณาแล้ว (Alternatives Considered)** — สำหรับองค์ประกอบที่มีทางเลือกสำคัญ แสดง
   ≥3 ทางที่พิจารณาพร้อมเหตุผลที่ไม่เลือก
7. **Mapping จาก Conceptual Docs → Concrete Stack** (สำคัญที่สุดสำหรับนักพัฒนา) — HLA's Conceptual
   Component → module/service จริง, `database-schema.md`'s logical type → ชนิดข้อมูลจริงของ DBMS ที่
   เลือก (เช่น `identifier` → UUID, `enum` → native enum/check constraint), `api-spec.md`'s REST
   convention → routing convention จริงของ framework ที่เลือก
8. **จุดที่ยังไม่ได้ตัดสินใจ / ควรยืนยันเพิ่มเติม**
9. **ความสัมพันธ์กับเอกสารอื่น** — ลิงก์กลับ HLA, API Spec, Database Schema, Detailed Design, backlog,
   01-spec

## ขั้นตอนที่ 5 — สร้าง/แก้ไฟล์ (หลังผู้ใช้ยืนยันแผนแล้วเท่านั้น)

- เขียนเป็นภาษาไทย ใช้ชื่อเทคโนโลยี/ภาษาอังกฤษทับศัพท์ตามปกติของวงการ (ไม่ต้องแปล เช่น "React Native",
  "PostgreSQL" คงชื่อเดิม)
- หลังสร้าง/อัปเดตไฟล์แล้ว อัปเดต `docs/02-design/02-technical/index.md` ให้กล่าวถึงไฟล์นี้ (ถ้ายังไม่ได้
  กล่าวถึง) — ระบุชัดว่าไฟล์นี้เป็นข้อยกเว้นเดียวที่ stack-specific จริงในโฟลเดอร์นี้
- สรุปการเปลี่ยนแปลง (รวมสรุปคำตอบ Discovery Questionnaire ที่ได้) ลง `docs/05-log/{YYYYMMDD}-log.md`

## กติกาเมื่อไม่แน่ใจหรือข้อมูลไม่พอ — ต้องถามผู้ใช้ก่อนเสมอ

ใช้รูปแบบเดียวกับ skill อื่นในโปรเจกต์นี้ทุกครั้งที่เจอความไม่ชัดเจน (นอกเหนือจาก Discovery Questionnaire
หลักแล้ว เช่น คำตอบ Discovery ยังไม่พอตัดสินองค์ประกอบใดองค์ประกอบหนึ่ง, มีทางเลือกเทคโนโลยีสำคัญที่ต้อง
เลือก, หรือทิศทางการ reconcile เมื่อ audit พบว่าอาจกระทบตัวเลือก stack จริง):

1. ระบุคำถามให้ชัดเจนว่าไม่แน่ใจเรื่องอะไร กระทบองค์ประกอบ/เอกสารชั้นไหน
2. เสนอ **อย่างน้อย 3 แนวทาง** ที่เป็นไปได้ (ระบุชื่อเทคโนโลยีจริงในแต่ละทาง ไม่ใช่แนวคิดคลุมเครือ)
3. อธิบาย **เหตุผล ข้อดี ข้อเสีย** ของแต่ละแนวทาง
4. **แนะนำแนวทางที่ดีที่สุด 1 แนวทาง พร้อมเหตุผลที่แนะนำ**
5. รอคำตอบก่อนเขียนส่วนที่เกี่ยวข้องจริง — ห้ามเดาแล้วเขียนไปก่อน

## Output & รายงานผล

ก่อนหยุดงาน ให้สรุปกลับ:

- ผลจาก Discovery Questionnaire: หมวดไหนถามไปบ้าง คำตอบสรุปคืออะไร (เต็มชุด หรือเฉพาะหมวดที่กระทบถ้าเป็น
  การรันซ้ำ)
- ผลจาก Tech Stack Consistency Audit (ถ้ารัน): พบอะไรบ้าง จัดเป็นล้าหลังไม่กระทบ stack/ล้าหลังอาจกระทบ
  stack (รอผู้ใช้ตอบ)/ขัดแย้งตรงๆ อย่างไร
- คำแนะนำ stack สุดท้ายที่ผู้ใช้ยืนยันแล้ว ต่อองค์ประกอบ
- ไฟล์ที่สร้าง/แก้ไข (`tech-stack.md`, `index.md` ถ้าแก้, log entry)
- ถ้าเรียก `architecture-builder`/`api-db-spec-builder`/`detailed-design-builder`/
  `feature-list-journey`/`prototype-builder` ต่อเพื่อแก้เอกสารอื่น ให้ระบุว่าเรียกไปทำอะไรและผลลัพธ์เป็น
  อย่างไร
- คำถามใดที่ยังรอผู้ใช้ตัดสินใจอยู่บ้าง (ถ้ามี)
