# smartFit_daily — Feature List

เอกสารนี้สรุป feature ทั้งหมดของ smartFit_daily โดยจัดกลุ่มตาม Epic พร้อม Feature ID,
Priority (MoSCoW), REQ ที่เกี่ยวข้อง และคำอธิบายสั้น ๆ

สร้างจาก [Product Backlog & Requirement Spec](../requirements/product-backlog.md)
ตามวิธีการใน skill `feature-list-journey`
(`.claude/skills/feature-list-journey/SKILL.md`)

ดู User Journey ของแต่ละ feature ได้ที่ [user-journeys.md](./user-journeys.md)

---

## Epic 1: Onboarding & Personalization

| Feature ID | ชื่อ Feature | Priority | REQ ที่เกี่ยวข้อง | คำอธิบาย |
|---|---|---|---|---|
| ONB-1 | กรอกข้อมูลส่วนตัวเพื่อคำนวณเป้าหมายแคลอรี่ | Must | REQ-01 | ผู้ใช้ใหม่กรอกอายุ เพศ น้ำหนัก ส่วนสูง และระดับกิจกรรม ระบบคำนวณ BMR/TDEE ให้อัตโนมัติ |
| ONB-2 | เลือกอุปกรณ์ที่มี | Must | REQ-03 | ผู้ใช้เลือกอุปกรณ์ (ไม่มีอุปกรณ์ / ดัมเบล / ยิมครบชุด) เพื่อใช้เป็นตัวกรองวิดีโอ/ท่าที่แนะนำ |
| ONB-3 | ตั้งเป้าหมายหลัก | Must | REQ-02 | ผู้ใช้เลือกเป้าหมาย (ลดน้ำหนัก / กระชับสัดส่วน / เพิ่มความอึด) ระบบแปลงเป็นค่า deficit/surplus แคลอรี่ต่อวัน |

## Epic 2: Daily YouTube Recommendation

| Feature ID | ชื่อ Feature | Priority | REQ ที่เกี่ยวข้อง | คำอธิบาย |
|---|---|---|---|---|
| REC-1 | แนะนำวิดีโอตรงเป้าแคลอรี่รายวัน | Must | REQ-04 | ระบบจับคู่วิดีโอ YouTube ตามประเภท (คาร์ดิโอ/เวทเทรนนิ่ง/HIIT) ให้ตรงกับแคลอรี่เป้าหมายของวันนั้น |
| REC-2 | คำนวณแคลอรี่เผาผลาญจริง | Must | REQ-05 | คำนวณแคลอรี่ที่เผาผลาญจริงจากระยะเวลา ประเภทกิจกรรม ความเข้มข้น และน้ำหนักตัว ไม่อิงชื่อวิดีโออย่างเดียว |
| REC-3 | เปลี่ยนวิดีโอโดยคงเป้าแคลอรี่เดิม | Should | REQ-06 | ปุ่ม "ลองวิดีโออื่น" เปลี่ยนเฉพาะตัวเลือกวิดีโอ แต่ค่าแคลอรี่เป้าหมายของวันไม่เปลี่ยน |
| REC-4 | วอร์มอัพ–คูลดาวน์อัตโนมัติ | Should | REQ-07 | แทรกวิดีโอวอร์มอัพ/คูลดาวน์ 3 นาทีอัตโนมัติก่อน-หลังเซสชันความเข้มข้นสูง |

## Epic 3: Planner & Logging

| Feature ID | ชื่อ Feature | Priority | REQ ที่เกี่ยวข้อง | คำอธิบาย |
|---|---|---|---|---|
| PLN-1 | ปฏิทินวางแผนรายสัปดาห์ | Must | REQ-08 | ผู้ใช้ดูและกำหนดวันออกกำลังกายล่วงหน้าเป็นรายสัปดาห์ผ่านปฏิทิน |
| PLN-2 | โหมด Cheat Day / Rest Day | Must | REQ-09 | ผู้ใช้ตั้งวันหยุดพัก/วันโกงได้ โดยระบบหยุดนับเป้าหมายแคลอรี่ของวันนั้นแต่ไม่ทำให้ streak ขาด |
| PLN-3 | บันทึกผลรายวันเมื่อครบเป้าหมาย | Must | REQ-10 | ระบบบันทึก log (นาทีออกกำลังกาย, แคลอรี่สะสม) เมื่อผู้ใช้ทำครบเป้าหมายของวัน |
| PLN-4 | ติดตาม Streak ต่อเนื่อง | Should | REQ-09, REQ-10 | แสดง streak การออกกำลังกายต่อเนื่อง โดยคำนวณจาก log รายวันและไม่นับ Cheat Day/Rest Day เป็นวันขาด streak |

## Epic 4: Smart Integrations

| Feature ID | ชื่อ Feature | Priority | REQ ที่เกี่ยวข้อง | คำอธิบาย |
|---|---|---|---|---|
| INT-1 | พยากรณ์วันถึงเป้าหมายน้ำหนัก | Could | REQ-11 | คำนวณวันที่คาดว่าจะถึงน้ำหนักเป้าหมาย จากอัตราขาดดุลแคลอรี่เฉลี่ยที่บันทึกจริง |
| INT-2 | ซิงค์ตาชั่งอัจฉริยะ | Could | REQ-12 | ซิงค์น้ำหนัก/องค์ประกอบร่างกายอัตโนมัติจากตาชั่งอัจฉริยะผ่าน Bluetooth หรือ Health API |
| INT-3 | ซิงค์ข้อมูล Wearable | Could | REQ-13 | เชื่อมต่อ Apple Watch/Fitbit/Garmin ผ่าน Apple Health/Google Health Connect เพื่อใช้แคลอรี่เผาผลาญจริงแทนค่าประมาณจากวิดีโอ |

---

## REQ Traceability Matrix

| REQ | คำอธิบายสั้น | Feature ID |
|---|---|---|
| REQ-01 | คำนวณ BMR/TDEE | ONB-1 |
| REQ-02 | แปลงเป้าหมายเป็น deficit/surplus | ONB-3 |
| REQ-03 | บันทึกโปรไฟล์อุปกรณ์เพื่อกรองวิดีโอ | ONB-2 |
| REQ-04 | จับคู่วิดีโอกับแคลอรี่เป้าหมาย | REC-1 |
| REQ-05 | คำนวณแคลอรี่เผาผลาญจริง | REC-2 |
| REQ-06 | เปลี่ยนวิดีโอคงเป้าแคลอรี่เดิม | REC-3 |
| REQ-07 | วอร์มอัพ/คูลดาวน์อัตโนมัติ | REC-4 |
| REQ-08 | ปฏิทินรายสัปดาห์ | PLN-1 |
| REQ-09 | Cheat Day/Rest Day ไม่ตัด streak | PLN-2, PLN-4 |
| REQ-10 | บันทึก log รายวัน | PLN-3, PLN-4 |
| REQ-11 | พยากรณ์วันถึงเป้าหมาย | INT-1 |
| REQ-12 | ซิงค์ตาชั่งอัจฉริยะ | INT-2 |
| REQ-13 | ซิงค์ wearable แทนค่าประมาณ | INT-3 |

REQ-01 ถึง REQ-13 ครบทุกข้อ — ไม่มี REQ ที่ต้องส่งไปที่ Open Questions
(ดูรายละเอียดสมมติฐาน/ช่องว่างที่ยังไม่ชัดเจนได้ใน
[Open Questions ของ user-journeys.md](./user-journeys.md#open-questions))

---

อ้างอิงต้นฉบับ: [docs/requirements/product-backlog.md](../requirements/product-backlog.md)
ดู User Journey แต่ละ feature: [docs/features/user-journeys.md](./user-journeys.md)
