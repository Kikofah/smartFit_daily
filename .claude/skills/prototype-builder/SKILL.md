---
name: prototype-builder
description: Build visual/interactive HTML prototypes for smartFit_daily screens from Requirement (01-spec), Product Backlog/Feature List (backlog.md), and User Journey (user-journeys.md) docs, styled strictly per docs/02-design/01-prototypes/DESIGN.md. Defaults to covering every feature but accepts a narrower scope (specific Feature ID(s)/Epic(s)/screen). Always proposes a plan for the user to review and confirm before building anything, and on every re-run asks whether to create a new version folder or edit the latest one - with a recommendation either way. If DESIGN.md doesn't exist yet, stops and asks the user to help create it first. Use when asked to build, mockup, prototype, or update a prototype/wireframe for smartFit_daily.
---

# Prototype Builder

สร้าง prototype แบบ HTML ที่ดูจริง (ไม่ใช่แค่ wireframe เส้นดำ-ขาว) ของหน้าจอ smartFit_daily โดยรวม
4 แหล่งข้อมูลเข้าด้วยกันเสมอสำหรับทุก feature ที่อยู่ใน scope:

1. **Requirement** (`docs/01-requirements/01-spec/*.md`) — ขอบเขต/กติกาทางธุรกิจจริงที่ screen ต้องรองรับ
2. **Product Backlog / Feature List** (`docs/01-requirements/backlog.md`) — feature ไหนอยู่ใน scope, priority
3. **User Journey** (`docs/02-design/01-prototypes/user-journeys.md`) — ลำดับหน้าจอ/ขั้นตอนจริงต่อ feature
4. **Design System** (`docs/02-design/01-prototypes/DESIGN.md`) — สี, font, spacing, component ที่ต้องใช้

**ห้ามสร้าง prototype จากแหล่งใดแหล่งหนึ่งเพียงอย่างเดียว** — ทุก screen ต้อง trace ได้ทั้งไปยัง Feature ID,
REQ-xx ที่เกี่ยวข้อง, และ token/component ที่ใช้จริงจาก DESIGN.md

## Scope: ทั้งหมดโดย default แต่ระบุเจาะจงได้

- ถ้าไม่ได้ระบุ scope มา ให้สร้าง prototype ครอบคลุม **ทุก feature ในทุก epic** ตาม `backlog.md`
- ถ้าผู้ใช้ระบุเจาะจง (Feature ID เดียว, epic เดียว, หรือหน้าจอ/flow เดียว) ให้จำกัด scope ตามนั้น แต่ยังต้อง
  อ่านแหล่งข้อมูลทั้ง 4 อย่างของ scope นั้นให้ครบเหมือนเดิม ไม่ตัดข้อมูลที่จำเป็นออกเพื่อความเร็ว

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
Journey steps/diagram → component ของ DESIGN.md ที่ต้องใช้

## ขั้นตอนที่ 2 — เสนอแผนให้ผู้ใช้รีวิวก่อนเสมอ (บังคับทุกครั้ง ห้ามข้าม)

**ห้ามสร้างไฟล์ใด ๆ ก่อนได้รับการยืนยันจากผู้ใช้** เสนอแผนเป็นข้อความสรุปที่มี:

1. รายชื่อ screen ที่จะสร้าง (ตั้งชื่อจาก Feature ID + ชื่อหน้าจอ เช่น "ONB-1: กรอกข้อมูลส่วนตัว")
   พร้อมลำดับ flow ถ้ามีมากกว่า 1 screen ต่อ feature
2. REQ/Feature ID ที่ screen แต่ละอันครอบคลุม
3. Component/token หลักจาก DESIGN.md ที่จะใช้ (เช่น Calorie Ring, Video Recommendation Card)
4. ตำแหน่ง/เวอร์ชัน folder ที่จะสร้าง (ดูขั้นตอนที่ 3 — ต้องถามเรื่อง version ก่อนใส่ในแผนนี้ด้วย)

รอผู้ใช้ยืนยัน หรือขอแก้แผน (เพิ่ม/ลด screen, เปลี่ยนลำดับ) ก่อนไปขั้นตอนที่ 4 เสมอ — การยืนยันแผนนี้เป็น
free-form ไม่ต้องบีบเป็นตัวเลือกจำกัดถ้าไม่จำเป็น (ต่างจากขั้นตอนที่ 3 ที่ต้องถามแบบมีตัวเลือกชัดเจน)

## ขั้นตอนที่ 3 — ตัดสินใจเรื่อง Version Folder (ถามผู้ใช้ทุกครั้งที่มีการเรียกซ้ำ)

โครงสร้าง: `docs/02-design/01-prototypes/v{N}/` (v1, v2, ... เรียงตามลำดับ)

- **ถ้ายังไม่มี version folder ใดอยู่เลย** (รันครั้งแรก) ข้ามขั้นตอนนี้ได้ สร้าง `v1/` ไปเลย
- **ถ้ามี version folder อยู่แล้วอย่างน้อย 1 อัน** (เช่น มี requirement ใหม่ หรือผู้ใช้ขอปรับ prototype เดิม)
  **ต้องถามผู้ใช้ทุกครั้งโดยไม่มีข้อยกเว้น** (ใช้ AskUserQuestion) ว่าจะ:
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
  ที่อ้างอิง (ลิงก์กลับไปยัง backlog.md/01-spec//user-journeys.md/DESIGN.md), และถ้าเป็น v2+ ให้มี section
  "เปลี่ยนแปลงจาก v{N-1}" สรุปว่าต่างจาก version ก่อนอย่างไรและทำไม

## กติกาเมื่อไม่แน่ใจหรือข้อมูลไม่พอ — ต้องถามผู้ใช้ก่อนเสมอ

ใช้รูปแบบเดียวกับ skill `feature-list-journey` ของโปรเจกต์นี้ทุกครั้งที่เจอความไม่ชัดเจน (ไม่ว่าจะเป็นเรื่อง
DESIGN.md bootstrap, การจัดวาง layout ที่ user journey ไม่ได้ระบุละเอียดพอ, หรือ component ที่ยังไม่มีใน
DESIGN.md):

1. ระบุคำถามให้ชัดเจนว่าไม่แน่ใจเรื่องอะไร กระทบ screen/feature ไหน
2. เสนอ **อย่างน้อย 3 แนวทาง** ที่เป็นไปได้
3. อธิบาย **เหตุผล ข้อดี ข้อเสีย** ของแต่ละแนวทาง
4. **แนะนำแนวทางที่ดีที่สุด 1 แนวทาง พร้อมเหตุผลที่แนะนำ**
5. รอคำตอบก่อนสร้าง/แก้ส่วนที่เกี่ยวข้องจริง — ห้ามเดาแล้วสร้างไปก่อน

## Output & รายงานผล

ก่อนหยุดงาน ให้สรุปกลับ:

- แผนที่ผู้ใช้ยืนยันแล้ว (screen ที่สร้าง, REQ/Feature ID ที่ครอบคลุม)
- Version folder ที่ใช้ และเหตุผลที่เลือก (ใหม่ หรือแก้ของเดิม)
- ลิงก์ไปยัง `index.html` ของ version นั้นเพื่อเปิดดู
- ถ้ามีการสร้าง/แก้ไข DESIGN.md ระหว่างทาง ให้ระบุด้วยว่าเปลี่ยนอะไรไปบ้าง
- คำถามใดที่ยังรอผู้ใช้ตัดสินใจอยู่บ้าง (ถ้ามี)
