# Detailed Design — Daily YouTube Recommendation (Conceptual)

- **ประเภทเอกสาร:** Detailed Design — Conceptual (ไม่ผูก technical stack)
- **สถานะเอกสาร:** Draft
- **วันที่สร้าง:** 2026-08-28
- **อัปเดตล่าสุด:** 2026-08-30 (รอบ 2) — mechanical re-sync หัวข้อ "ภาคผนวก: Stack Mapping" ให้ตรงกับ
  `tech-stack.md` §6.1 ฉบับล่าสุด (Express.js บน **Google Cloud Run** แทนที่ Firebase Cloud Functions เดิม
  — ยืนยันจากโค้ดจริง `apps/web/server/routes/*`) — เนื้อหาหลัก (sequence/state diagram/algorithm ของ
  REC-1/2/3/4) ไม่เปลี่ยนแปลงเพราะยัง conceptual ล้วน — ไม่กระทบจาก pairing-code mechanism เหมือนรอบก่อน (ดู
  [log 2026-08-30](../../../05-log/20260830-log.md))
- **อัปเดตก่อนหน้า:** 2026-08-30 (รอบ 1) — audit ตามการเปลี่ยนแปลงใน `high-level-architecture.md`/
  `api-spec.md`/`database-schema.md` (Identity Handoff — Pairing-Code Mechanism, entity/ตาราง
  `pairing_credential`) แล้วพบว่า**ไม่กระทบไฟล์นี้เลย** (กลไกนี้เป็น precondition เฉพาะของ INT-2/INT-3 ใน
  `04-smart-integrations.md` เท่านั้น ไม่เกี่ยวกับ REC-1/2/3/4) — ตรวจ "Firebase Cloud Function
  `sessionComplete`" ที่ปรากฏในเนื้อหาแล้วยืนยันว่าอยู่ใน "## ภาคผนวก: Stack Mapping" เท่านั้น (ไม่ใช่ในเนื้อหา
  หลัก — ไม่พบ main-body stack-name violation) — ไม่แตะภาคผนวก Stack Mapping ตามที่ผู้ใช้ยืนยันว่า
  `tech-stack.md` ยังไม่ reconcile จาก Firebase เดิมมาเป็น stack จริงตามโค้ด (**แก้ไขแล้วในรอบ 2 ด้านบน**)
- **อัปเดตก่อนหน้านั้น:** 2026-08-29 — sync ภาคผนวก Stack Mapping ให้ตรงกับ `tech-stack.md` ฉบับ Firebase ใหม่
  (audit เนื้อหาหลัก sequence/state diagram/algorithm ของ REC-1/2/3/4 แล้วไม่พบ drift)
- **สร้างโดย:** skill `detailed-design-builder`
- **อ้างอิงจาก:** [High Level Architecture](../high-level-architecture.md), [API Spec](../api-spec.md),
  [Database Schema](../database-schema.md), [Product Backlog](../../../01-requirements/backlog.md),
  [Requirement](../../../01-requirements/01-spec/20260823-02-daily-youtube-recommendation.md)

## ขอบเขตและหลักการ

เอกสารนี้เจาะจงกว่า API Spec/Database Schema อีกหนึ่งระดับ — **ยังคง conceptual ไม่ผูก technical stack**
sequence diagram ใช้ participant เป็น Conceptual Component จาก HLA หรือ actor ทั่วไปเท่านั้น (ไม่มีชื่อ
framework/service เฉพาะเจาะจง) อัลกอริทึมเขียนเป็นขั้นตอนภาษาธรรมชาติ/pseudocode เชิงแนวคิด ไม่ใช่โค้ดจริง

## State Diagram — Workout Session

`workout_session.status` มี state transition ที่มีความหมายพอสำหรับ REC-2/REC-4 (ผูกกับ Feature ที่ใช้
entity นี้ทั้งหมดในหน้านี้):

```mermaid
stateDiagram-v2
    [*] --> กำลังดำเนินการ: POST /workouts/sessions
    กำลังดำเนินการ --> จบแล้ว: POST .../complete (ออกกำลังกายจนจบวิดีโอ)
    กำลังดำเนินการ --> หยุดกลางคัน: POST .../complete (ผู้ใช้กดหยุดก่อนจบ)
    จบแล้ว --> [*]
    หยุดกลางคัน --> [*]
```

ทั้ง "จบแล้ว" และ "หยุดกลางคัน" ไป trigger `POST .../complete` เหมือนกัน — REC-2's algorithm (ด้านล่าง)
ใช้ "เวลาที่ใช้จริง" เป็น input เดียวกันในทั้งสองกรณี ไม่แยกสูตรคำนวณ (แค่ค่าที่ได้ต่างกันตามเวลาจริง)

## REC-1 — แนะนำวิดีโอตรงเป้าแคลอรี่รายวัน (REQ-04)

### Sequence Diagram

```mermaid
sequenceDiagram
    actor U as ผู้ใช้
    participant CR as Content Recommendation
    participant PP as Personalization & Profile
    participant PD as Planner & Day-Status
    participant YT as YouTube
    U->>CR: GET /workouts/today/recommendation
    CR->>PD: ตรวจสอบสถานะวันนี้ (day_status)
    alt วันนี้เป็น Cheat/Rest Day
        CR-->>U: 204 No Content (ไม่มีวิดีโอแนะนำ)
    else วันนี้เป็นวันปกติ
        CR->>PP: อ่าน equipment_selection + goal_selection.daily_calorie_target_kcal
        CR->>YT: ค้นหาวิดีโอ (filter อุปกรณ์ + ช่วงแคลอรี่เป้าหมาย)
        loop จนกว่าจะพบวิดีโอที่ตรงพอ หรือขยายเกณฑ์จนถึงขีดจำกัด
            YT-->>CR: รายการวิดีโอ + metadata (ประเภท/ความเข้มข้น/ระยะเวลา)
            opt ไม่พบวิดีโอที่ใกล้เคียงพอในรอบนี้
                CR->>CR: ขยายเกณฑ์ค้นหา (ตัวเลข tolerance ยังไม่ระบุ)
            end
        end
        alt ขยายเกณฑ์จนถึงขีดจำกัดแล้วยังไม่พบ
            CR-->>U: 409 Conflict (ไม่พบวิดีโอที่ตรงพอ)
        else พบวิดีโอที่ตรงพอ
            CR-->>U: 200 OK (Video/Workout Content ที่จับคู่)
        end
    end
```

### อัลกอริทึม — จับคู่วิดีโอ + ขยายเกณฑ์ค้นหา

1. อ่านเป้าหมายแคลอรี่รายวันปัจจุบัน (ปรับตาม Cheat/Rest Day แล้วถ้ามี) และโปรไฟล์อุปกรณ์
2. filter คลังวิดีโอด้วยอุปกรณ์ที่มี (ตัดวิดีโอที่ต้องใช้อุปกรณ์ซึ่งผู้ใช้ไม่มีออก)
3. ค้นหาวิดีโอที่แคลอรี่ประมาณใกล้เคียงเป้าหมายที่สุดภายใน tolerance ที่กำหนด (ค่า tolerance ตัวเลขจริง
   ยังไม่ resolve เป็นทางการ — ดู "จุดที่ยังไม่ได้ระบุ")
4. ถ้าไม่พบวิดีโอที่อยู่ใน tolerance → ขยายเกณฑ์ค้นหา (เช่น เพิ่มช่วงที่ยอมรับได้) แล้วค้นหาซ้ำ
5. ถ้าขยายเกณฑ์จนถึงขีดจำกัดแล้วยังไม่พบ (ขีดจำกัดยังไม่ระบุ) → คืน error ว่าไม่พบวิดีโอที่ตรงพอ
6. เมื่อพบวิดีโอที่ตรงพอ → ส่งต่อให้ REC-4 ตรวจสอบความเข้มข้นก่อนส่งคืนผู้ใช้

## REC-2 — คำนวณแคลอรี่เผาผลาญจริง (REQ-05)

### Sequence Diagram

```mermaid
sequenceDiagram
    actor U as ผู้ใช้
    participant EC as Exertion & Calorie Calculation
    participant IG as Integration Gateway
    participant PP as Personalization & Profile
    participant LS as Logging & Streak
    U->>EC: POST /workouts/sessions/{sessionId}/complete (เวลาที่ใช้จริง)
    EC->>PP: อ่านน้ำหนักตัวปัจจุบัน (user_profile.weight_kg)
    EC->>EC: อ่าน session_video (activity_type, intensity) ของ session นี้
    alt มี wearable_reading ของ session นี้มาถึงแล้ว
        EC->>IG: ตรวจสอบ wearable_reading
        IG-->>EC: ค่าแคลอรี่จาก wearable
        EC->>EC: ใช้ค่าจาก wearable แทนค่าประมาณ MET (source = ค่าจาก wearable)
    else ไม่มีข้อมูล wearable
        EC->>EC: ค้นค่า MET จาก lookup table ตาม activity_type x intensity
        EC->>EC: คำนวณ kcal = MET x น้ำหนักตัว x เวลาที่ใช้จริง (source = สูตร MET)
    end
    EC->>EC: บันทึกผลลัพธ์ลง actual_calorie_burn
    EC->>LS: ส่งต่อแคลอรี่ที่เผาผลาญจริง (trigger สร้าง Daily Log - ดู 03-planner-logging.md/PLN-3)
    EC-->>U: 200 OK (Actual Calorie Burn)
```

### อัลกอริทึม — คำนวณแคลอรี่เผาผลาญ (MET + wearable override)

1. รับเวลาที่ใช้จริงจากผู้ใช้ (วินาที/นาที) — ยังไม่ระบุว่ารวมเวลา warmup/cooldown ของ REC-4 หรือไม่ (ดู
   "จุดที่ยังไม่ได้ระบุ")
2. ตรวจสอบว่ามีข้อมูล wearable (`wearable_reading`) ของ session นี้มาถึงแล้วหรือยัง
3. ถ้ามี → ใช้ค่าแคลอรี่จาก wearable โดยตรง เก็บ `actual_calorie_burn.source = ค่าจาก wearable`
4. ถ้าไม่มี → ค้นค่า MET จาก lookup table ตามประเภทกิจกรรม×ความเข้มข้นของวิดีโอหลัก (ค่า MET จริงต่อ
   ประเภทยังไม่ resolve เป็นทางการ — ดู "จุดที่ยังไม่ได้ระบุ") แล้วคำนวณ
   `kcal = MET × น้ำหนักตัว(kg) × เวลาที่ใช้จริง(ชม.)`
5. บันทึกผลลัพธ์สุดท้ายลง `actual_calorie_burn`
6. ส่งต่อค่านี้ให้ Logging & Streak เพื่อประเมิน Daily Log (ดู `03-planner-logging.md` § PLN-3)

## REC-3 — เปลี่ยนวิดีโอโดยคงเป้าแคลอรี่เดิม (REQ-06)

### Sequence Diagram

```mermaid
sequenceDiagram
    actor U as ผู้ใช้
    participant CR as Content Recommendation
    participant YT as YouTube
    U->>CR: POST /workouts/today/recommendation/swap (id วิดีโอที่ปฏิเสธสะสม)
    CR->>CR: คงเป้าหมายแคลอรี่เดิมไว้ (ไม่ดึงเป้าหมายใหม่)
    CR->>YT: ค้นหาวิดีโอใหม่ (filter อุปกรณ์เดิม + เป้าหมายเดิม, ไม่รวมวิดีโอที่ถูกปฏิเสธ)
    alt ไม่พบวิดีโอใหม่ที่ตรงพอ (ใช้อัลกอริทึมขยายเกณฑ์เดียวกับ REC-1)
        CR-->>U: 409 Conflict (ไม่พบวิดีโอที่ตรงพอ)
    else พบวิดีโอใหม่
        CR->>CR: บันทึกวิดีโอที่เพิ่งถูกปฏิเสธลง session_rejected_video
        CR-->>U: 200 OK (Video/Workout Content ใหม่)
    end
```

ไม่มีอัลกอริทึมแยก — ใช้อัลกอริทึม "จับคู่วิดีโอ + ขยายเกณฑ์ค้นหา" เดียวกับ REC-1 เพียงเพิ่มเงื่อนไขไม่รวม
วิดีโอใน `session_rejected_video` เข้าไปในการค้นหา

## REC-4 — วอร์มอัพ-คูลดาวน์อัตโนมัติ (REQ-07)

### Sequence Diagram

```mermaid
sequenceDiagram
    actor U as ผู้ใช้
    participant CR as Content Recommendation
    participant EC as Exertion & Calorie Calculation
    U->>CR: GET /workouts/today/recommendation (หรือหลัง REC-3 swap)
    CR->>CR: ตรวจสอบความเข้มข้นของวิดีโอหลักที่เลือก
    alt ความเข้มข้น = สูง
        CR->>CR: ประกอบ วอร์มอัพ 3 นาที + วิดีโอหลัก + คูลดาวน์ 3 นาที
        CR->>EC: POST /workouts/sessions (สร้าง session_video 3 แถว: role=วอร์มอัพ/หลัก/คูลดาวน์)
    else ความเข้มข้น = ต่ำ/กลาง
        CR->>EC: POST /workouts/sessions (สร้าง session_video 1 แถว: role=หลัก)
    end
    EC-->>U: 201 Created (Workout Session)
    Note over EC: session.status = กำลังดำเนินการ (ดู State Diagram ด้านบน)
```

ไม่มีอัลกอริทึมแยก — เป็นเงื่อนไขเดียว (ความเข้มข้น = สูง หรือไม่) ครอบคลุมอยู่ใน sequence diagram แล้ว

## จุดที่ยังไม่ได้ระบุ / ควรยืนยันเพิ่มเติม

1. **REC-1/REC-3**: ตัวเลข tolerance การจับคู่วิดีโอ-แคลอรี่ และขีดจำกัดของการขยายเกณฑ์ค้นหายังไม่ระบุ
2. **REC-2/REC-4**: เวลา/แคลอรี่ของวอร์มอัพ-คูลดาวน์นับรวมเข้ากับเป้าหมายรายวัน (ที่ PLN-3 ใช้ประเมิน)
   หรือไม่ยังไม่ระบุ — กระทบว่า "เวลาที่ใช้จริง" ใน REC-2's algorithm ควรรวมหรือไม่รวมช่วงนี้
3. **REC-2**: ค่า MET จริงต่อประเภทกิจกรรม×ความเข้มข้นยังไม่ resolve เป็นทางการใน `01-spec/`

## ความสัมพันธ์กับเอกสารอื่น

- [High Level Architecture](../high-level-architecture.md) — component "Content Recommendation"
  (3.2), "Exertion & Calorie Calculation" (3.3), Flow 2 Daily Recommendation & Exercise Session Flow
  (4.2)
- [API Spec](../api-spec.md) — section 3.2 Content Recommendation, 3.3 Exertion & Calorie Calculation
- [Database Schema](../database-schema.md) — ตาราง `workout_session`, `session_video`,
  `session_rejected_video`, `actual_calorie_burn`, `wearable_reading`
- [Product Backlog](../../../01-requirements/backlog.md), [Requirement](../../../01-requirements/01-spec/20260823-02-daily-youtube-recommendation.md) —
  REC-1/2/3/4, REQ-04/05/06/07
- [User Journeys](../../01-prototypes/user-journeys.md) — ลำดับ step ของ REC-1/2/3/4

## ภาคผนวก: Stack Mapping

> **หัวข้อนี้เป็นข้อยกเว้นเดียวในไฟล์นี้ที่มีชื่อเทคโนโลยีจริง** แหล่งที่มาและสิทธิ์แก้ไขจริงอยู่ที่
> [tech-stack.md](../tech-stack.md) เสมอ — หัวข้อข้างต้นยังคง conceptual ตามกติกาเดิมทุกประการ ถ้าทีม
> เปลี่ยน stack ในอนาคต ให้รัน `tech-stack-builder` ก่อน แล้วภาคผนวกนี้จะถูก sync ตามในการรัน
> `detailed-design-builder` ครั้งถัดไป

> **อัปเดต 2026-08-29**: มิเรอร์ใหม่จาก Supabase/PostgreSQL เป็น Firebase ตามการเปลี่ยน stack ใน
> `tech-stack.md` §2/§5 — เนื้อหาหลักข้างต้น (sequence/state diagram/algorithm ของ REC-1/2/3/4)
> **ไม่เปลี่ยนแปลง** เพราะยัง conceptual ล้วน ไม่ผูกกับ backend จริง

> **อัปเดต 2026-08-30 (รอบ 2)**: mechanical re-sync ทั้งหมดจาก Firebase Cloud Functions เป็น **Express.js
> บน Google Cloud Run** ตามการเปลี่ยน stack ใน `tech-stack.md` §2/§3/§6 (ยืนยันจากโค้ดจริง
> `apps/web/server/routes/*`) — เปลี่ยน execution ของ MET + wearable override (REC-2) จาก **React Native
> client** เป็น **React+Vite web client** เพราะ REC-* ทั้งหมดอยู่ใน `apps/web` (ไม่เคยย้าย ไม่ใช่ native-only
> capability) — เนื้อหาหลัก (sequence/state diagram/algorithm) **ไม่เปลี่ยนแปลง** เพราะยัง conceptual ล้วน

มิเรอร์จาก [tech-stack.md § 6.1](../tech-stack.md#61-hlas-conceptual-component--expressjs--cloud-firestore-implementation)
(อัปเดต 2026-08-30) เฉพาะ Component ที่ปรากฏในไฟล์นี้:

| Conceptual Component | Concrete Implementation |
|---|---|
| Content Recommendation | **Express route** `GET /api/workouts/today/recommendation`, `POST /api/workouts/today/recommendation/swap`, `POST /api/workouts/sessions` (แทนที่ Cloud Function `recommendation` เดิม — `apps/web/server/routes/content-recommendation/index.ts`, ปัจจุบันเป็น stub คืน `501` รอเรียก YouTube Data API v3 จริง) เก็บ `sessionVideos`/`rejectedVideoIds` เป็น embedded array field ใน document `users/{userId}/workoutSessions/{sessionId}` |
| Exertion & Calorie Calculation | คำนวณ MET ที่ client (React+Vite) ตาม NFR-01/03 → **Express route** `POST /api/workouts/sessions/:sessionId/complete` (แทนที่ Cloud Function `sessionComplete` เดิม — `apps/web/server/routes/exertion-calorie/index.ts`) validate + เขียน embedded map field `actualCalorieBurn` ลง document เดียวกัน; ค่าจาก wearable (INT-3) เขียนผ่าน **Express route** `POST /api/integrations/wearable/readings` เป็น embedded map field `wearableReading` — referential existence validation ผ่าน helper กลาง `apps/web/server/assertDocExists.ts` (แทนที่แนวคิดเดิมที่ให้แต่ละ Cloud Function `get()` เองแยกกัน) |

**Execution ของ algorithm**: ตาม [tech-stack.md § 4](../tech-stack.md#4-เหตุผลการเลือก-rationale)
(NFR-01/NFR-03 — client-side calculation) การคำนวณ **MET + wearable override (REC-2)** เกิดขึ้นฝั่ง
**React+Vite web client โดยตรง** (`apps/web/client`) เพื่อไม่มี network latency แล้วส่งผลลัพธ์ที่คำนวณแล้ว
ไปบันทึกผ่าน **Express route `POST /api/workouts/sessions/:sessionId/complete`** (แทนที่ Firebase Cloud
Function `sessionComplete` เดิม — ไม่ใช่เขียนตรงเข้า embedded field `actualCalorieBurn` ภายใน document
`workoutSessions/{sessionId}` จาก client เอง) เพื่อให้ route นั้น validate เป็นเกราะป้องกันชั้นที่สองฝั่ง
server เช่นเดิม รันบน **Google Cloud Run**
