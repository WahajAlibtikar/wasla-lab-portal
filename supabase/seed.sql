-- Development directory data. No auth users or real patient data are inserted.

insert into public.organizations (
  id,
  type,
  display_name,
  legal_name,
  slug,
  phone,
  whatsapp,
  city,
  district,
  address_line,
  is_verified,
  is_active
) values
  (
    '10000000-0000-4000-8000-000000000001',
    'laboratory',
    'معمل الابتسامة الذهبية للأسنان',
    'شركة الابتسامة الذهبية لتقنيات الأسنان',
    'golden-smile-dental-lab',
    '+966112450011',
    '+966550450011',
    'الرياض',
    'العليا',
    'طريق الملك فهد، حي العليا',
    true,
    true
  ),
  (
    '10000000-0000-4000-8000-000000000002',
    'laboratory',
    'مختبر أطلس لتقنيات الأسنان',
    'مختبر أطلس الرقمي للأسنان',
    'atlas-dental-lab',
    '+966126620240',
    '+966566620240',
    'جدة',
    'الروضة',
    'شارع الأمير سعود الفيصل، حي الروضة',
    true,
    true
  ),
  (
    '10000000-0000-4000-8000-000000000003',
    'laboratory',
    'معمل بُعد للأسنان الرقمية',
    'معمل بُعد للحلول السنية الرقمية',
    'buad-digital-dental',
    '+966138430900',
    '+966558430900',
    'الخبر',
    'العقربية',
    'شارع الأمير حمود، حي العقربية',
    true,
    true
  ),
  (
    '10000000-0000-4000-8000-000000000004',
    'laboratory',
    'مختبر سن لاب المتخصص',
    'مختبر سن لاب لتركيبات الأسنان',
    'sin-lab-specialized',
    '+966114780088',
    '+966554780088',
    'الرياض',
    'الملز',
    'شارع جرير، حي الملز',
    false,
    true
  ),
  (
    '10000000-0000-4000-8000-000000000005',
    'laboratory',
    'معمل اللؤلؤة لتركيبات الأسنان',
    'معمل اللؤلؤة الطبي للأسنان',
    'pearl-dental-lab',
    '+966138250077',
    '+966538250077',
    'الدمام',
    'الشاطئ',
    'طريق الخليج، حي الشاطئ',
    true,
    true
  )
on conflict (id) do update
set
  display_name = excluded.display_name,
  legal_name = excluded.legal_name,
  slug = excluded.slug,
  phone = excluded.phone,
  whatsapp = excluded.whatsapp,
  city = excluded.city,
  district = excluded.district,
  address_line = excluded.address_line,
  is_verified = excluded.is_verified,
  is_active = excluded.is_active;

insert into public.lab_profiles (
  organization_id,
  description,
  years_experience,
  minimum_turnaround_days,
  accepts_digital_scans,
  pickup_available,
  delivery_available,
  working_hours
) values
  (
    '10000000-0000-4000-8000-000000000001',
    'مختبر رقمي متخصص في تركيبات الزيركون والإيماكس وحالات الزراعة.',
    14,
    4,
    true,
    true,
    true,
    '{"sun":"08:00-18:00","mon":"08:00-18:00","tue":"08:00-18:00","wed":"08:00-18:00","thu":"08:00-16:00"}'::jsonb
  ),
  (
    '10000000-0000-4000-8000-000000000002',
    'حلول مخبرية رقمية للتيجان والجسور والقشور الخزفية بدقة لونية عالية.',
    11,
    5,
    true,
    true,
    true,
    '{"sun":"08:30-18:30","mon":"08:30-18:30","tue":"08:30-18:30","wed":"08:30-18:30","thu":"08:30-16:30"}'::jsonb
  ),
  (
    '10000000-0000-4000-8000-000000000003',
    'متخصصون في تصميم الابتسامة الرقمي، الزراعة، وأدلة الجراحة المطبوعة.',
    9,
    3,
    true,
    false,
    true,
    '{"sun":"09:00-19:00","mon":"09:00-19:00","tue":"09:00-19:00","wed":"09:00-19:00","thu":"09:00-17:00"}'::jsonb
  ),
  (
    '10000000-0000-4000-8000-000000000004',
    'تركيبات ثابتة ومتحركة مع متابعة مباشرة للحالات العاجلة داخل الرياض.',
    8,
    5,
    true,
    true,
    true,
    '{"sun":"08:00-17:00","mon":"08:00-17:00","tue":"08:00-17:00","wed":"08:00-17:00","thu":"08:00-15:00"}'::jsonb
  ),
  (
    '10000000-0000-4000-8000-000000000005',
    'خبرة في الأطقم الكاملة والجزئية والتركيبات المدعومة بالزراعة.',
    16,
    6,
    false,
    true,
    true,
    '{"sun":"08:00-18:00","mon":"08:00-18:00","tue":"08:00-18:00","wed":"08:00-18:00","thu":"08:00-16:00"}'::jsonb
  )
on conflict (organization_id) do update
set
  description = excluded.description,
  years_experience = excluded.years_experience,
  minimum_turnaround_days = excluded.minimum_turnaround_days,
  accepts_digital_scans = excluded.accepts_digital_scans,
  pickup_available = excluded.pickup_available,
  delivery_available = excluded.delivery_available,
  working_hours = excluded.working_hours;

insert into public.lab_services (
  id,
  laboratory_id,
  category,
  name_ar,
  description_ar,
  base_price_minor,
  currency,
  estimated_working_days,
  is_active
) values
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'crown', 'تاج زيركون متعدد الطبقات', 'تاج رقمي كامل مع مطابقة درجة اللون.', 85000, 'SAR', 4, true),
  ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'implant', 'تاج زراعة مخصص', 'تاج زيركون مع دعامة مخصصة حسب نظام الزراعة.', 145000, 'SAR', 7, true),
  ('20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000002', 'veneer', 'قشرة إيماكس تجميلية', 'قشرة خزفية مع نموذج تصميم أولي للاعتماد.', 110000, 'SAR', 6, true),
  ('20000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000002', 'bridge', 'جسر زيركون', 'جسر ثابت مصمم من ملفات المسح الرقمي.', 240000, 'SAR', 7, true),
  ('20000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000003', 'other', 'دليل جراحي مطبوع', 'تصميم وطباعة دليل جراحي لحالات الزراعة.', 125000, 'SAR', 3, true),
  ('20000000-0000-4000-8000-000000000006', '10000000-0000-4000-8000-000000000003', 'implant', 'تركيبة زراعة رقمية', 'تصميم رقمي كامل مع ملف معاينة قبل التصنيع.', 155000, 'SAR', 6, true),
  ('20000000-0000-4000-8000-000000000007', '10000000-0000-4000-8000-000000000004', 'night_guard', 'واقي أسنان ليلي', 'واقي شفاف مخصص من طبعة أو مسح رقمي.', 45000, 'SAR', 4, true),
  ('20000000-0000-4000-8000-000000000008', '10000000-0000-4000-8000-000000000004', 'crown', 'تاج زيركون اقتصادي', 'تاج ثابت للحالات الخلفية مع خيارات درجات Vita.', 65000, 'SAR', 5, true),
  ('20000000-0000-4000-8000-000000000009', '10000000-0000-4000-8000-000000000005', 'denture', 'طقم أسنان أكريليك كامل', 'طقم كامل مع مرحلة تجربة قبل التسليم النهائي.', 220000, 'SAR', 10, true),
  ('20000000-0000-4000-8000-000000000010', '10000000-0000-4000-8000-000000000005', 'denture', 'طقم جزئي مرن', 'طقم مرن للحالات الجزئية مع اختيار درجة اللثة والأسنان.', 180000, 'SAR', 8, true)
on conflict (id) do update
set
  category = excluded.category,
  name_ar = excluded.name_ar,
  description_ar = excluded.description_ar,
  base_price_minor = excluded.base_price_minor,
  currency = excluded.currency,
  estimated_working_days = excluded.estimated_working_days,
  is_active = excluded.is_active;

