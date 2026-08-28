# Product Backlog — smartFit_daily

เอกสารนี้สรุป feature ทั้งหมดของ smartFit_daily ไว้ในตารางเดียวรวมทุก Epic พร้อมคอลัมน์
**MoSCoW Priority** ที่เห็นชัดเจน ตามด้วยคำอธิบายแบบเต็มของแต่ละ feature ด้านล่างตาราง

สร้างจากเอกสาร requirement ใน [01-spec/](01-spec/index.md) (แยกเป็นไฟล์ต่อ Epic:
[Onboarding](01-spec/20260823-01-onboarding-personalization.md),
[Daily YouTube Recommendation](01-spec/20260823-02-daily-youtube-recommendation.md),
[Planner & Logging](01-spec/20260823-03-planner-logging.md),
[Smart Integrations](01-spec/20260823-04-smart-integrations.md); ดูคุณภาพเชิงระบบที่ตัดขวางทุก Epic
ใน [Non-Functional Requirements](01-spec/20260827-05-non-functional-requirements.md) — ไม่มี Feature ID
ของตัวเอง จึงไม่อยู่ในตารางสรุปด้านล่าง ดู [NFR Traceability](#non-functional-requirements-nfr-traceability)
ท้ายเอกสารแทน)
ตามวิธีการใน skill `feature-list-journey`
(`.claude/skills/feature-list-journey/SKILL.md`) — รวมข้อกำหนดจากส่วน "ข้อสมมติฐาน/การตัดสินใจที่ยืนยันแล้ว"
ของแต่ละเอกสาร spec ด้านบน ที่ผูกพันเป็นข้อกำหนดจริงแล้ว

ดู User Journey ของแต่ละ feature ได้ที่ [../02-design/01-prototypes/user-journeys.md](../02-design/01-prototypes/user-journeys.md)

---

## ตารางสรุป Feature ทั้งหมด (ทุก Epic)

| Feature ID | ชื่อ Feature | Epic | MoSCoW Priority | REQ ที่เกี่ยวข้อง | Spec Doc |
|---|---|---|---|---|---|
| ONB-1 | กรอกข้อมูลส่วนตัวเพื่อคำนวณเป้าหมายแคลอรี่ | Onboarding & Personalization | **Must** | REQ-01 | [01-spec](01-spec/20260823-01-onboarding-personalization.md) |
| ONB-2 | เลือกอุปกรณ์ที่มี | Onboarding & Personalization | **Must** | REQ-03 | [01-spec](01-spec/20260823-01-onboarding-personalization.md) |
| ONB-3 | ตั้งเป้าหมายหลัก (deficit/surplus คงที่ + safety floor) | Onboarding & Personalization | **Must** | REQ-02 | [01-spec](01-spec/20260823-01-onboarding-personalization.md) |
| REC-1 | แนะนำวิดีโอตรงเป้าแคลอรี่รายวัน | Daily YouTube Recommendation | **Must** | REQ-04 | [02-spec](01-spec/20260823-02-daily-youtube-recommendation.md) |
| REC-2 | คำนวณแคลอรี่เผาผลาญจริง (สูตร MET) | Daily YouTube Recommendation | **Must** | REQ-05 | [02-spec](01-spec/20260823-02-daily-youtube-recommendation.md) |
| REC-3 | เปลี่ยนวิดีโอโดยคงเป้าแคลอรี่เดิม | Daily YouTube Recommendation | **Should** | REQ-06 | [02-spec](01-spec/20260823-02-daily-youtube-recommendation.md) |
| REC-4 | วอร์มอัพ–คูลดาวน์อัตโนมัติ | Daily YouTube Recommendation | **Should** | REQ-07 | [02-spec](01-spec/20260823-02-daily-youtube-recommendation.md) |
| PLN-1 | ปฏิทินวางแผนรายสัปดาห์ | Planner & Logging | **Must** | REQ-08 | [03-spec](01-spec/20260823-03-planner-logging.md) |
| PLN-2 | โหมด Cheat Day / Rest Day (preserve log, completed wins) | Planner & Logging | **Must** | REQ-09 | [03-spec](01-spec/20260823-03-planner-logging.md) |
| PLN-3 | บันทึกผลรายวัน (all-or-nothing) | Planner & Logging | **Must** | REQ-10 | [03-spec](01-spec/20260823-03-planner-logging.md) |
| PLN-4 | ติดตาม Streak ต่อเนื่อง (strict, ไม่มี partial credit) | Planner & Logging | **Should** | REQ-09, REQ-10 | [03-spec](01-spec/20260823-03-planner-logging.md) |
| INT-1 | พยากรณ์วันถึงเป้าหมายน้ำหนัก | Smart Integrations | **Could** | REQ-11 | [04-spec](01-spec/20260823-04-smart-integrations.md) |
| INT-2 | ซิงค์ตาชั่งอัจฉริยะ | Smart Integrations | **Could** | REQ-12 | [04-spec](01-spec/20260823-04-smart-integrations.md) |
| INT-3 | ซิงค์ข้อมูล Wearable | Smart Integrations | **Could** | REQ-13 | [04-spec](01-spec/20260823-04-smart-integrations.md) |

ตารางเรียงตามลำดับ Epic ที่ปรากฏใน backlog (Onboarding → Recommendation → Planner → Integration)
และภายในแต่ละ Epic เรียง Must → Should → Could ตรงตาม Priority ในต้นฉบับ backlog ทุกจุด

---

## รายละเอียดแบบเต็มของแต่ละ Feature

### Epic 1: Onboarding & Personalization

#### ONB-1 — กรอกข้อมูลส่วนตัวเพื่อคำนวณเป้าหมายแคลอรี่

- **Priority**: Must — เพราะทุก feature อื่นที่เกี่ยวกับแคลอรี่ (ONB-3, REC-1, REC-2, PLN-3) ต้องใช้ค่า
  TDEE ของผู้ใช้เป็น baseline ถ้าไม่มีขั้นตอนนี้ ระบบจะคำนวณเป้าหมายแคลอรี่ให้ใครไม่ได้เลย
- **REQ ที่เกี่ยวข้อง**: REQ-01
- **คำอธิบาย**: ผู้ใช้ใหม่กรอกอายุ เพศ น้ำหนัก ส่วนสูง และระดับกิจกรรม ระบบคำนวณ BMR ด้วยสูตร
  Mifflin-St Jeor แล้วคูณด้วย Activity Factor เพื่อได้ TDEE บันทึกลงโปรไฟล์ ค่า TDEE นี้เป็นฐานให้
  ONB-3 แปลงเป็นเป้าหมายแคลอรี่รายวัน และเป็นอินพุตให้ REC-1/REC-2 ใช้จับคู่และคำนวณแคลอรี่เผาผลาญ

#### ONB-2 — เลือกอุปกรณ์ที่มี

- **Priority**: Must — หากไม่กรองด้วยอุปกรณ์ ระบบอาจแนะนำวิดีโอที่ผู้ใช้ทำไม่ได้จริง (เช่น ต้องใช้ยิม
  ทั้งที่ผู้ใช้ไม่มี) ทำให้ core loop ของแอปใช้งานไม่ได้ตั้งแต่ต้น
- **REQ ที่เกี่ยวข้อง**: REQ-03
- **คำอธิบาย**: ผู้ใช้เลือกอุปกรณ์ที่มีได้ **มากกว่า 1 ประเภทพร้อมกัน** (ไม่มีอุปกรณ์ / ดัมเบล / ยิมครบชุด —
  ยืนยันแล้วใน[ข้อสมมติฐาน/การตัดสินใจของ Onboarding spec](01-spec/20260823-01-onboarding-personalization.md#ข้อสมมติฐานการตัดสินใจที่ยืนยันแล้ว))
  ระบบบันทึกเป็นโปรไฟล์อุปกรณ์และใช้เป็น filter ทุกครั้งที่เอนจิ้นแนะนำวิดีโอทำงาน (REC-1) เชื่อมโยงโดยตรง
  กับความเป็นไปได้จริงของวิดีโอที่แนะนำในทุก session

#### ONB-3 — ตั้งเป้าหมายหลัก (deficit/surplus คงที่ + safety floor)

- **Priority**: Must — เป้าหมายแคลอรี่รายวันคือแกนกลางของ value proposition ทั้งหมดของแอป
  (การแนะนำวิดีโอ, การบันทึก log, การพยากรณ์) ถ้าค่านี้ผิดหรือคลุมเครือ ทุก feature ปลายทางจะผิดตาม
- **REQ ที่เกี่ยวข้อง**: REQ-02
- **คำอธิบาย**: ผู้ใช้เลือกเป้าหมายหลัก (ลดน้ำหนัก / กระชับสัดส่วน / เพิ่มความอึด) ระบบแปลงเป็นค่าคงที่
  ตายตัวตาม decision ที่ resolve แล้ว: **ลดน้ำหนัก = TDEE − 500 kcal/วัน, กระชับสัดส่วน = TDEE + 0
  kcal/วัน (maintenance), เพิ่มความอึด = TDEE + 300 kcal/วัน** พร้อม **safety floor ห้ามต่ำกว่า
  1,200–1,500 kcal/วัน** ค่า 7,700 kcal ≈ 1 กก. ไขมัน ที่ผูกกับ decision นี้ถูกใช้ร่วมกับ INT-1
  ในการพยากรณ์วันถึงเป้าหมายน้ำหนักด้วย นอกจากนี้ผู้ใช้ยังกรอก **น้ำหนักเป้าหมาย (target weight, kg)**
  ในขั้นตอนนี้ด้วย — **บังคับกรอก** เมื่อเลือก "ลดน้ำหนัก" (กรณีที่ INT-1 ต้องใช้ค่านี้จริง) และเป็น
  **ทางเลือก (ไม่บังคับ)** เมื่อเลือก "กระชับสัดส่วน"/"เพิ่มความอึด" ตาม[decision ที่ยืนยันแล้วใน
  Onboarding spec](01-spec/20260823-01-onboarding-personalization.md#ข้อสมมติฐานการตัดสินใจที่ยืนยันแล้ว)
  — ค่านี้เป็นแหล่งที่มาจริงของ precondition "มีเป้าหมายน้ำหนัก" ที่ INT-1 ใช้พยากรณ์วันถึงเป้าหมาย

### Epic 2: Daily YouTube Recommendation

#### REC-1 — แนะนำวิดีโอตรงเป้าแคลอรี่รายวัน

- **Priority**: Must — เป็น core loop หลักของแอป (การแนะนำวิดีโอประจำวัน) ที่ทุกวันผู้ใช้ต้องเจอ
  ถ้าไม่มี feature นี้ ONB-1/ONB-2/ONB-3 ที่ทำมาก็ไม่ถูกนำไปใช้ประโยชน์
- **REQ ที่เกี่ยวข้อง**: REQ-04
- **คำอธิบาย**: ระบบดึงเป้าหมายแคลอรี่ของวันนี้จาก ONB-3 (ปรับตาม Cheat/Rest Day จาก PLN-2 ถ้ามี)
  แล้ว filter วิดีโอด้วยอุปกรณ์จาก ONB-2 และจับคู่วิดีโอที่คาดว่าเผาผลาญแคลอรี่ใกล้เคียงเป้าหมายที่สุด
  ผลลัพธ์จาก feature นี้จะถูกส่งต่อให้ REC-2 คำนวณแคลอรี่จริงหลังออกกำลังกาย

#### REC-2 — คำนวณแคลอรี่เผาผลาญจริง (สูตร MET)

- **Priority**: Must — ความแม่นยำของตัวเลขแคลอรี่ที่เผาผลาญเป็นเงื่อนไขจำเป็นสำหรับ PLN-3 (บันทึก log
  ครบเป้าหมายหรือไม่) และ INT-1 (พยากรณ์วันถึงเป้าหมาย) ถ้าคำนวณผิดทุกอย่างที่ต่อจากนี้จะผิดตาม
- **REQ ที่เกี่ยวข้อง**: REQ-05
- **คำอธิบาย**: ใช้สูตรมาตรฐานแบบ MET ตาม decision ที่ resolve แล้ว: **kcal = MET × น้ำหนักตัว(kg) ×
  เวลา(ชม.)** โดยดึงค่า MET จาก lookup table ตามประเภทกิจกรรม (คาร์ดิโอ/เวทเทรนนิ่ง/HIIT) คูณกับ
  ระดับความเข้มข้น (ต่ำ/กลาง/สูง) หากมีข้อมูลจาก wearable (INT-3) ระบบจะใช้ค่านั้นแทนค่าประมาณนี้
  ผลลัพธ์ถูกส่งต่อให้ PLN-3 ใช้เทียบกับเป้าหมายรายวันเพื่อสร้าง log

#### REC-3 — เปลี่ยนวิดีโอโดยคงเป้าแคลอรี่เดิม

- **Priority**: Should — ช่วยเพิ่ม UX/adherence ให้ผู้ใช้ไม่เบื่อ แต่ core loop ของแอป (REC-1) ยังทำงาน
  ได้สมบูรณ์แม้ไม่มี feature นี้ ผู้ใช้ก็ยังออกกำลังกายตามวิดีโอที่แนะนำแรกได้
- **REQ ที่เกี่ยวข้อง**: REQ-06
- **คำอธิบาย**: ปุ่ม "เปลี่ยนวิดีโอ"/"ลองวิดีโออื่น" เก็บค่าแคลอรี่เป้าหมายของวันไว้คงเดิม แล้วค้นหาวิดีโอ
  ใหม่ด้วย filter อุปกรณ์ + แคลอรี่เป้าหมายเดียวกันจาก REC-1 โดยไม่รวมวิดีโอที่เพิ่งถูกปฏิเสธ

#### REC-4 — วอร์มอัพ–คูลดาวน์อัตโนมัติ

- **Priority**: Should — เป็น safety/quality enhancement ที่สำคัญสำหรับเซสชันความเข้มข้นสูง
  แต่ไม่ใช่เงื่อนไขที่ core loop การจับคู่แคลอรี่ (REC-1/REC-2) ต้องพึ่งพา
- **REQ ที่เกี่ยวข้อง**: REQ-07
- **คำอธิบาย**: เมื่อวิดีโอหลักที่ระบบเลือกให้มีความเข้มข้น "สูง" ระบบแทรกวิดีโอวอร์มอัพ 3 นาทีก่อน
  และคูลดาวน์ 3 นาทีหลังโดยอัตโนมัติ รวมเป็นเซสชันเดียว (วอร์มอัพ → หลัก → คูลดาวน์) เชื่อมกับ REC-1/REC-3
  ในฐานะ wrapper ของวิดีโอหลักที่ถูกเลือก

### Epic 3: Planner & Logging

#### PLN-1 — ปฏิทินวางแผนรายสัปดาห์

- **Priority**: Must — การวางแผนล่วงหน้าเป็นสัปดาห์คือคุณค่าหลักของ Epic นี้ตามที่ระบุใน backlog
  โดยตรง ผู้ใช้ต้องเห็นและกำหนดแผนล่วงหน้าได้ ไม่ใช่แค่เห็นวันนี้วันเดียว
- **REQ ที่เกี่ยวข้อง**: REQ-08
- **คำอธิบาย**: แสดงปฏิทินรายสัปดาห์แบบ **fixed calendar week (จันทร์–อาทิตย์)** ให้ผู้ใช้กำหนดประเภท
  กิจกรรมต่อวัน หรือปล่อยให้ระบบแนะนำอัตโนมัติจาก REC-1 และเป็นจุดที่ผู้ใช้ตั้ง Cheat Day/Rest Day
  ล่วงหน้าได้ (เชื่อมกับ PLN-2) — วันที่ผ่านมาแล้วในสัปดาห์เดียวกันที่มี log อยู่ก่อนแสดงเป็น read-only
  แก้ไขไม่ได้ ตาม[decision ที่ยืนยันแล้วใน Planner spec](01-spec/20260823-03-planner-logging.md#ข้อสมมติฐานการตัดสินใจที่ยืนยันแล้ว)

#### PLN-2 — โหมด Cheat Day / Rest Day (preserve log, completed wins)

- **Priority**: Must — ระบุเป็น Must โดยตรงใน backlog เพราะการพักโดยไม่เสียสถิติเป็นกลไกสำคัญที่ทำให้
  ผู้ใช้ไม่เลิกใช้แอปเมื่อพลาดไปวันหนึ่ง ซึ่งกระทบ streak (PLN-4) โดยตรงถ้าไม่มีกลไกนี้
- **REQ ที่เกี่ยวข้อง**: REQ-09
- **คำอธิบาย**: ผู้ใช้ตั้งวันเป็น Cheat Day/Rest Day ได้ โดยระบบหยุดนับเป้าหมายแคลอรี่ของวันนั้นและไม่
  ตัด streak ตาม decision ที่ resolve แล้ว: **ถ้าวันนั้นยังไม่มี log ระบบจะ mark วันนั้นเป็น "ครบเป้าหมาย"
  (completed) ทันที** แต่ **ถ้าวันนั้นมี log อยู่แล้วก่อนตั้ง Cheat/Rest Day ระบบจะเก็บ log เดิมไว้
  ไม่ลบทิ้ง** และสถานะ "ครบเป้าหมาย" ยังคงมีผล (completed ชนะเสมอ) — Cheat/Rest Day มีผลเปลี่ยนสถานะ
  เฉพาะวันที่ยังไม่มี log หรือ **วันนี้ที่มี log แล้วเท่านั้น** การทับ log ที่มีอยู่แล้วทำได้เฉพาะ "วันนี้"
  เท่านั้น ไม่สามารถทำผ่านการแตะวันในอดีตของสัปดาห์จากปฏิทิน (PLN-1) ได้ เพราะวันในอดีตที่มี log เป็น
  read-only ตาม[decision ของ PLN-1](01-spec/20260823-03-planner-logging.md#ข้อสมมติฐานการตัดสินใจที่ยืนยันแล้ว)
  ไม่มีข้อยกเว้นสำหรับ PLN-2

#### PLN-3 — บันทึกผลรายวัน (all-or-nothing)

- **Priority**: Must — log รายวันเป็นรากฐานของทั้งสถิติสะสม, streak (PLN-4), และการพยากรณ์ (INT-1)
  ถ้าไม่มีการบันทึกที่ถูกต้อง feature ปลายทางเหล่านี้จะไม่มีข้อมูลให้ทำงาน
- **REQ ที่เกี่ยวข้อง**: REQ-10
- **คำอธิบาย**: ระบบเทียบแคลอรี่เผาผลาญจริงจาก REC-2 กับเป้าหมายรายวันจาก ONB-3 ตาม decision ที่
  resolve แล้วใช้กติกา **all-or-nothing เข้มงวด**: ถึงหรือเกินเป้าหมาย 100% เท่านั้นจึงสร้าง log
  สถานะ "ครบเป้าหมาย" (บันทึกนาทีออกกำลังกาย, แคลอรี่สะสม) ส่วนวันที่ทำไม่ครบ (ไม่ว่าจะใกล้เคียงแค่ไหน)
  จะได้ log สถานะ "ไม่ครบเป้าหมาย" โดยไม่มี partial credit ใด ๆ สถานะนี้ถูกส่งต่อให้ PLN-4 ใช้คำนวณ streak

#### PLN-4 — ติดตาม Streak ต่อเนื่อง (strict, ไม่มี partial credit)

- **Priority**: Should — เป็น motivational layer ที่ต่อยอดจาก PLN-3 เพื่อกระตุ้นผู้ใช้ แต่ไม่ใช่
  เงื่อนไขที่การบันทึก log หรือ core loop รายวันต้องพึ่งพาเพื่อให้ทำงานได้
- **REQ ที่เกี่ยวข้อง**: REQ-09, REQ-10
- **คำอธิบาย**: คำนวณ streak โดยไล่ log ย้อนหลังจากวันปัจจุบัน ตาม decision ที่ resolve แล้วใช้กติกา
  **all-or-nothing เข้มงวด ไม่มี partial credit หรือ grace miss ใด ๆ**: วันที่สถานะ "ครบเป้าหมาย"
  (จาก PLN-3 โดยตรง หรือจาก PLN-2 กรณี Cheat/Rest Day) นับต่อเนื่อง ส่วนวันที่ log สถานะ "ไม่ครบเป้าหมาย"
  หรือไม่มี log เลย จะทำให้ **streak ขาดทันทีเหมือนไม่มี log เลย** และรีเซ็ตเป็น 0

### Epic 4: Smart Integrations

#### INT-1 — พยากรณ์วันถึงเป้าหมายน้ำหนัก

- **Priority**: Could — เป็น insight เสริมที่เพิ่มคุณค่าให้ผู้ใช้ที่ใช้แอปมาระยะหนึ่งแล้ว แต่ไม่ใช่
  เงื่อนไขที่ core loop รายวัน (onboarding → recommendation → logging) ต้องพึ่งพา
- **REQ ที่เกี่ยวข้อง**: REQ-11
- **คำอธิบาย**: คำนวณวันที่คาดว่าจะถึงน้ำหนักเป้าหมาย จากอัตราขาดดุล/เกินดุลแคลอรี่เฉลี่ยที่บันทึกจริง
  (PLN-3) โดยใช้ค่าคงที่ 7,700 kcal ≈ 1 กก. ไขมันตาม decision ของ ONB-3/REQ-02 ร่วมกัน แปลงเป็นอัตรา
  การเปลี่ยนแปลงน้ำหนักโดยประมาณ แล้วคำนวณวันที่คาดถึงเป้าหมายจากน้ำหนักปัจจุบัน

#### INT-2 — ซิงค์ตาชั่งอัจฉริยะ

- **Priority**: Could — เป็นความสะดวกเสริม (automation) ที่มี fallback คือกรอกน้ำหนักเองได้เสมอ
  ไม่กระทบ core loop ของแอปหากยังไม่เชื่อมต่อ
- **REQ ที่เกี่ยวข้อง**: REQ-12
- **คำอธิบาย**: ซิงค์น้ำหนัก/องค์ประกอบร่างกายจากตาชั่งอัจฉริยะผ่าน Bluetooth หรือ Health API เข้า
  โปรไฟล์ผู้ใช้อัตโนมัติ ค่าที่ได้ถูกใช้คำนวณ TDEE ใหม่ (ONB-1), แคลอรี่เผาผลาญ (REC-2), และพยากรณ์
  เป้าหมาย (INT-1) ต่อ

#### INT-3 — ซิงค์ข้อมูล Wearable

- **Priority**: Could — เพิ่มความแม่นยำของแคลอรี่ที่เผาผลาญ แต่มี fallback คือค่าประมาณจากสูตร MET
  ใน REC-2 อยู่แล้ว ไม่ใช่เงื่อนไขจำเป็นสำหรับ core loop
- **REQ ที่เกี่ยวข้อง**: REQ-13
- **คำอธิบาย**: เชื่อมต่อ Apple Watch/Fitbit/Garmin ผ่าน Apple Health/Google Health Connect เพื่อดึง
  แคลอรี่เผาผลาญจริงจากอัตราการเต้นหัวใจและกิจกรรม มาแทนที่ค่าประมาณจากสูตร MET ใน REC-2 เมื่อมีข้อมูล
  พร้อม ค่านี้ถูกใช้ต่อใน PLN-3 (บันทึก log) และ INT-1 (พยากรณ์)

---

## REQ Traceability Matrix

| REQ | คำอธิบายสั้น | Feature ID |
|---|---|---|
| REQ-01 | คำนวณ BMR/TDEE | ONB-1 |
| REQ-02 | แปลงเป้าหมายเป็น deficit/surplus คงที่ + safety floor | ONB-3 |
| REQ-03 | บันทึกโปรไฟล์อุปกรณ์เพื่อกรองวิดีโอ | ONB-2 |
| REQ-04 | จับคู่วิดีโอกับแคลอรี่เป้าหมาย | REC-1 |
| REQ-05 | คำนวณแคลอรี่เผาผลาญจริงด้วยสูตร MET | REC-2 |
| REQ-06 | เปลี่ยนวิดีโอคงเป้าแคลอรี่เดิม | REC-3 |
| REQ-07 | วอร์มอัพ/คูลดาวน์อัตโนมัติ | REC-4 |
| REQ-08 | ปฏิทินรายสัปดาห์ | PLN-1 |
| REQ-09 | Cheat Day/Rest Day (preserve log, completed wins) ไม่ตัด streak | PLN-2, PLN-4 |
| REQ-10 | บันทึก log รายวัน แบบ all-or-nothing | PLN-3, PLN-4 |
| REQ-11 | พยากรณ์วันถึงเป้าหมาย | INT-1 |
| REQ-12 | ซิงค์ตาชั่งอัจฉริยะ | INT-2 |
| REQ-13 | ซิงค์ wearable แทนค่าประมาณ | INT-3 |

REQ-01 ถึง REQ-13 ครบทุกข้อ — ไม่มี REQ ที่ต้องส่งไปที่ Open Questions
(ดูรายละเอียดสมมติฐาน/ช่องว่างที่ยังไม่ชัดเจน ซึ่งไม่ใช่ส่วนหนึ่งของ 4 decision ที่ resolve แล้ว
ได้ใน [Open Questions ของ user-journeys.md](../02-design/01-prototypes/user-journeys.md#open-questions)
หรือใน section "จุดที่ยังไม่ได้ระบุ / ควรยืนยันเพิ่มเติม" ของแต่ละเอกสารใน [01-spec/](01-spec/index.md))

---

## Non-Functional Requirements (NFR) Traceability

[Non-Functional Requirements](01-spec/20260827-05-non-functional-requirements.md) (NFR-01–NFR-08,
สร้างขึ้น 2026-08-27 โดย `test-suite-builder` เพื่อเป็นฐานของ `test-plan.md`) เป็นคุณภาพเชิงระบบที่
**ตัดขวางทุก Epic** ไม่ใช่ business rule ของ feature ใดโดยเฉพาะ จึงไม่มี Feature ID ของตัวเองและไม่อยู่ใน
ตารางสรุปด้านบน — แต่ยังต้อง trace ได้ว่าผูกกับ Feature ID ใดบ้าง:

| NFR | หมวด | Feature ID ที่เกี่ยวข้อง |
|---|---|---|
| NFR-01 | Performance | REC-1 (Daily Dashboard) |
| NFR-02 | Performance | PLN-2, PLN-3 (action ที่บันทึกข้อมูล) |
| NFR-03 | Performance | ONB-1, REC-2 (คำนวณฝั่ง client) |
| NFR-04 | Security/Privacy | ONB-1, ONB-2, ONB-3, INT-2, INT-3 (ข้อมูลสุขภาพส่วนบุคคล) |
| NFR-05 | Security/Privacy | INT-2, INT-3 (consent ก่อนเชื่อมต่อ) |
| NFR-06 | Security/Privacy | ทุก Feature ที่เก็บข้อมูลผู้ใช้ (data deletion) |
| NFR-07 | Reliability | ONB-1→REC-1→PLN-3 (core loop), INT-1, INT-2, INT-3 (fallback เมื่อ integration ล่ม) |
| NFR-08 | Reliability | PLN-3, PLN-4 (log/streak ไม่หายเมื่อ network ไม่เสถียร) |

รายละเอียดแบบเต็มของแต่ละ NFR (threshold, เหตุผล, จุดที่ยังไม่ได้ระบุ) อยู่ใน
[01-spec/20260827-05-non-functional-requirements.md](01-spec/20260827-05-non-functional-requirements.md)
ไม่ทำซ้ำที่นี่

---

อ้างอิงต้นฉบับ: [docs/01-requirements/01-spec/](01-spec/index.md)
ดู User Journey แต่ละ feature: [docs/02-design/01-prototypes/user-journeys.md](../02-design/01-prototypes/user-journeys.md)
