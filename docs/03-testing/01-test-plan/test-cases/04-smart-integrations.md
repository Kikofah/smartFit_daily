# Test Cases: Smart Integrations (INT-1, INT-2, INT-3)

- **ประเภทเอกสาร:** Test Cases (ต่อ Epic — ไฟล์นี้ครอบคลุมเฉพาะ Epic 4: Smart Integrations)
- **สถานะเอกสาร:** Draft
- **วันที่สร้าง:** 2026-08-27
- **สร้างโดย:** skill `test-suite-builder`

เอกสารนี้ให้ step-by-step test case ของทุก Feature ใน Epic 4 (Smart Integrations: **INT-1, INT-2, INT-3**)
สร้างจาก [acceptance-criteria.md](../../../01-requirements/acceptance-criteria.md) (Epic 4 section — AC-INT-1-01
ถึง AC-INT-3-03, อัปเดต 2026-08-29 ด้วย AC-INT-1-04/AC-INT-3-03 จาก NFR-13/NFR-12) ร่วมกับ [backlog.md](../../../01-requirements/backlog.md#int-1--พยากรณ์วันถึงเป้าหมายน้ำหนัก)
(คำอธิบาย feature), [01-spec/20260823-04-smart-integrations.md](../../../01-requirements/01-spec/20260823-04-smart-integrations.md)
(REQ-11/12/13 และค่าคงที่ 7,700 kcal ≈ 1 กก.), และ
[user-journeys.md](../../../02-design/01-prototypes/user-journeys.md#epic-4-smart-integrations) (flow/Alt-Edge
Case) — ตาม methodology ของ `test-suite-builder` เอกสารทั้งสี่นี้เป็น read-only upstream ไฟล์นี้ไม่แก้ไข

> **หมายเหตุขอบเขต**: ตาม [test-plan.md §1](../test-plan.md#1-ขอบเขต-scope) Epic 4 ทั้งหมดเป็น MoSCoW
> **Could** และ**อยู่นอกขอบเขตการ execute ของรอบทดสอบปัจจุบัน** (ยังไม่ถูก implement จริง) — ไฟล์นี้เตรียม
> test case ไว้ล่วงหน้าตามที่ scope ของ `test-suite-builder` กำหนด (default = full backlog coverage)
> เพื่อให้พร้อมใช้ execute ทันทีเมื่อ Epic 4 ถูกหยิบขึ้นมา implement จริง

**ตัวอย่างหน้าจอที่เกี่ยวข้อง** (prototype `v1`):
[10-progress-insights.html](../../../02-design/01-prototypes/v1/10-progress-insights.html) (INT-1),
[11-device-integrations.html](../../../02-design/01-prototypes/v1/11-device-integrations.html) (INT-2/INT-3
รายการอุปกรณ์),
[12-device-pairing.html](../../../02-design/01-prototypes/v1/12-device-pairing.html) (INT-2/INT-3
flow การจับคู่/fallback)

รูปแบบ ID: `TC-{FeatureID}-{3-digit}` เช่น `TC-INT-1-001`

## Persona ทดสอบร่วม (ใช้ตลอดทั้งไฟล์เพื่อความสอดคล้องของข้อมูล)

ผู้ใช้ประจำที่ผ่าน onboarding แล้ว: อายุ 30 ปี เพศชาย ส่วนสูง 170 ซม. น้ำหนักปัจจุบัน (ก่อนซิงค์) 80.0 กก.
Activity Factor 1.55 (ตัวอย่างระดับกิจกรรมปานกลาง) → TDEE เดิม = 10×80 + 6.25×170 − 5×30 + 5 = 1,717.5 BMR
× 1.55 = **2,662 kcal/วัน** เป้าหมายหลัก = ลดน้ำหนัก (ONB-3: TDEE − 500) → เป้าหมายแคลอรี่รายวัน =
**2,162 kcal/วัน** เป้าหมายน้ำหนัก = 75.0 กก.

---

## สารบัญ

- [INT-1 — พยากรณ์วันถึงเป้าหมายน้ำหนัก](#int-1--พยากรณ์วันถึงเป้าหมายน้ำหนัก) — TC-INT-1-001 ถึง 005
- [INT-2 — ซิงค์ตาชั่งอัจฉริยะ](#int-2--ซิงค์ตาชั่งอัจฉริยะ) — TC-INT-2-001 ถึง 002
- [INT-3 — ซิงค์ข้อมูล Wearable](#int-3--ซิงค์ข้อมูล-wearable) — TC-INT-3-001 ถึง 003

---

## INT-1 — พยากรณ์วันถึงเป้าหมายน้ำหนัก

REQ-11 · Spec: [01-spec/20260823-04-smart-integrations.md](../../../01-requirements/01-spec/20260823-04-smart-integrations.md) ·
AC: [acceptance-criteria.md#int-1--พยากรณ์วันถึงเป้าหมายน้ำหนัก](../../../01-requirements/acceptance-criteria.md#int-1--พยากรณ์วันถึงเป้าหมายน้ำหนัก) ·
Journey: [user-journeys.md#int-1--พยากรณ์วันถึงเป้าหมายน้ำหนัก-req-11](../../../02-design/01-prototypes/user-journeys.md#int-1--พยากรณ์วันถึงเป้าหมายน้ำหนัก-req-11)

### TC-INT-1-001 — เห็นวันที่คาดว่าจะถึงเป้าหมายน้ำหนัก (คำนวณจากอัตราขาดดุลเฉลี่ยจริง)

- **Pre-condition**: ผู้ใช้ (persona ด้านบน) มีเป้าหมายน้ำหนัก 75.0 กก. บันทึกไว้ (จาก ONB-3) และมีประวัติ
  log แคลอรี่จริงสะสมจาก PLN-3 เพียงพอ โดยอัตราขาดดุลเฉลี่ยที่คำนวณได้จาก log ไม่เป็น 0 และสอดคล้องกับ
  ทิศทางเป้าหมาย (ลดน้ำหนัก)
- **Test Steps**:
  1. เปิดแอปและไปที่แท็บ "ความคืบหน้า" (Progress/Insights)
  2. สังเกตค่าที่แสดงในการ์ดพยากรณ์ (forecast card)
- **Expected Result**: ระบบแสดงวันที่คาดว่าจะถึงเป้าหมายน้ำหนัก โดยคำนวณตามสูตร: น้ำหนักที่ต้องลด =
  80.0 − 75.0 = 5.0 กก. → แคลอรี่รวมที่ต้องขาดดุล = 5.0 × 7,700 = 38,500 kcal → จำนวนวัน = 38,500 ÷ 500
  (อัตราขาดดุลเฉลี่ย/วัน) = **77 วัน** จากวันที่เปิดหน้า (ถ้าเปิดหน้าวันที่ 27 ส.ค. 2569 → วันที่คาดการณ์ที่
  แสดง = **12 พ.ย. 2569**) พร้อมแสดงอัตราขาดดุลเฉลี่ยและน้ำหนักปัจจุบันประกอบ
- **Test Data**: น้ำหนักปัจจุบัน 80.0 กก. เป้าหมาย 75.0 กก. อัตราขาดดุลเฉลี่ยจาก log จริงย้อนหลัง =
  500 kcal/วัน (ตรงกับเป้าหมายแคลอรี่รายวัน TDEE−500 พอดี) วันที่เปิดหน้าอ้างอิง = 27 ส.ค. 2569
- **References**: REQ-11 · AC-INT-1-01 · [user-journeys.md#int-1--พยากรณ์วันถึงเป้าหมายน้ำหนัก-req-11](../../../02-design/01-prototypes/user-journeys.md#int-1--พยากรณ์วันถึงเป้าหมายน้ำหนัก-req-11) ·
  [10-progress-insights.html](../../../02-design/01-prototypes/v1/10-progress-insights.html) (สถานะ `forecastState`)

### TC-INT-1-002 — ประวัติ log ไม่เพียงพอ แสดง empty state แทนวันที่พยากรณ์

- **Pre-condition**: ผู้ใช้เพิ่งผ่าน onboarding และตั้งเป้าหมายน้ำหนัก 75.0 กก. แต่ยังมีประวัติ log แคลอรี่
  จริงสะสมน้อยมาก (เช่น เพิ่งเริ่มใช้แอป 1 วัน)
- **Test Steps**:
  1. เปิดแอปและไปที่แท็บ "ความคืบหน้า"
  2. สังเกตเนื้อหาที่แสดงแทนการ์ดพยากรณ์
- **Expected Result**: ระบบไม่แสดงวันที่คาดการณ์ใด ๆ แต่แสดง empty state ที่มีข้อความทั่วไปว่ายังพยากรณ์
  ไม่ได้และต้องสะสมข้อมูลเพิ่ม (เช่น "ยังต้องบันทึกผลอีกสักระยะก่อนเริ่มพยากรณ์ได้") พร้อมปุ่มพาไปบันทึกผล —
  **ทดสอบเฉพาะว่า empty state ปรากฏและไม่มีวันที่ปลอมแสดงขึ้นมา ไม่ทดสอบจำนวนวันขั้นต่ำที่แน่นอน** เพราะ
  เกณฑ์ตัวเลขยังเป็น Open Question ที่ยังไม่ resolve (ดูหมายเหตุท้ายไฟล์)
- **Test Data**: เป้าหมายน้ำหนัก 75.0 กก. จำนวนวันที่มี log จริง = 1 วัน (ตัวอย่างกรณี "ข้อมูลยังไม่พอ"
  อย่างชัดเจน ไม่ใช่ค่าขอบเขต/threshold ที่แน่นอน)
- **References**: REQ-11 · AC-INT-1-02 · [user-journeys.md#int-1--พยากรณ์วันถึงเป้าหมายน้ำหนัก-req-11](../../../02-design/01-prototypes/user-journeys.md#int-1--พยากรณ์วันถึงเป้าหมายน้ำหนัก-req-11) ·
  [10-progress-insights.html](../../../02-design/01-prototypes/v1/10-progress-insights.html) (สถานะ `insufficientState`,
  demo toggle "ตัวอย่าง: ข้อมูลยังไม่พอ")

### TC-INT-1-003 — อัตราขาดดุลเฉลี่ยเป็น 0 แสดงข้อความแจ้งเตือนแทนวันที่

- **Pre-condition**: ผู้ใช้มีเป้าหมายน้ำหนัก 75.0 กก. และมีประวัติ log เพียงพอ แต่พฤติกรรมการกินจริงในช่วง
  ที่ผ่านมาทำให้อัตราขาดดุลเฉลี่ยที่คำนวณได้เท่ากับ 0
- **Test Steps**:
  1. เปิดแอปและไปที่แท็บ "ความคืบหน้า"
  2. สังเกตเนื้อหาที่แสดงแทนการ์ดพยากรณ์
- **Expected Result**: ระบบไม่แสดงวันที่คาดการณ์ (เพราะหารด้วยอัตรา 0 คำนวณวันไม่ได้จริง) แต่แสดงข้อความ
  แจ้งเตือนแทน (เช่น แจ้งว่ายังไม่สามารถพยากรณ์ได้จากอัตราการเปลี่ยนแปลงปัจจุบัน)
- **Test Data**: น้ำหนักปัจจุบัน 80.0 กก. เป้าหมาย 75.0 กก. อัตราขาดดุลเฉลี่ยจาก log จริงย้อนหลัง 14 วัน =
  **0 kcal/วัน**
- **References**: REQ-11 · AC-INT-1-03 (variation 1/2 — ดูหมายเหตุ Test Data variation ใน References ของ
  TC-INT-1-004 ด้วย) · [user-journeys.md#int-1--พยากรณ์วันถึงเป้าหมายน้ำหนัก-req-11](../../../02-design/01-prototypes/user-journeys.md#int-1--พยากรณ์วันถึงเป้าหมายน้ำหนัก-req-11) ·
  [10-progress-insights.html](../../../02-design/01-prototypes/v1/10-progress-insights.html)

### TC-INT-1-004 — อัตราขาดดุลเฉลี่ยสวนทางเป้าหมาย แสดงข้อความแจ้งเตือนแทนวันที่

- **Pre-condition**: ผู้ใช้มีเป้าหมายน้ำหนัก 75.0 กก. (ทิศทาง = ลดน้ำหนัก) และมีประวัติ log เพียงพอ แต่ log
  จริงย้อนหลังกลับแสดงว่าผู้ใช้กินเกิน (surplus) เฉลี่ยต่อวัน สวนทางกับทิศทางเป้าหมาย
- **Test Steps**:
  1. เปิดแอปและไปที่แท็บ "ความคืบหน้า"
  2. สังเกตเนื้อหาที่แสดงแทนการ์ดพยากรณ์
- **Expected Result**: ระบบไม่แสดงวันที่คาดการณ์ (เพราะทิศทางที่คำนวณได้สวนทางกับเป้าหมาย น้ำหนักจะห่าง
  เป้าหมายมากขึ้นไม่ใช่เข้าใกล้) แต่แสดงข้อความแจ้งเตือนแทน
- **Test Data**: น้ำหนักปัจจุบัน 80.0 กก. เป้าหมาย 75.0 กก. (ทิศทาง = ลด) แต่อัตราเฉลี่ยจาก log จริงย้อนหลัง
  14 วัน = **ส่วนเกิน (surplus) +150 kcal/วัน** (สวนทางเป้าหมายลดน้ำหนัก)
- **References**: REQ-11 · AC-INT-1-03 (variation 2/2 — TC-INT-1-003 และ TC-INT-1-004 ครอบคลุมทั้งสองกรณี
  ย่อยของ AC-INT-1-03: "เป็น 0" และ "สวนทางเป้าหมาย") ·
  [user-journeys.md#int-1--พยากรณ์วันถึงเป้าหมายน้ำหนัก-req-11](../../../02-design/01-prototypes/user-journeys.md#int-1--พยากรณ์วันถึงเป้าหมายน้ำหนัก-req-11) ·
  [10-progress-insights.html](../../../02-design/01-prototypes/v1/10-progress-insights.html)

### TC-INT-1-005 — กราฟแนวโน้มน้ำหนัก/แคลอรี่ใช้ earth-tone palette ไม่ใช้ red/green traffic-light (NFR-13)

> **หมายเหตุ scope**: เช่นเดียวกับ test case อื่นของ Epic 4 — test case นี้ **ยัง execute ไม่ได้ในรอบ
> ทดสอบปัจจุบัน** เพราะ INT-1 อยู่นอกขอบเขต execution (Could ตาม [test-plan.md
> §1](../test-plan.md#1-ขอบเขต-scope)) แม้เนื้อหา NFR-13 เองจะตรวจสอบได้ทันทีจาก prototype โดยไม่ต้องรอ
> backend ก็ตาม — เตรียมไว้ล่วงหน้าให้พร้อม execute เมื่อ Epic 4 เข้า scope

- **Pre-condition**: ผู้ใช้ (persona ด้านบน) เปิดหน้า Progress/Insights ที่มีกราฟแนวโน้มน้ำหนักแสดงอยู่
  เตรียมข้อมูลทดสอบ 2 ชุด: (a) แนวโน้มน้ำหนักลดลง และ (b) แนวโน้มน้ำหนักเพิ่มขึ้น (เช่น หลัง Cheat Day
  ต่อเนื่อง) เพื่อยืนยันว่าสีกราฟไม่เปลี่ยนตามทิศทางของตัวเลข
- **Test Steps**:
  1. เปิดหน้า Progress/Insights (prototype `10-progress-insights.html`) ด้วยชุดข้อมูล (a) แนวโน้มลดลง
  2. ตรวจสอบสีของเส้นข้อมูลจริงและเส้น/พื้นที่เป้าหมายในกราฟ
  3. สลับไปใช้ชุดข้อมูล (b) แนวโน้มเพิ่มขึ้น แล้วตรวจสอบสีของกราฟอีกครั้ง
- **Expected Result**: ทั้งสองชุดข้อมูล กราฟใช้สีเดียวกันเสมอ — เส้นข้อมูลจริงใช้ `--color-clay` เส้น/
  พื้นที่เป้าหมายใช้ `--color-sage` แบบจาง (opacity ~30%) ไม่มีการเปลี่ยนไปใช้สีแดง (red) เมื่อน้ำหนักเพิ่ม
  ขึ้น หรือสีเขียว (green) เมื่อน้ำหนักลดลง ตรงตามที่ [DESIGN.md
  §4.4](../../../02-design/01-prototypes/DESIGN.md) กำหนด
- **Test Data**: ชุด (a) แนวโน้มลดลง: น้ำหนัก 80.0 → 79.2 → 78.5 กก.; ชุด (b) แนวโน้มเพิ่มขึ้น: น้ำหนัก
  78.5 → 79.0 → 79.4 กก. — คาดหวังสีกราฟเดียวกัน (`--color-clay`/`--color-sage`) ในทั้งสองชุด
- **References**: REQ-11, NFR-13 · AC-INT-1-04 · [DESIGN.md §4.4](../../../02-design/01-prototypes/DESIGN.md) ·
  [10-progress-insights.html](../../../02-design/01-prototypes/v1/10-progress-insights.html) — ไม่มีลิงก์
  user-journeys.md เพราะ scenario นี้มาจาก NFR-13 ไม่ใช่ Alt/Edge Case ของ journey (ดูหมายเหตุใต้
  AC-INT-1-04 ใน acceptance-criteria.md)

---

## INT-2 — ซิงค์ตาชั่งอัจฉริยะ

REQ-12 · Spec: [01-spec/20260823-04-smart-integrations.md](../../../01-requirements/01-spec/20260823-04-smart-integrations.md) ·
AC: [acceptance-criteria.md#int-2--ซิงค์ตาชั่งอัจฉริยะ](../../../01-requirements/acceptance-criteria.md#int-2--ซิงค์ตาชั่งอัจฉริยะ) ·
Journey: [user-journeys.md#int-2--ซิงค์ตาชั่งอัจฉริยะ-req-12](../../../02-design/01-prototypes/user-journeys.md#int-2--ซิงค์ตาชั่งอัจฉริยะ-req-12)

### TC-INT-2-001 — จับคู่ตาชั่งสำเร็จ ซิงค์น้ำหนัก/องค์ประกอบร่างกายอัตโนมัติ และคำนวณ TDEE ใหม่

- **Pre-condition**: ผู้ใช้ (persona ด้านบน, น้ำหนักในโปรไฟล์ปัจจุบัน 80.0 กก., TDEE เดิม 2,662 kcal/วัน)
  อยู่ที่หน้าโปรไฟล์ และมีตาชั่งอัจฉริยะที่รองรับ Bluetooth
- **Test Steps**:
  1. ที่หน้าโปรไฟล์ ในส่วน "อุปกรณ์ที่เชื่อมต่อ" กดปุ่ม "เชื่อมต่อ" ที่แถว "ตาชั่งอัจฉริยะ"
  2. รอสถานะ "กำลังเชื่อมต่อ..." จนขึ้นสถานะ "เชื่อมต่อตาชั่งอัจฉริยะสำเร็จ"
  3. กลับไปหน้าโปรไฟล์ — ตาชั่งอยู่ในสถานะจับคู่แล้ว
  4. ผู้ใช้ขึ้นชั่งน้ำหนักบนตาชั่งที่จับคู่ไว้ ตาชั่งส่งค่าน้ำหนัก 79.2 กก. และเปอร์เซ็นต์ไขมัน 24.5% ผ่าน
     Bluetooth มาที่แอปโดยอัตโนมัติ
  5. เปิดหน้าโปรไฟล์/หน้าตั้งค่าข้อมูลส่วนตัว ตรวจสอบค่าน้ำหนักที่บันทึกไว้
- **Expected Result**: น้ำหนักในโปรไฟล์อัปเดตเป็น 79.2 กก. และองค์ประกอบร่างกาย (ไขมัน 24.5%) ถูกบันทึก
  โดยผู้ใช้ไม่ต้องกรอกเอง ระบบคำนวณ TDEE ใหม่ทันทีตามสูตร Mifflin-St Jeor (ONB-1): BMR ใหม่ =
  10×79.2 + 6.25×170 − 5×30 + 5 = 1,709.5 → TDEE ใหม่ = 1,709.5 × 1.55 = **2,650 kcal/วัน** (ลดลงจาก
  2,662 kcal/วัน เดิม) ค่านี้ถูกใช้เป็น baseline ต่อให้ REC-2 (คำนวณแคลอรี่เผาผลาญ) และ INT-1 (พยากรณ์)
  ในครั้งถัดไป
- **Test Data**: น้ำหนักก่อนซิงค์ 80.0 กก. → น้ำหนักหลังซิงค์จากตาชั่ง 79.2 กก., ไขมัน 24.5%, TDEE เดิม
  2,662 kcal/วัน → TDEE ใหม่ 2,650 kcal/วัน
- **References**: REQ-01, REQ-12 · AC-INT-2-01 (เชื่อมโยงกับ AC-ONB-1-03 เรื่องคำนวณ TDEE ใหม่) ·
  [user-journeys.md#int-2--ซิงค์ตาชั่งอัจฉริยะ-req-12](../../../02-design/01-prototypes/user-journeys.md#int-2--ซิงค์ตาชั่งอัจฉริยะ-req-12) ·
  [12-device-pairing.html?device=scale](../../../02-design/01-prototypes/v1/12-device-pairing.html) (สถานะ
  `successState`), [11-device-integrations.html](../../../02-design/01-prototypes/v1/11-device-integrations.html)

### TC-INT-2-002 — เชื่อมต่อตาชั่งไม่สำเร็จ fallback ให้กรอกน้ำหนักเอง

- **Pre-condition**: ผู้ใช้พยายามจับคู่/ซิงค์ตาชั่งอัจฉริยะ แต่การเชื่อมต่อ Bluetooth ขาดหายระหว่างทาง
- **Test Steps**:
  1. ที่หน้าโปรไฟล์ กดปุ่ม "เชื่อมต่อ" ที่แถว "ตาชั่งอัจฉริยะ"
  2. ระบบพยายามเชื่อมต่อแต่ล้มเหลว (Bluetooth timeout)
  3. สังเกตหน้าจอที่แสดงหลังเชื่อมต่อไม่สำเร็จ
  4. กรอกน้ำหนักด้วยตนเองในฟอร์มที่ปรากฏ แล้วกดบันทึก
- **Expected Result**: ระบบแสดงสถานะ "เชื่อมต่อตาชั่งอัจฉริยะไม่สำเร็จ" พร้อมตกกลับ (fallback) ไปยังฟอร์ม
  กรอกน้ำหนักด้วยตนเอง (stepper input) แทนการซิงค์อัตโนมัติ เมื่อผู้ใช้กรอกและบันทึก ค่าน้ำหนักที่กรอกเอง
  ถูกบันทึกลงโปรไฟล์เหมือนกับกรณีซิงค์อัตโนมัติสำเร็จ (นำไปคำนวณ TDEE ใหม่ต่อได้เช่นเดียวกับ TC-INT-2-001)
- **Test Data**: น้ำหนักที่กรอกเอง = 79.5 กก. (ปรับผ่านปุ่ม +/− ทีละ 0.1 กก. จากค่าตั้งต้นในฟอร์ม)
- **References**: REQ-12 · AC-INT-2-02 · [user-journeys.md#int-2--ซิงค์ตาชั่งอัจฉริยะ-req-12](../../../02-design/01-prototypes/user-journeys.md#int-2--ซิงค์ตาชั่งอัจฉริยะ-req-12) ·
  [12-device-pairing.html?device=scale](../../../02-design/01-prototypes/v1/12-device-pairing.html) (สถานะ
  `failureState` → `scaleFallbackForm`)

---

## INT-3 — ซิงค์ข้อมูล Wearable

REQ-13 · Spec: [01-spec/20260823-04-smart-integrations.md](../../../01-requirements/01-spec/20260823-04-smart-integrations.md) ·
AC: [acceptance-criteria.md#int-3--ซิงค์ข้อมูล-wearable](../../../01-requirements/acceptance-criteria.md#int-3--ซิงค์ข้อมูล-wearable) ·
Journey: [user-journeys.md#int-3--ซิงค์ข้อมูล-wearable-req-13](../../../02-design/01-prototypes/user-journeys.md#int-3--ซิงค์ข้อมูล-wearable-req-13)

### TC-INT-3-001 — มีข้อมูลจาก wearable ใช้แทนค่าประมาณจากสูตร MET

- **Pre-condition**: ผู้ใช้ (น้ำหนักหลังซิงค์จาก TC-INT-2-001 = 79.2 กก.) เชื่อมต่อ Wearable (เช่น Apple
  Watch) ผ่าน Apple Health สำเร็จแล้ว และกำลังเล่นวิดีโอออกกำลังกายประเภทคาร์ดิโอ ความเข้มข้นสูง
- **Test Steps**:
  1. เริ่มออกกำลังกายตามวิดีโอที่แนะนำ (REC-1) โดย wearable กำลังบันทึกอัตราการเต้นหัวใจอยู่
  2. ออกกำลังกายจนจบ/หยุดวิดีโอ ที่เวลาทำจริง 45 นาที
  3. Wearable ส่งค่าแคลอรี่ที่เผาผลาญจริง (จากอัตราการเต้นหัวใจ) มาที่แอป
  4. เปิดหน้าสรุปผลหลังออกกำลังกาย (workout result)
- **Expected Result**: ระบบใช้ค่าจาก wearable แทนค่าประมาณจากสูตร MET ในการบันทึกแคลอรี่ของเซสชันนี้ —
  ค่าประมาณจากสูตร MET ที่จะได้ถ้าไม่มี wearable = MET(8, คาร์ดิโอ/สูง) × 79.2 กก. × 0.75 ชม. =
  **475 kcal** แต่ค่าที่บันทึกจริงในหน้าสรุปผลและ log คือค่าจาก wearable = **520 kcal** (ไม่ใช่ 475)
  พร้อม label แหล่งที่มาว่า "จากข้อมูล wearable"
- **Test Data**: น้ำหนัก 79.2 กก., ประเภทคาร์ดิโอ, ความเข้มข้นสูง (MET ตัวอย่าง = 8), เวลาที่ทำจริง 45 นาที
  (0.75 ชม.) → ค่าประมาณ MET = 475 kcal, ค่าจาก wearable ที่ใช้จริง = 520 kcal
- **References**: REQ-05, REQ-13 · AC-INT-3-01 (เชื่อมโยงกับ AC-REC-2-03) ·
  [user-journeys.md#int-3--ซิงค์ข้อมูล-wearable-req-13](../../../02-design/01-prototypes/user-journeys.md#int-3--ซิงค์ข้อมูล-wearable-req-13) ·
  [07-workout-result.html](../../../02-design/01-prototypes/v1/07-workout-result.html) (สถานะ "จากข้อมูล
  wearable"), [11-device-integrations.html](../../../02-design/01-prototypes/v1/11-device-integrations.html)

### TC-INT-3-002 — Wearable ไม่ได้เชื่อมต่อ/ข้อมูลไม่ครบ ใช้ค่าประมาณจากสูตร MET แทนชั่วคราว

- **Pre-condition**: ผู้ใช้ (น้ำหนัก 79.2 กก.) กำลังออกกำลังกายวิดีโอประเภทคาร์ดิโอ ความเข้มข้นสูงเช่นเดียว
  กับ TC-INT-3-001 แต่ครั้งนี้ไม่ได้เชื่อมต่อ wearable (หรือข้อมูลจาก wearable มาไม่ครบ/ล่าช้า)
- **Test Steps**:
  1. เริ่มออกกำลังกายตามวิดีโอที่แนะนำ โดยไม่มี wearable เชื่อมต่ออยู่
  2. ออกกำลังกายจนจบ/หยุดวิดีโอ ที่เวลาทำจริง 45 นาที
  3. เปิดหน้าสรุปผลหลังออกกำลังกาย
- **Expected Result**: ระบบใช้ค่าประมาณจากสูตร MET (REC-2) แทนชั่วคราว: kcal = MET(8) × 79.2 กก. ×
  0.75 ชม. = **475 kcal** พร้อม label แหล่งที่มาว่า "ประมาณจากสูตร MET" ค่านี้ถูกใช้ต่อในการบันทึก log
  (PLN-3) จนกว่าจะมีข้อมูล wearable ที่สมบูรณ์
- **Test Data**: น้ำหนัก 79.2 กก., ประเภทคาร์ดิโอ, ความเข้มข้นสูง (MET ตัวอย่าง = 8), เวลาที่ทำจริง 45
  นาที (0.75 ชม.) → ค่าที่บันทึกจริง = 475 kcal (ไม่มี wearable ให้เทียบ)
- **References**: REQ-05, REQ-13 · AC-INT-3-02 (เชื่อมโยงกับ AC-REC-2-01) ·
  [user-journeys.md#int-3--ซิงค์ข้อมูล-wearable-req-13](../../../02-design/01-prototypes/user-journeys.md#int-3--ซิงค์ข้อมูล-wearable-req-13) ·
  [07-workout-result.html](../../../02-design/01-prototypes/v1/07-workout-result.html) (สถานะ "ประมาณจาก
  สูตร MET")

### TC-INT-3-003 — ส่ง sessionId ที่ไม่มีอยู่จริงมากับ wearable reading ระบบต้อง reject ก่อนเขียนข้อมูล (NFR-12)

> **หมายเหตุ testability**: เช่นเดียวกับ TC-REC-2-005 — ตาม [test-plan.md §4 Risk
> R12](../test-plan.md#4-risk-management) test case นี้ **ยัง execute ไม่ได้ในรอบนี้** เพราะต้องการ
> backend/Cloud Function จริงที่ยังไม่มีในโปรเจกต์ (นอกจากนี้ INT-3 เองก็อยู่นอกขอบเขต execution อยู่แล้ว
> เพราะเป็น Epic 4/Could) — เตรียมไว้ล่วงหน้าตามหลักฐานใน database-schema.md §8.3

- **Pre-condition**: ผู้ใช้เชื่อมต่อ wearable สำเร็จแล้ว (INT-3) แต่ wearable device ส่งค่าแคลอรี่มาพร้อม
  `sessionId` ที่ไม่ตรงกับ Workout Session ใดของผู้ใช้ในระบบ เช่น session ถูกลบไปแล้วหรือหมดอายุ
  (ตัวอย่าง `sessionId` = `"sess_x9y8z7"`)
- **Test Steps**:
  1. Wearable ส่งค่าแคลอรี่ที่เผาผลาญ (เช่น 300 kcal) มาที่ `POST /integrations/wearable/readings`
     พร้อม `sessionId` = `"sess_x9y8z7"`
  2. สังเกต response ของ endpoint
  3. ตรวจสอบว่ามี Wearable Reading ใหม่ถูกบันทึกจากคำขอนี้หรือไม่
  4. ตรวจสอบว่า workout result ของ session จริง (ถ้ามี) ยังใช้ค่าประมาณจากสูตร MET ตามปกติหรือไม่
- **Expected Result**: ระบบตรวจสอบว่า session ปลายทางมีอยู่จริงและเป็นของผู้ใช้คนเดียวกันก่อนเขียน
  Wearable Reading เสมอ (referential existence validation ตาม NFR-12 — ดู database-schema.md §8.3 ที่
  ยกตัวอย่าง `sessionId` ใน endpoint นี้ไว้ตรง) พบว่าไม่มีอยู่จริง จึงปฏิเสธคำขอ ไม่บันทึก Wearable
  Reading ใด ๆ และค่าที่ใช้แทนค่าประมาณ MET ของ session ที่แท้จริงจึงไม่ถูกเปลี่ยนแปลงจากคำขอนี้
- **Test Data**: `sessionId` ทดสอบ = `"sess_x9y8z7"` (ไม่มีอยู่จริง), ค่าแคลอรี่จาก wearable ที่ส่งมา =
  300 kcal (ค่าตัวอย่าง ไม่มีผลต่อผลลัพธ์เพราะคำขอถูก reject)
- **References**: REQ-13, NFR-12 · AC-INT-3-03 ·
  [database-schema.md §8.3](../../../02-design/02-technical/database-schema.md#83-fk--constraint-enforcement-migration-ย้ายจาก-schema-level-ไป-cloud-function) ·
  [api-spec.md §3.7](../../../02-design/02-technical/api-spec.md) — ไม่มีลิงก์ user-journeys.md เพราะ
  scenario นี้เป็นระดับ API/backend validation ไม่ใช่ Alt/Edge Case ของ journey (ดูหมายเหตุใต้
  AC-INT-3-03 ใน acceptance-criteria.md)

---

## หมายเหตุ: Gap ที่ยังไม่มี test case (Open Question ที่ยังไม่ resolve)

ตาม methodology ของ `test-suite-builder` — gap ที่เกิดจาก upstream (spec/journey) ยังไม่นิยามพฤติกรรม
ชัดเจน จะไม่ถูก invent เป็น test case ในไฟล์นี้:

- **INT-2**: กรณี "มีค่าน้ำหนักหลายค่าในวันเดียว (ชั่งหลายรอบ) ใช้ค่าล่าสุดหรือค่าเฉลี่ยของวันนั้น" —
  ยังไม่ระบุใน [01-spec/20260823-04-smart-integrations.md § จุดที่ยังไม่ได้ระบุ](../../../01-requirements/01-spec/20260823-04-smart-integrations.md#จุดที่ยังไม่ได้ระบุ--ควรยืนยันเพิ่มเติม)
  และ [user-journeys.md Open Questions ข้อ 5](../../../02-design/01-prototypes/user-journeys.md#open-questions)
  — ไม่มี AC scenario รองรับเช่นกัน (ดูหมายเหตุใต้ AC-INT-2-02 ใน acceptance-criteria.md)
- **INT-3**: กรณี "ค่าจาก wearable กับค่าประมาณจากสูตร MET ต่างกันมาก" — ยังไม่ระบุวิธีจัดการความขัดแย้ง
  ในเอกสารเดียวกัน — ไม่มี AC scenario รองรับเช่นกัน (ดูหมายเหตุใต้ AC-INT-3-02 ใน acceptance-criteria.md)

ทั้งสองจุดตรงกับ Risk R5 ใน [test-plan.md §4 Risk Management](../test-plan.md#4-risk-management) ซึ่งระบุไว้
แล้วว่า "เขียนได้เฉพาะ happy-path (ไม่มีข้อมูลชนกัน) ระหว่างที่ยังไม่ resolve" — ไฟล์นี้ปฏิบัติตามข้อนั้น

---

## สรุปจำนวน Test Case ต่อ Feature และการ map กับ AC

| Feature ID | AC ที่ครอบคลุม | Test Case ที่ map | หมายเหตุ |
|---|---|---|---|
| INT-1 | AC-INT-1-01 | TC-INT-1-001 | 1:1 |
| INT-1 | AC-INT-1-02 | TC-INT-1-002 | 1:1 |
| INT-1 | AC-INT-1-03 | TC-INT-1-003, TC-INT-1-004 | 1 AC → 2 TC (variation: ขาดดุล = 0 / ขาดดุลสวนทางเป้าหมาย) |
| INT-1 | AC-INT-1-04 (ใหม่, NFR-13, เพิ่ม 2026-08-29) | TC-INT-1-005 | 1:1 — "not testable in this round" (Epic 4/Could, ดู test-plan.md §1) |
| INT-2 | AC-INT-2-01 | TC-INT-2-001 | 1:1 |
| INT-2 | AC-INT-2-02 | TC-INT-2-002 | 1:1 |
| INT-3 | AC-INT-3-01 | TC-INT-3-001 | 1:1 |
| INT-3 | AC-INT-3-02 | TC-INT-3-002 | 1:1 |
| INT-3 | AC-INT-3-03 (ใหม่, NFR-12, เพิ่ม 2026-08-29) | TC-INT-3-003 | 1:1 — "not testable in this round" (ดู test-plan.md R12) |
| **รวม** | **9 AC scenario** (ครบทุก AC ของ INT-1/2/3 ใน acceptance-criteria.md) | **10 test case** | |

---

อ้างอิงต้นฉบับ: [acceptance-criteria.md](../../../01-requirements/acceptance-criteria.md) ·
[backlog.md](../../../01-requirements/backlog.md) ·
[01-spec/20260823-04-smart-integrations.md](../../../01-requirements/01-spec/20260823-04-smart-integrations.md) ·
[user-journeys.md](../../../02-design/01-prototypes/user-journeys.md) ·
[test-plan.md](../test-plan.md) · [prototype v1](../../../02-design/01-prototypes/v1/README.md)
