# smartFit_daily — Spec สรุป (smartfit_daily_app)

- **วันที่เขียน:** 2026-09-25
- **ที่มา:** อ่านจากเอกสารใน `docs/` (01-spec, backlog, user-journeys, prototypes v1, database-schema, tech-stack)
  และโค้ดจริงใน `smartfit_daily_app/`
- **หมายเหตุ:** ถ้า spec นี้กับ `docs/` ไม่ตรงกัน ให้ถือ `docs/` เป็นหลัก ยกเว้นเรื่องสถาปัตยกรรม
  (Express + web-first) ที่โค้ดใหม่กว่าเอกสาร `tech-stack.md` (ดู `CLAUDE.md`)

---

## 1. ภาพรวม

smartFit_daily คือแอปออกกำลังกายรายวันที่คำนวณเป้าหมายแคลอรี่จากข้อมูลร่างกายและเป้าหมายของผู้ใช้
แล้วแนะนำวิดีโอ YouTube ให้ตรงกับเป้านั้น ผู้ใช้วางแผนรายสัปดาห์ บันทึกผล ติดตาม streak และดูพยากรณ์
วันที่จะถึงน้ำหนักเป้าหมายได้

โมดูลนี้ (`smartfit_daily_app/`) เป็น npm-workspaces monorepo ที่มี 3 ส่วน:

| ส่วน | เทคโนโลยี | หน้าที่ |
|---|---|---|
| `apps/web` | Express.js (TypeScript) + React/Vite (`react-native-web`) | **ตัวแอปหลัก** มี REST API (`/api/*`) และหน้าเว็บทุกหน้า |
| `apps/mobile` | React Native + Expo | **แอปคู่หู (companion app)** ใช้จับคู่อุปกรณ์อย่างเดียว (ตาชั่งอัจฉริยะ INT-2, wearable INT-3) |
| `packages/shared-types` | TypeScript | โครงสร้างข้อมูลที่ทั้งสองแอปใช้ร่วมกัน |

ฐานข้อมูลคือ Cloud Firestore ยืนยันตัวตนด้วย Firebase Authentication และ deploy ไปที่ Cloud Run +
Firebase Hosting (`asia-southeast1`)

---

## 2. Feature ทั้งหมด (จาก `backlog.md`)

| Feature ID | ชื่อ | Epic | Priority |
|---|---|---|---|
| ONB-0 | สมัคร / เข้าสู่ระบบ / ลืมรหัสผ่าน / ออกจากระบบ | Onboarding | Must |
| ONB-1 | กรอกข้อมูลส่วนตัวเพื่อคำนวณ TDEE | Onboarding | Must |
| ONB-2 | เลือกอุปกรณ์ที่มี | Onboarding | Must |
| ONB-3 | ตั้งเป้าหมายหลัก (เป้าเผาผลาญ + เป้า intake + safety floor) | Onboarding | Must |
| REC-1 | แนะนำวิดีโอตรงเป้าแคลอรี่รายวัน | Daily YouTube Recommendation | Must |
| REC-2 | คำนวณแคลอรี่เผาผลาญจริง (สูตร MET) | Daily YouTube Recommendation | Must |
| REC-3 | เปลี่ยนวิดีโอโดยคงเป้าแคลอรี่เดิม | Daily YouTube Recommendation | Should |
| REC-4 | วอร์มอัพ–คูลดาวน์อัตโนมัติ | Daily YouTube Recommendation | Should |
| PLN-1 | ปฏิทินวางแผนรายสัปดาห์ | Planner & Logging | Must |
| PLN-2 | โหมด Cheat Day / Rest Day | Planner & Logging | Must |
| PLN-3 | บันทึกผลรายวัน (all-or-nothing) | Planner & Logging | Must |
| PLN-4 | ติดตาม Streak | Planner & Logging | Should |
| INT-0 | ยืนยันตัวตนบนมือถือด้วยรหัสจับคู่ (Pairing Code) | Smart Integrations | Could |
| INT-1 | พยากรณ์วันถึงเป้าหมายน้ำหนัก | Smart Integrations | Could |
| INT-2 | ซิงค์ตาชั่งอัจฉริยะ | Smart Integrations | Could |
| INT-3 | ซิงค์ข้อมูล Wearable | Smart Integrations | Could |

---

## 3. หน้าจอ

รวมทั้งหมด 17 หน้า: เว็บ 15 หน้า และมือถือ 2 หน้า

### 3.1 เว็บแอป (`apps/web/client/src/pages/`) — 15 หน้า

การเข้าถึงหน้าจอมี 3 ระดับ (กำหนดใน `App.tsx`):
**สาธารณะ** → **ต้อง login** (`RequireAuth`) → **ต้อง login และทำ onboarding ครบแล้ว** (`RequireOnboarding`)

| # | หน้าจอ | Route | ไฟล์ | Feature | การเข้าถึง | Prototype |
|---|---|---|---|---|---|---|
| 1 | ยินดีต้อนรับ | `/welcome` | `auth/WelcomeScreen.tsx` | ONB-0 | สาธารณะ | `00-auth-welcome.html` |
| 2 | สมัครสมาชิก | `/signup` | `auth/SignupScreen.tsx` | ONB-0 | สาธารณะ | `00-auth-signup.html` |
| 3 | เข้าสู่ระบบ | `/login` | `auth/LoginScreen.tsx` | ONB-0 | สาธารณะ | `00-auth-login.html` |
| 4 | ลืมรหัสผ่าน | `/forgot-password` | `auth/ForgotPasswordScreen.tsx` | ONB-0 | สาธารณะ | `00-auth-forgot-password.html` |
| 5 | ข้อมูลส่วนตัว | `/onboarding/personal-info` | `onboarding/PersonalInfoScreen.tsx` | ONB-1 | ต้อง login | `01-onboarding-personal-info.html` |
| 6 | เลือกอุปกรณ์ | `/onboarding/equipment` | `onboarding/EquipmentScreen.tsx` | ONB-2 | ต้อง login | `02-onboarding-equipment.html` |
| 7 | เลือกเป้าหมาย | `/onboarding/goal-select` | `onboarding/GoalSelectScreen.tsx` | ONB-3 | ต้อง login | `03-onboarding-goal-select.html` |
| 8 | ยืนยันเป้าหมาย | `/onboarding/goal-confirm` | `onboarding/GoalConfirmScreen.tsx` | ONB-3 | ต้อง login | `04-onboarding-goal-confirm.html` |
| 9 | หน้าหลักรายวัน (แท็บ) | `/` | `DailyDashboardScreen.tsx` | REC-1, REC-3 | ต้อง onboarding ครบ | `05-daily-dashboard.html` |
| 10 | วางแผน (แท็บ) | `/planner` | `PlannerScreen.tsx` | PLN-1, PLN-2 | ต้อง onboarding ครบ | `08-weekly-planner.html` |
| 11 | ความคืบหน้า (แท็บ) | `/progress` | `ProgressScreen.tsx` | PLN-4, INT-1 | ต้อง onboarding ครบ | `10-progress-insights.html` |
| 12 | โปรไฟล์ (แท็บ) | `/profile` | `ProfileScreen.tsx` | ONB-0 (ออกจากระบบ, ลบบัญชี), INT-0 (สร้างรหัสจับคู่), INT-2 (กรอกน้ำหนักเองเมื่อ Bluetooth ใช้ไม่ได้) | ต้อง onboarding ครบ | `11-device-integrations.html` |
| 13 | เซสชันออกกำลังกาย | `/workout/session` | `workout/WorkoutSessionScreen.tsx` | REC-4 | ต้อง onboarding ครบ | `06-workout-session.html` |
| 14 | ผลการออกกำลังกาย | `/workout/result` | `workout/WorkoutResultScreen.tsx` | REC-2, PLN-3 | ต้อง onboarding ครบ | `07-workout-result.html` |
| 15 | ประวัติการบันทึก | `/log-history` | `LogHistoryScreen.tsx` | PLN-3 | ต้อง onboarding ครบ | `09-log-history.html` |

หน้า 9–12 อยู่ในแถบแท็บด้านล่าง (`TabsLayout`) หน้า 13–15 เปิดซ้อนขึ้นมาจากแท็บ

### 3.2 แอปมือถือ companion (`apps/mobile/app/`) — 2 หน้า

| # | หน้าจอ | ไฟล์ | Feature | Prototype | สถานะ |
|---|---|---|---|---|---|
| 16 | กรอกรหัสจับคู่ | `pairing-code.tsx` | INT-0 | `13-companion-pairing-code.html` | ใช้งานได้ (แลกรหัสเป็น custom token) |
| 17 | เชื่อมต่ออุปกรณ์ | `device-pairing.tsx` | INT-2, INT-3 | `12-device-pairing.html` | **ยังเป็นโครง** — ปุ่มเชื่อมต่อยังไม่ทำงาน (มี TODO เรื่อง Bluetooth scan และ HealthKit/Health Connect) |

ถ้าเคยจับคู่แล้วและ session ยังอยู่ แอปจะข้ามไปหน้าเชื่อมต่ออุปกรณ์ทันที

### 3.3 ลำดับการใช้งานหลัก

```
ยินดีต้อนรับ → สมัคร/เข้าสู่ระบบ → ข้อมูลส่วนตัว → เลือกอุปกรณ์ → เลือกเป้าหมาย → ยืนยันเป้าหมาย
  → หน้าหลักรายวัน → เซสชันออกกำลังกาย → ผลการออกกำลังกาย (บันทึก log + อัปเดต streak)

โปรไฟล์ (เว็บ) → สร้างรหัส 6 หลัก → กรอกรหัสบนมือถือ → เชื่อมต่ออุปกรณ์
```

---

## 4. โครงสร้างข้อมูล

ชนิดข้อมูลทั้งหมดอยู่ใน `packages/shared-types/src/entities/` โดยแยกไฟล์ตาม component ใน
`high-level-architecture.md` §3

### 4.1 การจัดเก็บใน Firestore

```
users/{userId}                         ← UserProfile (มีข้อมูลย่อยฝังอยู่ในเอกสารเดียวกัน)
├── workoutSessions/{sessionId}        ← WorkoutSession
├── weeklyPlanEntries/{planDate}       ← WeeklyPlanEntry
├── dayStatus/{statusDate}             ← DayStatus
├── dailyLogs/{logDate}                ← DailyLog
└── weightRecords/{recordId}           ← WeightRecord

pairingCodes/{code}                    ← รหัสจับคู่ชั่วคราว (ไม่มีใน shared-types)
```

`{userId}` คือ UID จาก Firebase Authentication วันที่ (`planDate`, `statusDate`, `logDate`) ใช้เป็น ID ของเอกสาร
จึงมีได้วันละ 1 เอกสาร

### 4.2 รายการ Entity

| Entity | ไฟล์ | เก็บที่ไหน | ฟิลด์หลัก |
|---|---|---|---|
| `UserAccount` | `accountSession.ts` | **ไม่ได้เก็บใน Firestore** — ใช้ข้อมูลจาก Firebase Auth แทน | `id`, `signupMethod` (`email_password` / `google` / `apple`), `email`, `createdAt` |
| `UserProfile` | `personalizationProfile.ts` | `users/{userId}` | `displayName`, `age`, `sex`, `weightKg`, `heightCm`, `activityLevel`, `tdeeKcal`, `equipmentTypes[]` |
| `GoalSelection` | `personalizationProfile.ts` | ฝังใน `UserProfile.goalSelection` | `goalType` (`lose_weight` / `tone_up` / `build_endurance`), `targetWeightKg`, `dailyCalorieTargetKcal` (เป้าเผาผลาญ), `dailyIntakeTargetKcal` (เป้า intake), `isSafetyFloorApplied` |
| `WorkoutSession` | `contentRecommendation.ts` | `workoutSessions/{sessionId}` | `startedAt`, `actualDurationMinutes`, `status` (`in_progress` / `completed` / `stopped_early`) |
| `SessionVideo` | `contentRecommendation.ts` | อาร์เรย์ฝังใน `WorkoutSession.sessionVideos` (1–3 รายการ) | `role` (`main` / `warmup` / `cooldown`), `externalVideoId`, `activityType`, `intensity`, `durationMinutes` |
| `SessionRejectedVideo` | `contentRecommendation.ts` | อาร์เรย์ฝังใน `WorkoutSession.rejectedVideoIds` | `externalVideoId`, `rejectedAt` |
| `ActualCalorieBurn` | `exertionCalorie.ts` | ฝังใน `WorkoutSession.actualCalorieBurn` | `source` (`met_formula` / `wearable`), `metValue`, `calculatedKcal` |
| `WearableReading` | `exertionCalorie.ts` | ฝังใน `WorkoutSession.wearableReading` | `platform` (`apple_health` / `google_health_connect`), `calorieValueKcal`, `recordedAt` |
| `WeeklyPlanEntry` | `plannerDayStatus.ts` | `weeklyPlanEntries/{planDate}` | `planDate`, `plannedActivityType` (`cardio` / `strength` / `hiit` / `rest`), `isDefaultAuto`, `isReadOnly` (คำนวณตอนอ่าน ไม่ได้เก็บ) |
| `DayStatus` | `plannerDayStatus.ts` | `dayStatus/{statusDate}` | `statusDate`, `isCheatRest`, `setAt` |
| `DailyLog` | `loggingStreak.ts` | `dailyLogs/{logDate}` | `minutesExercised`, `accumulatedKcal`, `completionStatus` (`completed` / `incomplete`), `source` (`workout_session` / `cheat_rest_override`) |
| `StreakSnapshot` | `loggingStreak.ts` | ฝังใน `UserProfile.streakSnapshot` | `currentStreakDays`, `computedAt` |
| `WeightRecord` | `insightsForecast.ts` | `weightRecords/{recordId}` | `weightKg`, `bodyCompositionNote`, `recordedAt`, `source` (`manual` / `smart_scale_sync`) |
| `WeightForecastSnapshot` | `insightsForecast.ts` | ฝังใน `UserProfile.weightForecastSnapshot` | `forecastedGoalDate`, `averageDailyDeficitKcal`, `computedAt` |
| `IntegrationConnection` | `integrationGateway.ts` | ฝังใน `UserProfile.integrationConnections.smartScale` และ `.wearable` | `connectionStatus` (`not_connected` / `connected` / `consent_withdrawn`), `connectedAt` |
| _(pairing code)_ | `server/routes/pairing/index.ts` | `pairingCodes/{code}` | `uid`, `createdAt`, `expiresAt` (มีอายุ 5 นาที ใช้ได้ครั้งเดียว) |

### 4.3 API (`apps/web/server/routes/`, prefix `/api`)

| กลุ่ม | Endpoint | ต้อง login |
|---|---|---|
| Account & Session | `POST /auth/forgot-password`, `DELETE /account` | ไม่ต้อง / ต้อง |
| Pairing | `POST /pairing/create-code`, `POST /pairing/redeem` | ต้อง / ไม่ต้อง |
| Personalization & Profile | `GET /profile`, `PUT /profile/personal-info`, `PUT /profile/equipment`, `PUT /profile/goal` | ต้อง |
| Content Recommendation | `GET /workouts/today/recommendation`, `POST /workouts/today/recommendation/swap`, `POST /workouts/sessions` | ต้อง |
| Exertion & Calorie | `POST /workouts/sessions/:sessionId/complete` | ต้อง |
| Planner & Day-Status | `GET /planner/week`, `PUT /planner/days/:date`, `POST` และ `DELETE /planner/days/:date/cheat-rest` | ต้อง |
| Logging & Streak | `GET /logs`, `GET /logs/:date`, `GET /streak` | ต้อง |
| Insights & Forecast | `GET /insights/forecast`, `GET /insights/weight-records` | ต้อง |
| Integration Gateway | `POST /integrations/smart-scale/connect`, `DELETE /integrations/smart-scale`, `POST /integrations/smart-scale/sync`, `POST /integrations/wearable/connect`, `DELETE /integrations/wearable`, `POST /integrations/wearable/readings` | ต้อง |

การสมัคร เข้าสู่ระบบ และออกจากระบบ เรียก Firebase Auth SDK จากฝั่ง client โดยตรง ไม่ผ่าน server

---

## 5. บทบาทผู้ใช้

ระบบมี **บทบาทผู้ใช้แบบมนุษย์แค่บทบาทเดียว คือ "ผู้ใช้" (end user)** ไม่มี admin ไม่มีเทรนเนอร์ และไม่มีระบบ
กำหนดสิทธิ์ตามบทบาท (RBAC) Firestore rules ให้แต่ละคนอ่านและเขียนได้เฉพาะข้อมูลใต้ `users/{ตัวเอง}` เท่านั้น

`user-journeys.md` แบ่งผู้ใช้คนเดียวกันนี้ตามสถานะการใช้งาน:

| สถานะ | คือใคร | ใช้หน้าจอไหนได้ |
|---|---|---|
| **ผู้เยี่ยมชม** (ยังไม่ login) | ยังไม่มีบัญชี หรือออกจากระบบแล้ว | หน้า 1–4 เท่านั้น ถ้าเปิดหน้าอื่นจะถูกพากลับไป `/welcome` |
| **ผู้ใช้ใหม่** (login แล้ว แต่ onboarding ยังไม่ครบ) | เพิ่งสมัคร | หน้า 5–8 ถ้าเปิดหน้าหลัก ระบบจะพาไปขั้นตอน onboarding ที่ยังทำไม่เสร็จ |
| **ผู้ใช้ประจำ** (onboarding ครบแล้ว) | ใช้งานทุกวัน | หน้า 9–15 และแก้ไขโปรไฟล์ได้ |
| **ผู้ใช้ที่มีอุปกรณ์** (ผู้ใช้ประจำที่มีตาชั่งอัจฉริยะหรือ wearable) | ผู้ใช้ประจำคนเดิม ใช้แอปมือถือด้วย | หน้า 16–17 บนมือถือ โดยเข้าได้ผ่านรหัสจับคู่จากเว็บเท่านั้น |

**ระบบภายนอก (ไม่ใช่บทบาทผู้ใช้ แต่ระบบต้องเชื่อมต่อด้วย):** YouTube (แหล่งวิดีโอ), Apple Health / Google
Health Connect (wearable), ตาชั่งอัจฉริยะผ่าน Bluetooth, Firebase Authentication (Google / Apple sign-in)

---

## 6. สิ่งที่ไม่ทำในโมดูลนี้ (Out of Scope)

### 6.1 ตามที่เอกสาร requirement ระบุ

- **Multi-factor authentication (MFA)** — ไม่อยู่ในขอบเขตรอบนี้ (Onboarding spec)
- **Social login อื่นนอกจาก Google และ Apple** เช่น Facebook, LINE (Onboarding spec)
- **การสลับบัญชีหรือใช้หลายบัญชีบนอุปกรณ์เดียว** (Onboarding spec)
- **ลืมรหัสผ่านสำหรับบัญชี Google หรือ Apple** — บัญชีแบบนี้ไม่มีรหัสผ่านให้รีเซ็ต (REQ-16)
- **บันทึกอาหาร (food-intake logging)** — มีการคำนวณ `dailyIntakeTargetKcal` และแสดงค่าไว้ แต่ยังไม่มี feature
  ใดนำไปใช้ แอปติดตามเฉพาะแคลอรี่ที่เผาผลาญจากการออกกำลังกาย
- **ใช้งานแบบ offline** — Discovery Questionnaire ตอบว่าไม่จำเป็น (`tech-stack.md`) แต่เรื่องการเปิด offline
  persistence ของ Firestore ยังเป็นจุดที่ต้องยืนยัน (NFR doc)
- **ตัวเลข SLA/threshold ระดับ production** เช่น เวลาโหลดหน้าที่แน่นอน (NFR doc)
- **ตั้งเวลาหรือประมาณการเวลาทำงาน** — แผน release บอกเฉพาะลำดับงาน ไม่มีการประมาณเวลา (release plan)

### 6.2 ตามการแบ่งหน้าที่ระหว่างเว็บกับมือถือ (จากโค้ด)

- **เว็บไม่ทำ:** เชื่อมต่อ Bluetooth และ HealthKit / Health Connect โดยตรง เพราะเว็บเบราว์เซอร์ทำไม่ได้ จึงให้
  แอปมือถือทำ
- **แอปมือถือไม่ทำ:** สมัคร เข้าสู่ระบบ ลืมรหัสผ่าน onboarding หน้าหลัก planner บันทึกผล streak และพยากรณ์
  ทั้งหมดนี้อยู่บนเว็บ มือถือเข้าระบบผ่านรหัสจับคู่เท่านั้น
- **ไม่มีระบบหลังบ้าน:** ไม่มีหน้า admin หรือ dashboard สำหรับทีมงาน และไม่มีการดูข้อมูลของผู้ใช้คนอื่น
- **ไม่มี Cloud Functions:** ตรรกะฝั่ง server ทั้งหมดอยู่ใน Express app เดียว (เปลี่ยนเมื่อ 2026-08-29)

### 6.3 สิ่งที่อยู่ในขอบเขตแต่ยังทำไม่เสร็จ (ไม่ใช่ out of scope)

- **INT-2 / INT-3 บนมือถือ** — หน้าเชื่อมต่ออุปกรณ์ยังเป็นโครง ปุ่มยังไม่ทำงาน
- **Firestore rules** — ตอนนี้เป็นแค่โครงแบบ owner-only ยังไม่ได้ออกแบบ rule set จริง (`tech-stack.md` §7.2)
- **Pairing code** — ยังไม่มี rate limit กันการเดารหัส 6 หลัก และยังไม่กำหนดว่าบัญชีหนึ่งมีรหัสที่ยังไม่หมดอายุ
  พร้อมกันได้กี่รหัส (test-plan R14)
- **Test suite** — ยังไม่มีชุดทดสอบจริงในทั้งสองแอป

---

## 7. เอกสารอ้างอิง

- Requirement: `docs/01-requirements/01-spec/` (REQ-01…REQ-18, NFR-01…NFR-13)
- Backlog: `docs/01-requirements/backlog.md`
- User Journey: `docs/02-design/01-prototypes/user-journeys.md`
- Prototype: `docs/02-design/01-prototypes/v1/`
- Design System: `docs/02-design/01-prototypes/DESIGN.md`
- Database Schema: `docs/02-design/02-technical/database-schema.md` (§8.2 = การจัดเก็บใน Firestore)
- API Spec: `docs/02-design/02-technical/api-spec.md`
- Tech Stack: `docs/02-design/02-technical/tech-stack.md` (**ยังไม่อัปเดตตามสถาปัตยกรรม Express**)
