import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useSubmitLead } from "@/hooks/useSubmitLead";
import { User, Phone, CheckCircle } from "lucide-react";
import consultationBg from "@/assets/consultation-bg.png";
import consultationHouse from "@/assets/consultation-house.png";

const formSchema = z.object({
  name: z.string().min(2, "Введите имя").max(100),
  phone: z.string().min(10, "Введите корректный номер телефона").max(20),
});

type FormData = z.infer<typeof formSchema>;

interface UnifiedConsultationFormProps {
  title?: string;
  subtitle?: string;
  formSource?: string;
  formType?: string;
  variant?: "full" | "compact";
  buttonText?: string;
  className?: string;
}

export function UnifiedConsultationForm({
  title = "Получите консультацию",
  subtitle = "И наши специалисты ответят\nна все ваши вопросы",
  formSource = "consultation",
  formType = "consultation",
  variant = "full",
  buttonText = "ОСТАВИТЬ ЗАЯВКУ",
  className = "",
}: UnifiedConsultationFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", phone: "" },
  });

  const mutation = useSubmitLead();

  const onSubmit = (data: FormData) => {
    mutation.mutate(
      {
        name: data.name,
        phone: data.phone,
        form_type: formType,
        form_source: formSource,
      },
      {
        onSuccess: () => {
          setIsSubmitted(true);
          form.reset();
        },
      }
    );
  };

  if (isSubmitted) {
    return (
      <section className={`py-16 lg:py-24 ${className}`}>
        <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
          <div
            className="relative"
            style={{
              backgroundImage: `url(${consultationBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="p-8 lg:p-12 xl:p-16 text-white text-center">
              <CheckCircle className="h-16 w-16 text-white mx-auto mb-4" />
              <h3 className="text-2xl font-serif mb-2">Заявка отправлена!</h3>
              <p className="text-white/70">Мы свяжемся с вами в ближайшее время</p>
              <Button
                variant="outline"
                className="mt-4 border-white/30 text-white hover:bg-white/10"
                onClick={() => setIsSubmitted(false)}
              >
                Отправить ещё
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === "compact") {
    return (
      <div
        className={`relative ${className}`}
        style={{
          backgroundImage: `url(${consultationBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="p-6 lg:p-8 text-white">
          <h3 className="text-2xl lg:text-3xl font-serif mb-2">{title}</h3>
          <p className="text-white/70 mb-6 whitespace-pre-line">{subtitle}</p>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                {...form.register("name")}
                placeholder="Ваше имя"
                className="w-full bg-white pl-12 pr-4 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="tel"
                {...form.register("phone")}
                placeholder="+7 (XXX) XXX XX XX"
                className="w-full bg-white pl-12 pr-4 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {(form.formState.errors.name || form.formState.errors.phone) && (
              <p className="text-red-300 text-sm">
                {form.formState.errors.name?.message || form.formState.errors.phone?.message}
              </p>
            )}

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-foreground text-white hover:bg-foreground/90 uppercase text-sm tracking-wider px-10 py-6 rounded-none"
            >
              {mutation.isPending ? "Отправка..." : buttonText}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <section className={`py-16 lg:py-24 ${className}`}>
      <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
        <div className="relative">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${consultationBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 relative">
            {/* Left - Form */}
            <div className="p-8 lg:p-12 xl:p-16 text-white relative z-10">
              <h2 className="text-3xl lg:text-4xl font-serif mb-2">{title}</h2>
              <p className="text-white/70 mb-8 whitespace-pre-line">{subtitle}</p>

              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    {...form.register("name")}
                    placeholder="Ваше имя"
                    className="w-full bg-white pl-12 pr-4 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="tel"
                    {...form.register("phone")}
                    placeholder="+7 (XXX) XXX XX XX"
                    className="w-full bg-white pl-12 pr-4 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {(form.formState.errors.name || form.formState.errors.phone) && (
                  <p className="text-red-300 text-sm">
                    {form.formState.errors.name?.message || form.formState.errors.phone?.message}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full bg-foreground text-white hover:bg-foreground/90 uppercase text-sm tracking-wider px-10 py-6 rounded-none"
                >
                  {mutation.isPending ? "Отправка..." : buttonText}
                </Button>
              </form>
            </div>

            {/* Right - Building image */}
            <div className="hidden lg:flex relative items-end justify-center">
              <img
                src={consultationHouse}
                alt="Жилой комплекс"
                className="relative z-10 object-contain object-bottom -mt-24"
                style={{ height: "calc(100% + 6rem)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
