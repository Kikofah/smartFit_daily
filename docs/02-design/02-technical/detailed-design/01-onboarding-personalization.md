# Detailed Design — Onboarding & Personalization (Conceptual)

- **ประเภทเอกสาร:** Detailed Design — Conceptual (ไม่ผูก technical stack)
- **สถานะเอกสาร:** Draft
- **วันที่สร้าง:** 2026-08-28
- **อัปเดตล่าสุด:** 2026-08-29 (รอบ 3) — `tech-stack.md` ขยาย mapping ของ Component "Account & Session
  Management" เสร็จสมบูรณ์แล้ว (§6.1 per-field mapping + §6.3.1 ใหม่ mapping ระดับ operation ทั้ง 8 ตัว) —
  sync แถวเดิมในภาคผนวก Stack Mapping ที่เคยเป็น placeholder ⚠️ (รอบ 2) ให้ตรงกับเนื้อหาสมบูรณ์นี้ เป็น
  mechanical re-sync ล้วนๆ ไม่ใช่การตัดสินใจใหม่ — พิจารณาแล้วว่า **ไม่จำเป็นต้องเพิ่มหมายเหตุ client SDK vs
  Cloud Function ลงใน sequence diagram ทั้ง 3 ไดอะแกรมของ ONB-0** เพราะไม่กระทบความถูกต้องเชิง conceptual
  (ดูเหตุผลในภาคผนวก Stack Mapping) — ไม่แตะเนื้อหาหลักอื่นใดของไฟล์นี้
- **อัปเดตก่อนหน้า:** 2026-08-29 (รอบ 2) — audit พบว่า `high-level-architecture.md` เพิ่ม Conceptual Component
  ใหม่ **"Account & Session Management" (§3.1, เดิม Personalization & Profile renumber เป็น §3.2)**,
  `api-spec.md` เพิ่มหัวข้อ 3.1 (8 operations: signup/login แยก 3 วิธี + forgot-password + logout), และ
  `database-schema.md` เพิ่มตาราง `user_account` เพื่อรองรับ **ONB-0** (REQ-14–17 — สมัครสมาชิก/เข้าสู่ระบบ/
  ลืมรหัสผ่าน/ออกจากระบบ) ที่เพิ่งถูกเพิ่มเข้า backlog วันเดียวกันนี้ แต่ไฟล์นี้ยังไม่มีเนื้อหารองรับเลย
  (เอกสารล้าหลัง ไม่ใช่ข้อขัดแย้ง) — เพิ่ม **section ใหม่ "ONB-0"** (ก่อน ONB-1) พร้อม 3 sequence diagram
  แยกตามที่ผู้ใช้ยืนยัน 2026-08-29 (สมัครสมาชิก / เข้าสู่ระบบ+ลืมรหัสผ่าน / ออกจากระบบ) — **ไม่มี state
  diagram** (session เป็นข้อมูล ephemeral ไม่ persist เป็น column ตาม `database-schema.md` §3.1 — ไม่ใช่
  state transition ที่มี `enum` รองรับ, ยืนยันกับผู้ใช้แล้ว) และ**ไม่มี algorithm section** (ไม่ใช่ feature
  เชิงคำนวณ) — เพิ่ม `Note` บอก precondition ของ ONB-0 ในไดอะแกรมเดิมของ ONB-1 (ไม่แก้โครงสร้างเดิม), เพิ่ม
  จุดที่ยังไม่ได้ระบุใหม่ 6 ข้อ, แก้เลขหัวข้อ HLA/API Spec ที่ renumber แล้วในหัวข้อ "ความสัมพันธ์กับเอกสาร
  อื่น" (Personalization & Profile §3.1→§3.2 ที่ค้างจากรอบก่อน), และเพิ่มแถว "Account & Session Management"
  ในภาคผนวก Stack Mapping (พร้อม ⚠️ เพราะ `tech-stack.md` §6.1 ยังไม่มี mapping ระดับ operation ให้มิเรอร์ —
  ตรงกับ gap เดียวกันที่ HLA §10/api-spec.md §6 ทิ้งไว้แล้ว ไม่ใช่การตัดสินใจใหม่) — audit เนื้อหาเดิมของ
  ONB-1/2/3 แล้วไม่พบ drift อื่นนอกจากเลขหัวข้อที่ค้าง (ดู [log 2026-08-29](../../../05-log/20260829-log.md))
- **อัปเดตก่อนหน้านั้น:** 2026-08-29 (รอบ 1) — sync ภาคผนวก Stack Mapping ให้ตรงกับ `tech-stack.md` ฉบับ
  Firebase ใหม่ (audit เนื้อหาหลัก sequence diagram/algorithm ของ ONB-1/2/3 แล้วไม่พบ drift)
- **สร้างโดย:** skill `detailed-design-builder`
- **อ้างอิงจาก:** [High Level Architecture](../high-level-architecture.md), [API Spec](../api-spec.md),
  [Database Schema](../database-schema.md), [Product Backlog](../../../01-requirements/backlog.md),
  [Requirement](../../../01-requirements/01-spec/20260823-01-onboarding-personalization.md)

## ขอบเขตและหลักการ

เอกสารนี้เจาะจงกว่า API Spec/Database Schema อีกหนึ่งระดับ — **ยังคง conceptual ไม่ผูก technical stack**
sequence diagram ใช้ participant เป็น Conceptual Component จาก HLA หรือ actor ทั่วไปเท่านั้น (ไม่มีชื่อ
framework/service เฉพาะเจาะจง) อัลกอริทึมเขียนเป็นขั้นตอนภาษาธรรมชาติ/pseudocode เชิงแนวคิด ไม่ใช่โค้ดจริง

## ONB-0 — สมัครสมาชิก / เข้าสู่ระบบ / ลืมรหัสผ่าน / ออกจากระบบ (REQ-14, REQ-15, REQ-16, REQ-17)

แยกเป็น 3 sequence diagram ตามที่ผู้ใช้ยืนยัน 2026-08-29 — เพราะ ONB-0 ครอบคลุม 4 REQ ที่มีลักษณะต่างกัน
(ไม่เหมือน ONB-1/2/3 ที่แต่ละ Feature ID มี operation เดียว): สมัครสมาชิก, เข้าสู่ระบบ+ลืมรหัสผ่าน (รวมกัน
เพราะ `user-journeys.md#onb-0` ระบุว่าลืมรหัสผ่านวนกลับเข้า login flow เดิม — Step 9), และออกจากระบบ

### Sequence Diagram 1 — สมัครสมาชิก (REQ-14)

```mermaid
sequenceDiagram
    actor U as ผู้ใช้
    participant AS as Account & Session Management
    participant IDP as ผู้ให้บริการยืนยันตัวตนภายนอก (Google/Apple)
    alt สมัครด้วยอีเมล/รหัสผ่าน
        U->>AS: POST /auth/signup/email (อีเมล, รหัสผ่าน)
        alt อีเมลนี้มีบัญชีอยู่แล้ว
            AS-->>U: 409 Conflict
        else รูปแบบอีเมล/รหัสผ่านไม่ถูกต้อง
            AS-->>U: 400 Bad Request
        else ข้อมูลถูกต้อง
            AS->>AS: สร้างแถวใหม่ใน user_account (signup_method = email_password, email, credential_reference)
            AS-->>U: 201 Created (User Account ใหม่) → ไปขั้นตอน ONB-1
        end
    else สมัครผ่าน Google
        U->>AS: POST /auth/signup/google
        AS->>IDP: ส่งคำขอยืนยันตัวตน (redirect)
        alt ยืนยันตัวตนสำเร็จ
            IDP-->>AS: ผลยืนยันตัวตน + อีเมลที่ยืนยันแล้ว
            AS->>AS: สร้างแถวใหม่ใน user_account (signup_method = google, email, external_provider_reference)
            AS-->>U: 201 Created (User Account ใหม่) → ไปขั้นตอน ONB-1
        else ยืนยันตัวตนล้มเหลว
            IDP-->>AS: ล้มเหลว
            AS-->>U: แจ้งว่าไม่สำเร็จ — ต้องลองใหม่/เปลี่ยนวิธี (ไม่มี fallback อัตโนมัติ ตาม HLA §6.4)
        end
    else สมัครผ่าน Apple
        U->>AS: POST /auth/signup/apple
        AS->>IDP: ส่งคำขอยืนยันตัวตน (redirect)
        alt ยืนยันตัวตนสำเร็จ
            IDP-->>AS: ผลยืนยันตัวตน + อีเมลที่ยืนยันแล้ว
            AS->>AS: สร้างแถวใหม่ใน user_account (signup_method = apple, email, external_provider_reference)
            AS-->>U: 201 Created (User Account ใหม่) → ไปขั้นตอน ONB-1
        else ยืนยันตัวตนล้มเหลว
            IDP-->>AS: ล้มเหลว
            AS-->>U: แจ้งว่าไม่สำเร็จ — ต้องลองใหม่/เปลี่ยนวิธี (ไม่มี fallback อัตโนมัติ ตาม HLA §6.4)
        end
    end
```

Edge case ที่แสดง: อีเมลซ้ำ (`409`, ตรงกับ `api-spec.md` §3.1) และ "ยืนยันตัวตนภายนอกล้มเหลวแล้วไม่มี
fallback" (ตรงกับ HLA §6.4 — ต่างจาก INT-2/INT-3 ที่มี fallback เป็นกรอกเอง เพราะ ONB-0 เป็น Must-priority
ที่ต้องมีบัญชีจริงก่อนทำอะไรต่อได้)

### Sequence Diagram 2 — เข้าสู่ระบบ + ลืมรหัสผ่าน (REQ-15, REQ-16)

```mermaid
sequenceDiagram
    actor U as ผู้ใช้
    participant AS as Account & Session Management
    participant IDP as ผู้ให้บริการยืนยันตัวตนภายนอก (Google/Apple)
    alt เข้าสู่ระบบด้วยอีเมล/รหัสผ่าน
        U->>AS: POST /auth/login/email (อีเมล, รหัสผ่าน)
        alt credential ถูกต้อง
            AS->>AS: ตรวจสอบกับ user_account (signup_method = email_password)
            AS-->>U: 200 OK — จดจำสถานะเข้าสู่ระบบ (session persistence)
        else credential ไม่ถูกต้อง
            AS-->>U: 401 Unauthorized
        end
    else เข้าสู่ระบบผ่าน Google/Apple
        U->>AS: POST /auth/login/google หรือ /auth/login/apple
        AS->>IDP: ส่งคำขอยืนยันตัวตน
        alt ยืนยันตัวตนสำเร็จ
            IDP-->>AS: ผลยืนยันตัวตน
            AS->>AS: จับคู่กับ user_account ที่ signup_method ตรงกัน
            AS-->>U: 200 OK — จดจำสถานะเข้าสู่ระบบ (session persistence)
        else ยืนยันตัวตนล้มเหลว
            AS-->>U: แจ้งว่าไม่สำเร็จ — ต้องลองใหม่/เปลี่ยนวิธี (ไม่มี fallback ตาม HLA §6.4)
        end
    end
    opt ลืมรหัสผ่าน (เฉพาะบัญชี email/password)
        U->>AS: POST /auth/forgot-password (อีเมลที่ลงทะเบียนไว้)
        alt บัญชีของอีเมลนี้สมัครผ่าน Google/Apple
            AS-->>U: 422 Unprocessable Entity (ไม่มีรหัสผ่านให้รีเซ็ต)
        else บัญชีสมัครด้วย email/password
            AS-->>U: 204/202 คำขอรีเซ็ตถูกส่งแล้ว
            U->>AS: กลับไปเข้าสู่ระบบใหม่ (วนกลับด้านบน)
        end
    end
```

Edge case ที่แสดง: **"สมัครด้วย Google/Apple แล้วขอรีเซ็ตรหัสผ่านไม่ได้" (`422`)** — ตรงกับ Alt/Edge Case
จริงใน `user-journeys.md#onb-0`

### Sequence Diagram 3 — ออกจากระบบ (REQ-17)

```mermaid
sequenceDiagram
    actor U as ผู้ใช้
    participant AS as Account & Session Management
    U->>AS: POST /auth/logout
    AS->>AS: ล้างสถานะเข้าสู่ระบบ (session) ทันที — เป็นข้อมูล ephemeral ไม่ persist เป็น column (ตาม database-schema.md §3.1)
    AS-->>U: 204 No Content → กลับไปหน้าจอสมัครสมาชิก/เข้าสู่ระบบเริ่มต้น
```

### State Diagram

**ไม่ทำ State Diagram สำหรับ User Account** (ยืนยันกับผู้ใช้แล้ว 2026-08-29) — เหตุผล: `database-schema.md`
§3.1 ระบุไว้ชัดว่า "สถานะเข้าสู่ระบบปัจจุบัน (session)" ที่ HLA §5 กล่าวถึงในเชิงแนวคิด **ไม่ persist เป็น
column** ในตาราง `user_account` เพราะเป็นข้อมูล ephemeral (เทียบเคียงกับ flag read-only ของ
`weekly_plan_entry` ที่ก็ไม่ persist เป็น column เช่นกัน และไม่มี state diagram ในเอกสารนี้เหมือนกัน) ส่วน
`enum` เดียวที่มีอยู่จริงในตาราง (`signup_method`) ถูกกำหนดครั้งเดียวตอนสมัครสมาชิกและ "ไม่เปลี่ยนภายหลัง"
ตาม schema — จึงไม่ใช่ state transition ที่มีความหมายตามกติกาที่ต้องอิงกับ `enum` จริงในตาราง

### อัลกอริทึม

ไม่มีอัลกอริทึมแยก — REQ-14–17 ไม่ใช่ feature เชิงคำนวณ ตรรกะทั้งหมดครอบคลุมอยู่ใน sequence diagram ข้างต้น
แล้ว

## ONB-1 — กรอกข้อมูลส่วนตัวเพื่อคำนวณเป้าหมายแคลอรี่ (REQ-01)

### Sequence Diagram

```mermaid
sequenceDiagram
    actor U as ผู้ใช้
    participant PP as Personalization & Profile
    Note over U,PP: Precondition — ผ่าน ONB-0 แล้ว (มีบัญชีผู้ใช้จริง/เข้าสู่ระบบแล้ว)
    U->>PP: PUT /profile/personal-info (อายุ, เพศ, น้ำหนัก, ส่วนสูง, ระดับกิจกรรม)
    alt ข้อมูลไม่ถูกต้อง (เช่น น้ำหนักติดลบ)
        PP-->>U: 400 Bad Request (validation error)
    else ข้อมูลถูกต้อง
        PP->>PP: คำนวณ BMR (Mifflin-St Jeor) x Activity Factor = TDEE
        PP->>PP: บันทึกลงตาราง user_profile (รวม tdee_kcal)
        PP-->>U: 200 OK (User Profile พร้อม TDEE)
    end
```

### อัลกอริทึม — คำนวณ BMR/TDEE

1. รับ input: อายุ, เพศ, น้ำหนัก (kg), ส่วนสูง (cm), ระดับกิจกรรม
2. ตรวจสอบ validation — ถ้าค่าใดติดลบหรือเกินช่วงที่สมเหตุสมผล ให้คืน error (`400`) และหยุดกระบวนการ
3. คำนวณ BMR ตามเพศ (สูตร Mifflin-St Jeor ตาม REQ-01):
   - เพศชาย: `BMR = 10×น้ำหนัก + 6.25×ส่วนสูง − 5×อายุ + 5`
   - เพศหญิง: `BMR = 10×น้ำหนัก + 6.25×ส่วนสูง − 5×อายุ − 161`
4. คูณ BMR ด้วย Activity Factor ตามระดับกิจกรรมที่เลือก ได้ TDEE (ค่า Activity Factor จริงต่อระดับยังไม่
   resolve เป็นทางการใน `01-spec/` — ดู "จุดที่ยังไม่ได้ระบุ")
5. บันทึก TDEE ลง `user_profile.tdee_kcal`
6. ส่งคืนโปรไฟล์ที่อัปเดตแล้วให้ผู้ใช้ — ค่านี้เป็น input ตั้งต้นของ ONB-3, REC-2, และ INT-2

## ONB-2 — เลือกอุปกรณ์ที่มี (REQ-03)

### Sequence Diagram

```mermaid
sequenceDiagram
    actor U as ผู้ใช้
    participant PP as Personalization & Profile
    U->>PP: PUT /profile/equipment (รายการอุปกรณ์ที่เลือก)
    alt เลือก "ไม่มีอุปกรณ์" พร้อมตัวเลือกอื่นในคำขอเดียวกัน
        PP-->>U: 400 Bad Request (mutual exclusion — ตาม decision ที่ resolve แล้ว)
    else เลือกถูกต้อง (multi-select ปกติ หรือ "ไม่มีอุปกรณ์" เดี่ยวๆ)
        PP->>PP: ลบรายการ equipment_selection เดิมของผู้ใช้ทั้งหมด (ถ้าเป็นการแก้ไข)
        PP->>PP: เพิ่มแถวใหม่ลง equipment_selection ตามรายการที่เลือก (1 แถวต่อ 1 ประเภท)
        PP-->>U: 200 OK (Equipment Profile ที่บันทึกแล้ว)
    end
```

ไม่มีอัลกอริทึมแยก — ตรรกะเป็นการตรวจ mutual-exclusion อย่างเดียว ครอบคลุมอยู่ใน sequence diagram แล้ว

## ONB-3 — ตั้งเป้าหมายหลัก (REQ-02)

### Sequence Diagram

```mermaid
sequenceDiagram
    actor U as ผู้ใช้
    participant PP as Personalization & Profile
    U->>PP: PUT /profile/goal (ประเภทเป้าหมาย, น้ำหนักเป้าหมาย)
    alt เลือก "ลดน้ำหนัก" แต่ไม่กรอกน้ำหนักเป้าหมาย
        PP-->>U: 400 Bad Request (target weight required)
    else ข้อมูลครบถ้วน
        PP->>PP: อ่าน tdee_kcal จาก user_profile
        PP->>PP: คำนวณ Target kcal = TDEE บวก/ลบค่าคงที่ตามประเภทเป้าหมาย
        alt Target kcal ต่ำกว่า Safety Floor (1,200-1,500 kcal)
            PP->>PP: ปรับ Target kcal = Safety Floor, ตั้ง is_safety_floor_applied = true
        end
        PP->>PP: บันทึกลงตาราง goal_selection (รวม target_weight_kg ถ้ามี)
        PP-->>U: 200 OK (Goal Selection พร้อมเป้าหมายแคลอรี่รายวัน)
    end
```

### อัลกอริทึม — คำนวณเป้าหมายแคลอรี่รายวัน + Safety Floor

1. รับ input: ประเภทเป้าหมาย (ลดน้ำหนัก/กระชับสัดส่วน/เพิ่มความอึด), น้ำหนักเป้าหมาย (บังคับเมื่อเลือก
   "ลดน้ำหนัก" ตาม decision ที่ resolve แล้ว 2026-08-28)
2. ตรวจสอบ: ถ้าเลือก "ลดน้ำหนัก" แต่ไม่มีน้ำหนักเป้าหมาย → คืน error (`400`) และหยุดกระบวนการ
3. อ่าน TDEE ปัจจุบันจาก `user_profile.tdee_kcal`
4. คำนวณ Target kcal ตามประเภทเป้าหมาย (ค่าคงที่ตาม REQ-02):
   - ลดน้ำหนัก: `Target = TDEE − 500`
   - กระชับสัดส่วน: `Target = TDEE + 0` (maintenance)
   - เพิ่มความอึด: `Target = TDEE + 300`
5. ตรวจสอบ safety floor: ถ้า `Target < 1,200–1,500 kcal` (ตัวเลขที่แน่นอนในช่วงนี้ยังไม่ resolve เป็น
   ทางการ — ดู "จุดที่ยังไม่ได้ระบุ") → ปรับ `Target = Safety Floor` และตั้ง `is_safety_floor_applied = true`
6. บันทึกผลลัพธ์สุดท้ายลง `goal_selection` (`daily_calorie_target_kcal`, `target_weight_kg` ถ้ามี)
7. ส่งคืนผลลัพธ์ให้ผู้ใช้ — ค่านี้เป็น input ของ REC-1 (จับคู่วิดีโอ), PLN-3 (ประเมิน all-or-nothing), และ
   INT-1 (เป็นแหล่งที่มาของน้ำหนักเป้าหมาย)

## จุดที่ยังไม่ได้ระบุ / ควรยืนยันเพิ่มเติม

1. **ONB-1**: ค่า Activity Factor จริงต่อแต่ละระดับกิจกรรม (5 ระดับ) ยังไม่ resolve เป็นทางการใน
   `01-spec/` — algorithm ข้างต้นอ้างถึงแนวคิด "Activity Factor" แต่ไม่ได้ระบุตัวเลขจริง
2. **ONB-3**: ตัวเลขที่แน่นอนของ safety floor ภายในช่วง 1,200–1,500 kcal (ขึ้นกับปัจจัยใด — เพศ? เมื่อไหร่
   ใช้ค่าไหน?) ยังไม่ระบุ
3. **ONB-3**: กรณีผู้ใช้เลือก "กระชับสัดส่วน"/"เพิ่มความอึด" แล้วข้ามช่องน้ำหนักเป้าหมาย (ไม่บังคับ) — ช่อง
   ทางแจ้งเตือนให้กรอกภายหลังยังไม่ระบุ (ผูกกับ INT-1 ที่ต้องใช้ค่านี้)
4. **ONB-0**: ยังไม่ระบุว่าต้องมีขั้นตอนยืนยันอีเมล (email verification) ก่อนใช้งานได้จริงหรือไม่ — กระทบว่า
   `POST /auth/signup/email` ควรพาผู้ใช้ไปต่อ ONB-1 ทันทีหรือต้องรอยืนยันอีเมลก่อน (ตรงกับ `api-spec.md`
   §4 ข้อ 6)
5. **ONB-0**: ยังไม่ระบุกติกาความซับซ้อนของรหัสผ่าน (password policy) สำหรับ email/password (ตรงกับ
   `api-spec.md` §4 ข้อ 7)
6. **ONB-0**: ยังไม่ระบุระยะเวลาหมดอายุของ session (session timeout) ที่แน่นอน (ตรงกับ `api-spec.md` §4
   ข้อ 8)
7. **ONB-0/NFR-05**: ยังไม่ชัดว่า NFR-05 (ต้องขอ consent ชัดเจนก่อนเชื่อมต่อระบบภายนอก) ครอบคลุมการสมัคร/
   เข้าสู่ระบบผ่านผู้ให้บริการยืนยันตัวตนภายนอก (Google/Apple) ด้วยหรือไม่ (ตรงกับ HLA §8 ข้อ 6, `api-spec.md`
   §4 ข้อ 9)
8. **ONB-0**: พฤติกรรมของ `POST /auth/login/email` และ `POST /auth/forgot-password` เมื่ออีเมลไม่มีอยู่ใน
   ระบบเลย (ไม่ใช่แค่รหัสผ่านผิด) ยังไม่ระบุ — เกี่ยวข้องกับนโยบาย account enumeration ที่ upstream ยังไม่ได้
   ตัดสินใจ (ตรงกับ `api-spec.md` §4 ข้อ 10)
9. **ONB-0**: พฤติกรรมเมื่ออีเมลจากผู้ให้บริการยืนยันตัวตนภายนอกตรงกับบัญชีที่มีอยู่แล้วด้วยวิธีอื่น (เช่น เคย
   สมัครด้วย email/password มาก่อน) ยังไม่ระบุ — ควร merge เข้าบัญชีเดียวกันหรือปฏิเสธการสมัครซ้ำ (ตรงกับ
   `api-spec.md` §4 ข้อ 11)

## ความสัมพันธ์กับเอกสารอื่น

- [High Level Architecture](../high-level-architecture.md) — component "Account & Session Management"
  (หัวข้อ 3.1, สำหรับ ONB-0), "Personalization & Profile" (หัวข้อ 3.2, สำหรับ ONB-1/2/3 — เดิม 3.1 ก่อน
  renumber), external integration boundary "ผู้ให้บริการยืนยันตัวตนภายนอก — Google/Apple" (หัวข้อ 6.4),
  entity "User Account" (หัวข้อ 5), Flow 1 Onboarding Flow (หัวข้อ 4.1)
- [API Spec](../api-spec.md) — section 3.1 Account & Session Management (ONB-0), section 3.2
  Personalization & Profile (ONB-1/2/3 — เดิม 3.1 ก่อน renumber)
- [Database Schema](../database-schema.md) — ตาราง `user_account` (ONB-0), `user_profile`,
  `goal_selection`, `equipment_selection`
- [Product Backlog](../../../01-requirements/backlog.md), [Requirement](../../../01-requirements/01-spec/20260823-01-onboarding-personalization.md) —
  ONB-0/ONB-1/ONB-2/ONB-3, REQ-14–17/REQ-01/REQ-02/REQ-03
- [User Journeys](../../01-prototypes/user-journeys.md) — ลำดับ step ของ ONB-0/ONB-1/ONB-2/ONB-3

## ภาคผนวก: Stack Mapping

> **หัวข้อนี้เป็นข้อยกเว้นเดียวในไฟล์นี้ที่มีชื่อเทคโนโลยีจริง** แหล่งที่มาและสิทธิ์แก้ไขจริงอยู่ที่
> [tech-stack.md](../tech-stack.md) เสมอ — หัวข้อข้างต้นยังคง conceptual ตามกติกาเดิมทุกประการ ถ้าทีม
> เปลี่ยน stack ในอนาคต ให้รัน `tech-stack-builder` ก่อน แล้วภาคผนวกนี้จะถูก sync ตามในการรัน
> `detailed-design-builder` ครั้งถัดไป

> **อัปเดต 2026-08-29 (รอบ 1)**: มิเรอร์ใหม่จาก Supabase/PostgreSQL เป็น Firebase ตามการเปลี่ยน stack ใน
> `tech-stack.md` §2/§5 — เนื้อหาหลักข้างต้น (sequence diagram/algorithm ของ ONB-1/ONB-2/ONB-3)
> **ไม่เปลี่ยนแปลง** เพราะยัง conceptual ล้วน ไม่ผูกกับ backend จริง

> **อัปเดต 2026-08-29 (รอบ 2)**: เพิ่มแถว "Account & Session Management" (สำหรับ ONB-0 ที่เพิ่งเพิ่มเข้า
> ไฟล์นี้) — ตรวจสอบ `tech-stack.md` §6.1 โดยตรงแล้วพบว่า**ยังไม่มีแถวนี้อยู่เลย** (มีแค่ 7 component เดิม
> ก่อน ONB-0) ตรงกับ ⚠️ ที่ [`high-level-architecture.md` §10](../high-level-architecture.md) และ
> [`api-spec.md` §6](../api-spec.md) ทิ้งไว้แล้วเมื่อวันเดียวกัน — จึงมิเรอร์ด้วย placeholder เดียวกัน
> (ไม่ใช่การตัดสินใจเนื้อหาใหม่) รอ `tech-stack-builder` ขยายรายละเอียดในการรันครั้งถัดไป

> **อัปเดต 2026-08-29 (รอบ 3)**: `tech-stack.md` ขยาย mapping ของ "Account & Session Management" เสร็จ
> สมบูรณ์แล้วทั้ง §6.1 (per-field mapping กับ Firebase Auth's `UserRecord`) และ §6.3.1 ใหม่ (mapping ระดับ
> operation ทั้ง 8 ตัว) — sync แถวด้านล่างให้ตรงกันแบบ mechanical (resolve ⚠️ เดิมในรอบ 2) ไม่ใช่การตัดสินใจ
> เนื้อหาใหม่ — **พิจารณาแล้วว่าไม่จำเป็นต้องเพิ่มหมายเหตุ "client SDK ตรง vs Cloud Function" ลงใน sequence
> diagram ทั้ง 3 ไดอะแกรมข้างต้น** เพราะ diagram หลักใช้ participant "Account & Session Management" เป็น
> Conceptual Component เดียวที่ทำหน้าที่เดียวกันไม่ว่าฝั่ง implementation จะแบ่งงานภายในอย่างไร (ตรงกับ pattern
> เดิมของไฟล์นี้เองที่ผลักรายละเอียด client-side/Edge Function split ของ ONB-1/ONB-3 ไปไว้ที่ภาคผนวกนี้เท่านั้น
> ไม่ใช่ในตัว diagram หลัก) — ความถูกต้องเชิง conceptual ของ diagram ไม่กระทบ

มิเรอร์จาก [tech-stack.md § 6.1](../tech-stack.md#61-hlas-conceptual-component--firebase-implementation)
และ [§ 6.3.1](../tech-stack.md#631-account--session-management-onb-0--ข้อยกเว้นของกติกาข้างต้น)
(อัปเดต 2026-08-29) เฉพาะ Component ที่ปรากฏในไฟล์นี้:

| Conceptual Component | Concrete Implementation |
|---|---|
| Account & Session Management | **Firebase Authentication จัดการ credential/session ทั้งหมดเอง — ไม่มี Firestore collection แยก** เพราะ `user_account` (thin identity anchor) map ตรงกับ Firebase Auth's `UserRecord` ครบทุก field: `id` = Firebase Auth UID (ค่าเดียวกับ document ID ของ `users/{userId}` ที่ Personalization & Profile ใช้ — ไม่มี FK lookup จริงให้ทำ), `signup_method` derive จาก `providerData[0].providerId`, `email` = `UserRecord.email`, `credential_reference` ไม่มี field ให้เข้าถึงเลยเพราะ Firebase เก็บ password hash ไว้ภายในเอง, `external_provider_reference` = `providerData[0].uid`, `created_at` = `UserRecord.metadata.creationTime`; "สถานะเข้าสู่ระบบ (session)" (ephemeral) = ID Token/Refresh Token ที่ client SDK เก็บ persistence เอง ไม่มี server-side session store ให้ query — **operation-level mapping**: 7 ใน 8 operation (`signup/email`, `signup/google`, `signup/apple`, `login/email`, `login/google`, `login/apple`, `logout`) เป็น **client SDK call ตรง ไม่ผ่านการเขียนโค้ด backend เอง** (Google/Apple signup กับ login เป็น SDK call เดียวกันจริง แยกด้วย field `isNewUser` ที่ SDK คืนมาแทนการแยก route) — มีเพียง `POST /auth/forgot-password` ที่ต้องเป็น **Cloud Function `forgotPassword`** เพราะต้อง enforce เงื่อนไข `422` (บัญชี Google/Apple ไม่มีรหัสผ่านให้รีเซ็ต) ที่ client SDK เพียงอย่างเดียวไม่รองรับการแยกกรณีนี้ |
| Personalization & Profile | Firestore collection `users/{userId}` เก็บ `profile`/`goalSelection`/`equipmentSelection` + Firestore Security Rule จำกัดสิทธิ์ต่อผู้ใช้ + Cloud Function `profileUpdate` (validate safety floor, equipment mutual exclusion) — คำนวณ TDEE/target kcal ที่ฝั่ง client ก่อนส่งเหมือนเดิม |

**Execution ของ algorithm section**: ตาม [tech-stack.md § 4](../tech-stack.md#4-เหตุผลการเลือก-rationale)
(NFR-01/NFR-03 — client-side calculation) การคำนวณ **TDEE (ONB-1)** และ **Safety Floor (ONB-3)**
เกิดขึ้นฝั่ง **React Native client โดยตรง** เพื่อไม่มี network latency แล้วส่งผลลัพธ์ที่คำนวณแล้วไปบันทึก
ผ่าน **Firebase Cloud Function `profileUpdate`** (แทนที่ Supabase Edge Function `profile-update` เดิม —
ไม่ใช่เขียนตรงเข้า Firestore document `users/{userId}` จาก client เอง) เพื่อให้ Cloud Function
validate/บังคับกติกาธุรกิจ (เช่น safety floor, equipment mutual exclusion) เป็นเกราะป้องกันชั้นที่สองฝั่ง
server เช่นเดิม — **ONB-0 ไม่มี algorithm section จึงไม่มี client-side/Edge Function split ให้ระบุเพิ่ม**
(REQ-14–17 ไม่ใช่ feature เชิงคำนวณ)
