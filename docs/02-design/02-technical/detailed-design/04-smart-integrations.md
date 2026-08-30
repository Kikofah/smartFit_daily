# Detailed Design — Smart Integrations (Conceptual)

- **ประเภทเอกสาร:** Detailed Design — Conceptual (ไม่ผูก technical stack)
- **สถานะเอกสาร:** Draft
- **วันที่สร้าง:** 2026-08-28
- **อัปเดตล่าสุด:** 2026-08-31 — audit เทียบกับโค้ดจริงที่เพิ่ง ship (commit `b463436`,
  `apps/web/server/routes/insights-forecast/index.ts`) พบ 2 จุดที่ INT-1 เนื้อหาหลักขัดกับ implementation
  จริง: (1) **step 4 ของอัลกอริทึม "คำนวณวันพยากรณ์ถึงเป้าหมายน้ำหนัก" เขียนสูตรผิด** — เอกสารเดิมเขียนว่า
  "อัตราขาดดุลเฉลี่ยต่อวัน = ผลรวมส่วนต่าง (เป้าหมาย − แคลอรี่จริง) หารด้วยจำนวนวัน" ซึ่งกลับทิศความสัมพันธ์
  (ออกกำลังกายน้อยลงจะพยากรณ์ว่าน้ำหนักเปลี่ยนเร็วขึ้น ผิดหลักการ) — สูตรที่ถูกต้องและ ship จริง (ยืนยันจาก
  code comment ในไฟล์ข้างต้น ซึ่งระบุว่าผู้ใช้ยืนยันการแก้นี้แล้วเมื่อ 2026-08-31 ในอีก session หนึ่ง) คือ
  **ค่าเฉลี่ยของแคลอรี่ที่เผาผลาญจริงต่อวัน (accumulatedKcal ต่อวัน)** ตรงๆ ไม่ใช่ผลต่างจากเป้าหมาย — เพราะแอปนี้
  ติดตามเฉพาะแคลอรี่ที่เผาผลาญจากการออกกำลังกาย ไม่มีการบันทึกแคลอรี่จากอาหาร แก้ทั้ง step 4 ของอัลกอริทึมและ
  label ที่เกี่ยวข้องใน sequence diagram ให้ตรงกัน (2) **หัวข้อ "Execution ของ algorithm" และแถว "Insights &
  Forecast" ในภาคผนวก Stack Mapping อ้างผิดว่า INT-1 คำนวณฝั่ง client แล้วส่งผลลัพธ์มาบันทึก** — จริงๆ
  `GET /api/insights/forecast` เป็น bodyless GET request ที่ **server คำนวณทั้งหมดเอง** (อ่านเป้าหมายน้ำหนัก/
  ประวัติ log/น้ำหนักล่าสุด คำนวณอัตราขาดดุล-อัตราเปลี่ยนแปลงน้ำหนัก-วันที่คาดถึงเป้าหมาย แล้วบันทึกผลเอง)
  แก้ข้อความให้ตรงกับ execution จริงฝั่ง server (การอ้าง NFR-01/03 สำหรับ INT-1 เป็นการเข้าใจเกินจริงจากตอนที่
  เขียน section นี้ครั้งแรกโดย generalize จาก REC-2's MET calculation ซึ่งมีเหตุผล latency ระหว่างออกกำลังกาย
  จริง — INT-1 เป็นการพยากรณ์ "อีกกี่วันถึงเป้าหมาย" ที่ไม่มีความจำเป็นด้าน sub-250ms feedback แบบเดียวกัน) —
  แก้แถว "Insights & Forecast" ที่ระบุว่า "ปัจจุบันคืนค่า snapshot ที่มีอยู่ตรงๆ รอ implement การคำนวณจริง" ซึ่ง
  ล้าหลังไปแล้วเช่นกัน (implement จริงและ ship แล้วเต็มรูปแบบ) — ตรวจ `MIN_LOG_DAYS_FOR_FORECAST = 3` ในโค้ด
  แล้วยืนยันว่า**ยังไม่ใช่ decision ที่ resolve เป็นทางการ** (code comment ระบุว่าเป็นค่า placeholder เชิง
  ปฏิบัติ) — คงจุดที่ยังไม่ได้ระบุ #1 (จำนวนวัน log ขั้นต่ำ) ไว้เหมือนเดิม เพิ่มหมายเหตุอ้างอิงค่า placeholder
  นี้ประกอบ — ไม่พบ drift อื่นใน INT-0/2/3/State Diagram (ดู [log 2026-08-31](../../../05-log/20260831-log.md))
- **อัปเดตก่อนหน้า:** 2026-08-30 (รอบ 3) — Citation/grouping-only fix: `feature-journey-writer` เพิ่งตั้งกลไก
  pairing-code เป็นบทบัญญัติทางการ **REQ-18** พร้อม Feature ID ของตัวเอง **INT-0** (แทนที่การอ้างเป็น
  implicit precondition ของ REQ-12/REQ-13 เดิม) — แก้หัวข้อ "Identity Handoff — Pairing-Code Mechanism"
  ให้เป็นหัวข้อกลุ่ม Feature ID **`## INT-0 — ... (REQ-18)`** ตรงรูปแบบเดียวกับ INT-1/2/3 อื่น และแก้ list
  "ความสัมพันธ์กับเอกสารอื่น" ให้รวม INT-0/REQ-18 — ไม่แก้ตัว sequence diagram หรือเนื้อหาของ INT-2/INT-3
  เอง
- **อัปเดตก่อนหน้า:** 2026-08-30 (รอบ 2) — Reconcile 2 จุดตาม `tech-stack.md`/`api-spec.md`/`database-schema.md`
  ฉบับล่าสุดที่ยืนยันจากโค้ดจริง (`apps/web/server/routes/pairing/index.ts`): (1) **แก้ `alt` block ของ
  sequence diagram "Identity Handoff — Pairing-Code Mechanism"** จากเดิม 3 กรณีแยก
  (`404` ไม่พบ/`409` ถูกใช้แล้ว/`422` หมดอายุ) เป็น **`410 Gone` กรณีเดียวครอบคลุมทั้งสามสถานการณ์**
  (ไม่พบรหัสเลย/หมดอายุแล้ว/ถูกใช้ไปแล้ว) ให้ตรงกับ `api-spec.md` §3.1 ฉบับล่าสุดเป๊ะ (โค้ดจริงลบ document
  ทิ้งทันทีหลัง redeem สำเร็จ — delete-on-redeem — แทนการตั้ง flag `is_used` ทำให้ 3 สถานการณ์เดิมแยกออกจาก
  กันไม่ได้อีกต่อไปในทางปฏิบัติ) — แก้ step มินต์ให้ตรงกับ `database-schema.md` §3.17 ฉบับล่าสุดที่**ลบ column
  `is_used` ออกแล้ว**เช่นกัน (ไม่มี `is_used = false` ในขั้นตอน mint อีกต่อไป, ขั้นตอน redeem สำเร็จเปลี่ยนจาก
  "ตั้ง is_used = true" เป็น "ลบ pairing_credential ทิ้งถาวรทันที") — นี่คือการแก้เอกสารให้ตรงกับพฤติกรรมที่
  shipped ไปแล้วจริง ไม่ใช่การตัดสินใจ business rule ใหม่ (2) **mechanical re-sync หัวข้อ "ภาคผนวก: Stack
  Mapping"** ทั้งหมดให้ตรงกับ `tech-stack.md` §6.1/§6.2/§6.3 ฉบับล่าสุด (Express.js บน **Google Cloud Run**
  แทนที่ Firebase Cloud Functions เดิม) — audit ส่วนที่เหลือของไฟล์ (State Diagram Integration Connection,
  INT-1, INT-2, INT-3) แล้วไม่พบ drift อื่น (ดู [log 2026-08-30](../../../05-log/20260830-log.md))
- **อัปเดตก่อนหน้า:** 2026-08-30 (รอบ 1) — audit พบว่า `high-level-architecture.md` เพิ่มกลไกใหม่ **Identity
  Handoff — Pairing-Code Mechanism** (§4.5, component interaction ระหว่าง Account & Session Management ↔
  Integration Gateway) พร้อม entity ใหม่ **Pairing Credential** (§5), `api-spec.md` เพิ่ม 2 operations
  ใหม่ท้ายหัวข้อ 3.1 (`POST /auth/pairing-codes`, `POST /auth/pairing-codes/redeem`), และ
  `database-schema.md` เพิ่มตาราง `pairing_credential` (หัวข้อ 3.17) — แต่ไฟล์นี้ยังไม่มีเนื้อหารองรับเลย
  (เอกสารล้าหลัง ไม่ใช่ข้อขัดแย้ง) — เพิ่ม**ส่วนใหม่ "Identity Handoff — Pairing-Code Mechanism"** (ก่อน
  INT-2) พร้อม sequence diagram 1 ตัว ครอบคลุม mint (`POST /auth/pairing-codes`) → แสดงรหัสบนเว็บ → กรอก
  บนมือถือ → redeem (`POST /auth/pairing-codes/redeem`) พร้อม alt block ครบ 3 edge case
  (`404`/`409`/`422` ตาม `api-spec.md` §3.1 ณ ตอนนั้น — **แก้ไขแล้วในรอบ 2 ด้านบน**) → ส่งต่อเข้ากระบวนการ
  จริงของ INT-2/INT-3 — **ไม่ทำ State Diagram แยกสำหรับ Pairing Credential** (มีเพียง `is_used` เป็น
  `boolean` ไม่ใช่ `enum` หลายค่า ไม่เข้าเกณฑ์ state diagram ที่ต้องอิงกับ `enum` จริงตามกติกาของเอกสารนี้ —
  เทียบเคียงกับเหตุผลเดียวกันที่ User Account ใน `01-onboarding-personalization.md` ก็ไม่มี state diagram)
  เพิ่ม `Note` precondition ใน sequence diagram ของ INT-2/INT-3 ทั้งคู่ให้ชี้กลับมาที่ diagram ใหม่นี้ และ
  เพิ่มตาราง `pairing_credential` ในหัวข้อ "ความสัมพันธ์กับเอกสารอื่น" — **ไม่แตะหัวข้อ "ภาคผนวก: Stack
  Mapping"** ตามที่ผู้ใช้ยืนยันว่า `tech-stack.md` ยังไม่ reconcile จาก Firebase เดิมมาเป็น stack จริงตามโค้ด
  รอรวมกับงาน reconcile อื่นทั้งหมดในรอบ `tech-stack-builder` ถัดไป — audit ส่วนที่เหลือของไฟล์ (State
  Diagram Integration Connection, INT-1) แล้วไม่พบ drift อื่น (ดู
  [log 2026-08-30](../../../05-log/20260830-log.md))
- **อัปเดตก่อนหน้า:** 2026-08-29 — sync ภาคผนวก Stack Mapping ให้ตรงกับ `tech-stack.md` ฉบับ Firebase ใหม่ และ
  แก้ label ของ State Diagram (Integration Connection) ให้ตรงกับ `enum` จริงใน `database-schema.md` §3.15
  (audit เนื้อหาหลัก sequence/state diagram/algorithm ของ INT-1/2/3 ส่วนอื่นแล้วไม่พบ drift)
- **สร้างโดย:** skill `detailed-design-builder`
- **อ้างอิงจาก:** [High Level Architecture](../high-level-architecture.md), [API Spec](../api-spec.md),
  [Database Schema](../database-schema.md), [Product Backlog](../../../01-requirements/backlog.md),
  [Requirement](../../../01-requirements/01-spec/20260823-04-smart-integrations.md)

## ขอบเขตและหลักการ

เอกสารนี้เจาะจงกว่า API Spec/Database Schema อีกหนึ่งระดับ — **ยังคง conceptual ไม่ผูก technical stack**
sequence diagram ใช้ participant เป็น Conceptual Component จาก HLA หรือ actor ทั่วไปเท่านั้น (รวมถึงชื่อ
ระบบภายนอกที่ requirement กำหนดไว้แล้ว เช่น YouTube, Health API — ไม่ถือเป็นการผูก stack) อัลกอริทึม
เขียนเป็นขั้นตอนภาษาธรรมชาติ/pseudocode เชิงแนวคิด ไม่ใช่โค้ดจริง

## State Diagram — Integration Connection

`integration_connection.connection_status` มี state transition ที่มีความหมายพอสำหรับทั้ง INT-2 และ
INT-3 (ใช้ enum เดียวกัน แค่ `integration_type` ต่างกัน):

```mermaid
stateDiagram-v2
    [*] --> ยังไม่เชื่อมต่อ
    ยังไม่เชื่อมต่อ --> เชื่อมต่อแล้ว: POST .../connect (สำเร็จ + consent)
    ยังไม่เชื่อมต่อ --> ยังไม่เชื่อมต่อ: POST .../connect (ล้มเหลว หรือถูกปฏิเสธ consent)
    เชื่อมต่อแล้ว --> ถอน consent แล้ว: DELETE .../disconnect
    ถอน consent แล้ว --> เชื่อมต่อแล้ว: POST .../connect (เชื่อมต่อใหม่)
```

## INT-1 — พยากรณ์วันถึงเป้าหมายน้ำหนัก (REQ-11)

### Sequence Diagram

```mermaid
sequenceDiagram
    actor U as ผู้ใช้
    participant IF as Insights & Forecast
    participant PP as Personalization & Profile
    participant LS as Logging & Streak
    U->>IF: GET /insights/forecast
    IF->>PP: ตรวจสอบ goal_selection.target_weight_kg
    alt ไม่มีน้ำหนักเป้าหมาย
        IF-->>U: 422 Unprocessable (ให้ไปกรอกที่ ONB-3/โปรไฟล์)
    else มีน้ำหนักเป้าหมาย
        IF->>LS: ตรวจสอบจำนวนวัน log สะสม
        alt log สะสมไม่พอ (จำนวนขั้นต่ำยังไม่ระบุ)
            IF-->>U: 422 Unprocessable (ต้องสะสมข้อมูลเพิ่ม)
        else log สะสมเพียงพอ
            IF->>LS: ดึงประวัติ daily_log จริง (แคลอรี่ที่เผาผลาญจริงต่อวัน)
            IF->>IF: คำนวณค่าเฉลี่ยแคลอรี่ที่เผาผลาญจริงต่อวัน (average daily deficit — ค่าเฉลี่ยตรงๆ
                ไม่ใช่ผลต่างจากเป้าหมาย เพราะแอปติดตามเฉพาะแคลอรี่เผาผลาญ ไม่มีการบันทึกแคลอรี่จากอาหาร)
            IF->>IF: แปลงเป็นอัตราเปลี่ยนแปลงน้ำหนัก (7,700 kcal ประมาณ 1 กก.)
            IF->>IF: คำนวณวันที่คาดถึงเป้าหมาย
            IF->>IF: บันทึกลง weight_forecast_snapshot
            IF-->>U: 200 OK (วันที่คาดการณ์ + อัตราขาดดุลเฉลี่ย)
        end
    end
```

### อัลกอริทึม — คำนวณวันพยากรณ์ถึงเป้าหมายน้ำหนัก

> **แก้ไขแล้ว (2026-08-31)**: step 4 เดิมเขียนสูตรผิดเป็นผลต่างจากเป้าหมาย (เป้าหมาย − แคลอรี่จริง) ซึ่งกลับ
> ทิศความสัมพันธ์ — สูตรที่ถูกต้องและ ship จริงคือ**ค่าเฉลี่ยของแคลอรี่ที่เผาผลาญจริงต่อวันตรงๆ** (ไม่มีการลบ
> จากเป้าหมายใดๆ) เพราะแอปนี้ติดตามเฉพาะแคลอรี่ที่เผาผลาญจากการออกกำลังกาย ไม่มีการบันทึกแคลอรี่จากอาหาร
> "ขาดดุลจริงต่อวัน" จึงเท่ากับแคลอรี่ที่เผาผลาญได้ในวันนั้นตรงๆ (ยืนยันจาก code comment ใน
> `apps/web/server/routes/insights-forecast/index.ts` ซึ่งระบุว่าผู้ใช้ยืนยันการแก้นี้แล้วเมื่อ 2026-08-31)

1. ตรวจสอบว่ามีน้ำหนักเป้าหมาย (`goal_selection.target_weight_kg`) หรือไม่ → ถ้าไม่มี คืน error (`422`)
2. ตรวจสอบว่ามีประวัติ `daily_log` สะสมเพียงพอหรือไม่ (จำนวนวันขั้นต่ำยังไม่ resolve เป็นทางการ — ดู
   "จุดที่ยังไม่ได้ระบุ") → ถ้าไม่พอ คืน error (`422`)
3. ดึงประวัติแคลอรี่ที่เผาผลาญจริงต่อวันจาก `daily_log` (accumulatedKcal ของแต่ละวันที่มีการบันทึก — ไม่ใช่
   ค่าประมาณตอน onboarding และไม่ใช่ส่วนต่างจากเป้าหมาย)
4. คำนวณอัตราขาดดุลเฉลี่ยต่อวัน = **ค่าเฉลี่ยของแคลอรี่ที่เผาผลาญจริงต่อวัน** (ผลรวมแคลอรี่ที่เผาผลาญจริงของ
   ทุกวันที่มีข้อมูล หารด้วยจำนวนวันที่มีข้อมูล) — ไม่ใช่ผลต่างจากเป้าหมายรายวัน
5. แปลงอัตราขาดดุลเฉลี่ยเป็นอัตราการเปลี่ยนแปลงน้ำหนักโดยประมาณ โดยใช้ค่าคงที่ 7,700 kcal ≈ 1 กก. ไขมัน
   (ตาม decision ที่ resolve แล้วใน ONB-3/REQ-02)
6. คำนวณวันที่คาดว่าจะถึงเป้าหมาย จากน้ำหนักปัจจุบัน (ล่าสุดจาก `weight_record`), น้ำหนักเป้าหมาย, และ
   อัตรานี้
7. บันทึกผลลัพธ์ลง `weight_forecast_snapshot` พร้อมแสดงผลให้ผู้ใช้

## INT-0 — ยืนยันตัวตนก่อนจับคู่อุปกรณ์ผ่านรหัสจับคู่ (Pairing Code) (REQ-18)

**precondition ทางเทคนิคร่วมของ INT-2 และ INT-3** — เดิมบันทึกไว้เป็น implicit precondition ของ
REQ-12/REQ-13 โดยไม่มี REQ number/Feature ID ของตัวเอง แต่ `feature-journey-writer` ยืนยันกับผู้ใช้แล้ว
เมื่อ 2026-08-30 ให้ตั้งเป็นบทบัญญัติ **REQ-18** พร้อม Feature ID ของตัวเอง **INT-0** แยกต่างหาก (ดู
[backlog.md](../../../01-requirements/backlog.md) แถว INT-0 และ
[01-spec/20260823-04-smart-integrations.md § REQ-18](../../../01-requirements/01-spec/20260823-04-smart-integrations.md))
แทนที่การอ้าง REQ-12/REQ-13 แบบ implicit เดิม — มาจากข้อเท็จจริงที่ ONB-0 เป็น web-only (HLA §3.1) จึงไม่มี
ไคลเอนต์อื่นใดในระบบมีหน้าจอ auth ของตัวเอง ไคลเอนต์ที่ต้องทำ INT-2/INT-3 (companion app) ต้องรับตัวตนที่
ยืนยันแล้วมาจาก Account & Session Management ผ่านรหัสจับคู่อุปกรณ์ชั่วคราวแทน (ดู HLA §4.5, Pairing
Credential §5)

### Sequence Diagram

```mermaid
sequenceDiagram
    actor U as ผู้ใช้
    participant WC as เว็บไคลเอนต์ (Web Client — ONB-0)
    participant AS as Account & Session Management
    participant MC as ไคลเอนต์ที่ไม่มีหน้าจอ auth ของตัวเอง (companion app — INT-2/INT-3)
    participant IG as Integration Gateway
    Note over U,WC: Precondition — ผู้ใช้ล็อกอินอยู่บนเว็บไคลเอนต์แล้ว (ONB-0)
    U->>WC: เปิดหน้าโปรไฟล์ กดขอรหัสจับคู่อุปกรณ์
    WC->>AS: POST /auth/pairing-codes (session ที่ยืนยันตัวตนแล้ว)
    AS->>AS: mint pairing_credential ใหม่ (code 6 หลัก, user_account_id เจ้าของ session, expires_at = created_at + 5 นาที)
    AS-->>WC: 201 Created (รหัสจับคู่ 6 หลัก + เวลาหมดอายุ)
    WC-->>U: แสดงรหัสจับคู่บนหน้าเว็บ
    U->>MC: เปิด companion app กรอกรหัสที่ได้รับ
    MC->>AS: POST /auth/pairing-codes/redeem (รหัสจับคู่ 6 หลัก — ข้อยกเว้นเดียว ไม่ต้องยืนยันตัวตนก่อนเรียก)
    alt รหัสไม่พบ/หมดอายุแล้ว/ถูกใช้ไปแล้ว (กรณีเดียวครอบคลุมทั้ง 3 สถานการณ์เดิม — ลบแถวทิ้งแทนตั้ง flag)
        AS-->>MC: 410 Gone
        MC-->>U: แจ้งรหัสใช้ไม่ได้แล้ว — ให้กลับไปขอรหัสใหม่จากเว็บ
    else รหัสถูกต้อง ไม่หมดอายุ ยังไม่ถูกใช้
        AS->>AS: ลบ pairing_credential ทิ้งถาวรทันที (single-use enforcement ผ่านการลบ ไม่ใช่ตั้ง flag)
        AS-->>MC: 200 OK (session ที่ยืนยันตัวตนแล้ว ผูกกับ user_account เจ้าของรหัส — ไม่ต้องกรอก credential ซ้ำ)
        MC->>IG: เริ่มกระบวนการจับคู่อุปกรณ์จริงของ INT-2/INT-3 ในนามผู้ใช้คนเดิม
    end
```

Edge case ที่แสดง: `410 Gone` กรณีเดียวครอบคลุมทั้ง "ไม่พบรหัสเลย"/"หมดอายุแล้ว"/"ถูกใช้ไปแล้ว" ตรงกับ
`api-spec.md` §3.1 ฉบับล่าสุดเป๊ะ (แก้ไข 2026-08-30 รอบ 2 — เดิมเคยแยกเป็น `404`/`409`/`422` 3 กรณี ซึ่งไม่ตรง
กับพฤติกรรมจริงของโค้ด `apps/web/server/routes/pairing/index.ts` ที่ลบ document ทิ้งทันทีหลัง redeem สำเร็จ
แทนการตั้ง flag `is_used` ทำให้ 3 สถานการณ์เดิมแยกออกจากกันไม่ได้อีกต่อไปในทางปฏิบัติ) และตรงกับ Alt/Edge
Case ของ `user-journeys.md` (รหัสจับคู่หมดอายุหรือถูกใช้ไปแล้ว → มือถือกรอกไม่ผ่าน ต้องขอรหัสใหม่จากเว็บ —
ดู INT-2/INT-3 § Alt/Edge Cases)

ไม่มีอัลกอริทึมแยก — การตรวจสอบ (404/409/422) เป็นเงื่อนไข lookup ตรงไปตรงมา ครอบคลุมอยู่ใน sequence
diagram แล้ว

## INT-2 — ซิงค์ตาชั่งอัจฉริยะ (REQ-12)

### Sequence Diagram

```mermaid
sequenceDiagram
    actor U as ผู้ใช้
    participant IG as Integration Gateway
    participant SC as ตาชั่งอัจฉริยะ
    participant PP as Personalization & Profile
    Note over U,IG: Precondition — ผ่านกระบวนการ Identity Handoff (Pairing-Code Mechanism ด้านบน) แล้ว
    U->>IG: POST /integrations/smart-scale/connect
    IG->>U: ขอ consent
    U->>IG: ยืนยัน consent
    IG->>SC: จับคู่ผ่าน Bluetooth/Health API
    alt เชื่อมต่อสำเร็จ
        SC-->>IG: เชื่อมต่อสำเร็จ
        IG->>IG: บันทึก integration_connection.connection_status = เชื่อมต่อแล้ว
        IG-->>U: 200 OK
        SC->>IG: POST /integrations/smart-scale/sync (น้ำหนัก/องค์ประกอบร่างกาย)
        IG->>IG: บันทึกลง weight_record (source = ซิงค์จากตาชั่ง)
        IG->>PP: trigger คำนวณ TDEE ใหม่ (ดู 01-onboarding-personalization.md/ONB-1)
    else เชื่อมต่อไม่สำเร็จ
        IG-->>U: fallback — แสดงฟอร์มกรอกน้ำหนักเอง (ไม่ใช่ error)
        U->>IG: POST /integrations/smart-scale/sync (กรอกเอง, source = กรอกเอง)
        IG->>IG: บันทึกลง weight_record
        IG->>PP: trigger คำนวณ TDEE ใหม่
    end
```

ไม่มีอัลกอริทึมแยก — เป็น connect/fallback flow ตรงไปตรงมา ครอบคลุมอยู่ใน sequence diagram และ State
Diagram ด้านบนแล้ว

## INT-3 — ซิงค์ข้อมูล Wearable (REQ-13)

### Sequence Diagram

```mermaid
sequenceDiagram
    actor U as ผู้ใช้
    participant IG as Integration Gateway
    participant HA as Health API (Apple Health/Google Health Connect)
    participant EC as Exertion & Calorie Calculation
    Note over U,IG: Precondition — ผ่านกระบวนการ Identity Handoff (Pairing-Code Mechanism ด้านบน) แล้ว
    U->>IG: POST /integrations/wearable/connect
    IG->>U: ขอ consent
    U->>IG: ยืนยัน consent
    IG->>HA: ขอสิทธิ์เข้าถึงข้อมูล
    HA-->>IG: อนุญาตแล้ว
    IG->>IG: บันทึก integration_connection.connection_status = เชื่อมต่อแล้ว
    Note over HA,EC: ระหว่าง/หลังออกกำลังกาย
    alt มีข้อมูลจาก wearable สำหรับ session นี้
        HA->>IG: POST /integrations/wearable/readings (แคลอรี่จาก wearable)
        IG->>IG: บันทึกลง wearable_reading
        IG->>EC: ส่งค่านี้ให้ REC-2 ใช้แทนค่าประมาณ MET (ดู 02-daily-youtube-recommendation.md/REC-2)
    else ไม่มีข้อมูล (ยังไม่เชื่อมต่อ หรือ Health API ไม่ตอบสนอง)
        EC->>EC: ใช้ค่าประมาณ MET ตามเดิม (fallback ที่คาดหวังไว้ ไม่ใช่ error)
    end
```

ไม่มีอัลกอริทึมแยก — เป็น connect/fallback flow ตรงไปตรงมา ใช้ State Diagram ร่วมกับ INT-2 ด้านบน

## จุดที่ยังไม่ได้ระบุ / ควรยืนยันเพิ่มเติม

1. **INT-1**: จำนวนวัน log ขั้นต่ำก่อนพยากรณ์ได้ยังไม่ระบุเป็นทางการ — **ยังเป็น open point เหมือนเดิม**
   (โค้ดจริง `apps/web/server/routes/insights-forecast/index.ts` ปัจจุบันใช้ค่า placeholder
   `MIN_LOG_DAYS_FOR_FORECAST = 3` แต่ code comment ระบุชัดว่า "picked pragmatically until [this]
   is formally decided" — คือเลือกไว้ใช้งานชั่วคราวเท่านั้น ไม่ใช่ decision ที่ resolve แล้ว ห้ามถือเป็นคำตอบ
   สุดท้าย)
2. **INT-2**: ลำดับความสำคัญเมื่อชั่งน้ำหนักหลายครั้งในวันเดียวกัน (ค่าล่าสุด vs ค่าเฉลี่ย) ยังไม่ระบุ
3. **INT-3**: การ reconcile เมื่อค่าจาก wearable ต่างจากค่าประมาณ MET มากยังไม่ระบุ (ปัจจุบัน wearable
   ชนะเสมอเมื่อมีข้อมูล ไม่มีการเทียบความสมเหตุสมผล)

## ความสัมพันธ์กับเอกสารอื่น

- [High Level Architecture](../high-level-architecture.md) — component "Account & Session Management"
  (3.1, สำหรับ Identity Handoff — Pairing-Code Mechanism), "Insights & Forecast" (3.7), "Integration
  Gateway" (3.8), Flow 5 Smart Integration & Insights Flow (4.5 — รวม subgraph PAIR), External
  Integration Boundaries (6), entity "Pairing Credential" (5)
- [API Spec](../api-spec.md) — section 3.1 Account & Session Management (2 operations ใหม่:
  `POST /auth/pairing-codes`, `POST /auth/pairing-codes/redeem`), 3.7 Insights & Forecast, 3.8
  Integration Gateway
- [Database Schema](../database-schema.md) — ตาราง `weight_forecast_snapshot`, `weight_record`,
  `integration_connection`, `wearable_reading`, `pairing_credential` (3.17)
- [Product Backlog](../../../01-requirements/backlog.md), [Requirement](../../../01-requirements/01-spec/20260823-04-smart-integrations.md) —
  INT-0/1/2/3, REQ-18/11/12/13
- [User Journeys](../../01-prototypes/user-journeys.md) — ลำดับ step ของ INT-1/2/3

## ภาคผนวก: Stack Mapping

> **หัวข้อนี้เป็นข้อยกเว้นเดียวในไฟล์นี้ที่มีชื่อเทคโนโลยีจริง** แหล่งที่มาและสิทธิ์แก้ไขจริงอยู่ที่
> [tech-stack.md](../tech-stack.md) เสมอ — หัวข้อข้างต้นยังคง conceptual ตามกติกาเดิมทุกประการ ถ้าทีม
> เปลี่ยน stack ในอนาคต ให้รัน `tech-stack-builder` ก่อน แล้วภาคผนวกนี้จะถูก sync ตามในการรัน
> `detailed-design-builder` ครั้งถัดไป

> **อัปเดต 2026-08-29**: มิเรอร์ใหม่จาก Supabase/PostgreSQL เป็น Firebase ตามการเปลี่ยน stack ใน
> `tech-stack.md` §2/§5 — เนื้อหาหลักข้างต้น (sequence/state diagram/algorithm ของ INT-1/2/3)
> **ไม่เปลี่ยนแปลง** เพราะยัง conceptual ล้วน ไม่ผูกกับ backend จริง (การแก้ label ของ State Diagram
> ด้านบนจาก "ยกเลิกการเชื่อมต่อ" เป็น "ถอน consent แล้ว" เป็นการแก้ไขให้ตรงกับค่า `enum` จริงใน
> `database-schema.md` §3.15 ที่พบระหว่าง audit ครั้งนี้ — ไม่เกี่ยวกับการเปลี่ยน stack)

> **อัปเดต 2026-08-30 (รอบ 2)**: mechanical re-sync ทั้งหมดจาก Firebase Cloud Functions เป็น **Express.js
> บน Google Cloud Run** ตามการเปลี่ยน stack ใน `tech-stack.md` §2/§3/§6 (ยืนยันจากโค้ดจริง
> `apps/web/server/routes/*`) — เพิ่มแถวใหม่ **Account & Session Management** (สำหรับ participant "AS" ใน
> sequence diagram "Identity Handoff — Pairing-Code Mechanism" ด้านบน ที่ยังไม่เคยมีแถวมิเรอร์มาก่อนเลย) —
> เนื้อหาหลักข้างต้น (sequence/state diagram/algorithm) **ไม่เปลี่ยนแปลงจากการ sync นี้เพิ่มเติม** เพราะยัง
> conceptual ล้วน (การแก้ `alt` block เป็น `410 Gone` เดียวเป็นการแก้เนื้อหาหลักคนละจุด ดู "อัปเดตล่าสุด"
> ด้านบนสุดของเอกสาร) — เพิ่มหมายเหตุว่า **INT-1 (Forecast) execution เปลี่ยนจาก React Native client เป็น
> React+Vite web client** เพราะ INT-1 ย้ายเข้า `apps/web` แล้วหลังตัดขอบเขต `apps/mobile` เหลือเฉพาะ
> INT-2/INT-3 (ตาม `tech-stack.md` §7 ข้อ 5)

> **อัปเดต 2026-08-31**: แก้ 2 จุดในภาคผนวกนี้ตามโค้ดจริง (commit `b463436`): (1) แถว **Insights & Forecast**
> เดิมระบุว่า "ปัจจุบันคืนค่า snapshot ที่มีอยู่ตรงๆ รอ implement การคำนวณจริง" ซึ่งล้าหลังไปแล้ว — ตอนนี้
> คำนวณจริงและ ship แล้วเต็มรูปแบบ (2) **"Execution ของ algorithm" เดิมอ้างว่า INT-1 คำนวณฝั่ง client** ตาม
> NFR-01/03 ซึ่งเป็นข้อผิดพลาดจากการ generalize มาจาก REC-2 — แก้เป็นข้อเท็จจริงว่า INT-1 คำนวณทั้งหมดฝั่ง
> server (ดูย่อหน้า "Execution ของ algorithm" ด้านล่าง) — ทั้งสองจุดเป็นการแก้ให้ตรงกับพฤติกรรมที่ ship แล้ว
> ไม่ใช่การตัดสินใจ business rule ใหม่ — `tech-stack.md` §6.1 เอง (ไฟล์ต้นทางของภาคผนวกนี้) ยังใช้ถ้อยคำ
> "Insights & Forecast" แบบเดิมที่ล้าหลังเช่นกัน แนะนำให้รัน `tech-stack-builder` เพื่ออัปเดตแหล่งที่มาจริงด้วย
> (ดู [log 2026-08-31](../../../05-log/20260831-log.md))

มิเรอร์จาก [tech-stack.md § 6.1](../tech-stack.md#61-hlas-conceptual-component--expressjs--cloud-firestore-implementation)
(อัปเดต 2026-08-30) เฉพาะ Component ที่ปรากฏในไฟล์นี้:

| Conceptual Component | Concrete Implementation |
|---|---|
| Account & Session Management (เฉพาะกลไก pairing-code — ดู `01-onboarding-personalization.md` ภาคผนวกสำหรับ ONB-0 อีก 8 operation) | Top-level collection `pairingCodes/{code}` (document ID = รหัส 6 หลักเอง) เก็บ `uid`/`createdAt`/`expiresAt` — mint ผ่าน **Express route** `POST /api/pairing/create-code` (`apps/web/server/routes/pairing/index.ts`, ต้องผ่าน `authenticate` middleware) เรียกจากหน้าโปรไฟล์ของเว็บไคลเอนต์; redeem ผ่าน **Express route** `POST /api/pairing/redeem` (**ข้อยกเว้นเดียว** ไม่มี `authenticate` middleware) อ่าน document แล้วเรียก `auth.createCustomToken(uid)` — single-use enforce ด้วย `ref.delete()` ทันทีหลัง redeem สำเร็จ (ไม่ใช่ set `is_used` flag) ทำให้ error case ทั้งหมด (ไม่พบ/หมดอายุ/ถูกใช้แล้ว) รวมเป็น `410 Gone` เดียวที่ระดับ Express route |
| Insights & Forecast | Subcollection `users/{userId}/weightRecords/{recordId}` + embedded map field `weightForecastSnapshot` ภายใน `users/{userId}` — **Express route** `GET /api/insights/forecast` (แทนที่ Cloud Function `forecast` เดิม — `apps/web/server/routes/insights-forecast/index.ts`) **คำนวณผลพยากรณ์ทั้งหมดเองฝั่ง server** จากประวัติ `dailyLogs`/`weightRecords` จริง (ไม่ใช่แค่คืนค่า snapshot ที่มีอยู่ตรงๆ อีกต่อไป — ยืนยันจากโค้ดจริง 2026-08-31) แล้วบันทึกผลลง `weightForecastSnapshot` เอง |
| Integration Gateway | Embedded map field `integrationConnections: { smartScale: {...}, wearable: {...} }` ภายใน `users/{userId}` — **Express route** `POST /api/integrations/smart-scale/connect`, `DELETE /api/integrations/smart-scale`, `POST /api/integrations/smart-scale/sync`, `POST /api/integrations/wearable/connect`, `DELETE /api/integrations/wearable`, `POST /api/integrations/wearable/readings` (แทนที่ Cloud Function `integrations` เดิม — `apps/web/server/routes/integration-gateway/index.ts`) + native module ฝั่ง `apps/mobile` เท่านั้น (`react-native-health`, `react-native-health-connect`, `react-native-ble-plx`) — รับ identity handoff จากกลไก pairing-code (แถวด้านบน) ก่อนเริ่มกระบวนการจับคู่จริงตาม HLA §3.8/§4.5 |

**Execution ของ algorithm**: **Forecast (INT-1)** คำนวณทั้งหมด**ฝั่ง server** ผ่าน **Express route
`GET /api/insights/forecast`** (แทนที่ Firebase Cloud Function `forecast` เดิม —
`apps/web/server/routes/insights-forecast/index.ts`) — เป็น bodyless `GET` request ที่ server อ่าน
เป้าหมายน้ำหนัก ประวัติ `daily_log`, และน้ำหนักล่าสุด แล้วคำนวณอัตราขาดดุลเฉลี่ย/อัตราเปลี่ยนแปลงน้ำหนัก/
วันที่คาดถึงเป้าหมายเองทั้งหมด ไม่มีขั้นตอนใดถูก precompute ฝั่ง client แล้วส่งขึ้นมาบันทึกแบบที่เคยเขียนไว้
(**แก้ไขแล้ว 2026-08-31** — ข้อความเดิมอ้าง [tech-stack.md § 4](../tech-stack.md#4-เหตุผลการเลือก-rationale)
(NFR-01/NFR-03 — client-side calculation) ผิดพลาด โดย generalize มาจาก REC-2's MET calculation ซึ่งมีเหตุผล
ด้าน sub-250ms latency ระหว่างออกกำลังกายจริงเท่านั้น — INT-1 เป็นการพยากรณ์ "อีกกี่วันถึงเป้าหมาย" ที่ไม่มี
ความจำเป็นด้าน latency ระหว่าง UI แบบเดียวกัน จึงไม่ควรอ้าง NFR-01/03 กับ Feature นี้อีกต่อไป) — ส่วน
**INT-2/INT-3** (จับคู่/ซิงค์อุปกรณ์ภายนอก) ยังคงเป็น native-only capability ที่อยู่ใน `apps/mobile` เท่านั้น
ใช้ native module ฝั่ง client ตามที่ตารางข้างบนระบุเหมือนเดิม (`react-native-health` สำหรับ Apple HealthKit,
`react-native-health-connect` สำหรับ Google Health Connect, `react-native-ble-plx` สำหรับ Bluetooth
สมาร์ตสเกล) แล้วส่งข้อมูลที่ซิงค์ได้ผ่าน **Express route** ใต้ `/api/integrations/*` (แทนที่ Firebase Cloud
Function `integrations` เดิม) — ทั้ง `apps/web` และ `apps/mobile` เรียก Express server เดียวกันที่รันบน
**Google Cloud Run**
