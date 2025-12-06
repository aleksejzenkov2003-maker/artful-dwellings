import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useSubmitLead } from "@/hooks/useSubmitLead";
import { CheckCircle } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Введите имя").max(100),
  phone: z.string().min(10, "Введите телефон").max(20),
  consent: z.boolean().refine((val) => val === true, "Необходимо согласие"),
});

type FormData = z.infer<typeof formSchema>;

export function ConsultationForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const mutation = useSubmitLead();
  const nameRef = useRef<HTMLSpanElement>(null);
  const phoneRef = useRef<HTMLSpanElement>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      consent: false,
    },
  });

  const nameValue = form.watch("name");
  const phoneValue = form.watch("phone");

  const onSubmit = (data: FormData) => {
    mutation.mutate(
      {
        name: data.name,
        phone: data.phone,
        email: null,
        message: null,
        form_type: "consultation",
        form_source: "Главная страница",
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
      <div className="text-center py-8">
        <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
        <h3 className="text-2xl font-serif mb-2">Заявка отправлена!</h3>
        <p className="text-white/60">
          Мы свяжемся с вами в ближайшее время
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <p className="text-xs text-white/50 uppercase tracking-[0.2em] mb-4">
        Свободная консультация
      </p>

      <div className="max-w-2xl">
        <h2 className="text-2xl md:text-3xl font-serif mb-8 leading-relaxed">
          Здравствуйте, меня зовут{" "}
          <span className="relative inline-block">
            <input
              type="text"
              {...form.register("name")}
              placeholder="ваше имя"
              className="bg-transparent border-b border-primary text-primary placeholder:text-primary/50 focus:outline-none w-32 md:w-40"
            />
          </span>
          ,<br />
          хочу получить консультацию по теме<br />
          в премиальной недвижимости, свяжитесь со мной<br />
          по номеру телефона —{" "}
          <span className="relative inline-block">
            <input
              type="tel"
              {...form.register("phone")}
              placeholder="+7-987-654-32-10"
              className="bg-transparent border-b border-primary text-primary placeholder:text-primary/50 focus:outline-none w-40 md:w-48"
            />
          </span>
        </h2>

        {(form.formState.errors.name || form.formState.errors.phone) && (
          <p className="text-red-400 text-sm mb-4">
            {form.formState.errors.name?.message || form.formState.errors.phone?.message}
          </p>
        )}

        <div className="flex items-start gap-2 mb-6">
          <input
            type="checkbox"
            id="consent"
            {...form.register("consent")}
            className="w-4 h-4 mt-0.5 accent-primary"
          />
          <label htmlFor="consent" className="text-xs text-white/60 leading-relaxed">
            Я согласен на обработку персональных данных.<br />
            <span className="underline">
              (В соответствии с требованиями ст. 9 Федерального закона от 27.07.2006 г. № 152-ФЗ «О защите персональных данных»)
            </span>
          </label>
        </div>

        {form.formState.errors.consent && (
          <p className="text-red-400 text-sm mb-4">
            {form.formState.errors.consent.message}
          </p>
        )}

        <Button
          type="submit"
          variant="outline"
          disabled={mutation.isPending}
          className="border-white/30 text-white hover:bg-white/10 uppercase text-xs tracking-wider"
        >
          {mutation.isPending ? "Отправка..." : "Отправить заявку"}
        </Button>
      </div>
    </form>
  );
}
