# Acceptance Criteria — smartFit_daily

เอกสารนี้แจกแจง Acceptance Criteria แบบ **Given-When-Then** ของทุก Feature ใน
[backlog.md](backlog.md) (14 Feature ID ครบทุก Epic) โดยยึด **Success State** เป็น happy-path
scenario และ **Alt/Edge Cases** ที่มีอยู่แล้วใน
[user-journeys.md](../02-design/01-prototypes/user-journeys.md) เป็น scenario เพิ่มเติมต่อ feature —
ไม่มีการสร้าง edge case ใหม่ที่ไม่มีอยู่ใน journey เดิม (จุดที่ journey ทิ้งไว้เป็น Open Question โดยไม่มี
พฤติกรรมที่นิยามชัดเจน จะไม่ถูกแปลงเป็น scenario ในไฟล์นี้ — ดูหมายเหตุท้ายแต่ละ feature ที่เกี่ยวข้อง)

ต้นทาง: [01-spec/](01-spec/index.md) · [backlog.md](backlog.md) ·
[user-journeys.md](../02-design/01-prototypes/user-journeys.md) ·
ดูตัวอย่างหน้าจอที่เกี่ยวข้องได้ที่ [prototype v1](../02-design/01-prototypes/v1/README.md)

รูปแบบ ID: `AC-{FeatureID}-{2-digit}` เช่น `AC-ONB-1-01` แต่ละ scenario ระบุ `REQ-xx` ที่เกี่ยวข้องไว้ใน
หัวข้อเสมอ

---

## สารบัญ

- [Epic 1: Onboarding & Personalization](#epic-1-onboarding--personalization) — ONB-1, ONB-2, ONB-3
- [Epic 2: Daily YouTube Recommendation](#epic-2-daily-youtube-recommendation) — REC-1, REC-2, REC-3, REC-4
- [Epic 3: Planner & Logging](#epic-3-planner--logging) — PLN-1, PLN-2, PLN-3, PLN-4
- [Epic 4: Smart Integrations](#epic-4-smart-integrations) — INT-1, INT-2, INT-3

---

## Epic 1: Onboarding & Personalization

Spec: [01-spec/20260823-01-onboarding-personalization.md](01-spec/20260823-01-onboarding-personalization.md)

### ONB-1 — กรอกข้อมูลส่วนตัวเพื่อคำนวณเป้าหมายแคลอรี่

#### AC-ONB-1-01 — กรอกข้อมูลครบและถูกต้อง คำนวณ TDEE สำเร็จ (REQ-01)
- **Given**: ผู้ใช้ใหม่อยู่ที่ขั้นตอน onboarding ยังไม่มี TDEE ในโปรไฟล์
- **When**: ผู้ใช้กรอกอายุ เพศ น้ำหนัก ส่วนสูง และเลือกระดับกิจกรรมครบถ้วนถูกต้อง แล้วกดถัดไป
- **Then**: ระบบคำนวณ BMR ด้วยสูตร Mifflin-St Jeor คูณด้วย Activity Factor ได้ TDEE บันทึกลงโปรไฟล์
  แล้วพาไปขั้นตอนเลือกอุปกรณ์ (ONB-2)
- Prototype: [01-onboarding-personal-info.html](../02-design/01-prototypes/v1/01-onboarding-personal-info.html)

#### AC-ONB-1-02 — กรอกข้อมูลไม่ครบหรือไม่ถูกต้อง (REQ-01)
- **Given**: ผู้ใช้ใหม่อยู่ที่ขั้นตอนกรอกข้อมูลส่วนตัว
- **When**: ผู้ใช้กรอกข้อมูลไม่ครบ หรือกรอกค่าที่ไม่ถูกต้อง (เช่น ค่าติดลบ หรือเกินช่วงที่สมเหตุสมผล) แล้วกดถัดไป
- **Then**: ระบบไม่คำนวณ TDEE และไม่ให้ไปขั้นตอนถัดไป จนกว่าผู้ใช้จะแก้ไขข้อมูลให้ครบและถูกต้อง
- Prototype: [01-onboarding-personal-info.html](../02-design/01-prototypes/v1/01-onboarding-personal-info.html)

#### AC-ONB-1-03 — แก้ไขน้ำหนัก/ส่วนสูงภายหลัง ต้องคำนวณ TDEE ใหม่ (REQ-01)
- **Given**: ผู้ใช้มี TDEE อยู่ในโปรไฟล์แล้วจากการทำ onboarding ครั้งก่อน
- **When**: ผู้ใช้แก้ไขน้ำหนักหรือส่วนสูงภายหลัง (เช่น ผ่านหน้าตั้งค่าโปรไฟล์ หรือค่าที่ซิงค์มาจากตาชั่งอัจฉริยะ
  INT-2)
- **Then**: ระบบคำนวณ BMR/TDEE ใหม่ทันทีด้วยค่าล่าสุด แทนที่ค่าเดิมในโปรไฟล์

---

### ONB-2 — เลือกอุปกรณ์ที่มี

#### AC-ONB-2-01 — เลือกอุปกรณ์และบันทึกเป็น filter (REQ-03)
- **Given**: ผู้ใช้ผ่าน ONB-1 แล้ว (มี TDEE) และมาถึงขั้นตอนเลือกอุปกรณ์
- **When**: ผู้ใช้เลือกอุปกรณ์ที่มี (ไม่มีอุปกรณ์ / ดัมเบล / ยิมครบชุด) แล้วยืนยัน
- **Then**: ระบบบันทึกโปรไฟล์อุปกรณ์ และใช้เป็น filter ทุกครั้งที่เอนจิ้นแนะนำวิดีโอ (REC-1) ทำงานในอนาคต
- Prototype: [02-onboarding-equipment.html](../02-design/01-prototypes/v1/02-onboarding-equipment.html)

#### AC-ONB-2-02 — เลือก "ไม่มีอุปกรณ์" กรองเฉพาะวิดีโอ bodyweight (REQ-03)
- **Given**: ผู้ใช้อยู่ที่ขั้นตอนเลือกอุปกรณ์
- **When**: ผู้ใช้เลือก "ไม่มีอุปกรณ์"
- **Then**: ระบบกรองวิดีโอที่แนะนำเฉพาะประเภท bodyweight เท่านั้น
- Prototype: [02-onboarding-equipment.html](../02-design/01-prototypes/v1/02-onboarding-equipment.html)

#### AC-ONB-2-03 — เปลี่ยนอุปกรณ์ภายหลัง filter อัปเดตทันที (REQ-03)
- **Given**: ผู้ใช้มีโปรไฟล์อุปกรณ์เดิมบันทึกอยู่แล้ว
- **When**: ผู้ใช้เปลี่ยนอุปกรณ์ภายหลัง (เช่น ซื้อดัมเบลเพิ่ม) ผ่านหน้า Settings
- **Then**: filter ที่ใช้ในการแนะนำวิดีโอครั้งถัดไปอัปเดตตามอุปกรณ์ใหม่ทันที

---

### ONB-3 — ตั้งเป้าหมายหลัก (deficit/surplus คงที่ + safety floor)

#### AC-ONB-3-01 — เลือกเป้าหมายหลัก ระบบแปลงเป็นค่าแคลอรี่เป้าหมายที่ชัดเจน (REQ-02)
- **Given**: ผู้ใช้ผ่าน ONB-1 แล้ว (มี TDEE) และ TDEE ที่ได้เมื่อลบ/บวกค่าคงที่ของเป้าหมายแล้วไม่ต่ำกว่า
  safety floor (1,200–1,500 kcal/วัน)
- **When**: ผู้ใช้เลือกเป้าหมายหลัก 1 ใน 3 แบบ (ลดน้ำหนัก / กระชับสัดส่วน / เพิ่มความอึด) แล้วยืนยัน
- **Then**: ระบบแปลงเป้าหมายเป็นค่าคงที่ตายตัว (ลดน้ำหนัก = TDEE − 500, กระชับสัดส่วน = TDEE + 0,
  เพิ่มความอึด = TDEE + 300 kcal/วัน) บันทึกเป็นเป้าหมายแคลอรี่รายวัน และ onboarding เสร็จสมบูรณ์
- Prototype: [04-onboarding-goal-confirm.html](../02-design/01-prototypes/v1/04-onboarding-goal-confirm.html)

#### AC-ONB-3-02 — เปลี่ยนเป้าหมายหลักภายหลัง คำนวณใหม่ทันที (REQ-02)
- **Given**: ผู้ใช้มีเป้าหมายแคลอรี่รายวันบันทึกไว้แล้วจากเป้าหมายหลักเดิม
- **When**: ผู้ใช้เปลี่ยนเป้าหมายหลัก (เช่น จากลดน้ำหนักเป็นเพิ่มความอึด)
- **Then**: ระบบคำนวณเป้าหมายแคลอรี่รายวันใหม่ทันทีด้วยสูตรค่าคงที่เดิม (ตาม mapping ในเป้าหมายใหม่)
- Prototype: [03-onboarding-goal-select.html](../02-design/01-prototypes/v1/03-onboarding-goal-select.html)

#### AC-ONB-3-03 — TDEE ต่ำมากจนต่ำกว่า safety floor ถูกปรับขึ้นเสมอ (REQ-02)
- **Given**: ผู้ใช้มี TDEE ต่ำมาก (เช่น น้ำหนักตัวน้อย + ระดับกิจกรรมต่ำ) จนแม้เลือกเป้าหมาย "เพิ่มความอึด"
  (TDEE + 300) ผลลัพธ์ยังต่ำกว่า safety floor (1,200–1,500 kcal/วัน)
- **When**: ผู้ใช้เลือกเป้าหมายหลักและยืนยัน
- **Then**: ระบบปรับเป้าหมายแคลอรี่รายวันขึ้นเป็นค่า safety floor แทนค่าที่คำนวณได้ ไม่ปล่อยให้ต่ำกว่าเกณฑ์
- Prototype: [04-onboarding-goal-confirm.html](../02-design/01-prototypes/v1/04-onboarding-goal-confirm.html)

---

## Epic 2: Daily YouTube Recommendation

Spec: [01-spec/20260823-02-daily-youtube-recommendation.md](01-spec/20260823-02-daily-youtube-recommendation.md)

### REC-1 — แนะนำวิดีโอตรงเป้าแคลอรี่รายวัน

#### AC-REC-1-01 — เห็นวิดีโอแนะนำตรงเป้าแคลอรี่ กรองด้วยอุปกรณ์ (REQ-04)
- **Given**: ผู้ใช้มีเป้าหมายแคลอรี่รายวัน (ONB-3) และโปรไฟล์อุปกรณ์ (ONB-2) แล้ว วันนี้ไม่ใช่ Cheat/Rest Day
- **When**: ผู้ใช้เปิดหน้า Daily Dashboard
- **Then**: ระบบดึงเป้าหมายแคลอรี่ของวันนี้ filter วิดีโอด้วยอุปกรณ์ที่มี และแสดงวิดีโอที่แนะนำอย่างน้อย 1
  รายการที่คาดว่าเผาผลาญแคลอรี่ใกล้เคียงเป้าหมายที่สุด
- Prototype: [05-daily-dashboard.html](../02-design/01-prototypes/v1/05-daily-dashboard.html)

#### AC-REC-1-02 — ไม่มีวิดีโอตรงเป้า ระบบขยายเกณฑ์การค้นหา (REQ-04)
- **Given**: ผู้ใช้เปิดหน้า Daily Dashboard และมีเป้าหมายแคลอรี่ของวันนี้แล้ว
- **When**: ไม่มีวิดีโอในคลังที่ตรงกับอุปกรณ์ + แคลอรี่เป้าหมายพอดี
- **Then**: ระบบขยายเกณฑ์การค้นหา (ผ่อนช่วงแคลอรี่) แล้วจับคู่วิดีโอใหม่อีกครั้ง
- Prototype: [05-daily-dashboard.html](../02-design/01-prototypes/v1/05-daily-dashboard.html)

#### AC-REC-1-03 — วันนี้เป็น Cheat Day/Rest Day ไม่แนะนำวิดีโอ (REQ-04)
- **Given**: ผู้ใช้เปิดหน้า Daily Dashboard
- **When**: วันนี้ถูกตั้งเป็น Cheat Day หรือ Rest Day (PLN-2)
- **Then**: ระบบไม่แนะนำวิดีโอสำหรับวันนี้ (ข้ามขั้นตอน REC-1 ทั้งหมด)
- Prototype: [05-daily-dashboard.html](../02-design/01-prototypes/v1/05-daily-dashboard.html)

> หมายเหตุ: journey ของ REC-1 ยังมี Alt/Edge Case ที่ระบุว่า "เกณฑ์ tolerance ที่แน่นอนว่า 'ใกล้เคียง'
> แค่ไหนถึงเรียกว่าตรงเป้า ยังไม่ระบุ" — เป็นพารามิเตอร์ที่ยังไม่ถูกกำหนดค่า ไม่ใช่พฤติกรรมที่นิยามไว้
> จึงไม่แปลงเป็น scenario ในไฟล์นี้ (ดู [Open Questions ของ user-journeys.md](../02-design/01-prototypes/user-journeys.md#open-questions) ข้อ 1)

### REC-2 — คำนวณแคลอรี่เผาผลาญจริง (สูตร MET)

#### AC-REC-2-01 — คำนวณแคลอรี่เผาผลาญจริงด้วยสูตร MET (REQ-05)
- **Given**: ผู้ใช้กำลังเล่นวิดีโอออกกำลังกายที่มี metadata ระยะเวลา ประเภทกิจกรรม และระดับความเข้มข้น
  ครบถ้วน และไม่มีข้อมูลจาก wearable
- **When**: ผู้ใช้จบ/หยุดวิดีโอออกกำลังกาย
- **Then**: ระบบอ่านระยะเวลาที่ทำจริง ค้นหาค่า MET จาก lookup table (ประเภท × ความเข้มข้น) แล้วคำนวณ
  kcal = MET × น้ำหนักตัว(kg) × เวลา(ชม.) และบันทึกค่าแคลอรี่ที่เผาผลาญของเซสชันนั้น
- Prototype: [07-workout-result.html](../02-design/01-prototypes/v1/07-workout-result.html)

#### AC-REC-2-02 — หยุดวิดีโอกลางคัน คำนวณตามเวลาที่ทำจริงเท่านั้น (REQ-05)
- **Given**: ผู้ใช้กำลังเล่นวิดีโอออกกำลังกายอยู่
- **When**: ผู้ใช้หยุดวิดีโอกลางคันก่อนวิดีโอจบ
- **Then**: ระบบคำนวณแคลอรี่เผาผลาญโดยใช้เฉพาะระยะเวลาที่ทำจริงในสูตร MET ไม่ใช่เวลาเต็มของวิดีโอ
- Prototype: [07-workout-result.html](../02-design/01-prototypes/v1/07-workout-result.html)

#### AC-REC-2-03 — มีข้อมูลจาก wearable ใช้ค่านั้นแทนค่าประมาณ MET (REQ-05)
- **Given**: ผู้ใช้กำลังออกกำลังกายและมี wearable เชื่อมต่ออยู่ (INT-3) ที่ส่งข้อมูลแคลอรี่เผาผลาญจริงมา
- **When**: ผู้ใช้จบ/หยุดวิดีโอออกกำลังกาย
- **Then**: ระบบใช้ค่าแคลอรี่จาก wearable แทนค่าประมาณจากสูตร MET ในการบันทึกแคลอรี่เผาผลาญของเซสชันนั้น
- Prototype: [07-workout-result.html](../02-design/01-prototypes/v1/07-workout-result.html)

### REC-3 — เปลี่ยนวิดีโอโดยคงเป้าแคลอรี่เดิม

#### AC-REC-3-01 — กดเปลี่ยนวิดีโอ แคลอรี่เป้าหมายของวันไม่เปลี่ยน (REQ-06)
- **Given**: ผู้ใช้มีวิดีโอที่แนะนำอยู่แล้วจาก REC-1
- **When**: ผู้ใช้กดปุ่ม "เปลี่ยนวิดีโอ"/"ลองวิดีโออื่น"
- **Then**: ระบบเก็บค่าแคลอรี่เป้าหมายของวันไว้คงเดิม ค้นหาวิดีโอใหม่ด้วย filter อุปกรณ์ + แคลอรี่เป้าหมายเดียวกัน
  โดยไม่รวมวิดีโอที่เพิ่งถูกปฏิเสธ แล้วแสดงวิดีโอใหม่แทนที่วิดีโอเดิม
- Prototype: [05-daily-dashboard.html](../02-design/01-prototypes/v1/05-daily-dashboard.html)

#### AC-REC-3-02 — กดเปลี่ยนวิดีโอซ้ำจนไม่เหลือตัวเลือก (REQ-06)
- **Given**: ผู้ใช้กดปุ่ม "เปลี่ยนวิดีโอ" ซ้ำหลายครั้งจนปฏิเสธวิดีโอที่ตรงเงื่อนไขไปเกือบหมด
- **When**: ผู้ใช้กดปุ่ม "เปลี่ยนวิดีโอ" อีกครั้งและไม่เหลือวิดีโอที่ตรงเงื่อนไข (อุปกรณ์ + แคลอรี่เป้าหมาย)
  ที่ยังไม่ถูกปฏิเสธ
- **Then**: ระบบแจ้งผู้ใช้ว่าไม่มีวิดีโออื่นที่ตรงเป้าหมายแล้ว หรือขยายเกณฑ์การค้นหา
- Prototype: [05-daily-dashboard.html](../02-design/01-prototypes/v1/05-daily-dashboard.html)

### REC-4 — วอร์มอัพ–คูลดาวน์อัตโนมัติ

#### AC-REC-4-01 — วิดีโอหลักความเข้มข้นสูง แทรกวอร์มอัพ–คูลดาวน์อัตโนมัติ (REQ-07)
- **Given**: ระบบเลือกวิดีโอหลักให้ผู้ใช้แล้ว (จาก REC-1 หรือ REC-3)
- **When**: วิดีโอหลักที่เลือกมีระดับความเข้มข้น "สูง"
- **Then**: ระบบแทรกวิดีโอวอร์มอัพ 3 นาทีก่อนวิดีโอหลัก และคูลดาวน์ 3 นาทีหลังวิดีโอหลักอัตโนมัติ รวมเป็น
  เซสชันเดียว (วอร์มอัพ → หลัก → คูลดาวน์)
- Prototype: [06-workout-session.html](../02-design/01-prototypes/v1/06-workout-session.html)

#### AC-REC-4-02 — วิดีโอหลักความเข้มข้นต่ำ/ปานกลาง ไม่แทรกวอร์มอัพ–คูลดาวน์ (REQ-07)
- **Given**: ระบบเลือกวิดีโอหลักให้ผู้ใช้แล้ว
- **When**: วิดีโอหลักที่เลือกมีระดับความเข้มข้น "ต่ำ" หรือ "ปานกลาง"
- **Then**: ระบบแสดงวิดีโอหลักตามปกติ โดยไม่แทรกวอร์มอัพ/คูลดาวน์
- Prototype: [06-workout-session.html](../02-design/01-prototypes/v1/06-workout-session.html)

#### AC-REC-4-03 — ผู้ใช้ข้ามวอร์มอัพ/คูลดาวน์เอง นับเฉพาะเวลา/แคลอรี่ที่ทำจริง (REQ-07)
- **Given**: ผู้ใช้อยู่ในเซสชันที่มีวอร์มอัพ/คูลดาวน์แทรกอัตโนมัติ
- **When**: ผู้ใช้ข้ามส่วนวอร์มอัพหรือคูลดาวน์เอง
- **Then**: ระบบยังคงนับเฉพาะเวลาและแคลอรี่ของส่วนที่ทำจริงเท่านั้น (ตามการคำนวณใน REC-2)

> หมายเหตุ: journey ของ REC-4 ยังมี Alt/Edge Case ที่ระบุว่า "เวลา/แคลอรี่ของวอร์มอัพ-คูลดาวน์นับรวมใน
> เป้าหมายรายวันหรือไม่ ยังไม่ระบุ" — เป็นพารามิเตอร์ที่ยังไม่ถูกกำหนดค่า ไม่ใช่พฤติกรรมที่นิยามไว้ จึงไม่
> แปลงเป็น scenario ในไฟล์นี้ (ดู [Open Questions ของ user-journeys.md](../02-design/01-prototypes/user-journeys.md#open-questions) ข้อ 2)

---

## Epic 3: Planner & Logging

Spec: [01-spec/20260823-03-planner-logging.md](01-spec/20260823-03-planner-logging.md)

### PLN-1 — ปฏิทินวางแผนรายสัปดาห์

#### AC-PLN-1-01 — เห็นและกำหนดแผนออกกำลังกายล่วงหน้าเป็นสัปดาห์ (REQ-08)
- **Given**: ผู้ใช้ผ่าน onboarding แล้ว (มีเป้าหมายแคลอรี่รายวัน) และเปิดแท็บ Planner/ปฏิทิน
- **When**: ผู้ใช้เลือกวันในสัปดาห์และกำหนดประเภทกิจกรรมของวันนั้นเอง
- **Then**: ระบบบันทึกประเภทกิจกรรมของวันนั้นลงในแผนรายสัปดาห์ และแสดงผลในปฏิทิน/Daily Dashboard ของวันนั้น
- Prototype: [08-weekly-planner.html](../02-design/01-prototypes/v1/08-weekly-planner.html)

#### AC-PLN-1-02 — ไม่กำหนดแผนล่วงหน้าในบางวัน ใช้ค่า default อัตโนมัติ (REQ-08)
- **Given**: ผู้ใช้เปิดปฏิทินรายสัปดาห์
- **When**: ผู้ใช้ปล่อยวันใดวันหนึ่งไว้โดยไม่กำหนดประเภทกิจกรรมเอง และไม่ตั้งเป็น Cheat/Rest Day
- **Then**: วันนั้นใช้ค่า default คือให้ระบบแนะนำอัตโนมัติตาม REC-1
- Prototype: [08-weekly-planner.html](../02-design/01-prototypes/v1/08-weekly-planner.html)

#### AC-PLN-1-03 — วันที่ผ่านมาแล้วซึ่งมี log อยู่ก่อน เปิดดูได้เฉพาะแบบ read-only (REQ-08)
- **Given**: ผู้ใช้เปิดปฏิทินรายสัปดาห์แบบ fixed calendar week (จันทร์–อาทิตย์) และมีวันที่ผ่านมาแล้วในสัปดาห์
  เดียวกันซึ่งมี log บันทึกไว้ก่อนแล้ว (ไม่ว่าสถานะ log เดิมจะครบเป้าหมายหรือไม่)
- **When**: ผู้ใช้แตะ/เปิดดูวันนั้นในปฏิทิน
- **Then**: ระบบเปิดชีทรายละเอียดของวันนั้นแบบ read-only เท่านั้น ไม่อนุญาตให้แก้ไขประเภทกิจกรรมของวันนั้นผ่าน
  หน้านี้ ส่วนวันนี้และวันในอนาคตของสัปดาห์เดียวกัน (ที่ยังไม่มี log) ยังคงกำหนด/แก้ไขแผนได้ตามปกติ — ตาม
  [decision ที่ resolve แล้ว](01-spec/20260823-03-planner-logging.md#ข้อสมมติฐานการตัดสินใจที่ยืนยันแล้ว)
  เมื่อ 2026-08-27 (เดิมเป็น Open Question ที่ยังไม่ระบุ ปิดแล้ว)
- Prototype: [08-weekly-planner.html](../02-design/01-prototypes/v1/08-weekly-planner.html)

### PLN-2 — โหมด Cheat Day / Rest Day (preserve log, completed wins)

#### AC-PLN-2-01 — ตั้ง Cheat/Rest Day ในวันที่ยังไม่มี log (REQ-09)
- **Given**: วันที่ผู้ใช้เลือกยังไม่มี log บันทึกอยู่
- **When**: ผู้ใช้ตั้งวันนั้นเป็น Cheat Day หรือ Rest Day ผ่านปฏิทิน (PLN-1) หรือหน้า Daily Dashboard
- **Then**: ระบบหยุดนับเป้าหมายแคลอรี่ของวันนั้น ไม่แนะนำวิดีโอสำหรับวันนั้น (ข้าม REC-1) และ mark สถานะวันนั้น
  เป็น "ครบเป้าหมาย" (completed) ทันที
- Prototype: [05-daily-dashboard.html](../02-design/01-prototypes/v1/05-daily-dashboard.html)

#### AC-PLN-2-02 — ตั้ง Cheat/Rest Day ทับ log ของวันนี้ที่มีอยู่แล้ว เก็บ log เดิมไว้ (REQ-09)
- **Given**: วันนี้มี log บันทึกอยู่แล้วจากการออกกำลังกายจริง (ไม่ว่าสถานะเดิมจะครบเป้าหมายหรือไม่)
- **When**: ผู้ใช้ตั้งวันนี้เป็น Cheat Day หรือ Rest Day ภายหลัง (เช่น หลังออกกำลังกายเสร็จในวันเดียวกัน)
- **Then**: ระบบเก็บ log เดิมไว้ทั้งหมดไม่ลบทิ้ง และ mark สถานะวันนั้นเป็น "ครบเป้าหมาย" (completed) เสมอ
  (completed ชนะเสมอ) — การทับ log ด้วยวิธีนี้ทำได้เฉพาะ **วันนี้เท่านั้น** ตาม
  [decision ที่ resolve แล้วเมื่อ 2026-08-28](01-spec/20260823-03-planner-logging.md#ข้อสมมติฐานการตัดสินใจที่ยืนยันแล้ว)
  (ดู AC-PLN-2-04 สำหรับกรณีวันในอดีตของสัปดาห์)
- Prototype: [05-daily-dashboard.html](../02-design/01-prototypes/v1/05-daily-dashboard.html)

#### AC-PLN-2-03 — ยกเลิกการตั้ง Cheat/Rest Day ก่อนสิ้นวัน (REQ-09)
- **Given**: วันนั้นถูกตั้งเป็น Cheat Day/Rest Day อยู่ก่อนแล้ว
- **When**: ผู้ใช้ยกเลิกการตั้ง Cheat/Rest Day ก่อนสิ้นวัน
- **Then**: วันนั้นกลับไปนับเป้าหมายแคลอรี่ตามปกติ และสถานะจะถูกประเมินใหม่ตามกติกาของ PLN-3
- Prototype: [05-daily-dashboard.html](../02-design/01-prototypes/v1/05-daily-dashboard.html)

#### AC-PLN-2-04 — พยายามตั้ง/เปลี่ยน Cheat/Rest Day ทับ log ของวันในอดีตของสัปดาห์ ถูกปิดกั้น (REQ-09)
- **Given**: ผู้ใช้เปิดปฏิทินรายสัปดาห์และเลือกวันในอดีตของสัปดาห์เดียวกัน (fixed calendar week ของ PLN-1)
  ซึ่งมี log อยู่ก่อนแล้ว
- **When**: ผู้ใช้พยายามตั้งหรือเปลี่ยน Cheat Day/Rest Day ทับ log ของวันนั้นผ่านปฏิทิน
- **Then**: ระบบปิดกั้นการแก้ไข วันนั้นเปิดได้แบบ read-only เท่านั้น ตาม
  [decision ของ PLN-1 ที่ resolve แล้ว](01-spec/20260823-03-planner-logging.md#ข้อสมมติฐานการตัดสินใจที่ยืนยันแล้ว)
  โดยไม่มีข้อยกเว้นสำหรับ PLN-2 — การทับ log ด้วย Cheat/Rest Day ทำได้เฉพาะวันนี้เท่านั้น (ดู AC-PLN-2-02)
  ([resolve แล้วเมื่อ 2026-08-28](01-spec/20260823-03-planner-logging.md#ข้อสมมติฐานการตัดสินใจที่ยืนยันแล้ว)
  เดิมเป็นคำถามที่ `test-suite-builder` พบระหว่าง self-freshness audit)
- Prototype: [08-weekly-planner.html](../02-design/01-prototypes/v1/08-weekly-planner.html)

### PLN-3 — บันทึกผลรายวัน (all-or-nothing)

#### AC-PLN-3-01 — ออกกำลังกายถึงหรือเกินเป้าหมาย 100% บันทึก log ครบเป้าหมาย (REQ-10)
- **Given**: ผู้ใช้มีค่าแคลอรี่เผาผลาญจริงจาก REC-2 และเป้าหมายแคลอรี่ของวันจาก ONB-3/REC-1 วันนี้ไม่ใช่
  Cheat/Rest Day
- **When**: แคลอรี่ที่เผาผลาญจริงถึงหรือเกินเป้าหมาย 100%
- **Then**: ระบบสร้าง log entry ที่มีนาทีออกกำลังกายจริง แคลอรี่ที่เผาผลาญสะสม และสถานะ "ครบเป้าหมาย" แล้ว
  อัปเดตสถิติรวมและส่งต่อสถานะให้ PLN-4
- Prototype: [07-workout-result.html](../02-design/01-prototypes/v1/07-workout-result.html)

#### AC-PLN-3-02 — ออกกำลังกายไม่ถึงเป้าหมาย บันทึก log ไม่ครบเป้าหมาย ไม่มี partial credit (REQ-10)
- **Given**: ผู้ใช้มีค่าแคลอรี่เผาผลาญจริงจาก REC-2 และเป้าหมายแคลอรี่ของวันจาก ONB-3/REC-1 วันนี้ไม่ใช่
  Cheat/Rest Day
- **When**: แคลอรี่ที่เผาผลาญจริงไม่ถึงเป้าหมาย 100% (เช่น ทำได้ 95%)
- **Then**: ระบบสร้าง log สถานะ "ไม่ครบเป้าหมาย" โดยไม่มี partial credit ใด ๆ แล้วส่งต่อสถานะให้ PLN-4
- Prototype: [07-workout-result.html](../02-design/01-prototypes/v1/07-workout-result.html)

#### AC-PLN-3-03 — วันนี้เป็น Cheat/Rest Day ข้ามขั้นตอน PLN-3 ทั้งหมด (REQ-10)
- **Given**: วันนี้ถูกตั้งเป็น Cheat Day หรือ Rest Day
- **When**: ถึงสิ้นวัน (ไม่มีการออกกำลังกายเทียบเป้าหมายผ่านขั้นตอนนี้)
- **Then**: ระบบข้ามขั้นตอนเปรียบเทียบแคลอรี่/สร้าง log ของ PLN-3 ทั้งหมด สถานะของวันนั้นถูกกำหนดโดย PLN-2 แทน
- Prototype: [05-daily-dashboard.html](../02-design/01-prototypes/v1/05-daily-dashboard.html)

### PLN-4 — ติดตาม Streak ต่อเนื่อง (strict, ไม่มี partial credit)

#### AC-PLN-4-01 — วันที่ครบเป้าหมายต่อเนื่อง (จาก log จริงหรือ Cheat/Rest Day) นับ streak ต่อเนื่อง (REQ-09, REQ-10)
- **Given**: ผู้ใช้มีประวัติ log ย้อนหลังอย่างน้อย 1 วัน
- **When**: ระบบไล่ตรวจสอบสถานะแต่ละวันย้อนหลังจากวันปัจจุบัน และพบว่าสถานะเป็น "ครบเป้าหมาย" (completed) —
  ไม่ว่าจะมาจาก log จริงที่ครบ 100% (PLN-3) หรือจาก Cheat/Rest Day (PLN-2)
- **Then**: ระบบนับวันนั้นต่อเนื่องเป็นส่วนหนึ่งของ streak และแสดงจำนวนวัน streak ที่ถูกต้องบน Dashboard
- Prototype: [05-daily-dashboard.html](../02-design/01-prototypes/v1/05-daily-dashboard.html)

#### AC-PLN-4-02 — ขาด log ไป 1 วันโดยไม่ตั้ง Cheat/Rest Day streak รีเซ็ตเป็น 0 (REQ-09, REQ-10)
- **Given**: ผู้ใช้มี streak ต่อเนื่องอยู่ก่อนหน้า
- **When**: มีวันที่ผู้ใช้ไม่มี log เลย และไม่ได้ตั้งเป็น Cheat Day/Rest Day
- **Then**: ระบบถือว่า streak ขาดทันทีที่วันนั้น และรีเซ็ต streak เป็น 0
- Prototype: [05-daily-dashboard.html](../02-design/01-prototypes/v1/05-daily-dashboard.html)

#### AC-PLN-4-03 — log สถานะ "ไม่ครบเป้าหมาย" ทำให้ streak ขาดทันที (REQ-09, REQ-10)
- **Given**: ผู้ใช้มี streak ต่อเนื่องอยู่ก่อนหน้า
- **When**: มีวันที่ log มีสถานะ "ไม่ครบเป้าหมาย" จาก PLN-3 (เช่น ทำได้ 90–99% ของเป้าหมาย)
- **Then**: ระบบถือว่า streak ขาดทันทีเหมือนไม่มี log เลย ไม่มี partial credit หรือ grace miss ใด ๆ และรีเซ็ต
  streak เป็น 0
- Prototype: [05-daily-dashboard.html](../02-design/01-prototypes/v1/05-daily-dashboard.html)

---

## Epic 4: Smart Integrations

Spec: [01-spec/20260823-04-smart-integrations.md](01-spec/20260823-04-smart-integrations.md)

### INT-1 — พยากรณ์วันถึงเป้าหมายน้ำหนัก

#### AC-INT-1-01 — เห็นวันที่คาดว่าจะถึงเป้าหมายน้ำหนัก (REQ-11)
- **Given**: ผู้ใช้มีเป้าหมายน้ำหนัก (จาก ONB-3) และมีประวัติ log แคลอรี่จริงสะสมเพียงพอ (PLN-3) โดยมีอัตรา
  ขาดดุล/เกินดุลเฉลี่ยที่ไม่เป็น 0 และสอดคล้องกับทิศทางเป้าหมาย
- **When**: ผู้ใช้เปิดหน้า Progress/Insights
- **Then**: ระบบดึงอัตราขาดดุลแคลอรี่เฉลี่ยจาก log จริง แปลงเป็นอัตราการเปลี่ยนแปลงน้ำหนักด้วยค่าคงที่
  7,700 kcal ≈ 1 กก. แล้วคำนวณและแสดงวันที่คาดว่าจะถึงน้ำหนักเป้าหมาย
- Prototype: [10-progress-insights.html](../02-design/01-prototypes/v1/10-progress-insights.html)

#### AC-INT-1-02 — ประวัติ log ไม่เพียงพอ แจ้งให้สะสมข้อมูลเพิ่ม (REQ-11)
- **Given**: ผู้ใช้เพิ่งเริ่มใช้แอปและมีประวัติ log แคลอรี่จริงสะสมไม่เพียงพอ
- **When**: ผู้ใช้เปิดหน้า Progress/Insights
- **Then**: ระบบแจ้งผู้ใช้ว่ายังพยากรณ์ไม่ได้ ต้องสะสมข้อมูลเพิ่ม แทนที่จะแสดงวันที่คาดการณ์
- Prototype: [10-progress-insights.html](../02-design/01-prototypes/v1/10-progress-insights.html)

#### AC-INT-1-03 — อัตราขาดดุลเฉลี่ยเป็น 0 หรือสวนทางเป้าหมาย แสดงข้อความแจ้งเตือนแทน (REQ-11)
- **Given**: ผู้ใช้มีประวัติ log เพียงพอ แต่อัตราขาดดุล/เกินดุลแคลอรี่เฉลี่ยที่คำนวณได้เป็น 0 หรือสวนทางกับ
  เป้าหมายที่ตั้งไว้
- **When**: ผู้ใช้เปิดหน้า Progress/Insights
- **Then**: ระบบแสดงข้อความแจ้งเตือนแทนวันที่คาดการณ์ (ไม่แสดงวันที่ที่คำนวณไม่ได้จริง)
- Prototype: [10-progress-insights.html](../02-design/01-prototypes/v1/10-progress-insights.html)

### INT-2 — ซิงค์ตาชั่งอัจฉริยะ

#### AC-INT-2-01 — ซิงค์น้ำหนัก/องค์ประกอบร่างกายจากตาชั่งอัจฉริยะอัตโนมัติ (REQ-12)
- **Given**: ผู้ใช้จับคู่ตาชั่งอัจฉริยะกับแอปผ่าน Bluetooth หรือ Health API สำเร็จแล้ว
- **When**: ผู้ใช้ชั่งน้ำหนัก
- **Then**: ระบบซิงค์ค่าน้ำหนัก/องค์ประกอบร่างกายล่าสุดเข้าโปรไฟล์ผู้ใช้ทันทีโดยไม่ต้องกรอกเอง และค่านี้ถูกใช้
  คำนวณ TDEE ใหม่ (ONB-1), แคลอรี่เผาผลาญ (REC-2), และพยากรณ์เป้าหมาย (INT-1) ต่อ
- Prototype: [12-device-pairing.html](../02-design/01-prototypes/v1/12-device-pairing.html)

#### AC-INT-2-02 — เชื่อมต่อไม่สำเร็จ fallback ให้กรอกน้ำหนักเอง (REQ-12)
- **Given**: ผู้ใช้พยายามซิงค์น้ำหนักจากตาชั่งอัจฉริยะ
- **When**: การเชื่อมต่อ Bluetooth หรือ Health API ไม่สำเร็จ หรือขาดหาย
- **Then**: ระบบตกกลับไปให้ผู้ใช้กรอกน้ำหนักเอง แทนการซิงค์อัตโนมัติ
- Prototype: [11-device-integrations.html](../02-design/01-prototypes/v1/11-device-integrations.html)

> หมายเหตุ: journey ของ INT-2 ยังมี Alt/Edge Case ที่ระบุว่า "มีค่าน้ำหนักหลายค่าในวันเดียว ใช้ค่าล่าสุด
> หรือค่าเฉลี่ยของวันนั้น ยังไม่ระบุชัดเจน" — เป็นพฤติกรรมที่ยังไม่ถูกตัดสินใจ จึงไม่แปลงเป็น scenario ในไฟล์นี้
> (ดู [Open Questions ของ user-journeys.md](../02-design/01-prototypes/user-journeys.md#open-questions) ข้อ 5)

### INT-3 — ซิงค์ข้อมูล Wearable

#### AC-INT-3-01 — มีข้อมูลจาก wearable ใช้แทนค่าประมาณจากสูตร MET (REQ-13)
- **Given**: ผู้ใช้เชื่อมต่อ wearable ผ่าน Apple Health/Google Health Connect สำเร็จแล้ว
- **When**: ผู้ใช้ออกกำลังกาย และมีข้อมูลแคลอรี่ที่เผาผลาญจริงจาก wearable ส่งมา
- **Then**: ระบบใช้ค่าจาก wearable แทนที่ค่าประมาณจากสูตร MET (REC-2) และค่านี้ถูกใช้ในการบันทึก log (PLN-3)
  และการพยากรณ์ (INT-1) ต่อ
- Prototype: [11-device-integrations.html](../02-design/01-prototypes/v1/11-device-integrations.html)

#### AC-INT-3-02 — Wearable ไม่ได้เชื่อมต่อหรือข้อมูลไม่ครบ ใช้ค่าประมาณจากสูตร MET แทนชั่วคราว (REQ-13)
- **Given**: ผู้ใช้กำลังออกกำลังกาย
- **When**: Wearable ไม่ได้เชื่อมต่อ หรือข้อมูลจาก wearable มาช้า/ไม่ครบ
- **Then**: ระบบใช้ค่าประมาณจากสูตร MET (REC-2) แทนชั่วคราว จนกว่าจะมีข้อมูล wearable ที่สมบูรณ์
- Prototype: [11-device-integrations.html](../02-design/01-prototypes/v1/11-device-integrations.html)

> หมายเหตุ: journey ของ INT-3 ยังมี Alt/Edge Case ที่ระบุว่า "ค่าจาก wearable กับค่าประมาณจากสูตร MET
> ต่างกันมาก ยังไม่ระบุวิธีจัดการความขัดแย้ง" — เป็นพฤติกรรมที่ยังไม่ถูกตัดสินใจ จึงไม่แปลงเป็น scenario
> ในไฟล์นี้ (ดู [Open Questions ของ user-journeys.md](../02-design/01-prototypes/user-journeys.md#open-questions) ข้อ 5)

---

## สรุปจำนวน Scenario ต่อ Feature

| Feature ID | จำนวน AC Scenario |
|---|---|
| ONB-1 | 3 |
| ONB-2 | 3 |
| ONB-3 | 3 |
| REC-1 | 3 |
| REC-2 | 3 |
| REC-3 | 2 |
| REC-4 | 3 |
| PLN-1 | 3 |
| PLN-2 | 4 |
| PLN-3 | 3 |
| PLN-4 | 3 |
| INT-1 | 3 |
| INT-2 | 2 |
| INT-3 | 2 |
| **รวม** | **40** |

---

อ้างอิงต้นฉบับ: [backlog.md](backlog.md) · [01-spec/](01-spec/index.md) ·
[user-journeys.md](../02-design/01-prototypes/user-journeys.md)
