# Test Plan — smartFit_daily

- **ประเภทเอกสาร:** Test Plan (ทั้งโปรเจกต์ — ไฟล์เดียว ไม่แยกต่อ Epic)
- **สถานะเอกสาร:** Draft
- **วันที่สร้าง:** 2026-08-27
- **สร้างโดย:** skill `test-suite-builder`
- **อัปเดตล่าสุด:** 2026-09-26 (`test-suite-builder`, full-scope audit) — reconcile ทั้งไฟล์ให้ตรงกับสถานะ
  แอปจริงปัจจุบัน (ดู "หมายเหตุสถานะโปรเจกต์" ที่แก้ไขใหม่ด้านล่าง)

เอกสารนี้อ้างอิงจาก [docs/01-requirements/backlog.md](../../01-requirements/backlog.md) (MoSCoW priority
และ Feature ID ทั้ง **16** ตัว — แก้จาก "15" เมื่อ 2026-09-26 เพราะประโยคเดิมเขียนก่อน **INT-0** จะได้
Feature ID ของตัวเองเมื่อ 2026-08-30; รวม **ONB-0** Authentication ที่เพิ่มเข้า Must เมื่อ 2026-08-29) และ
[Non-Functional Requirements](../../01-requirements/01-spec/20260827-05-non-functional-requirements.md)
(NFR-01–NFR-13 — ขยายจาก NFR-01–08 เมื่อ 2026-08-28 ด้วย NFR-09/10 Usability และ NFR-11 Legal/Regulatory
Compliance, และขยายอีกครั้ง 2026-08-29 ด้วย **NFR-12** Reliability/Data Integrity — ผูกกับ REC-2, INT-3 —
และ **NFR-13** Usability/Data Visualization — ผูกกับ INT-1 เท่านั้น — หลังเปลี่ยน backend/database เป็น
Firebase/Firestore ผ่าน Non-Functional Requirements Review ของ `technical-design-orchestrator`) เป็นหลัก
ร่วมกับ "จุดที่ยังไม่ได้ระบุ / ควรยืนยันเพิ่มเติม" ของเอกสาร spec ทั้ง 4 ไฟล์ใน
[01-spec/](../../01-requirements/01-spec/index.md) สำหรับส่วน Risk Management ด้านล่าง

> **หมายเหตุสถานะโปรเจกต์ (เขียนใหม่ 2026-09-26 — เวอร์ชันเดิมตั้งแต่ 2026-08-27 บอกว่า "ยังไม่มี
> application source code, backend, หรือ build/test tooling จริง" ซึ่งล้าหลังไปมากแล้ว)**: โปรเจกต์นี้มี
> **แอปจริงที่ deploy แล้ว** ใน `smartfit_daily_app/` — Express.js + React/Vite (`apps/web`) deploy ขึ้น
> **Cloud Run** (backend) + **Firebase Hosting** (client), ใช้ **Firebase Authentication** (บัญชีผู้ใช้
> จริง — ONB-0) และ **Firestore** (backend storage จริง) — ไม่ใช่แค่ scaffolded stub อีกต่อไปสำหรับหลาย
> เส้นทางหลัก มี **automated unit test จริง** ด้วย Vitest ครอบคลุม pure domain calculation module 8 ไฟล์
> ใน `apps/web/server/domain/`: `tdee.test.ts` (ONB-1), `goalTargets.test.ts` (ONB-3),
> `metCalorieBurn.test.ts` (REC-2), `dailyLog.test.ts` (PLN-3), `streak.test.ts` (PLN-4),
> `sessionVideos.test.ts` (REC-4), `weightForecast.test.ts` (INT-1), `pairingRateLimit.test.ts` (INT-0) —
> รวม **55 test case อัตโนมัติ** รันด้วย `npm run test -w @smartfit/web` จาก `smartfit_daily_app/` และ
> Epic 4 ทั้งหมด (**INT-0, INT-2, INT-3**) มี backend implement จริงแล้วเช่นกัน (ดู §1/§4 R14 และ TC ที่
> เกี่ยวข้องใน `test-cases/04-smart-integrations.md`) — สิ่งที่**ยังไม่มี**คือ (ก) automated integration/
> E2E test ระดับ route/API เต็มรูปแบบ (unit test ครอบคลุมเฉพาะ pure domain module) และ (ข) การทดสอบบน
> อุปกรณ์มือถือจริง (Bluetooth ตาชั่งอัจฉริยะ, HealthKit/Health Connect permission ของ INT-2/INT-3 — ยัง
> manual/pending) แผนนี้จึงยังคงเขียนในระดับ **manual/documentation-level test case เป็นหลัก** แต่ต่างจาก
> เดิมตรงที่ตอนนี้มีทั้งโค้ดจริงให้ตรวจสอบและ automated test บางส่วนที่ execute ได้จริงแล้ว ไม่ใช่ "รอแอป
> จริง" อีกต่อไปสำหรับหลาย feature — ดูรายละเอียดต่อใน §1/§3/§4

---

## 1. ขอบเขต (Scope)

ขอบเขตของการทดสอบรอบนี้อ้างอิงคอลัมน์ MoSCoW Priority ใน
[backlog.md](../../01-requirements/backlog.md#ตารางสรุป-feature-ทั้งหมด-ทุก-epic) โดยตรง:

### อยู่ในขอบเขต (In scope) — ทดสอบเต็มรูปแบบในรอบนี้

**Must** (9 features — ต้องผ่านก่อนถือว่า core loop ใช้งานได้; เพิ่ม **ONB-0** เมื่อ 2026-08-29):

| Feature ID | Epic | เหตุผลที่ต้องทดสอบรอบนี้ |
|---|---|---|
| ONB-0 | Onboarding & Personalization | สมัครสมาชิก/เข้าสู่ระบบ/ลืมรหัสผ่าน/ออกจากระบบ — precondition ระดับพื้นฐานที่สุดของทั้งแอป ยิ่งกว่า ONB-1/2/3 เสียอีก (ทุก REQ อื่นต้องมี `userId` จริงก่อน) |
| ONB-1, ONB-2, ONB-3 | Onboarding & Personalization | เป็น baseline (TDEE, อุปกรณ์, เป้าหมายแคลอรี่) ที่ทุก feature อื่นต้องใช้ต่อ |
| REC-1, REC-2 | Daily YouTube Recommendation | core loop รายวันที่ผู้ใช้เจอทุกวัน |
| PLN-1, PLN-2, PLN-3 | Planner & Logging | ปฏิทิน, Cheat/Rest Day, และการบันทึก log ที่ feature อื่นพึ่งพา |

**Should** (3 features — ทดสอบในรอบนี้ด้วย แต่ไม่ block การ exit ถ้าเจอบั๊กที่ไม่ critical):

| Feature ID | Epic | หมายเหตุ |
|---|---|---|
| REC-3, REC-4 | Daily YouTube Recommendation | เสริม UX/safety ของ REC-1 แต่ core loop ยังทำงานได้แม้ไม่มี |
| PLN-4 | Planner & Logging | motivational layer ต่อยอดจาก PLN-3 (all-or-nothing streak) |

### นอกขอบเขต (Out of scope) สำหรับรอบทดสอบนี้

**Could** — ทั้ง Epic 4 (Smart Integrations: **INT-0, INT-1, INT-2, INT-3**) — **ยังคงอยู่นอกขอบเขต
"exit-blocking" ของรอบทดสอบนี้ตาม MoSCoW เดิม (ไม่เปลี่ยน priority)** แต่คำอธิบายเดิมที่ว่า "เพราะยังไม่ถูก
implement จริง" **ล้าหลังแล้ว (แก้ไข 2026-09-26)**: ยืนยันจากโค้ดจริงว่า backend ของทั้ง 4 feature
implement แล้ว — **INT-0** (pairing-code, rate limit, one-code-per-account — `routes/pairing/index.ts`),
**INT-1** (พยากรณ์วันถึงเป้าหมาย — `routes/insights-forecast/index.ts` + `domain/weightForecast.ts`),
**INT-2** (ซิงค์ตาชั่งอัจฉริยะ — `routes/integration-gateway/index.ts`'s `/smart-scale/*`), และ **INT-3**
(pull-sync จาก wearable — endpoint เดียวกัน's `/wearable/*`) — ระดับ **API/domain logic execute ได้จริง
แล้ว** (ดู TC-INT-0-001 ถึง 009, TC-INT-3-003 ถึง 009 ใน `test-cases/04-smart-integrations.md` ที่ mark
ว่า execute ได้จริง) สิ่งที่**ยังไม่ execute ในรอบนี้จริง** คือเฉพาะส่วนที่ต้องพึ่งฮาร์ดแวร์/OS จริงบนมือถือ
(Bluetooth pairing กับตาชั่งจริง ของ INT-2, HealthKit/Health Connect permission prompt จริงของ INT-3,
และ end-to-end flow เต็มรูปแบบบน companion app จริง) ซึ่งยังต้องรอการทดสอบบนอุปกรณ์จริง (real-device
testing) — ไม่ใช่ "รอ implement" อีกต่อไป — เหตุผลที่ทั้ง Epic 4 ยังไม่นับเป็นเงื่อนไข exit ของรอบนี้จึง
เปลี่ยนจาก "ยังไม่มีโค้ด" เป็น "MoSCoW = Could และยังขาดการทดสอบระดับอุปกรณ์จริง" แทน (NFR-07 ยังคงยืนยันว่า
core loop รายวันต้องไม่ผูกกับความพร้อมของ integration เหล่านี้อยู่ดี) — ดูรายละเอียด TC ที่ execute ได้จริง
ในรอบนี้ที่ §4 R14 และ `test-cases/04-smart-integrations.md`

NFR ที่พึ่งพาระบบบัญชีผู้ใช้/backend จริงบางส่วนยังอยู่นอกขอบเขตการ *execute* รอบนี้ — **แก้ไข 2026-09-26**:
NFR-06 (data deletion) **implement แล้วจริง** ผ่าน `DELETE /api/account` (`routes/account-session/deleteAccount.ts`
— ลบทุก subcollection + Firebase Auth account จริง) จึงย้ายออกจากกลุ่มนี้แล้ว (ดู §4 R7 ที่ปรับปรุงแล้ว) —
เหลือเฉพาะ NFR-04 ส่วน encryption-at-rest ระดับ audit เอกสาร (Firestore เข้ารหัสข้อมูลที่จัดเก็บเป็น
default ของแพลตฟอร์มอยู่แล้ว แต่ยังไม่มีการตรวจสอบ/บันทึกหลักฐานอย่างเป็นทางการในรอบนี้) และ NFR-11 (PDPA)
ส่วน consent record-keeping/breach notification process ที่ยังไม่ implement จริง — ดูรายละเอียดใน §4
Risk Management และ §5 Entry/Exit Criteria

---

## 2. ประเภทการทดสอบ (Test Types)

| ประเภท | ขอบเขตที่ครอบคลุม | เหตุผลที่เลือก |
|---|---|---|
| **Functional Testing** | ตรรกะแคลอรี่/streak/logging หลัก: คำนวณ BMR/TDEE (ONB-1), แปลงเป้าหมายเป็น deficit/surplus + safety floor (ONB-3), สูตร MET (REC-2), all-or-nothing log (PLN-3), streak strict (PLN-4) — รวมถึง **ตรรกะ Authentication (ONB-0, เพิ่ม 2026-08-29)**: field validation ของสมัครสมาชิก/เข้าสู่ระบบ, ข้อจำกัดที่ให้รีเซ็ตรหัสผ่านได้เฉพาะบัญชี email/password (REQ-16), การล้าง session เมื่อออกจากระบบ (REQ-17), และ (เพิ่ม 2026-08-30) พื้นผิว UI ที่เป็น web-only ล้วน (ไม่มีหน้าจอ auth บน `apps/mobile`) | เป็นตรรกะทางคณิตศาสตร์/กติกาธุรกิจที่ตายตัว มีค่า input/output คาดเดาได้ชัดเจน ต้อง verify ว่าตรงตาม decision ที่ resolve แล้วใน spec ทุกตัว |
| **Integration Testing** | YouTube API (REC-1 การค้นหา/กรองวิดีโอ, REC-2 metadata ที่ใช้คำนวณ MET), Health API/wearable (INT-3), Bluetooth สมาร์ตสเกล (INT-2), และ (เพิ่ม 2026-08-30, ขยาย 2026-09-25) **กลไกรหัสจับคู่อุปกรณ์ (pairing-code, รวม rate limit/one-code-per-account/concurrent redeem)** ระหว่างเว็บแอปกับ companion app บนมือถือ — mint (`POST /auth/pairing-codes`)/redeem (`POST /auth/pairing-codes/redeem`) ที่ implement จริงแล้วที่ `apps/web/server/routes/pairing/index.ts` (ดู R14), และ **กลไก pull-sync แคลอรี่จาก wearable ของมือถือ (INT-3)** — `GET /integrations/wearable/latest-session`/`POST /integrations/wearable/readings` ที่ implement จริงแล้วที่ `apps/web/server/routes/integration-gateway/index.ts` | เป็นจุดที่แอปพึ่งพาระบบภายนอกที่ควบคุมไม่ได้เต็มที่ — REC-1/REC-2 อยู่ใน scope Must จึงต้อง integration-test แม้จะยังไม่มี backend จริง (ผ่าน mock ดู §3); INT-2/INT-3 เตรียม test case ไว้แต่ไม่ execute รอบนี้ (Could, นอกขอบเขต) — ยกเว้นกลไก pairing-code และกลไก pull-sync ของ INT-3 ที่ backend จริงมีอยู่แล้ว จึง execute ได้ทันทีในระดับ API testing แม้ INT-0/INT-2/INT-3 เองยังไม่ execute เต็ม epic (ดู R14) |
| **Usability Testing** | Onboarding flow ทั้งหมด (**ONB-0** → ONB-1 → ONB-2 → ONB-3, ปรับลำดับ 2026-08-29 ให้เริ่มจาก Authentication ซึ่งเป็นจุดเริ่มต้นจริงของทั้งแอปตาม user-journeys.md) | เป็น first-run linear flow ที่ผู้ใช้ใหม่ทุกคนต้องผ่านโดยไม่มีทางย้อนกลับแก้ไขระหว่างทางที่ระบุไว้ชัดเจน (ดู Preconditions/flow ใน [user-journeys.md](../../02-design/01-prototypes/user-journeys.md)) — ถ้าขั้นตอนใดทำให้ผู้ใช้สับสนหรือติดขัด ผู้ใช้จะเข้าแอปไม่ได้เลยตั้งแต่ต้น ต่างจากหน้าจออื่นที่พลาดแล้วยังกลับมาแก้ได้ |
| **Regression Testing** | กติกา all-or-nothing ของ streak (PLN-3 การสร้าง log และ PLN-4 การนับ/ตัด streak) | เป็นกติกาที่ "เข้มงวด ไม่มี partial credit" ตาม decision ที่ resolve แล้ว ซึ่งเป็นกฎที่ผิดพลาดง่ายเวลามีการแก้โค้ดในอนาคต (เช่น เผลอใส่ grace period หรือ partial credit) — ต้องมี regression suite ที่รันซ้ำทุกครั้งที่โค้ดส่วน logging/streak หรือ Cheat/Rest Day (PLN-2) ถูกแก้ |
| **NFR-driven Testing** (Performance/Security/Reliability/Usability/Legal Compliance) | ตรงตาม NFR-01–NFR-13 ใน [Non-Functional Requirements](../../01-requirements/01-spec/20260827-05-non-functional-requirements.md) — NFR-09/NFR-10 (Usability: accessibility, ภาษา) ตรวจสอบได้จริงจาก prototype HTML โดยตรง ต่างจาก NFR อื่นส่วนใหญ่ที่รอ backend NFR-12 (เพิ่ม 2026-08-29, Reliability/Data Integrity — ผูกกับ REC-2 (Must)/INT-3 (Could)) **ฝั่ง INT-3 execute ได้จริงแล้ว (เพิ่ม 2026-09-25 — ดู R12)** ส่วนฝั่ง REC-2 มี backend implement แล้วเช่นกันแต่ยังไม่ปรับ test case ในรอบนี้ (นอกขอบเขต Epic) NFR-13 (เพิ่ม 2026-08-29, Usability/Data Visualization) ตรวจสอบได้จริงจาก prototype `10-progress-insights.html` เหมือน NFR-09/10 แต่ผูกกับ INT-1 เท่านั้นซึ่งอยู่ใน Epic 4 (Could, นอกขอบเขต execution รอบนี้ตาม §1) จึงเตรียม test case ไว้ล่วงหน้าแต่ยังไม่ execute จนกว่า Epic 4 จะเข้า scope | เอกสาร NFR ถูกสร้างขึ้นมาโดยเฉพาะเพื่อเป็นฐานของแผนนี้ (ดู "ความสัมพันธ์กับเอกสารอื่น" ของเอกสารนั้น) — ทดสอบเท่าที่ execute ได้จริงในสถานะปัจจุบันของโปรเจกต์ (ดู §5 Entry/Exit Criteria สำหรับ NFR ที่ยัง block อยู่) |

---

## 3. Test Environment

### สถานะปัจจุบัน (มี backend จริง deploy แล้ว — เขียนใหม่ 2026-09-26)

**แก้ไข 2026-09-26**: ย่อหน้านี้เดิมบอกว่า "ไม่มี backend/infra จริง" ซึ่งล้าหลังไปมากแล้ว — ดู "หมายเหตุ
สถานะโปรเจกต์" ที่ต้นไฟล์สำหรับรายละเอียดเต็ม สรุปสั้นสำหรับ §3 นี้: มี Express.js backend จริง deploy บน
**Cloud Run**, client deploy บน **Firebase Hosting**, ข้อมูลเก็บใน **Firestore** จริง, ยืนยันตัวตนผ่าน
**Firebase Authentication** จริง — การทดสอบระดับ "environment" จึงหมายถึงทั้ง (ก) การตรวจสอบ **prototype
HTML** (`docs/02-design/01-prototypes/v{N}/`) เทียบกับ spec/business rule เหมือนเดิม **และ** (ข) การอ่าน/
ตรวจสอบ**โค้ดจริง**ใน `smartfit_daily_app/` เทียบกับ AC/spec โดยตรง (เป็นวิธีหลักที่ TC ส่วนใหญ่ในไฟล์นี้
และ `test-cases/*.md` ใช้ยืนยันความถูกต้องตอนนี้) — ยังไม่มี URL/staging environment หรือ CI runner ที่รัน
test suite อัตโนมัติทุกครั้งที่ push (ไม่มี GitHub Actions/CI config ใน repo ณ วันที่เขียนนี้) จึงยังต้อง
รัน `npm run test -w @smartfit/web` ด้วยมือ — เป็นรายละเอียด infra ที่ยังต้องเติมเมื่อทีมตั้ง CI จริง

**Automated unit test ที่มีอยู่จริง**: Vitest ครอบคลุม pure domain calculation module 8 ไฟล์ใน
`apps/web/server/domain/`: `tdee.test.ts` (ONB-1), `goalTargets.test.ts` (ONB-3 —
`computeDailyCalorieTargetKcal`/`computeDailyIntakeTarget`), `metCalorieBurn.test.ts` (REC-2),
`dailyLog.test.ts` (PLN-3 — `applyCalorieDeltaToDailyLog`, ใช้โดย INT-3's pull-sync ด้วย),
`streak.test.ts` (PLN-4), `sessionVideos.test.ts` (REC-4), `weightForecast.test.ts` (INT-1), และ
`pairingRateLimit.test.ts` (INT-0) — รวม **55 test case อัตโนมัติ**, รันด้วย `npm run test -w
@smartfit/web` จาก `smartfit_daily_app/` — ครอบคลุมเฉพาะ pure domain module ไม่ใช่ route handler/
integration เต็มรูปแบบ (ยังไม่มี automated integration/E2E test suite) และ INT-2's smart-scale sync logic
(`integration-gateway/index.ts`'s `/smart-scale/*`) เองก็ยังไม่มีไฟล์ domain module/test แยกต่างหาก
(logic อยู่ในตัว route โดยตรง)

### อุปกรณ์/OS ที่ควรครอบคลุม (เมื่อมีแอปจริง)

เนื่องจากเป็นแอปสุขภาพที่ใช้ทุกวัน (daily loop) และ feature ใน Epic 4 (INT-2/INT-3) ต้องพึ่ง Bluetooth และ
Health API ของ OS โดยตรง ให้เตรียมครอบคลุม:

- **Mobile-first**: iOS Safari/WebView (เชื่อม Apple Health, สแกน Bluetooth ตาชั่ง) และ Android Chrome/
  WebView (เชื่อม Google Health Connect, Bluetooth) — INT-2/INT-3 ต้องทดสอบบนอุปกรณ์จริง ไม่ใช่ simulator
  เพราะ Bluetooth และ permission prompt ของ Health API จำลองบน simulator ได้ไม่สมบูรณ์
- Desktop browser (สำหรับตรวจ layout responsive ของหน้า onboarding/dashboard) เป็นรองจาก mobile

### สิ่งที่ต้อง Mock/Stub (เพราะยังไม่มี backend จริง)

| Dependency | ใช้ใน Feature | สิ่งที่ต้อง mock |
|---|---|---|
| YouTube Data API | REC-1, REC-2 | ชุดวิดีโอจำลองพร้อม metadata ครบ (ประเภทกิจกรรม, ความเข้มข้น, ระยะเวลา) ให้ REC-1 จับคู่แคลอรี่เป้าหมายได้ และ REC-2 คำนวณ MET ได้โดยไม่ต้องเรียก API จริง — ควรมีชุดที่ "ไม่มีวิดีโอตรงเป้าเป๊ะ" ด้วย เพื่อทดสอบ tolerance (ดู Risk R1 ใน §4) |
| Health API / wearable (Apple Health, Google Health Connect) | INT-3 | payload จำลองของแคลอรี่เผาผลาญจากอัตราการเต้นหัวใจ รวมถึงกรณีค่าที่ต่างจากค่าประมาณ MET มาก (ดู Risk R5) — เตรียมไว้แต่ไม่ execute รอบนี้ในระดับ OS/มือถือจริง (HealthKit/Health Connect permission prompt, Bluetooth) — **ยกเว้น (เพิ่ม 2026-09-25)**: ฝั่ง server ของกลไก pull-sync (`GET /integrations/wearable/latest-session`, `POST /integrations/wearable/readings`) execute ได้จริงแล้วในระดับ API testing โดย mock เฉพาะค่า Active Calories ที่ "อ่านมาจาก HealthKit" เป็น request body ตรง ๆ ไม่ต้องรอ mobile OS จริง (ดู TC-INT-3-005 ถึง 009, test-plan.md §4 R14) |
| ตาชั่งอัจฉริยะผ่าน Bluetooth | INT-2 | payload น้ำหนัก/องค์ประกอบร่างกายจำลอง รวมกรณีชั่งหลายครั้งในวันเดียว (ดู Risk R5) — เตรียมไว้แต่ไม่ execute รอบนี้ |
| Backend/ระบบบัญชีผู้ใช้ (ยังไม่มีจริง) | NFR-04 (encryption at rest), NFR-06 (data deletion), NFR-08 (local persistence ก่อน sync), NFR-11 (PDPA consent record-keeping/breach notification), และ **ONB-0 (เพิ่ม 2026-08-29 — เฉพาะส่วน session persistence ข้ามการเปิดแอปจริง/session timeout ตาม REQ-15 และการล้าง session ฝั่ง server จริงตาม REQ-17; ส่วนสมัครสมาชิก/เข้าสู่ระบบ/ลืมรหัสผ่านหน้าจอ (REQ-14/15/16) ทดสอบได้แล้วที่ prototype-level ผ่าน `localStorage` จำลอง)** | ยัง mock ไม่ได้อย่างมีความหมายเพราะยังไม่มี data model/storage จริงให้ทดสอบ — เป็น NFR/ส่วนของ ONB-0 ที่ "not testable" ในรอบนี้ (ดู §5) — จะ unblock ได้เมื่อ [`TASK-INFRA-01`](../../01-requirements/03-task/phase-1-mvp-core-loop.md) (ติดตั้ง backend/ระบบบัญชีผู้ใช้จริง ตาม MVP Phase ของ [release-plan.md](../../01-requirements/02-plan/release-plan.md)) เสร็จจริง — **ปัจจุบัน task นี้ยังเป็น "ยังไม่เริ่ม"** ไม่ใช่ backend จริงในตอนนี้ |

---

## 4. Risk Management

ความเสี่ยงด้านล่างดึงมาจากส่วน "จุดที่ยังไม่ได้ระบุ / ควรยืนยันเพิ่มเติม" ของเอกสาร spec แต่ละไฟล์โดยตรง
ตามที่ CLAUDE.md ระบุว่าเอกสารเหล่านี้เป็น read-only upstream — **แผนนี้ไม่ invent ค่าที่ยังไม่ resolve เอง**
เพียงแค่ระบุความเสี่ยงและวิธีรับมือระหว่างที่ยังไม่ resolve

| # | ความเสี่ยง | แหล่งที่มา | Likelihood | Impact | การรับมือ (Mitigation) |
|---|---|---|---|---|---|
| R1 | REC-1 ไม่ได้ระบุ tolerance ว่าวิดีโอต้องใกล้เคียงแคลอรี่เป้าหมายแค่ไหนถึงเรียกว่า "ตรงกัน" ทำให้เขียน test case ที่ตรวจ pass/fail ชัดเจนไม่ได้ | [20260823-02-daily-youtube-recommendation.md § จุดที่ยังไม่ได้ระบุ](../../01-requirements/01-spec/20260823-02-daily-youtube-recommendation.md) | High | Medium (กระทบ core loop Must) | เขียน test case แบบ directional ไปก่อน ("แคลอรี่โดยประมาณของวิดีโอที่แนะนำใกล้เคียงเป้าหมายมากกว่าตัวเลือกอื่นในชุดข้อมูลทดสอบ") จนกว่าจะมีตัวเลข tolerance ที่ยืนยันแล้วผ่าน `feature-list-journey`/`test-suite-builder` |
| R2 | REC-4 ไม่ได้ระบุว่าเวลา/แคลอรี่ของวอร์มอัพ-คูลดาวน์นับรวมในเป้าหมายรายวัน (PLN-3) หรือไม่ — ถ้าตีความผิดจะทำให้ all-or-nothing log ผิดพลาดได้ | [20260823-02-daily-youtube-recommendation.md § จุดที่ยังไม่ได้ระบุ](../../01-requirements/01-spec/20260823-02-daily-youtube-recommendation.md) | Medium | High (กระทบความแม่นยำของ PLN-3/PLN-4 ซึ่งเป็น Must/Should) | เขียน test case ของ REC-4 ครอบคลุมทั้ง 2 กรณี (นับรวม / ไม่นับรวม) ไว้ก่อน และ mark ว่ารอ decision — ห้าม lock ค่าใดค่าหนึ่งลงใน acceptance criteria จนกว่าจะยืนยัน |
| R3 | **RESOLVED (2026-08-27, ขยาย 2026-08-28)** — เดิมคือ "PLN-1 ไม่ได้ระบุว่าผู้ใช้แก้ไขแผนของวันที่ผ่านไปแล้ว (มี log แล้ว) ได้หรือไม่" ปัจจุบัน resolve แล้ว: วันที่ผ่านมาแล้วในสัปดาห์เดียวกันที่มี log อยู่ก่อน เปิดดูได้แบบ read-only เท่านั้น แก้ไขไม่ได้ (ดู AC-PLN-1-03/TC-PLN-1-004) — คำถามต่อเนื่องที่เปิดขึ้นจากเรื่องนี้ (การตั้ง Cheat/Rest Day ทับ log ของวันในอดีตผ่านปฏิทิน ขัดกับ read-only ใหม่หรือไม่) ก็ resolve แล้วเช่นกันเมื่อ 2026-08-28: จำกัดการทับ log ด้วย Cheat/Rest Day ไว้เฉพาะ "วันนี้" เท่านั้น ไม่มีข้อยกเว้นสำหรับวันในอดีต (ดู AC-PLN-2-02/AC-PLN-2-04, TC-PLN-2-003/004/006) — ไม่มีความเสี่ยงค้างอยู่ทั้งสองจุดแล้ว | [20260823-03-planner-logging.md § ข้อสมมติฐาน/การตัดสินใจที่ยืนยันแล้ว](../../01-requirements/01-spec/20260823-03-planner-logging.md#ข้อสมมติฐานการตัดสินใจที่ยืนยันแล้ว) | N/A (resolved) | N/A (resolved) | ไม่ต้อง mitigate อีกต่อไป — ทั้งสองคำถามได้รับคำตอบและถูก bake เข้า AC/test case แล้ว |
| R4 | **RESOLVED (2026-09-26)** — เดิมคือ "INT-1 ไม่ได้ระบุจำนวนวัน log ขั้นต่ำก่อนเริ่มพยากรณ์วันถึงเป้าหมาย — พยากรณ์จากข้อมูล 1 วันอาจให้ผลลัพธ์ที่เข้าใจผิดได้" (และโค้ดเคย hardcode ค่าชั่วคราว 3 วันเป็น spec-vs-code mismatch) ปัจจุบัน resolve แล้ว: ผู้ใช้งานยืนยันเกณฑ์ **อย่างน้อย 7 วัน** (น้อยกว่า 7 → empty state "ประวัติยังไม่พอ"; ครบ 7 วันพอดี → พยากรณ์ได้) และโค้ดปรับเป็น `MIN_LOG_DAYS_FOR_FORECAST = 7` ใน `apps/web/server/domain/weightForecast.ts` ให้ตรงกันแล้ว — bake เข้า AC-INT-1-01/02/08/09 และ TC-INT-1-001/002/009/010 | [20260823-04-smart-integrations.md § ข้อสมมติฐาน/การตัดสินใจที่ยืนยันแล้ว](../../01-requirements/01-spec/20260823-04-smart-integrations.md#ข้อสมมติฐานการตัดสินใจที่ยืนยันแล้ว) | N/A (resolved) | N/A (resolved) | ไม่ต้อง mitigate อีกต่อไป — มี boundary test case ครอบคลุมทั้ง 6 วัน (empty state) และ 7 วันพอดี (พยากรณ์ได้) แล้ว (ความเสี่ยงเรื่องข้อมูลชนกันของ INT-2/INT-3 ที่ไหลต่อมากระทบ INT-1 ยังคงอยู่ใน R5 แยกต่างหาก) |
| R5 | INT-2/INT-3 ไม่ได้ระบุลำดับความสำคัญเมื่อข้อมูลชนกัน (ชั่งน้ำหนักหลายครั้ง/วัน ใช้ค่าล่าสุดหรือค่าเฉลี่ย; wearable ต่างจากค่าประมาณ MET มากควรทำอย่างไร) — ค่าที่ผิดจะไหลต่อไปกระทบ TDEE, REC-2, PLN-3, INT-1 | [20260823-04-smart-integrations.md § จุดที่ยังไม่ได้ระบุ](../../01-requirements/01-spec/20260823-04-smart-integrations.md) | Medium | High (ข้อมูลผิดไหลต่อหลาย feature แม้ตัว Epic 4 เองเป็น Could) | นอกขอบเขต execute รอบนี้ — เมื่อถึงเวลา implement ต้อง resolve ก่อนเขียน test case แบบ conflict-data จริงจัง ระหว่างนี้เขียนได้เฉพาะ happy-path (ไม่มีข้อมูลชนกัน) |
| R6 | NFR-01 ยังไม่มีตัวเลข threshold เวลาโหลด Daily Dashboard ที่แน่นอน (เช่น "< 2 วิ บน 4G") เพราะยังไม่มี backend/infra จริงให้วัด | [NFR § จุดที่ยังไม่ได้ระบุ](../../01-requirements/01-spec/20260827-05-non-functional-requirements.md) | High | Medium | ทดสอบเชิงคุณภาพไปก่อน ("การแสดงผลรู้สึกหน่วงหรือไม่ในสายตาผู้ทดสอบ") แทนตัวเลขที่ชัดเจน จนกว่าจะยืนยัน threshold ตอนเข้า implementation จริง |
| R7 | NFR-04 (encryption at rest) และ NFR-06 (data deletion) พึ่งพาระบบบัญชีผู้ใช้/backend storage จริงที่ยังไม่มีในโปรเจกต์นี้ | [NFR § จุดที่ยังไม่ได้ระบุ](../../01-requirements/01-spec/20260827-05-non-functional-requirements.md) | Certain (ยืนยันจากสถานะโปรเจกต์ใน CLAUDE.md) | Low ตอนนี้ / High เมื่อมีระบบจริง | Mark เป็น **"not testable in this round"** อย่างชัดเจนในผลการทดสอบ ไม่ใช่ skip เงียบ ๆ — มี concrete task รองรับแล้ว: [`TASK-INFRA-01`](../../01-requirements/03-task/phase-1-mvp-core-loop.md) ใน MVP Phase ของ [release-plan.md](../../01-requirements/02-plan/release-plan.md) (สถานะปัจจุบัน: ยังไม่เริ่ม) — กลับมาทดสอบเมื่อ task นั้นเสร็จจริง ไม่ใช่แค่ "รอเมื่อมี backend" แบบลอยๆ อีกต่อไป |
| R8 | NFR-07 ยังไม่มีตัวเลข uptime/SLA เฉพาะสำหรับ YouTube/Health API เพราะเป็น third-party service ที่ทีมไม่ได้ควบคุม SLA เอง | [NFR § จุดที่ยังไม่ได้ระบุ](../../01-requirements/01-spec/20260827-05-non-functional-requirements.md) | Medium | Medium | ทดสอบพฤติกรรม fallback ด้วยการ inject timeout/error ปลอมใน mock (ดู §3) แทนการอิงตัวเลข SLA จริง — ยืนยันแค่ว่า "core loop ยังใช้งานได้เมื่อ external API ล่ม" ตรงตาม NFR-07 |
| R9 | Data retention period ของ log ประวัติย้อนหลัง (PLN-3) ยังไม่ได้ระบุ เกี่ยวโยงกับ NFR-06 | [NFR § จุดที่ยังไม่ได้ระบุ](../../01-requirements/01-spec/20260827-05-non-functional-requirements.md) | Low (ยังไม่ใช่เงื่อนไข Must ของรอบนี้) | Low ตอนนี้ | นอกขอบเขตการทดสอบรอบนี้ — บันทึกเป็น open question รอ resolve ก่อนเขียน test case เรื่อง log purge/retention |
| R10 | NFR-10 ยังไม่ระบุรูปแบบวันที่/ตัวเลขตาม locale ไทยที่แน่นอน (ค.ศ. หรือ พ.ศ.) — DESIGN.md §4.5 เองก็ทิ้ง open point นี้ไว้เช่นกัน | [NFR § จุดที่ยังไม่ได้ระบุ](../../01-requirements/01-spec/20260827-05-non-functional-requirements.md) | Low (ไม่กระทบ core loop) | Low | ทดสอบเฉพาะกติกาที่ตายตัวแล้วไปก่อน (ภาษาไทยเป็นหลัก, ทับศัพท์คำเทคนิคได้) ส่วนรูปแบบวันที่ยังไม่ lock ค่าใดจนกว่าจะยืนยัน |
| R11 | NFR-11 (PDPA — consent record-keeping, สิทธิ์เจ้าของข้อมูล, breach notification) พึ่งพาระบบบัญชีผู้ใช้/backend storage จริงที่ยังไม่มีในโปรเจกต์นี้ | [NFR § จุดที่ยังไม่ได้ระบุ](../../01-requirements/01-spec/20260827-05-non-functional-requirements.md) | Certain (ยืนยันจากสถานะโปรเจกต์ใน CLAUDE.md) | Low ตอนนี้ / High เมื่อมีระบบจริง | Mark เป็น **"not testable in this round"** อย่างชัดเจนในผลการทดสอบเหมือน R7 — มี concrete task รองรับแล้วเช่นเดียวกัน: [`TASK-INFRA-01`](../../01-requirements/03-task/phase-1-mvp-core-loop.md) ใน MVP Phase (สถานะปัจจุบัน: ยังไม่เริ่ม) — กลับมาทดสอบเมื่อ task นั้นเสร็จจริง |
| R12 | **(เพิ่ม 2026-08-29, ปรับปรุงบางส่วน 2026-09-25)** NFR-12 ยังไม่ได้ระบุรูปแบบ error handling ที่แน่นอนเมื่อ referential existence validation ล้มเหลว (เช่น ควร retry หรือแจ้ง error กลับ client แบบไหน) — จุดนี้ยังไม่ resolve เหมือนเดิม **แต่ตัว validation เองมี backend จริงแล้วทั้งสองฝั่ง** ที่ตรวจสอบระหว่างรอบนี้ (ขอบเขต INT-0/INT-3/ONB-3): ฝั่ง INT-3 (`POST /integrations/wearable/readings`, `apps/web/server/routes/integration-gateway/index.ts`) ใช้ `assertDocExists` ตรวจ `sessionId` ก่อนเขียนข้อมูลเสมอ — ตรวจพบว่าฝั่ง REC-2 (`POST /workouts/sessions/{sessionId}/complete`, `apps/web/server/routes/exertion-calorie/index.ts`) ก็มี `assertDocExists` เดียวกันอยู่แล้วเช่นกัน แต่ REC-2 อยู่นอกขอบเขต Epic ของการรันรอบนี้ (Epic 2, ไม่ใช่ INT-0/INT-3/ONB-3) — จึงยังไม่ปรับ `test-cases/02-daily-youtube-recommendation.md`/TC-REC-2-005 ในรอบนี้ บันทึกไว้เป็นสิ่งที่ควรตามด้วยการรัน `test-suite-builder` ให้ครอบคลุม Epic 2 | [NFR § จุดที่ยังไม่ได้ระบุ](../../01-requirements/01-spec/20260827-05-non-functional-requirements.md) | Low ทั้งสองฝั่ง (validation implement แล้วทั้งคู่) | Low ตอนนี้ / จะกลับเป็น High เฉพาะถ้ามีการแก้โค้ดในอนาคตที่ถอด validation นี้ออก | **TC-INT-3-003 execute ได้จริงแล้วในรอบนี้** (อัปเดต 2026-09-25 — เดิม mark ว่า "not testable") เพราะ backend ของฝั่ง INT-3 implement แล้วตรงกับ Expected Result ที่ AC-INT-3-03 ระบุไว้ทุกประการ — **TC-REC-2-005 (ฝั่ง REC-2) ก็ควร execute ได้จริงเช่นกัน** ตามหลักฐานโค้ดเดียวกัน แต่การแก้ไขไฟล์ `test-cases/02-daily-youtube-recommendation.md` เองอยู่นอกขอบเขตของรอบนี้ — รอรันรอบถัดไปที่ครอบคลุม Epic 2 — รูปแบบ error handling ที่แน่นอน (retry ฯลฯ) ยังไม่ resolve สำหรับทั้งสองฝั่ง |
| R13 | **(เพิ่ม 2026-08-29)** ONB-0 (Authentication) เป็น Feature ID ใหม่ระดับ **Must** แต่ session persistence ข้ามการเปิดแอปจริง (REQ-15) และระยะเวลา session timeout (ยังไม่ระบุตัวเลขแน่นอน — ดู "จุดที่ยังไม่ได้ระบุ" ของ Onboarding spec) พึ่งพาระบบบัญชีผู้ใช้/backend จริงที่ยังไม่มีในโปรเจกต์นี้ ต่างจากสมัครสมาชิก/เข้าสู่ระบบ/ลืมรหัสผ่านหน้าจอที่ทดสอบได้แล้วจาก prototype (`00-auth-*.html`) ผ่าน `localStorage` จำลอง | [20260823-01-onboarding-personalization.md § จุดที่ยังไม่ได้ระบุ](../../01-requirements/01-spec/20260823-01-onboarding-personalization.md#จุดที่ยังไม่ได้ระบุ--ควรยืนยันเพิ่มเติม) | Certain (ยืนยันจากสถานะโปรเจกต์ใน CLAUDE.md — ไม่มี backend จริง) | Low ตอนนี้ / High เมื่อมีระบบจริง (ผู้ใช้ต้อง login ซ้ำโดยไม่คาดคิด หรือ session ไม่หมดอายุเลยจนเป็นความเสี่ยงด้านความปลอดภัย) | ทดสอบ AC-ONB-0-01–05 (สมัคร/เข้าสู่ระบบ/ลืมรหัสผ่าน/ออกจากระบบหน้าจอ) ได้เต็มที่ในรอบนี้ที่ prototype-level — ส่วน AC-ONB-0-06 (session หมดอายุ) mark เป็น **"documentation-level / not testable in this round"** เหมือน R7/R11/R12 รอ [`TASK-INFRA-01`](../../01-requirements/03-task/phase-1-mvp-core-loop.md) เสร็จจริงพร้อมยืนยันระยะเวลา session timeout ที่แน่นอนก่อน — **หมายเหตุ 2026-08-30**: AC-ONB-0-07 (web-only UI surface) *เป็นข้อยกเว้น* — ตรวจสอบได้ทันทีด้วย code inspection ของ `apps/mobile/app/` จริง (ไม่มีไฟล์ signup/login/forgot-password) ไม่ต้องรอ backend เพราะเป็นการยืนยันโครงสร้างไฟล์ ไม่ใช่ runtime behavior — ดู TC-ONB-0-007 |
| R14 | **RESOLVED (เพิ่ม 2026-08-30, อัปเดต ID 2026-08-30 หลัง renumbering, resolve เต็มรูปแบบ 2026-09-25)** กลไกรหัสจับคู่อุปกรณ์ (pairing-code — Feature ID **INT-0**/REQ-18) มี **backend จริงที่ implement แล้ว** (`apps/web/server/routes/pairing/index.ts`) ต่างจาก R7/R11/R12/R13 ข้างต้นที่ยัง "ไม่มี backend จริง" — เดิมมี 2 จุดที่ไม่ resolve: (1) จำนวนรหัสที่ยังไม่หมดอายุต่อบัญชีพร้อมกัน (2) rate limit ป้องกัน brute-force รหัส 6 หลัก **ทั้งสองจุด resolve และ implement แล้วเมื่อ 2026-09-25**: (1) "1 บัญชี 1 รหัสที่ใช้งานได้เท่านั้น" — ขอรหัสใหม่ยกเลิกรหัสเก่าทั้งหมดทันที (`invalidateExistingCodesFor`) (2) rate limit 5 ครั้งผิด/15 นาที/IP → `429` + `Retry-After`, ตรวจก่อนแม้แต่จะดูรหัสที่ส่งมา, redeem สำเร็จรีเซ็ตตัวนับ, และการตรวจ/ลบรหัสอยู่ในธุรกรรม (transaction) เดียวกันเพื่อกัน race ของทั้ง rate limit และ single-use (`apps/web/server/domain/pairingRateLimit.ts`) | [20260823-04-smart-integrations.md § ข้อสมมติฐาน/การตัดสินใจที่ยืนยันแล้ว](../../01-requirements/01-spec/20260823-04-smart-integrations.md#ข้อสมมติฐานการตัดสินใจที่ยืนยันแล้ว), [api-spec.md §4 ข้อ 12–13](../../02-design/02-technical/api-spec.md) | N/A (resolved) | N/A (resolved) | ทดสอบ mint/redeem/error-case/expiry/rate-limit/one-code-per-account/concurrent-redeem ได้จริงครบในรอบนี้ (**TC-INT-0-001 ถึง 009**, TC-INT-3-004 ใน `test-cases/04-smart-integrations.md` — 001–005 renumbering 2026-08-30 จาก TC-INT-2-003 ถึง 007 เดิม, **006–009 เพิ่ม 2026-09-25** ครอบคลุมทั้ง 2 จุดที่เพิ่ง resolve) เพราะ backend จริงมีอยู่ครบแล้ว แม้ INT-0/INT-2/INT-3 เองจะยังเป็น Could/นอกขอบเขต execution ตาม §1 ก็ตาม — ไม่มีความเสี่ยงค้างอยู่แล้ว |

> **หมายเหตุความสอดคล้องกับ CLAUDE.md (เพิ่ม 2026-08-30)**: ส่วน "หมายเหตุสถานะโปรเจกต์" ที่ต้นไฟล์นี้ (เขียน
> ไว้ตั้งแต่ 2026-08-27) ระบุว่า "ยังไม่มี application source code, backend, หรือ build/test tooling จริง"
> ซึ่ง**ล้าหลังแล้วในภาพรวม** — ปัจจุบันมี `smartfit_daily_app/` (Express.js + React/Vite บน `apps/web`,
> React Native+Expo บน `apps/mobile`) เป็นโค้ดจริง แม้ส่วนใหญ่ยังเป็น scaffolded stub (ดู CLAUDE.md § Project
> status) การ reconcile เต็มรูปแบบของทั้งเอกสารนี้ให้ตรงกับสถานะโค้ดจริง (Test Environment, Entry/Exit
> Criteria, R7/R11/R12/R13 ทั้งหมด) เป็นงานที่ใหญ่กว่าขอบเขตของรอบนี้ (ซึ่งจำกัดเฉพาะกลไก pairing-code และ
> ONB-0 web-only) จึงยังไม่แก้ไขในรอบนี้ — บันทึกไว้เป็น gap ที่ควรตามด้วยการรัน `test-suite-builder` แบบเต็ม
> ขอบเขตอีกครั้งเพื่อ audit ทั้งเอกสาร (ดูรายงานผลของ `test-suite-builder`)

---

## 5. Entry/Exit Criteria

### Entry Criteria (เงื่อนไขก่อนเริ่มทดสอบรอบนี้)

1. Requirement (`01-spec/`), Backlog (`backlog.md`), และ User Journey (`user-journeys.md`) ของทุก
   feature ในขอบเขต (Must + Should) ต้องผ่านการ audit ของ `feature-list-journey` แล้วและไม่มี
   contradiction ค้างอยู่ — ตรวจสอบแล้วในตอนเขียนแผนนี้ว่า **backlog.md และ NFR doc สอดคล้องกัน**
   (Epic 4 = Could ทั้งคู่) ไม่พบความขัดแย้งระหว่าง Requirement/Backlog ที่ต้องหยุดรอ
2. [`docs/01-requirements/acceptance-criteria.md`](../../01-requirements/acceptance-criteria.md) — สร้าง
   เสร็จแล้ว (56 scenario ครอบคลุมทั้ง 16 Feature ID ณ 2026-08-30 หลังเพิ่ม AC-REC-2-04/AC-INT-3-03 จาก
   NFR-12, AC-INT-1-04 จาก NFR-13, AC-ONB-0-01–06 จาก Feature ID ใหม่ **ONB-0** (2026-08-29), AC-ONB-0-07
   (web-only UI surface, 2026-08-30 — ดู CLAUDE.md § "Docs/code drift"), และล่าสุด **AC-INT-0-01–04**
   (กลไกรหัสจับคู่อุปกรณ์ pairing-code — renumbering 2026-08-30 จาก AC-INT-2-03–06/AC-INT-3-04 เดิม
   หลัง `feature-list-journey` ตั้ง Feature ID **INT-0**/REQ-18 ให้กลไกนี้เป็นของตัวเอง) ในการรัน
   `test-suite-builder` จึงพร้อมให้ `test-cases/{epic-slug}.md` อ้างอิง AC ID ได้ครบทุก feature —
   **หมายเหตุ 2026-09-25**: ตัวเลข "56 scenario" นี้เองล้าหลังไปแล้วจาก AC เพิ่มเติมรอบ 2026-08-31 (AC-ONB-3-06,
   AC-REC-1-04, AC-INT-1-05–07 — รวมเป็น 61 ก่อนรอบนี้) และตอนนี้เพิ่มอีก 11 scenario จากขอบเขต INT-0/
   INT-3/ONB-3 ของรอบนี้ (AC-ONB-3-07/08, AC-INT-0-05–08, AC-INT-3-04–08) รวมเป็น **72 scenario** จริง ณ
   วันนี้ — ไม่ใช่การนับใหม่ทั้งหมดของทุก Epic ในรอบนี้ (นอกขอบเขต) แต่เป็นการยืนยันว่า Feature ID ในขอบเขต
   INT-0/INT-3/ONB-3 ของรอบนี้มี AC ครบก่อน `test-cases/{epic-slug}.md` จะอ้างอิงได้จริง — ดูสรุปที่ถูกต้อง
   ล่าสุดใน [acceptance-criteria.md § สรุปจำนวน Scenario ต่อ Feature](../../01-requirements/acceptance-criteria.md#สรุปจำนวน-scenario-ต่อ-feature)
3. เตรียม mock/stub ของ YouTube API, Health API/wearable, และ Bluetooth สมาร์ตสเกล ตาม §3 ให้พร้อม
   ก่อนเริ่ม Integration Testing
4. DESIGN.md และ prototype (ถ้ามีการสร้างแล้วใน `02-design/01-prototypes/v{N}/`) พร้อมใช้อ้างอิงสำหรับ
   Usability Testing ของ onboarding flow

### Exit Criteria (เงื่อนไขที่ถือว่า "พอสำหรับรอบนี้")

1. Test case ของทุก feature ระดับ **Must** (**ONB-0**, ONB-1/2/3, REC-1/2, PLN-1/2/3) ถูก execute ครบ
   และไม่มี defect ระดับ Critical/High ค้างอยู่โดยไม่มีแผนแก้ไข — สำหรับ ONB-0 หมายถึงเฉพาะส่วนที่
   execute ได้จริงในรอบนี้ (AC-ONB-0-01–05) ส่วน AC-ONB-0-06 (session หมดอายุ) ถูก mark ว่า
   "not testable in this round" ตาม §4 R13 ไม่นับเป็นเงื่อนไข block การ exit ของข้อนี้
2. Test case ของทุก feature ระดับ **Should** (REC-3/4, PLN-4) ถูก execute ครบ — defect ที่พบ (ถ้าไม่ใช่
   Critical/High) บันทึกไว้ใน `docs/03-testing/02-test-result/` ได้โดยไม่ block การ exit
3. Feature ระดับ **Could** (Epic 4 ทั้งหมด) ถูกยืนยันชัดเจนว่า **ไม่ execute ในรอบนี้** ตาม §1 Scope —
   ไม่ถือเป็นเงื่อนไข exit ของรอบนี้
4. NFR ที่ **execute ได้จริง** ในสถานะปัจจุบัน (NFR-01, NFR-02, NFR-03, NFR-05, NFR-07 บางส่วนผ่าน mock,
   NFR-09/NFR-10 ผ่านการตรวจสอบ prototype โดยตรง, **NFR-12 ฝั่ง INT-3 เพิ่ม 2026-09-25** — ดู R12 ที่
   ปรับปรุงแล้วใน §4, execute ได้จริงผ่าน TC-INT-3-003) ผ่านเกณฑ์เชิงคุณภาพตาม §4 (R6, R8, R10) — ส่วน
   NFR-04/NFR-06/NFR-08/NFR-11 (พึ่ง backend/Cloud Function จริง) ยังคง
   ถูก mark ว่า **"not testable in this round"** อย่างชัดแจ้งใน test result ไม่ใช่ถูกละไว้เฉย ๆ —
   เงื่อนไขที่จะทำให้ทั้ง 4 ตัวนี้ย้ายออกจากกลุ่มนี้ในการรันรอบถัดไปคือ
   [`TASK-INFRA-01`](../../01-requirements/03-task/phase-1-mvp-core-loop.md) (ติดตั้ง backend/
   ระบบบัญชีผู้ใช้จริง ตาม MVP Phase ของ [release-plan.md](../../01-requirements/02-plan/release-plan.md))
   ต้องเสร็จจริงก่อน — **ปัจจุบันยังเป็น "ยังไม่เริ่ม" จึงยังไม่เปลี่ยนสถานะ testability ในรอบนี้** —
   **NFR-13** (เพิ่ม 2026-08-29) technically ตรวจสอบได้ทันทีจาก prototype เหมือน NFR-09/10 (ไม่ต้องรอ
   backend) แต่ผูกกับ INT-1 เท่านั้นซึ่งอยู่ใน Epic 4 (Could, นอกขอบเขต execution รอบนี้ตาม §1) จึงยังไม่
   นับเป็นเงื่อนไข exit ของรอบนี้เช่นเดียวกับ Feature ID อื่นของ Epic 4 (ดูข้อ 3) — AC-INT-1-04/
   TC-INT-1-005 เตรียมพร้อม execute ทันทีเมื่อ Epic 4 เข้า scope
5. ความเสี่ยงทั้งหมดใน §4 ถูกบันทึกสถานะ (resolved / accepted-as-is / deferred พร้อมเหตุผล) ก่อนปิดรอบ
   — ไม่จำเป็นต้อง resolve ทุกข้อ แต่ต้องมีการตัดสินใจที่ชัดเจนต่อแต่ละข้อ ไม่ใช่ถูกลืม
6. ผลการทดสอบถูกบันทึกไว้ใน `docs/03-testing/02-test-result/` และสรุปไว้ใน
   `docs/05-log/{YYYYMMDD}-log.md` ของวันที่ทดสอบเสร็จ

---

## เอกสารอ้างอิง

- [docs/01-requirements/backlog.md](../../01-requirements/backlog.md) — ที่มาของ MoSCoW Priority และ
  ขอบเขตในหัวข้อ 1
- [Non-Functional Requirements (NFR-01–NFR-13)](../../01-requirements/01-spec/20260827-05-non-functional-requirements.md)
  — ที่มาของหัวข้อ 2 (NFR-driven Testing) และความเสี่ยง R6–R12 ในหัวข้อ 4
- [docs/02-design/01-prototypes/user-journeys.md](../../02-design/01-prototypes/user-journeys.md) —
  อ้างอิง flow/Preconditions ที่ใช้ในการออกแบบ Usability Testing ของ onboarding
- `docs/01-requirements/01-spec/` ทั้ง 4 ไฟล์ — ที่มาของความเสี่ยง R1–R5, R13, R14 ในหัวข้อ 4 (ดูลิงก์ต่อแถวใน
  ตาราง; R13 มาจาก Onboarding spec ส่วน ONB-0 ที่เพิ่ม 2026-08-29; R14 มาจาก Smart Integrations spec ส่วน
  กลไก pairing-code ที่เพิ่ม 2026-08-30)
- [Release Plan](../../01-requirements/02-plan/release-plan.md) และ
  [TASK-INFRA-01](../../01-requirements/03-task/phase-1-mvp-core-loop.md) — เงื่อนไขที่จะ unblock
  NFR-04/06/08/11/12 และ ONB-0/AC-ONB-0-06 จาก "not testable in this round" (R7, R11, R12, R13, §5 ข้อ 4)
- ผลการทดสอบจริง: [docs/03-testing/02-test-result/](../02-test-result/index.md)
