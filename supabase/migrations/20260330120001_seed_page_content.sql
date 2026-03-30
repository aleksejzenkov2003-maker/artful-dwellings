UPDATE residential_complexes
SET page_content = jsonb_build_object(
  'hero_title',
    CASE
      WHEN status = 'building' THEN 'Современный жилой комплекс в престижном районе города. Комфортная среда для жизни, работы и отдыха.'
      WHEN status IN ('ready', 'completed', 'сдан') THEN 'Жилой комплекс введён в эксплуатацию. Квартиры с отделкой готовы к заселению.'
      ELSE 'Новый жилой комплекс с продуманной инфраструктурой и современной архитектурой.'
    END,

  'metro_station', COALESCE(district, ''),

  'phone', '+7 (812) 501-1000',
  'work_hours', 'Ежедневно 10:00–20:00',

  'about_text', COALESCE(
    description,
    '<p>' || name || ' — это современный жилой комплекс, расположенный по адресу ' ||
    COALESCE(address, 'уточняется') || '. '  ||
    'Проект сочетает передовые строительные технологии, продуманные планировки и развитую инфраструктуру района.</p>'
  ),

  'about_images', '[]'::jsonb,

  'video_url', '',
  'panorama_url', '',

  'infrastructure_text',
    '<p>Жилой комплекс расположен в районе с развитой инфраструктурой. '  ||
    'В пешей доступности находятся школы, детские сады, магазины, кафе и рестораны. '  ||
    'Удобная транспортная доступность — рядом остановки общественного транспорта и станция метро.</p>',

  'infrastructure_items', jsonb_build_array(
    jsonb_build_object('title', 'Школы и детские сады', 'description', 'В пешей доступности — 5 мин'),
    jsonb_build_object('title', 'Торговые центры', 'description', 'Крупные ТЦ в радиусе 10 мин'),
    jsonb_build_object('title', 'Парки и скверы', 'description', 'Зелёные зоны рядом с домом'),
    jsonb_build_object('title', 'Общественный транспорт', 'description', 'Остановки в 3 мин ходьбы'),
    jsonb_build_object('title', 'Медицинские учреждения', 'description', 'Поликлиники и аптеки рядом'),
    jsonb_build_object('title', 'Спортивные объекты', 'description', 'Фитнес-центры и бассейны')
  ),

  'mortgage_text',
    '<p>Приобрести квартиру можно в ипотеку от банков-партнёров. '  ||
    'Мы поможем подобрать лучшие условия и оформить заявку.</p>',

  'mortgage_conditions', jsonb_build_array(
    jsonb_build_object('title', 'Ставка', 'value', 'от 5.9% годовых'),
    jsonb_build_object('title', 'Первый взнос', 'value', 'от 15%'),
    jsonb_build_object('title', 'Срок', 'value', 'до 30 лет'),
    jsonb_build_object('title', 'Семейная ипотека', 'value', 'от 6% годовых'),
    jsonb_build_object('title', 'IT-ипотека', 'value', 'от 5% годовых'),
    jsonb_build_object('title', 'Рассрочка', 'value', 'до 24 месяцев')
  ),

  'faq', jsonb_build_array(
    jsonb_build_object(
      'question', 'Где находится жилой комплекс?',
      'answer', 'Жилой комплекс расположен по адресу: ' || COALESCE(address, 'уточняется') || '.' ||
        CASE WHEN district IS NOT NULL THEN ' Ближайшая станция метро — ' || district || '.' ELSE '' END
    ),
    jsonb_build_object(
      'question', 'Когда планируется сдача дома?',
      'answer', CASE
        WHEN completion_date IS NOT NULL THEN 'Срок сдачи — ' || to_char(completion_date::date, 'FMDD Month YYYY') || ' года.'
        WHEN status IN ('ready', 'completed', 'сдан') THEN 'Дом уже сдан и введён в эксплуатацию.'
        ELSE 'Точная дата сдачи уточняется. Свяжитесь с нами для актуальной информации.'
      END
    ),
    jsonb_build_object(
      'question', 'Какие квартиры есть в продаже?',
      'answer', 'В наличии квартиры площадью от ' ||
        COALESCE(area_from::text, '?') || ' до ' || COALESCE(area_to::text, '?') || ' м². ' ||
        'Стоимость от ' || COALESCE(to_char(price_from, 'FM999 999 999'), '?') || ' ₽. ' ||
        'Актуальный каталог планировок доступен по запросу.'
    ),
    jsonb_build_object(
      'question', 'Можно ли купить квартиру в ипотеку?',
      'answer', 'Да, мы сотрудничаем с ведущими банками. Доступна семейная ипотека, IT-ипотека и стандартные программы. Поможем с оформлением заявки.'
    ),
    jsonb_build_object(
      'question', 'Как записаться на экскурсию?',
      'answer', 'Позвоните нам по телефону +7 (812) 501-1000 или оставьте заявку на сайте — мы свяжемся с вами и назначим удобное время.'
    )
  ),

  'contact_phone', '+7 (812) 501-1000',
  'contact_email', 'info@art-estate.top'
)
WHERE page_content IS NULL OR page_content = '{}'::jsonb;
