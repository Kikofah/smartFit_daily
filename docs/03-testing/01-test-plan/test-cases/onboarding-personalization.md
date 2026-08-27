# Test Cases — Onboarding & Personalization (ONB-1, ONB-2, ONB-3)

- **ประเภทเอกสาร:** Test Cases (ต่อ Epic — Onboarding & Personalization)
- **สถานะเอกสาร:** Draft
- **วันที่สร้าง:** 2026-08-27
- **สร้างโดย:** skill `test-suite-builder`

ต้นทาง (upstream, read-only):
[acceptance-criteria.md § Epic 1](../../../01-requirements/acceptance-criteria.md#epic-1-onboarding--personalization) ·
[backlog.md](../../../01-requirements/backlog.md) ·
[01-spec/20260823-01-onboarding-personalization.md](../../../01-requirements/01-spec/20260823-01-onboarding-personalization.md) ·
[user-journeys.md](../../../02-design/01-prototypes/user-journeys.md) ·
ดูภาพหน้าจอประกอบได้ที่ prototype
[v1/01-onboarding-personal-info.html](../../../02-design/01-prototypes/v1/01-onboarding-personal-info.html),
[v1/02-onboarding-equipment.html](../../../02-design/01-prototypes/v1/02-onboarding-equipment.html),
[v1/03-onboarding-goal-select.html](../../../02-design/01-prototypes/v1/03-onboarding-goal-select.html),
[v1/04-onboarding-goal-confirm.html](../../../02-design/01-prototypes/v1/04-onboarding-goal-confirm.html)

ดูภาพรวม scope/risk/entry-exit criteria ของทั้งโปรเจกต์ที่
[test-plan.md](../test-plan.md) — ทั้ง ONB-1, ONB-2, ONB-3 อยู่ใน scope **Must** ของรอบทดสอบนี้

รูปแบบ ID: `TC-{FeatureID}-{3-digit}` เช่น `TC-ONB-1-001`

> **หมายเหตุการคำนวณ**: ONB-1/REQ-01 อ้างสูตร Mifflin-St Jeor ตรง ๆ (ชื่อสูตรที่นิยามค่าคงที่ตายตัวอยู่แล้ว
> ในสูตรมาตรฐาน) จึงใช้ค่าคงที่มาตรฐานของสูตรนี้ในการคำนวณ Test Data ด้านล่าง:
> - ชาย: BMR = 10×น้ำหนัก(kg) + 6.25×ส่วนสูง(cm) − 5×อายุ(ปี) + 5
> - หญิง: BMR = 10×น้ำหนัก(kg) + 6.25×ส่วนสูง(cm) − 5×อายุ(ปี) − 161
>
> ส่วนค่า **Activity Factor** ต่อระดับกิจกรรม ไม่มีเอกสารต้นทางใด (spec/backlog/journey/prototype)
> ระบุตัวเลขไว้ตรง ๆ — prototype `01-onboarding-personal-info.html` เพียงกำหนดชื่อ 5 ระดับ
> (`sedentary`/`light`/`moderate`/`active`/`very_active`) โดยไม่มีค่าตัวคูณ เพื่อให้ Expected Result ของ
> test case ที่เกี่ยวกับการคำนวณ TDEE ตรวจสอบได้จริง (ไม่ใช่แค่บรรยาย) เอกสารนี้จึงใช้ **ค่ามาตรฐานที่
> ผูกกับสูตร Mifflin-St Jeor โดยทั่วไป** ได้แก่ sedentary=1.2, light=1.375, moderate=1.55, active=1.725,
> very_active=1.9 — เป็น **content decision ของเอกสารนี้เอง ยังไม่ใช่ค่าที่ยืนยันจากผู้ใช้งานหรือ resolve
> ไว้ใน 01-spec/** ถ้าค่าจริงต่างจากนี้ ต้องกลับมาแก้ Test Data ที่เกี่ยวข้องทั้งหมดด้านล่าง (ดูสรุปใน
> "หมายเหตุ/Content Decisions" ท้ายไฟล์)
>
> เช่นเดียวกัน ONB-3/REQ-02 ระบุ safety floor เป็น **ช่วง** 1,200–1,500 kcal/วัน โดยไม่ได้ปักหมุดตัวเลข
> เดียวที่แน่นอน — เอกสารนี้ใช้ **1,200 kcal/วัน** (ขอบล่างของช่วงที่ยืนยันแล้ว ตรงกับค่าที่ prototype
> `04-onboarding-goal-confirm.html` เลือกใช้เป็นตัวอย่างประกอบ) เป็นค่า floor ที่ใช้ใน Test Data ของ
> AC-ONB-3-03 ด้านล่าง — เป็น content decision เช่นกัน

---

## ONB-1 — กรอกข้อมูลส่วนตัวเพื่อคำนวณเป้าหมายแคลอรี่ (REQ-01)

Journey: [user-journeys.md § ONB-1](../../../02-design/01-prototypes/user-journeys.md#onb-1--กรอกข้อมูลส่วนตัวเพื่อคำนวณเป้าหมายแคลอรี่-req-01) ·
AC: [AC-ONB-1-01](../../../01-requirements/acceptance-criteria.md#ac-onb-1-01--กรอกข้อมูลครบและถูกต้อง-คำนวณ-tdee-สำเร็จ-req-01),
[AC-ONB-1-02](../../../01-requirements/acceptance-criteria.md#ac-onb-1-02--กรอกข้อมูลไม่ครบหรือไม่ถูกต้อง-req-01),
[AC-ONB-1-03](../../../01-requirements/acceptance-criteria.md#ac-onb-1-03--แก้ไขน้ำหนักส่วนสูงภายหลัง-ต้องคำนวณ-tdee-ใหม่-req-01)

> AC-ONB-1-01 มี 2 test case (ชาย/หญิง) เพราะสูตร Mifflin-St Jeor มีค่าคงที่ต่างกันตามเพศ (+5 สำหรับชาย,
> −161 สำหรับหญิง) — เป็น variation ที่มีความหมายต่อผลการคำนวณจริง ไม่ใช่แค่ข้อมูลซ้ำ
> AC-ONB-1-02 มี 2 test case (ข้อมูลไม่ครบ / ข้อมูลไม่ถูกต้อง) ตามที่ AC ระบุ 2 กรณีไว้ในประโยคเดียวกัน

### TC-ONB-1-001 — กรอกข้อมูลครบถูกต้อง (เพศชาย) คำนวณ TDEE สำเร็จ

| Field | รายละเอียด |
|---|---|
| Test ID | TC-ONB-1-001 |
| Test Case Name | กรอกข้อมูลส่วนตัวครบถ้วนถูกต้อง (เพศชาย) ระบบคำนวณ TDEE และไปขั้นตอนเลือกอุปกรณ์ |
| Pre-condition | ผู้ใช้ใหม่ ยังไม่เคยผ่าน onboarding มาก่อน ไม่มี TDEE ในโปรไฟล์ อยู่ที่หน้า `01-onboarding-personal-info.html` |
| Test Steps | 1. กรอกอายุ = 30 ปี<br>2. เลือกเพศ = ชาย<br>3. กรอกน้ำหนัก = 75 กก.<br>4. กรอกส่วนสูง = 175 ซม.<br>5. เลือกระดับกิจกรรม = ปานกลาง (moderate)<br>6. กดปุ่มถัดไป |
| Expected Result | ระบบคำนวณ BMR = 10×75 + 6.25×175 − 5×30 + 5 = 1,698.75 kcal จากนั้นคูณ Activity Factor ระดับปานกลาง (1.55) ได้ **TDEE = 2,633 kcal/วัน** บันทึกลงโปรไฟล์ แล้วพาไปหน้าเลือกอุปกรณ์ (ONB-2) ทันที |
| Test Data | อายุ 30, เพศ ชาย, น้ำหนัก 75 กก., ส่วนสูง 175 ซม., กิจกรรมระดับปานกลาง (Activity Factor 1.55) → คาดว่า TDEE = 2,633 kcal/วัน |
| References | REQ-01 · AC-ONB-1-01 · [User Journey ONB-1](../../../02-design/01-prototypes/user-journeys.md#onb-1--กรอกข้อมูลส่วนตัวเพื่อคำนวณเป้าหมายแคลอรี่-req-01) · prototype [01-onboarding-personal-info.html](../../../02-design/01-prototypes/v1/01-onboarding-personal-info.html) |

### TC-ONB-1-002 — กรอกข้อมูลครบถูกต้อง (เพศหญิง) คำนวณ TDEE สำเร็จ

| Field | รายละเอียด |
|---|---|
| Test ID | TC-ONB-1-002 |
| Test Case Name | กรอกข้อมูลส่วนตัวครบถ้วนถูกต้อง (เพศหญิง) ระบบคำนวณ TDEE และไปขั้นตอนเลือกอุปกรณ์ |
| Pre-condition | ผู้ใช้ใหม่ ยังไม่เคยผ่าน onboarding มาก่อน ไม่มี TDEE ในโปรไฟล์ อยู่ที่หน้า `01-onboarding-personal-info.html` |
| Test Steps | 1. กรอกอายุ = 28 ปี<br>2. เลือกเพศ = หญิง<br>3. กรอกน้ำหนัก = 60 กก.<br>4. กรอกส่วนสูง = 165 ซม.<br>5. เลือกระดับกิจกรรม = เบา (light)<br>6. กดปุ่มถัดไป |
| Expected Result | ระบบคำนวณ BMR = 10×60 + 6.25×165 − 5×28 − 161 = 1,330.25 kcal จากนั้นคูณ Activity Factor ระดับเบา (1.375) ได้ **TDEE = 1,829 kcal/วัน** บันทึกลงโปรไฟล์ แล้วพาไปหน้าเลือกอุปกรณ์ (ONB-2) ทันที |
| Test Data | อายุ 28, เพศ หญิง, น้ำหนัก 60 กก., ส่วนสูง 165 ซม., กิจกรรมระดับเบา (Activity Factor 1.375) → คาดว่า TDEE = 1,829 kcal/วัน |
| References | REQ-01 · AC-ONB-1-01 · [User Journey ONB-1](../../../02-design/01-prototypes/user-journeys.md#onb-1--กรอกข้อมูลส่วนตัวเพื่อคำนวณเป้าหมายแคลอรี่-req-01) · prototype [01-onboarding-personal-info.html](../../../02-design/01-prototypes/v1/01-onboarding-personal-info.html) |

### TC-ONB-1-003 — กรอกข้อมูลไม่ครบ (ขาดฟิลด์เพศ) ไม่ให้ไปขั้นตอนถัดไป

| Field | รายละเอียด |
|---|---|
| Test ID | TC-ONB-1-003 |
| Test Case Name | ไม่เลือกเพศ ระบบบล็อกไม่ให้คำนวณ TDEE / ไปขั้นตอนถัดไป |
| Pre-condition | ผู้ใช้ใหม่อยู่ที่หน้า `01-onboarding-personal-info.html` |
| Test Steps | 1. กรอกอายุ = 30 ปี<br>2. **ไม่เลือกเพศ (ปล่อยว่าง)**<br>3. กรอกน้ำหนัก = 75 กก.<br>4. กรอกส่วนสูง = 175 ซม.<br>5. เลือกระดับกิจกรรม = ปานกลาง<br>6. กดปุ่มถัดไป |
| Expected Result | ระบบแสดงข้อความ error ใต้ฟิลด์เพศ ("กรุณาเลือกเพศ เพื่อใช้ในการคำนวณ BMR") ไม่คำนวณ TDEE และไม่พาไปหน้าเลือกอุปกรณ์ จนกว่าผู้ใช้จะเลือกเพศให้ครบ |
| Test Data | อายุ 30, เพศ (ว่าง), น้ำหนัก 75 กก., ส่วนสูง 175 ซม., กิจกรรมระดับปานกลาง |
| References | REQ-01 · AC-ONB-1-02 · [User Journey ONB-1](../../../02-design/01-prototypes/user-journeys.md#onb-1--กรอกข้อมูลส่วนตัวเพื่อคำนวณเป้าหมายแคลอรี่-req-01) · prototype [01-onboarding-personal-info.html](../../../02-design/01-prototypes/v1/01-onboarding-personal-info.html) |

### TC-ONB-1-004 — กรอกค่าที่ไม่ถูกต้อง (น้ำหนักติดลบ + อายุเกินช่วง) ไม่ให้ไปขั้นตอนถัดไป

| Field | รายละเอียด |
|---|---|
| Test ID | TC-ONB-1-004 |
| Test Case Name | กรอกน้ำหนักติดลบและอายุเกินช่วงที่สมเหตุสมผล ระบบบล็อกไม่ให้คำนวณ TDEE |
| Pre-condition | ผู้ใช้ใหม่อยู่ที่หน้า `01-onboarding-personal-info.html` |
| Test Steps | 1. กรอกอายุ = 150 ปี (เกินช่วง 10–100 ปี)<br>2. เลือกเพศ = ชาย<br>3. กรอกน้ำหนัก = −10 กก. (ติดลบ)<br>4. กรอกส่วนสูง = 175 ซม.<br>5. เลือกระดับกิจกรรม = ปานกลาง<br>6. กดปุ่มถัดไป |
| Expected Result | ระบบแสดงข้อความ error ใต้ฟิลด์อายุ ("กรุณากรอกอายุระหว่าง 10–100 ปี") และใต้ฟิลด์น้ำหนัก ("กรุณากรอกน้ำหนักระหว่าง 20–250 กก. (ห้ามติดลบ)") ไม่คำนวณ TDEE และไม่พาไปหน้าเลือกอุปกรณ์ |
| Test Data | อายุ 150 (นอกช่วง 10–100), เพศ ชาย, น้ำหนัก −10 กก. (ติดลบ, นอกช่วง 20–250), ส่วนสูง 175 ซม., กิจกรรมระดับปานกลาง |
| References | REQ-01 · AC-ONB-1-02 · [User Journey ONB-1](../../../02-design/01-prototypes/user-journeys.md#onb-1--กรอกข้อมูลส่วนตัวเพื่อคำนวณเป้าหมายแคลอรี่-req-01) · prototype [01-onboarding-personal-info.html](../../../02-design/01-prototypes/v1/01-onboarding-personal-info.html) |

### TC-ONB-1-005 — แก้ไขน้ำหนักภายหลัง คำนวณ TDEE ใหม่ทันที

| Field | รายละเอียด |
|---|---|
| Test ID | TC-ONB-1-005 |
| Test Case Name | ผู้ใช้แก้ไขน้ำหนักผ่านหน้า Settings ภายหลัง onboarding ระบบคำนวณ BMR/TDEE ใหม่ทันที |
| Pre-condition | ผู้ใช้มี TDEE เดิมในโปรไฟล์อยู่แล้วจาก TC-ONB-1-001 (อายุ 30, เพศ ชาย, น้ำหนัก 75 กก., ส่วนสูง 175 ซม., กิจกรรมปานกลาง → TDEE เดิม = 2,633 kcal/วัน) |
| Test Steps | 1. เปิดหน้า Settings/โปรไฟล์<br>2. แก้ไขน้ำหนักจาก 75 กก. เป็น 80 กก. (ส่วนสูง/อายุ/เพศ/กิจกรรมเดิม)<br>3. บันทึกการเปลี่ยนแปลง |
| Expected Result | ระบบคำนวณ BMR ใหม่ = 10×80 + 6.25×175 − 5×30 + 5 = 1,748.75 kcal คูณ Activity Factor 1.55 ได้ **TDEE ใหม่ = 2,711 kcal/วัน** แทนที่ค่าเดิม (2,633 kcal/วัน) ในโปรไฟล์ทันที โดยไม่ต้องผ่าน onboarding ใหม่ |
| Test Data | ก่อนแก้ไข: น้ำหนัก 75 กก. → TDEE เดิม 2,633 kcal/วัน; หลังแก้ไข: น้ำหนัก 80 กก. (อายุ 30, เพศ ชาย, ส่วนสูง 175 ซม., กิจกรรมปานกลางเท่าเดิม) → คาดว่า TDEE ใหม่ = 2,711 kcal/วัน |
| References | REQ-01 · AC-ONB-1-03 · [User Journey ONB-1](../../../02-design/01-prototypes/user-journeys.md#onb-1--กรอกข้อมูลส่วนตัวเพื่อคำนวณเป้าหมายแคลอรี่-req-01) |

---

## ONB-2 — เลือกอุปกรณ์ที่มี (REQ-03)

Journey: [user-journeys.md § ONB-2](../../../02-design/01-prototypes/user-journeys.md#onb-2--เลือกอุปกรณ์ที่มี-req-03) ·
AC: [AC-ONB-2-01](../../../01-requirements/acceptance-criteria.md#ac-onb-2-01--เลือกอุปกรณ์และบันทึกเป็น-filter-req-03),
[AC-ONB-2-02](../../../01-requirements/acceptance-criteria.md#ac-onb-2-02--เลือก-ไม่มีอุปกรณ์-กรองเฉพาะวิดีโอ-bodyweight-req-03),
[AC-ONB-2-03](../../../01-requirements/acceptance-criteria.md#ac-onb-2-03--เปลี่ยนอุปกรณ์ภายหลัง-filter-อัปเดตทันที-req-03)

> AC-ONB-2-01 มี 2 test case (เลือกอุปกรณ์เดียว / เลือกหลายอุปกรณ์พร้อมกัน) เพราะ prototype
> (`02-onboarding-equipment.html`) ระบุชัดว่า "เลือกได้มากกว่า 1 อย่าง" — เป็น variation ที่มีผลต่อ
> ค่าที่บันทึกจริงในโปรไฟล์ ไม่ใช่แค่ข้อมูลซ้ำ

### TC-ONB-2-001 — เลือกอุปกรณ์เดียว (ดัมเบล) บันทึกเป็น filter

| Field | รายละเอียด |
|---|---|
| Test ID | TC-ONB-2-001 |
| Test Case Name | เลือกอุปกรณ์ "ดัมเบล" เพียงอย่างเดียว บันทึกเป็นโปรไฟล์อุปกรณ์ |
| Pre-condition | ผู้ใช้ผ่าน ONB-1 แล้ว (มี TDEE ในโปรไฟล์ เช่น จาก TC-ONB-1-001) และมาถึงหน้า `02-onboarding-equipment.html` |
| Test Steps | 1. เปิดหน้าเลือกอุปกรณ์<br>2. แตะ chip "ดัมเบล" ให้ active<br>3. กดยืนยัน/ถัดไป |
| Expected Result | ระบบบันทึกโปรไฟล์อุปกรณ์ = [ดัมเบล] และใช้เป็น filter ทุกครั้งที่เอนจิ้นแนะนำวิดีโอ (REC-1) ทำงานในอนาคต |
| Test Data | อุปกรณ์ที่เลือก = ดัมเบล (`dumbbell`) รายการเดียว |
| References | REQ-03 · AC-ONB-2-01 · [User Journey ONB-2](../../../02-design/01-prototypes/user-journeys.md#onb-2--เลือกอุปกรณ์ที่มี-req-03) · prototype [02-onboarding-equipment.html](../../../02-design/01-prototypes/v1/02-onboarding-equipment.html) |

### TC-ONB-2-002 — เลือกหลายอุปกรณ์พร้อมกัน (ดัมเบล + ยิมครบชุด) บันทึกเป็น filter

| Field | รายละเอียด |
|---|---|
| Test ID | TC-ONB-2-002 |
| Test Case Name | เลือกอุปกรณ์มากกว่า 1 อย่างพร้อมกัน บันทึกครบทุกรายการที่เลือก |
| Pre-condition | ผู้ใช้ผ่าน ONB-1 แล้ว (มี TDEE ในโปรไฟล์) และมาถึงหน้า `02-onboarding-equipment.html` |
| Test Steps | 1. เปิดหน้าเลือกอุปกรณ์<br>2. แตะ chip "ดัมเบล" ให้ active<br>3. แตะ chip "ยิมครบชุด" ให้ active เพิ่ม (ไม่ยกเลิกดัมเบล)<br>4. กดยืนยัน/ถัดไป |
| Expected Result | ระบบบันทึกโปรไฟล์อุปกรณ์ = [ดัมเบล, ยิมครบชุด] ทั้ง 2 รายการ และใช้เป็น filter (union ของทั้งสองอุปกรณ์) ทุกครั้งที่ REC-1 ทำงานในอนาคต |
| Test Data | อุปกรณ์ที่เลือก = ดัมเบล (`dumbbell`) + ยิมครบชุด (`full_gym`) พร้อมกัน 2 รายการ |
| References | REQ-03 · AC-ONB-2-01 · [User Journey ONB-2](../../../02-design/01-prototypes/user-journeys.md#onb-2--เลือกอุปกรณ์ที่มี-req-03) · prototype [02-onboarding-equipment.html](../../../02-design/01-prototypes/v1/02-onboarding-equipment.html) |

### TC-ONB-2-003 — เลือก "ไม่มีอุปกรณ์" กรองเฉพาะวิดีโอ bodyweight

| Field | รายละเอียด |
|---|---|
| Test ID | TC-ONB-2-003 |
| Test Case Name | เลือก "ไม่มีอุปกรณ์" ระบบจำกัด filter ให้เหลือเฉพาะวิดีโอประเภท bodyweight |
| Pre-condition | ผู้ใช้ผ่าน ONB-1 แล้ว (มี TDEE ในโปรไฟล์) และมาถึงหน้า `02-onboarding-equipment.html` |
| Test Steps | 1. เปิดหน้าเลือกอุปกรณ์<br>2. แตะ chip "ไม่มีอุปกรณ์" ให้ active<br>3. กดยืนยัน/ถัดไป |
| Expected Result | ระบบบันทึกโปรไฟล์อุปกรณ์ = [ไม่มีอุปกรณ์] และวิดีโอที่แนะนำใน REC-1 ทั้งหมดในอนาคตถูกกรองให้เหลือเฉพาะประเภท bodyweight เท่านั้น (ไม่รวมวิดีโอที่ต้องใช้ดัมเบล/อุปกรณ์ยิม) |
| Test Data | อุปกรณ์ที่เลือก = ไม่มีอุปกรณ์ (`none`) |
| References | REQ-03 · AC-ONB-2-02 · [User Journey ONB-2](../../../02-design/01-prototypes/user-journeys.md#onb-2--เลือกอุปกรณ์ที่มี-req-03) · prototype [02-onboarding-equipment.html](../../../02-design/01-prototypes/v1/02-onboarding-equipment.html) |

### TC-ONB-2-004 — เปลี่ยนอุปกรณ์ภายหลังผ่านหน้า Settings filter อัปเดตทันที

| Field | รายละเอียด |
|---|---|
| Test ID | TC-ONB-2-004 |
| Test Case Name | ผู้ใช้เพิ่มอุปกรณ์ใหม่ผ่านหน้า Settings ภายหลัง onboarding filter การแนะนำวิดีโอครั้งถัดไปอัปเดตทันที |
| Pre-condition | ผู้ใช้มีโปรไฟล์อุปกรณ์เดิม = [ไม่มีอุปกรณ์] บันทึกอยู่แล้วจาก onboarding (เช่นจาก TC-ONB-2-003) |
| Test Steps | 1. เปิดหน้า Settings<br>2. ไปที่ส่วนอุปกรณ์<br>3. แตะ chip "ดัมเบล" เพิ่ม (ซื้อดัมเบลเพิ่ม)<br>4. บันทึกการเปลี่ยนแปลง<br>5. เปิดหน้า Daily Dashboard เพื่อดูวิดีโอที่แนะนำครั้งถัดไป |
| Expected Result | โปรไฟล์อุปกรณ์อัปเดตเป็น [ไม่มีอุปกรณ์, ดัมเบล] ทันที และการค้นหาวิดีโอแนะนำครั้งถัดไปใน REC-1 ใช้ filter ใหม่นี้ทันที (รวมวิดีโอที่ใช้ดัมเบลได้แล้ว) โดยไม่ต้องรอรอบถัดไปหรือ re-onboarding |
| Test Data | อุปกรณ์เดิม = [ไม่มีอุปกรณ์] → อุปกรณ์ใหม่หลังแก้ไข = [ไม่มีอุปกรณ์, ดัมเบล] |
| References | REQ-03 · AC-ONB-2-03 · [User Journey ONB-2](../../../02-design/01-prototypes/user-journeys.md#onb-2--เลือกอุปกรณ์ที่มี-req-03) |

---

## ONB-3 — ตั้งเป้าหมายหลัก (deficit/surplus คงที่ + safety floor) (REQ-02)

Journey: [user-journeys.md § ONB-3](../../../02-design/01-prototypes/user-journeys.md#onb-3--ตั้งเป้าหมายหลัก-req-02) ·
AC: [AC-ONB-3-01](../../../01-requirements/acceptance-criteria.md#ac-onb-3-01--เลือกเป้าหมายหลัก-ระบบแปลงเป็นค่าแคลอรี่เป้าหมายที่ชัดเจน-req-02),
[AC-ONB-3-02](../../../01-requirements/acceptance-criteria.md#ac-onb-3-02--เปลี่ยนเป้าหมายหลักภายหลัง-คำนวณใหม่ทันที-req-02),
[AC-ONB-3-03](../../../01-requirements/acceptance-criteria.md#ac-onb-3-03--tdee-ต่ำมากจนต่ำกว่า-safety-floor-ถูกปรับขึ้นเสมอ-req-02)

> AC-ONB-3-01 มี 3 test case — หนึ่งรายการต่อเป้าหมาย (ลดน้ำหนัก/กระชับสัดส่วน/เพิ่มความอึด) เพราะแต่ละ
> เป้าหมายผูกกับค่าคงที่ที่ต่างกัน (−500 / +0 / +300) ซึ่งเป็น business rule หลักของ REQ-02 ที่ต้องตรวจสอบ
> แยกกันให้ครบทั้ง 3 ทาง ไม่ใช่แค่ตรวจ 1 เส้นทางแล้วสรุปว่าครอบคลุม
> ทั้ง 5 test case ของ ONB-3 ใช้ TDEE ต่อเนื่องมาจาก TC-ONB-1-001 (2,633 kcal/วัน) ยกเว้น TC-ONB-3-005
> ที่ต้องใช้ TDEE ต่ำเป็นพิเศษเพื่อทดสอบ safety floor โดยเฉพาะ

### TC-ONB-3-001 — เลือกเป้าหมาย "ลดน้ำหนัก" แปลงเป็น TDEE − 500

| Field | รายละเอียด |
|---|---|
| Test ID | TC-ONB-3-001 |
| Test Case Name | เลือกเป้าหมาย "ลดน้ำหนัก" ระบบแปลงเป็นค่าแคลอรี่เป้าหมาย TDEE − 500 |
| Pre-condition | ผู้ใช้ผ่าน ONB-1 แล้ว มี TDEE = 2,633 kcal/วัน ในโปรไฟล์ (จาก TC-ONB-1-001) และมาถึงหน้า `03-onboarding-goal-select.html` |
| Test Steps | 1. เปิดหน้าเลือกเป้าหมายหลัก<br>2. เลือก "ลดน้ำหนัก" (`lose`)<br>3. กดยืนยัน |
| Expected Result | ระบบคำนวณ Target = TDEE − 500 = 2,633 − 500 = **2,133 kcal/วัน** ค่านี้สูงกว่า safety floor (1,200 kcal/วัน) จึงไม่ถูกปรับ บันทึกเป็นเป้าหมายแคลอรี่รายวัน และ onboarding เสร็จสมบูรณ์ |
| Test Data | TDEE = 2,633 kcal/วัน, เป้าหมาย = ลดน้ำหนัก (delta −500) → คาดว่าเป้าหมายแคลอรี่รายวัน = 2,133 kcal/วัน |
| References | REQ-02 · AC-ONB-3-01 · [User Journey ONB-3](../../../02-design/01-prototypes/user-journeys.md#onb-3--ตั้งเป้าหมายหลัก-req-02) · prototype [04-onboarding-goal-confirm.html](../../../02-design/01-prototypes/v1/04-onboarding-goal-confirm.html) |

### TC-ONB-3-002 — เลือกเป้าหมาย "กระชับสัดส่วน" แปลงเป็น TDEE + 0 (maintenance)

| Field | รายละเอียด |
|---|---|
| Test ID | TC-ONB-3-002 |
| Test Case Name | เลือกเป้าหมาย "กระชับสัดส่วน" ระบบแปลงเป็นค่าแคลอรี่เป้าหมายเท่ากับ TDEE (maintenance) |
| Pre-condition | ผู้ใช้ผ่าน ONB-1 แล้ว มี TDEE = 2,633 kcal/วัน ในโปรไฟล์ และมาถึงหน้า `03-onboarding-goal-select.html` |
| Test Steps | 1. เปิดหน้าเลือกเป้าหมายหลัก<br>2. เลือก "กระชับสัดส่วน" (`maintain`)<br>3. กดยืนยัน |
| Expected Result | ระบบคำนวณ Target = TDEE + 0 = 2,633 + 0 = **2,633 kcal/วัน** สูงกว่า safety floor จึงไม่ถูกปรับ บันทึกเป็นเป้าหมายแคลอรี่รายวัน และ onboarding เสร็จสมบูรณ์ |
| Test Data | TDEE = 2,633 kcal/วัน, เป้าหมาย = กระชับสัดส่วน (delta +0) → คาดว่าเป้าหมายแคลอรี่รายวัน = 2,633 kcal/วัน |
| References | REQ-02 · AC-ONB-3-01 · [User Journey ONB-3](../../../02-design/01-prototypes/user-journeys.md#onb-3--ตั้งเป้าหมายหลัก-req-02) · prototype [04-onboarding-goal-confirm.html](../../../02-design/01-prototypes/v1/04-onboarding-goal-confirm.html) |

### TC-ONB-3-003 — เลือกเป้าหมาย "เพิ่มความอึด" แปลงเป็น TDEE + 300

| Field | รายละเอียด |
|---|---|
| Test ID | TC-ONB-3-003 |
| Test Case Name | เลือกเป้าหมาย "เพิ่มความอึด" ระบบแปลงเป็นค่าแคลอรี่เป้าหมาย TDEE + 300 |
| Pre-condition | ผู้ใช้ผ่าน ONB-1 แล้ว มี TDEE = 2,633 kcal/วัน ในโปรไฟล์ และมาถึงหน้า `03-onboarding-goal-select.html` |
| Test Steps | 1. เปิดหน้าเลือกเป้าหมายหลัก<br>2. เลือก "เพิ่มความอึด" (`endurance`)<br>3. กดยืนยัน |
| Expected Result | ระบบคำนวณ Target = TDEE + 300 = 2,633 + 300 = **2,933 kcal/วัน** สูงกว่า safety floor จึงไม่ถูกปรับ บันทึกเป็นเป้าหมายแคลอรี่รายวัน และ onboarding เสร็จสมบูรณ์ |
| Test Data | TDEE = 2,633 kcal/วัน, เป้าหมาย = เพิ่มความอึด (delta +300) → คาดว่าเป้าหมายแคลอรี่รายวัน = 2,933 kcal/วัน |
| References | REQ-02 · AC-ONB-3-01 · [User Journey ONB-3](../../../02-design/01-prototypes/user-journeys.md#onb-3--ตั้งเป้าหมายหลัก-req-02) · prototype [04-onboarding-goal-confirm.html](../../../02-design/01-prototypes/v1/04-onboarding-goal-confirm.html) |

### TC-ONB-3-004 — เปลี่ยนเป้าหมายหลักภายหลัง คำนวณเป้าหมายแคลอรี่ใหม่ทันที

| Field | รายละเอียด |
|---|---|
| Test ID | TC-ONB-3-004 |
| Test Case Name | ผู้ใช้เปลี่ยนเป้าหมายหลักจาก "ลดน้ำหนัก" เป็น "เพิ่มความอึด" ระบบคำนวณเป้าหมายแคลอรี่ใหม่ทันที |
| Pre-condition | ผู้ใช้มีเป้าหมายแคลอรี่รายวันบันทึกไว้แล้ว = 2,133 kcal/วัน จากเป้าหมาย "ลดน้ำหนัก" (จาก TC-ONB-3-001, TDEE ยังคงเป็น 2,633 kcal/วัน) |
| Test Steps | 1. เปิดหน้าตั้งค่าเป้าหมายหลัก (Settings หรือหน้าเลือกเป้าหมาย)<br>2. เปลี่ยนเป้าหมายจาก "ลดน้ำหนัก" เป็น "เพิ่มความอึด" (`endurance`)<br>3. ยืนยันการเปลี่ยนแปลง |
| Expected Result | ระบบคำนวณเป้าหมายแคลอรี่รายวันใหม่ทันทีด้วยสูตรค่าคงที่เดิมของ REQ-02: Target = TDEE + 300 = 2,633 + 300 = **2,933 kcal/วัน** แทนที่ค่าเดิม (2,133 kcal/วัน) โดยไม่ต้องคำนวณ TDEE ใหม่ |
| Test Data | TDEE = 2,633 kcal/วัน (ไม่เปลี่ยน), เป้าหมายเดิม = ลดน้ำหนัก (2,133 kcal/วัน) → เป้าหมายใหม่ = เพิ่มความอึด (คาดว่า 2,933 kcal/วัน) |
| References | REQ-02 · AC-ONB-3-02 · [User Journey ONB-3](../../../02-design/01-prototypes/user-journeys.md#onb-3--ตั้งเป้าหมายหลัก-req-02) · prototype [03-onboarding-goal-select.html](../../../02-design/01-prototypes/v1/03-onboarding-goal-select.html) |

### TC-ONB-3-005 — TDEE ต่ำมากจนแม้เลือก "เพิ่มความอึด" ยังต่ำกว่า safety floor ถูกปรับขึ้นเป็น floor

| Field | รายละเอียด |
|---|---|
| Test ID | TC-ONB-3-005 |
| Test Case Name | ผู้ใช้ตัวเล็ก + กิจกรรมต่ำ ทำให้ TDEE ต่ำมาก แม้เลือกเป้าหมาย "เพิ่มความอึด" (TDEE + 300) ผลลัพธ์ยังต่ำกว่า safety floor ระบบต้องปรับขึ้นเป็น floor เสมอ |
| Pre-condition | ผู้ใช้ผ่าน ONB-1 แล้ว ด้วยข้อมูลที่ทำให้ TDEE ต่ำมาก: อายุ 70 ปี, เพศ หญิง, น้ำหนัก 32 กก., ส่วนสูง 135 ซม., กิจกรรมระดับ sedentary (1.2) → BMR = 10×32 + 6.25×135 − 5×70 − 161 = 652.75 kcal → TDEE = 652.75 × 1.2 = **783 kcal/วัน** และมาถึงหน้า `03-onboarding-goal-select.html` |
| Test Steps | 1. เปิดหน้าเลือกเป้าหมายหลัก<br>2. เลือก "เพิ่มความอึด" (`endurance`) — เป้าหมายที่ให้ค่าบวกมากที่สุดในบรรดา 3 ทางเลือก<br>3. กดยืนยัน |
| Expected Result | ระบบคำนวณ Target ดิบ = TDEE + 300 = 783 + 300 = 1,083 kcal/วัน ซึ่ง**ต่ำกว่า safety floor (1,200 kcal/วัน)** ระบบจึงปรับเป้าหมายแคลอรี่รายวันขึ้นเป็น **1,200 kcal/วัน** (ค่า floor) แทนค่าที่คำนวณได้ ไม่ปล่อยให้ต่ำกว่าเกณฑ์ แม้จะเลือกเป้าหมายที่ให้แคลอรี่สูงสุดแล้วก็ตาม |
| Test Data | อายุ 70, เพศ หญิง, น้ำหนัก 32 กก., ส่วนสูง 135 ซม., กิจกรรม sedentary → TDEE = 783 kcal/วัน; เป้าหมาย = เพิ่มความอึด (TDEE + 300 = 1,083 kcal/วัน ดิบ) → คาดว่าเป้าหมายแคลอรี่รายวันสุดท้ายหลังปรับ = 1,200 kcal/วัน (safety floor) |
| References | REQ-02 · AC-ONB-3-03 · [User Journey ONB-3](../../../02-design/01-prototypes/user-journeys.md#onb-3--ตั้งเป้าหมายหลัก-req-02) · prototype [04-onboarding-goal-confirm.html](../../../02-design/01-prototypes/v1/04-onboarding-goal-confirm.html) |

---

## สรุปจำนวน Test Case ต่อ AC Scenario

| Feature ID | AC Scenario | จำนวน Test Case | Test ID |
|---|---|---|---|
| ONB-1 | AC-ONB-1-01 | 2 (variation: ชาย/หญิง) | TC-ONB-1-001, TC-ONB-1-002 |
| ONB-1 | AC-ONB-1-02 | 2 (variation: ข้อมูลไม่ครบ/ไม่ถูกต้อง) | TC-ONB-1-003, TC-ONB-1-004 |
| ONB-1 | AC-ONB-1-03 | 1 | TC-ONB-1-005 |
| ONB-2 | AC-ONB-2-01 | 2 (variation: เลือก 1 / เลือกหลายอุปกรณ์) | TC-ONB-2-001, TC-ONB-2-002 |
| ONB-2 | AC-ONB-2-02 | 1 | TC-ONB-2-003 |
| ONB-2 | AC-ONB-2-03 | 1 | TC-ONB-2-004 |
| ONB-3 | AC-ONB-3-01 | 3 (variation: ลด/กระชับ/เพิ่มความอึด) | TC-ONB-3-001, TC-ONB-3-002, TC-ONB-3-003 |
| ONB-3 | AC-ONB-3-02 | 1 | TC-ONB-3-004 |
| ONB-3 | AC-ONB-3-03 | 1 | TC-ONB-3-005 |
| **รวม** | **9 AC scenario** | **14 test case** | TC-ONB-1-001 … TC-ONB-3-005 |

ครบทุก AC scenario ของ ONB-1/ONB-2/ONB-3 ตาม
[acceptance-criteria.md § Epic 1](../../../01-requirements/acceptance-criteria.md#epic-1-onboarding--personalization)
(9/9 scenario มี test case อย่างน้อย 1 รายการ) — ไม่มี gap ที่ต้องข้าม เพราะ ONB-1/ONB-2/ONB-3 ไม่มี
"หมายเหตุ" ระบุ Alt/Edge Case ที่ยังไม่ถูกนิยามพฤติกรรมชัดเจนใน acceptance-criteria.md (ต่างจาก REC-1,
REC-4, PLN-1, INT-2, INT-3 ที่มี gap ดังกล่าว)

---

## หมายเหตุ / Content Decisions ที่ไม่ได้ระบุตรง ๆ ในเอกสารต้นทาง

1. **Activity Factor ต่อระดับกิจกรรม (5 ระดับ)** — ไม่มีเอกสารต้นทางใดระบุค่าตัวคูณจริง ใช้ค่ามาตรฐานที่
   ผูกกับสูตร Mifflin-St Jeor ทั่วไป (sedentary=1.2, light=1.375, moderate=1.55, active=1.725,
   very_active=1.9) เพื่อให้ผลคำนวณใน Expected Result ตรวจสอบได้จริง — ต้องยืนยันกับทีมผลิตภัณฑ์/
   engineering ก่อนใช้เป็นฐานของการ implement จริง ถ้าค่าจริงต่างจากนี้ ต้องแก้ Test Data ของ
   TC-ONB-1-001, TC-ONB-1-002, TC-ONB-1-005 และ TDEE ต้นทางที่ TC-ONB-3-001 ถึง TC-ONB-3-005 อ้างอิงต่อ
2. **ค่า safety floor ที่แน่นอน (ภายในช่วง 1,200–1,500 kcal/วัน)** — REQ-02 ยืนยันเฉพาะช่วง ไม่ได้ปักหมุด
   ตัวเลขเดียว ใช้ 1,200 kcal/วัน (ขอบล่างของช่วง ตรงกับตัวอย่างใน prototype
   `04-onboarding-goal-confirm.html`) เป็นค่าที่ใช้ใน TC-ONB-3-005 — ถ้าค่าจริงต่างจากนี้ (เช่น 1,500)
   ต้องแก้ Test Data/Expected Result ของ TC-ONB-3-005
3. ตัวเลขอายุ/น้ำหนัก/ส่วนสูง default และช่วง min–max (อายุ 10–100, น้ำหนัก 20–250 กก., ส่วนสูง
   100–220 ซม.) นำมาจาก input constraints จริงใน prototype `01-onboarding-personal-info.html`
   ไม่ใช่ค่าที่ประดิษฐ์ขึ้นเอง

---

อ้างอิงต้นฉบับ: [acceptance-criteria.md](../../../01-requirements/acceptance-criteria.md) ·
[backlog.md](../../../01-requirements/backlog.md) ·
[01-spec/20260823-01-onboarding-personalization.md](../../../01-requirements/01-spec/20260823-01-onboarding-personalization.md) ·
[user-journeys.md](../../../02-design/01-prototypes/user-journeys.md) ·
[test-plan.md](../test-plan.md)
