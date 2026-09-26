# ผลการรันเทสต์ — smartFit_daily

**อัปเดตล่าสุด:** 2026-09-26 22:03 (เวลาไทย, UTC+7) — รอบที่ 4 รันใหม่ทั้งหมดที่ commit `ce03139` หลังเพิ่ม E2E ชุด
ในเครื่อง (onboarding / planner / บันทึกผล) และแก้ bug planner แล้ว deploy ขึ้น Cloud Run revision
`smartfit-daily-web-00006-ncw`

| ชุดเทสต์ | เครื่องมือ | เวลาที่รัน | ผล |
|---|---|---|---|
| Unit / API route tests (`apps/web/server/**/*.test.ts`) | Vitest | 22:02:46 (ใช้เวลา 0.8 วินาที) | ✅ ผ่าน 111/111 (15 ไฟล์) |
| E2E ในเครื่อง + Firebase Emulator (`apps/web/e2e-local/*.spec.ts`) | Playwright | 22:02:48 (ใช้เวลา 19.4 วินาที) | ✅ ผ่าน 12/12 (onboarding 2 + planner 2 + บันทึกผล 2 เทสต์ × desktop/mobile) |
| E2E production อ่านอย่างเดียว (`apps/web/e2e/*.spec.ts`) กับ `https://smartfit-daily.web.app` | Playwright | 22:03:08 (ใช้เวลา 11.3 วินาที) | ✅ ผ่าน 14/14 (smoke 3 + login 4 เทสต์ × desktop/mobile) |
| `apps/mobile` | — | — | ไม่มีเทสต์ (สคริปต์ `test` แค่พิมพ์ว่า "no tests yet") |

**รวม: ผ่าน 137 จาก 137** (unit/API 111 + E2E ในเครื่อง 12 + E2E production 14) — **ไม่มีข้อที่ไม่ผ่านในรอบนี้**

### ประวัติการรันวันนี้

| รอบ | เวลา | ผล |
|---|---|---|
| 1 | 20:36 | unit 110/110, E2E smoke 6/6 (ยังไม่มี E2E ชุด login) |
| 2 | 21:13–21:19 | E2E production 14/14 (ผู้ใช้รันเองหลัง deploy `00005-vtr`), unit ⚠️ flaky 1 ข้อ ไม่ผ่าน 2 จาก 16 รอบ — แก้แล้ว รันซ้ำ 50 รอบ (21:20–21:21) ผ่านครบ ดู [ข้อที่เคยไม่ผ่าน](#ข้อที่เคยไม่ผ่าน) |
| 3 | 21:25 | unit 110/110, E2E production 14/14 |
| — | ระหว่างรอบ 3 และ 4 | สร้าง E2E ในเครื่อง: รันครั้งแรกไม่ผ่าน 1 ข้อเพราะเจอ **bug จริงใน planner** (ดู [ข้อที่เคยไม่ผ่าน](#ข้อที่เคยไม่ผ่าน)) — แก้แล้ว ผ่าน 12/12 ติดกัน 4 รอบ, unit 111/111 |
| 4 | 22:02–22:03 | unit 111/111, E2E ในเครื่อง 12/12, E2E production 14/14 (หลัง deploy `00006-ncw`) |

คำสั่งที่ใช้ (รันจาก `smartfit_daily_app/apps/web/`):

```bash
npx vitest run          # unit + API route tests
npx playwright test     # E2E บนเว็บที่ deploy แล้ว (อ่านอย่างเดียว ไม่สร้างข้อมูลจริง)
npm run test:e2e:local  # E2E ในเครื่อง: เปิด Firebase Emulator + API + Vite เอง (ต้องมี Java 11+)
```

---

## ข้อที่เคยไม่ผ่าน

### 1. API route test flaky (รอบ 2 — แก้แล้ว)

| เทสต์ | ไฟล์ | ผล |
|---|---|---|
| `POST /api/forgot-password` › missing email → 400 | `server/routes/account-session/forgotPassword.test.ts:18` | ก่อนแก้ ไม่ผ่าน 2 จาก 16 รอบ (รอบ 21:17:02 และรอบที่ 12 จากการรันซ้ำ) · **หลังแก้ ผ่าน 50/50 รอบ ✅** |

**ติดตรงไหน:** เทสต์ล้มก่อนจะได้ตรวจสถานะ `400` เลย — การส่ง request ไปยัง test server พังด้วย
`TypeError: fetch failed` (สาเหตุ `SocketError: other side closed`) ที่ `server/test/testApp.ts:49` จึงไม่ใช่
bug ของ route forgot-password เอง (route นี้ไม่ได้ถูกแก้ตั้งแต่รอบแรก และรอบที่ผ่านก็ได้ `400` ถูกต้อง)

**สาเหตุ:** `request()` ใน `testApp.ts` เปิด server ใหม่บน port สุ่มทุกครั้งแล้วปิด
ทิ้ง แต่ `fetch` ของ Node เก็บ connection แบบ keep-alive ไว้ใช้ซ้ำ ถ้าระบบปฏิบัติการสุ่มได้ port เดิมของ
server ที่ปิดไปแล้ว `fetch` อาจหยิบ connection เก่าที่ตายแล้วมาใช้ ทำให้ได้ "other side closed" — ข้อนี้เป็น
ข้อแรกของไฟล์จึงเจอบ่อยสุด แต่เทสต์ route อื่นที่ใช้ `request()` ก็อาจเจอได้เช่นกัน

**แก้แล้ว (21:20):** `request()` ใน `server/test/testApp.ts` เปลี่ยนจาก `fetch` เป็น `http.request` ของ Node กับ
`agent: false` (ไม่ใช้ connection ซ้ำ), รอให้ server พร้อมรับ connection (`listening`) ก่อนส่ง request, และปิด
connection ทั้งหมดก่อนปิด server — แก้เฉพาะไฟล์ช่วยทดสอบ ไม่แตะโค้ดแอป typecheck และ lint ผ่าน
**ยืนยันผล:** รันทั้งชุด 50 รอบติดกัน ผ่าน 110/110 ทุกรอบ (ถ้ายังพังในอัตราเดิม 2/16 โอกาสที่จะผ่าน 50 รอบติดโดย
บังเอิญต่ำกว่า 0.2%) — ยังไม่ได้พิสูจน์สาเหตุแยกต่างหาก แต่การหายไปหลังแก้จุดนี้สอดคล้องกับสาเหตุข้างบน

### 2. E2E planner Cheat/Rest ไม่ผ่านเพราะ bug จริงในแอป (ตอนสร้าง E2E ในเครื่อง — แก้แล้ว)

| เทสต์ | ไฟล์ | ผล |
|---|---|---|
| set today as Cheat/Rest Day → day counts as completed, streak 1 | `e2e-local/planner.spec.ts` | ครั้งแรกไม่ผ่าน (desktop) · **หลังแก้แอป ผ่านทุกรอบ ✅** |

**ติดตรงไหน:** เปิดสวิตช์ Cheat/Rest ของวันนี้แล้วกด "บันทึก" แต่ค่า `isCheatRest` ของวันนี้ไม่เปลี่ยนเป็น `true` —
log ของ server แสดงว่า `PUT /api/planner/days/:date` ตอบ 500 ด้วย `Cannot use "undefined" as a Firestore value
(found in field "plannedActivityType")` หน้า planner จึงหยุดก่อนจะส่งคำขอตั้ง Cheat/Rest

**สาเหตุ:** เมื่อไม่ได้เลือกประเภทกิจกรรม ("ปล่อยว่าง (แนะนำอัตโนมัติ)" หรือบันทึกแค่ Cheat/Rest) server เขียน
`plannedActivityType: undefined` ลง Firestore ซึ่ง Firestore จริงไม่รับ — **เป็น bug ของเว็บจริงด้วย** ไม่ใช่แค่ของเทสต์
API test เดิมจับไม่ได้เพราะไม่มีข้อไหนส่งคำขอที่ไม่มีค่านี้

**แก้แล้ว:** `server/routes/planner-day-status/index.ts` เขียน `{ isDefaultAuto: true }` แทน (commit `d1c5e62`)
เพิ่ม API test กรณีนี้ (unit/API จาก 110 เป็น 111 ข้อ) และ TC-PLN-1-005 ในเอกสาร test case — deploy แล้วใน
revision `00006-ncw`

---

## 1. E2E production (Playwright, อ่านอย่างเดียว) — รัน 22:03:08 กับ revision `00006-ncw`

เทสต์แต่ละข้อรัน 2 รอบ คือบน Desktop Chrome และบนมือถือ (Pixel 7)

### `e2e/smoke.spec.ts`

| เทสต์ | ทดสอบอะไร | Desktop | Mobile |
|---|---|---|---|
| home page loads the app | เปิดหน้าแรกแล้วเว็บโหลดได้ ชื่อแท็บเป็น `smartFit_daily` | ✅ | ✅ |
| signed-out visitor can reach the welcome screen and open login | ผู้ใช้ที่ยังไม่ล็อกอินเห็นปุ่ม "สมัครสมาชิก" ที่หน้า `/welcome` และกด "มีบัญชีอยู่แล้ว? เข้าสู่ระบบ" แล้วไปถึงหน้า `/login` | ✅ | ✅ |
| API rejects requests without a session (ONB-0 / REQ-15) | เรียก `GET /api/profile` โดยไม่ล็อกอิน แล้ว server ตอบ 401 (ปฏิเสธ) | ✅ | ✅ |

### `e2e/login.spec.ts` (ใหม่ — ONB-0 / REQ-15)

| เทสต์ | ทดสอบอะไร | Desktop | Mobile |
|---|---|---|---|
| empty email and password show validation errors and stay on login | กด "เข้าสู่ระบบ" โดยไม่กรอกอะไร เห็น "กรุณากรอกอีเมล" และ "กรุณากรอกรหัสผ่าน" และยังอยู่ `/login` (TC-ONB-0-010) | ✅ | ✅ |
| wrong credentials show an error and stay on login | login ด้วยอีเมลที่ไม่มีบัญชี เห็น "อีเมลหรือรหัสผ่านไม่ถูกต้อง" ไม่มีข้อความ `Firebase`/`auth/` และยังอยู่ `/login` (TC-ONB-0-009) — ข้อนี้ผ่านกับเว็บจริงได้หลัง deploy `00005-vtr` เท่านั้น | ✅ | ✅ |
| TC-ONB-0-002 — valid credentials log in to the dashboard and the session survives a reload | login ด้วยบัญชีตัวอย่าง `sample.arunee@smartfit-daily.test` เข้า Dashboard เห็น "สวัสดี อรุณี เริ่มต้นใหม่" แล้ว reload ยังล็อกอินอยู่ (ดัก `/api/workouts/**` ไว้เพื่อไม่ให้เขียนข้อมูลจริง) | ✅ | ✅ |
| signed-out visitor opening a protected page is redirected to welcome | เปิด `/planner` ตอนยังไม่ล็อกอิน แล้วถูกพาไป `/welcome` | ✅ | ✅ |

---

## 2. E2E ในเครื่อง + Firebase Emulator (Playwright) — รัน 22:02:48

รันกับ Auth/Firestore emulator (project `demo-smartfit` ต่อ project จริงไม่ได้) + Express API + Vite ที่ Playwright
เปิดเอง ข้อมูลอยู่ในหน่วยความจำและหายหลังรันจบ จึงทดสอบ flow ที่เขียนข้อมูลได้ วิดีโอแนะนำถูก stub ที่เบราว์เซอร์
(ไม่เรียก YouTube/Gemini) ผู้ใช้ทดสอบ: หญิง 25 ปี 60 กก. 165 ซม. ปานกลาง, ไม่มีอุปกรณ์, "กระชับสัดส่วน" →
เป้าเผาผลาญ 180 kcal/วัน

| เทสต์ | ทดสอบอะไร | Desktop | Mobile |
|---|---|---|---|
| `onboarding.spec.ts` › new user signs up and completes onboarding to the dashboard | สมัครสมาชิก → กรอกข้อมูลส่วนตัว → เลือก "ไม่มีอุปกรณ์" → "กระชับสัดส่วน" → หน้ายืนยันแสดง 180 → เข้า Dashboard แล้วเช็กผ่าน API ว่า TDEE 2,085 และเป้า 180 kcal ถูกบันทึก (ONB-0 → ONB-3) | ✅ | ✅ |
| `onboarding.spec.ts` › personal info with missing fields shows errors and does not advance | กด "ถัดไป" โดยไม่เลือกเพศและระดับกิจกรรม → ขึ้น error ทั้งสองข้อ และยังอยู่หน้าเดิม (AC-ONB-1-02) | ✅ | ✅ |
| `planner.spec.ts` › plan today's activity type | วันที่ยังไม่วางแผนเป็นแนะนำอัตโนมัติ แล้วตั้งวันนี้เป็น HIIT → server บันทึก `hiit` (TC-PLN-1-001, TC-PLN-1-003) | ✅ | ✅ |
| `planner.spec.ts` › set today as Cheat/Rest Day | เปิดสวิตช์ Cheat/Rest วันนี้แล้วบันทึก → วันนี้นับว่าครบเป้า streak 1 (TC-PLN-2-001) — ข้อนี้เจอ bug ด้านบน | ✅ | ✅ |
| `logging.spec.ts` › 31-minute session reaches the 180 kcal target | เริ่มออกกำลังกาย เร่งเวลา 31 นาที กด "จบเซสชัน" → เห็น "ครบเป้าหมายวันนี้แล้ว" 186 kcal, server บันทึก log `completed` 186 kcal, streak 1 (REC-2 → PLN-3 → PLN-4) | ✅ | ✅ |
| `logging.spec.ts` › 10-minute session stays under the target | แบบเดียวกันแต่ 10 นาที → "วันนี้ยังไม่ครบเป้า" 60 kcal, log `incomplete`, streak 0 (TC-PLN-3-004) | ✅ | ✅ |

---

## 3. Unit & API route tests (Vitest) — รัน 22:02:46

ผ่านครบ 111/111 (ก่อนแก้เทสต์ flaky ในรอบที่ 2 `forgotPassword.test.ts` › missing email → 400 เคยไม่ผ่าน
2 จาก 16 รอบ ดู [ข้อที่เคยไม่ผ่าน](#ข้อที่เคยไม่ผ่าน))

### 3.1 Domain logic (สูตรคำนวณและกฎทางธุรกิจ)

#### `server/domain/tdee.test.ts` — คำนวณ TDEE (ONB-1 / REQ-01)

| เทสต์ | ทดสอบอะไร | ผล |
|---|---|---|
| TC-ONB-1-001 | ชาย 30 ปี 75kg 175cm ออกกำลังปานกลาง → TDEE 2,633 kcal/วัน | ✅ |
| TC-ONB-1-002 | หญิง 28 ปี 60kg 165cm ออกกำลังเบา → 1,829 kcal/วัน | ✅ |
| TC-ONB-3-005/008 (precondition) | หญิง 70 ปี 32kg 135cm ไม่ออกกำลัง → 783 kcal/วัน | ✅ |

#### `server/domain/goalTargets.test.ts` — เป้าหมายแคลอรี่ตาม Goal (ONB-3 / REQ-02)

| เทสต์ | ทดสอบอะไร | ผล |
|---|---|---|
| TC-ONB-3-001 (burn) | ลดน้ำหนัก 75kg → เป้าเผาผลาญ 337.5 kcal/วัน (ค่าจริง ไม่ปัดเป็น 338) | ✅ |
| TC-ONB-3-002 (burn) | กระชับ 75kg → 225.0 kcal/วัน | ✅ |
| TC-ONB-3-003 (burn) | เพิ่มความทนทาน 75kg → 412.5 kcal/วัน (ไม่ปัด) | ✅ |
| TC-ONB-3-005 (burn) | เพิ่มความทนทาน 32kg → 176.0 kcal/วัน | ✅ |
| TC-ONB-3-008 (burn) | กระชับ 32kg → 96.0 kcal/วัน เป้าเผาผลาญไม่ถูกบังคับขั้นต่ำ | ✅ |
| TC-ONB-3-001 (intake) | ลดน้ำหนัก TDEE 2,633 → ควรกิน 2,133 kcal/วัน | ✅ |
| TC-ONB-3-002 (intake) | กระชับ TDEE 2,633 → 2,633 kcal/วัน (คงน้ำหนัก) | ✅ |
| TC-ONB-3-003 (intake) | เพิ่มความทนทาน TDEE 2,633 → 2,933 kcal/วัน | ✅ |
| TC-ONB-3-005 (intake) | TDEE 783 ได้ 1,083 ซึ่งต่ำกว่าขั้นต่ำ → ปรับเป็น 1,200 และติดธง safety floor | ✅ |
| TC-ONB-3-008 (intake) | TDEE 783 ได้ 783 → ปรับเป็น 1,200 (ต่างจากเป้าเผาผลาญที่ไม่ปรับ) | ✅ |
| boundary: เท่ากับ 1,200 พอดี | ค่าที่เท่ากับ 1,200 ไม่ถูกปรับ (ปรับเฉพาะเมื่อต่ำกว่า) | ✅ |
| boundary: 1,199 | ต่ำกว่าขั้นต่ำ 1 kcal → ถูกปรับเป็น 1,200 | ✅ |

#### `server/domain/metCalorieBurn.test.ts` — แคลอรี่จากสูตร MET และค่าจาก wearable (REC-2 / REQ-05, INT-3 / REQ-13)

| เทสต์ | ทดสอบอะไร | ผล |
|---|---|---|
| TC-REC-2-001 | คาร์ดิโอระดับกลาง (MET 6) 70kg 30 นาที → 210 kcal | ✅ |
| TC-REC-2-002 | HIIT ระดับสูง (MET 10) 60kg 20 นาที → 200 kcal | ✅ |
| TC-REC-2-003 | หยุดกลางคลิป: นับเฉพาะ 24 นาทีที่เล่นจริง ไม่ใช่ทั้งคลิป 45 นาที → 150 kcal | ✅ |
| TC-REC-4-003 | ช่วง main ของ session HIIT ระดับสูง ใช้สูตรเดียวกัน → 200 kcal | ✅ |
| TC-REC-2-001 (select) | ไม่มีค่าจาก wearable → ใช้ค่าจากสูตร MET | ✅ |
| TC-REC-2-004 (select) | มีค่าจาก wearable (255 kcal) → ใช้ค่านี้แทนค่า MET (~238 kcal) | ✅ |

#### `server/domain/sessionVideos.test.ts` — วอร์มอัพ/คูลดาวน์อัตโนมัติ (REC-4 / REQ-07)

| เทสต์ | ทดสอบอะไร | ผล |
|---|---|---|
| TC-REC-4-001 | คลิปความเข้มข้นสูง 20 นาที → วอร์มอัพ 3 + main 20 + คูลดาวน์ 3 รวม 26 นาที | ✅ |
| TC-REC-4-002 | คลิปความเข้มข้นกลาง 25 นาที → มีแค่ main ไม่มีวอร์มอัพ/คูลดาวน์ | ✅ |
| low intensity | คลิปความเข้มข้นต่ำก็ไม่มีวอร์มอัพ/คูลดาวน์ (ใส่ให้เฉพาะระดับสูง) | ✅ |

#### `server/domain/dailyLog.test.ts` — บันทึกรายวันแบบ all-or-nothing (PLN-3 / REQ-10, INT-3 / REQ-13)

| เทสต์ | ทดสอบอะไร | ผล |
|---|---|---|
| TC-PLN-3-001 | ได้ 100% ของเป้าพอดี (500/500) → สำเร็จ | ✅ |
| TC-PLN-3-002 | เกินเป้า (650/500) → สำเร็จ และไม่มีคะแนนพิเศษ | ✅ |
| TC-PLN-3-003 | ได้ 99% (495/500) → ไม่สำเร็จ (ไม่มีคะแนนบางส่วน) | ✅ |
| TC-PLN-3-004 | ได้ 70% (350/500) → ไม่สำเร็จ | ✅ |
| session แรกของวัน | สร้าง log ใหม่เมื่อวันนั้นยังไม่มี log | ✅ |
| session ที่สองในวันเดียวกัน | บวกเพิ่มจากค่าเดิม ไม่เขียนทับ | ✅ |
| delta ครั้งแรก | ครั้งแรกบันทึกแคลอรี่ของ session เต็มจำนวน | ✅ |
| delta ครั้งแรกถึงเป้าพอดี | ถึงเป้าพอดี → สำเร็จ | ✅ |
| wearable มาทีหลัง (+40) | ค่า wearable ที่มาทีหลังดันวันที่ยังไม่สำเร็จ (460) ให้ผ่านเป้า | ✅ |
| wearable มาทีหลัง (−60) | ค่า wearable ต่ำกว่าค่า MET ทำให้วันนั้นกลับมาต่ำกว่าเป้าได้ | ✅ |
| re-sync ซ้ำ | sync ค่าเดิมซ้ำ → delta = 0 ไม่นับซ้ำ | ✅ |

#### `server/domain/streak.test.ts` — นับ Streak (PLN-4 / REQ-09, REQ-10)

| เทสต์ | ทดสอบอะไร | ผล |
|---|---|---|
| TC-PLN-4-001 | นับต่อผ่าน Cheat/Rest Day จนถึงวันแรกที่ไม่สำเร็จ → streak 3 | ✅ |
| TC-PLN-4-002 | วันนี้ไม่มี log และไม่ใช่ Cheat/Rest → streak กลับเป็น 0 แม้เคยได้ 5 วัน | ✅ |
| TC-PLN-4-003 | วันนี้ได้ 99% → streak ขาดทันที (ไม่มีช่วงผ่อนผัน) → 0 | ✅ |
| TC-PLN-4-004 | วันนี้ได้ 90% → streak ขาดเช่นกัน → 0 | ✅ |
| edge: ขาดกลางทาง | streak ที่ขาดในอดีตหยุดนับที่ช่องว่างแรก | ✅ |
| edge: สำเร็จทุกวัน | ถ้าสำเร็จทุกวัน นับได้ไม่เกิน `maxDays` ไม่วนไม่รู้จบ | ✅ |

#### `server/domain/weightForecast.test.ts` — พยากรณ์วันถึงน้ำหนักเป้าหมาย (INT-1 / REQ-11)

| เทสต์ | ทดสอบอะไร | ผล |
|---|---|---|
| TC-INT-1-001 | 80 → 75kg ขาดดุลเฉลี่ย 500 kcal/วัน → อีก 77 วัน (12 พ.ย. 2569) | ✅ |
| TC-INT-1-002 | log น้อยกว่า 7 วัน → ข้อมูลไม่พอ (`not_enough_history`) | ✅ |
| TC-INT-1-003 | ขาดดุลเฉลี่ย 0 พอดี → `no_meaningful_deficit` | ✅ |
| TC-INT-1-004 | ขาดดุลเฉลี่ยติดลบ (ไปทางตรงข้ามกับเป้า) → `no_meaningful_deficit` | ✅ |
| edge: ถึงเป้าแล้ว | น้ำหนักปัจจุบันเท่ากับหรือต่ำกว่าเป้าแล้ว → `already_at_or_below_target` | ✅ |
| edge: ไม่รู้น้ำหนัก | ไม่มีน้ำหนักปัจจุบัน → `already_at_or_below_target` | ✅ |
| TC-INT-1-009 | boundary: 6 วัน (ขาด 1 วัน) → ยังไม่พอ | ✅ |
| ค่าคงที่ขั้นต่ำ | `MIN_LOG_DAYS_FOR_FORECAST` = 7 วันตามที่ตัดสินใจเมื่อ 2026-09-26 | ✅ |
| TC-INT-1-010 | boundary: ครบ 7 วันพอดี → พยากรณ์ได้ | ✅ |

#### `server/domain/pairingRateLimit.test.ts` — จำกัดการจับคู่อุปกรณ์ (INT-0 / REQ-18: ผิดได้ 5 ครั้งต่อ 15 นาที)

| เทสต์ | ทดสอบอะไร | ผล |
|---|---|---|
| ยังไม่เคยผิด | ไม่ถูกล็อก และไม่มีเวลารอ | ✅ |
| ผิดครั้งที่ 4 | ยังไม่ล็อก | ✅ |
| ผิดครั้งที่ 5 | ล็อกทันที | ✅ |
| ครบ 15 นาทีพอดี | หมดช่วงเวลาแล้ว → ปลดล็อก | ✅ |
| ก่อนครบ 15 นาที 1ms | ยังล็อกอยู่ | ✅ |
| ผิดหลังหมดช่วงเวลา | เริ่มนับรอบใหม่ ไม่ต่อจากรอบเก่า | ✅ |
| จับคู่สำเร็จ | ล้างสถานะแล้ว → ไม่ล็อก | ✅ |

### 3.2 Middleware

#### `server/middleware/authenticate.test.ts` — ต้องล็อกอินก่อนเข้าถึงข้อมูล (ONB-0 / REQ-15)

| เทสต์ | ทดสอบอะไร | ผล |
|---|---|---|
| ไม่มี Authorization header | ตอบ 401 | ✅ |
| token ผิดหรือหมดอายุ | ตอบ 401 | ✅ |
| token ถูกต้อง | ผ่านได้ และตั้ง `req.userId` จาก token | ✅ |

### 3.3 API routes (จำลอง Firestore, YouTube และ AI — ไม่แตะระบบจริง)

#### `server/routes/account-session/forgotPassword.test.ts` — `POST /api/forgot-password` (ONB-0 / REQ-16)

| เทสต์ | ทดสอบอะไร | ผล |
|---|---|---|
| ไม่ส่ง email | ตอบ 400 | ✅ (ก่อนแก้ flaky 14/16, หลังแก้ 50/50) |
| TC-ONB-0-003 | บัญชี email/password → ตอบ 202 "sent" และไม่ส่งลิงก์รีเซ็ตกลับมาใน response | ✅ |
| TC-ONB-0-004 | บัญชี Google → ตอบ 422 (ไม่มีรหัสผ่านให้รีเซ็ต) | ✅ |
| email ที่ไม่มีในระบบ | ตอบ 202 เหมือนบัญชีจริง (กันการเดาว่ามี email นี้ไหม) | ✅ |

#### `server/routes/personalization-profile/index.test.ts` — โปรไฟล์ อุปกรณ์ และเป้าหมาย (ONB-1/2/3)

| เทสต์ | ทดสอบอะไร | ผล |
|---|---|---|
| TC-ONB-2-001 | เลือกอุปกรณ์ 1 ชิ้น (ดัมเบล) → บันทึกได้ | ✅ |
| TC-ONB-2-002 | เลือกหลายชิ้น (ดัมเบล + ยิม) → บันทึกตามที่เลือก | ✅ |
| TC-ONB-2-003 | เลือก "ไม่มีอุปกรณ์" อย่างเดียว → บันทึกได้ | ✅ |
| "none" ปนกับอุปกรณ์อื่น | ตอบ 400 และไม่บันทึกอะไร | ✅ |
| TC-ONB-2-004 | เปลี่ยนอุปกรณ์ทีหลัง → แทนที่ของเดิม ข้อมูลโปรไฟล์อื่นยังอยู่ | ✅ |
| GET ก่อนทำ ONB-1 | ตอบ 404 | ✅ |
| displayName ว่าง | ตอบ 400 | ✅ |
| น้ำหนัก ≤ 0 | ตอบ 400 | ✅ |
| TC-ONB-1-001 | บันทึกข้อมูลส่วนตัวที่ถูกต้อง แล้ว GET ได้ข้อมูลเดิมกลับมา | ✅ |
| ตั้ง goal ก่อนทำ ONB-1 | ตอบ 409 | ✅ |
| ลดน้ำหนักแต่ไม่ใส่น้ำหนักเป้าหมาย | ตอบ 400 | ✅ |
| TC-ONB-3-001 | ลดน้ำหนัก 75kg → server คำนวณเผาผลาญ 337.5 และควรกิน 2,133 เอง โดยไม่ใช้ตัวเลขที่ client ส่งมา | ✅ |

#### `server/routes/content-recommendation/index.test.ts` — คลิปแนะนำประจำวัน/สลับคลิป/สร้าง session (REC-1, REC-3, REC-4)

| เทสต์ | ทดสอบอะไร | ผล |
|---|---|---|
| TC-REC-1-001 | ไม่มีอุปกรณ์ → ค้นคลิป bodyweight ใช้แคลอรี่ที่เหลือเท่ากับเป้า และเก็บผลไว้ใช้ทั้งวัน | ✅ |
| TC-REC-1-002 | มีดัมเบล → ค้นคลิปดัมเบล | ✅ |
| หักแคลอรี่ที่เผาไปแล้ว | แคลอรี่ที่เผาวันนี้แล้วถูกหักออกจากเป้าก่อนเลือกคลิป | ✅ |
| ขอซ้ำในวันเดียวกัน | ได้คลิปเดิมจาก cache โดยไม่เรียก YouTube/AI ใหม่ | ✅ |
| TC-REC-1-003 | ค้นแล้วไม่มีคลิปที่ใช้ได้ → ตอบ 409 และไม่ค้นซ้ำด้วยเงื่อนไขที่กว้างขึ้น | ✅ |
| TC-REC-1-004 | วันนี้เป็น Cheat Day → ตอบ 204 ไม่แนะนำคลิป | ✅ |
| TC-REC-3-001 | สลับคลิป → ไม่ได้คลิปเดิม และเป้าแคลอรี่เท่าเดิม | ✅ |
| สลับครั้งที่สอง | ไม่ได้คลิปที่เคยแสดงไปแล้ววันนี้ทุกคลิป | ✅ |
| TC-REC-3-002 | ไม่มีคลิปเหลือให้สลับ → ตอบ 409 และคงคลิปเดิมไว้ | ✅ |
| TC-REC-4-001 | สร้าง session ความเข้มข้นสูง → เก็บวอร์มอัพ + main + คูลดาวน์ | ✅ |
| TC-REC-4-002 | สร้าง session ความเข้มข้นกลาง → เก็บแค่ main | ✅ |

#### `server/routes/exertion-calorie/index.test.ts` — `POST /api/workouts/sessions/:sessionId/complete` (REC-2, PLN-3)

| เทสต์ | ทดสอบอะไร | ผล |
|---|---|---|
| TC-REC-2-005 | sessionId ที่ไม่มีอยู่ → ตอบ 404 และไม่บันทึกอะไร (NFR-12) | ✅ |
| TC-REC-2-001 | ไม่มีค่า wearable → บันทึกค่าจากสูตร MET | ✅ |
| TC-REC-2-004 | session มีค่า wearable อยู่แล้ว → ใช้ค่านั้นแทนค่า MET | ✅ |
| TC-PLN-3-003 | 495/500 kcal (99%) → ไม่สำเร็จ streak 0 | ✅ |
| TC-PLN-3-001 | 500/500 kcal → สำเร็จ streak 1 | ✅ |
| session ที่สองในวันเดียวกัน | นาทีและแคลอรี่บวกเพิ่ม ไม่เขียนทับ | ✅ |

#### `server/routes/planner-day-status/index.test.ts` — แผนรายสัปดาห์และ Cheat/Rest Day (PLN-1 / REQ-08, PLN-2 / REQ-09)

| เทสต์ | ทดสอบอะไร | ผล |
|---|---|---|
| สัปดาห์ปัจจุบัน | ได้สัปดาห์ จันทร์–อาทิตย์ ที่มีวันนี้อยู่ | ✅ |
| TC-PLN-1-003 | วันที่ไม่ได้วางแผน → ตั้งเป็นอัตโนมัติ (`isDefaultAuto = true`) | ✅ |
| TC-PLN-1-004 (GET) | วันในอดีตที่มี log แก้ไม่ได้ ส่วนวันในอดีตที่ไม่มี log และวันนี้แก้ได้ | ✅ |
| TC-PLN-1-001 | ตั้งประเภทกิจกรรมของวันนี้ (ยังไม่มี log) ได้ | ✅ |
| TC-PLN-1-002 | วางแผนวันในอนาคตล่วงหน้าได้ | ✅ |
| ไม่เลือกประเภทกิจกรรม (ใหม่) | "ปล่อยว่าง" หรือบันทึกแค่ Cheat/Rest → กลับเป็นแนะนำอัตโนมัติ และล้างแผนเดิม (TC-PLN-1-005 — กรณีที่เคยได้ 500) | ✅ |
| TC-PLN-1-004 (PUT) | แก้วันในอดีตที่มี log → ตอบ 409 แผนไม่เปลี่ยน | ✅ |
| TC-PLN-2-001 | ตั้ง Rest Day วันนี้ (ไม่มี log) → วันนั้นนับว่าสำเร็จ และคำนวณ streak ใหม่ | ✅ |
| TC-PLN-2-004 | ตั้ง Cheat Day ทับวันที่ "ไม่สำเร็จ" → นับว่าสำเร็จ และแคลอรี่เดิมยังอยู่ | ✅ |
| Cheat/Rest ล่วงหน้า | ตั้ง Cheat/Rest ให้วันในอนาคตที่ไม่มี log ได้ | ✅ |
| TC-PLN-2-006 | วันในอดีต → ตอบ 409 (ไม่มีข้อยกเว้น) และไม่บันทึกอะไร | ✅ |
| TC-PLN-2-005 | ยกเลิก Cheat/Rest ของวันนี้ก่อนหมดวันได้ | ✅ |
| ยกเลิกวันอื่นที่ไม่ใช่วันนี้ | ตอบ 409 | ✅ |

---

## ข้อสังเกต

- เทสต์ flaky 1 ข้อ (`forgotPassword.test.ts` › missing email → 400) ปัญหาอยู่ที่ตัวช่วยทดสอบ `testApp.ts` ไม่ใช่ route — แก้แล้ว รันซ้ำ 50 รอบผ่านครบ
- Unit/API tests จำลอง Firestore, YouTube และ AI ไว้ทั้งหมด จึงไม่ได้ทดสอบการเชื่อมต่อกับระบบจริง
- E2E production อ่านอย่างเดียว (ไม่สมัครหรือเขียนข้อมูล) จึงครอบคลุมแค่หน้าที่ไม่ต้องล็อกอินและการ login — flow ที่เขียนข้อมูล (onboarding, planner, บันทึกผล) ทดสอบด้วย E2E ในเครื่องแทน การแก้ bug planner บนเว็บจริงจึงยังไม่ได้ยืนยันด้วย E2E
- E2E ยังไม่ครอบคลุม REC-1/REC-3/REC-4 (การเลือกวิดีโอเรียก YouTube/Gemini จริงซึ่ง E2E stub ไว้) และ INT-0 ถึง INT-3
- `apps/mobile` (INT-2/INT-3) ยังไม่มีเทสต์เลย
- รอบนี้ไม่ได้รัน `npm run typecheck` และ `npm run lint` เพราะไม่ใช่เทสต์
