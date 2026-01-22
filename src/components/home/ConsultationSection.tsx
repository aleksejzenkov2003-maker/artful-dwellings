import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useSubmitLead } from "@/hooks/useSubmitLead";
import { CheckCircle } from "lucide-react";
import { HexagonPattern } from "@/components/ui/HexagonPattern";

const formSchema = z.object({
  name: z.string().min(2, "Введите имя").max(100),
  phone: z.string().min(10, "Введите телефон").max(20),
});

type FormData = z.infer<typeof formSchema>;

export function ConsultationSection() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const mutation = useSubmitLead();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(
      {
        name: data.name,
        phone: data.phone,
        email: null,
        message: null,
        form_type: "consultation",
        form_source: "Главная страница - консультация",
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
      <section className="py-20 lg:py-28 bg-zinc-900 text-white relative">
        <div className="container-wide text-center">
          <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-serif mb-2">Заявка отправлена!</h3>
          <p className="text-white/60">Мы свяжемся с вами в ближайшее время</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 lg:py-28 bg-zinc-900 text-white relative">
      {/* Decorative Pattern - separate overflow container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20">
          <HexagonPattern className="w-full h-full text-primary" />
        </div>
      </div>

      <div className="container-wide relative z-10">
        <p className="text-xs text-white/40 uppercase tracking-[0.2em] mb-6">
          Консультация по объекту
        </p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-3xl">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif leading-relaxed mb-8">
            Здравствуйте, меня зовут{" "}
            <span className="inline-block border-b-2 border-primary">
              <input
                type="text"
                {...form.register("name")}
                placeholder="ваше имя"
                className="bg-transparent text-primary placeholder:text-primary/50 focus:outline-none w-32 md:w-40"
              />
            </span>
            ,<br />
            хочу получить бесплатную консультацию по объекту,<br />
            свяжитесь со мной по номеру телефона —{" "}
            <span className="inline-block border-b-2 border-primary">
              <input
                type="tel"
                {...form.register("phone")}
                placeholder="+7-987-654-32-10"
                className="bg-transparent text-primary placeholder:text-primary/50 focus:outline-none w-44 md:w-52"
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
            disabled={mutation.isPending}
            className="bg-white text-navy hover:bg-white/90 uppercase text-xs tracking-wider px-8"
          >
            {mutation.isPending ? "Отправка..." : "Отправить запрос"}
          </Button>
        </form>
      </div>
    </section>
  );
}
