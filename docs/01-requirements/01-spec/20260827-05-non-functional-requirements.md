# 20260827-05 - Non-Functional Requirements

- **ประเภท:** Non-Functional Requirement
- **สถานะเอกสาร:** Draft
- **วันที่สร้าง:** 2026-08-27

## ขอบเขต (Scope)

**อยู่ในขอบเขต (In scope)**

- คุณภาพเชิงระบบที่ตัดขวางทุก Epic (Onboarding, Daily YouTube Recommendation, Planner & Logging, Smart
  Integrations) ไม่ใช่ business rule ของ feature ใดโดยเฉพาะ
- ครอบคลุม 5 ด้าน: **Performance**, **Security/Privacy**, **Reliability** (ตามที่ผู้ใช้เลือกเมื่อ bootstrap
  เอกสารนี้ผ่าน `test-suite-builder` วันที่ 2026-08-27) บวก **Usability** และ **Legal/Regulatory
  Compliance** (ขยายเพิ่มหลัง gap analysis ทั้ง pipeline วันที่ 2026-08-28 — ดู "ข้อสมมติฐาน/การตัดสินใจที่
  ยืนยันแล้ว")

**นอกขอบเขต (Out of scope)**

- Business rule เฉพาะ feature (อยู่ใน `01-spec/` ไฟล์อื่นแล้ว)
- ตัวเลข SLA/threshold ที่แม่นยำระดับ production (โปรเจกต์นี้ยังไม่มีระบบจริงให้วัด — ดู "จุดที่ยังไม่ได้ระบุ")

## รายละเอียด (Description)

เอกสารนี้เกิดจาก skill `test-suite-builder` ที่ต้องใช้ Non-Functional Requirement เป็นฐานในการเขียน
`docs/03-testing/01-test-plan/test-plan.md` แต่ยังไม่เคยมีเอกสาร NFR มาก่อนในโปรเจกต์ (ดู CLAUDE.md
"Building the test suite" — NFR bootstrap) จึงถูกสร้างขึ้นเป็นครั้งแรกตาม template เดียวกับ 4 ไฟล์ spec
ที่มีอยู่แล้ว แนวทางที่เลือก (สมดุลทั้ง 3 ด้าน) มาจากเหตุผลว่าแอปนี้ทั้งใช้งานทุกวัน (ต้อง responsive พอที่จะ
ไม่เป็นอุปสรรคต่อ core loop รายวัน) และเก็บข้อมูลสุขภาพส่วนบุคคล (น้ำหนัก ส่วนสูง ข้อมูลจาก wearable/ตาชั่ง
อัจฉริยะ ต้อง secure) พร้อมกัน — เน้นด้านใดด้านหนึ่งเพียงอย่างเดียวจะละเลยความเสี่ยงของอีกด้าน

## เงื่อนไข/กติกาทางธุรกิจ (Business Rules)

**Performance**

1. **NFR-01**: หน้าจอหลักที่ผู้ใช้เข้าทุกวัน (Daily Dashboard, REC-1) ต้องแสดงผลเนื้อหาหลัก (Calorie Ring +
   วิดีโอที่แนะนำ) ได้ภายในเวลาที่ผู้ใช้ไม่รู้สึกว่าแอปช้า — ตัวเลข threshold ที่แน่นอนยังไม่ยืนยัน (ดู
   "จุดที่ยังไม่ได้ระบุ")
2. **NFR-02**: ทุก action ที่มีผลกับข้อมูลของผู้ใช้ (บันทึกผลรายวัน, ตั้ง Cheat/Rest Day) ต้องแสดง feedback
   ทาง UI ทันทีภายใน 250ms โดยไม่ต้องรอ network response ก่อน (optimistic UI) — สอดคล้องกับกติกาที่มีอยู่
   แล้วใน [DESIGN.md §4.6](../../02-design/01-prototypes/DESIGN.md)
3. **NFR-03**: การคำนวณ BMR/TDEE (ONB-1), เป้าหมายแคลอรี่ (ONB-3), และแคลอรี่เผาผลาญจริงตามสูตร MET (REC-2)
   เป็นการคำนวณฝั่ง client/local ล้วน ต้องไม่มีความหน่วงที่ผู้ใช้สังเกตได้ (ไม่ใช่ external API call)

**Security/Privacy**

4. **NFR-04**: ข้อมูลสุขภาพส่วนบุคคล (อายุ เพศ น้ำหนัก ส่วนสูง เป้าหมาย ข้อมูลจาก wearable/ตาชั่งอัจฉริยะ)
   ต้องเข้ารหัสระหว่างส่ง (TLS) เสมอ และเข้ารหัสขณะจัดเก็บ (encryption at rest) เมื่อมี backend จริง
5. **NFR-05**: การเชื่อมต่อ Health API/wearable (INT-3) และตาชั่งอัจฉริยะผ่าน Bluetooth (INT-2) ต้องขอ
   consent จากผู้ใช้อย่างชัดเจนก่อนทุกครั้ง (OAuth/system permission prompt) ห้าม auto-connect โดยไม่ถาม
6. **NFR-06**: ผู้ใช้ต้องสามารถขอให้ลบข้อมูลส่วนบุคคลทั้งหมดของตนเองได้ (data deletion) เมื่อมีระบบบัญชี
   ผู้ใช้จริง

**Reliability**

7. **NFR-07**: เมื่อ YouTube API (REC-1/REC-2), Health API/wearable (INT-3), หรือตาชั่งอัจฉริยะ (INT-2)
   ไม่ตอบสนองหรือ error ระบบต้อง fallback อย่างสงบ (ตรงกับ DESIGN.md — ไม่ใช้ error ที่ทำให้ผู้ใช้ตกใจ)
   โดย core loop รายวัน (ONB → REC-1 → PLN-3) ต้องยังใช้งานได้แม้ Smart Integrations (Epic 4, MoSCoW =
   Could ทั้งหมด) จะ unavailable
8. **NFR-08**: ข้อมูล log รายวัน (PLN-3) และ streak (PLN-4) ต้องไม่สูญหายจาก network เชื่อมต่อไม่เสถียร —
   ต้องมี local persistence ก่อน sync ขึ้น backend (เมื่อมี backend จริง)

**Usability**

9. **NFR-09**: ทุกหน้าจอต้องผ่านเกณฑ์ accessibility ขั้นต่ำ — touch target ไม่ต่ำกว่า 44×44px ทุก
   interactive element (ปุ่ม, chip, tab), contrast ratio ของสีต้องผ่านมาตรฐาน WCAG AA, ห้ามสื่อความหมาย
   สถานะด้วยสีอย่างเดียว (ต้องมี icon หรือ label ข้อความควบคู่เสมอ), และต้องรองรับการปรับขนาดตัวอักษรของระบบ
   ปฏิบัติการ (Dynamic Type/font scaling) โดย layout ต้องไม่พังที่ 150%
10. **NFR-10**: ภาษาไทยต้องเป็นภาษาหลักของทุกหน้าจอ (label ปุ่ม/หัวข้อหลักต้องเป็นภาษาไทยเสมอ) ศัพท์เทคนิค
    ที่ไม่มีคำไทยที่เข้าใจง่ายกว่าอนุญาตให้ทับศัพท์ภาษาอังกฤษได้ (เช่น streak, wearable)

**Legal/Regulatory Compliance**

11. **NFR-11**: ระบบต้องปฏิบัติตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล (PDPA) มาตรฐานทั่วไป ครอบคลุมอย่าง
    น้อย 3 ด้าน (เมื่อมีระบบบัญชีผู้ใช้/backend จริง): (ก) บันทึก consent ที่ผู้ใช้ให้ไว้ (เชื่อมกับ NFR-05)
    พร้อมวันเวลาและขอบเขตที่ยินยอม เพื่อพิสูจน์ย้อนหลังได้ (ข) ผู้ใช้ต้องเข้าถึง/แก้ไข/ลบข้อมูลส่วนบุคคลของ
    ตนเองได้ (เชื่อมกับ NFR-06) (ค) ต้องมีกระบวนการแจ้งเหตุข้อมูลรั่วไหล (breach notification) ต่อผู้ใช้และ
    หน่วยงานที่เกี่ยวข้องตามที่กฎหมายกำหนด

## Acceptance Criteria

- [ ] หน้า Daily Dashboard แสดงเนื้อหาหลักได้โดยไม่รู้สึกหน่วง (NFR-01)
- [ ] action ที่บันทึกข้อมูล (log, Cheat/Rest Day) แสดง feedback ทันทีภายใน 250ms (NFR-02)
- [ ] การคำนวณ BMR/TDEE/MET เป็น client-side ไม่มี network latency เกี่ยวข้อง (NFR-03)
- [ ] ข้อมูลสุขภาพเข้ารหัสทั้งระหว่างส่งและจัดเก็บ (NFR-04)
- [ ] การเชื่อมต่อ wearable/ตาชั่งอัจฉริยะ ต้องผ่าน consent prompt ก่อนเสมอ (NFR-05)
- [ ] ผู้ใช้ขอลบข้อมูลส่วนตัวได้ (NFR-06)
- [ ] core loop รายวันยังทำงานได้แม้ external integration ล่ม (NFR-07)
- [ ] log/streak ไม่หายเมื่อ network ไม่เสถียร (NFR-08)
- [ ] ทุกหน้าจอผ่านเกณฑ์ accessibility ขั้นต่ำ (touch target, contrast, ไม่ใช้สีสื่อความหมายอย่างเดียว,
      font scaling) (NFR-09)
- [ ] ทุกหน้าจอใช้ภาษาไทยเป็นภาษาหลัก ศัพท์เทคนิคทับศัพท์ได้ตามที่กำหนด (NFR-10)
- [ ] มีกระบวนการ consent record-keeping, สิทธิ์เจ้าของข้อมูล, และ breach notification ตาม PDPA (NFR-11)

## ข้อสมมติฐาน/การตัดสินใจที่ยืนยันแล้ว

- **กรอบ NFR ที่เลือก = สมดุล Performance + Security + Reliability** (ยืนยันจากผู้ใช้ผ่าน AskUserQuestion
  ตอน bootstrap เอกสารนี้ในเซสชัน `test-suite-builder` วันที่ 2026-08-27) แทนการเน้นด้านใดด้านหนึ่งเพียง
  อย่างเดียว
- **Epic 4 (Smart Integrations) เป็น Could ทั้งหมด** ตาม `backlog.md` จึงถูกยึดเป็นฐานของ NFR-07 ว่า core
  loop ต้องไม่ผูกกับความพร้อมของ integration เหล่านี้
- **ขยายขอบเขต NFR doc จาก 3 เป็น 5 หมวด (ยืนยันจากผู้ใช้ผ่าน AskUserQuestion 2026-08-28)**: หลังทำ NFR gap
  analysis เทียบกับทุกเอกสารในไปป์ไลน์ (requirement, backlog, feature list, test case, test report, HLA,
  detailed design) พบว่ามีกติกาที่มีหลักฐานรองรับอยู่แล้วในเอกสารอื่นแต่ยังไม่ถูก formalize เป็น NFR — ผู้ใช้
  ยืนยันให้เพิ่ม **Usability** (NFR-09 mirror จาก [DESIGN.md §4.3](../../02-design/01-prototypes/DESIGN.md),
  NFR-10 mirror จาก [DESIGN.md §4.5](../../02-design/01-prototypes/DESIGN.md) — รูปแบบเดียวกับที่ NFR-02
  เคย mirror §4.6 มาก่อน) และ **Legal/Regulatory Compliance** (NFR-11 มาจากคำตอบ Discovery Questionnaire
  ใน [tech-stack.md § 2](../../02-design/02-technical/tech-stack.md) ที่ยืนยันว่าต้องทำตาม PDPA มาตรฐาน)
  — ตัดสินใจ **ไม่กำหนด Scalability/Capacity NFR** ในรอบนี้ เพราะยังไม่มีตัวเลขเป้าหมายผู้ใช้จริง (รอ
  business input ภายหลัง)
- **Web app feature parity ของ Epic 4 (ยืนยันจากผู้ใช้ 2026-08-28, เกี่ยวข้องกับหลักการของ NFR-07)**: Core
  loop parity เต็มทุกแพลตฟอร์ม + Epic 4 (INT-1/INT-2/INT-3) เป็น mobile-only โดยตั้งใจ เว็บแสดงข้อความ
  "ไม่รองรับ" อย่างสงบ — **ไม่ใช่ NFR ใหม่ในเอกสารนี้** decision นี้จะถูกบันทึกอย่างเป็นทางการโดย
  `architecture-builder` ใน [high-level-architecture.md](../../02-design/02-technical/high-level-architecture.md)
  §6 External Integration Boundaries แทน

## จุดที่ยังไม่ได้ระบุ / ควรยืนยันเพิ่มเติม

- **NFR-01**: ยังไม่มีตัวเลข threshold เวลาโหลดหน้าจอที่แน่นอน (เช่น "< 2 วินาทีบน 4G") — โปรเจกต์นี้ยังไม่มี
  backend/infra จริงให้วัด ต้องยืนยันเมื่อเข้าสู่ขั้นตอน implementation จริง
- **NFR-04/NFR-06**: ยังไม่มีระบบบัญชีผู้ใช้ (authentication) หรือ backend storage จริงในโปรเจกต์นี้ ณ ตอนนี้
  — NFR เหล่านี้เป็นข้อกำหนดล่วงหน้าสำหรับตอนที่มีระบบจริง ไม่ใช่สิ่งที่ตรวจสอบได้ในโปรโตไทป์ปัจจุบัน
- **NFR-07**: ยังไม่ได้กำหนด uptime/SLA เป็นตัวเลขเฉพาะสำหรับ YouTube/Health API dependency เพราะเป็น
  third-party service ที่ทีมไม่ได้ควบคุม SLA เอง
- **Data retention period**: ยังไม่ได้ระบุว่าจะเก็บ log ประวัติย้อนหลังนานแค่ไหน (เกี่ยวโยงกับ PLN-3's Log
  History และ NFR-06)
- **NFR-10**: รูปแบบวันที่/ตัวเลขตาม locale ไทย (ค.ศ. หรือ พ.ศ.) ยังไม่ตกลง — [DESIGN.md
  §4.5](../../02-design/01-prototypes/DESIGN.md) เองก็ทิ้ง open point นี้ไว้เช่นกัน ต้องยืนยันก่อน
  implement จริง
- **NFR-11**: ยังไม่มีกระบวนการ/timeline breach notification ที่เป็นรูปธรรม (เช่น ต้องแจ้งภายในกี่ชั่วโมง)
  เพราะยังไม่มีระบบบัญชีผู้ใช้/backend จริงให้ทดสอบ เช่นเดียวกับ NFR-04/NFR-06
- **Scalability/Capacity**: ยังไม่มี NFR สำหรับจำนวนผู้ใช้ระยะแรก/concurrent usage เพราะยังไม่มีตัวเลข
  เป้าหมายทางธุรกิจ (ผู้ใช้ตัดสินใจเลื่อนออกไปก่อนเมื่อ 2026-08-28 — ดู "ข้อสมมติฐาน/การตัดสินใจที่ยืนยัน
  แล้ว")

## ความสัมพันธ์กับเอกสารอื่น (Requirement Cross-reference Analysis)

NFR-02 formalize กติกาที่มีอยู่แล้วใน [DESIGN.md §4.6](../../02-design/01-prototypes/DESIGN.md) (ไม่ใช่
กติกาใหม่ เป็นการอ้างอิงย้อนกลับ) NFR-05/NFR-07 ผูกกับ Epic 4
[Smart Integrations](20260823-04-smart-integrations.md) โดยตรง (INT-2 ตาชั่งอัจฉริยะ, INT-3 wearable)
NFR-03 ผูกกับสูตรที่ resolve แล้วใน [Onboarding/ONB-1](20260823-01-onboarding-personalization.md) และ
[Daily YouTube Recommendation/REC-2](20260823-02-daily-youtube-recommendation.md) NFR-08 ผูกกับ
[Planner & Logging](20260823-03-planner-logging.md) (PLN-3, PLN-4) เอกสารนี้เป็น input หลักของ
`docs/03-testing/01-test-plan/test-plan.md` ตาม skill `test-suite-builder`

NFR-09/NFR-10 formalize กติกาที่มีอยู่แล้วใน [DESIGN.md
§4.3](../../02-design/01-prototypes/DESIGN.md) (Accessibility) และ
[§4.5](../../02-design/01-prototypes/DESIGN.md) (ภาษาและ Localization) ตามลำดับ — pattern เดียวกับ
NFR-02/§4.6 ข้างต้น NFR-11 อ้างอิงคำตอบ Discovery Questionnaire ใน [tech-stack.md §
2](../../02-design/02-technical/tech-stack.md)

**หมายเหตุสำหรับ `feature-list-journey`**: การเพิ่ม NFR-09/NFR-10/NFR-11 รอบนี้ทำให้ตาราง "NFR
Traceability" ใน [backlog.md](../backlog.md#non-functional-requirements-nfr-traceability) (ปัจจุบันมีแค่
NFR-01–08) ล้าหลัง — `test-suite-builder` ไม่มีสิทธิ์แก้ `backlog.md` เอง ต้องให้ `feature-list-journey`
เพิ่ม 3 แถวใหม่ต่อ (NFR-09/10 ผูกกับทุก Feature ID เพราะเป็น UI-level cross-cutting, NFR-11 ผูกกับ Feature
ที่เก็บ/เชื่อมต่อข้อมูลส่วนบุคคลเหมือน NFR-04/NFR-06)
