# Wasla Dental Labs — Design System

## Product context

Arabic two-sided POC for dental clinics and dental laboratories. The dentist experience is mobile-first and supports discovering laboratories, creating orders, payment, tracking, and reviews. The laboratory experience is a desktop-first operations portal for receiving cases, reviewing clinical files, quoting, scheduling production, and completing delivery. Frontend-only with local mock data. The product must feel like a credible Saudi medical service, not a generic marketplace.

## Information architecture

1. Sign in: doctor name and Saudi mobile number.
2. Doctor profile: photo preview, specialty, clinic, location, and working hours.
3. Home: 5–6 realistic Saudi/Gulf dental lab cards.
4. Lab details: contact methods, portfolio, physician reviews, and new-order CTA.
5. New order: service, description, attachments, requested date.
6. Interactive order status: waiting, quote, 25% Apple Pay deposit, production, delivery, remaining 75% payment.
7. Review: stars, comment, optional images, submission confirmation.

## Laboratory portal architecture

1. Dashboard: operational summary and cases requiring attention.
2. Incoming orders: searchable/filterable master list with a selected case detail panel.
3. Case review: clinical prescription, tooth numbers, shade, requested service, requested delivery, notes, and attachment preview.
4. Quote decision: request clarification, decline with a reason, or accept with price and estimated turnaround.
5. Production board: accepted cases organized by design review, manufacturing, quality control, ready, and dispatched.
6. Messages: case-linked communication with the dentist.
7. Finance and delivery: deposits, outstanding balances, invoices, courier status, and handoff confirmation.
8. Settings: laboratory profile, services, default turnaround times, team access, and notifications.

The first POC screen is `/lab/orders`: the incoming-orders workspace. It must let a laboratory coordinator understand a new case, inspect its attachments, enter a quote, and take the correct action without leaving the page.

## Visual direction

Use the calm tactile clarity of a high-quality digital wellness app, adapted strictly to healthcare. The interface is clean, grounded, mobile-first, and task-oriented. Avoid decorative noise, glassmorphism, loud gradients, excessive illustration, or AI-looking filler. Use generous but efficient spacing, continuous rounded corners, thin borders, and restrained shadows.

## Brand and colors

- Primary teal: `#0F766E`
- Primary pressed: `#0B5F59`
- Primary tint: `#E6F4F2`
- Medical blue: `#2563A6`
- Medical blue tint: `#EAF2FB`
- Canvas: `#F4F7F8`
- Surface: `#FFFFFF`
- Elevated/muted surface: `#F8FAFB`
- Primary text: `#14212B`
- Secondary text: `#667784`
- Border/divider: `#DCE5E8`
- Success: `#15805D`, tint `#E8F6EF`
- Warning: `#B66A08`, tint `#FFF3DC`
- Destructive: `#C2413D`, tint `#FDECEC`

No gradients except a barely perceptible photographic overlay when necessary. Never introduce purple, pink, neon, or random accent colors.

## Typography

- Font: `Tajawal`, loaded from Google Fonts. Fallback: `Arial, sans-serif`.
- Arabic copy must be natural, concise, and medically credible.
- Page title: 28px / 800 / 1.3.
- Section title: 19px / 700.
- Card title: 16px / 700.
- Body: 15px / 400–500 / 1.75.
- Caption: 12–13px / 500.
- Buttons: 15px / 700.
- Use Western digits only: `0123456789`; never `٠١٢٣٤٥٦٧٨٩`.

## RTL rules

- Root is `dir="rtl"` and Arabic text aligns right.
- Back control is always physically on the left side and its arrow points left.
- Trailing navigation chevrons follow the actual destination direction and remain visually correct in RTL.
- Icons and copy use explicit RTL flex ordering; do not rely only on text direction.
- Phone numbers and monetary amounts use `dir="ltr"` or unicode isolation where required.

## Layout

- Primary target: 390 × 844 iPhone viewport; fluid from 320px to 768px.
- App shell max width: 430px on desktop preview, centered against a soft neutral background.
- Mobile page horizontal gutter: 16px.
- Section gap: 24px; card gap: 12px; compact control gap: 8px.
- Minimum interactive target: 44px.
- Bottom navigation only on authenticated main flows; contextual flows use a top bar and back control.
- Long content scrolls vertically without fixed-height clipping.

### Laboratory desktop layout

- Primary target: 1440 × 900 desktop; responsive down to 1024px and usable on tablet.
- Persistent navigation sidebar is physically on the right in RTL, 232–256px wide.
- Compact top header contains the laboratory identity, notifications, and signed-in staff member.
- Main workspace uses a practical master-detail layout: an incoming-order list/table beside a wider selected-case detail panel.
- Desktop content gutter: 24–32px; section gap: 20–24px; dense row gap: 8–12px.
- Avoid oversized dashboard cards or excessive empty space. This is an operations workspace optimized for repeated daily use.
- On narrow screens, collapse the sidebar and stack the order list above the selected case without losing actions.

## Components

- Cards: white, 16–20px radius, 1px border or subtle `0 8px 28px rgba(20,33,43,.06)` shadow, never both heavily.
- Primary button: teal fill, white text, 14px radius, minimum 52px height.
- Secondary button: white surface, teal text, 1px teal-tinted border.
- Inputs: 52px minimum height, white background, 1px border, 14px radius, clear labels above fields, realistic placeholders.
- Chips/statuses: compact capsule, semantic tinted background plus text/icon; never communicate state with color alone.
- Laboratory cards: real thumbnail, verified/name row, rating, location, specialty chips, turnaround note.
- Timeline: vertical line on the right for RTL, explicit completed/current/upcoming markers, clear next action card.
- Apple Pay mock: black Apple Pay button only inside the payment confirmation step; include amount breakdown and a clear fake-payment disclosure.
- Stars: SVG/Lucide stars with selected amber and unselected neutral outlines.
- Icons: use Lucide SVG icons consistently; no emoji.
- Laboratory sidebar: clear labels and consistent Lucide icons for dashboard, incoming orders, production, messages, finance, delivery, and settings. Active item uses a soft teal tint and a 3px right indicator.
- Operational metric cards: compact, show label, Western-digit count, context line, and restrained semantic icon.
- Incoming order rows: show case ID, dentist/clinic, service, tooth numbers, requested delivery, attachment count, priority, and unread state. The selected row is visually distinct without a heavy border.
- Case detail panel: structured clinical sections, attachment tiles for STL/DICOM/JPG/PDF, communication history, and a sticky decision area when space allows.
- Quote form: price in SAR, estimated working days, promised delivery date, and optional internal note. Primary action is `قبول وإرسال العرض`.
- Destructive decline remains a quiet outlined action and requires a reason; `طلب توضيح` is the neutral secondary action.

## Imagery

Use realistic dental-laboratory and prosthodontic photography: technicians, zirconia crowns, digital scanners, ceramic bridges, and organized lab interiors. Crop at consistent 4:3 or 16:10 ratios. Avoid graphic surgery imagery, stock-photo handshakes, or unrelated medical photos.

## Content requirements

- Use credible Saudi data: Riyadh/Jeddah/Dammam neighborhoods, `+966` numbers, realistic laboratory names, service specializations, turnaround times, and Saudi riyal pricing.
- Example labs: معمل الابتسامة الذهبية للأسنان، مختبر بُعد الرقمي، معمل أطلس لتركيبات الأسنان، مختبر مدار للأسنان، معمل رُواء الرقمي، مختبر دنتك الخليج.
- Laboratory portal identity example: `معمل الابتسامة الذهبية للأسنان` with staff member `أحمد العتيبي — منسق الحالات`.
- Realistic incoming cases: `WSL-2048` تاج زركونيا للسن 26 من عيادات صفوة الابتسامة، `WSL-2047` جسر إيماكس للأسنان 11–13 من مركز د. نورة السبيعي، and `WSL-2046` طقم جزئي مرن من مجمع أفق الأسنان.
- Example operational statuses: `طلب جديد`, `بانتظار المراجعة`, `يحتاج توضيح`, `تم إرسال العرض`, `قيد التصميم`, `قيد التصنيع`, `فحص الجودة`, `جاهز للتسليم`.
- Buttons use specific actions: `عرض تفاصيل المعمل`, `إرسال الطلب`, `دفع المقدم 25%`, `تأكيد الدفع`, `محاكاة موافقة المعمل`.
- Laboratory buttons use specific actions: `مراجعة الطلب`, `طلب توضيح`, `رفض الطلب`, `حفظ مسودة العرض`, `قبول وإرسال العرض`.
- Avoid generic filler such as “أدخل بياناتك هنا”.

## Motion and feedback

- Screen transition: 180–240ms fade plus 8px horizontal movement respecting RTL.
- Cards/buttons: subtle 0.98 press scale and color change.
- Timeline state changes animate marker fill and reveal the next card in 240ms.
- Upload previews appear with a short fade.
- Respect `prefers-reduced-motion`.

## Accessibility

- WCAG AA contrast.
- Visible focus rings in teal.
- Every icon-only button has an Arabic accessible label.
- Images have meaningful Arabic alt text.
- Error and success messages use text and icon, not color alone.

## Hard constraints

- React + Tailwind CSS.
- Frontend only; local mock data and React state/context.
- No backend, authentication service, database, or real payment.
- No emoji, no excessive gradients, no default system font, no Hindi/Eastern Arabic digits.
- Use ONLY the fonts, colors, spacing, and component styles defined here.
