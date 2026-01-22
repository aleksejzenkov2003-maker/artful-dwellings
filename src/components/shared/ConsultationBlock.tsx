import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useSubmitLead } from "@/hooks/useSubmitLead";
import { HexagonPattern } from "@/components/ui/HexagonPattern";

const formSchema = z.object({
  name: z.string().min(2, "Введите имя"),
  phone: z.string().min(10, "Введите корректный номер телефона"),
});

type FormData = z.infer<typeof formSchema>;

interface ConsultationBlockProps {
  title?: string;
  subtitle?: string;
  topic?: string;
  variant?: "dark" | "primary";
  formSource?: string;
}

export function ConsultationBlock({
  title = "Консультация",
  subtitle = "по объекту",
  topic = "получить бесплатную консультацию по объекту",
  variant = "dark",
  formSource = "consultation_block",
}: ConsultationBlockProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", phone: "" },
  });

  const mutation = useSubmitLead();

  const onSubmit = (data: FormData) => {
    mutation.mutate({
      name: data.name,
      phone: data.phone,
      form_type: "consultation",
      form_source: formSource,
    });
  };

  const bgClass = variant === "primary" 
    ? "bg-primary text-primary-foreground" 
    : "bg-zinc-900 text-white";

  const inputBorderClass = variant === "primary"
    ? "border-primary-foreground/50"
    : "border-primary";

  const inputTextClass = variant === "primary"
    ? "text-primary-foreground placeholder:text-primary-foreground/50"
    : "text-primary placeholder:text-primary/50";

  const buttonClass = variant === "primary"
    ? "border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
    : "border-white/30 text-white hover:bg-white/10";

  return (
    <section className={`py-16 lg:py-24 relative ${bgClass}`}>
      {/* Decorative Pattern - separate overflow container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10">
          <HexagonPattern className="w-full h-full text-current" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.15em] mb-1 opacity-70">{title}</p>
          <p className="text-xs uppercase tracking-[0.15em] mb-8 opacity-70">{subtitle}</p>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif leading-relaxed mb-8">
              Здравствуйте, меня зовут{" "}
              <span className={`inline-block border-b-2 ${inputBorderClass}`}>
                <input
                  type="text"
                  {...form.register("name")}
                  placeholder="ваше имя"
                  className={`bg-transparent focus:outline-none w-24 sm:w-32 md:w-40 ${inputTextClass}`}
                />
              </span>
              ,
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              хочу {topic},
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              свяжитесь со мной по номеру телефона —
              <br className="hidden md:block" />
              <span className="md:hidden"> </span>
              <span className={`inline-block border-b-2 ${inputBorderClass}`}>
                <input
                  type="tel"
                  {...form.register("phone")}
                  placeholder="+7-987-654-32-10"
                  className={`bg-transparent focus:outline-none w-36 sm:w-44 md:w-52 ${inputTextClass}`}
                />
              </span>
            </h2>

            {(form.formState.errors.name || form.formState.errors.phone) && (
              <p className="text-red-400 text-sm mb-4">
                {form.formState.errors.name?.message || form.formState.errors.phone?.message}
              </p>
            )}

            <Button
              type="submit"
              variant="outline"
              disabled={mutation.isPending}
              className={`uppercase text-xs tracking-wider px-8 ${buttonClass}`}
            >
              {mutation.isPending ? "Отправка..." : "Отправить запрос"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
