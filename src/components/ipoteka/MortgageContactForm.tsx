import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSubmitLead } from "@/hooks/useSubmitLead";
import { CheckCircle, Phone, MessageCircle } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Введите ваше имя").max(100),
  phone: z.string().min(10, "Введите корректный номер телефона").max(20),
  message: z.string().max(1000).optional(),
});

type FormData = z.infer<typeof formSchema>;

export function MortgageContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const mutation = useSubmitLead();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(
      {
        name: data.name,
        phone: data.phone,
        message: data.message || null,
        email: null,
        form_type: "mortgage",
        form_source: "Страница ипотеки",
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
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-serif font-semibold mb-2">
          Заявка отправлена!
        </h3>
        <p className="text-muted-foreground">
          Наш специалист свяжется с вами в ближайшее время для консультации
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-2xl font-serif font-semibold mb-4">
            Получите бесплатную консультацию
          </h3>
          <p className="text-muted-foreground mb-6">
            Оставьте заявку, и наш ипотечный специалист поможет подобрать лучшие условия кредитования именно для вас
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <span>Анализ вашей ситуации</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <span>Подбор оптимальной программы</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <span>Помощь со сбором документов</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">
              Или свяжитесь с нами напрямую:
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="tel:+78123097474"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <Phone className="h-4 w-4" />
                +7 (812) 309-74-74
              </a>
              <a
                href="https://wa.me/78123097474"
                className="flex items-center gap-2 text-green-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ваше имя</FormLabel>
                    <FormControl>
                      <Input placeholder="Иван Иванов" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Телефон</FormLabel>
                    <FormControl>
                      <Input placeholder="+7 (999) 123-45-67" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Комментарий (опционально)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Укажите желаемую сумму кредита, срок или другие пожелания..."
                        className="resize-none"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Отправка..." : "Получить консультацию"}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Нажимая кнопку, вы соглашаетесь с политикой обработки персональных данных
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
