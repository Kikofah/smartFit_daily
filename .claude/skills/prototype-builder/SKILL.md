---
name: prototype-builder
description: Build visual/interactive HTML prototypes for smartFit_daily screens from Requirement (01-spec), Product Backlog/Feature List (backlog.md), and User Journey (user-journeys.md) docs, styled strictly per docs/02-design/01-prototypes/DESIGN.md. Also audits whether an existing prototype version has been edited and whether it's still consistent with Requirement, Backlog, Feature List, User Journey, Acceptance Criteria, Test Case, and Test Plan (all seven by default, or a specified subset), handing off any needed fix to whichever skill owns that document. Defaults to covering every feature but accepts a narrower scope (specific Feature ID(s)/Epic(s)/screen). Always proposes a plan for the user to review and confirm before building anything, and on every re-run asks whether to create a new version folder or edit the latest one - with a recommendation either way. If DESIGN.md doesn't exist yet, stops and asks the user to help create it first. Use when asked to build, mockup, prototype, or update a prototype/wireframe, or to check whether an existing prototype is still consistent with the rest of the docs, for smartFit_daily.
---

# Prototype Builder

สร้าง prototype แบบ HTML ที่ดูจริง (ไม่ใช่แค่ wireframe เส้นดำ-ขาว) ของหน้าจอ smartFit_daily และตรวจสอบ
(audit) ว่า prototype ที่มีอยู่แล้วยังสอดคล้องกับเอกสารอื่นในโปรเจกต์หรือไม่ skill นี้มี 2 การทำงาน:

- **สร้าง/อัปเดต Prototype** (ขั้นตอนที่ 0-4 ด้านล่าง) — รวม 4 แหล่งข้อมูลเข้าด้วยกันเสมอสำหรับทุก feature
  ที่อยู่ใน scope: **Requirement** (`01-spec/*.md`), **Product Backlog/Feature List** (`backlog.md`),
  **User Journey** (`user-journeys.md`), และ **Design System** (`DESIGN.md`) — **ห้ามสร้าง prototype
  จากแหล่งใดแหล่งหนึ่งเพียงอย่างเดียว**
- **Prototype Consistency Audit** (ดูหัวข้อเดียวกันด้านล่าง) — ตรวจว่า prototype version ที่มีอยู่แล้ว
  (ถูกแก้ไขโดยตรงหรือไม่ก็ตาม) ยังสอดคล้องกับ **ทั้ง 7 ชั้น**: Requirement, Backlog, Feature List, User
  Journey, Acceptance Criteria, Test Case, Test Plan (หรือเฉพาะชั้นที่ผู้ใช้ระบุ) หรือไม่ ถ้าพบว่าไม่สอดคล้อง
  ให้จัดการแก้ไขเอกสารที่เกี่ยวข้องทั้งหมด (ไม่ใช่แค่ prototype) ตาม "การ Reconcile" ด้านล่าง

ทุก screen ต้อง trace ได้ทั้งไปยัง Feature ID, REQ-xx ที่เกี่ยวข้อง, และ token/component ที่ใช้จริงจาก
DESIGN.md เสมอ ไม่ว่าจะสร้างใหม่หรือแก้ไขจาก audit

## Scope: ทั้งหมดโดย default แต่ระบุเจาะจงได้

- ถ้าไม่ได้ระบุ scope มา ให้สร้าง/ตรวจสอบ prototype ครอบคลุม **ทุก feature ในทุก epic** ตาม `backlog.md`
  และ (สำหรับ audit) เทียบกับ**ทั้ง 7 ชั้น**
- ถ้าผู้ใช้ระบุเจาะจง (Feature ID เดียว, epic เดียว, หน้าจอ/flow เดียว, หรือระบุว่าให้เทียบกับชั้นใดชั้นหนึ่ง
  เท่านั้น เช่น "เทียบกับ Test Case พอ") ให้จำกัด scope ตามนั้น แต่ยังต้องอ่านแหล่งข้อมูลที่จำเป็นสำหรับ scope
  นั้นให้ครบเหมือนเดิม ไม่ตัดข้อมูลที่จำเป็นออกเพื่อความเร็ว

## เมื่อไหร่ต้องตรวจสอบ (audit) Prototype ที่มีอยู่แล้ว

ไม่ใช่แค่ตอนสร้าง prototype ครั้งแรกเท่านั้น รันการตรวจสอบเมื่อ:

- ผู้ใช้ขอให้ตรวจสอบ/ยืนยันว่า prototype ยังตรงกับเอกสารอื่นหรือไม่
- Prototype version ที่มีอยู่ (ไฟล์ HTML ใน `v{N}/`) ถูกแก้ไขโดยตรง (hand-edit) — อาจทำให้เกิด **drift**
  ห้ามสันนิษฐานว่ายังสอดคล้องกันอยู่
- ก่อนเสนอแผนสร้าง version ใหม่ (ขั้นตอนที่ 2) ให้ audit version ล่าสุดก่อนเสมอ เพื่อให้แผนที่เสนอสะท้อน
  ความไม่สอดคล้องที่เจอด้วย ไม่ใช่แค่สิ่งที่ผู้ใช้ขอมาตรงๆ
- Requirement/Backlog/Feature List/User Journey/Acceptance Criteria/Test Case/Test Plan ชั้นใดชั้นหนึ่ง
  เปลี่ยนแปลง — ไม่ว่าจะรู้จากผู้ใช้แจ้งตรง ๆ หรือจาก `feature-list-journey`/`test-suite-builder` แจ้งมาว่า
  prototype อาจได้รับผลกระทบ

## Prototype Consistency Audit

อ่าน prototype version ที่ต้องการตรวจ (ปกติคือ version ล่าสุด เว้นแต่ผู้ใช้ระบุ) แล้วเทียบทีละ screen กับ
ทั้ง 7 ชั้น (หรือเฉพาะที่ระบุ):

1. **User Journey** (`user-journeys.md`) — ลำดับ step/diagram ที่ screen แสดง/สื่อถึง ยังตรงกับ Steps
   ปัจจุบันของ Feature ID นั้นหรือไม่ Alt/Edge Case ที่ screen อ้างว่ารองรับ ยังมีอยู่ใน journey จริงหรือไม่
2. **Requirement** (`01-spec/*.md`) — ตัวเลข/สูตร/ข้อความกติกาที่ปรากฏใน screen (เช่น ค่าคงที่, ข้อความ
   error, เงื่อนไข) ยังตรงกับ decision/business rule ปัจจุบันหรือไม่
3. **Backlog/Feature List** (`backlog.md`) — Feature ID ที่ screen อ้างถึงยังมีอยู่จริง, priority ยังสมเหตุสมผล
   กับสิ่งที่ prototype ทำ (เช่น ไม่ทำ prototype ละเอียดเกินสำหรับ feature ที่ยัง Could และยังไม่ได้ตกลง scope)
4. **Acceptance Criteria** (`docs/01-requirements/acceptance-criteria.md`, ถ้ามี) — สถานะ/ข้อความที่
   screen แสดง (เช่น success state, error state) ยังตรงกับ Given-When-Then ของ scenario ที่เกี่ยวข้องหรือไม่
5. **Test Case** (`docs/03-testing/01-test-plan/test-cases/{epic-slug}.md`, ถ้ามี) — ข้อความ/ค่าที่
   screen แสดงยังตรงกับ Expected Result/Test Data ที่ test case อ้างถึงหรือไม่
6. **Test Plan** (`docs/03-testing/01-test-plan/test-plan.md`, ถ้ามี) — screen ที่มีอยู่ไม่เกินขอบเขต
   (scope) ที่ระบุไว้ใน test plan โดยไม่มีการปรับ scope ให้สอดคล้องกันก่อน
7. **DESIGN.md** — token/component ที่ใช้ยังตรงกับที่นิยามไว้ (ตามกติกาเดิมในขั้นตอนที่ 4)

เอกสารข้อ 4-6 อาจยังไม่ถูกสร้าง (ถ้ายังไม่เคยรัน `test-suite-builder`) — ถ้าไม่มี ให้ข้ามข้อนั้นไปเฉย ๆ
ไม่ใช่ gap ที่ต้องแจ้ง

### การจัดกลุ่มสิ่งที่พบ

- **Prototype ล้าหลัง** (เอกสารอื่นเปลี่ยนไปแล้ว แต่ prototype ยังเป็นของเดิม ไม่มีข้อขัดแย้ง แค่เก่า):
  จัดการผ่าน flow สร้าง/อัปเดตปกติ (ขั้นตอนที่ 2-4) — เสนอแผนอัปเดต screen ที่กระทบ แล้วถามเรื่อง version
  folder ตามปกติ
- **Prototype มีข้อมูลใหม่ที่ไม่มีอยู่ในเอกสารอื่นเลย** (เช่น มีคนแก้ HTML เพิ่ม field ใหม่ หรือเปลี่ยน flow
  ที่ journey ไม่ได้ระบุ) — **ห้ามเดาว่าควรทำอย่างไร** ให้ถามผู้ใช้ (ใช้ AskUserQuestion) อย่างน้อย 3 แนวทาง
  เช่น (ก) ยอมรับสิ่งที่ prototype ทำ แล้วอัปเดตเอกสารต้นทางที่เกี่ยวข้องให้ตรง (ข) ถือว่า prototype เปลี่ยน
  โดยไม่ได้ตั้งใจ/ไม่ผ่านการตกลง ให้ rebuild prototype กลับไปตรงกับเอกสารปัจจุบัน (ค) บันทึกไว้เป็น Open
  Question รอการตัดสินใจ ยังไม่แก้ทั้งสองฝั่งตอนนี้ — พร้อมข้อดี/ข้อเสียและคำแนะนำแต่ละแนวทาง
- **Prototype ขัดแย้งตรง ๆ กับเอกสารอื่น** (คนละค่า/คนละกติกาในเรื่องเดียวกัน ไม่ใช่แค่ใหม่กว่า): เหมือนกรณี
  ก่อนหน้า **ห้ามเลือกฝั่งใดฝั่งหนึ่งเอง** ถามผู้ใช้ด้วยตัวเลือกแบบเดียวกัน (ยึด prototype/ยึดเอกสารเดิม/
  ทางเลือกที่สาม) พร้อมเหตุผล ข้อดี ข้อเสีย ของแต่ละทาง

### การ Reconcile — อัปเดตเอกสารที่เกี่ยวข้องทั้งหมดจริง ไม่ใช่แค่รายงาน

เมื่อผู้ใช้ตัดสินใจแล้วว่าต้องแก้อะไร ให้ดำเนินการแก้ให้ครบทุกเอกสารที่กระทบจริง โดยแบ่งตามเจ้าของไฟล์
(อย่าแก้ไฟล์ที่ skill อื่นเป็นเจ้าของเอง):

- **Prototype เอง** (`docs/02-design/01-prototypes/v{N}/*.html`) — แก้ตรงนี้ได้เลยผ่าน flow ขั้นตอนที่ 2-4
  ปกติ (เสนอแผน → ถาม version folder → สร้างไฟล์)
- **Requirement/Backlog/Feature List/User Journey** — **ห้ามแก้ไฟล์เหล่านี้เอง** ให้เรียกใช้ skill
  `feature-list-journey` (หรือ agent `feature-journey-writer`) พร้อมระบุให้ชัดว่าอะไรต้องเปลี่ยน
  (Feature ID/REQ ไหน เปลี่ยนเป็นอะไร เพราะอะไร มาจาก audit ของ prototype v{N}) เพื่อให้ skill นั้นไปแก้
  เอกสารของมันเองตามรูปแบบที่กำหนดไว้
- **Acceptance Criteria/Test Plan/Test Case** — **ห้ามแก้ไฟล์เหล่านี้เอง** ให้เรียกใช้ skill
  `test-suite-builder` (หรือ agent `test-suite-writer`) พร้อมระบุให้ชัดว่าอะไรต้องเปลี่ยนในลักษณะเดียวกัน

ทำสิ่งนี้เป็นส่วนหนึ่งของงานเดียวกัน (ไม่ใช่แค่แนะนำให้ผู้ใช้ไปรันเองทีหลัง) เว้นแต่ผู้ใช้บอกให้หยุดหรือขอทำ
ทีละขั้น — สุดท้ายแล้ว prototype และเอกสารทั้ง 6 ชั้นที่เหลือต้องสอดคล้องกันหมดก่อนถือว่างานเสร็จ

## ขั้นตอนที่ 0 — ตรวจสอบว่ามี DESIGN.md หรือยัง (บังคับก่อนทำอย่างอื่น)

- ถ้า `docs/02-design/01-prototypes/DESIGN.md` **ไม่มีอยู่**: **ห้ามเดาสี/font/spacing เอง และห้ามสร้าง
  prototype ต่อ** ให้หยุดแล้วถามผู้ใช้เพื่อช่วยสร้าง DESIGN.md ก่อน โดยถาม (ใช้ AskUserQuestion):
  1. โทนสีที่ต้องการ (ให้ตัวเลือกอย่างน้อย 3 แนวทาง เช่น earth tone, ขาว-เทา minimal, สีสันสดใสเน้นความสนุก
     — พร้อมข้อดี/ข้อเสียของแต่ละแนวทางสำหรับแอปออกกำลังกาย)
  2. สไตล์ที่ต้องการ (เช่น minimalist/Muji-inspired, playful/gamified, professional/clinical — พร้อม
     ข้อดี/ข้อเสีย)
  3. มีตัวอย่างภาพ/โลโก้/แบรนด์อ้างอิงหรือไม่ (ถ้ามีให้ผู้ใช้ส่งมา ใช้เป็น input หลักในการเลือก token)
  - เมื่อได้คำตอบแล้ว ให้สร้าง `DESIGN.md` ตามโครงสร้างเดียวกับที่ใช้ในโปรเจกต์นี้อยู่แล้ว (Brand Identity &
    CI, Design Tokens, UI Components & Patterns, UX Guidelines & Rules) โดยอ้างอิงคำตอบของผู้ใช้ — ถ้า
    คำตอบยังคลุมเครือเกินกว่าจะแปลงเป็น token ที่ใช้งานได้ (เช่น บอกแค่ "สีสบาย ๆ") ให้ใช้กติกา
    "ถามผู้ใช้ก่อนเสมอ" ด้านล่างถามต่อจนได้ข้อมูลพอสร้าง token จริงได้
  - หลังสร้าง/อัปเดต `DESIGN.md` แล้ว ให้ทำตาม convention ของโปรเจกต์นี้: อัปเดต
    `docs/02-design/01-prototypes/index.md` ให้กล่าวถึงไฟล์นี้ (ถ้ายังไม่ได้กล่าวถึง)
- ถ้ามี `DESIGN.md` อยู่แล้ว: อ่านทั้งไฟล์ และถือว่า token/component/กติกาทั้งหมดในนั้นเป็นข้อบังคับสำหรับทุก
  screen ที่จะสร้าง — ห้ามใช้สี/font/spacing ที่ไม่มีอยู่ใน DESIGN.md

## ขั้นตอนที่ 1 — รวบรวมข้อมูลตาม scope

อ่าน 4 แหล่งข้อมูลด้านบนเฉพาะส่วนที่อยู่ใน scope ให้ครบ แล้วสรุปเป็นรายการ: Feature ID → REQ ที่เกี่ยวข้อง →
Journey steps/diagram → component ของ DESIGN.md ที่ต้องใช้ — ถ้ามี prototype version อยู่แล้ว ให้รวมผลจาก
"Prototype Consistency Audit" ด้านบนเข้ามาด้วยตอนนี้

## ขั้นตอนที่ 2 — เสนอแผนให้ผู้ใช้รีวิวก่อนเสมอ (บังคับทุกครั้ง ห้ามข้าม)

**ห้ามสร้างไฟล์ใด ๆ ก่อนได้รับการยืนยันจากผู้ใช้** เสนอแผนเป็นข้อความสรุปที่มี:

1. รายชื่อ screen ที่จะสร้าง/แก้ (ตั้งชื่อจาก Feature ID + ชื่อหน้าจอ เช่น "ONB-1: กรอกข้อมูลส่วนตัว")
   พร้อมลำดับ flow ถ้ามีมากกว่า 1 screen ต่อ feature — ถ้ามาจาก audit ให้ระบุด้วยว่าทำไมต้องแก้ screen นั้น
2. REQ/Feature ID ที่ screen แต่ละอันครอบคลุม
3. Component/token หลักจาก DESIGN.md ที่จะใช้ (เช่น Calorie Ring, Video Recommendation Card)
4. ตำแหน่ง/เวอร์ชัน folder ที่จะสร้าง (ดูขั้นตอนที่ 3 — ต้องถามเรื่อง version ก่อนใส่ในแผนนี้ด้วย)
5. ถ้า audit พบว่าต้องแก้เอกสารอื่นนอกเหนือจาก prototype ด้วย (Requirement/Backlog/User Journey/AC/
   Test Plan/Test Case) ให้ระบุไว้ในแผนนี้ชัด ๆ ว่าจะเรียก `feature-list-journey`/`test-suite-builder`
   ต่อสำหรับส่วนไหน

รอผู้ใช้ยืนยัน หรือขอแก้แผน (เพิ่ม/ลด screen, เปลี่ยนลำดับ) ก่อนไปขั้นตอนที่ 4 เสมอ — การยืนยันแผนนี้เป็น
free-form ไม่ต้องบีบเป็นตัวเลือกจำกัดถ้าไม่จำเป็น (ต่างจากขั้นตอนที่ 3 ที่ต้องถามแบบมีตัวเลือกชัดเจน)

## ขั้นตอนที่ 3 — ตัดสินใจเรื่อง Version Folder (ถามผู้ใช้ทุกครั้งที่มีการเรียกซ้ำ)

โครงสร้าง: `docs/02-design/01-prototypes/v{N}/` (v1, v2, ... เรียงตามลำดับ)

- **ถ้ายังไม่มี version folder ใดอยู่เลย** (รันครั้งแรก) ข้ามขั้นตอนนี้ได้ สร้าง `v1/` ไปเลย
- **ถ้ามี version folder อยู่แล้วอย่างน้อย 1 อัน** (เช่น มี requirement ใหม่ หรือผู้ใช้ขอปรับ prototype เดิม
  หรือมาจากผล audit) **ต้องถามผู้ใช้ทุกครั้งโดยไม่มีข้อยกเว้น** (ใช้ AskUserQuestion) ว่าจะ:
  - **สร้าง version ใหม่** (`v{N+1}`) — คัดลอก screen ที่ยังไม่เปลี่ยนมาจาก version ล่าสุด แล้วแก้/เพิ่มเฉพาะ
    ส่วนที่เปลี่ยน
  - **แก้ไข version ล่าสุด** (`v{N}`) ตรง ๆ

  ให้คำแนะนำพร้อมเหตุผลเสมอ (แต่ยังต้องถามอยู่ดี ไม่ตัดสินใจแทนผู้ใช้):
  - **แนะนำสร้าง version ใหม่** เมื่อ: การเปลี่ยนแปลงมาจาก requirement ใหม่/เปลี่ยนแปลงนัยสำคัญ, หรือเป็นการ
    ปรับที่อยาก compare กับของเดิม, หรือ prototype เดิมได้รับการ review/อนุมัติไปแล้วและไม่อยากเสียของเดิม
    - ข้อดี: มี snapshot เทียบ before/after ได้, rollback ได้ถ้าของใหม่ผิดพลาด, เก็บ feedback ที่เคยได้รับ
      กับ version เดิมไว้ไม่ถูกทับ
    - ข้อเสีย: มีหลาย folder ให้ดูแล, screen ที่ไม่เปลี่ยนต้องคัดลอกมาซ้ำ, ต้องเขียนสรุปว่าต่างจาก version
      ก่อนอย่างไรไม่งั้น version เก่าจะไม่มีใครดูซ้ำ
  - **แนะนำแก้ไข version ล่าสุด** เมื่อ: เป็นการแก้เล็ก ๆ (typo, สี, spacing, ปรับ copy) กับ screen ที่ยังไม่ถูก
    review/อนุมัติเป็นทางการ
    - ข้อดี: ไม่มีของซ้ำ, เป็น source เดียวที่ update เสมอ, ง่ายสำหรับ fix เล็ก ๆ
    - ข้อเสีย: เทียบ before/after ไม่ได้แล้ว, ถ้าแก้พลาดจะไม่มี version ก่อนหน้าให้ย้อนกลับ, ถ้ามีคน review
      version ปัจจุบันไปแล้ว feedback นั้นอาจไม่ตรงกับของใหม่อีกต่อไป
  - ระบุให้ชัดว่าสถานการณ์ปัจจุบัน (เช่น "รอบนี้มาจาก requirement ใหม่ REQ-14" หรือ "รอบนี้แค่ขอแก้สีปุ่ม")
    ตรงกับกรณีไหน แล้วให้คำแนะนำตามนั้น

## ขั้นตอนที่ 4 — สร้างไฟล์ (หลังผู้ใช้ยืนยันแผนและ version แล้วเท่านั้น)

ต่อ version folder ที่เลือก (`docs/02-design/01-prototypes/v{N}/`):

- 1 ไฟล์ HTML ต่อ screen (self-contained: inline `<style>`/`<script>`, ไม่พึ่ง build tool หรือ CDN ภายนอก)
  เปิดดูตรงในเบราว์เซอร์ได้ทันที
- ใช้ CSS variables ตาม `--color-*`, `--font-*`, `--space-*`, `--radius-*` ที่นิยามไว้ใน DESIGN.md เป๊ะ ๆ
  ห้ามสร้างค่าใหม่นอกเหนือจากที่มี — ถ้าจำเป็นต้องมี component/token ใหม่ที่ DESIGN.md ยังไม่มี ให้ใช้กติกา
  "ถามผู้ใช้ก่อนเสมอ" ด้านล่าง เสนอ 3 ทาง (เช่น เพิ่ม token ใหม่เข้า DESIGN.md ก่อน, ประมาณด้วย token ที่ใกล้
  ที่สุดที่มีอยู่, หรือข้าม detail นั้นไปก่อน) พร้อมข้อดีข้อเสียและคำแนะนำ
- แต่ละ screen มี comment/attribute ระบุ Feature ID + REQ ที่เกี่ยวข้องไว้ที่ต้นไฟล์ เพื่อ trace กลับได้
- สร้าง `index.html` ใน version folder เดียวกัน เป็นสารบัญลิงก์ไปยังทุก screen ของ version นั้น
- สร้าง/อัปเดต `README.md` ใน version folder: scope ของ version นี้ (feature/epic ที่ครอบคลุม), แหล่งข้อมูล
  ที่อ้างอิง (ลิงก์กลับไปยัง backlog.md/01-spec//user-journeys.md/DESIGN.md/acceptance-criteria.md/
  test-plan.md/test-cases/ ถ้าใช้), และถ้าเป็น v2+ ให้มี section "เปลี่ยนแปลงจาก v{N-1}" สรุปว่าต่างจาก
  version ก่อนอย่างไรและทำไม (รวมถึงถ้ามาจาก consistency audit ให้ระบุว่า audit เจออะไร)

## กติกาเมื่อไม่แน่ใจหรือข้อมูลไม่พอ — ต้องถามผู้ใช้ก่อนเสมอ

ใช้รูปแบบเดียวกับ skill `feature-list-journey` ของโปรเจกต์นี้ทุกครั้งที่เจอความไม่ชัดเจน (ไม่ว่าจะเป็นเรื่อง
DESIGN.md bootstrap, การจัดวาง layout ที่ user journey ไม่ได้ระบุละเอียดพอ, component ที่ยังไม่มีใน
DESIGN.md, หรือทิศทางการ reconcile ความไม่สอดคล้องที่เจอจาก audit):

1. ระบุคำถามให้ชัดเจนว่าไม่แน่ใจเรื่องอะไร กระทบ screen/feature/เอกสารชั้นไหน
2. เสนอ **อย่างน้อย 3 แนวทาง** ที่เป็นไปได้
3. อธิบาย **เหตุผล ข้อดี ข้อเสีย** ของแต่ละแนวทาง
4. **แนะนำแนวทางที่ดีที่สุด 1 แนวทาง พร้อมเหตุผลที่แนะนำ**
5. รอคำตอบก่อนสร้าง/แก้ส่วนที่เกี่ยวข้องจริง — ห้ามเดาแล้วสร้างไปก่อน

## Output & รายงานผล

ก่อนหยุดงาน ให้สรุปกลับ:

- ผลจาก Prototype Consistency Audit (ถ้ารัน): เทียบกับกี่ชั้น, พบความไม่สอดคล้องอะไรบ้าง, จัดเป็นล้าหลัง/
  ข้อมูลใหม่/ขัดแย้งตรง ๆ อย่างไร
- แผนที่ผู้ใช้ยืนยันแล้ว (screen ที่สร้าง/แก้, REQ/Feature ID ที่ครอบคลุม)
- Version folder ที่ใช้ และเหตุผลที่เลือก (ใหม่ หรือแก้ของเดิม)
- ลิงก์ไปยัง `index.html` ของ version นั้นเพื่อเปิดดู
- ถ้ามีการสร้าง/แก้ไข DESIGN.md ระหว่างทาง ให้ระบุด้วยว่าเปลี่ยนอะไรไปบ้าง
- ถ้าเรียก `feature-list-journey`/`test-suite-builder` ต่อเพื่อแก้เอกสารอื่น ให้ระบุว่าเรียกไปทำอะไร และ
  ผลลัพธ์เป็นอย่างไร
- คำถามใดที่ยังรอผู้ใช้ตัดสินใจอยู่บ้าง (ถ้ามี)
