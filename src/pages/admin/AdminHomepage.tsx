import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useCity } from "@/contexts/CityContext";
import { useAllHomepageContent, useUpdateHomepageContent } from "@/hooks/useHomepageContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SingleImageUploader } from "@/components/admin/SingleImageUploader";
import { toast } from "sonner";
import { Save, Plus, Trash2 } from "lucide-react";

interface HeroCategory {
  title: string;
  subtitle: string;
  image: string;
  link: string;
}

interface HeroContent {
  hero_image?: string;
  video_url?: string;
  categories?: HeroCategory[];
}

interface ServiceCard {
  id: string;
  title: string;
  description: string;
  image: string;
}

interface RealEstateArtContent {
  title?: string;
  services?: ServiceCard[];
}

interface ExpertsHeaderContent {
  title?: string;
  subtitle?: string;
}

interface QuizStep {
  question: string;
  options: string[];
}

interface QuizContent {
  steps?: QuizStep[];
}

interface TelegramContent {
  telegram_url?: string;
  left_title?: string;
  left_description?: string;
  right_title?: string;
  right_description?: string;
}

const defaultHeroCategories: HeroCategory[] = [
  { title: "Квартиры в новостройках", subtitle: "от застройщика", image: "", link: "/novostroyki" },
  { title: "Готовое жилье", subtitle: "вторичный рынок", image: "", link: "/vtorichnoe-zhilyo" },
  { title: "Загородная недвижимость", subtitle: "дома и участки", image: "", link: "/zagorodnaya" },
  { title: "Коммерческая недвижимость", subtitle: "для бизнеса", image: "", link: "/kommercheskaya" },
];

const defaultServices: ServiceCard[] = [
  { id: "1", title: "Покупка квартиры в новостройке", description: "Подберем идеальную квартиру", image: "" },
  { id: "2", title: "Продажа вашей недвижимости", description: "Продадим быстро и выгодно", image: "" },
  { id: "3", title: "Оформление ипотеки", description: "Одобрение в топ-банках", image: "" },
  { id: "4", title: "Юридическое сопровождение", description: "Полная проверка документов", image: "" },
];

const defaultQuizSteps: QuizStep[] = [
  { question: "Какой тип недвижимости вас интересует?", options: ["Квартира", "Дом", "Коммерция", "Участок"] },
  { question: "Какой бюджет вы рассматриваете?", options: ["До 5 млн", "5-10 млн", "10-20 млн", "Более 20 млн"] },
  { question: "Когда планируете покупку?", options: ["В ближайший месяц", "В течение 3 месяцев", "В течение года", "Пока присматриваюсь"] },
];

export default function AdminHomepage() {
  const { cities } = useCity();
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const { data: allContent, isLoading } = useAllHomepageContent(selectedCityId);
  const updateContent = useUpdateHomepageContent();

  // Section states
  const [heroContent, setHeroContent] = useState<HeroContent>({});
  const [realEstateArtContent, setRealEstateArtContent] = useState<RealEstateArtContent>({});
  const [expertsHeader, setExpertsHeader] = useState<ExpertsHeaderContent>({});
  const [quizContent, setQuizContent] = useState<QuizContent>({});
  const [telegramContent, setTelegramContent] = useState<TelegramContent>({});

  // Load content when data changes
  useEffect(() => {
    if (allContent) {
      const hero = allContent.find(c => c.section_key === "hero");
      const realEstate = allContent.find(c => c.section_key === "real_estate_art");
      const experts = allContent.find(c => c.section_key === "experts_header");
      const quiz = allContent.find(c => c.section_key === "quiz");
      const telegram = allContent.find(c => c.section_key === "telegram_partner");

      setHeroContent(hero?.content || {});
      setRealEstateArtContent(realEstate?.content || {});
      setExpertsHeader(experts?.content || {});
      setQuizContent(quiz?.content || {});
      setTelegramContent(telegram?.content || {});
    }
  }, [allContent]);

  const handleSave = async (sectionKey: string, content: Record<string, any>) => {
    try {
      await updateContent.mutateAsync({
        cityId: selectedCityId,
        sectionKey,
        content,
      });
      toast.success("Контент сохранен");
    } catch (error) {
      toast.error("Ошибка сохранения");
      console.error(error);
    }
  };

  const updateHeroCategory = (index: number, field: keyof HeroCategory, value: string) => {
    const categories = heroContent.categories || defaultHeroCategories;
    const updated = [...categories];
    updated[index] = { ...updated[index], [field]: value };
    setHeroContent({ ...heroContent, categories: updated });
  };

  const updateService = (index: number, field: keyof ServiceCard, value: string) => {
    const services = realEstateArtContent.services || defaultServices;
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setRealEstateArtContent({ ...realEstateArtContent, services: updated });
  };

  const updateQuizStep = (stepIndex: number, field: "question" | "options", value: string | string[]) => {
    const steps = quizContent.steps || defaultQuizSteps;
    const updated = [...steps];
    updated[stepIndex] = { ...updated[stepIndex], [field]: value };
    setQuizContent({ ...quizContent, steps: updated });
  };

  const addQuizOption = (stepIndex: number) => {
    const steps = quizContent.steps || defaultQuizSteps;
    const updated = [...steps];
    updated[stepIndex].options.push("Новый вариант");
    setQuizContent({ ...quizContent, steps: updated });
  };

  const removeQuizOption = (stepIndex: number, optionIndex: number) => {
    const steps = quizContent.steps || defaultQuizSteps;
    const updated = [...steps];
    updated[stepIndex].options = updated[stepIndex].options.filter((_, i) => i !== optionIndex);
    setQuizContent({ ...quizContent, steps: updated });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Главная страница</h1>
            <p className="text-muted-foreground">Редактирование контента главной страницы</p>
          </div>
          <Select
            value={selectedCityId || "all"}
            onValueChange={(value) => setSelectedCityId(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Выберите город" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все города (по умолчанию)</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city.id} value={city.id}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="hero" className="space-y-4">
          <TabsList className="grid grid-cols-5 w-full max-w-3xl">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="services">Услуги</TabsTrigger>
            <TabsTrigger value="experts">Эксперты</TabsTrigger>
            <TabsTrigger value="quiz">Квиз</TabsTrigger>
            <TabsTrigger value="telegram">Telegram</TabsTrigger>
          </TabsList>

          {/* Hero Section */}
          <TabsContent value="hero" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Hero секция</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div>
                    <Label>Главное изображение</Label>
                    <SingleImageUploader
                      value={heroContent.hero_image || ""}
                      onChange={(url) => setHeroContent({ ...heroContent, hero_image: url })}
                      bucket="complex-media"
                      folder="homepage"
                    />
                  </div>
                  <div>
                    <Label>URL видео-презентации</Label>
                    <Input
                      value={heroContent.video_url || ""}
                      onChange={(e) => setHeroContent({ ...heroContent, video_url: e.target.value })}
                      placeholder="/videos/company-presentation.mp4"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-lg font-semibold">Категории</Label>
                  <div className="grid gap-4 mt-4">
                    {(heroContent.categories || defaultHeroCategories).map((cat, index) => (
                      <Card key={index}>
                        <CardContent className="pt-4 grid md:grid-cols-4 gap-4">
                          <div>
                            <Label>Заголовок</Label>
                            <Input
                              value={cat.title}
                              onChange={(e) => updateHeroCategory(index, "title", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Подзаголовок</Label>
                            <Input
                              value={cat.subtitle}
                              onChange={(e) => updateHeroCategory(index, "subtitle", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Ссылка</Label>
                            <Input
                              value={cat.link}
                              onChange={(e) => updateHeroCategory(index, "link", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Изображение</Label>
                            <SingleImageUploader
                              value={cat.image}
                              onChange={(url) => updateHeroCategory(index, "image", url)}
                              bucket="complex-media"
                              folder="homepage/categories"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <Button onClick={() => handleSave("hero", heroContent)} disabled={updateContent.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  Сохранить
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Real Estate Art Section */}
          <TabsContent value="services" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Секция "Недвижимость как искусство"</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Заголовок секции</Label>
                  <Input
                    value={realEstateArtContent.title || "Недвижимость как искусство"}
                    onChange={(e) => setRealEstateArtContent({ ...realEstateArtContent, title: e.target.value })}
                  />
                </div>

                <div>
                  <Label className="text-lg font-semibold">Карточки услуг</Label>
                  <div className="grid gap-4 mt-4">
                    {(realEstateArtContent.services || defaultServices).map((service, index) => (
                      <Card key={service.id}>
                        <CardContent className="pt-4 grid md:grid-cols-3 gap-4">
                          <div>
                            <Label>Заголовок</Label>
                            <Input
                              value={service.title}
                              onChange={(e) => updateService(index, "title", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Описание</Label>
                            <Textarea
                              value={service.description}
                              onChange={(e) => updateService(index, "description", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Изображение</Label>
                            <SingleImageUploader
                              value={service.image}
                              onChange={(url) => updateService(index, "image", url)}
                              bucket="complex-media"
                              folder="homepage/services"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <Button onClick={() => handleSave("real_estate_art", realEstateArtContent)} disabled={updateContent.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  Сохранить
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Experts Section */}
          <TabsContent value="experts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Секция экспертов</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Заголовок</Label>
                  <Input
                    value={expertsHeader.title || "Команда экспертов"}
                    onChange={(e) => setExpertsHeader({ ...expertsHeader, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Подзаголовок</Label>
                  <Textarea
                    value={expertsHeader.subtitle || ""}
                    onChange={(e) => setExpertsHeader({ ...expertsHeader, subtitle: e.target.value })}
                    placeholder="Описание команды экспертов..."
                  />
                </div>
                <Button onClick={() => handleSave("experts_header", expertsHeader)} disabled={updateContent.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  Сохранить
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quiz Section */}
          <TabsContent value="quiz" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Квиз</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {(quizContent.steps || defaultQuizSteps).map((step, stepIndex) => (
                  <Card key={stepIndex}>
                    <CardContent className="pt-4 space-y-4">
                      <div>
                        <Label>Вопрос {stepIndex + 1}</Label>
                        <Input
                          value={step.question}
                          onChange={(e) => updateQuizStep(stepIndex, "question", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Варианты ответов</Label>
                        <div className="space-y-2 mt-2">
                          {step.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex gap-2">
                              <Input
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...step.options];
                                  newOptions[optionIndex] = e.target.value;
                                  updateQuizStep(stepIndex, "options", newOptions);
                                }}
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => removeQuizOption(stepIndex, optionIndex)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addQuizOption(stepIndex)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Добавить вариант
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button onClick={() => handleSave("quiz", quizContent)} disabled={updateContent.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  Сохранить
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Telegram Section */}
          <TabsContent value="telegram" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Telegram-канал (страница партнёров)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Ссылка на Telegram-канал</Label>
                  <Input
                    value={telegramContent.telegram_url || "https://t.me/artestate_channel"}
                    onChange={(e) => setTelegramContent({ ...telegramContent, telegram_url: e.target.value })}
                    placeholder="https://t.me/your_channel"
                  />
                  {telegramContent.telegram_url && (
                    <div className="mt-3">
                      <Label className="text-xs text-muted-foreground">Превью QR-кода</Label>
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(telegramContent.telegram_url || "https://t.me/artestate_channel")}&size=120x120`}
                        alt="QR Preview"
                        className="mt-1 w-24 h-24 rounded border"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <Label>Заголовок левой карточки</Label>
                  <Input
                    value={telegramContent.left_title || "Закрытый Telegram-канал для наших партнёров"}
                    onChange={(e) => setTelegramContent({ ...telegramContent, left_title: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Описание левой карточки</Label>
                  <Textarea
                    value={telegramContent.left_description || ""}
                    onChange={(e) => setTelegramContent({ ...telegramContent, left_description: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Заголовок правой карточки</Label>
                  <Input
                    value={telegramContent.right_title || "Наш Telegram-канал"}
                    onChange={(e) => setTelegramContent({ ...telegramContent, right_title: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Описание правой карточки</Label>
                  <Textarea
                    value={telegramContent.right_description || ""}
                    onChange={(e) => setTelegramContent({ ...telegramContent, right_description: e.target.value })}
                  />
                </div>
                <Button onClick={() => handleSave("telegram_partner", telegramContent)} disabled={updateContent.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  Сохранить
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
