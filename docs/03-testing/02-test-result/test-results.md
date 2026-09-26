# ผลการทดสอบ (Test Results)

## ข้อมูลการรัน

| รายการ | ค่า |
|---|---|
| วันเวลาที่รัน (ล่าสุด) | **2026-09-26 20:02:35 (+07)** |
| รอบก่อนหน้า | 2026-09-26 14:33:38 (+07): 55/55 ผ่าน (commit `084e897`, มีแค่ unit test ของ domain) |
| คำสั่ง | `npm run test` (จาก `smartfit_daily_app/`) และ `npx vitest run --reporter=verbose` (จาก `apps/web/`) เพื่อดูรายละเอียดรายเทสต์ |
| Commit | `61c067d` + การแก้ที่ยังไม่ commit ของรอบนี้ (เพิ่ม API route test และเปลี่ยน INT-1 เป็นขั้นต่ำ 7 วัน) |
| สภาพแวดล้อม | macOS (Darwin 25.5.0), Node v22.23.2, Vitest v2.1.9 |
| ระยะเวลา | ~1.0 วินาที |

## สรุปผลรวม

| Workspace | ชนิดเทสต์ | ไฟล์เทสต์ | จำนวนเทสต์ | ผ่าน | ไม่ผ่าน |
|---|---|---|---|---|---|
| `apps/web` | Unit test ของ domain logic (`server/domain/`) | 8 | 57 | **57** | 0 |
| `apps/web` | API route test (`server/routes/`, `server/middleware/`) | 7 | 53 | **53** | 0 |
| `apps/mobile` | — | — | 0 (ยังไม่มีเทสต์ สคริปต์ `test` แค่พิมพ์ "no tests yet") | — | — |
| `packages/shared-types` | — | — | ไม่มีสคริปต์ `test` | — | — |
| **รวม** | | **15** | **110** | **110 ✅** | **0** |

**ผลรวม: ผ่านทั้งหมด 110/110 ข้อ ไม่มีข้อที่ไม่ผ่าน**

> **API route test ทำงานอย่างไร**: เรียก Express route จริงผ่าน HTTP บน port ชั่วคราว แต่ใช้ Firestore/Auth
> ปลอมในหน่วยความจำ (`server/test/fakeFirebase.ts`) แทน Firebase จริง และ stub YouTube Data API กับ Gemini
> จึงทดสอบ validation, status code, การเขียนข้อมูล, cache และกฎธุรกิจของ route ได้ แต่**ไม่ได้ทดสอบ**
> Firestore Security Rules, พฤติกรรมจริงของ Firebase และคุณภาพการเลือกวิดีโอของ AI
>
> **ยังไม่มี**: UI test ของ client และเทสต์ของแอป mobile (INT-2/INT-3 pairing, Bluetooth, HealthKit/Health Connect)
>
> ข้อความเตือน "The CJS build of Vite's Node API is deprecated" ขึ้นตอนรัน เป็นแค่คำเตือน ไม่มีผลต่อผลเทสต์
>
> **การแก้ระหว่างรอบนี้**: ตอนรันครั้งแรก มี 1 ข้อไม่ผ่าน (`TC-REC-2-001` ของ route) เพราะในเทสต์ผมเขียนค่า
> `source` ผิดเป็น `met_estimate` แต่โค้ดจริงใช้ `met_formula` ปัญหาอยู่ที่เทสต์ ไม่ใช่โค้ด จึงแก้ที่เทสต์แล้วรันใหม่

---

## รายละเอียดรายเทสต์

### 1. `goalTargets.test.ts`: เป้าหมายแคลอรี่ตามเป้าหมาย (ONB-3 / REQ-02), 12 ข้อ ✅

**`computeDailyCalorieTargetKcal`**: เป้าเผาผลาญต่อวัน = น้ำหนัก × kcal/kg ตามเป้าหมาย (ค่าจริง ไม่ปัดเศษ และไม่มี floor)

| # | เทสต์ | ทดสอบอะไร | ผล |
|---|---|---|---|
| 1 | TC-ONB-3-001 | lose_weight, 75kg → 337.5 kcal/วัน (ไม่ปัดเป็น 338) | ✅ ผ่าน |
| 2 | TC-ONB-3-002 | tone_up, 75kg → 225.0 kcal/วัน | ✅ ผ่าน |
| 3 | TC-ONB-3-003 | build_endurance, 75kg → 412.5 kcal/วัน (ไม่ปัดเป็น 413) | ✅ ผ่าน |
| 4 | TC-ONB-3-005 | build_endurance, 32kg → 176.0 kcal/วัน | ✅ ผ่าน |
| 5 | TC-ONB-3-008 | tone_up, 32kg → 96.0 kcal/วัน ไม่ถูก floor แม้ต่ำกว่า SAFETY_FLOOR_MIN_KCAL มาก | ✅ ผ่าน |

**`computeDailyIntakeTarget`**: เป้าการกินต่อวัน = TDEE ± delta ตามเป้าหมาย โดยมี floor ขั้นต่ำ 1,200 kcal

| # | เทสต์ | ทดสอบอะไร | ผล |
|---|---|---|---|
| 6 | TC-ONB-3-001 | lose_weight, TDEE 2,633 → 2,133 kcal/วัน ไม่ถูก floor | ✅ ผ่าน |
| 7 | TC-ONB-3-002 | tone_up, TDEE 2,633 → 2,633 kcal/วัน (maintenance) | ✅ ผ่าน |
| 8 | TC-ONB-3-003 | build_endurance, TDEE 2,633 → 2,933 kcal/วัน | ✅ ผ่าน |
| 9 | TC-ONB-3-005 | build_endurance, TDEE 783 → ได้ 1,083 ซึ่งต่ำกว่า floor จึงถูกยกเป็น 1,200 (`isSafetyFloorApplied = true`) | ✅ ผ่าน |
| 10 | TC-ONB-3-008 | tone_up, TDEE 783 → ถูกยกเป็น 1,200 (ต่างจากเป้าเผาผลาญที่ไม่ถูก floor) | ✅ ผ่าน |
| 11 | boundary | ค่าดิบเท่ากับ 1,200 พอดี → **ไม่** floor (floor ใช้เฉพาะกรณีต่ำกว่า 1,200) | ✅ ผ่าน |
| 12 | boundary | ค่าดิบต่ำกว่า 1,200 อยู่ 1 kcal → floor | ✅ ผ่าน |

### 2. `tdee.test.ts`: คำนวณ TDEE (ONB-1 / REQ-01), 3 ข้อ ✅

| # | เทสต์ | ทดสอบอะไร | ผล |
|---|---|---|---|
| 1 | TC-ONB-1-001 | ชาย 30 ปี 75kg 175cm กิจกรรมปานกลาง → 2,633 kcal/วัน | ✅ ผ่าน |
| 2 | TC-ONB-1-002 | หญิง 28 ปี 60kg 165cm กิจกรรมเบา → 1,829 kcal/วัน | ✅ ผ่าน |
| 3 | TC-ONB-3-005/008 precondition | หญิง 70 ปี 32kg 135cm นั่งทำงาน → 783 kcal/วัน | ✅ ผ่าน |

### 3. `metCalorieBurn.test.ts`: แคลอรี่ที่เผาผลาญ (REC-2 / REQ-05, INT-3 / REQ-13), 6 ข้อ ✅

**`computeMetCalorieBurnKcal`**: kcal = MET × น้ำหนัก × ชั่วโมง

| # | เทสต์ | ทดสอบอะไร | ผล |
|---|---|---|---|
| 1 | TC-REC-2-001 | cardio ระดับกลาง (MET 6.0), 70kg, 30 นาทีจริง → 210 kcal | ✅ ผ่าน |
| 2 | TC-REC-2-002 | HIIT ระดับสูง (MET 10.0), 60kg, 20 นาที → 200 kcal | ✅ ผ่าน |
| 3 | TC-REC-2-003 | หยุดกลางคัน: นับเฉพาะ 24 นาทีที่เล่นจริง ไม่ใช่ความยาววิดีโอทั้งหมด 45 นาที → 150 kcal | ✅ ผ่าน |
| 4 | TC-REC-4-003 | ช่วง main ของ session HIIT, 60kg, 20 นาที → 200 kcal | ✅ ผ่าน |

**`selectActualCalorieBurn`**: ถ้ามีค่าจาก wearable ให้ใช้ค่านั้นแทนค่าประมาณจาก MET

| # | เทสต์ | ทดสอบอะไร | ผล |
|---|---|---|---|
| 5 | TC-REC-2-001 | ไม่มี wearable → ใช้ค่าจากสูตร MET | ✅ ผ่าน |
| 6 | TC-REC-2-004 | มีค่า wearable 255 kcal → ใช้แทนค่าประมาณ MET ≈238 kcal | ✅ ผ่าน |

### 4. `sessionVideos.test.ts`: warmup/cooldown อัตโนมัติ (REC-4 / REQ-07), 3 ข้อ ✅

| # | เทสต์ | ทดสอบอะไร | ผล |
|---|---|---|---|
| 1 | TC-REC-4-001 | วิดีโอหลักความเข้มข้นสูง 20 นาที → warmup 3 + main 20 + cooldown 3 = 26 นาที | ✅ ผ่าน |
| 2 | TC-REC-4-002 | ความเข้มข้นกลาง 25 นาที → มีแค่ main ไม่มี warmup/cooldown | ✅ ผ่าน |
| 3 | edge | ความเข้มข้นต่ำ → ไม่มี warmup/cooldown (มีเฉพาะระดับ "high") | ✅ ผ่าน |

### 5. `dailyLog.test.ts`: บันทึกรายวันแบบ all-or-nothing (PLN-3 / REQ-10, INT-3 / REQ-13), 11 ข้อ ✅

**`determineLogCompletionStatus`**: ครบ 100% ของเป้าถึงจะนับว่า completed ไม่มี partial credit

| # | เทสต์ | ทดสอบอะไร | ผล |
|---|---|---|---|
| 1 | TC-PLN-3-001 | 500/500 (100% พอดี) → completed | ✅ ผ่าน |
| 2 | TC-PLN-3-002 | 650/500 (130%) → completed ไม่มีระดับโบนัส | ✅ ผ่าน |
| 3 | TC-PLN-3-003 | 495/500 (99%) → incomplete (boundary สำคัญที่สุดของ PLN-3) | ✅ ผ่าน |
| 4 | TC-PLN-3-004 | 350/500 (70%) → incomplete | ✅ ผ่าน |

**`accumulateDailyLog`**: session ที่ 2 ในวันเดียวกันต้องบวกเพิ่ม ไม่เขียนทับ

| # | เทสต์ | ทดสอบอะไร | ผล |
|---|---|---|---|
| 5 | first session | session แรกของวัน ยังไม่มี log เดิม | ✅ ผ่าน |
| 6 | TC-PLN-3-002-style | session ที่ 2 สะสมต่อจาก session แรกของวันเดียวกัน | ✅ ผ่าน |

**`applyCalorieDeltaToDailyLog`**: ใช้ร่วมกันระหว่างการจบ session และค่า wearable ที่ sync มาทีหลัง

| # | เทสต์ | ทดสอบอะไร | ผล |
|---|---|---|---|
| 7 | first-time contribution | delta = kcal ทั้ง session ยังไม่มี log เดิม | ✅ ผ่าน |
| 8 | reach target exactly | contribution แรกถึงเป้าพอดี → completed | ✅ ผ่าน |
| 9 | late wearable +40 | ค่า wearable มาทีหลัง +40 บน 460 → วันที่ incomplete กลายเป็นถึงเป้า | ✅ ผ่าน |
| 10 | late wearable −60 | ค่า wearable ต่ำกว่าค่า MET → ดึงวันนั้นกลับไปต่ำกว่าเป้าได้ | ✅ ผ่าน |
| 11 | re-sync zero delta | sync session เดิมซ้ำด้วยค่าเท่าเดิม → delta 0 ไม่นับซ้ำ | ✅ ผ่าน |

### 6. `streak.test.ts`: นับ streak แบบเข้มงวด ไม่มี grace period (PLN-4 / REQ-09, REQ-10), 6 ข้อ ✅

| # | เทสต์ | ทดสอบอะไร | ผล |
|---|---|---|---|
| 1 | TC-PLN-4-001 | นับผ่าน Cheat/Rest Day (ถือว่า completed) จนเจอวันแรกที่ incomplete → streak 3 | ✅ ผ่าน |
| 2 | TC-PLN-4-002 | วันนี้ไม่มี log และไม่ใช่ Cheat/Rest Day → streak เป็น 0 แม้ก่อนหน้าจะมี 5 วัน | ✅ ผ่าน |
| 3 | TC-PLN-4-003 | วันนี้ incomplete (99%) → streak 0 ทันที | ✅ ผ่าน |
| 4 | TC-PLN-4-004 | วันนี้ incomplete (90%) → streak 0 เหมือนกรณี 99% | ✅ ผ่าน |
| 5 | edge | streak ขาดกลางประวัติ (ไม่ใช่ที่วันนี้) → หยุดนับที่ช่องว่างแรก | ✅ ผ่าน |
| 6 | edge | completed ทุกวันภายใน maxDays → หยุดที่ maxDays ไม่วนไม่รู้จบ | ✅ ผ่าน |

### 7. `weightForecast.test.ts`: พยากรณ์วันถึงน้ำหนักเป้าหมาย (INT-1 / REQ-11 — ขั้นต่ำ 7 วัน ตั้งแต่ 2026-09-26), 9 ข้อ ✅

| # | เทสต์ | ทดสอบอะไร | ผล |
|---|---|---|---|
| 1 | TC-INT-1-001 | 80kg → 75kg, log 7 วัน deficit เฉลี่ย 500 kcal/วัน → อีก 77 วัน = 12 พ.ย. 2569 (2026-11-12) | ✅ ผ่าน |
| 2 | TC-INT-1-002 | มี log น้อยกว่า 7 วัน (1 วัน) → `not_enough_history` | ✅ ผ่าน |
| 3 | TC-INT-1-003 | deficit เฉลี่ยเป็น 0 พอดี → `no_meaningful_deficit` | ✅ ผ่าน |
| 4 | TC-INT-1-004 | deficit เฉลี่ยติดลบ (สวนทางเป้าหมาย) → `no_meaningful_deficit` | ✅ ผ่าน |
| 5 | edge | น้ำหนักปัจจุบันถึงหรือต่ำกว่าเป้าแล้ว → `already_at_or_below_target` | ✅ ผ่าน |
| 6 | edge | ไม่ทราบน้ำหนักปัจจุบัน (undefined) → `already_at_or_below_target` | ✅ ผ่าน |
| 7 | TC-INT-1-009 | boundary: log 6 วัน (ขาด 1 วันจากครบสัปดาห์) → `not_enough_history` | ✅ ผ่าน |
| 8 | constant | `MIN_LOG_DAYS_FOR_FORECAST` = 7 ตามการตัดสินใจ 2026-09-26 | ✅ ผ่าน |
| 9 | TC-INT-1-010 | boundary: log 7 วันพอดี → พยากรณ์ได้ | ✅ ผ่าน |

### 8. `pairingRateLimit.test.ts`: จำกัดการกรอกรหัส pairing ผิด (INT-0 / REQ-18: ผิด 5 ครั้งใน 15 นาที), 7 ข้อ ✅

| # | เทสต์ | ทดสอบอะไร | ผล |
|---|---|---|---|
| 1 | initial | ยังไม่มี state → ไม่ถูกล็อก ไม่มี retry-after | ✅ ผ่าน |
| 2 | boundary | ผิดครั้งที่ 4 → ยังไม่ล็อก | ✅ ผ่าน |
| 3 | boundary | ผิดครั้งที่ 5 → ล็อก | ✅ ผ่าน |
| 4 | boundary | ครบ 15 นาทีพอดี → หมด window ปลดล็อก | ✅ ผ่าน |
| 5 | boundary | ก่อนครบ 15 นาที 1 ms → ยังล็อกอยู่ | ✅ ผ่าน |
| 6 | window reset | ผิดหลัง window หมดอายุ → เริ่มนับ window ใหม่ ไม่สะสมต่อ | ✅ ผ่าน |
| 7 | success reset | redeem สำเร็จแล้วล้าง state → ไม่ถูกล็อก | ✅ ผ่าน |

---

## รายละเอียด API route test (เพิ่ม 2026-09-26)

### 9. `personalization-profile/index.test.ts`: โปรไฟล์ อุปกรณ์ และเป้าหมาย (ONB-1, ONB-2, ONB-3), 12 ข้อ ✅

| # | เทสต์ | ทดสอบอะไร | ผล |
|---|---|---|---|
| 1 | TC-ONB-2-001 | `PUT /profile/equipment` เลือกดัมเบลอย่างเดียว → บันทึกเป็น filter | ✅ ผ่าน |
| 2 | TC-ONB-2-002 | เลือกหลายอย่าง (ดัมเบล + ยิมครบชุด) → บันทึกตามที่เลือก | ✅ ผ่าน |
| 3 | TC-ONB-2-003 | เลือก "ไม่มีอุปกรณ์" อย่างเดียว → ยอมรับ | ✅ ผ่าน |
| 4 | validation | "ไม่มีอุปกรณ์" คู่กับอุปกรณ์อื่น → 400 และไม่เขียนข้อมูล | ✅ ผ่าน |
| 5 | TC-ONB-2-004 | เปลี่ยนอุปกรณ์ภายหลัง → แทนที่ filter เดิม ข้อมูลโปรไฟล์อื่นยังอยู่ | ✅ ผ่าน |
| 6 | ONB-1 | `GET /profile` ก่อนทำ ONB-1 → 404 | ✅ ผ่าน |
| 7 | ONB-1 | ชื่อว่าง → 400 | ✅ ผ่าน |
| 8 | ONB-1 | น้ำหนักเป็น 0 → 400 | ✅ ผ่าน |
| 9 | TC-ONB-1-001 | บันทึกข้อมูลส่วนตัวที่ถูกต้อง แล้ว `GET /profile` ได้ข้อมูลเดิมกลับมา | ✅ ผ่าน |
| 10 | ONB-3 | ตั้งเป้าหมายก่อนทำ ONB-1 → 409 | ✅ ผ่าน |
| 11 | ONB-3 | lose_weight แต่ไม่ส่งน้ำหนักเป้าหมาย → 400 | ✅ ผ่าน |
| 12 | TC-ONB-3-001 | lose_weight, 75kg/TDEE 2,633 → เป้าเผาผลาญ 337.5, เป้าการกิน 2,133 คำนวณที่ server และไม่เชื่อตัวเลขที่ client ส่งมา | ✅ ผ่าน |

### 10. `content-recommendation/index.test.ts`: แนะนำวิดีโอ เปลี่ยนวิดีโอ และสร้าง session (REC-1, REC-3, REC-4), 11 ข้อ ✅

YouTube Data API และ Gemini ถูก stub เทสต์นี้ตรวจตรรกะของ route เอง

| # | เทสต์ | ทดสอบอะไร | ผล |
|---|---|---|---|
| 1 | TC-REC-1-001 | อุปกรณ์ "ไม่มี" → ค้นหาแบบ bodyweight, ส่งเป้าแคลอรี่ที่เหลือให้ AI เลือก และ cache ผลของวันนี้ | ✅ ผ่าน |
| 2 | TC-REC-1-002 | อุปกรณ์ดัมเบล → ค้นหาด้วยคำค้นแบบดัมเบล | ✅ ผ่าน |
| 3 | remaining kcal | แคลอรี่ที่เผาผลาญไปแล้ววันนี้ถูกหักออกจากเป้าก่อนเลือกวิดีโอ (315 − 200 = 115) | ✅ ผ่าน |
| 4 | cache | เรียกซ้ำวันเดียวกัน → ได้วิดีโอเดิม ไม่เรียก YouTube/AI อีก | ✅ ผ่าน |
| 5 | TC-REC-1-003 | ค้นหาหนึ่งรอบแล้วไม่มีวิดีโอที่ใช้ได้ → 409 และไม่ค้นซ้ำ | ✅ ผ่าน |
| 6 | TC-REC-1-004 | วันนี้เป็น Cheat Day → 204 ไม่คำนวณคำแนะนำ | ✅ ผ่าน |
| 7 | TC-REC-3-001 | กดเปลี่ยนวิดีโอ → ไม่รวมวิดีโอเดิม และเป้าแคลอรี่ไม่เปลี่ยน | ✅ ผ่าน |
| 8 | swap ซ้ำ | เปลี่ยนครั้งที่ 2 → ไม่รวมวิดีโอทุกตัวที่เคยแสดงวันนี้ | ✅ ผ่าน |
| 9 | TC-REC-3-002 | ไม่เหลือวิดีโอให้เปลี่ยน → 409 และคงคำแนะนำเดิมไว้ | ✅ ผ่าน |
| 10 | TC-REC-4-001 | สร้าง session ของวิดีโอความเข้มข้นสูง → เก็บ warmup + main + cooldown | ✅ ผ่าน |
| 11 | TC-REC-4-002 | ความเข้มข้นกลาง → เก็บแค่ main | ✅ ผ่าน |

### 11. `exertion-calorie/index.test.ts`: จบ session และบันทึกผลรายวัน (REC-2, PLN-3), 6 ข้อ ✅

| # | เทสต์ | ทดสอบอะไร | ผล |
|---|---|---|---|
| 1 | TC-REC-2-005 | `sessionId` ที่ไม่มีอยู่จริง → 404 "sessionId not found." ไม่เขียนข้อมูลใดๆ (NFR-12) | ✅ ผ่าน |
| 2 | TC-REC-2-001 | ไม่มี wearable → เก็บค่าจากสูตร MET และบันทึกลง daily log | ✅ ผ่าน |
| 3 | TC-REC-2-004 | มีค่า wearable อยู่แล้ว (255) → ใช้แทนค่าประมาณ MET (238) | ✅ ผ่าน |
| 4 | TC-PLN-3-003 | 495/500 kcal (99%) → incomplete, streak 0 | ✅ ผ่าน |
| 5 | TC-PLN-3-001 | 500/500 kcal พอดี → completed, streak 1 | ✅ ผ่าน |
| 6 | accumulate | session ที่ 2 ในวันเดียวกัน → บวกนาทีและแคลอรี่เพิ่ม ไม่เขียนทับ (45 นาที, 550 kcal → completed) | ✅ ผ่าน |

### 12. `planner-day-status/index.test.ts`: ปฏิทินรายสัปดาห์และ Cheat/Rest Day (PLN-1, PLN-2), 12 ข้อ ✅

| # | เทสต์ | ทดสอบอะไร | ผล |
|---|---|---|---|
| 1 | PLN-1 | `GET /planner/week` คืนสัปดาห์ จ.–อา. ที่มีวันนี้อยู่ | ✅ ผ่าน |
| 2 | TC-PLN-1-003 | วันที่ไม่ได้วางแผน → ใช้ค่า default อัตโนมัติ | ✅ ผ่าน |
| 3 | TC-PLN-1-004 | วันในอดีตที่มี log → read-only ส่วนวันในอดีตที่ไม่มี log และวันนี้ → แก้ได้ | ✅ ผ่าน |
| 4 | TC-PLN-1-001 | กำหนดกิจกรรมของวันนี้ (ยังไม่มี log) | ✅ ผ่าน |
| 5 | TC-PLN-1-002 | วางแผนวันในอนาคตล่วงหน้า | ✅ ผ่าน |
| 6 | TC-PLN-1-004 | แก้แผนวันในอดีตที่มี log → 409 แผนไม่เปลี่ยน | ✅ ผ่าน |
| 7 | TC-PLN-2-001 | ตั้ง Rest Day วันนี้ (ยังไม่มี log) → วันนั้นเป็น completed และคำนวณ streak ใหม่ | ✅ ผ่าน |
| 8 | TC-PLN-2-004 | ตั้ง Cheat Day ทับ log วันนี้ที่ incomplete → completed ชนะ แคลอรี่เดิมยังอยู่ | ✅ ผ่าน |
| 9 | PLN-2 | ตั้ง Cheat/Rest ล่วงหน้าให้วันในอนาคตที่ยังไม่มี log ได้ | ✅ ผ่าน |
| 10 | TC-PLN-2-006 | วันในอดีต → 409 ไม่มีข้อยกเว้น ไม่เขียนข้อมูล | ✅ ผ่าน |
| 11 | TC-PLN-2-005 | ยกเลิก Cheat/Rest ของวันนี้ก่อนสิ้นวัน → ลบสถานะออก | ✅ ผ่าน |
| 12 | PLN-2 | ยกเลิก Cheat/Rest ของวันอื่นที่ไม่ใช่วันนี้ → 409 | ✅ ผ่าน |

### 13. `insights-forecast/index.test.ts`: พยากรณ์ผ่าน API (INT-1, ขั้นต่ำ 7 วัน), 5 ข้อ ✅

| # | เทสต์ | ทดสอบอะไร | ผล |
|---|---|---|---|
| 1 | INT-1 | ยังไม่ได้ตั้งน้ำหนักเป้าหมาย → 422 | ✅ ผ่าน |
| 2 | TC-INT-1-002 | มี log 1 วัน → 422 ข้อความระบุว่าต้องมีอย่างน้อย 7 วัน | ✅ ผ่าน |
| 3 | TC-INT-1-009 | มี log 6 วัน → ยังเป็น 422 | ✅ ผ่าน |
| 4 | TC-INT-1-001 / TC-INT-1-010 | log 7 วันพอดี เฉลี่ย 500 kcal, 80 → 75 กก. → 2026-11-12 และ cache ผลไว้ในโปรไฟล์ | ✅ ผ่าน |
| 5 | INT-2 | ใช้น้ำหนักล่าสุดที่ซิงค์มา (78 กก.) แทนน้ำหนักในโปรไฟล์ → 2026-10-13 | ✅ ผ่าน |

### 14. `account-session/forgotPassword.test.ts`: ลืมรหัสผ่าน (ONB-0 / REQ-16), 4 ข้อ ✅

| # | เทสต์ | ทดสอบอะไร | ผล |
|---|---|---|---|
| 1 | validation | ไม่ส่ง email → 400 | ✅ ผ่าน |
| 2 | TC-ONB-0-003 | บัญชี email/password → 202 "sent" และไม่ส่งลิงก์รีเซ็ตกลับใน response | ✅ ผ่าน |
| 3 | TC-ONB-0-004 | บัญชี Google → 422 (ไม่มีรหัสผ่านให้รีเซ็ต) | ✅ ผ่าน |
| 4 | anti-enumeration | email ที่ไม่มีในระบบ → 202 เหมือนบัญชีจริง | ✅ ผ่าน |

### 15. `middleware/authenticate.test.ts`: ต้องมี session ที่ยืนยันแล้ว (ONB-0 / REQ-15), 3 ข้อ ✅

| # | เทสต์ | ทดสอบอะไร | ผล |
|---|---|---|---|
| 1 | no header | ไม่มี Authorization header → 401 | ✅ ผ่าน |
| 2 | bad token | token ไม่ถูกต้องหรือหมดอายุ → 401 | ✅ ผ่าน |
| 3 | valid token | token ถูกต้อง → ผ่านไปได้ และตั้ง `req.userId` ตาม token | ✅ ผ่าน |

---

## ข้อที่ไม่ผ่าน

**ไม่มี**: ทั้ง 110 ข้อผ่านทั้งหมดในรอบล่าสุด (ข้อที่ไม่ผ่านตอนรันครั้งแรกเกิดจากค่าที่เขียนผิดในเทสต์ ดูหมายเหตุในหัวข้อสรุปผลรวม)

## ข้อสังเกต / สิ่งที่ยังไม่ได้ทดสอบ

- **ครอบคลุมแล้ว (อย่างน้อยระดับ API หรือ domain)**: ONB-0 (ลืมรหัสผ่าน, การยืนยัน session), ONB-1, ONB-2, ONB-3,
  REC-1, REC-2, REC-3, REC-4, PLN-1, PLN-2, PLN-3, PLN-4, INT-0, INT-1, INT-3 (ส่วน domain)
- **ยังไม่มี automated test**: INT-2 (การซิงค์ตาชั่งผ่าน Bluetooth อยู่ในแอป mobile), route ของ pairing/integration-gateway,
  การสมัคร/เข้าสู่ระบบ ONB-0 (เรียก Firebase Auth SDK ตรงจาก client) และ flow UI ทั้งหมด
- **แอป mobile** (`apps/mobile`) ยังไม่มีเทสต์ สคริปต์ `test` คืนค่าสำเร็จเสมอ

## Static checks (รันล่าสุด 2026-09-26 หลังเพิ่ม API route test)

| คำสั่ง | ขอบเขต | ผล |
|---|---|---|
| `npm run typecheck` | `apps/web` (server, server-tests รวม route test ใหม่, client), `apps/mobile`, `packages/shared-types` | ✅ ผ่าน ไม่มี type error |
| `npm run lint` | `apps/web`, `apps/mobile` (ESLint `.ts/.tsx`) | ✅ ผ่าน ไม่มี error/warning |
