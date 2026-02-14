import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useSubmitLead } from "@/hooks/useSubmitLead";
import { User, Phone } from "lucide-react";
import consultationBg from "@/assets/consultation-bg.png";
import consultationHouse from "@/assets/consultation-house.png";

const formSchema = z.object({
  name: z.string().min(2, "Введите имя"),
  phone: z.string().min(10, "Введите корректный номер телефона"),
});

type FormData = z.infer<typeof formSchema>;

export function AboutConsultationForm() {
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
      form_source: "about_page",
    });
  };

  return (
    <section className="py-16 lg:py-24">
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
            <div className="p-8 lg:p-12 xl:p-16 text-white relative z-10">
              <h2 className="text-3xl lg:text-4xl font-serif mb-2">
                Получите консультацию
              </h2>
              <p className="text-white/70 mb-8">
                И наши специалисты ответят<br />на все ваши вопросы
              </p>

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
                  {mutation.isPending ? "Отправка..." : "ОСТАВИТЬ ЗАЯВКУ"}
                </Button>
              </form>
            </div>

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
