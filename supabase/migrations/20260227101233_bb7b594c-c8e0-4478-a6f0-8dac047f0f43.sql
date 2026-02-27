
-- Timeline events table
CREATE TABLE public.timeline_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year text NOT NULL,
  title text NOT NULL,
  description text,
  image_url text,
  order_position integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published timeline events"
  ON public.timeline_events FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage timeline events"
  ON public.timeline_events FOR ALL
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE TRIGGER update_timeline_events_updated_at
  BEFORE UPDATE ON public.timeline_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial data
INSERT INTO public.timeline_events (year, title, description, order_position) VALUES
  ('2016', 'Основание компании', 'Art Estate была основана в Санкт-Петербурге с целью создать агентство недвижимости нового формата — с индивидуальным подходом и экспертизой на рынке новостроек.', 0),
  ('2017', 'Расширение направлений', 'Компания расширила спектр услуг: добавлены направления по подбору коммерческой недвижимости и инвестиционному консалтингу.', 1),
  ('2018', 'Запуск ипотечного центра', 'Открыт собственный ипотечный центр с партнёрскими программами ведущих банков, что позволило клиентам получать лучшие условия кредитования.', 2),
  ('2019', 'Рост команды', 'Команда выросла до 30+ специалистов. Компания вошла в ТОП-3 агентств недвижимости Санкт-Петербурга по версии отраслевых рейтингов.', 3),
  ('2020', 'Онлайн-сервис', 'Запущена платформа онлайн-подбора недвижимости с виртуальными турами и дистанционным оформлением сделок.', 4),
  ('2023', 'Выход на рынок ОАЭ', 'Art Estate открыла представительство в Дубае, предлагая клиентам инвестиционную недвижимость в ОАЭ.', 5),
  ('2024', 'Открытие в Москве', 'Запущен офис в Москве. Компания стала федеральным игроком с присутствием в трёх ключевых локациях.', 6),
  ('2026', 'Новые горизонты', 'Продолжаем расти: 50+ сотрудников, сотни успешных сделок ежемесячно и новые рынки на горизонте.', 7);
