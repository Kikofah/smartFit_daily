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
| ONB-0 | สมัครสมาชิก / เข้าสู่ระบบ / ลืมรหัสผ่าน / ออกจากระบบ (Authentication) | Onboarding & Personalization | **Must** | REQ-14, REQ-15, REQ-16, REQ-17 | [01-spec](01-spec/20260823-01-onboarding-personalization.md) |
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
| INT-0 | ยืนยันตัวตนก่อนจับคู่อุปกรณ์ผ่านรหัสจับคู่ (Pairing Code) | Smart Integrations | **Could** | REQ-18 | [04-spec](01-spec/20260823-04-smart-integrations.md) |
| INT-1 | พยากรณ์วันถึงเป้าหมายน้ำหนัก | Smart Integrations | **Could** | REQ-11 | [04-spec](01-spec/20260823-04-smart-integrations.md) |
| INT-2 | ซิงค์ตาชั่งอัจฉริยะ | Smart Integrations | **Could** | REQ-12 | [04-spec](01-spec/20260823-04-smart-integrations.md) |
| INT-3 | ซิงค์ข้อมูล Wearable | Smart Integrations | **Could** | REQ-13 | [04-spec](01-spec/20260823-04-smart-integrations.md) |

ตารางเรียงตามลำดับ Epic ที่ปรากฏใน backlog (Onboarding → Recommendation → Planner → Integration)
และภายในแต่ละ Epic เรียง Must → Should → Could ตรงตาม Priority ในต้นฉบับ backlog ทุกจุด **ONB-0
ถูกจัดไว้เป็นแถวแรกสุดของ Onboarding แม้ REQ-14–17 จะปรากฏหลัง REQ-01–03 ใน Business Rules ของเอกสาร
spec ก็ตาม เพราะ Authentication เป็น step แรกสุดที่เกิดขึ้นจริงในลำดับ user flow (ก่อน ONB-1 เสมอ ตาม
[รายละเอียดของ Onboarding spec](01-spec/20260823-01-onboarding-personalization.md#รายละเอียด-description))
ไม่ใช่ลำดับที่ปรากฏในเอกสาร** — เช่นเดียวกัน **INT-0 ถูกจัดไว้เป็นแถวแรกสุดของ Smart Integrations แม้
REQ-18 จะเป็นเลขสุดท้ายและปรากฏหลัง REQ-11–13 ใน Business Rules ของเอกสาร spec ก็ตาม** เพราะเป็น
precondition ทางเทคนิคที่ INT-2/INT-3 ต้องผ่านก่อนเสมอในลำดับ user flow จริง (ใช้เกณฑ์เดียวกับ ONB-0)
ไม่ใช่ลำดับที่ปรากฏในเอกสาร spec

---

## รายละเอียดแบบเต็มของแต่ละ Feature

### Epic 1: Onboarding & Personalization

#### ONB-0 — สมัครสมาชิก / เข้าสู่ระบบ / ลืมรหัสผ่าน / ออกจากระบบ (Authentication)

- **Priority**: Must — และเป็น precondition ระดับพื้นฐานที่สุดของทั้งโปรเจกต์ ยิ่งกว่า ONB-1/2/3 เสียอีก
  เพราะทุก REQ ในทุก Epic (ไม่ใช่แค่ Onboarding) ต้องมีบัญชีผู้ใช้ (`userId`) จริงก่อนจึงจะบันทึกข้อมูลใดๆ
  ได้เลย ถ้าไม่มี feature นี้ ระบบทั้งหมดจะไม่มีที่ผูกข้อมูลผู้ใช้แต่ละคนเข้าด้วยกัน
- **REQ ที่เกี่ยวข้อง**: REQ-14, REQ-15, REQ-16, REQ-17
- **คำอธิบาย**: ผู้ใช้สมัครสมาชิก (Sign-up) ได้ 3 วิธี — email/password, Google OAuth, หรือ Sign in with
  Apple (ตามที่ [tech-stack.md](../02-design/02-technical/tech-stack.md) เลือก Firebase Authentication
  ไว้แล้ว) เพื่อสร้างบัญชีผู้ใช้ใหม่ก่อนเข้าสู่ ONB-1 เสมอ (REQ-14) จากนั้นเข้าสู่ระบบ (Login) ด้วยวิธี
  เดียวกับที่สมัครไว้ได้ทุกครั้งที่กลับมาเปิดแอป โดยระบบจดจำสถานะ login ไว้ (session persistence) ไม่ต้อง
  login ซ้ำจนกว่าจะออกจากระบบเองหรือ session หมดอายุ (REQ-15) ผู้ใช้ที่สมัครด้วย email/password และลืม
  รหัสผ่านขอรีเซ็ตผ่านอีเมลที่ลงทะเบียนไว้ได้ (ใช้ไม่ได้กับบัญชี Google/Apple เพราะไม่มีรหัสผ่านให้รีเซ็ต)
  (REQ-16) และออกจากระบบได้ทุกเมื่อจากหน้าโปรไฟล์ ซึ่งล้าง session ทันที (REQ-17) — bundled เป็น Feature
  ID เดียวเพราะผู้ใช้งานยืนยันขอบเขตทั้ง 4 ส่วนนี้เป็นแพ็กเกจเดียวกัน ("ครบวงจร") ในการตัดสินใจครั้งเดียว
  เมื่อ 2026-08-29 (เทียบเคียงกับ PLN-4 ที่ผูก REQ-09+REQ-10 ไว้ใน Feature ID เดียวกันในลักษณะเดียวกัน)
  ดูรายละเอียดเต็มของการตัดสินใจ Epic placement/ขอบเขต/วิธี authentication ที่ยืนยันแล้วใน
  [ข้อสมมติฐาน/การตัดสินใจของ Onboarding spec](01-spec/20260823-01-onboarding-personalization.md#ข้อสมมติฐานการตัดสินใจที่ยืนยันแล้ว)
  — ผลลัพธ์ (`userId`) เป็น input ให้ ONB-1 และทุก feature อื่นในทุก Epic ใช้ต่อ **ONB-0 เป็น web-only**
  (อัปเดต 2026-08-30 ตาม codebase จริง): ทั้ง 4 หน้าจอ (สมัคร/เข้าสู่ระบบ/ลืมรหัสผ่าน/ออกจากระบบ) มีอยู่
  เฉพาะที่เว็บแอปเท่านั้น แอปมือถือ (companion app ของ INT-2/INT-3) ไม่มีหน้าจอ auth ของตัวเองเลย และต้อง
  พึ่งบัญชีผู้ใช้ที่มาจาก ONB-0 บนเว็บผ่านกลไก pairing-code (ดู [INT-2](#int-2--ซิงค์ตาชั่งอัจฉริยะ)/
  [INT-3](#int-3--ซิงค์ข้อมูล-wearable) ด้านล่าง และ
  [decision เต็มใน Onboarding spec](01-spec/20260823-01-onboarding-personalization.md#ข้อสมมติฐานการตัดสินใจที่ยืนยันแล้ว))

#### ONB-1 — กรอกข้อมูลส่วนตัวเพื่อคำนวณเป้าหมายแคลอรี่

- **Priority**: Must — เพราะทุก feature อื่นที่เกี่ยวกับแคลอรี่ (ONB-3, REC-1, REC-2, PLN-3) ต้องใช้ค่า
  TDEE ของผู้ใช้เป็น baseline ถ้าไม่มีขั้นตอนนี้ ระบบจะคำนวณเป้าหมายแคลอรี่ให้ใครไม่ได้เลย
- **REQ ที่เกี่ยวข้อง**: REQ-01
- **คำอธิบาย**: เกิดขึ้นหลังผู้ใช้มีบัญชีผู้ใช้จริงแล้วจาก ONB-0 (สมัครสมาชิก/เข้าสู่ระบบ) เสมอ ผู้ใช้ใหม่
  กรอกอายุ เพศ น้ำหนัก ส่วนสูง และระดับกิจกรรม ระบบคำนวณ BMR ด้วยสูตร
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

#### INT-0 — ยืนยันตัวตนก่อนจับคู่อุปกรณ์ผ่านรหัสจับคู่ (Pairing Code)

- **Priority**: Could — แม้เป็น precondition ทางเทคนิคร่วมของ INT-2 และ INT-3 ทั้งคู่ (เทียบเคียงกับที่
  ONB-0 เป็น precondition ของทั้งแอป) แต่ต่างจาก ONB-0 ตรงที่ไม่มี feature ระดับ Must/Should ใดพึ่งพา
  INT-0 เลย มีแค่ INT-2/INT-3 ซึ่งทั้งคู่เป็น Could เท่านั้นที่ต้องใช้ — priority ของ INT-0 จึงสืบทอดมาจาก
  feature ที่มันรองรับ (Could) ไม่ใช่ถูกดึงขึ้นเป็น Must/Should แบบ ONB-0
- **REQ ที่เกี่ยวข้อง**: REQ-18
- **คำอธิบาย**: ผู้ใช้ที่ล็อกอินอยู่บนเว็บแอปแล้ว ([ONB-0](#onb-0--สมัครสมาชิก--เข้าสู่ระบบ--ลืมรหัสผ่าน--ออกจากระบบ-authentication))
  ขอรหัสจับคู่อุปกรณ์แบบตัวเลข 6 หลักจากหน้าโปรไฟล์ — server สร้างรหัสผูกกับบัญชีผู้ใช้นั้นเสมอ อายุการใช้งาน
  **5 นาที** และเป็น **single-use** จากนั้นผู้ใช้กรอกรหัสนี้บน companion mobile app เพื่อแลกเป็น session
  ที่ authenticated แบบ silent (ไม่ต้องกรอก credential ซ้ำ) — เกิดขึ้นเพราะแอปมือถือ (companion app ของ
  INT-2/INT-3) ไม่มีหน้าจอ auth ของตัวเองเลย ตามการ re-architecture ของโปรเจกต์เมื่อ 2026-08-29 (ดู
  [decision เต็มใน Smart Integrations spec](01-spec/20260823-04-smart-integrations.md#ข้อสมมติฐานการตัดสินใจที่ยืนยันแล้ว))
  — ได้รับ Feature ID ของตัวเอง (**INT-0**) และ REQ ของตัวเอง (**REQ-18**) เมื่อ 2026-08-30 ยืนยันจาก
  ผู้ใช้งาน โดยตั้งชื่อ/จัดวางตามแบบแผนเดียวกับ ONB-0 ในฐานะ foundational precondition ที่ feature อื่นใน
  epic เดียวกันใช้ร่วมกัน (ต่างจาก ONB-0 ตรงที่ INT-0 รองรับเฉพาะ INT-2/INT-3 ภายใน epic นี้ ไม่ใช่ทั้งแอป)
  — ผลลัพธ์ (mobile session ที่ authenticated) เป็น precondition ของทั้ง [INT-2](#int-2--ซิงค์ตาชั่งอัจฉริยะ)
  และ [INT-3](#int-3--ซิงค์ข้อมูล-wearable) ด้านล่าง

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
  เป้าหมาย (INT-1) ต่อ — ทำงานผ่าน companion app บนมือถือ ซึ่งไม่มีหน้าจอ auth ของตัวเอง (ดู
  [ONB-0](#onb-0--สมัครสมาชิก--เข้าสู่ระบบ--ลืมรหัสผ่าน--ออกจากระบบ-authentication) เป็น web-only)
  จึงต้องผ่าน **[INT-0](#int-0--ยืนยันตัวตนก่อนจับคู่อุปกรณ์ผ่านรหัสจับคู่-pairing-code)** (REQ-18)
  เพื่อยืนยันตัวตนผู้ใช้ก่อนเข้าหน้าจับคู่อุปกรณ์จริงเสมอ — ไม่ duplicate รายละเอียดกลไกซ้ำที่นี่อีกแล้ว
  ตั้งแต่ 2026-08-30 (ย้ายไปอยู่ที่ INT-0 entry ของตัวเอง)

#### INT-3 — ซิงค์ข้อมูล Wearable

- **Priority**: Could — เพิ่มความแม่นยำของแคลอรี่ที่เผาผลาญ แต่มี fallback คือค่าประมาณจากสูตร MET
  ใน REC-2 อยู่แล้ว ไม่ใช่เงื่อนไขจำเป็นสำหรับ core loop
- **REQ ที่เกี่ยวข้อง**: REQ-13
- **คำอธิบาย**: เชื่อมต่อ Apple Watch/Fitbit/Garmin ผ่าน Apple Health/Google Health Connect เพื่อดึง
  แคลอรี่เผาผลาญจริงจากอัตราการเต้นหัวใจและกิจกรรม มาแทนที่ค่าประมาณจากสูตร MET ใน REC-2 เมื่อมีข้อมูล
  พร้อม ค่านี้ถูกใช้ต่อใน PLN-3 (บันทึก log) และ INT-1 (พยากรณ์) — เช่นเดียวกับ INT-2 ทำงานผ่าน companion
  app บนมือถือที่ไม่มีหน้าจอ auth ของตัวเอง ต้องผ่าน
  **[INT-0](#int-0--ยืนยันตัวตนก่อนจับคู่อุปกรณ์ผ่านรหัสจับคู่-pairing-code)** (REQ-18) เพื่อยืนยันตัวตน
  ผู้ใช้ก่อนเข้าหน้าเชื่อมต่อ wearable จริงเสมอ (กลไกเดียวกันกับที่ INT-2 ใช้ — ไม่ duplicate รายละเอียด
  ซ้ำที่นี่อีกแล้วตั้งแต่ 2026-08-30)

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
| REQ-14 | สมัครสมาชิก (email/password, Google, Apple) | ONB-0 |
| REQ-15 | เข้าสู่ระบบ + จดจำสถานะ login (session persistence) | ONB-0 |
| REQ-16 | ลืมรหัสผ่าน — รีเซ็ตผ่านอีเมล (เฉพาะ email/password) | ONB-0 |
| REQ-17 | ออกจากระบบ — ล้าง session ทันที | ONB-0 |
| REQ-18 | ยืนยันตัวตนก่อนจับคู่อุปกรณ์ผ่านรหัสจับคู่ (Pairing Code, 6 หลัก, 5 นาที, single-use) | INT-0 |

REQ-01 ถึง REQ-18 ครบทุกข้อ (REQ-14–17 เพิ่มเข้า Onboarding & Personalization spec เมื่อ 2026-08-29 —
ดู [ONB-0](#onb-0--สมัครสมาชิก--เข้าสู่ระบบ--ลืมรหัสผ่าน--ออกจากระบบ-authentication) ด้านบน; REQ-18
เพิ่มเข้า Smart Integrations spec เมื่อ 2026-08-30 — ดู
[INT-0](#int-0--ยืนยันตัวตนก่อนจับคู่อุปกรณ์ผ่านรหัสจับคู่-pairing-code) ด้านบน) —
ไม่มี REQ ที่ต้องส่งไปที่ Open Questions
(ดูรายละเอียดสมมติฐาน/ช่องว่างที่ยังไม่ชัดเจน ซึ่งไม่ใช่ส่วนหนึ่งของ 4 decision ที่ resolve แล้ว
ได้ใน [Open Questions ของ user-journeys.md](../02-design/01-prototypes/user-journeys.md#open-questions)
หรือใน section "จุดที่ยังไม่ได้ระบุ / ควรยืนยันเพิ่มเติม" ของแต่ละเอกสารใน [01-spec/](01-spec/index.md))

---

## Non-Functional Requirements (NFR) Traceability

[Non-Functional Requirements](01-spec/20260827-05-non-functional-requirements.md) (NFR-01–NFR-13 —
NFR-01–08 สร้างขึ้น 2026-08-27 โดย `test-suite-builder` เพื่อเป็นฐานของ `test-plan.md`, NFR-09–11 เพิ่ม
2026-08-28 หลัง NFR gap analysis เทียบทั้ง pipeline, NFR-12–13 เพิ่ม 2026-08-29 หลัง Non-Functional
Requirements Review ของ `technical-design-orchestrator` ตามการเปลี่ยน backend/database เป็น
Firebase/Firestore) เป็นคุณภาพเชิงระบบที่ **ตัดขวางทุก Epic** ไม่ใช่ business rule ของ feature ใดโดยเฉพาะ
จึงไม่มี Feature ID ของตัวเองและไม่อยู่ในตารางสรุปด้านบน — แต่ยังต้อง trace ได้ว่าผูกกับ Feature ID ใดบ้าง:

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
| NFR-09 | Usability (Accessibility) | ทุก Feature ID (UI-level cross-cutting — touch target, contrast, font scaling ของทุกหน้าจอ) |
| NFR-10 | Usability (Localization) | ทุก Feature ID (UI-level cross-cutting — ภาษาไทยเป็นหลักของทุกหน้าจอ) |
| NFR-11 | Legal/Regulatory Compliance | ONB-0, ONB-1, ONB-2, ONB-3, INT-2, INT-3 (เก็บ/เชื่อมต่อข้อมูลส่วนบุคคล — PDPA consent record-keeping, สิทธิ์เจ้าของข้อมูล, breach notification; เพิ่ม ONB-0 2026-08-29 ดูหมายเหตุ 3) |
| NFR-12 | Reliability (Data Integrity) | REC-2, INT-3 (ดูหมายเหตุ 1) |
| NFR-13 | Usability (Data Visualization) | INT-1 (ดูหมายเหตุ 2) |

**หมายเหตุ 1 (NFR-12)**: เอกสาร NFR เองแนะนำผูกกับ "ทุก Feature ID ที่มี server-side write ยกเว้น
read-only ล้วน" แต่เมื่อตรวจกับ [database-schema.md
§8.3](../02-design/02-technical/database-schema.md#83-fk--constraint-enforcement-migration-ย้ายจาก-schema-level-ไป-cloud-function)
และ [api-spec.md §3.3/3.7](../02-design/02-technical/api-spec.md) พบว่ากติกาอื่นๆ ที่ถูกจัดกลุ่มไว้ในตาราง
เดียวกัน (equipment mutual exclusion, safety floor, all-or-nothing, PLN-1 read-only, PLN-2 "วันนี้
เท่านั้น", streak/forecast sync) เป็น business rule ที่ต้อง enforce ที่ application layer อยู่แล้ว **ไม่ว่า
จะใช้ relational DB หรือไม่ก็ตาม** (ระบุไว้ชัดเจนในเอกสารเดียวกันว่า "ไม่ใช่เรื่องใหม่จาก Firestore") —
ส่วนที่เป็นผลกระทบใหม่จริงจากการไม่มี FK ระดับ schema (orphaned/dangling reference) เหลือเฉพาะ operation
ที่รับ **id ของ document อื่นจาก client เพื่ออ้างอิง entity ที่มีอยู่แล้ว**: `POST
/workouts/sessions/{sessionId}/complete` (REC-2 — error case ระบุชัดว่า `404 sessionId ไม่พบ`) และ `POST
/integrations/wearable/readings` (INT-3 — ตัวอย่างที่ยกไว้ตรงในภาคผนวก 8.3 เอง) จึงแก้ mapping ให้แคบลง
ตามหลักฐานจริงแทนการ copy คำแนะนำกว้างๆ มาตรง ๆ

**หมายเหตุ 2 (NFR-13)**: ยืนยันกับ [DESIGN.md
§4.4](../02-design/01-prototypes/DESIGN.md) และ prototype
[`10-progress-insights.html`](../02-design/01-prototypes/v1/10-progress-insights.html) (มี inline SVG
line chart แนวโน้มน้ำหนัก ใช้สี `--color-clay`/`--color-sage` ตรงตามกติกา NFR-13) ซึ่งแท็ก
`<!-- Feature: INT-1 -->` ไว้ชัดเจน — ตรวจแล้วไม่พบกราฟลักษณะเดียวกันในหน้าที่เกี่ยวกับ INT-2/INT-3
(`11-device-integrations.html`, `12-device-pairing.html` เป็น UI เชื่อมต่ออุปกรณ์ล้วน ไม่มี chart) จึงคง
ผูกเฉพาะ INT-1 ตามที่เอกสาร NFR เองแนะนำไว้แล้ว (ยืนยันตรงกับหลักฐาน ไม่ต้องแก้)

**หมายเหตุ 3 (NFR-11 → ONB-0)**: เพิ่ม ONB-0 เข้า mapping ของ NFR-11 เมื่อ 2026-08-29 ตามเกณฑ์เดียวกับที่ใช้
รวม ONB-1/2/3 อยู่แล้วเดิม (feature ที่ "เก็บ/เชื่อมต่อข้อมูลส่วนบุคคล") — REQ-14–17 (ONB-0) สร้างบัญชีผู้ใช้
จริงและเก็บอีเมล/ข้อมูลยืนยันตัวตน ซึ่งเป็นข้อมูลส่วนบุคคลตามนิยามเดียวกัน ไม่ใช่การขยายขอบเขต NFR-11 ใหม่
([Onboarding spec](01-spec/20260823-01-onboarding-personalization.md#จุดที่ยังไม่ได้ระบุ--ควรยืนยันเพิ่มเติม)
เองก็ระบุไว้แล้วว่า NFR-04/06/11 ควรถูก audit เนื้อหาอีกครั้งเพราะตอนนี้มีระบบบัญชีผู้ใช้จริงแล้ว — การอัปเดต
mapping นี้เป็นแค่ traceability ไม่ใช่การแก้เนื้อหา NFR ซึ่งเป็นงานของ `test-suite-builder`) ไม่ได้เพิ่ม ONB-0
ให้ NFR-04 เพราะเนื้อหา NFR-04 ที่ resolve แล้วระบุเจาะจงว่าเป็น "ข้อมูลสุขภาพส่วนบุคคล" (อายุ เพศ น้ำหนัก
ส่วนสูง เป้าหมาย ข้อมูลจาก wearable/ตาชั่งอัจฉริยะ) ไม่รวมถึง credential/รหัสผ่านโดยตรง — การเพิ่ม ONB-0 เข้า
NFR-04 จะเป็นการตีความขยายเนื้อหาที่ยังไม่ resolve แทน ไม่ใช่ mapping ตามเกณฑ์ที่มีอยู่แล้วเหมือน NFR-11

รายละเอียดแบบเต็มของแต่ละ NFR (threshold, เหตุผล, จุดที่ยังไม่ได้ระบุ) อยู่ใน
[01-spec/20260827-05-non-functional-requirements.md](01-spec/20260827-05-non-functional-requirements.md)
ไม่ทำซ้ำที่นี่

---

อ้างอิงต้นฉบับ: [docs/01-requirements/01-spec/](01-spec/index.md)
ดู User Journey แต่ละ feature: [docs/02-design/01-prototypes/user-journeys.md](../02-design/01-prototypes/user-journeys.md)
