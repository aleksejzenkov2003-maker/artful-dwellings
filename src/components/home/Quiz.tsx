import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Check } from "lucide-react";
import { useSubmitLead } from "@/hooks/useSubmitLead";

interface QuizStep {
  question: string;
  options: string[];
}

const quizSteps: QuizStep[] = [
  {
    question: "Какой тип недвижимости вас интересует?",
    options: ["Новостройка", "Вторичная недвижимость", "Переуступка", "Эксклюзив"],
  },
  {
    question: "Сколько комнат вам нужно?",
    options: ["Студия", "1 комната", "2 комнаты", "3 комнаты", "4+ комнаты"],
  },
  {
    question: "Какой бюджет вы рассматриваете?",
    options: ["До 5 млн", "5-10 млн", "10-20 млн", "20-50 млн", "Свыше 50 млн"],
  },
  {
    question: "Какой район предпочитаете?",
    options: ["Центральный", "Петроградский", "Василеостровский", "Московский", "Другой"],
  },
  {
    question: "Когда планируете покупку?",
    options: ["В ближайший месяц", "В течение 3 месяцев", "В течение полугода", "Просто присматриваюсь"],
  },
];

export function Quiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const submitLead = useSubmitLead();

  const isLastStep = currentStep === quizSteps.length;
  const progress = ((currentStep) / (quizSteps.length + 1)) * 100;

  const handleOptionSelect = (option: string) => {
    setAnswers({ ...answers, [currentStep]: option });
    if (currentStep < quizSteps.length) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    }
  };

  const handleSubmit = () => {
    if (phone && name) {
      submitLead.mutate({
        name,
        phone,
        form_type: "quiz",
        form_source: window.location.pathname,
        quiz_answers: answers,
      });
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

  if (submitLead.isSuccess) {
    return (
      <div className="bg-navy text-white p-8 lg:p-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl font-serif mb-4">Спасибо за заявку!</h3>
          <p className="text-white/70">
            Наш менеджер свяжется с вами в ближайшее время
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-navy text-white p-8 lg:p-12 relative overflow-hidden">
      {/* Geometric pattern */}
      <div className="absolute right-0 top-0 w-64 h-64 opacity-10">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path
            d="M100 10L180 55V145L100 190L20 145V55L100 10Z"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
            className="text-primary"
          />
          <path
            d="M100 40L150 70V130L100 160L50 130V70L100 40Z"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
            className="text-primary"
          />
        </svg>
      </div>

      <div className="relative z-10">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-white/60 mb-2">
            <span>Шаг {currentStep + 1} из {quizSteps.length + 1}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question or Contact form */}
        {!isLastStep ? (
          <div>
            <h3 className="text-xl lg:text-2xl font-serif mb-6">
              {quizSteps[currentStep].question}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quizSteps[currentStep].options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleOptionSelect(option)}
                  className={`p-4 text-left border transition-all duration-200 hover:border-primary hover:bg-primary/10 ${
                    answers[currentStep] === option
                      ? "border-primary bg-primary/10"
                      : "border-white/20"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-xl lg:text-2xl font-serif mb-2">
              Отлично! Осталось оставить контакты
            </h3>
            <p className="text-white/60 mb-6">
              Мы подберём для вас лучшие варианты
            </p>
            <div className="space-y-4 max-w-md">
              <Input
                type="text"
                placeholder="Ваше имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent border-white/20 text-white placeholder:text-white/40 h-12"
              />
              <Input
                type="tel"
                placeholder="+7 (___) ___-__-__"
                value={phone}
                onChange={handlePhoneChange}
                className="bg-transparent border-white/20 text-white placeholder:text-white/40 h-12"
              />
              <Button
                onClick={handleSubmit}
                disabled={!phone || !name || submitLead.isPending}
                className="w-full bg-primary hover:bg-primary/90 text-white h-12"
              >
                {submitLead.isPending ? "Отправка..." : "Получить подборку"}
              </Button>
              <p className="text-xs text-white/40">
                Нажимая кнопку, вы соглашаетесь с политикой обработки персональных данных
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        {currentStep > 0 && !isLastStep && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="mt-6 flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Назад
          </button>
        )}
      </div>
    </div>
  );
}
