-- Создаём таблицу для корпусов/секторов ЖК
CREATE TABLE public.complex_buildings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    complex_id UUID NOT NULL REFERENCES public.residential_complexes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    -- Координаты полигона на изображении (массив точек x,y в процентах от размера изображения)
    polygon_points JSONB NOT NULL DEFAULT '[]'::jsonb,
    -- Ссылка на изображение генплана, на котором отмечен корпус
    plan_image TEXT,
    -- Цвет для отображения на фронте
    color TEXT DEFAULT '#14b8a6',
    -- Количество этажей в корпусе
    floors_count INTEGER,
    -- Порядок отображения
    order_position INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Добавляем поле building_id в таблицу apartments
ALTER TABLE public.apartments 
ADD COLUMN building_id UUID REFERENCES public.complex_buildings(id) ON DELETE SET NULL;

-- Добавляем индексы
CREATE INDEX idx_complex_buildings_complex_id ON public.complex_buildings(complex_id);
CREATE INDEX idx_apartments_building_id ON public.apartments(building_id);

-- Включаем RLS
ALTER TABLE public.complex_buildings ENABLE ROW LEVEL SECURITY;

-- Политики доступа
CREATE POLICY "Anyone can view published buildings" 
ON public.complex_buildings 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Admins can manage buildings" 
ON public.complex_buildings 
FOR ALL 
USING (is_admin(auth.uid()));

-- Триггер для обновления updated_at
CREATE TRIGGER update_complex_buildings_updated_at
BEFORE UPDATE ON public.complex_buildings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();