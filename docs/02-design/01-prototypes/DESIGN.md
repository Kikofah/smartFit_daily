# smartFit_daily — Design System (DESIGN.md)

เอกสารนี้คือ **Design System** ของ smartFit_daily ใช้เป็นแหล่งอ้างอิงเดียว (single source of truth)
สำหรับทีม design และ dev เวลาสร้างหน้าจอ/component ใหม่ อ้างอิงมาจาก feature และ requirement ใน
[Product Backlog](../../01-requirements/backlog.md) และ [User Journeys](./user-journeys.md) —
เวลาเพิ่ม feature ใหม่ ให้ตรวจสอบก่อนว่ามี pattern ที่ใช้ได้อยู่แล้วในเอกสารนี้หรือไม่ ก่อนออกแบบ component ใหม่

## แนวคิดหลัก (Design Principles)

**Earth Tone + Minimalist + Muji-inspired** — 3 คำนี้กำกับทุกการตัดสินใจในเอกสารนี้:

1. **Earth Tone** — สีทั้งหมดมาจากธรรมชาติ (ดิน, กระดาษ Kraft, ใบไม้, หิน) ไม่มีสีสดจัด (saturated/neon)
   สีที่ดู "สงบ" กว่าดู "ตื่นเต้น" เสมอ
2. **Minimalist** — ลดทุกอย่างที่ไม่จำเป็นออก 1 หน้าจอมี primary action เดียว ไม่ใช้ shadow/gradient/
   decoration เกินความจำเป็น เว้นที่ว่าง (white space) ให้มากพอที่จะหายใจได้
3. **Muji-inspired** (無印良品 — "ไม่มีตรา ไม่มียี่ห้อ" / no-brand quality) — ออกแบบให้ตัว product ทำหน้าที่
   ของมันให้ดีที่สุดโดยไม่ต้องประกาศตัวเองด้วยภาพหรือคำพูดที่เกินจริง ไม่ใช้ hype, ไม่ใช้ gamification
   ที่กดดันผู้ใช้, ซื่อตรงกับข้อมูลจริง (เช่น แคลอรี่ที่คำนวณจริงจาก [REC-2](../../01-requirements/01-spec/20260823-02-daily-youtube-recommendation.md))

> กฎทดสอบง่าย ๆ: ถ้า component หรือ copy ไหน "ดูเหมือนแอปออกกำลังกายทั่วไปที่กดดันให้ผู้ใช้รู้สึกผิด"
> (สีแดงจัด, เครื่องหมายตกใจ, ตัวหนาเต็มจอ, สี confetti) — ให้ออกแบบใหม่ตามแนวทางนี้

---

## 1. Brand Identity & CI

### 1.1 Brand Essence

| หัวข้อ | รายละเอียด |
|---|---|
| ชื่อ product | smartFit_daily |
| Wordmark ที่ใช้แสดงผล | `smartfit daily` — ตัวพิมพ์เล็กทั้งหมด ไม่มีสัญลักษณ์/โลโก้กราฟิกใน v1 (ดู 1.3) |
| Positioning | เพื่อนคู่ใจที่ช่วยสร้างวินัยออกกำลังกายรายวันแบบยั่งยืน ไม่ใช่โค้ชที่กดดันหรือแอปนับแคลอรี่ที่ทำให้รู้สึกผิด |
| Mission | ทำให้การออกกำลังกายวันนี้ "พอดี" กับร่างกายและเวลาที่มีจริงของผู้ใช้ ไม่ใช่ทำให้ผู้ใช้ต้องไล่ตามเป้าที่ไม่สมจริง |
| ไม่ใช่ | ไม่ใช่แอปแข่งขัน/leaderboard, ไม่ใช่แอปที่ลงโทษผู้ใช้ที่พลาดวัน, ไม่ใช่แอปที่ยัดโฆษณา/upsell ระหว่างใช้งาน |

### 1.2 Brand Personality & Voice

| Trait | คำอธิบาย | ในทางปฏิบัติ |
|---|---|---|
| Calm (สงบ) | ไม่เร่งเร้า ไม่ใช้ urgency ปลอม | ไม่ใช้ countdown timer กดดัน, ไม่ใช้สีแดงเตือนโดยไม่จำเป็น |
| Honest (ซื่อตรง) | บอกความจริงตามข้อมูล ไม่ปั้นตัวเลขให้ดูดีเกินจริง | แคลอรี่ที่แสดงต้องเป็นค่าที่คำนวณจริงตาม REQ-05 ไม่ใช่ตัวเลขกลม ๆ ที่ทำให้รู้สึกดี |
| Functional (เน้นใช้งาน) | ทุก element มีหน้าที่ ไม่มีของประดับ | ถ้าลบ element ออกแล้ว user ยังทำงานเดิมได้ครบ ให้ลบออก |
| Warm (อบอุ่น) | เป็นกันเองแต่ไม่ตลกเกินไป ไม่ใช่ราชการ/เย็นชา | ใช้ภาษาพูดปกติ ("วันนี้ยังไหวไหม") ไม่ใช้ภาษาทางการ ("กรุณาดำเนินการ") |
| Unpretentious (ไม่โอ้อวด) | ไม่ใช้ hype/marketing language, ไม่ใช้ superlative | ห้ามใช้คำว่า "ที่สุด", "อันดับ 1", "เปลี่ยนชีวิตคุณ" ในทุก copy |

**กฎการเขียน copy (สำคัญ เพราะโครงสร้าง streak เป็น all-or-nothing ตาม
[PLN-4](../../01-requirements/01-spec/20260823-03-planner-logging.md)):**

- ห้ามใช้คำที่สร้างความรู้สึกผิด (guilt) เมื่อผู้ใช้พลาดเป้าหมาย เช่น "คุณล้มเหลว", "แย่มาก", "หมดสิทธิ์"
  ให้ใช้โทนที่ยอมรับความจริงแบบเป็นกลางแล้วชวนต่อ เช่น "วันนี้ยังไม่ครบเป้า พรุ่งนี้เริ่มนับใหม่ได้"
- ห้ามใช้เครื่องหมายตกใจ (!) เกิน 1 ครั้งต่อหน้าจอ และห้ามใช้กับข้อความที่เกี่ยวกับความล้มเหลว/ข้อผิดพลาดเลย
- ตัวเลขแคลอรี่/น้ำหนัก/streak ต้องแสดงตามจริงเสมอ ห้าม "ปัดให้สวย" หรือซ่อนเมื่อค่าไม่น่าพอใจ

### 1.3 Logo & Mark

- v1 ใช้ **wordmark เท่านั้น** (`smartfit daily`, ตัวพิมพ์เล็ก, font ตาม 2.2, สี `--color-ink`)
  ไม่มี symbol/icon แยก เพื่อคงความเรียบตามหลัก Muji-inspired (ไม่ต้องมีตราสัญลักษณ์ที่ต้องจดจำ)
- ถ้าต้องการ mark ในอนาคต (เช่น สำหรับ app icon) แนะนำรูปทรงเรียบง่ายที่สื่อถึง "วงแคลอรี่รายวัน"
  (ring/circle motif ที่ใช้ซ้ำกับ Calorie Ring component ใน 3.2) แทนการออกแบบ mascot หรือสัตว์/คนการ์ตูน
  — ยังไม่ finalize เป็น open point รอ design review

### 1.4 Imagery & Iconography style

- ภาพประกอบ (ถ้ามี) เป็นภาพถ่ายจริง โทนสีธรรมชาติ แสงนวล ไม่ใช้ stock photo ที่ยิ้มเกินจริงแบบโฆษณาฟิตเนส
- Icon เป็น **line icon** เส้น 1.5px มุมมนเล็กน้อย (ดู 2.5) ห้ามใช้ icon แบบ filled/gradient/3D
- ไม่ใช้ emoji ใน UI จริง (ใช้ได้เฉพาะในเอกสารภายใน/log ไม่ใช่หน้าจอที่ผู้ใช้เห็น)

---

## 2. Design Tokens

Token ทั้งหมดตั้งชื่อแบบ semantic (ตามหน้าที่ ไม่ใช่ตามชื่อสี) เพื่อให้เปลี่ยน palette ได้โดยไม่ต้องแก้ทุกจุดที่ใช้

### 2.1 Colors

**Neutrals — Paper & Ink** (พื้นหลัง/ตัวอักษร หลักของทั้งแอป)

| Token | Hex | ใช้ที่ไหน |
|---|---|---|
| `--color-paper` | `#F6F2EA` | พื้นหลังหลักของทุกหน้าจอ (โทนกระดาษ Kraft ไม่ฟอกขาว) |
| `--color-paper-alt` | `#EFE9DC` | พื้นผิว card/section ที่ต้องการแยกจากพื้นหลังหลักเล็กน้อย |
| `--color-paper-sunken` | `#E7DFCF` | พื้นที่ inset เช่น input field, progress track (พื้นหลังของหลอด progress) |
| `--color-ink` | `#33302A` | ตัวอักษรหลัก (ไม่ใช้ดำสนิท `#000` เพื่อความนุ่มนวลแบบ Muji) |
| `--color-ink-muted` | `#6B6459` | ตัวอักษรรอง/label/caption |
| `--color-ink-faint` | `#9C9484` | placeholder, ตัวอักษร disabled |
| `--color-border` | `#DAD2C1` | เส้นแบ่ง/hairline border ทั่วไป (ใช้แทน shadow เป็นหลัก — ดู 2.4) |
| `--color-border-strong` | `#C4B9A2` | border ที่ต้องการเน้นขึ้นเล็กน้อย เช่น input ตอน focus (ไม่ใช้สี accent กับ border ปกติ) |

**Brand & Accent** (ใช้อย่างประหยัด — ห้ามใช้เกิน 1 accent color เด่นต่อหน้าจอ)

| Token | Hex | ชื่อ | ใช้ที่ไหน |
|---|---|---|---|
| `--color-clay` | `#B4694C` | Clay | Primary action (ปุ่มหลัก, ลิงก์สำคัญ, active tab) |
| `--color-clay-strong` | `#9C5940` | Clay (pressed) | สถานะ hover/pressed ของปุ่มหลัก |
| `--color-sage` | `#7E8F6C` | Sage | ความสำเร็จ/ครบเป้าหมาย/streak ต่อเนื่อง ([PLN-3](../../01-requirements/01-spec/20260823-03-planner-logging.md), [PLN-4](../../01-requirements/01-spec/20260823-03-planner-logging.md)) |
| `--color-sage-strong` | `#687858` | Sage (pressed) | สถานะ hover/pressed ของ element สีเขียว |
| `--color-sand` | `#C9A26B` | Sand | accent รอง ใช้เฉพาะ tag/badge ที่ไม่ต้องการดึงความสนใจเท่า Clay (เช่น equipment tag ของ [ONB-2](../../01-requirements/01-spec/20260823-01-onboarding-personalization.md)) |

**Semantic** (สถานะของระบบ — ดูกฎการใช้ในหัวข้อ 4.2 ด้วย เพราะมีข้อยกเว้นสำคัญเรื่อง "พลาดเป้าหมาย")

| Token | Hex | ใช้ที่ไหน |
|---|---|---|
| `--color-success` | `#7E8F6C` (= Sage) | ยืนยันความสำเร็จ (เช่น sync ตาชั่งสำเร็จ) |
| `--color-warning` | `#BE9A4D` | สิ่งที่ต้องระวังแต่ไม่ใช่ข้อผิดพลาด เช่น ใกล้ safety floor ของ [ONB-3](../../01-requirements/01-spec/20260823-01-onboarding-personalization.md) |
| `--color-danger` | `#A85A45` | ข้อผิดพลาดจริงของระบบ/ฟอร์ม (เช่น กรอกข้อมูลไม่ถูกต้อง) **ห้ามใช้กับสถานะ "ไม่ครบเป้าหมาย" ของผู้ใช้** |
| `--color-info` | `#7A8B86` | ข้อความแจ้งเตือนทั่วไปที่เป็นกลาง (เช่น "ยังไม่มีข้อมูลเพียงพอสำหรับพยากรณ์" ของ [INT-1](../../01-requirements/01-spec/20260823-04-smart-integrations.md)) |

ตัวอย่าง CSS variables:

```css
:root {
  /* Neutrals */
  --color-paper: #F6F2EA;
  --color-paper-alt: #EFE9DC;
  --color-paper-sunken: #E7DFCF;
  --color-ink: #33302A;
  --color-ink-muted: #6B6459;
  --color-ink-faint: #9C9484;
  --color-border: #DAD2C1;
  --color-border-strong: #C4B9A2;

  /* Brand */
  --color-clay: #B4694C;
  --color-clay-strong: #9C5940;
  --color-sage: #7E8F6C;
  --color-sage-strong: #687858;
  --color-sand: #C9A26B;

  /* Semantic */
  --color-success: var(--color-sage);
  --color-warning: #BE9A4D;
  --color-danger: #A85A45;
  --color-info: #7A8B86;
}
```

**กฎการใช้สี:**

1. พื้นหลังหลักต้องเป็น `--color-paper` เสมอ ห้ามใช้ขาวสนิท (`#FFFFFF`) เพราะทำลายความรู้สึก earth tone
2. ห้ามมี accent color (Clay/Sage/Sand) เกิน 1 สีเป็นสีเด่นในหน้าจอเดียว — สีที่เหลือใช้เป็น neutral
3. คู่สีตัวอักษร/พื้นหลังทุกคู่ต้องผ่าน WCAG AA (contrast ratio ≥ 4.5:1 สำหรับ body text, ≥ 3:1 สำหรับ
   ตัวอักษรใหญ่/หัวข้อ) — `--color-ink` บน `--color-paper` และ `--color-paper-alt` ผ่านเกณฑ์นี้แล้ว
   ตรวจสอบใหม่ทุกครั้งที่เพิ่ม token สีใหม่

### 2.2 Typography

**Font family**: [IBM Plex Sans Thai](https://fonts.google.com/specimen/IBM+Plex+Sans+Thai) คู่กับ
[IBM Plex Sans](https://fonts.google.com/specimen/IBM+Plex+Sans) (Latin) — เลือกเพราะเป็น family
เดียวกันที่ออกแบบมาให้ใช้คู่กัน ทั้งสองภาษาให้ความรู้สึก geometric-humanist ที่เรียบ ไม่มีบุคลิกเกินความจำเป็น
ตรงกับหลัก Muji-inspired (ตัวอักษรที่ "ไม่ประกาศตัวเอง") ตัวอย่าง fallback stack:

```css
--font-family-base: "IBM Plex Sans Thai", "IBM Plex Sans", -apple-system,
  "Noto Sans Thai", "Segoe UI", sans-serif;
```

**น้ำหนักตัวอักษรที่ใช้ (จำกัดเพื่อความเรียบ)**: Regular (400), Medium (500), Semibold (600) เท่านั้น
— **ห้ามใช้ Bold/Black (700+) และห้ามใช้ตัวเอียง (italic)** ทั้งแอป

| Token | Size | Line-height | Weight | ใช้ที่ไหน |
|---|---|---|---|---|
| `--font-display` | 28px | 36px | Semibold | ตัวเลขเด่น เช่น แคลอรี่เป้าหมายรายวัน, streak count |
| `--font-h1` | 22px | 30px | Semibold | หัวข้อหน้าจอหลัก |
| `--font-h2` | 18px | 26px | Medium | หัวข้อ section ภายในหน้าจอ |
| `--font-h3` | 16px | 22px | Medium | หัวข้อ card/component |
| `--font-body` | 15px | 22px | Regular | เนื้อหาทั่วไป, ปุ่ม, input |
| `--font-body-sm` | 13px | 18px | Regular | คำอธิบายรอง, metadata (เช่น เวลาวิดีโอ) |
| `--font-caption` | 12px | 16px | Medium | label, tag, timestamp |

**กฎ**: ไม่มี H4-H6 — ถ้า hierarchy ลึกกว่า 3 ระดับใน 1 หน้าจอ ให้ปรับ information architecture ก่อน
เพิ่ม font size ใหม่ (ตรงกับหลัก Minimalist ข้อ 2)

### 2.3 Spacing

Grid 4px เป็นฐาน (ทุกระยะห่างต้องเป็นจำนวนเท่าของ 4px):

| Token | Value | ใช้ที่ไหน |
|---|---|---|
| `--space-1` | 4px | ระยะห่างเล็กที่สุด (icon กับ label ข้าง ๆ) |
| `--space-2` | 8px | ระยะห่างภายใน component เล็ก (padding ปุ่มแนวตั้ง) |
| `--space-3` | 12px | ระยะห่างระหว่าง element ที่เกี่ยวข้องกันในกลุ่มเดียว |
| `--space-4` | 16px | padding มาตรฐานของ card, ระยะห่างระหว่างกลุ่ม element |
| `--space-6` | 24px | ระยะห่างระหว่าง section ภายในหน้าจอเดียว |
| `--space-8` | 32px | ระยะห่างขอบซ้าย-ขวาของหน้าจอ (screen margin) |
| `--space-12` | 48px | ระยะห่างระหว่าง section ใหญ่ (เช่น ก่อน bottom navigation) |
| `--space-16` | 64px | ระยะห่างบน/ล่างของ empty state |

**กฎ**: screen margin ซ้าย-ขวาคงที่ที่ `--space-8` (32px) ทุกหน้าจอ เพื่อให้ layout สงบและคาดเดาได้
(ส่วนหนึ่งของหลัก Minimalist — ไม่ปรับ margin เพื่อ "อัดเนื้อหา" ให้พอดีหน้าจอ)

### 2.4 Elevation & Border

Muji-inspired ปฏิเสธ drop shadow เป็นหลัก ใช้ **hairline border** แทนการยกระดับด้วย shadow เกือบทุกกรณี:

| Token | Value | ใช้ที่ไหน |
|---|---|---|
| `--border-width` | 1px | ทุก border ในระบบ (ไม่มี border หนากว่านี้) |
| `--radius-sm` | 4px | tag, chip, input เล็ก |
| `--radius-md` | 8px | button, input, card เล็ก |
| `--radius-lg` | 12px | card หลัก, modal, bottom sheet |
| `--shadow-float` | `0 2px 8px rgba(51,48,42,0.06)` | ใช้เฉพาะ element ที่ "ลอย" เหนือ content จริง ๆ เช่น modal, bottom sheet, floating action — **ห้ามใช้กับ card ปกติ** (ใช้ `--color-border` แทน) |

### 2.5 Iconography & Motion

- **Icon**: เส้น (outline) หนา 1.5px, มุมโค้งเล็กน้อย (corner radius ของ stroke), ขนาดมาตรฐาน 20px/24px,
  สีตาม `--color-ink` หรือ `--color-ink-muted` เป็นหลัก (ใช้สี accent บน icon เฉพาะตอน active/selected)
- **Motion**: ระยะเวลา 150–250ms, easing `ease-out` เท่านั้น ห้ามใช้ bounce/spring/elastic (ขัดกับความสงบ)
  เคารพ `prefers-reduced-motion` เสมอ — ถ้า user ตั้งค่านี้ไว้ ให้ตัด transition เหลือแค่ fade สั้น ๆ หรือไม่มีเลย
- ห้ามใช้ confetti, particle effect, หรือ celebratory animation ขนาดใหญ่เมื่อทำเป้าหมายสำเร็จ — ใช้การเปลี่ยน
  สี/ไอคอนแบบนุ่มนวล (เช่น ring เปลี่ยนเป็น `--color-sage` ) แทนการฉลองแบบโฆษณา

---

## 3. UI Components & Patterns

Component หลักของแอป อ้างอิงจาก feature ใน [Product Backlog](../../01-requirements/backlog.md)
รายการนี้ไม่ครบทุก component แต่ครอบคลุม pattern หลักที่ใช้ซ้ำได้ — component ใหม่ควร compose มาจาก
รายการนี้ก่อนออกแบบใหม่ทั้งหมด

### 3.1 Buttons

| Variant | ใช้เมื่อ | สไตล์ |
|---|---|---|
| Primary | 1 ปุ่มเด่นต่อหน้าจอ (เช่น "บันทึก", "เริ่มออกกำลังกาย") | พื้น `--color-clay`, ตัวอักษรสี `--color-paper`, `--radius-md` |
| Secondary | action รองที่ยังสำคัญ (เช่น "เปลี่ยนวิดีโอ" ของ [REC-3](../../01-requirements/01-spec/20260823-02-daily-youtube-recommendation.md)) | พื้น `--color-paper-alt`, border `--color-border-strong`, ตัวอักษร `--color-ink` |
| Ghost/Text | action เบา (เช่น "ข้าม", "ยกเลิก") | ไม่มีพื้น/border, ตัวอักษร `--color-ink-muted`, underline ตอน hover |
| Destructive | ลบ/ยกเลิกแบบถาวรเท่านั้น | ตัวอักษร/border `--color-danger` บนพื้น `--color-paper` (ไม่ใช้พื้นแดงเต็ม ป้องกันความรุนแรงเกินไป) |

กฎ: ปุ่ม 1 ปุ่ม = 1 action เท่านั้น ห้ามปุ่มที่ทำสองอย่าง (เช่น "บันทึกและแชร์") ให้แยกเป็น 2 ปุ่มหรือ 2 ขั้นตอน

### 3.2 Calorie Ring / Progress Indicator

ใช้แสดงความคืบหน้าของเป้าหมายแคลอรี่รายวัน (เชื่อมกับ [ONB-3](../../01-requirements/01-spec/20260823-01-onboarding-personalization.md),
[REC-2](../../01-requirements/01-spec/20260823-02-daily-youtube-recommendation.md), [PLN-3](../../01-requirements/01-spec/20260823-03-planner-logging.md))

- รูปทรง ring บาง (stroke 6–8px) พื้นหลัง track สี `--color-paper-sunken`, progress สี `--color-clay`
  จนกว่าจะครบ 100% แล้วเปลี่ยนเป็น `--color-sage` (ตรงกับกติกา all-or-nothing ของ PLN-3 — **ไม่มีสถานะ
  ระหว่างกลางที่เป็นสีเตือน/สีแดง** เพราะยังไม่ถึงเป้าหมายไม่ใช่ข้อผิดพลาด)
- ตัวเลขกลาง ring ใช้ `--font-display`
- ไม่ใช้ gradient บน ring (ขัดหลัก Minimalist) ใช้สีทึบเรียบเท่านั้น

### 3.3 Video Recommendation Card

แสดงวิดีโอที่แนะนำจาก [REC-1](../../01-requirements/01-spec/20260823-02-daily-youtube-recommendation.md)/[REC-4](../../01-requirements/01-spec/20260823-02-daily-youtube-recommendation.md)

- Layout: thumbnail 16:9 ด้านบน (มุมโค้ง `--radius-lg` เฉพาะมุมบน), เนื้อหาด้านล่างมี padding `--space-4`
- Metadata แถวเดียว: ระยะเวลา · ประเภทกิจกรรม (tag) · แคลอรี่ประมาณ — ใช้ `--font-body-sm` สี `--color-ink-muted`
- ถ้ามี warmup/cooldown (REC-4) ให้แสดง tag เล็ก "รวมวอร์มอัพ-คูลดาวน์" ไม่ต้องแยก card
- ปุ่ม "เปลี่ยนวิดีโอ" เป็น Secondary button มุมขวาล่างของ card เสมอ (ตำแหน่งคาดเดาได้)

### 3.4 Equipment / Filter Chip

ใช้ใน [ONB-2](../../01-requirements/01-spec/20260823-01-onboarding-personalization.md) และเป็น filter
ของวิดีโอ

- รูปทรง pill (`--radius-lg` เท่ากับความสูง/2), พื้น `--color-paper-alt` ตอนไม่เลือก, พื้น `--color-sand`
  ตัวอักษร `--color-ink` ตอนเลือกแล้ว (ไม่ใช้ `--color-clay` กับ chip เพื่อเก็บสีนั้นไว้ให้ primary action)
- เลือกได้หลายอันพร้อมกัน (multi-select) แสดง checkmark icon เล็กเมื่อเลือก

### 3.5 Weekly Planner Grid

ปฏิทินรายสัปดาห์ของ [PLN-1](../../01-requirements/01-spec/20260823-03-planner-logging.md)

- 7 คอลัมน์เท่ากัน, วันปัจจุบันมี border `--color-clay` หนา 2px (ข้อยกเว้นเดียวที่ border หนากว่า 1px ได้)
- สถานะวันแต่ละวันสื่อด้วย **icon + สี ไม่ใช่สีเดี่ยว** (accessibility, ดู 4.3):
  - ครบเป้าหมาย: icon ✓ สี `--color-sage`
  - Cheat/Rest Day ([PLN-2](../../01-requirements/01-spec/20260823-03-planner-logging.md)): icon วงกลมประ สี `--color-sand`
  - ไม่ครบเป้าหมาย/ยังไม่ถึงวัน: ไม่มี icon พื้นหลัง `--color-paper-alt` เฉย ๆ (ไม่ใช้สีแดง/ไอคอนตกใจ —
    ดูกฎในหัวข้อ 4.2)

### 3.6 Streak Badge

แสดง streak ต่อเนื่องจาก [PLN-4](../../01-requirements/01-spec/20260823-03-planner-logging.md)

- Badge ทรงเรียบ (ไม่ใช่ trophy/medal graphic) มีไอคอนเปลวไฟเส้น (line icon) + ตัวเลขวัน
- สีพื้น `--color-paper-alt`, ตัวเลข/icon สี `--color-clay` เมื่อ streak > 0, สี `--color-ink-faint`
  เมื่อ streak = 0 (ไม่ใช้สีแดง/ข้อความลบเมื่อ streak ขาด — เป็นกลาง ไม่ตัดสิน)

### 3.7 Forms & Inputs

ใช้ใน Onboarding ([ONB-1](../../01-requirements/01-spec/20260823-01-onboarding-personalization.md)–[ONB-3](../../01-requirements/01-spec/20260823-01-onboarding-personalization.md))
เป็นหลัก

- Input field: พื้น `--color-paper-sunken`, ไม่มี border ตอน default, border `--color-clay` 1px เฉพาะ
  ตอน focus, `--radius-md`
- ตัวเลข (อายุ/น้ำหนัก/ส่วนสูง) ใช้ stepper (+/− ปุ่มเล็ก) ควบคู่กับพิมพ์ตรงได้ ไม่ใช้ slider (ควบคุมค่าพอดียาก)
- Error state: ข้อความ error ใต้ input สี `--color-danger`, border input เปลี่ยนเป็น `--color-danger`
  — ใช้เฉพาะ validation error จริง (เช่น กรอกน้ำหนักติดลบ) ไม่ใช่กับค่าที่ไม่น่าพอใจแต่ valid

### 3.8 Empty & Neutral States

- ทุก empty state ต้องมี: ข้อความอธิบายสถานะแบบเป็นกลาง + 1 action ที่พาผู้ใช้ไปทำต่อได้ (ไม่ใช่แค่บอกว่า "ไม่มีข้อมูล")
- ตัวอย่าง: ยังไม่มีข้อมูลพอพยากรณ์ ([INT-1](../../01-requirements/01-spec/20260823-04-smart-integrations.md))
  → "ยังต้องบันทึกผลอีก N วันก่อนเริ่มพยากรณ์ได้" (ใช้ `--color-info` ไม่ใช่ `--color-warning`)
- ไม่ใช้ภาพประกอบ illustration ที่ดูเป็นการ์ตูนเกินไปใน empty state — ใช้ icon line เดียวขนาดใหญ่พอ (48–64px)

---

## 4. UX Guidelines & Rules

### 4.1 Layout & Navigation

- Bottom tab navigation 4 รายการคงที่: **วันนี้** (Home/Recommendation), **แผน** (Planner),
  **ความคืบหน้า** (Progress/Streak/Forecast), **โปรไฟล์** (Profile/Onboarding settings) — ไม่เกิน 4 tab
  เพื่อคงความเรียบ ถ้ามี feature ใหม่ให้พิจารณาใส่ในหน้าที่มีอยู่ก่อนเพิ่ม tab ที่ 5
- 1 primary action ต่อหน้าจอเสมอ (ตรงกับกฎปุ่มใน 3.1)
- Onboarding เป็น flow เชิงเส้น (linear step, ไม่มี branching UI) แสดง progress dot ด้านบนเสมอ

### 4.2 กฎการสื่อสารสถานะ "ไม่ครบเป้าหมาย" (สำคัญที่สุดของ UX guideline นี้)

เนื่องจาก [PLN-3](../../01-requirements/01-spec/20260823-03-planner-logging.md)/[PLN-4](../../01-requirements/01-spec/20260823-03-planner-logging.md)
ใช้กติกา all-or-nothing เข้มงวด (ไม่มี partial credit) — ความเสี่ยงด้าน UX คือผู้ใช้จะรู้สึกว่าแอปตัดสิน/ลงโทษ
ทุกครั้งที่พลาด กฎต่อไปนี้บังคับใช้กับทุกหน้าจอที่แสดงสถานะนี้:

1. **ห้ามใช้ `--color-danger` (สีแดง) กับสถานะ "ไม่ครบเป้าหมาย"** สีนี้สงวนไว้เฉพาะ validation error ของฟอร์ม
   เท่านั้น สถานะไม่ครบเป้าหมายใช้ neutral (`--color-ink-faint` / `--color-paper-alt`) แทน
2. **ห้ามใช้ icon เชิงลบ** (กากบาท ✗, หน้าเศร้า) กับวันที่ไม่ครบเป้าหมาย — ปล่อยให้วันนั้น "เงียบ" (ไม่มี icon)
   แทนการประกาศความล้มเหลว
3. Copy ที่อธิบายสถานะนี้ต้องเป็นข้อเท็จจริง + ทางออก เสมอ ("วันนี้ยังไม่ครบเป้า พรุ่งนี้เริ่มนับใหม่ได้")
   ห้ามใช้คำตัดสินคุณค่า ("ล้มเหลว", "แย่", "หมดสิทธิ์")
4. เมื่อ streak ขาด (reset เป็น 0) ห้ามแสดง modal/popup แจ้งเตือนแบบ interrupt — ให้แสดงเป็นตัวเลขที่เปลี่ยน
   เฉย ๆ ใน Streak Badge (3.6) ผู้ใช้เห็นเองตอนเข้าหน้านั้น ไม่ใช่แอปแจ้งเชิงรุก

### 4.3 Accessibility

- Touch target ขั้นต่ำ 44×44px ทุก interactive element (ปุ่ม, chip, tab)
- Contrast ratio ต้องผ่าน WCAG AA ตามที่ระบุใน 2.1 — ทดสอบทุก token คู่ใหม่ก่อน merge
- **ห้ามสื่อความหมายด้วยสีอย่างเดียว** ทุกที่ที่ใช้สีสื่อสถานะ (ครบเป้าหมาย/Cheat Day/streak) ต้องมี icon
  หรือ label ข้อความควบคู่เสมอ (ดูตัวอย่างใน 3.5, 3.6)
- รองรับ font scaling ของระบบ (Dynamic Type / ตั้งค่าขนาดตัวอักษรของ OS) โดย layout ต้องไม่พังที่ 150%

### 4.4 Data Visualization (กราฟน้ำหนัก/แคลอรี่ของ Smart Integrations)

- ใช้ palette earth tone เดียวกัน ไม่ใช้ palette กราฟสำเร็จรูป (เช่น สีรุ้งของ chart library ทั่วไป)
- เส้นข้อมูลจริงใช้ `--color-clay`, เส้น/พื้นที่เป้าหมายใช้ `--color-sage` แบบจาง (opacity ~30%)
- **ห้ามใช้ red/green แบบ traffic-light กับข้อมูลน้ำหนัก/ร่างกาย** (เช่น น้ำหนักขึ้น = แดง, ลง = เขียว)
  เพราะสื่อ value judgment กับตัวเลขร่างกายที่ผันผวนเป็นปกติ — ใช้ `--color-ink`/`--color-ink-muted`
  กับข้อมูลจริง แล้วให้ `--color-sage` แสดงเฉพาะเส้น/พื้นที่เป้าหมายเท่านั้น

### 4.5 ภาษาและ Localization

- ภาษาไทยเป็นภาษาหลักของทุกหน้าจอ (ตรงกับ [CLAUDE.md](../../../CLAUDE.md)) ศัพท์เทคนิคที่ไม่มีคำไทยที่เข้าใจง่ายกว่า
  ใช้ทับศัพท์ภาษาอังกฤษได้ (เช่น streak, wearable) แต่ label ปุ่ม/หัวข้อหลักต้องเป็นภาษาไทยเสมอ
- รูปแบบวันที่/ตัวเลขตาม locale ไทย (เช่น ค.ศ. หรือ พ.ศ. ต้องตกลงให้ชัดก่อน implement จริง — ดู open point ด้านล่าง)

### 4.6 Motion & Feedback

- ทุก action ที่มีผลกับข้อมูล (บันทึก log, ตั้ง Cheat/Rest Day) ต้องมี feedback ทันที (เปลี่ยนสถานะ UI เห็นได้)
  ภายใน 250ms ไม่ต้องรอ network response ก่อนแสดง optimistic state ถ้าเป็นไปได้
- Toast/inline notification อยู่ได้ไม่เกิน 4 วินาที ห้ามบังปุ่ม primary action

### 4.7 Dark Mode

ยังไม่อยู่ใน scope ของ v1 — แนวคิด Muji-inspired อิงกับพื้นหลังสีกระดาษสว่างเป็นหลัก การทำ dark mode ที่ยังคง
ความเป็น earth tone ต้องออกแบบ palette ใหม่แยก ไม่ใช่แค่ invert สี ถือเป็น **open point** รอ design review
รอบถัดไปเมื่อมี requirement ชัดเจน

---

## Open Points (รอ design review / ยืนยันเพิ่มเติม)

รายการนี้เป็นจุดที่เอกสารนี้จงใจไม่ฟันธง เพื่อไม่เดาแทนการตัดสินใจจริงของทีม — เพิ่ม/ตัดออกเมื่อ resolve แล้ว:

1. **Mark/สัญลักษณ์ของแบรนด์** (1.3) — ยังไม่ finalize ว่าจะมี mark เพิ่มจาก wordmark หรือไม่
2. **Dark mode** (4.7) — ยังไม่ออกแบบ palette คู่ขนาน
3. **ปฏิทิน ค.ศ./พ.ศ.** (4.5) — ยังไม่ยืนยันว่า UI แสดงปีแบบไหนเป็นค่าเริ่มต้น
4. **App icon** — ยังไม่ออกแบบ (ต้องรอผลจาก open point ที่ 1 ก่อน)

---

อ้างอิง: [Product Backlog](../../01-requirements/backlog.md) ·
[User Journeys](./user-journeys.md) · [Requirement Spec ทั้ง 4 epic](../../01-requirements/01-spec/index.md)
