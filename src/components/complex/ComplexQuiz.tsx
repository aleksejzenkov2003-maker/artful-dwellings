import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Check } from "lucide-react";
import { useSubmitLead } from "@/hooks/useSubmitLead";
import { HexagonPattern } from "@/components/ui/HexagonPattern";

interface QuizQuestion {
  id: string;
  question: string;
  subtitle?: string;
  options: QuizOption[];
  multiSelect?: boolean;
}

interface QuizOption {
  value: string;
  label: string;
  image?: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: "purpose",
    question: "С какой целью вы планируете приобрести квартиру?",
    options: [
      { value: "living", label: "ДЛЯ ПРОЖИВАНИЯ" },
      { value: "investment", label: "ДЛЯ ИНВЕСТИЦИЙ" },
      { value: "children", label: "ДЕТЯМ НА БУДУЩЕЕ" },
      { value: "other", label: "ДРУГОЕ" },
    ],
  },
  {
    id: "rooms",
    question: "Какое количество комнат вам необходимо?",
    options: [
      { value: "studio", label: "СТУДИЯ" },
      { value: "euro-2", label: "ЕВРО-ДВУХКОМНАТНАЯ" },
      { value: "euro-3", label: "ЕВРО-ТРЕХКОМНАТНАЯ" },
      { value: "2-room", label: "ДВУХКОМНАТНАЯ" },
      { value: "3-room", label: "ТРЕХКОМНАТНАЯ" },
      { value: "more", label: "БОЛЕЕ ТРЕХ КОМНАТ" },
    ],
  },
  {
    id: "payment",
    question: "Какая форма оплаты вам будет удобна?",
    options: [
      { value: "full", label: "ЕДИНОВРЕМЕННАЯ ОПЛАТА" },
      { value: "mortgage", label: "ИПОТЕКА" },
      { value: "installment", label: "РАССРОЧКА" },
      { value: "subsidy", label: "СУБСИДИИ" },
    ],
  },
  {
    id: "features",
    question: "Какие характеристики дома являются для вас приоритетными?",
    subtitle: "ХАРАКТЕРИСТИКИ ДОМА",
    multiSelect: true,
    options: [
      { value: "parking", label: "ПОДЗЕМНЫЙ ПАРКИНГ И КЛАДОВЫЕ" },
      { value: "materials", label: "СОВРЕМЕННЫЕ МАТЕРИАЛЫ И ИНЖЕНЕРИЯ" },
      { value: "fitness", label: "НАЛИЧИЕ БАССЕЙНА ИЛИ ФИТНЕСС-ЦЕНТРА" },
      { value: "concierge", label: "КРУГЛОСУТОЧНАЯ КОНСЬЕРЖ-СЛУЖБА" },
      { value: "infrastructure", label: "ИНФРАСТРУКТУРА ДОМА" },
    ],
  },
  {
    id: "finish",
    question: "Какой вариант отделки вы предпочитаете?",
    options: [
      { 
        value: "finished", 
        label: "ЧИСТОВАЯ",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop"
      },
      { 
        value: "pre-finished", 
        label: "ПОД ЧИСТОВУЮ",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop"
      },
      { 
        value: "shell", 
        label: "БЕЗ ОТДЕЛКИ",
        image: "https://images.unsplash.com/photo-1503594384566-461fe158e797?w=400&h=300&fit=crop"
      },
    ],
  },
  {
    id: "move-in",
    question: "Когда вы хотели бы переехать в новую квартиру?",
    options: [
      { value: "asap", label: "КАК МОЖНО БЫСТРЕЕ" },
      { value: "wait", label: "ГОТОВ ЖДАТЬ (2025—2026 ГГ.)" },
      { value: "undecided", label: "НЕ ОПРЕДЕЛИЛСЯ" },
    ],
  },
  {
    id: "timeline",
    question: "Когда вы планируете покупку?",
    options: [
      { value: "soon", label: "В БЛИЖАЙШЕЕ ВРЕМЯ" },
      { value: "6-8-months", label: "ЧЕРЕЗ 6—8 МЕСЯЦЕВ" },
      { value: "year", label: "НЕ РАНЬШЕ ЧЕМ ЧЕРЕЗ ГОД" },
      { value: "if-like", label: "СРАЗУ, ЕСЛИ КВАРТИРА ОЧЕНЬ ПОНРАВИТСЯ" },
    ],
  },
];

interface ComplexQuizProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  complexName?: string;
}

export function ComplexQuiz({ open, onOpenChange, complexName }: ComplexQuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [agreed, setAgreed] = useState(true);
  const submitLead = useSubmitLead();

  const totalSteps = quizQuestions.length;
  const isContactStep = currentStep === totalSteps;
  const currentQuestion = quizQuestions[currentStep];

  const handleOptionSelect = (value: string) => {
    if (currentQuestion.multiSelect) {
      const currentValues = (answers[currentQuestion.id] as string[]) || [];
      if (currentValues.includes(value)) {
        setAnswers({
          ...answers,
          [currentQuestion.id]: currentValues.filter((v) => v !== value),
        });
      } else {
        setAnswers({
          ...answers,
          [currentQuestion.id]: [...currentValues, value],
        });
      }
    } else {
      setAnswers({ ...answers, [currentQuestion.id]: value });
    }
  };

  const isOptionSelected = (value: string) => {
    if (!currentQuestion) return false;
    const answer = answers[currentQuestion.id];
    if (Array.isArray(answer)) {
      return answer.includes(value);
    }
    return answer === value;
  };

  const canProceed = () => {
    if (!currentQuestion) return true;
    const answer = answers[currentQuestion.id];
    if (Array.isArray(answer)) {
      return answer.length > 0;
    }
    return !!answer;
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 0) {
      if (value[0] === "7" || value[0] === "8") {
        value = value.substring(1);
      }
      let formatted = "+7";
      if (value.length > 0) formatted += " (" + value.substring(0, 3);
      if (value.length > 3) formatted += ") " + value.substring(3, 6);
      if (value.length > 6) formatted += "-" + value.substring(6, 8);
      if (value.length > 8) formatted += "-" + value.substring(8, 10);
      value = formatted;
    }
    setPhone(value);
  };

  const handleSubmit = () => {
    if (phone && name && agreed) {
      submitLead.mutate({
        name,
        phone,
        form_type: "complex_quiz",
        form_source: complexName || window.location.pathname,
        quiz_answers: answers,
      });
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setPhone("");
    setName("");
    setAgreed(true);
    onOpenChange(false);
  };

  if (submitLead.isSuccess) {
    return (
      <Dialog open={open} onOpenChange={resetQuiz}>
        <DialogContent className="max-w-2xl p-0 border-0 overflow-hidden">
          <div className="bg-primary text-white p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <Check className="h-10 w-10 text-white" />
            </div>
            <h3 className="font-serif text-3xl md:text-4xl mb-4">Спасибо за заявку!</h3>
            <p className="text-white/80 text-lg">
              Наш менеджер свяжется с вами в ближайшее время
            </p>
            <Button
              onClick={resetQuiz}
              variant="outline"
              className="mt-8 bg-transparent border-white text-white hover:bg-white/10"
            >
              Закрыть
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 border-0 overflow-hidden bg-primary">
        <div className="relative min-h-[600px] flex flex-col">
          {/* Hexagon pattern */}
          <HexagonPattern className="top-0 right-0 w-48 h-48 text-white/10" />

          {/* Header */}
          <div className="text-center pt-10 pb-6 px-8">
            <p className="text-white/70 text-[13px] uppercase tracking-[0.15em] mb-4">
              Какая квартира в новостройке подходит именно вам?
            </p>
          </div>

          {/* Content */}
          <div className="flex-1 px-8 pb-8">
            {!isContactStep ? (
              <>
                {/* Question */}
                <h2 className="font-serif text-white text-center text-[28px] md:text-[36px] lg:text-[42px] leading-[1.2] mb-4">
                  {currentQuestion.question}
                </h2>

                {currentQuestion.subtitle && (
                  <p className="text-white/60 text-center text-[13px] uppercase tracking-[0.1em] mb-8">
                    {currentQuestion.subtitle}
                  </p>
                )}

                {/* Options */}
                {currentQuestion.options[0].image ? (
                  // Image options grid
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-4xl mx-auto">
                    {currentQuestion.options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleOptionSelect(option.value)}
                        className={`relative group overflow-hidden rounded-lg transition-all ${
                          isOptionSelected(option.value) 
                            ? "ring-4 ring-white" 
                            : ""
                        }`}
                      >
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={option.image}
                            alt={option.label}
                            className={`w-full h-full object-cover transition-all duration-300 ${
                              isOptionSelected(option.value)
                                ? "brightness-50"
                                : "group-hover:brightness-75"
                            }`}
                          />
                        </div>
                        {isOptionSelected(option.value) && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center">
                              <Check className="h-8 w-8 text-primary" />
                            </div>
                          </div>
                        )}
                        <div className={`absolute bottom-0 left-0 right-0 py-4 px-4 text-center transition-colors ${
                          isOptionSelected(option.value)
                            ? "bg-foreground text-white"
                            : "bg-white text-foreground"
                        }`}>
                          <span className="font-medium text-[13px] tracking-wide">
                            {option.label}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  // Text options
                  <div className="flex flex-wrap justify-center gap-3 mt-8 max-w-4xl mx-auto">
                    {currentQuestion.options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleOptionSelect(option.value)}
                        className={`px-6 py-4 rounded-lg text-[13px] font-medium tracking-wide transition-all ${
                          isOptionSelected(option.value)
                            ? "bg-foreground text-white"
                            : "bg-white text-foreground hover:bg-white/90"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              // Contact form
              <div className="max-w-lg mx-auto text-center">
                <h2 className="font-serif text-white text-[32px] md:text-[42px] leading-[1.2] mb-6">
                  Отлично! Остался последний шаг!
                </h2>
                <p className="text-white/80 text-[14px] uppercase tracking-[0.1em] mb-10">
                  Укажите ваш номер телефона, и мы сообщим вам результат теста.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <Input
                    type="tel"
                    placeholder="ВАШ ТЕЛЕФОН"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="bg-transparent border-0 border-b border-white/40 rounded-none text-white placeholder:text-white/50 h-14 text-[14px] tracking-wide focus-visible:ring-0 focus-visible:border-white"
                  />
                  <Input
                    type="text"
                    placeholder="ВАШЕ ИМЯ"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-transparent border-0 border-b border-white/40 rounded-none text-white placeholder:text-white/50 h-14 text-[14px] tracking-wide focus-visible:ring-0 focus-visible:border-white"
                  />
                </div>

                <div className="flex items-start gap-3 text-left mb-8">
                  <Checkbox
                    id="agree"
                    checked={agreed}
                    onCheckedChange={(checked) => setAgreed(checked as boolean)}
                    className="mt-1 border-white/50 data-[state=checked]:bg-white data-[state=checked]:text-primary"
                  />
                  <label htmlFor="agree" className="text-white/80 text-[13px] leading-relaxed">
                    Я согласен на обработку{" "}
                    <span className="underline cursor-pointer">персональных данных</span>,
                    (В соответствии с требованиями ст. 9 Федерального закона от 27.07.2006 г.
                    № 152-ФЗ «О защите персональных данных».)
                  </label>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={!phone || !name || !agreed || submitLead.isPending}
                  className="bg-white text-foreground hover:bg-white/90 px-10 py-6 text-[13px] uppercase tracking-wider"
                >
                  {submitLead.isPending ? "Отправка..." : "Отправить запрос"}
                </Button>
              </div>
            )}
          </div>

          {/* Footer navigation */}
          <div className="border-t border-white/20 px-8 py-6">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              {/* Back link */}
              <div className="w-1/3">
                {currentStep > 0 && (
                  <button
                    onClick={handleBack}
                    className="text-white/80 text-[13px] underline hover:text-white transition-colors"
                  >
                    Вернуться к предыдущему вопросу
                  </button>
                )}
              </div>

              {/* Step counter - hide on contact step */}
              <div className="w-1/3 text-center">
                {!isContactStep && (
                  <>
                    <span className="font-serif text-white text-[48px] md:text-[64px] leading-none">
                      {currentStep + 1}
                    </span>
                    <span className="font-serif text-white/60 text-[32px] md:text-[48px] leading-none mx-2">
                      из
                    </span>
                    <span className="font-serif text-white/60 text-[48px] md:text-[64px] leading-none">
                      {totalSteps}
                    </span>
                  </>
                )}
              </div>

              {/* Next button */}
              <div className="w-1/3 flex justify-end">
                {!isContactStep && (
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    variant="outline"
                    className="bg-white/10 border-white/40 text-white hover:bg-white/20 px-8 py-6 text-[13px] uppercase tracking-wider disabled:opacity-50"
                  >
                    Следующий вопрос
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
