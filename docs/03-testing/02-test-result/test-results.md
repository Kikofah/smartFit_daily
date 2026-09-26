# ผลการทดสอบ (Test Results)

## ข้อมูลการรัน

| รายการ | ค่า |
|---|---|
| วันเวลาที่รัน | **2026-09-26 14:33:38 (+07)** |
| คำสั่ง | `npm run test` (จาก `smartfit_daily_app/`) และ `npx vitest run --reporter=verbose` (จาก `apps/web/`) เพื่อดูรายละเอียดรายเทสต์ |
| Commit | `084e897` (มีไฟล์เอกสารใน `docs/03-testing/` แก้ไขค้างอยู่ แต่ไม่มีโค้ดแอปแก้ไขค้าง) |
| สภาพแวดล้อม | macOS (Darwin 25.5.0), Node v22.23.2, Vitest v2.1.9 |
| ระยะเวลา | ~0.37 วินาที |

## สรุปผลรวม

| Workspace | ไฟล์เทสต์ | จำนวนเทสต์ | ผ่าน | ไม่ผ่าน |
|---|---|---|---|---|
| `apps/web` | 8 | 55 | **55** | 0 |
| `apps/mobile` | — | 0 (ยังไม่มีเทสต์ สคริปต์ `test` แค่พิมพ์ "no tests yet") | — | — |
| `packages/shared-types` | — | ไม่มีสคริปต์ `test` | — | — |
| **รวม** | **8** | **55** | **55 ✅** | **0** |

**ผลรวม: ผ่านทั้งหมด 55/55 ข้อ ไม่มีข้อที่ไม่ผ่าน** จึงไม่มีจุดที่ต้องรายงานว่าติดตรงไหน

> ขอบเขตที่ควรรู้: ทั้ง 55 ข้อเป็น **unit test ของ pure domain logic** ใน `apps/web/server/domain/` (สูตรคำนวณและกฎทางธุรกิจ) เท่านั้น
> ยังไม่มี integration test ของ API route/Firestore, ไม่มี UI test ของ client และไม่มีเทสต์ของแอป mobile (INT-2/INT-3 pairing)
> Test case ใน `docs/03-testing/01-test-plan/test-cases/` ส่วนที่เป็น UI/flow ยังไม่ได้ถูกทดสอบแบบอัตโนมัติ
> ข้อความเตือน "The CJS build of Vite's Node API is deprecated" ขึ้นตอนรัน เป็นแค่คำเตือน ไม่มีผลต่อผลเทสต์

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

### 7. `weightForecast.test.ts`: พยากรณ์วันถึงน้ำหนักเป้าหมาย (INT-1 / REQ-11), 7 ข้อ ✅

| # | เทสต์ | ทดสอบอะไร | ผล |
|---|---|---|---|
| 1 | TC-INT-1-001 | 80kg → 75kg, deficit เฉลี่ย 500 kcal/วัน → อีก 77 วัน = 12 พ.ย. 2569 (2026-11-12) | ✅ ผ่าน |
| 2 | TC-INT-1-002 | มี log น้อยกว่า 3 วัน → `not_enough_history` | ✅ ผ่าน |
| 3 | TC-INT-1-003 | deficit เฉลี่ยเป็น 0 พอดี → `no_meaningful_deficit` | ✅ ผ่าน |
| 4 | TC-INT-1-004 | deficit เฉลี่ยติดลบ (สวนทางเป้าหมาย) → `no_meaningful_deficit` | ✅ ผ่าน |
| 5 | edge | น้ำหนักปัจจุบันถึงหรือต่ำกว่าเป้าแล้ว → `already_at_or_below_target` | ✅ ผ่าน |
| 6 | edge | ไม่ทราบน้ำหนักปัจจุบัน (undefined) → `already_at_or_below_target` | ✅ ผ่าน |
| 7 | boundary | มี log 3 วันพอดี → พอสำหรับพยากรณ์ | ✅ ผ่าน |

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

## ข้อที่ไม่ผ่าน

**ไม่มี**: ทั้ง 55 ข้อผ่านทั้งหมดในรอบนี้

## ข้อสังเกต / สิ่งที่ยังไม่ได้ทดสอบ

- **Feature ที่ยังไม่มี automated test เลย**: ONB-0, ONB-2, REC-1, REC-3, PLN-1, PLN-2, INT-2 รวมถึง flow UI ทั้งหมด (ครอบคลุมเฉพาะส่วนที่เป็นสูตรคำนวณ/กฎของ ONB-1, ONB-3, REC-2, REC-4, PLN-3, PLN-4, INT-0, INT-1, INT-3)
- **แอป mobile** (`apps/mobile`) ยังไม่มีเทสต์ สคริปต์ `test` คืนค่าสำเร็จเสมอ

## Static checks (รันเพิ่ม 2026-09-26 หลังรอบเทสต์)

| คำสั่ง | ขอบเขต | ผล |
|---|---|---|
| `npm run typecheck` | `apps/web` (server, server-tests, client), `apps/mobile`, `packages/shared-types` | ✅ ผ่าน ไม่มี type error |
| `npm run lint` | `apps/web`, `apps/mobile` (ESLint `.ts/.tsx`) | ✅ ผ่าน ไม่มี error/warning |
