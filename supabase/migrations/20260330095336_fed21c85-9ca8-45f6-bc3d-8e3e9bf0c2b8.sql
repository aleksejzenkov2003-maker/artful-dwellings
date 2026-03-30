
-- Idempotent seed: ЖК "Клубный дом «МИРЪ»"

-- 1) Upsert residential complex
INSERT INTO public.residential_complexes (
  slug, name, is_published, is_featured,
  address, city, district, developer,
  completion_date, apartments_count,
  area_from, area_to, price_from, price_to,
  status, floors_count,
  main_image, images,
  seo_title, seo_description,
  page_content
) VALUES (
  'mir',
  'Клубный дом «МИРЪ»',
  true, true,
  'ул. Миргородская, 1',
  'Санкт-Петербург',
  'Центральный район',
  'RBI',
  '2026-06-30',
  263,
  26, 146,
  18900000, 84900000,
  'building', 9,
  '/tilda/images/tild3837-3139-4065-b463-333964323731__art_estate_logo_1.svg',
  '[]'::jsonb,
  'Клубный дом МИРЪ — квартиры от застройщика RBI',
  'Купить квартиру в клубном доме МИРЪ на Миргородской, 1. Застройщик RBI. Сдача — II квартал 2026.',
  jsonb_build_object(
    'hero_title', 'Клубный дом «МИРЪ»',
    'hero_background_image', '/tilda/images/tild3837-3139-4065-b463-333964323731__art_estate_logo_1.svg',
    'metro_station', 'Площадь Восстания',
    'phone', '+7 (812) 407-17-17',
    'work_hours', 'Ежедневно 10:00-20:00',
    'about_text', '<p>Клубный дом «МИРЪ» — это проект бизнес-класса от застройщика RBI в самом центре Санкт-Петербурга. Всего 263 квартиры с продуманными планировками от студий до четырёхкомнатных резиденций. Высота потолков до 3,1 м, панорамное остекление, закрытая дворовая территория с ландшафтным дизайном.</p><p>Рядом — Московский вокзал, Невский проспект, Таврический сад. Пешком до метро — 3 минуты.</p>',
    'video_url', 'https://player.vimeo.com/video/1017946140',
    'panorama_url', 'https://rbi.ru/tour/mir/',
    'map_image', '/tilda/images/tild6131-3930-4336-b533-623636386166__home.svg',
    'layouts_background_image', '/tilda/images/tild3836-3733-4133-b431-346465373061__rhomb.svg',
    'documents', jsonb_build_array(
      jsonb_build_object('title', 'Проектная декларация', 'url', '#'),
      jsonb_build_object('title', 'Разрешение на строительство', 'url', '#'),
      jsonb_build_object('title', 'Заключение о соответствии', 'url', '#')
    ),
    'promotions', jsonb_build_array(
      jsonb_build_object('title', 'Ипотека от 0,01%', 'text', 'Специальные условия от банков-партнёров'),
      jsonb_build_object('title', 'Trade-in', 'text', 'Зачёт вашей квартиры в счёт новой'),
      jsonb_build_object('title', 'Скидка при 100% оплате', 'text', 'До 5% при полной оплате'),
      jsonb_build_object('title', 'Рассрочка 0%', 'text', 'Беспроцентная рассрочка до конца строительства'),
      jsonb_build_object('title', 'Паркинг в подарок', 'text', 'При покупке квартиры от 80 м²')
    ),
    'installments_intro', 'Выгодные программы покупки квартир в клубном доме «МИРЪ»',
    'installments_subsidy_heading', 'Субсидированная ипотека',
    'installments_subsidy_rates_html', '<p>от <strong>0,01%</strong> — на весь срок<br/>от <strong>3,9%</strong> — стандартные условия</p>',
    'installments_program1_heading', 'Программа 1: Рассрочка от застройщика',
    'installments_program1_note', 'Без процентов до ввода дома в эксплуатацию',
    'installments_program1_cards', jsonb_build_array(
      jsonb_build_object('title', 'Первый взнос', 'description', 'от 30%'),
      jsonb_build_object('title', 'Срок', 'description', 'до 18 месяцев'),
      jsonb_build_object('title', 'Ставка', 'description', '0%')
    ),
    'installments_program2_heading', 'Программа 2: Ипотека с субсидией',
    'installments_program2_note', 'Совместная программа с ведущими банками',
    'installments_program2_cards', jsonb_build_array(
      jsonb_build_object('title', 'Ставка', 'description', 'от 0,01%'),
      jsonb_build_object('title', 'Первый взнос', 'description', 'от 20%'),
      jsonb_build_object('title', 'Срок', 'description', 'до 30 лет')
    ),
    'driver_background_image', '/tilda/images/tild3836-3733-4133-b431-346465373061__rhomb.svg',
    'driver_car_image', '/tilda/images/tild3362-6338-4736-a130-333430356430__play-button.svg',
    'driver_title', 'Личный водитель',
    'driver_badge', 'БЕСПЛАТНО',
    'driver_description', 'Мы организуем для вас бесплатный трансфер до офиса продаж или на объект.',
    'driver_right_text', 'Комфортный автомобиль бизнес-класса',
    'driver_wait_time', 'Подача за 30 минут',
    'driver_button_text', 'Заказать водителя',
    'telegram_title', 'Наш Telegram-канал',
    'telegram_description', '<p>Подписывайтесь на канал «МИРЪ» — актуальные новости строительства, акции и спецпредложения.</p>',
    'telegram_button_text', 'Подписаться',
    'telegram_button_url', 'https://t.me/rbi_mir',
    'telegram_qr_image', '/tilda/images/tild3039-6233-4434-b537-396438316261__favicon.svg',
    'telegram_phone_image', '/tilda/images/tild3362-6338-4736-a130-333430356430__play-button.svg',
    'disclaimer_text', '* Ипотечные ставки указаны на момент публикации и могут быть изменены банками-партнёрами. Не является публичной офертой.',
    'forms_success_url', '/thanks',
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Когда планируется сдача дома?', 'answer', 'Сдача клубного дома «МИРЪ» запланирована на II квартал 2026 года.'),
      jsonb_build_object('question', 'Какие планировки доступны?', 'answer', 'В проекте представлены студии от 26 м², а также 1–4-комнатные квартиры площадью до 146 м².'),
      jsonb_build_object('question', 'Есть ли подземный паркинг?', 'answer', 'Да, в доме предусмотрен подземный паркинг с лифтом. Машиноместа можно приобрести отдельно.'),
      jsonb_build_object('question', 'Какой застройщик?', 'answer', 'Застройщик — компания RBI, один из ведущих девелоперов Санкт-Петербурга с более чем 30-летним опытом.'),
      jsonb_build_object('question', 'Можно ли купить в ипотеку?', 'answer', 'Да, доступны ипотечные программы от ведущих банков, включая субсидированную ставку от 0,01%.')
    ),
    'contact_phone', '+7 (812) 407-17-17',
    'contact_email', 'info@art-estate.top',
    'infrastructure_text', 'Всё необходимое в пешей доступности',
    'infrastructure_items', jsonb_build_array(
      jsonb_build_object('title', 'Метро', 'description', '3 мин пешком до ст. Площадь Восстания'),
      jsonb_build_object('title', 'Парки', 'description', 'Таврический сад — 10 мин пешком'),
      jsonb_build_object('title', 'Школы', 'description', 'Гимназия №155, лицей №344'),
      jsonb_build_object('title', 'Магазины', 'description', 'ТЦ «Галерея» — 7 мин пешком')
    ),
    'mortgage_text', 'Выгодные условия ипотеки от банков-партнёров',
    'mortgage_conditions', jsonb_build_array(
      jsonb_build_object('title', 'Минимальная ставка', 'value', 'от 0,01%'),
      jsonb_build_object('title', 'Первый взнос', 'value', 'от 20%'),
      jsonb_build_object('title', 'Срок кредита', 'value', 'до 30 лет')
    )
  )
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  is_published = EXCLUDED.is_published,
  is_featured = EXCLUDED.is_featured,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  district = EXCLUDED.district,
  developer = EXCLUDED.developer,
  completion_date = EXCLUDED.completion_date,
  apartments_count = EXCLUDED.apartments_count,
  area_from = EXCLUDED.area_from,
  area_to = EXCLUDED.area_to,
  price_from = EXCLUDED.price_from,
  price_to = EXCLUDED.price_to,
  status = EXCLUDED.status,
  floors_count = EXCLUDED.floors_count,
  main_image = EXCLUDED.main_image,
  images = EXCLUDED.images,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  page_content = EXCLUDED.page_content;

-- 2) Buildings
INSERT INTO public.complex_buildings (complex_id, name, floors_count, order_position, is_published, polygon_points, color)
SELECT rc.id, 'Большой корпус №1', 9, 1, true, '[]'::jsonb, '#14b8a6'
FROM public.residential_complexes rc WHERE rc.slug = 'mir'
ON CONFLICT DO NOTHING;

INSERT INTO public.complex_buildings (complex_id, name, floors_count, order_position, is_published, polygon_points, color)
SELECT rc.id, 'Малый корпус №2', 6, 2, true, '[]'::jsonb, '#0ea5e9'
FROM public.residential_complexes rc WHERE rc.slug = 'mir'
ON CONFLICT DO NOTHING;

-- 3) Apartments (5 units across 2 buildings)
-- Studio in building 1
INSERT INTO public.apartments (complex_id, building_id, room_type, area, floor, price, status, is_published)
SELECT rc.id, b.id, 'studio', 26.5, 3, 18900000, 'available', true
FROM public.residential_complexes rc
JOIN public.complex_buildings b ON b.complex_id = rc.id AND b.name = 'Большой корпус №1'
WHERE rc.slug = 'mir'
ON CONFLICT DO NOTHING;

-- 1-room in building 1
INSERT INTO public.apartments (complex_id, building_id, room_type, area, floor, price, status, is_published)
SELECT rc.id, b.id, '1', 42.3, 5, 28500000, 'available', true
FROM public.residential_complexes rc
JOIN public.complex_buildings b ON b.complex_id = rc.id AND b.name = 'Большой корпус №1'
WHERE rc.slug = 'mir'
ON CONFLICT DO NOTHING;

-- 2-room in building 2
INSERT INTO public.apartments (complex_id, building_id, room_type, area, floor, price, status, is_published)
SELECT rc.id, b.id, '2', 68.7, 4, 45600000, 'available', true
FROM public.residential_complexes rc
JOIN public.complex_buildings b ON b.complex_id = rc.id AND b.name = 'Малый корпус №2'
WHERE rc.slug = 'mir'
ON CONFLICT DO NOTHING;

-- 3-room in building 2
INSERT INTO public.apartments (complex_id, building_id, room_type, area, floor, price, status, is_published)
SELECT rc.id, b.id, '3', 98.2, 6, 62000000, 'available', true
FROM public.residential_complexes rc
JOIN public.complex_buildings b ON b.complex_id = rc.id AND b.name = 'Малый корпус №2'
WHERE rc.slug = 'mir'
ON CONFLICT DO NOTHING;

-- 4-room in building 1
INSERT INTO public.apartments (complex_id, building_id, room_type, area, floor, price, status, is_published)
SELECT rc.id, b.id, '4', 146.0, 8, 84900000, 'available', true
FROM public.residential_complexes rc
JOIN public.complex_buildings b ON b.complex_id = rc.id AND b.name = 'Большой корпус №1'
WHERE rc.slug = 'mir'
ON CONFLICT DO NOTHING;
