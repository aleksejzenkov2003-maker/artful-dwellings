-- Seed example residential complex "МИР" with full page_content,
-- buildings and apartments for a working reference page.

DO $$
DECLARE
  v_complex_id uuid;
  v_b1 uuid;
  v_b2 uuid;
BEGIN
  -- Upsert complex by slug
  SELECT id INTO v_complex_id
  FROM public.residential_complexes
  WHERE slug = 'mir';

  IF v_complex_id IS NULL THEN
    INSERT INTO public.residential_complexes (
      name,
      slug,
      status,
      city,
      district,
      address,
      developer,
      price_from,
      price_to,
      area_from,
      area_to,
      floors_count,
      apartments_count,
      completion_date,
      is_published,
      is_featured,
      main_image,
      images,
      page_content
    ) VALUES (
      'Клубный дом «МИРЪ»',
      'mir',
      'building',
      'Санкт-Петербург',
      'Центральный район',
      'ул. Миргородская, 1',
      'RBI',
      18900000,
      84900000,
      26,
      146,
      9,
      263,
      '2026-06-30',
      true,
      true,
      '/tilda/images/tild3539-3334-4233-a466-646365376236__-__resize__20x___-.jpg',
      jsonb_build_array(
        '/tilda/images/tild3539-3334-4233-a466-646365376236__-__resize__20x___-.jpg',
        '/tilda/images/tild3363-3135-4436-b233-323264653739__-__resize__20x__c037_e4-1.jpg'
      ),
      jsonb_build_object(
        -- HERO
        'hero_title', 'Камерный клубный дом в историческом центре. Архитектура, искусство и приватность.',
        'hero_background_image', '/tilda/images/tild3539-3334-4233-a466-646365376236__-__resize__20x___-.jpg',
        'metro_station', 'Пл. Восстания',
        'phone', '+7 (812) 501-10-00',
        'work_hours', 'Ежедневно 10:00–20:00',

        -- ABOUT
        'about_text',
          '<p>Клубный дом «МИРЪ» расположен в Санкт-Петербурге, в Центральном районе. ' ||
          'Проект сочетает исторический контекст и современную архитектуру: приватный двор, парадные холлы, ' ||
          'планировки от студий до просторных квартир.</p>' ||
          '<p>Запишитесь на просмотр — покажем варианты и расскажем про условия покупки.</p>',
        'about_images', jsonb_build_array(),

        -- VIDEO / TOUR
        'video_url', 'https://vimeo.com/1017946140',
        'panorama_url', 'https://www.rbi.ru/upload/iframe/mir_pridom_7/tour.html?utm_source=booklet&utm_medium=qr&utm_campaign=rbinhouse_booklet_mir_mirgorodskaya1_',

        -- MAP / LAYOUTS
        'map_image', '/tilda/images/tild3836-3733-4133-b431-346465373061__rhomb.svg',
        'layouts_background_image', '/tilda/images/tild3363-3135-4436-b233-323264653739__-__resize__20x__c037_e4-1.jpg',

        -- DOCS
        'documents', jsonb_build_array(
          jsonb_build_object('title','Проектная декларация','url','https://example.com/mir/docs/declaration.pdf'),
          jsonb_build_object('title','Разрешение на строительство','url','https://example.com/mir/docs/permit.pdf'),
          jsonb_build_object('title','План типового этажа','url','https://example.com/mir/docs/floorplan.pdf')
        ),

        -- PROMOTIONS (rendered as list)
        'promotions', jsonb_build_array(
          jsonb_build_object('title','Скидка 1% по рекомендации'),
          jsonb_build_object('title','Скидка 2% при повторной покупке'),
          jsonb_build_object('title','Скидка 100 000 руб. для иногородних покупателей'),
          jsonb_build_object('title','Паркинг в подарок'),
          jsonb_build_object('title','Квартира месяца по акции')
        ),

        -- INSTALLMENTS (as in template)
        'installments_intro',
          'Беспроцентная рассрочка от застройщика RBI — это стоимость квартиры или апартаментов, ' ||
          'разбитая на удобные суммы, которые можно выплачивать через различные промежутки времени.',
        'installments_subsidy_heading', 'Субсидированные ставки до 6% по СИ без удорожания',
        'installments_subsidy_rates_html',
          'БСПБ — 5,76%<br />Альфабанк — 4,9%<br />Сбербанк — 5,1%<br />Совкомбанк — 4,4%<br />и другие банки по ставке 6%',
        'installments_program1_heading', 'Рассрочка с первым взносом 30%',
        'installments_program1_note', 'Предложение по базовой цене минус 6%. Размер скидки уточняйте у менеджера.',
        'installments_program1_cards', jsonb_build_array(
          jsonb_build_object('title','30%','description','3 (10) дня со дня заключения договора'),
          jsonb_build_object('title','70%','description','Остаток – через 12 месяцев')
        ),
        'installments_program2_heading', 'Рассрочка с первым взносом 50%',
        'installments_program2_note', 'Предложение по цене 100% оплаты (для акционных квартир стоимость обсуждается отдельно)',
        'installments_program2_cards', jsonb_build_array(
          jsonb_build_object('title','50%','description','3 (10) дня со дня заключения договора'),
          jsonb_build_object('title','50%','description','через 6 месяцев')
        ),

        -- DRIVER
        'driver_background_image', '/tilda/images/tild3363-3135-4436-b233-323264653739__-__resize__20x__c037_e4-1.jpg',
        'driver_car_image', '/tilda/images/tild3362-6333-4434-b465-616435393536__-__resize__20x__noroot.png',
        'driver_title', 'Личный водитель',
        'driver_badge', 'БЕСПЛАТНО',
        'driver_description', 'Забронируйте поездку на&nbsp;нашем автомобиле бизнес-класса с&nbsp;водителем в&nbsp;клубный дом «МИРЪ»',
        'driver_right_text', 'Запланируйте поездку с водителем в клубный дом «МИРЪ»',
        'driver_wait_time', 'время ожидания 15 минут',
        'driver_button_text', 'Вызвать личного водителя',

        -- TELEGRAM
        'telegram_title', 'Наш Telegram-канал',
        'telegram_description', 'Будьте в&nbsp;курсе новостей на&nbsp;рынке недвижимости и&nbsp;получайте полезный контент вместе с&nbsp;Art Estate',
        'telegram_button_text', 'ПРИСОЕДИНИТЬСЯ',
        'telegram_button_url', 'https://t.me/+42AXQCuRHHZkNjhi',
        'telegram_qr_image', '/tilda/images/tild3531-6162-4465-a565-326534383462__-__resize__20x__url_qrcodecreatorcom.jpg',
        'telegram_phone_image', '/tilda/images/tild6134-3138-4634-a634-633231316433__-__resize__20x__3-1.png',

        -- CONTACTS / DISCLAIMER / FORMS
        'contact_phone', '+7 (812) 501-10-00',
        'contact_email', 'info@art-estate.top',
        'disclaimer_text', 'Art Estate не является финансовой организацией и оказывает только посреднические консультационные услуги по расчету ипотеки. Выдачей ипотеки занимаются соответствующие финансовые учреждения.',
        'forms_success_url', '/thanks',

        -- FAQ
        'faq', jsonb_build_array(
          jsonb_build_object('question','Где находится клубный дом «МИРЪ»?','answer','Клубный дом расположен в Санкт-Петербурге, в Центральном районе, по адресу: ул. Миргородская, 1.'),
          jsonb_build_object('question','Когда планируется сдача дома «МИРЪ»?','answer','Срок сдачи — 2 квартал 2026 года.'),
          jsonb_build_object('question','Есть ли ипотека или рассрочка в проекте?','answer','Да, доступны ипотечные программы и рассрочки. Оставьте заявку — подберём условия.'),
          jsonb_build_object('question','Какая отделка в квартирах?','answer','Квартиры передаются без отделки.'),
          jsonb_build_object('question','Как записаться на просмотр?','answer','Оставьте заявку на сайте или позвоните — мы подберём удобное время.')
        )
      )
    )
    RETURNING id INTO v_complex_id;
  ELSE
    -- Ensure the example stays published and has content
    UPDATE public.residential_complexes
    SET
      is_published = true,
      is_featured = true
    WHERE id = v_complex_id;
  END IF;

  -- Buildings (example)
  INSERT INTO public.complex_buildings (complex_id, name, polygon_points, plan_image, color, floors_count, order_position, is_published)
  VALUES
    (v_complex_id, 'Большой корпус №1', '[]'::jsonb, NULL, '#e0b388', 9, 1, true)
  ON CONFLICT DO NOTHING;

  INSERT INTO public.complex_buildings (complex_id, name, polygon_points, plan_image, color, floors_count, order_position, is_published)
  VALUES
    (v_complex_id, 'Малый корпус №2', '[]'::jsonb, NULL, '#000000', 6, 2, true)
  ON CONFLICT DO NOTHING;

  -- Get building ids (latest by order)
  SELECT id INTO v_b1 FROM public.complex_buildings WHERE complex_id = v_complex_id AND name = 'Большой корпус №1' LIMIT 1;
  SELECT id INTO v_b2 FROM public.complex_buildings WHERE complex_id = v_complex_id AND name = 'Малый корпус №2' LIMIT 1;

  -- Apartments (few examples)
  INSERT INTO public.apartments (complex_id, building_id, room_type, area, floor, price, status, layout_image, is_published)
  VALUES
    (v_complex_id, v_b1, 'studio', 26.4, 3, 18900000, 'available', NULL, true),
    (v_complex_id, v_b1, '1', 41.7, 5, 25900000, 'available', NULL, true),
    (v_complex_id, v_b1, '2', 67.2, 7, 39900000, 'available', NULL, true),
    (v_complex_id, v_b2, '3', 92.8, 4, 58900000, 'available', NULL, true),
    (v_complex_id, v_b2, '4', 146.0, 6, 84900000, 'available', NULL, true)
  ON CONFLICT DO NOTHING;
END $$;

