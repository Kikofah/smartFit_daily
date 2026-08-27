# Test Plan — smartFit_daily

- **ประเภทเอกสาร:** Test Plan (ทั้งโปรเจกต์ — ไฟล์เดียว ไม่แยกต่อ Epic)
- **สถานะเอกสาร:** Draft
- **วันที่สร้าง:** 2026-08-27
- **สร้างโดย:** skill `test-suite-builder`

เอกสารนี้อ้างอิงจาก [docs/01-requirements/backlog.md](../../01-requirements/backlog.md) (MoSCoW priority
และ Feature ID ทั้ง 13 ตัว) และ
[Non-Functional Requirements](../../01-requirements/01-spec/20260827-05-non-functional-requirements.md)
(NFR-01–NFR-08) เป็นหลัก ร่วมกับ "จุดที่ยังไม่ได้ระบุ / ควรยืนยันเพิ่มเติม" ของเอกสาร spec ทั้ง 4 ไฟล์ใน
[01-spec/](../../01-requirements/01-spec/index.md) สำหรับส่วน Risk Management ด้านล่าง

> **หมายเหตุสถานะโปรเจกต์**: ตาม `CLAUDE.md` — โปรเจกต์นี้ยังเป็น Obsidian vault เอกสารล้วน ยังไม่มี
> application source code, backend, หรือ build/test tooling จริง แผนนี้จึงเขียนในระดับ
> **documentation/prototype-level testing** (ตรวจสอบความถูกต้องของ business rule ผ่าน spec/prototype/
> test case) ไม่ใช่การรันชุดทดสอบอัตโนมัติกับระบบจริง — เมื่อมีแอปจริงต้องย้อนกลับมาเติมรายละเอียดเชิง
> infra (URL, test runner, CI) ในเอกสารนี้

---

## 1. ขอบเขต (Scope)

ขอบเขตของการทดสอบรอบนี้อ้างอิงคอลัมน์ MoSCoW Priority ใน
[backlog.md](../../01-requirements/backlog.md#ตารางสรุป-feature-ทั้งหมด-ทุก-epic) โดยตรง:

### อยู่ในขอบเขต (In scope) — ทดสอบเต็มรูปแบบในรอบนี้

**Must** (8 features — ต้องผ่านก่อนถือว่า core loop ใช้งานได้):

| Feature ID | Epic | เหตุผลที่ต้องทดสอบรอบนี้ |
|---|---|---|
| ONB-1, ONB-2, ONB-3 | Onboarding & Personalization | เป็น baseline (TDEE, อุปกรณ์, เป้าหมายแคลอรี่) ที่ทุก feature อื่นต้องใช้ต่อ |
| REC-1, REC-2 | Daily YouTube Recommendation | core loop รายวันที่ผู้ใช้เจอทุกวัน |
| PLN-1, PLN-2, PLN-3 | Planner & Logging | ปฏิทิน, Cheat/Rest Day, และการบันทึก log ที่ feature อื่นพึ่งพา |

**Should** (3 features — ทดสอบในรอบนี้ด้วย แต่ไม่ block การ exit ถ้าเจอบั๊กที่ไม่ critical):

| Feature ID | Epic | หมายเหตุ |
|---|---|---|
| REC-3, REC-4 | Daily YouTube Recommendation | เสริม UX/safety ของ REC-1 แต่ core loop ยังทำงานได้แม้ไม่มี |
| PLN-4 | Planner & Logging | motivational layer ต่อยอดจาก PLN-3 (all-or-nothing streak) |

### นอกขอบเขต (Out of scope) สำหรับรอบทดสอบนี้

**Could** — ทั้ง Epic 4 (Smart Integrations: **INT-1, INT-2, INT-3**) — **อยู่นอกขอบเขตของรอบทดสอบนี้**
เพราะยังไม่ถูก implement จริง (MoSCoW = Could ทั้งหมดใน backlog.md, และ NFR-07 ยืนยันว่า core loop
รายวันต้องไม่ผูกกับความพร้อมของ integration เหล่านี้อยู่แล้ว) — **อย่างไรก็ตาม อาจเขียน test case
เตรียมไว้ล่วงหน้า** (per `test-suite-builder` ที่ default คือ full backlog coverage) เพื่อให้พร้อมใช้ทันที
เมื่อ Epic 4 ถูกหยิบขึ้นมา implement จริง โดยไม่ต้อง execute ในรอบนี้

NFR ที่พึ่งพาระบบบัญชีผู้ใช้/backend จริง (NFR-04 ส่วน encryption at rest, NFR-06 data deletion) ก็อยู่
นอกขอบเขตการ *execute* รอบนี้เช่นกัน ด้วยเหตุผลเดียวกับโปรเจกต์สถานะปัจจุบัน — ดูรายละเอียดใน §4
Risk Management และ §5 Entry/Exit Criteria

---

## 2. ประเภทการทดสอบ (Test Types)

| ประเภท | ขอบเขตที่ครอบคลุม | เหตุผลที่เลือก |
|---|---|---|
| **Functional Testing** | ตรรกะแคลอรี่/streak/logging หลัก: คำนวณ BMR/TDEE (ONB-1), แปลงเป้าหมายเป็น deficit/surplus + safety floor (ONB-3), สูตร MET (REC-2), all-or-nothing log (PLN-3), streak strict (PLN-4) | เป็นตรรกะทางคณิตศาสตร์/กติกาธุรกิจที่ตายตัว มีค่า input/output คาดเดาได้ชัดเจน ต้อง verify ว่าตรงตาม decision ที่ resolve แล้วใน spec ทุกตัว |
| **Integration Testing** | YouTube API (REC-1 การค้นหา/กรองวิดีโอ, REC-2 metadata ที่ใช้คำนวณ MET), Health API/wearable (INT-3), Bluetooth สมาร์ตสเกล (INT-2) | เป็นจุดที่แอปพึ่งพาระบบภายนอกที่ควบคุมไม่ได้เต็มที่ — REC-1/REC-2 อยู่ใน scope Must จึงต้อง integration-test แม้จะยังไม่มี backend จริง (ผ่าน mock ดู §3); INT-2/INT-3 เตรียม test case ไว้แต่ไม่ execute รอบนี้ (Could, นอกขอบเขต) |
| **Usability Testing** | Onboarding flow ทั้งหมด (ONB-1 → ONB-2 → ONB-3) | เป็น first-run linear flow ที่ผู้ใช้ใหม่ทุกคนต้องผ่านโดยไม่มีทางย้อนกลับแก้ไขระหว่างทางที่ระบุไว้ชัดเจน (ดู Preconditions/flow ใน [user-journeys.md](../../02-design/01-prototypes/user-journeys.md)) — ถ้าขั้นตอนใดทำให้ผู้ใช้สับสนหรือติดขัด ผู้ใช้จะเข้าแอปไม่ได้เลยตั้งแต่ต้น ต่างจากหน้าจออื่นที่พลาดแล้วยังกลับมาแก้ได้ |
| **Regression Testing** | กติกา all-or-nothing ของ streak (PLN-3 การสร้าง log และ PLN-4 การนับ/ตัด streak) | เป็นกติกาที่ "เข้มงวด ไม่มี partial credit" ตาม decision ที่ resolve แล้ว ซึ่งเป็นกฎที่ผิดพลาดง่ายเวลามีการแก้โค้ดในอนาคต (เช่น เผลอใส่ grace period หรือ partial credit) — ต้องมี regression suite ที่รันซ้ำทุกครั้งที่โค้ดส่วน logging/streak หรือ Cheat/Rest Day (PLN-2) ถูกแก้ |
| **NFR-driven Testing** (Performance/Security/Reliability) | ตรงตาม NFR-01–NFR-08 ใน [Non-Functional Requirements](../../01-requirements/01-spec/20260827-05-non-functional-requirements.md) | เอกสาร NFR ถูกสร้างขึ้นมาโดยเฉพาะเพื่อเป็นฐานของแผนนี้ (ดู "ความสัมพันธ์กับเอกสารอื่น" ของเอกสารนั้น) — ทดสอบเท่าที่ execute ได้จริงในสถานะปัจจุบันของโปรเจกต์ (ดู §5 Entry/Exit Criteria สำหรับ NFR ที่ยัง block อยู่) |

---

## 3. Test Environment

### สถานะปัจจุบัน (ไม่มี backend/infra จริง)

เนื่องจากโปรเจกต์นี้ยังเป็นเอกสารล้วน (ไม่มี application source code) การทดสอบระดับ "environment" ในตอนนี้
หมายถึงการตรวจสอบความถูกต้อง/ความสอดคล้องของ **prototype HTML** (เมื่อถูกสร้างใน
`docs/02-design/01-prototypes/v{N}/` โดย `prototype-builder`) เทียบกับ spec/business rule ไม่ใช่การรัน
ทดสอบกับแอปที่ deploy จริง — เมื่อเริ่มพัฒนาแอปจริง ต้องกลับมาเติมรายละเอียด environment (URL, staging/prod,
CI runner) ในส่วนนี้

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
| Health API / wearable (Apple Health, Google Health Connect) | INT-3 | payload จำลองของแคลอรี่เผาผลาญจากอัตราการเต้นหัวใจ รวมถึงกรณีค่าที่ต่างจากค่าประมาณ MET มาก (ดู Risk R5) — เตรียมไว้แต่ไม่ execute รอบนี้ |
| ตาชั่งอัจฉริยะผ่าน Bluetooth | INT-2 | payload น้ำหนัก/องค์ประกอบร่างกายจำลอง รวมกรณีชั่งหลายครั้งในวันเดียว (ดู Risk R5) — เตรียมไว้แต่ไม่ execute รอบนี้ |
| Backend/ระบบบัญชีผู้ใช้ (ยังไม่มีจริง) | NFR-04 (encryption at rest), NFR-06 (data deletion), NFR-08 (local persistence ก่อน sync) | ยัง mock ไม่ได้อย่างมีความหมายเพราะยังไม่มี data model/storage จริงให้ทดสอบ — เป็น NFR ที่ "not testable" ในรอบนี้ (ดู §5) |

---

## 4. Risk Management

ความเสี่ยงด้านล่างดึงมาจากส่วน "จุดที่ยังไม่ได้ระบุ / ควรยืนยันเพิ่มเติม" ของเอกสาร spec แต่ละไฟล์โดยตรง
ตามที่ CLAUDE.md ระบุว่าเอกสารเหล่านี้เป็น read-only upstream — **แผนนี้ไม่ invent ค่าที่ยังไม่ resolve เอง**
เพียงแค่ระบุความเสี่ยงและวิธีรับมือระหว่างที่ยังไม่ resolve

| # | ความเสี่ยง | แหล่งที่มา | Likelihood | Impact | การรับมือ (Mitigation) |
|---|---|---|---|---|---|
| R1 | REC-1 ไม่ได้ระบุ tolerance ว่าวิดีโอต้องใกล้เคียงแคลอรี่เป้าหมายแค่ไหนถึงเรียกว่า "ตรงกัน" ทำให้เขียน test case ที่ตรวจ pass/fail ชัดเจนไม่ได้ | [20260823-02-daily-youtube-recommendation.md § จุดที่ยังไม่ได้ระบุ](../../01-requirements/01-spec/20260823-02-daily-youtube-recommendation.md) | High | Medium (กระทบ core loop Must) | เขียน test case แบบ directional ไปก่อน ("แคลอรี่โดยประมาณของวิดีโอที่แนะนำใกล้เคียงเป้าหมายมากกว่าตัวเลือกอื่นในชุดข้อมูลทดสอบ") จนกว่าจะมีตัวเลข tolerance ที่ยืนยันแล้วผ่าน `feature-list-journey`/`test-suite-builder` |
| R2 | REC-4 ไม่ได้ระบุว่าเวลา/แคลอรี่ของวอร์มอัพ-คูลดาวน์นับรวมในเป้าหมายรายวัน (PLN-3) หรือไม่ — ถ้าตีความผิดจะทำให้ all-or-nothing log ผิดพลาดได้ | [20260823-02-daily-youtube-recommendation.md § จุดที่ยังไม่ได้ระบุ](../../01-requirements/01-spec/20260823-02-daily-youtube-recommendation.md) | Medium | High (กระทบความแม่นยำของ PLN-3/PLN-4 ซึ่งเป็น Must/Should) | เขียน test case ของ REC-4 ครอบคลุมทั้ง 2 กรณี (นับรวม / ไม่นับรวม) ไว้ก่อน และ mark ว่ารอ decision — ห้าม lock ค่าใดค่าหนึ่งลงใน acceptance criteria จนกว่าจะยืนยัน |
| R3 | PLN-1 ไม่ได้ระบุว่าผู้ใช้แก้ไขแผนของวันที่ผ่านไปแล้ว (มี log แล้ว) ได้หรือไม่ | [20260823-03-planner-logging.md § จุดที่ยังไม่ได้ระบุ](../../01-requirements/01-spec/20260823-03-planner-logging.md) | Low–Medium | Low (ไม่ใช่ core loop รายวัน) | สมมติฐานเริ่มต้นสำหรับการออกแบบ test case: read-only สำหรับวันที่มี log แล้ว จนกว่าจะยืนยันตรงกันข้าม — ถ้ามีการ implement ให้แก้ไขได้ ต้องกลับมาทบทวน test case นี้ |
| R4 | INT-1 ไม่ได้ระบุจำนวนวัน log ขั้นต่ำก่อนเริ่มพยากรณ์วันถึงเป้าหมาย — พยากรณ์จากข้อมูล 1 วันอาจให้ผลลัพธ์ที่เข้าใจผิดได้ | [20260823-04-smart-integrations.md § จุดที่ยังไม่ได้ระบุ](../../01-requirements/01-spec/20260823-04-smart-integrations.md) | Medium | Medium (Could — ไม่กระทบ core loop แต่กระทบความน่าเชื่อถือของ insight) | นอกขอบเขต execute รอบนี้ (Epic 4 = Could) — เตรียม test case ที่ระบุ edge case "log น้อยวัน" ไว้ล่วงหน้าเพื่อบังคับให้ทีมยืนยันค่าขั้นต่ำก่อน implement จริง |
| R5 | INT-2/INT-3 ไม่ได้ระบุลำดับความสำคัญเมื่อข้อมูลชนกัน (ชั่งน้ำหนักหลายครั้ง/วัน ใช้ค่าล่าสุดหรือค่าเฉลี่ย; wearable ต่างจากค่าประมาณ MET มากควรทำอย่างไร) — ค่าที่ผิดจะไหลต่อไปกระทบ TDEE, REC-2, PLN-3, INT-1 | [20260823-04-smart-integrations.md § จุดที่ยังไม่ได้ระบุ](../../01-requirements/01-spec/20260823-04-smart-integrations.md) | Medium | High (ข้อมูลผิดไหลต่อหลาย feature แม้ตัว Epic 4 เองเป็น Could) | นอกขอบเขต execute รอบนี้ — เมื่อถึงเวลา implement ต้อง resolve ก่อนเขียน test case แบบ conflict-data จริงจัง ระหว่างนี้เขียนได้เฉพาะ happy-path (ไม่มีข้อมูลชนกัน) |
| R6 | NFR-01 ยังไม่มีตัวเลข threshold เวลาโหลด Daily Dashboard ที่แน่นอน (เช่น "< 2 วิ บน 4G") เพราะยังไม่มี backend/infra จริงให้วัด | [NFR § จุดที่ยังไม่ได้ระบุ](../../01-requirements/01-spec/20260827-05-non-functional-requirements.md) | High | Medium | ทดสอบเชิงคุณภาพไปก่อน ("การแสดงผลรู้สึกหน่วงหรือไม่ในสายตาผู้ทดสอบ") แทนตัวเลขที่ชัดเจน จนกว่าจะยืนยัน threshold ตอนเข้า implementation จริง |
| R7 | NFR-04 (encryption at rest) และ NFR-06 (data deletion) พึ่งพาระบบบัญชีผู้ใช้/backend storage จริงที่ยังไม่มีในโปรเจกต์นี้ | [NFR § จุดที่ยังไม่ได้ระบุ](../../01-requirements/01-spec/20260827-05-non-functional-requirements.md) | Certain (ยืนยันจากสถานะโปรเจกต์ใน CLAUDE.md) | Low ตอนนี้ / High เมื่อมีระบบจริง | Mark เป็น **"not testable in this round"** อย่างชัดเจนในผลการทดสอบ ไม่ใช่ skip เงียบ ๆ — บันทึกเป็นรายการที่ต้องกลับมาทดสอบเมื่อมี backend |
| R8 | NFR-07 ยังไม่มีตัวเลข uptime/SLA เฉพาะสำหรับ YouTube/Health API เพราะเป็น third-party service ที่ทีมไม่ได้ควบคุม SLA เอง | [NFR § จุดที่ยังไม่ได้ระบุ](../../01-requirements/01-spec/20260827-05-non-functional-requirements.md) | Medium | Medium | ทดสอบพฤติกรรม fallback ด้วยการ inject timeout/error ปลอมใน mock (ดู §3) แทนการอิงตัวเลข SLA จริง — ยืนยันแค่ว่า "core loop ยังใช้งานได้เมื่อ external API ล่ม" ตรงตาม NFR-07 |
| R9 | Data retention period ของ log ประวัติย้อนหลัง (PLN-3) ยังไม่ได้ระบุ เกี่ยวโยงกับ NFR-06 | [NFR § จุดที่ยังไม่ได้ระบุ](../../01-requirements/01-spec/20260827-05-non-functional-requirements.md) | Low (ยังไม่ใช่เงื่อนไข Must ของรอบนี้) | Low ตอนนี้ | นอกขอบเขตการทดสอบรอบนี้ — บันทึกเป็น open question รอ resolve ก่อนเขียน test case เรื่อง log purge/retention |

---

## 5. Entry/Exit Criteria

### Entry Criteria (เงื่อนไขก่อนเริ่มทดสอบรอบนี้)

1. Requirement (`01-spec/`), Backlog (`backlog.md`), และ User Journey (`user-journeys.md`) ของทุก
   feature ในขอบเขต (Must + Should) ต้องผ่านการ audit ของ `feature-list-journey` แล้วและไม่มี
   contradiction ค้างอยู่ — ตรวจสอบแล้วในตอนเขียนแผนนี้ว่า **backlog.md และ NFR doc สอดคล้องกัน**
   (Epic 4 = Could ทั้งคู่) ไม่พบความขัดแย้งระหว่าง Requirement/Backlog ที่ต้องหยุดรอ
2. [`docs/01-requirements/acceptance-criteria.md`](../../01-requirements/acceptance-criteria.md) — สร้าง
   เสร็จแล้ว (38 scenario ครอบคลุมทั้ง 13 Feature ID) ในการรัน `test-suite-builder` รอบเดียวกับแผนฉบับนี้
   จึงพร้อมให้ `test-cases/{epic-slug}.md` อ้างอิง AC ID ได้ครบทุก feature
3. เตรียม mock/stub ของ YouTube API, Health API/wearable, และ Bluetooth สมาร์ตสเกล ตาม §3 ให้พร้อม
   ก่อนเริ่ม Integration Testing
4. DESIGN.md และ prototype (ถ้ามีการสร้างแล้วใน `02-design/01-prototypes/v{N}/`) พร้อมใช้อ้างอิงสำหรับ
   Usability Testing ของ onboarding flow

### Exit Criteria (เงื่อนไขที่ถือว่า "พอสำหรับรอบนี้")

1. Test case ของทุก feature ระดับ **Must** (ONB-1/2/3, REC-1/2, PLN-1/2/3) ถูก execute ครบ และไม่มี
   defect ระดับ Critical/High ค้างอยู่โดยไม่มีแผนแก้ไข
2. Test case ของทุก feature ระดับ **Should** (REC-3/4, PLN-4) ถูก execute ครบ — defect ที่พบ (ถ้าไม่ใช่
   Critical/High) บันทึกไว้ใน `docs/03-testing/02-test-result/` ได้โดยไม่ block การ exit
3. Feature ระดับ **Could** (Epic 4 ทั้งหมด) ถูกยืนยันชัดเจนว่า **ไม่ execute ในรอบนี้** ตาม §1 Scope —
   ไม่ถือเป็นเงื่อนไข exit ของรอบนี้
4. NFR ที่ **execute ได้จริง** ในสถานะปัจจุบัน (NFR-01, NFR-02, NFR-03, NFR-05, NFR-07 บางส่วนผ่าน mock)
   ผ่านเกณฑ์เชิงคุณภาพตาม §4 (R6, R8) — ส่วน NFR-04/NFR-06/NFR-08 (พึ่ง backend จริง) ถูก mark ว่า
   **"not testable in this round"** อย่างชัดแจ้งใน test result ไม่ใช่ถูกละไว้เฉย ๆ
5. ความเสี่ยงทั้งหมดใน §4 ถูกบันทึกสถานะ (resolved / accepted-as-is / deferred พร้อมเหตุผล) ก่อนปิดรอบ
   — ไม่จำเป็นต้อง resolve ทุกข้อ แต่ต้องมีการตัดสินใจที่ชัดเจนต่อแต่ละข้อ ไม่ใช่ถูกลืม
6. ผลการทดสอบถูกบันทึกไว้ใน `docs/03-testing/02-test-result/` และสรุปไว้ใน
   `docs/05-log/{YYYYMMDD}-log.md` ของวันที่ทดสอบเสร็จ

---

## เอกสารอ้างอิง

- [docs/01-requirements/backlog.md](../../01-requirements/backlog.md) — ที่มาของ MoSCoW Priority และ
  ขอบเขตในหัวข้อ 1
- [Non-Functional Requirements (NFR-01–NFR-08)](../../01-requirements/01-spec/20260827-05-non-functional-requirements.md)
  — ที่มาของหัวข้อ 2 (NFR-driven Testing) และความเสี่ยง R6–R9 ในหัวข้อ 4
- [docs/02-design/01-prototypes/user-journeys.md](../../02-design/01-prototypes/user-journeys.md) —
  อ้างอิง flow/Preconditions ที่ใช้ในการออกแบบ Usability Testing ของ onboarding
- `docs/01-requirements/01-spec/` ทั้ง 4 ไฟล์ — ที่มาของความเสี่ยง R1–R5 ในหัวข้อ 4 (ดูลิงก์ต่อแถวในตาราง)
- ผลการทดสอบจริง: [docs/03-testing/02-test-result/](../02-test-result/index.md)
